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

        else if (subTableName.indexOf("status_capacities") !== -1) {
            var cnt = parentTableName.replace("analytic_personnel", "");
            var cols = [
                {data: 'status_capacity_role',
                    type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_capacity_role_it")), vocab: 'status_capacity_role_it'},
                {data: 'location_of_work', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
                {data: 'sector', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("sector_it")), vocab: 'sector_it', vocab:'sector_it'}
            ];
            nestedHeaders = [
                ['Status | Capacity | Role', 'Location of Work', 'Sector']
            ];
            data = setSubTableData(analytic_personnels[cnt], row, startCol, endCol);
        }

        else if (subTableName.indexOf("current_Owners") !== -1) {
            var cnt = parentTableName.replace("list_of_Ship", "");
            var cols = [
                {data: 'owner_org_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("organization_it")), vocab: 'organization_it'},
                {data: 'owner_org_location', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
                {data: 'owner_person_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it'},
                {data: 'owner_person_surname', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_it")), vocab: 'surname_it'},
                {data: 'owner_person_fathers_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it'},
                {data: 'owner_person_residence', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
                {data: 'owner_person_A_type', type: 'dropdown',
                    source: ['Husband', 'Widow']},
                {data: 'owner_person_A_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it'},
                {data: 'owner_person_A_surname', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_it")), vocab: 'surname_it'},
                {data: 'owner_person_A_fathers_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it'},
                {data: 'owner_person_B_type', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("person_type_it")), vocab: 'person_type_it'},
                {data: 'owner_person_B_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it'},
                {data: 'owner_person_B_surname', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_it")), vocab: 'surname_it'},
                {data: 'owner_person_B_fathers_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it'},
                {data: 'part_in_ownership', type: 'text'},
                {data: 'owners_note', type: 'text'}
            ];
            nestedHeaders = [
                [{label: 'Owner (Organization)', colspan: 2}, {label: 'Owner (Person)', colspan: 4}, {label: 'Related Person A', colspan: 4}, {label: 'Related Person B', colspan: 4}, {label: '', colspan: 2}],
                ['Name', 'Headquarter Location', 'Name', 'Surname', 'Fathers Name', 'Residence', 'Type', 'Name', 'Surname', 'Fathers Name', 'Type', 'Name', 'Surname', 'Fathers Name', 'Part in Ownership', 'Owners Note']
            ];
            data = setSubTableData(analytic_Ship_List[cnt], row, startCol, endCol);
        }
        else if (subTableName.indexOf("change_Ownership") !== -1) {
            var cnt = parentTableName.replace("list_of_Ship", "");
            var cols = [
                {data: 'change_in_ownership', type: 'dropdown',
                    source: ['New', 'Previous']},
                {data: 'owners_nationality', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("nationality_it")), vocab: 'nationality_it'},
                {data: 'flag', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("flag_it")), vocab: 'flag_it'},
                {data: 'change_ship_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("ship_name_it")), vocab: 'ship_name_it'},
                {data: 'changed_ship_type', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("ship_type_it")), vocab: 'ship_type_it'},
                {data: 'changed_owner_tonnage', type: 'text'},
                {data: 'changed_owner_related_location', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
                {data: 'changed_owner_related_date', type: 'text'},
                {data: 'changed_owner_note', type: 'text'}
            ];
            nestedHeaders = [
                ['Type', 'Owner Nationality', 'Flag', 'Ship Name', 'Ship Type', 'Tonnage', 'Related Location', 'Related Date', 'Event Note']
            ];
            data = setSubTableData(analytic_Ship_List[cnt], row, startCol, endCol);
        }
        else if (subTableName.indexOf("disappear_event_table") !== -1) {
            var cnt = parentTableName.replace("list_of_Ship", "");
            var cols = [
                {data: 'disappear_event_type', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("event_type_it")), vocab: 'event_type_it'},
                {data: 'disappear_event_location', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
                {data: 'disappear_event_date', type: 'date'},
                {data: 'disappear_event_note', type: 'text'}
            ];
            nestedHeaders = [
                ['Type', 'Related Location', 'Related Date', 'Event Note']
            ];
            data = setSubTableData(analytic_Ship_List[cnt], row, startCol, endCol);
        }
        subTable = createSubTableInstance(tableId, data, cols, nestedHeaders);

    }


    subTable = createSubTableRightMenu(subTable, subTableName, cols);



}


//////////////////////////////   1st TABLE     ////////////////////////////////
///////////////////// FASTCAT RECORD INFORMATION TABLE/////////////////////////

// Moved to Tables.js

//////////////////////////////   2nd TABLE     ////////////////////////////////
////////////////////////SOURCE  IDENTITY///////////////////////////////
var colHeaders;

var tableId = "source_identity";
colHeaders = ['Name', 'Location', 'URL', 'Document Date *', 'Note', 'Comment'];


var source_identity_cols = [
    {data: 'archive_library', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("archive_or_library_it")), vocab: 'archive_or_library_it'},
    {data: 'location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
    {data: 'online_library_link', type: 'text'},
    {data: 'book_date', type: 'date'},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
];

var source_container = document.getElementById(tableId);
var source_identity_data = new Handsontable(source_container, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: sourcedata,
    columns: source_identity_cols,
    currentRowClassName: 'currentRow',
    maxRows: 1,
    manualColumnResize: true,
    className: "htCenter htMiddle",
    autoWrapRow: true,
    contextMenu: false,
    colHeaders: colHeaders,
    nestedHeaders: [
        [{label: 'Archive / Library', colspan: 3}, {label: '', colspan: 2}],
        colHeaders
    ],
    cells: function(row, col, prop) {
        if (this.vocab) {
            handle_vocabulary(this.instance.getDataAtCell(row, col), this.vocab, this);
        }
    },
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
            "undo": {},
            "redo": {},
            "hsep1": "---------",
            "copy": {},
            "cut": {},
            "hsep2": "---------",
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
                }}
        }
    }
});

