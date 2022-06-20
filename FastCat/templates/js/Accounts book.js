
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
        else if (subTableName === "captains") {
            var cols = [
                {data: 'captain_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_gr")), vocab: 'name_gr'},
                {data: 'captain_surname', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_gr")), vocab: 'surname_gr'}
            ];
            nestedHeaders = [
                ['Name', 'Surname']
            ];
            data = setSubTableData(ship_record_hot, row, startCol, endCol);
        }
        else if (subTableName === "ownerPersons") {
            var cols = [
                {data: 'owner_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_gr")), vocab: 'name_gr'},
                {data: 'owner_surname', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_gr")), vocab: 'surname_gr'}
            ];
            nestedHeaders = [
                ['Name', 'Surname']
            ];
            data = setSubTableData(ship_record_hot, row, startCol, endCol);
        }

        else if (subTableName === "ownerOrganizations") {
            var cols = [
                {data: 'organization_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("organization_gr")), vocab: 'organization_gr'},
                {data: 'organization_location', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'}
            ];
            nestedHeaders = [
                ['Name', 'Headquarters Location']
            ];
            data = setSubTableData(ship_record_hot, row, startCol, endCol);
        }
        else if (subTableName === "ports_of_call") {
            var cols = [
                {data: 'port_of_call', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'}                
            ];
            nestedHeaders = [
                ['Ports of Call']
            ];
            data = setSubTableData(voyages_hot, row, startCol, endCol);
        }
        else if (subTableName.indexOf("transactionRecordings") !== -1) {
            var cnt = parentTableName.replace("transactions", "");
            var cols = [
                {data: 'time_date_type', type: 'dropdown', source: ['Julian', 'Gregorian']},
                {data: 'time_date_to', type: 'date'},
                {data: 'time_date', type: 'date'},
                {data: 'time_date_duration', type: 'text'},
                {data: 'dep_arrival_date', type: 'dropdown',
                    source: ['Departure', 'Arrival', 'Departure/Arrival']}];
            nestedHeaders = [
                ['Type', 'From', 'To/At', 'Duration (Days)', 'Departure / Arrival']

            ];
            data = setSubTableData(voyage_transactions[cnt], row, startCol, endCol);
        } else if (subTableName.indexOf("transaction_tables") !== -1) {
            var cnt = parentTableName.replace("transactions", "");
            var cols = [
                {data: 'transaction_type', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("transaction_type_gr")), vocab: 'transaction_type_gr'},
                {data: 'type_of_good', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("good_type_gr")), vocab: 'good_type_gr'},
                {data: 'good_value', type: 'text'},
                {data: 'good_unit', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
                {data: 'transaction_date_type', type: 'dropdown', source: ['Julian', 'Gregorian']},
                {data: 'time_from', type: 'date'},
                {data: 'time_to', type: 'date'},
                {data: 'time_duration', type: 'text'},
                {data: 'trancaction_place_from', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
                {data: 'trancaction_place_to', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
                {data: 'supplier_provider_number', type: 'text'},
                {data: 'supplier_provider_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_gr")), vocab: 'name_gr'},
                {data: 'supplier_provider_surname', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_gr")), vocab: 'surname_gr'},
                {data: 'supplier_provider_status', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_capacity_role_gr")), vocab: 'status_capacity_role_gr'},
                {data: 'mediator_number', type: 'text'},
                {data: 'mediator_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_gr")), vocab: 'name_gr'},
                {data: 'mediator_surname', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_gr")), vocab: 'surname_gr'},
                {data: 'mediator_status', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_capacity_role_gr")), vocab: 'status_capacity_role_gr'},
                {data: 'receiver_number', type: 'text'},
                {data: 'receiver_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_gr")), vocab: 'name_gr'},
                {data: 'receiver_surname', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_gr")), vocab: 'surname_gr'},
                {data: 'receiver_status', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_capacity_role_gr")), vocab: 'status_capacity_role_gr'}
            ];
            nestedHeaders = [
                ['Type of Transaction', 'Type of Good', 'Value', 'Unit', 'Type', 'From', 'To', 'Duration (Days)', 'From', 'To', 'Number', 'Name', 'Surname', 'Status | Capacity | Role', 'Number', 'Name', 'Surname', 'Status | Capacity | Role', 'Number', 'Name', 'Surname', 'Status | Capacity | Role']
            ];
            data = setSubTableData(voyage_transactions[cnt], row, startCol, endCol);
        }
        else if (subTableName.indexOf("transaction_locs") !== -1) {
            var cnt = parentTableName.replace("transactions", "");
            var cols = [
                {data: 'location', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr', renderer: groupRenderer}
            ];
            nestedHeaders = [
                ['Recording Location']
            ];
            data = setSubTableData(voyage_transactions[cnt], row, startCol, endCol);
        }
        subTable = createSubTableInstance(tableId, data, cols, nestedHeaders);
    }
    subTable = createSubTableRightMenu(subTable, subTableName, cols);

}
;
//////////////////////////////   1st TABLE     ////////////////////////////////
///////////////////// FASTCAT RECORD INFORMATION TABLE/////////////////////////

//moved to Tables.js

//////////////////////////////   2nd TABLE     ////////////////////////////////
////////////////////////SOURCE  IDENTITY///////////////////////////////             

var tablesWithoutCommentCols = new Map();

var tableId = "source_identity";
tablesAndHeaders.set(tableId, ['Name', 'Location', 'Collection Title', 'Inventory Number', 'Original Title', 'Archival Title', 'Number', 'From *', 'To *', 'Within', 'Name', 'Location', 'Note', 'Comment']);

tablesWithoutCommentCols.set(tableId, [0, 1, 2, 3, 12]); //define fieds that do not have external content

var source_identity_cols = [
    {data: 'archive_library', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("archive_or_library_gr")), vocab: 'archive_or_library_gr'},
    {data: 'source_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
    {data: 'collection', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("collection_gr")), vocab: 'collection_gr'},
    {data: 'inventory_number', type: 'text'},
    {data: 'book_title', type: 'text'},
    {data: 'book_archival_title', type: 'text'},
    {data: 'book_number', type: 'text'},
    {data: 'book_date_from', type: 'date'},
    {data: 'book_date_to', type: 'date'},
    {data: 'book_date_within', type: 'date'},
    {data: 'issuing_authority', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("local_authority_gr")), vocab: 'local_authority_gr'},
    {data: 'issuing_authority_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
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
        [{label: '', colspan: 2}, '', '', {label: 'Book', colspan: 6}, {label: '', colspan: 2}, ''],
        [{label: 'Archive / Library', colspan: 2}, '', '', {label: '', colspan: 3}, {label: 'Date of Book', colspan: 3}, {label: 'Issuing authority', colspan: 2}, ''],
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
        if ((source_identity_cols[col].vocab === 'location_gr') && (value)) {            
            handle_locations(value,'source_identity',row,col,'LOCS',source_locs);         
        } else if ((source_identity_cols[col].vocab === 'archive_or_library_gr')&& value ) {            
            handle_organizations(value,'source_identity',row, col, 'ORGS');  
        } else if ((source_identity_cols[col].vocab === 'local_authority_gr')&& value ) {
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
tablesAndHeaders.set(tableId, ['Ship name *', 'Ship type *', 'Name', 'Surname', 'Name', 'Surname', 'Name', 'Headquarters Location', 'Note', 'Comment']);
tablesWithoutCommentCols.set(tableId, [9]); //define fieds that do not have external content

var sourcedata = [{ship_name: ''}];

var cols3 = [
    {data: 'ship_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_gr")), vocab: "ship_name_gr"},
    {data: 'ship_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_type_gr")), vocab: "ship_type_gr"},
    {data: 'captain_name', renderer: groupRenderer, type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_gr")), vocab: "name_gr"},
    {data: 'captain_surname', renderer: groupRenderer, type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_gr")), vocab: "surname_gr"},
    {data: 'owner_name', renderer: groupRenderer, type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_gr")), vocab: "name_gr"},
    {data: 'owner_surname', renderer: groupRenderer, type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_gr")), vocab: "surname_gr"},
    //{data: 'owner_location', renderer: groupRenderer, type: 'dropdown',
    //    source: JSON.parse(localStorage.getItem("location_gr")), vocab: "location_gr"},
    {data: 'organization_name', renderer: groupRenderer, type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_gr")), vocab: "organization_gr"},
    {data: 'organization_location', renderer: groupRenderer, type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}


];

var headers = [
    ['', '', {label: '', colspan: 2}, {label: 'Owner', colspan: 4}, ''],
    ['', '', {label: 'Captain', colspan: 2}, {label: 'Person', colspan: 2}, {label: 'Organization', colspan: 2}, ''],
    tablesAndHeaders.get(tableId)
];
var identifier_tableGroups = [[2, 3], [4, 5], [6, 7]];

headers = markHeaders(headers, identifier_tableGroups);
///////////////////////////

//////////////////////////////
var persons_json = new Object();

if (JSON.parse(localStorage.getItem("PERSONS"))) {
    persons_json = persons_json = (JSON.parse(localStorage.getItem("PERSONS")));
}

var ships_json = new Object();

if (JSON.parse(localStorage.getItem("SHIPS"))) {
    ships_json = ships_json = (JSON.parse(localStorage.getItem("SHIPS")));
}


var pp = new Object();

var persons_tbl = new Object();

var record_locs = new Object();
var ships_persons = new Object();
var ship_obj = new Object();
var ships_tbl = new Object();
//////////////
var ship_record_hot = new Handsontable(identifier_table, {
    licenseKey: '',
    data: sourcedata,
    dateFormat: 'YYYY-MM-DD',
    columns: cols3,
    className: "htCenter",
    currentRowClassName: 'currentRow',
    autoWrapRow: true,
    maxRows: 1,
    manualColumnResize: true,
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
        if (col > 1 && col < 4) {
            groupLeftClicked(this, row, col);
        } else if (col > 3 && col < 6) {
            groupLeftClicked(this, row, col);
        } else if (col > 5 && col < 8) {
            groupLeftClicked(this, row, col);
        }
    },
    afterRenderer: function (td, row, col, prop, value) {
        if ((cols3[col].vocab === 'location_gr') && (value)) {          
            handle_multiple_table_instances(row,col,value,'ship_identity',null, null,record_locs, null, 'LOCS');                                    
        } else if (value && ((cols3[col].vocab === 'organization_gr'))) {                        
            handle_multiple_table_instances(row+'_',col,value,'ship_identity',null, null,null,null, 'ORGS');                                                    
        } else if (value && (((cols3[col].vocab.indexOf('ship_name') > -1) || (cols3[col].vocab.indexOf('ship_type') > -1)))) {
            handle_ships(row, col, value, 'ship_identity', [0, 1], ['name', 'type'], 'SHIPS',ship_obj,ships_tbl);
        }
        else if ((value) && ((col > 1 ) && (col < 6))) {             
            handle_multiple_table_instances(row+'_',col,value,'ship_identity',[2, 3], ['name', 'surname_a'],ships_persons, persons_tbl, 'PERSONS');
            handle_multiple_table_instances(row+'__',col,value,'ship_identity',[4, 5], ['name', 'surname_a'],ships_persons, persons_tbl, 'PERSONS');                                                       
        }                       
    }
    
    
});
ship_record_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(cols3[col].vocab);
            }
            else if (key === 'view_add') {
                var col = options.start.col;
                var row = options.start.row;
                var tableId = this.rootElement.getAttribute("id");
                var value = ship_record_hot.getDataAtCell(options.start.row, options.start.col);
                var label = cols3[col].vocab;
                create_location_modal(tableId, value, row, col, label);
            }
            else if (key === 'add') {
                var colClicked = ship_record_hot.getSelectedRange().to.col;
                if (colClicked > 1 && colClicked < 4) {
                    groupClicked("identifier_table", "captains", 0, 2, 3);
                } else if (colClicked > 3 && colClicked < 6) {
                    groupClicked("identifier_table", "ownerPersons", 0, 4, 5);
                } else if (colClicked > 5 && colClicked < 8) {
                    groupClicked("identifier_table", "ownerOrganizations", 0, 6, 7);
                }
            }
        },
        items: {
            "undo": {},
            "redo": {},
            "hsep1": "---------",
            "copy": {},
            "cut": {},
            "hsep2": "---------",
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function() {
                    var col = ship_record_hot.getSelectedRange().to.col;
                    var label = cols3[col].vocab;
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
                    var label = cols3[col].vocab;

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
//////////////////////////////   4th TABLE     ////////////////////////////////
/////////////////////////VOYAGE INFORMATION/////////////////////////////////////////                       
var tableId = "example1";
tablesAndHeaders.set(tableId, ['Source Pages', 'Voyage number', 'Type', 'From', 'To', 'From', 'To','Ports of Call', 'Name', 'Surname', 'Grade', 'Analytic Transactions', 'Note', 'Comment'])



tablesWithoutCommentCols.set(tableId, [10, 11]); //define fieds that do not have external content

var voyage_data = [
    {voyage_source_page: ""}, {voyage_source_page: ""}, {voyage_source_page: ""},
    {voyage_source_page: ""}, {voyage_source_page: ""}, {voyage_source_page: ""},
    {voyage_source_page: ""}, {voyage_source_page: ""}, {voyage_source_page: ""},
    {voyage_source_page: ""}, {voyage_source_page: ""}, {voyage_source_page: ""},
    {voyage_source_page: ""}, {voyage_source_page: ""}, {voyage_source_page: ""}
];
var cols = [{data: 'voyage_source_page', type: 'text'},
    {data: 'voyage_number', type: 'text'},
    {data: 'date_type', type: 'dropdown', source: ['Julian', 'Gregorian']},
    {data: 'date_from', type: 'date'},
    {data: 'date_to', type: 'date'},
    {data: 'route_from', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
    {data: 'route_to', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
    {data: 'ports_of_call', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr',renderer: groupRenderer},
    {data: 'signed_by_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_gr")), vocab: 'name_gr'},
    {data: 'signed_by_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_gr")), vocab: 'surname_gr'},
    {data: 'signed_by_grade', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_gr")), vocab: 'status_gr'},
    {data: 'transactions', renderer: buttonRenderer, readOnly: true},
    {data: 'voyage_note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];

function buttonRenderer(instance, td, row, col, prop, value, cellProperties) {
    var title = instance.getDataAtCell(row, 1);
    if (title) {
        title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
    }

    td.innerHTML = "<a onclick='createNestedTable(" + row + "," + null + ",\"" + title + "\")'> <button id='Row_" + row + "' style='padding:2px; font-size:8px;' type='button' class=' nested_button btn btn-outline-secondary'>Nested table</button></a>"; // + value;
    td.className = 'htCenter';
    return td;
}
/*
 function button2Renderer(instance, td, row, col, prop, value, cellProperties) {
 td.innerHTML = "<a onclick='createSecondNestedTable(" + row + ")'> <button id='second_Row_" + row + "' style='padding:2px; font-size:8px;' type='button' class=' second_nested_button btn btn-outline-secondary'>Nested table</button></a>"; // + value;
 td.className = 'htCenter';
 return td;
 }*/



///////////////////////////////////////////////////////////

var voyages_persons = new Object();
var voyages_locs = new Object();

/////////////////////////////////////////////

/////////////////////////////

var voyages_tableGroups = [[7, 7]];

var headers = [
        ['', '', {label: '', colspan: 3}, {label: '', colspan: 2},'', {label: '', colspan: 3}, '', ''],
        ['', '', {label: 'Date', colspan: 3}, {label: 'Route', colspan: 2},'', {label: 'Signed by', colspan: 3}, /* {label: 'Credit', colspan: 2}, {label: 'Debt', colspan: 2}, {label: 'Credit', colspan: 2}, {label: 'Debt', colspan: 2},*/ '', /* '',*/ ''],
        tablesAndHeaders.get(tableId)
    ];
headers = markHeaders(headers, voyages_tableGroups);

var cont = document.getElementById(tableId);
var voyages_hot = new Handsontable(cont, {
    licenseKey: '',
    data: voyage_data,
    dateFormat: 'YYYY-MM-DD',
    columns: cols,
    contextMenu: true,
    className: "htCenter",
    currentRowClassName: 'currentRow',
    rowHeaders: true,
    manualColumnResize: true,
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
    afterRenderer: function(td, row, col, prop, value) {
        if ((cols[col].vocab === 'location_gr') && (value)) {
            handle_multiple_table_instances(row,col,value,'voyages',null, null,voyages_locs, null, 'LOCS');             
        }else if (((col===8)||(col===9))&&value) {                     
            handle_persons(row, col, value, 'voyages', [8, 9], ['name', 'surname_a'], voyages_persons, persons_tbl, 'PERSONS');            
        }
    },
     afterRender: function() {
        markGroups(this);
    },
    afterSelectionEnd: function(row, col) {      
        if (col > 6 && col < 8) {
            groupLeftClicked(this, row, col);
        }
    }
});
voyages_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(cols[col].vocab);
            }
            else if (key === 'view_add') {
                var col = options.start.col;
                var row = options.start.row;
                var tableId = this.rootElement.getAttribute("id");
                var value = voyages_hot.getDataAtCell(options.start.row, options.start.col);
                var label = cols[col].vocab;
                create_location_modal(tableId, value, row, col, label);
            }
            else if (key === 'add') {
                var colClicked = voyages_hot.getSelectedRange().to.col;
                var rowClicked = voyages_hot.getSelectedRange().to.row;
                if (colClicked > 6 && colClicked < 8) {
                    groupClicked("example1", "ports_of_call", rowClicked, 7, 7);
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
            "add10rows": {
                name: "Add 10 rows",
                disabled: function() {
                    return voyages_hot.countRows() - 1 !== voyages_hot.getSelected()[0];
                },
                callback: function() {
                    this.alter('insert_row', this.getSelected()[0] + 1, 10);
                }
            },
            "hsep5": "---------",
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function() {
                    var col = voyages_hot.getSelectedRange().to.col;
                    var label = cols[col].vocab;
                    if (label) {
                        update_Vocs();
                        return voyages_hot.getSelectedRange().to.col !== col;
                    } else {
                        return voyages_hot.getSelectedRange().to.col !== -1;
                    }
                }},
             "add": {
                name: "Add table",
                hidden: function() {
                    return isAddTableMenuVisible(this, identifier_tableGroups);

                }},
            "hsep6": "---------",
            "view_add": {
                name: "View/Add Location Identity info",
                hidden: function() {
                    var col = voyages_hot.getSelectedRange().to.col;
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
///////////////////////  Analytic Voyage Transactions   Nested Tables       /////////////////////////////


var voyage_transactions = [];
var transaction_columns = [
    {data: 'source_pages', type: 'text'},
    {data: 'typos_tameiou', type: 'dropdown',
        source: ['Pay', 'Receive']},
    {data: 'time_date_type', type: 'dropdown', source: ['Julian', 'Gregorian'], renderer: groupRenderer},
    {data: 'time_date_to', type: 'date', renderer: groupRenderer},
    {data: 'time_date', type: 'date', renderer: groupRenderer},
    {data: 'time_date_duration', type: 'text', renderer: groupRenderer},
    {data: 'dep_arrival_date', type: 'dropdown',
        source: ['Departure', 'Arrival', 'Departure/Arrival'], renderer: groupRenderer},
    {data: 'location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr', renderer: groupRenderer},
    {data: 'transaction_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("transaction_type_gr")), vocab: 'transaction_type_gr', renderer: groupRenderer},
    {data: 'type_of_good', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("good_type_gr")), vocab: 'good_type_gr', renderer: groupRenderer},
    {data: 'good_value', type: 'text', renderer: groupRenderer},
    {data: 'good_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr', renderer: groupRenderer},
    {data: 'transaction_date_type', type: 'dropdown', source: ['Julian', 'Gregorian'], renderer: groupRenderer},
    {data: 'time_from', type: 'date', renderer: groupRenderer},
    {data: 'time_to', type: 'date', renderer: groupRenderer},
    {data: 'time_duration', type: 'text', renderer: groupRenderer},
    {data: 'trancaction_place_from', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr', renderer: groupRenderer},
    {data: 'trancaction_place_to', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr', renderer: groupRenderer},
    {data: 'supplier_provider_number', type: 'text', renderer: groupRenderer},
    {data: 'supplier_provider_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_gr")), vocab: 'name_gr', renderer: groupRenderer},
    {data: 'supplier_provider_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_gr")), vocab: 'surname_gr', renderer: groupRenderer},
    {data: 'supplier_provider_status', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_gr")), vocab: 'status_capacity_role_gr', renderer: groupRenderer},
    {data: 'mediator_number', type: 'text', renderer: groupRenderer},
    {data: 'mediator_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_gr")), vocab: 'name_gr', renderer: groupRenderer},
    {data: 'mediator_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_gr")), vocab: 'surname_gr', renderer: groupRenderer},
    {data: 'mediator_status', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_gr")), vocab: 'status_capacity_role_gr', renderer: groupRenderer},
    {data: 'receiver_number', type: 'text', renderer: groupRenderer},
    {data: 'receiver_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_gr")), vocab: 'name_gr', renderer: groupRenderer},
    {data: 'receiver_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_gr")), vocab: 'surname_gr', renderer: groupRenderer},
    {data: 'receiver_status', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_gr")), vocab: 'status_capacity_role_gr', renderer: groupRenderer},
    {data: 'trasnfered_money_form', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("money_form_gr")), vocab: 'money_form_gr'},
    {data: 'trasnfered_money_value', type: 'text'},
    {data: 'trasnfered_money_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
    {data: 'currency_rate', type: 'text'},
    {data: 'equivalennt_value', type: 'text'},
    {data: 'equivalennt_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
    {data: 'event_description', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}


];

var transactionsGroups = [[2, 6], [7, 7], [8, 29]];


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

    var table_header = "";
    if (!((header == null) || (header == "null"))) {
        table_header = ' / Voyage Number : ' + header;
    }


    var plus = parseInt(cnt) + 1;
    var html = "<div  class='panel panel-default nested_table not_visible' style='border:transparent; margin-top:5px;'>" +
            "<div class='panel-heading' role='tab' id='heading" + cnt + "'>" +
            "<h4 class='panel-title'>" +
            "    <a style='background-color:#589AAF;' class='collapsed' role='button' onclick='close_nested(" + cnt + ")'  href='#collapse" + cnt + "'>" +
            "<span class='pull-right glyphicon glyphicon-remove'></span>" + " Analytic Transaction " + plus + "  " + table_header +
            "     </a>" +
            "</h4>" +
            "</div>" +
            "<div id='collapse" + cnt + "' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='heading" + cnt + "'>" +
            "    <div style='padding-top:6px;' class='panel-body'>" +
            "    <span style=' color:#163758; padding:0px;font-size: 11px'>Use the source language to fill in the fields of this table</span>" +
            "        <div>" +
            "            <div id='transactions" + cnt + "' class='hot handsontable htRowHeaders htColumnHeaders' style='height: 450px; overflow: hidden; width: 100%; margin:5px 0px 0px 4px;'></div>" +
            "        </div> " +
            "    </div>" +
            "</div>" +
            "</div>";

    if ($('#heading' + cnt).size() === 0) {

        $('#insert_here').append(html);

        if (data == null) {
            data = [{source_pages: ""}, {source_pages: ""}, {source_pages: ""},
                {source_pages: ""}, {source_pages: ""}, {source_pages: ""},
                {source_pages: ""}, {source_pages: ""}, {source_pages: ""},
                {source_pages: ""}, {source_pages: ""}, {source_pages: ""},
                {source_pages: ""}, {source_pages: ""}, {source_pages: ""}];
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

        var container = document.getElementById(tableId);
        tablesAndHeaders.set('transactions', ['Source Pages', 'Pay / Receive', 'Type', 'From', 'To/At', 'Duration (Days)', 'Departure / Arrival', 'Recording Location', 'Type of Transaction', 'Type of good', 'Value', 'Unit', 'Type', 'From', 'To/At', 'Duration (Days)', 'From', 'To/At', 'Number', 'Name', 'Surname', 'Status | Capacity | Role', 'Number', 'Name', 'Surname', 'Status | Capacity | Role', 'Number', 'Name', 'Surname', 'Status | Capacity | Role', 'Form of Money', 'Value', 'Unit', 'Currency rate', 'Value', 'Unit', 'Transaction Description', 'Note', 'Comment']);

        tablesWithoutCommentCols.set(tableId, [37]); //define fieds that do not have external content


        var headers = [
            ['', '', {label: '', colspan: 5}, '', {label: 'Transaction', colspan: 22}, {label: '', colspan: 3}, '', {label: '', colspan: 2}, '', ''],
            ['', '', {label: 'Recording Time', colspan: 5}, '', '', '', {label: 'Quantity', colspan: 2}, {label: 'Service Time', colspan: 4}, {label: 'Service Location', colspan: 2}, {label: 'Supplier / Provider', colspan: 4}, {label: 'Mediator', colspan: 4}, {label: 'Receiver', colspan: 4}, {label: 'Tranfered money', colspan: 3}, '', {label: 'Equivalent currency', colspan: 2}, '', ''],
            tablesAndHeaders.get('transactions')
        ];


        headers = markHeaders(headers, transactionsGroups);


        var voyage_transaction = new Handsontable(container, {
            licenseKey: '',
            data: data,
            dateFormat: 'YYYY-MM-DD',
            columns: transaction_columns,
            contextMenu: true,
            autoWrapRow: true,
            manualColumnResize: true,
            className: "htCenter htMiddle",
            currentRowClassName: 'currentRow',
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
                if (col > 1 && col < 7) {
                    groupLeftClicked(this, row, col);
                } else if (col > 7 && col < 30) {
                    groupLeftClicked(this, row, col);
                } else if (col === 7) {
                    groupLeftClicked(this, row, col);
                }
            }
        });


        voyage_transaction.updateSettings({
            contextMenu: {
                callback: function(key, options) {
                    if (key === 'edit_vocabulary') {
                        var col = options.start.col;
                        create_voc_modal(transaction_columns[col].vocab);
                    }
                    else if (key === 'view_add') {
                        var col = options.start.col;
                        var row = options.start.row;
                        var tableId = this.rootElement.getAttribute("id");
                        var value = voyage_transaction.getDataAtCell(options.start.row, options.start.col);
                        var label = transaction_columns[col].vocab;
                        create_location_modal(tableId, value, row, col, label);
                    }
                    else if (key === 'add') {
                        var colClicked = voyage_transaction.getSelectedRange().to.col;
                        var rowClicked = voyage_transaction.getSelectedRange().to.row;
                        if (colClicked > 1 && colClicked < 7) {
                            groupClicked("transactions" + cnt, "transactionRecordings" + cnt, rowClicked, 2, 6);
                        } else if (colClicked > 7 && colClicked < 30) {
                            groupClicked("transactions" + cnt, "transaction_tables" + cnt, rowClicked, 8, 29);
                        } else if (colClicked === 7) {
                            groupClicked("transactions" + cnt, "transaction_locs" + cnt, rowClicked, 7, 7);
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
                    "hsep1": "---------",
                    "remove_row": {
                        disabled: function() {
                            if (((voyage_transaction.getSelected()[0]) < 3) || ((voyage_transaction.getSelected()[2]) < 3)) {
                                return true;
                            }
                        }
                    },
                    "hsep2": "---------",
                    "edit_vocabulary": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            var col = voyage_transaction.getSelectedRange().to.col;
                            var label = transaction_columns[col].vocab;
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
                        }
                    },
                    "hsep5": "---------",
                    "view_add": {
                        name: "View/Add Location Identity info",
                        hidden: function() {
                            var col = voyage_transaction.getSelectedRange().to.col;
                            var label = transaction_columns[col].vocab;

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
        voyage_transactions[cnt] = voyage_transaction;
    }
    else {

        if (!((header == null) || (header == "null"))) {
            $('#heading' + cnt).children().children().html('<span class="pull-right glyphicon glyphicon-remove"></span> Analytic Transaction ' + plus + ' / Voyage Number : ' + header);
        }

        $('#Row_' + cnt).css({'background': '#638BC7'});
        $('#Row_' + cnt).css({'color': '#ffffff'});
    }

}
;

///////////////////////////////EXPORT IMPORT////////////////////////////////////

function createRecordJson(usage) {

    var cat_info = createJson(catalogue_info, cols1, usage);
    var source_id = createJson(source_identity_data, source_identity_cols, usage);
    var source_contents = createJson(ship_record_hot, cols3, usage);
    var voyages_data = createJson(voyages_hot, cols, usage);
    var voyage_keys = Object.keys(voyage_transactions);
    var transactions = new Object();
    
        
    if (((usage === 'excel') && (nested_tables)) || ((mode === 'teamView') && (nested_tables))) {

        $.each(nested_tables, function (cnt) {
            var voyages_trans = new Array();
            $.each(this, function () {
                voyages_trans.push(this);
            });
            console.log('exporting nested table: ' + cnt);
            createNestedTable(cnt, voyages_trans);
            $(".nested_table").hide();
            transactions[cnt] = createJson((voyage_transactions[cnt]), transaction_columns, usage);
        });
        nested_tables = null;
    } else {
        transactions = nested_tables_object;     
        for (var i = 0; i < voyage_keys.length; i++) {
            transactions[voyage_keys[i]] = createJson((voyage_transactions[voyage_keys[i]]), transaction_columns, usage);
        }
    }


    var json = new Object();
    cat_info.date_until = getCurrentDate();
    catalogue_info.setDataAtCell(0, 2, getCurrentDate());
    json['record_information'] = cat_info;
    json['source_identity'] = source_id;
    json['ship_records'] = source_contents;
    json['voyages'] = voyages_data;
    
    
    json['voyages_transactions'] = transactions; 
    
    
   
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
        terms = new Object();
        $.each(source_contents, function (col) {
            var val = this.toString();
            $.each(cols3, function (col_no) {
                if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                    var label = $(this).attr('vocab');                    
                    handle_json_vocs(val,label,0,col,col_no,'ship_identity',terms);
                }
            });                                                            
        });
        
        
         /////////////////// voyage calendar
        
        terms = new Object();
        $.each(voyages_data, function (row) {            
            $.each(this, function (col) {
                var val = this.toString();
                $.each(cols, function (col_no) {
                    if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                        var label = $(this).attr('vocab');                      
                        handle_json_vocs(val, label, row, col, col_no, 'voyages', terms);
                    }
                });
            });
        });           
    
    ////////////////////////////////////////////////////////////////////////////
    $.each(transactions, function (cnt) { 
        var transaction_persons = new Object();    
        var persons_tbl = new Object();
        var transaction_locs = new Object();
        var ship_obj = new Object();
        var ships_tbl = new Object();
        var terms = new Object();
        console.log("---------Collecting instances from table "+cnt+"------------------");
        $.each(this, function (row) {
            var row_data = this;
            $.each(this, function (col) {  
                
               //////////////handle vocabulary nested//////////////////                
                    var val = this;
                    $.each(transaction_columns, function (col_no) {
                        if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                            var label = $(this).attr('vocab');
                            handle_vocabulary(val, label, this);
                            handle_json_vocs(val,label,row,col,col_no,'tramsactions_' + cnt,terms);
                        }
                    });
                    ////////////////////////////////////////////////////// 
               if ((col === 'supplier_provider_name')) {                     
                    if (( row_data['supplier_provider_name'].toLowerCase().indexOf('(organization)')>-1)||(row_data['supplier_provider_name'].toLowerCase().indexOf('(organisation)')>-1)){                                                
                        handle_multiple_table_instances(row, 19,row_data['supplier_provider_name'].toLowerCase().replace('(organisation)', ''), 'transactions_' + cnt, null, null, null, null, 'ORGS');                    
                    }else if ((row_data['supplier_provider_name'].toLowerCase().indexOf('(ship)')>-1)){                                                                        
                        handle_ships(row, 19, row_data['supplier_provider_name'].replace('(ship)', ''), 'transactions_' + cnt, [19], ['name'], 'SHIPS',ship_obj,ships_tbl);
                    }                    
                    else{                          
                        if(row_data['supplier_provider_name']){                                                                                    
                            handle_multiple_table_instances(row, 19, row_data['supplier_provider_name'], 'transactions_' + cnt, [19, 20,21], ['name', 'surname_a','status'], transaction_persons, persons_tbl, 'PERSONS');
                        }if (row_data['supplier_provider_surname']){         
                            handle_multiple_table_instances(row, 20, row_data['supplier_provider_surname'], 'transactions_' + cnt, [19, 20,21], ['name', 'surname_a','status'], transaction_persons, persons_tbl, 'PERSONS');                        
                        }if (row_data['supplier_provider_status']){         
                            handle_multiple_table_instances(row, 21, row_data['supplier_provider_status'], 'transactions_' + cnt, [19, 20,21],['name', 'surname_a','status'], transaction_persons, persons_tbl, 'PERSONS');                        
                        }
                    }                                     
                }
                else if (col === 'mediator_name') {
                    if (( row_data['mediator_name'].toLowerCase().indexOf('(organization)')>-1)||(row_data['mediator_name'].toLowerCase().indexOf('(organisation)')>-1)){                                                
                        handle_multiple_table_instances(row + '_', 23,row_data['mediator_name'].toLowerCase().replace('(organisation)', ''), 'transactions_' + cnt, null, null, null, null, 'ORGS');                    
                    }else if (( row_data['mediator_name'].indexOf('(ship)')>-1)){                                                                       
                        handle_ships(row+'_', 23, row_data['mediator_name'].replace('(ship)', ''), 'transactions_' + cnt, [23], ['name'], 'SHIPS',ship_obj,ships_tbl);
                    }                    
                    else {                          
                        if(row_data['mediator_name']){                                                                                    
                            handle_multiple_table_instances(row + '_', 23, row_data['mediator_name'], 'transactions_' + cnt, [23, 24,25], ['name', 'surname_a','status'], transaction_persons, persons_tbl, 'PERSONS');
                        }if (row_data['mediator_surname']){         
                            handle_multiple_table_instances(row + '_', 24, row_data['mediator_surname'], 'transactions_' + cnt,[23, 24,25], ['name', 'surname_a','status'], transaction_persons, persons_tbl, 'PERSONS');                        
                        }if (row_data['mediator_status']){         
                            handle_multiple_table_instances(row + '_', 25, row_data['mediator_status'], 'transactions_' + cnt,[23, 24,25], ['name', 'surname_a','status'], transaction_persons, persons_tbl, 'PERSONS');                        
                        }
                    }                                     
                }             
                else if (col === 'receiver_name') {
                    if (( row_data['receiver_name'].toLowerCase().indexOf('(organization)')>-1)||(row_data['receiver_name'].toLowerCase().indexOf('(organisation)')>-1)){                                                
                        handle_multiple_table_instances(row + '__', 27,row_data['receiver_name'].toLowerCase().replace('(organisation)', ''), 'transactions_' + cnt, null, null, null, null, 'ORGS');                    
                    }else if (( row_data['receiver_name'].indexOf('(ship)')>-1)){                                                                       
                        handle_ships(row+'__', 27, row_data['receiver_name'].replace('(ship)', ''), 'transactions_' + cnt, [27], ['name'], 'SHIPS',ship_obj,ships_tbl);
                    }                    
                    else {                          
                        if(row_data['receiver_name']){                                                                                    
                            handle_multiple_table_instances(row + '__', 27, row_data['receiver_name'], 'transactions_' + cnt,[27,28,29], ['name', 'surname_a','status'], transaction_persons, persons_tbl, 'PERSONS');
                        }if (row_data['receiver_surname']){         
                            handle_multiple_table_instances(row + '__', 28, row_data['receiver_surname'], 'transactions_' + cnt,[27,28,29], ['name', 'surname_a','status'], transaction_persons, persons_tbl, 'PERSONS');                        
                        }if (row_data['receiver_status']){         
                            handle_multiple_table_instances(row + '__', 29, row_data['receiver_status'], 'transactions_' + cnt,[27,28,29], ['name', 'surname_a','status'], transaction_persons, persons_tbl, 'PERSONS');                        
                        }
                    }                                     
                }else if (col ==='location'){                    
                    handle_multiple_table_instances(row,7,this.toString(),'analytic_calendar_' + cnt,null, null,transaction_locs, null, 'LOCS');                                        
                }else if (col ==='trancaction_place_from'){
                    handle_multiple_table_instances(row,16,this.toString(),'analytic_calendar_' + cnt,null, null,transaction_locs, null, 'LOCS');                                        
                }else if (col ==='trancaction_place_to'){
                    handle_multiple_table_instances(row,17,this.toString(),'analytic_calendar_' + cnt,null, null,transaction_locs, null, 'LOCS');                                        
                }
                   
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
    ship_record_hot.loadData(data.ship_records);

    var voyages_data = new Array();
    $.each(data.voyages, function() {
        voyages_data.push(this);
    });
    voyages_hot.loadData(voyages_data);

    // Analytic Transactions
    if (data.voyages_transactions) {
        
        nested_tables_object = data.voyages_transactions;
        
        $.each(data.voyages_transactions, function(cnt) {
            var voyages_trans = new Array();
            $.each(this, function() {
                voyages_trans.push(this);
            });
            
            if (mode === 'teamView') {
                nested_tables[cnt] = voyages_trans;
            } else {
                nested_tables[cnt] = voyages_trans;
                //createNestedTable(cnt, voyages_trans);
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

    var analytic_transactions = new Array();

    $.each(json.voyages_transactions, function(cnt) {
        $.each(this, function() {
            analytic_transactions.push(Object.assign({}, (json.voyages[cnt]), (this)));
        });
    });

    if (analytic_transactions.length < 1) {
        analytic_transactions.push('');
    }

    var sheets = new Array();
    sheets.push([json.record_information]);
    sheets.push([json.source_identity]);
    sheets.push([json.ship_records]);
    sheets.push(json.voyages);
    sheets.push(analytic_transactions);

    var nestedGroups = createMultipleNestedTables(json['voyages_transactions'], transactionsGroups, cols3, transaction_columns);
    var result = createExcelSheetsData(sheets, nestedGroups);

    var opts = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Source Identity', header: false}, {sheetid: 'Ship Identity', header: true}, {sheetid: 'Voyages', header: true}, {sheetid: 'Analytic Voyages', header: true}];
    var res = alasql('SELECT * INTO XLSX("' + $('#unique_filename').text() + '.xlsx",?) FROM ?', [opts, result]);

});

////////////////////////////////////////////////////////////////////////////////
///////////////Update Vocabularies
function update_Vocs() {
    
    if (mode === null) {//only update vocabularies in edit mode
        var tables = [];
        var voyage_keys = Object.keys(voyage_transactions);

        for (var i = 0; i < voyage_keys.length; i++) {
            tables.push(voyage_transactions[voyage_keys[i]]);
        }
        tables.push(catalogue_info, source_identity_data, ship_record_hot, voyages_hot);
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
            // console.log(this.tableVariable);
            if (table_id === "source_identity") {
                old_val = source_identity_data.getDataAtCell(this.row, this.col, value);
                source_identity_data.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "identifier_table") {
                old_val = ship_record_hot.getDataAtCell(this.row, this.col, value);
                ship_record_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "example1") {
                old_val = voyages_hot.getDataAtCell(this.row, this.col, value);
                voyages_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id.indexOf("transactions") !== -1) {
                var cnt = table_id.replace("transactions", "");
                old_val = voyage_transactions[cnt].getDataAtCell(this.row, this.col, value);
                voyage_transactions[cnt].setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "catalogue_info") {
                old_val = catalogue_info.getDataAtCell(this.row, this.col, value);
                catalogue_info.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            }
        });
    }
}
;

////////////////////////////////////////////////////////////////////////////////

function set_Text_val(row, col, val, parentTable) {
    if (parentTable.indexOf("transactions") !== -1) {
        var cnt = parentTable.replace("transactions", "");
        voyage_transactions[cnt].setDataAtCell(row, col, val);
    } else if (parentTable === "source_identity") {
        source_identity_data.setDataAtCell(row, col, val);
    } else if (parentTable === "example1") {
        voyages_hot.setDataAtCell(row, col, val);
    } else if (parentTable === "identifier_table") {
        ship_record_hot.setDataAtCell(row, col, val);
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
    tmp['source_identity']['source_language'] = 'Greek';
    tmp['ship_identity'] = oneRow_with_Groups(json.ship_records, identifier_tableGroups, cols3);
    tmp['voyages'] = nested_with_Groups(json.voyages_transactions, json.voyages, transactionsGroups, transaction_columns, 'transactions', 'voyage_');

    root['root'] = tmp;
    var xml = formatXml(json2xml(root));

    console.log(root);

    xml = xml.replace(/<voyage_(\d+)>/g, '<voyage index="$1">');
    xml = xml.replace(/<\/voyage_(\d+)>/g, "</voyage>");

    xml = xml.replace(/<row_(\d+)>/g, '<row index="$1">');
    xml = xml.replace(/<\/row_(\d+)>/g, "</row>");

    xml = xml.replace(/<group_data_(\d+)>/g, '<group_data index="$1">');
    xml = xml.replace(/<\/group_data_(\d+)>/g, "</group_data>");


    return (xml);
}
;
