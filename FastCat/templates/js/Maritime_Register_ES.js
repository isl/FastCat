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
        if (subTableName === "promotions") {
            var cols = [
                {data: 'promotion_start_date', type: 'text'},
                {data: 'promotion_status', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_capacity_role_es")), vocab: 'status_capacity_role_es'}
            ];
            nestedHeaders = [['Date', 'Status']];
            data = setSubTableData(maritime_personnel_hot, row, startCol, endCol);

        } else if (subTableName === "penalties") {
            var cols = [
                {data: 'penalty_date', type: 'text'},
                {data: 'penalty_reason', type: 'text'},
                {data: 'penalty_type', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("type_of_penalty_es")), vocab: 'type_of_penalty_es'},
                {data: 'penalty_value', type: 'text'},
                {data: 'penalty_unit', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("unit_es")), vocab: 'unit_es'}
            ];
            nestedHeaders = [
                ['Date', 'Reason', 'Type of Penalty', 'Value', 'Unit']
            ];
            data = setSubTableData(maritime_personnel_hot, row, startCol, endCol);
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
//tablesAndHeaders.set(tableId, ['Source Type Name', 'Name', 'Location', 'Title', 'Number', 'Fond Title', 'Book Number *', 'Document Title', 'Publication Date *', 'Name', 'Location', 'Note', 'Comment']);
tablesAndHeaders.set(tableId, [
    headerTooltip('Source Type Name', 'The type of source e.g. Sailors Register or Maritime inscription'),
    headerTooltip('Name', 'name of the organization where the original source was kept during the time of transcription. Can be Archive, Library, Museum, Online library etc'),
    headerTooltip('Location', 'The Location of the organization where the source was kept during the time of transcription'),
    headerTooltip('Title', 'The title of the Folder that contains the source'),
    headerTooltip('Number', 'The number of the Folder that contains the source'),
    headerTooltip('Fond Title', 'The title of the fond'),
    headerTooltip('Book Number *', 'Number of the source book'),
    headerTooltip('Document Title', 'Title of the newspaper or other publication'),
    headerTooltip('Publication Date *', 'The date that the source was published'),
    headerTooltip('Name', 'name of the issuing authority that published the original source'),
    headerTooltip('Location', 'The place where the issuing authority was located'),
    headerTooltip('Note', 'Note about the source identity made by the person who does the transcription. In English because this field cannot be later translated'),
    'Comment'
]);


tablesWithoutCommentCols.set(tableId, [0, 1, 2, 3, 4, 5, 6, 7, 12]); //define fieds that do not have external content

