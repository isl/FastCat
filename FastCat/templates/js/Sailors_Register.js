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
        else if (subTableName === "promotions") {
            var cols = [
                {data: 'military_promotion_date', type: 'date'},
                {data: 'military_promotion_status', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_es")), vocab: 'status_es'}
            ];
            nestedHeaders = [
                ['Date', 'Status']
            ];
            data = setSubTableData(call_ports_hot, row, startCol, endCol);
        } else if (subTableName === "penalties") {
            var cols = [
                {data: 'military_penalty_date', type: 'date'},
                {data: 'military_penalty_reason', type: 'text'},
                {data: 'military_penalty_type', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("type_of_penalty_es")), vocab: 'type_of_penalty_es'},
                {data: 'military_penalty_duration_value', type: 'text'},
                {data: 'military_penalty_duration_unit', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("unit_es")), vocab: 'unit_es'}
            ];
            nestedHeaders = [
                ['Date', 'Reason', 'Type', 'Value', 'Unit']
            ];
            data = setSubTableData(call_ports_hot, row, startCol, endCol);
        }
        else if (subTableName === "prev_proffs") {
            var cols = [
                {data: 'seafarer_previous_profession', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_capacity_role_es")), vocab: 'status_capacity_role_es'}
            ];
            nestedHeaders = [
                ['Previous Profession']
            ];
            data = setSubTableData(call_ports_hot, row, startCol, endCol);
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
var tablesWithoutCommentCols = new Map();

var tableId = "source_identity";
tablesAndHeaders.set(tableId, ['Name', 'Location', 'Title', 'Number', 'Book Number', 'Name', 'Location', 'Note', 'Comment']);
tablesWithoutCommentCols.set(tableId, [0, 1, 2, 3, 7]); //define fieds that do not have external content

var sourcedata = [{ship_name: ''}];

var source_identity_cols = [
    {data: 'archive_library', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("archive_or_library_es")), vocab: 'archive_or_library_es'},
    {data: 'archive_library_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'folder_title', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("folder_title_es")), vocab: 'folder_title_es'},
    {data: 'folder_number', type: 'text'},
    {data: 'book_number', type: 'text'},
    {data: 'issuing_authority_department', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("local_authority_es")), vocab: 'local_authority_es'},
    {data: 'issuing_authority_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];

var source_container = document.getElementById(tableId);
var headers = [
    [{label: 'Archive / Library', colspan: 2}, {label: 'Folder', colspan: 2}, '', {label: 'Issuing Authority', colspan: 2}, ''],
    tablesAndHeaders.get(tableId)
];

var source_locs = new Object();

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
    afterRenderer: function(td, row, col, prop, value) {
        if ((source_identity_cols[col].vocab === 'location_es') && (value)) {
            handle_locations(value,'source_identity',row,col,'LOCS',source_locs);         
        }else if ((source_identity_cols[col].vocab === 'archive_or_library_es') && value) {
            handle_organizations(value,'source_identity',row, col, 'ORGS');             
        } else if ((source_identity_cols[col].vocab === 'local_authority_es')&&value) {
            handle_organizations(value,'source_identity',row+'_', col, 'ORGS');             
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



////////////////////////////////////////////////////////////////////////////////

//////////////////////////////   5th TABLE     ////////////////////////////////
/////////////////////////Ports of CALL/////////////////////////////////////////                       

var tableId = "seafarers_register";
tablesAndHeaders.set(tableId, ['Source Page', 'Name', 'Surname 1', 'Surname 2', 'Father Name', 'Mother Name', 'Location','Administrative Division', 'Place of Residence', 'Location of regional Organization for military service', 'Date', 'Folio Number', 'Date of Birth', 'Marital Status', 'Previous Profession', 'Start Date', 'Date', 'Status', 'Date', 'Reason', 'Type', 'Value', 'Unit', 'End Date', 'Note', 'Comment']);
tablesWithoutCommentCols.set(tableId, [23]); //define fieds that do not have external content

var ports_data = [
    {source_page: ''}, {source_page: ''}, {source_page: ''}, {source_page: ''}, {source_page: ''},
    {source_page: ''}, {source_page: ''}, {source_page: ''}, {source_page: ''}, {source_page: ''},
    {source_page: ''}, {source_page: ''}, {source_page: ''}, {source_page: ''}, {source_page: ''}
];

var ports_cols = [
    {data: 'source_page', type: 'text'},
    {data: 'seafarer_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es'},
    {data: 'seafarer_surname1', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
    {data: 'seafarer_surname2', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
    {data: 'seafarer_fathers_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es'},
    {data: 'seafarer_mothers_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es'},
    {data: 'seafarer_birth_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'seafarer_administrative_division', type: 'dropdown',
        source: JSON.parse(localStorage.getItem('administrative_division_es')), vocab: 'administrative_division_es'},
    {data: 'seafarer_residence_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'military_service_organization', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'inscription_date', type: 'date'},
    {data: 'inscription_folio_number', type: 'text'},
    {data: 'seafarer_birth_date', type: 'text'},
    {data: 'seafarer_marital_status', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("marital_status_es")), vocab: 'marital_status_es'},
    {data: 'seafarer_previous_profession', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_es")), vocab: 'status_capacity_role_es', renderer: groupRenderer},
    {data: 'military_start_date', type: 'date'},
    {data: 'military_promotion_date', type: 'date', renderer: groupRenderer},
    {data: 'military_promotion_status', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_es")), vocab: 'status_es', renderer: groupRenderer},
    {data: 'military_penalty_date', type: 'date', renderer: groupRenderer},
    {data: 'military_penalty_reason', type: 'text', renderer: groupRenderer},
    {data: 'military_penalty_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("type_of_penalty_es")), vocab: 'type_of_penalty_es', renderer: groupRenderer},
    {data: 'military_penalty_duration_value', type: 'text', renderer: groupRenderer},
    {data: 'military_penalty_duration_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_es")), vocab: 'unit_es', renderer: groupRenderer},
    {data: 'military_end_date', type: 'date'},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];

var headers = [
    ['', '', '', '', '', '', {label: '', colspan: '2'},'' ,'', {label: '', colspan: '2'}, '', '', '', {label: 'Military Service', colspan: '9'}, ''],
    ['', '', '', '', '', '', {label: '', colspan: '2'},'', '', {label: '', colspan: '2'}, '', '', '', '', {label: '', colspan: '2'}, {label: 'Penalty', colspan: '5'}, '', ''],
    ['', '', '', '', '', '', {label: 'Place of Birth', colspan: '2'},'', '', {label: 'Inscription to the organization of military sevice', colspan: '2'}, '', '', '', '', {label: 'Promotion', colspan: '2'}, '', '', '', {label: 'Duration of Penalty', colspan: '2'}, '', ''],
    tablesAndHeaders.get(tableId)
];

var seafarers_registerGroups = [[14, 14], [16, 17], [18, 22]];
headers = markHeaders(headers, seafarers_registerGroups);

var cont = document.getElementById(tableId);




var call_ports_hot = new Handsontable(cont, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: ports_data,
    columns: ports_cols,
    rowHeaders: true,
    manualColumnResize: true,
    contextMenu: true,
    className: "htCenter",
    currentRowClassName: 'currentRow',
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
        if (col > 15 && col < 23) {
            groupLeftClicked(this, row, col);
        }
        else if (col === 14) {
            groupLeftClicked(this, row, col);
        }
    }/*,
    afterRenderer: function(td, row, col, prop, value) {
        if ((ports_cols[col].vocab === 'location_es') && (value)) {            
            //handle_locations(value,'seafarers_register',row,col,'LOCS',seafarers_locs);         
        } 
    }*/
});

call_ports_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(ports_cols[col].vocab);
            }
            else if (key === 'add') {
                var colClicked = call_ports_hot.getSelectedRange().to.col;
                var rowClicked = call_ports_hot.getSelectedRange().to.row;
                if (colClicked > 15 && colClicked < 18) {
                    groupClicked("seafarers_register", "promotions", rowClicked, 16, 17);
                }
                else if (colClicked > 17 && colClicked < 23) {
                    groupClicked("seafarers_register", "penalties", rowClicked, 18, 22);
                }
                else if (colClicked === 14) {
                    groupClicked("seafarers_register", "prev_proffs", rowClicked, 14, 14);
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
                    return call_ports_hot.getSelected()[0] === 0;
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
                    if (((call_ports_hot.getSelected()[0]) < 3) || ((call_ports_hot.getSelected()[2]) < 3)) {
                        return true;
                    }
                }
            },
            "hsep4": "---------",
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function() {
                    var col = call_ports_hot.getSelectedRange().to.col;
                    var label = ports_cols[col].vocab;
                    if (label) {
                        update_Vocs();
                        return call_ports_hot.getSelectedRange().to.col !== col;
                    } else {
                        return call_ports_hot.getSelectedRange().to.col !== -1;
                    }
                }},
            "add": {
                name: "Add table",
                hidden: function() {
                    return isAddTableMenuVisible(this, seafarers_registerGroups);

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

////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////

function createRecordJson(usage) {

    var cat_info = createJson(catalogue_info, cols1, usage);
    var source_id = createJson(source_identity_data, source_identity_cols, usage);
    var port_of_calls = createJson(call_ports_hot, ports_cols, usage);
    var json = new Object();

    cat_info.date_until = getCurrentDate();
    catalogue_info.setDataAtCell(0, 2, getCurrentDate());
    json['record_information'] = cat_info;
    json['source_identity'] = source_id;
    json['seafarers_register'] = port_of_calls;
    
   
    //var obj = new Object();
    var seafarers_locs = new Object();
    var seafarers_persons = new Object();
    var seafarers_tbl = new Object();
    
    $.each(port_of_calls, function (row) {
        console.log('--------handling row '+row+'------------');
        var row_data = this;
        $.each(this, function (col) {
            /////////////// person               
            if (col === 'seafarer_name') {                
                handle_persons(row, 1, row_data['seafarer_name'], 'seafarers_register', [1, 2, 3, 4, 12,11], ['name', 'surname_a', 'surname_b', 'fathers_name', 'date_of_birth','registration_number'], seafarers_persons, seafarers_tbl, 'PERSONS');
                if(row_data['seafarer_surname1']){
                    handle_persons(row, 2, row_data['seafarer_surname1'], 'seafarers_register', [1, 2, 3, 4,12,11], ['name', 'surname_a', 'surname_b', 'fathers_name', 'date_of_birth','registration_number'], seafarers_persons, seafarers_tbl, 'PERSONS');
                }if(row_data['seafarer_surname2']){
                    handle_persons(row, 3, row_data['seafarer_surname2'], 'seafarers_register', [1, 2, 3, 4, 12,11], ['name', 'surname_a', 'surname_b', 'fathers_name', 'date_of_birth','registration_number'], seafarers_persons, seafarers_tbl, 'PERSONS');
                }if(row_data['seafarer_fathers_name']){
                    handle_persons(row, 4, row_data['seafarer_fathers_name'], 'seafarers_register', [1, 2, 3, 4, 12,11], ['name', 'surname_a', 'surname_b', 'fathers_name', 'date_of_birth','registration_number'], seafarers_persons, seafarers_tbl, 'PERSONS');
                }if(row_data['inscription_folio_number']){
                   handle_persons(row, 12, row_data['inscription_folio_number'], 'seafarers_register', [1, 2, 3, 4, 12,11], ['name', 'surname_a', 'surname_b', 'fathers_name', 'date_of_birth','registration_number'], seafarers_persons, seafarers_tbl, 'PERSONS');
               }if(row_data['inscription_folio_number']){
                   handle_persons(row, 11, row_data['inscription_folio_number'], 'seafarers_register', [1, 2, 3, 4, 12,11], ['name', 'surname_a', 'surname_b', 'fathers_name', 'date_of_birth','registration_number'], seafarers_persons, seafarers_tbl, 'PERSONS');
                }
            }    /////////////////////fathers
            if (col === 'seafarer_fathers_name') {
                handle_persons(row + '_', 4, row_data['seafarer_fathers_name'], 'seafarers_register', [4,2], [ 'name','surname_a'], seafarers_persons, seafarers_tbl, 'PERSONS');
                if(row_data['seafarer_surname1']){
                    handle_persons(row + '_', 2, row_data['seafarer_surname1'], 'seafarers_register', [4,2], ['name','surname_a'], seafarers_persons, seafarers_tbl, 'PERSONS');
                }
            }
            if (col === 'seafarer_mothers_name') {
                /////////// mothers
                handle_persons(row + '__', 5, row_data['seafarer_mothers_name'], 'seafarers_register', [5, 3], ['name', 'surname_a'], seafarers_persons, seafarers_tbl, 'PERSONS');
                handle_persons(row + '__', 3, row_data['seafarer_surname2'], 'seafarers_register', [5, 3], ['name', 'surname_a'], seafarers_persons, seafarers_tbl, 'PERSONS');
            }
                      
          var location; 
          
          if(row_data['seafarer_administrative_division']){
              location = row_data['seafarer_birth_location']+"/"+ row_data['seafarer_administrative_division']+"(administrative division)";
          }else{
              location = row_data['seafarer_birth_location'];
          }
          handle_locations(location,'seafarers_register',row,col,'LOCS',seafarers_locs);  
          if(row_data['military_service_organization']){
              handle_locations(row_data['military_service_organization'],'seafarers_register',row,col,'LOCS',seafarers_locs);  
          }
          if(row_data['seafarer_residence_location']){
              handle_locations(row_data['seafarer_residence_location'],'seafarers_register',row,col,'LOCS',seafarers_locs);  
          }
                       
        });                
    });
    
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

    var ports_data = new Array();
    $.each(data.seafarers_register, function() {
        ports_data.push(this);
    });

    call_ports_hot.loadData(ports_data);
    update_Vocs();

}
;
///////////////////////////////////////////////////////////////////////////////
/////////////////////////EXCEL EXPORT////////////////////////////////////////
$('#excelexport').click(function() {

    var json = createRecordJson('excel');
    var temp = JSON.stringify(json);
    temp = temp.replace(/&nbsp;/g, "");
    json = JSON.parse(temp);

    var sheets = new Array();
    sheets.push([json.record_information]);
    sheets.push([json.source_identity]);
    sheets.push(json.seafarers_register);

    var groupTables = createMultipleTables(json['seafarers_register'], seafarers_registerGroups, ports_cols);
    var result = createExcelSheetsData(sheets, groupTables);

    var opts = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Source Identity', header: false}, {sheetid: 'Seafarers Register', header: true}];
    var res = alasql('SELECT * INTO XLSX("' + $('#unique_filename').text() + '.xlsx",?) FROM ?', [opts, result]);

});

//////////////////Update Vocabularies on pouch DB

function update_Vocs() {
    if (mode === null) {//only update vocabularies in edit mode

        updateVocabs([catalogue_info, source_identity_data, call_ports_hot]);
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

    $.each(occs, function() {
        var table_id = this.tableVariable;
        var old_val = "";
        if (table_id === "source_identity") {
            old_val = source_identity_data.getDataAtCell(this.row, this.col, value);
            source_identity_data.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
        } else if (table_id === "seafarers_register") {
            old_val = call_ports_hot.getDataAtCell(this.row, this.col, value);
            call_ports_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
        } else if (table_id === "catalogue_info") {
            old_val = catalogue_info.getDataAtCell(this.row, this.col, value);
            catalogue_info.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
        }
    });
}
;

////////////////////////////////  Big Text Fields   /////////////////////////////

/* *************************************************************************** */

function set_Text_val(row, col, val, parentTable) {

    if (parentTable === 'source_identity') {
        source_identity_data.setDataAtCell(row, col, val);
    } else if (parentTable === 'seafarers_register') {
        call_ports_hot.setDataAtCell(row, col, val);
    }
}
;




////////////////////////////////////////////////////////////////////////////////

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
    tmp['source_identity']['source_language'] = 'Spanish (Castellano)';
    tmp['seafarers_register'] = simple_with_Groups(json.seafarers_register, seafarers_registerGroups, ports_cols);

    root['root'] = tmp;
    var xml = formatXml(json2xml(root));


    xml = xml.replace(/<row_(\d+)>/g, '<row index="$1">');
    xml = xml.replace(/<\/row_(\d+)>/g, "</row>");

    xml = xml.replace(/<group_data_(\d+)>/g, '<group_data index="$1">');
    xml = xml.replace(/<\/group_data_(\d+)>/g, "</group_data>");

    return (xml);
}
;

