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
        else if (subTableName.indexOf("relatedPersons") !== -1) {
            var cols = [
                {data: 'related_person_relation', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("person_to_person_relation_es")), vocab: 'person_to_person_relation_es'},
                {data: 'related_person_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es' },
                {data: 'related_person_surname_A', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
                {data: 'related_person_surname_B', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
                {data: 'related_person_origin_location', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
                {data: 'related_person_residence_location', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
                {data: 'related_person_profession', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_capacity_role_es")), vocab: 'status_capacity_role_es'},
                {data: 'related_person_alive_dead', type: 'dropdown', source: ['Alive', 'Dead']}
            ];
            nestedHeaders = [
                ['Type of Relation', 'Name', 'Surname A', 'Surname B', 'Location of Origin', 'Location of Residence', 'Profession', 'Alive / Dead']
            ];
            data = setSubTableData(death_register_hot, row, startCol, endCol);

        }
        else if (subTableName.indexOf("professions") !== -1) {
            var cols = [
                {data: 'profession', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("status_capacity_role_es")), vocab: 'status_capacity_role_es'},
            ];
            nestedHeaders = [
                ['Profession']
            ];
            data = setSubTableData(death_register_hot, row, startCol, endCol);

        }
        else if (subTableName.indexOf("death_reasons") !== -1) {
            var cols = [
                {data: 'death_reason', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("death_reason_es")), vocab: 'death_reason_es'}
            ];
            nestedHeaders = [
                ['Reason']
            ];
            data = setSubTableData(death_register_hot, row, startCol, endCol);

        }
        
        
         else if (subTableName.indexOf("owning_comanies") !== -1) {
            var cols = [
               {data: 'owning_company_name', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("local_authority_es")), vocab: 'local_authority_es'},
                {data: 'owning_company_type', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("organization_type_es")), vocab: 'organization_type_es'},
                {data: 'owning_company_location', type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
                {data: 'owning_company_street_name', type: 'text'},
                {data: 'owning_company_street_number', type: 'text'}
            ];
            nestedHeaders = [
                ['Name','Type','Location','Street Name','Street Number']
            ];
            data = setSubTableData(death_register_hot, row, startCol, endCol);

        }
         else if (subTableName.indexOf("marital_statuses") !== -1) {
            var cols = [
                  {data: 'marital_status',  type: 'dropdown',
                    source: JSON.parse(localStorage.getItem("marital_status_es")), vocab: 'marital_status_es'},
           
            ];
            nestedHeaders = [
                ['Marital Status']
            ];
            
    
           
            
            data = setSubTableData(death_register_hot, row, startCol, endCol);

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
tablesAndHeaders.set(tableId, [
    headerTooltip("Name", "The name of the online library where the digitized source is held"),
    headerTooltip("Location", "The Location of the Archive or Library where the original source is held"),
    headerTooltip("URL", "The link of the online library where the digitized source is held"),
    headerTooltip("Number *", "The identification number of the source that is in the form of a book"),
    headerTooltip("Source type name", "Register of deaths or Register of Births"),
    headerTooltip("Date", "The Dates that are covered by this specific Register"),
    headerTooltip("Classification Code", "The classification code of this specific Register"),
    headerTooltip("Topographic Signature", "The topographic signature of this specific Register"),
    headerTooltip("Name", "The name of the authority that issued the original source at source time"),
    headerTooltip("Location", "The location of the authority that issued the original source at source time"),
    headerTooltip("Note", "Comments from the person that digitized the original source into this Fast Cat record"),
    'Comment']);

tablesWithoutCommentCols.set(tableId, [0, 1, 2, 10]); //define fieds that do not have external content


var source_identity_cols = [
    {data: 'archive_library', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("archive_or_library_es")), vocab: 'archive_or_library_es'},
    {data: 'source_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'online_library_link', type: 'text'},
    {data: 'book_number', type: 'text'},
    {data: 'book_type_of_register',  type: 'dropdown',
        source: JSON.parse(localStorage.getItem("source_type_name_es")), vocab: 'source_type_name_es'},
    {data: 'book_year', type: 'text'},
    {data: 'book_classification_code', type: 'text'},
    {data: 'book_topographic_signature', type: 'text'},
    {data: 'issuing_authority', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("local_authority_es")), vocab: 'local_authority_es'},
    {data: 'issuing_authority_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}
];

var source_container = document.getElementById(tableId);
var source_locs = new Object();
var source_identity_data = new Handsontable(source_container, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: [{archive_library: ''}],
    columns: source_identity_cols,
    currentRowClassName: 'currentRow',
    manualColumnResize: true,
    maxRows: 1,
    className: "htCenter htMiddle",
    autoWrapRow: true,
    contextMenu: false,
    colHeaders: tablesAndHeaders.get(tableId),
    nestedHeaders: [
        [{label: 'Archive / Library', colspan: 3}, {label: 'Book', colspan: 5}, {label: 'Issuing Authority', colspan: 2}, ''],
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
        if ((source_identity_cols[col].vocab === 'location_es') && (value)) {
            handle_locations(value,'source_identity',row,col,'LOCS',source_locs);   
        } else if ( (source_identity_cols[col].vocab === 'archive_or_library_es')&&value ) {
            handle_organizations(value,'source_identity',row, col, 'ORGS');      
        } else if ((source_identity_cols[col].vocab === 'local_authority_es')&&value ) {
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
/////////////////////////DEATH REGISTER/////////////////////////////////////////                       

var tableId = "death_register";
tablesAndHeaders.set(tableId, [
    headerTooltip("Source Page", "The number of the page where the register is inscribed"),
    headerTooltip("Number of register", "The number which was given to each register. They were established in correlative numbers"),
    headerTooltip("Documentation Date", "The date when the register was inscribed in the book"),
    
    headerTooltip("Number", "The number of entrance"),
    headerTooltip("Date", "The date of entrance"),
    headerTooltip("Reason", "The reason of entrance"),
    headerTooltip("Nummber", "The number of exit"),
    headerTooltip("Date", "The date of exit"),
    headerTooltip("Room Number", "The number of the room"),
    headerTooltip("Hospital Sector", "The sector of the hospital"),
    
    headerTooltip("Name", "The name of the diseased person"),
    headerTooltip("Surname", "The first surname -or paternal surname- of the diseased person"),
    headerTooltip("Surname B", "The second surname -or maternal surname- of the diseased person"),
    headerTooltip("Location of Origin", "The location of brith registered in the book (narrow location) and the province, region or country where it belongs to (broader location)"),
    headerTooltip("Profession", "The profession of the diseased person"),
    
    
    headerTooltip("Name", "The name of owning company"),
    headerTooltip("Type", "The type of owning company"),
    headerTooltip("Location", "The location of owning company"),
    headerTooltip("Street Name", "The street name of owning company"),
    headerTooltip("Street Number", "The street number of owning company"),
    
    headerTooltip("Marital Status", "The marital status of the person"),
    
    
    headerTooltip("Years", "The age in years of the diseased person when he/she died"),
    headerTooltip("Months", "The age in months of the diseased person when he/she died"),
    headerTooltip("Days", "The age in days of the diseased person when he/she died"),
    headerTooltip("Sex", "The sex of the diseased person (inferred from the source based on the name of the person and the gender of the adjectives used)"),

    headerTooltip("Location", "The location where he/she lived (very occassionally it can be some other place, such as the port or the beach)"),
    headerTooltip("Street Name", "The name of the street or square where he/she lived (very occassionally it can be some other place, such as the port or the beach)"),
    headerTooltip("Barceloneta", "In this field is annotated if the street of residence of the diseased person was within the Barceloneta neighborhood"),
    headerTooltip("House Number", "The number of the building in the street or square where the diseased person lived"),
    headerTooltip("Floor Number", "The number of the floor in the building where the diseased person lived"),
    headerTooltip("Door Number", "The number of the door in the floor where the diseased person lived"),
    headerTooltip("Location", "The Location where the death occurred"),
    headerTooltip("Location Type", "The Location type where the death occurred"),
    headerTooltip("Date", "The date when the death occurred"),
    headerTooltip("Reason", "The reason that cause the death according to the register (usually an illness)"),
    headerTooltip("Marital Status", "The marital status of the diseased person when he/she died"),
    headerTooltip("Type of Relation", "The relation of the person with the diseased person"),
    headerTooltip("Name", "The name of the related person "),
    headerTooltip("Surname A", "The first surname -or paternal surname-  of the related person"),
    headerTooltip("Surname B", "The second surname -or maternal surname- of the related person"),
    headerTooltip("Location of Origin", "Location of Origin"),
    headerTooltip("Location of Residence", "Location of Residence"),
    headerTooltip("Profession", "The profession of the related person (just appears on men)"),
    headerTooltip("Alive / Dead", "It shows wheteher the person was alive or dead at source time"),
    headerTooltip("Existence", "It shows whether the person made a testament or not, or if this information is unknown"),
    headerTooltip("Name", "The name of the notary in front of whom the diseased person made the testament"),
    headerTooltip("Surname A", "The first surname -or paternal surname-  of the notary in front of whom the diseased person made the testament"),
    headerTooltip("Surname B", "The second surname -or maternal surname- of the notary in front of whom the diseased person made the testament"),
    headerTooltip("Transcription from Source", ""),
    headerTooltip("Note", "Comments from the person that digitized the original source into this Fast Cat record about the specific register"),
    'Comment'
]);

tablesWithoutCommentCols.set(tableId, [11, 13, 18, 33]); //define fieds that do not have external content



var death_tbl = new Object();
var death_persons = new Object();


var deaths_data = [
    {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""},
    {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""},
    {voyage_number: ""}, {voyage_number: ""}, {voyage_number: ""}];

var death_columns = [
    {data: 'source_page', type: 'text'},
    {data: 'number_of_register', type: 'text'},
    {data: 'documentation_date', type: 'date'},
    
    {data: 'entrance_number', type: 'text'},
    {data: 'entrance_date', type: 'date'},
    {data: 'entrance_reason', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("reason_es")), vocab: 'reason_es'},
    
    {data: 'exit_number', type: 'text'},
    {data: 'exit_date', type: 'date'},
    {data: 'room_number', type: 'text'},
    {data: 'hospital_sector', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("hospital_sector_es")), vocab: 'hospital_sector_es'},
    
    
    
    {data: 'diseased_person_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es'},
    {data: 'diseased_person_surname_A', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
    {data: 'diseased_person_surname_B', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
    {data: 'diseased_person_origin_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    {data: 'profession', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_es")), vocab: 'status_capacity_role_es', renderer: groupRenderer},

    {data: 'owning_company_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("local_authority_es")), vocab: 'local_authority_es', renderer: groupRenderer},
    {data: 'owning_company_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("organization_type_es")), vocab: 'organization_type_es', renderer: groupRenderer},
    {data: 'owning_company_location',  type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es', renderer: groupRenderer},
    {data: 'owning_company_street_name', type: 'text', renderer: groupRenderer},
    {data: 'owning_company_street_number', type: 'text', renderer: groupRenderer},
    
    {data: 'marital_status',  type: 'dropdown',
        source: JSON.parse(localStorage.getItem("marital_status_es")), vocab: 'marital_status_es', renderer: groupRenderer},
    
    
    {data: 'diseased_person_age_years', type: 'text'},
    {data: 'diseased_person_age_months', type: 'text'},
    {data: 'diseased_person_age_days', type: 'text'},
    {data: 'diseased_person_age_sex', type: 'dropdown', source: ['Male', 'Female']},
    
    {data: 'diseased_person_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    
    {data: 'diseased_person_street', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("street_name_es")), vocab: 'street_name_es'},
    {data: 'diseased_person_barceloneta', type: 'dropdown',
        source: ['Yes', 'No']},
    {data: 'house_number', type: 'text'},
    {data: 'floor_number', type: 'text'},
    {data: 'door_number', type: 'text'},
    {data: 'death_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es'},
    
    {data: 'death_location_type', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_type_es")), vocab: 'location_type_es'},
    
    {data: 'death_date', type: 'date'},
    {data: 'death_reason', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("death_reason_es")), vocab: 'death_reason_es', renderer: groupRenderer},
    {data: 'marital_status', type: 'dropdown',
        source: ['Married', 'Single']},
    {data: 'related_person_relation', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("person_to_person_relation_es")), vocab: 'person_to_person_relation_es', renderer: groupRenderer},
    {data: 'related_person_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es', renderer: groupRenderer},
    {data: 'related_person_surname_A', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es', renderer: groupRenderer},
    {data: 'related_person_surname_B', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es', renderer: groupRenderer},
    {data: 'related_person_origin_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es', renderer: groupRenderer},
    {data: 'related_person_residence_location', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("location_es")), vocab: 'location_es', renderer: groupRenderer},
    {data: 'related_person_profession', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("status_capacity_role_es")), vocab: 'status_capacity_role_es', renderer: groupRenderer},
    {data: 'related_person_alive_dead', type: 'dropdown', source: ['Alive', 'Dead'], renderer: groupRenderer},
    {data: 'death_testament_existence', type: 'dropdown',
        source: ['Yes', 'No']},
    {data: 'death_testament_notary_name', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("name_es")), vocab: 'name_es'},
    {data: 'death_testament_notary_surname_A', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
    {data: 'death_testament_notary_surname_B', type: 'dropdown',
        source: JSON.parse(localStorage.getItem("surname_es")), vocab: 'surname_es'},
    {data: 'trascription_from_source', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'death_note', renderer: textRender, readOnly: true, type: 'text'},
    {data: 'comment', type: 'text', hidden: tablesWithoutCommentCols.get(tableId).toString()}
];


var cont = document.getElementById(tableId);

var headers = [
    ['', '', '', {label: '        ', colspan: '3'},{label: '    ', colspan: '2'},'','', {label: 'Person', colspan: '39'},'', ''],
    ['', '', '', {label: '        ', colspan: '3'},{label: '    ', colspan: '2'},'','', {label: '', colspan: '5'},{label: '              ', colspan: '5'},'', {label: '   ', colspan: '3'}, '', {label: '                     ', colspan: '6'}, {label: '     ', colspan: '4'}, '', {label: '              ', colspan: '8'}, {label: 'Testament', colspan: '4'},'', ''],
    ['', '', '', {label: 'Entrance', colspan: '3'},{label: 'Exit', colspan: '2'},'','', {label: '', colspan: '5'},{label: 'Owning Company', colspan: '5'},'', {label: 'Age', colspan: '3'}, '', {label: 'Location of residence', colspan: '6'}, {label: 'Death', colspan: '4'}, '', {label: 'Related Person', colspan: '8'}, '', {label: 'Notary', colspan: '3'},'', ''],
    tablesAndHeaders.get(tableId)
];

var death_registerGroups = [[14,14],[15,19],[20,20], [34, 34], [36, 43]];

headers = markHeaders(headers, death_registerGroups);
        
var death_locs = new Object();

var death_register_hot = new Handsontable(cont, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: deaths_data,
    columns: death_columns,
    contextMenu: true,
    currentRowClassName: 'currentRow',
    manualColumnResize: true,
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
        if (col > 35 && col < 44) {
            groupLeftClicked(this, row, col);
        } else if (col === 14) {
            groupLeftClicked(this, row, col);
        } else if (col === 34) {
            groupLeftClicked(this, row, col);
        }else if (col > 14 && col < 20) {
            groupLeftClicked(this, row, col);
        }else if (col === 20) {
            groupLeftClicked(this, row, col);
        }
    }/*,
    afterRenderer: function(td, row, col, prop, value) {
        if ((death_columns[col].vocab === 'location_es') && (value)) {
            handle_locations(value,'death_register',row,col,'LOCS',death_locs);   
        }
        if (value) {            
            handle_multiple_table_instances(row+'_',col,value,'death_register',[3, 4, 5, 6], ['name', 'surname_a', 'surname_b', 'place_of_birth'], death_persons, death_tbl, 'PERSONS');            
            handle_multiple_table_instances(row+'__',col,value,'death_register',[22, 23], ['name', 'surname'], death_persons, death_tbl, 'PERSONS');
            handle_multiple_table_instances(row+'___',col,value,'death_register',[30, 31, 32], ['name', 'surname_a', , 'surname_b'], death_persons, death_tbl, 'PERSONS');            
        }
    }*/

});

death_register_hot.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(death_columns[col].vocab);
            }
            else if (key === 'view_add') {
                var col = options.start.col;
                var row = options.start.row;
                var tableId = this.rootElement.getAttribute("id");
                var value = death_register_hot.getDataAtCell(options.start.row, options.start.col);
                var label = death_columns[col].vocab;
                create_location_modal(tableId, value, row, col, label);
            }
            else if (key === 'add') {
                var colClicked = death_register_hot.getSelectedRange().to.col;
                var rowClicked = death_register_hot.getSelectedRange().to.row;
                if (colClicked > 35 && colClicked < 44) {
                    groupClicked('death_register', "relatedPersons", rowClicked, 36, 43);
                }
                else if (colClicked === 14) {
                    groupClicked('death_register', "professions", rowClicked, 14, 14);
                }
                else if (colClicked === 34) {
                    groupClicked('death_register', "death_reasons", rowClicked, 34, 34);
                }
                
                else if  (colClicked > 14 && colClicked < 20) {
                    groupClicked('death_register', "owning_comanies", rowClicked, 15, 19);
                }
                else if (colClicked === 20) {
                    groupClicked('death_register', "marital_statuses", rowClicked, 20, 20);
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
                    return death_register_hot.getSelected()[0] === 0;
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
                    if (((death_register_hot.getSelected()[0]) < 3) || ((death_register_hot.getSelected()[2]) < 3)) {
                        return true;
                    }
                }
            },
            "hsep1": "---------",
            "edit_vocabulary": {
                name: "Edit vocabulary",
                hidden: function() {
                    var col = death_register_hot.getSelectedRange().to.col;
                    var label = death_columns[col].vocab;
                    if (label) {
                        update_Vocs();
                        return death_register_hot.getSelectedRange().to.col !== col;
                    } else {
                        return death_register_hot.getSelectedRange().to.col !== -1;
                    }
                }},
            "add": {
                name: "Add table",
                hidden: function() {
                    return  isAddTableMenuVisible(this, death_registerGroups);

                }},
            "hsep5": "---------",
            "view_add": {
                name: "View/Add Location Identity info",
                hidden: function() {
                    var col = death_register_hot.getSelectedRange().to.col;
                    var label = death_columns[col].vocab;

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
//////////////////////////////EXPORT IMPORT/////////////////////////////////////   
////////////////////////////////////////////////////////////////////////////////

function createRecordJson(usage) {

    var cat_info = createJson(catalogue_info, cols1, usage);
    var source_id = createJson(source_identity_data, source_identity_cols, usage);
    var voyages_data = createJson(death_register_hot, death_columns, usage);
    var json = new Object();

    cat_info.date_until = getCurrentDate();
    catalogue_info.setDataAtCell(0, 2, getCurrentDate());
    json['record_information'] = cat_info;
    json['source_identity'] = source_id;
    json['death_registers'] = voyages_data;
              

    var worker_persons = new Object();  
    var worker_tbl= new Object();
    var worker_locs = new Object();
         
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
       
    terms = new Object();   
    $.each(voyages_data, function (row) {
        var row_data = this;  
        console.log('------- handling row '+row+' -----------');
        $.each(this, function (col) {  
            ////////////////////////////////////////////////////////////////////
             var val = this.toString();
                $.each(death_columns, function (col_no) {
                    if (($(this).attr('vocab')) && ($(this).attr('data')) === col) {
                        var label = $(this).attr('vocab');                      
                        handle_json_vocs(val, label, row, col, col_no, 'death_register', terms);
                    }
                });
                ////////////////////////////////////
            if(col === 'diseased_person_surname_A'){
                if(row_data['diseased_person_name']){
                    handle_multiple_table_instances(row, 10, row_data['diseased_person_name'], 'death_register',[10, 11, 12, 13, 33], ['name', 'surname_a', 'surname_b', 'place_of_birth','date_of_death'], worker_persons, worker_tbl, 'PERSONS');    
                }
                handle_multiple_table_instances(row, 11, row_data['diseased_person_surname_A'], 'death_register',[10, 11, 12, 13, 33], ['name', 'surname_a', 'surname_b', 'place_of_birth','date_of_death'],worker_persons, worker_tbl, 'PERSONS');                
                if(row_data['diseased_person_surname_B']){
                    handle_multiple_table_instances(row, 12, row_data['diseased_person_surname_B'], 'death_register',[10, 11, 12, 13, 33], ['name', 'surname_a', 'surname_b', 'place_of_birth','date_of_death'], worker_persons, worker_tbl, 'PERSONS');                    
                }if(row_data['diseased_person_origin_location']){
                    handle_multiple_table_instances(row, 13, row_data['diseased_person_origin_location'], 'death_register',[10, 11, 12, 13, 33], ['name', 'surname_a', 'surname_b', 'place_of_birth','date_of_death'], worker_persons, worker_tbl, 'PERSONS');                
                }if(row_data['death_date']){
                    handle_multiple_table_instances(row, 33, row_data['death_date'], 'death_register',[10, 11, 12, 13, 33], ['name', 'surname_a', 'surname_b', 'place_of_birth','date_of_death'], worker_persons, worker_tbl, 'PERSONS');                                   
                }                                                                             
            }      
            ///////////////// xeirismos pare mare kai loipwn katsigarwn
            else if(col === 'related_person_relation'){              
                create_related_persons(row+"_", row_data['related_person_name'],  worker_persons, worker_tbl, row_data['related_person_relation'], row_data['related_person_name'],row_data['related_person_surname_A'],row_data['diseased_person_surname_A'], row_data['related_person_surname_B'],row_data['related_person_origin_location'],row_data['diseased_person_surname_B']);
            }            
            ////////////////////////////////////////////////////////////
          /*  else if(col === 'related_person_surname_A'){              
                if(row_data['related_person_name']){
                    handle_multiple_table_instances(row+'_', 22, row_data['related_person_name'], 'death_register',[22, 23, 24,27], ['name', 'surname_a', 'surname_b','status'], worker_persons, worker_tbl, 'PERSONS');
                }
                handle_multiple_table_instances(row+'_', 23, row_data['related_person_surname_A'], 'death_register',[22, 23, 24,27], ['name', 'surname_a', 'surname_b','status'], worker_persons, worker_tbl, 'PERSONS');                
                if(row_data['related_person_surname_B']){
                    handle_multiple_table_instances(row+'_', 24, row_data['related_person_surname_B'], 'death_register',[22, 23, 24,27], ['name', 'surname_a', 'surname_b','status'], worker_persons, worker_tbl, 'PERSONS');                               
                }if(row_data['related_person_profession']){
                    handle_multiple_table_instances(row+'_', 27, row_data['related_person_profession'], 'death_register',[22, 23, 24,27], ['name', 'surname_a', 'surname_b','status'], worker_persons, worker_tbl, 'PERSONS');                                                               
                }                                                                
            }*/else if(col === 'death_testament_notary_surname_A'){    
                if((row_data['death_testament_notary_name'])){
                    handle_multiple_table_instances(row+'__', 39, row_data['death_testament_notary_name'], 'death_register',[37, 38, 39], ['name', 'surname_a', 'surname_b'], worker_persons, worker_tbl, 'PERSONS');
                }
                handle_multiple_table_instances(row+'__', 40, row_data['death_testament_notary_surname_A'], 'death_register',[37, 38, 39], ['name', 'surname_a', 'surname_b'], worker_persons, worker_tbl, 'PERSONS');                
                if((row_data['death_testament_notary_surname_B'])){
                    handle_multiple_table_instances(row+'__', 41, row_data['death_testament_notary_surname_B'], 'death_register',[37, 38, 39], ['name', 'surname_a', 'surname_b'], worker_persons, worker_tbl, 'PERSONS');                               
                }
            }
            else if (col === 'diseased_person_origin_location') {
                 handle_multiple_table_instances(row,13,this.toString(),'death_register',null, null,worker_locs, null, 'LOCS');                                                         
            }else if (col === 'death_location') {                 
                 handle_multiple_table_instances(row,32,this.toString(),'death_register',null, null,worker_locs, null, 'LOCS');                                                         
            }else if (col === 'related_person_origin_location') {                 
                 handle_multiple_table_instances(row,40,this.toString(),'death_register',null, null,worker_locs, null, 'LOCS');                                                         
            } else if (col === 'related_person_residence_location') {                 
                 handle_multiple_table_instances(row,40,this.toString(),'death_register',null, null,worker_locs, null, 'LOCS');                                                         
            } else if (col === 'owning_company_location') {                 
                 handle_multiple_table_instances(row,17,this.toString(),'death_register',null, null,worker_locs, null, 'LOCS');                                                         
            }  else if (col === 'diseased_person_location') {                 
                 handle_multiple_table_instances(row,25,this.toString(),'death_register',null, null,worker_locs, null, 'LOCS');                                                         
            } 
            
           
            ///////////////////// ORGS
            else if (col === 'owning_company_name') {
                    handle_multiple_table_instances(row, 15, this.toString(), 'death_register', null, null, null, null, 'ORGS');
                }
        });
    });
     }

    update_Vocs();
    console.log(terms_json)
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

function load(data,status) {
    
    console.log(status);
    record_status = status;    
    
    clear_LocalStorage_instances();

    catalogue_info.loadData(data.record_information);
    source_identity_data.loadData(data.source_identity);

    var deaths_data = new Array();
    $.each(data.death_registers, function() {
        deaths_data.push(this);
    });

    death_register_hot.loadData(deaths_data);
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
    sheets.push(json.death_registers);

    var groupTables = createMultipleTables(json['death_registers'], death_registerGroups, death_columns);
    var result = createExcelSheetsData(sheets, groupTables);

    var sheets_headers = [{sheetid: 'FastCat Record Information', header: true}, {sheetid: 'Source Identity', header: true}, {sheetid: 'Register of Deaths'}];
    var res = alasql('SELECT * INTO XLSX("' + $('#unique_filename').text() + '.xlsx",?) FROM ?', [sheets_headers, result]);

});

//////////////////Update Vocabularies on pouch DB

function update_Vocs() {
    if (mode === null) {//only update vocabularies in edit mode

        updateVocabs([catalogue_info, source_identity_data, death_register_hot]);
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
            } else if (table_id === "death_register") {
                old_val = death_register_hot.getDataAtCell(this.row, this.col, value);
                death_register_hot.setDataAtCell(this.row, this.col, old_val.split(old_term).join(value));
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
    } else if (parentTable === "death_register") {
        death_register_hot.setDataAtCell(row, col, val);
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
    tmp['record_information']['related_organization'] = 'University of Barcelona';
    tmp['record_information']['record_id'] = recordId;
    tmp['record_information']['template_type'] = templateTitle;
    tmp['source_identity'] = json.source_identity;
    tmp['source_identity']['source_language'] = 'Spanish(Castilian)';
    tmp['register'] = simple_with_Groups(json.death_registers, death_registerGroups, death_columns);


    root['root'] = tmp;
    console.log(root);
    var xml = formatXml(json2xml(root));


    xml = xml.replace(/<row_(\d+)>/g, '<row index="$1">');
    xml = xml.replace(/<\/row_(\d+)>/g, "</row>");

    xml = xml.replace(/<group_data_(\d+)>/g, '<group_data index="$1">');
    xml = xml.replace(/<\/group_data_(\d+)>/g, "</group_data>");

    return (xml);
}
;

