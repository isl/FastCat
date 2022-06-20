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

        } else if (subTableName === "ownerPersons") {
            var cols = [
                {data: 'owner_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es'},
                {data: 'owner_surname', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
                {data: 'owner_fathers_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es'}
            ];
            nestedHeaders = [
                ['Name', 'Surname', "Father's Name"]
            ];
            data = setSubTableData(ship_record_hot, row, startCol, endCol);

        }

        else if (subTableName === "professions_positions") {
            var cols = [
                {data: 'crew_profession_type', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_capacity_role_es")), vocab: 'status_capacity_role_es'},
                {data: 'crew_profession_wage', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("money_form_es")), vocab: 'money_form_es'},
                {data: 'crew_profession_value', type: 'text'},
                {data: 'crew_profession_months', type: 'text'},
                {data: 'crew_profession_days', type: 'text'}
               
            ];
            nestedHeaders = [
                ['Profession|Rank', 'Unit', 'Value', 'Months', 'Days']
            ];
            data = setSubTableData(crew_hot, row, startCol, endCol);
        }
        else if (subTableName === "destinations") {
            var cols = [
                {data: 'first_planned_destinations', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'}
            ];
            nestedHeaders = [
                ['First Planned Destinations']
            ];
            data = setSubTableData(call_ports_hot, row, startCol, endCol);
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
tablesAndHeaders.set(tableId, ['Name', 'Location', 'Register Number','Title', 'Number', 'Date of Release *', 'Name', 'Location', 'Note', 'Comment']);

tablesWithoutCommentCols.set(tableId, [0, 1, 2, 7]); //define fieds that do not have external content

var source_identity_cols = [
    {data: 'archive_library', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("archive_or_library_es")), vocab: 'archive_or_library_es'},
    {data: 'archive_library_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'register_number', type: 'text'},
    {data: 'document_title', type: 'text'},
    {data: 'number_of_document', type: 'text'},
    {data: 'date_of_document', type: 'date'},
    {data: 'issuing_authority', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("local_authority_es")), vocab: 'local_authority_es'},
    {data: 'issuing_authority_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];

var source_container = document.getElementById(tableId);
var headers = [
    [{label: 'Archive / Library', colspan: 2}, '', {label: 'Document', colspan: 3}, {label: 'Issuing Authority', colspan: 2}, ''],
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
        if ((source_identity_cols[col].vocab === 'location_es') && (value)) {
            handle_locations(value,'source_identity',row,col,'LOCS',source_locs);         
        } else if ((source_identity_cols[col].vocab === 'local_authority_es')&&value) {
            handle_organizations(value,'source_identity',row, col, 'ORGS');
        } else if ((source_identity_cols[col].vocab === 'archive_or_library_es')&&value) {
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
/////////////////////////////SHIP IDENTITY/////////////////////////////////////////////             
var tableId = "identifier_table";
tablesAndHeaders.set(tableId, ['Ship name *', 'Ship type', 'Tonnage',  'Registry Port', 'Name', 'Surname', "Father's Name", 'Note', 'Comment']);

tablesWithoutCommentCols.set(tableId, [13]); //define fieds that do not have external content

var sourcedata = [{ship_name: ''}];

var ship_record_cols = [
    {data: 'ship_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_es")), vocab: 'ship_name_es'},
    {data: 'ship_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_type_es")), vocab: 'ship_type_es'},
    {data: 'ship_tonnage', type: 'text'},       
    {data: 'registry_port', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},    
    {data: 'owner_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es', renderer: groupRenderer},
    {data: 'owner_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es', renderer: groupRenderer},
    {data: 'owner_fathers_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es', renderer: groupRenderer},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}



];

var headers = [ 
    ['', '', '', '', {label: 'Owner', colspan: 3}, ''],
    tablesAndHeaders.get(tableId)
];
var identifier_tableGroups = [[4, 6]];

headers = markHeaders(headers, identifier_tableGroups);

var ship_record_container = document.getElementById(tableId);

/////////////////////////////


var ships_persons = new Object();
var ships_locs = new Object();

/////////////////////////////////////////////

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
    afterLoadData: function(row, col) {
        addCommentForContentFoundOutsideTheSource(this);
    },
    afterRender: function() {
        markGroups(this);
    },
    afterSelectionEnd: function(row, col) {
        markGroups(this);
        if (col > 3 && col < 7) {
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
            } else if (key === 'add') {
                var colClicked = ship_record_hot.getSelectedRange().to.col;
                if (colClicked > 3 && colClicked < 8) {
                    groupClicked("identifier_table", "ownerPersons", 0, 4, 6);
                }
            } else if (key === 'view_add') {
                var col = options.start.col;
                var row = options.start.row;
                var tableId = this.rootElement.getAttribute("id");
                var value = ship_record_hot.getDataAtCell(options.start.row, options.start.col);
                var label = ship_record_cols[col].vocab;
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
tablesAndHeaders.set(tableId, ['Port', 'Date', 'Discharge Date', 'Surname','Surname B', 'Name','Age', 'Location of Residence', 'Date of Birth',  'Proffesion|Rank', 'Unit', 'Value', 'Months', 'Days',  'Note', 'Comment']);

tablesWithoutCommentCols.set(tableId, [15]); //define fieds that do not have external content

var crew_data = [{port_of_provenance: ""}, {port_of_provenance: ""}, {port_of_provenance: ""}, {port_of_provenance: ""},
    {port_of_provenance: ""}, {port_of_provenance: ""}, {port_of_provenance: ""}, {port_of_provenance: ""},
    {port_of_provenance: ""}, {port_of_provenance: ""}, {port_of_provenance: ""}, {port_of_provenance: ""},
    {port_of_provenance: ""}, {port_of_provenance: ""}, {port_of_provenance: ""}];

var crew_cols = [
    {data: 'embarkation_port', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'embarkation_date', type: 'date'},    
    {data: 'discharge_date', type: 'date'},
    {data: 'crew_surname', type: 'dropdown', instance_label: 'person',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
    {data: 'crew_surname_b', type: 'dropdown', instance_label: 'person',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
    {data: 'crew_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es'},
    {data: 'crew_age', type: 'text'},
    {data: 'crew_birth_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'crew_birth_date', type: 'text'},
   
    {data: 'crew_profession_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_es")), vocab: 'status_capacity_role_es', renderer: groupRenderer},
    {data: 'crew_profession_wage',type: 'dropdown',
        source: JSON.parse(localStorage.getItem("money_form_es")), vocab: 'money_form_es', renderer: groupRenderer},
    {data: 'crew_profession_value', type: 'text', renderer: groupRenderer},
    {data: 'crew_profession_months', type: 'text', renderer: groupRenderer},
    {data: 'crew_profession_days', type: 'text', renderer: groupRenderer},
    
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];


var cont = document.getElementById(tableId);

var headers = [
    [{label: '', colspan: '2'},'' ,'', '', '', '', '', '',  {label: 'Work', colspan: '5'}, ''],
    [{label: 'Embarkation', colspan: '2'}, '', '', '','', '', '', '', '', {label: 'Wage', colspan: '2'}, {label: 'Total Duration', colspan: '2'},  ''],
    tablesAndHeaders.get(tableId)
];

var crew_listGroups = [[9, 13]];
headers = markHeaders(headers, crew_listGroups);

/////////////////////////////



var persons_tbl = new Object();
var persons = new Object();
var crew_locs = new Object();

/////////////////////////////////////////////

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
    afterRender: function(row, col, prop) {
        markGroups(this);
    },
    afterSelectionEnd: function(row, col) {
        markGroups(this);
        if (col > 8 && col < 14) {
            groupLeftClicked(this, row, col);
        }
    }
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
                if (colClicked > 8 && colClicked < 14) {
                    groupClicked('crew_list', "professions_positions", rowClicked, 9, 13);
                }
            }
            else if (key === 'view_add') {
                var col = options.start.col;
                var row = options.start.row;
                var tableId = this.rootElement.getAttribute("id");
                var value = crew_hot.getDataAtCell(options.start.row, options.start.col);
                var label = crew_cols[col].vocab;
                create_location_modal(tableId, value, row, col, label);
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
            "view_add": {
                name: "View/Add Location Identity info",
                hidden: function() {
                    var col = crew_hot.getSelectedRange().to.col;
                    var label = crew_cols[col].vocab;
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


//////////////////////////////   5th TABLE     ////////////////////////////////
/////////////////////////Documented Navigation/////////////////////////////////////////                       
var tableId = "ports_of_call";
tablesAndHeaders.set(tableId, ['From', 'To',  'First Planned Destinations', 'Total Crew Number (captain included)', 'Note', 'Comment']);

tablesWithoutCommentCols.set(tableId, [6]); //define fieds that do not have external content

var ports_data = [{date_from: ""}];

var ports_cols = [
    {data: 'date_from', type: 'date'},
    {data: 'date_to', type: 'date'},   
    {data: 'first_planned_destinations', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es', renderer: groupRenderer},
    {data: 'total_crew_number', type: 'text'},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];


var cont = document.getElementById(tableId);
var headers = [
    [{label: 'Date of Navigation', colspan: '2'}, ''],
    tablesAndHeaders.get(tableId)
];

var ports_of_callGroups = [[2, 2]];
headers = markHeaders(headers, ports_of_callGroups);

var call_ports_hot = new Handsontable(cont, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: ports_data,
    columns: ports_cols,
    manualColumnResize: true,
    contextMenu: true,
    currentRowClassName: 'currentRow',
    className: "htCenter",
    autoWrapRow: true,
    maxRows: 1,
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
        }
    }
});

call_ports_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(ports_cols[col].vocab);
            }
            else if (key === 'add') {
                var colClicked = call_ports_hot.getSelectedRange().to.col;
                var rowClicked = call_ports_hot.getSelectedRange().to.row;
                if (colClicked === 2) {
                    groupClicked('ports_of_call', "destinations", rowClicked, 2, 2);
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
                }},
            "add": {
                name: "Add table",
                hidden: function() {
                    return isAddTableMenuVisible(this, ports_of_callGroups);
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
////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////

//////////////////////////EXPORT IMPORT////////////////////////////////

/////////////////////////////////////////////////////////////////////

function createRecordJson(usage) {

    var cat_info = createJson(catalogue_info, cols1, usage);
    var source_id = createJson(source_identity_data, source_identity_cols, usage);
    var source_contents = createJson(ship_record_hot, ship_record_cols, usage);
    var port_of_calls = createJson(call_ports_hot, ports_cols, usage);
    var crew_list = createJson(crew_hot, crew_cols, usage);
   

    var json = new Object();

    cat_info.date_until = getCurrentDate();
    catalogue_info.setDataAtCell(0, 2, getCurrentDate());
    json['record_information'] = cat_info;
    json['source_identity'] = source_id;
    json['ship_records'] = source_contents;
    json['ports_of_call'] = port_of_calls;
    json['crew_list'] = crew_list;
   
    
    
   // console.log(source_contents)    
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
        
        ///////////////// ship identity
        
        
        var worker_persons = new Object();
        var worker_tbl = new Object();
        var worker_locs = new Object();
        var ship_obj = new Object();
        var ships_tbl = new Object();
        terms = new Object();
        $.each(source_contents, function (col) {
            var row_data = this.toString(); 
            ///////////////////////////////////////////////////////////////////            
            $.each(ship_record_cols, function (col_no) {
                if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                    var label = $(this).attr('vocab');                    
                    handle_json_vocs(row_data,label,0,col,col_no,'ship_identity',terms);
                }
            });     
            ///////////////////////////////////////////////////////////////////
                /*if((col === 'owner_surname')&&(source_contents['owner_name'])) {
                    //console.log(row_data)
                    handle_multiple_table_instances(0 + '_', 4, source_contents['owner_name'], 'ship_identity', [4, 5, 6], ['name', 'surname_a', 'fathers_name'], worker_persons, worker_tbl, 'PERSONS');
                    handle_multiple_table_instances(0 + '_', 5, row_data, 'ship_identity',  [4, 5, 6], ['name', 'surname_a', 'fathers_name'], worker_persons, worker_tbl, 'PERSONS');                    
                }else if (col==='owner_fathers_name') {
                    handle_multiple_table_instances(0 + '_', 6, row_data, 'ship_identity',  [4, 5, 6], ['name', 'surname_a', 'fathers_name'], worker_persons, worker_tbl, 'PERSONS');
                }
                ////////////////////////////////////////////////////////////////                
                if ((col === 'owner_fathers_name')&&(source_contents['owner_surname'])&&(row_data!=="")) {                                      
                       handle_multiple_table_instances(0 + '__', 6, row_data, 'ship_identity', [6, 5], ['name', 'surname_a'], worker_persons, worker_tbl, 'PERSONS');
                       handle_multiple_table_instances(0 + '__', 5, source_contents['owner_surname'].toString(), 'ship_identity', [6, 5], ['name', 'surname_a'], worker_persons, worker_tbl, 'PERSONS');                  
                }
                /////////////////////////////////////////////////////////////////                            
                else*/ if (col === 'ship_name') {
                    handle_ships(0, 0, row_data, 'ship_identity', [0, 1,3], ['name', 'type', 'registration_location'], 'SHIPS',ship_obj,ships_tbl);
                }else if (col==='ship_type') {
                    handle_ships(0, 1, row_data, 'ship_identity', [0, 1,3], ['name', 'type', 'registration_location'], 'SHIPS',ship_obj,ships_tbl);
                }
                    ////////////////////////////////////////////////////////////
                else if (col === 'registry_port') {
                     handle_ships(0, 3, row_data, 'ship_identity', [0, 1,3], ['name', 'type','registration_location'], 'SHIPS',ship_obj,ships_tbl);                     
                     handle_multiple_table_instances(0, 3, row_data, 'ship_identity', null, null, worker_locs, null, 'LOCS');
                     
                }           
        });
        
        ////////////////////////////////////////////////////////////////////////
        
        ///////////////////////////////////
        var crew_persons = new Object();
        var crew_tbl = new Object();
        var crew_locs = new Object();
        terms = new Object();

        $.each(crew_list, function (row) {
            console.log('-------------handling row ' + row + '------------');
            var row_data = this;
            $.each(this, function (col) {
                ////////////////////////////////////////////////////////////////
                 var val = this.toString();
                $.each(crew_cols, function (col_no) {
                    if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                        var label = $(this).attr('vocab');                      
                        handle_json_vocs(val, label, row, col, col_no, 'crew_list', terms);
                    }
                });
                ///////////////////////////////////////////////////////////////
                if (col === 'crew_surname') {
                    if (row_data['crew_name']) {
                        handle_multiple_table_instances(row, 5, row_data['crew_name'], 'crew_list', [5,3,4], ['name', 'surname_a', 'surname_b'], crew_persons, crew_tbl, 'PERSONS');
                    }if (row_data['crew_surname_b']) {
                        handle_multiple_table_instances(row, 4, row_data['crew_surname_b'], 'crew_list',[5,3,4], ['name', 'surname_a','surname_b' ], crew_persons, crew_tbl, 'PERSONS');
                    }
                    handle_multiple_table_instances(row, 3, row_data['crew_surname'], 'crew_list',[5,3,4], ['name', 'surname_a','surname_b' ], crew_persons, crew_tbl, 'PERSONS');                   
                } else if (col === 'embarkation_port') {
                    handle_multiple_table_instances(row, 0, this.toString(), 'crew_list', null, null, crew_locs, null, 'LOCS');
                } else if (col === 'crew_birth_location') {
                    handle_multiple_table_instances(row, 7, this.toString(), 'crew_list', null, null, crew_locs, null, 'LOCS');
                }
            });
        });
        ////////////////////////////////////////////////////
        
    }
        
    update_Vocs();
    console.log(terms_json)
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
    call_ports_hot.loadData(data.ports_of_call);

    var crew_data = new Array();
    $.each(data.crew_list, function() {
        crew_data.push(this);
    });

    crew_hot.loadData(crew_data);  
    update_Vocs();
}
;
///////////////////////////////////////////////////////////////////////////////
$('#excelexport').click(function() {

    var json = createRecordJson('excel');
    var temp = JSON.stringify(json);
    temp = temp.replace(/&nbsp;/g, "");
    json = JSON.parse(temp);

    var sheets = new Array();
    sheets.push([json.record_information]);
    sheets.push([json.source_identity]);
    sheets.push([json.ship_records]);
    sheets.push(json.crew_list);
    sheets.push([json.ports_of_call]);
   // sheets.push(json.route);

    var groupTables = createMultipleTables(json['crew_list'], crew_listGroups, crew_cols);
    var result = createExcelSheetsData(sheets, groupTables);

    var opts = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Source Identity', header: false}, {sheetid: 'Ship Identity', header: true}, {sheetid: 'Crew List', header: true}, {sheetid: 'Documented Navigation', header: true}];
    var res = alasql('SELECT * INTO XLSX("' + $('#unique_filename').text() + '.xlsx",?) FROM ?', [opts, result]);

});


//////////////////Update Vocabularies on pouch DB

function update_Vocs() {
    if (mode === null) {//only update vocabularies in edit mode

        updateVocabs([catalogue_info, source_identity_data, ship_record_hot, call_ports_hot, crew_hot]);
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
            if (table_id === "source_identity") {
                old_val = source_identity_data.getDataAtCell(this.row, this.col, value);
                source_identity_data.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "identifier_table") {
                old_val = ship_record_hot.getDataAtCell(this.row, this.col, value);
                ship_record_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "crew_list") {
                old_val = crew_hot.getDataAtCell(this.row, this.col, value);
                crew_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "ports_of_call") {
                old_val = call_ports_hot.getDataAtCell(this.row, this.col, value);
                call_ports_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
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
    } else if (parentTable === "identifier_table") {
        ship_record_hot.setDataAtCell(row, col, val);
    } else if (parentTable === "crew_list") {
        crew_hot.setDataAtCell(row, col, val);
    } else if (parentTable === "ports_of_call") {
        call_ports_hot.setDataAtCell(row, col, val);
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
    tmp['ship_identity'] = oneRow_with_Groups(json.ship_records, identifier_tableGroups, ship_record_cols);
    tmp['crew_list'] = simple_with_Groups(json.crew_list, crew_listGroups, crew_cols);
    tmp['documented_navigation'] = oneRow_with_Groups(json.ports_of_call, ports_of_callGroups, ports_cols);

  
    
//////////////////////////////////////////////////////////////////////////            
    
    
/////////////////////////////////////////////////////////////////////////////////////
    root['root'] = tmp;
  
    var xml = formatXml(json2xml(root));

    console.log(root);

    xml = xml.replace(/<row_(\d+)>/g, '<row index="$1">');
    xml = xml.replace(/<\/row_(\d+)>/g, "</row>");

    xml = xml.replace(/<group_data_(\d+)>/g, '<group_data index="$1">');
    xml = xml.replace(/<\/group_data_(\d+)>/g, "</group_data>");
    
    xml = xml.replace(/<person_(\d+)>/g, '<person index="$1">');
    xml = xml.replace(/<\/person_(\d+)>/g, "</person>");

    
    ///////////////////////////////////
            
    return (xml);

}
;

function add_loc_information(row, col, table_id, label, value) {

    var result = create_cell_location_value(label, value);

    if (table_id === "source_identity") {
        source_identity_data.setDataAtCell(row, col, result);
    } 
    
    
    $("#location_Modal").modal('hide');
}
;

///////////// EXPORT ZIP ///////////////////////////////////////


//////////////////////////////////////////////////////////////////
