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
                {data: 'role_in_project', type: 'dropdown',source: project_role_vocab}
            ];
            nestedHeaders = [
                ['Name', 'Surname', 'Role']
            ];
            data = setSubTableData(catalogue_info, row, startCol, endCol);

        } else if (subTableName.indexOf("main_occupants") !== -1) {
            var cnt = parentTableName.replace("list_of_occupants", "");
            var cols = [
                {data: 'person_main_occupation', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_capacity_role_ru")), vocab: 'status_capacity_role_ru'}
            ];
            nestedHeaders = [
                ['Main']
            ];
            data = setSubTableData(list_of_occupants[cnt], row, startCol, endCol);
        } else if (subTableName.indexOf("secondary_occupants") !== -1) {
            var cnt = parentTableName.replace("list_of_occupants", "");
            var cols = [
                {data: 'person_secondary_occupation', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_capacity_role_ru")), vocab: 'status_capacity_role_ru'}
            ];
            nestedHeaders = [
                ['Secondary']
            ];
            data = setSubTableData(list_of_occupants[cnt], row, startCol, endCol);
        } else if (subTableName.indexOf("household_roles") !== -1) {
            var cnt = parentTableName.replace("list_of_occupants", "");
            var cols = [
                {data: 'person_role_in_household', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("person_to_person_relation_ru")), vocab: 'person_to_person_relation_ru'}
            ];
            nestedHeaders = [
                ['Role in Household']
            ];
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
tablesAndHeaders.set(tableId, ['Name', 'Location', 'Fond *', 'Serie *', 'File*', 'City', 'District', 'Street Name *', 'House Number *', 'Date of Document *', 'Note', 'Comment']);
tablesWithoutCommentCols.set(tableId, [0, 1, 10]); //define fieds that do not have external content

var sourcedata = [
    {archive: ''}
];


var source_identity_cols = [
    {data: 'archive_library', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("archive_or_library_ru")), vocab: 'archive_or_library_ru'},
    {data: 'source_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_ru")), vocab: 'location_ru'},
    {data: 'fonds', type: 'text'},
    {data: 'serie', type: 'text'},
    {data: 'file', type: 'text'},
    {data: 'city', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("city_ru")), vocab: 'city_ru'},
    {data: 'district', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("district_ru")), vocab: 'district_ru'},
    {data: 'street_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("street_name_ru")), vocab: 'street_name_ru'},
    {data: 'street_number', type: 'text'},
    {data: 'date_of_document', type: 'date'},
    {data: 'residencies_note', renderer: textRender, readOnly: true, type: 'text'},
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
    maxRows: 1,
    className: "htCenter htMiddle",
    currentRowClassName: 'currentRow',
    autoWrapRow: true,
    contextMenu: false,
    colHeaders: tablesAndHeaders.get(tableId),
    nestedHeaders: [
        [{label: 'Archive / Library', colspan: 2}, {label: '', colspan: 9}],
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
        if ((source_identity_cols[col].vocab === 'archive_or_library_ru')&& value ) {
            handle_organizations(value,'source_identity',row, col, 'ORGS');
        }else if (col===1 && value ) {
            handle_locations(value,'source_identity',row ,col,'LOCS',source_locs);   
        }else if (col===5 && value ) {
            handle_locations(value,'source_identity',row ,col,'LOCS',source_locs);   
        }else if (col===6 && value ) {
            handle_locations(value,'source_identity',row ,col,'LOCS',source_locs);   
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
            "hsep3": "---------",
            "copy": {},
            "cut": {},
            "hsep2": "---------",
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
var tableId = "example1";
tablesAndHeaders.set(tableId, ['Folio', 'Apartment Number', 'List of Occupants Registry', 'Note', 'Comment'])
tablesWithoutCommentCols.set(tableId, [2, 3]); //define fieds that do not have external content

var residencies_data = [
    {source_pages: ""}, {source_pages: ""}, {source_pages: ""},
    {source_pages: ""}, {source_pages: ""}, {source_pages: ""},
    {source_pages: ""}, {source_pages: ""}, {source_pages: ""},
    {source_pages: ""}, {source_pages: ""}, {source_pages: ""},
    {source_pages: ""}, {source_pages: ""}, {source_pages: ""}
];

var residencies_cols = [
    {data: 'source_pages', type: 'text'},
    {data: 'apartment_number', type: 'text'},
    {data: 'list_of_occupants', renderer: buttonRenderer, readOnly: true},
    {data: 'note',renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];

function buttonRenderer(instance, td, row, col, prop, value, cellProperties) {

    var title = instance.getDataAtCell(row, 1);
    if (title) {
        title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
    }
    td.innerHTML = "<a onclick='createNestedTable(" + row + "," + null + ",\"" + title + "\")'> <button id='Row_" + row + "' style='padding:2px; font-size:8px;' type='button' class=' nested_button btn btn-outline-secondary'>Nested table</button></a>";
    td.className = 'htCenter';
    return td;
}

var cont = document.getElementById(tableId);
var residencies_hot = new Handsontable(cont, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: residencies_data,
    columns: residencies_cols,
    contextMenu: true,
    className: "htCenter",
    currentRowClassName: 'currentRow',
    rowHeaders: true,
    autoWrapRow: true,
    manualColumnResize: true,
    allowInvalid: true,
    colHeaders: tablesAndHeaders.get(tableId),
    nestedHeaders: [
        tablesAndHeaders.get(tableId)
    ],
    /* Next 3 properties added to support comments*/
    comments: true,
    hiddenColumns: {
        columns: [tablesAndHeaders.get(tableId).length - 1] //last column only
    },
    afterLoadData: function() {
        addCommentForContentFoundOutsideTheSource(this);
    }
});


residencies_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'col1') {
                create_voc_modal('location_ru');
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
                    return residencies_hot.countRows() - 1 !== residencies_hot.getSelected()[0];
                },
                callback: function() {
                    this.alter('insert_row', this.getSelected()[0] + 1, 10);
                }
            },
            "hsep6": "---------",
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
    {data: 'folio_of_source', type: 'text'},
    {data: 'family_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_ru")), vocab: 'surname_ru', renderer: groupRenderer},
    {data: 'person_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_ru")), vocab: 'name_ru', renderer: groupRenderer},
    {data: 'person_patronymic', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_ru")), vocab: 'name_ru'},
    {data: 'person_sex', type: 'dropdown',
        source: ['Male', 'Female']},
    {data: 'person_role_in_household', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("person_to_person_relation_ru")), vocab: 'person_to_person_relation_ru', renderer: groupRenderer},
    {data: 'related_person_number', type: 'text'},
    {data: 'person_age', type: 'text'},
    {data: 'person_age_months', type: 'text'},
    {data: 'person_age_days', type: 'text'},
    {data: 'person_marital_status', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("marital_status_ru")), vocab: 'marital_status_ru'},
    {data: 'person_estate', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("social_status_ru")), vocab: 'social_status_ru'},
    {data: 'person_birth_country', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("country_ru")), vocab: 'country_ru'},
    {data: 'person_birth_governorate', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("governorate_ru")), vocab: 'governorate_ru'},
    {data: 'person_birth_district', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("district_ru")), vocab: 'district_ru'},
    {data: 'person_birth_township', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("township_ru")), vocab: 'township_ru'},
    {data: 'person_birth_city', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("city_ru")), vocab: 'city_ru'},
    {data: 'person_birth_village', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("village_ru")), vocab: 'village_ru'},
    {data: 'person_registration_country', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("country_ru")), vocab: 'country_ru'},
    {data: 'person_registration_governorate', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("governorate")), vocab: 'governorate_ru'},
    {data: 'person_registration_district', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("district_ru")), vocab: 'district_ru'},
    {data: 'person_registration_township', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("township_ru")), vocab: 'township_ru'},
    {data: 'person_registration_city', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("city_ru")), vocab: 'city_ru'},
    {data: 'person_registration_village', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("village_ru")), vocab: 'village_ru'},
    {data: 'person_residense_country', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("country_ru")), vocab: 'country_ru'},
    {data: 'person_residense_district', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("district_ru")), vocab: 'district_ru'},
    {data: 'person_residense_district', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("district_ru")), vocab: 'district_ru'},
    {data: 'person_residense_township', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("township_ru")), vocab: 'township_ru'},
    {data: 'person_residense_city', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("city_ru")), vocab: 'city_ru'},
    {data: 'person_residense_village', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("village_ru")), vocab: 'village_ru'},
    {data: 'person_residense_absence', type: 'text'},
    {data: 'person_religion', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("religion_ru")), vocab: 'religion_ru'},
    {data: 'person_native_language', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("language_ru")), vocab: 'language_ru'},
    {data: 'person_literacy_type', type: 'dropdown',
        source: ['Literate', 'Illiterate']},
    {data: 'person_graduation_foundation', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("educational_institution_ru")), vocab: 'educational_institution_ru'},
    {data: 'person_main_occupation', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_ru")), vocab: 'status_capacity_role_ru', renderer: groupRenderer},
    {data: 'person_secondary_occupation', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_ru")), vocab: 'status_capacity_role_ru', renderer: groupRenderer},
    {data: 'related_occupation_person_number', type: 'text'},
    {data: 'occupants_note',renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];

var list_of_occupantsGroups = [[5, 5], [35, 35], [36, 36]];
var persons_tbl = new Object();

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

    var table_header = "";
    if (!((header == null) || (header == "null"))) {
        table_header = ' / Apartment Number : ' + header;
    }

    var plus = parseInt(cnt) + 1;

    var html = "<div  class='panel panel-default nested_table not_visible' style='border:transparent; margin-top:5px;'>" +
            "<div class='panel-heading' role='tab' id='heading" + cnt + "'>" +
            "<h4 class='panel-title'>" +
            "    <a style='background-color:#589AAF;' class='collapsed' role='button' onclick='close_nested(" + cnt + ")'  href='#collapse" + cnt + "'>" +
            "<span class='pull-right glyphicon glyphicon-remove'></span>" + "List of Occupants Registry " + plus + table_header +
            "     </a>" +
            "</h4>" +
            "</div>" +
            "<div id='collapse" + cnt + "' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='heading" + cnt + "'>" +
            "    <div style='padding-top:6px;'  class='panel-body'>" +
            "    <span style=' color:#163758; padding:0px;font-size: 11px'>Use the source language to fill in the fields of this table</span>" +
            "        <div>" +
            "            <div id='list_of_occupants" + cnt + "' class='hot handsontable htRowHeaders htColumnHeaders' style='height: 450px; overflow: hidden; width: 100%; margin:5px 0px 0px 4px;'></div>" +
            "        </div> " +
            "    </div>" +
            "</div>" +
            "</div>";

    if ($('#heading' + cnt).size() === 0) {

        $('#insert_here').append(html);

        if (data == null) {
            data = [{page_of_source: ""}, {page_of_source: ""}, {page_of_source: ""}, {page_of_source: ""}, {page_of_source: ""},
                {page_of_source: ""}, {page_of_source: ""}, {page_of_source: ""}, {page_of_source: ""}, {page_of_source: ""},
                {page_of_source: ""}, {page_of_source: ""}, {page_of_source: ""}, {page_of_source: ""}, {page_of_source: ""}, ];
            $('#Row_' + cnt).css({'background-color': '#638BC7'});
            $('#Row_' + cnt).css({'color': '#ffffff'});
            $("#Row_" + cnt).addClass('full_data');
        }
        else {
            $("#Row_" + cnt).addClass('full_data');
            $("#Row_" + cnt).css("background-color", "#C4C4C4");
            $("#Row_" + cnt).css("color", "#1C6799");
        }
        var tableId = 'list_of_occupants' + cnt;
        tablesAndHeaders.set('list_of_occupants', ['Folio of Source', 'Family Name', 'Name', 'Patronymic', 'Sex', 'Role in Household', 'Related Person Number', 'Year', 'Months', 'Days', 'Marital Status', 'Estate',
            'Country', 'Governorate', 'District', 'Township', 'City', 'Village',
            'Country', 'Governorate', 'District', 'Township', 'City', 'Village',
            'Country', 'Governorate', 'District', 'Township', 'City', 'Village',
            'Notice of Absence', 'Religion', 'Native Language', 'Type', 'Graduation foundation', 'Main', 'Secondary', 'Related Person Number', 'Note', 'Comment']);
        tablesWithoutCommentCols.set(tableId, [38]); //define fieds that do not have external content

        var container = document.getElementById(tableId);


        var headers = [
            ['', {label: 'Person', colspan: 38}, ''],
            ['', '', '', '', '', '', '', {label: 'Age', colspan: 3}, '', '', {label: 'Place of Birth', colspan: 6}, {label: 'Place of Registration', colspan: 6}, {label: 'Regular place of Residence', colspan: 6}, '', '', '', {label: 'Literacy', colspan: 2}, {label: 'Occupation', colspan: 3}, ''],
            tablesAndHeaders.get('list_of_occupants')

        ];


        headers = markHeaders(headers, list_of_occupantsGroups);
        var transaction_persons = new Object();

        var list_of_Occupant = new Handsontable(container, {
            licenseKey: '',
            dateFormat: 'YYYY-MM-DD',
            data: data,
            columns: list_of_occupants_columns,
            manualColumnResize: true,
            contextMenu: true,
            autoWrapRow: true,
            currentRowClassName: 'currentRow',
            className: "htCenter htMiddle",
            colHeaders: tablesAndHeaders.get('list_of_occupants'),
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
                columns: [tablesAndHeaders.get('list_of_occupants').length - 1] //last column only
            },
            afterLoadData: function() {
                addCommentForContentFoundOutsideTheSource(this);
            },
            afterRender: function() {
                markGroups(this);
            },
            afterSelectionEnd: function(row, col) {
                markGroups(this);
                if (col === 35) {
                    groupLeftClicked(this, row, col);
                } else if (col === 36) {
                    groupLeftClicked(this, row, col);
                } else if (col === 5) {
                    groupLeftClicked(this, row, col);
                }
            }
        });

        list_of_Occupant.updateSettings({
            contextMenu: {
                callback: function(key, options) {
                    if (key === 'edit_vocabulary') {
                        var col = options.start.col;
                        create_voc_modal(list_of_occupants_columns[col].vocab);
                    }
                    else if (key === 'add') {
                        var colClicked = list_of_Occupant.getSelectedRange().to.col;
                        var rowClicked = list_of_Occupant.getSelectedRange().to.row;
                        if (colClicked === 35) {
                            groupClicked('list_of_occupants' + cnt, "main_occupants", rowClicked, 35, 35);
                        } else if (colClicked === 36) {
                            groupClicked('list_of_occupants' + cnt, "secondary_occupants", rowClicked, 36, 36);
                        } else if (colClicked === 5) {
                            groupClicked('list_of_occupants' + cnt, "household_roles", rowClicked, 5, 5);
                        }/* else if (colClicked === 1) {
                         groupClicked('list_of_occupants' + cnt, "family_names", rowClicked, 1, 1);
                         } else if (colClicked === 2) {
                         groupClicked('list_of_occupants' + cnt, "first_names", rowClicked, 2, 2);
                         }*/

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
                            return list_of_Occupant.getSelected()[0] === 0;
                        }
                    },
                    "row_below": {},
                    "add10rows": {
                        name: "Add 10 rows",
                        callback: function() {
                            this.alter('insert_row', this.getSelected()[0] + 1, 10);
                        }
                    },
                    "hsep1": "---------",
                    "remove_row": {
                        disabled: function() {
                            if (((list_of_Occupant.getSelected()[0]) < 3) || ((list_of_Occupant.getSelected()[2]) < 3)) {
                                return true;
                            }
                        }
                    },
                    "hsep2": "---------",
                    "edit_vocabulary": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            var col = list_of_Occupant.getSelectedRange().to.col;
                            var label = list_of_occupants_columns[col].vocab;
                            if (label) {
                                update_Vocs();
                                return list_of_Occupant.getSelectedRange().to.col !== col;
                            } else {
                                return list_of_Occupant.getSelectedRange().to.col !== -1;
                            }
                        }},
                    "add": {
                        name: "Add table",
                        hidden: function() {
                            return isAddTableMenuVisible(this, list_of_occupantsGroups);

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
        list_of_occupants[cnt] = list_of_Occupant;
    }
    else {
        if (!((header == null) || (header == "null"))) {
            $('#heading' + cnt).children().children().html('<span class="pull-right glyphicon glyphicon-remove"></span>List of Occupants Registry ' + plus + ' / Apartment Number : ' + header);
        }

        $('#Row_' + cnt).css({'background': '#638BC7'});
        $('#Row_' + cnt).css({'color': '#ffffff'});
    }

}
;
////////////////////////////////////////////////////////////////////////////////


function createRecordJson(usage) {
    var tables = [];

    var cat_info = createJson(catalogue_info, cols1, usage);
    var source_id = createJson(source_identity_data, source_identity_cols, usage);
    var source_contents = createJson(residencies_hot, residencies_cols, usage);
    var occupants_keys = Object.keys(list_of_occupants);
    var occupants = new Object();
    
    
    
    if (((usage === 'excel') && (nested_tables)) || ((mode === 'teamView') && (nested_tables))) {

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
    } else {
        occupants = nested_tables_object;   
        for (var i = 0; i < occupants_keys.length; i++) {
            occupants[occupants_keys[i]] = createJson((list_of_occupants[occupants_keys[i]]), list_of_occupants_columns, usage);
            tables.push(list_of_occupants[occupants_keys[i]]);
        }
    }

    var json = new Object();

    cat_info.date_until = getCurrentDate();
    catalogue_info.setDataAtCell(0, 2, getCurrentDate());
    json['record_information'] = cat_info;
    json['source_identity'] = source_id;
    json['residencies_registry'] = source_contents;
    json['list_of_occupants'] = occupants;

    //tables.push(catalogue_info, source_identity_data, residencies_hot);
    //updateVocabs(tables);

    update_Vocs();
    //////////////Odessa special location  handling
    var transaction_locs = new Object();    
    handle_odessa_locations(occupants,"list_of_occupants_",'LOCS',transaction_locs);    
    //////////////////////////////////////////////////////////////////////////////////
    //  FATHERS INSTANCES HANDLING
    
  
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
       ///////////////////                                       
    $.each(occupants, function (cnt) {
        var occupants_persons = new Object();
        var occupants_tbl = new Object();
        var terms = new Object();
        console.log('------------ handling nested table '+cnt+'-----------');
        $.each(this, function (row) {
            var row_data = this;
            $.each(this, function (col) {                
                 //////////////handle vocabulary nested//////////////////                
                    var val = this;
                    $.each(list_of_occupants_columns, function (col_no) {
                        if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                            var label = $(this).attr('vocab');
                            handle_vocabulary(val, label, this);
                            handle_json_vocs(val,label,row,col,col_no, 'occupant_registry_'+cnt,terms);
                        }
                    });
                    //////////////////////////////////////////////////////
                 if ((col === 'person_patronymic')) {                                                           
                    if ((row_data['person_name'])){                                                        
                        handle_multiple_table_instances(row,2,row_data['person_name'], 'occupant_registry_'+cnt,[2, 1, 3], ['name', 'surname_a', 'fathers_name'],occupants_persons, occupants_tbl,'PERSONS');                        
                    }
                   if ((row_data['family_name'])){                                                        
                        handle_multiple_table_instances(row,1,row_data['family_name'], 'occupant_registry_'+cnt,[2, 1, 3], ['name', 'surname_a', 'fathers_name'],occupants_persons, occupants_tbl,'PERSONS');
                        handle_persons(row + '_', 1, row_data['family_name'], 'occupant_registry_' + cnt, [3,1], [ 'name','surname_a'], occupants_persons, occupants_tbl, 'PERSONS');                    
             
                    }
                    handle_multiple_table_instances(row,3,row_data['person_patronymic'], 'occupant_registry_'+cnt,[2, 1, 3], ['name', 'surname_a', 'fathers_name'],occupants_persons, occupants_tbl,'PERSONS');
                    handle_persons(row + '_', 3, row_data['person_patronymic'], 'occupant_registry_' + cnt, [3,1], ['name','surname_a' ], occupants_persons, occupants_tbl, 'PERSONS');
                    //handle_persons(row + '_', 1, row_data['family_name'], 'occupant_registry_' + cnt, [3,1], [ 'name','surname_a'], occupants_persons, occupants_tbl, 'PERSONS');                    
                }/*else  if (col === 'person_graduation_foundation') {                    
                    handle_multiple_table_instances(row,34,row_data['person_graduation_foundation'], 'occupant_registry_' + cnt,null, null,null,null, 'ORGS');
                }*/
            });         
        });       
    });
    }
    
    ///////////////////////////////////////////////////////////////////////////
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
    var occupants_keys = Object.keys(list_of_occupants);

    for (var i = 0; i < occupants_keys.length; i++) {
        tables.push(list_of_occupants[occupants_keys[i]]);
    }

    tables.push(catalogue_info, source_identity_data, residencies_hot);
    updateVocabs(tables);
    console.log('Vocabularies successfully updated!');
        }
}
;


