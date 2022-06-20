/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


////////////////////////////////  Big Text Fields   /////////////////////////////

/* *************************************************************************** */
function set_Text_val(row, col, val, parentTable) {
    if (parentTable === 'archival_corpus') {
        archival_corpus_hot.setDataAtCell(row, col, val);
    }
}
;
/////////////////////////////////////////////////////////////////////////////////
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

//////////////////////////////   3rd TABLE     ////////////////////////////////
///////////////////////////////ARCHIVAL CORPUS/////////////////////////////////

var archival_data = [
    {archive_title: ""}, {archive_title: ""}, {archive_title: ""}, {archive_title: ""}, {archive_title: ""}, {archive_title: ""},
    {archive_title: ""}, {archive_title: ""}, {archive_title: ""}, {archive_title: ""}, {archive_title: ""}, {archive_title: ""},
    {archive_title: ""}, {archive_title: ""}, {archive_title: ""}];

var archival_columns = [
    {data: 'archive_or_library_name', type: 'text'},
    {data: 'archive_or_library_location', type: 'text'},
    {data: 'archive_title', type: 'text'},
    {data: 'archive_institution_history', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'series_title', type: 'text'},
    {data: 'series_quantity', type: 'text'},
    {data: 'series_type', type: 'text'},
    {data: 'subseries_title', type: 'text'},
    {data: 'subseries_quantity', type: 'text'},
    {data: 'subseries_type', type: 'text'},
    {data: 'component_material_type', type: 'text'},
    {data: 'component_material_number', type: 'text'},
    {data: 'document_number', type: 'text'},
    {data: 'document_original_title', type: 'text'},
    {data: 'document_archival_title', type: 'text'},
    {data: 'document_general_abstract', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'document_source_language', type: 'text'},
    {data: 'document_date_from', type: 'date'},
    {data: 'document_date_to', type: 'date'},
    {data: 'document_date_within', type: 'date'},
    {data: 'registration_number', type: 'text'},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'}
];

var cont = document.getElementById('archival_corpus');

var headers = [
    [{label: '', colspan: '2'}, {label: '', colspan: '2'}, {label: 'Series', colspan: '3'}, {label: 'Subseries', colspan: '3'}, {label: '', colspan: '2'}, {label: 'Document', colspan: '8'}, '', ''],
    [{label: 'Library / Archive', colspan: '2'}, {label: 'Archive', colspan: '2'}, '', {label: 'Archival material component', colspan: '2'}, '', {label: 'Archival material component', colspan: '2'}, {label: 'Archival material component', colspan: '2'}, '', '', '', '', '', {label: 'Date', colspan: '3'}, '', ''],
    ['Name', 'Location', 'Title', 'Institution History', 'Title', 'Quantity', 'Type', 'Title', 'Quantity', 'Type', 'Type', 'Number', 'Number', 'Original Title', 'Archival Title', 'General Abstract', 'Source Language', 'From', 'To', 'Within', 'Registration Number', 'Note']
];

var archival_corpus_hot = new Handsontable(cont, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: archival_data,
    columns: archival_columns,
    contextMenu: true,
    currentRowClassName: 'currentRow',
    manualColumnResize: true,
    className: "htCenter",
    rowHeaders: true,
    autoWrapRow: true,
    colHeaders: ['Name', 'Location', 'Title', 'Institution History', 'Title', 'Quantity', 'Type', 'Title', 'Quantity', 'Type', 'Type', 'Number', 'Original Title', 'Archival Title', 'General Abstract', 'Source Language', 'From', 'To', 'Within', 'Registration Number', 'Note'],
    nestedHeaders: headers,
    cells: function(row, col, prop) {
        if (this.vocab) {
            handle_vocabulary(this.instance.getDataAtCell(row, col), this.vocab, this);
        }
    }
});

archival_corpus_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(archival_columns[col].vocab);
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
                    return archival_corpus_hot.getSelected()[0] === 0;
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
                    if (((archival_corpus_hot.getSelected()[0]) < 3) || ((archival_corpus_hot.getSelected()[2]) < 3)) {
                        return true;
                    }
                }
            },
            "hsep1": "---------",
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function() {
                    var col = archival_corpus_hot.getSelectedRange().to.col;
                    var label = archival_columns[col].vocab;
                    if (label) {
                        update_Vocs();
                        return archival_corpus_hot.getSelectedRange().to.col !== col;
                    } else {
                        return archival_corpus_hot.getSelectedRange().to.col !== -1;
                    }
                }}
        }
    }
});
////////////////////////////////////////////////////////////////////////////////
//////////////////////////////EXPORT IMPORT/////////////////////////////////////   
////////////////////////////////////////////////////////////////////////////////

function createRecordJson(usage) {

    var cat_info = createJson(catalogue_info, cols1, usage);
    var voyages_data = createJson(archival_corpus_hot, archival_columns, usage);
    var json = new Object();

    cat_info.date_until = getCurrentDate();
    catalogue_info.setDataAtCell(0, 2, getCurrentDate());
    json['record_information'] = cat_info;
    json['archival_corpus'] = voyages_data;

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

    var corpus_data = new Array();
    $.each(data.archival_corpus, function() {
        corpus_data.push(this);
    });

    archival_corpus_hot.loadData(corpus_data);
    update_Vocs();
}
;
///////////////////////////////////////////////////////////////////////////////
/////////////////////////EXCEL EXPORT////////////////////////////////////////
$('#excelexport').click(function() {

    var json = createRecordJson('excel');
    var temp = JSON.stringify(json);
    //temp = temp.replace(/null/g, "\"\"");
    temp = temp.replace(/&nbsp;/g, "");
    json = JSON.parse(temp);

    var opts = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Archival Corpus', header: true}];
    var res = alasql('SELECT * INTO XLSX("' + $('#unique_filename').text() + '.xlsx",?) FROM ?', [opts, [[json.record_information], json.archival_corpus]]);

});

//////////////////Update Vocabularies on pouch DB

function update_Vocs() {
    if (mode === null) {//only update vocabularies in edit mode

        updateVocabs([catalogue_info, archival_corpus_hot]);
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
            if (table_id === "archival_corpus") {
                old_val = archival_corpus_hot.getDataAtCell(this.row, this.col, value);
                archival_corpus_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "catalogue_info") {
                old_val = catalogue_info.getDataAtCell(this.row, this.col, value);
                catalogue_info.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            }
        });
    }
}
;


/////////////////////////////////////////////////////////////////////

///////////////////////////EXPORT TO XML//////////////////////////////////
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
    tmp['record_information']['related_organization'] = 'All';
    tmp['record_information']['record_id'] = recordId;
    tmp['record_information']['template_type'] = templateTitle;
    tmp['record_information']['source_language'] = 'All';
    var corpus = new Object();
    $.each(json.archival_corpus, function(cnt) {
        corpus['row_' + cnt] = this;
    });

    tmp['archival_corpus'] = corpus;

    root['root'] = tmp;
    var xml = formatXml(json2xml(root));



    xml = xml.replace(/<row_(\d+)>/g, '<row index="$1">');
    xml = xml.replace(/<\/row_(\d+)>/g, "</row>");

    xml = xml.replace(/<group_data_(\d+)>/g, '<group_data index="$1">');
    xml = xml.replace(/<\/group_data_(\d+)>/g, "</group_data>");


    return (xml);
}
;