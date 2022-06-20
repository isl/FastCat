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
        } else if (subTableName === "previous_names") {
            var cols = [
                {data: 'previous_ship_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("ship_name_in")), vocab: 'ship_name_in'}
            ];
            nestedHeaders = [
                ['Previous Ship Names']
            ];
            data = setSubTableData(courses_hot, row, startCol, endCol);
        } else if (subTableName === "updated_values") {
            var cols = [
                {data: 'updated_value', type: 'text'},
                {data: 'updated_value_unit', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("unit_in")), vocab: 'unit_in'},
                {data: 'updated_value_year', type: 'text'}
            ];
            nestedHeaders = [
                ['Value', 'Unit', 'Year']
            ];
            data = setSubTableData(courses_hot, row, startCol, endCol);
        } else if (subTableName === "construction_materials") {
            var cols = [
                {data: 'material_of_construction', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("material_of_construction_in")), vocab: 'material_of_construction_in'}
            ];
            nestedHeaders = [
                ['Material of Construction']
            ];
            data = setSubTableData(courses_hot, row, startCol, endCol);
        }
        else if (subTableName === "tonnages") {
            var cols = [
                {data: 'tonnage_correct_type', type: 'dropdown',
                source:['Gross Tonnage', 'Net Tonnage','Register Tonnage']},
                {data: 'tonnage_type', type: 'text'},
                {data: 'tonnage_value', type: 'text'}
            ];
            nestedHeaders = [
                ['Type','Unit', 'Value']
            ];
            data = setSubTableData(courses_hot, row, startCol, endCol);
        } else if (subTableName === "engine_reconstuctions") {
            var cols = [
                {data: 'recostruction_year', type: 'text'},
                {data: 'recostruction_place', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in'}
            ];
            nestedHeaders = [
                ['Year', 'Place']
            ];
            data = setSubTableData(courses_hot, row, startCol, endCol);
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
//tablesAndHeaders.set(tableId, ['Source Type Name', 'Name', 'Location', 'URL', 'Archive Name', 'Inventory Number', 'Type of Document', 'Title of Book', 'From', 'To', 'Number', 'Title', 'Series Number', 'Number', 'Title','Issuing Authority','Publication Year','Note', 'Comment']);
tablesAndHeaders.set(tableId, [
    headerTooltip('Source Type Name', 'The type of source e.g. List of the fleet of the Austrian Lloyd Company'),
    headerTooltip('Name', 'name of the organization where the original source was kept during the time of transcription. Can be Archive, Library, Museum, Online library etc'),
    headerTooltip('Location', 'The Location of the organization where the source was kept during the time of transcription'),
    headerTooltip('URL', 'in case the source was kept in an online location, this is the URL of that location'),
    headerTooltip('Archive Name', 'The archive which includes the document'),
    headerTooltip('Inventory Number', 'The number that corresponds to the source inside the inventory'),
    headerTooltip('Type of Document', 'Book, Archival material, etc'),
    headerTooltip('Title of Book', 'Title of the specific document/book'),
    headerTooltip('From', 'the year from which the documentation of the source started'),
    headerTooltip('To', 'the year at which the documentation of the source ended'),
    headerTooltip('Number', 'identification number of the fond'),
    headerTooltip('Title', 'name of the fond'),
    headerTooltip('Series Number', 'identification number of the series'),
    headerTooltip('Number', 'identification number of the file'),
    headerTooltip('Title', 'name of the file'),
    headerTooltip('Issuing Authority', 'Issuing Authority'),
    headerTooltip('Publication Year', 'Publication Year'),
    headerTooltip('Note', 'Note'),
    'Comment'
]);
tablesWithoutCommentCols.set(tableId, [0, 1, 2, 3, 4, 5, 6, 7, 10]); //define fieds that do not have external content


var sourcedata = [
    {ship_name: ''}
];
var source_identity_cols = [
   /* {data: 'source_type_name', type: 'dropdown',
        source: ['Official list of ships of the Spanish navy',
            "Austrian Lloyd's fleet list (Reports of yearly conferences)",
            "Austrian Lloyd's register of ships",
            "Austrian Lloyd's ships in Austrian maritime register",
            "Register of steamships of the Russian Steam Navigation and Trading Company",
            "Register of ships of the Russian Merchant Fleet"
        ]},
    */
     {data: 'source_type_name',  type: 'dropdown',
        source: JSON.parse(localStorage.getItem("source_type_name_in")), vocab: 'source_type_name_in'},
    {data: 'institution_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("archive_or_library_in")), vocab: 'archive_or_library_in'},
    {data: 'institution_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in'},
    {data: 'institution_url', type: 'text'},
    {data: 'archive_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("archive_institution_in")), vocab: 'archive_institution_in'},
    {data: 'inventory_number', type: 'text'},
    {data: 'type_of_document', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("document_type_in")), vocab: 'document_type_in'},
    {data: 'book_title', type: 'text'},
    {data: 'book_date_from', type: 'text'},
    {data: 'book_date_to', type: 'text'},
    {data: 'fonds_number', type: 'text'},
    {data: 'fonds_title', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("fond_title_in")), vocab: 'fond_title_in'},
    {data: 'series_number', type: 'text'},
    {data: 'file_number', type: 'text'},
    {data: 'file_title', type: 'text'},
    {data: 'issuing_authority', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_in")), vocab: 'organization_in'},
    {data: 'publication_year', type: 'text'},
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
        ['', {label: 'Institution', colspan: 3}, '', '', '', '', {label: 'Dates of Source', colspan: 2}, {label: 'Fonds', colspan: 2}, {label: 'File', colspan: 2}, '', '', '', ''],
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
        if ((source_identity_cols[col].vocab === 'location_in') && (value)) {
            handle_locations(value, 'source_identity', row, col, 'LOCS', source_locs);
        } else if (value && ((source_identity_cols[col].vocab === 'archive_or_library_in'))) {
            handle_organizations(value, 'source_identity', row, col, 'ORGS');
        } else if (value && ((source_identity_cols[col].vocab === 'organization_in'))) {
            handle_organizations(value, 'source_identity', row + '__', col, 'ORGS');
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
//////////////////////////////   4th TABLE     ////////////////////////////////
/////////////////////////LIST COURSES/////////////////////////////////////////                       

var tableId = "courses_list";
//tablesAndHeaders.set(tableId, ['Source Page / Folio', 'Year of Documentation', 'Call Signal', 'Ship Name', 'Previous Ship Name', 'Ship Type', 'Port of Registry', 'Type of Navigation', 'Organization', 'Number', 'Place of Construction', 'Year of Construction', 'Shipyard / Construction', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Year', 'Material of Construction', 'Type', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Sheathing of the Hull', 'Number of Decks', 'Number of Masts', 'Number of Engines', 'Type of Engine', 'Place of Engine Construction', 'Year of Engine Construction', 'Engine Manufacturer', 'Year', 'Place', 'Nominal Power', 'Indicated Power', 'Value', 'Unit', 'Name', 'Surname', 'Number of the crew', '1st Class', '2nd Class', '3rd Class', '4th class', 'Date of first launch', 'First Service date', 'Reason', 'Last Service date', 'Reconstruction', 'Ownership', 'Notes', 'Comment']);
tablesAndHeaders.set(tableId, [
    headerTooltip('Source Page / Folio', 'The number or folio of the register page where the information is provided'),
    headerTooltip('Year of Documentation', 'the year of documentation of the specific ship in this source'),
    headerTooltip('Call Signal', 'Code which gives the ship a unique identity. Given to the ship by the relevant authorities'),
    headerTooltip('Ship Name', 'The name of the ship at the time of documentation'),
    headerTooltip('Previous Ship Name', 'The name of the ship given to the ship before the time of documentation'),
    headerTooltip('Ship Type', 'The type of the ship at the moment of documentation'),
    headerTooltip('Port of Registry', 'The place where the ship was registered'),
    headerTooltip('Year of Registry', 'The year when the ship was registered'),
    headerTooltip('Type of Navigation', 'long or short distance'),
    headerTooltip('Organization', 'Organization that kept the books of classification '),
    headerTooltip('Number', 'The number given to the specific ship in the book of classifications'),
    headerTooltip('Place of Construction', 'place where the ship was built'),
    headerTooltip('Year of Construction', 'The year the ship was constructed'),
    headerTooltip('Shipyard / Construction', 'Name of the company that built the ship'),
    headerTooltip('Value', 'the value of construction of the ship for purchase of company'),
    headerTooltip('Unit', 'Unit'),
    headerTooltip('Value', 'the value of the ship for first purchase of company'),
    headerTooltip('Unit', 'Unit'),
    headerTooltip('Value', 'the updated value of the ship for the current year'),
    headerTooltip('Unit', 'Unit'),
    headerTooltip('Year', 'Year of the formal revaluation of the vessel'),
    headerTooltip('Material of Construction', 'The material out of which the ship was built'),
    headerTooltip('Type', 'Piou'),
    headerTooltip('Unit', 'Unit'),
    headerTooltip('Value', 'Value'),
    headerTooltip('Value', 'Value'),
    headerTooltip('Unit', 'Unit'),
    headerTooltip('Value', 'Value'),
    headerTooltip('Unit', 'Unit'),
    headerTooltip('Value', 'Value'),
    headerTooltip('Unit', 'Unit'),
    headerTooltip('Sheathing of the Hull', 'material with which the hull is sheathed'),
    headerTooltip('Number of Decks', 'number of decks the ship has at documentation time'),
    headerTooltip('Number of Masts', 'number of masts the ship has at documentation time'),
    headerTooltip('Number of Engines', 'Number of engines of the ship during documentation time'),
    headerTooltip('Type of Engine', 'specific type of engine of the ship'),
    headerTooltip('Place of Engine Construction', 'place where the engine was built'),
    headerTooltip('Year of Engine Construction', 'year when the engine was built'),
    headerTooltip('Engine Manufacturer', 'The name of the company that built the engine'),
    headerTooltip('Year', 'Year'),
    headerTooltip('Place', 'Place'),
    headerTooltip('Nominal Power', 'nominal power of the engine expressed in horsepower'),
    headerTooltip('Indicated Power', 'indicated power of the engine expressed in horsepower'),
    headerTooltip('Value', 'Average speed of the ship expressed in Knots/hour'),
    headerTooltip('Unit', 'Unit'),
    headerTooltip('Name', 'The name of the ship’s captain at documentation time'),
    headerTooltip('Surname', 'The surname of the ship’s captain at documentation time'),
    headerTooltip('Number of the crew', 'Number of seagoing personnel settled for the ship at documentation time'),
    headerTooltip('1st Class', '1st Class'),
    headerTooltip('2nd Class', '2nd Class'),
    headerTooltip('3rd Class', '3rd Class'),
    headerTooltip('4th class', '4th class'),
    headerTooltip('Date of first launch', 'Date when the ship was originally launched'),
    headerTooltip('First Service date', 'first day of service with the company'),
    headerTooltip('Reason', 'Reason of end of service in the company e.g. sale, shipwreck'),
    headerTooltip('Last Service date', 'date of the end of the service with the company'),
    headerTooltip('Name', 'Name of the owner'),
    headerTooltip('Surname 1', 'Name of the owner'),
    headerTooltip('Surname 2', 'Name of the owner'),
    headerTooltip('Address', 'Address of the owner'),
    headerTooltip('Reconstruction', 'Reconstruction'),
    headerTooltip('Ownership', 'Ownership'),
    headerTooltip('Notes', 'notes of the person that did the transcription'),
    'Comment'
]);
tablesWithoutCommentCols.set(tableId, [6, 7, 8]); //define fieds that do not have external content


var courses_data = [
    {source_page_folio: ""}, {source_page_folio: ""}, {source_page_folio: ""}, {source_page_folio: ""}, {source_page_folio: ""}, {source_page_folio: ""},
    {source_page_folio: ""}, {source_page_folio: ""}, {source_page_folio: ""}, {source_page_folio: ""}, {source_page_folio: ""}, {source_page_folio: ""},
    {source_page_folio: ""}, {source_page_folio: ""}, {source_page_folio: ""}
];

var courses_cols = [
    {data: 'source_page_folio', type: 'text'},
    {data: 'year_of_documentation', type: 'text'},
    {data: 'call_signal', type: 'text'},
    {data: 'ship_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_in")), vocab: 'ship_name_in'},
    {data: 'previous_ship_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_in")), vocab: 'ship_name_in', renderer: groupRenderer},
    {data: 'ship_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_type_in")), vocab: 'ship_type_in'},
    {data: 'port_of_registry', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in'},
    
    {data: 'year_of_registry', type: 'text'},
    
    {data: 'type_of_navigation', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("navigation_type_in")), vocab: 'navigation_type_in'},
    {data: 'ship_organization', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_in")), vocab: 'organization_in'},
    {data: 'ship_number', type: 'text'},
    {data: 'place_of_constraction', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in'},
    {data: 'year_of_construction', type: 'text'},
    {data: 'shipyard_constructor', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_in")), vocab: 'organization_in'},
    {data: 'construction_value', type: 'text'},
    {data: 'construction_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_in")), vocab: 'unit_in'},
    {data: 'second_hand_purchase_value', type: 'text'},
    {data: 'second_hand_purchase_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_in")), vocab: 'unit_in'},
    {data: 'updated_value', type: 'text', renderer: groupRenderer},
    {data: 'updated_value_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_in")), vocab: 'unit_in', renderer: groupRenderer},
    {data: 'updated_value_year', type: 'text', renderer: groupRenderer},
    {data: 'material_of_construction', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("material_of_construction_in")), vocab: 'material_of_construction_in', renderer: groupRenderer},
    {data: 'tonnage_correct_type', type: 'dropdown',source:['Gross Tonnage', 'Net Tonnage','Register Tonnage']
        , renderer: groupRenderer},
    {data: 'tonnage_type', type: 'text', renderer: groupRenderer},
    {data: 'tonnage_value', type: 'text', renderer: groupRenderer},
    {data: 'length_value', type: 'text'},
    {data: 'length_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_in")), vocab: 'unit_in'},
    {data: 'width_value', type: 'text'},
    {data: 'width_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_in")), vocab: 'unit_in'},
    {data: 'depth_value', type: 'text'},
    {data: 'depth_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_in")), vocab: 'unit_in'},
    {data: 'sheating_of_hull', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("material_of_construction_in")), vocab: 'material_of_construction_in'},
    {data: 'number_of_decks', type: 'text'},
    {data: 'number_of_masts', type: 'text'},
    {data: 'number_of_engines', type: 'text'},
    {data: 'type_of_engine', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("type_of_engine_in")), vocab: 'type_of_engine_in'},
    {data: 'place_of_engine_construction', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in'},
    {data: 'year_of_engine_construction', type: 'text'},
    {data: 'engine_manufacturer', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_in")), vocab: 'organization_in'},
    {data: 'recostruction_year', type: 'text', renderer: groupRenderer},
    {data: 'recostruction_place', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in', renderer: groupRenderer},
    {data: 'nominant_power', type: 'text'},
    {data: 'indicated_power_power', type: 'text'},
    {data: 'speed_value', type: 'text'},
    {data: 'speed_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_in")), vocab: 'unit_in'},
    {data: 'captains_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in'},
    {data: 'captains_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_in")), vocab: 'surname_in'},
    {data: 'number_of_crew', type: 'text'},
    {data: 'number_of_1st_class', type: 'text'},
    {data: 'number_of_2nd_class', type: 'text'},
    {data: 'number_of_3nd_class', type: 'text'},
    {data: 'number_of_4th_class', type: 'text'},
    {data: 'date_of_first_launch', type: 'date'},
    {data: 'first_service_date', type: 'date'},
    {data: 'end_of_service_reason', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("reason_of_end_of_service_in")), vocab: 'reason_of_end_of_service_in'},
    {data: 'last_service_date', type: 'date'},
    {data: 'owner_name',type: 'text'},
      //  source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in'},
    {data: 'owner_surname',type: 'text'},
       // source: JSON.parse(localStorage.getItem("surname_in")), vocab: 'name_in'},
    {data: 'owner_surname_2',type: 'text'},
       // source: JSON.parse(localStorage.getItem("surname_in")), vocab: 'name_in'},
    {data: 'owner_address', type: 'text'},
    {data: 'reconstructions', type: 'text', renderer: buttonRenderer, readOnly: true},
    {data: 'ownerships', renderer: aggregadebuttonRenderer, readOnly: true},
    {data: 'notes', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];






function buttonRenderer(instance, td, row) {
    var title = instance.getDataAtCell(row, 3);
    if (title) {
        title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
    }
    td.innerHTML = "<a onclick='createNestedTable(" + row + "," + null + ",\"" + title + "\")'> <button id='Row_" + row + "' style='padding:2px; font-size:8px;' type='button' class=' nested_button btn btn-outline-secondary'>Nested table</button></a>";// + value;
    td.className = 'htCenter';
    return td;
}

function aggregadebuttonRenderer(instance, td, row) {
    var title = instance.getDataAtCell(row, 3);
    if (title) {
        title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
    }
    td.innerHTML = "<a onclick='showAggregadeList(" + row + "," + null + ",\"" + title + "\")'>  <button id='aggregade_button_" + row + "' style='padding:2px; font-size:8px;' type='button' class=' aggregade_nested btn btn-outline-secondary'>Nested table</button></a>";// + value;
    td.className = 'htCenter';
    return td;
}

var cont = document.getElementById(tableId);
var headers = [
    ['', '', '', '', '', '', {label: "        ", colspan: '2'}, '', {label: "                   ", colspan: '2'}, '', '', '', {label: "                     ", colspan: '2'}, {label: "                             ", colspan: '2'}, {label: "             ", colspan: '3'}, '                        ', {label: "       ", colspan: '3'}, {label: "Dimensions", colspan: '6'}, '', '', '', '', '', '', '', '', {label: "", colspan: '2'}, '', '', {label: "                ", colspan: '2'}, {label: "             ", colspan: '2'}, '', {label: '                  ', colspan: '4'}, '', '', {label: '              ', colspan: '2'},  {label: '              ', colspan: '4'},'', '', '', 'Comment'],
    ['', '', '', '', '', '', {label: "Registry", colspan: '2'}, '', {label: "Ship Classification", colspan: '2'}, '', '', '', {label: "Value of construction", colspan: '2'}, {label: "Value of purchase second hand", colspan: '2'}, {label: "Updated value", colspan: '3'}, 'Material of Construction', {label: "Tonnage", colspan: '3'}, {label: "Length", colspan: '2'}, {label: headerTooltip('Width', 'At widest point'), colspan: '2'}, {label: headerTooltip('Depth', 'keel to beam'), colspan: '2'}, '', '', '', '', '', '', '', '', {label: "Engine Reconstruction", colspan: '2'}, '', '', {label: "Velocity / Speed", colspan: '2'}, {label: "Captains'Name", colspan: '2'}, '', {label: 'Passenger Capacity', colspan: '4'}, '', '', {label: 'End of Service', colspan: '2'},{label: 'Owner', colspan: '4'}, '', '', '', 'Comment'],
    tablesAndHeaders.get(tableId)
];


var seafarers_registerGroups = [[4, 4], [18, 20], [21, 21], [22, 24], [39, 40]];
headers = markHeaders(headers, seafarers_registerGroups);
var courses_hot = new Handsontable(cont, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: courses_data,
    columns: courses_cols,
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
        if (col === 4) {
            groupLeftClicked(this, row, col);
        } else if (col > 17 && col < 21) {
            groupLeftClicked(this, row, col);
        } else if (col === 21) {
            groupLeftClicked(this, row, col);
        } else if (col > 21 && col < 25) {
            groupLeftClicked(this, row, col);
        } else if (col > 38 && col < 41) {
            groupLeftClicked(this, row, col);
        }
    }
});

courses_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(courses_cols[col].vocab);
            } else if (key === 'add') {
                var colClicked = courses_hot.getSelectedRange().to.col;
                var rowClicked = courses_hot.getSelectedRange().to.row;
                if (colClicked === 4) {
                    groupClicked("courses_list", "previous_names", rowClicked, 4, 4);
                } else if (colClicked > 17 && colClicked < 21) {
                    groupClicked("courses_list", "updated_values", rowClicked, 17, 20);
                } else if (colClicked === 21) {
                    groupClicked("courses_list", "construction_materials", rowClicked, 21, 21);
                } else if (colClicked > 21 && colClicked < 25) {
                    groupClicked("courses_list", "tonnages", rowClicked, 22, 24);
                } else if (colClicked > 38 && colClicked < 41) {
                    groupClicked("courses_list", "engine_reconstuctions", rowClicked, 39, 40);
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
            "add": {
                name: "Add table",
                hidden: function() {
                    return isAddTableMenuVisible(this, seafarers_registerGroups);

                }},
            "hsep5": "---------",
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function() {
                    var col = courses_hot.getSelectedRange().to.col;
                    var label = courses_cols[col].vocab;
                    if (label) {
                        update_Vocs();
                        return courses_hot.getSelectedRange().to.col !== col;
                    } else {
                        return courses_hot.getSelectedRange().to.col !== -1;
                    }
                }},
            "add10rows": {
                name: "Add 10 rows",
                disabled: function() {
                    return courses_hot.countRows() - 1 !== courses_hot.getSelected()[0];
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

var students_list = [];
var students_columns = [
    {data: 'shipyard_constructor', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_in")), vocab: 'organization_in'},
    {data: 'place', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in'},
    {data: 'year_of_construction', type: 'text'},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}
];



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

var students = new Object();
var ships_persons = new Object();
var pp = new Object();

var ships_json = new Object();

if (JSON.parse(localStorage.getItem("PERSONS"))) {
    ships_json = ships_json = (JSON.parse(localStorage.getItem("PERSONS")));
}

function createNestedTable(cnt, data, header) {

    //////// nested data from json ///////////////
    if (nested_tables) {
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
        } else {
            $('#Row_' + i).css({'background-color': '#dddddd'});
            $('#Row_' + i).css({'color': '#337ab7'});
        }
    });

    var plus = parseInt(cnt) + 1;
    var table_header = "";
    if (!((header == null) || (header == "null"))) {
        table_header = ' / Title of Course : ' + header;
    }

    var html = "<div  class='panel panel-default nested_table not_visible' style='border:transparent; margin-top:5px;'>" +
            "<div class='panel-heading' role='tab' id='heading" + cnt + "'>" +
            "<h4 class='panel-title'>" +
            "    <a style='background-color:#589AAF;' class='collapsed' role='button' onclick='close_nested(" + cnt + ")'  href='#collapse" + cnt + "'>" +
            "<span class='pull-right glyphicon glyphicon-remove'></span>" + "Reconstruction " + plus + table_header +
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
        } else {
            $("#Row_" + cnt).addClass('full_data');
            $("#Row_" + cnt).css("background-color", "#C4C4C4");
            $("#Row_" + cnt).css("color", "#1C6799");
        }




        var tableId = 'students_list' + cnt;
        tablesWithoutCommentCols.set(tableId, [15]); //define fieds that do not have external content
//        tablesAndHeaders.set('students_list', ['Shipyard / Constructor', 'Place', 'Year of Reconstruction', 'Note', 'Comment']);
        tablesAndHeaders.set('students_list', [
            headerTooltip('Shipyard / Constructor', 'Name of the company that built the ship'),
            headerTooltip('Place', 'place where the ship was built'),
            headerTooltip('Year of Reconstruction', 'The year the ship was reconstructed'),
            headerTooltip('Note', 'notes of the person that did the transcription'),
            'Comment'
        ]);
        var container = document.getElementById(tableId);




        var headers = [
            ['', '', '', '', 'Comment'],
            tablesAndHeaders.get('students_list')
        ];


        //var voyages_Groups = [[3, 4]];
        //headers = markHeaders(headers, voyages_Groups);

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
            /*afterSelectionEnd: function (row, col) {
             markGroups(this);
             if ((col > 2) && col < 5) {
             groupLeftClicked(this, row, col);
             }
             }*/
        });


        student_hot.updateSettings({
            contextMenu: {
                callback: function(key, options) {
                    if (key === 'edit_vocabulary') {
                        var col = options.start.col;
                        create_voc_modal(students_columns[col].vocab);
                    } /*else if (key === 'add') {
                     var colClicked = student_hot.getSelectedRange().to.col;
                     var rowClicked = student_hot.getSelectedRange().to.row;
                     if (colClicked > 2 && colClicked < 5) {
                     groupClicked("students_list" + cnt, "engine_reconstuctions", rowClicked, 3, 4);
                     }
                     }*/
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
                            return isAddTableMenuVisible(this, voyages_Groups);
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

    } else {
        if (!((header == null) || (header == "null"))) {
            $('#heading' + cnt).children().children().html('<span class="pull-right glyphicon glyphicon-remove"></span>Reconstruction ' + plus + ' / Title of Course : ' + header);
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
    {data: 'current_previous', type: 'dropdown',
        source: ['current', 'previous']},
    {data: 'name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_in")), vocab: 'organization_in'},
    {data: 'headqurter_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in'},
    {data: 'share_value', type: 'text'},
    {data: 'unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_in")), vocab: 'unit_in'},
    {data: 'date_of_purchase', type: 'date'},
    {data: 'value', type: 'text'},
    {data: 'unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_in")), vocab: 'unit_in'},
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
        } else {
            $('#aggregade_button_' + i).css({'background': '#dddddd'});
            $('#aggregade_button_' + i).css({'color': '#337ab7'});
        }
    });

    $('#aggregade_button_' + cnt).css({'background': '#638BC7'});
    $('#aggregade_button_' + cnt).css({'color': '#ffffff'});
    $('#insert2_here').hide();
}

function showAggregadeList(cnt, data, header) {

    //////// nested data from json ///////////////
    if (nested_tables_2) {
        if (nested_tables_2[cnt]) {
            data = nested_tables_2[cnt];
        }
    }

    $(".aggregade_nested_table").hide();
    $('#insert_here').hide();
    var parent = $('#aggregade_heading' + cnt).parent();
    $(parent).show();


    $.each($('.aggregade_nested'), function(i) {
        if ($("#aggregade_button_" + i).hasClass('full_data')) {
            $("#aggregade_button_" + i).css("background-color", "#C4C4C4");
            $("#aggregade_button_" + i).css("color", "#1C6799");
        } else {
            $('#aggregade_button_' + i).css({'background-color': '#dddddd'});
            $('#aggregade_button_' + i).css({'color': '#337ab7'});
        }

    });

    var plus = parseInt(cnt) + 1;
    var table_header = "";
    if (!((header == null) || (header == "null"))) {
        table_header = ' / Title of Course : ' + header;
    }

    var html = "<div  class='panel panel-default aggregade_nested_table not_visible' style='border:transparent; margin-top:5px;'>" +
            "<div class='panel-heading' role='tab' id='aggregade_heading" + cnt + "'>" +
            "<h4 class='panel-title'>" +
            "    <a style='background-color:#589AAF;' class='collapsed' role='button' onclick='close_aggregadeStaff(" + cnt + ")'  href='#collapse" + cnt + "'>" +
            "<span class='pull-right glyphicon glyphicon-remove'></span>" + "Ownership " + plus + table_header +
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
        } else {
            $("#aggregade_button_" + cnt).addClass('full_data');
            $("#aggregade_button_" + cnt).css("background-color", "#C4C4C4");
            $("#aggregade_button_" + cnt).css("color", "#1C6799");
            $('#insert2_here').hide();
        }

        var tableId = 'aggregade_personnel' + cnt;
        tablesWithoutCommentCols.set(tableId, []); //define fieds that do not have external content



//        tablesAndHeaders.set('aggregade_personnel', ['Current / Previous', 'Name', 'Headquarter Location', 'Value', 'Unit', 'Date of Purchase', 'Value', 'Unit', 'Note', 'Comment']);
        tablesAndHeaders.set('aggregade_personnel', [
            headerTooltip('Current / Previous', 'current=owner during documentation time/previous owner=owners that existed prior to the owner of documentation time'),
            headerTooltip('Name', 'The name of the company that owns the ship at documentation time'),
            headerTooltip('Headquarter Location', 'The headquarters location of the company that owns the ship '),
            headerTooltip('Value', 'Value of share of the specific ship owner'),
            headerTooltip('Unit', 'Unit in which the share was counted e.g. %'),
            headerTooltip('Date of Purchase', 'Date when the ship was purchased from the previous owner'),
            headerTooltip('Value', 'price of the ship paid to the previous owner'),
            headerTooltip('Unit', 'Unit'),
            headerTooltip('Note', 'notes of the person that did the transcription'),
            'Comment'
        ]);
        //  tablesAndHeaders.set('students_list', ['Shipyard / Constructor', 'Place', 'Year of Reconstruction', 'Year', 'Place', 'Note', 'Comment']);
        var container = document.getElementById(tableId);

        var headers = [
            ['', '', '', {label: 'Share', colspan: 2}, 'Date of Purchase', {label: '', colspan: 2}, '', 'Comment'],
            tablesAndHeaders.get('aggregade_personnel')
        ];



        var container = document.getElementById(tableId);
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
            //colHeaders: tablesAndHeaders.get('aggregade_personnel'),
            rowHeaders: true,
            nestedHeaders: headers
                    //[
                    //    tablesAndHeaders.get('aggregade_personnel')
                    //],
            ,
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
    } else {

        if (!((header == null) || (header == "null"))) {
            $('#aggregade_heading' + cnt).children().children().html('<span class="pull-right glyphicon glyphicon-remove"></span>Ownership ' + plus + ' / Title of Course : ' + header);
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
    var courses_list = createJson(courses_hot, courses_cols, usage);


    var json = new Object();

    var student_keys = Object.keys(students_list);
    var transactions = new Object();

    if (((usage === 'excel') && (nested_tables)) || ((mode === 'teamView') && (nested_tables))) {

        $.each(nested_tables, function(cnt) {
            var voyages_trans = new Array();
            $.each(this, function() {
                voyages_trans.push(this);
            });
            console.log('exporting nested table: ' + cnt);
            createNestedTable(cnt, voyages_trans);
            $(".nested_table").hide();
            transactions[cnt] = createJson((students_list[cnt]), students_columns, usage);
        });

        nested_tables = null;

    } else {
        transactions = nested_tables_object;
        for (var i = 0; i < student_keys.length; i++) {
            transactions[student_keys[i]] = createJson((students_list[student_keys[i]]), students_columns, usage);
        }
    }

    var subs = Object.keys(aggregade_personnels);
    var subjects = new Object();

    if (((usage === 'excel') && (nested_tables_2)) || ((mode === 'teamView') && (nested_tables_2))) {

        $.each(nested_tables_2, function(cnt) {

            var voyages_trans_2 = new Array();

            $.each(this, function() {
                voyages_trans_2.push(this);
            });
            console.log('exporting nested table 2: ' + cnt);
            showAggregadeList(cnt, voyages_trans_2);
            $(".aggregade_nested_table").hide();
            subjects[cnt] = createJson((aggregade_personnels[cnt]), aggregade_pressonnel_cols, usage);
        });

        nested_tables_2 = null;

    } else {
        subjects = nested_tables_2_object;
        for (var i = 0; i < subs.length; i++) {
            subjects[subs[i]] = createJson((aggregade_personnels[subs[i]]), aggregade_pressonnel_cols, usage);
        }
    }
    cat_info.date_until = getCurrentDate();
    catalogue_info.setDataAtCell(0, 2, getCurrentDate());
    json['record_information'] = cat_info;
    json['source_identity'] = source_id;
    json['list_of_ships'] = courses_list;
    //list_of_courses
    json['reconstructions'] = transactions;
    //list_of_students
    json['ownerships'] = subjects;
    //subjects



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
        /////////////////// courses_list

        terms = new Object();

        var students_persons = new Object();
        var students_tbl = new Object();
        var students_locs = new Object();
        var ship_obj = new Object();
        var ships_tbl = new Object();



        $.each(courses_list, function(row) {
         
            $.each(this, function(col) {
                var val = this.toString();
                $.each(courses_cols, function(col_no) {
                    if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                        var label = $(this).attr('vocab');
                        handle_json_vocs(val, label, row, col, col_no, 'list_of_ships', terms);
                    }
                });

                var row_data = this;
                if (col === 'captains_surname') {
                    handle_persons(row, 46, this.toString(), 'list_of_ships', [45, 46], ['name', 'surname_a'], students_persons, students_tbl, 'PERSONS');
                } else if (col === 'captains_name') {
                    handle_persons(row, 45, this.toString(), 'list_of_ships', [45, 46], ['name', 'surname_a'], students_persons, students_tbl, 'PERSONS');
                }else if (col === 'ship_organization') {
                    handle_multiple_table_instances(row, 9, this.toString(), 'list_of_ships', null, null, null, null, 'ORGS');
                }else if (col === 'shipyard_constructor') {
                    handle_multiple_table_instances(row+"_", 13, this.toString(), 'list_of_ships', null, null, null, null, 'ORGS');
                } else if (col === 'engine_manufacturer') {
                    handle_multiple_table_instances(row+"__", 36, this.toString(), 'list_of_ships', null, null, null, null, 'ORGS');
                }
                
                else if (col === 'owner_surname') {
                    handle_persons(row, 57, this.toString(), 'list_of_ships', [56,57,58], ['name', 'surname_a', 'surname_b'], students_persons, students_tbl, 'PERSONS');
                } else if (col === 'owner_name') {
                    handle_persons(row, 56, this.toString(), 'list_of_ships', [56,57,58], ['name', 'surname_a', 'surname_b'], students_persons, students_tbl, 'PERSONS');
                } else if (col === 'owner_surname_2') {
                    handle_persons(row, 58, this.toString(), 'list_of_ships', [56,57,58], ['name', 'surname_a', 'surname_b'], students_persons, students_tbl, 'PERSONS');
                }
                
               

                else if (col === 'ship_name') {
                   
                    handle_ships(row, 3, row_data, 'list_of_ships', [3,4 ,5, 2, 6, 9, 10, 11, 12], ['name','previous_name', 'type', 'call_signal', 'registration_location', 'owner_company', 'registration_number', 'construction_location', 'construction_date'], 'SHIPS', ship_obj, ships_tbl);
                }else if (col === 'previous_ship_name') {
                    handle_ships(row, 4, row_data, 'list_of_ships', [3,4 ,5, 2, 6, 9, 10, 11, 12], ['name','previous_name', 'type', 'call_signal', 'registration_location', 'owner_company', 'registration_number', 'construction_location', 'construction_date'], 'SHIPS', ship_obj, ships_tbl);
                } else if (col === 'ship_type') {
                    handle_ships(row, 5, row_data, 'list_of_ships', [3,4 ,5, 2, 6, 9, 10, 11, 12], ['name','previous_name', 'type', 'call_signal', 'registration_location', 'owner_company', 'registration_number', 'construction_location', 'construction_date'], 'SHIPS', ship_obj, ships_tbl);
                } else if (col === 'call_signal') {
                    handle_ships(row, 2, row_data, 'list_of_ships', [3,4 ,5, 2, 6, 9, 10, 11, 12], ['name','previous_name', 'type', 'call_signal', 'registration_location', 'owner_company', 'registration_number', 'construction_location', 'construction_date'], 'SHIPS', ship_obj, ships_tbl);
                } else if (col === 'port_of_registry') {
                    handle_multiple_table_instances(row, 6, this.toString(), 'list_of_ships', null, null, students_locs, null, 'LOCS');
                    handle_ships(row, 6, row_data, 'list_of_ships', [3,4 ,5, 2, 6, 9, 10, 11, 12], ['name','previous_name', 'type', 'call_signal', 'registration_location', 'owner_company', 'registration_number', 'construction_location', 'construction_date'], 'SHIPS', ship_obj, ships_tbl);
                } else if (col === 'ship_organization') {
                    handle_multiple_table_instances(row, 9, this.toString(), 'list_of_ships', null, null, null, null, 'ORGS');
                    handle_ships(row, 9, row_data, 'list_of_ships', [3,4 ,5, 2, 6, 9, 10, 11, 12], ['name','previous_name', 'type', 'call_signal', 'registration_location', 'owner_company', 'registration_number', 'construction_location', 'construction_date'], 'SHIPS', ship_obj, ships_tbl);
                } else if (col === 'ship_number') {
                    handle_ships(row, 10, row_data, 'list_of_ships', [3,4 ,5, 2, 6, 9, 10, 11, 12], ['name','previous_name', 'type', 'call_signal', 'registration_location', 'owner_company', 'registration_number', 'construction_location', 'construction_date'], 'SHIPS', ship_obj, ships_tbl);
                } else if (col === 'place_of_constraction') {
                    handle_multiple_table_instances(row, 16, this.toString(), 'list_of_ships', null, null, students_locs, null, 'LOCS');
                    handle_ships(row, 11, row_data, 'list_of_ships', [3,4 ,5, 2, 6, 9, 10, 11, 12], ['name','previous_name', 'type', 'call_signal', 'registration_location', 'owner_company', 'registration_number', 'construction_location', 'construction_date'], 'SHIPS', ship_obj, ships_tbl);
                } else if (col === 'year_of_construction') {
                    handle_ships(row, 12, row_data, 'list_of_ships', [3,4 ,5, 2, 6, 9, 10, 11, 12], ['name','previous_name', 'type', 'call_signal', 'registration_location', 'owner_company', 'registration_number', 'construction_location', 'construction_date'], 'SHIPS', ship_obj, ships_tbl);
                }

                else if (col === 'place_of_engine_construction') {
                    handle_multiple_table_instances(row, 36, this.toString(), 'list_of_ships', null, null, students_locs, null, 'LOCS');
                } else if (col === 'recostruction_place') {
                    handle_multiple_table_instances(row, 40, this.toString(), 'list_of_ships', null, null, students_locs, null, 'LOCS');
                }

            });
        });
        /////////////////////////////////////////////////////////////////////////          
        $.each(transactions, function(cnt) {

            var terms = new Object();
            var reconstruction_locs = new Object();

            console.log("----------handling nested table " + cnt + "--------------");
            $.each(this, function(row) {
                $.each(this, function(col) {
                    ///////////////////////////////////////////   
                    var value = this.toString();
                    $.each(students_columns, function(col_no) {
                        if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                            var label = $(this).attr('vocab');
                            handle_vocabulary(value, label, this);
                            handle_json_vocs(value, label, row, col, col_no, 'list_of_ships', terms);
                        }
                    });
                    /////////////////////////////////////                                
                    if (col === 'shipyard_constructor') {
                        handle_multiple_table_instances(row + '_', 0, value, 'reconstruction_' + cnt, null, null, null, null, 'ORGS');
                    } else if (col === 'place') {
                        handle_locations(value, 'reconstruction_' + cnt, row, 1, 'LOCS', reconstruction_locs);
                    } else if (col === 'recostruction_place') {
                        handle_locations(value, 'reconstruction_' + cnt, row, 4, 'LOCS', reconstruction_locs);
                    }
                });
            });
        });

        ////////////////////////////////////////////////////////////////////////////
        $.each(subjects, function(cnt) {
            var terms = new Object();
            var reconstruction_locs = new Object();
            console.log("----------handling nested 2  table " + cnt + "--------------");
            $.each(this, function(row) {
                $.each(this, function(col) {
                    ///////////////////////////////////////////   
                    var val = this;
                    $.each(aggregade_pressonnel_cols, function(col_no) {
                        if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                            var label = $(this).attr('vocab');
                            handle_vocabulary(val, label, this);
                            handle_json_vocs(val, label, row, col, col_no, 'subjects_list_' + cnt, terms);
                        }
                    });
                    if (col === 'name') {
                        handle_multiple_table_instances(row + '_', 1, val, 'ownership_' + cnt, null, null, null, null, 'ORGS');
                    } else if (col === 'headqurter_location') {
                        handle_locations(val, 'ownership_' + cnt, row, 2, 'LOCS', reconstruction_locs);
                    }
                });
            });
        });
        ////////////////////////////////////////////////////////////////////////////
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

var nested_tables_2 = new Object();
var nested_tables_2_object = new Object();


var record_status;

function load(data, status) {

    console.log(status);
    record_status = status;
    clear_LocalStorage_instances();

    catalogue_info.loadData(data.record_information);
    source_identity_data.loadData(data.source_identity);

    var courses_data = new Array();
    $.each(data.list_of_ships, function() {
        courses_data.push(this);
    });

    courses_hot.loadData(courses_data);

    $('.nested_table').remove();

    if (data.reconstructions) {

        nested_tables_object = data.reconstructions;

        $.each(data.reconstructions, function(cnt) {
            var students = new Array();
            $.each(this, function() {
                students.push(this);
            });

            if (mode === 'teamView') {
                nested_tables[cnt] = students;
            } else {
                nested_tables[cnt] = students;
                //createNestedTable(cnt, students);
                //$(".nested_table").hide();
            }
        });
    }


    if (data.ownerships) {

        nested_tables_2_object = data.ownerships;

        $.each(data.ownerships, function(cnt) {
            var subjects = new Array();
            $.each(this, function() {
                subjects.push(this);
            });

            if (mode === 'teamView') {
                nested_tables_2[cnt] = subjects;
            } else {
                nested_tables_2[cnt] = subjects;
                //showAggregadeList(cnt, subjects);
                //$(".aggregade_nested_table").hide();
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

    var student_list = new Array();
    $.each(json.reconstructions, function(cnt) {
        $.each(this, function() {
            student_list.push(Object.assign({}, (json.list_of_ships[cnt]), (this)));
        });
    });

    if (student_list.length < 1) {
        student_list.push('');
    }

    var subject_list = new Array();
    $.each(json.ownerships, function(cnt) {
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

    var opts = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Source Identity', header: false}, {sheetid: 'List of Ships', header: true}, {sheetid: 'Reconstructions', header: true}, {sheetid: 'Ownerships', header: true}];
    var res = alasql('SELECT * INTO XLSX("' + $('#unique_filename').text() + '.xlsx",?) FROM ?', [opts, sheets]);
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

        tables.push(catalogue_info, source_identity_data, courses_hot);
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
                old_val = courses_hot.getDataAtCell(this.row, this.col, value);
                courses_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id.indexOf("students_list") !== -1) {
                var cnt = table_id.replace("students_list", "");
                old_val = students_list[cnt].getDataAtCell(this.row, this.col, value);
                students_list[cnt].setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id.indexOf("aggregade_personnel") !== -1) {
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
        courses_hot.setDataAtCell(row, col, val);
    } else if (parentTable.indexOf("students_list") !== -1) {
        var cnt = parentTable.replace("students_list", "");
        students_list[cnt].setDataAtCell(row, col, val);
    }
}
;

////////////////////////////////////////////////////////////////////////////////
///////////////////////////EXPORT TO XML////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function create_xml_file() {

    var json = createRecordJson('excel');
    var temp = JSON.stringify(json);
    temp = temp.replace(/&nbsp;/g, "");
    json = JSON.parse(temp);

    var root = new Object();
    var tmp = new Object();

    tmp['record_information'] = oneRow_with_Groups(json.record_information, catalogue_infoGroups, cols1);
    tmp['record_information']['record_title'] = uniqueFilename;
    tmp['record_information']['related_organization'] = 'FORTH/IMS, T.I.G./University of Barcelona';
    tmp['record_information']['record_id'] = recordId;
    tmp['record_information']['template_type'] = templateTitle;
    tmp['source_identity'] = json.source_identity;
    tmp['source_identity']['source_language'] = 'Italian, Russian, Spanish';


    var tmp_list = simple_with_Groups(json.list_of_ships, seafarers_registerGroups, courses_cols); 
    var ship_list = new Object();
    $.each(tmp_list, function(k) {
        ship_list[k.replace("row_","")] = this;
    });

    tmp['list_of_ships'] = nested_with_Groups(json.reconstructions, ship_list/*json.list_of_ships*/, null, students_columns, 'reconstructions', 'shipp_');
    var sec_nested = nested_with_Groups(json.ownerships, json.list_of_ships, null, aggregade_pressonnel_cols, 'ownerships', 'shipp_');
    /// merge tow nested tables
    $.each(tmp['list_of_ships'], function(k) {
        tmp['list_of_ships'][k]['ownerships'] = sec_nested[k]['ownerships'];
    });

    root['root'] = tmp;

    var xml = formatXml(json2xml(root));

    console.log(root);

    xml = xml.replace(/<shipp_(\d+)>/g, '<ship index="$1">');
    xml = xml.replace(/<\/shipp_(\d+)>/g, "</ship>");

    xml = xml.replace(/<row_(\d+)>/g, '<row index="$1">');
    xml = xml.replace(/<\/row_(\d+)>/g, "</row>");

    xml = xml.replace(/<group_data_(\d+)>/g, '<group_data index="$1">');
    xml = xml.replace(/<\/group_data_(\d+)>/g, "</group_data>");

    return (xml);
}
;