///////////////////////////////EXPORT IMPORT///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
/////////// Loading icon
$(window).load(function() {
    $(".spin_loader").fadeOut("slow");
});

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

/////////////// analytic 
    var residencies_data = new Array();
    $.each(data.residencies_registry, function() {
        residencies_data.push(this);
    });

    residencies_hot.loadData(residencies_data);

    if (data.list_of_occupants) {
        
        nested_tables_object = data.list_of_occupants;
        
        $.each(data.list_of_occupants, function(cnt) {
            
            var analytic_ship_list = new Array();
            
            $.each(this, function() {
                analytic_ship_list.push(this);
            });
            
             if (mode === 'teamView') {
                nested_tables[cnt] = analytic_ship_list;
            } else {
                nested_tables[cnt] = analytic_ship_list;
                //createNestedTable(cnt, analytic_ship_list);
                //$(".nested_table").hide();
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

    var list = new Array();

    $.each(json.list_of_occupants, function(cnt) {
        $.each(this, function() {
            list.push(Object.assign({}, (json.residencies_registry[cnt]), (this)));
        });
    });

    if (list.length < 1) {
        list.push('');
    }

    var sheets = new Array();
    sheets.push([json.record_information]);
    sheets.push([json.source_identity]);
    sheets.push(json.residencies_registry);
    sheets.push(list);

    var nestedGroups = createMultipleNestedTables(json['list_of_occupants'], list_of_occupantsGroups, residencies_cols, list_of_occupants_columns);
    var result = createExcelSheetsData(sheets, nestedGroups);

    var opts = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Source Identity', header: false}, {sheetid: 'Residencies Registry', header: true}, {sheetid: 'List Of Occupants', header: true}];
    var res = alasql('SELECT * INTO XLSX("' + $('#unique_filename').text() + '.xlsx",?) FROM ?', [opts, result]);

});

////////////////////////////////////////////////////////////////////////////////
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
            } else if (table_id === "example1") {
                old_val = residencies_hot.getDataAtCell(this.row, this.col, value);
                residencies_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            }
            else if (table_id.indexOf("list_of_occupants") !== -1) {
                var cnt = table_id.replace("list_of_occupants", "");
                old_val = list_of_occupants[cnt].getDataAtCell(this.row, this.col, value);
                list_of_occupants[cnt].setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            }
            else if (table_id === "catalogue_info") {
                old_val = catalogue_info.getDataAtCell(this.row, this.col, value);
                catalogue_info.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            }
        });
    }
}
;
////////////////////////// BIG TEXTs ////////////////////////////////

