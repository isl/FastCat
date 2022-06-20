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
        if (subTableName === "family_members") {
            var cols = [
                {data: 'family_member_type', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("person_to_person_relation_fr")), vocab: 'person_to_person_relation_fr'},
                {data: 'family_member_quantity', type: 'text'}
            ];
            nestedHeaders = [
                ['Type', 'Quantity']
            ];
            data = setSubTableData(analytic_workers_hot, row, startCol, endCol);

        } else if (subTableName === "staff_sex") {
            var cols = [
                {data: 'actual_staff_type', type: 'dropdown', source: ['female', 'male']},
                {data: 'actual_staff_quantity', type: 'text'}
            ];
            nestedHeaders = [
                ['Type', 'Quantity']
            ];
            data = setSubTableData(workers_hot, row, startCol, endCol);
        } else if (subTableName === "working_status") {
            var cols = [
                {data: 'working_status_type', type: 'dropdown', source: ['worker', 'apprentice']},
                {data: 'working_status_quantity', type: 'text'}
            ];
            nestedHeaders = [
                ['Type', 'Quantity']
            ];
            data = setSubTableData(workers_hot, row, startCol, endCol);
        } else if (subTableName.indexOf("family_company_members") !== -1) {
            var cnt = parentTableName.replace("students_list", "");
            var cols = [
                {data: 'family_member_type', type: 'text'},
                {data: 'family_member_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_fr")), vocab: 'name_fr'},
                {data: 'family_member_surname', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_fr")), vocab: 'surname_fr'},
                {data: 'family_member_registration_number', type: 'text'}
            ];
            nestedHeaders = [
                ['Type', 'Name', 'Surname', 'Registration Number']
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
//tablesAndHeaders.set(tableId, ['Name', 'Location', 'Series', 'Title of Book *', 'From *', 'To *', 'From *', 'To *', 'Name', 'Location', 'Note', 'Comment']);
tablesAndHeaders.set(tableId, [
    headerTooltip('Name', 'e.g. Musee Ciotaden'),
    headerTooltip('Location', 'e.g. La Ciotat'),
    headerTooltip('Series', 'e.g. Chantiers Navals des Messageries Imperiales de la Ciotat: les archives du Bureau du Personnel'),
    headerTooltip('Title of Book *', 'e.g. Matricule No 6P'),
    headerTooltip('From *', 'starting year of registrations'),
    headerTooltip('To *', 'ending year of registrations'),
    headerTooltip('From *', 'e.g. No 18287'),
    headerTooltip('To *', 'e.g. 22730'),
    headerTooltip('Name', 'e.g. Compagnie de Messageries Imperiales / Compagnie des Messageries Maritimes'),
    headerTooltip('Location', 'Location'),
    headerTooltip('Note', 'Note of the person that does the transcription, in relation to the source identity information'),
    'Comment'
]);

tablesWithoutCommentCols.set(tableId, [0, 1, 3, 7]); //define fieds that do not have external content

var sourcedata = [{ship_name: ''}];

var source_identity_cols = [
    {data: 'archive_library', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("archive_or_library_fr")), vocab: 'archive_or_library_fr'},
    {data: 'source_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'},
    {data: 'series', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("series_fr")), vocab: 'series_fr'},
    {data: 'book_title', type: 'text'},
    {data: 'book_date_from', type: 'text'},
    {data: 'book_date_to', type: 'text'},
    {data: 'included_registries_from', type: 'text'},
    {data: 'included_registries_to', type: 'text'},
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
        [{label: '', colspan: 2}, '', {label: 'Book', colspan: 3}, {label: '', colspan: 2}, {label: '', colspan: 2}, ''],
        [{label: 'Archive', colspan: 2}, '', '', {label: headerTooltip('Date of Book', 'which years are covered by the content of the book'), colspan: 2}, {label: 'Number of Registries Included', colspan: 2}, {label: 'Issuing Authority', colspan: 2}, ''],
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
        } else if (((source_identity_cols[col].vocab === 'archive_or_library_fr')) && value) {
            handle_organizations(value, 'source_identity', row, col, 'ORGS');
        } else if (((source_identity_cols[col].vocab === 'local_authority_fr')) && value) {
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


//////////////////////////////   3nd TABLE     ////////////////////////////////
///////////////////////OVERALL WORKER///////////////////////////////       


var tableId = "maritime_workers";
//tablesAndHeaders.set(tableId, ['Month', 'Year', 'Staff of Previous Month', 'Exits', 'Total Quantity', 'Type', 'Quantity', 'Type', 'Quantity', 'Note', 'Comment']);
tablesAndHeaders.set(tableId, [
    headerTooltip('Month', 'Month of documentation of the following information'),
    headerTooltip('Year', 'Year of documentation of the following information'),
    headerTooltip('Day', 'Day of documentation of the following information'),
    headerTooltip('Staff of Previous Month', 'Last month report counting’s of the total number of staff'),
    headerTooltip('Exits', 'the total number of workers that stopped working for the company during this month'),
    headerTooltip('Total Quantity', 'total of workers in the end of the month with subtraction of the worker exits'),
    headerTooltip('Type', 'Sex of the workers: female, male'),
    headerTooltip('Quantity', 'total of workers in the end of the month with the specific sex'),
    headerTooltip('Type', 'Working status of the workers: worker, apprentice'),
    headerTooltip('Quantity', 'total of workers in the end of the month with the specific working status'),
    headerTooltip('Note', 'Note of the person that does the transcription, in relation to the source identity information'),
    'Comment'
]);

tablesWithoutCommentCols.set(tableId, [0, 1, 5, 6, 7, 8]); //define fieds that do not have external content

var workers_data = [
    {date_month: ''}, {date_month: ''}, {date_month: ''}, {date_month: ''}, {date_month: ''}, {date_month: ''}, {date_month: ''},
    {date_month: ''}, {date_month: ''}, {date_month: ''}, {date_month: ''}, {date_month: ''}, {date_month: ''}
];

var workers_cols = [
    {data: 'date_month', type: 'text'},
    {data: 'date_year', type: 'text'},
    {data: 'date_day', type: 'text'},
    {data: 'staff_of_previous_month', type: 'text'},
    {data: 'exits', type: 'text'},
    {data: 'actual_staff_total_quantity', type: 'text'},
    {data: 'actual_staff_type', type: 'dropdown', source: ['female', 'male'], renderer: groupRenderer},
    {data: 'actual_staff_quantity', type: 'text', renderer: groupRenderer},
    {data: 'working_status_type', type: 'dropdown', source: ['worker', 'apprentice'], renderer: groupRenderer},
    {data: 'working_status_quantity', type: 'text', renderer: groupRenderer},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}
];

var headers = [
    [{label: '', colspan: 3}, '', '', {label: 'Actual Staff', colspan: 5}, , ''],
    [{label: headerTooltip('Date', 'Month of documentation of the following information'), colspan: 3}, '', '', '', {label: 'Sex', colspan: 2}, {label: 'Working Status', colspan: 2}, '', ''],
    tablesAndHeaders.get(tableId)
];


var overall_worker_listGroups = [[6, 7], [8, 9]];
headers = markHeaders(headers, overall_worker_listGroups);

var source_container = document.getElementById(tableId);
var workers_hot = new Handsontable(source_container, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: workers_data,
    columns: workers_cols,
    manualColumnResize: true,
    currentRowClassName: 'currentRow',
    className: "htCenter htMiddle",
    autoWrapRow: true,
    contextMenu: false,
    colHeaders: tablesAndHeaders.get(tableId),
    nestedHeaders: headers,
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
        if (col > 5 && col < 8) {
            groupLeftClicked(this, row, col);
        } else if (col > 7 && col < 10) {
            groupLeftClicked(this, row, col);
        }
    }
});