var sourcedata = [
    {source_type_name: ''}
];
var source_identity_cols = [
    {data: 'source_type_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("source_type_title_es")), vocab: 'source_type_title_es'},
    {data: 'holder_organization_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("archive_or_library_es")), vocab: 'archive_or_library_es'},
    {data: 'holder_organization_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'folder_title', type: 'text'},
    {data: 'folder_number', type: 'text'},
    {data: 'fond_title', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("fond_title_es")), vocab: 'fond_title_es'},
    {data: 'book_number', type: 'text'},
    {data: 'document_title', type: 'text'},
    {data: 'publication_date', type: 'date'},
    {data: 'issuing_authority_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("local_authority_es")), vocab: 'local_authority_es'},
    {data: 'issuing_authority_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
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
        ['', {label: 'Holder Organization', colspan: '2'}, {label: 'Folder', colspan: '2'}, '', '', '', '', {label: 'Issuing Authority', colspan: '2'}, '', ''],
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

//////////////////////////////   3rd TABLE     ////////////////////////////////
/////////////////////////////////SHIP LIST/////////////////////////////////////
var tableId = "courses_list";

//tablesAndHeaders.set(tableId, ['Source Page', 'Name', 'Surname 1', 'Surname 2', 'Father Name', 'Mother Name', 'Location', 'Date', 'Place of Residence', 'Location of Regional Organization for military service', 'Date', 'Folio Number', 'Priority Number', 'Marital Status', 'Previous Profession', 'Start Date', 'Date', 'Status', 'Date', 'Reason', 'Type of Penalty', 'Value', 'Unit', 'End Date', 'Trascription from Source', 'Note', 'Comment']);
tablesAndHeaders.set(tableId, [
    headerTooltip('Source Page', 'The page of the source where the specific person was registered'),
    headerTooltip('Name', 'The name of the registered person'),
    headerTooltip('Surname 1', 'The first surname name of the registered person'),
    headerTooltip('Surname 2', 'The second surname name of the registered person'),
    headerTooltip('Father Name', 'The name of the father of the registered person'),
    headerTooltip('Mother Name', 'The name of the mother of the registered person'),
    headerTooltip('Location', 'The place of birth of the registered person'),
    headerTooltip('Date', 'The date of birth of the registered person'),
    headerTooltip('Location', 'The location of residence of the registered person at documentation time'),
    
    headerTooltip('Address', 'The address of residence of the registered person at documentation time'),
    headerTooltip('Street', 'The street of residence of the registered person at documentation time'),
    headerTooltip('Number', 'The number of residence of the registered person at documentation time'),
    headerTooltip('Floor', 'The floor of residence of the registered person at documentation time'),
    headerTooltip('Door', 'The door of residence of the registered person at documentation time'),
    
    headerTooltip('Location of Regional Organization for military service', 'the location of the regional organization where the registered person had done (or was about to do) its military service'),
    headerTooltip('Date', 'The date when the registered person was inscribed to the military service'),
    headerTooltip('Folio Number', 'The folio number of the book of inscriptions of the military service where the registered person was inscribed'),
    headerTooltip('Priority Number', 'Order number established in the source, it refers to the priority to be incorpored to the military service'),
    headerTooltip('Marital Status', 'The marital status of the registered person'),
    headerTooltip('Previous Profession', 'The previous profession of the registered person'),
    headerTooltip('Start Date', 'The first date of military service of the registered person'),
    headerTooltip('Date', 'The date of promotion of the registered person'),
    headerTooltip('Status', 'The new status of the registered persons profession'),
    headerTooltip('Date', 'The date of penalty of the registered person'),
    headerTooltip('Reason', 'The reason of penalty of the registered person'),
    headerTooltip('Type of Penalty', 'e.g. prison, loss of status'),
    headerTooltip('Value', 'The quantity of the duration of the penalty'),
    headerTooltip('Unit', 'e.g. hours, days, months'),
    headerTooltip('End Date', 'The last date of military service of the registered person'),
    headerTooltip('Trascription from Source', 'This is a transcribed part of the source without any additions of the person who does the transcription) We will change the Note field name into “Transcription from source” because  big text'),
    headerTooltip('Note', 'Note about the specific inscription, made by the person who does the transcription. In English because this field cannot be later translated'),
    'Comment'
]);

tablesWithoutCommentCols.set(tableId, [9, 22, 23, 24]); //define fieds that do not have external content

var ships_data = [
    {source_page: ""}, {source_page: ""}, {source_page: ""}, {source_page: ""}, {source_page: ""}, {source_page: ""},
    {source_page: ""}, {source_page: ""}, {source_page: ""}, {source_page: ""}, {source_page: ""}, {source_page: ""}, {source_page: ""}, {source_page: ""}, {source_page: ""}
];

var ships_cols = [
    {data: 'source_page', type: 'text'},
    {data: 'name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es'},
    {data: 'surname_a', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
    {data: 'surname_b', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
    {data: 'fathers_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es'},
    {data: 'mothers_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es'},
    {data: 'birth_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'birth_date', type: 'date'},
    {data: 'residence_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    
    {data: 'residence_address', type: 'text'},
    {data: 'residence_street', type: 'text'},
    {data: 'residence_number', type: 'text'},
    {data: 'residence_floor', type: 'text'},
    {data: 'residence_door', type: 'text'},
    
    
    {data: 'military_service_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'military_service_date', type: 'date'},
    {data: 'military_service_folio', type: 'text'},
    {data: 'priority_number', type: 'text'},
    {data: 'marital_status', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("marital_status_es")), vocab: 'marital_status_es'},
    {data: 'previous_profession', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_es")), vocab: 'status_capacity_role_es'},
    {data: 'military_service_start_date', type: 'text'},
    {data: 'promotion_start_date', type: 'date', renderer: groupRenderer},
    {data: 'promotion_status', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_es")), vocab: 'status_capacity_role_es', renderer: groupRenderer},
    {data: 'penalty_date', type: 'date', renderer: groupRenderer},
    {data: 'penalty_reason', type: 'text', renderer: groupRenderer},
    {data: 'penalty_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("type_of_penalty_es")), vocab: 'type_of_penalty_es', renderer: groupRenderer},
    {data: 'penalty_value', type: 'text', renderer: groupRenderer},
    {data: 'penalty_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_es")), vocab: 'unit_es', renderer: groupRenderer},
    {data: 'penalty_end_date', type: 'date'},
    {data: 'transcription_from_source', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];

var cont = document.getElementById(tableId);
var headers = [
    ['', '', '', '', '', '', {label: '', colspan: '2'}, {label: '', colspan: '6'}, '', {label: '', colspan: '2'}, '', '', '', {label: 'Military Service', colspan: '9'}, '', '', ''],
    ['', '', '', '', '', '', {label: '', colspan: '2'},  {label: '', colspan: '6'}, '', {label: '', colspan: '2'}, '', '', '', '', {label: '', colspan: '2'}, {label: 'Penalty', colspan: '5'}, '', '', '', ''],
    ['', '', '', '', '', '', {label: 'Birth', colspan: '2'}, {label: 'Place of Residence', colspan: '6'}, '', {label: 'Inscription to the organization of military service', colspan: '2'}, '', '', '', '', {label: 'Promotion', colspan: '2'}, '', '', '', {label: 'Duration of Penalty', colspan: '2'}, '', '', '', ''],
    tablesAndHeaders.get(tableId)
];

var courses_listGroups = [[21, 22], [23, 27]];
headers = markHeaders(headers, courses_listGroups);
var ship_locs = new Object();
var maritime_persons = new Object();
var maritime_persons_tbl = new Object();

var maritime_personnel_hot = new Handsontable(cont, {
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
        if (col > 20 && col < 23) {
            groupLeftClicked(this, row, col);
        } else if (col > 22 && col < 28) {
            groupLeftClicked(this, row, col);
        }
    }
});

maritime_personnel_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(ships_cols[col].vocab);
            } else if (key === 'add') {
                var colClicked = maritime_personnel_hot.getSelectedRange().to.col;
                var rowClicked = maritime_personnel_hot.getSelectedRange().to.row;
                if (colClicked > 20 && colClicked < 23) {
                    groupClicked('courses_list', "promotions", rowClicked, 21, 22);
                } else if (colClicked > 22 && colClicked < 28) {
                    groupClicked('courses_list', "penalties", rowClicked, 23, 27);
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
                    return maritime_personnel_hot.countRows() - 1 !== maritime_personnel_hot.getSelected()[0];
                },
                callback: function() {
                    this.alter('insert_row', this.getSelected()[0] + 1, 10);
                }
            },
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function() {
                    var col = maritime_personnel_hot.getSelectedRange().to.col;
                    var label = ships_cols[col].vocab;
                    if (label) {
                        update_Vocs();
                        return maritime_personnel_hot.getSelectedRange().to.col !== col;
                    } else {
                        return maritime_personnel_hot.getSelectedRange().to.col !== -1;
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


//////////////////////////EXPORT IMPORT////////////////////////////////

function createRecordJson(usage) {

    var cat_info = createJson(catalogue_info, cols1, usage);
    var source_id = createJson(source_identity_data, source_identity_cols, usage);
    var courses_list = createJson(maritime_personnel_hot, ships_cols, usage);

    var json = new Object();

    cat_info.date_until = getCurrentDate();
    catalogue_info.setDataAtCell(0, 2, getCurrentDate());
    json['record_information'] = cat_info;
    json['source_identity'] = source_id;
    json['maritime_personnel'] = courses_list;


    if (record_status === 'Public') {

        ///////////////SOURCE identity
        var terms = new Object();
        $.each(source_id, function(col) {
            var val = this.toString();
            $.each(source_identity_cols, function(col_no) {
                if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                    var label = $(this).attr('vocab');
                    console.log(val)
                    handle_json_vocs(val, label, 0, col, col_no, 'source_identity', terms);
                }
            });
        });

        var crew_list_persons = new Object();
        var crew_list_tbl = new Object();
        var crew_list_locs = new Object();

        terms = new Object();
        $.each(courses_list, function(row) {
            var row_data = this;
            console.log('------- handling row ' + row + ' -----------');
            $.each(this, function(col) {
                var val = this.toString();
                $.each(ships_cols, function(col_no) {
                    if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                        var label = $(this).attr('vocab');
                        handle_json_vocs(val, label, 0, col, col_no, 'register_of_maritime_personnel', terms);
                    }
                });
                ///////////////////////
                if (col === 'surname_a') {
                    if (row_data['name']) {
                        handle_multiple_table_instances(row + '_', 1, row_data['name'], 'register_of_maritime_personnel', [1, 2, 3, 4, 7], ['name', 'surname_a', 'surname_b', 'fathers_name',  'date_of_birth'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                    if (row_data['surname_a']) {
                        handle_multiple_table_instances(row + '_', 2, row_data['surname_a'], 'register_of_maritime_personnel', [1, 2, 3, 4, 7], ['name', 'surname_a', 'surname_b', 'fathers_name',   'date_of_birth'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                    if (row_data['surname_b']) {
                        handle_multiple_table_instances(row + '_', 3, row_data['surname_b'], 'register_of_maritime_personnel', [1, 2, 3, 4, 7], ['name', 'surname_a', 'surname_b', 'fathers_name',   'date_of_birth'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                    if (row_data['fathers_name']) {
                        handle_multiple_table_instances(row + '_', 4, row_data['fathers_name'], 'register_of_maritime_personnel', [1, 2, 3, 4, 7], ['name', 'surname_a', 'surname_b', 'fathers_name',  'date_of_birth'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                    
                    /*if (row_data['birth_location']) {
                        handle_multiple_table_instances(row + '_', 6, row_data['birth_location'], 'register_of_maritime_personnel', [1, 2, 3, 4, 6, 7], ['name', 'surname_a', 'surname_b', 'fathers_name',  'place_of_birth', 'date_of_birth'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }*/
                    if (row_data['birth_date']) {
                        handle_multiple_table_instances(row + '_', 7, row_data['birth_date'], 'register_of_maritime_personnel', [1, 2, 3, 4,7], ['name', 'surname_a', 'surname_b', 'fathers_name',  'date_of_birth'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                } else if (col === 'fathers_name') {
                    if (row_data['fathers_name']) {
                        handle_multiple_table_instances(row + '__', 4, row_data['fathers_name'], 'register_of_maritime_personnel', [4, 2], ['name', 'surname_a'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                    if (row_data['surname_a']) {
                        handle_multiple_table_instances(row + '__', 2, row_data['surname_a'], 'register_of_maritime_personnel', [4, 2], ['name', 'surname_a'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                } else if (col === 'mothers_name') {
                    if (row_data['mothers_name']) {
                        handle_multiple_table_instances(row + '___', 5, row_data['mothers_name'], 'register_of_maritime_personnel', [5, 3], ['name', 'surname_a'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                    if (row_data['surname_b']) {
                        handle_multiple_table_instances(row + '___', 3, row_data['surname_b'], 'register_of_maritime_personnel', [5, 3], ['name', 'surname_a'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                }
                else if (col === 'birth_location') {
                    handle_multiple_table_instances(row, 6, this.toString(), 'register_of_maritime_personnel', null, null, crew_list_locs, null, 'LOCS');
                } else if (col === 'residence_location') {
                    handle_multiple_table_instances(row, 8, this.toString(), 'register_of_maritime_personnel', null, null, crew_list_locs, null, 'LOCS');
                } else if (col === 'military_service_location') {
                    handle_multiple_table_instances(row, 14, this.toString(), 'register_of_maritime_personnel', null, null, crew_list_locs, null, 'LOCS');
                }
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
var url = new URL(window.location.href);
var mode = url.searchParams.get("mode");
var record_status;

function load(data, status) {

    console.log(status);
    record_status = status;
    clear_LocalStorage_instances();

    catalogue_info.loadData(data.record_information);
    source_identity_data.loadData(data.source_identity);

    var ships_data = new Array();
    $.each(data.maritime_personnel, function() {
        ships_data.push(this);
    });

    maritime_personnel_hot.loadData(ships_data);


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

    var sheets = new Array();
    sheets.push([json.record_information]);
    sheets.push([json.source_identity]);
    sheets.push(json.maritime_personnel);

    var groupTables = createMultipleTables(json['maritime_personnel'], courses_listGroups, ships_cols);
    var result = createExcelSheetsData(sheets, groupTables);

    var opts = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Source Identity', header: false}, {sheetid: 'Register of Maritime Personnel', header: true}];
    var res = alasql('SELECT * INTO XLSX("' + $('#unique_filename').text() + '.xlsx",?) FROM ?', [opts, result]);
});

////////////////////////////////////////////////////////////////////////////////


//////////////////Update Vocabularies on pouch DB

function update_Vocs() {

    if (mode === null) {//only update vocabularies in edit mode

        var tables = [];

        tables.push(catalogue_info, source_identity_data, maritime_personnel_hot);
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
                old_val = maritime_personnel_hot.getDataAtCell(this.row, this.col, value);
                maritime_personnel_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
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
        maritime_personnel_hot.setDataAtCell(row, col, val);
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
    tmp['record_information']['related_organization'] = 'University of Barcelona';
    tmp['record_information']['record_id'] = recordId;
    tmp['record_information']['template_type'] = templateTitle;
    tmp['source_identity'] = json.source_identity;
    tmp['source_identity']['source_language'] = 'Spanish';

    tmp['maritime_personel_register'] = simple_with_Groups(json.maritime_personnel, courses_listGroups, ships_cols);



    root['root'] = tmp;
    console.log(root);
    var xml = formatXml(json2xml(root));



    xml = xml.replace(/<row_(\d+)>/g, '<row index="$1">');
    xml = xml.replace(/<\/row_(\d+)>/g, "</row>");

    xml = xml.replace(/<group_data_(\d+)>/g, '<group_data index="$1">');
    xml = xml.replace(/<\/group_data_(\d+)>/g, "</group_data>");


    return (xml);
}
;

