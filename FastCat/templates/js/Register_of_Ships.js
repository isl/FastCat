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

        } else if (subTableName === "owners") {
            var cols = [
                {data: 'owner_organization_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("organization_es")), vocab: 'organization_es'},
                {data: 'owner_organization_type', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("type_of_organization_es")), vocab: 'type_of_organization_es'},
                {data: 'owner_hq_location', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
                {data: 'owner_person_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es'},
                {data: 'owner_person_surname', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
                {data: 'owner_person_surname_2', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
                {data: 'owner_person_profession', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_capacity_role_es")), vocab: 'status_capacity_role_es'},
                {data: 'registration_location', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
                {data: 'registration_type', type: 'text'},
                {data: 'registration_number', type: 'text'}];
            nestedHeaders = [
                ['Name', 'Type', 'Headquarter Location', 'Name', 'Surname1', 'Surname2', 'Profession', 'Location', 'Type', 'Number']
            ];
            data = setSubTableData(list_of_ships_hot, row, startCol, endCol);

        } else if (subTableName === "involved_persons") {
            var cnt = parentTableName.replace("deed_contents", "");
            var cols = [
                {data: 'percentage_of_sale', type: 'text'},
                {data: 'role_in_event', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("role_in_event_es")), vocab: 'role_in_event_es'},
                {data: 'type_of_relationship', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("person_to_person_relation_es")), vocab: 'person_to_person_relation_es'},
                {data: 'person_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es'},
                {data: 'person_surname_1', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
                {data: 'person_surname_2', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
                {data: 'fathers_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es'},
                {data: 'mothers_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es'},
                {data: 'registration_location', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
                {data: 'registration_type', type: 'text'},
                {data: 'registration_number', type: 'text'},
                {data: 'organization', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("organization_es")), vocab: 'organization_es'},
                {data: 'type', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("type_of_organization_es")), vocab: 'type_of_organization_es'}
            ];
            nestedHeaders = [
                ['Percentage of Sale', 'Role in Event', 'Type of Relationship', 'Name', 'Surname 1', 'Surname 2', 'Fathers Name', 'Mothers Name', 'Location', 'Type', 'Number', 'Name', 'Type']
            ];
            data = setSubTableData(deed_contents[cnt], row, startCol, endCol);

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
//tablesAndHeaders.set(tableId, ['Name', 'Location', 'Book Title *', 'Book Number *', 'Registration Port', 'Location', 'Organization', 'Year', 'Note', 'Comment']);
tablesAndHeaders.set(tableId, [
    headerTooltip('Name', 'name of the organization where the original source was kept during the time of transcription. Can be Archive, Library, Museum, Online library etc'),
    headerTooltip('Location', 'The Location of the organization where the source was kept during the time of transcription'),
    headerTooltip('Book Title *', 'Title of the specific document/book'),
    headerTooltip('Book Number *', 'Book Number *'),
    headerTooltip('Source Type Name', 'Source Type Name '),
    headerTooltip('Registration Port', 'The port in which the registration of the ships took place'),
    headerTooltip('Location', 'The place where the issuing authority was located'),
    headerTooltip('Organization', 'name of the issuing authority organization'),
    headerTooltip('Year', 'year of issuing'),
    headerTooltip('Note', 'Note'),
    'Comment'
]);
tablesWithoutCommentCols.set(tableId, [0, 1, 5]); //define fieds that do not have external content

var sourcedata = [{ship_name: ''}];

var source_identity_cols = [
    {data: 'holder_organization_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("archive_or_library_es")), vocab: 'archive_or_library_es'},
    {data: 'holder_organization_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'book_title', type: 'text'},
    {data: 'book_number', type: 'text'},
    
    {data: 'source_type_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("source_type_name_es")), vocab: 'source_type_name_es'},
    
    {data: 'registration_port', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'issuing_authority_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'issuing_authority_organization', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("local_authority_es")), vocab: 'local_authority_es'},
    {data: 'issuing_authority_year', type: 'text'},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];
var source_locs = new Object();
var source_persons = new Object();
var source_tbl = new Object();

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
        [{label: 'Holder Organization', colspan: 2}, '', '', '', '', {label: 'Issuing Authority', colspan: 3}, '', ''],
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
        if ((source_identity_cols[col].vocab === 'location_es') && (value)) {
            handle_locations(value, 'source_identity', row, col, 'LOCS', source_locs);
        } else if ((source_identity_cols[col].vocab === 'archive_or_library_es') && value) {
            handle_organizations(value, 'source_identity', row, col, 'ORGS');
        } else if ((source_identity_cols[col].vocab === 'local_authority_es') && value) {
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
//////////////////////////////   3th TABLE     ////////////////////////////////
/////////////////////////LIST OF DEEDS/////////////////////////////////////////                       

var tableId = "deed_list";
//tablesAndHeaders.set(tableId, ['Source Page', 'Number', 'Date', 'Name', 'Surname1', 'Surname2', 'Code', 'Ship Name', 'Ship Type', 'Value', 'Unit', 'Normalization in kg', 'Value', 'Unit', 'Normalization in meter', 'Value', 'Unit', 'Normalization in meter', 'Value', 'Unit', 'Normalization in meter', 'Name', 'Type', 'Headquarter Location', 'Name', 'Surname1', 'Surname2', 'Profession', 'Location', 'Type', 'Number', 'Name', 'Type', 'Name', 'Surname1', 'Surname2', 'Place', 'Value', 'Unit', 'Date', 'Result', 'Last Service Date', 'Event of Sale', 'Note', 'Comment']);
tablesAndHeaders.set(tableId, [
    headerTooltip('Source Page', 'The number or folio of the register page where the information is provided'),
    headerTooltip('Source Name', 'The name or folio of the register page where the information is provided'),
    headerTooltip('Number', 'The number with which the specific ship is registered in this source'),
    headerTooltip('Date', 'The date the ship was registered in this source'),
    headerTooltip('Name', 'The name of the person who did the registration'),
    headerTooltip('Surname1', 'The first surname of the person who did the registration'),
    headerTooltip('Surname2', 'The second surname of the person who did the registration'),
    headerTooltip('Code', 'Internal code of the ship'),
    headerTooltip('Ship Name', 'The name of the ship at the time of documentation'),
    headerTooltip('Ship Type', 'The type of the ship at the moment of documentation'),
    headerTooltip('Value', 'Value'),
    headerTooltip('Unit', 'Unit'),
    headerTooltip('Normalization in kg', 'Not included in the source: The weight of the ship normalized in kilos'),
    headerTooltip('Value', 'Value'),
    headerTooltip('Unit', 'Unit'),
    headerTooltip('Normalization in meter', 'Not included in the source: The length of the ship normalized in meters'),
    headerTooltip('Value', 'Value'),
    headerTooltip('Unit', 'Unit'),
    headerTooltip('Normalization in meter', 'Not included in the source: The length of the ship normalized in meters'),
    headerTooltip('Value', 'Value'),
    headerTooltip('Unit', 'Unit'),
    headerTooltip('Normalization in meter', 'Not included in the source: The length of the ship normalized in meters'),
    
    headerTooltip('Flag', 'Flag'),
    
    headerTooltip('Name', 'Name of the captain of the ship at documentation time'),
    headerTooltip('Surname', 'Surname of the captain of the ship at documentation time'),
   
    headerTooltip('Name', 'The name of the company that owns the ship at documentation time'),
    headerTooltip('Type', 'Type of company: e.g. limited, one person,partnership'),
    headerTooltip('Headquarter Location', 'The headquarters location of the company that owns the ship'),
    headerTooltip('Name', 'Name of the owner of the ship at documentation time'),
    headerTooltip('Surname1', 'Surname of the owner'),
    headerTooltip('Surname2', 'Second Surname of the owner'),
    headerTooltip('Profession', 'The profession of the ship owner at documentation time'),
    headerTooltip('Location', 'The place where the owner was registered'),
    headerTooltip('Type', 'The type of the registration list'),
    headerTooltip('Number', 'The number of the owner inside the registration list'),
    headerTooltip('Name', 'Name of the company that built the ship'),
    headerTooltip('Type', 'Type of company: e.g. limited, one person, partnership'),
    headerTooltip('Name', 'Name of the person that constructed the ship'),
    headerTooltip('Surname1', 'Surname of the person that constructed the ship'),
    headerTooltip('Surname2', 'Surname2'),
    headerTooltip('Place', 'place where the ship was built'),
    
    headerTooltip('Year of Construction', 'Construction Year'),
    
    headerTooltip('Value', 'the value of the ship for first purchase of company'),
    headerTooltip('Unit', 'Unit'),
    headerTooltip('Date', 'The date of the last time the ship has been inspected by the local authorities'),
    headerTooltip('Result', 'The results of the last time the ship has been inspected by the local authorities'),
    headerTooltip('Last Service Date', 'date of the end of the service with the company'),
    headerTooltip('Event of Sale', 'Event of Sale'),
    headerTooltip('Note', 'Note'),
    'Comment'
]);
tablesWithoutCommentCols.set(tableId, [3, 4]); //define fieds that do not have external content



var list_of_ships_cols = [
    {data: 'source_page', type: 'text'},
    {data: 'source_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("source_type_name_es")), vocab: 'source_type_name_es'},
    {data: 'document_number', type: 'text'},
    {data: 'document_date', type: 'date'},
    {data: 'notary_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es'},
    {data: 'notary_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
    {data: 'notary_surname_1', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
    {data: 'ship_code', type: 'text'},
    {data: 'ship_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_es")), vocab: 'ship_name_es'},
    {data: 'ship_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_type_es")), vocab: 'ship_type_es'},
    {data: 'gross_tonage_value', type: 'text'},
    {data: 'gross_tonage_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_es")), vocab: 'unit_es'},
    {data: 'gross_tonnage_normalization_in_kg', type: 'text'},
    {data: 'length_tonage_value', type: 'text'},
    {data: 'length_tonage_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_es")), vocab: 'unit_es'},
    {data: 'length_tonnage_normalization_in_meter', type: 'text'},
    {data: 'width_tonage_value', type: 'text'},
    {data: 'width_tonage_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_es")), vocab: 'unit_es'},
    {data: 'width_tonnage_normalization_in_meter', type: 'text'},
    {data: 'depth_tonage_value', type: 'text'},
    {data: 'depth_tonage_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_es")), vocab: 'unit_es'},
    {data: 'depth_tonnage_normalization_in_meter', type: 'text'},
    
    {data: 'flag', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("flag_in")), vocab: 'flag_in'},
    
    {data: 'captain_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es'},
    {data: 'captain_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
    
    {data: 'owner_organization_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_es")), vocab: 'organization_es', renderer: groupRenderer},
    {data: 'owner_organization_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("type_of_organization_es")), vocab: 'type_of_organization_es', renderer: groupRenderer},
    {data: 'owner_hq_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es', renderer: groupRenderer},
    {data: 'owner_person_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es', renderer: groupRenderer},
    {data: 'owner_person_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es', renderer: groupRenderer},
    {data: 'owner_person_surname_1', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es', renderer: groupRenderer},
    {data: 'owner_person_profession', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_es")), vocab: 'status_capacity_role_es', renderer: groupRenderer},
    {data: 'registration_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es', renderer: groupRenderer},
    {data: 'registration_type', type: 'text', renderer: groupRenderer},
    {data: 'registration_number', type: 'text', renderer: groupRenderer},
    {data: 'construction_organization_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_es")), vocab: 'organization_es'},
    {data: 'construction_organization_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("type_of_organization_es")), vocab: 'type_of_organization_es'},
    {data: 'construction_person_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es'},
    {data: 'construction_person_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
    {data: 'construction_person_surname_2', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
    {data: 'construction_person_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    
    {data: 'year_of_construction', type: 'text'},
    
    {data: 'construction_value', type: 'text'},
    {data: 'construction_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_es")), vocab: 'unit_es'},
    {data: 'last_inspection_date', type: 'date'},
    {data: 'last_inspection_result', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'last_service_date', type: 'date'},
    {data: 'deed_content', renderer: buttonRenderer, readOnly: true},
    {data: 'sale_event_note', renderer: textRender, readOnly: true, type: 'text'},
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

var cont = document.getElementById('deed_list');

var headers = [
    ['','', {label: '', colspan: 2}, {label: '', colspan: 3}, '', '', '', {label: '', colspan: 3}, {label: 'Dimensions', colspan: 9},'',{label: '', colspan: 2}, {label: 'Owner', colspan: 10}, {label: 'Shipyard / Construction', colspan: 9}, {label: '', colspan: 2}, '', '', '', ''],
    ['','', {label: 'Documentation', colspan: 2}, {label: 'Notary', colspan: 3}, '', '', '', {label: 'Gross Tonnage', colspan: 3}, {label: headerTooltip('Length', 'bow to stern'), colspan: 3}, {label: headerTooltip('Width', 'At widest point'), colspan: 3},{label: headerTooltip('Depth', 'keel to beam'), colspan: 3},'', {label: 'Captain', colspan: 2}, {label: 'Organization', colspan: 3}, {label: 'Person', colspan: 4}, {label: 'Registration', colspan: 3}, {label: 'Organization', colspan: 2}, {label: 'Person', colspan: 3}, '', '',{label: 'Value of Construction', colspan: 2}, {label: 'Last Inspection', colspan: 2}, '', ''],
    tablesAndHeaders.get(tableId)
];

var deeds_tableGroups = [[25, 34]];
headers = markHeaders(headers, deeds_tableGroups);

var list_of_ships_hot = new Handsontable(cont, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: [{deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}],
    columns: list_of_ships_cols,
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
        if (col > 24 && col < 35) {
            groupLeftClicked(this, row, col);
        }
    }
});


list_of_ships_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(list_of_ships_cols[col].vocab);
            } else if (key === 'add') {
                var colClicked = list_of_ships_hot.getSelectedRange().to.col;
                var rowClicked = list_of_ships_hot.getSelectedRange().to.row;
                if (colClicked > 24 && colClicked < 35) {
                    groupClicked("deed_list", "owners", rowClicked, 25, 34);
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
                    return list_of_ships_hot.countRows() - 1 !== list_of_ships_hot.getSelected()[0];
                },
                callback: function() {
                    this.alter('insert_row', this.getSelected()[0] + 1, 10);
                }
            },
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function() {
                    var col = list_of_ships_hot.getSelectedRange().to.col;
                    var label = list_of_ships_cols[col].vocab;
                    if (label) {
                        update_Vocs();
                        return list_of_ships_hot.getSelectedRange().to.col !== col;
                    } else {
                        return list_of_ships_hot.getSelectedRange().to.col !== -1;
                    }
                }},
            "add": {
                name: "Add table",
                hidden: function() {
                    return isAddTableMenuVisible(this, deeds_tableGroups);

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




var deed_contents = [];
var transaction_columns = [
    /////////////////////////Contracting Party//////////////////////////////////
    {data: 'date_of_sale', type: 'date'},
    {data: 'purchase_value', type: 'text'},
    {data: 'purchase_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_es")), vocab: 'unit_es'},
    {data: 'percentage_of_sale', type: 'text', renderer: groupRenderer},
    {data: 'role_in_event', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("role_in_event_es")), vocab: 'role_in_event_es', renderer: groupRenderer},
    {data: 'type_of_relationship', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("person_to_person_relation_es")), vocab: 'person_to_person_relation_es', renderer: groupRenderer},
    {data: 'person_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es', renderer: groupRenderer},
    {data: 'person_surname_1', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es', renderer: groupRenderer},
    {data: 'person_surname_2', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es', renderer: groupRenderer},
    {data: 'fathers_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es', renderer: groupRenderer},
    {data: 'mothers_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es', renderer: groupRenderer},
    {data: 'registration_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es', renderer: groupRenderer},
    {data: 'registration_type', type: 'text', renderer: groupRenderer},
    {data: 'registration_number', type: 'text', renderer: groupRenderer},
    {data: 'organization_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_es")), vocab: 'organization_es', renderer: groupRenderer},
    {data: 'organization_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("type_of_organization_es")), vocab: 'type_of_organization_es', renderer: groupRenderer},
    {data: 'headquarter_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'deed_description', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];

var deed_contentsGroups = [[3, 15]];



function close_nested(cnt) {
    $("#heading" + cnt).parent().hide();

    $.each($('.nested_button'), function(i) {

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
    //////////////////////////////////////////////

    $(".nested_table").hide();
    var parent = $('#heading' + cnt).parent();
    $(parent).show();

    $.each($('.nested_button'), function(i) {
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
        table_header = ' / Reference Number : ' + header;
    }

    var html = "<div  class='panel panel-default nested_table not_visible' style='border:transparent; margin-top:5px;'>" +
            "<div class='panel-heading' role='tab' id='heading" + cnt + "'>" +
            "<h4 class='panel-title'>" +
            "    <a style='background-color:#589AAF;' class='collapsed' role='button' onclick='close_nested(" + cnt + ")'  href='#collapse" + cnt + "'>" +
            "<span class='pull-right glyphicon glyphicon-remove'></span>" + "Event of Sale " + plus + table_header +
            "     </a>" +
            "</h4>" +
            "</div>" +
            "<div id='collapse" + cnt + "' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='heading" + cnt + "'>" +
            "    <div style='padding-top:6px;' class='panel-body'>" +
            "    <span style=' color:#163758; padding:0px;font-size: 11px'>Use the source language to fill in the fields of this table</span>" +
            "        <div>" +
            "            <div id='deed_contents" + cnt + "' class='hot handsontable htRowHeaders htColumnHeaders' style='height: 460px; overflow: hidden; width: 100%; margin:5px 0px 0px 4px;'></div>" +
            "        </div> " +
            "    </div>" +
            "</div>" +
            "</div>";


    if ($('#heading' + cnt).size() === 0) {
        $('#insert_here').append(html);

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

        var tableId = 'deed_contents' + cnt;
        tablesWithoutCommentCols.set(tableId, [29]); //define fieds that do not have external content
//        tablesAndHeaders.set('deed_contents', ['Date of Sale', 'Value', 'Unit', 'Percentage of Sale', 'Role in Event', 'Type of Relationship', 'Name', 'Surname 1', 'Surname 2', 'Fathers Name', 'Mothers Name', 'Location', 'Type', 'Number', 'Name', 'Type', 'Headquarter Location', 'Note', 'Comment']);
        tablesAndHeaders.set('deed_contents', [
            headerTooltip('Date of Sale', 'Date when the ship was purchased from the previous owner'),
            headerTooltip('Value', 'price of the ship paid to the previous owner'),
            headerTooltip('Unit', 'Unit'),
            headerTooltip('Percentage of Sale', 'The percentage of the ship that has been sold at this event of sale'),
            headerTooltip('Role in Event', 'the role of the specific  persons involved in this event of sale. Eg. Buyer, Seller, Witness etc'),
            headerTooltip('Type of Relationship', 'Type of the relationship between persons involved in this event of sale. Eg. Widow of owner, Son of seller, Daughter of previous owner'),
            headerTooltip('Name', 'Name of the person'),
            headerTooltip('Surname 1', 'First Surname of the person'),
            headerTooltip('Surname 2', 'Second Surname of the person'),
            headerTooltip('Fathers Name', 'Name of the persons father'),
            headerTooltip('Mothers Name', 'Name of the persons mother'),
            headerTooltip('Location', 'The place where the person was registered'),
            headerTooltip('Type', 'The type of the registration list'),
            headerTooltip('Number', 'The number of the person inside the registration list'),
            headerTooltip('Name', 'The name of the company'),
            headerTooltip('Type', 'Type of company: e.g. limited, one person, partnership'),
            headerTooltip('Headquarter Location', 'The headquarters location of the company'),
            headerTooltip('Note', 'Note'),
            'Comment'
        ]);

        var container = document.getElementById(tableId);

        var headers = [
            ['', {label: '', colspan: 2}, {label: 'Involved Persons/Organization', colspan: 11}, {label: '', colspan: 2}, '', '', ''],
            ['', {label: '', colspan: 2}, '', '', {label: 'Person', colspan: 9}, {label: '', colspan: 2}, '', '', ''],
            ['', {label: 'Value of Purchase', colspan: 2}, '', '', '', '', '', '', '', '', {label: 'Registration', colspan: 3}, {label: 'Oranization', colspan: 2}, '', '', ''],
            tablesAndHeaders.get('deed_contents')
        ];


        headers = markHeaders(headers, deed_contentsGroups);

        var voyage_transaction = new Handsontable(container, {
            licenseKey: '',
            dateFormat: 'YYYY-MM-DD',
            data: data,
            columns: transaction_columns,
            manualColumnResize: true,
            contextMenu: true,
            autoWrapRow: true,
            currentRowClassName: 'currentRow',
            className: "htCenter htMiddle",
            colHeaders: tablesAndHeaders.get('deed_contents'),
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
                columns: [tablesAndHeaders.get('deed_contents').length - 1] //last column only
            },
            afterLoadData: function() {
                addCommentForContentFoundOutsideTheSource(this);
            },
            afterRender: function() {
                markGroups(this);
            },
            afterSelectionEnd: function(row, col) {  //[29,31],[32,40],[44,48]];
                markGroups(this);
                if (col > 2 && col < 16) {
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
                    } else if (key === 'add') {
                        var colClicked = voyage_transaction.getSelectedRange().to.col;
                        var rowClicked = voyage_transaction.getSelectedRange().to.row;
                        if (colClicked > 2 && colClicked < 16) {
                            groupClicked(tableId, "involved_persons", rowClicked, 3, 15);
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
                    "hsep3": "---------",
                    "remove_row": {
                        disabled: function() {
                            if (((voyage_transaction.getSelected()[0]) < 3) || ((voyage_transaction.getSelected()[2]) < 3)) {
                                return true;
                            }
                        }
                    },
                    "hsep4": "---------",
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
                    "hsep5": "---------",
                    "add": {
                        name: "Add table",
                        hidden: function() {
                            return isAddTableMenuVisible(this, deed_contentsGroups);

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
        deed_contents[cnt] = voyage_transaction;

    } else {

        if (!((header == null) || (header == "null"))) {
            $('#heading' + cnt).children().children().html('<span class="pull-right glyphicon glyphicon-remove"></span>Event of Sale ' + plus + ' / Reference Number : ' + header);
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
    var list_of_ships = createJson(list_of_ships_hot, list_of_ships_cols, usage);

    var content_keys = Object.keys(deed_contents);

    var json = new Object();
    var content_of_deeds = new Object();


    if (((usage === 'excel') && (nested_tables)) || ((mode === 'teamView') && (nested_tables))) {
        $.each(nested_tables, function(cnt) {
            var voyages_trans = new Array();
            $.each(this, function() {
                voyages_trans.push(this);
            });
            console.log('exporting nested table: ' + cnt);
            createNestedTable(cnt, voyages_trans);
            $(".nested_table").hide();
            content_of_deeds[cnt] = createJson((deed_contents[cnt]), transaction_columns, usage);
        });
        nested_tables = null;
    }
    else {
        content_of_deeds = nested_tables_object;
        for (var i = 0; i < content_keys.length; i++) {
            content_of_deeds[content_keys[i]] = createJson((deed_contents[content_keys[i]]), transaction_columns, usage);
        }
    }




    cat_info.date_until = getCurrentDate();
    catalogue_info.setDataAtCell(0, 2, getCurrentDate());
    json['record_information'] = cat_info;
    json['source_identity'] = source_id;
    json['list_of_ships'] = list_of_ships;
    json['event_of_sale'] = content_of_deeds;
    /////////////////////////////

    if (record_status === 'Public') {



        ///////////////SOURCE identity
        var terms = new Object();
        $.each(source_id, function(col) {
            var val = this.toString();
            $.each(source_identity_cols, function(col_no) {
                if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                    var label = $(this).attr('vocab');
                    handle_json_vocs(val, label, 0, col, col_no, 'source_identity', terms);
                }
            });
        });


        var crew_list_persons = new Object();
        var crew_list_tbl = new Object();
        var list_of_ships_locs = new Object();
        var ship_obj = new Object();
        var ships_tbl = new Object();
        terms = new Object();
        $.each(list_of_ships, function(row) {
            var row_data = this;
            console.log('------- handling row ' + row + ' -----------');
            $.each(this, function(col) {
                ////////////////////////////////////////////////////////
                var val = this.toString();
                $.each(list_of_ships_cols, function(col_no) {
                    if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                        var label = $(this).attr('vocab');
                        handle_json_vocs(val, label, row, col, col_no, 'list_of_ships', terms);
                    }
                });
                //////////////////////////////////////////////////////////////
                if (col === 'notary_surname') {
                    if (row_data['notary_name']) {
                        handle_multiple_table_instances(row + '_', 4, row_data['notary_name'], 'list_of_ships', [4, 5, 6], ['name', 'surname_a', 'surname_b'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                    if (row_data['notary_surname']) {
                        handle_multiple_table_instances(row + '_', 5, row_data['notary_surname'], 'list_of_ships', [4, 5, 6], ['name', 'surname_a', 'surname_b'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                    if (row_data['notary_surname_1']) {
                        handle_multiple_table_instances(row + '_', 6, row_data['notary_surname_1'], 'list_of_ships', [4, 5, 6], ['name', 'surname_a', 'surname_b'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                } else if (col === 'owner_person_surname') {
                    if (row_data['owner_person_name']) {
                        handle_multiple_table_instances(row + '__', 28, row_data['owner_person_name'], 'list_of_ships',[28, 29, 30, 35], ['name', 'surname_a', 'surname_b', 'registration_number'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                    if (row_data['owner_person_surname']) {
                        handle_multiple_table_instances(row + '__', 29, row_data['owner_person_surname'], 'list_of_ships',[28, 29, 30, 35],['name', 'surname_a', 'surname_b', 'registration_number'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                    if (row_data['owner_person_surname_1']) {
                        handle_multiple_table_instances(row + '__', 30, row_data['owner_person_surname_1'], 'list_of_ships', [28, 29, 30, 35], ['name', 'surname_a', 'surname_b', 'registration_number'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                    if (row_data['registration_number']) {
                        handle_multiple_table_instances(row + '__', 35, row_data['registration_number'], 'list_of_ships',[28, 29, 30, 35], ['name', 'surname_a', 'surname_b', 'registration_number'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                } else if (col === 'construction_person_surname') {
                    if (row_data['construction_person_name']) {
                        handle_multiple_table_instances(row + '___', 37, row_data['construction_person_name'], 'list_of_ships', [37, 38, 39], ['name', 'surname_a', 'surname_b'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                    if (row_data['construction_person_surname']) {
                        handle_multiple_table_instances(row + '___', 38, row_data['construction_person_surname'], 'list_of_ships', [37, 38, 39], ['name', 'surname_a', 'surname_b'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                    if (row_data['construction_person_surname_2']) {
                        handle_multiple_table_instances(row + '___', 39, row_data['construction_person_surname_2'], 'list_of_ships',  [37, 38, 39], ['name', 'surname_a', 'surname_b'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                }else if (col === 'captain_surname') {
                    if (row_data['captain_name']) {
                        handle_multiple_table_instances(row + '____', 23, row_data['captain_name'], 'list_of_ships', [23, 24], ['name', 'surname_a'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }if (row_data['captain_surname']) {
                        handle_multiple_table_instances(row + '____', 24, row_data['captain_surname'], 'list_of_ships', [23,24], ['name', 'surname_a'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                   
                }
                                                
                ///////////////LOCATIONS
                else if (col === 'owner_hq_location') {
                    handle_multiple_table_instances(row, 27, this.toString(), 'list_of_ships', null, null, list_of_ships_locs, null, 'LOCS');
                } else if (col === 'registration_location') {
                    handle_multiple_table_instances(row, 32, this.toString(), 'list_of_ships', null, null, list_of_ships_locs, null, 'LOCS');
                } else if (col === 'construction_person_location') {
                    handle_multiple_table_instances(row, 40, this.toString(), 'list_of_ships', null, null, list_of_ships_locs, null, 'LOCS');
                }
                /////////////////SHIPS////////////                
                else if (col === 'ship_name') {
                    if (row_data['ship_name']) {
                        handle_ships(row, 8, row_data['ship_name'], 'list_of_ships', [8, 9, 7, 40, 25], ['name', 'type', 'telegraphic_code', 'registration_folio', 'construction_location','owner_company'], 'SHIPS', ship_obj, ships_tbl);
                    }
                    if (row_data['ship_type']) {
                        handle_ships(row, 9, row_data['ship_type'], 'list_of_ships', [8, 9, 7, 40, 25], ['name', 'type', 'telegraphic_code', 'registration_folio', 'construction_location','owner_company'], 'SHIPS', ship_obj, ships_tbl);
                    }
                    if (row_data['ship_code']) {
                        handle_ships(row, 7, row_data['ship_code'], 'list_of_ships', [8, 9, 7, 40, 25], ['name', 'type', 'telegraphic_code', 'registration_folio', 'construction_location','owner_company'], 'SHIPS', ship_obj, ships_tbl);
                    }
                    if (row_data['construction_person_location']) {
                        handle_ships(row, 40, row_data['construction_person_location'], 'list_of_ships',  [8, 9, 7, 40, 25], ['name', 'type', 'telegraphic_code', 'registration_folio', 'construction_location','owner_company'], 'SHIPS', ship_obj, ships_tbl);
                    }
                    if (row_data['owner_organization_name']) {
                        handle_ships(row, 25, row_data['owner_organization_name'], 'list_of_ships',  [8, 9, 7, 40, 25], ['name', 'type', 'telegraphic_code', 'registration_folio', 'construction_location','owner_company'], 'SHIPS', ship_obj, ships_tbl);
                    }
                }
                ////////////////ORGS
                else if (col === 'owner_organization_name') {
                    handle_multiple_table_instances(row, 25, this.toString(), 'list_of_ships', null, null, null, null, 'ORGS');
                } else if (col === 'construction_organization_name') {
                    handle_multiple_table_instances(row + '_', 35, this.toString(), 'list_of_ships', null, null, null, null, 'ORGS');
                }
            });
        });
//////////////////////////////////////////////////////////////////////////////// 


////////////////////////////////////////////////////////////////////////////////        
        $.each(content_of_deeds, function(cnt) {
            console.log("--------- collecting intances from nested table " + cnt + "----------------");
            var transaction_persons = new Object();
            var persons_tbl = new Object();
            var transaction_locs = new Object();
            var terms = new Object();
            $.each(this, function(row) {
                var row_data = this;
                $.each(this, function(col) {
                    //////////////handle vocabulary nested//////////////////                
                    var val = this;
                    $.each(transaction_columns, function(col_no) {
                        if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                            var label = $(this).attr('vocab');
                            handle_vocabulary(val, label, this);
                            handle_json_vocs(val, label, row, col, col_no, 'event_sale_' + cnt, terms);
                        }
                    });
                    //////////////////////////////////////////////////////      
                    if ((col === 'person_surname_1')) {
                        if ((row_data['person_name'])) {
                            handle_multiple_table_instances(row + '_', 6, row_data['person_name'], 'event_sale_' + cnt, [6, 7, 8, 13], ['name', 'surname_a', 'surname_b', 'registration_number'], transaction_persons, persons_tbl, 'PERSONS');
                        }
                        if ((row_data['person_surname_1'])) {
                            handle_multiple_table_instances(row + '_', 7, row_data['person_surname_1'], 'event_sale_' + cnt, [6, 7, 8,13], ['name', 'surname_a', 'surname_b', 'registration_number'], transaction_persons, persons_tbl, 'PERSONS');
                        }
                        if ((row_data['person_surname_2'])) {
                            handle_multiple_table_instances(row + '_', 8, row_data['person_surname_2'], 'event_sale_' + cnt, [6, 7, 8, 13], ['name', 'surname_a', 'surname_b', 'registration_number'], transaction_persons, persons_tbl, 'PERSONS');
                        }
                        if ((row_data['registration_number'])) {
                            handle_multiple_table_instances(row + '_', 13, row_data['registration_number'], 'event_sale_' + cnt, [6, 7, 8, 13], ['name', 'surname_a', 'surname_b', 'registration_number'], transaction_persons, persons_tbl, 'PERSONS');
                        }
                        /*if ((row_data['mothers_name'])) {
                            handle_multiple_table_instances(row + '_', 10, row_data['mothers_name'], 'event_sale_' + cnt, [6, 7, 8, 9, 10], ['name', 'surname_a', 'surname_b', 'fathers_name', 'maiden_name'], transaction_persons, persons_tbl, 'PERSONS');
                        }*/
                    }
                    else if ((col === 'fathers_name')) {
                        if ((row_data['fathers_name'])) {
                            handle_multiple_table_instances(row + '__', 9, row_data['fathers_name'], 'event_sale_' + cnt, [9, 7], ['name', 'surname_a'], transaction_persons, persons_tbl, 'PERSONS');
                        }
                        if ((row_data['person_surname_1'])) {
                            handle_multiple_table_instances(row + '__', 7, row_data['person_surname_1'], 'event_sale_' + cnt, [9, 7], ['name', 'surname_a'], transaction_persons, persons_tbl, 'PERSONS');
                        }
                    }
                    else if ((col === 'mothers_name')) {
                        if ((row_data['mothers_name'])) {
                            handle_multiple_table_instances(row + '___', 10, row_data['mothers_name'], 'event_sale_' + cnt, [10, 8], ['name', 'surname_a'], transaction_persons, persons_tbl, 'PERSONS');
                        }
                        if ((row_data['person_surname_2'])) {
                            handle_multiple_table_instances(row + '___', 7, row_data['person_surname_2'], 'event_sale_' + cnt, [10, 7], ['name', 'surname_a'], transaction_persons, persons_tbl, 'PERSONS');
                        }
                    }
                    else if (col === 'registration_location') {
                        handle_multiple_table_instances(row, 11, this.toString(), 'event_sale_' + cnt, null, null, transaction_locs, null, 'LOCS');
                    } else if (col === 'headquarter_location') {
                        handle_multiple_table_instances(row, 16, this.toString(), 'event_sale_' + cnt, null, null, transaction_locs, null, 'LOCS');
                    } else if (col === 'organization_name') {
                        handle_multiple_table_instances(row + '_', 28, this.toString(), 'event_sale_' + cnt, null, null, null, null, 'ORGS');
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
$(window).load(function() {
    $(".spin_loader").fadeOut("slow");
});

///////////////////////////////// Load File /////////////////////////////////////////////
var nested_tables = new Object();
var url = new URL(window.location.href);
var mode = url.searchParams.get("mode");
var nested_tables_object = new Object();


var record_status;

function load(data, status) {

    console.log(status);
    record_status = status;
    clear_LocalStorage_instances();


    catalogue_info.loadData(data.record_information);
    source_identity_data.loadData(data.source_identity);

    var voyages_data = new Array();
    $.each(data.list_of_ships, function() {
        voyages_data.push(this);
    });

    list_of_ships_hot.loadData(voyages_data);
    $('.nested_table').remove();

    if (data.event_of_sale) {
        nested_tables_object = data.event_of_sale;
        $.each(data.event_of_sale, function(cnt) {
            var content_of_deed = new Array();
            $.each(this, function() {
                content_of_deed.push(this);
            });

            if (mode === 'teamView') {
                nested_tables[cnt] = content_of_deed;
            } else {
                nested_tables[cnt] = content_of_deed;
                //createNestedTable(cnt, content_of_deed);
                //$(".nested_table").hide();
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


    var sale_event = new Array();
    $.each(json.event_of_sale, function(cnt) {
        $.each(this, function() {
            sale_event.push(Object.assign({}, (json.list_of_ships[cnt]), (this)));
        });
    });



    var sheets = new Array();
    sheets.push([json.record_information]);
    sheets.push([json.source_identity]);
    sheets.push(json.list_of_ships);

    if (sale_event.length < 1) {
        var opts = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Source Identity', header: true}, {sheetid: 'List of Ships', header: true}];
        var res = alasql('SELECT * INTO XLSX("' + $('#unique_filename').text() + '.xlsx",?) FROM ?', [opts, sheets]);
    } else {
        sheets.push(sale_event);
        var groupTables = createMultipleTables(json['list_of_ships'], deeds_tableGroups, list_of_ships_cols);
        var result = createExcelSheetsData(sheets, groupTables);
        var nestedGroups = createMultipleNestedTables(json['event_of_sale'], deed_contentsGroups, list_of_ships_cols, transaction_columns);
        result = createExcelSheetsData(sheets, nestedGroups);
        var opts = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Source Identity', header: true}, {sheetid: 'List of Ships', header: true}, {sheetid: 'Sale Events', header: true}];
        var res = alasql('SELECT * INTO XLSX("' + $('#unique_filename').text() + '.xlsx",?) FROM ?', [opts, result]);
    }
});

/////////////////////////////////////////////////////////////////////////////////

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
    tmp['record_information']['related_organization'] = 'University of Barcelona';
    tmp['record_information']['record_id'] = recordId;
    tmp['record_information']['template_type'] = templateTitle;
    tmp['source_identity'] = json.source_identity;
    tmp['source_identity']['source_language'] = 'Spanish';

     ////////////////MULTIPLE TABLE WITH GROUPS AND NESTED/////////////////////// 
    var nested_groups = nested_with_Groups(json.event_of_sale, json.list_of_ships, deed_contentsGroups, transaction_columns, 'sale_event', 'ship_row_');
    var simple_groups = simple_with_Groups(json.list_of_ships, deeds_tableGroups, list_of_ships_cols);
    tmp['list_of_ships'] = merge_Groups_Nested(nested_groups, simple_groups, deeds_tableGroups, 'ship_row_', list_of_ships_cols);
    ////////////////////////////////////////////////////////////////////////////

    

   // tmp['list_of_ships'] = nested_with_Groups(json.event_of_sale, json.list_of_ships, deed_contentsGroups, transaction_columns, 'sale_event', 'ship_row_', list_of_ships_cols);//nested_content;

    root['root'] = tmp;
    var xml = formatXml(json2xml(root));

    //console.log(root);


    //  xml = xml.replace(/_#_(\d+)/g, '');

    xml = xml.replace(/<ship_row_(\d+)>/g, '<ship index="$1">');
    xml = xml.replace(/<\/ship_row_(\d+)>/g, "</ship>");

    xml = xml.replace(/<row_(\d+)>/g, '<row index="$1">');
    xml = xml.replace(/<\/row_(\d+)>/g, "</row>");

    xml = xml.replace(/<group_data_(\d+)>/g, '<group_data index="$1">');
    xml = xml.replace(/<\/group_data_(\d+)>/g, "</group_data>");

    return (xml);
}
;

/////////////

//////////////////Update Vocabularies on pouch DB

function update_Vocs() {
    if (mode === null) {//only update vocabularies in edit mode

        var tables = [];
        var content_keys = Object.keys(deed_contents);

        for (var i = 0; i < content_keys.length; i++) {
            tables.push(deed_contents[content_keys[i]]);
        }

        tables.push(catalogue_info, source_identity_data, list_of_ships_hot);
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
            //old_val.replace(new RegExp(old_term, 'g'), value));
            if (table_id === "source_identity") {
                old_val = source_identity_data.getDataAtCell(this.row, this.col, value);
                source_identity_data.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "deed_list") {
                old_val = list_of_ships_hot.getDataAtCell(this.row, this.col, value);
                list_of_ships_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id.indexOf("deed_contents") !== -1) {
                var cnt = table_id.replace("deed_contents", "");
                old_val = deed_contents[cnt].getDataAtCell(this.row, this.col, value);
                deed_contents[cnt].setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
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

    if (parentTable.indexOf("deed_contents") !== -1) {
        var cnt = parentTable.replace("deed_contents", "");
        deed_contents[cnt].setDataAtCell(row, col, val);
    } else if (parentTable === "deed_list") {
        list_of_ships_hot.setDataAtCell(row, col, val);
    } else if (parentTable === "source_identity") {
        source_identity_data.setDataAtCell(row, col, val);
    }
}
;

//////////////////////////////////////////////////////////////////////////////////
function add_loc_information(row, col, table_id, label, value) {

    var result = create_cell_location_value(label, value);

    if (table_id === "source_identity") {
        source_identity_data.setDataAtCell(row, col, result);
    } else if (table_id.indexOf("deed_contents") !== -1) {
        var cnt = table_id.replace("deed_contents", "");
        deed_contents[cnt].setDataAtCell(row, col, result);
    }
    $("#location_Modal").modal('hide');
}
;


