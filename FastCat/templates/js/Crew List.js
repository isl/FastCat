/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


////////////////////////////////  Big Text Fields   /////////////////////////////

/* *************************************************************************** */

function set_Text_val(row, col, val, parentTable) {

    if (parentTable === 'source_identity') {
        source_identity_data.setDataAtCell(row, col, val);
    }
    else if (parentTable === 'identifier_table') {
        ship_record_hot.setDataAtCell(row, col, val);
    }
    else if (parentTable === 'free_text_intro') {
        free_text_hot.setDataAtCell(row, col, val);
    }
    else if (parentTable === 'crew_list') {
        crew_hot.setDataAtCell(row, col, val);
    }
    else if (parentTable === 'ports_of_call') {
        call_ports_hot.setDataAtCell(row, col, val);
    }
    
}
;


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

        } else if (subTableName === "previous_names") {
            var cols = [
                {data: 'ship_previous_names', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("ship_name_es")), vocab: 'ship_name_es'}
            ];
            nestedHeaders = [
                ['Previous Names']
            ];
            data = setSubTableData(ship_record_hot, row, startCol, endCol);

        } else if (subTableName === "ownerPersons") {
            var cols = [
                {data: 'owner_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es'},
                {data: 'owner_surname_A', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
                {data: 'owner_surname_B', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
                {data: 'owner_residence', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'}
            ];
            nestedHeaders = [
                ['Name', 'Surname A', 'Surname B', 'Residence']
            ];
            data = setSubTableData(ship_record_hot, row, startCol, endCol);
        }
        else if (subTableName === "ownerOrganizations") {
            var cols = [
                {data: 'organization_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("organization_es")), vocab: 'organization_es'},
                {data: 'organization_location', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'}
            ];
            nestedHeaders = [
                ['Name', 'Headquarters Location']
            ];
            data = setSubTableData(ship_record_hot, row, startCol, endCol);

        }
        else if (subTableName === "tonnages") {
            var cols = [
                {data: 'tonnage_type', type: 'text'},
                {data: 'tonnage_value', type: 'text'}
            ];
            nestedHeaders = [
                ['Type', 'Value']
            ];
            data = setSubTableData(ship_record_hot, row, startCol, endCol);

        }
        else if (subTableName === "measurements") {
            var cols = [
                {data: 'ship_measurement_type', type: 'dropdown',
                    source: ['Eslora', 'Manga', 'Puntal']},
                {data: 'ship_measurement_value', type: 'text'}
            ];
            nestedHeaders = [
                ['Type', 'Value']
            ];
            data = setSubTableData(ship_record_hot, row, startCol, endCol);

        }
        else if (subTableName === "horsepowers") {
            var cols = [
                {data: 'horsepower_type', type: 'dropdown',
                    source: ['Nominal horsepower (NHP)', 'Shaft horsepower (SHP)', 'Indicated horsepower (IHP)']},
                {data: 'horsepower_value', type: 'text'}
            ];
            nestedHeaders = [
                ['Type', 'Value']
            ];
            data = setSubTableData(ship_record_hot, row, startCol, endCol);

        }
        else if (subTableName === "signed_by") {
            var cols = [
                {data: 'company_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("organization_es")), vocab: 'organization_es'},
                {data: 'company_location', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
                {data: 'agency_category', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("type_of_organization_es")), vocab: 'type_of_organization_es'}
            ];
            nestedHeaders = [
                ['Company Name', 'Headquarter Location', 'Category of agency']
            ];
            data = setSubTableData(ship_record_hot, row, startCol, endCol);
        }
        else if (subTableName === "cargos") {
            var cols = [
                {data: 'departure_cargo_type', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("good_type_es")), vocab: 'good_type_es'},
                {data: 'departure_cargo_quantity_value', type: 'text'},
                {data: 'departure_cargo_quantity_unit', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("unit_es")), vocab: 'unit_es'}
            ];
            nestedHeaders = [
                ['Type', 'Value', 'Unit']
            ];
            data = setSubTableData(call_ports_hot, row, startCol, endCol);
        }
        else if (subTableName === "professions") {
            var cols = [
                {data: 'crew_profession_type', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_capacity_role_es")), vocab: 'status_capacity_role_es'},
                {data: 'crew_profession_date', type: 'text'}
            ];
            nestedHeaders = [
                ['Type', 'Date']
            ];
            data = setSubTableData(crew_hot, row, startCol, endCol);
        }
        subTable = createSubTableInstance(tableId, data, cols, nestedHeaders);
    }

    subTable = createSubTableRightMenu(subTable, subTableName, cols);


}




//////////////////////////////   1st TABLE     ////////////////////////////////
///////////////////// FASTCAT RECORD INFORMATION TABLE/////////////////////////

// Moved to Tables.js

//////////////////////////////   2nd TABLE     ////////////////////////////////
////////////////////////SOURCE  IDENTITY///////////////////////////////       
var tablesWithoutCommentCols = new Map();

var tableId = "source_identity";
tablesAndHeaders.set(tableId, ['Name', 'Location', 'Title', 'Number', 'From', 'To/At', 'Name', 'Location','Note', 'Comment']);
tablesWithoutCommentCols.set(tableId, [0, 1, 2, 3, 8]); //define fieds that do not have external content
var source_identity_cols = [
    {data: 'archive_library', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("archive_or_library_es")), vocab: 'archive_or_library_es'},
    {data: 'archive_library_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'inventory_title', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("folder_title_es")), vocab: 'folder_title_es'},
    {data: 'inventory_number', type: 'text'},
    {data: 'date_from', type: 'date'},
    {data: 'date_to', type: 'date'},
    {data: 'issuing_authority_department', type: 'dropdown', source: JSON.parse(localStorage.getItem("local_authority_es")), vocab: 'local_authority_es'},
    {data: 'issuing_authority_location', type: 'dropdown', source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
  
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}
];


var source_container = document.getElementById(tableId);
var headers = [
    [{label: 'Archive / Library', colspan: 2}, {label: 'Folder', colspan: 2}, {label: 'Book Date', colspan: 2}, {label: 'Issuing Authority', colspan: 2}, ''],
    tablesAndHeaders.get(tableId)
];

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
    afterRenderer: function(td, row, col, prop, value) {
        if (col===1 && (value)) {
            handle_locations(value,'source_identity',row,col,'LOCS',source_locs);                     
        }else if (col===7 && (value)) {
            handle_locations(value,'source_identity',row+'_',col,'LOCS',source_locs);                     
        }
        else if ((source_identity_cols[col].vocab === 'archive_or_library_es') && value) {
            handle_organizations(value,'source_identity',row, col, 'ORGS');             
        } else if ((source_identity_cols[col].vocab === 'local_authority_es')&&value) {
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
            } else if (key === 'view_add') {
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
/////////////////////////////SHIP RECORD/////////////////////////////////////////////             
var tableId = "identifier_table";
tablesAndHeaders.set(tableId, ['Digital Source Page', 'Ship name *', 'Previous Names', 'Ship type *', 'Country *', 'Shipyard', 'Date', 'Name', 'Surname A', 'Surname B', 'Residence', 'Name', 'Headquarters Location', 'Folio', 'List', 'Location', 'Number', 'Date', 'Location', 'Type', 'Value', 'Type', 'Value', 'Type', 'Value', 'Navigation Type', 'Telegraphic Code', 'Date of Delivery', 'Company Name', 'Headquarter Location', 'Category of agency', 'Transcription from Source', 'Note', 'Comment']);

tablesWithoutCommentCols.set(tableId, [31]); //define fieds that do not have external content


var sourcedata = [{ship_name: ''}];

var ship_record_cols = [
    {data: 'ship_identity_source_page', type: 'text'},
    {data: 'ship_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_es")), vocab: 'ship_name_es'},
    {data: 'ship_previous_names', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_es")), vocab: 'ship_name_es', renderer: groupRenderer},
    {data: 'ship_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_type_es")), vocab: 'ship_type_es'},
    {data: 'construction_location_country', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("country_es")), vocab: 'country_es'},
    {data: 'construction_location_shipyard', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'construction_location_date', type: 'text'},
    {data: 'owner_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es', renderer: groupRenderer},
    {data: 'owner_surname_A', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es', renderer: groupRenderer},
    {data: 'owner_surname_B', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es', renderer: groupRenderer},
    {data: 'owner_residence', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es', renderer: groupRenderer},
    {data: 'organization_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_es")), vocab: 'organization_es', renderer: groupRenderer},
    {data: 'organization_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es', renderer: groupRenderer},
    {data: 'registration_folio', type: 'text'},
    {data: 'registration_list', type: 'text'},
    {data: 'registration_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'}, {data: 'certificate_of_register_number', type: 'text'},
    {data: 'certificate_of_register_date', type: 'text'},
    {data: 'certificate_of_register_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'tonnage_type', type: 'text', renderer: groupRenderer},
    {data: 'tonnage_value', type: 'text', renderer: groupRenderer},
    {data: 'ship_measurement_type', type: 'dropdown', source: ['Eslora', 'Manga', 'Puntal'], renderer: groupRenderer},
    {data: 'ship_measurement_value', type: 'text', renderer: groupRenderer},
    {data: 'horsepower_type', type: 'dropdown', source: ['Nominal horsepower (NHP)', 'Shaft horsepower (SHP)', 'Indicated horsepower (IHP)'], renderer: groupRenderer},
    {data: 'horsepower_value', type: 'text', renderer: groupRenderer},
    {data: 'navigation_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("navigation_type_es")), vocab: 'navigation_type_es'},
    {data: 'telegraphic_code', type: 'text'},
    {data: 'date_of_delivery', type: 'date'},
    {data: 'company_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_es")), vocab: 'organization_es', renderer: groupRenderer},
    {data: 'company_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es', renderer: groupRenderer},
    {data: 'agency_category', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("type_of_organization_es")), vocab: 'type_of_organization_es', renderer: groupRenderer},
    {data: 'transcription_note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];

        

var ships_persons = new Object();
var persons_tbl = new Object();
var ship_locs = new Object();


/* *************************************************************************** */
var headers = [
    ['', '', '', '', {label: 'Construction', colspan: 3}, {label: 'Owner', colspan: 6}, {label: '', colspan: 3}, {label: '', colspan: 3}, {label: '', colspan: 6}, '', '', '', {label: '', colspan: 3}, ''],
    ['', '', '', '', {label: 'Location', colspan: 2}, '', {label: 'Person', colspan: 4}, {label: 'Organization', colspan: 2}, {label: 'Registration', colspan: 3}, {label: 'Certificate of Register', colspan: 3}, {label: 'Tonnage', colspan: 2}, {label: 'Measurement of Ship (meters)', colspan: 2}, {label: 'Horsepower', colspan: 2}, '', '', '', {label: 'Signed by', colspan: 3}, ''],
    tablesAndHeaders.get(tableId)
];
var identifier_tableGroups = [[2, 2], [7, 10], [11, 12], [19, 20], [21, 22], [23, 24], [28, 30]];

headers = markHeaders(headers, identifier_tableGroups);

var ship_record_container = document.getElementById(tableId);
var ship_record_hot = new Handsontable(ship_record_container, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: sourcedata,
    columns: ship_record_cols,
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
    },
    afterRender: function() {
        markGroups(this);
    },
    afterSelectionEnd: function(row, col) {
        markGroups(this);
        if (col === 2) {
            groupLeftClicked(this, row, col);
        } else if (col > 6 && col < 11) {
            groupLeftClicked(this, row, col);
        } else if (col > 10 && col < 13) {
            groupLeftClicked(this, row, col);
        } else if (col > 18 && col < 21) {
            groupLeftClicked(this, row, col);
        } else if (col > 20 && col < 23) {
            groupLeftClicked(this, row, col);
        } else if (col > 22 && col < 25) {
            groupLeftClicked(this, row, col);
        } else if (col > 27 && col < 31) {
            groupLeftClicked(this, row, col);
        }
    }
});

ship_record_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(ship_record_cols[col].vocab);
            }
            else if (key === 'view_add') {
                var col = options.start.col;
                var row = options.start.row;
                var tableId = this.rootElement.getAttribute("id");
                var value = ship_record_hot.getDataAtCell(options.start.row, options.start.col);
                var label = ship_record_cols[col].vocab;
                create_location_modal(tableId, value, row, col, label);
            }

            else if (key === 'add') {
                var colClicked = ship_record_hot.getSelectedRange().to.col;
                if (colClicked === 2) {
                    groupClicked("identifier_table", "previous_names", 0, 2, 2);
                } else if (colClicked > 6 && colClicked < 11) {
                    groupClicked("identifier_table", "ownerPersons", 0, 7, 10);
                } else if (colClicked > 10 && colClicked < 13) {
                    groupClicked("identifier_table", "ownerOrganizations", 0, 11, 12);
                } else if (colClicked > 18 && colClicked < 21) {
                    groupClicked("identifier_table", "tonnages", 0, 19, 20);
                } else if (colClicked > 20 && colClicked < 23) {
                    groupClicked("identifier_table", "measurements", 0, 21, 22);
                } else if (colClicked > 22 && colClicked < 25) {
                    groupClicked("identifier_table", "horsepowers", 0, 23, 24);
                } else if (colClicked > 27 && colClicked < 31) {
                    groupClicked("identifier_table", "signed_by", 0, 28, 30);
                }
            }
        },
        items: {
            "hsep1": "---------",
            "undo": {},
            "redo": {},
            "hsep2": "---------",
            "copy": {}, "cut": {},
            "hsep3": "---------",
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function() {
                    var col = ship_record_hot.getSelectedRange().to.col;
                    var label = ship_record_cols[col].vocab;
                    if (label) {
                        update_Vocs();
                        return ship_record_hot.getSelectedRange().to.col !== col;
                    } else {
                        return ship_record_hot.getSelectedRange().to.col !== -1;
                    }
                }},
            "add": {
                name: "Add table",
                hidden: function() {
                    return isAddTableMenuVisible(this, identifier_tableGroups);

                }},
            "hsep4": "---------",
            "view_add": {
                name: "View/Add Location Identity info",
                hidden: function() {
                    var col = ship_record_hot.getSelectedRange().to.col;
                    var label = ship_record_cols[col].vocab;
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
            }, "deleteComment": {
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
/////////////////////////VOYAGE INFORMATION/////////////////////////////////////////                       
var tableId = "free_text_intro";
tablesAndHeaders.set(tableId, ['Digital Source Page', 'Existence', 'Trascription', 'Note', 'Location of Register', 'Date of Register', 'Title', 'Volume', 'Folio or Sheet', 'Page', 'Kind of Alimentation', 'Start Date of Contract', 'Existence', 'Trascription', 'Note', 'Existence', 'Trascription', 'Note', 'Note', 'Comment']);

tablesWithoutCommentCols.set(tableId, [1, 3, 12, 14, 15, 17, 18]); //define fieds that do not have external content


var free_text_data = [{survey_existence: ""}];

var free_text_cols = [
    {data: 'free_text_source_page', type: 'text'}, {data: 'survey_existence', type: 'dropdown',
        source: ['Yes', 'No']},
    {data: 'survey_transcription', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'survey_note', type: 'text'},
    {data: 'mercantile_register_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'mercantile_register_date', type: 'date'},
    {data: 'mercantile_register_book_title', type: 'text'},
    {data: 'mercantile_register_book_volume', type: 'text'},
    {data: 'mercantile_register_book_folio', type: 'text'},
    {data: 'mercantile_register_book_page', type: 'text'},
    {data: 'crew_alimentation_kind', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("alimentation_type_es")), vocab: 'alimentation_type_es'},
    {data: 'crew_alimentation_kind_contract_date', type: 'date'},
    {data: 'crew_conditions_existence', type: 'dropdown',
        source: ['Yes', 'No']},
    {data: 'crew_conditions_transcription', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'crew_conditions_note', type: 'text'},
    {data: 'attached_documentation_existence', type: 'dropdown',
        source: ['Yes', 'No']},
    {data: 'attached_documentation_transcription', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'attached_documentation_note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];

var text_locs = new Object();
var cont = document.getElementById(tableId);

var free_text_hot = new Handsontable(cont, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: free_text_data,
    columns: free_text_cols,
    manualColumnResize: true,
    maxRows: 1,
    contextMenu: true,
    currentRowClassName: 'currentRow',
    className: "htCenter",
    autoWrapRow: true,
    colHeaders: tablesAndHeaders.get(tableId),
    nestedHeaders: [
        ['', {label: '', colspan: '3'}, {label: 'Mercantile Register', colspan: '6'}, {label: '', colspan: '2'}, {label: '', colspan: '3'}, {label: '', colspan: '3'}, ''], ['', {label: 'Survey', colspan: '3'}, '', '', {label: 'Book of Registration', colspan: '4'}, {label: 'Crew Alimentation', colspan: '2'}, {label: 'Crew Conditions', colspan: '3'}, {label: 'Attached Documentation', colspan: '3'}, ''],
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
        if ((free_text_cols[col].vocab === 'location_es') && (value)) {
            handle_locations(value,'free_text',row,col,'LOCS',text_locs);         
        }
    }
});

free_text_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(free_text_cols[col].vocab);
            }
        },
        items: {
            "hsep2": "---------",
            "undo": {},
            "redo": {},
            "hsep3": "---------", "copy": {},
            "cut": {},
            "hsep4": "---------",
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function() {
                    var col = free_text_hot.getSelectedRange().to.col;
                    var label = free_text_cols[col].vocab;
                    if (label) {
                        update_Vocs();
                        return free_text_hot.getSelectedRange().to.col !== col;
                    } else {
                        return free_text_hot.getSelectedRange().to.col !== -1;
                    }
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
////////////////////////////////////////////////////////////////////////////////

//////////////////////////////   5th TABLE     ////////////////////////////////
/////////////////////////Ports of CALL/////////////////////////////////////////                       
var tableId = "ports_of_call";
tablesAndHeaders.set(tableId, ['Digital Source Page', 'Port of Provenance', 'Port of Arrival', 'Date of Arrival', 'Crew', 'Passengers', 'Destination Port', 'Departure Date', 'Crew', 'Passengers', 'Type', 'Value', 'Unit', 'Type', 'Date', 'Transcription from Source', 'Note', 'Comment']);

tablesWithoutCommentCols.set(tableId, [13, 15]); //define fieds that do not have external content

var ports_data = [{ports_of_call_source_page: ""}, {ports_of_call_source_page: ""}, {ports_of_call_source_page: ""},
    {ports_of_call_source_page: ""}, {ports_of_call_source_page: ""}, {ports_of_call_source_page: ""},
    {ports_of_call_source_page: ""}, {ports_of_call_source_page: ""}, {ports_of_call_source_page: ""},
    {ports_of_call_source_page: ""}, {ports_of_call_source_page: ""}, {ports_of_call_source_page: ""},
    {ports_of_call_source_page: ""}, {ports_of_call_source_page: ""}, {ports_of_call_source_page: ""}];

var ports_cols = [
    {data: 'ports_of_call_source_page', type: 'text'},
    {data: 'arrival_provenance_port', type: 'dropdown', source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'arrival_port', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'arrival_date', type: 'date'},
    {data: 'arrival_number_crew', type: 'text'},
    {data: 'arrival_number_passengers', type: 'text'}, {data: 'departure_destination_port', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'departure_date', type: 'date'},
    {data: 'departure_number_crew', type: 'text'},
    {data: 'departure_number_passengers', type: 'text'},
    {data: 'departure_cargo_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("good_type_es")), vocab: 'good_type_es', renderer: groupRenderer},
    {data: 'departure_cargo_quantity_value', type: 'text', renderer: groupRenderer},
    {data: 'departure_cargo_quantity_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_es")), vocab: 'unit_es', renderer: groupRenderer},
    {data: 'observation_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("observation_type_es")), vocab: 'observation_type_es'}, {data: 'observation_date', type: 'date'},
    {data: 'observation_note', type: 'text', renderer: textRender, readOnly: true},
    {data: 'note', type: 'text', renderer: textRender, readOnly: true},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];

  
var cont = document.getElementById(tableId);

var headers = [
    ['', {label: 'Arrival', colspan: '5'}, {label: 'Departure', colspan: '7'}, {label: '', colspan: '3'}, ''],
    ['', '', '', '', {label: '', colspan: '2'}, '', '', {label: '', colspan: '2'}, {label: 'Cargo', colspan: '3'}, {label: '', colspan: '3'}, ''],
    ['', '', '', '', {label: 'Number', colspan: '2'}, '', '', {label: 'Number', colspan: '2'}, '', {label: 'Quantity', colspan: '2'}, {label: 'Observation', colspan: '3'}, ''],
    tablesAndHeaders.get(tableId)
];

var ports_of_callGroups = [[10, 12]];
headers = markHeaders(headers, ports_of_callGroups);
var port_locs = new Object();

var call_ports_hot = new Handsontable(cont, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: ports_data,
    columns: ports_cols,
    rowHeaders: true,
    manualColumnResize: true,
    contextMenu: true,
    currentRowClassName: 'currentRow',
    className: "htCenter",
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
        if (col > 9 && col < 13) {
            groupLeftClicked(this, row, col);

        }
    }/*,
    afterRenderer: function(td, row, col, prop, value) {
        if ((ports_cols[col].vocab === 'location_es') && (value)) {
            handle_locations(value,'ports_of_call',row,col,'LOCS',port_locs);         
        } 
    }*/
});

call_ports_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(ports_cols[col].vocab);
            } else if (key === 'add') {
                var colClicked = call_ports_hot.getSelectedRange().to.col;
                var rowClicked = call_ports_hot.getSelectedRange().to.row;
                if (colClicked > 9 && colClicked < 13) {
                    groupClicked("ports_of_call", "cargos", rowClicked, 10, 12);
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
                    return call_ports_hot.getSelected()[0] === 0;
                }
            },
            "row_below": {},
            "add10rows": {
                name: "Add 10 rows", callback: function() {
                    this.alter('insert_row', this.getSelected()[0] + 1, 10);
                }
            },
            "hsep2": "---------",
            "remove_row": {
                disabled: function() {
                    if (((call_ports_hot.getSelected()[0]) < 3) || ((call_ports_hot.getSelected()[2]) < 3)) {
                        return true;
                    }
                }
            },
            "hsep1": "---------",
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function() {
                    var col = call_ports_hot.getSelectedRange().to.col;
                    var label = ports_cols[col].vocab;
                    if (label) {
                        update_Vocs();
                        return call_ports_hot.getSelectedRange().to.col !== col;
                    } else {
                        return call_ports_hot.getSelectedRange().to.col !== -1;
                    }
                }}, "add": {
                name: "Add table",
                hidden: function() {
                    return isAddTableMenuVisible(this, ports_of_callGroups);

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
////////////////////////////////////////////////////////////////////////////////
////////////////////////////CREW LIST///////////////////////////////
var tableId = "crew_list";
tablesAndHeaders.set(tableId, ['Digital Source Page', 'Port', 'Date', 'Year', 'Month', 'Name', 'Surname A', 'Surname B', 'Father`s Name', 'Mother`s Name', 'Location of Birth', 'Location of Residence', 'Literate/Illiterate', 'Folio', 'List', 'Age', 'Type', 'Date', 'Restitution Port', 'Status', 'Reason', 'Years', 'Months', 'Form of Payment', 'Days', 'Value', 'Unit', 'Value', 'Unit', 'End of Agreement', 'Port', 'Date', 'State of Discharge', 'Type', 'Date', 'Transcription from Source', 'Note', 'Comment']);

tablesWithoutCommentCols.set(tableId, [31, 33]); //define fieds that do not have external content


var crew_data = [{crew_list_source_page: ""}, {crew_list_source_page: ""}, {crew_list_source_page: ""},
    {crew_list_source_page: ""}, {crew_list_source_page: ""}, {crew_list_source_page: ""},
    {crew_list_source_page: ""}, {crew_list_source_page: ""}, {crew_list_source_page: ""}, {crew_list_source_page: ""}, {crew_list_source_page: ""}, {crew_list_source_page: ""},
    {crew_list_source_page: ""}, {crew_list_source_page: ""}, {crew_list_source_page: ""}
];

var crew_cols = [
    {data: 'crew_list_source_page', type: 'text'},
    {data: 'embarkation_port', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'embarkation_date', type: 'date'}, {data: 'matriculation_year', type: 'text'},
    {data: 'matriculation_month', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("month_es")), vocab: 'month_es'},
    {data: 'crew_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es'},
    {data: 'crew_surname_A', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
    {data: 'crew_surname_B', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
    {data: 'crew_fathers_name', type: 'dropdown', source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es'},
    {data: 'crew_mothers_name', type: 'dropdown', source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es'},
    {data: 'crew_birth_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'crew_residence_location', type: 'dropdown', source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'crew_literature', type: 'dropdown',
        source: ['Literate', 'Illiterate']},
    {data: 'crew_folio', type: 'text'},
    {data: 'crew_list', type: 'text'},
    {data: 'crew_age', type: 'text'},
    {data: 'crew_profession_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_es")), vocab: 'status_capacity_role_es', renderer: groupRenderer},
    {data: 'crew_profession_date', type: 'text', renderer: groupRenderer},
    {data: 'crew_restitution_port', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'crew_military_service_status', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("military_status_es")), vocab: 'military_status_es'}, {data: 'crew_military_service_reason', type: 'text'},
    {data: 'crew_military_service_years', type: 'text'},
    {data: 'crew_military_service_months', type: 'text'},
    {data: 'form_of_payment', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("payment_form_es")), vocab: 'payment_form_es'},
    {data: 'crew_military_service_days', type: 'text'},
    {data: 'crew_payment_monthly_value', type: 'text'},
    {data: 'crew_payment_monthly_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_es")), vocab: 'unit_es'},
    {data: 'crew_payment_bonus_value', type: 'text'},
    {data: 'crew_payment_bonus_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_es")), vocab: 'unit_es'},
    {data: 'crew_end_of_agreement', type: 'text'},
    {data: 'crew_discharge_port', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'crew_discharge_date', type: 'date'},
    {data: 'crew_state_of_discharge', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("state_of_discharge_es")), vocab: 'state_of_discharge_es'},
    {data: 'crew_observation_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("observation_type_es")), vocab: 'observation_type_es'},
    {data: 'crew_observation_date', type: 'date'},
    {data: 'crew_observation_transcription_from_source', type: 'text', renderer: textRender, readOnly: true},
    {data: 'crew_observation_note', type: 'text', renderer: textRender, readOnly: true},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];


var cont = document.getElementById(tableId);

var headers = [
    ['', {label: 'Person', colspan: '35'}],
    ['', {label: '', colspan: '2'}, {label: '', colspan: '2'}, '', '', '', '', '', '', '', '', '', '', '', {label: '', colspan: '2'}, '', {label: 'Military Service', colspan: '4'}, {label: 'Payment', colspan: '6'}, '', {label: '', colspan: '2'}, '', {label: '', colspan: '3'}],
    ['', {label: 'Embarkation', colspan: '2'}, {label: 'Matriculation', colspan: '2'}, '', '', '', '', '', '', '', '', '', '', '', {label: 'Profession / Position', colspan: '2'}, '', '', '', {label: 'Duration', colspan: '2'}, {label: 'Monthly Wage', colspan: '4'}, {label: 'Bonus', colspan: '2'}, '', {label: 'Discharge', colspan: '2'}, '', {label: 'Observation', colspan: '3'}],
    tablesAndHeaders.get(tableId)
];


var crew_listGroups = [[16, 17]];
headers = markHeaders(headers, crew_listGroups);
var crew_locs = new Object();
var crew_persons = new Object();

var crew_hot = new Handsontable(cont, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: crew_data,
    columns: crew_cols,
    manualColumnResize: true,
    rowHeaders: true,
    contextMenu: true,
    currentRowClassName: 'currentRow',
    className: "htCenter",
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
        if (col > 15 && col < 18) {
            groupLeftClicked(this, row, col);
        }
    }/*,
    afterRenderer: function(td, row, col, prop, value) {
        if ((crew_cols[col].vocab === 'location_es') && (value)) {
            handle_locations(value,'crew_list',row,col,'LOCS',crew_locs);         
        }        
        else if (((col===5)||(col===6)||(col===7)||(col===8))&& value) {
           handle_persons(row, col, value, 'crew_list', [5,6,7], ['name', 'surname_a','surname_b'], crew_persons, persons_tbl, 'PERSONS');           
        }
    }*/

});



crew_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(crew_cols[col].vocab);
            }
            else if (key === 'add') {
                var colClicked = crew_hot.getSelectedRange().to.col;
                var rowClicked = crew_hot.getSelectedRange().to.row;
                if (colClicked > 15 && colClicked < 18) {
                    groupClicked("crew_list", "professions", rowClicked, 16, 17);
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
                    return crew_hot.getSelected()[0] === 0;
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
                    if (((crew_hot.getSelected()[0]) < 3) || ((crew_hot.getSelected()[2]) < 3)) {
                        return true;
                    }
                }
            },
            "hsep1": "---------",
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function() {
                    var col = crew_hot.getSelectedRange().to.col;
                    var label = crew_cols[col].vocab;
                    if (label) {
                        update_Vocs();
                        return crew_hot.getSelectedRange().to.col !== col;
                    } else {
                        return crew_hot.getSelectedRange().to.col !== -1;
                    }
                }},
            "add": {
                name: "Add table",
                hidden: function() {
                    return isAddTableMenuVisible(this, crew_listGroups);
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

//////////////////////////EXPORT IMPORT////////////////////////////////

/*
 $('#export-file').on('click', function() {
 
 var headers = [
 ['', {label: '', colspan: '2'}, {label: '', colspan: '2'}, {label: '', colspan: '3'}, {label: 'Total PayRoll', colspan: '9'}, ''],
 ['', {label: 'Date', colspan: '2'}, {label: 'Route', colspan: '2'}, {label: 'Signed By', colspan: '3'}, {label: 'Duration', colspan: '2'}, {label: 'Overall Total Wages', colspan: '2'}, {label: 'Overall Pension Fund', colspan: '2'}, {label: 'Overall Net Wages', colspan: '2'}, '', ''],
 ['Voyage number', 'From', 'To', 'From', 'To', 'Name', 'Surname', 'Grade', 'Months', 'Days', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Payroll Analysis', 'Note']   
 ];
 
 
 var exportPlugin = free_text_hot.getPlugin('exportFile');
 var file = (headers[headers.length-1].toString()+'\\n'+exportPlugin.exportAsString('csv'));
 
 
 //   exportPlugin.downloadFile('csv', {filename: 'MyFile'});      
 //   var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
 
 
 var formatter = exportPlugin._createTypeFormatter('csv', {filename: 'piou'});
 var blob = exportPlugin._createBlob(formatter);  
 // console.log(JSON.stringify([blob]))
 //  console.log(blob)
 var URL = window.URL || window.webkitURL;
 
 var textFile = null,
 makeTextFile = function(text) {
 var data = new Blob([text], {type: 'text/plain'});                
 if (textFile !== null) {
 window.URL.revokeObjectURL(textFile);
 }
 textFile = window.URL.createObjectURL(data);
 return textFile;
 };
 
 var a = document.createElement('a');
 var name = formatter.options.filename + '.' + formatter.options.fileExtension;
 if (a.download !== void 0) {
 var url = makeTextFile(file);
 a.style.display = 'none';
 a.setAttribute('href', url);
 a.setAttribute('download', name);
 document.body.appendChild(a);
 a.dispatchEvent(new MouseEvent('click'));
 document.body.removeChild(a);
 
 setTimeout(function () {
 URL.revokeObjectURL(url);
 }, 100);
 } else if (navigator.msSaveOrOpenBlob) {
 navigator.msSaveOrOpenBlob(blob, name);
 }
 
 });  
 */


/////////////////////////////////////////////////////////////////////

function createRecordJson(usage) {

    var cat_info = createJson(catalogue_info, cols1, usage);
    var source_id = createJson(source_identity_data, source_identity_cols, usage);
    var source_contents = createJson(ship_record_hot, ship_record_cols, usage);
    var free_text_intro = createJson(free_text_hot, free_text_cols, usage);
    var port_of_calls = createJson(call_ports_hot, ports_cols, usage);

    var crew_list = createJson(crew_hot, crew_cols, usage);
    var json = new Object();
    cat_info.date_until = getCurrentDate();
    catalogue_info.setDataAtCell(0, 2, getCurrentDate());
    json['record_information'] = cat_info;
    json['source_identity'] = source_id;
    json['ship_records'] = source_contents;
    json['free_text_introduction'] = free_text_intro;
    json['ports_of_call'] = port_of_calls;
    json['crew_list'] = crew_list;

    update_Vocs();
        
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
        ///////////////////SHIP IDENTITY

        var worker_persons = new Object();
        var worker_tbl = new Object();
        var worker_locs = new Object();
        var ship_obj = new Object();
        var ships_tbl = new Object();
        terms = new Object();

        $.each(source_contents, function (col) {
           var row_data = this; 
            $.each(ship_record_cols, function (col_no) {
                if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                    var label = $(this).attr('vocab');                    
                    handle_json_vocs(row_data,label,0,col,col_no,'ship_identity',terms);
                }
            });      
                if (col === 'owner_name') {                    
                   handle_multiple_table_instances(0, 7, row_data, 'ship_identity', [7, 8, 9], ['name', 'surname_a', 'surname_b'], worker_persons, worker_tbl, 'PERSONS');                    
                }else if (col==='owner_surname_A') {
                   handle_multiple_table_instances(0, 8, row_data, 'ship_identity', [7, 8, 9], ['name', 'surname_a', 'surname_b'], worker_persons, worker_tbl, 'PERSONS');
                }else if (col==='owner_surname_B') {
                  handle_multiple_table_instances(0, 9, row_data, 'ship_identity', [7, 8, 9], ['name', 'surname_a', 'surname_b'], worker_persons, worker_tbl, 'PERSONS');                   
                }
            ///////////////////ships    
                else if (col === 'ship_name') {                                        
                    handle_ships(0, 1, row_data, 'ship_identity', [1, 3, 6, 13, 14, 15], ['name', 'type', 'construction_date', 'registration_folio', 'registration_list', 'registration_location'], 'SHIPS',ship_obj,ships_tbl);                    
                }else if (col === 'ship_type') {
                        handle_ships(0, 3, row_data, 'ship_identity', [1, 3, 6, 13, 14, 15], ['name', 'type', 'construction_date', 'registration_folio', 'registration_list','registration_location'], 'SHIPS',ship_obj,ships_tbl);
                }else if (col ==='construction_location_date') {
                        handle_ships(0, 6, row_data, 'ship_identity', [1, 3,6, 13, 14,15], ['name', 'type', 'construction_date', 'registration_folio', 'registration_list', 'registration_location'], 'SHIPS',ship_obj,ships_tbl);
                }else if (col==='registration_folio') {
                        handle_ships(0, 13, row_data, 'ship_identity', [1, 3, 6, 13, 14, 15], ['name', 'type', 'construction_date', 'registration_folio', 'registration_list', 'registration_location'], 'SHIPS',ship_obj,ships_tbl);
                }else if (col==='registration_list') {
                        handle_ships(0, 14, row_data, 'ship_identity', [1, 3, 6, 13, 14, 15], ['name', 'type','construction_date', 'registration_folio', 'registration_list', 'registration_location'], 'SHIPS',ship_obj,ships_tbl);
                }else if (col==='registration_location') {
                        handle_ships(0, 15, row_data, 'ship_identity', [1, 3, 6, 13, 14, 15], ['name', 'type', 'construction_date', 'registration_folio', 'registration_list','registration_location'], 'SHIPS',ship_obj,ships_tbl);
                }
                ////////////////////////////////org
                else if (col === 'organization_name') {
                    handle_multiple_table_instances(0, 11, this.toString(), 'ship_identity', null, null, null, null, 'ORGS');
                } else if (col === 'company_name') {
                    handle_multiple_table_instances(0 + '_', 28, this.toString(), 'ship_identity', null, null, null, null, 'ORGS');
                }else if (col === 'construction_location_country') {
                    handle_multiple_table_instances(0, 4, this.toString(), 'ship_identity', null, null, worker_locs, null, 'LOCS');
                }else if (col === 'construction_location_shipyard') {
                    handle_multiple_table_instances(0, 5, this.toString(), 'ship_identity', null, null, worker_locs, null, 'LOCS');
                } else if (col === 'owner_residence') {
                    handle_multiple_table_instances(0, 10, this.toString(), 'ship_identity', null, null, worker_locs, null, 'LOCS');
                } else if (col === 'organization_location') {
                    handle_multiple_table_instances(0, 12, this.toString(), 'ship_identity', null, null, worker_locs, null, 'LOCS');
                } else if (col === 'registration_location') {
                    handle_multiple_table_instances(0, 15, this.toString(), 'ship_identity', null, null, worker_locs, null, 'LOCS');
                } else if (col === 'certificate_of_register_location') {
                    handle_multiple_table_instances(0, 18, this.toString(), 'ship_identity', null, null, worker_locs, null, 'LOCS');
                } else if (col === 'company_location') {
                    handle_multiple_table_instances(0, 29, this.toString(), 'ship_identity', null, null, worker_locs, null, 'LOCS');
                }           
        });

///////////////////////////////////ports of call
        var ports_of_call_locs = new Object();
        terms = new Object();
        $.each(port_of_calls, function (row) {            
       //     console.log('------- handling row ' + row + ' -----------');
            $.each(this, function (col) {
                var val = this.toString();
                $.each(ports_cols, function (col_no) {
                    if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                        var label = $(this).attr('vocab');                      
                        handle_json_vocs(val, label, row, col, col_no, 'ports_of_call', terms);
                    }
                });
                if (col === 'arrival_provenance_port') {
                    handle_multiple_table_instances(row, 1, this.toString(), 'ports_of_call', null, null, ports_of_call_locs, null, 'LOCS');
                } else if (col === 'arrival_port') {
                    handle_multiple_table_instances(row, 2, this.toString(), 'ports_of_call', null, null, ports_of_call_locs, null, 'LOCS');
                } else if (col === 'departure_destination_port') {
                    handle_multiple_table_instances(row, 6, this.toString(), 'ports_of_call', null, null, ports_of_call_locs, null, 'LOCS');
                }
            });
        });

////////////////////////////////////crew list
        var crew_list_persons = new Object();
        var crew_list_tbl = new Object();
        var crew_list_locs = new Object();
        terms = new Object();
        $.each(crew_list, function (row) {
            var row_data = this;
         //   console.log('------- handling row ' + row + ' -----------');
            $.each(this, function (col) {
                
                var val = this.toString();
                $.each(crew_cols, function (col_no) {
                    if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                        var label = $(this).attr('vocab');                      
                        handle_json_vocs(val, label, row, col, col_no, 'crew_list', terms);
                    }
                });
                /*if (col === 'crew_surname_A') {
                    if (row_data['crew_name']) {
                        handle_multiple_table_instances(row, 5, row_data['crew_name'], 'crew_list', [5, 6, 7, 8,13,14], ['name', 'surname_a', 'surname_b', 'fathers_name','registration_number','registration_list'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }if (row_data['crew_surname_A']) {
                        handle_multiple_table_instances(row, 6, row_data['crew_surname_A'], 'crew_list', [5, 6, 7, 8,13,14], ['name', 'surname_a', 'surname_b', 'fathers_name','registration_number','registration_list'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }if (row_data['crew_surname_B']) {
                        handle_multiple_table_instances(row, 7, row_data['crew_surname_B'], 'crew_list', [5, 6, 7, 8,13,14], ['name', 'surname_a', 'surname_b', 'fathers_name','registration_number','registration_list'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }if (row_data['crew_fathers_name']) {
                        handle_multiple_table_instances(row, 8, row_data['crew_fathers_name'], 'crew_list', [5, 6, 7, 8,13,14], ['name', 'surname_a', 'surname_b', 'fathers_name','registration_number','registration_list'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }if (row_data['crew_folio']) {                       
                        handle_multiple_table_instances(row, 13, row_data['crew_folio'], 'crew_list', [5, 6, 7, 8,13,14], ['name', 'surname_a', 'surname_b', 'fathers_name','registration_number','registration_list'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }if (row_data['crew_list']) {                       
                        handle_multiple_table_instances(row, 14, row_data['crew_list'], 'crew_list', [5, 6, 7, 8,13,14], ['name', 'surname_a', 'surname_b', 'fathers_name','registration_number','registration_list'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                                        
                }*/
                if (col === 'crew_surname_A') {
                    if (row_data['crew_name']) {
                        handle_multiple_table_instances(row, 5, row_data['crew_name'] , 'crew_list', [5, 6, 7, 8,10,13,14,17], ['name', 'surname_a', 'surname_b', 'fathers_name','place_of_birth','registration_number','registration_list','status'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }if (row_data['crew_surname_A']) {
                        handle_multiple_table_instances(row, 6, row_data['crew_surname_A'], 'crew_list', [5, 6, 7, 8,10,13,14,17], ['name', 'surname_a', 'surname_b', 'fathers_name','place_of_birth','registration_number','registration_list','status'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }if (row_data['crew_surname_B']) {
                        handle_multiple_table_instances(row, 7, row_data['crew_surname_B'],  'crew_list', [5, 6, 7, 8,10,13,14,17], ['name', 'surname_a', 'surname_b', 'fathers_name','place_of_birth','registration_number','registration_list','status'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }if (row_data['crew_fathers_name']) {
                        handle_multiple_table_instances(row, 8, row_data['crew_fathers_name'], 'crew_list', [5, 6, 7, 8,10,13,14,17], ['name', 'surname_a', 'surname_b', 'fathers_name','place_of_birth','registration_number','registration_list','status'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }if (row_data['crew_birth_location']) {
                        handle_multiple_table_instances(row, 10, row_data['crew_birth_location'], 'crew_list', [5, 6, 7, 8,10,13,14,17], ['name', 'surname_a', 'surname_b', 'fathers_name','place_of_birth','registration_number','registration_list','status'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }if (row_data['crew_folio']) {                       
                        handle_multiple_table_instances(row, 13, row_data['crew_folio'], 'crew_list', [5, 6, 7, 8,10,13,14,17], ['name', 'surname_a', 'surname_b', 'fathers_name','place_of_birth','registration_number','registration_list','status'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }if (row_data['crew_list']) {                       
                        handle_multiple_table_instances(row, 14, row_data['crew_list'], 'crew_list', [5, 6, 7, 8,10,13,14,17], ['name', 'surname_a', 'surname_b', 'fathers_name','place_of_birth','registration_number','registration_list','status'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }if (row_data['crew_profession_type']) { 
                        if(row_data['crew_profession_type'].indexOf('\n')>-1){                            
                            handle_multiple_table_instances(row, 17, row_data['crew_profession_type'].replace(/\n/g,","), 'crew_list', [5, 6, 7, 8,10,13,14,17], ['name', 'surname_a', 'surname_b', 'fathers_name','place_of_birth','registration_number','registration_list','status'], crew_list_persons, crew_list_tbl, 'PERSONS');
                        }else{
                        handle_multiple_table_instances(row, 17, row_data['crew_profession_type'], 'crew_list', [5, 6, 7, 8,10,13,14,17], ['name', 'surname_a', 'surname_b', 'fathers_name','place_of_birth','registration_number','registration_list','status'], crew_list_persons, crew_list_tbl, 'PERSONS');
                        }
                    }
                }				else if (col === 'crew_fathers_name') {
                    if (row_data['crew_surname_A']) {
                        handle_multiple_table_instances(row + '_', 8, row_data['crew_surname_A'], 'crew_list', [6, 8], ['name', 'surname_a'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }if (row_data['crew_fathers_name']) {
                        handle_multiple_table_instances(row + '_', 6, row_data['crew_fathers_name'], 'crew_list', [6, 8], ['name', 'surname_a'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                } 
                else if (col === 'crew_mothers_name') {
                    if (row_data['crew_mothers_name']) {
                        handle_multiple_table_instances(row + '__', 9, row_data['crew_mothers_name'], 'crew_list', [7, 9], ['name', 'surname_a'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }if (row_data['crew_surname_B']) {
                        handle_multiple_table_instances(row + '__', 7, row_data['crew_surname_B'], 'crew_list', [7, 9], ['name', 'surname_a'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                } 
                
                
                else if (col === 'embarkation_port') {
                    handle_multiple_table_instances(row, 1, this.toString(), 'crew_list', null, null, crew_list_locs, null, 'LOCS');
                } else if (col === 'crew_birth_location') {
                    handle_multiple_table_instances(row, 10, this.toString(), 'crew_list', null, null, crew_list_locs, null, 'LOCS');
                } else if (col === 'crew_residence_location') {
                    handle_multiple_table_instances(row, 11, this.toString(), 'crew_list', null, null, crew_list_locs, null, 'LOCS');
                } else if (col === 'crew_restitution_port') {
                    handle_multiple_table_instances(row, 18, this.toString(),'crew_list', null, null, crew_list_locs, null, 'LOCS');
                } else if (col === 'crew_discharge_port') {
                    handle_multiple_table_instances(row, 30, this.toString(), 'crew_list', null, null, crew_list_locs, null, 'LOCS');
                }
            });
        });
    }
    
     
    console.log(terms_json);
    update_Vocs_from_json(terms_json);      
                                                                               
    return json;
}
;
//////////////////////////////////////////////////////////////////////////////////////////
/////////// Loading icon
$(window).load(function() {
    $(".spin_loader").fadeOut("slow");
});
///////////////////////////////// Load File /////////////////////////////////////////////
var record_status;

function load(data,status) {
    
    console.log(status);
    record_status = status;    
    
    clear_LocalStorage_instances();
    
    catalogue_info.loadData(data.record_information);
    source_identity_data.loadData(data.source_identity);
    ship_record_hot.loadData(data.ship_records);
    free_text_hot.loadData(data.free_text_introduction);

    var ports_data = new Array();
    $.each(data.ports_of_call, function() {
        ports_data.push(this);
    });

    call_ports_hot.loadData(ports_data);

    var crew_data = new Array();
    $.each(data.crew_list, function() {
        crew_data.push(this);
    });

    crew_hot.loadData(crew_data);

    update_Vocs();


}
;
///////////////////////////////////////////////////////////////////////////////
/////////////////////////EXCEL EXPORT////////////////////////////////////////
$('#excelexport').click(function() {

    var json = createRecordJson('excel');
    var temp = JSON.stringify(json);
    temp = temp.replace(/&nbsp;/g, "");
    json = JSON.parse(temp);
    var sheets = new Array();
    sheets.push([json.record_information]);
    sheets.push([json.source_identity]);
    sheets.push([json.ship_records]);
    sheets.push([json.free_text_introduction]);
    sheets.push(json.ports_of_call);
    sheets.push(json.crew_list);

    var groupTables = createMultipleTables(json['ports_of_call'], ports_of_callGroups, ports_cols);
    var result = createExcelSheetsData(sheets, groupTables);

    var opts = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Source Identity', header: false}, {sheetid: 'Ship Identity', header: true}, {sheetid: 'Free Text Introduction', header: true}, {sheetid: 'Ports of Call', header: true}, {sheetid: 'Crew List', header: true}];
    var res = alasql('SELECT * INTO XLSX("' + $('#unique_filename').text() + '.xlsx",?) FROM ?', [opts, result]);

});

//////////////////Update Vocabularies on pouch DB

function update_Vocs() {
    if (mode === null) {//only update vocabularies in edit mode

        updateVocabs([catalogue_info, source_identity_data, ship_record_hot, free_text_hot, call_ports_hot, crew_hot]);
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
            } else if (table_id === "identifier_table") {
                old_val = ship_record_hot.getDataAtCell(this.row, this.col, value);
                ship_record_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "free_text_intro") {
                old_val = free_text_hot.getDataAtCell(this.row, this.col, value);
                free_text_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "ports_of_call") {
                old_val = call_ports_hot.getDataAtCell(this.row, this.col, value);
                call_ports_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "crew_list") {
                old_val = crew_hot.getDataAtCell(this.row, this.col, value);
                crew_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "catalogue_info") {
                old_val = catalogue_info.getDataAtCell(this.row, this.col, value);
                catalogue_info.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            }
        });
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
    tmp['record_information']['related_organization'] = 'University of Barcelona';
    tmp['record_information']['record_id'] = recordId;
    tmp['record_information']['template_type'] = templateTitle;
    tmp['source_identity'] = json.source_identity;
    tmp['source_identity']['source_language'] = 'Spanish(Castilian)';
    tmp['ship_identity'] = oneRow_with_Groups(json.ship_records, identifier_tableGroups, ship_record_cols);
    tmp['free_text_introduction'] = json.free_text_introduction;
    tmp['ports_of_call'] = simple_with_Groups(json.ports_of_call, ports_of_callGroups, ports_cols);
    tmp['crew_list'] = simple_with_Groups(json.crew_list, crew_listGroups, crew_cols);

    root['root'] = tmp;
    var xml = formatXml(json2xml(root));

    xml = xml.replace(/<row_(\d+)>/g, '<row index="$1">');
    xml = xml.replace(/<\/row_(\d+)>/g, "</row>");

    xml = xml.replace(/<group_data_(\d+)>/g, '<group_data index="$1">');
    xml = xml.replace(/<\/group_data_(\d+)>/g, "</group_data>");

    return (xml);
}
;