//////////////////////////////   3rd TABLE     ////////////////////////////////
/////////////////////////////MARITIME PERSONEL /////////////////////////////////             

var sourcedata = [{source_pages: ''}, {source_pages: ''}, {source_pages: ''},
    {source_pages: ''}, {source_pages: ''}, {source_pages: ''},
    {source_pages: ''}, {source_pages: ''}, {source_pages: ''},
    {source_pages: ''}, {source_pages: ''}, {source_pages: ''},
    {source_pages: ''}, {source_pages: ''}, {source_pages: ''}];

var cols3 = [
    {data: 'source_pages', type: 'text'},
    {data: 'maritime_title_of_catalogue', type: 'text'},
    {data: 'analytic personnel_list', renderer: staffbuttonRenderer, readOnly: true},
    {data: 'aggregate_personnel_list', renderer: aggregadebuttonRenderer, readOnly: true},
    {data: 'maritime_personnel_note', type: 'text'}
];

function staffbuttonRenderer(instance, td, row, col, prop, value, cellProperties) {
    var title = instance.getDataAtCell(row, 1);
    if (title) {
        title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
    }
    td.innerHTML = "<a onclick='showStaffList(" + row + "," + null + ",\"" + title + "\")'> <button id='staff_button_" + row + "' style='padding:2px; font-size:8px;' type='button' class=' analytic_nested btn btn-outline-secondary'>Nested table</button></a>";// + value;
    td.className = 'htCenter';
    return td;
}

function aggregadebuttonRenderer(instance, td, row, col, prop, value, cellProperties) {
    var title = instance.getDataAtCell(row, 1);
    if (title) {
        title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
    }
    td.innerHTML = "<a onclick='showAggregadeList(" + row + "," + null + ",\"" + title + "\")'>  <button id='aggregade_button_" + row + "' style='padding:2px; font-size:8px;' type='button' class=' aggregade_nested btn btn-outline-secondary'>Nested table</button></a>";// + value;
    td.className = 'htCenter';
    return td;
}


var maritime_personnel_hot = new Handsontable(identifier_table, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: sourcedata,
    columns: cols3,
    className: "htCenter",
    currentRowClassName: 'currentRow',
    autoWrapRow: true,
    manualColumnResize: true,
    rowHeaders: true,
    colHeaders: ['Source pages', 'Title of Catalogue', 'Analytic Personnel List', 'Aggregate Personnel List ', 'Note'],
    nestedHeaders: [
        ['Source pages', 'Title of Catalogue', 'Analytic Personnel List', 'Aggregate Personnel List ', 'Note']
    ]
});

maritime_personnel_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {

        },
        items: {
            "hsep1": "---------",
            "undo": {},
            "redo": {},
            "hsep2": "---------",
            "copy": {},
            "cut": {},
            "hsep3": "---------",
            "add10rows": {
                name: "Add 10 rows",
                disabled: function() {
                    return maritime_personnel_hot.countRows() - 1 !== maritime_personnel_hot.getSelected()[0];
                },
                callback: function() {
                    this.alter('insert_row', this.getSelected()[0] + 1, 10);
                }
            }
        }
    }
});

//////////////////////////////Analytic Personel Personnel LIST/////////////////////////////////

function close_listStaff(cnt) {

    $("#analytic_heading" + cnt).parent().hide();

    $.each($('.nested_button'), function(i) {
        if ($("#staff_button_" + i).hasClass('full_data')) {
            $("#staff_button_" + i).css("background-color", "#C4C4C4");
            $("#staff_button_" + i).css("color", "#1C6799");
        }
        else {
            $('#staff_button_' + i).css({'background': '#dddddd'});
            $('#staff_button_' + i).css({'color': '#337ab7'});
        }
    });

    $('#staff_button_' + cnt).css({'background': '#638BC7'});
    $('#staff_button_' + cnt).css({'color': '#ffffff'});

    $('#insert_here').hide();
}

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

