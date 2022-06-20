/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

///////////////////SAM mikroi pinakes//////////////////////////////////////////

var transactionTypes = [];
var goods = [];


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
        else if (subTableName === "professions") {
            var cols = [
                {data: 'worker_profession_rank', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_capacity_role_it")), vocab: 'status_capacity_role_it'}
            ];
            nestedHeaders = [
                ['Profession/Rank']
            ];
            data = setSubTableData(workers_hot, row, startCol, endCol);
        }

        else if (subTableName === "indermediate_ports") {
            var cnt = parentTableName.replace("displacements", "");
            var cols = [
                {data: 'intermediate_sequence', type: 'text'},
                {data: 'intermediate_port', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'}
            ];
            nestedHeaders = [
                ['Sequence', 'Ports of Call']
            ];
            data = setSubTableData(displacement_list[cnt], row, startCol, endCol);

        } else if (subTableName === "dis_professions") {
            var cnt = parentTableName.replace("displacements", "");
            var cols = [
                 {data: 'displacement_profession', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_capacity_role_it")), vocab: 'status_capacity_role_it'},
    
            ];
            nestedHeaders = [
                ['Profession']
            ];
            data = setSubTableData(displacement_list[cnt], row, startCol, endCol);

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
tablesAndHeaders.set(tableId, ['Name', 'Location', 'From *','To', 'Name', 'Location','Source Type Name', 'Note', 'Comment']);
tablesWithoutCommentCols.set(tableId, [0, 1, 5]); //define fieds that do not have external content

var sourcedata = [
    {archive_library: ''}
];

var source_identity_cols = [
    {data: 'archive_library', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("archive_or_library_it")), vocab: 'archive_or_library_it'},
    {data: 'source_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_it'},
    {data: 'book_number', type: 'text'},
    {data: 'book_number_to', type: 'text'},
    {data: 'issuing_authority', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("local_authority_it")), vocab: 'local_authority_it'},
    {data: 'issuing_authority_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
    
    {data: 'source_type_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("source_type_name_es")), vocab: 'source_type_name_es'},
    
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];

var source_container = document.getElementById(tableId);
var source_locs = new Object();
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
        [{label: 'Archive / Library', colspan: 2}, {label: 'Number of Book', colspan: 2}, {label: 'Issuing authority', colspan: 2},'', ''],
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
        if ((source_identity_cols[col].vocab === 'location_it') && (value)) {
            handle_locations(value,'source_identity',row,col,'LOCS',source_locs);         
        } else if ((source_identity_cols[col].vocab === 'archive_or_library_it')  && value) {
            handle_organizations(value,'source_identity',row, col, 'ORGS');
        } else if ((source_identity_cols[col].vocab === 'local_authority_it')&& value ) {
            handle_organizations(value,'source_identity',row+"_", col, 'ORGS');
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
/////////////////////////VOYAGE INFORMATION/////////////////////////////////////////                       

var tableId = "maritime_workers_list";
tablesAndHeaders.set(tableId, ['Serial Number', 'Registration Date', 'Surname', 'Name', 'Preferred Name', 'Fathers Name', 'Mothers Name', 'Mothers Surname', 'Location', 'Date', 'Location of Residence', 'Hair Color', 'Eyes Color','Marital Status', 'Profession/Rank', 'Displacement List', 'Note', 'Comment']);

tablesWithoutCommentCols.set(tableId, [14, 15]); //define fieds that do not have external content


var workers_data = [
    {maritime_list_serial_number: ""}, {maritime_list_serial_number: ""}, {maritime_list_serial_number: ""},
    {maritime_list_serial_number: ""}, {maritime_list_serial_number: ""}, {maritime_list_serial_number: ""},
    {maritime_list_serial_number: ""}, {maritime_list_serial_number: ""}, {maritime_list_serial_number: ""},
    {maritime_list_serial_number: ""}, {maritime_list_serial_number: ""}, {maritime_list_serial_number: ""},
    {maritime_list_serial_number: ""}, {maritime_list_serial_number: ""}, {maritime_list_serial_number: ""}
];


var workers_cols = [
    {data: 'maritime_list_serial_number', type: 'text'},
    {data: 'maritime_list_date', type: 'date'},
    {data: 'worker_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_it")), vocab: 'surname_it'},
    {data: 'worker_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it'},
    {data: 'worker_preferred_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it'},
    {data: 'worker_fathers_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it'},
    {data: 'worker_mothers_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it'},
    {data: 'worker_mothers_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_it")), vocab: 'surname_it'},
    {data: 'worker_birth_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
    {data: 'worker_birth_date', type: 'date'},
    {data: 'worker_residence_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
    {data: 'worker_hair_colour', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("color_it")), vocab: 'color_it'},
    {data: 'worker_eyes_colour', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("color_it")), vocab: 'color_it'},
    
    {data: 'marital_status', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("marital_status_in")), vocab: 'marital_status_in'},
    
    {data: 'worker_profession_rank', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_it")), vocab: 'status_capacity_role_it', renderer: groupRenderer},
    {data: 'displacement_list', renderer: buttonRenderer, readOnly: true},
    {data: 'maritime_list_note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];

function buttonRenderer(instance, td, row, col, prop, value, cellProperties) {
    var title = instance.getDataAtCell(row, 0);
    if (title) {
        title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
    }
    td.innerHTML = "<a onclick='createNestedTable(" + row + "," + null + ",\"" + title + "\")'> <button id='Row_" + row + "' style='padding:2px; font-size:8px;' type='button' class=' nested_button btn btn-outline-secondary'>Nested table</button></a>";// + value;
    td.className = 'htCenter';
    return td;
}

var headers = [
    ['', '', '', '', '', '', '', '', {label: 'Birth', colspan: '2'}, '', {label: 'Description', colspan: '2'},'', '', ''],
    tablesAndHeaders.get(tableId)
];

var maritime_workers_listGroups = [[14, 14]];
headers = markHeaders(headers, maritime_workers_listGroups);
var worker_locs = new Object();
var worker_tbl = new Object();
var worker_persons = new Object();



var cont = document.getElementById(tableId);

var workers_hot = new Handsontable(cont, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: workers_data,
    columns: workers_cols,
    contextMenu: true,
    manualColumnResize: true,
    currentRowClassName: 'currentRow',
    className: "htCenter",
    rowHeaders: true,
    autoWrapRow: true,
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
    },
    afterRender: function() {
        markGroups(this);
    },
    afterSelectionEnd: function(row, col) {
        markGroups(this);
        if (col === 14) {
            groupLeftClicked(this, row, col);
        }
    }/*,    
    afterRenderer: function(td, row, col, prop, value) {
       if ((workers_cols[col].vocab === 'location_it') && (value)) {
            handle_locations(value,'ship_identity',row,col,'LOCS',worker_locs);            
        }else if ( (col === 2 || col === 3|| col === 5|| col === 6|| col === 7|| col === 9)&&(value) ){
             handle_persons(row, col, value, 'maritime_workers_list', [2,3,5,9], ['surname_a','name','fathers_name','date_of_death'], worker_persons, worker_tbl, 'PERSONS');             
             handle_persons(row+'__', col, value, 'maritime_workers_list', [6, 7], ['name', 'surname_a'], worker_persons, worker_tbl, 'PERSONS');
        }
    }*/
});

workers_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(workers_cols[col].vocab);
            }
            else if (key === 'add') {
                var colClicked = workers_hot.getSelectedRange().to.col;
                var rowClicked = workers_hot.getSelectedRange().to.row;
                if (colClicked === 14) {
                    groupClicked("maritime_workers_list", "professions", rowClicked, 14, 14);
                }
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
                    return workers_hot.countRows() - 1 !== workers_hot.getSelected()[0];
                },
                callback: function() {
                    this.alter('insert_row', this.getSelected()[0] + 1, 10);
                }
            },
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function() {
                    var col = workers_hot.getSelectedRange().to.col;
                    var label = workers_cols[col].vocab;
                    if (label) {
                        update_Vocs();
                        return workers_hot.getSelectedRange().to.col !== col;
                    } else {
                        return workers_hot.getSelectedRange().to.col !== -1;
                    }
                }},
            "add": {
                name: "Add table",
                hidden: function() {
                    return isAddTableMenuVisible(this, maritime_workers_listGroups);

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
////////////////////////////////////////////////////////////////////////////////
///////////////////////        Nested Tables       /////////////////////////////



var displacement_list = [];
var displacement_columns = [
    {data: 'displacement_ship_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_type_it")), vocab: 'ship_type_it'},
    {data: 'displacement_ship_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_it")), vocab: 'ship_name_it'},      
    {data: 'displacement_registration_number', type: 'text'},
    
    {data: 'displacement_profession', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_it")), vocab: 'status_capacity_role_it', renderer: groupRenderer},
    
    {data: 'displacement_captain_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it'},
    {data: 'displacement_captain_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_it")), vocab: 'surname_it'},
    {data: 'displacement_destination', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
    {data: 'displacement_embarkation_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
    {data: 'displacement_embarkation_date', type: 'date'},
    {data: 'displacement_discharge_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
    {data: 'displacement_dissharge_location', type: 'date'},
     {data: 'displacement_', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("discharge_reason_it")), vocab: 'discharge_reason_it'},
    {data: 'intermediate_sequence', type: 'text', renderer: groupRenderer},
    {data: 'intermediate_port', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it', renderer: groupRenderer},
    {data: 'total_years', type: 'text'},
    {data: 'total_months', type: 'text'},
    {data: 'total_days', type: 'text'},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];

var displacementsGroups = [[3, 3],[12, 13]];



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



function createNestedTable(cnt, data, header) {
    
      //////// nested data from json ///////////////
    if(nested_tables){        
        if (nested_tables[cnt]) {
            data = nested_tables[cnt];
        }
    }
    
    //////////////////////////////////////////////

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
        table_header = ' / Serial Number : ' + header;
    }

    var html = "<div  class='panel panel-default nested_table not_visible' style='border:transparent; margin-top:5px;'>" +
            "<div class='panel-heading' role='tab' id='heading" + cnt + "'>" +
            "<h4 class='panel-title'>" +
            "    <a style='background-color:#589AAF;' class='collapsed' role='button' onclick='close_nested(" + cnt + ")'  href='#collapse" + cnt + "'>" +
            "<span class='pull-right glyphicon glyphicon-remove'></span>" + "Displacement List " + plus + table_header +
            "     </a>" +
            "</h4>" +
            "</div>" +
            "<div id='collapse" + cnt + "' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='heading" + cnt + "'>" +
            "    <div style='padding-top:6px;' class='panel-body'>" +
            "    <span style=' color:#163758; padding:0px;font-size: 11px'>Use the source language to fill in the fields of this table</span>" +
            "        <div>" +
            "            <div id='displacements" + cnt + "' class='hot handsontable htRowHeaders htColumnHeaders' style='height: 420px; overflow: hidden; width: 100%; margin:5px 0px 0px 4px;'></div>" +
            "        </div> " +
            "    </div>" +
            "</div>" +
            "</div>";


    if ($('#heading' + cnt).size() === 0) {
        $('#insert_here').append(html);

        if (data == null) {
            data = [{catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""},
                {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}];
            $('#Row_' + cnt).css({'background-color': '#638BC7'});
            $('#Row_' + cnt).css({'color': '#ffffff'});
            $("#Row_" + cnt).addClass('full_data');
        }
        else {
            $("#Row_" + cnt).addClass('full_data');
            $("#Row_" + cnt).css("background-color", "#C4C4C4");
            $("#Row_" + cnt).css("color", "#1C6799");
        }

        var tableId = 'displacements' + cnt;
        tablesAndHeaders.set('displacements', ['Type', 'Name', 'Registration Number','Profession', 'Name', 'Surname', 'Destination', 'Location', 'Date', 'Location', 'Date','Reason', 'Sequence', 'Ports of Call','Years','Months', 'Days', 'Note', 'Comment']);
        tablesWithoutCommentCols.set(tableId, [14]); //define fieds that do not have external content
        var container = document.getElementById(tableId);

        var headers = [
            [{label: 'Ship', colspan: 3},'',{label: 'Captain', colspan: 2}, '', {label: 'Embarkation', colspan: 2}, {label: 'Discharge', colspan: 3}, {label: 'Intermediate Ports of Call', colspan: 2}, {label: 'Total Voyage Duration', colspan: 3}, ''],
            tablesAndHeaders.get('displacements')
        ];


        headers = markHeaders(headers, displacementsGroups);
        var displacement_locs = new Object();
        var displacement_tbl = new Object();
        var displacement_persons = new Object();
        

        var displacement_hot = new Handsontable(container, {
            licenseKey: '',
            dateFormat: 'YYYY-MM-DD',
            data: data,
            columns: displacement_columns,
            contextMenu: true,
            manualColumnResize: true,
            autoWrapRow: true,
            currentRowClassName: 'currentRow',
            className: "htCenter htMiddle",
            colHeaders: tablesAndHeaders.get('displacements'),
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
                columns: [tablesAndHeaders.get('displacements').length - 1] //last column only
            },
            afterLoadData: function() {
                addCommentForContentFoundOutsideTheSource(this);
            },
            afterRender: function() {
                markGroups(this);
            },
            afterSelectionEnd: function(row, col) {
                markGroups(this);
                if (col > 11 && col < 14) {
                    groupLeftClicked(this, row, col);
                }else if (col ===3) {
                    groupLeftClicked(this, row, col);
                }
            }
        });


        displacement_hot.updateSettings({
            contextMenu: {
                callback: function(key, options) {
                    if (key === 'edit_vocabulary') {
                        var col = options.start.col;
                        create_voc_modal(displacement_columns[col].vocab);
                    }
                    else if (key === 'add') {
                        var colClicked = displacement_hot.getSelectedRange().to.col;
                        var rowClicked = displacement_hot.getSelectedRange().to.row;
                        if (colClicked > 11 && colClicked < 14) {
                            groupClicked('displacements' + cnt, "indermediate_ports", rowClicked, 12, 13);
                        }else if (colClicked ===3) {
                            groupClicked('displacements' + cnt, "dis_professions", rowClicked, 3, 3);
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
                            return displacement_hot.getSelected()[0] === 0;
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
                            if (((displacement_hot.getSelected()[0]) < 3) || ((displacement_hot.getSelected()[2]) < 3)) {
                                return true;
                            }
                        }
                    },
                    "hsep1": "---------",
                    "edit_vocabulary": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            var col = displacement_hot.getSelectedRange().to.col;
                            var label = displacement_columns[col].vocab;
                            if (label) {
                                update_Vocs();
                                return displacement_hot.getSelectedRange().to.col !== col;
                            } else {
                                return displacement_hot.getSelectedRange().to.col !== -1;
                            }
                        }},
                    "col0": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            return displacement_hot.getSelectedRange().to.col !== 0;
                        }},
                    "col1": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            return displacement_hot.getSelectedRange().to.col !== 1;
                        }},
                    "col3": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            return displacement_hot.getSelectedRange().to.col !== 3;
                        }},
                    "col4": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            return displacement_hot.getSelectedRange().to.col !== 4;
                        }},
                    "col5": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            return displacement_hot.getSelectedRange().to.col !== 5;
                        }},
                    "col6": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            return displacement_hot.getSelectedRange().to.col !== 6;
                        }},
                    "col8": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            return displacement_hot.getSelectedRange().to.col !== 8;
                        }},
                    "col10": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            return displacement_hot.getSelectedRange().to.col !== 10;
                        }},
                    "col11": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            return displacement_hot.getSelectedRange().to.col !== 11;
                        }},
                    "col13": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            return displacement_hot.getSelectedRange().to.col !== 13;
                        }},
                    "col15": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            return displacement_hot.getSelectedRange().to.col !== 15;
                        }},
                    "col17": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            return displacement_hot.getSelectedRange().to.col !== 17;
                        }},
                    "col19": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            return displacement_hot.getSelectedRange().to.col !== 19;
                        }},
                    "col21": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            return displacement_hot.getSelectedRange().to.col !== 21;
                        }},
                    "col23": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            return displacement_hot.getSelectedRange().to.col !== 23;
                        }},
                    "add": {
                        name: "Add table",
                        hidden: function() {
                            return isAddTableMenuVisible(this, displacementsGroups);

                        }},
                    "hsep5": "---------",
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
        displacement_list[cnt] = displacement_hot;

    }
    else {

        if (!((header == null) || (header == "null"))) {
            $('#heading' + cnt).children().children().html('<span class="pull-right glyphicon glyphicon-remove"></span>Displacement List ' + plus + ' / Serial Number : ' + header);
        }

        $('#Row_' + cnt).css({'background': '#638BC7'});
        $('#Row_' + cnt).css({'color': '#ffffff'});
    }
}
;
//////////////////////////EXPORT IMPORT////////////////////////////////
/////////////////////////////////////////////////////////////////////



