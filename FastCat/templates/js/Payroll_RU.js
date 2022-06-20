/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


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

var sourcedata = [{archive_library: ''}];

var source_identity_cols = [
    {data: 'archive_library', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("archive_or_library_ru")), vocab: 'archive_or_library_ru'},
    {data: 'source_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_ru")), vocab: 'location_ru'},
    {data: 'fonds_number', type: 'text'},
    {data: 'fonds_title', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("fonds_ru")), vocab: 'fonds_ru'},
    {data: 'series_number', type: 'text'},
    {data: 'file_number', type: 'text'},
    {data: 'file_title', type: 'text'},
    {data: 'file_date_from', type: 'date'},
    {data: 'file_date_to', type: 'date'},
    {data: 'source_note', renderer: textRender, readOnly: true, type: 'text'},
];

var source_container = document.getElementById('source_identity');
var source_locs = new Object();
var source_identity_data = new Handsontable(source_container, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: sourcedata,
    columns: source_identity_cols,
    manualColumnResize: true,
    maxRows: 1,
    className: "htCenter htMiddle",
    currentRowClassName: 'currentRow',
    autoWrapRow: true,
    contextMenu: false,
    colHeaders: ['Name', 'Location', 'Number*', 'Title', 'Number*', 'Number*', 'Title', 'From*', 'To*', 'Note'],
    nestedHeaders: [
        [{label: '', colspan: 2}, {label: '', colspan: 2}, {label: '', colspan: 1}, {label: 'File', colspan: 4}, ''],
        [{label: 'Archive / Library', colspan: 2}, {label: 'Fonds', colspan: 2}, '', '', '', {label: 'Date', colspan: 2}, ''],
        ['Name', 'Location', 'Number*', 'Title', 'Series  Number*', 'Number*', 'Title', 'From*', 'To*', 'Note']
    ],
    cells: function (row, col, prop) {
        if (this.vocab) {
            handle_vocabulary(this.instance.getDataAtCell(row, col), this.vocab, this);
        }
    },
    afterRenderer: function (td, row, col, prop, value) {
        if ((source_identity_cols[col].vocab === 'location_ru') && (value)) {
            handle_locations(value, 'source_identity', row, col, 'LOCS', source_locs);
        } else if (value && ((source_identity_cols[col].vocab === 'archive_or_library_ru'))) {
            handle_organizations(value, 'source_identity', row, col, 'ORGS');
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
            "hsep3": "---------",
            "copy": {},
            "cut": {},
            "hsep2": "---------",
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
                }}
        }
    }
});

//////////////////////////////   3rd TABLE     ////////////////////////////////
/////////////////////////VOYAGE INFORMATION/////////////////////////////////////////                       

var payroll_data = [
    {source_pages: ""}, {source_pages: ""}, {source_pages: ""}, {source_pages: ""},
    {source_pages: ""}, {source_pages: ""}, {source_pages: ""}, {source_pages: ""},
    {source_pages: ""}, {source_pages: ""}, {source_pages: ""}, {source_pages: ""},
    {source_pages: ""}, {source_pages: ""}, {source_pages: ""}
];

