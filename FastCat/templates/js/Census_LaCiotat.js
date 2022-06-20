/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

///////////////////SAM mikroi pinakes//////////////////////////////////////////


function createSubTable(parentTableName, subTableName, x, y, row, startCol, endCol) {
    $(".sub_table").remove();
    var clickFunction = createClickFunction(parentTableName, subTableName, row, startCol, endCol);
    var cnt = startCol + "-" + endCol;
    var tableId = subTableName + "***" + cnt;
    var html = createSubTableHtml(clickFunction, cnt, clickFunction, tableId, x, y);

    var data = [];
    if ($('#heading' + cnt).size() === 0) {

        $('#headingOne').parent().append(html);
        var nestedHeaders;
        if (subTableName === "authors") {
            var cols = [
                {data: 'name', type: 'text'},
                {data: 'surname', type: 'text'},
                {data: 'role_in_project', type: 'dropdown', source: project_role_vocab}
            ];
            nestedHeaders = [
                ['Name', 'Surname', 'Role']
            ];
            data = setSubTableData(catalogue_info, row, startCol, endCol);

        }
        else if (subTableName.indexOf("professions") > -1) {
            var cnt = parentTableName.replace("transactions", "");
            var cols = [
                {data: 'person_profession_rank', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_capacity_role_fr")), vocab: 'status_capacity_role_fr'}
            ];
            nestedHeaders = [['Profession']];
            data = setSubTableData(list_of_occupants[cnt], row, startCol, endCol);

        }
        subTable = createSubTableInstance(tableId, data, cols, nestedHeaders);
    }
    subTable = createSubTableRightMenu(subTable, subTableName, cols);
}
;



//////////////////////////////   1st TABLE     ////////////////////////////////
///////////////////// FASTCAT RECORD INFORMATION TABLE/////////////////////////

// Moved to Tables.js

//////////////////////////////   2nd TABLE     ////////////////////////////////
////////////////////////SOURCE  IDENTITY///////////////////////////////       
var tablesWithoutCommentCols = new Map();

var tableId = "source_identity";
tablesAndHeaders.set(tableId, ['Name', 'Location', 'Series', 'Original Title', 'Date', 'Name', 'Location', 'Note', 'Comment']);
tablesWithoutCommentCols.set(tableId, [0, 1, 2, 7]); //define fieds that do not have external content



var source_identity_cols = [
    {data: 'archive_library', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("archive_or_library_fr")), vocab: 'archive_or_library_fr'},
    {data: 'source_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'},
    {data: 'source_serie', type: 'text'},
    {data: 'book_title', type: 'text'},
    {data: 'book_date', type: 'text'},
    {data: 'issuing_authority', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("local_authority_fr")), vocab: 'local_authority_fr'},
    {data: 'issuing_authority_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}
];

var source_locs = new Object();

var source_container = document.getElementById(tableId);
var source_identity_data = new Handsontable(source_container, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: sourcedata,
    columns: source_identity_cols,
    manualColumnResize: true,
    currentRowClassName: 'currentRow',
    maxRows: 1,
    className: "htCenter htMiddle",
    autoWrapRow: true,
    contextMenu: false,
    colHeaders: tablesAndHeaders.get(tableId),
    nestedHeaders: [
        [{label: 'Archive', colspan: 2}, '', {label: 'Book', colspan: 2}, {label: 'Issuing authority', colspan: 2}, ''],
        tablesAndHeaders.get(tableId)
    ],
    cells: function(row, col, prop) {
        if (this.vocab) {            
            handle_vocabulary(this.instance.getDataAtCell(row, col), this.vocab, this);
        }
    },
    /* Next 3 properties added to support comments*/
    comments: true,
    hiddenColumns: {
        columns: [tablesAndHeaders.get(tableId).length - 1] //last column only
    },
    afterLoadData: function() {
        addCommentForContentFoundOutsideTheSource(this);
    },
    afterRenderer: function(td, row, col, prop, value) {
        if ((source_identity_cols[col].vocab === 'location_fr') && (value)) {
            handle_locations(value,'source_identity',row,col,'LOCS',source_locs);                     
        } else if ((source_identity_cols[col].vocab === 'local_authority_fr') && value) {
            handle_organizations(value,'source_identity',row, col, 'ORGS');
        }else if ((source_identity_cols[col].vocab === 'archive_or_library_fr')&& value  ) {
            handle_organizations(value,'source_identity',row+'_', col, 'ORGS');
        }
    }
});


