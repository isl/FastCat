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

        } else if (subTableName === "size") {
            var cnt = parentTableName.replace("deed_contents", "");
            var cols = [
                {data: 'property_size_type', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("type_of_measurement_in")), vocab: 'type_of_measurement_in'},
                {data: 'property_size_value', type: 'text'},
                {data: 'property_size_unit', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("unit_in")), vocab: 'unit_in'}
            ];
            nestedHeaders = [
                ['Type', 'Value', 'Unit']
            ];
            data = setSubTableData(deed_contents[cnt], row, startCol, endCol);

        } else if (subTableName === "neighboring_property") {
            var cnt = parentTableName.replace("deed_contents", "");
            var cols = [
                {data: 'border_direction', type: 'dropdown',
                    source: ['N', 'S', 'W', 'E', 'NW', 'NE', 'SW', 'SE']},
                {data: 'owner_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in'},
                {data: 'owner_surname_a', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_in")), vocab: 'surname_in'},
                {data: 'owner_surname_b', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_in")), vocab: 'surname_in'},
                {data: 'owner_father_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in'},
                {data: 'neighboring_address_location', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in'},
                {data: 'neighboring_address_street', type: 'text'},
                {data: 'neighboring_house_number', type: 'text'},
                {data: 'neighboring_floor_number', type: 'text'},
            ];
            nestedHeaders = [
                ['Border direction', 'Name', 'Surname A', 'Surname B', 'Father Name', 'Location', 'Street Name', 'House Number', 'Floor Number']
            ];
            data = setSubTableData(deed_contents[cnt], row, startCol, endCol);
        } else if (subTableName === "way_of_payment") {
            var cnt = parentTableName.replace("deed_contents", "");
            var cols = [
                {data: 'way_of_payment', type: 'dropdown',
                    source: ['in advance', 'on delivery']},
                {data: 'payment_percentage', type: 'text'},
                {data: 'payment_provider_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in'},
                {data: 'payment_provider_surname', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_in")), vocab: 'surname_in'},
                {data: 'payment_provider_fathers_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in'},
                {data: 'payment_provider_status', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_capacity_role_in")), vocab: 'status_capacity_role_in'}
            ];
            nestedHeaders = [
                ['In advance/on delivery', 'Percentage', 'Name', 'Surname', "Father's Name", 'Status | Capacity | Role']
            ];
            data = setSubTableData(deed_contents[cnt], row, startCol, endCol);

        } else if (subTableName === "goods") {
            var cnt = parentTableName.replace("deed_contents", "");
            var cols = [
                {data: 'type_of_good', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("type_of_goods_in")), vocab: 'type_of_goods_in'},
                {data: 'good_quantity_value', type: 'text'},
                {data: 'good_quantity_unit', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("unit_in")), vocab: 'unit_in'}
            ];
            nestedHeaders = [
                ['Type of Good', 'Value', 'Unit']
            ];
            data = setSubTableData(deed_contents[cnt], row, startCol, endCol);

        }
        else if (subTableName === "Witness") {
            var cols = [
                {data: 'witness_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in'},
                {data: 'witness_surname', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_in")), vocab: 'surname_in'},
                {data: 'fathers_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in'},
                {data: 'witness_sex', type: 'dropdown', source: ['male', 'female']},
                {data: 'witness_profession', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("profession_in")), vocab: 'profession_in'},
                {data: 'witness_residence_location', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in'}
            ];
            nestedHeaders = [
                ['Name', 'Surname', "Father's Name", 'Sex', 'Proffesion', 'Location of residence']
            ];
            data = setSubTableData(deed_list_hot, row, startCol, endCol);

        } else if (subTableName === "Deed_relation") {

            var cols = [
                {data: 'number_of_book', type: 'text'},
                {data: 'number_of_deed', type: 'text'},
                {data: 'source_page_of_deed', type: 'text'},
                {data: 'creation_date_of_deed', type: 'date'}
            ];
            nestedHeaders = [
                ['Number of Book', 'Number of Deed', 'Source page of Deed', 'Creation Date of Deed']
            ];
            data = setSubTableData(deed_list_hot, row, startCol, endCol);

        } else if (subTableName === "contracting_party") {
            var cnt = parentTableName.replace("deed_contents", "");
            var cols = [
                {data: 'contracting_type', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("role_of_participation_in_notarial_deed_in")), vocab: 'role_of_participation_in_notarial_deed_in'},
                {data: 'relation_type_to_other_person', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("type_of_relation_in")), vocab: 'type_of_relation_in'},
                {data: 'link_other_person', type: 'text'},
                {data: 'contracting_person_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in'},
                {data: 'contracting_person_surname_a', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_in")), vocab: 'surname_in'},
                {data: 'contracting_person_surname_b', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_in")), vocab: 'surname_in'},
                {data: 'contracting_person_fathers_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in'},
                {data: 'contracting_person_age', type: 'text'},
                {data: 'contracting_person_sex', type: 'dropdown', source: ['male', 'female']},
                {data: 'contracting_person_marital_status', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("marital_status_in")), vocab: 'marital_status_in'},
                {data: 'contracting_person_proffesion', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("proffesion_in")), vocab: 'proffesion_in'},
                {data: 'contracting_person_origin_location', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in'},
                {data: 'contracting_person_residence_location', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in'}

            ];
            nestedHeaders = [
                ['Type', 'Type', 'Link to other Person', 'Name', 'Surname A', 'Surname B', "Father's Name", 'Age', 'Sex', 'Marital Status', 'Profession', 'Location of Origin', 'Location of Residence']
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
//tablesAndHeaders.set(tableId, ['Name *', 'Location', 'Type of Source', 'From', 'to/At', 'Note', 'Comment']);
tablesAndHeaders.set(tableId, [
    headerTooltip('Name *', 'The Archive or Library where the source is kept'),
    headerTooltip('Location', 'The Location where the Archive or Library is located'),
    headerTooltip('Source Type Name', 'Fixed: Notarial deeds of Barcelona, Notarial deeds of Galaxidi'),
    headerTooltip('From', 'year'),
    headerTooltip('to/At', 'year'),
    headerTooltip('Note', 'Note of the person that does the transcription of the source in relation to the source identity'),
    'Comment']);
tablesWithoutCommentCols.set(tableId, [0, 1, 5]); //define fieds that do not have external content

var sourcedata = [{ship_name: ''}];

var source_identity_cols = [
    {data: 'source_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_in")), vocab: 'organization_in'},
    {data: 'source_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in'},
    {data: 'source_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("source_type_name_in")), vocab: 'source_type_name_in'},
    {data: 'source_year_from', type: 'text'},
    {data: 'source_year_to', type: 'text'},
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
        [{label: 'Archive / Library', colspan: 2}, '', {label: headerTooltip('Date of Source *', 'the years covered by the source, added by the person doing the transcription'), colspan: 2}, '', ''],
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
        } else if (value && ((source_identity_cols[col].vocab === 'organization_in'))) {
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
            "hsep7": "---------",
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
//tablesAndHeaders.set(tableId, ['Number', 'Year', 'Source Pages', 'Reference Number', 'Creation Date', 'Type of Act', 'Name', 'Surname', "Father's Name", 'Name', 'Surname', "Father's Name", 'Sex', 'Profession', 'Location of Residence', 'Number of Book', 'Number of Deed', 'Source Page of Deed', 'Creation Date of Deed', 'Note', 'Content of Deed', 'Note', 'Comment']);
tablesAndHeaders.set(tableId, [
    headerTooltip('Number', 'The identification number of the book that included the specific deed'),
    headerTooltip('Year', 'The year at which the deeds included in the specific book have been created'),
    headerTooltip('Source Pages', 'The pages of the original source where this deed can be found'),
    headerTooltip('Reference Number', 'Number that gives a unique identity to the specific deed'),
    headerTooltip('Creation Date', 'The day that the deed was created'),
    headerTooltip('Type of Act', 'e.g. proxy, inheritance'),
    headerTooltip('Name', 'the name of the Notary that signed the deed'),
    headerTooltip('Surname', 'the surname of the Notary that signed the deed'),
    headerTooltip("Father's Name", "Father's Name"),
    headerTooltip('Name', 'the name of the witness that participated in the deed'),
    headerTooltip('Surname', 'the surname of the witness that participated in the deed'),
    headerTooltip("Father's Name", "Father's Name"),
    headerTooltip('Sex', 'the sex of the witness that participated in the deed'),
    headerTooltip('Profession', 'the profession of the witness that participated in the deed at documentation time'),
    headerTooltip('Location of Residence', 'the location of residence of the witness that participated in the deed at documentation time'),
    headerTooltip('Number of Book', 'The identification number of the book that included the related deed'),
    headerTooltip('Number of Deed', 'The identification number of the related deed'),
    headerTooltip('Source Page of Deed', 'The pages of the original source where the related deed can be found'),
    headerTooltip('Creation Date of Deed', 'The creation date of the related deed'),
    headerTooltip('Note', 'Note of the person that does the transcription of the source about the related deeds'),
    headerTooltip('Content of Deed', 'Content of Deed'),
    headerTooltip('Note', 'Note of the person that does the transcription of the source in relation to the specific deed'),
    'Comment'
]);
tablesWithoutCommentCols.set(tableId, [2, 3]); //define fieds that do not have external content



var deed_cols = [
    {data: 'book_number', type: 'text'},
    {data: 'book_year', type: 'text'},
    {data: 'source_pages', type: 'text'},
    {data: 'reference_number', type: 'text'},
    {data: 'creation_date', type: 'date'},
    {data: 'type_of_act', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("type_of_act_in")), vocab: 'type_of_act_in'},
    {data: 'notary_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in'},
    {data: 'notary_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_in")), vocab: 'surname_in'},
    {data: 'fathers_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in'},
    {data: 'witness_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in', renderer: groupRenderer},
    {data: 'witness_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_in")), vocab: 'surname_in', renderer: groupRenderer},
    {data: 'witness_fathers_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in', renderer: groupRenderer},
    {data: 'witness_sex', type: 'dropdown', source: ['male', 'female'], renderer: groupRenderer},
    {data: 'witness_profession', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("profession_in")), vocab: 'profession_in', renderer: groupRenderer},
    {data: 'witness_residence_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in', renderer: groupRenderer},
    {data: 'number_of_book', type: 'text', renderer: groupRenderer},
    {data: 'number_of_deed', type: 'text', renderer: groupRenderer},
    {data: 'source_page_of_deed', type: 'text', renderer: groupRenderer},
    {data: 'creation_date_of_deed', type: 'date', renderer: groupRenderer},
    {data: 'note_of_deed', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'deed_content', renderer: buttonRenderer, readOnly: true},
    {data: 'voyages_note', renderer: textRender, readOnly: true, type: 'text'},
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
    [{label: 'Book', colspan: 2}, '', '', '', '', {label: 'Notary', colspan: 3}, {label: 'Witness', colspan: 6}, {label: 'Relation to other Deed', colspan: 5}, '', '', ''],
    tablesAndHeaders.get(tableId)
];

var deeds_tableGroups = [[9, 14], [15, 18]];
headers = markHeaders(headers, deeds_tableGroups);

var deed_locs = new Object();
var deed_persons = new Object();
var deed_tbl = new Object();

var deed_list_hot = new Handsontable(cont, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: [{deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}, {deed_referene_number: ""}],
    columns: deed_cols,
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
        if (col > 8 && col < 15) {
            groupLeftClicked(this, row, col);
        } else if (col > 14 && col < 19) {
            groupLeftClicked(this, row, col);
        }
    }
});


deed_list_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(deed_cols[col].vocab);
            } else if (key === 'add') {
                var colClicked = deed_list_hot.getSelectedRange().to.col;
                var rowClicked = deed_list_hot.getSelectedRange().to.row;
                if (colClicked > 8 && colClicked < 15) {
                    groupClicked("deed_list", "Witness", rowClicked, 9, 14);
                } else if (colClicked > 14 && colClicked < 19) {
                    groupClicked("deed_list", "Deed_relation", rowClicked, 15, 18);
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
                    return deed_list_hot.countRows() - 1 !== deed_list_hot.getSelected()[0];
                },
                callback: function() {
                    this.alter('insert_row', this.getSelected()[0] + 1, 10);
                }
            },
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function() {
                    var col = deed_list_hot.getSelectedRange().to.col;
                    var label = deed_cols[col].vocab;
                    if (label) {
                        update_Vocs();
                        return deed_list_hot.getSelectedRange().to.col !== col;
                    } else {
                        return deed_list_hot.getSelectedRange().to.col !== -1;
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
    {data: 'contracting_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("role_of_participation_in_notarial_deed_in")), vocab: 'role_of_participation_in_notarial_deed_in', renderer: groupRenderer},
    {data: 'relation_type_to_other_person', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("type_of_relation_in")), vocab: 'type_of_relation_in', renderer: groupRenderer},
    {data: 'link_other_person', type: 'text'},
    {data: 'contracting_person_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in', renderer: groupRenderer},
    {data: 'contracting_person_surname_a', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_in")), vocab: 'surname_in', renderer: groupRenderer},
    {data: 'contracting_person_surname_b', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_in")), vocab: 'surname_in', renderer: groupRenderer},
    {data: 'contracting_person_fathers_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in', renderer: groupRenderer},
    {data: 'contracting_person_age', type: 'text'},
    {data: 'contracting_person_sex', type: 'dropdown', source: ['male', 'female'], renderer: groupRenderer},
    {data: 'contracting_person_marital_status', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("marital_status_in")), vocab: 'marital_status_in', renderer: groupRenderer},
    {data: 'contracting_person_proffesion', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("proffesion_in")), vocab: 'proffesion_in', renderer: groupRenderer},
    {data: 'contracting_person_origin_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in', renderer: groupRenderer},
    {data: 'contracting_person_residence_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in', renderer: groupRenderer},
    ////////////////////////////////////////////////////////////////////////////

    {data: 'deed_description', renderer: textRender, readOnly: true, type: 'text'},
    ///////////////////////////////Cost/////////////////////////////////////////    
    {data: 'cost_value', type: 'text'},
    {data: 'cost_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_in")), vocab: 'unit_in'},
    //////////////////////////////////SHIP//////////////////////////////////////
    {data: 'ship_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_in")), vocab: 'ship_name_in'},
    {data: 'ship_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_type_in")), vocab: 'ship_type_in'},
    {data: 'ship_tonnage', type: 'text'},
    {data: 'ship_flag', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("flag_in")), vocab: 'flag_in'},
    {data: 'ship_construction_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in'},
    {data: 'ship_construction_year', type: 'text'},
    {data: 'ship_registry_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in'},
    {data: 'ship_registry_number', type: 'text'},
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////Immobile Property////////////////////////////////    
    {data: 'immobile_property_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("type_of_property_in")), vocab: 'type_of_property_in'},
    {data: 'acquisition_date', type: 'date'},
    {data: 'property_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in'},
    {data: 'street_name', type: 'text'},
    {data: 'house_number', type: 'text'},
    {data: 'floor_number', type: 'text'},
    {data: 'property_size_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("type_of_measurement_in")), vocab: 'type_of_measurement_in', renderer: groupRenderer},
    {data: 'property_size_value', type: 'text', renderer: groupRenderer},
    {data: 'property_size_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_in")), vocab: 'unit_in', renderer: groupRenderer},
    {data: 'border_direction', type: 'dropdown',
        source: ['N', 'S', 'W', 'E', 'NW', 'NE', 'SW', 'SE'], renderer: groupRenderer},
    {data: 'owner_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in', renderer: groupRenderer},
    {data: 'owner_surname_a', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_in")), vocab: 'surname_in', renderer: groupRenderer},
    {data: 'owner_surname_b', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_in")), vocab: 'surname_in', renderer: groupRenderer},
    {data: 'owner_father_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in', renderer: groupRenderer},
    {data: 'neighboring_address_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in', renderer: groupRenderer},
    {data: 'neighboring_address_street', type: 'text', renderer: groupRenderer},
    {data: 'neighboring_house_number', type: 'text', renderer: groupRenderer},
    {data: 'neighboring_floor_number', type: 'text', renderer: groupRenderer},
    {data: 'type_of_good', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("type_of_goods_in")), vocab: 'type_of_goods_in', renderer: groupRenderer},
    {data: 'good_quantity_value', type: 'text', renderer: groupRenderer},
    {data: 'good_quantity_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_in")), vocab: 'unit_in', renderer: groupRenderer},
    {data: 'way_of_payment', type: 'dropdown',
        source: ['in advance', 'on delivery'], renderer: groupRenderer},
    {data: 'payment_percentage', type: 'text', renderer: groupRenderer},
    {data: 'payment_provider_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in', renderer: groupRenderer},
    {data: 'payment_provider_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_in")), vocab: 'surname_in', renderer: groupRenderer},
    {data: 'payment_provider_fathers_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in', renderer: groupRenderer},
    {data: 'payment_provider_status', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_in")), vocab: 'status_capacity_role_in', renderer: groupRenderer},
    {data: 'transcription_from_source', renderer: textRender, readOnly: true, type: 'text'},
    // {data: 'content_deed_contracting_party_residence', type: 'dropdown',
    //     source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr', renderer: groupRenderer},

    {data: 'deed_description', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];

var deed_contentsGroups = [[0, 12], [30, 32], [33, 41], [42, 44], [45, 50]];



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
            "<span class='pull-right glyphicon glyphicon-remove'></span>" + "Content of deed " + plus + table_header +
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
//        tablesAndHeaders.set('deed_contents', ['Type', 'Type', 'Link to other Person', 'Name', 'Surname A', 'Surname B', "Father's Name", 'Age', 'Sex', 'Marital Status', 'Profession', 'Location of Origin', 'Location of Residence', 'Description of Deed', 'Value', 'Unit', 'Ship Name', 'Ship Type', 'Tonnage', 'Flag', 'Location', 'Year', 'Location', 'Number', 'Type of Property', 'Date of Acquisition', 'Location', 'Street Name', 'House Number', 'Floor Number', 'Type', 'Value', 'Unit', 'Border direction', 'Name', 'Surname A', 'Surname B', 'Father Name', 'Location', 'Street Name', 'House Number', 'Floor Number', 'Type of Good', 'Value', 'Unit', 'In advance/on delivery', 'Percentage', 'Name', 'Surname', "Father's Name", 'Status | Capacity | Role', 'Trasncription from Source', 'Note', 'Comment']);
        tablesAndHeaders.set('deed_contents', [
            headerTooltip('Type', 'e.g. participant, buyer, seller, debtor, creditor, ...'),
            headerTooltip('Type', 'The type of relation with another contracting person'),
            headerTooltip('Link to other Person', 'Link to other Person'),
            headerTooltip('Name', 'Name of the contracting party'),
            headerTooltip('Surname A', 'First surname of the contracting party'),
            headerTooltip('Surname B', 'Second surname of the contracting party'),
            headerTooltip("Father's Name", "Father's Name"),
            headerTooltip('Age', 'Age of the contracting party'),
            headerTooltip('Sex', 'Sex of the contracting party'),
            headerTooltip('Marital Status', 'Marital status of the contracting party: Widow, Married, Single etc. at documentation tim'),
            headerTooltip('Profession', 'Profession of the contracting party at documentation time'),
            headerTooltip('Location of Origin', 'Location of origin of the contracting party'),
            headerTooltip('Location of Residence', 'Location of residence of the contracting party at documentation time'),
            headerTooltip('Description of Deed', 'The description of the deed as it is transferred from the person that does the transcription of the source in his own words'),
            headerTooltip('Value', 'Value of the amount negotiated in the deed'),
            headerTooltip('Unit', 'Unit'),
            headerTooltip('Ship Name', 'Name of the ship negotiated in the deed'),
            headerTooltip('Ship Type', 'Type of the ship negotiated in the deed: e.g. steamship'),
            headerTooltip('Tonnage', 'Tonnage of the ship negotiated in the deed'),
            headerTooltip('Flag', 'The country to which the ship negotiated in the deed is registered'),
            headerTooltip('Location', 'The place where the ship negotiated in the deed was constructed'),
            headerTooltip('Year', 'The year of construction of  the ship negotiated in the deed'),
            headerTooltip('Location', 'The location of registry of  the ship negotiated in the deed'),
            headerTooltip('Number', 'The number of registry of  the ship negotiated in the deed'),
            headerTooltip('Type of Property', 'The type of property negotiated in the deed: e.g. house, land'),
            headerTooltip('Date of Acquisition', 'The date at which the property negotiated in the deed was bought by the person that was the owner before the deed'),
            headerTooltip('Location', 'The location where the property negotiated in the deed is placed'),
            headerTooltip('Street Name', 'Street Name'),
            headerTooltip('House Number', 'House Number'),
            headerTooltip('Floor Number', 'Floor Number'),
            headerTooltip('Type', 'The e.g. length or height of the property negotiated in the deed'),
            headerTooltip('Value', 'Value'),
            headerTooltip('Unit', 'e.g. feet or meter'),
            headerTooltip('Border direction', 'The direction of the the property negotiated in the deed which neighbours with this property'),
            headerTooltip('Name', 'Name of the owner of neighboring property to the property negotiated in the deed'),
            headerTooltip('Surname A', 'First surname of the owner of neighboring property to the property negotiated in the deed'),
            headerTooltip('Surname B', 'Second surname of the owner of neighboring property to the property negotiated in the deed'),
            headerTooltip('Father Name', 'Father name of the owner of neighboring property to the property negotiated in the deed'),
            headerTooltip('Location', 'Location'),
            headerTooltip('Street Name', 'Street Name'),
            headerTooltip('House Number', 'House Number'),
            headerTooltip('Floor Number', 'Floor Number'),
            headerTooltip('Type of Good', 'Type of good negotiated in the deed e.g. Silver spoon'),
            headerTooltip('Value', 'Value'),
            headerTooltip('Unit', 'Unit'),
            headerTooltip('In advance/on delivery', 'Whether the amount of money dealt in the deed was payed in advance or  on delivery'),
            headerTooltip('Percentage', 'In some cases, when e.g. we have a contract for the sale of wood,  the payment is made in installments, at different people and different timing (e.g. upfront, at delivery etc) who get a percentage of the payments.'),
            headerTooltip('Name', 'The name of the person authorized by this act to provide the money to the beneficiary'),
            headerTooltip('Surname', 'The surname of the person authorized by this act to provide the money to the beneficiary'),
            headerTooltip("Father's Name", "Father's Name"),
            headerTooltip('Status | Capacity | Role', 'The profession or role of the person authorized by this act to provide the money to the beneficiary'),
            headerTooltip('Trasncription from Source', 'Some part of the source that might clarify information that does not fit in other fields of this table, exactly as it is written in the source'),
            headerTooltip('Note', 'Note of the person that does the transcription of the source in relation to the content of the deed'),
            'Comment'
        ]);
        var container = document.getElementById(tableId);

        var headers = [
            [{label: '', colspan: 13}, '', {label: '', colspan: 2}, {label: '', colspan: 8}, {label: 'Immobile Property', colspan: 18}, {label: '', colspan: 3}, {label: '', colspan: 6}, '', ''],
            [{label: 'Contracting Party', colspan: 13}, '', {label: '', colspan: 2}, {label: 'Ship', colspan: 8}, '', '', {label: '', colspan: 4}, {label: '', colspan: 3}, {label: 'Neighboring property', colspan: 9}, {label: headerTooltip("Goods", "Important types of goods negotiated in the deed"), colspan: 3}, {label: 'Way of Payment', colspan: 6}, '', '', ''],
            ['', {label: 'Relation to Other Person', colspan: 2}, '', '', '', '', '', '', '', '', '', '', '', {label: 'Cost', colspan: 2}, {label: '', colspan: 4}, {label: 'Construction', colspan: 2}, {label: 'Registry', colspan: 2}, '', '', {label: 'Location of Property', colspan: 4}, {label: 'Size', colspan: 3}, '', {label: 'Owner', colspan: 4}, {label: headerTooltip("Address", "Address of the neighboring property to the property negotiated in the deed"), colspan: 4}, '', {label: 'Quantity', colspan: 2}, '', '', {label: 'Provider', colspan: 4}, '', ''],
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
                if (col > 0 && col < 13) {
                    groupLeftClicked(this, row, col);
                } else if (col > 29 && col < 33) {
                    groupLeftClicked(this, row, col);
                } else if (col > 32 && col < 42) {
                    groupLeftClicked(this, row, col);
                } else if (col > 41 && col < 45) {
                    groupLeftClicked(this, row, col);
                } else if (col > 44 && col < 50) {
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
                    } else if (key === 'view_add') {
                        var col = options.start.col;
                        var row = options.start.row;
                        var value = voyage_transaction.getDataAtCell(options.start.row, options.start.col);
                        var label = transaction_columns[col].vocab;
                        create_location_modal(tableId, value, row, col, label);
                    } else if (key === 'add') {
                        var colClicked = voyage_transaction.getSelectedRange().to.col;
                        var rowClicked = voyage_transaction.getSelectedRange().to.row;
                        if (colClicked > -1 && colClicked < 13) {
                            groupClicked(tableId, "contracting_party", rowClicked, 0, 12);
                        } else if (colClicked > 29 && colClicked < 33) {
                            groupClicked(tableId, "size", rowClicked, 30, 32);
                        } else if (colClicked > 32 && colClicked < 42) {
                            groupClicked(tableId, "neighboring_property", rowClicked, 33, 41);
                        } else if (colClicked > 44 && colClicked < 51) {
                            groupClicked(tableId, "way_of_payment", rowClicked, 45, 50);
                        } else if (colClicked > 41 && colClicked < 45) {
                            groupClicked(tableId, "goods", rowClicked, 42, 44);
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
                    "view_add": {
                        name: "Add/View extra Location info",
                        hidden: function() {
                            var col = voyage_transaction.getSelectedRange().to.col;
                            var label = transaction_columns[col].vocab;
                            if (typeof label === "undefined") {
                                return false;
                            }
                            if (label.indexOf("location_") !== -1) {
                                return false;
                            } else {
                                return true;
                            }
                        }},
                    "hsep7": "---------",
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
            $('#heading' + cnt).children().children().html('<span class="pull-right glyphicon glyphicon-remove"></span>Content of deed ' + plus + ' / Reference Number : ' + header);
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
    var list_of_deeds = createJson(deed_list_hot, deed_cols, usage);

    var content_keys = Object.keys(deed_contents);

    var json = new Object();
    var content_of_deeds = new Object();

    if (((usage === 'excel') && (nested_tables)) || ((mode === 'teamView') && (nested_tables))) {

        $.each(nested_tables, function(cnt) {
            var nested_data = new Array();

            $.each(this, function() {
                nested_data.push(this);
            });
            console.log('exporting nested table: ' + cnt);
            createNestedTable(cnt, nested_data);
            $(".nested_table").hide();
            content_of_deeds[cnt] = createJson((deed_contents[cnt]), transaction_columns, usage);
        });
        nested_tables = null;

    } else {
        content_of_deeds = nested_tables_object;
        for (var i = 0; i < content_keys.length; i++) {
            content_of_deeds[content_keys[i]] = createJson((deed_contents[content_keys[i]]), transaction_columns, usage);
        }
    }



    cat_info.date_until = getCurrentDate();
    catalogue_info.setDataAtCell(0, 2, getCurrentDate());
    json['record_information'] = cat_info;
    json['source_identity'] = source_id;
    json['list_of_deeds'] = list_of_deeds;
    json['contents_of_deed'] = content_of_deeds;


    ////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////



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
        terms = new Object();
        var deed_persons = new Object();
        var persons_tbl = new Object();
        var deed_locs = new Object();

        $.each(list_of_deeds, function(row) {
            var row_data = this;
            $.each(this, function(col) {
                var val = this.toString();
                $.each(deed_cols, function(col_no) {
                    if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                        var label = $(this).attr('vocab');
                        handle_json_vocs(val, label, row, col, col_no, 'list_of_deed', terms);
                    }

                });

                ////////////////////////////////////////////////////////////////
                if ((col === 'notary_surname')) {
                    if (row_data['notary_name']) {
                        handle_multiple_table_instances(row + "_", 6, row_data['notary_name'], 'list_of_deed', [6, 7, 8], ['name', 'surname_a', 'fathers_name'], deed_persons, persons_tbl, 'PERSONS');
                    }
                    if (row_data['notary_surname']) {
                        handle_multiple_table_instances(row + "_", 7, row_data['notary_surname'], 'list_of_deed', [6, 7, 8], ['name', 'surname_a', 'fathers_name'], deed_persons, persons_tbl, 'PERSONS');
                    }
                    if (row_data['fathers_name']) {
                        handle_multiple_table_instances(row + "_", 8, row_data['fathers_name'], 'list_of_deed', [6, 7, 8], ['name', 'surname_a', 'fathers_name'], deed_persons, persons_tbl, 'PERSONS');
                    }
                } else if ((col === 'fathers_name') && row_data['notary_surname']) {
                    if (row_data['fathers_name']) {
                        handle_multiple_table_instances(row + "__", 8, row_data['fathers_name'], 'list_of_deed', [8, 7], ['name', 'surname_a'], deed_persons, persons_tbl, 'PERSONS');
                    }
                    if (row_data['notary_surname']) {
                        handle_multiple_table_instances(row + "__", 7, row_data['notary_surname'], 'list_of_deed', [8, 7], ['name', 'surname_a'], deed_persons, persons_tbl, 'PERSONS');
                    }
                } else if ((col === 'witness_surname')) {
                    if (row_data['witness_name']) {
                        handle_multiple_table_instances(row + "___", 9, row_data['witness_name'], 'list_of_deed', [9, 10, 11], ['name', 'surname_a', 'fathers_name'], deed_persons, persons_tbl, 'PERSONS');
                    }                    
                        handle_multiple_table_instances(row + "___", 10, row_data['witness_surname'], 'list_of_deed', [9, 10, 11], ['name', 'surname_a', 'fathers_name'], deed_persons, persons_tbl, 'PERSONS');                    
                    if (row_data['witness_fathers_name']) {
                        handle_multiple_table_instances(row + "___", 11, row_data['witness_fathers_name'], 'list_of_deed', [9, 10, 11], ['name', 'surname_a', 'fathers_name'], deed_persons, persons_tbl, 'PERSONS');
                    }
                    
                }
                else if ((col === 'witness_fathers_name') && row_data['witness_surname']) {
                    if (row_data['witness_fathers_name']) {
                        handle_multiple_table_instances(row + "____", 11, row_data['witness_fathers_name'], 'list_of_deed', [11, 9], ['name', 'surname_a'], deed_persons, persons_tbl, 'PERSONS');
                    }
                    if (row_data['witness_surname']) {
                        handle_multiple_table_instances(row + "____", 9, row_data['witness_surname'], 'list_of_deed', [11, 9], ['name', 'surname_a'], deed_persons, persons_tbl, 'PERSONS');
                    }
                } else if ((col === 'witness_residence_location')) {
                    if (row_data['witness_residence_location']) {
                        handle_multiple_table_instances(row, 14, row_data['witness_residence_location'], 'list_of_deed', null, null, deed_locs, null, 'LOCS');
                    }
                }
            });
        });
        ///////////////////////////////////////////////////////////////////////

        $.each(content_of_deeds, function(cnt) {
            var deed_persons = new Object();
            var deed_locs = new Object();
            var persons_tbl = new Object();
            var ship_obj = new Object();
            var ships_tbl = new Object();
            var terms = new Object();

            console.log('----- creating instances for nested table : ' + cnt + '----------');
            $.each(this, function(row) {
                var row_data = this;
                $.each(this, function(col) {
                    ///////////////////////////////////////////   
                    var val = this;
                    $.each(transaction_columns, function(col_no) {
                        if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                            var label = $(this).attr('vocab');
                            handle_vocabulary(val, label, this);
                            handle_json_vocs(val, label, row, col, col_no, 'content_of_deed_' + cnt, terms);
                        }
                    });
                    /////////////////////////////////////
                    if ((col === 'contracting_person_surname_a') && (row_data['contracting_person_surname_a'])) {
                        if (row_data['contracting_person_name']) {
                            handle_multiple_table_instances(row, 3, row_data['contracting_person_name'], 'content_of_deed_' + cnt, [3, 4, 5, 6,11], ['name', 'surname_a', 'surname_b', 'fathers_name','place_of_birth'], deed_persons, persons_tbl, 'PERSONS');
                        }
                        if (row_data['contracting_person_surname_a']) {
                            handle_multiple_table_instances(row, 4, row_data['contracting_person_surname_a'], 'content_of_deed_' + cnt, [3, 4, 5, 6,11], ['name', 'surname_a', 'surname_b', 'fathers_name','place_of_birth'], deed_persons, persons_tbl, 'PERSONS');
                        }
                        if (row_data['contracting_person_surname_b']) {
                            handle_multiple_table_instances(row, 5, row_data['contracting_person_surname_b'], 'content_of_deed_' + cnt, [3, 4, 5, 6,11], ['name', 'surname_a', 'surname_b', 'fathers_name','place_of_birth'], deed_persons, persons_tbl, 'PERSONS');
                        }
                        if (row_data['contracting_person_fathers_name']) {
                            handle_multiple_table_instances(row, 6, row_data['contracting_person_fathers_name'], 'content_of_deed_' + cnt, [3, 4, 5, 6,11], ['name', 'surname_a', 'surname_b', 'fathers_name','place_of_birth'], deed_persons, persons_tbl, 'PERSONS');
                        }
                        if (row_data['contracting_person_origin_location']) {
                            handle_multiple_table_instances(row, 11, row_data['contracting_person_origin_location'], 'content_of_deed_' + cnt, [3, 4, 5, 6,11], ['name', 'surname_a', 'surname_b', 'fathers_name','place_of_birth'], deed_persons, persons_tbl, 'PERSONS');
                        }
                        
                    }
                    else if ((col === 'contracting_person_fathers_name') && (row_data['contracting_person_surname_a'])) {
                        if (row_data['contracting_person_fathers_name']) {
                            handle_multiple_table_instances(row + '____', 6, row_data['contracting_person_fathers_name'], 'content_of_deed_' + cnt, [6, 4], ['name', 'surname_a'], deed_persons, persons_tbl, 'PERSONS');
                        }
                        handle_multiple_table_instances(row + '____', 4, row_data['contracting_person_surname_a'], 'content_of_deed_' + cnt, [6, 4], ['name', 'surname_a'], deed_persons, persons_tbl, 'PERSONS');
                    }
                    else if ((col === 'owner_surname_a')) {
                        if (row_data['owner_name'] && (row_data['owner_name'] !== " ") && (row_data['owner_name'] !== " ")) {
                            handle_multiple_table_instances(row + '_', 34, row_data['owner_name'], 'content_of_deed_' + cnt, [34, 35, 36, 37], ['name', 'surname_a', 'surname_b', 'fathers_name'], deed_persons, persons_tbl, 'PERSONS');
                        }
                        if (row_data['owner_surname_a']) {
                            handle_multiple_table_instances(row + "_", 35, row_data['owner_surname_a'], 'content_of_deed_' + cnt, [34, 35, 36, 37], ['name', 'surname_a', 'surname_b', 'fathers_name'], deed_persons, persons_tbl, 'PERSONS');
                        }
                        if (row_data['owner_surname_b']) {
                            handle_multiple_table_instances(row + '_', 36, row_data['owner_surname_b'], 'content_of_deed_' + cnt, [34, 35, 36, 37], ['name', 'surname_a', 'surname_b', 'fathers_name'], deed_persons, persons_tbl, 'PERSONS');
                        }
                        if (row_data['owner_father_name']) {
                            handle_multiple_table_instances(row + '_', 37, row_data['owner_father_name'], 'content_of_deed_' + cnt, [34, 35, 36, 37], ['name', 'surname_a', 'surname_b', 'fathers_name'], deed_persons, persons_tbl, 'PERSONS');
                        }
                    }

                    else if ((col === 'owner_father_name') && (row_data['owner_surname_a'])) {
                        if (row_data['owner_father_name']) {
                            handle_multiple_table_instances(row + '_____', 37, row_data['owner_father_name'], 'content_of_deed_' + cnt, [37, 35], ['name', 'surname_a'], deed_persons, persons_tbl, 'PERSONS');
                        }
                        if (row_data['owner_surname_a']) {
                            handle_multiple_table_instances(row + '_____', 35, row_data['owner_surname_a'], 'content_of_deed_' + cnt, [37, 35], ['name', 'surname_a'], deed_persons, persons_tbl, 'PERSONS');
                        }
                    }
                    else if ((col === 'payment_provider_surname') && (row_data['payment_provider_surname'])) {
                        if (row_data['payment_provider_name'] && (row_data['payment_provider_name'] !== " ") && (row_data['payment_provider_name'] !== " ")) {
                            handle_multiple_table_instances(row + '__', 47, row_data['payment_provider_name'], 'content_of_deed_' + cnt, [47, 48, 49], ['name', 'surname_a', 'fathers_name'], deed_persons, persons_tbl, 'PERSONS');
                        }
                        if (row_data['payment_provider_surname'] && (row_data['payment_provider_name'] !== " ") && (row_data['payment_provider_name'] !== " ")) {
                            handle_multiple_table_instances(row + "__", 48, row_data['payment_provider_surname'], 'content_of_deed_' + cnt, [47, 48, 49], ['name', 'surname_a', 'fathers_name', 'status'], deed_persons, persons_tbl, 'PERSONS');
                        }
                        if (row_data['payment_provider_fathers_name']) {
                            handle_multiple_table_instances(row + '__', 49, row_data['payment_provider_fathers_name'], 'content_of_deed_' + cnt, [47, 48, 49], ['name', 'surname_a', 'fathers_name'], deed_persons, persons_tbl, 'PERSONS');
                        }
                        /*if (row_data['payment_provider_status']) {
                            handle_multiple_table_instances(row + '__', 50, row_data['payment_provider_status'], 'content_of_deed_' + cnt, [47, 48, 49, 50], ['name', 'surname_a', 'fathers_name', 'status'], deed_persons, persons_tbl, 'PERSONS');
                        }*/
                    }
                    else if ((col === 'payment_provider_fathers_name') && (row_data['payment_provider_name'])) {
                        if (row_data['payment_provider_fathers_name']) {
                            handle_multiple_table_instances(row + '______', 49, row_data['payment_provider_fathers_name'], 'content_of_deed_' + cnt, [49, 48], ['name', 'surname_a'], deed_persons, persons_tbl, 'PERSONS');
                        }
                        if (row_data['payment_provider_surname'] && (row_data['payment_provider_name'] !== " ") && (row_data['payment_provider_name'] !== " ")) {
                            handle_multiple_table_instances(row + '______', 48, row_data['payment_provider_surname'], 'content_of_deed_' + cnt, [49, 48], ['name', 'surname_a'], deed_persons, persons_tbl, 'PERSONS');
                        }
                    }
                    //////////////////ships    
                    else if ((col === 'ship_name')) {
                        if (row_data['ship_name']) {
                            handle_ships(row, 16, row_data['ship_name'], 'content_of_deed_' + cnt, [16, 17, 22, 23], ['name', 'type', 'registration_number', 'registration_location'], 'SHIPS', ship_obj, ships_tbl);
                        }
                        if (row_data['ship_type']) {
                            handle_ships(row, 17, row_data['ship_type'], 'content_of_deed_' + cnt, [16, 17, 22, 23], ['name', 'type', 'registration_number', 'registration_location'], 'SHIPS', ship_obj, ships_tbl);
                        }
                        if (row_data['ship_registry_location']) {
                            handle_ships(row, 22, row_data['ship_registry_location'], 'content_of_deed_' + cnt, [16, 17, 22, 23], ['name', 'type', 'registration_number', 'registration_location'], 'SHIPS', ship_obj, ships_tbl);
                        }
                        if (row_data['ship_registry_number']) {
                            handle_ships(row, 23, row_data['ship_registry_number'], 'content_of_deed_' + cnt, [16, 17, 22, 23], ['name', 'type', 'registration_number', 'registration_location'], 'SHIPS', ship_obj, ships_tbl);
                        }
                    }
                    ///////////////////////////locations
                    else if (col === 'contracting_person_origin_location') {
                        handle_multiple_table_instances(row, 11, this.toString(), 'content_of_deed_' + cnt, null, null, deed_locs, null, 'LOCS');
                    } else if (col === 'contracting_person_residence_location') {
                        handle_multiple_table_instances(row, 12, this.toString(), 'content_of_deed_' + cnt, null, null, deed_locs, null, 'LOCS');
                    } else if (col === 'ship_construction_location') {
                        handle_multiple_table_instances(row, 20, this.toString(), 'content_of_deed_' + cnt, null, null, deed_locs, null, 'LOCS');
                    } else if (col === 'ship_registry_location') {
                        handle_multiple_table_instances(row, 22, this.toString(), 'content_of_deed_' + cnt, null, null, deed_locs, null, 'LOCS');
                    } else if (col === 'property_location') {
                        handle_multiple_table_instances(row, 26, this.toString(), 'content_of_deed_' + cnt, null, null, deed_locs, null, 'LOCS');
                    } else if (col === 'neighboring_address_location') {
                        handle_multiple_table_instances(row, 38, this.toString(), 'content_of_deed_' + cnt, null, null, deed_locs, null, 'LOCS');
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

    console.log(data);
    record_status = status;
    clear_LocalStorage_instances();


    catalogue_info.loadData(data.record_information);
    source_identity_data.loadData(data.source_identity);

    var voyages_data = new Array();
    $.each(data.list_of_deeds, function() {
        voyages_data.push(this);
    });

    deed_list_hot.loadData(voyages_data);
    $('.nested_table').remove();

    if (data.contents_of_deed) {
        $.each(data.contents_of_deed, function(cnt) {

            nested_tables_object = data.contents_of_deed;
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
    var json = createRecordJson();
    var temp = JSON.stringify(json);
    temp = temp.replace(/&nbsp;/g, "");
    json = JSON.parse(temp);

    var contents = new Array();
    $.each(json.contents_of_deed, function(cnt) {
        $.each(this, function() {
            contents.push(Object.assign({}, (json.list_of_deeds[cnt]), (this)));
        });
    });

    if (contents.length < 1) {
        contents.push('');
    }

    var sheets = new Array();
    sheets.push([json.record_information]);
    sheets.push([json.source_identity]);
    sheets.push(json.list_of_deeds);
    sheets.push(contents);

    var nestedGroups = createMultipleNestedTables(json['contents_of_deed'], deed_contentsGroups, deed_cols, transaction_columns);
    var result = createExcelSheetsData(sheets, nestedGroups);


    var opts = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Source Identity', header: false}, {sheetid: 'List of Deeds', header: true}, {sheetid: 'Content of Deeds', header: true}];
    var res = alasql('SELECT * INTO XLSX("' + $('#unique_filename').text() + '.xlsx",?) FROM ?', [opts, result]);

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
    tmp['record_information']['related_organization'] = 'FORTH/IMS';
    tmp['record_information']['record_id'] = recordId;
    tmp['record_information']['template_type'] = templateTitle;
    tmp['source_identity'] = json.source_identity;
    tmp['source_identity']['source_language'] = 'Greek';

    tmp['list_of_deeds'] = nested_with_Groups(json.contents_of_deed, json.list_of_deeds, deed_contentsGroups, transaction_columns, 'deed_content', 'deed_', deed_cols);//nested_content;


    root['root'] = tmp;
    var xml = formatXml(json2xml(root));

    console.log(root);


    //  xml = xml.replace(/_#_(\d+)/g, '');

    xml = xml.replace(/<deed_(\d+)>/g, '<deed index="$1">');
    xml = xml.replace(/<\/deed_(\d+)>/g, "</deed>");

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

        tables.push(catalogue_info, source_identity_data, deed_list_hot);
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
                old_val = deed_list_hot.getDataAtCell(this.row, this.col, value);
                deed_list_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
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
        deed_list_hot.setDataAtCell(row, col, val);
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