function set_Text_val(row, col, val, parentTable) {
    
    if (parentTable.indexOf("list_of_occupants") !== -1) {
        var cnt = parentTable.replace("list_of_occupants", "");
        list_of_occupants[cnt].setDataAtCell(row, col, val);
    }else if(parentTable ==="source_identity") {
        source_identity_data.setDataAtCell(row, col, val);        
    }else if(parentTable === "example1") {
        residencies_hot.setDataAtCell(row, col, val);        
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
    tmp['source_identity']['source_language'] = 'Russian';
    tmp['residencies_registry'] = nested_with_Groups(json.list_of_occupants, json.residencies_registry, list_of_occupantsGroups, list_of_occupants_columns, 'list_of_occupants', 'occupants_registry_');

    root['root'] = tmp;
    var xml = formatXml(json2xml(root));


    xml = xml.replace(/<occupants_registry_(\d+)>/g, '<occupants_registry index="$1">');
    xml = xml.replace(/<\/occupants_registry_(\d+)>/g, "</occupants_registry>");

    xml = xml.replace(/<row_(\d+)>/g, '<row index="$1">');
    xml = xml.replace(/<\/row_(\d+)>/g, "</row>");

    xml = xml.replace(/<group_data_(\d+)>/g, '<group_data index="$1">');
    xml = xml.replace(/<\/group_data_(\d+)>/g, "</group_data>");


    return (xml);
}
;