function createRecordJson(usage) {

    var cat_info = createJson(catalogue_info, cols1, usage);
    var source_id = createJson(source_identity_data, source_identity_cols, usage);
    var voyages_data = createJson(workers_hot, workers_cols, usage);
    var voyage_keys = Object.keys(displacement_list);

    var json = new Object();
    var displacements = new Object();
    
    
    if ( ((usage === 'excel')&& (nested_tables) )|| ((mode === 'teamView') && (nested_tables))) {

        $.each(nested_tables, function (cnt) {

            var voyages_trans = new Array();

            $.each(this, function () {
                voyages_trans.push(this);
            });
            console.log('exporting nested table: ' + cnt);
            createNestedTable(cnt, voyages_trans);
            $(".nested_table").hide();
            displacements[cnt] = createJson((displacement_list[cnt]), displacement_columns, usage);
        });

        nested_tables = null;
    } else{
        displacements = nested_tables_object; 
        for (var i = 0; i < voyage_keys.length; i++) {
            displacements[voyage_keys[i]] = createJson((displacement_list[voyage_keys[i]]), displacement_columns, usage);
        }
    }
    
    
    
    cat_info.date_until = getCurrentDate();
    catalogue_info.setDataAtCell(0, 2, getCurrentDate());
    json['record_information'] = cat_info;
    json['source_identity'] = source_id;
    json['maritime_workers_list'] = voyages_data;
    json['displacement_list'] = displacements;
    
     
     //  First table HANDLING  
     
     
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
        
        
        var worker_persons = new Object();
        var worker_tbl = new Object();
        var worker_locs = new Object();
        terms = new Object();
        $.each(voyages_data, function (row) {
            var row_data = this;
            $.each(this, function (col) {
                ///////////////////////////////////////////   
                var val = this;
                    $.each(workers_cols, function (col_no) {
                        if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                            var label = $(this).attr('vocab');
                            handle_vocabulary(val, label, this);
                            handle_json_vocs(val, label, row, col, col_no, 'maritime_workers_list', terms);
                        }
                    });
                /////////////////////////////////////                
                if (col === 'worker_name') {
                    if (row_data['maritime_list_serial_number']) {
                        handle_persons(row, 0, row_data['maritime_list_serial_number'], 'maritime_workers_list', [3, 2, 5, 9, 0], ['name', 'surname_a', 'fathers_name', 'date_of_birth', 'registration_number'], worker_persons, worker_tbl, 'PERSONS');
                    }
                    handle_persons(row, 3, row_data['worker_name'], 'maritime_workers_list', [3, 2, 5, 9, 0], ['name', 'surname_a', 'fathers_name', 'date_of_birth', 'registration_number'], worker_persons, worker_tbl, 'PERSONS');
                    if (row_data['worker_surname']) {
                        handle_persons(row, 2, row_data['worker_surname'], 'maritime_workers_list', [3, 2, 5, 9, 0], ['name', 'surname_a', 'fathers_name', 'date_of_birth', 'registration_number'], worker_persons, worker_tbl, 'PERSONS');
                    }if (row_data['worker_fathers_name']) {
                        handle_persons(row, 5, row_data['worker_fathers_name'], 'maritime_workers_list', [3, 2, 5, 9,0], ['name', 'surname_a', 'fathers_name', 'date_of_birth', 'registration_number'], worker_persons, worker_tbl, 'PERSONS');
                    }if (row_data['worker_birth_date']) {
                        handle_persons(row, 9, row_data['worker_birth_date'], 'maritime_workers_list', [3, 2, 5, 9,0], ['name', 'surname_a', 'fathers_name', 'date_of_birth', 'registration_number'], worker_persons, worker_tbl, 'PERSONS');
                    }/*if (row_data['worker_profession_rank']) {
                        handle_persons(row, 13, row_data['worker_profession_rank'], 'maritime_workers_list', [3, 2, 5, 9, 13,0], ['name', 'surname_a', 'fathers_name', 'date_of_birth', 'status','registration_number'], worker_persons, worker_tbl, 'PERSONS');
                    }*/
                } else if (col === 'worker_fathers_name') {
                    handle_multiple_table_instances(row + '_', 5, row_data['worker_fathers_name'], 'maritime_workers_list', [5, 2], ['name', 'surname_a'], worker_persons, worker_tbl, 'PERSONS');
                    handle_multiple_table_instances(row + '_', 2, row_data['worker_surname'], 'maritime_workers_list', [5, 2], ['name', 'surname_a'], worker_persons, worker_tbl, 'PERSONS');
                } else if (col === 'worker_mothers_surname') {
                    handle_persons(row + '__', 6, row_data['worker_mothers_name'], 'maritime_workers_list', [6, 7], ['name', 'surname_a'], worker_persons, worker_tbl, 'PERSONS');
                    handle_persons(row + '__', 7, row_data['worker_mothers_surname'], 'maritime_workers_list', [6, 7], ['name', 'surname_a'], worker_persons, worker_tbl, 'PERSONS');
                } else if (col === 'worker_birth_location') {
                    handle_multiple_table_instances(row, 8, this.toString(), 'maritime_workers_list', null, null, worker_locs, null, 'LOCS');
                } else if (col === 'worker_residence_location') {
                    handle_multiple_table_instances(row, 10, this.toString(), 'maritime_workers_list', null, null, worker_locs, null, 'LOCS');
                }
            });
        });


        ////////////////////////////////////////////////////////////////////////////// 
       // console.log(displacements)
        $.each(displacements, function (cnt) {
            var transaction_persons = new Object();
            var transaction_locs = new Object();
            var persons_tbl = new Object();
            var ship_obj = new Object();
            var ships_tbl = new Object();
            var terms = new Object();
            console.log('--------exporting instances from nested table '+cnt+'--------------');
            $.each(this, function (row) {
                var row_data = this;  
                
                $.each(this, function (col) {
                     ///////////////////////////////////////////   
                        var val = this.toString();                      
                            $.each(displacement_columns, function (col_no) {                                
                                if (($(this).attr('vocab')) && (($(this).attr('data')) === col) && (val.indexOf('[object Window]')<0)) {
                                    var label = $(this).attr('vocab');                                                                      
                                    handle_vocabulary(val, label, this);
                                    handle_json_vocs(val, label, row, col, col_no, 'displacement_' + cnt, terms);
                                    
                                }
                            });
                /////////////////////////////////////
                    if ((col === 'displacement_captain_surname')) {
                        if ((row_data['displacement_captain_name'])) {
                            handle_multiple_table_instances(row, 4, row_data['displacement_captain_name'], 'displacement_' + cnt, [4, 5], ['name', 'surname_a'], transaction_persons, persons_tbl, 'PERSONS');
                        }
                        handle_multiple_table_instances(row,5, row_data['displacement_captain_surname'], 'displacement_' + cnt, [4, 5], ['name', 'surname_a'], transaction_persons, persons_tbl, 'PERSONS');
                    } else if ((col === 'displacement_ship_name')) {
                        handle_ships(row + "_", 1, row_data['displacement_ship_name'], 'displacement_' + cnt, [1, 0, 2], ['name', 'type', 'registration_number'], 'SHIPS',ship_obj,ships_tbl);
                        handle_ships(row + "_", 0, row_data['displacement_ship_type'], 'displacement_' + cnt, [1, 0, 2], ['name', 'type', 'registration_number'], 'SHIPS',ship_obj,ships_tbl);
                        handle_ships(row + "_", 2, row_data['displacement_registration_number'], 'displacement_' + cnt, [1, 0, 2], ['name', 'type', 'registration_number'], 'SHIPS',ship_obj,ships_tbl);
                    } else if (col === 'displacement_destination') {
                        handle_multiple_table_instances(row, 6, this.toString(), 'displacement_' + cnt, null, null, transaction_locs, null, 'LOCS');
                    } else if (col === 'displacement_embarkation_location') {
                        handle_multiple_table_instances(row, 7, this.toString(), 'displacement_' + cnt, null, null, transaction_locs, null, 'LOCS');
                    } else if (col === 'displacement_discharge_location') {
                        handle_multiple_table_instances(row, 9, this.toString(), 'displacement_' + cnt, null, null, transaction_locs, null, 'LOCS');
                    } else if (col === 'intermediate_port') {
                        handle_multiple_table_instances(row, 13, this.toString(), 'displacement_' + cnt, null, null, transaction_locs, null, 'LOCS');
                    }
                });
            });
        });
    }
            
            
            
    update_Vocs();
  //  console.log(terms_json)
    update_Vocs_from_json(terms_json);         

    return json;
}
;