source_identity_data.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(source_identity_cols[col].vocab);
            }
            else if (key === 'view_add') {
                var col = options.start.col;
                var row = options.start.row;
                var tableId = this.rootElement.getAttribute("id");
                var value = source_identity_data.getDataAtCell(options.start.row, options.start.col);
                var label = source_identity_cols[col].vocab;
                create_location_modal(tableId, value, row, col, label);
            }
        },
        items: {
            "hsep1": "---------",
            "undo": {},
            "redo": {},
            "hsep2": "---------",
            "copy": {},
            "cut": {},
            "hsep3": "---------",
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function() {
                    var col = source_identity_data.getSelectedRange().to.col;
                    var label = source_identity_cols[col].vocab;
                    if (label) {
                        update_Vocs();
                        return source_identity_data.getSelectedRange().to.col !== col;
                    } else {
                        return source_identity_data.getSelectedRange().to.col !== -1;
                    }
                }},
            "hsep4": "---------",
            "view_add": {
                name: "View/Add Location Identity info",
                hidden: function() {
                    var col = source_identity_data.getSelectedRange().to.col;
                    var label = source_identity_cols[col].vocab;

                    if ((typeof label !== "undefined") && (label.indexOf("location_") !== -1)) {
                        return false;
                    } else {
                        return true;
                    }
                }},
            "comment": {
                name: "Mark external content",
                hidden: function() {
                    var tableId = this.rootElement.getAttribute("id");
                    var col = this.getSelectedRange().to.col;
                    if (tablesWithoutCommentCols.get(tableId).includes(col)) {
                        return true;
                    }
                },
                callback: function() {
                    comment(this);
                }
            },
            "deleteComment": {
                name: "Undo Mark external content",
                hidden: function() {
                    var tableId = this.rootElement.getAttribute("id");
                    var row = this.getSelectedRange().to.row;
                    var col = this.getSelectedRange().to.col;
                    if (typeof this.getCellMeta(row, col).comment === "undefined") {
                        return true;
                    }
                    if (tablesWithoutCommentCols.get(tableId).includes(col)) {
                        return true;
                    }
                },
                callback: function() {
                    uncomment(this);
                }
            }
        }
    }
});

//////////////////////////////   3rd TABLE     ////////////////////////////////
/////////////////////////////OVERALL STATISTICS/////////////////////////////////////////////             
var tableId = "overall_statistics";
tablesAndHeaders.set(tableId, ['Number of Houses', 'Number of Households', 'Number of Individuals', 'Comment']);
tablesWithoutCommentCols.set(tableId, []); //define fieds that do not have external content
var sourcedata = [
    {ship_name: ''}
];

var cols3 = [
    {data: 'number_of_houses', type: 'text'},
    {data: 'number_of_households', type: 'text'},
    {data: 'number_of_individuals', type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];

var headers = [
    tablesAndHeaders.get(tableId)
];


var overall_statistics_hot = new Handsontable(overall_statistics, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: sourcedata,
    columns: cols3,
    manualColumnResize: true,
    className: "htCenter",
    currentRowClassName: 'currentRow',
    autoWrapRow: true,
    maxRows: 1,
    contextMenu: true,
    colHeaders: tablesAndHeaders.get(tableId),
    nestedHeaders: headers,
    cells: function(row, col, prop) {
        if (this.vocab) {
            handle_vocabulary(this.instance.getDataAtCell(row, col), this.vocab, this);
        }
    },
    /* Next 3 properties added to support comments*/
    comments: true,
    hiddenColumns: {
        columns: [tablesAndHeaders.get(tableId).length - 1] //last column only
    },
    afterLoadData: function() {
        addCommentForContentFoundOutsideTheSource(this);
    }
});

overall_statistics_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                var row = options.start.row;
                create_voc_modal(cols3[col].vocab, col, row);
            }
        },
        items: {
            "hsep1": "---------",
            "undo": {},
            "redo": {},
            "hsep2": "---------",
            "copy": {},
            "cut": {},
            "hsep3": "---------",
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function() {
                    var col = overall_statistics_hot.getSelectedRange().to.col;
                    var label = cols3[col].vocab;
                    if (label) {
                        update_Vocs();
                        return overall_statistics_hot.getSelectedRange().to.col !== col;
                    } else {
                        return overall_statistics_hot.getSelectedRange().to.col !== -1;
                    }
                }},
            "hsep4": "---------",
            "comment": {
                name: "Mark external content",
                hidden: function() {
                    var tableId = this.rootElement.getAttribute("id");
                    var col = this.getSelectedRange().to.col;
                    if (tablesWithoutCommentCols.get(tableId).includes(col)) {
                        return true;
                    }
                },
                callback: function() {
                    comment(this);
                }
            },
            "deleteComment": {
                name: "Undo Mark external content",
                hidden: function() {
                    var tableId = this.rootElement.getAttribute("id");
                    var row = this.getSelectedRange().to.row;
                    var col = this.getSelectedRange().to.col;
                    if (typeof this.getCellMeta(row, col).comment === "undefined") {
                        return true;
                    }
                    if (tablesWithoutCommentCols.get(tableId).includes(col)) {
                        return true;
                    }
                },
                callback: function() {
                    uncomment(this);
                }
            }
        }
    }
});

//////////////////////////////   4th TABLE     ////////////////////////////////
/////////////////////////Residencies Registry/////////////////////////////////////////                       

var tableId = "regidencies_regisrty";

