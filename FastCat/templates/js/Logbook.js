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
    } else if (parentTable === 'logbook_ship_record') {
        ship_record_hot.setDataAtCell(row, col, val);
    } else if (parentTable.indexOf("transactions") !== -1) {
        var cnt = parentTable.replace("transactions", "");
        voyage_transactions[cnt].setDataAtCell(row, col, val);
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

        } else if (subTableName === "ownerCaptains") {
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

        } else if (subTableName === "other_ship_names") {
            var cols = [{data: 'other_ship_name', type: 'dropdown', source: JSON.parse(localStorage.getItem("ship_name_gr")), vocab: "ship_name_gr"}];
            nestedHeaders = [
                ['Other Ship Name']
            ];
            data = setSubTableData(ship_record_hot, row, startCol, endCol);

        } else if (subTableName === "ownerPersons") {
            var cols = [
                {data: 'owner_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_gr")), vocab: 'name_gr'},
                {data: 'owner_surname', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_gr")), vocab: 'surname_gr'}
                // {data: 'owner_location', type: 'dropdown',
                //      source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'}
            ];
            nestedHeaders = [
                ['Name', 'Surname']
            ];
            data = setSubTableData(ship_record_hot, row, startCol, endCol);

        } else if (subTableName === "ownerOrganizations") {
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

        } else if (subTableName === "registries") {
            var cols = [{data: 'registry_port', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
                {data: 'registry_number', type: 'text'},
                {data: 'registry_year', type: 'text'}];

            nestedHeaders = [
                ['Port', 'Number', 'Year']
            ];
            data = setSubTableData(ship_record_hot, row, startCol, endCol);

        }
///       
        else if (subTableName === "at_ports") {
            var cols = [{data: 'at_port', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'}
            ];

            nestedHeaders = [
                ['At Port']
            ];
            data = setSubTableData(voyage_calendar, row, startCol, endCol);

        } else if (subTableName.indexOf("calendarsWeathers") !== -1) {
            var cnt = parentTableName.replace("transactions", "");
            var cols = [
                {data: 'calendar_weather', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("calendar_weather_gr")), vocab: 'calendar_weather_gr'}];
            nestedHeaders = [
                ['Weather']
            ];
            data = setSubTableData(voyage_transactions[cnt], row, startCol, endCol);
        } else if (subTableName.indexOf("calendarsWinds") !== -1) {
            var cnt = parentTableName.replace("transactions", "");
            var cols = [
                {data: 'calendar_wind_strength', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("wind_strength_gr")), vocab: 'wind_strength_gr'},
                {data: 'calendar_wind_direction', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("wind_direction_gr")), vocab: 'wind_direction_gr'}
            ];
            nestedHeaders = [
                ['Strength', 'Direction']
            ];
            data = setSubTableData(voyage_transactions[cnt], row, startCol, endCol);

        } else if (subTableName.indexOf("calendarsTypesOfEvents") !== -1) {
            var cnt = parentTableName.replace("transactions", "");
            var cols = [
                {data: 'calendar_event_type', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("event_type_gr")), vocab: 'event_type_gr'}];
            nestedHeaders = [
                ['Type of Event']
            ];
            data = setSubTableData(voyage_transactions[cnt], row, startCol, endCol);

        } else if (subTableName.indexOf("calendarsGoods") !== -1) {
            var cnt = parentTableName.replace("transactions", "");
            var cols = [
                {data: 'good_type', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("good_type_gr")), vocab: 'good_type_gr'},
                {data: 'good_quantity_value', type: 'text'},
                {data: 'good_quantity_unit', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
                {data: 'means_of_loading', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("means_of_loading_gr")), vocab: 'means_of_loading_gr'}
            ];
            nestedHeaders = [
                ['Type', 'Value', 'Unit', 'Means of Loading']

            ];
            data = setSubTableData(voyage_transactions[cnt], row, startCol, endCol);

        } else if (subTableName.indexOf("calendarsRelateds") !== -1) {
            var cnt = parentTableName.replace("transactions", "");
            var cols = [
                {data: 'related_person_role', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("role_in_event_gr")), vocab: 'role_in_event_gr'},
                {data: 'related_person_number', type: 'text'},
                {data: 'related_person_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_gr")), vocab: 'name_gr'},
                {data: 'related_person_surname', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_gr")), vocab: 'surname_gr'},
                {data: 'related_person_status_capacity', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_capacity_role_gr")), vocab: 'status_capacity_role_gr'}
            ];
            nestedHeaders = [
                ['Role in event', 'Number of Persons', 'Name', 'Surname', 'Status | Capacity | Profession']
            ];
            data = setSubTableData(voyage_transactions[cnt], row, startCol, endCol);
        } else if (subTableName.indexOf("parts_of_ship") !== -1) {
            var cnt = parentTableName.replace("transactions", "");
            var cols = [
                {data: 'part_of_ship', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("part_of_ship_gr")), vocab: 'part_of_ship_gr'}
            ];
            nestedHeaders = [
                ['Part of Ship']
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

//Moved to Tables.js

//////////////////////////////   2nd TABLE     ////////////////////////////////
////////////////////////SOURCE  IDENTITY///////////////////////////////             
var tablesWithoutCommentCols = new Map();

var tableId = "source_identity";
tablesAndHeaders.set(tableId, ['Name', 'Location', 'Collection Title', 'Original Title', 'Archival Title', 'Number', 'From *', 'To *', 'Within', 'Name', 'Location', 'Note', 'Comment']);
tablesWithoutCommentCols.set(tableId, [0, 1, 2, 11]); //define fieds that do not have external content



var sourcedata = [
    {archive_library: ''}
];

var source_identity_cols = [
    {data: 'archive_library', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("archive_or_library_gr")), vocab: 'archive_or_library_gr'},
    {data: 'source_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
    {data: 'collection', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("collection_gr")), vocab: 'collection_gr'},
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
    {data: 'note', renderer: textRender, type: 'text'},
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
        [{label: '', colspan: 2}, '', {label: 'Book', colspan: 6}, {label: '', colspan: 2}, ''],
        [{label: 'Archive / Library', colspan: 2}, '', {label: '', colspan: 3}, {label: 'Date of Book', colspan: 3}, {label: 'Issuing authority', colspan: 2}, ''],
        tablesAndHeaders.get(tableId)
    ],
    cells: function (row, col, prop) {
        if (this.vocab) {
            handle_vocabulary(this.instance.getDataAtCell(row, col), this.vocab, this);           
        }
    },
    /* Next 3 properties added to support comments*/
    comments: true,
    hiddenColumns: {
        columns: [tablesAndHeaders.get(tableId).length - 1] //last column only
    },
    afterLoadData: function () {
        addCommentForContentFoundOutsideTheSource(this);
    },
    afterRenderer: function (td, row, col, prop, value) {
        if ((source_identity_cols[col].vocab === 'location_gr') && (value)) {
            handle_locations(value, 'source_identity', row, col, 'LOCS', source_locs);
        } else if (((source_identity_cols[col].vocab === 'archive_or_library_gr') && value)) {
            handle_organizations(value, 'source_identity', row, col, 'ORGS');
        }else if ((source_identity_cols[col].vocab === 'local_authority_gr')&&value) {
            handle_organizations(value, 'source_identity', row+'_', col, 'ORGS');
        }
    }
});