//////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////// Load File /////////////////////////////////////////////
var nested_tables = new Object();
var url = new URL(window.location.href);
var mode = url.searchParams.get("mode");
var nested_tables_object = new Object();

var record_status;

function load(data,status) {
    
    console.log(status);
    record_status = status;    
    clear_LocalStorage_instances();

    catalogue_info.loadData(data.record_information);
    source_identity_data.loadData(data.source_identity);


    var voyages_data = new Array();
    $.each(data.maritime_workers_list, function() {
        voyages_data.push(this);
    });

    workers_hot.loadData(voyages_data);
    $('.nested_table').remove();

    if (data.displacement_list) {
        
        nested_tables_object = data.displacement_list;
        
        $.each(data.displacement_list, function(cnt) {
            var voyages_trans = new Array();
            $.each(this, function() {
                voyages_trans.push(this);
            });
            
            if (mode === 'teamView') {
                nested_tables[cnt] = voyages_trans;
            } else {
                nested_tables[cnt] = voyages_trans;
                //createNestedTable(cnt, voyages_trans);
               // $(".nested_table").hide();
            }
        });
    }

    update_Vocs();

}
;

////////////////////////////////////////////////////////////////////////////////
/////////////////////////EXCEL EXPORT////////////////////////////////////////


$('#excelexport').click(function() {

    var json = createRecordJson('excel');
    var temp = JSON.stringify(json);
    temp = temp.replace(/&nbsp;/g, "");
    json = JSON.parse(temp);

    var payrol_analysis = new Array();
    $.each(json.displacement_list, function(cnt) {
        $.each(this, function() {
            payrol_analysis.push(Object.assign({}, (json.maritime_workers_list[cnt]), (this)));
        });
    });

    if (payrol_analysis.length < 1) {
        payrol_analysis.push('');
    }

    var sheets = new Array();
    sheets.push([json.record_information]);
    sheets.push([json.source_identity]);
    sheets.push(json.maritime_workers_list);
    sheets.push(payrol_analysis);

    var groupTables = createMultipleTables(json['maritime_workers_list'], maritime_workers_listGroups, workers_cols);
    var result = createExcelSheetsData(sheets, groupTables);

    var nestedGroups = createMultipleNestedTables(json['displacement_list'], displacementsGroups, workers_cols, displacement_columns);
    result = createExcelSheetsData(sheets, nestedGroups);

    var opts = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Source Identity', header: false}, {sheetid: 'Maritime Workers List', header: true}, {sheetid: 'Displacement List', header: true}];
    var res = alasql('SELECT * INTO XLSX("' + $('#unique_filename').text() + '.xlsx",?) FROM ?', [opts, result]);
});


