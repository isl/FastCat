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
        if (subTableName === "other_registrations") {
            var cols = [
                {data: 'other_folio_number', type: 'text'},
                {data: 'other_registration_number', type: 'text'},
                {data: 'other_register_title', type: 'text'},
                {data: 'other_register_year', type: 'text'},
                {data: 'other_registration_type', type: 'dropdown',
                    source: ['permanent registration', 'temporary registration']}
            ];
            nestedHeaders = [
                ['Folio Number', 'Registration Number', 'Register Title', 'Register Year', 'Type of Registration']
            ];
            data = setSubTableData(registered_persons_hot, row, startCol, endCol);
        } else if (subTableName === "other_related_persons") {
            var cols = [
                {data: 'other_related_person_relation_type', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("person_to_person_relation_fr")), vocab: 'person_to_person_relation_fr'},
                {data: 'other_related_person_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_fr")), vocab: 'name_fr'},
                {data: 'other_related_person_surname', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_fr")), vocab: 'surname_fr'}
            ];
            nestedHeaders = [
                ['Type', 'Name', 'Surname']
            ];
            data = setSubTableData(registered_persons_hot, row, startCol, endCol);
        } else if (subTableName === "physical_features") {
            var cols = [
                {data: 'physical_feature_type', type: 'dropdown',
                    source: ['hair', ' forehead', 'eye brown', 'eyes', 'nose', 'mouth', 'chin', 'face']},
                {data: 'physical_feature_description', type: 'text'}
            ];
            nestedHeaders = [
                ['Type', 'Description']
            ];
            data = setSubTableData(registered_persons_hot, row, startCol, endCol);
        } else if (subTableName === "permissions") {
            var cols = [
                {data: 'permission_reason', type: 'text'},
                {data: 'permission_date_from', type: 'date'},
                {data: 'permission_date_to', type: 'date'},
                {data: 'permission_destination', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'}
            ];
            nestedHeaders = [
                ['Reason', 'From', 'To', 'Destination']
            ];
            data = setSubTableData(registered_persons_hot, row, startCol, endCol);
        } else if (subTableName === "penalties") {
            var cols = [
                {data: 'penalty_type', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("type_of_penalty_fr")), vocab: 'type_of_penalty_fr'},
                {data: 'penalty_reason', type: 'text'},
                {data: 'date_of_judgment', type: 'date'},
                {data: 'date_of_ministerial_decision', type: 'date'},
                {data: 'duration_from', type: 'date'},
                {data: 'duration_to', type: 'date'}
            ];
            nestedHeaders = [
                ['Type of Penalty', 'Reason of Penalty', 'Date of judjment', 'Date of the ministerial decision', 'From', 'To']
            ];
            data = setSubTableData(registered_persons_hot, row, startCol, endCol);
        } else if (subTableName === "injuries") {
            var cols = [
                {data: 'type_of_injury_sickness', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("type_of_injury_sickness_fr")), vocab: 'type_of_injury_sickness_fr'},
                {data: 'injury_description', type: 'date'}
            ];
            nestedHeaders = [
                ['Type of Injury', 'Description']
            ];
            data = setSubTableData(registered_persons_hot, row, startCol, endCol);
        } else if (subTableName === "engine_reconstuctions") {
            var cnt = parentTableName.replace("students_list", "");
            var cols = [
                {data: 'recostruction_year', type: 'text'},
                {data: 'recostruction_place', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in'}
            ];
            nestedHeaders = [
                ['Year', 'Place']
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
//tablesAndHeaders.set(tableId, ['Name', 'Location', 'Series', 'Title of Register', 'Number of Register', 'From', 'To', 'From', 'To', 'Area of Coverage', 'Name', 'Location', 'Note', 'Comment']);
tablesAndHeaders.set(tableId, [
    headerTooltip('Name', 'Name'),
    headerTooltip('Location', 'Location'),
    headerTooltip('Series', 'eg. Matricule des gens de mer (Register of sailors'),
    headerTooltip('Title of Register', 'eg. Μatricules des capitaines (Register of captains)'),
    headerTooltip('Number of Register', 'specific code for the register'),
    headerTooltip('From', 'starting year of registrations'),
    headerTooltip('To', 'ending year of registrations'),
    headerTooltip('From', 'From'),
    headerTooltip('To', 'To'),
    headerTooltip('Area of Coverage', 'The location to which all inscribed persons where registered at documentation time'),
    headerTooltip('Name', 'Name'),
    headerTooltip('Location', 'Location'),
    headerTooltip('Note', 'Note of the person that does the transcription, in relation to the source identity information'),
    'Comment'
]);
tablesWithoutCommentCols.set(tableId, [0, 1, 2, 3, 4, 5, 6, 7, 10]); //define fieds that do not have external content


var sourcedata = [
    {archive_name: ''}
];
var source_identity_cols = [
    {data: 'archive_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("archive_or_library_fr")), vocab: 'archive_or_library_fr'},
    {data: 'archive_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'},
    {data: 'series', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("series_fr")), vocab: 'series_fr'},
    {data: 'title_of_register', type: 'text'},
    {data: 'number_register', type: 'text'},
    {data: 'register_from', type: 'text'},
    {data: 'register_to', type: 'text'},
    {data: 'number_of_register_from', type: 'text'},
    {data: 'number_of_register_to', type: 'text'},
    {data: 'area_of_coverage', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'},
    {data: 'issuing_authority_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("local_authority_fr")), vocab: 'local_authority_fr'},
    {data: 'issuing_authority_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'},
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
        [{label: '      ', colspan: 2}, '', {label: 'Register', colspan: 4}, {label: '', colspan: 2}, '', {label: '', colspan: 2}, '', ''],
        [{label: 'Archive', colspan: 2}, '', '', '', {label: headerTooltip('Date of Register', 'which years are covered by the content of the book'), colspan: 2}, {label: 'Number of Registries Included', colspan: 2}, '', {label: 'Issuing Authority', colspan: 2}, '', ''],
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
        if ((source_identity_cols[col].vocab === 'location_fr') && (value)) {
            handle_locations(value, 'source_identity', row, col, 'LOCS', source_locs);
        } else if (value && ((source_identity_cols[col].vocab === 'archive_or_library_fr'))) {
            handle_organizations(value, 'source_identity', row, col, 'ORGS');
        } else if (value && ((source_identity_cols[col].vocab === 'local_authority_fr'))) {
            handle_organizations(value, 'source_identity', row + "_", col, 'ORGS');
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
//tablesAndHeaders.set(tableId, ['Folio Number', 'Registration Number', 'Folio Number', 'Registration Number', 'Register Title', 'Register Year', 'Type of Registration', 'Type of Registration', 'Name', 'Surname', 'Name', 'Surname', 'Name', 'Surname', 'Date of Birth', 'Place of Birth', 'Place of Residence', 'Wedding Day', 'Type', 'Name', 'Surname', 'Height (meters)', 'Type', 'Description', 'Reason', 'From', 'To', 'Destination', 'Type of Act', 'Date', 'Rewards', 'Type of penalty', 'Reason of Penalty', 'Date of judgment', 'Date of the ministerial decision', 'From', 'To', 'Type of injury of sickness', 'Description', 'Type', 'Date', 'Place', 'Reason', 'Comment', 'Military Service', 'Service Analysis', 'Note', 'Comment']);
tablesAndHeaders.set(tableId, [
    headerTooltip('Folio Number', 'Folio Number'),
    headerTooltip('Registration Number', 'Registration Number'),
    headerTooltip('Folio Number', 'Folio Number'),
    headerTooltip('Registration Number', 'Registration Number'),
    headerTooltip('Register Title', 'Register Title'),
    headerTooltip('Register Year', 'Register Year'),
    headerTooltip('Type of Registration', 'fixed: permanent registration, temporary registration'),
    headerTooltip('Type of Registration', 'fixed: permanent registration, temporary registration'),
    headerTooltip('Name', 'Name of the person'),
    headerTooltip('Surname', 'Surname of the person'),
    headerTooltip('Name', 'Name of the persons father'),
    headerTooltip('Surname', 'Surname of the persons father'),
    headerTooltip('Name', 'Name of the persons mother'),
    headerTooltip('Surname', 'Surname of the persons mother'),
    headerTooltip('Date of Birth', 'Persons date of birth'),
    headerTooltip('Place of Birth', 'Persons place of birth'),
    headerTooltip('Place of Residence', 'Persons place of residence during documentation time'),
 //   headerTooltip('Wedding Day', 'Persons wedding day with the wife he was married at documentation time'),
    headerTooltip('Type', 'type of relation: brother, aunt etc.'),
    headerTooltip('Name', 'Name of the related person'),
    headerTooltip('Surname', 'Surname of related person'),
/*    headerTooltip('Height (meters)', 'Height (meters)'),
    headerTooltip('Type', 'Type of physical feature of person'),
    headerTooltip('Description', 'Description of the physical feature of the person'),
/*    headerTooltip('Reason', 'Reason'),
    headerTooltip('From', 'From'),
    headerTooltip('To', 'To'),
    headerTooltip('Destination', 'location where the individual took permission to go'),
 *//*   headerTooltip('Type of Act', 'Type of heroic act made by the person during military service'),
    headerTooltip('Date', 'Date that the heroic act happened'),
    headerTooltip('Rewards', 'e.g. silver medal, gold medal, honor'),
   */ headerTooltip('Type of penalty', 'Type of penalty'),
    headerTooltip('Reason of Penalty', 'Reason of Penalty'),
    headerTooltip('Date of judgment', 'Date of judgment'),
    headerTooltip('Date of the ministerial decision', 'Date of the ministerial decision'),
    headerTooltip('From', 'From'),
    headerTooltip('To', 'To'),
    headerTooltip('Type of injury of sickness', 'Type of injury of sickness'),
    headerTooltip('Description', 'Description'),
    headerTooltip('Type', 'e.g. death, cancelation, disappearance, loss, renunciation'),
    headerTooltip('Date', 'Date'),
    headerTooltip('Place', 'Place'),
    headerTooltip('Reason', 'Reason'),
    headerTooltip('Comment', 'Comment'),
   // headerTooltip('Military Service', 'Military Service'),
    headerTooltip('Service Analysis', 'Service Analysis'),
    headerTooltip('Note', 'Note by the person who does the transcription'),
    'Comment'
]);

tablesWithoutCommentCols.set(tableId, [6, 7, 8]); //define fieds that do not have external content


var courses_data = [
    {folio_number: ""}, {folio_number: ""}, {folio_number: ""}, {folio_number: ""}, {folio_number: ""}, {folio_number: ""},
    {folio_number: ""}, {folio_number: ""}, {folio_number: ""}, {folio_number: ""}, {folio_number: ""}, {folio_number: ""},
    {folio_number: ""}, {folio_number: ""}, {folio_number: ""}
];

var registered_persons_cols = [
    {data: 'folio_number', type: 'text'},
    {data: 'registration_number', type: 'text'},
    {data: 'other_folio_number', type: 'text', renderer: groupRenderer},
    {data: 'other_registration_number', type: 'text', renderer: groupRenderer},
    {data: 'other_register_title', type: 'text', renderer: groupRenderer},
    {data: 'other_register_year', type: 'text', renderer: groupRenderer},
    {data: 'other_registration_type', type: 'dropdown',
        source: ['permanent registration', 'temporary registration'], renderer: groupRenderer},
    {data: 'registration_type', type: 'dropdown',
        source: ['permanent registration', 'temporary registration']},
    {data: 'person_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_fr")), vocab: 'name_fr'},
    {data: 'person_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_fr")), vocab: 'surname_fr'},
    {data: 'fathers_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_fr")), vocab: 'name_fr'},
    {data: 'fathers_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_fr")), vocab: 'surname_fr'},
    {data: 'mothers_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_fr")), vocab: 'name_fr'},
    {data: 'mothers_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_fr")), vocab: 'surname_fr'},
    {data: 'date_of_birth', type: 'date'},
    {data: 'place_of_birth', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'},
    {data: 'place_of_residence', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'},
  //  {data: 'wedding_day', type: 'date'},
    {data: 'other_related_person_relation_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("person_to_person_relation_fr")), vocab: 'person_to_person_relation_fr', renderer: groupRenderer},
    {data: 'other_related_person_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_fr")), vocab: 'name_fr', renderer: groupRenderer},
    {data: 'other_related_person_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_fr")), vocab: 'surname_fr', renderer: groupRenderer},
  /*  {data: 'height', type: 'text'},
    {data: 'physical_feature_type', type: 'dropdown',
        source: ['hair', ' forehead', 'eye brown', 'eyes', 'nose', 'mouth', 'chin', 'face'], renderer: groupRenderer},
    {data: 'physical_feature_description', type: 'text', renderer: groupRenderer},
  /*  {data: 'permission_reason', type: 'text', renderer: groupRenderer},
    {data: 'permission_date_from', type: 'date', renderer: groupRenderer},
    {data: 'permission_date_to', type: 'date', renderer: groupRenderer},
    {data: 'permission_destination', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr', renderer: groupRenderer},
  */ /* {data: 'heroic_act_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("type_of_heroic_act_fr")), vocab: 'type_of_heroic_act_fr'},
    {data: 'heroic_act_date', type: 'date'},
    {data: 'heroic_act_reward', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("reward_fr")), vocab: 'reward_fr'},
   */ {data: 'penalty_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("type_of_penalty_fr")), vocab: 'type_of_penalty_fr', renderer: groupRenderer},
    {data: 'penalty_reason', type: 'text', renderer: groupRenderer},
    {data: 'date_of_judgment', type: 'date', renderer: groupRenderer},
    {data: 'date_of_ministerial_decision', type: 'date', renderer: groupRenderer},
    {data: 'duration_from', type: 'date', renderer: groupRenderer},
    {data: 'duration_to', type: 'date', renderer: groupRenderer},
    {data: 'type_of_injury_sickness', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("type_of_injury_sickness_fr")), vocab: 'type_of_injury_sickness_fr', renderer: groupRenderer},
    {data: 'injury_description', type: 'date', renderer: groupRenderer},
    {data: 'end_of_service_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("type_of_end_of_service_fr")), vocab: 'type_of_end_of_service_fr'},
    {data: 'end_of_service_date', type: 'date'},
    {data: 'end_of_service_place', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'},
    {data: 'end_of_service_reason', type: 'text'},
    {data: 'end_of_service_comment', renderer: textRender, readOnly: true, type: 'text'},
  //  {data: 'military_services', type: 'text', renderer: buttonRenderer, readOnly: true},
    {data: 'service_analysis', renderer: aggregadebuttonRenderer, readOnly: true},
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
    ['', '', {label: "", colspan: '5'}, '', {label: "Person Identity", colspan: '12'},/* {label: "Permissions", colspan: '4'}, {label: "", colspan: '3'},*/ {label: "Penalties", colspan: '6'}, {label: "", colspan: '2'}, {label: "", colspan: '5'}, /*'',*/ '', ''],
    ['', '', {label: "Other Registration", colspan: '5'}, '', '', '', {label: "Father", colspan: '2'}, {label: "Mother", colspan: '2'}, '', '', '', /*'',*/ {label: "Other related Persons", colspan: '3'}, /*'', {label: "Physical Features", colspan: '2'}, /*'', {label: "Date", colspan: '2'}, 'Destination', /*{label: "Heroic Acts", colspan: '3'},*/ {label: "", colspan: '4'}, {label: "Date", colspan: '2'}, {label: "Injuries / Sicknesses", colspan: '2'}, {label: "End of Service", colspan: '5'}, '', /*'',*/ ''],
    tablesAndHeaders.get(tableId)
];


var seafarers_registerGroups = [[2, 6], [17, 19],/* [22, 23], /*[24, 27],*/ [20, 25], [26, 27]];
headers = markHeaders(headers, seafarers_registerGroups);
var registered_persons_hot = new Handsontable(cont, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: courses_data,
    columns: registered_persons_cols,
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
        if (col > 1 && col < 7) {
            groupLeftClicked(this, row, col);
        } else if (col > 16 && col < 20) {
            groupLeftClicked(this, row, col);
        } /*else if (col > 21 && col < 24) {
            groupLeftClicked(this, row, col);
        }/* else if (col > 23 && col < 28) {
            groupLeftClicked(this, row, col);
        } */else if (col > 19 && col < 26) {
            groupLeftClicked(this, row, col);
        } else if (col > 25 && col < 28) {
            groupLeftClicked(this, row, col);
        } 
         
    }
});

registered_persons_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(registered_persons_cols[col].vocab);
            } else if (key === 'add') {
                var colClicked = registered_persons_hot.getSelectedRange().to.col;
                var rowClicked = registered_persons_hot.getSelectedRange().to.row;
                if (colClicked > 1 && colClicked < 7) {
                    groupClicked("courses_list", "other_registrations", rowClicked, 2, 6);
                } else if (colClicked > 16 && colClicked < 20) {
                    groupClicked("courses_list", "other_related_persons", rowClicked, 17, 19);
                }/* else if (colClicked > 21 && colClicked < 24) {
                    groupClicked("courses_list", "physical_features", rowClicked, 22, 23);
                }/* else if (colClicked > 23 && colClicked < 28) {
                    groupClicked("courses_list", "permissions", rowClicked, 24, 27);
                }*/ else if (colClicked > 19 && colClicked < 26) {
                    groupClicked("courses_list", "penalties", rowClicked, 20, 25);
                } else if (colClicked > 25 && colClicked < 28) {
                    groupClicked("courses_list", "injuries", rowClicked, 26, 27);
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
                    var col = registered_persons_hot.getSelectedRange().to.col;
                    var label = registered_persons_cols[col].vocab;
                    if (label) {
                        update_Vocs();
                        return registered_persons_hot.getSelectedRange().to.col !== col;
                    } else {
                        return registered_persons_hot.getSelectedRange().to.col !== -1;
                    }
                }},
            "add10rows": {
                name: "Add 10 rows",
                disabled: function() {
                    return registered_persons_hot.countRows() - 1 !== registered_persons_hot.getSelected()[0];
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
    {data: 'registration_number', type: 'text'},
    {data: 'recruitment_year', type: 'text'},
    {data: 'administrative_devision', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'},
    {data: 'changed_aministrative_division_date', type: 'date'},
    {data: 'changed_aministrative_division_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'},
    {data: 'nomination_date', type: 'date'},
    {data: 'ship_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_fr")), vocab: 'ship_name_fr'},
    {data: 'embarkation_date', type: 'date'},
    {data: 'disembarkation_date', type: 'date'},
    {data: 'call_to_arms', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_fr")), vocab: 'organization_fr'},
    {data: 'desertion_date', type: 'date'},
    {data: 'desertion_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'},
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
            "<span class='pull-right glyphicon glyphicon-remove'></span>" + "Military Service " + plus + table_header +
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
//        tablesAndHeaders.set('students_list', ['Registration Number', 'Recruitment Year', 'Administrative division', 'Date', 'Location', 'Nomination Date', 'Ship Name', 'Embarkation Date', 'Disembarkation Date', 'Call to Arms', 'Date', 'Location', 'Note', 'Comment']);
        tablesAndHeaders.set('students_list', [
            headerTooltip('Registration Number', 'Number of registration in military service book'),
            headerTooltip('Recruitment Year', 'the year that the person joined the army'),
            headerTooltip('Administrative division', 'the administrative division to which the person was registered for military service'),
            headerTooltip('Date', 'Date'),
            headerTooltip('Location', 'Location'),
            headerTooltip('Nomination Date', 'The date of the appointment of the individual in the specific maritime corps –captains, sailors etc.'),
            headerTooltip('Ship Name', 'The name of the ship in which the person did his military service'),
            headerTooltip('Embarkation Date', 'Embarkation Date'),
            headerTooltip('Disembarkation Date', 'Disembarkation Date'),
            headerTooltip('Call to Arms', 'engagement in military body'),
            headerTooltip('Date', 'Date'),
            headerTooltip('Location', 'Location'),
            headerTooltip('Note', 'Note by the person who does the transcription'),
            'Comment'
        ]);

        var container = document.getElementById(tableId);




        var headers = [
            ['', '', '', {label: 'Change of Administrative Division', colspan: 2}, '', {label: 'Service on Ship', colspan: 3}, '', {label: 'Desertion', colspan: 2}, '', ''],
            tablesAndHeaders.get('students_list')
        ];


        var voyages_Groups = [[3, 4]];
        headers = markHeaders(headers, voyages_Groups);

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
                if ((col > 2) && col < 5) {
                    groupLeftClicked(this, row, col);
                }
            }
        });


        student_hot.updateSettings({
            contextMenu: {
                callback: function(key, options) {
                    if (key === 'edit_vocabulary') {
                        var col = options.start.col;
                        create_voc_modal(students_columns[col].vocab);
                    } else if (key === 'add') {
                        var colClicked = student_hot.getSelectedRange().to.col;
                        var rowClicked = student_hot.getSelectedRange().to.row;
                        if (colClicked > 2 && colClicked < 5) {
                            groupClicked("students_list" + cnt, "engine_reconstuctions", rowClicked, 3, 4);
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
            $('#heading' + cnt).children().children().html('<span class="pull-right glyphicon glyphicon-remove"></span>Military Service ' + plus + ' / Title of Course : ' + header);
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
    {data: 'service_sector', type: 'dropdown',
        source: ['government', 'commerce', 'fishing', 'interior navigation']},
    {data: 'profession', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_fr")), vocab: 'status_capacity_role_fr'},
    {data: 'months', type: 'text'},
    {data: 'days', type: 'text'},
    {data: 'start_of_service', type: 'date'},
    {data: 'end_of_service', type: 'date'},
    {data: 'embarkation_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'},
    {data: 'disembarkation_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'},
    {data: 'ship_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_fr")), vocab: 'ship_name_fr'},
    {data: 'ship_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_type_fr")), vocab: 'ship_type_fr'},
    {data: 'horse_power', type: 'text'},
    {data: 'navigation_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("type_of_navigation_fr")), vocab: 'type_of_navigation_fr'},
    {data: 'captains_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_fr")), vocab: 'name_fr'},
    {data: 'captains_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_fr")), vocab: 'surname_fr'},
    {data: 'patrons_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_fr")), vocab: 'name_fr'},
    {data: 'patrons_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_fr")), vocab: 'surname_fr'},
    {data: 'port_of_charge', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'},
    {data: 'number_of_charge', type: 'text'},
    {data: 'port_of_discharge', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'},
    {data: 'number_of_discharge', type: 'text'},
    {data: 'port_of_destination', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'},
  /*  {data: 'company_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_fr")), vocab: 'organization_fr'},
    {data: 'company_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("type_of_organization_fr")), vocab: 'type_of_organization_fr'},
    {data: 'person_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_fr")), vocab: 'name_fr'},
    {data: 'person_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_fr")), vocab: 'surname_fr'},
    {data: 'construction_permission', type: 'date'},
   */ 
    {data: 'previous_registration_type', type: 'dropdown',
        source: ['permanent registration', 'temporary registration']},
    {data: 'previous_navigation_type', type: 'dropdown',
        source: ['state', 'commerce', 'fishing']},
    {data: 'previous_registration_months', type: 'text'},
    {data: 'previous_registration_dates', type: 'text'},
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
            "<span class='pull-right glyphicon glyphicon-remove'></span>" + "Service analysis-Career " + plus + table_header +
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



//        tablesAndHeaders.set('aggregade_personnel', ['Service Sector', 'Profession', 'Months', 'Days', 'Start of Service', 'End of Service', 'Embarkation Location', 'Disembarkation Location', 'Name', 'Type', 'Horsepower', 'Navigation Type', 'Name', 'Surname', 'Name', 'Surname', 'Port of Charge', 'No of Charge', 'Port of Charge', 'No of Charge', 'Port of Destination', 'Name', 'Type', 'Name', 'Surname', 'Construction Permission Date', 'Note', 'Comment']);
        tablesAndHeaders.set('aggregade_personnel', [
            headerTooltip('Service Sector', 'The sectors at which the registered person has worked'),
            headerTooltip('Profession', 'Profession'),
            headerTooltip('Months', 'Months'),
            headerTooltip('Days', 'Days'),
            headerTooltip('Start of Service', 'Start of Service'),
            headerTooltip('End of Service', 'End of Service'),
            headerTooltip('Embarkation Location', 'Embarkation Location'),
            headerTooltip('Disembarkation Location', 'Disembarkation Location'),
            headerTooltip('Name', 'Name'),
            headerTooltip('Type', 'Type'),
            headerTooltip('Horsepower', 'Horsepower'),
            headerTooltip('Navigation Type', 'Navigation Type'),
            headerTooltip('Name', 'Name'),
            headerTooltip('Surname', 'Surname'),
            headerTooltip('Name', 'Name'),
            headerTooltip('Surname', 'Surname'),
            headerTooltip('Port of Charge', 'Port of Charge'),
            headerTooltip('No of Charge', 'No of Charge'),
            headerTooltip('Port of Charge', 'Port of Charge'),
            headerTooltip('No of Charge', 'No of Charge'),
            headerTooltip('Port of Destination', 'Port of Destination'),
          /*  headerTooltip('Name', 'Name'),
            headerTooltip('Type', 'Type'),
            headerTooltip('Name', 'Name'),
            headerTooltip('Surname', 'Surname'),
            headerTooltip('Construction Permission Date', 'Date of Permission of construction of a ship, in case there is a profession of shipbuilder'),
           */ 
            headerTooltip('Registration Type', 'Registration Type'),
            headerTooltip('Navigation Type', 'Navigation Type'),
            headerTooltip('Months', 'Months'),
            headerTooltip('Dates', 'Dates'),
             
            headerTooltip('Note', 'Note by the person who does the transcription'),
            'Comment'
        ]);
        //  tablesAndHeaders.set('students_list', ['Shipyard / Constructor', 'Place', 'Year of Reconstruction', 'Year', 'Place', 'Note', 'Comment']);
        var container = document.getElementById(tableId);

        var headers = [
            ['', '', {label: '', colspan: 2}, '', '', '', '', {label: 'Related Ship', colspan: 13}, {label: 'Previous registration', colspan: 4}, '', '', ''],
            ['', '', {label: 'Duration of Service ', colspan: 2}, '', '', '', '', '', '', '', '', {label: 'Captain', colspan: 2}, {label: headerTooltip('Patron', 'In case of fishing the person in charge of the ship'), colspan: 2}, {label: 'Charge of Equipment', colspan: 2}, {label: 'Disharge of Equipment', colspan: 2}, '', /*{label: 'Company', colspan: 2}, {label: 'Person', colspan: 2}, '', */'','',{label: 'Duration of Service', colspan: 2},'', ''],
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
            $('#aggregade_heading' + cnt).children().children().html('<span class="pull-right glyphicon glyphicon-remove"></span>Service Analysis-Career ' + plus + ' / Title of Course : ' + header);
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
    var courses_list = createJson(registered_persons_hot, registered_persons_cols, usage);


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
    json['list_of_registered_persons'] = courses_list;
    //list_of_registered_persons

    json['military_services'] = transactions;
    //military_services
    json['service_analysis'] = subjects;
    //service_analysis
    //  console.log(json)



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
        var payroll_persons = new Object();
        var payroll_tbl = new Object();
        var registered_locs = new Object();

        $.each(courses_list, function(row) {
            var row_data = this;
            $.each(this, function(col) {
                var val = this.toString();
                $.each(registered_persons_cols, function(col_no) {
                    if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                        var label = $(this).attr('vocab');
                        handle_json_vocs(val, label, row, col, col_no, 'list_of_registered_persons', terms);
                    }
                });
                if (col === 'person_surname') {
                    handle_persons(row, 9, row_data['person_surname'], 'list_of_registered_persons', [8, 9, 1, 10], ['name', 'surname_a', 'registration_number', 'fathers_name'], payroll_persons, payroll_tbl, 'PERSONS');
                    if (row_data['person_name']) {
                        handle_persons(row, 8, row_data['person_name'], 'list_of_registered_persons', [8, 9, 1, 10], ['name', 'surname_a', 'registration_number', 'fathers_name'], payroll_persons, payroll_tbl, 'PERSONS');
                    }
                    if (row_data['fathers_name']) {
                        handle_persons(row, 10, row_data['fathers_name'], 'list_of_registered_persons', [8, 9, 1, 10], ['name', 'surname_a', 'registration_number', 'fathers_name'], payroll_persons, payroll_tbl, 'PERSONS');
                    }
                    if (row_data['registration_number']) {
                        handle_persons(row, 1, row_data['registration_number'], 'list_of_registered_persons', [8, 9, 1, 10], ['name', 'surname_a', 'registration_number', 'fathers_name'], payroll_persons, payroll_tbl, 'PERSONS');
                    }
                }
                if (col === 'fathers_surname') {
                    handle_persons(row + "_", 11, row_data['fathers_surname'], 'list_of_registered_persons', [10, 11], ['name', 'surname_a'], payroll_persons, payroll_tbl, 'PERSONS');
                    if (row_data['fathers_name']) {
                        handle_persons(row + "_", 10, row_data['fathers_name'], 'list_of_registered_persons', [10, 11], ['name', 'surname_a'], payroll_persons, payroll_tbl, 'PERSONS');
                    }
                }
                if (col === 'mothers_surname') {
                    handle_persons(row + "__", 13, row_data['mothers_surname'], 'list_of_registered_persons', [12, 13], ['name', 'surname_a'], payroll_persons, payroll_tbl, 'PERSONS');
                    if (row_data['mothers_name']) {
                        handle_persons(row + "__", 12, row_data['mothers_name'], 'list_of_registered_persons', [12, 13], ['name', 'surname_a'], payroll_persons, payroll_tbl, 'PERSONS');
                    }
                }
                if (col === 'other_related_person_surname') {
                    handle_multiple_table_instances(row + "___", 20, row_data['other_related_person_surname'], 'list_of_registered_persons', [19, 20], ['name', 'surname_a'], payroll_persons, payroll_tbl, 'PERSONS');
                    if (row_data['other_related_person_name']) {
                        handle_persons(row + "___", 19, row_data['other_related_person_name'], 'list_of_registered_persons', [19, 20], ['name', 'surname_a'], payroll_persons, payroll_tbl, 'PERSONS');
                    }
                }
                else if (col === 'place_of_birth') {
                    handle_multiple_table_instances(row, 15, this.toString(), 'list_of_registered_persons', null, null, registered_locs, null, 'LOCS');
                } else if (col === 'place_of_residence') {
                    handle_multiple_table_instances(row, 16, this.toString(), 'list_of_registered_persons', null, null, registered_locs, null, 'LOCS');
                }/* else if (col === 'permission_destination') {
                    handle_multiple_table_instances(row, 27, this.toString(), 'list_of_registered_persons', null, null, registered_locs, null, 'LOCS');
                } */else if (col === 'end_of_service_place') {
                    handle_multiple_table_instances(row, 30, this.toString(), 'list_of_registered_persons', null, null, registered_locs, null, 'LOCS');
                }
            });
        });
        /////////////////////////////////////////////////////////////////////////  

        $.each(transactions, function(cnt) {
            var ship_obj = new Object();
            var ships_tbl = new Object();
            var students_locs = new Object();

            var terms = new Object();
            console.log("----------handling nested table " + cnt + "--------------");
            $.each(this, function(row) {
                $.each(this, function(col) {
                    ///////////////////////////////////////////   
                    var value = this.toString();
                    $.each(students_columns, function(col_no) {
                        if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                            var label = $(this).attr('vocab');
                            handle_vocabulary(value, label, this);
                            handle_json_vocs(value, label, row, col, col_no, 'military_sevice_' + cnt, terms);
                        }
                    });
                    /////////////////////////////////////                                                                            
                /*    if (col === 'administrative_devision') {
                        handle_multiple_table_instances(row, 2, this.toString(), 'military_service_' + cnt, null, null, students_locs, null, 'LOCS');
                    } else if (col === 'changed_aministrative_division_location') {
                        handle_multiple_table_instances(row, 4, this.toString(), 'military_service_' + cnt, null, null, students_locs, null, 'LOCS');
                    } else if (col === 'desertion_location') {
                        handle_multiple_table_instances(row, 11, this.toString(), 'military_service_' + cnt, null, null, students_locs, null, 'LOCS');
                    } else if (col === 'ship_name') {
                        handle_ships(row, 6, this.toString(), 'military_service_' + cnt, [6], ['name'], 'SHIPS', ship_obj, ships_tbl);
                    }*/
                });
            });
        });



        ////////////////////////////////////////////////////////////////////////////


        $.each(subjects, function(cnt) {
            var service_locs = new Object();
            var service_persons = new Object();
            var service_tbl = new Object();
            var ship_obj = new Object();
            var ships_tbl = new Object();



            var terms = new Object();
            console.log("----------handling nested 2  table " + cnt + "--------------");
            $.each(this, function(row) {
                var row_data = this;
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

                    var value = this.toString();


                    if ((col === 'captains_surname') && value) {
                        if ((row_data['captains_name'])) {
                            handle_multiple_table_instances(row, 12, row_data['captains_name'], 'service_analysis_career_' + cnt, [12, 13], ['name', 'surname_a'], service_persons, service_tbl, 'PERSONS');
                        }
                        if ((row_data['captains_surname'])) {
                            handle_multiple_table_instances(row, 13, row_data['captains_surname'], 'service_analysis_career_' + cnt, [12, 13], ['name', 'surname_a'], service_persons, service_tbl, 'PERSONS');
                        }
                    } else if ((col === 'patrons_surname') && value) {
                        if ((row_data['patrons_name'])) {
                            handle_multiple_table_instances(row + '_', 14, row_data['patrons_name'], 'service_analysis_career_' + cnt, [14, 15], ['name', 'surname_a'], service_persons, service_tbl, 'PERSONS');
                        }
                        if ((row_data['patrons_surname'])) {
                            handle_multiple_table_instances(row + '_', 15, row_data['patrons_surname'], 'service_analysis_career_' + cnt, [14, 15], ['name', 'surname_a'], service_persons, service_tbl, 'PERSONS');
                        }
                    } else if ((col === 'person_surname') && value) {
                        if ((row_data['person_name'])) {
                            handle_multiple_table_instances(row + '__', 23, row_data['person_name'], 'service_analysis_career_' + cnt, [23, 24], ['name', 'surname_a'], service_persons, service_tbl, 'PERSONS');
                        }
                        if ((row_data['person_surname'])) {
                            handle_multiple_table_instances(row + '__', 24, row_data['person_surname'], 'service_analysis_career_' + cnt, [23, 24], ['name', 'surname_a'], service_persons, service_tbl, 'PERSONS');
                        }
                    }


                    else if (col === 'embarkation_location') {
                        handle_locations(this.toString(), 'service_analysis_career_' + cnt, row, 6, 'LOCS', service_locs);
                    } else if (col === 'disembarkation_location') {
                        handle_locations(this.toString(), 'service_analysis_career_' + cnt, row, 7, 'LOCS', service_locs);
                    } else if (col === 'port_of_charge') {
                        handle_locations(this.toString(), 'service_analysis_career_' + cnt, row, 16, 'LOCS', service_locs);
                    } else if (col === 'port_of_discharge') {
                        handle_locations(this.toString(), 'service_analysis_career_' + cnt, row, 18, 'LOCS', service_locs);
                    } else if (col === 'port_of_destination') {
                        handle_locations(this.toString(), 'service_analysis_career_' + cnt, row, 20, 'LOCS', service_locs);
                    }

                    else if (col === 'company_name') {
                        handle_multiple_table_instances(row + '_', 21, this.toString(), 'service_analysis_career_' + cnt, null, null, null, null, 'ORGS');
                    }

                    else if (col === 'ship_name') {
                        handle_ships(row, 8, this.toString(), 'service_analysis_career_' + cnt, [8, 9], ['name', 'type'], 'SHIPS', ship_obj, ships_tbl);
                    } else if (col === 'ship_type') {
                        handle_ships(row, 9, this.toString(), 'service_analysis_career_' + cnt, [8, 9], ['name', 'type'], 'SHIPS', ship_obj, ships_tbl);
                    }

                });
            });
        });
        ////////////////////////////////////////////////////////////////////////////
    }

    update_Vocs();
    //console.log(terms_json);
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

    
    record_status = status;
    clear_LocalStorage_instances();

    catalogue_info.loadData(data.record_information);
    source_identity_data.loadData(data.source_identity);

    var courses_data = new Array();
    $.each(data.list_of_registered_persons, function() {
        courses_data.push(this);
    });

    registered_persons_hot.loadData(courses_data);

    $('.nested_table').remove();

    if (data.military_services) {

        nested_tables_object = data.military_services;

        $.each(data.military_services, function(cnt) {
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


    if (data.service_analysis) {

        nested_tables_2_object = data.service_analysis;

        $.each(data.service_analysis, function(cnt) {
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
    $.each(json.military_services, function(cnt) {
        $.each(this, function() {
            student_list.push(Object.assign({}, (json.list_of_registered_persons[cnt]), (this)));
        });
    });

    if (student_list.length < 1) {
        student_list.push('');
    }

    var subject_list = new Array();
    $.each(json.service_analysis, function(cnt) {
        $.each(this, function() {
            subject_list.push(Object.assign({}, (json.list_of_registered_persons[cnt]), (this)));
        });
    });

    if (subject_list.length < 1) {
        subject_list.push('');
    }

    var sheets = new Array();
    sheets.push([json.record_information]);
    sheets.push([json.source_identity]);
    sheets.push(json.list_of_registered_persons);
    sheets.push(student_list);
    sheets.push(subject_list);

    var opts = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Source Identity', header: false}, {sheetid: 'List of Courses', header: true}, {sheetid: 'Military_services', header: true}, {sheetid: 'Service-analysis_Careers', header: true}];
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

        tables.push(catalogue_info, source_identity_data, registered_persons_hot);
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
                old_val = registered_persons_hot.getDataAtCell(this.row, this.col, value);
                registered_persons_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
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
        registered_persons_hot.setDataAtCell(row, col, val);
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
    tmp['record_information']['related_organization'] = 'FORTH/IMS';
    tmp['record_information']['record_id'] = recordId;
    tmp['record_information']['template_type'] = templateTitle;
    tmp['source_identity'] = json.source_identity;
    tmp['source_identity']['source_language'] = 'Italian';

    tmp['list_of_registered_persons'] = nested_with_Groups(json.military_services, json.list_of_registered_persons, null, students_columns, 'military_services', 'registered_person_');
    var sec_nested = nested_with_Groups(json.service_analysis, json.list_of_registered_persons, null, aggregade_pressonnel_cols, 'service_analysis', 'registered_person_');
    /// merge tow nested tables
    $.each(tmp['list_of_registered_persons'], function(k) {
        tmp['list_of_registered_persons'][k]['service_analysis'] = sec_nested[k]['service_analysis'];
    });

    root['root'] = tmp;
    console.log(root)
    var xml = formatXml(json2xml(root));

    console.log(root);

    xml = xml.replace(/<registered_person_(\d+)>/g, '<registered_person index="$1">');
    xml = xml.replace(/<\/registered_person_(\d+)>/g, "</registered_person>");

    xml = xml.replace(/<row_(\d+)>/g, '<row index="$1">');
    xml = xml.replace(/<\/row_(\d+)>/g, "</row>");

    xml = xml.replace(/<group_data_(\d+)>/g, '<group_data index="$1">');
    xml = xml.replace(/<\/group_data_(\d+)>/g, "</group_data>");

    return (xml);
}
;