var payroll_cols = [
    {data: 'payroll_folio', type: 'text'},
    {data: 'payroll_recording_date', type: 'date'},
    {data: 'payroll_ship_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_ru")), vocab: 'ship_name_ru'},
    {data: 'payroll_ship_owner', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_ru")), vocab: 'organization_ru'},
    {data: 'payroll_person_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_ru")), vocab: 'surname_ru'},
    {data: 'payroll_person_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_ru")), vocab: 'name_ru'},
    {data: 'payroll_person_patronymic', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_ru")), vocab: 'name_ru'},
    {data: 'payroll_person_age', type: 'dropdown',
        source: ['adult', 'child']},
    {data: 'payroll_person_sex', type: 'dropdown',
        source: ['Male', 'Female']},
    {data: 'payroll_person_date_birth', type: 'date'},
    {data: 'payroll_person_estate', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("social_status_ru")), vocab: 'social_status_ru'},
    {data: 'payroll_person_country', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("country_ru")), vocab: 'country_ru'},
    {data: 'payroll_person_governorate', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("governorate_ru")), vocab: 'governorate_ru'},
    {data: 'payroll_person_district', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("district_ru")), vocab: 'district_ru'},
    {data: 'payroll_person_township', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("township_ru")), vocab: 'township_ru'},
    {data: 'payroll_person_city', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("city_ru")), vocab: 'city_ru'},
    {data: 'payroll_person_village', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("village_ru")), vocab: 'village_ru'},
    {data: 'payroll_recruitment_date', type: 'date'},
    {data: 'payroll_recruitment_port', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_ru")), vocab: 'location_ru'},
    {data: 'payroll_recruitment_document_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("document_type_ru")), vocab: 'document_type_ru'},
    {data: 'payroll_recruitment_document_number', type: 'text'},
    {data: 'payroll_issuing_country', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("country_ru")), vocab: 'country_ru'},
    {data: 'payroll_issuing_governorate', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("governorate_ru")), vocab: 'governorate_ru'},
    {data: 'payroll_issuing_district', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("district_ru")), vocab: 'district_ru'},
    {data: 'payroll_issuing_township', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("township_ru")), vocab: 'township_ru'},
    {data: 'payroll_issuing_city', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("city_ru")), vocab: 'city_ru'},
    {data: 'payroll_issuing_village', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("village_ru")), vocab: 'village_ru'},
    {data: 'payroll_issuing_date', type: 'date'},
    {data: 'payroll_rank_specialization', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_ru")), vocab: 'status_capacity_role_ru'},
    {data: 'payroll_month_salary', type: 'text'},
    {data: 'payroll_month_salary_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_ru")), vocab: 'unit_ru'},
    {data: 'payroll_previous_ship_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_ru")), vocab: 'ship_name_ru'},
    {data: 'payroll_previous_ship_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_type_ru")), vocab: 'ship_type_ru'},
    {data: 'payroll_previous_dismissal_date', type: 'date'},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
];


var cont = document.getElementById('payroll_table');
var payroll_locs = new Object();
var payroll_tbl = new Object();
var payroll_persons = new Object();

var payroll_hot = new Handsontable(cont, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: payroll_data,
    columns: payroll_cols,
    contextMenu: true,
    className: "htCenter",
    currentRowClassName: 'currentRow',
    rowHeaders: true,
    autoWrapRow: true,
    manualColumnResize: true,
    allowInvalid: true,
    colHeaders: ['Folio', 'Recording Date', 'Name', 'Owner (Company)', 'Surname', 'Name', 'Patronymic', 'Adult/Child', 'Sex', 'Date of Birth', 'Estate (Social class)', 'Country', 'Governorate', 'District', 'Township', 'City', 'Village', 'Date', 'Port', 'Type of Document', 'Number of Document', 'Country', 'Governorate', 'District', 'Township', 'City', 'Village', 'Date of Issue', 'Rank/Specialization', 'Value', 'Unit', 'Ship Name', 'Ship Type', 'Date of Dismissal', 'Note'],
    nestedHeaders: [
        ['', '', {label: '', colspan: 2}, {label: '', colspan: 13}, {label: 'Recruitment', colspan: 11}, '', {label: '', colspan: 2}, {label: '', colspan: 3}, ''],
        ['', '', {label: '', colspan: 2}, {label: 'Person', colspan: 13}, '', '', {label: 'Document', colspan: 9}, '', {label: '', colspan: 2}, {label: '', colspan: 3}, ''],
        ['', '', {label: 'Ship', colspan: 2}, '', '', '', '', '', '', '', {label: 'Place of Registration', colspan: 6}, '', '', '', '', {label: 'Place of Issuing Authority', colspan: 6}, '', '', {label: 'Salary Per Month', colspan: 2}, {label: 'Previous Service in Company', colspan: 3}, ''],
        ['Folio', 'Recording Date', 'Name', 'Owner (Company)', 'Surname', 'Name', 'Patronymic', 'Adult/Child', 'Sex', 'Date of Birth', 'Estate (Social class)', 'Country', 'Governorate', 'District', 'Township', 'City', 'Village', 'Date', 'Port', 'Type of Document', 'Number of Document', 'Country', 'Governorate', 'District', 'Township', 'City', 'Village', 'Date of Issue', 'Rank/Specialization', 'Value', 'Unit', 'Ship Name', 'Ship Type', 'Date of Dismissal', 'Note']
    ],
    cells: function (row, col, prop) {
        if (this.vocab) {
            handle_vocabulary(this.instance.getDataAtCell(row, col), this.vocab, this);
        }
    }
});




payroll_hot.updateSettings({
    contextMenu: {
        callback: function (key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(payroll_cols[col].vocab);
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
            "remove_row": {
                disabled: function () {
                    if (((payroll_hot.getSelected()[0]) < 3) || ((payroll_hot.getSelected()[2]) < 3)) {
                        return true;
                    }
                }
            },
            "hsep5": "---------",
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function () {
                    var col = payroll_hot.getSelectedRange().to.col;
                    var label = payroll_cols[col].vocab;
                    if (label) {
                        update_Vocs();
                        return payroll_hot.getSelectedRange().to.col !== col;
                    } else {
                        return payroll_hot.getSelectedRange().to.col !== -1;
                    }
                }},
            "add10rows": {
                name: "Add 10 rows",
                callback: function () {
                    this.alter('insert_row', this.getSelected()[0] + 1, 10);
                }
            }

        }
    }
});

////////////////////////////////////////////////////////////////////////////////
function createRecordJson(usage) {
    var cat_info = createJson(catalogue_info, cols1, usage);
    var source_id = createJson(source_identity_data, source_identity_cols, usage);
    var source_contents = createJson(payroll_hot, payroll_cols, usage);


    var json = new Object();

    cat_info.date_until = getCurrentDate();
    catalogue_info.setDataAtCell(0, 2, getCurrentDate());
    json['record_information'] = cat_info;
    json['source_identity'] = source_id;
    json['payroll'] = source_contents;

    updateVocabs([catalogue_info, source_identity_data, payroll_hot]);

    //////////////Odessa special location  handling
    var transaction_locs = new Object();
    handle_payroll_ru_locations(source_contents, "payroll_table", 'LOCS', transaction_locs);
    //////////////////////////////////////////////////////////////////////////////////
if(record_status==='Public'){
    
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
  

    ////////////////////////////////////////////////////////////////////////////
        var payroll_persons = new Object();
        var payroll_tbl = new Object();
        var ship_obj = new Object();
        var ships_tbl = new Object();
        terms = new Object();
    $.each(source_contents, function (row) {
          //  FATHERS INSTANCES HANDLING   
   
        console.log('------ handling row ' + row + '-----------');
        var row_data = this;
        $.each(this, function (col) {
            ///////////////////////////////////////////   
            var val = this;
            $.each(payroll_cols, function (col_no) {
                if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                    var label = $(this).attr('vocab');
                    handle_vocabulary(val, label, this);
                    handle_json_vocs(val,label,row,col,col_no,'payroll',terms);
                }
            });
            /////////////////////////////////////                            
            if (col === 'payroll_person_patronymic') {
                handle_persons(row + '_', 6, row_data['payroll_person_patronymic'], 'payroll', [6, 4], ['name', 'surname_a'], payroll_persons, payroll_tbl, 'PERSONS');
                if (row_data['payroll_person_surname']) {
                    handle_persons(row + '_', 4, row_data['payroll_person_surname'], 'payroll', [6, 4], ['name', 'surname_a'], payroll_persons, payroll_tbl, 'PERSONS');
                }
            } else if (col === 'payroll_person_surname') {
                handle_persons(row, 4, row_data['payroll_person_surname'], 'payroll', [5, 4, 6, 9], ['name', 'surname_a', 'fathers_name', 'date_of_birth'], payroll_persons, payroll_tbl, 'PERSONS');
                if (row_data['payroll_person_name']) {
                    handle_persons(row, 5, row_data['payroll_person_name'], 'payroll', [5, 4, 6, 9], ['name', 'surname_a', 'fathers_name', 'date_of_birth'], payroll_persons, payroll_tbl, 'PERSONS');
                }
                if (row_data['payroll_person_patronymic']) {
                    handle_persons(row, 6, row_data['payroll_person_patronymic'], 'payroll', [5, 4, 6, 9], ['name', 'surname_a', 'fathers_name', 'date_of_birth'], payroll_persons, payroll_tbl, 'PERSONS');
                }
                if (row_data['payroll_person_date_birth']) {
                    handle_persons(row, 9, row_data['payroll_person_date_birth'], 'payroll', [5, 4, 6, 9], ['name', 'surname_a', 'fathers_name', 'date_of_birth'], payroll_persons, payroll_tbl, 'PERSONS');
                }
            }
            if (col === 'payroll_ship_owner') {
                handle_organizations(this.toString(), 'payroll', row, 3, 'ORGS');
            } else if (col === 'payroll_ship_name') {
                handle_ships(row, 2, this.toString(), 'payroll', [2,3], ['name','owner_company'], 'SHIPS',ship_obj,ships_tbl);
                if (row_data['payroll_ship_owner']) {
                    handle_ships(row, 3, row_data['payroll_ship_owner'], 'payroll', [2,3], ['name','owner_company'], 'SHIPS',ship_obj,ships_tbl);
                }
            } else if (col === 'payroll_previous_ship_name') {
                handle_ships(row + '_', 31, this.toString(), 'payroll', [31, 32], ['name', 'type'], 'SHIPS',ship_obj,ships_tbl);
                if (row_data['payroll_previous_ship_type']) {
                    handle_ships(row + '_', 32, row_data['payroll_previous_ship_type'], 'payroll', [31, 32], ['name', 'type'], 'SHIPS',ship_obj,ships_tbl);
                }
            }
        });
    });
    }
    
     console.log(terms_json);
    update_Vocs_from_json(terms_json);       

    return json;
}
;
///////////////////////////////EXPORT IMPORT///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
/////////// Loading icon
$(window).load(function () {
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

    var payroll_data = new Array();

    $.each(data.payroll, function () {
        payroll_data.push(this);
    });

    // fix_dates(payroll_cols,data.payroll);     
    payroll_hot.loadData(payroll_data);
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

    var sheets = new Array();
    sheets.push([json.record_information]);
    sheets.push([json.source_identity]);
    sheets.push(json.payroll);

    var opts = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Source Identity', header: false}, {sheetid: 'Payroll', header: true}];
    var res = alasql('SELECT * INTO XLSX("' + $('#unique_filename').text() + '.xlsx",?) FROM ?', [opts, sheets]);
});

////////////////////////////////////////////////////////////////////////////////



//////////////////Update Vocabularies on pouch DB

function update_Vocs() {
    console.log(mode)
    if (mode === null) {//only update vocabularies in edit mode

        updateVocabs([catalogue_info, source_identity_data, payroll_hot]);
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
            //console.log(this.tableVariable);
            if (table_id === "source_identity") {
                old_val = source_identity_data.getDataAtCell(this.row, this.col, value);
                source_identity_data.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "payroll_table") {
                old_val = payroll_hot.getDataAtCell(this.row, this.col, value);
                payroll_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
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
    } else if (parentTable === "payroll_table") {
        payroll_hot.setDataAtCell(row, col, val);
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
    tmp['source_identity']['source_language'] = 'Russian';

    var payroll = new Object();
    $.each(json.payroll, function (cnt) {
        payroll['row_' + cnt] = this;
    });

    tmp['payroll'] = payroll;

    root['root'] = tmp;
    var xml = formatXml(json2xml(root));

    xml = xml.replace(/<row_(\d+)>/g, '<row index="$1">');
    xml = xml.replace(/<\/row_(\d+)>/g, "</row>");

    return (xml);
}
;