tablesAndHeaders.set(tableId, ['Source Pages', 'Address', 'House Number', 'Nominative list of Occupants', 'Note', 'Comment']);
tablesWithoutCommentCols.set(tableId, [3, 4]); //define fieds that do not have external content

var voyage_data = [
    {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""},
    {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}];

var cols = [
    {data: 'voyage_source_pages', type: 'text'},
    {data: 'registry_location', type: 'text'},
    {data: 'registry_house_number', type: 'text'},
    {data: 'nominative_list_of_occupants', renderer: buttonRenderer, readOnly: true},
    {data: 'voyages_note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}


];


function buttonRenderer(instance, td, row, col, prop, value, cellProperties) {
    var title = instance.getDataAtCell(row, 2);
    if (title) {
        title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
    }
    td.innerHTML = "<a onclick='createNestedTable(" + row + "," + null + ",\"" + title + "\")'> <button id='Row_" + row + "' style='padding:2px; font-size:8px;' type='button' class=' nested_button btn btn-outline-secondary'>Nested table</button></a>";// + value;
    td.className = 'htCenter';
    return td;
}

function paymentAnalysisRenderer(instance, td, row, col, prop, value, cellProperties) {
    var title = instance.getDataAtCell(row, 1);
    if (title) {
        title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
    }
    td.innerHTML = "<a onclick='showPaymentList(" + row + "," + null + ",\"" + title + "\")'>  <button id='payment_button_" + row + "' style='padding:2px; font-size:8px;' type='button' class=' aggregade_nested btn btn-outline-secondary'>Nested table</button></a>";// + value;
    td.className = 'htCenter';
    return td;
}

var cont = document.getElementById(tableId);

var residencies_locs = new Object();

var residencies_registry_hot = new Handsontable(cont, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: voyage_data,
    columns: cols,
    contextMenu: true,
    manualColumnResize: true,
    currentRowClassName: 'currentRow',
    className: "htCenter",
    rowHeaders: true,
    autoWrapRow: true,
    colHeaders: tablesAndHeaders.get(tableId),
    nestedHeaders: [
        tablesAndHeaders.get(tableId)
    ],
    cells: function(row, col, prop) {
        if (this.vocab) {
            handle_vocabulary(this.instance.getDataAtCell(row, col), this.vocab, this);
        }
    },
    /* Next 3 properties added to support comments*/
    comments: true,
    hiddenColumns: {
        columns: [tablesAndHeaders.get(tableId).length - 1] //last column only
    },
    afterLoadData: function() {
        addCommentForContentFoundOutsideTheSource(this);
    },
    afterRenderer: function(td, row, col, prop, value) {
        if ((cols[col].vocab === 'location_fr') && (value)) {
            handle_locations(value,'regidencies_regisrty',row,col,'LOCS',residencies_locs);                 
        }
    }
});

residencies_registry_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(cols[col].vocab);
            } else if (key === 'view_add') {
                var col = options.start.col;
                var row = options.start.row;
                var tableId = this.rootElement.getAttribute("id");
                var value = residencies_registry_hot.getDataAtCell(options.start.row, options.start.col);
                var label = cols[col].vocab;
                create_location_modal(tableId, value, row, col, label);
            }
        },
        items: {
            "hsep2": "---------",
            "undo": {},
            "redo": {},
            "hsep3": "---------",
            "copy": {},
            "cut": {},
            "hsep4": "---------",
            "hsep5": "---------",
            "add10rows": {
                name: "Add 10 rows",
                disabled: function() {
                    return residencies_registry_hot.countRows() - 1 !== residencies_registry_hot.getSelected()[0];
                },
                callback: function() {
                    this.alter('insert_row', this.getSelected()[0] + 1, 10);
                }
            },
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function() {
                    var col = residencies_registry_hot.getSelectedRange().to.col;
                    var label = cols[col].vocab;
                    if (label) {
                        update_Vocs();
                        return residencies_registry_hot.getSelectedRange().to.col !== col;
                    } else {
                        return residencies_registry_hot.getSelectedRange().to.col !== -1;
                    }
                }},
            "hsep6": "---------",
            "view_add": {
                name: "View/Add Location Identity info",
                hidden: function() {
                    var col = residencies_registry_hot.getSelectedRange().to.col;
                    var label = cols[col].vocab;
                    if ((typeof label !== "undefined") && (label.indexOf("location_") !== -1)) {
                        return false;
                    } else {
                        return true;
                    }
                }},
            "comment": {
                name: "Mark external content",
                hidden: function() {
                    var tableId = this.rootElement.getAttribute("id");
                    var col = this.getSelectedRange().to.col;
                    if (tablesWithoutCommentCols.get(tableId).includes(col)) {
                        return true;
                    }
                },
                callback: function() {
                    comment(this);
                }
            },
            "deleteComment": {
                name: "Undo Mark external content",
                hidden: function() {
                    var tableId = this.rootElement.getAttribute("id");
                    var row = this.getSelectedRange().to.row;
                    var col = this.getSelectedRange().to.col;
                    if (typeof this.getCellMeta(row, col).comment === "undefined") {
                        return true;
                    }
                    if (tablesWithoutCommentCols.get(tableId).includes(col)) {
                        return true;
                    }
                },
                callback: function() {
                    uncomment(this);
                }
            }
        }
    }
});
////////////////////////////////////////////////////////////////////////////////
///////////////////////        Nested Tables       /////////////////////////////