///////////////////////////////////////////////////////////////////////////////
/////////////////////////// Loading icon ///////////////////////////////////////
$(window).load(function() {
    $(".spin_loader").fadeOut("slow");
});



//////////////////Update Vocabularies on pouch DB

function update_Vocs() {
    if (mode === null) {//only update vocabularies in edit mode


        var tables = [];
        var voyage_keys = Object.keys(displacement_list);

        for (var i = 0; i < voyage_keys.length; i++) {
            tables.push(displacement_list[voyage_keys[i]]);
        }
        tables.push(catalogue_info, source_identity_data, workers_hot);
        updateVocabs(tables);
        console.log('Vocabularies successfully updated!');
    }
}
;


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

    if (new_term !== old_term) {

        var tmp = occs;
        var real_occs = maxify_occurencies(tmp);

        $.each(real_occs, function() {
            var table_id = this.tableVariable;
            var old_val = "";
            //console.log(this.tableVariable);
            if (table_id === "source_identity") {
                old_val = source_identity_data.getDataAtCell(this.row, this.col, value);
                source_identity_data.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "maritime_workers_list") {
                old_val = workers_hot.getDataAtCell(this.row, this.col, value);
                workers_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id.indexOf("displacements") !== -1) {
                var cnt = table_id.replace("displacements", "");
                old_val = displacement_list[cnt].getDataAtCell(this.row, this.col, value);
                displacement_list[cnt].setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "catalogue_info") {
                old_val = catalogue_info.getDataAtCell(this.row, this.col, value);
                catalogue_info.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            }
        });
    }
}
;

