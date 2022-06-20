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
//tablesAndHeaders.set(tableId, ['Name', 'Location', 'Title', 'From', 'To', 'Title', 'Number *', 'Finding Aid Number', 'From *', 'To *', 'Note', 'Comment']);
tablesAndHeaders.set(tableId, [
    headerTooltip('Name', 'Library or Archive where the original source is located during the time of transcription'),
    headerTooltip('Location', 'The Location of the Library or Archive where the original source is held'),
    headerTooltip('Title', 'The title of the collection to which the source belongs '),
    headerTooltip('From', 'The date on which the collection begins'),
    headerTooltip('To', 'The date on which the collection ends'),
    headerTooltip('Title', 'The specific name of the register to which the source belongs'),
    headerTooltip('Number *', 'The number of the register to which the source belongs'),
    headerTooltip('Finding Aid Number', 'The number of the archival inventory to which the source belongs'),
    headerTooltip('From *', 'The date on which the registration started'),
    headerTooltip('To *', 'The date on which the registration ended'),
    headerTooltip('Note', 'Space for possible annotations about the source identity from the person who does the transcription'),
    'Comment'
]);

tablesWithoutCommentCols.set(tableId, [0, 1, 2, 3, 4, 5, 6, 7, 10]); //define fieds that do not have external content


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
    {data: 'collection_date_from', type: 'text'},
    {data: 'collection_date_to', type: 'text'},
    {data: 'register_title', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("register_it")), vocab: 'register_it'},
    {data: 'register_number', type: 'text'},
    {data: 'inventory_number', type: 'text'},
    {data: 'book_date_from', type: 'text'},
    {data: 'book_date_to', type: 'text'},
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
        [{label: '', colspan: 2}, {label: 'Collection', colspan: 3}, {label: '', colspan: 2}, '', {label: '', colspan: 2}, ''],
        [{label: 'Archive / Library', colspan: 2}, '', {label: 'Date', colspan: 2}, {label: 'Register', colspan: 2}, '', {label: 'Date of Book', colspan: 2}, ''],
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
        if ((source_identity_cols[col].vocab === 'location_it') && (value)) {
            handle_locations(value, 'source_identity', row, col, 'LOCS', source_locs);
        } else if (value && ((source_identity_cols[col].vocab === 'archive_or_library_it'))) {
            handle_organizations(value, 'source_identity', row, col, 'ORGS');
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
/////////////////////////////SHIP RECORD/////////////////////////////////////////////             
//////////////////////////////   4th TABLE     ////////////////////////////////
/////////////////////////LIST COURSES/////////////////////////////////////////                       

var tableId = "courses_list";
//tablesAndHeaders.set(tableId, ['From', 'To', 'Semester', 'Title of Course', 'Number of Course/Section', 'Total Number of Students', 'List of Students', 'List of Subjects', 'Note', 'Comment']);
tablesAndHeaders.set(tableId, [
    headerTooltip('From', 'The date on which the school year starts'),
    headerTooltip('To', 'The date on which the school year ends'),
    headerTooltip('Semester', 'The number of the semester'),
    headerTooltip('Title of Course', 'The name of the course of study'),
    headerTooltip('Number of Course/Section', 'The number of the course/section'),
    headerTooltip('Total Number of Students', 'The total number of students for each specific course/section'),
    headerTooltip('List of Students', 'List of Students'),
    headerTooltip('List of Subjects', 'List of Subjects'),
    headerTooltip('Note', 'Space for possible annotations about the source identity from the person who does the transcription'),
    'Comment'
]);
tablesWithoutCommentCols.set(tableId, [6, 7, 8]); //define fieds that do not have external content


var courses_data = [
    {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""},
    {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}
];

var courses_cols = [
    {data: 'schoolyear_date_from', type: 'text'},
    {data: 'schoolyear_date_to', type: 'text'},
    {data: 'semester', type: 'text'},
    {data: 'title_of_course', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("course_it")), vocab: 'course_it'},
    {data: 'total_number_of_students', type: 'text'},
    {data: 'number_of_course_section', type: 'text'},
    {data: 'list_of_students', type: 'text', renderer: buttonRenderer, readOnly: true},
    {data: 'subject_of_study_type', renderer: aggregadebuttonRenderer, readOnly: true},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
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
    [{label: 'School Year', colspan: '2'}, '', '', '', '', '', '', '', ''],
    tablesAndHeaders.get(tableId)
];

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
    }
});

