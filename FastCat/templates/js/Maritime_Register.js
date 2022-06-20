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
        if (subTableName === "events") {
            var cols = [
                {data: 'type_of_event', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("event_type_it")), vocab: 'event_type_it'},
                {data: 'event_related_location_from', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
                {data: 'event_related_location_to', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
                {data: 'event_date', type: 'date'},
                {data: 'event_description', type: 'date'},
                {data: 'owner_nationality', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("nationality_it")), vocab: 'nationality_it'},
                {data: 'flag', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("flag_it")), vocab: 'flag_it'},
                {data: 'event_ship_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("ship_name_it")), vocab: 'ship_name_it'},
                {data: 'event_ship_type', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("ship_type_it")), vocab: 'ship_type_it'},
                {data: 'event_ship_tonnage', type: 'text'},
                {data: 'event_number_of_guns', type: 'text'},
                {data: 'event_number_of_crew', type: 'text'},
                {data: 'event_note', type: 'text'}
            ];
            nestedHeaders = [
                ['Type of Event', 'From', 'To/At', 'Related Date', 'Event Description', 'Owner Nationality', 'Flag', 'Ship Type', 'Ship Name', 'Tonnage', 'Number of Guns', 'Number of Crew', 'Event Note']
            ];
            data = setSubTableData(ships_list_hot, row, startCol, endCol);

        }
        else if (subTableName.indexOf("owners") !== -1) {
            var cnt = parentTableName.replace("students_list", "");
            var cols = [
                {data: 'part_of_ownership', type: 'text'},
                {data: 'acquisition_date', type: 'date'},
                {data: 'organization_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("organization_it")), vocab: 'organization_it'},
                {data: 'organization_location', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
                {data: 'owner_gender', type: 'dropdown', source: ['Male', 'Female']},
                {data: 'owner_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it'},
                {data: 'owner_surname', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_it")), vocab: 'surname_it'},
                {data: 'owner_maiden_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it'},
                {data: 'owner_fathers_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it'},
                {data: 'owner_birth_place', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
                {data: 'owner_residence_place', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'}
            ];
            nestedHeaders = [
                ['Part in Ownership (caratti)', 'Date of Acquisition', 'Name', 'Headquarters Location', 'Gender', 'Name', 'Surname', 'Maiden Name', 'Father Name', 'Place of Birth', 'Place of Residence']
            ];
            data = setSubTableData(students_list[cnt], row, startCol, endCol);
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
tablesAndHeaders.set(tableId, [
    headerTooltip('Name', 'The name of the Archive'),
    headerTooltip('Location', 'the place where the Archive is located'),
    headerTooltip('Colection Title', 'The name of the archival collection'),
    headerTooltip('Series', 'The name of the specific serie taken into account'),
    headerTooltip('Title', 'The name of the register'),
    headerTooltip('Number *', 'The archival number of the register'),
    headerTooltip('Title', 'The name of the archival inventory'),
    headerTooltip('Number *', 'The number of the archival inventory'),
    headerTooltip('From *', 'The date on which the register starts'),
    headerTooltip('To *', 'The date on which the register ends'),
    headerTooltip('Name', 'The name of the issuing authority'),
    headerTooltip('Location', 'The place where the issuing authority was located'),
    headerTooltip('Note', 'Space for possible annotations about the source identity from the person who does the transcription'),
    'Comment'
]);
//tablesAndHeaders.set(tableId, ['Name', 'Location', 'Colection Title', 'Series', 'Title', 'Number *', 'Title', 'Number *', 'From *', 'To *', 'Name', 'Location', 'Note', 'Comment']);
tablesWithoutCommentCols.set(tableId, [0, 1, 2, 3, 4, 5, 6, 7, 12]); //define fieds that do not have external content

var sourcedata = [
    {ship_name: ''}
];
var source_identity_cols = [
    {data: 'archive_library', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("archive_or_library_it")), vocab: 'archive_or_library_it'},
    {data: 'source_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
    {data: 'collection_title', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("collection_it")), vocab: 'collection_it'},
    {data: 'series', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("series_it")), vocab: 'series_it'},
    {data: 'register_title', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("register_it")), vocab: 'register_it'},
    {data: 'register_number', type: 'text'},
    {data: 'inventory_title', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("inventory_it")), vocab: 'inventory_it'},
    {data: 'inventory_number', type: 'text'},
    {data: 'book_date_from', type: 'text'},
    {data: 'book_date_to', type: 'text'},
    {data: 'issuing_authority_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("local_authority_it")), vocab: 'local_authority_it'},
    {data: 'issuing_authority_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
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
        [{label: headerTooltip('Archive / Library', 'Library or Archive where the original source is located during the time of transcription'), colspan: 2}, '', '', {label: 'Register', colspan: 2}, {label: 'Inventory', colspan: 2}, {label: 'Date of Book', colspan: 2}, {label: 'Issuing Authority', colspan: 2}, ''],
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
    }, afterRenderer: function(td, row, col, prop, value) {
        if ((source_identity_cols[col].vocab === 'location_it') && (value)) {
            handle_locations(value, 'source_identity', row, col, 'LOCS', source_locs);
        } else if ((source_identity_cols[col].vocab === 'local_authority_it') && value) {
            handle_organizations(value, 'source_identity', row, col, 'ORGS');
        } else if (((source_identity_cols[col].vocab === 'archive_or_library_it') && value)) {
            handle_organizations(value, 'source_identity', row + '_', col, 'ORGS');
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
/////////////////////////////////SHIP LIST/////////////////////////////////////
var tableId = "courses_list";

//tablesAndHeaders.set(tableId, ['Source Page', 'Ship Type', 'Ship Name', 'Tonnage', 'Number of Guns', 'Number of Crew', 'Location', 'Year', 'Horse Power', 'Type of Event', 'From', 'To/At', 'Related Date', 'Event Description', 'Owner Nationality', 'Flag', 'Ship Type', 'Ship Name', 'Tonnage', 'Number of Guns', 'Number of Crew', 'Event Note', 'List of Owners', 'List of Captains', 'Note', 'Comment']);
tablesAndHeaders.set(tableId, [
    headerTooltip('Source Page', 'The number of the register page where the information is provided'),
    headerTooltip('Ship Type', 'The type of the ship at the moment of registration'),
    headerTooltip('Ship Name', 'The name of the ship at the moment of registration'),
    headerTooltip('Tonnage', 'The tonnage of the ship at the moment of registration'),
    headerTooltip('Number of Guns', 'The number of guns of the ship at the moment of registration'),
    headerTooltip('Number of Crew', 'The number of the members of the crew at the moment of registration'),
    headerTooltip('Location', 'The place where the ship was built'),
    headerTooltip('Year', 'The year of construction of the ship'),
    headerTooltip('Horse Power', 'The number of horse power in case of steamship'),
    headerTooltip('Type of Event', 'The type of event that occurred'),
    headerTooltip('From', 'The last palace where the ship was spotted in case of disappearance'),
    headerTooltip('To/At', 'The place where the event occurred or the destination of the ship in case of disappearance'),
    headerTooltip('Related Date', 'The date when the event occurred'),
    headerTooltip('Event Description', 'The description of the event'),
    headerTooltip('Owner Nationality', 'The nationality of the new owner/s'),
    headerTooltip('Flag', 'Flag'),
    headerTooltip('Ship Type', 'The new type of the ship after the change'),
    headerTooltip('Ship Name', 'The new name of the ship after a change of name'),
    headerTooltip('Tonnage', 'The new tonnage of the ship'),
    headerTooltip('Number of Guns', 'The new number of the guns of the ship'),
    headerTooltip('Number of Crew', 'The new number of members of the crew'),
    headerTooltip('Event Note', 'Space for possible annotations'),
    headerTooltip('List of Owners', 'List of Owners'),
    headerTooltip('List of Captains', 'List of Captains'),
    headerTooltip('Note', 'Space for possible annotations about the source identity from the person who does the transcription'),
    'Comment'
]);
tablesWithoutCommentCols.set(tableId, [9, 22, 23, 24]); //define fieds that do not have external content

var ships_data = [
    {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""},
    {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}
];

var ships_cols = [
    {data: 'source_page', type: 'text'},
    {data: 'ship_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_type_it")), vocab: 'ship_type_it'},
    {data: 'ship_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_it")), vocab: 'ship_name_it'},
    {data: 'ship_tonnage', type: 'text'},
    {data: 'number_of_guns', type: 'text'},
    {data: 'number_of_crew', type: 'text'},
    {data: 'construction_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
    {data: 'construction_year', type: 'text'},
    {data: 'horse_power', type: 'text'},
    {data: 'type_of_event', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("event_type_it")), vocab: 'event_type_it', renderer: groupRenderer},
    {data: 'event_related_location_from', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it', renderer: groupRenderer},
    {data: 'event_related_location_to', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it', renderer: groupRenderer},
    {data: 'event_date', type: 'date', renderer: groupRenderer},
    {data: 'event_description', type: 'date', renderer: groupRenderer},
    {data: 'owner_nationality', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("nationality_it")), vocab: 'nationality_it', renderer: groupRenderer},
    {data: 'flag', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("flag_it")), vocab: 'flag_it', renderer: groupRenderer},
    {data: 'event_ship_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_it")), vocab: 'ship_name_it', renderer: groupRenderer},
    {data: 'event_ship_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_type_it")), vocab: 'ship_type_it', renderer: groupRenderer},
    {data: 'event_ship_tonnage', type: 'text', renderer: groupRenderer},
    {data: 'event_number_of_guns', type: 'text', renderer: groupRenderer},
    {data: 'event_number_of_crew', type: 'text', renderer: groupRenderer},
    {data: 'event_note', type: 'text', renderer: groupRenderer},
    {data: 'list_of_students', type: 'text', renderer: buttonRenderer, readOnly: true},
    {data: 'subject_of_study_type', renderer: aggregadebuttonRenderer, readOnly: true},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];

function buttonRenderer(instance, td, row) {
    var title = instance.getDataAtCell(row, 2);
    if (title) {
        title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
    }
    td.innerHTML = "<a onclick='createNestedTable(" + row + "," + null + ",\"" + title + "\")'> <button id='Row_" + row + "' style='padding:2px; font-size:8px;' type='button' class=' nested_button btn btn-outline-secondary'>Nested table</button></a>";// + value;
    td.className = 'htCenter';
    return td;
}

function aggregadebuttonRenderer(instance, td, row) {
    var title = instance.getDataAtCell(row, 2);
    if (title) {
        title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
    }
    td.innerHTML = "<a onclick='showAggregadeList(" + row + "," + null + ",\"" + title + "\")'>  <button id='aggregade_button_" + row + "' style='padding:2px; font-size:8px;' type='button' class=' aggregade_nested btn btn-outline-secondary'>Nested table</button></a>";// + value;
    td.className = 'htCenter';
    return td;
}

var cont = document.getElementById(tableId);
var headers = [
    ['', '', '', '', '', '', {label: '', colspan: '2'}, '', {label: 'Event', colspan: '13'}, ''],
    ['', '', '', '', '', '', {label: 'Construction', colspan: '2'}, '', '', {label: 'Related Location', colspan: '2'}, '', '', '', '', '', '', '', '', '', '', '', '', ''],
    tablesAndHeaders.get(tableId)
];

var courses_listGroups = [[9, 21]];
headers = markHeaders(headers, courses_listGroups);
var ship_locs = new Object();
var ship_obj = new Object();
var ships_tbl = new Object();

var ships_list_hot = new Handsontable(cont, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: ships_data,
    columns: ships_cols,
    manualColumnResize: true,
    contextMenu: true,
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
        if (col > 8 && col < 22) {
            groupLeftClicked(this, row, col);
        }
    },
    afterRenderer: function(td, row, col, prop, value) {
        if ((ships_cols [col].vocab === 'location_it') && (value)) {
            handle_multiple_table_instances(row, col, value, 'ship_identity', null, null, ship_locs, null, 'LOCS');
            //handle_locations(value,'list_of_ships',row,col,'LOCS',ships_locs);            
        }
        if ((value) && ((col === 1) || (col === 2) || (col === 6) || (col === 7))) {
            handle_ships(row, col, value, 'list_of_ships', [0, 1, 3, 4], ['type', 'name', 'construction_location', 'construction_date'], 'SHIPS', ship_obj, ships_tbl);
        }
    }
});

ships_list_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(ships_cols[col].vocab);
            }
            else if (key === 'add') {
                var colClicked = ships_list_hot.getSelectedRange().to.col;
                var rowClicked = ships_list_hot.getSelectedRange().to.row;
                if (colClicked > 8 && colClicked < 15) {
                    groupClicked('courses_list', "events", rowClicked, 9, 21);
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
                    return ships_list_hot.countRows() - 1 !== ships_list_hot.getSelected()[0];
                },
                callback: function() {
                    this.alter('insert_row', this.getSelected()[0] + 1, 10);
                }
            },
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function() {
                    var col = ships_list_hot.getSelectedRange().to.col;
                    var label = ships_cols[col].vocab;
                    if (label) {
                        update_Vocs();
                        return ships_list_hot.getSelectedRange().to.col !== col;
                    } else {
                        return ships_list_hot.getSelectedRange().to.col !== -1;
                    }
                }},
            "add": {
                name: "Add table",
                hidden: function() {
                    return isAddTableMenuVisible(this, courses_listGroups);

                }},
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




var students_list = [];
var students_columns = [
    {data: 'part_of_ownership', type: 'text', renderer: groupRenderer},
    {data: 'acquisition_date', type: 'date', renderer: groupRenderer},
    {data: 'organization_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_it")), vocab: 'organization_it', renderer: groupRenderer},
    {data: 'organization_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it', renderer: groupRenderer},
    {data: 'owner_gender', type: 'dropdown', source: ['Male', 'Female'], renderer: groupRenderer},
    {data: 'owner_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it', renderer: groupRenderer},
    {data: 'owner_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_it")), vocab: 'surname_it', renderer: groupRenderer},
    {data: 'owner_maiden_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it', renderer: groupRenderer},
    {data: 'owner_fathers_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it', renderer: groupRenderer},
    {data: 'owner_birth_place', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it', renderer: groupRenderer},
    {data: 'owner_residence_place', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it', renderer: groupRenderer},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}


];

var students_listGroups = [[0, 10]];



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
        table_header = ' / Ship Name : ' + header;
    }

    var html = "<div  class='panel panel-default nested_table not_visible' style='border:transparent; margin-top:5px;'>" +
            "<div class='panel-heading' role='tab' id='heading" + cnt + "'>" +
            "<h4 class='panel-title'>" +
            "    <a style='background-color:#589AAF;' class='collapsed' role='button' onclick='close_nested(" + cnt + ")'  href='#collapse" + cnt + "'>" +
            "<span class='pull-right glyphicon glyphicon-remove'></span>" + "List of Owners " + plus + table_header +
            "     </a>" +
            "</h4>" +
            "</div>" +
            "<div id='collapse" + cnt + "' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='heading" + cnt + "'>" +
            "    <div style='padding-top:6px;' class='panel-body'>" +
            "    <span style=' color:#163758; padding:0px;font-size: 11px'>Use the source language to fill in the fields of this table</span>" +
            "        <div>" +
            "            <div id='students_list" + cnt + "' class='hot handsontable htRowHeaders htColumnHeaders' style='height: 460px; overflow: hidden; width: 100%; margin:5px 0px 0px 4px;'></div>" +
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

        var tableId = 'students_list' + cnt;
        tablesWithoutCommentCols.set(tableId, [4, 11]); //define fieds that do not have external content
//        tablesAndHeaders.set('students_list', ['Part in Ownership (caratti)', 'Date of Acquisition', 'Name', 'Headquarters Location', 'Gender', 'Name', 'Surname', 'Maiden Name', 'Father Name', 'Place of Birth', 'Place of Residence', 'Note', 'Comment']);
        tablesAndHeaders.set('students_list', [
            headerTooltip('Part in Ownership (caratti)', 'The number of shares – carati – hold by each owner'),
            headerTooltip('Date of Acquisition', 'The date when the owner purchased his/her shares'),
            headerTooltip('Name', 'The name of the company/firm '),
            headerTooltip('Headquarters Location', 'The place where the headquarter of the company/firm was located'),
            headerTooltip('Gender', 'The gender of the shipowner'),
            headerTooltip('Name', 'The name of the shipowner'),
            headerTooltip('Surname', 'The surname of the shipowner'),
            headerTooltip('Maiden Name', 'The surname at birth in case the owner is a woman'),
            headerTooltip('Father Name', 'The name of the father of the shipowner'),
            headerTooltip('Place of Birth', 'The place of birth of the shipowner'),
            headerTooltip('Place of Residence', 'The place of residence of the shipowner'),
            headerTooltip('Note', 'Space for possible annotations about the source identity from the person who does the transcription'),
            'Comment'
        ]);
        var container = document.getElementById(tableId);

        var headers = [
            ['', '', {label: 'Owner', colspan: 9}, ''],
            ['', '', {label: 'Organization', colspan: 2}, {label: 'Person', colspan: 7}, ''],
            tablesAndHeaders.get('students_list')
        ];


        headers = markHeaders(headers, students_listGroups);
        var students_locs = new Object();
        var owner_persons = new Object();
        var owner_tbl = new Object();


        var student_hot = new Handsontable(container, {
            licenseKey: '',
            dateFormat: 'YYYY-MM-DD',
            data: data,
            columns: students_columns,
            manualColumnResize: true,
            contextMenu: true,
            autoWrapRow: true,
            currentRowClassName: 'currentRow',
            className: "htCenter htMiddle",
            rowHeaders: true,
            colHeaders: tablesAndHeaders.get('students_list'),
            nestedHeaders: headers,
            cells: function(row, col, prop) {
                if (this.vocab) {
                    handle_vocabulary(this.instance.getDataAtCell(row, col), this.vocab, this);
                }
            },
            /* Next 3 properties added to support comments*/
            comments: true,
            hiddenColumns: {
                columns: [tablesAndHeaders.get('students_list').length - 1] //last column only
            },
            afterLoadData: function() {
                addCommentForContentFoundOutsideTheSource(this);
            },
            afterRender: function() {
                markGroups(this);
            },
            afterSelectionEnd: function(row, col) {
                markGroups(this);
                if (col >= 0 && col < 11) {
                    groupLeftClicked(this, row, col);
                }
            },
            afterRenderer: function(td, row, col, prop, value) {
                if ((students_columns[col].vocab === 'location_it') && (value)) {
                    handle_multiple_table_instances(row, col, value, 'list_of_owners_' + cnt, null, null, students_locs, null, 'LOCS');
                    //handle_locations(value, 'list_of_owners_'+cnt, row, col, 'LOCS', students_locs);
                } else if (value && ((source_identity_cols[col].vocab === 'organization_it'))) {
                    handle_multiple_table_instances(row + '_', col, value, 'list_of_owners_' + cnt, null, null, null, null, 'ORGS');
                    // handle_organizations(value, 'list_of_owners_'+cnt, row, col, 'ORGS');
                } else if ((value) && (col > 4 && col < 11)) {
                    handle_multiple_table_instances(row + '_', col, value, 'list_of_owners_' + cnt, [5, 6, 7, 8, 9, 10], ['name', 'surname_a', 'maiden_name', 'fathers_name', 'date_of_birth', 'place_of_birth'], owner_persons, owner_tbl, 'PERSONS');
                    //handle_persons(row, col, value,'list_of_owners_'+cnt, [5,6,7,8,9,10], ['name', 'surname_a','maiden_name','fathers_name','date_of_birth','place_of_birth'], owner_persons, owner_tbl, 'PERSONS');                   
                }
            }
        });


        student_hot.updateSettings({
            contextMenu: {
                callback: function(key, options) {
                    if (key === 'edit_vocabulary') {
                        var col = options.start.col;
                        create_voc_modal(students_columns[col].vocab);
                    }
                    else if (key === 'add') {
                        var colClicked = student_hot.getSelectedRange().to.col;
                        var rowClicked = student_hot.getSelectedRange().to.row;
                        if (colClicked >= 0 && colClicked < 11) {
                            groupClicked('students_list' + cnt, "owners", rowClicked, 0, 10);
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
                            return student_hot.getSelected()[0] === 0;
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
                            if (((student_hot.getSelected()[0]) < 3) || ((student_hot.getSelected()[2]) < 3)) {
                                return true;
                            }
                        }
                    },
                    "hsep1": "---------",
                    "edit_vocabulary": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            var col = student_hot.getSelectedRange().to.col;
                            var label = students_columns[col].vocab;
                            if (label) {
                                update_Vocs();
                                return student_hot.getSelectedRange().to.col !== col;
                            } else {
                                return student_hot.getSelectedRange().to.col !== -1;
                            }
                        }},
                    "add": {
                        name: "Add table",
                        hidden: function() {
                            return isAddTableMenuVisible(this, students_listGroups);
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
        students_list[cnt] = student_hot;

    }
    else {

        if (!((header == null) || (header == "null"))) {
            $('#heading' + cnt).children().children().html('<span class="pull-right glyphicon glyphicon-remove"></span>List of Owners ' + plus + ' / Ship Name : ' + header);
        }
        $('#Row_' + cnt).css({'background': '#638BC7'});
        $('#Row_' + cnt).css({'color': '#ffffff'});
        $('#insert_here').show();
    }
}
;

///////////////////////////////////////////////////////////////////////

////////////////////////////Subjects ////////////////////////////////////////////


var aggregade_pressonnel_cols = [
    {data: 'captains_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it'},
    {data: 'captains_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_it")), vocab: 'surname_it'},
    {data: 'captains_fathers_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it'},
    {data: 'captains_birth_place', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
    {data: 'captains_residence_place', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
    {data: 'captains_starting_date', type: 'date'},
    {data: 'captains_ending_date', type: 'date'},
    {data: 'captains_licence_creation_date', type: 'text'},
    {data: 'captains_licence_number', type: 'text'},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];

var aggregade_personnels = [];


function close_aggregadeStaff(cnt) {

    $("#aggregade_heading" + cnt).parent().hide();

    $.each($('.aggregade_nested_button'), function(i) {
        if ($("#aggregade_button_" + i).hasClass('full_data')) {
            $("#aggregade_button_" + i).css("background-color", "#C4C4C4");
            $("#aggregade_button_" + i).css("color", "#1C6799");
        }
        else {
            $('#aggregade_button_' + i).css({'background': '#dddddd'});
            $('#aggregade_button_' + i).css({'color': '#337ab7'});
        }
    });

    $('#aggregade_button_' + cnt).css({'background': '#638BC7'});
    $('#aggregade_button_' + cnt).css({'color': '#ffffff'});
    $('#insert2_here').hide();
}

function showAggregadeList(cnt, data, header) {

    $(".aggregade_nested_table").hide();
    $('#insert_here').hide();
    var parent = $('#aggregade_heading' + cnt).parent();
    $(parent).show();


    $.each($('.aggregade_nested'), function(i) {
        if ($("#aggregade_button_" + i).hasClass('full_data')) {
            $("#aggregade_button_" + i).css("background-color", "#C4C4C4");
            $("#aggregade_button_" + i).css("color", "#1C6799");
        }
        else {
            $('#aggregade_button_' + i).css({'background-color': '#dddddd'});
            $('#aggregade_button_' + i).css({'color': '#337ab7'});
        }

    });

    var plus = parseInt(cnt) + 1;
    var table_header = "";
    if (!((header == null) || (header == "null"))) {
        table_header = ' / Ship Name : ' + header;
    }

    var html = "<div  class='panel panel-default aggregade_nested_table not_visible' style='border:transparent; margin-top:5px;'>" +
            "<div class='panel-heading' role='tab' id='aggregade_heading" + cnt + "'>" +
            "<h4 class='panel-title'>" +
            "    <a style='background-color:#589AAF;' class='collapsed' role='button' onclick='close_aggregadeStaff(" + cnt + ")'  href='#collapse" + cnt + "'>" +
            "<span class='pull-right glyphicon glyphicon-remove'></span>" + "List of Captains " + plus + table_header +
            "     </a>" +
            "</h4>" +
            "</div>" +
            "<div id='collapse" + cnt + "' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='analytic_heading" + cnt + "'>" +
            "    <div style='padding-top:6px;' class='panel-body'>" +
            "    <span style=' color:#163758; padding:0px;font-size: 11px'>Use the source language to fill in the fields of this table</span>" +
            "        <div>" +
            "            <div id='aggregade_personnel" + cnt + "' class='hot handsontable htRowHeaders htColumnHeaders' style='height: 380px; overflow: hidden; width: 100%;  margin:5px 0px 0px 4px;'></div>" +
            "        </div> " +
            "    </div>" +
            "</div>" +
            "</div>";

    if ($('#aggregade_heading' + cnt).size() == 0) {

        $('#insert2_here').append(html);
        $('#insert2_here').show();

        if (data == null) {
            data = [{catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}, {catalogue_id: ""}];
            $('#aggregade_button_' + cnt).css({'background-color': '#638BC7'});
            $('#aggregade_button_' + cnt).css({'color': '#ffffff'});
            $("#aggregade_button_" + cnt).addClass('full_data');
        }
        else {
            $("#aggregade_button_" + cnt).addClass('full_data');
            $("#aggregade_button_" + cnt).css("background-color", "#C4C4C4");
            $("#aggregade_button_" + cnt).css("color", "#1C6799");
            $('#insert2_here').hide();
        }


        var tableId = 'aggregade_personnel' + cnt;
        tablesWithoutCommentCols.set(tableId, [9]); //define fieds that do not have external content
//        tablesAndHeaders.set('aggregade_personnel', ['Name', 'Surname', 'Father Name', 'Place of Birth', 'Place of Residence', 'Starting Date', 'Ending Date', 'Creation Date', 'Number', 'Note', 'Comment']);
        tablesAndHeaders.set('aggregade_personnel', [
            headerTooltip('Name', 'The name of the captain'),
            headerTooltip('Surname', 'The surname of the captain'),
            headerTooltip('Father Name', 'The name of captain’s father'),
            headerTooltip('Place of Birth', 'The place of birth of the captain'),
            headerTooltip('Place of Residence', 'The place of residence of the captain'),
            headerTooltip('Starting Date', 'The date on which the service of the captain started'),
            headerTooltip('Ending Date', 'The date on which the service of the captain ended'),
            headerTooltip('Creation Date', 'The date on which the license was issued'),
            headerTooltip('Number', 'The number of the license'),
            headerTooltip('Note', 'Space for possible annotations about the source identity from the person who does the transcription'),
            'Comment'
        ]);
        var container = document.getElementById(tableId);

        var captain_locs = new Object();
        var captain_persons = new Object();
        var captain_tbl = new Object();


        var aggregade_personnel_hot = new Handsontable(container, {
            licenseKey: '',
            dateFormat: 'YYYY-MM-DD',
            data: data,
            columns: aggregade_pressonnel_cols,
            manualColumnResize: true,
            contextMenu: true,
            autoWrapRow: true,
            className: "htCenter htMiddle",
            currentRowClassName: 'currentRow',
            colHeaders: tablesAndHeaders.get('aggregade_personnel'),
            rowHeaders: true,
            nestedHeaders: [
                ['', '', '', '', '', {label: 'Service Duration', colspan: 2}, {label: 'License', colspan: 2}, ''],
                tablesAndHeaders.get('aggregade_personnel')
            ],
            cells: function(row, col, prop) {
                if (this.vocab) {
                    handle_vocabulary(this.instance.getDataAtCell(row, col), this.vocab, this);
                }
            },
            /* Next 3 properties added to support comments*/
            comments: true,
            hiddenColumns: {
                columns: [tablesAndHeaders.get('aggregade_personnel').length - 1] //last column only
            },
            afterLoadData: function() {
                addCommentForContentFoundOutsideTheSource(this);
            },
            afterRenderer: function(td, row, col, prop, value) {
                if ((aggregade_pressonnel_cols[col].vocab === 'location_it') && (value)) {
                    handle_locations(value, 'list_of_captains_' + cnt, row, col, 'LOCS', captain_locs);
                } else if (value) {
                    handle_persons(row, col, value, 'list_of_captains_' + cnt, [0, 1, 2, 3, 4], ['name', 'surname_a', 'fathers_name', 'place_of_birth'], captain_persons, captain_tbl, 'PERSONS');
                    handle_persons(row + '_', col, value, 'list_of_captains_' + cnt, [2, 1], ['name', 'surname_a'], captain_persons, captain_tbl, 'PERSONS');
                }
            }
        });


        aggregade_personnel_hot.updateSettings({
            contextMenu: {
                callback: function(key, options) {
                    if (key === 'edit_vocabulary') {
                        var col = options.start.col;
                        create_voc_modal(aggregade_pressonnel_cols[col].vocab);
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
                            return aggregade_personnel_hot.getSelected()[0] === 0;
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
                            if (((aggregade_personnel_hot.getSelected()[0]) < 3) || ((aggregade_personnel_hot.getSelected()[2]) < 3)) {
                                return true;
                            }
                        }
                    },
                    "hsep1": "---------",
                    "edit_vocabulary": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            var col = aggregade_personnel_hot.getSelectedRange().to.col;
                            var label = aggregade_pressonnel_cols[col].vocab;
                            if (label) {
                                update_Vocs();
                                return aggregade_personnel_hot.getSelectedRange().to.col !== col;
                            } else {
                                return aggregade_personnel_hot.getSelectedRange().to.col !== -1;
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

        aggregade_personnels[cnt] = aggregade_personnel_hot;
    }
    else {

        if (!((header == null) || (header == "null"))) {
            $('#aggregade_heading' + cnt).children().children().html('<span class="pull-right glyphicon glyphicon-remove"></span>List of Captains ' + plus + ' / Ship Name : ' + header);
        }
        $('#aggregade_button_' + cnt).css({'background': '#638BC7'});
        $('#aggregade_button_' + cnt).css({'color': '#ffffff'});
        $('#insert2_here').show();
    }


}

//////////////////////////EXPORT IMPORT////////////////////////////////

function createRecordJson(usage) {

    var cat_info = createJson(catalogue_info, cols1, usage);
    var source_id = createJson(source_identity_data, source_identity_cols, usage);
    var courses_list = createJson(ships_list_hot, ships_cols, usage);


    var json = new Object();

    var student_keys = Object.keys(students_list);
    var transactions = new Object();
    for (var i = 0; i < student_keys.length; i++) {
        transactions[student_keys[i]] = createJson((students_list[student_keys[i]]), students_columns, usage);
    }

    var subs = Object.keys(aggregade_personnels);
    var subjects = new Object();
    for (var i = 0; i < subs.length; i++) {
        subjects[subs[i]] = createJson((aggregade_personnels[subs[i]]), aggregade_pressonnel_cols, usage);
    }
    cat_info.date_until = getCurrentDate();
    catalogue_info.setDataAtCell(0, 2, getCurrentDate());
    json['record_information'] = cat_info;
    json['source_identity'] = source_id;
    json['list_of_ships'] = courses_list;
    json['list_of_owners'] = transactions;
    json['list_of_captains'] = subjects;

    update_Vocs();


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

function load(data, status) {

    console.log(status);

    record_status = status;
    clear_LocalStorage_instances();

    catalogue_info.loadData(data.record_information);
    source_identity_data.loadData(data.source_identity);

    var ships_data = new Array();
    $.each(data.list_of_ships, function() {
        ships_data.push(this);
    });

    ships_list_hot.loadData(ships_data);

    $('.nested_table').remove();

    if (data.list_of_owners) {
        $.each(data.list_of_owners, function(cnt) {
            var students = new Array();
            $.each(this, function() {
                students.push(this);
            });
            createNestedTable(cnt, students);
            $(".nested_table").hide();
        });
    }

    if (data.list_of_captains) {
        $.each(data.list_of_captains, function(cnt) {
            var subjects = new Array();
            $.each(this, function() {
                subjects.push(this);
            });
            showAggregadeList(cnt, subjects);
            $(".aggregade_nested_table").hide();
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


    var student_list = new Array();
    $.each(json.list_of_owners, function(cnt) {

        $.each(this, function() {
            student_list.push(Object.assign({}, (json.list_of_ships[cnt]), (this)));
        });
    });

    if (student_list.length < 1) {
        student_list.push('');
    }

    var subject_list = new Array();
    $.each(json.list_of_captains, function(cnt) {
        $.each(this, function() {
            subject_list.push(Object.assign({}, (json.list_of_ships[cnt]), (this)));
        });
    });

    if (subject_list.length < 1) {
        subject_list.push('');
    }

    var sheets = new Array();
    sheets.push([json.record_information]);
    sheets.push([json.source_identity]);
    sheets.push(json.list_of_ships);
    sheets.push(student_list);
    sheets.push(subject_list);

    var groupTables = createMultipleTables(json['list_of_ships'], courses_listGroups, ships_cols);
    var result = createExcelSheetsData(sheets, groupTables);

    var nestedGroups = createMultipleNestedTables(json['list_of_owners'], students_listGroups, ships_cols, students_columns);

    result = createExcelSheetsData(sheets, nestedGroups);



    var opts = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Source Identity', header: false}, {sheetid: 'List of Ships', header: true}, {sheetid: 'List Of Owners', header: true}, {sheetid: 'List Of Captains', header: true}];
    var res = alasql('SELECT * INTO XLSX("' + $('#unique_filename').text() + '.xlsx",?) FROM ?', [opts, result]);
});

////////////////////////////////////////////////////////////////////////////////


//////////////////Update Vocabularies on pouch DB

function update_Vocs() {
    if (mode === null) {//only update vocabularies in edit mode

        var tables = [];

        var student_keys = Object.keys(students_list);
        for (var i = 0; i < student_keys.length; i++) {
            tables.push(students_list[student_keys[i]]);
        }

        var subs = Object.keys(aggregade_personnels);
        for (var i = 0; i < subs.length; i++) {
            tables.push(aggregade_personnels[subs[i]]);
        }

        tables.push(catalogue_info, source_identity_data, ships_list_hot);
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
            } else if (table_id === "courses_list") {
                old_val = ships_list_hot.getDataAtCell(this.row, this.col, value);
                ships_list_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            }
            else if (table_id.indexOf("students_list") !== -1) {
                var cnt = table_id.replace("students_list", "");
                old_val = students_list[cnt].getDataAtCell(this.row, this.col, value);
                students_list[cnt].setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            }
            else if (table_id.indexOf("aggregade_personnel") !== -1) {
                var cnt = table_id.replace("aggregade_personnel", "");
                old_val = aggregade_personnels[cnt].getDataAtCell(this.row, this.col, value);
                aggregade_personnels[cnt].setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
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
    } else if (parentTable === "courses_list") {
        ships_list_hot.setDataAtCell(row, col, val);
    } else if (parentTable.indexOf("students_list") !== -1) {
        var cnt = parentTable.replace("students_list", "");
        students_list[cnt].setDataAtCell(row, col, val);
    } else if (parentTable.indexOf("aggregade_personnel") !== -1) {
        var cnt = parentTable.replace("aggregade_personnel", "");
        aggregade_personnels[cnt].setDataAtCell(row, col, val);
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
    tmp['source_identity']['source_language'] = 'Italian';

    var double_nested = nested_with_Groups(json.list_of_owners, json.list_of_ships, null, students_columns, 'list_of_students', 'ship_');

    var sec_nested = nested_with_Groups(json.list_of_captains, json.list_of_ships, null, aggregade_pressonnel_cols, 'subject_of_study_type', 'ship_');
    /// merge tow nested tables
    $.each(double_nested, function(k) {
        double_nested[k]['subject_of_study_type'] = sec_nested[k]['subject_of_study_type'];
    });

    ////////////////MULTIPLE TABLE WITH GROUPS AND NESTED/////////////////////// 
    // var nested_groups = nested_with_Groups(json.displacement_list,json.maritime_workers_list, displacementsGroups,displacement_columns,'displacement_list', 'displacement_' );
    var simple_groups = simple_with_Groups(json.list_of_ships, courses_listGroups, ships_cols);
    tmp['list_of_ships'] = merge_Groups_Nested(double_nested, simple_groups, courses_listGroups, 'ship_', ships_cols);
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

