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

        } else if (subTableName === "childrens") {
            var cols = [
                {data: 'children_sex', type: 'dropdown',
                    source: ['male', 'female']},
                {data: 'children_quantity', type: 'text'}
            ];
            nestedHeaders = [
                ['Sex', 'Quantity']
            ];
            data = setSubTableData(employees_list_hot, row, startCol, endCol);
        } else if (subTableName === "services_in_company") {
            var cols = [
                {data: 'service_in_company_type', type: 'dropdown', source: ['First employment', 'Current employment', 'Previous employments'], renderer: groupRenderer},
                {data: 'service_in_company_profession', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_capacity_role_in")), vocab: 'status_capacity_role_in'},
                {data: 'service_in_company_transient_profession', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_capacity_role_in")), vocab: 'status_capacity_role_in'},
                {data: 'start_of_service_in_company', type: 'text'},
                {data: 'start_of_service_in_profession', type: 'text'},
                {data: 'start_of_service_onboard', type: 'text'},
                {data: 'ship_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("ship_name_in")), vocab: 'ship_name_in'},
                {data: 'destination', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in'},
                {data: 'wage_type', type: 'dropdown',
                    source: ['yearly', 'monthly']},
                {data: 'wage_value', type: 'text'},
                {data: 'wage_unit', type: 'text'}
            ];
            nestedHeaders = [
                ['Type', 'Profession/Rank', 'Transient Profession/Rank', 'Start of Service in Company', 'Start of Service in Profession/Rank', 'Start of Service on Board', 'Ship Name', 'Destination', 'Type', 'Value', 'Unit']
            ];
            data = setSubTableData(employees_list_hot, row, startCol, endCol);
        } else if (subTableName === "wage_ranges") {
            var cols = [
                {data: 'wage_monthly_value', type: 'text'},
                {data: 'wage_monthly_unit', type: 'text'},
                {data: 'wage_start_of_service', type: 'text'},
            ];
            nestedHeaders = [
                ['Value', 'Unit', 'Type']
            ];
            data = setSubTableData(employees_list_hot, row, startCol, endCol);
        } else if (subTableName === "work_statuses") {
            var cols = [
                {data: 'work_status_type', type: 'dropdown', source: ['sick', 'on leave', 'on land']},
                {data: 'work_status_start_date', type: 'text'}
            ];
            nestedHeaders = [
                ['Type', 'Start Date']
            ];
            data = setSubTableData(employees_list_hot, row, startCol, endCol);
        } else if (subTableName === "rewards") {
            var cols = [
                {data: 'rewards', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("reward_in")), vocab: 'reward_in', renderer: groupRenderer}
            ];
            nestedHeaders = [
                ['Rewards']
            ];
            data = setSubTableData(employees_list_hot, row, startCol, endCol);
        } else if (subTableName === "food_payed_cash") {
            var cols = [
                {data: 'food_payed_in_cash_from', type: 'text'},
                {data: 'food_payed_in_cash_to', type: 'text'},
                {data: 'food_payed_in_cash_days_duration', type: 'text'}
            ];
            nestedHeaders = [
                ['From', 'To', 'Duration in Days']
            ];
            data = setSubTableData(employees_list_hot, row, startCol, endCol);
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
//tablesAndHeaders.set(tableId, ['Source Type Name', 'Name', 'Location', 'URL', 'Archival Name', 'Inventory Number', 'Type of Document', 'Title of Book', 'From', 'To/At', 'Number', 'Title', 'Series Number', 'Number', 'Title', 'Location', 'Company', 'Name', 'Surname', 'Year', 'Overall Profession Status', 'Company', 'Note', 'Comment']);
tablesAndHeaders.set(tableId, [
    headerTooltip('Source Type Name', 'The type of source e.g. List of captains and engineers of the Russian Steam and  Trading Navigation Company'),
    headerTooltip('Name', 'name of the organization where the original source was kept during the time of transcription. Can be Archive, Library, Museum, Online library etc'),
    headerTooltip('Location', 'The Location of the organization where the source was kept during the time of transcription'),
    headerTooltip('URL', 'in case the source was kept in an online location, this is the URL of that location'),
    headerTooltip('Archival Name', 'Archival Name'),
    headerTooltip('Inventory Number', 'The number that corresponds to the source inside the inventory'),
    headerTooltip('Type of Document', 'Book, Archival material, etc'),
    headerTooltip('Title of Book', 'Title of Book'),
    headerTooltip('From', 'the year from which the documentation of the source started'),
    headerTooltip('To/At', 'the year at which the documentation of the source ended'),
    headerTooltip('Number', 'identification number of the fond'),
    headerTooltip('Title', 'name of the fond'),
    headerTooltip('Series Number', 'identification number of the series'),
    headerTooltip('Number', 'identification number of the file'),
    headerTooltip('Title', 'name of the file'),
    headerTooltip('Location', 'The place where the issuing authority was located'),
    headerTooltip('Company', 'name of the issuing authority organization'),
    headerTooltip('Name', 'Name'),
    headerTooltip('Surname', 'Surname'),
    headerTooltip('Year', 'year of issuing'),
    headerTooltip('Overall Profession Status', 'The broader profession/rank of all people documented in this source during documentation time'),
    headerTooltip('Company', 'The name of the company in which the person did work at documentation time'),
    headerTooltip('Note', 'Note about the source identity made by the person who does the transcription'),
    'Comment'
]);
tablesWithoutCommentCols.set(tableId, [0, 1, 2, 7]); //define fieds that do not have external content

var source_identity_cols = [
    {data: 'source_type_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("source_type_name_in")), vocab: 'source_type_name_in'},
    {data: 'holder_organization_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_in")), vocab: 'organization_in'},
    {data: 'holder_organization_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in'},
    {data: 'holder_organization_url', type: 'text'},
    {data: 'archive_name', type: 'text'},
    {data: 'inventory_number', type: 'text'},
    {data: 'type_of_document', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("document_type_in")), vocab: 'document_type_in'},
    {data: 'title_of_book', type: 'text'},
    {data: 'source_date_from', type: 'date'},
    {data: 'source_date_to_at', type: 'date'},
    {data: 'fonds_number', type: 'text'},
    {data: 'fonds_title', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("fond_title_in")), vocab: 'fond_title_in'},
    {data: 'series_number', type: 'text'},
    {data: 'file_number', type: 'text'},
    {data: 'file_title', type: 'text'},
    {data: 'publisher_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in'},
    {data: 'publisher_company', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_in")), vocab: 'organization_in'},
    {data: 'publisher_person_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in'},
    {data: 'publisher_person_surname', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_in")), vocab: 'surname_in'},
    {data: 'publisher_year', type: 'text'},
    {data: 'overall_proffesion_status', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_in")), vocab: 'status_capacity_role_in'},
    {data: 'company', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_in")), vocab: 'organization_in'},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}

];
var sourcedata = [
    {ship_name: ''}
];

var source_container = document.getElementById(tableId);
var headers = [
    ['', {label: '', colspan: 3}, '', '', '', '', {label: '', colspan: 2}, {label: '', colspan: 2}, '', {label: '', colspan: 2}, {label: 'Publisher', colspan: 5},  '', '', '', ''],
    ['', {label: 'Holder Organization', colspan: 3}, '', '', '', '', {label: 'Dates of Source', colspan: 2}, {label: 'Fonds', colspan: 2}, '', {label: 'File', colspan: 2}, '', '', {label: headerTooltip('Person', 'The person that published the source'), colspan: 2}, '', '', '', '', ''],
    tablesAndHeaders.get(tableId)
];

var source_locs = new Object();
var source_persons = new Object();
var source_persons_tbl = new Object();

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
        if (col===2 && value && (value)) {
            handle_locations(value, 'source_identity', row, col, 'LOCS', source_locs);
        }else if (col===1 && value) {
            handle_organizations(value, 'source_identity', row, col, 'ORGS');
        }else if (col===16 && value) {
            handle_organizations(value, 'source_identity', row+'__', col, 'ORGS');
        }else if (col===21 && value) {
            handle_organizations(value, 'source_identity', row+'___', col, 'ORGS');
        }
        else if (((source_identity_cols[col].vocab === 'local_authority_in')) && value) {
            handle_organizations(value, 'source_identity', row + '_', col, 'ORGS');
        }else if (col===15 && value && (value)) {
            handle_locations(value, 'source_identity', row, col, 'LOCS', source_locs);
        }else if ((col > 16 && col < 19) && (value)) {
            handle_persons(row, col, value, 'source_identity', [17, 18], ['name', 'surname_a'], source_persons, source_persons_tbl, 'PERSONS');
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


////////////////////////////////////////////////////////////////////////////////
////////////////////////////CREW LIST///////////////////////////////
var tableId = "employees_list";
//tablesAndHeaders.set(tableId, ['Source Page', 'Name', 'Surname', 'Father"s Name', 'Marital Status', 'Date', 'Place', 'Sex', 'Quantity', 'Link', 'Number', 'Date of Image', 'Type', 'Profession/Rank', 'Transient Profession/Rank', 'Start of Service in Company', 'Start of Service in Profession/Rank', 'Start of Service on Board', 'Ship Name', 'Destination', 'Type', 'Value', 'Unit', 'Type', 'Date', 'Reason', 'Value', 'Unit', 'Start of Service', 'Type', 'Start Date', 'Rewards', 'From', 'To', 'Duration in Days', 'Note', 'Comment']);
tablesAndHeaders.set(tableId, [
    headerTooltip('Source Page', 'Source Page'),
    headerTooltip('Name', 'Name of the person'),
    headerTooltip('Surname', 'Surname of the person'),
    headerTooltip('Father"s Name', 'The name of the father of the person'),
    headerTooltip('Marital Status', 'If the person was married, or widowed at documentation time'),
    headerTooltip('Date', 'Date of birth of the person'),
    headerTooltip('Place', 'Place of birth of the person'),
    headerTooltip('Sex', 'Sex'),
    headerTooltip('Quantity', 'Quantity'),
    headerTooltip('Link', 'Link to the photograph of the person'),
    headerTooltip('Number', 'the number given to the photograph inside the specific source'),
    headerTooltip('Date of Image', 'the date that the image was taken'),
    headerTooltip('Type', 'Type'),
    headerTooltip('Profession/Rank', 'The profession or rank of the person at documentation time or fist employment or previous employment or last employment. If current employment only if a second rank is mentioned in the source'),
    headerTooltip('Transient Profession/Rank', 'the person served in this rank for a short period. Its not its formal rank'),
    headerTooltip('Start of Service in Company', 'The first day in the contract with the company'),
    headerTooltip('Start of Service in Profession/Rank', 'The first day in the contract with the company in the specific profession/rank'),
    headerTooltip('Start of Service on Board', 'The first day of service on a specific ship'),
    headerTooltip('Ship Name', 'Name of the ship in which the person is on service at documentation time'),
    headerTooltip('Destination', 'The direction of the line of the ship'),
    headerTooltip('Type', 'Type'),
    headerTooltip('Value', 'Value'),
    headerTooltip('Unit', 'Unit'),
    headerTooltip('Type', 'Type'),
    headerTooltip('Date', 'Date'),
    headerTooltip('Reason', 'Reason'),
    headerTooltip('Value', 'Value'),
    headerTooltip('Unit', 'Unit'),
    headerTooltip('Start of Service', 'start of service with the specific wage'),
    headerTooltip('Type', 'Sick=the person was sick but payed, on leave=the person was on leave, on land=the person was payed but did not start the work on the ship yet'),
    headerTooltip('Start Date', 'starting date of the specific work status'),
    headerTooltip('Rewards', 'The rewards that the person has won during his career/Types of medals'),
    headerTooltip('From', 'the first day that the person started to get payed for his food from the company'),
    headerTooltip('To', 'the last day that the person got payed for his food from the company'),
    headerTooltip('Duration in Days', 'the total days that the person started got payed for his food from the company'),
    headerTooltip('Note', 'Note made by the person who does the transcription'),
    'Comment'
]);

tablesWithoutCommentCols.set(tableId, [15]); //define fieds that do not have external content

var crew_data = [{source_page: ""}, {source_page: ""}, {source_page: ""}, {source_page: ""},
    {source_page: ""}, {source_page: ""}, {source_page: ""}, {source_page: ""}, {source_page: ""},
    {source_page: ""}, {source_page: ""}, {source_page: ""}, {source_page: ""}, {source_page: ""},
    {source_page: ""}, {source_page: ""}, {source_page: ""}, {source_page: ""}];

var crew_cols = [
    {data: 'source_page', type: 'text'},
    {data: 'person_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in'},
    {data: 'person_surname', type: 'dropdown', instance_label: 'person',
        source: JSON.parse(localStorage.getItem("surname_in")), vocab: 'surname_in'},
    {data: 'person_fathers_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_in")), vocab: 'name_in'},
    {data: 'person_marital_status', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("marital_status_in")), vocab: 'marital_status_in'},
    {data: 'person_birth_date', type: 'date'},
    {data: 'person_birth_place', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in'},
    {data: 'children_sex', type: 'dropdown',
        source: ['male', 'female'], renderer: groupRenderer},
    {data: 'children_quantity', type: 'text', renderer: groupRenderer},
    {data: 'person_image_link', type: 'text'},
    {data: 'person_image_number', type: 'text'},
    {data: 'person_image_date', type: 'date'},
    {data: 'service_in_company_type', type: 'dropdown', source: ['First employment', 'Current employment', 'Previous employments'], renderer: groupRenderer},
    {data: 'service_in_company_profession', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_in")), vocab: 'status_capacity_role_in', renderer: groupRenderer},
    {data: 'service_in_company_transient_profession', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_in")), vocab: 'status_capacity_role_in', renderer: groupRenderer},
    {data: 'start_of_service_in_company', type: 'date', renderer: groupRenderer},
    {data: 'start_of_service_in_profession', type: 'date', renderer: groupRenderer},
    {data: 'start_of_service_onboard', type: 'date', renderer: groupRenderer},
    {data: 'ship_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("ship_name_in")), vocab: 'ship_name_in', renderer: groupRenderer},
    {data: 'destination', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_in")), vocab: 'location_in', renderer: groupRenderer},
    {data: 'wage_type', type: 'dropdown',
        source: ['yearly', 'monthly'], renderer: groupRenderer},
    {data: 'wage_value', type: 'text', renderer: groupRenderer},
    {data: 'wage_unit', type: 'text', renderer: groupRenderer},
    {data: 'end_of_service_type', type: 'dropdown',
        source: ['end of service in company', 'end of service in specific rank/profession']},
    {data: 'end_of_service_date', type: 'date'},
    {data: 'end_of_service_reason', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("end_of_service_reason_in")), vocab: 'end_of_service_reason_in'},
    {data: 'wage_monthly_value', type: 'text', renderer: groupRenderer},
    {data: 'wage_monthly_unit', type: 'text', renderer: groupRenderer},
    {data: 'wage_start_of_service', type: 'text', renderer: groupRenderer},
    {data: 'work_status_type', type: 'dropdown',
        source: ['sick', 'on leave', 'on land'], renderer: groupRenderer},
    {data: 'work_status_start_date', type: 'date', renderer: groupRenderer},
    {data: 'rewards', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("reward_in")), vocab: 'reward_in', renderer: groupRenderer},
    {data: 'food_payed_in_cash_from', type: 'date', renderer: groupRenderer},
    {data: 'food_payed_in_cash_to', type: 'date', renderer: groupRenderer},
    {data: 'food_payed_in_cash_days_duration', type: 'text', renderer: groupRenderer},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}
];

var cont = document.getElementById(tableId);
var headers = [
    ['', {label: 'Identity of Person', colspan: '11'}, {label: 'Service in Company', colspan: '11'}, {label: '', colspan: '3'}, {label: headerTooltip('Wage ranges', 'Changes in wage under the current rank'), colspan: '3'}, {label: '', colspan: '2'}, '', {label: '', colspan: '3'}, '', ''],
    ['', '', '', '', '',{label: 'Birth', colspan: '2'}, {label: 'Children', colspan: '2'}, {label: 'Image of Person', colspan: '3'}, '', '', '', '', '', '', '', '', {label: headerTooltip('Wage', 'The wage of the person at documentation time'), colspan: '3'}, {label: headerTooltip('End of service', 'The last day in the contract with the company with the specific rank'), colspan: '3'}, {label: 'Monthly Wage', colspan: '2'}, '', {label: 'Work Status', colspan: '2'}, 'Rewards', {label: headerTooltip('Food paid in Cash', 'The days at which food was not provided from the company to the person and therefore he was payed in cash from the company'), colspan: '3'}, '', ''],
    tablesAndHeaders.get(tableId)
];
var crew_listGroups = [[7, 8], [12, 22], [26, 28], [29, 30], [31, 31], [32, 34]];
headers = markHeaders(headers, crew_listGroups);

/////////////////////////////

var persons_tbl = new Object();
var persons = new Object();
var crew_locs = new Object();

/////////////////////////////////////////////

var employees_list_hot = new Handsontable(cont, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: crew_data,
    columns: crew_cols,
    manualColumnResize: true,
    rowHeaders: true,
    contextMenu: true,
    currentRowClassName: 'currentRow',
    className: "htCenter",
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
    afterRender: function(row, col, prop) {
        markGroups(this);
    },
    afterSelectionEnd: function(row, col) {
        markGroups(this);
        if (col > 6 && col < 9) {
            groupLeftClicked(this, row, col);
        } else if (col > 11 && col < 23) {
            groupLeftClicked(this, row, col);
        } else if (col > 25 && col < 29) {
            groupLeftClicked(this, row, col);
        } else if (col === 31) {
            groupLeftClicked(this, row, col);
        } else if (col > 29 && col < 31) {
            groupLeftClicked(this, row, col);
        } else if (col > 31 && col < 35) {
            groupLeftClicked(this, row, col);
        }
    }
});


employees_list_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(crew_cols[col].vocab);
            } else if (key === 'add') {
                var colClicked = employees_list_hot.getSelectedRange().to.col;
                var rowClicked = employees_list_hot.getSelectedRange().to.row;
                if (colClicked > 6 && colClicked < 9) {
                    groupClicked('employees_list', "childrens", rowClicked, 7, 8);
                } else if (colClicked > 11 && colClicked < 23) {
                    groupClicked('employees_list', "services_in_company", rowClicked, 12, 22);
                } else if (colClicked > 25 && colClicked < 29) {
                    groupClicked('employees_list', "wage_ranges", rowClicked, 26, 28);
                } else if (colClicked > 28 && colClicked < 31) {
                    groupClicked('employees_list', "work_statuses", rowClicked, 29, 30);
                } else if (colClicked === 31) {
                    groupClicked('employees_list', "rewards", rowClicked, 31, 31);
                } else if (colClicked > 31 && colClicked < 35) {
                    groupClicked('employees_list', "food_payed_cash", rowClicked, 32, 34);
                }
            } else if (key === 'view_add') {
                var col = options.start.col;
                var row = options.start.row;
                var tableId = this.rootElement.getAttribute("id");
                var value = employees_list_hot.getDataAtCell(options.start.row, options.start.col);
                var label = crew_cols[col].vocab;
                create_location_modal(tableId, value, row, col, label);
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
                    return employees_list_hot.getSelected()[0] === 0;
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
                    if (((employees_list_hot.getSelected()[0]) < 3) || ((employees_list_hot.getSelected()[2]) < 3)) {
                        return true;
                    }
                }
            },
            "hsep1": "---------",
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function() {
                    var col = employees_list_hot.getSelectedRange().to.col;
                    var label = crew_cols[col].vocab;
                    if (label) {
                        update_Vocs();
                        return employees_list_hot.getSelectedRange().to.col !== col;
                    } else {
                        return employees_list_hot.getSelectedRange().to.col !== -1;
                    }
                }},
            "add": {
                name: "Add table",
                hidden: function() {
                    return isAddTableMenuVisible(this, crew_listGroups);

                }},
            "hsep5": "---------",
            "view_add": {
                name: "View/Add Location Identity info",
                hidden: function() {
                    var col = employees_list_hot.getSelectedRange().to.col;
                    var label = crew_cols[col].vocab;
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

//////////////////////////////////////////////////////////////////

//////////////////////////EXPORT IMPORT////////////////////////////////

/////////////////////////////////////////////////////////////////////

function createRecordJson(usage) {

    var cat_info = createJson(catalogue_info, cols1, usage);
    var source_id = createJson(source_identity_data, source_identity_cols, usage);
    var employees_list = createJson(employees_list_hot, crew_cols, usage);

    var json = new Object();

    cat_info.date_until = getCurrentDate();
    catalogue_info.setDataAtCell(0, 2, getCurrentDate());
    json['record_information'] = cat_info;
    json['source_identity'] = source_id;
    json['employees_list'] = employees_list;

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


        var crew_list_persons = new Object();
        var crew_list_tbl = new Object();
        var crew_list_locs = new Object();
        var ship_obj = new Object();
        var ships_tbl = new Object();
        terms = new Object();

        $.each(employees_list, function(row) {
            var row_data = this;
            console.log('------- handling row ' + row + ' -----------');
            $.each(this, function(col) {
                var val = this.toString();
                $.each(crew_cols, function(col_no) {
                    if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                        var label = $(this).attr('vocab');
                        handle_json_vocs(val, label, row, col, col_no, 'employees_list', terms);
                    }
                });
                if (col === 'person_name') {
                    if (row_data['person_name']) {
                        handle_multiple_table_instances(row, 1, row_data['person_name'], 'employees_list', [1, 2, 3, 5], ['name', 'surname_a', 'fathers_name', 'date_of_birth'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                    if (row_data['person_surname']) {
                        handle_multiple_table_instances(row, 2, row_data['person_surname'], 'employees_list', [1, 2, 3, 5], ['name', 'surname_a', 'fathers_name', 'date_of_birth'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                    if (row_data['person_fathers_name']) {
                        handle_multiple_table_instances(row, 3, row_data['person_fathers_name'], 'employees_list', [1, 2, 3, 5], ['name', 'surname_a', 'fathers_name', 'date_of_birth'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                    if (row_data['person_birth_date']) {
                        handle_multiple_table_instances(row, 5, row_data['person_birth_date'], 'employees_list', [1, 2, 3, 5], ['name', 'surname_a', 'fathers_name', 'date_of_birth'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                } else if (col === 'person_fathers_name') {
                    if (row_data['person_fathers_name']) {
                        handle_multiple_table_instances(row+'_', 3, row_data['person_fathers_name'], 'employees_list', [3, 2], ['name', 'surname_a'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                    if (row_data['person_surname']) {
                        handle_multiple_table_instances(row+'_', 2, row_data['person_surname'], 'employees_list', [3, 2], ['name', 'surname_a'], crew_list_persons, crew_list_tbl, 'PERSONS');
                    }
                } else if (col === 'person_birth_place') {
                    handle_multiple_table_instances(row, 6, this.toString(), 'employees_list', null, null, crew_list_locs, null, 'LOCS');
                } else if (col === 'destination') {
                    handle_multiple_table_instances(row, 19, this.toString(), 'employees_list', null, null, crew_list_locs, null, 'LOCS');
                } else if (col === 'ship_name') {
                    handle_ships(row, 18, row_data['ship_name'], 'employees_list', [18], ['name'], 'SHIPS', ship_obj, ships_tbl);
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
var record_status;

function load(data, status) {

    console.log(data);
    record_status = status;

    clear_LocalStorage_instances();

    catalogue_info.loadData(data.record_information);
    source_identity_data.loadData(data.source_identity);

    var crew_data = new Array();
    $.each(data.employees_list, function() {
        crew_data.push(this);
    });

    employees_list_hot.loadData(crew_data);
    update_Vocs();
}
;
///////////////////////////////////////////////////////////////////////////////
$('#excelexport').click(function() {

    var json = createRecordJson('excel');
    var temp = JSON.stringify(json);
    temp = temp.replace(/&nbsp;/g, "");
    json = JSON.parse(temp);

    var sheets = new Array();
    sheets.push([json.record_information]);
    sheets.push([json.source_identity]);
    sheets.push(json.employees_list);

//console.log(crew_listGroups)
    var groupTables = createMultipleTables(json['employees_list'], crew_listGroups, crew_cols);
    
    var result = createExcelSheetsData(sheets, groupTables,json.employees_list);
  //  console.log(result)

    var opts = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Source Identity', header: false}, {sheetid: 'Employees List', header: true}];
    var res = alasql('SELECT * INTO XLSX("' + $('#unique_filename').text() + '.xlsx",?) FROM ?', [opts, result]);

});


//////////////////Update Vocabularies on pouch DB

function update_Vocs() {
    if (mode === null) {//only update vocabularies in edit mode
        updateVocabs([catalogue_info, source_identity_data, employees_list_hot]);
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
            if (table_id === "source_identity") {
                old_val = source_identity_data.getDataAtCell(this.row, this.col, value);
                source_identity_data.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "employees_list") {
                old_val = employees_list_hot.getDataAtCell(this.row, this.col, value);
                employees_list_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "ports_of_call") {
                old_val = call_ports_hot.getDataAtCell(this.row, this.col, value);
                call_ports_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
            } else if (table_id === "route_tbl") {
                old_val = routes_hot.getDataAtCell(this.row, this.col, value);
                routes_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
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
    } else if (parentTable === "employees_list") {
        employees_list_hot.setDataAtCell(row, col, val);
    } else if (parentTable === "ports_of_call") {
        call_ports_hot.setDataAtCell(row, col, val);
    } else if (parentTable === "route_tbl") {
        routes_hot.setDataAtCell(row, col, val);
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

    console.log(json)

    var root = new Object();
    var tmp = new Object();
    tmp['record_information'] = oneRow_with_Groups(json.record_information, catalogue_infoGroups, cols1);
    tmp['record_information']['record_title'] = uniqueFilename;
    tmp['record_information']['related_organization'] = 'FORTH/IMS';
    tmp['record_information']['record_id'] = recordId;
    tmp['record_information']['template_type'] = templateTitle;
    tmp['source_identity'] = json.source_identity;
    tmp['source_identity']['source_language'] = 'Italian, Russian';
    tmp['employees_list'] = simple_with_Groups(json.employees_list, crew_listGroups, crew_cols);


//////////////////////////////////////////////////////////////////////////            


/////////////////////////////////////////////////////////////////////////////////////
    root['root'] = tmp;

    var xml = formatXml(json2xml(root));

    console.log(root);

    xml = xml.replace(/<row_(\d+)>/g, '<row index="$1">');
    xml = xml.replace(/<\/row_(\d+)>/g, "</row>");

    xml = xml.replace(/<group_data_(\d+)>/g, '<group_data index="$1">');
    xml = xml.replace(/<\/group_data_(\d+)>/g, "</group_data>");

    xml = xml.replace(/<person_(\d+)>/g, '<person index="$1">');
    xml = xml.replace(/<\/person_(\d+)>/g, "</person>");

    ///////////////////////////////////
    return (xml);
}
;

function add_loc_information(row, col, table_id, label, value) {

    var result = create_cell_location_value(label, value);

    if (table_id === "source_identity") {
        source_identity_data.setDataAtCell(row, col, result);
    }

    $("#location_Modal").modal('hide');
}
;

///////////// EXPORT ZIP ///////////////////////////////////////