var list_of_staff_cols = [
    {data: 'name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it'},
    {data: 'surnamename', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_it")), vocab: 'surname_it'},
    {data: 'fathers_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it'},
    {data: 'status_capacity_role', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_it")), vocab: 'status_capacity_role_it', renderer: groupRenderer},
    {data: 'location_of_work', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it', renderer: groupRenderer},
    {data: 'sector', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("sector_it")), vocab: 'sector_it', vocab:'sector_it', renderer: groupRenderer},
    {data: 'note', type: 'text'},
];

var analytic_personnels = [];



function showStaffList(cnt, data, header) {

    $('#insert2_here').hide();
    $(".analytic_nested_table").hide();
    var parent = $('#analytic_heading' + cnt).parent();
    $(parent).show();


    $.each($('.analytic_nested'), function(i) {
        if ($("#staff_button_" + i).hasClass('full_data')) {
            $("#staff_button_" + i).css("background-color", "#C4C4C4");
            $("#staff_button_" + i).css("color", "#1C6799");
        }
        else {
            $('#staff_button_' + i).css({'background-color': '#dddddd'});
            $('#staff_button_' + i).css({'color': '#337ab7'});
        }

    });

    var plus = parseInt(cnt) + 1;

    var table_header = "";
    if (!((header == null) || (header == "null"))) {
        table_header = ' / Title of Catalogue : ' + header;
    }

    var html = "<div  class='panel panel-default analytic_nested_table not_visible' style='border:transparent; margin-top:5px;'>" +
            "<div class='panel-heading' role='tab' id='analytic_heading" + cnt + "'>" +
            "<h4 class='panel-title'>" +
            "    <a style='background-color:#589AAF;' class='collapsed' role='button' onclick='close_listStaff(" + cnt + ")'  href='#collapse" + cnt + "'>" +
            "<span class='pull-right glyphicon glyphicon-remove'></span>" + "Analytic Personnel List " + plus + table_header +
            "     </a>" +
            "</h4>" +
            "</div>" +
            "<div id='collapse" + cnt + "' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='analytic_heading" + cnt + "'>" +
            "    <div style='padding-top:6px;'  class='panel-body'>" +
            "    <span style=' color:#163758; padding:0px;font-size: 11px'>Use the source language to fill in the fields of this table</span>" +
            "        <div>" +
            "            <div id='analytic_personnel" + cnt + "' class='hot handsontable htRowHeaders htColumnHeaders' style='height: 400px; overflow: hidden; width: 100%; margin:5px 0px 0px 4px;'></div>" +
            "        </div> " +
            "    </div>" +
            "</div>" +
            "</div>";

    if ($('#analytic_heading' + cnt).size() == 0) {

        $('#insert_here').append(html);
        $('#insert_here').show();

        if (data == null) {
            data = [{name: ""}, {name: ""}, {name: ""}, {name: ""}, {name: ""}, {name: ""}, {name: ""}, {name: ""}, {name: ""},
                {name: ""}, {name: ""}, {name: ""}, {name: ""}, {name: ""}, {name: ""}];
            $('#staff_button_' + cnt).css({'background-color': '#638BC7'});
            $('#staff_button_' + cnt).css({'color': '#ffffff'});
            $("#staff_button_" + cnt).addClass('full_data');
        }
        else {
            $("#staff_button_" + cnt).addClass('full_data');
            $("#staff_button_" + cnt).css("background-color", "#C4C4C4");
            $("#staff_button_" + cnt).css("color", "#1C6799");
            $('#insert_here').hide();
        }


        var container = document.getElementById('analytic_personnel' + cnt);
        var headers = [
            [{label: 'Person', colspan: 6}, ''],
            ['Name', 'Surname', 'Fathers name', 'Status | Capacity | Role', 'Location of Work', 'Sector', 'Note']
        ];

        var analytic_personnelGroups = [[3, 5]];
        headers = markHeaders(headers, analytic_personnelGroups);


        var analytic_personnel_hot = new Handsontable(container, {
            licenseKey: '',
            dateFormat: 'YYYY-MM-DD',
            data: data,
            columns: list_of_staff_cols,
            contextMenu: true,
            manualColumnResize: true,
            autoWrapRow: true,
            className: "htCenter htMiddle",
            currentRowClassName: 'currentRow',
            colHeaders: ['Name', 'Surname', 'Fathers name', 'Status | Capacity | Role', 'Location of Work', 'Sector', 'Note'],
            rowHeaders: true,
            nestedHeaders: headers,
            cells: function(row, col, prop) {
                if (this.vocab) {
                    handle_vocabulary(this.instance.getDataAtCell(row, col), this.vocab, this);
                }
            },
            afterRender: function() {
                markGroups(this);
            },
            afterSelectionEnd: function(row, col) {
                markGroups(this);
                if (col > 2 || col < 6) {
                    groupLeftClicked(this, row, col);
                }
            }

        });

        analytic_personnel_hot.updateSettings({
            colHeaders: ['Source Pages', 'Name', 'Surname', 'Father name ', 'Status | Capacity | Role', 'Location of Work', 'Sector', 'Note'],
            contextMenu: {
                callback: function(key, options) {
                    if (key === 'edit_vocabulary') {
                        var col = options.start.col;
                        create_voc_modal(list_of_staff_cols[col].vocab);
                    }
                    else if (key === 'add') {
                        var colClicked = analytic_personnel_hot.getSelectedRange().to.col;
                        var rowClicked = analytic_personnel_hot.getSelectedRange().to.row;
                        if (colClicked > 2 && colClicked < 6) {
                            groupClicked('analytic_personnel' + cnt, "status_capacities", rowClicked, 3, 5);
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
                            return analytic_personnel_hot.getSelected()[0] === 0;
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
                            if (((analytic_personnel_hot.getSelected()[0]) < 3) || ((analytic_personnel_hot.getSelected()[2]) < 3)) {
                                return true;
                            }
                        }
                    },
                    "hsep1": "---------",
                    "edit_vocabulary": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            var col = analytic_personnel_hot.getSelectedRange().to.col;
                            var label = list_of_staff_cols[col].vocab;
                            if (label) {
                                update_Vocs();
                                return analytic_personnel_hot.getSelectedRange().to.col !== col;
                            } else {
                                return analytic_personnel_hot.getSelectedRange().to.col !== -1;
                            }
                        }},
                    "add": {
                        name: "Add table",
                        hidden: function() {
                            return isAddTableMenuVisible(this, analytic_personnelGroups);

                        }}
                }
            }
        });

        analytic_personnels[cnt] = analytic_personnel_hot;
    }
    else {
        if (!((header == null) || (header == "null"))) {
            $('#analytic_heading' + cnt).children().children().html('<span class="pull-right glyphicon glyphicon-remove"></span>Analytic Personnel List ' + plus + ' / Title of Catalogue : ' + header);
        }

        $('#staff_button_' + cnt).css({'background': '#638BC7'});
        $('#staff_button_' + cnt).css({'color': '#ffffff'});
        $('#insert_here').show();
    }
}

/////////////////////////////////////////////////////////////////////////////////

//////////////////////////////Aggregate Personnel LIST/////////////////////////////////



