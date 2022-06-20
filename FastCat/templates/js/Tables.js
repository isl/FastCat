//////////////////////////////   1st TABLE     ////////////////////////////////
///////////////////// FASTCAT RECORD INFORMATION TABLE/////////////////////////
var tablesAndHeaders = new Map();

var project_role_vocab = ['Research assistant', 'Supervisor'];


function getId() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("name");

    if (id == null) {
        return "";
    } else {
        return id.split('_')[1];
    }
}
;

function getCreationDate() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("name");
    var creation_date = "";

    if ((id == null)) {
        return creation_date;
    } else {
        var date = id.substring(0, 10);
        var year = date.substring(0, 4);
        var month = date.substring(5, 7);
        var day = date.substring(8, 10);
        creation_date = (year + '-' + month + '-' + day);
    }
    return creation_date;
}
;

function getCurrentDate() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    var result = d.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day + 'T' + (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    return result;
}
;

function autoRecordFields(instance, td, row, col, prop, value, cellProperties) {

    if (col == '0') {
        td.innerHTML = '<span style="color:#9c9c9c;">' + getId() + '</span>';
        td.className = 'htCenter';
        return td;
    }
    else if (col == '1') {
        td.innerHTML = '<span style="color:#9c9c9c;">' + getCreationDate() + '</span>';
        td.className = 'htCenter';
        return td;
    }/*
    else if (col == '2') {
        td.innerHTML = '<span style="color:#9c9c9c;">' + getCurrentDate() + '</span>';
        td.className = 'htCenter';
        return td;
    }*/
}
;


var data1 = [{catalogue_id: getId(), date_from: getCreationDate(), date_until: ""}];

var cols1 = [
    {data: 'catalogue_id', type: 'text', readOnly: true, renderer: autoRecordFields},
    {data: 'date_from', type: 'date', readOnly: true, renderer: autoRecordFields},
    {data: 'date_until', type: 'date', readOnly: true, /*renderer: autoRecordFields*/},
    {data: 'name', type: 'text', renderer: groupRenderer},
    {data: 'surname', type: 'text', renderer: groupRenderer},
    {data: 'role_in_project', renderer: groupRenderer, type: 'dropdown', source: project_role_vocab}
];

var container = document.getElementById('catalogue_info');
var colHeaders = ['<span title="The identification number of this specific Fast Cat record">Id</span>',
    '<span title="The date that this specific Fast Cat record was created">Creation date</span>',
    '<span title="The last date that this specific Fast Cat record was modified">Last Modified</span>',
    '<span title="The name  of the person that digitized the original source into this Fast Cat record">Name *</span>',
    '<span title="The surname of the person that digitized the original source into this Fast Cat record">Surname *</span>',
    '<span title="The role inside the Sealit project of the person that digitized the original source into this Fast Cat record">Role</span>'
];
var headers = [
    ['', {label: 'Date', colspan: 2}, {label: 'Authors', colspan: 3}],
    colHeaders
];


var catalogue_infoGroups = [
    [3, 5]
];

headers = markHeaders(headers, catalogue_infoGroups);


var catalogue_info = new Handsontable(container, {
    licenseKey: '',
    dateFormat: 'YYYY-MM-DD',
    data: data1,
    columns: cols1,
    autoWrapRow: true,
    maxRows: 1,
    currentRowClassName: 'currentRow',
    contextMenu: true,
    className: "htCenter htMiddle",
    colHeaders: colHeaders,
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
        if (col > 2 && col < 6) {
            groupLeftClicked(this, row, col);
        }
    }
});

catalogue_info.updateSettings({
    contextMenu: {
        callback: function(key, options) {
            if (key === 'edit_vocabulary') {
                var col = options.start.col;
                create_voc_modal(cols1[col].vocab);
            }
            else if (key === 'add') {
                groupClicked("catalogue_info", "authors", 0, 3, 5);
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
                    var col = catalogue_info.getSelectedRange().to.col;
                    var label = cols1[col].vocab;
                    if (label) {
                        update_Vocs();
                        return catalogue_info.getSelectedRange().to.col !== col;
                    } else {
                        return catalogue_info.getSelectedRange().to.col !== -1;
                    }
                }},
            "add": {
                name: "Add table",
                hidden: function() {

                    return isAddTableMenuVisible(this, catalogue_infoGroups);
                }}
        }
    }
});
///////////////////////////////////////////////////////////////////////////////////