////////////////////////// BIG TEXTs ////////////////////////////////

function set_Text_val(row, col, val, parentTable) {

    if (parentTable === "source_identity") {
        source_identity_data.setDataAtCell(row, col, val);
    } else if (parentTable === "maritime_workers_list") {
        workers_hot.setDataAtCell(row, col, val);
    } else if (parentTable.indexOf("displacements") !== -1) {
        var cnt = parentTable.replace("displacements", "");
        displacement_list[cnt].setDataAtCell(row, col, val);
    }
}
;




///////////////////////////EXPORT TO XML//////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////
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
    tmp['record_information']['related_organization'] = 'NAVLAB-Università di Genova';
    tmp['record_information']['record_id'] = recordId;
    tmp['record_information']['template_type'] = templateTitle;
    tmp['source_identity'] = json.source_identity;
    tmp['source_identity']['source_language'] = 'Italian';

    ////////////////MULTIPLE TABLE WITH GROUPS AND NESTED/////////////////////// 
    var nested_groups = nested_with_Groups(json.displacement_list, json.maritime_workers_list, displacementsGroups, displacement_columns, 'displacement_list', 'displacement_');
    var simple_groups = simple_with_Groups(json.maritime_workers_list, maritime_workers_listGroups, workers_cols);
    tmp['maritime_workers_list'] = merge_Groups_Nested(nested_groups, simple_groups, maritime_workers_listGroups, 'displacement_', workers_cols);
    //////////////////

    root['root'] = tmp;
    console.log(root);
    var xml = formatXml(json2xml(root));


    xml = xml.replace(/<displacement_(\d+)>/g, '<displacement index="$1">');
    xml = xml.replace(/<\/displacement_(\d+)>/g, "</displacement>");

    xml = xml.replace(/<row_(\d+)>/g, '<row index="$1">');
    xml = xml.replace(/<\/row_(\d+)>/g, "</row>");

    xml = xml.replace(/<group_data_(\d+)>/g, '<group_data index="$1">');
    xml = xml.replace(/<\/group_data_(\d+)>/g, "</group_data>");


    return (xml);
}
;