var list_of_occupants = [];
var list_of_occupants_columns = [
    {data: 'household_number', type: 'text'},
    {data: 'person_number', type: 'text'},
    {data: 'person_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_fr")), vocab: 'surname_fr'},
    {data: 'person_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_fr")), vocab: 'name_fr'},
    {data: 'person_age', type: 'text'},
    {data: 'person_year_of_birth', type: 'text'},
    {data: 'person_birth_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'},
    {data: 'person_nationality', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("nationality_fr")), vocab: 'nationality_fr'},
    
    {data: 'person_marital_status', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("marital_status_fr")), vocab: 'marital_status_fr'},
    {data: 'person_religion', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("religion_fr")), vocab: 'religion_fr'},
    
    
    {data: 'person_household_role', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("person_to_person_relation_fr")), vocab: 'person_to_person_relation_fr'},
    {data: 'person_related_person_number', type: 'text'},
    {data: 'person_profession_rank', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_fr")), vocab: 'status_capacity_role_fr', renderer: groupRenderer},
    {data: 'person_status_in_work', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_fr")), vocab: 'status_fr'},
    {data: 'works_at_organization', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_fr")), vocab: 'organization_fr'},
    {data: 'works_at_person_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_fr")), vocab: 'name_fr'},
    {data: 'works_at_person_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_fr")), vocab: 'surname_fr'},
    ///////////////////////////////////////////////////
    {data: 'payroll_note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];

var transactionsGroups = [[12, 12]];


var persons_json = new Object();
if (JSON.parse(localStorage.getItem("PERSONS"))) {
    persons_json = persons_json = (JSON.parse(localStorage.getItem("PERSONS")));
}
var pp = new Object();
var ships_persons = new Object();


function close_nested(cnt) {
    $("#heading" + cnt).parent().hide();
    $.each($('.nested_button'), function(i) {
        if ($("#Row_" + i).hasClass('full_data')) {
            $("#Row_" + i).css("background-color", "#C4C4C4");
            $("#Row_" + i).css("color", "#1C6799");
        }
        else {
            $('#Row_' + i).css({'background': '#dddddd'});
            $('#Row_' + i).css({'color': '#337ab7'});
        }
    });
    $('#Row_' + cnt).css({'background': '#638BC7'});
    $('#Row_' + cnt).css({'color': '#ffffff'});
}

//var voyage_transaction;

function createNestedTable(cnt, data, header) {
    
    //////// nested data from json ///////////////
    if(nested_tables){        
        if (nested_tables[cnt]) {
            data = nested_tables[cnt];
        }
    }
    
    //////////////////////////////////////////////

    $('#insert2_here').hide();
    $(".nested_table").hide();
    var parent = $('#heading' + cnt).parent();
    $(parent).show();

    $.each($('.nested_button'), function(i) {
        if ($("#Row_" + i).hasClass('full_data')) {
            $("#Row_" + i).css("background-color", "#C4C4C4");
            $("#Row_" + i).css("color", "#1C6799");
        }
        else {
            $('#Row_' + i).css({'background-color': '#dddddd'});
            $('#Row_' + i).css({'color': '#337ab7'});
        }
    });

    var plus = parseInt(cnt) + 1;
    var table_header = "";
    if (!((header == null) || (header == "null"))) {
        table_header = ' / House Number : ' + header;
    }

    var html = "<div  class='panel panel-default nested_table not_visible' style='border:transparent; margin-top:5px;'>" +
            "<div class='panel-heading' role='tab' id='heading" + cnt + "'>" +
            "<h4 class='panel-title'>" +
            "    <a style='background-color:#589AAF;' class='collapsed' role='button' onclick='close_nested(" + cnt + ")'  href='#collapse" + cnt + "'>" +
            "<span class='pull-right glyphicon glyphicon-remove'></span>" + "Nominative list of Occupants " + plus + table_header +
            "     </a>" +
            "</h4>" +
            "</div>" +
            "<div id='collapse" + cnt + "' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='heading" + cnt + "'>" +
            "    <div style='padding-top:6px;' class='panel-body'>" +
            "    <span style=' color:#163758; padding:0px;font-size: 11px'>Use the source language to fill in the fields of this table</span>" +
            "        <div>" +
            "            <div id='transactions" + cnt + "' class='hot handsontable htRowHeaders htColumnHeaders' style='height: 470px; overflow: hidden; width: 100%; margin:5px 0px 0px 4px;'></div>" +
            "        </div> " +
            "    </div>" +
            "</div>" +
            "</div>";


    if ($('#heading' + cnt).size() === 0) {

        $('#insert_here').append(html);
        $('#insert_here').show();

        if (data == null) {
            data = [{catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}];
            $('#Row_' + cnt).css({'background-color': '#638BC7'});
            $('#Row_' + cnt).css({'color': '#ffffff'});
            $("#Row_" + cnt).addClass('full_data');
        }
        else {
            $("#Row_" + cnt).addClass('full_data');
            $("#Row_" + cnt).css("background-color", "#C4C4C4");
            $("#Row_" + cnt).css("color", "#1C6799");
        }

        var tableId = 'transactions' + cnt;
        tablesAndHeaders.set('transactions', ['Household Number', 'Person Number', 'Surname', 'Name', 'Age', 'Year of Birth', 'Place of Birth', 'Nationality', 'Marital Status','Religion','Role in household', 'Related Person Number', 'Profession', 'Status in work', 'Organization', 'Name', 'Surname', 'Note', 'Comment']);

        tablesWithoutCommentCols.set(tableId, [15]); //define fieds that do not have external content


        var container = document.getElementById(tableId);

        var headers = [
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', {label: 'Works at', colspan: 3}, ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', {label: 'Person', colspan: 2}, ''],
            tablesAndHeaders.get('transactions')
        ];


        headers = markHeaders(headers, transactionsGroups);
        

        var voyage_transaction = new Handsontable(container, {
            licenseKey: '',
            dateFormat: 'YYYY-MM-DD',
            data: data,
            columns: list_of_occupants_columns,
            contextMenu: true,
            manualColumnResize: true,
            autoWrapRow: true,
            currentRowClassName: 'currentRow',
            className: "htCenter htMiddle",
            colHeaders: tablesAndHeaders.get('transactions'),
            rowHeaders: true,
            nestedHeaders: headers,
            cells: function(row, col, prop) {
                if (this.vocab) {
                    handle_vocabulary(this.instance.getDataAtCell(row, col), this.vocab, this);
                }
            },
            /* Next 3 properties added to support comments*/
            comments: true,
            hiddenColumns: {
                columns: [tablesAndHeaders.get('transactions').length - 1] //last column only
            },
            afterLoadData: function() {
                addCommentForContentFoundOutsideTheSource(this);
            },
            afterRender: function() {
                markGroups(this);
            },
            afterSelectionEnd: function(row, col) {
                markGroups(this);
                if (col === 12) {
                    groupLeftClicked(this, row, col);
                }
            }/*,
            afterRenderer: function(td, row, col, prop, value) {
                if ((list_of_occupants_columns[col].vocab === 'location_fr') && (value)) {
                     handle_locations(value,'list_of_occupants_' + cnt,row,col,'LOCS',occupants_locs);                          
                } else if (value && ((list_of_occupants_columns[col].vocab === 'organization_fr'))) {
                    handle_organizations(value,'list_of_occupants_' + cnt,row, col, 'ORGS');                    
                } else if (value) {
                 //   handle_persons(row, col, value, 'list_of_occupants_' + cnt, [2, 3, 5], ['surname_a', 'name', 'date_of_birth'], occupants_persons, persons_tbl, 'PERSONS');                                        
                 //   handle_persons(row + '_', col, value, 'list_of_occupants_' + cnt, [15, 16], ['name', 'surname_a'], occupants_persons, persons_tbl, 'PERSONS');
                }
            }*/
        });


        voyage_transaction.updateSettings({
            contextMenu: {
                callback: function(key, options) {
                    if (key === 'edit_vocabulary') {
                        var col = options.start.col;
                        create_voc_modal(list_of_occupants_columns[col].vocab);
                    }
                    else if (key === 'view_add') {
                        var col = options.start.col;
                        var row = options.start.row;
                        var tableId = this.rootElement.getAttribute("id");
                        var value = voyage_transaction.getDataAtCell(options.start.row, options.start.col);
                        var label = list_of_occupants_columns[col].vocab;
                        create_location_modal(tableId, value, row, col, label);
                    }

                    else if (key === 'add') {
                        var colClicked = voyage_transaction.getSelectedRange().to.col;
                        var rowClicked = voyage_transaction.getSelectedRange().to.row;
                        if (colClicked === 12) {
                            groupClicked('transactions' + cnt, "professions", rowClicked, 12, 12);
                        }
                    }
                },
                items: {
                    "undo": {},
                    "redo": {},
                    "hsep3": "---------",
                    "copy": {},
                    "cut": {},
                    "hsep4": "---------",
                    "row_above": {
                        disabled: function() {
                            return voyage_transaction.getSelected()[0] === 0;
                        }
                    },
                    "row_below": {},
                    "add10rows": {
                        name: "Add 10 rows",
                        callback: function() {
                            this.alter('insert_row', this.getSelected()[0] + 1, 10);
                        }
                    },
                    "hsep2": "---------",
                    "remove_row": {
                        disabled: function() {
                            if (((voyage_transaction.getSelected()[0]) < 3) || ((voyage_transaction.getSelected()[2]) < 3)) {
                                return true;
                            }
                        }
                    },
                    "hsep1": "---------",
                    "edit_vocabulary": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            var col = voyage_transaction.getSelectedRange().to.col;
                            var label = list_of_occupants_columns[col].vocab;
                            if (label) {
                                update_Vocs();
                                return voyage_transaction.getSelectedRange().to.col !== col;
                            } else {
                                return voyage_transaction.getSelectedRange().to.col !== -1;
                            }
                        }},
                    "add": {
                        name: "Add table",
                        hidden: function() {
                            return isAddTableMenuVisible(this, transactionsGroups);

                        }},
                    "hsep5": "---------",
                    "view_add": {
                        name: "View/Add Location Identity info",
                        hidden: function() {
                            var col = voyage_transaction.getSelectedRange().to.col;
                            var label = list_of_occupants_columns[col].vocab;

                            if ((typeof label !== "undefined") && (label.indexOf("location_") !== -1)) {
                                return false;
                            } else {
                                return true;
                            }
                        }},
                    "comment": {
                        name: "Mark external content",
                        hidden: function() {
                            var tableId = this.rootElement.getAttribute("id");
                            var col = this.getSelectedRange().to.col;
                            if (tablesWithoutCommentCols.get(tableId).includes(col)) {
                                return true;
                            }
                        },
                        callback: function() {
                            comment(this);
                        }
                    },
                    "deleteComment": {
                        name: "Undo Mark external content",
                        hidden: function() {
                            var tableId = this.rootElement.getAttribute("id");
                            var row = this.getSelectedRange().to.row;
                            var col = this.getSelectedRange().to.col;
                            if (typeof this.getCellMeta(row, col).comment === "undefined") {
                                return true;
                            }
                            if (tablesWithoutCommentCols.get(tableId).includes(col)) {
                                return true;
                            }
                        },
                        callback: function() {
                            uncomment(this);
                        }
                    }
                }
            }
        });
        list_of_occupants[cnt] = voyage_transaction;

    }
    else {
        if (!((header == null) || (header == "null"))) {
            $('#heading' + cnt).children().children().html('<span class="pull-right glyphicon glyphicon-remove"></span>Nominative list of Occupants ' + plus + ' / House Number : ' + header);
        }

        $('#Row_' + cnt).css({'background': '#638BC7'});
        $('#Row_' + cnt).css({'color': '#ffffff'});
        $('#insert_here').show();
    }
}
;

//////////////////////////EXPORT IMPORT////////////////////////////////

/////////////////////////////////////////////////////////////////////
function createRecordJson(usage) {
   
    var json = new Object();
    var cat_info = createJson(catalogue_info, cols1, usage);
    var source_id = createJson(source_identity_data, source_identity_cols, usage);
    var overall_statistics = createJson(overall_statistics_hot, cols3, usage);
    var residencies_registry = createJson(residencies_registry_hot, cols, usage);   
    var voyage_keys = Object.keys(list_of_occupants);
           
    var occupants = new Object();
    
    cat_info.date_until = getCurrentDate();
    catalogue_info.setDataAtCell(0, 2, getCurrentDate());
    json['record_information'] = cat_info;
    json['source_identity'] = source_id;
    json['overall_statistics'] = overall_statistics;
    json['residencies_registry'] = residencies_registry;
   
    
    
    ///   SAVI DYNAMICALLY 
    //console.log(usage)
    if ( ((usage === 'excel')&& (nested_tables) )|| ((mode === 'teamView') && (nested_tables))) {

        $.each(nested_tables, function (cnt) {

            var voyages_trans = new Array();

            $.each(this, function () {
                voyages_trans.push(this);
            });
            console.log('exporting nested table: ' + cnt);
            createNestedTable(cnt, voyages_trans);
            $(".nested_table").hide();
            occupants[cnt] = createJson((list_of_occupants[cnt]), list_of_occupants_columns, usage);
        });

        nested_tables = null;
    } 
    else {             
        occupants = nested_tables_object;                            
        for (var i = 0; i < voyage_keys.length; i++) {     
            occupants[voyage_keys[i]] = createJson((list_of_occupants[voyage_keys[i]]), list_of_occupants_columns, usage);
        }
    }
    
    json['nominative_list_of_occupants'] = occupants;   

    if (record_status === 'Public') {
        
    ///////////////SOURCE identity
        var terms = new Object();
        $.each(source_id, function (col) {
            var val = this.toString();                       
            $.each(source_identity_cols, function (col_no) {
                if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                    var label = $(this).attr('vocab');                    
                    handle_json_vocs(val,label,0,col,col_no,'source_identity',terms);
                }
            });                                                            
        });    
        
        
    $.each(occupants, function (cnt) {
        console.log('---------- handling nested table '+cnt+'-----------');
        var occupants_locs = new Object();
        var occupants_persons = new Object();
        var persons_tbl = new Object();
         var terms = new Object();
        $.each(this, function (row) {
            var row_data = this;
            $.each(this, function (col_label) {                
                var val = this; 
                //console.log(this)
                $.each(list_of_occupants_columns, function (col) {                   
                    if (($(this).attr('vocab')) && ($(this).attr('data')) === col_label) {                        
                        var label = $(this).attr('vocab');                               
                        handle_vocabulary(val, label, this);
                        handle_json_vocs(val,label,row,col_label,col,'list_of_occupants_' + cnt,terms);                   
                        if ($(this).attr('vocab') === 'location_fr') {
                            handle_locations(val, 'list_of_occupants_' + cnt, row, col, 'LOCS', occupants_locs);
                        }                                                                    
                    }                    
                });
                if (col_label === 'works_at_organization') {
                     handle_organizations(row_data['works_at_organization'], 'list_of_occupants_' + cnt, row, 14, 'ORGS');
                }
                
               ////////////////////////HANDLE PERSONS///////////////////////////
                if (col_label === 'person_surname') {
                    handle_persons(row, 2, row_data['person_surname'], 'list_of_occupants_' + cnt, [ 3,2, 5], ['name','surname_a',  'date_of_birth'], occupants_persons, persons_tbl, 'PERSONS');
                    handle_persons(row, 3, row_data['person_name'], 'list_of_occupants_' + cnt, [ 3,2, 5], [ 'name','surname_a', 'date_of_birth'], occupants_persons, persons_tbl, 'PERSONS');
                    handle_persons(row, 5, row_data['person_year_of_birth'], 'list_of_occupants_' + cnt, [ 3,2, 5], [ 'name','surname_a','date_of_birth'], occupants_persons, persons_tbl, 'PERSONS');
                }
                if (col_label === 'works_at_person_surname') {
                    handle_persons(row + '_', 15, row_data['works_at_person_name'], 'list_of_occupants_' + cnt, [15,16], ['name','surname_a'], occupants_persons, persons_tbl, 'PERSONS');
                    handle_persons(row + '_', 16, row_data['works_at_person_surname'], 'list_of_occupants_' + cnt, [15, 16], ['name', 'surname_a'], occupants_persons, persons_tbl, 'PERSONS');
                }
                ////////////////////////////////////////////////////////////////
            });
        });
    });
    }
 
     
    update_Vocs(); 
    console.log(terms_json)
    update_Vocs_from_json(terms_json);    
                
    return json;
}
;

///////////////Update Vocabularies
function update_Vocs() {
    if (mode === null) {//only update vocabularies in edit mode

        var tables = [];
        var voyage_keys = Object.keys(list_of_occupants);

        for (var i = 0; i < voyage_keys.length; i++) {
            tables.push(list_of_occupants[voyage_keys[i]]);
        }
        
        tables.push(catalogue_info, source_identity_data, overall_statistics_hot, residencies_registry_hot);
        updateVocabs(tables);
        //console.log(tables)
        console.log('Vocabularies successfully updated!');
    }
}
;

//////////////////////////////////////////////////////////////////////////////////////////
/////////// Loading icon
$(window).load(function() {
    $(".spin_loader").fadeOut("slow");
});

///////////////////////////////// Load File ///////////////////////////////////

var url = new URL(window.location.href);
var mode = url.searchParams.get("mode");
var nested_tables = new Object();
var nested_tables_object = new Object();


var record_status;

function load(data,status) {
    
    console.log(status);
    record_status = status;    
    clear_LocalStorage_instances();


    catalogue_info.loadData(data.record_information);
    source_identity_data.loadData(data.source_identity);
    overall_statistics_hot.loadData(data.overall_statistics);

    var residencies_registry = new Array();
    $.each(data.residencies_registry, function () {
        residencies_registry.push(this);
    });

    residencies_registry_hot.loadData(residencies_registry);

    $('.nested_table').remove();

    if (data.nominative_list_of_occupants) {
        
        nested_tables_object = data.nominative_list_of_occupants;
        
        $.each(data.nominative_list_of_occupants, function (cnt) {
            
            var voyages_trans = new Array();
            $.each(this, function () {
                voyages_trans.push(this);
            });

            if (mode === 'teamView') {
                nested_tables[cnt] = voyages_trans;
            } else {
                //createNestedTable(cnt, voyages_trans);
                //$(".nested_table").hide();
                nested_tables[cnt] = voyages_trans;
                
            }
        });
    }

    update_Vocs();
}
;


///////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
/////////////////////////EXCEL EXPORT////////////////////////////////////////

$('#excelexport').click(function() {
    var json = createRecordJson('excel');
    var temp = JSON.stringify(json);
    temp = temp.replace(/&nbsp;/g, "");
    json = JSON.parse(temp);

    var occupants = new Array();
    $.each(json.nominative_list_of_occupants, function(cnt) {
        $.each(this, function() {
            occupants.push(Object.assign({}, (json.residencies_registry[cnt]), (this)));
        });
    });

    if (occupants.length < 1) {
        occupants.push('');
    }

    var sheets = new Array();
    sheets.push([json.record_information]);
    sheets.push([json.source_identity]);
    sheets.push([json.overall_statistics]);
    sheets.push(json.residencies_registry);
    sheets.push(occupants);

    var nestedGroups = createMultipleNestedTables(json['nominative_list_of_occupants'], transactionsGroups, cols, list_of_occupants_columns);
    var result = createExcelSheetsData(sheets, nestedGroups);


    var opts = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Source Identity', header: false}, {sheetid: 'Overall Statistics', header: true}, {sheetid: 'Residencies Registry', header: true}, {sheetid: 'Nominative List of Occupants', header: true}];
    var res = alasql('SELECT * INTO XLSX("' + $('#unique_filename').text() + '.xlsx",?) FROM ?', [opts, result]);
});


////////////////////////////////////////////////////////////////////////////////
//////////// Updates all cells from record from Vocabularies Modal

function update_Cells(occs, action, new_term, old_term) {

    var value = "";
    if (action === "remove") {
        value = "";
    } else if (action === "edit") {
        value = new_term;
    }

    $(".sub_table").remove();

    var tmp = occs;
    var real_occs = maxify_occurencies(tmp);

    $.each(real_occs, function() {
        var table_id = this.tableVariable;
        var old_val = "";
        if (table_id === "source_identity") {
            old_val = source_identity_data.getDataAtCell(this.row, this.col, value);
            source_identity_data.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
        } else if (table_id === "identifier_table") {
            old_val = overall_statistics_hot.getDataAtCell(this.row, this.col, value);
            overall_statistics_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
        }
        else if (table_id === "regidencies_regisrty") {
            old_val = residencies_registry_hot.getDataAtCell(this.row, this.col, value);
            residencies_registry_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
        }
        else if (table_id === "catalogue_info") {
            old_val = catalogue_info.getDataAtCell(this.row, this.col, value);
            catalogue_info.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
        } else {
            var cnt = table_id.replace("transactions", "");
            old_val = list_of_occupants[cnt].getDataAtCell(this.row, this.col, value);
            list_of_occupants[cnt].setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
        }

    });
}
;

////////////////////////// BIG TEXTs ////////////////////////////////

function set_Text_val(row, col, val, parentTable) {

    if (parentTable.indexOf("transactions") !== -1) {
        var cnt = parentTable.replace("transactions", "");
        list_of_occupants[cnt].setDataAtCell(row, col, val);
    } else if (parentTable === "source_identity") {
        source_identity_data.setDataAtCell(row, col, val);
    } else if (parentTable === "regidencies_regisrty") {
        residencies_registry_hot.setDataAtCell(row, col, val);
    }
}
;



/////////////////////////////////////////////////////////////////////

///////////////////////////EXPORT TO XML//////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
function create_xml_file() {

    var json = createRecordJson('excel');
    var temp = JSON.stringify(json);
    temp = temp.replace(/&nbsp;/g, "");
    json = JSON.parse(temp);

    var root = new Object();
    var tmp = new Object();

    tmp['record_information'] = oneRow_with_Groups(json.record_information, catalogue_infoGroups, cols1);
    tmp['record_information']['record_title'] = uniqueFilename;
    tmp['record_information']['related_organization'] = 'FORTH/IMS';
    tmp['record_information']['record_id'] = recordId;
    tmp['record_information']['template_type'] = templateTitle;
    tmp['source_identity'] = json.source_identity;
    tmp['source_identity']['source_language'] = 'French';
    tmp['overall_statistics'] = json.overall_statistics;


   // tmp['residencies_registry'] = nested_with_Groups(json.nominative_list_of_occupants, json.residencies_registry, transactionsGroups, list_of_occupants_columns, 'nominative_list_of_occupants', 'nominative_list_of_occupants_');
   
   tmp['residencies_registry'] = nested_with_Groups(json.nominative_list_of_occupants, json.residencies_registry, transactionsGroups, list_of_occupants_columns, 'nominative_list_of_occupants', 'nominative_list_of_occupants_');
//nested_content;
    root['root'] = tmp;
    var xml = formatXml(json2xml(root));
	

    console.log(root);



//    xml = xml.replace(/<nominative_list_of_occupants_(\d+)>/g, '<nominative_list_of_occupants index="$1">');
//    xml = xml.replace(/<\/nominative_list_of_occupants_(\d+)>/g, "</nominative_list_of_occupants>");
    
    xml = xml.replace(/<nominative_list_of_occupants_(\d+)>/g, '<list_of_occupants index="$1">');
    xml = xml.replace(/<\/nominative_list_of_occupants_(\d+)>/g, "</list_of_occupants>");
    
   
    xml = xml.replace(/<nominative_list_of_occupants>/g, '<list_of_occupants>');
    xml = xml.replace(/<\/nominative_list_of_occupants>/g, "</list_of_occupants>");
    
   
    xml = xml.replace(/<row_(\d+)>/g, '<row index="$1">');
    xml = xml.replace(/<\/row_(\d+)>/g, "</row>");

    xml = xml.replace(/<group_data_(\d+)>/g, '<group_data index="$1">');
    xml = xml.replace(/<\/group_data_(\d+)>/g, "</group_data>");


    return (xml);
}
;

