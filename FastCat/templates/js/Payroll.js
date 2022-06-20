
var transactionTypes = [];
var goods = [];


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

        } else if (subTableName === "ownerCaptains") {
            var cols = [
                {data: 'captain_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_gr")), vocab: 'name_gr', },
                {data: 'captain_surname', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_gr")), vocab: 'surname_gr'}
            ];
            nestedHeaders = [
                ['Name', 'Surname']
            ];
            data = setSubTableData(ship_record_hot, row, startCol, endCol);


        } else if (subTableName === "ownerPersons") {
            var cols = [
                {data: 'owner_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_gr")), vocab: 'name_gr'},
                {data: 'owner_surname', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_gr")), vocab: 'surname_gr'}
            ];
            nestedHeaders = [
                ['Name', 'Surname']
            ];
            data = setSubTableData(ship_record_hot, row, startCol, endCol);

        } else if (subTableName === "ownerOrganizations") {
            var cols = [
                {data: 'organization_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("organization_gr")), vocab: 'organization_gr'},
                {data: 'organization_location', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'}
            ];
            nestedHeaders = [
                ['Name', 'Headquarters Location']
            ];
            data = setSubTableData(ship_record_hot, row, startCol, endCol);

        }
        else if (subTableName === "signatures") {
            var cols = [
                {data: 'signed_by_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_gr")), vocab: 'name_gr'},
                {data: 'signed_by_surname', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_gr")), vocab: 'surname_gr'},
                {data: 'signed_by_grade', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_gr")), vocab: 'status_gr'}
            ];
            nestedHeaders = [
                ['Name', 'Surname', 'Grade']
            ];
            data = setSubTableData(voyages_hot, row, startCol, endCol);
        }
        else if (subTableName === "routes") {
            var cols = [
                {data: 'route_from', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
                {data: 'route_to', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'}
            ];
            nestedHeaders = [
                ['From', 'To']
            ];
            data = setSubTableData(voyages_hot, row, startCol, endCol);
        }


        else if (subTableName === "payroll_analysis") {
            var cnt = parentTableName.replace("transactions", "");
            var cols = [
                {data: 'person_profession_rank', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_capacity_role_gr")), vocab: 'status_capacity_role_gr'},
                {data: 'date_type', type: 'dropdown', source: ['Julian', 'Gregorian']},
                {data: 'person_recruitment', type: 'date'},
                {data: 'person_discharge', type: 'date'},
                {data: 'total_duration_months', type: 'text'},
                {data: 'total_duration_days', type: 'text'},
                {data: 'location_recruitment', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
                {data: 'recruitment_state', type: 'dropdown',
                    source: ['Απολύθηκε', 'Δραπέτευσε']},
                {data: 'location_discharge', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
                {data: 'permit_days', type: 'text'},
                {data: 'permit_port_of_exit', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
                {data: 'monthly_wage_value', type: 'text'},
                {data: 'monthly_wage_unit', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
                {data: 'monthly_equivalent_value', type: 'text'},
                {data: 'monthly_equivalent_unit', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
                {data: 'total_wage_value', type: 'text'},
                {data: 'total_wage_unit', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
                {data: 'total_equivalent_value', type: 'text'},
                {data: 'total_equivalent_unit', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
                {data: 'pension_fund_value', type: 'text'},
                {data: 'pension_fund_unit', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
                {data: 'pension_equivalent_value', type: 'text'},
                {data: 'pension_equivalent_unit', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
                {data: 'bonus_value', type: 'text'},
                {data: 'bonus_unit', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
                {data: 'equivalent_bonus_value', type: 'text'},
                {data: 'equivalent_bonus_unit', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
                {data: 'net_wage_value', type: 'text'},
                {data: 'net_wage_unit', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
                {data: 'equivalent_net_wage_value', type: 'text'},
                {data: 'equivalent_net_wage_unit', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'}
            ];
            nestedHeaders = [
                // ['', {label: 'Timespan of Work', colspan: 5}, {label: '', colspan: 23}],
                //   ['', '', '', {label: 'Total Duration', colspan: 3}, '', {label: 'Discharge ', colspan: 2}, {label: 'Permit', colspan: 2}, {label: 'Monthly Wage', colspan: 2}, {label: 'Equivalent Currency of M.W.', colspan: 2}, {label: 'Total Wage', colspan: 2}, {label: 'Equivalent Currency of T.W.', colspan: 2}, {label: 'Pension Fund', colspan: 2}, {label: 'Equivalent Currency of P.F.', colspan: 2}, {label: 'Bonus', colspan: 2}, {label: 'Equivalent C.B.', colspan: 2}, {label: 'Net Wage', colspan: 2}, {label: 'Equivalent Currency of N.W.', colspan: 2}],
                ['Profession | Rank', 'Date Type', 'Recruitment Date', 'Discharge Date', 'Months', 'Days', 'Recruitment Location', 'State', 'Location', 'Days', 'Port of Exit', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit']
            ];
            data = setSubTableData(voyage_transactions[cnt], row, startCol, endCol);

        }
        else if (subTableName === "payment_analysis") {
            var cnt = parentTableName.replace("transactions", "");
            var cols = [
                {data: 'payment_location', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
                {data: 'payment_date', type: 'date'},
                {data: 'payment_form_of_money', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("money_form_gr")), vocab: 'money_form_gr'},
                {data: 'payment_value', type: 'text'},
                {data: 'payment_unit', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
                {data: 'payment_equivalent_value', type: 'text'},
                {data: 'payment_equivalent_unit', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
                {data: 'good_type', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("good_type_gr")), vocab: 'good_type_gr'},
                {data: 'good_value', type: 'text'},
                {data: 'good_unit', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
                {data: 'reason', type: 'text'}

            ];
            nestedHeaders = [
                [{label: 'Payment', colspan: 2}, '', {label: 'Amount', colspan: 2}, {label: 'Equivalent Currency', colspan: 2}, {label: 'Related Good', colspan: 2}, ''],
                ['Location', 'Date', 'Form of Money', 'Value', 'Unit', 'Value', 'Unit', 'Type', 'Value', 'Unit', 'Reason']
            ];
            data = setSubTableData(voyage_transactions[cnt], row, startCol, endCol);

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
tablesAndHeaders.set(tableId, ['Name', 'Location', 'Collection Title', 'Original Title', 'Archival Title', 'Number', 'From *', 'To *', 'Within', 'Name', 'Location', 'Note', 'Comment']);
tablesWithoutCommentCols.set(tableId, [0, 1, 2, 11]); //define fieds that do not have external content

var source_identity_cols = [
    {data: 'archive_library', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("archive_or_library_gr")), vocab: 'archive_or_library_gr'},
    {data: 'source_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
    {data: 'collection', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("collection_gr")), vocab: 'collection_gr'},
    {data: 'book_title', type: 'text'},
    {data: 'book_archival_title', type: 'text'},
    {data: 'book_number', type: 'text'},
    {data: 'book_date_from', type: 'date'},
    {data: 'book_date_to', type: 'date'},
    {data: 'book_date_within', type: 'date'},
    {data: 'issuing_authority', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("local_authority_gr")), vocab: 'local_authority_gr'},
    {data: 'issuing_authority_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
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
        [{label: '', colspan: 2}, '', {label: 'Book/Folder', colspan: 6}, {label: '', colspan: 2}, ''],
        [{label: 'Archive / Library', colspan: 2}, '', {label: '', colspan: 3}, {label: 'Date of Book / Folder', colspan: 3}, {label: 'Issuing authority', colspan: 2}, ''],
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
        if ((source_identity_cols[col].vocab === 'location_gr') && (value)) {            
            handle_locations(value,'source_identity',row,col,'LOCS',source_locs);         
        }else if (((source_identity_cols[col].vocab === 'archive_or_library_gr') && value)) {
            handle_organizations(value, 'source_identity', row, col, 'ORGS');
        }else if ((source_identity_cols[col].vocab === 'local_authority_gr')&&value) {
            handle_organizations(value, 'source_identity', row+'_', col, 'ORGS');
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
/////////////////////////////SHIP RECORD/////////////////////////////////////////////             

var tableId = "identifier_table";
tablesAndHeaders.set(tableId, ['Ship name *', 'Ship type *', 'Name', 'Surname', 'Name', 'Surname',/* 'Headquarters Location',*/ 'Name', 'Headquarters Location', 'Note', 'Comment']);
tablesWithoutCommentCols.set(tableId, [9]); //define fieds that do not have external content

var sourcedata = [
    {ship_name: ''}
];

var cols3 = [
    {data: 'ship_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_gr")), vocab: 'ship_name_gr'},
    {data: 'ship_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_type_gr")), vocab: 'ship_type_gr'},
    {data: 'captain_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_gr")), vocab: 'name_gr', renderer: groupRenderer},
    {data: 'captain_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_gr")), vocab: 'surname_gr', renderer: groupRenderer},
    {data: 'owner_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_gr")), vocab: 'name_gr', renderer: groupRenderer},
    {data: 'owner_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_gr")), vocab: 'surname_gr', renderer: groupRenderer},
 //   {data: 'owner_location', type: 'dropdown',
 //       source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr', renderer: groupRenderer},
    {data: 'organization_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_gr")), vocab: 'organization_gr', renderer: groupRenderer},
    {data: 'organization_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr', renderer: groupRenderer},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];

var headers = [
    ['', '', {label: '', colspan: 2}, {label: 'Owner', colspan: 4}, ''],
    ['', '', {label: 'Captain', colspan: 2}, {label: 'Person', colspan: 2}, {label: 'Organization', colspan: 2}, ''],
    tablesAndHeaders.get(tableId)
];
var identifier_tableGroups = [[2, 3], [4, 5], [6, 7]];

headers = markHeaders(headers, identifier_tableGroups);
var record_locs = new Object();
var ships_persons = new Object();
var persons_tbl = new Object();
 var ship_obj = new Object();
        var ships_tbl = new Object();

 

var ship_record_hot = new Handsontable(identifier_table, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: sourcedata,
    columns: cols3,
    manualColumnResize: true,
    className: "htCenter",
    currentRowClassName: 'currentRow',
    autoWrapRow: true,
    maxRows: 1,
    contextMenu: true,
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
        if (col > 1 && col < 4) {
            groupLeftClicked(this, row, col);
        } else if (col > 3 && col < 6) {
            groupLeftClicked(this, row, col);
        } else if (col > 5 && col < 8) {
            groupLeftClicked(this, row, col);
        }
    },
    afterRenderer: function(td, row, col, prop, value) {
        if ((cols3[col].vocab === 'location_gr') && (value)) {
            handle_multiple_table_instances(row,col,value,'ship_identity',null, null,record_locs, null, 'LOCS');             
        } else if (value && ((cols3[col].vocab === 'organization_gr'))) {
            handle_multiple_table_instances(row+'_',col,value,'ship_identity',null, null,null,null, 'ORGS');    
        } else if (cols3[col].vocab) {         
           if (value && (((cols3[col].vocab.indexOf('ship_name') > -1) || (cols3[col].vocab.indexOf('ship_type') > -1)))) {                 
            handle_ships(row, col, value, 'ship_identity', [0, 1], ['name', 'type'],  'SHIPS',ship_obj,ships_tbl);
           }
         }else if ((value)&&((col>1&& col<6))) {
            handle_multiple_table_instances(row+'_',col,value,'ship_identity',[2, 3], ['name', 'surname_a'], ships_persons, persons_tbl, 'PERSONS');      
            handle_multiple_table_instances(row+'__',col,value,'ship_identity', [4, 5], ['name', 'surname_a'], ships_persons, persons_tbl, 'PERSONS');              
        }
    }
});

ship_record_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                var row = options.start.row;
                create_voc_modal(cols3[col].vocab, col, row);
            }
            else if (key === 'add') {
                var colClicked = ship_record_hot.getSelectedRange().to.col;
                if (colClicked > 1 && colClicked < 4) {
                    groupClicked("identifier_table", "ownerCaptains", 0, 2, 3);
                } else if (colClicked > 3 && colClicked < 7) {
                    groupClicked("identifier_table", "ownerPersons", 0, 4, 5);
                } else if (colClicked > 6 && colClicked < 9) {
                    groupClicked("identifier_table", "ownerOrganizations", 0, 6, 7);
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
                    var col = ship_record_hot.getSelectedRange().to.col;
                    var label = cols3[col].vocab;
                    if (label) {
                        update_Vocs();
                        return ship_record_hot.getSelectedRange().to.col !== col;
                    } else {
                        return ship_record_hot.getSelectedRange().to.col !== -1;
                    }
                }},
            "add": {
                name: "Add table",
                hidden: function() {
                    return isAddTableMenuVisible(this, identifier_tableGroups);

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

//////////////////////////////   4th TABLE     ////////////////////////////////
/////////////////////////VOYAGE INFORMATION/////////////////////////////////////////                       
var tableId = "example1";
tablesAndHeaders.set(tableId, ['Source Pages', 'Voyage number', 'Type', 'From', 'To', 'From', 'To', 'Name', 'Surname', 'Grade', 'Total Days', 'Days at Sea', 'Days at Port', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Payroll Analysis', 'Note', 'Comment']);
tablesWithoutCommentCols.set(tableId, [25, 26]); //define fieds that do not have external content

var voyage_data = [
    {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""},
    {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}];

var cols = [
    {data: 'voyage_source_pages', type: 'text'},
    {data: 'voyage_number', type: 'text'},
    {data: 'date_type', type: 'dropdown',
        source: ['Julian', 'Gregorian']},
    {data: 'date_from', type: 'date'},
    {data: 'date_to', type: 'date'},
    {data: 'route_from', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr', renderer: groupRenderer},
    {data: 'route_to', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr', renderer: groupRenderer},
    {data: 'signed_by_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_gr")), vocab: 'name_gr', renderer: groupRenderer},
    {data: 'signed_by_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_gr")), vocab: 'surname_gr', renderer: groupRenderer},
    {data: 'signed_by_grade', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_gr")), vocab: 'status_gr', renderer: groupRenderer},
    {data: 'days', type: 'text'},
    {data: 'days_at_sea', type: 'text'},
    {data: 'days_at_port', type: 'text'},
    {data: 'overall_total_wages_value', type: 'text'},
    {data: 'overall_total_wages_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
    {data: 'equivalent_overall_total_wages_value', type: 'text'},
    {data: 'equivalent_overall_total_wages_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
    {data: 'overall_pension_fund_value', type: 'text'},
    {data: 'overall_pension_fund_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
    {data: 'equivalent_overall_pension_fund_value', type: 'text'},
    {data: 'equivalent_overall_pension_fund_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
    {data: 'overall_net_wages_value', type: 'text'},
    {data: 'overall_net_wages_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
    {data: 'equivalent_overall_net_wages_value', type: 'text'},
    {data: 'equivalent_overall_net_wages_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr'},
    {data: 'payroll_analysis', renderer: buttonRenderer, readOnly: true},
    {data: 'voyages_note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];


function buttonRenderer(instance, td, row, col, prop, value, cellProperties) {
    var title = instance.getDataAtCell(row, 1);
    if (title) {
        title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
    }
    td.innerHTML = "<a onclick='createNestedTable(" + row + "," + null + ",\"" + title + "\")'> <button id='Row_" + row + "' style='padding:2px; font-size:8px;' type='button' class=' nested_button btn btn-outline-secondary'>Nested table</button></a>";// + value;
    td.className = 'htCenter';
    return td;
}

function paymentAnalysisRenderer(instance, td, row, col, prop, value, cellProperties) {
    var title = instance.getDataAtCell(row, 1);
    if (title) {
        title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
    }
    td.innerHTML = "<a onclick='showPaymentList(" + row + "," + null + ",\"" + title + "\")'>  <button id='payment_button_" + row + "' style='padding:2px; font-size:8px;' type='button' class=' aggregade_nested btn btn-outline-secondary'>Nested table</button></a>";// + value;
    td.className = 'htCenter';
    return td;
}



var headers = [
    ['', '', {label: '', colspan: '3'}, {label: '', colspan: '2'}, {label: '', colspan: '3'}, {label: '', colspan: '3'}, {label: 'Total PayRoll', colspan: '13'}, ''],
    ['', '', {label: 'Date', colspan: '3'}, {label: 'Route', colspan: '2'}, {label: 'Signed By', colspan: '3'}, {label: 'Duration', colspan: '3'}, {label: 'Overall Total Wages', colspan: '2'}, {label: 'Equivalent Currency of O.T.W.', colspan: '2'}, {label: 'Overall Pension Fund', colspan: '2'}, {label: 'Equivalent Currency of O.P.F.', colspan: '2'}, {label: 'Overall Net Wages', colspan: '2'}, {label: 'Equivalent Currency of O.N.W.', colspan: '2'}, '', ''],
    tablesAndHeaders.get(tableId)
];

var voyages_Groups = [[5, 6], [7, 9]];
headers = markHeaders(headers, voyages_Groups);
var voyages_locs = new Object();
var voyages_persons = new Object();

 

var cont = document.getElementById(tableId);

var voyages_hot = new Handsontable(cont, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: voyage_data,
    columns: cols,
    contextMenu: true,
    manualColumnResize: true,
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
        if (col > 6 && col < 10) {
            groupLeftClicked(this, row, col);
        } else if (col > 4 && col < 7) {
            groupLeftClicked(this, row, col);
        }
    },    
    afterRenderer: function(td, row, col, prop, value) {
        if ((cols[col].vocab === 'location_gr') && (value)) {     
            if(value.indexOf("\n")>-1){
                var multi_locs = value.split("\n");
                 $.each(multi_locs, function(i) {
                      handle_locations(this.toString(),'voyages',row,col,'LOCS',voyages_locs); 
                 });      
            }else{
                handle_locations(value,'voyages',row,col,'LOCS',voyages_locs); 
            }
        }else if (value) {
            handle_persons(row, col, value, 'voyages', [7, 8,9], ['name', 'surname_a','grade'], voyages_persons, persons_tbl, 'PERSONS');            
        }
    }
});

voyages_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(cols[col].vocab);
            }
            else if (key === 'add') {
                var colClicked = voyages_hot.getSelectedRange().to.col;
                var rowClicked = voyages_hot.getSelectedRange().to.row;
                if (colClicked > 6 && colClicked < 10) {
                    groupClicked("example1", "signatures", rowClicked, 7, 9);
                } else if (colClicked > 4 && colClicked < 7) {
                    groupClicked("example1", "routes", rowClicked, 5, 6);
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
                    return voyages_hot.countRows() - 1 !== voyages_hot.getSelected()[0];
                },
                callback: function() {
                    this.alter('insert_row', this.getSelected()[0] + 1, 10);
                }
            },
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function() {
                    var col = voyages_hot.getSelectedRange().to.col;
                    var label = cols[col].vocab;
                    if (label) {
                        update_Vocs();
                        return voyages_hot.getSelectedRange().to.col !== col;
                    } else {
                        return voyages_hot.getSelectedRange().to.col !== -1;
                    }
                }},
            "add": {
                name: "Add table",
                hidden: function() {
                    return isAddTableMenuVisible(this, voyages_Groups);
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

var voyage_transactions = [];
var transaction_columns = [
    {data: 'payroll_source_pages', type: 'text'},
    {data: 'serial_number', type: 'text'},
    {data: 'person_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_gr")), vocab: 'name_gr'},
    {data: 'person_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_gr")), vocab: 'surname_gr'},
    {data: 'person_age', type: 'dropdown',
        source: ['Adult', 'Child']},
    {data: 'person_literacy', type: 'dropdown',
        source: ['Literate', 'Illiterate']},
    {data: 'person_origin_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr'},
    {data: 'person_profession_rank', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_gr")), vocab: 'status_capacity_role_gr', renderer: groupRenderer},
    {data: 'date_type', type: 'dropdown',
        source: ['Julian', 'Gregorian'], renderer: groupRenderer},
    {data: 'person_recruitment', type: 'date', renderer: groupRenderer},
    {data: 'person_discharge', type: 'date', renderer: groupRenderer},
    {data: 'total_duration_months', type: 'text', renderer: groupRenderer},
    {data: 'total_duration_days', type: 'text', renderer: groupRenderer},
    {data: 'location_recruitment', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr', renderer: groupRenderer},
    {data: 'recruitment_state', type: 'dropdown',
        source: ['Απολύθηκε', 'Δραπέτευσε'], renderer: groupRenderer},
    {data: 'location_discharge', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr', renderer: groupRenderer},
    {data: 'permit_days', type: 'text', renderer: groupRenderer},
    {data: 'permit_port_of_exit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr', renderer: groupRenderer},
    {data: 'monthly_wage_value', type: 'text', renderer: groupRenderer},
    {data: 'monthly_wage_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr', renderer: groupRenderer},
    {data: 'monthly_equivalent_value', type: 'text', renderer: groupRenderer},
    {data: 'monthly_equivalent_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr', renderer: groupRenderer},
    {data: 'total_wage_value', type: 'text', renderer: groupRenderer},
    {data: 'total_wage_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr', renderer: groupRenderer},
    {data: 'total_equivalent_value', type: 'text', renderer: groupRenderer},
    {data: 'total_equivalent_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr', renderer: groupRenderer},
    {data: 'pension_fund_value', type: 'text', renderer: groupRenderer},
    {data: 'pension_fund_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr', renderer: groupRenderer},
    {data: 'pension_equivalent_value', type: 'text', renderer: groupRenderer},
    {data: 'pension_equivalent_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr', renderer: groupRenderer},
    {data: 'bonus_value', type: 'text', renderer: groupRenderer},
    {data: 'bonus_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr', renderer: groupRenderer},
    {data: 'bonus_equivalent_value', type: 'text', renderer: groupRenderer},
    {data: 'bonus_equivalent_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr', renderer: groupRenderer},
    {data: 'net_wage_value', type: 'text', renderer: groupRenderer},
    {data: 'net_wage_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr', renderer: groupRenderer},
    {data: 'net_wage_equivalent_value', type: 'text', renderer: groupRenderer},
    {data: 'net_wage_equivalent_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr', renderer: groupRenderer},
    /////////////////////////////////////////////////
    {data: 'payment_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_gr")), vocab: 'location_gr', renderer: groupRenderer},
    {data: 'payment_date', type: 'date', renderer: groupRenderer},
    {data: 'payment_form_of_money', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("money_form_gr")), vocab: 'money_form_gr', renderer: groupRenderer},
    {data: 'payment_value', type: 'text', renderer: groupRenderer},
    {data: 'payment_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr', renderer: groupRenderer},
    {data: 'payment_equivalent_value', type: 'text', renderer: groupRenderer},
    {data: 'payment_equivalent_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr', renderer: groupRenderer},
    {data: 'good_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("good_type_gr")), vocab: 'good_type_gr', renderer: groupRenderer},
    {data: 'good_value', type: 'text', renderer: groupRenderer},
    {data: 'good_unit', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("unit_gr")), vocab: 'unit_gr', renderer: groupRenderer},
    {data: 'reason', type: 'text', renderer: groupRenderer},
    ///////////////////////////////////////////////////
    {data: 'payroll_note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];

var transactionsGroups = [[7, 37], [38, 48]];



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

//var voyage_transaction;

function createNestedTable(cnt, data, header) {
    
    //////// nested data from json ///////////////
    if(nested_tables){        
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
        table_header = ' / Voyage Number : ' + header;
    }

    var html = "<div  class='panel panel-default nested_table not_visible' style='border:transparent; margin-top:5px;'>" +
            "<div class='panel-heading' role='tab' id='heading" + cnt + "'>" +
            "<h4 class='panel-title'>" +
            "    <a style='background-color:#589AAF;' class='collapsed' role='button' onclick='close_nested(" + cnt + ")'  href='#collapse" + cnt + "'>" +
            "<span class='pull-right glyphicon glyphicon-remove'></span>" + "Payroll Analysis " + plus + table_header +
            "     </a>" +
            "</h4>" +
            "</div>" +
            "<div id='collapse" + cnt + "' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='heading" + cnt + "'>" +
            "    <div style='padding-top:6px;' class='panel-body'>" +
            "    <span style=' color:#163758; padding:0px;font-size: 11px'>Use the source language to fill in the fields of this table</span>" +
            "        <div>" +
            "            <div id='transactions" + cnt + "' class='hot handsontable htRowHeaders htColumnHeaders' style='height: 470px; overflow: hidden; width: 100%; margin:5px 0px 0px 4px;'></div>" +
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

        var tableId = 'transactions' + cnt;
        tablesWithoutCommentCols.set(tableId, [49]); //define fieds that do not have external content
        tablesAndHeaders.set('transactions', ['Source Pages', 'Serial Number', 'Name', 'Surname', 'Adult / Child', 'Literacy', 'Location of Origin', 'Profession | Rank', 'Date Type', 'Recruitment Date', 'Discharge Date', 'Months', 'Days', 'Recruitment Location', 'State', 'Location', 'Days', 'Port of Exit', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Value', 'Unit', 'Location', 'Date', 'Form of Money', 'Value', 'Unit', 'Value', 'Unit', 'Type', 'Value', 'Unit', 'Reason', 'Note', 'Comment']);
        var container = document.getElementById(tableId);

        var headers = [
            [{label: 'Person', colspan: 49}],
            ['', '', '', '', '', '', '', '', {label: 'Timespan of Work', colspan: 5}, '', {label: '', colspan: 2}, {label: '', colspan: 2}, {label: '', colspan: 2}, {label: '', colspan: 2}, {label: '', colspan: 2}, {label: '', colspan: 2}, {label: '', colspan: 2}, {label: '', colspan: 2}, {label: '', colspan: 2}, {label: '', colspan: 2}, {label: '', colspan: 2}, {label: '', colspan: 2}, {label: 'Payment Analysis', colspan: 11}, ''],
            ['', '', '', '', '', '', '', '', '', '', '', {label: 'Total Duration', colspan: 2}, '', {label: 'Discharge ', colspan: 2}, {label: 'Permit', colspan: 2}, {label: 'Monthly Wage', colspan: 2}, {label: 'Equivalent Currency of M.W.', colspan: 2}, {label: 'Total Wage', colspan: 2}, {label: 'Equivalent Currency of T.W.', colspan: 2}, {label: 'Pension Fund', colspan: 2}, {label: 'Equivalent Currency of P.F.', colspan: 2}, {label: 'Bonus', colspan: 2}, {label: 'Equivalent Currency of Bonus', colspan: 2}, {label: 'Net Wage', colspan: 2}, {label: 'Equivalent Currency of N.W.', colspan: 2}, {label: 'Payment', colspan: 2}, '', {label: 'Amount', colspan: 2}, {label: 'Equivalent Currency', colspan: 2}, {label: 'Related Good', colspan: 3}, '', ''],
            tablesAndHeaders.get('transactions')
        ];



        headers = markHeaders(headers, transactionsGroups);
        var transaction_locs = new Object();
        var transaction_persons = new Object();
         

        var voyage_transaction = new Handsontable(container, {
            licenseKey: '',
            dateFormat: 'YYYY-MM-DD',
            data: data,
            columns: transaction_columns,
            contextMenu: true,
            manualColumnResize: true,
            autoWrapRow: true,
            currentRowClassName: 'currentRow',
            className: "htCenter htMiddle",
            colHeaders: tablesAndHeaders.get('transactions'),
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
                columns: [tablesAndHeaders.get('transactions').length - 1] //last column only
            },
            afterLoadData: function() {
                addCommentForContentFoundOutsideTheSource(this);
            },
            afterRender: function() {
                markGroups(this);
            },
            afterSelectionEnd: function(row, col) {
                markGroups(this);
                if (col > 6 && col < 38) {
                    groupLeftClicked(this, row, col);
                } else if (col > 37 && col < 49) {
                    groupLeftClicked(this, row, col);
                }
            }/*,
            afterRenderer: function(td, row, col, prop, value) {
                if ((transaction_columns[col].vocab === 'location_gr') && (value)) {
                    handle_multiple_table_instances(row,col,value,'transactions_' + cnt,null, null,transaction_locs, null, 'LOCS');                    
                }/* else if ((value)&&((col===1|| col===2||col===7))) {                    
                    handle_persons(row, col, value, 'transactions_' + cnt, [2, 3,7], ['name', 'surname_a','status'], transaction_persons, persons_tbl,'PERSONS');                    
                }
            }*/
        });


        voyage_transaction.updateSettings({
            contextMenu: {
                callback: function(key, options) {
                    if (key === 'edit_vocabulary') {
                        var col = options.start.col;
                        create_voc_modal(transaction_columns[col].vocab);
                    }
                    else if (key === 'add') {
                        var colClicked = voyage_transaction.getSelectedRange().to.col;
                        var rowClicked = voyage_transaction.getSelectedRange().to.row;
                        if (colClicked > 6 && colClicked < 38) {
                            groupClicked('transactions' + cnt, "payroll_analysis", rowClicked, 7, 37);
                        } else if (colClicked > 37 && colClicked < 49) {
                            groupClicked('transactions' + cnt, "payment_analysis", rowClicked, 38, 48);
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
                    "hsep2": "---------",
                    "remove_row": {
                        disabled: function() {
                            if (((voyage_transaction.getSelected()[0]) < 3) || ((voyage_transaction.getSelected()[2]) < 3)) {
                                return true;
                            }
                        }
                    },
                    "hsep1": "---------",
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
                    "add": {
                        name: "Add table",
                        hidden: function() {
                            return isAddTableMenuVisible(this, transactionsGroups);

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
        voyage_transactions[cnt] = voyage_transaction;

    }
    else {
        if (!((header == null) || (header == "null"))) {
            $('#heading' + cnt).children().children().html('<span class="pull-right glyphicon glyphicon-remove"></span>Payroll Analysis ' + plus + ' / Voyage Number : ' + header);
        }

        $('#Row_' + cnt).css({'background': '#638BC7'});
        $('#Row_' + cnt).css({'color': '#ffffff'});
        $('#insert_here').show();
    }
}
;

//////////////////////////EXPORT IMPORT////////////////////////////////


/////////////////////////////////////////////////////////////////////
            

function createRecordJson(usage) {

    // var tables = [];

    var cat_info = createJson(catalogue_info, cols1, usage);
    var source_id = createJson(source_identity_data, source_identity_cols, usage);
    var source_contents = createJson(ship_record_hot, cols3, usage);
    var voyages_data = createJson(voyages_hot, cols, usage);

    var json = new Object();
       

    var voyage_keys = Object.keys(voyage_transactions);
    var transactions = new Object();
        
    if ( ((usage === 'excel')&& (nested_tables) )|| ((mode === 'teamView') && (nested_tables))) {

        $.each(nested_tables, function (cnt) {
            var voyages_trans = new Array();
            $.each(this, function () {
                voyages_trans.push(this);
            });
            console.log('exporting nested table: ' + cnt);
            createNestedTable(cnt, voyages_trans);
            $(".nested_table").hide();
             transactions[cnt] = createJson((voyage_transactions[cnt]), transaction_columns, usage);
        });
        nested_tables = null;
    } 
    else {       
        transactions = nested_tables_object; 
        //console.log(transactions)
        for (var i = 0; i < voyage_keys.length; i++) {            
            transactions[voyage_keys[i]] = createJson((voyage_transactions[voyage_keys[i]]), transaction_columns, usage);
            // tables.push(voyage_transactions[voyage_keys[i]]);
            //console.log(transactions)
        }
    }

    cat_info.date_until = getCurrentDate();
    catalogue_info.setDataAtCell(0, 2, getCurrentDate());
    json['record_information'] = cat_info;
    json['source_identity'] = source_id;
    json['ship_records'] = source_contents;
    json['voyages'] = voyages_data;
    json['payroll_analysis'] = transactions;

         
      

   // console.log(record_status);
    if (record_status === 'Public') {
        
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
        ///////////////// ship identity
        terms = new Object();
        $.each(source_contents, function (col) {
            var val = this.toString();
            $.each(cols3, function (col_no) {
                if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                    var label = $(this).attr('vocab');                    
                    handle_json_vocs(val,label,0,col,col_no,'ship_identity',terms);
                }
            });                                                            
        });
        /////////////////////////////////////////////////////////////////////////
        terms = new Object();
        $.each(voyages_data, function (row) {            
            $.each(this, function (col) {
                var val = this.toString();
                $.each(cols, function (col_no) {
                    if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                        var label = $(this).attr('vocab');                      
                        handle_json_vocs(val, label, row, col, col_no, 'voyages', terms);
                    }
                });
            });
        });            
        ///////////////////////Transaction
      
      
        $.each(transactions, function (cnt) {
                                                                                                  
            console.log("--------- collecting intances from nested table " + cnt + "----------------");
            var transaction_persons = new Object();
            var persons_tbl = new Object();
            var transaction_locs = new Object();
            var terms = new Object();
            $.each(this, function (row) {
                var row_data = this;
                
                $.each(this, function (col) {
                    //////////////handle vocabulary nested//////////////////                
                    var val = this;
                    $.each(transaction_columns, function (col_no) {
                        if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                            var label = $(this).attr('vocab');
                            handle_vocabulary(val, label, this);
                            handle_json_vocs(val,label,row,col,col_no,'transactions_' + cnt,terms);
                        }
                    });
                    //////////////////////////////////////////////////////
                    if ((col === 'person_name')) {
                        handle_multiple_table_instances(row, 2, row_data['person_name'], 'transactions_' + cnt, [2, 3, 6,7], ['name', 'surname_a','place_of_birth', 'status'], transaction_persons, persons_tbl, 'PERSONS');
                        if ((row_data['person_surname'])) {
                            handle_multiple_table_instances(row, 3, row_data['person_surname'], 'transactions_' + cnt, [2, 3, 6,7], ['name', 'surname_a', 'place_of_birth','status'], transaction_persons, persons_tbl, 'PERSONS');
                        }
                        if ((row_data['person_origin_location'])) {
                            handle_multiple_table_instances(row, 6, row_data['person_origin_location'], 'transactions_' + cnt, [2, 3,6, 7], ['name', 'surname_a','place_of_birth' ,'status'], transaction_persons, persons_tbl, 'PERSONS');
                        }
                        if ((row_data['person_profession_rank'])) {
                            handle_multiple_table_instances(row, 7, row_data['person_profession_rank'], 'transactions_' + cnt, [2, 3,6, 7], ['name', 'surname_a','place_of_birth', 'status'], transaction_persons, persons_tbl, 'PERSONS');
                        }
                    } else if (col === 'person_origin_location') {
                        handle_multiple_table_instances(row, 6, this.toString(), 'transactions_' + cnt, null, null, transaction_locs, null, 'LOCS');
                    } else if (col === 'location_recruitment') {
                        handle_multiple_table_instances(row, 13, this.toString(), 'transactions_' + cnt, null, null, transaction_locs, null, 'LOCS');
                    } else if (col === 'location_discharge') {
                        handle_multiple_table_instances(row, 15, this.toString(), 'transactions_' + cnt, null, null, transaction_locs, null, 'LOCS');
                    } else if (col === 'permit_port_of_exit') {
                        handle_multiple_table_instances(row, 17, this.toString(), 'transactions_' + cnt, null, null, transaction_locs, null, 'LOCS');
                    } else if (col === 'payment_location') {
                        handle_multiple_table_instances(row, 38, this.toString(), 'transactions_' + cnt, null, null, transaction_locs, null, 'LOCS');
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
////////////////////////////////////////////////////////////////////////////////

 
///////////////Update Vocabularies//////////////////////////////////////////////
function update_Vocs() {
    if (mode === null) {//only update vocabularies in edit mode

        var tables = [];
        var voyage_keys = Object.keys(voyage_transactions);

        for (var i = 0; i < voyage_keys.length; i++) {
            tables.push(voyage_transactions[voyage_keys[i]]);
        }
        tables.push(catalogue_info, source_identity_data, ship_record_hot, voyages_hot);
        updateVocabs(tables);
        console.log('Vocabularies successfully updated!');
    }

}
;

//////////////////////////////////////////////////////////////////////////////////////////
/////////// Loading icon
$(window).load(function() {
    $(".spin_loader").fadeOut("slow");
});

///////////////////////////////// Load File ///////////////////////////////////
var nested_tables = new Object();
var url = new URL(window.location.href);
var mode = url.searchParams.get("mode");
var nested_tables_object = new Object();

var record_status;

function load(data,status) {
    
    //console.log(status);
    record_status = status;
            
    clear_LocalStorage_instances();

    catalogue_info.loadData(data.record_information);
    source_identity_data.loadData(data.source_identity);
    ship_record_hot.loadData(data.ship_records);

    var voyages_data = new Array();
    $.each(data.voyages, function() {
        voyages_data.push(this);
    });

    voyages_hot.loadData(voyages_data);

    $('.nested_table').remove();

    if (data.payroll_analysis) {
        
        nested_tables_object = data.payroll_analysis;
        
        $.each(data.payroll_analysis, function(cnt) {

            var voyages_trans = new Array();
            $.each(this, function() {
                voyages_trans.push(this);
            });

            if (mode === 'teamView') {
                nested_tables[cnt] = voyages_trans;
            } else {
                nested_tables[cnt] = voyages_trans;
                //createNestedTable(cnt, voyages_trans);
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

    var json = createRecordJson('excel');
    var temp = JSON.stringify(json);
    temp = temp.replace(/&nbsp;/g, "");
    json = JSON.parse(temp);

    var payrol_analysis = new Array();
    $.each(json.payroll_analysis, function(cnt) {
        $.each(this, function() {
            payrol_analysis.push(Object.assign({}, (json.voyages[cnt]), (this)));
        });
    });

    if (payrol_analysis.length < 1) {
        payrol_analysis.push('');
    }

    var sheets = new Array();
    sheets.push([json.record_information]);
    sheets.push([json.source_identity]);
    sheets.push([json.ship_records]);
    sheets.push(json.voyages);
    sheets.push(payrol_analysis);

    var groupTables = createMultipleTables(json['voyages'], voyages_Groups, cols);
    var result = createExcelSheetsData(sheets, groupTables);

    var nestedGroups = createMultipleNestedTables(json['payroll_analysis'], transactionsGroups, cols, transaction_columns);

    result = createExcelSheetsData(sheets, nestedGroups);

    var opts = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Source Identity', header: true}, {sheetid: 'Ship Identity', header: true}, {sheetid: 'Voyages', header: true}, {sheetid: 'Payroll Analysis', header: true}];
    var res = alasql('SELECT * INTO XLSX("' + $('#unique_filename').text() + '.xlsx",?) FROM ?', [opts, result]);

});


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
            } else if (table_id === "identifier_table") {
                old_val = ship_record_hot.getDataAtCell(this.row, this.col, value);
                ship_record_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            }
            else if (table_id === "example1") {
                old_val = voyages_hot.getDataAtCell(this.row, this.col, value);
                voyages_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "catalogue_info") {
                old_val = catalogue_info.getDataAtCell(this.row, this.col, value);
                catalogue_info.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else {
                var cnt = table_id.replace("transactions", "");
                old_val = voyage_transactions[cnt].getDataAtCell(this.row, this.col, value);
                voyage_transactions[cnt].setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            }

        });
    }
}
;

////////////////////////// BIG TEXTs ////////////////////////////////

function set_Text_val(row, col, val, parentTable) {

    if (parentTable.indexOf("transactions") !== -1) {
        var cnt = parentTable.replace("transactions", "");
        voyage_transactions[cnt].setDataAtCell(row, col, val);
    } else if (parentTable === "source_identity") {
        source_identity_data.setDataAtCell(row, col, val);
    } else if (parentTable === "identifier_table") {
        ship_record_hot.setDataAtCell(row, col, val);
    } else if (parentTable === "example1") {
        voyages_hot.setDataAtCell(row, col, val);
    }
}
;

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
    tmp['record_information']['related_organization'] = 'FORTH/IMS';
    tmp['record_information']['record_id'] = recordId;
    tmp['record_information']['template_type'] = templateTitle;
    tmp['source_identity'] = json.source_identity;
    tmp['source_identity']['source_language'] = 'Greek';
    tmp['ship_identity'] = oneRow_with_Groups(json.ship_records, identifier_tableGroups, cols3);


    ////////////////MULTIPLE TABLE WITH GROUPS AND NESTED/////////////////////// 
    var nested_groups = nested_with_Groups(json.payroll_analysis, json.voyages, transactionsGroups, transaction_columns, 'payroll_analysis', 'voyage_');
    var simple_groups = simple_with_Groups(json.voyages, voyages_Groups, cols);
    tmp['voyages'] = merge_Groups_Nested(nested_groups, simple_groups, voyages_Groups, 'voyage_', cols);
    ////////////////////////////////////////////////////////////////////////////

    root['root'] = tmp;

    var xml = formatXml(json2xml(root));

    xml = xml.replace(/<ship_(\d+)>/g, '<ship index="$1">');
    xml = xml.replace(/<\/ship_(\d+)>/g, "</ship>");

    xml = xml.replace(/<row_(\d+)>/g, '<row index="$1">');
    xml = xml.replace(/<\/row_(\d+)>/g, "</row>");

    xml = xml.replace(/<group_data_(\d+)>/g, '<group_data index="$1">');
    xml = xml.replace(/<\/group_data_(\d+)>/g, "</group_data>");
    
    xml = xml.replace(/<voyage_(\d+)>/g, '<voyage index="$1">');
    xml = xml.replace(/<\/voyage_(\d+)>/g, "</voyage>");


    return (xml);
}
;