var aggregade_pressonnel_cols = [
    {data: 'number_of_persons', type: 'text'},
    {data: 'status_capacity_role', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_it")), vocab: 'status_capacity_role_it'},
    {data: 'sector', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("sector_it")), vocab: 'sector_it'},
    {data: 'location_of_work', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
    {data: 'note', type: 'text'},
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
        table_header = ' / Title of Catalogue : ' + header;
    }

    var html = "<div  class='panel panel-default aggregade_nested_table not_visible' style='border:transparent; margin-top:5px;'>" +
            "<div class='panel-heading' role='tab' id='aggregade_heading" + cnt + "'>" +
            "<h4 class='panel-title'>" +
            "    <a style='background-color:#589AAF;' class='collapsed' role='button' onclick='close_aggregadeStaff(" + cnt + ")'  href='#collapse" + cnt + "'>" +
            "<span class='pull-right glyphicon glyphicon-remove'></span>" + "Aggregade Personnel List " + plus + table_header +
            "     </a>" +
            "</h4>" +
            "</div>" +
            "<div id='collapse" + cnt + "' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='analytic_heading" + cnt + "'>" +
            "    <div style='padding-top:6px;' class='panel-body'>" +
            "    <span style=' color:#163758; padding:0px;font-size: 11px'>Use the source language to fill in the fields of this table</span>" +
            "        <div>" +
            "            <div id='aggregade_personnel" + cnt + "' class='hot handsontable htRowHeaders htColumnHeaders' style='height: 400px; overflow: hidden; width: 100%;  margin:5px 0px 0px 4px;'></div>" +
            "        </div> " +
            "    </div>" +
            "</div>" +
            "</div>";

    if ($('#aggregade_heading' + cnt).size() == 0) {

        $('#insert2_here').append(html);
        $('#insert2_here').show();

        if (data == null) {
            data = [{number_of_persons: ""}, {number_of_persons: ""}, {number_of_persons: ""},
                {number_of_persons: ""}, {number_of_persons: ""}, {number_of_persons: ""},
                {number_of_persons: ""}, {number_of_persons: ""}, {number_of_persons: ""},
                {number_of_persons: ""}, {number_of_persons: ""}, {number_of_persons: ""}, {number_of_persons: ""}, {number_of_persons: ""}, {number_of_persons: ""}];
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

        var container = document.getElementById('aggregade_personnel' + cnt);
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
            colHeaders: ['Number of Persons', 'Status | Capacity | Role', 'Sector', 'Location Of Work', 'Note'],
            rowHeaders: true,
            nestedHeaders: [
                ['Number of Persons', 'Status | Capacity | Role', 'Sector', 'Location Of Work', 'Note']
            ],
            cells: function(row, col, prop) {
                if (this.vocab) {
                    handle_vocabulary(this.instance.getDataAtCell(row, col), this.vocab, this);
                }
            }
        });


        aggregade_personnel_hot.updateSettings({
            colHeaders: ['Number of Persons', 'Status | Capacity | Role', 'Sector', 'Location Of Work', 'Note'],
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
                        }}
                }
            }
        });

        aggregade_personnels[cnt] = aggregade_personnel_hot;
    }
    else {

        if (!((header == null) || (header == "null"))) {
            $('#aggregade_heading' + cnt).children().children().html('<span class="pull-right glyphicon glyphicon-remove"></span>Aggregade Personnel List ' + plus + ' / Title of Catalogue : ' + header);
        }

        $('#aggregade_button_' + cnt).css({'background': '#638BC7'});
        $('#aggregade_button_' + cnt).css({'color': '#ffffff'});
        $('#insert2_here').show();
    }


}


//////////////////////////////   4th TABLE     ////////////////////////////////
/////////////////////////Ship LIST/////////////////////////////////////////                       

var ship_catalogues_data = [
    {ship_list_source_pages: ""}, {ship_list_source_pages: ""}, {ship_list_source_pages: ""},
    {ship_list_source_pages: ""}, {ship_list_source_pages: ""}, {ship_list_source_pages: ""},
    {ship_list_source_pages: ""}, {ship_list_source_pages: ""}, {ship_list_source_pages: ""},
    {ship_list_source_pages: ""}, {ship_list_source_pages: ""}, {ship_list_source_pages: ""},
    {ship_list_source_pages: ""}, {ship_list_source_pages: ""}, {ship_list_source_pages: ""}
];

var ship_catalogues_cols = [
    {data: 'ship_list_source_pages', type: 'text'},
    {data: 'ship_list_title_of_catalogue', type: 'text'},
    {data: 'ship_list_staff_catalogue_date', type: 'text'},
    {data: 'ship_list_of_stafff', renderer: ShipbuttonRenderer, readOnly: true},
    {data: 'ship_list_note', type: 'text'}

];


function ShipbuttonRenderer(instance, td, row, col, prop, value, cellProperties) {
    var title = instance.getDataAtCell(row, 1);
    if (title) {
        title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
    }
    td.innerHTML = "<a onclick='createShipList(" + row + "," + null + ",\"" + title + "\")'> <button id='ship_button_" + row + "' style='padding:2px; font-size:8px;' type='button' class='nested_button btn btn-outline-secondary'>Nested table</button></a>";// + value;
    td.className = 'htCenter';
    return td;
}

var cont = document.getElementById('example1');

var ship_catalogues_hot = new Handsontable(cont, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: ship_catalogues_data,
    columns: ship_catalogues_cols,
    contextMenu: true,
    manualColumnResize: true,
    className: "htCenter",
    currentRowClassName: 'currentRow',
    rowHeaders: true,
    autoWrapRow: true,
    colHeaders: ['Source pages', 'Title of Catalogue', 'Date', 'Analytic Ship list', 'Note'],
    nestedHeaders: [
        ['Source pages', 'Title of Catalogue', 'Date', 'Analytic Ship list', 'Note']
    ]
});