source_identity_data.updateSettings({
    contextMenu: {
        callback: function (key, options) {
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
                hidden: function () {
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
                hidden: function () {
                    var tableId = this.rootElement.getAttribute("id");
                    var col = this.getSelectedRange().to.col;
                    if (tablesWithoutCommentCols.get(tableId).includes(col)) {
                        return true;
                    }
                },
                callback: function () {
                    comment(this);
                }
            },
            "deleteComment": {
                name: "Undo Mark external content",
                hidden: function () {
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
                callback: function () {
                    uncomment(this);
                }
            }
        }
    }
});


//////////////////////////////   3rd TABLE     ////////////////////////////////
/////////////////////////////SHIP RECORD/////////////////////////////////////////////             

var tableId = "logbook_ship_record";
tablesAndHeaders.set(tableId, ['Ship name *', 'Other Ship Name', 'Ship type *', 'Telegraphic Code', 'Port', 'Number', 'Year', 'Tonnage', 'Name', 'Surname', 'Name', 'Surname', /* 'Headquarters Location',*/ 'Name', 'Headquarters Location', 'Note', 'Comment']);

tablesWithoutCommentCols.set(tableId, [14]); //define fieds that do not have external content


var cols3 = [
    {data: 'ship_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_gr")), vocab: "ship_name_gr"},
    {data: 'other_ship_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_gr")), vocab: "ship_name_gr", renderer: groupRenderer},
    {data: 'ship_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_type_gr")), vocab: 'ship_type_gr'},
    {data: 'telegraphic_code', type: 'text'},
    {data: 'registry_port', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr', renderer: groupRenderer},
    {data: 'registry_number', type: 'text', renderer: groupRenderer},
    {data: 'registry_year', type: 'text', renderer: groupRenderer},
    {data: 'tonnage', type: 'text'},
    {data: 'captain_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_gr")), vocab: 'name_gr', renderer: groupRenderer},
    {data: 'captain_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_gr")), vocab: 'surname_gr', renderer: groupRenderer},
    {data: 'owner_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_gr")), vocab: 'name_gr', renderer: groupRenderer},
    {data: 'owner_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_gr")), vocab: 'surname_gr', renderer: groupRenderer},
    //  {data: 'owner_location', type: 'dropdown',
    //       source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr', renderer: groupRenderer},
    {data: 'organization_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_gr")), vocab: 'organization_gr', renderer: groupRenderer},
    {data: 'organization_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr', renderer: groupRenderer},
    {data: 'note', renderer: textRender, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];

var ship_record_container = document.getElementById(tableId);
var headers = [
    ['', '', '', '', {label: '', colspan: 3}, '', {label: '', colspan: 2}, {label: 'Owner', colspan: 4}, ''],
    ['', '', '', '', {label: 'Registry', colspan: 3}, '', {label: 'Captain', colspan: 2}, {label: 'Person', colspan: 2}, {label: 'Organization', colspan: 2}, ''],
    tablesAndHeaders.get(tableId)
];
var logbook_ship_recordGroups = [[1, 1], [4, 6], [8, 9], [10, 11], [12, 13]];

headers = markHeaders(headers, logbook_ship_recordGroups);
var ship_locs = new Object();
var ship_persons = new Object();
var persons_tbl = new Object();
var ship_obj = new Object();
var ships_tbl = new Object();


var ship_record_hot = new Handsontable(ship_record_container, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: [{ship_name: ''}],
    columns: cols3,
    manualColumnResize: true,
    className: "htCenter",
    autoWrapRow: true,
    maxRows: 1,
    currentRowClassName: 'currentRow',
    contextMenu: true,
    colHeaders: tablesAndHeaders.get(tableId),
    nestedHeaders: headers,
    cells: function (row, col, prop) {
        if (this.vocab) {
            handle_vocabulary(this.instance.getDataAtCell(row, col), this.vocab, this);
        }
    },
    /* Next 3 properties added to support comments*/
    comments: true,
    hiddenColumns: {
        columns: [tablesAndHeaders.get(tableId).length - 1] //last column only
    },
    afterLoadData: function () {
        addCommentForContentFoundOutsideTheSource(this);
    },
    afterRender: function () {
        markGroups(this);
    },
    afterSelectionEnd: function (row, col) {
        markGroups(this);
        if (col === 1) {
            groupLeftClicked(this, row, col);
        } else if (col > 7 && col < 10) {
            groupLeftClicked(this, row, col);
        } else if (col > 9 && col < 12) {
            groupLeftClicked(this, row, col);
        } else if (col > 11 && col < 14) {
            groupLeftClicked(this, row, col);
        } else if (col > 3 && col < 7) {
            groupLeftClicked(this, row, col);
        }
    },
    ///////////// Instance collections
    afterRenderer: function (td, row, col, prop, value) {
        if ((cols3[col].vocab === 'location_gr') && (value)) {
            handle_multiple_table_instances(row, col, value, 'ship_identity', null, null, ship_locs, null, 'LOCS');
        } else if (value && ((cols3[col].vocab === 'organization_gr'))) {
            handle_multiple_table_instances(row + '_', col, value, 'ship_identity', null, null, null, null, 'ORGS');
        } else if ((value) && ((col > 7) && (col < 12))) {
            handle_multiple_table_instances(row + '_', col, value, 'ship_identity', [8, 9], ['name', 'surname_a'], ship_persons, persons_tbl, 'PERSONS');
            handle_multiple_table_instances(row + '__', col, value, 'ship_identity', [10, 11], ['name', 'surname_a'], ship_persons, persons_tbl, 'PERSONS');
        }
        if ((value) && ((col === 0) || (col === 2) || (col === 3) || (col === 5))) {            
            handle_ships(row, col, value, 'ship_identity', [0, 2, 3, 5], ['name', 'type', 'telegraphic_code', 'registration_number'], 'SHIPS',ship_obj,ships_tbl);
        }
    }
});

ship_record_hot.updateSettings({
    contextMenu: {
        callback: function (key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(cols3[col].vocab);
            } else if (key === 'add') {
                var colClicked = ship_record_hot.getSelectedRange().to.col;
                if (colClicked === 1) {
                    groupClicked("logbook_ship_record", "other_ship_names", 0, 1, 1);
                } else if (colClicked > 6 && colClicked < 9) {
                    groupClicked("logbook_ship_record", "ownerCaptains", 0, 8, 9);
                } else if (colClicked > 8 && colClicked < 12) {
                    groupClicked("logbook_ship_record", "ownerPersons", 0, 10, 11);
                } else if (colClicked > 11 && colClicked < 14) {
                    groupClicked("logbook_ship_record", "ownerOrganizations", 0, 12, 13);
                } else if (colClicked > 2 && colClicked < 6) {
                    groupClicked("logbook_ship_record", "registries", 0, 4, 6);
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
                hidden: function () {
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
                hidden: function () {
                    return isAddTableMenuVisible(this, logbook_ship_recordGroups);
                }},
            "hsep4": "---------",
            "comment": {
                name: "Mark external content",
                hidden: function () {
                    var tableId = this.rootElement.getAttribute("id");
                    var col = this.getSelectedRange().to.col;
                    if (tablesWithoutCommentCols.get(tableId).includes(col)) {
                        return true;
                    }
                },
                callback: function () {
                    comment(this);
                }
            },
            "deleteComment": {
                name: "Undo Mark external content",
                hidden: function () {
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
                callback: function () {
                    uncomment(this);
                }
            }
        }
    }
});


//////////////////////////New Callentar////////////////////////////////////
var tableId = "calendar";
tablesAndHeaders.set(tableId, ['Digital Source Pages', 'Ashore/ At Sea', 'From', 'To', 'At Port', 'Type', 'From', 'To', 'Analytic Calendar', 'Comment']);
tablesWithoutCommentCols.set(tableId, [8]); //define fieds that do not have external content


var calendars_data = [
    {digital_source_page: ""}, {digital_source_page: ""}, {digital_source_page: ""}, {digital_source_page: ""}, {digital_source_page: ""}, {digital_source_page: ""}, {digital_source_page: ""}, {digital_source_page: ""}, {digital_source_page: ""}, {digital_source_page: ""},
    {digital_source_page: ""}, {digital_source_page: ""}, {digital_source_page: ""}, {digital_source_page: ""}, {digital_source_page: ""}
];


var calendar_columns = [
    {data: 'digital_source_page', type: 'text'},
    {data: 'at_port_sea', type: 'dropdown',
        source: ['Ashore', 'At sea']},
    {data: 'route_from', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
    {data: 'route_to', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
    {data: 'at_port', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr', renderer: groupRenderer},
    {data: 'duration_date_type', type: 'dropdown', source: ['Julian', 'Gregorian']},
    {data: 'duration_from', type: 'date'},
    {data: 'duration_to', type: 'date'},
    {data: 'analytic_calendar', renderer: buttonRenderer, readOnly: true},
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

var container = document.getElementById(tableId);
var headers = [
    ['', '', {label: 'Route', colspan: 2}, '', {label: 'Duration', colspan: 3}, ''],
    tablesAndHeaders.get(tableId)
];


var calendar_Groups = [[4, 4]];
headers = markHeaders(headers, calendar_Groups);
var voyage_locs = new Object();

var voyage_calendar = new Handsontable(container, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: calendars_data,
    columns: calendar_columns,
    manualColumnResize: true,
    contextMenu: true,
    autoWrapRow: true,
    currentRowClassName: 'currentRow',
    className: "htCenter htMiddle",
    colHeaders: tablesAndHeaders.get(tableId),
    rowHeaders: true,
    nestedHeaders: headers,
    cells: function (row, col, prop) {
        if (this.vocab) {
            handle_vocabulary(this.instance.getDataAtCell(row, col), this.vocab, this);
        }
    },
    /* Next 3 properties added to support comments*/
    comments: true,
    hiddenColumns: {
        columns: [tablesAndHeaders.get(tableId).length - 1] //last column only
    },
    afterLoadData: function () {
        addCommentForContentFoundOutsideTheSource(this);
    },
    afterRender: function () {
        markGroups(this);
    },
    afterSelectionEnd: function (row, col) {
        markGroups(this);
        if (col === 4) {
            groupLeftClicked(this, row, col);
        }
    }
    ,
    ///////////// Instance collections
    afterRenderer: function (td, row, col, prop, value) {
        if ((calendar_columns[col].vocab === 'location_gr') && (value)) {
            handle_multiple_table_instances(row, col, value, 'calendar', null, null, voyage_locs, null, 'LOCS');
        }
    }
});


voyage_calendar.updateSettings({
    contextMenu: {
        callback: function (key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(calendar_columns[col].vocab);
            } else if (key === 'add') {
                var colClicked = voyage_calendar.getSelectedRange().to.col;
                var rowClicked = voyage_calendar.getSelectedRange().to.row;
                if (colClicked === 4) {
                    groupClicked("calendar", "at_ports", rowClicked, 4, 4);
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
                disabled: function () {
                    return voyage_calendar.getSelected()[0] === 0;
                }
            },
            "row_below": {},
            "add10rows": {
                name: "Add 10 rows",
                disabled: function () {
                    return voyage_calendar.countRows() - 1 !== voyage_calendar.getSelected()[0];
                },
                callback: function () {
                    this.alter('insert_row', this.getSelected()[0] + 1, 10);
                }
            },
            "hsep2": "---------",
            /*"remove_row": {
             disabled: function() {
             if (((voyage_calendar.getSelected()[0]) < 3) || ((voyage_calendar.getSelected()[2]) < 3)) {
             return true;
             }
             }
             },*/
            "hsep1": "---------",
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function () {
                    var col = voyage_calendar.getSelectedRange().to.col;
                    var label = calendar_columns[col].vocab;
                    if (label) {
                        update_Vocs();
                        return voyage_calendar.getSelectedRange().to.col !== col;
                    } else {
                        return voyage_calendar.getSelectedRange().to.col !== -1;
                    }
                }},
            "add": {
                name: "Add table",
                hidden: function () {
                    return isAddTableMenuVisible(this, calendar_Groups);
                }},
            "hsep7": "---------",
            "comment": {
                name: "Mark external content",
                hidden: function () {
                    var tableId = this.rootElement.getAttribute("id");
                    var col = this.getSelectedRange().to.col;
                    if (tablesWithoutCommentCols.get(tableId).includes(col)) {
                        return true;
                    }
                },
                callback: function () {
                    comment(this);
                }
            },
            "deleteComment": {
                name: "Undo Mark external content",
                hidden: function () {
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
                callback: function () {
                    uncomment(this);
                }
            }
        }
    }
});
////////////////////////////////////////////////////////////////////////////////



var voyage_transactions = [];
var transaction_columns = [
    {data: 'calendar_date_type', type: 'dropdown', source: ['Julian', 'Gregorian']},
    {data: 'calendar_date', type: 'date'},
    {data: 'calendar_time', type: 'time', timeFormat: 'h:mm:ss a', correctFormat: true},
    {data: 'calendar_weather', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("calendar_weather_gr")), vocab: 'calendar_weather_gr', renderer: groupRenderer},
    {data: 'calendar_wind_strength', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("wind_strength_gr")), vocab: 'wind_strength_gr', renderer: groupRenderer},
    {data: 'calendar_wind_direction', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("wind_direction_gr")), vocab: 'wind_direction_gr', renderer: groupRenderer},
    {data: 'calendar_direction', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_direction_gr")), vocab: 'ship_direction_gr'},
    {data: 'distance_value', type: 'text'},
    {data: 'calendar_miles_per_hour', type: 'text'},
    {data: 'calendar_engine_speed', type: 'dropdown',
        source: ['Full speed', 'Half speed', 'Slow speed']},
    {data: 'calendar_langtitude', type: 'text'},
    {data: 'calendar_longtitude', type: 'text'},
    {data: 'calendar_location_action', type: 'dropdown',
        source: ['From A (intermediate)',
            'To B (intermediate)',
            'From A (start of voyage)',
            'To B (end of voyage)',
            'From A to B (start/end of voyage)',
            'From A to B (intermediates)',
            'Through A and B',
            'Through A',
            'Pass by A',
            'Position at A']},
    {data: 'calendar_location_A', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
    {data: 'calendar_location_B', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
    {data: 'calendar_route_value', type: 'text'},
    {data: 'calendar_route_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
    {data: 'calendar_event_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("event_type_gr")), vocab: 'event_type_gr', renderer: groupRenderer},
    {data: 'calendar_event_description', renderer: textRender, /*readOnly: true,*/ type: 'text'},
    {data: 'good_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("good_type_gr")), vocab: 'good_type_gr', renderer: groupRenderer},
    {data: 'good_quantity_value', type: 'text', renderer: groupRenderer},
    {data: 'good_quantity_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr', renderer: groupRenderer},
    {data: 'means_of_loading', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("means_of_loading_gr")), vocab: 'means_of_loading_gr', renderer: groupRenderer},
    {data: 'duration_date_type', type: 'dropdown', source: ['Julian', 'Gregorian']},
    {data: 'duration_date', type: 'date'},
    {data: 'duration_date_to_at', type: 'date'},
    {data: 'duration_value', type: 'text'},
    {data: 'duration_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
    {data: 'event_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
    {data: 'event_location_from_at', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
    {data: 'related_person_role', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("role_in_event_gr")), vocab: 'role_in_event_gr', renderer: groupRenderer},
    {data: 'related_person_number', type: 'text', renderer: groupRenderer},
    {data: 'related_person_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_gr")), vocab: 'name_gr', renderer: groupRenderer},
    {data: 'related_person_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_gr")), vocab: 'surname_gr', renderer: groupRenderer},
    {data: 'related_person_status_capacity', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_gr")), vocab: 'status_capacity_role_gr', renderer: groupRenderer},
    {data: 'encountered_ship_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_gr")), vocab: "ship_name_gr"},
    {data: 'encountered_ship_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_type_gr")), vocab: 'ship_type_gr'},
    {data: 'encountered_flag', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("flag_gr")), vocab: 'flag_gr'},
    {data: 'cost_per_mont_value', type: 'text'},
    {data: 'cost_per_mont_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
    {data: 'part_of_ship', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("part_of_ship_gr")), vocab: 'part_of_ship_gr', renderer: groupRenderer},
    {data: 'note', renderer: textRender, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}
];

var transactionsGroups = [[3, 3], [4, 5], [17, 17], [19, 22], [30, 34], [40, 40]];

function close_nested(cnt) {
    $("#heading" + cnt).parent().hide();
    $.each($('.nested_button'), function (i) {
        if ($("#Row_" + i).hasClass('full_data')) {
            $("#Row_" + i).css("background-color", "#C4C4C4");
            $("#Row_" + i).css("color", "#1C6799");
        } else {
            $('#Row_' + i).css({'background': '#dddddd'});
            $('#Row_' + i).css({'color': '#337ab7'});
        }
    });
    $('#Row_' + cnt).css({'background': '#638BC7'});
    $('#Row_' + cnt).css({'color': '#ffffff'});
}


function createNestedTable(cnt, data, header) {

    //////// nested data from json ///////////////
    if (nested_tables) {
        if (nested_tables[cnt]) {
            data = nested_tables[cnt];
        }
    }

    $('#insert2_here').hide();
    $(".nested_table").hide();
    var parent = $('#heading' + cnt).parent();
    $(parent).show();

    $.each($('.nested_button'), function (i) {
        if ($("#Row_" + i).hasClass('full_data')) {
            $("#Row_" + i).css("background-color", "#C4C4C4");
            $("#Row_" + i).css("color", "#1C6799");
        } else {
            $('#Row_' + i).css({'background-color': '#dddddd'});
            $('#Row_' + i).css({'color': '#337ab7'});
        }
    });

    var plus = parseInt(cnt) + 1;
    var table_header = "";
    if (!((header == null) || (header == "null"))) {
        table_header = ' / Digital Source Pages : ' + header;
    }

    var html = "<div  class='panel panel-default nested_table not_visible' style='border:transparent; margin-top:5px;'>" +
            "<div class='panel-heading' role='tab' id='heading" + cnt + "'>" +
            "<h4 class='panel-title'>" +
            "    <a style='background-color:#589AAF;' class='collapsed' role='button' onclick='close_nested(" + cnt + ")'  href='#collapse" + cnt + "'>" +
            "<span class='pull-right glyphicon glyphicon-remove'></span>" + "Analytic Calendar " + plus + table_header +
            "     </a>" +
            "</h4>" +
            "</div>" +
            "<div id='collapse" + cnt + "' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='heading" + cnt + "'>" +
            "    <div style='padding-top:6px;' class='panel-body'>" +
            "    <span style=' color:#163758; padding:0px;font-size: 11px'>Use the source language to fill in the fields of this table</span>" +
            " <button id='" + cnt + "' onclick='show_ship_route(" + cnt + ")' aria-hidden='true' class='ship_route btn fa fa-ship'  type='button' ><i></i>View Route</button>" +
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
        } else {
            $("#Row_" + cnt).addClass('full_data');
            $("#Row_" + cnt).css("background-color", "#C4C4C4");
            $("#Row_" + cnt).css("color", "#1C6799");
        }


        var tableId = 'transactions' + cnt;
        tablesAndHeaders.set('transactions', ['Type', 'At', 'Time', 'Weather', 'Strength', 'Direction', 'Course of Ship', 'Distance (miles)', 'Value (miles/hour)', 'Type', 'Latitude', 'Longitude', 'Movement  ', 'Location A ', 'Location B', 'Value', 'Unit', 'Type of Event', 'Event Description', 'Type', 'Value', 'Unit', 'Means of Loading', 'Type', 'From', 'To / At', 'Value', 'Unit', 'From', 'To / At', 'Role in event', 'Number of Persons', 'Name', 'Surname', 'Status | Capacity | Profession', 'Name', 'Type', 'Flag', 'Value', 'Unit', 'Part of Ship', 'Note', 'Comment']);
        tablesWithoutCommentCols.set(tableId, [17, 40]); //define fieds that do not have external content
        var container = document.getElementById(tableId);

        var headers = [
            [{label: '', colspan: 2}, '', '', {label: '', colspan: 2}, '', '', {label: '', colspan: 2}, {label: '', colspan: 2}, {label: '', colspan: 5}, {label: 'Event', colspan: 24}, ''],
            [{label: '', colspan: 2}, '', '', {label: '', colspan: 2}, '', '', {label: '', colspan: 2}, {label: '', colspan: 2}, {label: 'Route', colspan: 5}, '', '', {label: 'Good/Things', colspan: 4}, {label: 'Time of Event', colspan: 5}, {label: '', colspan: 2}, {label: '', colspan: 5}, {label: '', colspan: 3}, {label: '', colspan: 2}, '', ''],
            [{label: 'Date', colspan: 2}, '', '', {label: 'Wind', colspan: 2}, '', '', /*{label: 'Distance', colspan: 2},*/ {label: 'Speed', colspan: 2}, {label: 'Coordinates', colspan: 2}, {label: '', colspan: 3}, {label: 'Distance from shore', colspan: 2}, '', '', '', {label: 'Quantity', colspan: 2}, '', {label: 'Date', colspan: 3}, {label: 'Duration', colspan: 2}, {label: 'Event Location', colspan: 2}, {label: 'Related Person / Organization', colspan: 5}, {label: 'Encountered Ship ', colspan: 3}, {label: 'Cost/Wage per month', colspan: 2}, '', ''],
            tablesAndHeaders.get('transactions')
        ];


        headers = markHeaders(headers, transactionsGroups);

        var voyage_transaction = new Handsontable(container, {
            licenseKey: '',
            dateFormat: 'YYYY-MM-DD',
            data: data,
            columns: transaction_columns,
            contextMenu: true,
            manualColumnResize: true,
            autoWrapRow: true,
            currentRowClassName: 'currentRow',
            className: "htCenter htMiddle",
            colHeaders: tablesAndHeaders.get('transactions'),
            rowHeaders: true,
            nestedHeaders: headers,
            cells: function (row, col, prop) {
                if (this.vocab) {
                    handle_vocabulary(this.instance.getDataAtCell(row, col), this.vocab, this);
                }
            },
            /* Next 3 properties added to support comments*/
            comments: true,
            hiddenColumns: {
                columns: [tablesAndHeaders.get('transactions').length - 1] //last column only
            },
            afterLoadData: function () {
                addCommentForContentFoundOutsideTheSource(this);
            },
            afterRender: function () {
                markGroups(this);
            },
            afterSelectionEnd: function (row, col) {
                markGroups(this);
                if (col === 3) {
                    groupLeftClicked(this, row, col);
                } else if (col > 3 && col < 6) {
                    groupLeftClicked(this, row, col);
                } else if (col === 17) {
                    groupLeftClicked(this, row, col);
                } else if (col > 18 && col < 23) {
                    groupLeftClicked(this, row, col);
                } else if (col > 29 && col < 35) {
                    groupLeftClicked(this, row, col);
                } else if (col === 40) {
                    groupLeftClicked(this, row, col);
                }
            }
            /* afterRenderer: function(td, row, col, prop, value) {
             if ((transaction_columns[col].vocab === 'location_gr') && (value)) {
             handle_multiple_table_instances(row,col,value,'analytic_calendar_' + cnt,null, null,transaction_locs, null, 'LOCS');                    
             }
             }*/
        });

        voyage_transaction.updateSettings({
            contextMenu: {
                callback: function (key, options) {
                    if (key === 'edit_vocabulary') {
                        var col = options.start.col;
                        create_voc_modal(transaction_columns[col].vocab);
                    } else if (key === 'add') {
                        var colClicked = voyage_transaction.getSelectedRange().to.col;
                        var rowClicked = voyage_transaction.getSelectedRange().to.row;
                        if (colClicked === 3) {
                            groupClicked('transactions' + cnt, "calendarsWeathers", rowClicked, 3, 3);
                        } else if (colClicked > 3 && colClicked < 6) {
                            groupClicked('transactions' + cnt, "calendarsWinds", rowClicked, 4, 5);
                        } else if (colClicked === 17) {
                            groupClicked('transactions' + cnt, "calendarsTypesOfEvents", rowClicked, 17, 17);
                        } else if (colClicked > 18 && colClicked < 23) {
                            groupClicked('transactions' + cnt, "calendarsGoods", rowClicked, 19, 22);
                        } else if (colClicked > 29 && colClicked < 35) {
                            groupClicked('transactions' + cnt, "calendarsRelateds", rowClicked, 30, 34);
                        } else if (colClicked === 40) {
                            groupClicked('transactions' + cnt, "parts_of_ship", rowClicked, 40, 40);
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
                        disabled: function () {
                            return voyage_transaction.getSelected()[0] === 0;
                        }
                    },
                    "row_below": {},
                    "add10rows": {
                        name: "Add 10 rows",
                        callback: function () {
                            this.alter('insert_row', this.getSelected()[0] + 1, 10);
                        }
                    },
                    "hsep2": "---------",
                    "remove_row": {
                        disabled: function () {
                            if (((voyage_transaction.getSelected()[0]) < 3) || ((voyage_transaction.getSelected()[2]) < 3)) {
                                return true;
                            }
                        }
                    },
                    "hsep1": "---------",
                    "edit_vocabulary": {
                        name: "Edit vocabulary",
                        hidden: function () {
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
                        hidden: function () {
                            return isAddTableMenuVisible(this, transactionsGroups);
                        }},
                    "hsep7": "---------",
                    "comment": {
                        name: "Mark external content",
                        hidden: function () {
                            var tableId = this.rootElement.getAttribute("id");
                            var col = this.getSelectedRange().to.col;
                            if (tablesWithoutCommentCols.get(tableId).includes(col)) {
                                return true;
                            }
                        },
                        callback: function () {
                            comment(this);
                        }
                    },
                    "deleteComment": {
                        name: "Undo Mark external content",
                        hidden: function () {
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
                        callback: function () {
                            uncomment(this);
                        }
                    }
                }
            }
        });
        voyage_transactions[cnt] = voyage_transaction;

    } else {
        if (!((header == null) || (header == "null"))) {
            $('#heading' + cnt).children().children().html('<span class="pull-right glyphicon glyphicon-remove"></span>Analytic Calendar ' + plus + ' / Digital Source Pages : ' + header);
        }

        $('#Row_' + cnt).css({'background': '#638BC7'});
        $('#Row_' + cnt).css({'color': '#ffffff'});
        $('#insert_here').show();
    }
}
;


////////////////////////////////////////////////////////////////////////////////

function createRecordJson(usage) {

    var cat_info = createJson(catalogue_info, cols1, usage);
    var source_id = createJson(source_identity_data, source_identity_cols, usage);
    var source_contents = createJson(ship_record_hot, cols3, usage);
    var voyages_calendar = createJson(voyage_calendar, calendar_columns, usage);

    var json = new Object();
    cat_info.date_until = getCurrentDate();
    catalogue_info.setDataAtCell(0, 2, getCurrentDate());
    json['record_information'] = cat_info;
    json['source_identity'] = source_id;
    json['ship_records'] = source_contents;
    json['voyage_calendar'] = voyages_calendar;

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

    json['analytic_calendars'] = transactions;


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
        $.each(voyages_calendar, function (row) {            
            $.each(this, function (col) {
                var val = this.toString();
                $.each(calendar_columns, function (col_no) {
                    if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                        var label = $(this).attr('vocab');                      
                        handle_json_vocs(val, label, row, col, col_no, 'voyage_calendar', terms);
                    }
                });
            });
        });            
        ///////////////////////Transaction
        
        $.each(transactions, function (cnt) {
            var transaction_persons = new Object();
            var transaction_ships = new Object();
            var ships_lbls = new Object();
            var transaction_locs = new Object();
            var persons_tbl = new Object();            
            var terms = new Object();
            var tbl = new Object();
            console.log('----- creating instances for nested table : ' + cnt + '----------');
            $.each(this, function (row) {
                var row_data = this;
                $.each(this, function (col) {
                    ///////////////////////////////////////////   
                    var val = this;
                    $.each(transaction_columns, function (col_no) {
                        if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                            var label = $(this).attr('vocab');
                            handle_vocabulary(val, label, this);
                            handle_json_vocs(val,label,row,col,col_no,'analytic_calendar_' + cnt,terms);
                            
                        }
                    });
                    /////////////////////////////////////
                    if ((col === 'related_person_name')) {
                        if ((row_data['related_person_name'].indexOf('(organization)') > -1) || (row_data['related_person_name'].indexOf('(organisation)') > -1)) {
                            handle_multiple_table_instances(row, 32, row_data['related_person_name'].toLowerCase().replace('(organization)', '').replace('(organisation)', ''), 'analytic_calendar_' + cnt, null, null, null, null, 'ORGS');
                        } else {
                            if ((row_data['related_person_name'] !== " ") && (row_data['related_person_name'] !== " ")) {
                                handle_multiple_table_instances(row, 32, row_data['related_person_name'], 'analytic_calendar_' + cnt, [32, 33, 34], ['name', 'surname_a', 'status'], transaction_persons, persons_tbl, 'PERSONS');
                            }
                            if (row_data['related_person_surname']) {
                                handle_multiple_table_instances(row, 33, row_data['related_person_surname'], 'analytic_calendar_' + cnt, [32, 33, 34], ['name', 'surname_a', 'status'], transaction_persons, persons_tbl, 'PERSONS');
                            }
                            if (row_data['related_person_status_capacity']) {
                                handle_multiple_table_instances(row, 34, row_data['related_person_status_capacity'], 'analytic_calendar_' + cnt, [32, 33, 34], ['name', 'surname_a', 'status'], transaction_persons, persons_tbl, 'PERSONS');
                            }
                        }
                    } else if ((col === 'related_person_surname')) {
                        if (row_data['related_person_name'] && (row_data['related_person_name'] !== " ") && (row_data['related_person_name'] !== " ")) {
                            handle_multiple_table_instances(row, 32, row_data['related_person_name'], 'analytic_calendar_' + cnt, [32, 33, 34], ['name', 'surname_a', 'status'], transaction_persons, persons_tbl, 'PERSONS');
                        }
                        if (row_data['related_person_surname']) {
                            handle_multiple_table_instances(row, 33, row_data['related_person_surname'], 'analytic_calendar_' + cnt, [32, 33, 34], ['name', 'surname_a', 'status'], transaction_persons, persons_tbl, 'PERSONS');
                        }
                        if (row_data['related_person_status_capacity']) {
                            handle_multiple_table_instances(row, 34, row_data['related_person_status_capacity'], 'analytic_calendar_' + cnt, [32, 33, 34], ['name', 'surname_a', 'status'], transaction_persons, persons_tbl, 'PERSONS');
                        }
                    } else if ((col === 'encountered_ship_name')) {
                        
                        handle_ships(row , 35, row_data['encountered_ship_name'], 'analytic_calendar_' + cnt, [35, 36, 37], ['name', 'type', 'flag'], 'SHIPS',transaction_ships,ships_lbls);
                        handle_ships(row , 36, row_data['encountered_ship_type'], 'analytic_calendar_' + cnt, [35, 36, 37], ['name', 'type', 'flag'], 'SHIPS',transaction_ships,ships_lbls);
                        handle_ships(row , 37, row_data['encountered_flag'], 'analytic_calendar_' + cnt, [35, 36, 37], ['name', 'type', 'flag'], 'SHIPS',transaction_ships,ships_lbls);
                    } else if (col === 'calendar_location_A') {
                        handle_multiple_table_instances(row, 13, this.toString(), 'analytic_calendar_' + cnt, null, null, transaction_locs, null, 'LOCS');
                    } else if (col === 'calendar_location_B') {
                        handle_multiple_table_instances(row, 14, this.toString(), 'analytic_calendar_' + cnt, null, null, transaction_locs, null, 'LOCS');
                    } else if (col === 'event_location') {
                        handle_multiple_table_instances(row, 28, this.toString(), 'analytic_calendar_' + cnt, null, null, transaction_locs, null, 'LOCS');
                    } else if (col === 'event_location_from_at') {
                        handle_multiple_table_instances(row, 29, this.toString(), 'analytic_calendar_' + cnt, null, null, transaction_locs, null, 'LOCS');
                    }

                });
            });
        });
    }

    update_Vocs(); 
    console.log(terms_json);
    update_Vocs_from_json(terms_json);                     
    
    return json;
}
;

//////////////////////////////////////////////////////////////////////////////////////////
/////////// Loading icon
$(window).load(function () {
    $(".spin_loader").fadeOut("slow");
});

///////////////////////////////// Load File /////////////////////////////////////////////

var nested_tables = new Object();
var url = new URL(window.location.href);
var mode = url.searchParams.get("mode");
var nested_tables_object = new Object();

var record_status;

function load(data, status) {
     //console.log(terms_json)

    console.log(status);
    record_status = status;
    clear_LocalStorage_instances();

    catalogue_info.loadData(data.record_information);
    source_identity_data.loadData(data.source_identity);
    ship_record_hot.loadData(data.ship_records);
    var voyages_calendar_data = new Array();
    $.each(data.voyage_calendar, function () {
        voyages_calendar_data.push(this);
    });
    voyage_calendar.loadData(voyages_calendar_data);

    $('.nested_table').remove();

    if (data.analytic_calendars) {

        nested_tables_object = data.analytic_calendars;

        $.each(data.analytic_calendars, function (cnt) {
            var voyages_trans = new Array();
            $.each(this, function () {
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
$('#excelexport').click(function () {

    var json = createRecordJson('excel');
    var temp = JSON.stringify(json);
    temp = temp.replace(/&nbsp;/g, "");
    json = JSON.parse(temp);

    //  var group1Tables = createMultipleTables(json['voyage_calendar'], calendarGroups, calendar_columns);
    var sheets = new Array();

    var payrol_analysis = new Array();
    $.each(json.analytic_calendars, function (cnt) {
        $.each(this, function () {
            payrol_analysis.push(Object.assign({}, (json.voyage_calendar[cnt]), (this)));
        });
    });

    if (payrol_analysis.length < 1) {
        payrol_analysis.push('');
    }

    sheets.push([json.record_information]);
    sheets.push([json.source_identity]);
    sheets.push([json.ship_records]);
    sheets.push(json.voyage_calendar);
    sheets.push(payrol_analysis);


    var nestedGroups = createMultipleNestedTables(json['analytic_calendars'], transactionsGroups, calendar_columns, transaction_columns);

    var result = createExcelSheetsData(sheets, nestedGroups);
    var sheets_headers = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Source Identity', header: true}, {sheetid: 'Ship Identity', header: true}, {sheetid: 'Voyage Calendar', header: true}, {sheetid: 'Analytic Calendars', header: true}];
    var res = alasql('SELECT * INTO XLSX("' + $('#unique_filename').text() + '.xlsx",?) FROM ?', [sheets_headers, result]);

});

////////////////////////////////////////////////////////////////////////////////



//////////////////Update Vocabularies on pouch DB

function update_Vocs() {
    if (mode === null) {//only update vocabularies in edit mode

        var tables = [];
        var voyage_keys = Object.keys(voyage_transactions);
        tables.push(catalogue_info, source_identity_data, ship_record_hot);
        for (var i = 0; i < voyage_keys.length; i++) {
            tables.push(voyage_transactions[voyage_keys[i]]);
        }
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

        $.each(real_occs, function () {
            var table_id = this.tableVariable;
            var old_val = "";
            if (table_id === "source_identity") {
                old_val = source_identity_data.getDataAtCell(this.row, this.col, value);
                source_identity_data.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "logbook_ship_record") {
                old_val = ship_record_hot.getDataAtCell(this.row, this.col, value);
                ship_record_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "calendar") {
                old_val = voyage_calendar.getDataAtCell(this.row, this.col, value);
                voyage_calendar.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "catalogue_info") {
                old_val = catalogue_info.getDataAtCell(this.row, this.col, value);
                catalogue_info.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id.indexOf("transactions") !== -1) {
                var cnt = table_id.replace("transactions", "");
                old_val = voyage_transactions[cnt].getDataAtCell(this.row, this.col, value);
                voyage_transactions[cnt].setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            }
        });
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
    tmp['record_information']['related_organization'] = 'FORTH/IMS';
    tmp['record_information']['record_id'] = recordId;
    tmp['record_information']['template_type'] = templateTitle;
    tmp['source_identity'] = json.source_identity;
    tmp['source_identity']['source_language'] = 'Greek';
    tmp['ship_identity'] = oneRow_with_Groups(json.ship_records, logbook_ship_recordGroups, cols3);


    ////////////////MULTIPLE TABLE WITH GROUPS AND NESTED/////////////////////// 
    var nested_groups = nested_with_Groups(json.analytic_calendars, json.voyage_calendar, transactionsGroups, transaction_columns, 'analytic_calendar', 'calendar_');
    var simple_groups = simple_with_Groups(json.voyage_calendar, calendar_Groups, calendar_columns);
    tmp['voyage_calendar'] = merge_Groups_Nested(nested_groups, simple_groups, calendar_Groups, 'calendar_', calendar_columns);
    ////////////////////////////////////////////////////////////////////////////

    //tmp['voyage_calendar'] = nested_with_Groups(json.analytic_calendars, json.voyage_calendar, transactionsGroups, transaction_columns, 'analytic_calendar', 'calendar_');

    root['root'] = tmp;
    var xml = formatXml(json2xml(root));

    //console.log(root);


    xml = xml.replace(/<calendar_(\d+)>/g, '<calendar index="$1">');
    xml = xml.replace(/<\/calendar_(\d+)>/g, "</calendar>");

    xml = xml.replace(/<row_(\d+)>/g, '<row index="$1">');
    xml = xml.replace(/<\/row_(\d+)>/g, "</row>");

    xml = xml.replace(/<group_data_(\d+)>/g, '<group_data index="$1">');
    xml = xml.replace(/<\/group_data_(\d+)>/g, "</group_data>");


    return (xml);
}
;
////////////////////////////////////////////////////////////////////////////////