courses_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(courses_cols[col].vocab);
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
    {data: 'student_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it'},
    {data: 'student_surname_A', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_it")), vocab: 'surname_it'},
    {data: 'student_surname_B', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_it")), vocab: 'surname_it'},
    {data: 'student_origin_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
    {data: 'student_profession', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_it")), vocab: 'status_capacity_role_it'},
    {data: 'student_employment_organization', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_it")), vocab: 'organization_it'},
    {data: 'student_realization_of_exam', type: 'dropdown',
        source: ['Yes', 'No']},
    {data: 'student_religion', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("religion_it")), vocab: 'religion_it'},
    {data: 'student_age', type: 'text'},
    {data: 'student_birth_year', type: 'text'},
    {data: 'related_person_type', type: 'dropdown',
        source: ['Father', 'Mother', 'Teacher']},
    {data: 'related_person_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it'},
    {data: 'related_person_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_it")), vocab: 'surname_it'},
    {data: 'related_person_profession', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_it")), vocab: 'status_capacity_role_it'},
    {data: 'related_person_emplyment_organization', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_it")), vocab: 'organization_it'},
    {data: 'paying_exempt_scholarship', type: 'dropdown',
        source: ['Paying', 'Exempt', 'Scholarship']},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}
];



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
        }
        else {
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
            "<span class='pull-right glyphicon glyphicon-remove'></span>" + "List of Students " + plus + table_header +
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
        tablesWithoutCommentCols.set(tableId, [15]); //define fieds that do not have external content
//        tablesAndHeaders.set('students_list', ['Name', 'Surname A', 'Surname B', 'Location of Origin', 'Student Profession', 'Student Employment Company', 'Realization of Exam', 'Religion', 'Age', 'Year of Birth', 'Type', 'Name', 'Surname', 'Profession', 'Employment Organization', 'Paying/Exempt/Scholarship', 'Note', 'Comment']);
        tablesAndHeaders.set('students_list', [
            headerTooltip('Name', 'The name of the student'),
            headerTooltip('Surname A', 'The surname of the student'),
            headerTooltip('Surname B', 'The possible second surname of the student'),
            headerTooltip('Location of Origin', 'The place - city or village - where the student was born or from where the student comes'),
            headerTooltip('Student Profession', 'Student Profession'),
            headerTooltip('Student Employment Company', 'The name of the employer of the student'),
            headerTooltip('Realization of Exam', 'The possible realization of an exam by the student'),
            headerTooltip('Religion', 'The religious affiliation of the student'),
            headerTooltip('Age', 'The age of the student'),
            headerTooltip('Year of Birth', 'The year of birth of the student'),
            headerTooltip('Type', 'The type of relationship that the related person had with the student'),
            headerTooltip('Name', 'The name of the related person'),
            headerTooltip('Surname', 'Surname'),
            headerTooltip('Profession', 'The profession of the related person'),
            headerTooltip('Employment Organization', 'The name of the employer of the related person'),
            headerTooltip('Paying/Exempt/Scholarship', 'The economic modality in which the student attend the course'),
            headerTooltip('Note', 'Space for possible annotations about the source identity from the person who does the transcription'),
            'Comment'
        ]);

        var container = document.getElementById(tableId);

        var headers = [
            [{label: 'Student', colspan: 15}, ''],
            ['', '', '', '', '', '', '', '', '', '', {label: 'Related Person', colspan: 4}, '', ''],
            tablesAndHeaders.get('students_list')
        ];

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
            }
        });


        student_hot.updateSettings({
            contextMenu: {
                callback: function(key, options) {
                    if (key === 'edit_vocabulary') {
                        var col = options.start.col;
                        create_voc_modal(students_columns[col].vocab);
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
            $('#heading' + cnt).children().children().html('<span class="pull-right glyphicon glyphicon-remove"></span>List of Students ' + plus + ' / Title of Course : ' + header);
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
    {data: 'subject_of_study_type', type: 'dropdown',
        source: ['Oblligatory', 'Free']},
    {data: 'subject_of_study_subject', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("course_subjects_it")), vocab: 'course_subjects_it'},
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
        }
        else {
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
            "<span class='pull-right glyphicon glyphicon-remove'></span>" + "List of Subjects " + plus + table_header +
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
        tablesWithoutCommentCols.set(tableId, []); //define fieds that do not have external content
        tablesAndHeaders.set('aggregade_personnel', ['Type', 'Subject', 'Comment']);
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
            rowHeaders: true,
            nestedHeaders: [
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
            $('#aggregade_heading' + cnt).children().children().html('<span class="pull-right glyphicon glyphicon-remove"></span>List of Subjects ' + plus + ' / Title of Course : ' + header);
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
    json['list_of_courses'] = courses_list;
    json['list_of_students'] = transactions;
    json['subjects'] = subjects;


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
        $.each(courses_list, function(row) {
            $.each(this, function(col) {
                var val = this.toString();
                $.each(courses_cols, function(col_no) {
                    if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                        var label = $(this).attr('vocab');
                        handle_json_vocs(val, label, row, col, col_no, 'list_of_courses', terms);
                    }
                });
            });
        });
        /////////////////////////////////////////////////////////////////////////          
        $.each(transactions, function(cnt) {
            var students_persons = new Object();
            var students_tbl = new Object();
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
                            handle_json_vocs(value, label, row, col, col_no, 'students_list_' + cnt, terms);
                        }
                    });
                    /////////////////////////////////////                               
                    if ((col === 'student_surname_A') && value) {
                        if(transactions[cnt][row]["student_name"]){
                            handle_persons(row, 0, transactions[cnt][row]["student_name"], 'students_list_' + cnt, [0, 1, 2, 9], ['name', 'surname_a', 'surname_b', 'date_of_birth'], students_persons, students_tbl, 'PERSONS');
                        }if(transactions[cnt][row]["student_surname_A"]){
                            handle_persons(row, 1, transactions[cnt][row]["student_surname_A"], 'students_list_' + cnt, [0, 1, 2, 9], ['name', 'surname_a', 'surname_b', 'date_of_birth'], students_persons, students_tbl, 'PERSONS');
                        }if(transactions[cnt][row]["student_surname_B"]){
                            handle_persons(row, 2, transactions[cnt][row]["student_surname_B"], 'students_list_' + cnt, [0, 1, 2, 9], ['name', 'surname_a', 'surname_b', 'date_of_birth'], students_persons, students_tbl, 'PERSONS');
                        }if(transactions[cnt][row]["student_birth_year"]){
                            handle_persons(row, 9, transactions[cnt][row]["student_birth_year"], 'students_list_' + cnt, [0, 1, 2, 9], ['name', 'surname_a', 'surname_b', 'date_of_birth'], students_persons, students_tbl, 'PERSONS');
                        }
                    } else if ((col === 'related_person_type') && (value.toLowerCase() === "father")) {
                        if(transactions[cnt][row]["student_surname_A"]){
                            handle_persons(row + '_', 1, transactions[cnt][row]["student_surname_A"], 'students_list_' + cnt, [11, 1, 13], ['name', 'surname_a', 'status'], students_persons, students_tbl, 'PERSONS');
                        }if(transactions[cnt][row]["related_person_name"]){
                            handle_persons(row + '_', 11, transactions[cnt][row]["related_person_name"], 'students_list_' + cnt, [11, 1, 13], ['name', 'surname_a', 'status'], students_persons, students_tbl, 'PERSONS');
                        }if(transactions[cnt][row]["related_person_profession"]){
                            handle_persons(row + '_', 13, transactions[cnt][row]["related_person_profession"], 'students_list_' + cnt, [11, 1, 13], ['name', 'surname_a', 'status'], students_persons, students_tbl, 'PERSONS');
                        }
                    } else if (col === 'student_origin_location') {
                        handle_locations(this.toString(), 'students_list_' + cnt, row, 3, 'LOCS', students_locs);
                    } else if (col === 'related_person_emplyment_organization') {
                        handle_organizations(this.toString(), 'students_list_' + cnt, row, 14, 'ORGS');
                    } else if (col === 'student_employment_organization') {
                        handle_organizations(this.toString(), 'students_list_' + cnt, row, col, 'ORGS');
                    }
                });
            });
        });
        ////////////////////////////////////////////////////////////////////////////
        $.each(subjects, function(cnt) {
            var terms = new Object();
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
    $.each(data.list_of_courses, function() {
        courses_data.push(this);
    });

    courses_hot.loadData(courses_data);

    $('.nested_table').remove();

    if (data.list_of_students) {

        nested_tables_object = data.list_of_students;

        $.each(data.list_of_students, function(cnt) {
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


    if (data.subjects) {

        nested_tables_2_object = data.subjects;

        $.each(data.subjects, function(cnt) {
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
    $.each(json.list_of_students, function(cnt) {
        $.each(this, function() {
            student_list.push(Object.assign({}, (json.list_of_courses[cnt]), (this)));
        });
    });

    if (student_list.length < 1) {
        student_list.push('');
    }

    var subject_list = new Array();
    $.each(json.subjects, function(cnt) {
        $.each(this, function() {
            subject_list.push(Object.assign({}, (json.list_of_courses[cnt]), (this)));
        });
    });

    if (subject_list.length < 1) {
        subject_list.push('');
    }

    var sheets = new Array();
    sheets.push([json.record_information]);
    sheets.push([json.source_identity]);
    sheets.push(json.list_of_courses);
    sheets.push(student_list);
    sheets.push(subject_list);

    var opts = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Source Identity', header: false}, {sheetid: 'List of Courses', header: true}, {sheetid: 'List Of Students', header: true}, {sheetid: 'List Of Subjects', header: true}];
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
    tmp['record_information']['related_organization'] = 'FORTH/IMS';
    tmp['record_information']['record_id'] = recordId;
    tmp['record_information']['template_type'] = templateTitle;
    tmp['source_identity'] = json.source_identity;
    tmp['source_identity']['source_language'] = 'Italian';

    tmp['list_of_courses'] = nested_with_Groups(json.list_of_students, json.list_of_courses, null, students_columns, 'list_of_students', 'course_');
    var sec_nested = nested_with_Groups(json.subjects, json.list_of_courses, null, aggregade_pressonnel_cols, 'subject_of_study_type', 'course_');
    /// merge tow nested tables
    $.each(tmp['list_of_courses'], function(k) {
        tmp['list_of_courses'][k]['subject_of_study_type'] = sec_nested[k]['subject_of_study_type'];
    });

    root['root'] = tmp;
    var xml = formatXml(json2xml(root));

    console.log(root);

    xml = xml.replace(/<course_(\d+)>/g, '<course index="$1">');
    xml = xml.replace(/<\/course_(\d+)>/g, "</course>");

    xml = xml.replace(/<row_(\d+)>/g, '<row index="$1">');
    xml = xml.replace(/<\/row_(\d+)>/g, "</row>");

    xml = xml.replace(/<group_data_(\d+)>/g, '<group_data index="$1">');
    xml = xml.replace(/<\/group_data_(\d+)>/g, "</group_data>");

    return (xml);
}
;