ship_catalogues_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {

        },
        items: {
            "undo": {},
            "redo": {},
            "hsep1": "---------",
            "copy": {},
            "cut": {},
            "hsep2": "---------",
            "add10rows": {
                name: "Add 10 rows",
                disabled: function() {
                    return ship_catalogues_hot.countRows() - 1 !== ship_catalogues_hot.getSelected()[0];
                },
                callback: function() {
                    this.alter('insert_row', this.getSelected()[0] + 1, 10);
                }
            }
        }
    }
});




//////////////////////////////LIST OF SHIP/////////////////////////////////

function close_nested(cnt) {
    $("#heading" + cnt).parent().hide();
    $('#Row_' + cnt).css({'background': '#b0b5b9'});
    $('#Row_' + cnt).css({'color': '#5e7aa9'});
}

var list_of_ship_cols = [
    {data: 'ship_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_it")), vocab: 'ship_name_it'},
    {data: 'call_sign', type: 'text'},
    {data: 'type_of_ship', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_type_it")), vocab: 'ship_type_it'},
    {data: 'construction_date', type: 'text'},
    {data: 'constraction_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
    {data: 'tonnage', type: 'text'},
    {data: 'number_of_guns', type: 'text'},
    {data: 'horsepower', type: 'text'},
    {data: 'number_of_crew', type: 'text'},
    {data: 'owner_org_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_it")), vocab: 'organization_it', renderer: groupRenderer},
    {data: 'owner_org_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it', renderer: groupRenderer},
    {data: 'owner_person_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it', renderer: groupRenderer},
    {data: 'owner_person_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_it")), vocab: 'surname_it', renderer: groupRenderer},
    {data: 'owner_person_fathers_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it', renderer: groupRenderer},
    {data: 'owner_person_residence', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it', renderer: groupRenderer},
    {data: 'owner_person_A_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("person_type_it")), vocab: 'person_type_it', renderer: groupRenderer},
    {data: 'owner_person_A_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it', renderer: groupRenderer},
    {data: 'owner_person_A_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_it")), vocab: 'surname_it', renderer: groupRenderer},
    {data: 'owner_person_A_fathers_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it', renderer: groupRenderer},
    {data: 'owner_person_B_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("person_type_it")), vocab: 'person_type_it', renderer: groupRenderer},
    {data: 'owner_person_B_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it', renderer: groupRenderer},
    {data: 'owner_person_B_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_it")), vocab: 'surname_it', renderer: groupRenderer},
    {data: 'owner_person_B_fathers_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it', renderer: groupRenderer},
    {data: 'part_in_ownership', type: 'text', renderer: groupRenderer},
    {data: 'owners_note', type: 'text', renderer: groupRenderer},
    {data: 'captains_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it'},
    {data: 'captains_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_it")), vocab: 'surname_it'},
    {data: 'captains_fathersname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_it")), vocab: 'name_it'},
    {data: 'captains_residence', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
    {data: 'license_creation_date', type: 'date'},
    {data: 'licence_number', type: 'text'},
    {data: 'construction_preparation_technique_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("construction_technique_it")), vocab: 'construction_technique_it'},
    {data: 'construction_preparation_technique', type: 'date'},
    {data: 'navigation_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("navigation_type_it")), vocab: 'navigation_type_it'},
    {data: 'registry_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it'},
    {data: 'change_in_ownership', type: 'dropdown',
        source: ['New', 'Previous'], renderer: groupRenderer},
    {data: 'owners_nationality', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("nationality_it")), vocab: 'nationality_it', renderer: groupRenderer},
    {data: 'flag', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("flag_it")), vocab: 'flag_it', renderer: groupRenderer},
    {data: 'change_ship_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_it")), vocab: 'ship_name_it', renderer: groupRenderer},
    {data: 'changed_ship_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_type_it")), vocab: 'ship_type_it', renderer: groupRenderer},
    {data: 'changed_owner_tonnage', type: 'text', renderer: groupRenderer},
    {data: 'changed_owner_related_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it', renderer: groupRenderer},
    {data: 'changed_owner_related_date', type: 'text', renderer: groupRenderer},
    {data: 'changed_owner_note', type: 'text', renderer: groupRenderer},
    {data: 'disappear_event_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("event_type_it")), vocab: 'event_type_it', renderer: groupRenderer},
    {data: 'disappear_event_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_it")), vocab: 'location_it', renderer: groupRenderer},
    {data: 'disappear_event_date', type: 'date', renderer: groupRenderer},
    {data: 'disappear_event_note', type: 'text', renderer: groupRenderer},
    {data: 'note', type: 'text'}
];

var analytic_Ship_List = [];

function createShipList(cnt, data, header) {

    $(".nested_table").hide();
    var parent = $('#heading' + cnt).parent();
    $(parent).show();

    $.each($('.nested_button'), function(i) {
        if ($("#ship_button_" + i).hasClass('full_data')) {
            $("#ship_button_" + i).css("background-color", "#C4C4C4");
            $("#ship_button_" + i).css("color", "#1C6799");
        }
        else {
            $('#ship_button_' + i).css({'background-color': '#dddddd'});
            $('#ship_button_' + i).css({'color': '#337ab7'});
        }

    });


    var plus = parseInt(cnt) + 1;
    var table_header = "";

    if (!((header == null) || (header == "null"))) {
        table_header = ' / Title of Catalogue : ' + header.replace(/[`~!@#$%^&*()_|+\-=?;'",.<>\{\}\[\]\\\/]/gi, ' ');
    }

    var html = "<div  class='panel panel-default nested_table not_visible' style='border:transparent; margin-top:5px;'>" +
            "<div class='panel-heading' role='tab' id='heading" + cnt + "'>" +
            "<h4 class='panel-title'>" +
            "    <a style='background-color:#589AAF;' class='collapsed' role='button' onclick='close_nested(" + cnt + ")'  href='#collapse" + cnt + "'>" +
            "<span class='pull-right glyphicon glyphicon-remove'></span>" + "Analytic Ship List " + plus + table_header +
            "     </a>" +
            "</h4>" +
            "</div>" +
            "<div id='collapse" + cnt + "' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='heading" + cnt + "'>" +
            "    <div style='padding-top:6px;' class='panel-body'>" +
            "    <span style=' color:#163758; padding:0px;font-size: 11px'>Use the source language to fill in the fields of this table</span>" +
            "        <div>" +
            "            <div id='list_of_Ship" + cnt + "' class='hot handsontable htRowHeaders htColumnHeaders' style='height: 450px; overflow: hidden; width: 100%;  margin:5px 0px 0px 4px;'></div>" +
            "        </div> " +
            "    </div>" +
            "</div>" +
            "</div>";

    if ($('#heading' + cnt).size() === 0) {

        $('#insert_shipList_here').append(html);

        if (data == null) {
            data = [{ship_name: ''}, {ship_name: ''}, {ship_name: ''}, {ship_name: ''}, {ship_name: ''}, {ship_name: ''}, {ship_name: ''}, {ship_name: ''}, {ship_name: ''}, {ship_name: ''}, {ship_name: ''}, {ship_name: ''}, {ship_name: ''}, {ship_name: ''}, {ship_name: ''}];
            $('#ship_button_' + cnt).css({'background-color': '#638BC7'});
            $('#ship_button_' + cnt).css({'color': '#ffffff'});
            $("#ship_button_" + cnt).addClass('full_data');
        }
        else {
            $("#ship_button_" + cnt).addClass('full_data');
            $("#ship_button_" + cnt).css("background-color", "#C4C4C4");
            $("#ship_button_" + cnt).css("color", "#1C6799");
        }


        var container = document.getElementById('list_of_Ship' + cnt);
        var headers = [
            ['', '', '', {label: '', colspan: 2}, '', '', '', '', {label: 'Current Owner', colspan: 16}, {label: 'Captain', colspan: 6}, {label: '', colspan: 2}, '', '', {label: '', colspan: 9}, {label: '', colspan: 4}],
            ['', '', '', {label: 'Construction', colspan: 2}, '', '', '', '', {label: 'Owner (Organization)', colspan: 2}, {label: 'Owner (Person)', colspan: 4}, {label: 'Related Person A', colspan: 4}, {label: 'Related Person B', colspan: 4}, {label: '', colspan: 2}, {label: '', colspan: 4}, {label: 'License', colspan: 2}, {label: 'Fastened, Sheathed and/or Repaired', colspan: 2}, '', '', {label: 'Change in Ownership / Ship Type / Name', colspan: 9}, {label: 'Event of Shipwreck / Last Appearance / Withdrawal / Reconstruction', colspan: 4}, ''],
            ['Ship Name', 'Call Sign', 'Ship Type', 'Date', 'Location', 'Tonnage', 'Number of Guns', 'Horsepower', 'Number of Crew', 'Name', 'Headquarter Location', 'Name', 'Surname', 'Fathers Name', 'Residence', 'Type', 'Name', 'Surname', 'Fathers Name', 'Type', 'Name', 'Surname', 'Fathers Name', 'Part in Ownership', 'Owners Note', 'Name', 'Surname', 'Fathers Name', 'Residence', 'Creation Date', 'Number', 'Type', 'Date', 'Navigation Type', 'Registry Location', 'Type', 'Owner Nationality', 'Flag', 'Ship Name', 'Ship Type', 'Tonnage', 'Related Location', 'Related Date', 'Event Note', 'Type', 'Related Location', 'Related Date', 'Event Note', 'Note']
        ];

        var list_of_ShipGroups = [[9, 24], [35, 43], [44, 47]];

        headers = markHeaders(headers, list_of_ShipGroups);


        var list_of_ship_hot = new Handsontable(container, {
            licenseKey: '',
            dateFormat: 'YYYY-MM-DD',
            data: data,
            columns: list_of_ship_cols,
            className: "htCenter",
            manualColumnResize: true,
            rowHeaders: true,
            autoWrapRow: true,
            currentRowClassName: 'currentRow',
            colHeaders: ['Ship Name', 'Call Sign', 'Ship Type', 'Date', 'Location', 'Tonnage', 'Number of Guns', 'Horsepower', 'Number of Crew', 'Name', 'Headquarter Location', 'Name', 'Surname', 'Fathers Name', 'Residence', 'Type', 'Name', 'Surname', 'Fathers Name', 'Type', 'Name', 'Surname', 'Fathers Name', 'Part in Ownership', 'Owners Note', 'Name', 'Surname', 'Fathers Name', 'Residence', 'Creation Date', 'Number', 'Type', 'Date', 'Navigation Type', 'Registry Location', 'Type', 'Owner Nationality', 'Flag', 'Ship Name', 'Ship Type', 'Tonnage', 'Related Location', 'Related Date', 'Event Note', 'Type', 'Related Location', 'Related Date', 'Event Note', 'Note'],
            nestedHeaders: headers,
            cells: function(row, col, prop) {
                if (this.vocab) {
                    handle_vocabulary(this.instance.getDataAtCell(row, col), this.vocab, this);
                }
            },
            afterRender: function() {
                markGroups(this);
            },
            afterSelectionEnd: function(row, col) {
                markGroups(this);
                if (col > 8 && col < 25) {
                    groupLeftClicked(this, row, col);

                } else if (col > 34 && col < 44) {
                    groupLeftClicked(this, row, col);

                } else if (col > 43 && col < 48) {
                    groupLeftClicked(this, row, col);

                }

            }
        });

        list_of_ship_hot.updateSettings({
            contextMenu: {
                callback: function(key, options) {
                    if (key === 'edit_vocabulary') {
                        var col = options.start.col;
                        create_voc_modal(list_of_ship_cols[col].vocab);
                    }
                    else if (key === 'add') {
                        var colClicked = list_of_ship_hot.getSelectedRange().to.col;
                        var rowClicked = list_of_ship_hot.getSelectedRange().to.row;
                        if (colClicked > 8 && colClicked < 25) {
                            groupClicked('list_of_Ship' + cnt, "current_Owners", rowClicked, 9, 24);
                        }
                        else if (colClicked > 34 && colClicked < 44) {
                            groupClicked('list_of_Ship' + cnt, "change_Ownership", rowClicked, 35, 43);
                        }
                        else if (colClicked > 43 && colClicked < 48) {
                            groupClicked('list_of_Ship' + cnt, "disappear_event_table", rowClicked, 44, 47);
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
                            return list_of_ship_hot.getSelected()[0] === 0;
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
                            if (((list_of_ship_hot.getSelected()[0]) < 3) || ((list_of_ship_hot.getSelected()[2]) < 3)) {
                                return true;
                            }
                        }
                    },
                    "hsep1": "---------",
                    "edit_vocabulary": {
                        name: "Edit vocabulary",
                        hidden: function() {
                            var col = list_of_ship_hot.getSelectedRange().to.col;
                            var label = list_of_ship_cols[col].vocab;
                            if (label) {
                                update_Vocs();
                                return list_of_ship_hot.getSelectedRange().to.col !== col;
                            } else {
                                return list_of_ship_hot.getSelectedRange().to.col !== -1;
                            }
                        }},
                    "add": {
                        name: "Add table",
                        hidden: function() {
                            return isAddTableMenuVisible(this, list_of_ShipGroups);

                        }}
                }
            }
        });
        analytic_Ship_List[cnt] = list_of_ship_hot;
    }
    else {
        if (!((header == null) || (header == "null"))) {
            $('#heading' + cnt).children().children().html('<span class="pull-right glyphicon glyphicon-remove"></span>Analytic Ship List ' + plus + ' / Title of Catalogue : ' + header);
        }
        $('#ship_button_' + cnt).css({'background': '#638BC7'});
        $('#ship_button_' + cnt).css({'color': '#ffffff'});
    }
}
;


function close_nested(cnt) {
    $("#heading" + cnt).parent().hide();

    $.each($('.nested_button'), function(i) {

        if ($("#ship_button_" + i).hasClass('full_data')) {
            $("#ship_button_" + i).css("background-color", "#C4C4C4");
            $("#ship_button_" + i).css("color", "#1C6799");
        }
        else {
            $('#ship_button_' + i).css({'background': '#dddddd'});
            $('#ship_button_' + i).css({'color': '#337ab7'});
        }
    });

    $('#ship_button_' + cnt).css({'background': '#638BC7'});
    $('#ship_button_' + cnt).css({'color': '#ffffff'});
}
;

////////////////////////////EXPORT IMPORT //////////////////////////////////////

function createRecordJson(usage) {


    var cat_info = createJson(catalogue_info, cols1, usage);
    var source_id = createJson(source_identity_data, source_identity_cols, usage);
    var maritime_personel = createJson(maritime_personnel_hot, cols3, usage);
    var ship_list = createJson(ship_catalogues_hot, ship_catalogues_cols, usage);


    var analytic_keys = Object.keys(analytic_Ship_List);
    var analytic_ship_list = new Object();

    for (var i = 0; i < analytic_keys.length; i++) {
        analytic_ship_list[analytic_keys[i]] = createJson((analytic_Ship_List[analytic_keys[i]]), list_of_ship_cols, usage);
    }
    /////////////////////////////////////////////////////////////////////
    var analytic_staff_keys = Object.keys(analytic_personnels);
    var analytic_personnel_list = new Object();

    for (var i = 0; i < analytic_staff_keys.length; i++) {
        analytic_personnel_list[analytic_staff_keys[i]] = createJson((analytic_personnels[analytic_staff_keys[i]]), list_of_staff_cols, usage);
    }
    //////////////////////////////////////////////////////////////////////////////

    var aggregade_staff_keys = Object.keys(aggregade_personnels);
    var aggregade_personnel_list = new Object();

    for (var i = 0; i < aggregade_staff_keys.length; i++) {
        aggregade_personnel_list[aggregade_staff_keys[i]] = createJson((aggregade_personnels[aggregade_staff_keys[i]]), aggregade_pressonnel_cols, usage);
    }

    var json = new Object();
    cat_info.date_until = getCurrentDate();
    catalogue_info.setDataAtCell(0, 2, getCurrentDate());
    json['record_information'] = cat_info;
    json['source_identity'] = source_id;
    json['maritime_personel'] = maritime_personel;
    json['analytic_personnel_list'] = analytic_personnel_list;
    json['aggregade_personnel_list'] = aggregade_personnel_list;
    json['ship_list'] = ship_list;
    json['analytic_ship_list'] = analytic_ship_list;

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

function load(data,status) {
    
    console.log(status);
    record_status = status;    
    clear_LocalStorage_instances();

    catalogue_info.loadData(data.record_information);
    source_identity_data.loadData(data.source_identity);

    var maritime = new Array();
    $.each(data.maritime_personel, function() {
        maritime.push(this);
    });
    maritime_personnel_hot.loadData(maritime);


    var ship_list = new Array();
    $.each(data.ship_list, function() {
        ship_list.push(this);
    });

    ship_catalogues_hot.loadData(ship_list);

    $.each(data.analytic_ship_list, function(cnt) {

        var analytic_ship_list = new Array();
        $.each(this, function() {
            analytic_ship_list.push(this);
        });

        createShipList(cnt, analytic_ship_list);

        $(".nested_table").hide();

    });

    $.each(data.analytic_personnel_list, function(cnt) {

        var analytic_personnel_list = new Array();
        $.each(this, function() {
            analytic_personnel_list.push(this);
        });

        showStaffList(cnt, analytic_personnel_list);

        $(".analytic_nested_table").hide();

    });

    $.each(data.aggregade_personnel_list, function(cnt) {

        var aggregade_personnel_list = new Array();
        $.each(this, function() {
            aggregade_personnel_list.push(this);
        });

        showAggregadeList(cnt, aggregade_personnel_list);

        $(".aggregade_nested_table").hide();

    });

    update_Vocs();

}
;
////////////////////////////////////////////////////////////////////////////////
/////////////////////////EXCEL EXPORT////////////////////////////////////////
$('#excelexport').click(function() {

    var json = createRecordJson('excel');
    var temp = JSON.stringify(json);
    //temp = temp.replace(/null/g, "\"\"");
    temp = temp.replace(/&nbsp;/g, "");
    json = JSON.parse(temp);

    var analytic_personnel_list = new Array();
    $.each(json.analytic_personnel_list, function(cnt) {
        $.each(this, function() {
            analytic_personnel_list.push(Object.assign({}, (json.maritime_personel[cnt]), (this)));
        });
    });

    if (analytic_personnel_list.length < 1) {
        analytic_personnel_list.push('');
    }



    var aggregade_personnel_list = new Array();
    $.each(json.aggregade_personnel_list, function(cnt) {
        $.each(this, function() {
            aggregade_personnel_list.push(Object.assign({}, (json.maritime_personel[cnt]), (this)));
        });
    });

    if (aggregade_personnel_list.length < 1) {
        aggregade_personnel_list.push('');
    }


    var analytic_ship_list = new Array();
    $.each(json.analytic_ship_list, function(cnt) {
        $.each(this, function() {
            analytic_ship_list.push(Object.assign({}, (json.ship_list[cnt]), (this)));
        });
    });

    if (analytic_ship_list.length < 1) {
        analytic_ship_list.push('');
    }

    var opts = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Source Identity', header: false}, {sheetid: 'Maritime Personnel Lists', header: true}, {sheetid: 'Analytic Personnel List', header: true}, {sheetid: 'Aggregate Personnel List', header: true}, {sheetid: 'Ship Lists', header: true}, {sheetid: 'Analytic Ship Lists', header: true}];
    var res = alasql('SELECT * INTO XLSX("' + $('#unique_filename').text() + '.xlsx",?) FROM ?', [opts, [[json.record_information], [json.source_identity], json.maritime_personel, analytic_personnel_list, aggregade_personnel_list, json.ship_list, analytic_ship_list]]);

});

////////////////////////////////////////////////////////////////////////////////
///////////////Update Vocabularies
function update_Vocs() {
    if (mode === null) {//only update vocabularies in edit mode

        var tables = [];

        var analytic_keys = Object.keys(analytic_Ship_List);

        for (var i = 0; i < analytic_keys.length; i++) {
            tables.push(analytic_Ship_List[analytic_keys[i]]);
        }
        /////////////////////////////////////////////////////////////////////
        var analytic_staff_keys = Object.keys(analytic_personnels);

        for (var i = 0; i < analytic_staff_keys.length; i++) {
            tables.push(analytic_personnels[analytic_staff_keys[i]]);

        }
        //////////////////////////////////////////////////////////////////////////////
        var aggregade_staff_keys = Object.keys(aggregade_personnels);

        for (var i = 0; i < aggregade_staff_keys.length; i++) {
            tables.push(aggregade_personnels[aggregade_staff_keys[i]]);
        }
        tables.push(catalogue_info, source_identity_data, maritime_personnel_hot, ship_catalogues_hot);
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
            console.log(this.tableVariable);
            if (table_id === "source_identity") {
                old_val = source_identity_data.getDataAtCell(this.row, this.col, value);
                source_identity_data.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "identifier_table") {
                old_val = maritime_personnel_hot.getDataAtCell(this.row, this.col, value);
                maritime_personnel_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id.indexOf("analytic_personnel") !== -1) {
                var cnt = table_id.replace("analytic_personnel", "");
                old_val = analytic_personnels[cnt].getDataAtCell(this.row, this.col, value);
                analytic_personnels[cnt].setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id.indexOf("aggregade_personnel") !== -1) {
                var cnt = table_id.replace("aggregade_personnel", "");
                old_val = aggregade_personnels[cnt].getDataAtCell(this.row, this.col, value);
                aggregade_personnels[cnt].setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "example1") {
                old_val = ship_catalogues_hot.getDataAtCell(this.row, this.col, value);
                ship_catalogues_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id.indexOf("list_of_Ship") !== -1) {
                var cnt = table_id.replace("list_of_Ship", "");
                old_val = analytic_Ship_List[cnt].getDataAtCell(this.row, this.col, value);
                analytic_Ship_List[cnt].setDataAtCell(this.row, old_val.split(old_term).join(value));
            } else if (table_id === "catalogue_info") {
                old_val = catalogue_info.getDataAtCell(this.row, this.col, value);
                catalogue_info.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            }
        });
    }
}
;