workers_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(workers_cols[col].vocab);
            } else if (key === 'add') {
                var colClicked = workers_hot.getSelectedRange().to.col;
                var rowClicked = workers_hot.getSelectedRange().to.row;
                if (colClicked > 5 && colClicked < 8) {
                    groupClicked('maritime_workers', "staff_sex", rowClicked, 6, 7);
                } else if (colClicked > 7 && colClicked < 10) {
                    groupClicked('maritime_workers', "working_status", rowClicked, 8, 9);
                }
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
                    var col = workers_hot.getSelectedRange().to.col;
                    var label = workers_cols[col].vocab;
                    if (label) {
                        update_Vocs();
                        return workers_hot.getSelectedRange().to.col !== col;
                    } else {
                        return workers_hot.getSelectedRange().to.col !== -1;
                    }
                }},
            "hsep4": "---------",
            "add": {
                name: "Add table",
                hidden: function() {
                    return isAddTableMenuVisible(this, overall_worker_listGroups);

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


//////////////////////////////   3rd TABLE     ////////////////////////////////
/////////////////////////////////SHIP LIST/////////////////////////////////////
var tableId = "analytic_worker_list";

//tablesAndHeaders.set(tableId, ['Source Page', 'Surname', 'Name', 'Sex', 'Age', 'Date of Birth', 'Place of Birth', 'Place of Residence', 'Marital Status', 'Total number of family members', 'Type', 'Quantity', 'Date of Child"s Birth', 'Date of Acquisition', 'Ordinance Date', 'Type', 'Date', 'Date of Death', 'Trascription from Source', 'Service in Company', 'Previous Employments', 'Note', 'Comment']);
tablesAndHeaders.set(tableId, [
    headerTooltip('Source Page', 'Source page where this registration is found in the original source'),
    headerTooltip('Surname', 'Surname of worker'),
    headerTooltip('Name', 'Name of worker'),
    headerTooltip('Sex', 'sex of worker'),
    headerTooltip('Age', 'Age of worker during documentation time'),
    headerTooltip('Date of Birth', 'Date of birth of worker'),
    headerTooltip('Place of Birth', 'Place of birth of worker'),
    headerTooltip('Place of Residence', 'Location of residence of the worker at documentation time'),
    headerTooltip('Marital Status', 'Marital status of worker e.g married, single, widow'),
    headerTooltip('Total number of family members', 'that’s the number of family members+ the worker'),
    headerTooltip('Type', 'e.g. wife, children, dependants or family member in their charge'),
    headerTooltip('Quantity', 'Quantity'),
    headerTooltip('Date of Child"s Birth', 'The date that a child of the worker was born'),
    headerTooltip('Date of Acquisition', 'Date the French nationality was acquired'),
    headerTooltip('Ordinance Date', 'date of government ordinance by which the French nationality was acquired'),
    headerTooltip('Type', 'married, widow or divorced etc.'),
    headerTooltip('Date', 'Date'),
    headerTooltip('Date of Death', 'The date of death of the worker'),
    headerTooltip('Trascription from Source', 'Part of the source transcribed faithfully'),
    headerTooltip('Service in Company', 'Service in Company'),
    headerTooltip('Previous Employments', 'Previous Employments'),
    headerTooltip('Note', 'Note from the person that did the transcription of the original source to the Fast Cat record'),
    'Comment'
]);

tablesWithoutCommentCols.set(tableId, [9, 22, 23, 24]); //define fieds that do not have external content

var analytic_workers_data = [
    {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""},
    {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}
];

var analytic_workers_cols = [
    {data: 'source_page', type: 'text'},
    {data: 'worker_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_fr")), vocab: 'surname_fr'},
    {data: 'worker_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_fr")), vocab: 'name_fr'},
    {data: 'worker_sex', type: 'dropdown', source: ['female', 'male']},
    {data: 'worker_age', type: 'text'},
    {data: 'worker_date_of_birth', type: 'date'},
    {data: 'worker_place_of_birth', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'},
    {data: 'worker_place_of_residence', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'},
    {data: 'worker_marital_status', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("marital_status_fr")), vocab: 'marital_status_fr'},
    {data: 'total_family_members', type: 'text'},
    {data: 'family_member_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("person_to_person_relation_fr")), vocab: 'person_to_person_relation_fr', renderer: groupRenderer},
    {data: 'family_member_quantity', type: 'text', renderer: groupRenderer},
    {data: 'childs_birthdate', type: 'date'},
    {data: 'date_of_aquisition', type: 'date'},
    {data: 'ordinance_date', type: 'date'},
    {data: 'marital_status_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("marital_status_fr")), vocab: 'marital_status_fr'},
    {data: 'marital_status_date', type: 'text'},
    {data: 'death_date', type: 'date'},
    {data: 'transcription_from_source', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'service_in_company', type: 'text', renderer: buttonRenderer, readOnly: true},
    {data: 'previous_employment', renderer: aggregadebuttonRenderer, readOnly: true},
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
    ['', '', '', '', '', '', '', '', '', '', {label: 'Family Members', colspan: '2'}, '', {label: 'Nationality Acquisition', colspan: '2'}, {label: 'Change of Marital Status', colspan: '2'}, '', '', '', '', '', ''],
    tablesAndHeaders.get(tableId)
];


var analytic_worker_listGroups = [[10, 11]];
headers = markHeaders(headers, analytic_worker_listGroups);
var analytic_workers_locs = new Object();
var analytic_workers_persons = new Object();
var persons_tbl = new Object();

var analytic_workers_hot = new Handsontable(cont, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: analytic_workers_data,
    columns: analytic_workers_cols,
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
        if (col > 9 && col < 12) {
            groupLeftClicked(this, row, col);
        }
    }/*,
    afterRenderer: function(td, row, col, prop, value) {
        if ((analytic_workers_cols [col].vocab === 'location_fr') && (value)) {
            handle_locations(value, 'analytic_worker_list', row, col, 'LOCS', analytic_workers_locs);
        } else if (col > 0 && col < 3) {
            handle_persons(row, col, value, 'analytic_worker_list', [1, 2], ['surname_a', 'name'], analytic_workers_persons, persons_tbl, 'PERSONS');
        }
    }*/
});

analytic_workers_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(analytic_workers_cols[col].vocab);
            } else if (key === 'add') {
                var colClicked = analytic_workers_hot.getSelectedRange().to.col;
                var rowClicked = analytic_workers_hot.getSelectedRange().to.row;
                if (colClicked > 9 && colClicked < 12) {
                    groupClicked('analytic_worker_list', "family_members", rowClicked, 10, 11);
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
            /*"add10rows": {
             name: "Add 10 rows",
             disabled: function() {
             return analytic_workers_hot.countRows() - 1 !== analytic_workers_hot.getSelected()[0];
             },
             callback: function() {
             this.alter('insert_row', this.getSelected()[0] + 1, 10);
             }
             },*/
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function() {
                    var col = analytic_workers_hot.getSelectedRange().to.col;
                    var label = analytic_workers_cols[col].vocab;
                    if (label) {
                        update_Vocs();
                        return analytic_workers_hot.getSelectedRange().to.col !== col;
                    } else {
                        return analytic_workers_hot.getSelectedRange().to.col !== -1;
                    }
                }},
            "add": {
                name: "Add table",
                hidden: function() {
                    return isAddTableMenuVisible(this, analytic_worker_listGroups);

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
    {data: 'registration_number', type: 'text'},
    {data: 'profession', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_fr")), vocab: 'status_capacity_role_fr'},
    {data: 'status', type: 'dropdown', source: ['worker', 'apprentice']},
    {data: 'arrival_date', type: 'date'},
    {data: 'release_date', type: 'date'},
    {data: 'admission_tax', type: 'text'},
    {data: 'location_of_delivery', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'},
    {data: 'date_of_delivery', type: 'date'},
    {data: 'number_of_the_libretto', type: 'text'},
    {data: 'days_of_absence', type: 'text'},
    {data: 'date', type: 'date'},
    {data: 'reason', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("reason_of_end_of_service_fr")), vocab: 'reason_of_end_of_service_fr', renderer: groupRenderer},
    {data: 'name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_fr")), vocab: 'name_fr'},
    {data: 'surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_fr")), vocab: 'surname_fr'},
    {data: 'new_profession', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_fr")), vocab: 'status_capacity_role_fr'},
    {data: 'new_status', type: 'dropdown',
        source: ['worker', 'apprentice']},
    {data: 'date_of_change', type: 'text'},
    {data: 'name_of_workshop', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("workshop_name_fr")), vocab: 'workshop_name_fr'},
    {data: 'manager_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_fr")), vocab: 'name_fr'},
    {data: 'manager_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_fr")), vocab: 'surname_fr'},
    {data: 'family_member_type', type: 'dropdown', source: JSON.parse(localStorage.getItem("person_to_person_relation_fr")),
        vocab: 'person_to_person_relation_fr', renderer: groupRenderer},
    {data: 'family_member_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_fr")), vocab: 'name_fr', renderer: groupRenderer},
    {data: 'family_member_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_fr")), vocab: 'surname_fr', renderer: groupRenderer},
    {data: 'family_member_registration_number', type: 'text', renderer: groupRenderer},
    {data: 'trascription_from_source', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}
];

var students_listGroups = [[20, 23]];

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
        table_header = ' / Ship Name : ' + header;
    }

    var html = "<div  class='panel panel-default nested_table not_visible' style='border:transparent; margin-top:5px; '>" +
            "<div class='panel-heading' role='tab' id='heading" + cnt + "'>" +
            "<h4 class='panel-title'>" +
            "    <a style='background-color:#589AAF;' class='collapsed' role='button' onclick='close_nested(" + cnt + ")'  href='#collapse" + cnt + "'>" +
            "<span class='pull-right glyphicon glyphicon-remove'></span>" + "Service in Company " + plus + table_header +
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
            data = [{registration_number: ""}, {registration_number: ""}, {registration_number: ""}, {registration_number: ""}];
            $('#Row_' + cnt).css({'background-color': '#638BC7'});
            $('#Row_' + cnt).css({'color': '#ffffff'});
            $("#Row_" + cnt).addClass('full_data');
        } else {
            $("#Row_" + cnt).addClass('full_data');
            $("#Row_" + cnt).css("background-color", "#C4C4C4");
            $("#Row_" + cnt).css("color", "#1C6799");
        }

        var tableId = 'students_list' + cnt;
        tablesWithoutCommentCols.set(tableId, [4, 11]); //define fieds that do not have external content
//        tablesAndHeaders.set('students_list',
//                ['Registration Number', 'Profession', 'Status', 'Arrival Date', 'Release Date', 'Admission Tax', 'Location of Delivery', 'Date of the Delivery', 'Number of the Libretto', 'Days of Absence', 'Date', 'Reason', 'Name', 'Surname', 'New Profession', 'New Status', 'Date of Change', 'Name of Workshop', 'Name', 'Surname', 'Type', 'Name', 'Surname', 'Registration Number', 'Trascription from Source', 'Note', 'Comment']);
        tablesAndHeaders.set('students_list', [
            headerTooltip('Registration Number', 'Registration number of worker [a unique number for each worker employed in the industry +book number. The book number was added here in order to make the registration number unique. After the 5th December 1870 the company changed its name from “Compagnie des Services Maritimes Imperiales” to “Compagnie des Messageries Maritimes” and started the numbering from the beginning'),
            headerTooltip('Profession', 'Profession in which the worker is admitted to the company'),
            headerTooltip('Status', 'e.g. worker, apprentice'),
            headerTooltip('Arrival Date', 'First day of work in the company'),
            headerTooltip('Release Date', 'Last day of work in the company'),
            headerTooltip('Admission Tax', 'Tax payed by the company for the admission of the worker'),
            headerTooltip('Location of Delivery', 'Location of the delivery of the libretto in the first work he was employed'),
            headerTooltip('Date of the Delivery', 'Date of the delivery of the libretto'),
            headerTooltip('Number of the Libretto', 'Id of libretto'),
            headerTooltip('Days of Absence', 'the number of days the employer was absent'),
            headerTooltip('Date', 'The date of dismiss or leave of the worker from the company'),
            headerTooltip('Reason', 'The reason of dismiss/leave of the worker from the company'),
            headerTooltip('Name', 'the name of the manager/chef of the workshop/atelier where the worker is currently employed'),
            headerTooltip('Surname', 'the surname of the manager/chef of the new workshop/atelier where the worker is currently employed'),
            headerTooltip('New Profession', 'Νew profession that the worker was started inside the same company'),
            headerTooltip('New Status', 'e.g. worker, apprentice'),
            headerTooltip('Date of Change', 'the date of change of his profession/status'),
            headerTooltip('Name of Workshop', 'Name of the new workshop/atelier the worker has moved to inside the same company'),
            headerTooltip('Name', 'Name'),
            headerTooltip('Surname', 'Surname'),
            headerTooltip('Type', 'wife, mother, father, brother, daughter, son, uncle'),
            headerTooltip('Name', 'Name'),
            headerTooltip('Surname', 'Surname'),
            headerTooltip('Registration Number', 'the registration number of the family member working in the company'),
            headerTooltip('Trascription from Source', 'Part of the source transcribed faithfully'),
            headerTooltip('Note', 'Note from the person that did the transcription of the original source to the Fast Cat record'),
            'Comment'
        ]);

        var container = document.getElementById(tableId);

        var headers = [
            // ['', '', {label: 'Owner', colspan: 9}, ''],
            ['', '', '', '', '', '', {label: '', colspan: 3}, '', {label: '', colspan: 2}, {label: '', colspan: 2}, {label: headerTooltip('Change of Status', 'change in the work status within the shipyards'), colspan: 6}, {label: '', colspan: 4}, '', '', ''],
            ['', '', '', '', '', '', {label: '', colspan: 3}, '', {label: '', colspan: 2}, {label: '', colspan: 2}, '', '', '', {label: headerTooltip('New Workshop', 'the new workshop/atelier the worker has moved to inside the same company'), colspan: 3}, {label: '', colspan: 4}, '', '', ''],
            ['', '', '', '', '', '', {label: 'Employment record book (libretto)', colspan: 3}, '', {label: 'End of Service', colspan: 2}, {label: 'Manager of Workshop', colspan: 2}, '', '', '', '', {label: headerTooltip('Manager', 'the manager/chef of the new workshop/atelier where the worker has moved'), colspan: 2}, {label: headerTooltip('Family Member in Same Company', 'if a family member is working in the same company its mentioned here'), colspan: 4}, '', '', ''],
            tablesAndHeaders.get('students_list')
        ];


        headers = markHeaders(headers, students_listGroups);


        var student_hot = new Handsontable(container, {
            licenseKey: '',
            dateFormat: 'YYYY-MM-DD',
            data: data,
            columns: students_columns,
            manualColumnResize: true,
            contextMenu: true,
            autoWrapRow: true,
            //maxRows:1,
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
                if (col > 19 && col < 24) {
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
                        if (colClicked > 19 && colClicked < 24) {
                            groupClicked('students_list' + cnt, "family_company_members", rowClicked, 20, 23);
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

    } else {

        if (!((header == null) || (header == "null"))) {
            $('#heading' + cnt).children().children().html('<span class="pull-right glyphicon glyphicon-remove"></span>Service in Company ' + plus + ' / Ship Name : ' + header);
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
    {data: 'registration_number', type: 'text'},
    {data: 'profession', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_fr")), vocab: 'status_capacity_role_fr'},
    {data: 'status', type: 'dropdown',
        source: ['worker', 'apprentice']},
    {data: 'employment_from', type: 'date'},
    {data: 'employment_to', type: 'date'},
    {data: 'employment_duration_value', type: 'text'},
    {data: 'employment_duration_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_fr")), vocab: 'unit_fr'},
    {data: 'company_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_fr")), vocab: 'organization_fr'},
    {data: 'headquarter_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_fr")), vocab: 'location_fr'},
    {data: 'headquarter_address', type: 'text'},
    {data: 'owner_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_fr")), vocab: 'name_fr'},
    {data: 'owner_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_fr")), vocab: 'surname_fr'},
    {data: 'ship_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_fr")), vocab: 'ship_name_fr'},
    {data: 'wage_value', type: 'text'},
    {data: 'wage_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_fr")), vocab: 'unit_fr'},
    {data: 'trascription_from_source', renderer: textRender, readOnly: true, type: 'text'},
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
        table_header = ' / Ship Name : ' + header;
    }

    var html = "<div  class='panel panel-default aggregade_nested_table not_visible' style='border:transparent; margin-top:5px;'>" +
            "<div class='panel-heading' role='tab' id='aggregade_heading" + cnt + "'>" +
            "<h4 class='panel-title'>" +
            "    <a style='background-color:#589AAF;' class='collapsed' role='button' onclick='close_aggregadeStaff(" + cnt + ")'  href='#collapse" + cnt + "'>" +
            "<span class='pull-right glyphicon glyphicon-remove'></span>" + "Previous Employments " + plus + table_header +
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
        tablesWithoutCommentCols.set(tableId, [9]); //define fieds that do not have external content
//        tablesAndHeaders.set('aggregade_personnel', ['Registration Number', 'Profession', 'Status', 'From', 'To', 'Value', 'Unit', 'Name of Company', 'Location', 'Address', 'Name', 'Surname', 'Ship Name', 'Value', 'Unit', 'Trascription from Source', 'Note', 'Comment']);
        tablesAndHeaders.set('aggregade_personnel', [
            headerTooltip('Registration Number', 'previous registration number of the worker in the Shipyards of Messageries Maritimes'),
            headerTooltip('Profession', 'Previous profession and service of the worker'),
            headerTooltip('Status', 'worker, apprentice'),
            headerTooltip('From', 'First day of work in the company'),
            headerTooltip('To', 'Last day of work in the company'),
            headerTooltip('Value', 'Value'),
            headerTooltip('Unit', 'Unit'),
            headerTooltip('Name of Company', 'the name of the previous company the worker was employed'),
            headerTooltip('Location', 'the city were the previous company the worker was employed was based'),
            headerTooltip('Address', 'the specific address of the previous company the worker was employed was based'),
            headerTooltip('Name', 'The name of the owner of the previous company where the worker was employed'),
            headerTooltip('Surname', 'The surname of the owner of the previous company where the worker was employed'),
            headerTooltip('Ship Name', 'Many times in the “previous employment” we have the note ‘on board’ and in this case the name of the ship was given ,the profession he was doing on board (if it was sailor, captain, engineer etc) and sometimes the status (1st level engineer for instance'),
            headerTooltip('Value', 'Value'),
            headerTooltip('Unit', 'Unit'),
            headerTooltip('Trascription from Source', 'Part of the source transcribed faithfully'),
            headerTooltip('Note', 'Note from the person that did the transcription of the original source to the Fast Cat record'),
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
                ['', '', '', {label: 'Employment Period', colspan: 4}, '', {label: '', colspan: 2}, {label: '', colspan: 2}, '', {label: '', colspan: 2}, '', '', ''],
                ['', '', '', {label: '', colspan: 2}, {label: headerTooltip('Duration','duration of employment'), colspan: 2}, '', {label: 'Headquarters of Company', colspan: 2}, {label: 'Owner', colspan: 2}, 'Ship Name', {label: headerTooltip('Wage','the amount of money the employed was payed in its previous employment'), colspan: 2}, '', '', ''],
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
            }/*,
            afterRenderer: function(td, row, col, prop, value) {
                if ((aggregade_pressonnel_cols[col].vocab === 'location_it') && (value)) {
                    handle_locations(value, 'previous_employments_' + cnt, row, col, 'LOCS', captain_locs);
                } else if (value) {
                    handle_persons(row, col, value, 'previous_employments_' + cnt, [0, 1, 2, 3, 4], ['name', 'surname_a', 'fathers_name', 'place_of_birth'], captain_persons, captain_tbl, 'PERSONS');
                    handle_persons(row + '_', col, value, 'previous_employments_' + cnt, [2, 1], ['name', 'surname_a'], captain_persons, captain_tbl, 'PERSONS');
                }
            }*/
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
            $('#aggregade_heading' + cnt).children().children().html('<span class="pull-right glyphicon glyphicon-remove"></span>Previous Employments ' + plus + ' / Ship Name : ' + header);
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
    var analytic_worker_list = createJson(analytic_workers_hot, analytic_workers_cols, usage);
    var overall_maritime_workers = createJson(workers_hot, workers_cols, usage);


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
    json['maritime_workers_overall'] = overall_maritime_workers;

    json['analytic_worker_list'] = analytic_worker_list;
    json['service_in_company'] = transactions;
    json['previous_employments'] = subjects;




    //////////////////////////////////////////analytic worker list ////////////
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
        /////////////////////////////////////////////////////////////////////////
        var crew_list_persons = new Object();
        var crew_list_tbl = new Object();
        var crew_list_locs = new Object();
        terms = new Object();
        $.each(analytic_worker_list, function(row) {
            var row_data = this;
            console.log('------- handling row ' + row + ' -----------');
            $.each(this, function(col) {
                //////////////////////////////////////
                var val = this.toString();
                $.each(analytic_workers_cols, function(col_no) {
                    if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                        var label = $(this).attr('vocab');
                        handle_json_vocs(val, label, row, col, col_no, 'analytic_worker_list', terms);
                    }
                });
                ////////////////////////////////////////////////////////////////
                if (col === 'worker_surname') {
                    if (row_data['worker_name']) {
                        handle_multiple_table_instances(row, 2, row_data['worker_name'], 'analytic_worker_list', [2, 1, 5], ['name', 'surname_a', 'date_of_birth'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                    if (row_data['worker_surname']) {
                        handle_multiple_table_instances(row, 1, row_data['worker_surname'], 'analytic_worker_list', [2, 1, 5], ['name', 'surname_a', 'date_of_birth'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                    if (row_data['worker_date_of_birth']) {
                        handle_multiple_table_instances(row, 5, row_data['worker_date_of_birth'], 'analytic_worker_list', [2, 1, 5], ['name', 'surname_a', 'date_of_birth'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                   
                } else if (col === 'worker_place_of_birth') {
                    handle_multiple_table_instances(row, 6, this.toString(), 'analytic_worker_list', null, null, crew_list_locs, null, 'LOCS');
                } else if (col === 'worker_place_of_residence') {
                    handle_multiple_table_instances(row, 7, this.toString(), 'analytic_worker_list', null, null, crew_list_locs, null, 'LOCS');
                }
            });
        });


        ////////////////////////////////////////////////////////////////////////
        $.each(transactions, function(cnt) {
            var students_persons = new Object();
            var students_tbl = new Object();
            var students_locs = new Object();
            var terms = new Object();

            console.log("----------handling nested table " + cnt + "--------------");
            $.each(this, function(row) {
                var row_data = this;
                $.each(this, function(col) {
                    ///////////////////////////////////////////   
                    var val = this;
                    $.each(students_columns, function(col_no) {
                        if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                            var label = $(this).attr('vocab');
                            handle_vocabulary(val, label, this);
                            handle_json_vocs(val, label, row, col, col_no, 'service_in_company_' + cnt, terms);
                        }
                    });
                    /////////////////////////////////////                
                    var value = this.toString();
                    if ((col === 'surname') && value) {
                        if ((row_data['name'])) {
                            handle_multiple_table_instances(row + '_', 12, row_data['name'], 'service_in_company_' + cnt, [12, 13], ['name', 'surname_a'], students_persons, students_tbl, 'PERSONS');
                        }
                        if ((row_data['surname'])) {
                            handle_multiple_table_instances(row + '_', 13, row_data['surname'], 'service_in_company_' + cnt, [12, 13], ['name', 'surname_a'], students_persons, students_tbl, 'PERSONS');
                        }
                    } else if ((col === 'manager_surname') && value) {
                        if ((row_data['manager_name'])) {
                            handle_multiple_table_instances(row + '__', 18, row_data['manager_name'], 'service_in_company_' + cnt, [18, 19], ['name', 'surname_a'], students_persons, students_tbl, 'PERSONS');
                        }
                        if ((row_data['manager_surname'])) {
                            handle_multiple_table_instances(row + '__', 19, row_data['manager_surname'], 'service_in_company_' + cnt, [18, 19], ['name', 'surname_a'], students_persons, students_tbl, 'PERSONS');
                        }
                    } else if ((col === 'family_member_surname') && value) {
                        if ((row_data['family_member_name'])) {
                            handle_multiple_table_instances(row + '___', 21, row_data['family_member_name'], 'service_in_company_' + cnt, [21, 22,23], ['name', 'surname_a','registration_number'], students_persons, students_tbl, 'PERSONS');
                        }
                        if ((row_data['family_member_surname'])) {
                            handle_multiple_table_instances(row + '___', 22, row_data['family_member_surname'], 'service_in_company_' + cnt, [21, 22,23], ['name', 'surname_a','registration_number'], students_persons, students_tbl, 'PERSONS');
                        }
                        if ((row_data['family_member_registration_number'])) {
                            handle_multiple_table_instances(row + '___', 23, row_data['family_member_registration_number'], 'service_in_company_' + cnt, [21, 22,23], ['name', 'surname_a','registration_number'], students_persons, students_tbl, 'PERSONS');
                        }
                    }
                    else if (col === 'location_of_delivery') {
                        handle_locations(this.toString(), 'service_in_company_' + cnt, row, 6, 'LOCS', students_locs);
                    }
                });
            });
        });

        //////////////////////////////////////////////////////////////////////////////  

        $.each(subjects, function(cnt) {
            var students_persons = new Object();
            var students_tbl = new Object();
            var students_locs = new Object();
            var ship_obj = new Object();
            var ships_tbl = new Object();
            var terms = new Object();



            console.log("----------handling nested table " + cnt + "--------------");
            $.each(this, function(row) {
                var row_data = this;
                $.each(this, function(col) {
                    ///////////////////////////////////////////   
                    var val = this;
                    $.each(aggregade_pressonnel_cols, function(col_no) {
                        if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                            var label = $(this).attr('vocab');
                            handle_vocabulary(val, label, this);
                            handle_json_vocs(val, label, row, col, col_no, 'previous_employments_' + cnt, terms);
                        }
                    });
                    /////////////////////////////////////

                    var value = this.toString();
                    if ((col === 'owner_surname') && value) {
                        if ((row_data['owner_name'])) {
                            handle_multiple_table_instances(row + '_', 10, row_data['owner_name'], 'previous_employments_' + cnt, [10, 11], ['name', 'surname_a'], students_persons, students_tbl, 'PERSONS');
                        }
                        if ((row_data['owner_surname'])) {
                            handle_multiple_table_instances(row + '_', 11, row_data['owner_surname'], 'previous_employments_' + cnt, [10, 11], ['name', 'surname_a'], students_persons, students_tbl, 'PERSONS');
                        }
                    }
                    else if (col === 'headquarter_location') {
                        handle_locations(this.toString(), 'previous_employments_' + cnt, row, 8, 'LOCS', students_locs);
                    } else if (col === 'ship_name') {
                        handle_ships(row, 12, value, 'previous_employments_' + cnt, [12], ['name'], 'SHIPS', ship_obj, ships_tbl);
                    } else if (col === 'company_name') {
                        handle_multiple_table_instances(row + '_', 7, value, 'previous_employments_' + cnt, null, null, null, null, 'ORGS');
                    }

                });
            });
        });

    }
    //////////////////////////////////////////////////////////////////////////////      
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
    //  console.log(data);
    record_status = status;
    clear_LocalStorage_instances();

    catalogue_info.loadData(data.record_information);
    source_identity_data.loadData(data.source_identity);


    var overall_maritime_data = new Array();
    $.each(data.maritime_workers_overall, function() {
        overall_maritime_data.push(this);
    });

    workers_hot.loadData(overall_maritime_data);

    var analytic_workers_data = new Array();
    $.each(data.analytic_worker_list, function() {
        analytic_workers_data.push(this);
    });

    analytic_workers_hot.loadData(analytic_workers_data);

    $('.nested_table').remove();

    if (data.service_in_company) {
        nested_tables_object = data.service_in_company;


        $.each(data.service_in_company, function(cnt) {

            var students = new Array();

            $.each(this, function() {
                students.push(this);
            });

            if (mode === 'teamView') {
                nested_tables[cnt] = students;
            } else {
                nested_tables[cnt] = students;
            }
        });

    }

    if (data.previous_employments) {

        nested_tables_2_object = data.previous_employments;

        $.each(data.previous_employments, function(cnt) {
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
    $.each(json.service_in_company, function(cnt) {

        $.each(this, function() {
            student_list.push(Object.assign({}, (json.analytic_worker_list[cnt]), (this)));
        });
    });

    if (student_list.length < 1) {
        student_list.push('');
    }

    var subject_list = new Array();
    $.each(json.previous_employments, function(cnt) {
        $.each(this, function() {
            subject_list.push(Object.assign({}, (json.analytic_worker_list[cnt]), (this)));
        });
    });

    if (subject_list.length < 1) {
        subject_list.push('');
    }

    var sheets = new Array();
    sheets.push([json.record_information]);
    sheets.push([json.source_identity]);
    sheets.push(json.maritime_workers_overall);
    sheets.push(json.analytic_worker_list);
    sheets.push(student_list);
    sheets.push(subject_list);

    var opts = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Source Identity', header: false}, {sheetid: 'Maritime Worker Overall', header: true}, {sheetid: 'Analytic Worker List', header: true}, {sheetid: 'Service in Company', header: true}, {sheetid: 'Previous Employments', header: true}];
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

        tables.push(catalogue_info, source_identity_data, analytic_workers_hot);
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
            } else if (table_id === "analytic_workers_hot") {
                old_val = analytic_workers_hot.getDataAtCell(this.row, this.col, value);
                analytic_workers_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
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
    } else if (parentTable === "maritime_workers") {
        workers_hot.setDataAtCell(row, col, val);
    } else if (parentTable === "analytic_worker_list") {
        analytic_workers_hot.setDataAtCell(row, col, val);
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
    tmp['source_identity']['source_language'] = 'French';

    tmp['maritime_worker_overall'] = simple_with_Groups(json.maritime_workers_overall, overall_worker_listGroups, workers_cols);



    tmp['analytic_worker_list'] = nested_with_Groups(json.service_in_company, json.analytic_worker_list, null, students_columns, 'service_in_company', 'service_');
    var sec_nested = nested_with_Groups(json.previous_employments, json.analytic_worker_list, null, aggregade_pressonnel_cols, 'previous_employment', 'service_');
    /// merge tow nested tables

    $.each(tmp['analytic_worker_list'], function(k) {
        tmp['analytic_worker_list'][k]['previous_employment'] = sec_nested[k]['previous_employment'];
    });


    //////////////////
    root['root'] = tmp;
    console.log(root);
    var xml = formatXml(json2xml(root));

    xml = xml.replace(/<service_(\d+)>/g, '<analytic_worker index="$1">');
    xml = xml.replace(/<\/service_(\d+)>/g, "</analytic_worker>");

    xml = xml.replace(/<row_(\d+)>/g, '<row index="$1">');
    xml = xml.replace(/<\/row_(\d+)>/g, "</row>");

    xml = xml.replace(/<group_data_(\d+)>/g, '<group_data index="$1">');
    xml = xml.replace(/<\/group_data_(\d+)>/g, "</group_data>");


    return (xml);
}
;

