/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var loadingMessage;
var templates = {};
var userJSON;
var vocabsMap = {};
var vocabFiles = {};
var records;
var globalVocabs = {};





$("body").on("click", ".sidebar-menu.tree>li>a[id]", function () {
    route($(this).attr("id"));
});

function route(linkId) {
//    console.log(linkId)
    var type = linkId.replace("Link", "");
    if (type.endsWith("ecords")) {//so that it works in Team
        type = "records";
    }

    $(".sidebar-menu.tree>li.active").removeClass("active");
    $("#" + linkId).parent().addClass("active");
    $(".searchBox").css("visibility", "visible");
    $(".content>.box").hide();
    $("." + type + "Box").show();
    $(".searchBox>input").attr("id", type + "SearchBox");

    var url_string = window.location.href;
    var url = new URL(url_string);
    var tableName = url.searchParams.get("table");
    var id = url.searchParams.get("id");

    if (linkId === "recordsLink") {
        $('#recordsTable').DataTable().responsive.recalc();
        //Header
        var headerContent = "MY RECORDS";
        if (spy === true) {
            headerContent = "ALL RECORDS";
        }
        $(".content-header>h1").html(headerContent);
        //SearchBox

    } else if (linkId === "templatesLink") {
        //Header
        $(".content-header>h1").html("TEMPLATES");
        //SearchBox
    } else if (linkId === "vocabsLink") {
        //Header
        var helpButton = "<a title='Click for help' target='_blank' href='help/" + type + ".htm' class='btn btn-default btn-circle' role='button'><i class='fa fa-question' aria-hidden='true'></i></a>";

//        var helpButton = "<button type='button' class='btn btn-default btn-circle'><i class='fa fa-info' aria-hidden='true'></i></button>";

        $(".content-header>h1").html("VOCABULARIES " + helpButton);
        //SearchBox
//        console.log(team)
        if (team === true) {
            publicVocabsDB_remote.allDocs({
                include_docs: false,
                descending: false
            }).then(function (result) {
                vocabFiles = JSPath.apply(".id", result.rows);
                createTableFromDocs(templatesDB_remote, "vocabs");
            });
        } else {
            createTableFromDocs(templatesDB_local, "vocabs");
        }

        window.history.replaceState({}, '', '?table=vocabularies');
    } else if (linkId === "settingsLink") {
        //Header
        $(".content-header>h1").html("SETTINGS");
        //SearchBox
        $(".searchBox").css("visibility", "hidden");
        window.history.replaceState({}, '', '?page=settings');





        /********************* TEAM ONLY! **************************************/
    } else if (linkId === "allRecordsLink") {//team
//        console.log(userJSON)
        var table = $('#recordsTable').DataTable();
        table.columns(myRecordsColumnIndex).search("").draw();
        //Header
        var headerContent = "ALL RECORDS";

        $(".content-header>h1").html(headerContent);
        var $actionsBox = $("#recordsTable_length").prev("div");
        if (userJSON.level !== "user") {//only show export and delete buttons in All records if admin or better
            $actionsBox.children("#exportRecordsButton").show();
            $actionsBox.children("#deleteRecordsButton").show();
        } else {
            $actionsBox.children("#exportRecordsButton").hide();
            $actionsBox.children("#deleteRecordsButton").hide();
        }
    } else if (linkId === "myRecordsLink") {//team
        var table = $('#recordsTable').DataTable();
//        table.columns(myRecordsColumnIndex).search(userJSON.organization).draw();
        table.columns(myRecordsColumnIndex).search(userJSON.fullName).draw();

        //Header
        var headerContent = "MY RECORDS";

        $(".content-header>h1").html(headerContent);
        var $actionsBox = $("#recordsTable_length").prev("div");
        $actionsBox.children("#exportRecordsButton").show();
        $actionsBox.children("#deleteRecordsButton").show();


    } else if (linkId === "locationsLink") {//locations
        showTableLoader(type);
        var helpButton = "<a title='Click for help' target='_blank' href='help/" + type + ".htm' class='btn btn-default btn-circle' role='button'><i class='fa fa-question' aria-hidden='true'></i></a>";

        //Header
        $(".content-header>h1").html("LOCATIONS " + helpButton);
        $(".vocabInfo").html("");
        //
        createInstancesTableFromDocs("locations");

        if (id === null) {//if URL has id, then leave it
            window.history.replaceState({}, '', '?table=locations');
        } else if (tableName === "organizations") {
            window.history.replaceState({}, '', '?table=locations');
        }


        //SearchBox
//        createTableFromDocs(templatesDB_local, "vocabs");
    } else if (linkId === "organizationsLink") {//team
        showTableLoader(type);
        var helpButton = "<a title='Click for help' target='_blank' href='help/" + type + ".htm' class='btn btn-default btn-circle' role='button'><i class='fa fa-question' aria-hidden='true'></i></a>";

        //Header
        $(".content-header>h1").html("LEGAL ENTITIES " + helpButton);
        $(".vocabInfo").html("");

        createInstancesTableFromDocs("organizations");


        if (id === null) {//if URL has id, then leave it
            window.history.replaceState({}, '', '?table=organizations');
        } else if (tableName === "locations") {
            window.history.replaceState({}, '', '?table=organizations');
        }


        //SearchBox
//        createTableFromDocs(templatesDB_local, "vocabs");
    } else if (linkId === "personsLink") {//team
        showTableLoader(type);
        var helpButton = "<a title='Click for help' target='_blank' href='help/" + type + ".htm' class='btn btn-default btn-circle' role='button'><i class='fa fa-question' aria-hidden='true'></i></a>";

        //Header
        $(".content-header>h1").html("PERSONS " + helpButton);
        $(".vocabInfo").html("");



        createInstancesTableFromDocs("persons");
//        createInstancesTableFromDocs("persons");
        window.history.replaceState({}, '', '?table=persons');


    } else if (linkId === "shipsLink") {//team
        showTableLoader(type);
        var helpButton = "<a title='Click for help' target='_blank' href='help/" + type + ".htm' class='btn btn-default btn-circle' role='button'><i class='fa fa-question' aria-hidden='true'></i></a>";

        //Header
        $(".content-header>h1").html("SHIPS " + helpButton);
        $(".vocabInfo").html("");


        createInstancesTableFromDocs("ships");
        window.history.replaceState({}, '', '?table=ships');


    } else if (linkId === "downloadsLink") {
        //Header
        $(".content-header>h1").html("DOWNLOADS");
        //SearchBox
        $(".searchBox").css("visibility", "hidden");
        $(".downloadsBox>div").load("downloads.html");
        window.history.replaceState({}, '', '?page=downloads');
    }
}


function reactToChanges(db) {//Being lazy I simply reload entire db for now (inspired by https://pouchdb.com/2015/02/28/efficiently-managing-ui-state-in-pouchdb.html)
    db.changes({live: true, since: 'now', include_docs: true}).on('change', function (change) {

        if (change.deleted) {//TODO should delete row on deletion
            // change.id holds the deleted id
            console.log("DELETING:" + change.id);
            var table = $('#recordsTable').DataTable().row("[id='" + change.id + "']").remove().draw();

//      onDeleted(change.id);
        } else { // updated/inserted
            // change.doc holds the new doc
            var doc = change.doc;

            if (team === true) {
                if (doc.status === "Private") {//Record is no longer shared in Team
                    var recordTitle = createFilename(doc, doc.template);
                    if (typeof recordTitle !== "undefined") {
                        var author = recordTitle.substring(recordTitle.lastIndexOf(",") + 2); //Removing author from record title, since there is a column for it
                        recordTitle = recordTitle.substring(recordTitle.indexOf(",") + 2, recordTitle.lastIndexOf(","));

                        //Update values using Datatables, so that it works even on invisible rows
                        var table = $('#recordsTable').DataTable();
                        var row = table.row("[id='" + doc._id + "']");
                        var rowIndex = row.index();
                        if (typeof rowIndex !== "undefined") {
                            messenger("Record " + recordTitle + " is no longer shared!", 10);
                            row.remove().draw(false);
                            visibleRecords.splice(visibleRecords.indexOf(doc._id), 1);

                        }
                    }
                } else {//Record is shared in Team
                    visibleRecords.push(doc._id)
                }
            }


            if (team === false || (team === true && visibleRecords.indexOf(doc._id) !== -1)) {//only update in Team if user may view updated record
                var recordTitle = createFilename(doc, doc.template);

                if (typeof recordTitle !== "undefined") {
                    var author = recordTitle.substring(recordTitle.lastIndexOf(",") + 2); //Removing author from record title, since there is a column for it
                    recordTitle = recordTitle.substring(recordTitle.indexOf(",") + 2, recordTitle.lastIndexOf(","));

                    //Update values using Datatables, so that it works even on invisible rows
                    var table = $('#recordsTable').DataTable();
                    var row = table.row("[id='" + doc._id + "']");
                    var rowIndex = row.index();

                    if (typeof rowIndex !== "undefined") {
                        messenger("Record " + recordTitle + " updated!", 10);

                        row.cell(rowIndex, 3).data("<b>" + recordTitle + "</b>").draw();
                        row.cell(rowIndex, 4).data("<b>" + author + "</b>").draw();
                        if (team === true) {
                            row.cell(rowIndex, 7).data("<b>" + doc.data.record_information.date_until + "</b>").draw();
                        } else {
                            row.cell(rowIndex, 6).data("<b>" + doc.data.record_information.date_until + "</b>").draw();
                            var status = doc.status;
                            if (typeof status === "undefined") {
                                status = "Private";
                            } else {
                                if (status === "Public") {
                                    status = "Shared";
                                }
                            }
                            row.cell(rowIndex, 7).data("<b>" + status + "</b>").draw();
                        }


                    } else {
                        messenger("Record " + recordTitle + " created!", 10);

                        var row;
                        if (team === true) {
                            row = createRecordTableRow(doc, userJSON.level);
                        } else {
                            row = createTableRow("records", change);
                        }
                        table.row.add($(row)[0]).draw(false);
                    }
                }
            }
//      onUpdatedOrInserted(change.doc);
        }
//    renderDocsSomehow();
    }).on('error', console.log.bind(console));
}


/*
 * Edit record
 */
$("body").on("click", ".editMyCatalogue", function (event) {
    var catalogue = $(this).attr("data-value");
    var template = $(this).attr("data-template");
    var templateTitle = $(this).attr("data-templatetitle");
    var mode = $(this).attr("data-mode");
    var target = "_self";
    if ($(this).hasClass("newTab")) {
        event.preventDefault();// to prevent actual link
        target = "_blank";
    }
    window.open("./templates/" + template + ".html?name=" + catalogue + "&templateTitle=" + templateTitle + "&mode=" + mode, target);
});

/*
 * Export vocabulary
 */
$("body").on("click", ".exportMyVocab", function () {
    var vocab = $(this).attr("data-id");

    if (team === true && !(vocab.endsWith("_gr") || vocab.endsWith("_it") || vocab.endsWith("_fr") || vocab.endsWith("_es") || vocab.endsWith("_ru") || vocab.endsWith("_in"))) {//global
        publicVocabsDB_remote.allDocs({
            include_docs: true,
            startkey: vocab.trim(),
            endkey: vocab.trim() + '\uffff'
        }).then(function (response) {
            var rows_selected = new Array();
            $.each(response.rows, function (index) {
                if (this.id.length === vocab.trim().length + 3) {//extra check to avoid Status and Status_Capacity mixup
                    rows_selected.push(this.id)
                }
            });
            createExportJSON("vocabs", rows_selected);

        });
    } else {

        var rows_selected = new Array(vocab);
        createExportJSON("vocabs", rows_selected);
    }
});

/*
 * Export record
 */
$("body").on("click", ".exportMyCatalogue", function () {
    var catalogue = $(this).attr("data-value");
    var rows_selected = new Array(catalogue);
    createExportJSON("records", rows_selected);
});

/*
 * Share/Unshare to FastCatTeam record
 */
$("body").on("click", ".toggleRecordStatus", function () {
    var record = $(this).attr("data-value");

    myRecordsDB_local.get(record).then(function (doc) {

        var status = doc.status;
        var newStatus = status;
        if (typeof status === "undefined" || status === "Private") {
            newStatus = "Public";
        } else {
            newStatus = "Private";
        }
        myRecordsDB_local.put({
            _id: record,
            _rev: doc._rev,
            template: doc.template,
            status: newStatus,
            data: doc.data
        }).then(function (response) {
            // handle response
//            console.log(response)
            if (newStatus === "Private") {//If no longer shared, then also update remote DB (dont know, perhaps we should also delete usages, we'll see)
                myRecordsDB_local.get(record).then(function (doc) {
                    saveRecordRemotely(record);
                }).catch(function (err) {
                    console.log(err);
                });
            }
        }).catch(function (err) {
            console.log(err);
        });

    }).catch(function (err) {
        console.log(err)
        console.log(("So now we get this error when we try to get() it: " + JSON.stringify(err)));
        alert("FastCat: Unexpected error when trying to change record " + record + " status! Contact support with following error message:" + JSON.stringify(err));
    });
});

/*
 * Delete record
 */
$("body").on("click", ".deleteMyCatalogue", function () {

    if (confirm("FastCat: Are you sure?")) {
        $('#recordsTable').DataTable().row($(this).parents('tr')).remove().draw();
        var catalogue = $(this).attr("data-value");

        deleteRecord(catalogue); //Delete record
        myVocabsDB_local.allDocs({//Delete record vocabs
            include_docs: true,
            descending: false
        }).then(function (result) {
            $.each(result.rows, function () {
                var vocabId = this.id; //id not _id
                var terms = this.doc.terms;
                $.each(terms, function () {
                    delete this.usage[catalogue];
                });

                myVocabsDB_local.get(vocabId).then(function (doc) {
                    return myVocabsDB_local.put({
                        _id: vocabId,
                        _rev: doc._rev,
                        label: doc.label,
                        lastModified: new Date().toJSON(),
                        terms: terms
                    });
                });

            });

        });

//    console.log(catalogue)
//WAS
//    instancesDB.allDocs({//Delete record instances
//        include_docs: true,
//        descending: false
//    }).then(function (result) {
//        $.each(result.rows, function () {
//
//            var instanceId = this.id;//id not _id
//            var instances = this.doc.instances;
//            $.each(instances, function () {
//                console.log("DELETING:")
//                console.log(this)
//                delete this.usage[catalogue];
//
//            });
//            instancesDB.get(instanceId).then(function (doc) {
//                return instancesDB.put({
//                    _id: instanceId,
//                    _rev: doc._rev,
//                    label: doc.label,
//                    lastModified: new Date().toJSON(),
//                    instances: instances
//                });
//            });
//
//        });
//    });

//IS
        deleteRecordUsages(catalogue, "organizations");
        deleteRecordUsages(catalogue, "ships");
        deleteRecordUsages(catalogue, "locations");
        deleteRecordUsages(catalogue, "persons");

    }
});


function deleteRecordUsages(recordId, type) {
    //IS  
    var remoteDB = getInstanceDBsFromType(type)[1];
    remoteDB.allDocs({
        include_docs: true
    }).then(function (result) {

        var insts = {};
        $.each(result.rows, function () {
//            console.log(result.rows)


            var instances = this.doc.instances;
            $.each(instances, function () {

                if (typeof this.usage !== "undefined") {
                    if (typeof this.usage[recordId] !== "undefined") {
//                        console.log("DELETING:")
//                        console.log(this)
                        delete this.usage[recordId];
                    }
                }




            });
            insts = appendJSONObject(insts, instances);

        });


//        console.log(insts)
        bulkUpdateDocs(remoteDB, result, type, insts)


    }).catch(function (err) {
        console.log(err);
    });



}

/*
 * Export record(s)
 */
$("body").on("click", "#exportRecordsButton", function () {

//$("#exportRecordsButton").click(function() {
    var rows_selected = $('#recordsTable').DataTable().column(0).checkboxes.selected();
    if (rows_selected.length === 0) {
        alert("FastCat: Please choose at least one record to export!");
    } else {
        createExportJSON("records", rows_selected);
    }

});

/*
 * Delete record(s)
 */
$("body").on("click", "#deleteRecordsButton", function () {

    var rows_selected = $('#recordsTable').DataTable().column(0).checkboxes.selected();
    if (rows_selected.length === 0) {
        alert("FastCat: Please choose at least one record to delete!");
    } else {
        if (confirm("FastCat: Are you sure?")) {
            deleteRecords(rows_selected);
        }
    }

});


function messenger(message, duration) {
    return Messenger().post({
        message: message,
        hideAfter: duration,
        type: "info",
        showCloseButton: true
    });


}
function createDataTable(id) {

    $('#' + id + ' tfoot tr th').each(function () {
        if (id === "recordsTable") {
            var lastColIndex = $(this).parent().children("th").length - 1;
            if (team === true && $(this).index() === lastColIndex) {//To hide Related organization column
                $(this).html("");
            } else if ($(this).index() !== 0 && $(this).index() !== lastColIndex) {
                $(this).html('<input type="text" placeholder="Filter" style="width: 100%; font-weight:normal;"/>');
            }
        } else if (id === "templatesTable") {
            if ($(this).index() !== 4) {
//                var title = $('#' + id + ' thead tr:eq(0) th').eq($(this).index()).text();
//                $(this).html('<input type="text" placeholder="Search ' + title + '" />');
                $(this).html('<input type="text" placeholder="Filter" style="width: 100%;font-weight:normal;"/>');

            }
        } else if (id === "vocabsTable") {
            if ($(this).index() !== 5 && $(this).index() !== 4) {
                $(this).html('<input type="text" placeholder="Filter" style="width: 100%;font-weight:normal;"/>');
            } else {
                $(this).html("");
            }
        }
    });

//    $.fn.dataTable.moment('DD/MM/YYYY');
    $.fn.dataTable.moment('YYYY-MM-DD');
    if (!$.fn.dataTable.isDataTable('#' + id)) {

//        console.log("init datatable " + id);
        var order = "asc";
        var options;
        if (id === "recordsTable") {
            order = "desc";
            options = {
//                'deferRender': true,
//                fixedHeader: {
//                    header: true,
//                    footer: true
//                },
//'fixedHeader': true,
                'orderCellsTop': true,
                'paging': true,
                'lengthChange': true,
                'pageLength': 50,
                'order': [[7, order]],
                'searching': true,
                'ordering': true,
                'info': true,
//                'responsive': true,
//                "scrollX": true,

                'autoWidth': false,
                'columnDefs': [
                    {
                        'targets': 0,
                        'checkboxes': {
                            'selectRow': true
                        }},
                    {
                        "targets": 'no-sort',
                        "orderable": false,
                        "order": []
                    }
                ],
                'select': {
                    'style': 'multi'
                }
            };
        } else if (id === "templatesTable") {
            options = {
                'orderCellsTop': true,
                'paging': true,
                'lengthChange': true,
                'pageLength': 50,
                'order': [[0, order]],
                'searching': true,
                'ordering': true,
                'info': true,
                'autoWidth': false,
                "columnDefs": [{
                        "targets": 'no-sort',
                        "orderable": false,
                        "order": []
                    }]
            };
        } else if (id === "vocabsTable") {
            options = {
                'orderCellsTop': true,
                'paging': true,
                'lengthChange': true,
                'pageLength': 50,
                'order': [[0, order]],
                'searching': true,
                'ordering': true,
                'info': true,
                'autoWidth': false,
                "columnDefs": [{
                        "targets": 'no-sort',
                        "orderable": false,
                        "order": []
                    },
                    {
                        "targets": [1],
                        "visible": false,
                        "searchable": false
                    }

                ]
            };
        } else if (id === "vocabs2Table") {
            options = {
                'orderCellsTop': true,
                'paging': true,
                'lengthChange': true,
                'pageLength': 50,
                'order': [[1, order]],
                'searching': true,
                'ordering': true,
                'info': true,
                'autoWidth': false,
                "columnDefs": [{
                        "targets": 'no-sort',
                        "orderable": false,
                        "order": []
                    }]
            };
        }

        // Moved filters above tbody, right after thead for Korina's sake
        if ($('#' + id).children("thead").length === 1) {
            var $tfoot = $('#' + id).children("tfoot");
            $('#' + id).children("thead").after("<thead>" + $tfoot.html() + "</thead>");

            $tfoot.hide();
        }


        var table = $('#' + id).DataTable(options);
        //Make organizations cell values unique
        if (id === "vocabsTable") {
            table.rows().every(function (index) {
                var value = table.cell(index, 4).data();
//                console.log('Data in index: ' + index + ' is: ' + value);
                var orgsTable = uniq(value.split("<br>"));
                var uniqueOrgsValue = orgsTable.join("<br/>");
                table.cell(index, 4).data(uniqueOrgsValue);
                index = index + 1;
            });
        }
        $('.dataTable').wrap('<div class="dataTables_scroll" />');




//        if (team === true && id === "recordsTable") {
//            if (typeof table.column(8) !== "undefined") {
//                table.column(8).visible(false);
//            }
//        }


//        $(".loader").fadeOut();
        loadingMessage.hide();
        $('#' + id).removeClass("hidden");
//        console.log(id)

//        var $div = $(table.table().container());

//        $div.find("table#" + id).on('keyup change', ' tr th input', function() {
//            console.log("ffff")
//            table.column($(this).parent().index() + ':visible')
//                    .search(this.value)
//                    .draw();
//        });


        table.columns().every(function (index) {
            $('#' + id + ' thead:eq(1) tr th:eq(' + index + ') input').on('keyup change', function () {
                table.column($(this).parent().index() + ':visible')
                        .search(this.value)
                        .draw();
            });
        });



    } else {
        console.log('redraw datatable ' + id);
//         var table = $('#' + id).DataTable(options);
//         table.clear().draw();
        // Moved filters above tbody, right after thead for Korina's sake
        // Moved filters above tbody, right after thead for Korina's sake
        if ($('#' + id).children("thead").length === 1) {
            var $tfoot = $('#' + id).children("tfoot");
            $('#' + id).children("thead").after("<thead>" + $tfoot.html() + "</thead>");
            $tfoot.hide();
        }

        var table = $('#' + id).DataTable().draw();
        table.columns().every(function (index) {
            $('#' + id + ' thead:eq(1) tr th:eq(' + index + ') input').on('keyup change', function () {
                table.column($(this).parent().index() + ':visible')
                        .search(this.value)
                        .draw();
            });
        });
    }

    $("#templatesTable_filter").parent().remove();
    $("#templatesTable_length").addClass("pull-right").parent().removeClass("col-sm-6").addClass("col-sm-12");
    $("#recordsTable_filter").parent().remove();
    $("#recordsTable_length").addClass("pull-right").parent().removeClass("col-sm-6").addClass("col-sm-12");
    $("#vocabsTable_filter").parent().remove();
    $("#vocabsTable_length").addClass("pull-right").parent().removeClass("col-sm-6").addClass("col-sm-12");
    $("#vocabs2Table_filter").parent().remove();
    $("#vocabs2Table_length").addClass("pull-right").parent().removeClass("col-sm-6").addClass("col-sm-2");

//    $("#recordsTable_length").before($(".actionButtons"));
    if ($(".actionButtons").length === 1) {
        $(".actionButtons").clone().css("display", "block").insertBefore($("#recordsTable_length"));
    }

//    $('table tr:nth-last-child(-n+3) td button').parent().addClass('dropup')
    //Made dropdowns -> dropups
//    $('table tr td button').parent().addClass('dropup');


//    $(".actionButtons").show();

//$("tfoot").hide();


}



function createTermOrInstanceDataTable(tableSelector, json) {

//    console.log(tableSelector)

    if (!$.fn.dataTable.isDataTable(tableSelector)) {

        var options;
        if (tableSelector === "#vocabs2Table") {
            options = {
                'orderCellsTop': true,
                'paging': true,
                'lengthChange': true,
                'pageLength': 50,
                'order': [[1, "asc"]],
                'searching': true,
                'ordering': true,
                'info': true,
//                'stateSave': true,
//                'stateDuration': -1,
//                'responsive': true,
//                "scrollX": true,
                'autoWidth': false,
                "columnDefs": [
                    {
                        "targets": 'no-sort',
                        "orderable": false,
                        "order": []
                    },
                    {
                        "targets": [2],
                        "visible": false,
                        "searchable": true
                    },
                    {
                        "targets": [3],
                        "visible": false,
                        "searchable": true
                    }

                ]};
        } else {
            var order = [[1, "asc"]];
            var checkboxes = "";

            var hiddenOrgsColumns = [3, 4];
            var hiddenShipsColumns = [3, 4];
            var hiddenPersonsColumns = [3, 4];
            var hiddenLocationsColumns = [2, 3, 10];
//            var hiddenLocationsColumns = [];

            var hiddenCols;
            if (tableSelector === "#organizationsTable") {
                hiddenCols = hiddenOrgsColumns;
            } else if (tableSelector === "#locationsTable") {
                hiddenCols = hiddenLocationsColumns;
            } else if (tableSelector === "#shipsTable") {
                hiddenCols = hiddenShipsColumns;
            } else if (tableSelector === "#personsTable") {
                hiddenCols = hiddenPersonsColumns;
            }

            var columnDefs = {
                'targets': hiddenCols,
                'visible': false,
                'searchable': true
            };



            if (tableSelector !== "#locationsTable") {//Mark as same is not applicable in locations
                checkboxes = {
                    'targets': 0,
                    'checkboxes': {
                        'selectRow': true
                    }};
                order = [[2, "asc"]];
            }
            options = {
                'data': json,
                createdRow: function (row, data, dataIndex) {
                    if (data.length > 0) {

                        var col0 = json[dataIndex][0];

                        $(row).attr('data-value', col0);

                        if (json[dataIndex][data.length - 1].indexOf("Mark as different") !== -1) {//Same As Row
                            $(row).children("td").eq("0").attr("style", "vertical-align: middle;");
                            $(row).children("td").eq(data.length - 4).attr("style", "vertical-align: middle;"); //-4 due to 2 invisible columns
                            $(row).attr('id', col0);
                            $(row).attr('data-id', col0);
                        } else {
                            $(row).attr('id', col0.toLowerCase());
                        }
                    }

                },
                "processing": true,
                'deferRender': true,
                'orderCellsTop': true,
                'paging': true,
                'lengthChange': true,
                'pageLength': 50,
                'searching': true,
                'ordering': true,
                'info': true,
                'stateSave': true,
                'stateDuration': -1,
                'autoWidth': false,
                'order': order,
                'columnDefs': [
                    checkboxes,
                    columnDefs,
                    {
                        'targets': 'no-sort',
                        'orderable': false,
                        'order': []
                    }
                ],
                'select': {
                    'style': 'multi'

                }
            };
        }

        $.fn.dataTable.moment('YYYY-MM-DD');

        var $table = $(tableSelector);

        var table = $table.DataTable(options);




        $table.find('tfoot tr th').each(function () {

            if (tableSelector === "#vocabs2Table") {
                if ($(this).index() !== 5 && $(this).index() !== 0) {
                    $(this).html('<input type="text" placeholder="Filter" style="width: 100%;font-weight:normal;"/>');
                } else {
                    $(this).html("");
                }
            } else {

                var lastColIndex = $(this).parent().children("th").length - 1;

                if (tableSelector !== "#locationsTable" && $(this).index() !== 0 && $(this).index() !== 1 && $(this).index() !== lastColIndex) {
                    $(this).html('<input class="col' + $(this).index() + '" type="text" placeholder="Filter" style="width: 100%; font-weight:normal;"/>');
                } else if (tableSelector === "#locationsTable" && $(this).index() !== 0 && $(this).index() !== lastColIndex) {
                    $(this).html('<input class="col' + $(this).index() + '" type="text" placeholder="Filter" style="width: 100%; font-weight:normal;"/>');
                } else {
                    $(this).html("");
                }
            }
        });
        if ($table.children("thead").length === 1) {
            var $tfoot = $table.children("tfoot");
            $table.children("thead").after("<thead>" + $tfoot.html() + "</thead>");
            $tfoot.hide();
        }

        $('.dataTable').wrap('<div class="dataTables_scroll" />');







        $table.find('thead tr th input').on('keyup change', function () {
            var actualTable = $(this).parent().parent().parent().parent().DataTable();
            actualTable.column($(this).parent().index() + ':visible')
                    .search(this.value)
                    .draw();
        });


//        $table.find("input[type='checkbox']").first().hide(); //Hide select-all (was not working well in instances
        if (tableSelector !== "#locationsTable") {
            $table.find("input[type='checkbox']").first().parent().html(""); //Hide select-all (was not working well in instances
////$table.find("th").first().html("<button class='sameMark'>Mark as same</button>"); //Hide select-all (was not working well in instances
        }


        $(tableSelector + "_filter").parent().remove();
        $(tableSelector + "_length").addClass("pull-right").parent().removeClass("col-sm-6").addClass("col-sm-2");
        var type = tableSelector.replace(/Table/g, "").substring(1);
        if (tableSelector !== "#locationsTable" && tableSelector !== "#vocabs2Table") {
            $(tableSelector + "_length").parent().parent().after("<div><button title='Click button to mark 2 or more instances as same' data-type='" + type + "' class='sameMark'>Mark as same</button><button title='Click button to reset table (remove any applied filters and uncheck checkboxes' data-type='" + type + "' class='resetTable'>ResetTable</button><span id='" + type + "ExportButtons'></span></div>");
        } else if (tableSelector === "#locationsTable") {
            $(tableSelector + "_length").parent().parent().after("<div><button title='Click button to reset table (remove any applied filters and uncheck checkboxes' data-type='" + type + "' class='resetTable'>ResetTable</button><span id='" + type + "ExportButtons'></span></div>");
        }
//        console.log(table)
//        table.fixedHeader.enable();


        if (tableSelector === "#vocabs2Table") {

            $(tableSelector + "_length").parent().parent().after("<div><span id='" + type + "ExportButtons'></span></div>");


            var url_string = window.location.href;
            var url = new URL(url_string);
            var term = url.searchParams.get("term");
            if (term !== null) {
                $("input[placeholder='Filter']").first().val(term);
                var table = $('#vocabs2Table').DataTable();
                table.columns(1).search(term).draw();
                $("a.editTerm[data-term=\"" + term + "\"]").trigger("click");
            }
        }


//        console.log(type)
        var colsToExport;
        if (type === "ships") {
            colsToExport = [2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        } else if (type === "organizations") {
            colsToExport = [2, 5];

        } else if (type === "persons") {
            colsToExport = [2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

        } else if (type === "locations") {
            colsToExport = [1, 4, 5, 6, 7, 8, 9, 10, 11];
        } else if (type === "vocabs2") {
            colsToExport = [1, 4, 5, 6];
        }

        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                {
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: colsToExport
                    },
                    text: 'Export to Excel',
                    titleAttr: 'Click to export entire table or selected rows to Excel'
                }
//                {
//                    extend: 'pdfHtml5',
//                    orientation: 'landscape',
//                    exportOptions: {
//                        columns: colsToExport
//                    },
//                    titleAttr: 'Click to export entire table or selected rows to PDF'
//
//                }
//                {
//                    extend: 'copyHtml5',
//                    exportOptions: {
//                        columns: colsToExport
//                    },
//                    titleAttr: 'Click to copy entire table or selected rows to clipboard'
//
//                },
            ]
        }).container().children("button").appendTo($('#' + type + 'ExportButtons'));

    } else {
        console.log("redraw");
        var table = $(tableSelector).DataTable();
        var state = table.state.loaded();
        var type = tableSelector.replace(/Table/g, "").substring(1);
//        $("#" + type + "TemplateTypeCombo").val("All").trigger("change");
//        $("#" + type + "RecordCombo").val("All").trigger("change");

        scanState(type, table, state);
        table.draw("full-hold");
    }

    if (tableSelector !== "#vocabs2Table") {//Added state save (for instances tables at the moment)

        $(tableSelector).on('page.dt', function () {
            var info = table.page.info();
//            console.log('Showing page: ' + info.page + ' of ' + info.pages);
            table.state.save();
//            console.log(table.state)
        });



        var type = tableSelector.replace(/Table/g, "").substring(1);

        if (typeof table !== "undefined") {
            var state = table.state.loaded();
            scanState(type, table, state);
        }

    }


    //Made dropdowns -> dropups
//    $('table tr td button').parent().addClass('dropdown');

}

/*
 * Better state handling mechanism
 * @param {type} type
 * @param {type} table
 * @param {type} state
 * @returns {undefined}
 */
function scanState(type, table, state) {
    if (state !== null) {
        var searchValue = state.search.search;
        $("#" + type + "SearchBox").val(searchValue);
        var visibleCount = 0;
        var invisibleCount = 0;

        var $templateCombo = $("#" + type + "TemplateTypeCombo");
        var $recCombo = $("#" + type + "RecordCombo");

//                    console.log($recCombo.html())


        $.each(state.columns, function (index) {
            if (this.search.search !== "") {
                console.log("FILTER:" + this.search.search);
            }


            if (this.visible === true) {
                $(".col" + visibleCount).val(this.search.search);
                visibleCount = visibleCount + 1;
            } else {

                if (this.search.search !== "") {
//                    console.log(":" + this.search.search)
                    var filter = this.search.search;

//                    console.log(invisibleCount)
                    var option = filter.substring(8, filter.length - 8).replace(/\\/g, "")

                    if (invisibleCount === 0) {
                        $templateCombo.val(option);
                    } else if (invisibleCount === 1) {
                        $recCombo.val(option);
                    }
                }
                invisibleCount = invisibleCount + 1;


            }
        });
    } else {
//        table.state.clear().destroy();
        $("input[placeholder='Filter']").val(""); //clear all filters

    }
}


function createExportJSON(type, rows_selected) {
    var output = "";
    var db;
    var filename;
    if (type === "records") {
        db = myRecordsDB_local;
        filename = "export(" + new Date().toJSON() + ").json";
    } else if (type === "vocabs") {
        db = myVocabsDB_local;
        console.log(rows_selected.length)
        if (rows_selected.length > 1) {//global vocab
            filename = rows_selected[0].substring(0, rows_selected[0].lastIndexOf("_")) + "(" + new Date().toJSON() + ").json";
        } else {
            filename = rows_selected[0] + "(" + new Date().toJSON() + ").json";
        }
    }
    var broken = rows_selected.slice();
    var salvaged = new Array();
    // Iterate over all selected checkboxes
    $.each(rows_selected, function (index, rowId) {
        if (index === 0) {
            output = '{"docs": [';
        }
        db.get(rowId).then(function (doc) {

            var recordTitle = createFilename(doc, doc.template);
            salvaged.push(recordTitle);

            broken.pop(rowId);
            delete doc._rev;
            output = output + JSON.stringify(doc);
            if (index === rows_selected.length - 1) {
                output = output + "]}";
                var file = new File([output], filename, {type: "text/json;charset=utf-8"});
                saveAs(file);

                if (broken.length > 0) {
                    alert("FastCat: Export summary\n\nRecovered records:\n" + salvaged + "\n\nUnrecoverable record:\n" + broken[0]);
                }

            } else {
                output = output + ", ";
            }
        }).catch(function (err) {
            console.log(("So now we get this error when we try to export: " + JSON.stringify(err)));
            alert("FastCat: Unexpected error when trying to export record(s)! Contact support with following error message:" + JSON.stringify(err));
        });



    });
}


function deleteRecords(rows_selected) {
    $('#recordsTable').DataTable().rows('.selected').deselect().remove().draw();
    $.each(rows_selected, function (index, rowId) {
        deleteRecord(rowId);
    });
    $('#recordsTable').DataTable().draw();

}
function deleteRecord(id) {
    myRecordsDB_local.get(id).then(function (doc) {
        myRecordsDB_local.remove(doc);
    }).catch(function (err) {
        console.log(("So now we get this error when we try to get() it: " + JSON.stringify(err)));
        alert("FastCat: Unexpected error when trying to delete record " + id + "! Contact support with following error message:" + JSON.stringify(err));
    });
}


/*
 * Search Box typing action
 */
$("body").on("keyup", "#recordsSearchBox", function () {
    $("#recordsTable").DataTable().search(this.value).draw();
});
/*
 * Search Box typing action
 */
$("body").on("keyup", "#vocabsSearchBox", function () {
    $("#vocabsTable").DataTable().search(this.value).draw();
});
/*
 * Search Box typing action
 */
$("body").on("keyup", "#vocabs2SearchBox", function () {
    $(".vocab").DataTable().search(this.value).draw();
});
/*
 * Search Box typing action
 */
$("body").on("keyup", "#shipsSearchBox", function () {
    $("#shipsTable").DataTable().search(this.value).draw();
});
/*
 * Search Box typing action
 */
$("body").on("keyup", "#personsSearchBox", function () {
    $("#personsTable").DataTable().search(this.value).draw();
});
/*
 * Search Box typing action
 */
$("body").on("keyup", "#locationsSearchBox", function () {
    $("#locationsTable").DataTable().search(this.value).draw();
});
/*
 * Search Box typing action
 */
$("body").on("keyup", "#organizationsSearchBox", function () {
    $("#organizationsTable").DataTable().search(this.value).draw();
});

function createTableFromDocs(db, type) {
//    console.log(db)
//    console.log(type)

    db.allDocs({
        include_docs: true,
        descending: false
    }).then(function (result) {
//        console.log(result)
// handle result
        if (type === "templates" || type === "vocabs") {
            if (type === "templates") {
//                console.log(JSON.stringify(result)); //used to create offline copy
            }
            var templatesCount = result.total_rows;
            if (templatesCount < 19) {
                console.log("First time and offline! Must build without CouchDB.");
//                results = {"total_rows": 19, "offset": 0, "rows": [{"id": "Accounts book", "key": "Accounts book", "value": {"rev": "24-2bc1faca593f4c74e7a707eb2cccdc15"}, "doc": {"keywords": "Accounts book", "sourceLanguage": "Greek", "title": "Accounts book", "organization": "FORTH/IMS", "vocabularies": [{"id": "collection_gr", "label": "Collection", "broader": "-"}, {"id": "money_form_gr", "label": "Form of money", "broader": "-"}, {"id": "ship_type_gr", "label": "Ship type", "broader": ""}, {"id": "status_gr", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_gr", "label": "Status|Capacity|Role", "broader": ""}, {"id": "transaction_type_gr", "label": "Transaction type", "broader": "-"}, {"id": "good_type_gr", "label": "Type of Goods", "broader": ""}, {"id": "unit_gr", "label": "Unit", "broader": ""}], "_id": "Accounts book", "_rev": "24-2bc1faca593f4c74e7a707eb2cccdc15"}}, {"id": "Census Odessa", "key": "Census Odessa", "value": {"rev": "11-5c0cc82f9964fb89edf37d1e9dd8e22a"}, "doc": {"keywords": "List of Persons", "sourceLanguage": "Russian", "title": "First national all-Russian census of the Russian Empire", "organization": "FORTH/IMS", "vocabularies": [{"id": "language_ru", "label": "Language", "broader": ""}, {"id": "marital_status_ru", "label": "Marital Status", "broader": "Status|Capacity|Role"}, {"id": "person_to_person_relation_ru", "label": "Person to Person Relation", "broader": ""}, {"id": "religion_ru", "label": "Religion", "broader": ""}, {"id": "social_status_ru", "label": "Social Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_ru", "label": "Status|Capacity|Role", "broader": ""}, {"id": "street_name_ru", "label": "Street name", "broader": "Location"}], "_id": "Census Odessa", "_rev": "11-5c0cc82f9964fb89edf37d1e9dd8e22a"}}, {"id": "Census_LaCiotat", "key": "Census_LaCiotat", "value": {"rev": "8-64337b82fa4fbac4d6e9df9895deb85e"}, "doc": {"keywords": "List of persons", "sourceLanguage": "French", "title": "Census La Ciotat", "organization": "FORTH/IMS", "vocabularies": [{"id": "marital_status_fr", "label": "Marital Status", "broader": ""}, {"id": "nationality_fr", "label": "Nationality", "broader": ""}, {"id": "person_to_person_relation_fr", "label": "Person to Person Relation", "broader": ""}, {"id": "religion_fr", "label": "Religion", "broader": ""}, {"id": "status_fr", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_fr", "label": "Status|Capacity|Role", "broader": ""}], "_id": "Census_LaCiotat", "_rev": "8-64337b82fa4fbac4d6e9df9895deb85e"}}, {"id": "Civil Register", "key": "Civil Register", "value": {"rev": "12-da8bdb3ae6b6a3fed874b837cbc243ae"}, "doc": {"keywords": "List of Persons", "sourceLanguage": "Spanish(Castilian)", "title": "Civil Register", "organization": "University of Barcelona", "vocabularies": [{"id": "person_to_person_relation_es", "label": "Person to Person Relation", "broader": ""}, {"id": "death_reason_es", "label": "Reason of Death", "broader": ""}, {"id": "status_capacity_role_es", "label": "Status|Capacity|Role", "broader": ""}], "_id": "Civil Register", "_rev": "12-da8bdb3ae6b6a3fed874b837cbc243ae"}}, {"id": "Crew List", "key": "Crew List", "value": {"rev": "12-236c3ecbb053c36d2af1d44b16160a37"}, "doc": {"keywords": "Crew List, List of ports of call", "sourceLanguage": "Spanish(Castilian)", "title": "Crew and displacement list (Roll)", "organization": "University of Barcelona", "vocabularies": [{"id": "alimentation_type_es", "label": "Alimentation type", "broader": ""}, {"id": "folder_title_es", "label": "Folder", "broader": ""}, {"id": "military_status_es", "label": "Military service status", "broader": ""}, {"id": "navigation_type_es", "label": "Navigation type", "broader": ""}, {"id": "observation_type_es", "label": "Observation type", "broader": ""}, {"id": "ship_type_es", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_es", "label": "Status|Capacity|Role", "broader": ""}, {"id": "good_type_es", "label": "Type of Goods", "broader": ""}, {"id": "type_of_organization_es", "label": "Type of organization", "broader": ""}, {"id": "unit_es", "label": "Unit", "broader": ""}], "_id": "Crew List", "_rev": "12-236c3ecbb053c36d2af1d44b16160a37"}}, {"id": "Crew List_IT", "key": "Crew List_IT", "value": {"rev": "10-69e9fb3e03c69c2fa267cf445a635f6c"}, "doc": {"keywords": "List of persons, crew list, payroll", "sourceLanguage": "Italian", "title": "Crew List (Ruoli di Equipaggio)", "organization": "NAVLAB-Università di Genova", "vocabularies": [{"id": "ammunition_type_it", "label": "Ammunition type", "broader": ""}, {"id": "ship_type_it", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_it", "label": "Status|Capacity|Role", "broader": ""}, {"id": "unit_it", "label": "Unit", "broader": ""}], "_id": "Crew List_IT", "_rev": "10-69e9fb3e03c69c2fa267cf445a635f6c"}}, {"id": "Inscription_Maritime", "key": "Inscription_Maritime", "value": {"rev": "1-b7e2d76f1a89c29d9c0e84f8861e4e7b"}, "doc": {"keywords": "List of persons", "sourceLanguage": "French", "title": "Inscription Maritime- Maritime Register of the State for La Ciotat", "organization": "FORTH/IMS", "vocabularies": [{"id": "series_fr", "label": "Series", "broader": ""}, {"id": "marital_status_fr", "label": "Marital Status", "broader": ""}, {"id": "nationality_fr", "label": "Nationality", "broader": ""}, {"id": "person_to_person_relation_fr", "label": "Person to Person Relation", "broader": ""}, {"id": "religion_fr", "label": "Religion", "broader": ""}, {"id": "status_fr", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_fr", "label": "Status|Capacity|Role", "broader": ""}, {"id": "type_of_heroic_act_fr", "label": "Type of Heroic Act", "broader": ""}, {"id": "reward_fr", "label": "Reward", "broader": ""}, {"id": "type_of_penalty_fr", "label": "Type of Penalty", "broader": ""}, {"id": "type_of_injury_sickness_fr", "label": "Type of injury sickness", "broader": ""}, {"id": "type_of_end_of_service_fr", "label": "Type of end of Service", "broader": ""}, {"id": "type_of_navigation_fr", "label": "Type of Navigation", "broader": ""}], "_id": "Inscription_Maritime", "_rev": "1-b7e2d76f1a89c29d9c0e84f8861e4e7b"}}, {"id": "Logbook", "key": "Logbook", "value": {"rev": "19-9860861a5e79a90f44f9bfbfd99cefa6"}, "doc": {"keywords": "Logbook", "sourceLanguage": "Greek", "title": "Logbook", "organization": "FORTH/IMS", "vocabularies": [{"id": "collection_gr", "label": "Collection", "broader": "-"}, {"id": "ship_direction_gr", "label": "Course of ship", "broader": ""}, {"id": "flag_gr", "label": "Flag", "broader": "-"}, {"id": "means_of_loading_gr", "label": "Loading means", "broader": ""}, {"id": "part_of_ship_gr", "label": "Part of Ship", "broader": ""}, {"id": "role_in_event_gr", "label": "Person Role in Event", "broader": "Status|Capacity|Role"}, {"id": "ship_type_gr", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_gr", "label": "Status|Capacity|Role", "broader": ""}, {"id": "event_type_gr", "label": "Type of Event", "broader": ""}, {"id": "good_type_gr", "label": "Type of Goods", "broader": ""}, {"id": "unit_gr", "label": "Unit", "broader": ""}, {"id": "calendar_weather_gr", "label": "Weather type", "broader": ""}, {"id": "wind_direction_gr", "label": "Wind direction", "broader": ""}, {"id": "wind_strength_gr", "label": "Wind strength", "broader": ""}], "_id": "Logbook", "_rev": "19-9860861a5e79a90f44f9bfbfd99cefa6"}}, {"id": "Maritime Workers_IT", "key": "Maritime Workers_IT", "value": {"rev": "13-a60ccaa1fa6290b1ad3caffa7666fe94"}, "doc": {"keywords": "List of persons", "sourceLanguage": "Italian", "title": "Register of Maritime workers (Matricole della gente di mare)", "organization": "NAVLAB-Università di Genova", "vocabularies": [{"id": "color_it", "label": "Color", "broader": ""}, {"id": "ship_type_it", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_it", "label": "Status|Capacity|Role", "broader": ""}], "_id": "Maritime Workers_IT", "_rev": "13-a60ccaa1fa6290b1ad3caffa7666fe94"}}, {"id": "Maritime_Register_ES", "key": "Maritime_Register_ES", "value": {"rev": "8-9cbab4170ecd3a622e030150dc725c36"}, "doc": {"keywords": "List of persons", "sourceLanguage": "Spanish(Castilian)", "title": "Register of Maritime personel", "organization": "University of Barcelona", "vocabularies": [{"id": "folder_title_es", "label": "Folder", "broader": "-"}, {"id": "marital_status_es", "label": "Marital Status", "broader": "-"}, {"id": "administrative_division_es", "label": "Administrative division", "broader": "Location"}, {"id": "status_es", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "fonds_es", "label": "Fonds Title", "broader": "-"}, {"id": "type_of_penalty_es", "label": "Penalty Type", "broader": "-"}, {"id": "unit_es", "label": "Unit", "broader": "-"}], "_id": "Maritime_Register_ES", "_rev": "8-9cbab4170ecd3a622e030150dc725c36"}}, {"id": "Messageries_Maritimes", "key": "Messageries_Maritimes", "value": {"rev": "12-6871529a22b39ff1542564140113154c"}, "doc": {"keywords": "List of persons", "sourceLanguage": "French", "title": "Employment records, Shipyards of Messageries Maritimes, La Ciotat", "organization": "FORTH/IMS", "vocabularies": [{"id": "series_fr", "label": "Series", "broader": "-"}, {"id": "status_capacity_role_fr", "label": "Status|Capacity|Role", "broader": "-"}, {"id": "unit_fr", "label": "Unit", "broader": "-"}, {"id": "marital_status_fr", "label": "Marital Status", "broader": "-"}, {"id": "person_to_person_relation_fr", "label": "Person to Person Relation", "broader": "-"}, {"id": "status_fr", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "workshop_name_fr", "label": "Workshop Name", "broader": "-"}, {"id": "event_type_fr", "label": "Type of Event", "broader": "-"}, {"id": "end_of_service_reason_fr", "label": "End of service reason", "broader": "-"}], "_id": "Messageries_Maritimes", "_rev": "12-6871529a22b39ff1542564140113154c"}}, {"id": "Notarial Deeds", "key": "Notarial Deeds", "value": {"rev": "12-310cd7e3cfe5a2cea42280c8608a9706"}, "doc": {"keywords": "Notarial Deeds", "sourceLanguage": "Greek", "title": "Notarial Deeds", "organization": "FORTH/IMS", "vocabularies": [{"id": "flag_gr", "label": "Flag", "broader": ""}, {"id": "ship_type_gr", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_gr", "label": "Status|Capacity|Role", "broader": ""}, {"id": "good_type_gr", "label": "Type of Goods", "broader": ""}, {"id": "unit_gr", "label": "Unit", "broader": ""}], "_id": "Notarial Deeds", "_rev": "12-310cd7e3cfe5a2cea42280c8608a9706"}}, {"id": "Payroll", "key": "Payroll", "value": {"rev": "14-d7d53e8f94b64fe61b19ea48d1edf08a"}, "doc": {"keywords": "Payroll", "sourceLanguage": "Greek", "title": "Payroll", "organization": "FORTH/IMS", "vocabularies": [{"id": "collection_gr", "label": "Collection", "broader": "-"}, {"id": "money_form_gr", "label": "Form of money", "broader": "-"}, {"id": "ship_type_gr", "label": "Ship type", "broader": ""}, {"id": "status_gr", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_gr", "label": "Status|Capacity|Role", "broader": ""}, {"id": "good_type_gr", "label": "Type of Goods", "broader": ""}, {"id": "unit_gr", "label": "Unit", "broader": ""}], "_id": "Payroll", "_rev": "14-d7d53e8f94b64fe61b19ea48d1edf08a"}}, {"id": "Payroll_RU", "key": "Payroll_RU", "value": {"rev": "10-8e91db2171e56dbd79b005074217d34a"}, "doc": {"keywords": "List of persons,Payroll", "sourceLanguage": "Russian", "title": "Payroll of Russian Steam Navigation and Trading Company", "organization": "FORTH/IMS", "vocabularies": [{"id": "document_type_ru", "label": "Document type", "broader": ""}, {"id": "fonds_ru", "label": "Fonds Title", "broader": ""}, {"id": "ship_type_ru", "label": "Ship type", "broader": ""}, {"id": "social_status_ru", "label": "Social Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_ru", "label": "Status|Capacity|Role", "broader": ""}, {"id": "unit_ru", "label": "Unit", "broader": ""}], "_id": "Payroll_RU", "_rev": "10-8e91db2171e56dbd79b005074217d34a"}}, {"id": "Register_of_Ships", "key": "Register_of_Ships", "value": {"rev": "4-9976feb3034cc6e727526c7265dda055"}, "doc": {"keywords": "List of ships", "sourceLanguage": "Spanish(Castilian)", "title": "Naval Ship Register List", "organization": "University of Barcelona", "vocabularies": [{"id": "status_capacity_role_es", "label": "Status|Capacity|Role", "broader": "-"}, {"id": "ship_type_es", "label": "Ship type", "broader": "-"}, {"id": "unit_es", "label": "Unit", "broader": "-"}, {"id": "type_of_organization_es", "label": "Type of organization", "broader": "-"}, {"id": "role_in_event_es", "label": "Person Role", "broader": "Status|Capacity|Role"}, {"id": "person_to_person_relation_es", "label": "Person to Person Relation", "broader": "-"}], "_id": "Register_of_Ships", "_rev": "4-9976feb3034cc6e727526c7265dda055"}}, {"id": "Sailors_Register", "key": "Sailors_Register", "value": {"rev": "9-acac2a93b704f57c8b0d738b0c0bcaa2"}, "doc": {"keywords": "List of persons", "sourceLanguage": "Spanish(Castilian)", "title": "Sailors register (Libro de registro de marineros)", "organization": "University of Barcelona", "vocabularies": [{"id": "folder_title_es", "label": "Folder", "broader": ""}, {"id": "marital_status_es", "label": "Marital Status", "broader": ""}, {"id": "type_of_penalty_es", "label": "Penalty type", "broader": ""}, {"id": "status_es", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_es", "label": "Status|Capacity|Role", "broader": ""}, {"id": "unit_es", "label": "Unit", "broader": ""}], "_id": "Sailors_Register", "_rev": "9-acac2a93b704f57c8b0d738b0c0bcaa2"}}, {"id": "Seagoing_Personel", "key": "Seagoing_Personel", "value": {"rev": "5-85599ed4ce9249e153548aee8db39ee9"}, "doc": {"keywords": "List of ships", "sourceLanguage": "Italian, Russian", "title": "Seagoing Personel", "organization": "FORTH/IMS", "vocabularies": [{"id": "document_type_in", "label": "Document Type", "broader": "-"}, {"id": "fonds_in", "label": "Fonds Title", "broader": "-"}, {"id": "status_capacity_role_in", "label": "Status|Capacity|Role", "broader": "-"}, {"id": "marital_status_in", "label": "Marital Status", "broader": "-"}, {"id": "end_of_service_reason_in", "label": "End of service reason", "broader": "-"}, {"id": "reward_in", "label": "Reward", "broader": "-"}, {"id": "source_type_title_in", "label": "Source type title", "broader": "-"}], "_id": "Seagoing_Personel", "_rev": "5-85599ed4ce9249e153548aee8db39ee9"}}, {"id": "Ship_List", "key": "Ship_List", "value": {"rev": "1-2ba15c9cd4b4cf97b1c63250b77a51d2"}, "doc": {"keywords": "List of ships", "sourceLanguage": "Italian, Russian, Spanish", "title": "List of ships", "organization": "FORTH/IMS, T.I.G./University of Barcelona", "vocabularies": [{"id": "document_type_in", "label": "Document Type", "broader": "-"}, {"id": "fonds_in", "label": "Fonds Title", "broader": "-"}, {"id": "status_capacity_role_in", "label": "Status|Capacity|Role", "broader": "-"}, {"id": "marital_status_in", "label": "Marital Status", "broader": "-"}, {"id": "end_of_service_reason_in", "label": "End of service reason", "broader": "-"}, {"id": "reward_in", "label": "Reward", "broader": "-"}, {"id": "source_type_title_in", "label": "Source type title", "broader": "-"}, {"id": "navigation_type_in", "label": "Navigation Type", "broader": "-"}, {"id": "unit_in", "label": "Unit", "broader": "-"}, {"id": "material_of_construction_in", "label": "Construction Material", "broader": "-"}, {"id": "type_of_engine_in", "label": "Engine Type", "broader": "-"}], "_id": "Ship_List", "_rev": "1-2ba15c9cd4b4cf97b1c63250b77a51d2"}}, {"id": "Students Register", "key": "Students Register", "value": {"rev": "7-b5bd532084cdc0a41c1e9486262b7a38"}, "doc": {"keywords": "List of persons", "sourceLanguage": "Italian", "title": "Students Register", "organization": "FORTH/IMS", "vocabularies": [{"id": "collection_it", "label": "Collection", "broader": "-"}, {"id": "course_it", "label": "Course", "broader": ""}, {"id": "register_it", "label": "Register", "broader": ""}, {"id": "religion_it", "label": "Religion", "broader": ""}, {"id": "status_capacity_role_it", "label": "Status|Capacity|Role", "broader": ""}, {"id": "course_subjects_it", "label": "Subject", "broader": ""}], "_id": "Students Register", "_rev": "7-b5bd532084cdc0a41c1e9486262b7a38"}}]};
//                results = {"total_rows": 20, "offset": 0, "rows": [{"id": "Accounts book", "key": "Accounts book", "value": {"rev": "24-2bc1faca593f4c74e7a707eb2cccdc15"}, "doc": {"keywords": "Accounts book", "sourceLanguage": "Greek", "title": "Accounts book", "organization": "FORTH/IMS", "vocabularies": [{"id": "collection_gr", "label": "Collection", "broader": "-"}, {"id": "money_form_gr", "label": "Form of money", "broader": "-"}, {"id": "ship_type_gr", "label": "Ship type", "broader": ""}, {"id": "status_gr", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_gr", "label": "Status|Capacity|Role", "broader": ""}, {"id": "transaction_type_gr", "label": "Transaction type", "broader": "-"}, {"id": "good_type_gr", "label": "Type of Goods", "broader": ""}, {"id": "unit_gr", "label": "Unit", "broader": ""}], "_id": "Accounts book", "_rev": "24-2bc1faca593f4c74e7a707eb2cccdc15"}}, {"id": "Census Odessa", "key": "Census Odessa", "value": {"rev": "11-5c0cc82f9964fb89edf37d1e9dd8e22a"}, "doc": {"keywords": "List of Persons", "sourceLanguage": "Russian", "title": "First national all-Russian census of the Russian Empire", "organization": "FORTH/IMS", "vocabularies": [{"id": "language_ru", "label": "Language", "broader": ""}, {"id": "marital_status_ru", "label": "Marital Status", "broader": "Status|Capacity|Role"}, {"id": "person_to_person_relation_ru", "label": "Person to Person Relation", "broader": ""}, {"id": "religion_ru", "label": "Religion", "broader": ""}, {"id": "social_status_ru", "label": "Social Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_ru", "label": "Status|Capacity|Role", "broader": ""}, {"id": "street_name_ru", "label": "Street name", "broader": "Location"}], "_id": "Census Odessa", "_rev": "11-5c0cc82f9964fb89edf37d1e9dd8e22a"}}, {"id": "Census_LaCiotat", "key": "Census_LaCiotat", "value": {"rev": "8-64337b82fa4fbac4d6e9df9895deb85e"}, "doc": {"keywords": "List of persons", "sourceLanguage": "French", "title": "Census La Ciotat", "organization": "FORTH/IMS", "vocabularies": [{"id": "marital_status_fr", "label": "Marital Status", "broader": ""}, {"id": "nationality_fr", "label": "Nationality", "broader": ""}, {"id": "person_to_person_relation_fr", "label": "Person to Person Relation", "broader": ""}, {"id": "religion_fr", "label": "Religion", "broader": ""}, {"id": "status_fr", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_fr", "label": "Status|Capacity|Role", "broader": ""}], "_id": "Census_LaCiotat", "_rev": "8-64337b82fa4fbac4d6e9df9895deb85e"}}, {"id": "Civil Register", "key": "Civil Register", "value": {"rev": "12-da8bdb3ae6b6a3fed874b837cbc243ae"}, "doc": {"keywords": "List of Persons", "sourceLanguage": "Spanish(Castilian)", "title": "Civil Register", "organization": "University of Barcelona", "vocabularies": [{"id": "person_to_person_relation_es", "label": "Person to Person Relation", "broader": ""}, {"id": "death_reason_es", "label": "Reason of Death", "broader": ""}, {"id": "status_capacity_role_es", "label": "Status|Capacity|Role", "broader": ""}], "_id": "Civil Register", "_rev": "12-da8bdb3ae6b6a3fed874b837cbc243ae"}}, {"id": "Crew List", "key": "Crew List", "value": {"rev": "12-236c3ecbb053c36d2af1d44b16160a37"}, "doc": {"keywords": "Crew List, List of ports of call", "sourceLanguage": "Spanish(Castilian)", "title": "Crew and displacement list (Roll)", "organization": "University of Barcelona", "vocabularies": [{"id": "alimentation_type_es", "label": "Alimentation type", "broader": ""}, {"id": "folder_title_es", "label": "Folder", "broader": ""}, {"id": "military_status_es", "label": "Military service status", "broader": ""}, {"id": "navigation_type_es", "label": "Navigation type", "broader": ""}, {"id": "observation_type_es", "label": "Observation type", "broader": ""}, {"id": "ship_type_es", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_es", "label": "Status|Capacity|Role", "broader": ""}, {"id": "good_type_es", "label": "Type of Goods", "broader": ""}, {"id": "type_of_organization_es", "label": "Type of organization", "broader": ""}, {"id": "unit_es", "label": "Unit", "broader": ""}], "_id": "Crew List", "_rev": "12-236c3ecbb053c36d2af1d44b16160a37"}}, {"id": "Crew List_IT", "key": "Crew List_IT", "value": {"rev": "10-69e9fb3e03c69c2fa267cf445a635f6c"}, "doc": {"keywords": "List of persons, crew list, payroll", "sourceLanguage": "Italian", "title": "Crew List (Ruoli di Equipaggio)", "organization": "NAVLAB-Università di Genova", "vocabularies": [{"id": "ammunition_type_it", "label": "Ammunition type", "broader": ""}, {"id": "ship_type_it", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_it", "label": "Status|Capacity|Role", "broader": ""}, {"id": "unit_it", "label": "Unit", "broader": ""}], "_id": "Crew List_IT", "_rev": "10-69e9fb3e03c69c2fa267cf445a635f6c"}}, {"id": "Crew_List_ES", "key": "Crew_List_ES", "value": {"rev": "1-b1f45d6c40118f94eeeea7a99354cd98"}, "doc": {"keywords": "Crew List, List of ports of call", "sourceLanguage": "Spanish(Castilian)", "title": "General Spanish Crew List", "organization": "University of Barcelona", "vocabularies": [{"id": "form_of_money_es", "label": "Form of money", "broader": ""}, {"id": "ship_type_es", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_es", "label": "Status|Capacity|Role", "broader": ""}], "_id": "Crew_List_ES", "_rev": "1-b1f45d6c40118f94eeeea7a99354cd98"}}, {"id": "Inscription_Maritime", "key": "Inscription_Maritime", "value": {"rev": "1-b7e2d76f1a89c29d9c0e84f8861e4e7b"}, "doc": {"keywords": "List of persons", "sourceLanguage": "French", "title": "Inscription Maritime- Maritime Register of the State for La Ciotat", "organization": "FORTH/IMS", "vocabularies": [{"id": "series_fr", "label": "Series", "broader": ""}, {"id": "marital_status_fr", "label": "Marital Status", "broader": ""}, {"id": "nationality_fr", "label": "Nationality", "broader": ""}, {"id": "person_to_person_relation_fr", "label": "Person to Person Relation", "broader": ""}, {"id": "religion_fr", "label": "Religion", "broader": ""}, {"id": "status_fr", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_fr", "label": "Status|Capacity|Role", "broader": ""}, {"id": "type_of_heroic_act_fr", "label": "Type of Heroic Act", "broader": ""}, {"id": "reward_fr", "label": "Reward", "broader": ""}, {"id": "type_of_penalty_fr", "label": "Type of Penalty", "broader": ""}, {"id": "type_of_injury_sickness_fr", "label": "Type of injury sickness", "broader": ""}, {"id": "type_of_end_of_service_fr", "label": "Type of end of Service", "broader": ""}, {"id": "type_of_navigation_fr", "label": "Type of Navigation", "broader": ""}], "_id": "Inscription_Maritime", "_rev": "1-b7e2d76f1a89c29d9c0e84f8861e4e7b"}}, {"id": "Logbook", "key": "Logbook", "value": {"rev": "19-9860861a5e79a90f44f9bfbfd99cefa6"}, "doc": {"keywords": "Logbook", "sourceLanguage": "Greek", "title": "Logbook", "organization": "FORTH/IMS", "vocabularies": [{"id": "collection_gr", "label": "Collection", "broader": "-"}, {"id": "ship_direction_gr", "label": "Course of ship", "broader": ""}, {"id": "flag_gr", "label": "Flag", "broader": "-"}, {"id": "means_of_loading_gr", "label": "Loading means", "broader": ""}, {"id": "part_of_ship_gr", "label": "Part of Ship", "broader": ""}, {"id": "role_in_event_gr", "label": "Person Role in Event", "broader": "Status|Capacity|Role"}, {"id": "ship_type_gr", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_gr", "label": "Status|Capacity|Role", "broader": ""}, {"id": "event_type_gr", "label": "Type of Event", "broader": ""}, {"id": "good_type_gr", "label": "Type of Goods", "broader": ""}, {"id": "unit_gr", "label": "Unit", "broader": ""}, {"id": "calendar_weather_gr", "label": "Weather type", "broader": ""}, {"id": "wind_direction_gr", "label": "Wind direction", "broader": ""}, {"id": "wind_strength_gr", "label": "Wind strength", "broader": ""}], "_id": "Logbook", "_rev": "19-9860861a5e79a90f44f9bfbfd99cefa6"}}, {"id": "Maritime Workers_IT", "key": "Maritime Workers_IT", "value": {"rev": "13-a60ccaa1fa6290b1ad3caffa7666fe94"}, "doc": {"keywords": "List of persons", "sourceLanguage": "Italian", "title": "Register of Maritime workers (Matricole della gente di mare)", "organization": "NAVLAB-Università di Genova", "vocabularies": [{"id": "color_it", "label": "Color", "broader": ""}, {"id": "ship_type_it", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_it", "label": "Status|Capacity|Role", "broader": ""}], "_id": "Maritime Workers_IT", "_rev": "13-a60ccaa1fa6290b1ad3caffa7666fe94"}}, {"id": "Maritime_Register_ES", "key": "Maritime_Register_ES", "value": {"rev": "8-9cbab4170ecd3a622e030150dc725c36"}, "doc": {"keywords": "List of persons", "sourceLanguage": "Spanish(Castilian)", "title": "Register of Maritime personel", "organization": "University of Barcelona", "vocabularies": [{"id": "folder_title_es", "label": "Folder", "broader": "-"}, {"id": "marital_status_es", "label": "Marital Status", "broader": "-"}, {"id": "administrative_division_es", "label": "Administrative division", "broader": "Location"}, {"id": "status_es", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "fonds_es", "label": "Fonds Title", "broader": "-"}, {"id": "type_of_penalty_es", "label": "Penalty Type", "broader": "-"}, {"id": "unit_es", "label": "Unit", "broader": "-"}], "_id": "Maritime_Register_ES", "_rev": "8-9cbab4170ecd3a622e030150dc725c36"}}, {"id": "Messageries_Maritimes", "key": "Messageries_Maritimes", "value": {"rev": "12-6871529a22b39ff1542564140113154c"}, "doc": {"keywords": "List of persons", "sourceLanguage": "French", "title": "Employment records, Shipyards of Messageries Maritimes, La Ciotat", "organization": "FORTH/IMS", "vocabularies": [{"id": "series_fr", "label": "Series", "broader": "-"}, {"id": "status_capacity_role_fr", "label": "Status|Capacity|Role", "broader": "-"}, {"id": "unit_fr", "label": "Unit", "broader": "-"}, {"id": "marital_status_fr", "label": "Marital Status", "broader": "-"}, {"id": "person_to_person_relation_fr", "label": "Person to Person Relation", "broader": "-"}, {"id": "status_fr", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "workshop_name_fr", "label": "Workshop Name", "broader": "-"}, {"id": "event_type_fr", "label": "Type of Event", "broader": "-"}, {"id": "end_of_service_reason_fr", "label": "End of service reason", "broader": "-"}], "_id": "Messageries_Maritimes", "_rev": "12-6871529a22b39ff1542564140113154c"}}, {"id": "Notarial Deeds", "key": "Notarial Deeds", "value": {"rev": "12-310cd7e3cfe5a2cea42280c8608a9706"}, "doc": {"keywords": "Notarial Deeds", "sourceLanguage": "Greek", "title": "Notarial Deeds", "organization": "FORTH/IMS", "vocabularies": [{"id": "flag_gr", "label": "Flag", "broader": ""}, {"id": "ship_type_gr", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_gr", "label": "Status|Capacity|Role", "broader": ""}, {"id": "good_type_gr", "label": "Type of Goods", "broader": ""}, {"id": "unit_gr", "label": "Unit", "broader": ""}], "_id": "Notarial Deeds", "_rev": "12-310cd7e3cfe5a2cea42280c8608a9706"}}, {"id": "Payroll", "key": "Payroll", "value": {"rev": "14-d7d53e8f94b64fe61b19ea48d1edf08a"}, "doc": {"keywords": "Payroll", "sourceLanguage": "Greek", "title": "Payroll", "organization": "FORTH/IMS", "vocabularies": [{"id": "collection_gr", "label": "Collection", "broader": "-"}, {"id": "money_form_gr", "label": "Form of money", "broader": "-"}, {"id": "ship_type_gr", "label": "Ship type", "broader": ""}, {"id": "status_gr", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_gr", "label": "Status|Capacity|Role", "broader": ""}, {"id": "good_type_gr", "label": "Type of Goods", "broader": ""}, {"id": "unit_gr", "label": "Unit", "broader": ""}], "_id": "Payroll", "_rev": "14-d7d53e8f94b64fe61b19ea48d1edf08a"}}, {"id": "Payroll_RU", "key": "Payroll_RU", "value": {"rev": "10-8e91db2171e56dbd79b005074217d34a"}, "doc": {"keywords": "List of persons,Payroll", "sourceLanguage": "Russian", "title": "Payroll of Russian Steam Navigation and Trading Company", "organization": "FORTH/IMS", "vocabularies": [{"id": "document_type_ru", "label": "Document type", "broader": ""}, {"id": "fonds_ru", "label": "Fonds Title", "broader": ""}, {"id": "ship_type_ru", "label": "Ship type", "broader": ""}, {"id": "social_status_ru", "label": "Social Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_ru", "label": "Status|Capacity|Role", "broader": ""}, {"id": "unit_ru", "label": "Unit", "broader": ""}], "_id": "Payroll_RU", "_rev": "10-8e91db2171e56dbd79b005074217d34a"}}, {"id": "Register_of_Ships", "key": "Register_of_Ships", "value": {"rev": "4-9976feb3034cc6e727526c7265dda055"}, "doc": {"keywords": "List of ships", "sourceLanguage": "Spanish(Castilian)", "title": "Naval Ship Register List", "organization": "University of Barcelona", "vocabularies": [{"id": "status_capacity_role_es", "label": "Status|Capacity|Role", "broader": "-"}, {"id": "ship_type_es", "label": "Ship type", "broader": "-"}, {"id": "unit_es", "label": "Unit", "broader": "-"}, {"id": "type_of_organization_es", "label": "Type of organization", "broader": "-"}, {"id": "role_in_event_es", "label": "Person Role", "broader": "Status|Capacity|Role"}, {"id": "person_to_person_relation_es", "label": "Person to Person Relation", "broader": "-"}], "_id": "Register_of_Ships", "_rev": "4-9976feb3034cc6e727526c7265dda055"}}, {"id": "Sailors_Register", "key": "Sailors_Register", "value": {"rev": "9-acac2a93b704f57c8b0d738b0c0bcaa2"}, "doc": {"keywords": "List of persons", "sourceLanguage": "Spanish(Castilian)", "title": "Sailors register (Libro de registro de marineros)", "organization": "University of Barcelona", "vocabularies": [{"id": "folder_title_es", "label": "Folder", "broader": ""}, {"id": "marital_status_es", "label": "Marital Status", "broader": ""}, {"id": "type_of_penalty_es", "label": "Penalty type", "broader": ""}, {"id": "status_es", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_es", "label": "Status|Capacity|Role", "broader": ""}, {"id": "unit_es", "label": "Unit", "broader": ""}], "_id": "Sailors_Register", "_rev": "9-acac2a93b704f57c8b0d738b0c0bcaa2"}}, {"id": "Seagoing_Personel", "key": "Seagoing_Personel", "value": {"rev": "5-85599ed4ce9249e153548aee8db39ee9"}, "doc": {"keywords": "List of ships", "sourceLanguage": "Italian, Russian", "title": "Seagoing Personel", "organization": "FORTH/IMS", "vocabularies": [{"id": "document_type_in", "label": "Document Type", "broader": "-"}, {"id": "fonds_in", "label": "Fonds Title", "broader": "-"}, {"id": "status_capacity_role_in", "label": "Status|Capacity|Role", "broader": "-"}, {"id": "marital_status_in", "label": "Marital Status", "broader": "-"}, {"id": "end_of_service_reason_in", "label": "End of service reason", "broader": "-"}, {"id": "reward_in", "label": "Reward", "broader": "-"}, {"id": "source_type_title_in", "label": "Source type title", "broader": "-"}], "_id": "Seagoing_Personel", "_rev": "5-85599ed4ce9249e153548aee8db39ee9"}}, {"id": "Ship_List", "key": "Ship_List", "value": {"rev": "1-2ba15c9cd4b4cf97b1c63250b77a51d2"}, "doc": {"keywords": "List of ships", "sourceLanguage": "Italian, Russian, Spanish", "title": "List of ships", "organization": "FORTH/IMS, T.I.G./University of Barcelona", "vocabularies": [{"id": "document_type_in", "label": "Document Type", "broader": "-"}, {"id": "fonds_in", "label": "Fonds Title", "broader": "-"}, {"id": "status_capacity_role_in", "label": "Status|Capacity|Role", "broader": "-"}, {"id": "marital_status_in", "label": "Marital Status", "broader": "-"}, {"id": "end_of_service_reason_in", "label": "End of service reason", "broader": "-"}, {"id": "reward_in", "label": "Reward", "broader": "-"}, {"id": "source_type_title_in", "label": "Source type title", "broader": "-"}, {"id": "navigation_type_in", "label": "Navigation Type", "broader": "-"}, {"id": "unit_in", "label": "Unit", "broader": "-"}, {"id": "material_of_construction_in", "label": "Construction Material", "broader": "-"}, {"id": "type_of_engine_in", "label": "Engine Type", "broader": "-"}], "_id": "Ship_List", "_rev": "1-2ba15c9cd4b4cf97b1c63250b77a51d2"}}, {"id": "Students Register", "key": "Students Register", "value": {"rev": "7-b5bd532084cdc0a41c1e9486262b7a38"}, "doc": {"keywords": "List of persons", "sourceLanguage": "Italian", "title": "Students Register", "organization": "FORTH/IMS", "vocabularies": [{"id": "collection_it", "label": "Collection", "broader": "-"}, {"id": "course_it", "label": "Course", "broader": ""}, {"id": "register_it", "label": "Register", "broader": ""}, {"id": "religion_it", "label": "Religion", "broader": ""}, {"id": "status_capacity_role_it", "label": "Status|Capacity|Role", "broader": ""}, {"id": "course_subjects_it", "label": "Subject", "broader": ""}], "_id": "Students Register", "_rev": "7-b5bd532084cdc0a41c1e9486262b7a38"}}]};
//                results = {"total_rows": 20, "offset": 0, "rows": [{"id": "Accounts book", "key": "Accounts book", "value": {"rev": "24-2bc1faca593f4c74e7a707eb2cccdc15"}, "doc": {"keywords": "Accounts book", "sourceLanguage": "Greek", "title": "Accounts book", "organization": "FORTH/IMS", "vocabularies": [{"id": "collection_gr", "label": "Collection", "broader": "-"}, {"id": "money_form_gr", "label": "Form of money", "broader": "-"}, {"id": "ship_type_gr", "label": "Ship type", "broader": ""}, {"id": "status_gr", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_gr", "label": "Status|Capacity|Role", "broader": ""}, {"id": "transaction_type_gr", "label": "Transaction type", "broader": "-"}, {"id": "good_type_gr", "label": "Type of Goods", "broader": ""}, {"id": "unit_gr", "label": "Unit", "broader": ""}], "_id": "Accounts book", "_rev": "24-2bc1faca593f4c74e7a707eb2cccdc15"}}, {"id": "Census Odessa", "key": "Census Odessa", "value": {"rev": "11-5c0cc82f9964fb89edf37d1e9dd8e22a"}, "doc": {"keywords": "List of Persons", "sourceLanguage": "Russian", "title": "First national all-Russian census of the Russian Empire", "organization": "FORTH/IMS", "vocabularies": [{"id": "language_ru", "label": "Language", "broader": ""}, {"id": "marital_status_ru", "label": "Marital Status", "broader": "Status|Capacity|Role"}, {"id": "person_to_person_relation_ru", "label": "Person to Person Relation", "broader": ""}, {"id": "religion_ru", "label": "Religion", "broader": ""}, {"id": "social_status_ru", "label": "Social Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_ru", "label": "Status|Capacity|Role", "broader": ""}, {"id": "street_name_ru", "label": "Street name", "broader": "Location"}], "_id": "Census Odessa", "_rev": "11-5c0cc82f9964fb89edf37d1e9dd8e22a"}}, {"id": "Census_LaCiotat", "key": "Census_LaCiotat", "value": {"rev": "8-64337b82fa4fbac4d6e9df9895deb85e"}, "doc": {"keywords": "List of persons", "sourceLanguage": "French", "title": "Census La Ciotat", "organization": "FORTH/IMS", "vocabularies": [{"id": "marital_status_fr", "label": "Marital Status", "broader": ""}, {"id": "nationality_fr", "label": "Nationality", "broader": ""}, {"id": "person_to_person_relation_fr", "label": "Person to Person Relation", "broader": ""}, {"id": "religion_fr", "label": "Religion", "broader": ""}, {"id": "status_fr", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_fr", "label": "Status|Capacity|Role", "broader": ""}], "_id": "Census_LaCiotat", "_rev": "8-64337b82fa4fbac4d6e9df9895deb85e"}}, {"id": "Civil Register", "key": "Civil Register", "value": {"rev": "12-da8bdb3ae6b6a3fed874b837cbc243ae"}, "doc": {"keywords": "List of Persons", "sourceLanguage": "Spanish(Castilian)", "title": "Civil Register", "organization": "University of Barcelona", "vocabularies": [{"id": "person_to_person_relation_es", "label": "Person to Person Relation", "broader": ""}, {"id": "death_reason_es", "label": "Reason of Death", "broader": ""}, {"id": "status_capacity_role_es", "label": "Status|Capacity|Role", "broader": ""}], "_id": "Civil Register", "_rev": "12-da8bdb3ae6b6a3fed874b837cbc243ae"}}, {"id": "Crew List", "key": "Crew List", "value": {"rev": "12-236c3ecbb053c36d2af1d44b16160a37"}, "doc": {"keywords": "Crew List, List of ports of call", "sourceLanguage": "Spanish(Castilian)", "title": "Crew and displacement list (Roll)", "organization": "University of Barcelona", "vocabularies": [{"id": "alimentation_type_es", "label": "Alimentation type", "broader": ""}, {"id": "folder_title_es", "label": "Folder", "broader": ""}, {"id": "military_status_es", "label": "Military service status", "broader": ""}, {"id": "navigation_type_es", "label": "Navigation type", "broader": ""}, {"id": "observation_type_es", "label": "Observation type", "broader": ""}, {"id": "ship_type_es", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_es", "label": "Status|Capacity|Role", "broader": ""}, {"id": "good_type_es", "label": "Type of Goods", "broader": ""}, {"id": "type_of_organization_es", "label": "Type of organization", "broader": ""}, {"id": "unit_es", "label": "Unit", "broader": ""}], "_id": "Crew List", "_rev": "12-236c3ecbb053c36d2af1d44b16160a37"}}, {"id": "Crew List_IT", "key": "Crew List_IT", "value": {"rev": "10-69e9fb3e03c69c2fa267cf445a635f6c"}, "doc": {"keywords": "List of persons, crew list, payroll", "sourceLanguage": "Italian", "title": "Crew List (Ruoli di Equipaggio)", "organization": "NAVLAB-Università di Genova", "vocabularies": [{"id": "ammunition_type_it", "label": "Ammunition type", "broader": ""}, {"id": "ship_type_it", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_it", "label": "Status|Capacity|Role", "broader": ""}, {"id": "unit_it", "label": "Unit", "broader": ""}], "_id": "Crew List_IT", "_rev": "10-69e9fb3e03c69c2fa267cf445a635f6c"}}, {"id": "Crew_List_ES", "key": "Crew_List_ES", "value": {"rev": "1-b1f45d6c40118f94eeeea7a99354cd98"}, "doc": {"keywords": "Crew List, List of ports of call", "sourceLanguage": "Spanish(Castilian)", "title": "General Spanish Crew List", "organization": "University of Barcelona", "vocabularies": [{"id": "form_of_money_es", "label": "Form of money", "broader": ""}, {"id": "ship_type_es", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_es", "label": "Status|Capacity|Role", "broader": ""}], "_id": "Crew_List_ES", "_rev": "1-b1f45d6c40118f94eeeea7a99354cd98"}}, {"id": "Inscription_Maritime", "key": "Inscription_Maritime", "value": {"rev": "1-b7e2d76f1a89c29d9c0e84f8861e4e7b"}, "doc": {"keywords": "List of persons", "sourceLanguage": "French", "title": "Inscription Maritime- Maritime Register of the State for La Ciotat", "organization": "FORTH/IMS", "vocabularies": [{"id": "series_fr", "label": "Series", "broader": ""}, {"id": "marital_status_fr", "label": "Marital Status", "broader": ""}, {"id": "nationality_fr", "label": "Nationality", "broader": ""}, {"id": "person_to_person_relation_fr", "label": "Person to Person Relation", "broader": ""}, {"id": "religion_fr", "label": "Religion", "broader": ""}, {"id": "status_fr", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_fr", "label": "Status|Capacity|Role", "broader": ""}, {"id": "type_of_heroic_act_fr", "label": "Type of Heroic Act", "broader": ""}, {"id": "reward_fr", "label": "Reward", "broader": ""}, {"id": "type_of_penalty_fr", "label": "Type of Penalty", "broader": ""}, {"id": "type_of_injury_sickness_fr", "label": "Type of injury sickness", "broader": ""}, {"id": "type_of_end_of_service_fr", "label": "Type of end of Service", "broader": ""}, {"id": "type_of_navigation_fr", "label": "Type of Navigation", "broader": ""}], "_id": "Inscription_Maritime", "_rev": "1-b7e2d76f1a89c29d9c0e84f8861e4e7b"}}, {"id": "Logbook", "key": "Logbook", "value": {"rev": "19-9860861a5e79a90f44f9bfbfd99cefa6"}, "doc": {"keywords": "Logbook", "sourceLanguage": "Greek", "title": "Logbook", "organization": "FORTH/IMS", "vocabularies": [{"id": "collection_gr", "label": "Collection", "broader": "-"}, {"id": "ship_direction_gr", "label": "Course of ship", "broader": ""}, {"id": "flag_gr", "label": "Flag", "broader": "-"}, {"id": "means_of_loading_gr", "label": "Loading means", "broader": ""}, {"id": "part_of_ship_gr", "label": "Part of Ship", "broader": ""}, {"id": "role_in_event_gr", "label": "Person Role in Event", "broader": "Status|Capacity|Role"}, {"id": "ship_type_gr", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_gr", "label": "Status|Capacity|Role", "broader": ""}, {"id": "event_type_gr", "label": "Type of Event", "broader": ""}, {"id": "good_type_gr", "label": "Type of Goods", "broader": ""}, {"id": "unit_gr", "label": "Unit", "broader": ""}, {"id": "calendar_weather_gr", "label": "Weather type", "broader": ""}, {"id": "wind_direction_gr", "label": "Wind direction", "broader": ""}, {"id": "wind_strength_gr", "label": "Wind strength", "broader": ""}], "_id": "Logbook", "_rev": "19-9860861a5e79a90f44f9bfbfd99cefa6"}}, {"id": "Maritime Workers_IT", "key": "Maritime Workers_IT", "value": {"rev": "13-a60ccaa1fa6290b1ad3caffa7666fe94"}, "doc": {"keywords": "List of persons", "sourceLanguage": "Italian", "title": "Register of Maritime workers (Matricole della gente di mare)", "organization": "NAVLAB-Università di Genova", "vocabularies": [{"id": "color_it", "label": "Color", "broader": ""}, {"id": "ship_type_it", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_it", "label": "Status|Capacity|Role", "broader": ""}], "_id": "Maritime Workers_IT", "_rev": "13-a60ccaa1fa6290b1ad3caffa7666fe94"}}, {"id": "Maritime_Register_ES", "key": "Maritime_Register_ES", "value": {"rev": "8-9cbab4170ecd3a622e030150dc725c36"}, "doc": {"keywords": "List of persons", "sourceLanguage": "Spanish(Castilian)", "title": "Register of Maritime personel", "organization": "University of Barcelona", "vocabularies": [{"id": "folder_title_es", "label": "Folder", "broader": "-"}, {"id": "marital_status_es", "label": "Marital Status", "broader": "-"}, {"id": "administrative_division_es", "label": "Administrative division", "broader": "Location"}, {"id": "status_es", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "fonds_es", "label": "Fonds Title", "broader": "-"}, {"id": "type_of_penalty_es", "label": "Penalty Type", "broader": "-"}, {"id": "unit_es", "label": "Unit", "broader": "-"}], "_id": "Maritime_Register_ES", "_rev": "8-9cbab4170ecd3a622e030150dc725c36"}}, {"id": "Messageries_Maritimes", "key": "Messageries_Maritimes", "value": {"rev": "12-6871529a22b39ff1542564140113154c"}, "doc": {"keywords": "List of persons", "sourceLanguage": "French", "title": "Employment records, Shipyards of Messageries Maritimes, La Ciotat", "organization": "FORTH/IMS", "vocabularies": [{"id": "series_fr", "label": "Series", "broader": "-"}, {"id": "status_capacity_role_fr", "label": "Status|Capacity|Role", "broader": "-"}, {"id": "unit_fr", "label": "Unit", "broader": "-"}, {"id": "marital_status_fr", "label": "Marital Status", "broader": "-"}, {"id": "person_to_person_relation_fr", "label": "Person to Person Relation", "broader": "-"}, {"id": "status_fr", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "workshop_name_fr", "label": "Workshop Name", "broader": "-"}, {"id": "event_type_fr", "label": "Type of Event", "broader": "-"}, {"id": "end_of_service_reason_fr", "label": "End of service reason", "broader": "-"}], "_id": "Messageries_Maritimes", "_rev": "12-6871529a22b39ff1542564140113154c"}}, {"id": "Notarial Deeds", "key": "Notarial Deeds", "value": {"rev": "13-f96ac4d6b539bdcc10eaee7cc4bc9d81"}, "doc": {"keywords": "Notarial Deeds", "sourceLanguage": "Greek", "title": "Notarial Deeds", "organization": "FORTH/IMS", "vocabularies": [{"id": "flag_gr", "label": "Flag", "broader": ""}, {"id": "ship_type_gr", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_gr", "label": "Status|Capacity|Role", "broader": ""}, {"id": "good_type_gr", "label": "Type of Goods", "broader": ""}, {"id": "unit_gr", "label": "Unit", "broader": ""}, {"id": "type_of_act_gr", "label": "Type of Act", "broader": ""}, {"id": "relation_type_to_other_person_gr", "label": "Link to other Person", "broader": ""}], "_id": "Notarial Deeds", "_rev": "13-f96ac4d6b539bdcc10eaee7cc4bc9d81"}}, {"id": "Payroll", "key": "Payroll", "value": {"rev": "14-d7d53e8f94b64fe61b19ea48d1edf08a"}, "doc": {"keywords": "Payroll", "sourceLanguage": "Greek", "title": "Payroll", "organization": "FORTH/IMS", "vocabularies": [{"id": "collection_gr", "label": "Collection", "broader": "-"}, {"id": "money_form_gr", "label": "Form of money", "broader": "-"}, {"id": "ship_type_gr", "label": "Ship type", "broader": ""}, {"id": "status_gr", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_gr", "label": "Status|Capacity|Role", "broader": ""}, {"id": "good_type_gr", "label": "Type of Goods", "broader": ""}, {"id": "unit_gr", "label": "Unit", "broader": ""}], "_id": "Payroll", "_rev": "14-d7d53e8f94b64fe61b19ea48d1edf08a"}}, {"id": "Payroll_RU", "key": "Payroll_RU", "value": {"rev": "10-8e91db2171e56dbd79b005074217d34a"}, "doc": {"keywords": "List of persons,Payroll", "sourceLanguage": "Russian", "title": "Payroll of Russian Steam Navigation and Trading Company", "organization": "FORTH/IMS", "vocabularies": [{"id": "document_type_ru", "label": "Document type", "broader": ""}, {"id": "fonds_ru", "label": "Fonds Title", "broader": ""}, {"id": "ship_type_ru", "label": "Ship type", "broader": ""}, {"id": "social_status_ru", "label": "Social Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_ru", "label": "Status|Capacity|Role", "broader": ""}, {"id": "unit_ru", "label": "Unit", "broader": ""}], "_id": "Payroll_RU", "_rev": "10-8e91db2171e56dbd79b005074217d34a"}}, {"id": "Register_of_Ships", "key": "Register_of_Ships", "value": {"rev": "4-9976feb3034cc6e727526c7265dda055"}, "doc": {"keywords": "List of ships", "sourceLanguage": "Spanish(Castilian)", "title": "Naval Ship Register List", "organization": "University of Barcelona", "vocabularies": [{"id": "status_capacity_role_es", "label": "Status|Capacity|Role", "broader": "-"}, {"id": "ship_type_es", "label": "Ship type", "broader": "-"}, {"id": "unit_es", "label": "Unit", "broader": "-"}, {"id": "type_of_organization_es", "label": "Type of organization", "broader": "-"}, {"id": "role_in_event_es", "label": "Person Role", "broader": "Status|Capacity|Role"}, {"id": "person_to_person_relation_es", "label": "Person to Person Relation", "broader": "-"}], "_id": "Register_of_Ships", "_rev": "4-9976feb3034cc6e727526c7265dda055"}}, {"id": "Sailors_Register", "key": "Sailors_Register", "value": {"rev": "9-acac2a93b704f57c8b0d738b0c0bcaa2"}, "doc": {"keywords": "List of persons", "sourceLanguage": "Spanish(Castilian)", "title": "Sailors register (Libro de registro de marineros)", "organization": "University of Barcelona", "vocabularies": [{"id": "folder_title_es", "label": "Folder", "broader": ""}, {"id": "marital_status_es", "label": "Marital Status", "broader": ""}, {"id": "type_of_penalty_es", "label": "Penalty type", "broader": ""}, {"id": "status_es", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_es", "label": "Status|Capacity|Role", "broader": ""}, {"id": "unit_es", "label": "Unit", "broader": ""}], "_id": "Sailors_Register", "_rev": "9-acac2a93b704f57c8b0d738b0c0bcaa2"}}, {"id": "Seagoing_Personel", "key": "Seagoing_Personel", "value": {"rev": "5-85599ed4ce9249e153548aee8db39ee9"}, "doc": {"keywords": "List of ships", "sourceLanguage": "Italian, Russian", "title": "Seagoing Personel", "organization": "FORTH/IMS", "vocabularies": [{"id": "document_type_in", "label": "Document Type", "broader": "-"}, {"id": "fonds_in", "label": "Fonds Title", "broader": "-"}, {"id": "status_capacity_role_in", "label": "Status|Capacity|Role", "broader": "-"}, {"id": "marital_status_in", "label": "Marital Status", "broader": "-"}, {"id": "end_of_service_reason_in", "label": "End of service reason", "broader": "-"}, {"id": "reward_in", "label": "Reward", "broader": "-"}, {"id": "source_type_title_in", "label": "Source type title", "broader": "-"}], "_id": "Seagoing_Personel", "_rev": "5-85599ed4ce9249e153548aee8db39ee9"}}, {"id": "Ship_List", "key": "Ship_List", "value": {"rev": "1-2ba15c9cd4b4cf97b1c63250b77a51d2"}, "doc": {"keywords": "List of ships", "sourceLanguage": "Italian, Russian, Spanish", "title": "List of ships", "organization": "FORTH/IMS, T.I.G./University of Barcelona", "vocabularies": [{"id": "document_type_in", "label": "Document Type", "broader": "-"}, {"id": "fonds_in", "label": "Fonds Title", "broader": "-"}, {"id": "status_capacity_role_in", "label": "Status|Capacity|Role", "broader": "-"}, {"id": "marital_status_in", "label": "Marital Status", "broader": "-"}, {"id": "end_of_service_reason_in", "label": "End of service reason", "broader": "-"}, {"id": "reward_in", "label": "Reward", "broader": "-"}, {"id": "source_type_title_in", "label": "Source type title", "broader": "-"}, {"id": "navigation_type_in", "label": "Navigation Type", "broader": "-"}, {"id": "unit_in", "label": "Unit", "broader": "-"}, {"id": "material_of_construction_in", "label": "Construction Material", "broader": "-"}, {"id": "type_of_engine_in", "label": "Engine Type", "broader": "-"}], "_id": "Ship_List", "_rev": "1-2ba15c9cd4b4cf97b1c63250b77a51d2"}}, {"id": "Students Register", "key": "Students Register", "value": {"rev": "7-b5bd532084cdc0a41c1e9486262b7a38"}, "doc": {"keywords": "List of persons", "sourceLanguage": "Italian", "title": "Students Register", "organization": "FORTH/IMS", "vocabularies": [{"id": "collection_it", "label": "Collection", "broader": "-"}, {"id": "course_it", "label": "Course", "broader": ""}, {"id": "register_it", "label": "Register", "broader": ""}, {"id": "religion_it", "label": "Religion", "broader": ""}, {"id": "status_capacity_role_it", "label": "Status|Capacity|Role", "broader": ""}, {"id": "course_subjects_it", "label": "Subject", "broader": ""}], "_id": "Students Register", "_rev": "7-b5bd532084cdc0a41c1e9486262b7a38"}}]};
                results = {"total_rows": 20, "offset": 0, "rows": [{"id": "Accounts book", "key": "Accounts book", "value": {"rev": "24-2bc1faca593f4c74e7a707eb2cccdc15"}, "doc": {"keywords": "Accounts book", "sourceLanguage": "Greek", "title": "Accounts book", "organization": "FORTH/IMS", "vocabularies": [{"id": "collection_gr", "label": "Collection", "broader": "-"}, {"id": "money_form_gr", "label": "Form of money", "broader": "-"}, {"id": "ship_type_gr", "label": "Ship type", "broader": ""}, {"id": "status_gr", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_gr", "label": "Status|Capacity|Role", "broader": ""}, {"id": "transaction_type_gr", "label": "Transaction type", "broader": "-"}, {"id": "good_type_gr", "label": "Type of Goods", "broader": ""}, {"id": "unit_gr", "label": "Unit", "broader": ""}], "_id": "Accounts book", "_rev": "24-2bc1faca593f4c74e7a707eb2cccdc15"}}, {"id": "Census Odessa", "key": "Census Odessa", "value": {"rev": "11-5c0cc82f9964fb89edf37d1e9dd8e22a"}, "doc": {"keywords": "List of Persons", "sourceLanguage": "Russian", "title": "First national all-Russian census of the Russian Empire", "organization": "FORTH/IMS", "vocabularies": [{"id": "language_ru", "label": "Language", "broader": ""}, {"id": "marital_status_ru", "label": "Marital Status", "broader": "Status|Capacity|Role"}, {"id": "person_to_person_relation_ru", "label": "Person to Person Relation", "broader": ""}, {"id": "religion_ru", "label": "Religion", "broader": ""}, {"id": "social_status_ru", "label": "Social Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_ru", "label": "Status|Capacity|Role", "broader": ""}, {"id": "street_name_ru", "label": "Street name", "broader": "Location"}], "_id": "Census Odessa", "_rev": "11-5c0cc82f9964fb89edf37d1e9dd8e22a"}}, {"id": "Census_LaCiotat", "key": "Census_LaCiotat", "value": {"rev": "8-64337b82fa4fbac4d6e9df9895deb85e"}, "doc": {"keywords": "List of persons", "sourceLanguage": "French", "title": "Census La Ciotat", "organization": "FORTH/IMS", "vocabularies": [{"id": "marital_status_fr", "label": "Marital Status", "broader": ""}, {"id": "nationality_fr", "label": "Nationality", "broader": ""}, {"id": "person_to_person_relation_fr", "label": "Person to Person Relation", "broader": ""}, {"id": "religion_fr", "label": "Religion", "broader": ""}, {"id": "status_fr", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_fr", "label": "Status|Capacity|Role", "broader": ""}], "_id": "Census_LaCiotat", "_rev": "8-64337b82fa4fbac4d6e9df9895deb85e"}}, {"id": "Civil Register", "key": "Civil Register", "value": {"rev": "12-da8bdb3ae6b6a3fed874b837cbc243ae"}, "doc": {"keywords": "List of Persons", "sourceLanguage": "Spanish(Castilian)", "title": "Civil Register", "organization": "University of Barcelona", "vocabularies": [{"id": "person_to_person_relation_es", "label": "Person to Person Relation", "broader": ""}, {"id": "death_reason_es", "label": "Reason of Death", "broader": ""}, {"id": "status_capacity_role_es", "label": "Status|Capacity|Role", "broader": ""}], "_id": "Civil Register", "_rev": "12-da8bdb3ae6b6a3fed874b837cbc243ae"}}, {"id": "Crew List", "key": "Crew List", "value": {"rev": "12-236c3ecbb053c36d2af1d44b16160a37"}, "doc": {"keywords": "Crew List, List of ports of call", "sourceLanguage": "Spanish(Castilian)", "title": "Crew and displacement list (Roll)", "organization": "University of Barcelona", "vocabularies": [{"id": "alimentation_type_es", "label": "Alimentation type", "broader": ""}, {"id": "folder_title_es", "label": "Folder", "broader": ""}, {"id": "military_status_es", "label": "Military service status", "broader": ""}, {"id": "navigation_type_es", "label": "Navigation type", "broader": ""}, {"id": "observation_type_es", "label": "Observation type", "broader": ""}, {"id": "ship_type_es", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_es", "label": "Status|Capacity|Role", "broader": ""}, {"id": "good_type_es", "label": "Type of Goods", "broader": ""}, {"id": "type_of_organization_es", "label": "Type of organization", "broader": ""}, {"id": "unit_es", "label": "Unit", "broader": ""}], "_id": "Crew List", "_rev": "12-236c3ecbb053c36d2af1d44b16160a37"}}, {"id": "Crew List_IT", "key": "Crew List_IT", "value": {"rev": "10-69e9fb3e03c69c2fa267cf445a635f6c"}, "doc": {"keywords": "List of persons, crew list, payroll", "sourceLanguage": "Italian", "title": "Crew List (Ruoli di Equipaggio)", "organization": "NAVLAB-Università di Genova", "vocabularies": [{"id": "ammunition_type_it", "label": "Ammunition type", "broader": ""}, {"id": "ship_type_it", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_it", "label": "Status|Capacity|Role", "broader": ""}, {"id": "unit_it", "label": "Unit", "broader": ""}], "_id": "Crew List_IT", "_rev": "10-69e9fb3e03c69c2fa267cf445a635f6c"}}, {"id": "Crew_List_ES", "key": "Crew_List_ES", "value": {"rev": "1-b1f45d6c40118f94eeeea7a99354cd98"}, "doc": {"keywords": "Crew List, List of ports of call", "sourceLanguage": "Spanish(Castilian)", "title": "General Spanish Crew List", "organization": "University of Barcelona", "vocabularies": [{"id": "form_of_money_es", "label": "Form of money", "broader": ""}, {"id": "ship_type_es", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_es", "label": "Status|Capacity|Role", "broader": ""}], "_id": "Crew_List_ES", "_rev": "1-b1f45d6c40118f94eeeea7a99354cd98"}}, {"id": "Inscription_Maritime", "key": "Inscription_Maritime", "value": {"rev": "1-b7e2d76f1a89c29d9c0e84f8861e4e7b"}, "doc": {"keywords": "List of persons", "sourceLanguage": "French", "title": "Inscription Maritime- Maritime Register of the State for La Ciotat", "organization": "FORTH/IMS", "vocabularies": [{"id": "series_fr", "label": "Series", "broader": ""}, {"id": "marital_status_fr", "label": "Marital Status", "broader": ""}, {"id": "nationality_fr", "label": "Nationality", "broader": ""}, {"id": "person_to_person_relation_fr", "label": "Person to Person Relation", "broader": ""}, {"id": "religion_fr", "label": "Religion", "broader": ""}, {"id": "status_fr", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_fr", "label": "Status|Capacity|Role", "broader": ""}, {"id": "type_of_heroic_act_fr", "label": "Type of Heroic Act", "broader": ""}, {"id": "reward_fr", "label": "Reward", "broader": ""}, {"id": "type_of_penalty_fr", "label": "Type of Penalty", "broader": ""}, {"id": "type_of_injury_sickness_fr", "label": "Type of injury sickness", "broader": ""}, {"id": "type_of_end_of_service_fr", "label": "Type of end of Service", "broader": ""}, {"id": "type_of_navigation_fr", "label": "Type of Navigation", "broader": ""}], "_id": "Inscription_Maritime", "_rev": "1-b7e2d76f1a89c29d9c0e84f8861e4e7b"}}, {"id": "Logbook", "key": "Logbook", "value": {"rev": "19-9860861a5e79a90f44f9bfbfd99cefa6"}, "doc": {"keywords": "Logbook", "sourceLanguage": "Greek", "title": "Logbook", "organization": "FORTH/IMS", "vocabularies": [{"id": "collection_gr", "label": "Collection", "broader": "-"}, {"id": "ship_direction_gr", "label": "Course of ship", "broader": ""}, {"id": "flag_gr", "label": "Flag", "broader": "-"}, {"id": "means_of_loading_gr", "label": "Loading means", "broader": ""}, {"id": "part_of_ship_gr", "label": "Part of Ship", "broader": ""}, {"id": "role_in_event_gr", "label": "Person Role in Event", "broader": "Status|Capacity|Role"}, {"id": "ship_type_gr", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_gr", "label": "Status|Capacity|Role", "broader": ""}, {"id": "event_type_gr", "label": "Type of Event", "broader": ""}, {"id": "good_type_gr", "label": "Type of Goods", "broader": ""}, {"id": "unit_gr", "label": "Unit", "broader": ""}, {"id": "calendar_weather_gr", "label": "Weather type", "broader": ""}, {"id": "wind_direction_gr", "label": "Wind direction", "broader": ""}, {"id": "wind_strength_gr", "label": "Wind strength", "broader": ""}], "_id": "Logbook", "_rev": "19-9860861a5e79a90f44f9bfbfd99cefa6"}}, {"id": "Maritime Workers_IT", "key": "Maritime Workers_IT", "value": {"rev": "13-a60ccaa1fa6290b1ad3caffa7666fe94"}, "doc": {"keywords": "List of persons", "sourceLanguage": "Italian", "title": "Register of Maritime workers (Matricole della gente di mare)", "organization": "NAVLAB-Università di Genova", "vocabularies": [{"id": "color_it", "label": "Color", "broader": ""}, {"id": "ship_type_it", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_it", "label": "Status|Capacity|Role", "broader": ""}], "_id": "Maritime Workers_IT", "_rev": "13-a60ccaa1fa6290b1ad3caffa7666fe94"}}, {"id": "Maritime_Register_ES", "key": "Maritime_Register_ES", "value": {"rev": "8-9cbab4170ecd3a622e030150dc725c36"}, "doc": {"keywords": "List of persons", "sourceLanguage": "Spanish(Castilian)", "title": "Register of Maritime personel", "organization": "University of Barcelona", "vocabularies": [{"id": "folder_title_es", "label": "Folder", "broader": "-"}, {"id": "marital_status_es", "label": "Marital Status", "broader": "-"}, {"id": "administrative_division_es", "label": "Administrative division", "broader": "Location"}, {"id": "status_es", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "fonds_es", "label": "Fonds Title", "broader": "-"}, {"id": "type_of_penalty_es", "label": "Penalty Type", "broader": "-"}, {"id": "unit_es", "label": "Unit", "broader": "-"}], "_id": "Maritime_Register_ES", "_rev": "8-9cbab4170ecd3a622e030150dc725c36"}}, {"id": "Messageries_Maritimes", "key": "Messageries_Maritimes", "value": {"rev": "12-6871529a22b39ff1542564140113154c"}, "doc": {"keywords": "List of persons", "sourceLanguage": "French", "title": "Employment records, Shipyards of Messageries Maritimes, La Ciotat", "organization": "FORTH/IMS", "vocabularies": [{"id": "series_fr", "label": "Series", "broader": "-"}, {"id": "status_capacity_role_fr", "label": "Status|Capacity|Role", "broader": "-"}, {"id": "unit_fr", "label": "Unit", "broader": "-"}, {"id": "marital_status_fr", "label": "Marital Status", "broader": "-"}, {"id": "person_to_person_relation_fr", "label": "Person to Person Relation", "broader": "-"}, {"id": "status_fr", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "workshop_name_fr", "label": "Workshop Name", "broader": "-"}, {"id": "event_type_fr", "label": "Type of Event", "broader": "-"}, {"id": "end_of_service_reason_fr", "label": "End of service reason", "broader": "-"}], "_id": "Messageries_Maritimes", "_rev": "12-6871529a22b39ff1542564140113154c"}}, {"id": "Notarial Deeds", "key": "Notarial Deeds", "value": {"rev": "14-085b56f29485c65056fb4f490804e16e"}, "doc": {"keywords": "Notarial Deeds", "sourceLanguage": "Greek, Spanish(Castilian)", "title": "Notarial Deeds", "organization": "FORTH/IMS, University of Barcelona", "vocabularies": [{"id": "flag_in", "label": "Flag", "broader": ""}, {"id": "ship_type_in", "label": "Ship type", "broader": ""}, {"id": "status_capacity_role_in", "label": "Status|Capacity|Role", "broader": ""}, {"id": "good_type_in", "label": "Type of Goods", "broader": ""}, {"id": "unit_in", "label": "Unit", "broader": ""}, {"id": "type_of_act_in", "label": "Type of Act", "broader": ""}, {"id": "relation_type_to_other_person_in", "label": "Link to other Person", "broader": ""}], "_id": "Notarial Deeds", "_rev": "14-085b56f29485c65056fb4f490804e16e"}}, {"id": "Payroll", "key": "Payroll", "value": {"rev": "14-d7d53e8f94b64fe61b19ea48d1edf08a"}, "doc": {"keywords": "Payroll", "sourceLanguage": "Greek", "title": "Payroll", "organization": "FORTH/IMS", "vocabularies": [{"id": "collection_gr", "label": "Collection", "broader": "-"}, {"id": "money_form_gr", "label": "Form of money", "broader": "-"}, {"id": "ship_type_gr", "label": "Ship type", "broader": ""}, {"id": "status_gr", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_gr", "label": "Status|Capacity|Role", "broader": ""}, {"id": "good_type_gr", "label": "Type of Goods", "broader": ""}, {"id": "unit_gr", "label": "Unit", "broader": ""}], "_id": "Payroll", "_rev": "14-d7d53e8f94b64fe61b19ea48d1edf08a"}}, {"id": "Payroll_RU", "key": "Payroll_RU", "value": {"rev": "10-8e91db2171e56dbd79b005074217d34a"}, "doc": {"keywords": "List of persons,Payroll", "sourceLanguage": "Russian", "title": "Payroll of Russian Steam Navigation and Trading Company", "organization": "FORTH/IMS", "vocabularies": [{"id": "document_type_ru", "label": "Document type", "broader": ""}, {"id": "fonds_ru", "label": "Fonds Title", "broader": ""}, {"id": "ship_type_ru", "label": "Ship type", "broader": ""}, {"id": "social_status_ru", "label": "Social Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_ru", "label": "Status|Capacity|Role", "broader": ""}, {"id": "unit_ru", "label": "Unit", "broader": ""}], "_id": "Payroll_RU", "_rev": "10-8e91db2171e56dbd79b005074217d34a"}}, {"id": "Register_of_Ships", "key": "Register_of_Ships", "value": {"rev": "4-9976feb3034cc6e727526c7265dda055"}, "doc": {"keywords": "List of ships", "sourceLanguage": "Spanish(Castilian)", "title": "Naval Ship Register List", "organization": "University of Barcelona", "vocabularies": [{"id": "status_capacity_role_es", "label": "Status|Capacity|Role", "broader": "-"}, {"id": "ship_type_es", "label": "Ship type", "broader": "-"}, {"id": "unit_es", "label": "Unit", "broader": "-"}, {"id": "type_of_organization_es", "label": "Type of organization", "broader": "-"}, {"id": "role_in_event_es", "label": "Person Role", "broader": "Status|Capacity|Role"}, {"id": "person_to_person_relation_es", "label": "Person to Person Relation", "broader": "-"}], "_id": "Register_of_Ships", "_rev": "4-9976feb3034cc6e727526c7265dda055"}}, {"id": "Sailors_Register", "key": "Sailors_Register", "value": {"rev": "9-acac2a93b704f57c8b0d738b0c0bcaa2"}, "doc": {"keywords": "List of persons", "sourceLanguage": "Spanish(Castilian)", "title": "Sailors register (Libro de registro de marineros)", "organization": "University of Barcelona", "vocabularies": [{"id": "folder_title_es", "label": "Folder", "broader": ""}, {"id": "marital_status_es", "label": "Marital Status", "broader": ""}, {"id": "type_of_penalty_es", "label": "Penalty type", "broader": ""}, {"id": "status_es", "label": "Status", "broader": "Status|Capacity|Role"}, {"id": "status_capacity_role_es", "label": "Status|Capacity|Role", "broader": ""}, {"id": "unit_es", "label": "Unit", "broader": ""}], "_id": "Sailors_Register", "_rev": "9-acac2a93b704f57c8b0d738b0c0bcaa2"}}, {"id": "Seagoing_Personel", "key": "Seagoing_Personel", "value": {"rev": "5-85599ed4ce9249e153548aee8db39ee9"}, "doc": {"keywords": "List of ships", "sourceLanguage": "Italian, Russian", "title": "Seagoing Personel", "organization": "FORTH/IMS", "vocabularies": [{"id": "document_type_in", "label": "Document Type", "broader": "-"}, {"id": "fonds_in", "label": "Fonds Title", "broader": "-"}, {"id": "status_capacity_role_in", "label": "Status|Capacity|Role", "broader": "-"}, {"id": "marital_status_in", "label": "Marital Status", "broader": "-"}, {"id": "end_of_service_reason_in", "label": "End of service reason", "broader": "-"}, {"id": "reward_in", "label": "Reward", "broader": "-"}, {"id": "source_type_title_in", "label": "Source type title", "broader": "-"}], "_id": "Seagoing_Personel", "_rev": "5-85599ed4ce9249e153548aee8db39ee9"}}, {"id": "Ship_List", "key": "Ship_List", "value": {"rev": "2-c1a0d5d23ce2df1892d42beaf72b3a82"}, "doc": {"keywords": "List of ships", "sourceLanguage": "Italian, Russian, Spanish(Castilian)", "title": "List of ships", "organization": "FORTH/IMS, T.I.G., University of Barcelona", "vocabularies": [{"id": "document_type_in", "label": "Document Type", "broader": "-"}, {"id": "fonds_in", "label": "Fonds Title", "broader": "-"}, {"id": "status_capacity_role_in", "label": "Status|Capacity|Role", "broader": "-"}, {"id": "marital_status_in", "label": "Marital Status", "broader": "-"}, {"id": "end_of_service_reason_in", "label": "End of service reason", "broader": "-"}, {"id": "reward_in", "label": "Reward", "broader": "-"}, {"id": "source_type_title_in", "label": "Source type title", "broader": "-"}, {"id": "navigation_type_in", "label": "Navigation Type", "broader": "-"}, {"id": "unit_in", "label": "Unit", "broader": "-"}, {"id": "material_of_construction_in", "label": "Construction Material", "broader": "-"}, {"id": "type_of_engine_in", "label": "Engine Type", "broader": "-"}], "_id": "Ship_List", "_rev": "2-c1a0d5d23ce2df1892d42beaf72b3a82"}}, {"id": "Students Register", "key": "Students Register", "value": {"rev": "7-b5bd532084cdc0a41c1e9486262b7a38"}, "doc": {"keywords": "List of persons", "sourceLanguage": "Italian", "title": "Students Register", "organization": "FORTH/IMS", "vocabularies": [{"id": "collection_it", "label": "Collection", "broader": "-"}, {"id": "course_it", "label": "Course", "broader": ""}, {"id": "register_it", "label": "Register", "broader": ""}, {"id": "religion_it", "label": "Religion", "broader": ""}, {"id": "status_capacity_role_it", "label": "Status|Capacity|Role", "broader": ""}, {"id": "course_subjects_it", "label": "Subject", "broader": ""}], "_id": "Students Register", "_rev": "7-b5bd532084cdc0a41c1e9486262b7a38"}}]};
            }
        }
        var allRows = "";
        if (type === "templates") {
            console.log("File testing will commence! Please ignore next Uncaught ReferenceError messages!");
        }
        $.each(result.rows, function () {

            if (this.id.indexOf("_design") === -1) {
                var htmlRow = "";
//                console.log(type)
                if (type === "templates") {
//                    if (this.id !== "Logbook" && this.id !== "Accounts book") {//temp code!
//console.log(this.doc.vocabularies)
//Adding template vocabs to localstorage 
                    localStorage.setItem("Vocabs(" + this.id + ")", JSPath.apply(".id", this.doc.vocabularies))

                    templates[this.id + "_title"] = this.doc.title;
                    templates[this.id + "_keywords"] = this.doc.keywords;
                    htmlRow = createTableRow(type, this);
//
                    var templateId = this.id;
                    Promise.all([
                        load.js("templates/js/" + templateId + ".js")
                    ]).then(function () {
//                        console.log('Exists:' + templateId);
                    }).catch(function () {
//                        console.log('Does not exist!' + templateId);
                        $("tr[data-template='" + templateId + "']").find("button").replaceWith("<a href='#'><b>NEW Template!</b><br/> Update Fast Cat to use it.</a>");
                    });


                } else if (type === "records") {

                    htmlRow = createTableRow(type, this);
                } else if (type === "vocabs") {
                    htmlRow = createTableRow(type, this);
                }
                allRows = allRows + htmlRow;
            }
        });
        if (type === "templates") {
            $("#templatesTable").children("tbody").html(allRows);
            createDataTable("templatesTable");
            createTableFromDocs(myRecordsDB_local, "records");
        } else if (type === "records") {
            $("#recordsTable").children("tbody").html(allRows);
            createDataTable("recordsTable");
            if (homeTable === "records") {
                $(".recordsBox").show();
                $('#recordsTable').DataTable().responsive.recalc();
            }
        } else if (type === "vocabs") {
            var vocabsDB;

//            console.log(team)
            if (team === true) {
                vocabsDB = publicVocabsDB_remote;
                var countingTermsMessage = messenger("Counting terms!", 5);

            } else {
                vocabsDB = myVocabsDB_local;
            }

            var $allRows = $("<table>" + allRows + "</table>");
            var merged = [];
//            var global = [];
            var templatesCount = Object.keys(templates).length / 2;
            var mergedRows = "";
//            console.log(vocabsMap)

            $.each($allRows.find("tr"), function () {

                var $row = $(this);
                var vocabId = $row.attr("data-id");


                if (vocabId !== "?") {
                    if (!(vocabId.startsWith("location_"))) {//hide Location vocabs


                        var vocabFamily = $row.attr("data-family");


                        var vocabLabel = $row.children("td:nth-child(1)").clone()	//clone the element
                                .children()	//select all the children
                                .remove()	//remove all the children
                                .end()	//again go back to selected element
                                .text().trim();	//get the text of element;

//  console.log(vocabId+"---"+vocabLabel)
//  console.log( $row.children("td:nth-child(3)").html())

                        var vocabBroader = $row.children("td:nth-child(2)").html();
                        var vocabOrgs = $row.children("td:nth-child(5)").html();

                        var href = $row.find("a.goToVocab").attr("href");
                        href = href.replace(/template=[^&]+/mg, "vocabId=" + vocabId);




                        if (vocabsMap[vocabId + "_template"].indexOf("<br/>") !== -1) {//Multiple templates, must act
                            if (merged.indexOf(vocabId) === -1) {
                                var templates = vocabsMap[vocabId + "_template"];

                                var orgs = vocabsMap[vocabId + "_organization"];
                                if (templates.split("<br/>").length === templatesCount) {//Special handling for global vocabs (exist in all templates)
                                    templates = "All";
                                    orgs = "All";
                                    href = href.replace(/language=[^&]+/mg, "language=English");
                                    $row.children("td:nth-child(3)").html("English");
                                }
                                $row.children("td:nth-child(4)").html(templates);
                                $row.children("td:nth-child(5)").html(orgs);
                                merged.push(vocabId);

                                //Following snippet added to find unique organizations to show in vocabulary screen
//                                console.log(vocabId)
//                                console.log(orgs)
                                var uniqueOrgs = uniq(orgs.split("<br/>"));
//                                                                $row.children("td:nth-child(5)").html(uniqueOrgs);

                                var uniqueOrgsString = "";
                                for (var i = 0; i < uniqueOrgs.length; i++) {
                                    uniqueOrgsString = uniqueOrgsString + uniqueOrgs[i] + "<br/>";
                                }
                                uniqueOrgsString = uniqueOrgsString.substring(0, uniqueOrgsString.length - 5);//remove <br/> from end
                                var enhancedHref = href + "&vocabLabel=" + vocabLabel + "&vocabBroader=" + vocabBroader + "&vocabOrgs=" + uniqueOrgsString;
                                $row.find("a.goToVocab").attr("href", enhancedHref);
                                $row.find("a.exportMyVocab").attr("data-id", vocabId);

                                if (typeof $row.find('.badge').html() === 'undefined') {//hide export vocab when it's empty
                                    $row.find("a.exportMyVocab").hide();
                                }
                                if (vocabFiles.indexOf(vocabId) !== -1) {
//                                console.log(vocabId)
                                    cleanVocabAndEnhanceBadge(vocabsDB, vocabId);
                                }
                                mergedRows = mergedRows + "<tr id='" + vocabId + "' data-family='" + vocabFamily + "'>" + $row.html() + "</tr>";
                            }

                        } else {//Single template
                            var enhancedHref = href + "&vocabLabel=" + vocabLabel + "&vocabBroader=" + vocabBroader + "&vocabOrgs=" + vocabOrgs;
                            $row.find("a.goToVocab").attr("href", enhancedHref);

                            $row.find("a.exportMyVocab").attr("data-id", vocabId);

                            if (typeof $row.find('.badge').html() === 'undefined') {//hide export vocab when it's empty
                                $row.find("a.exportMyVocab").hide();
                            }
                            if (vocabFiles.indexOf(vocabId) !== -1) {
//                            console.log(vocabId)
                                cleanVocabAndEnhanceBadge(vocabsDB, vocabId);
                            }

                            mergedRows = mergedRows + "<tr id='" + vocabId + "' data-family='" + vocabFamily + "'>" + $row.html() + "</tr>";
                        }



                    }
                }
            });

            countingTermsMessage.hide();

            var $mergedRows = $("<table>" + mergedRows + "</table>");
//            console.log(mergedRows)
            //FUTURE
            if (team === true) {//compact GLOBAL
                mergedRows = compactGlobalVocabs($mergedRows);
                $mergedRows = $(mergedRows);
                $mergedRows.find("span.badge:empty").hide();
                $("#vocabsTable").children("tbody").html($mergedRows);
            } else {
                $("#vocabsTable").children("tbody").html(mergedRows);
            }

//console.log($("#vocabsTable").children("tbody").html())
//$("#vocabsTable").find("tr").find("td:eq(4)").each( function() {
//    console.log($(this).html())
//})


            createDataTable("vocabsTable");
        }


    }).catch(function (err) {
        console.log(err);

        if (err.name === "indexed_db_went_bad") {


            if (err.reason === "Failed to open indexedDB, are you in private browsing mode?") {
                alert("FastCat: Something went wrong while loading DB. FastCat may not work properly if you work in private browsing mode or if your browser does not remember history!");
            } else {
                if (err.reason === "DataError") {
                    if (db.name === "my_records") {
                        alert("FastCat: Something went wrong while loading your records. Please reload and if error persists, contact support. \n\
As a precaution, all your recoverable records are exported!");

                        db.allDocs({
                            include_docs: false,
                            descending: false
                        }).then(function (result) {

                            var docs = new Array();
                            myRecordsDB_local = new PouchDB('my_records');//needed reinitialization, because otherwise I got closed connection error

                            $.each(result.rows, function (index) {

                                if (this.id.indexOf("_design") === -1) {
                                    docs.push(this.id);
                                }

                            });
                            createExportJSON("records", docs);


                        });

                    }

                } else {
                    alert("FastCat: Something went wrong while loading DB. Please reload and if error persists, contact support");

                }

            }

        }

        countingTermsMessage.hide();
//        $(".loader").fadeOut();

    });

    return $.Deferred().resolve();
}



function createTableRow(type, json) {
    var id = json.id;
    var allowedActions;
    var keywords, sourceLanguage, title, organization;
//    if (typeof json.doc.template !== "undefined") {//record
    if (type === "records") {
        var template = json.doc.template;
        var templateTitle = templates[template + "_title"];

        if (template !== "Archival_Corpus" && typeof templateTitle === "undefined") {

            location.reload();
        }

        var recordTitle = createFilename(json.doc, templateTitle);
        if (typeof templateTitle !== "undefined") {//precaution
            recordTitle = recordTitle.substring(templateTitle.length + 1);
            recordTitle = recordTitle.substring(0, recordTitle.lastIndexOf(",")); //Removing author from record title, since there is a column for it
        }
        var editViewAction = "Edit";
        var viewModeParam = "";
        if (spy === true) {
            editViewAction = "View";
            viewModeParam = "&mode=" + editViewAction;
        }

        allowedActions = "<li><a href='templates/" + template + ".html?name=" + id + "&templateTitle=" + templateTitle + viewModeParam + "' class='editMyCatalogue' data-value='" + id + "' data-template='" + template + "' data-templateTitle='" + templateTitle + "' data-mode='" + editViewAction + "'>" + editViewAction + " record</a></li>" +
                "<li><a href='templates/" + template + ".html?name=" + id + "&templateTitle=" + templateTitle + viewModeParam + "' class='editMyCatalogue newTab' data-value='" + id + "' data-template='" + template + "' data-templateTitle='" + templateTitle + "' data-mode='" + editViewAction + "'>" + editViewAction + " record in new tab</a></li>" +
                "<li><a href='#' class='exportMyCatalogue' data-value='" + id + "'  >Export record</a></li>" +
                "<li><a href='#' class='deleteMyCatalogue' data-value='" + id + "'  >Delete record</a></li>" +
                "<li><a href='#' class='toggleRecordStatus' data-value='" + id + "'  >Share record to Fast Cat team</a></li>";


    } else if (type === "templates" || type === "vocabs") {
        keywords = json.doc.keywords;
        sourceLanguage = json.doc.sourceLanguage;
        title = json.doc.title;
        organization = json.doc.organization;
        if (type === "templates") {
            allowedActions = "<li><a href='#' class='createNewTemplate' data-toggle='modal' data-target='#exampleModal' data-value='" + id + "' data-title='" + title + "'>Create new record</li>";
//                    "<li><a href='#' class='createNewTemplate newTab' data-toggle='modal' data-target='#exampleModal' data-value='" + id + "' data-title='" + title + "'>Create new record in tew tab</li>";

        } else {
            allowedActions = "<li><a href='?table=vocabulary&language=" + sourceLanguage + "&template=" + id + "' class='goToVocab'>Go to vocabulary</li>" +
                    "<li><a href='#' class='exportMyVocab' data-id=''  >Export vocabulary</a></li>";
        }

    }
    var actionsMenu = " <div class='btn-group pull-right dropdown'>" +
            "<button type='button' class='btn btn-default dropdown-toggle action' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
            "<span class='glyphicon glyphicon-cog' aria-hidden='true'></span> <span class='caret'></span>" +
            "</button>" +
            "<ul class='dropdown-menu'>" +
            allowedActions +
            "</ul>" +
            "</div>";
    var rowHtml = "";
    if (type === "templates") {
        var actionsCell = "<td>" + actionsMenu + "</td>";
        if (spy === true) {
            actionsCell = "<td/>";//SPY MODE: Hide actions
        }
        rowHtml = "<tr data-template='" + id + "'><td>" + title + "</td><td>" + keywords + "</td><td>" + organization + "</td><td>" + sourceLanguage + "</td>" + actionsCell + "</tr>";
    } else if (type === "vocabs") {
//        var date = "-";
        var vocabs = json.doc.vocabularies;
        var vocabsHtml = "";
//        console.log(vocabs)
        if (typeof vocabs !== "undefined") {

            $.each(vocabs, function () {
                var vocabId = this.id;


                if (typeof vocabsMap[vocabId + "_template"] === "undefined") {
                    vocabsMap[vocabId + "_template"] = title;
                    vocabsMap[vocabId + "_organization"] = organization;
                } else {
                    vocabsMap[vocabId + "_template"] = vocabsMap[vocabId + "_template"] + "<br/>" + title;
                    vocabsMap[vocabId + "_organization"] = vocabsMap[vocabId + "_organization"] + "<br/>" + organization;
                }

                var broader = this.broader;
//                console.log(broader);

                if (typeof broader === "undefined") {
                    broader = "-";
                }

                var vocabLength = "";
                var vocabSpan = "";

//console.log(vocabFiles)
                if (vocabFiles.indexOf(vocabId) !== -1) {
                    if (localStorage.getItem(vocabId) !== null) {
                        vocabLength = JSON.parse(localStorage.getItem(vocabId)).length;
                        if (vocabLength > 0) {
                            vocabSpan = " <span style='display:inline;float:right;' class='badge' title='" + vocabLength + " terms included in this vocabulary'>" + vocabLength + "</span>";
                        } else {//Added to fix part of ship
                            vocabSpan = " <span style='display:inline;float:right;' class='badge' title='... terms included in this vocabulary'>...</span>";

                        }
                    } else {//If team, use ... since we do not have localstorage to get an approximate number of terms
                        if (team === true) {
                            vocabLength = "...";
                            vocabSpan = " <span style='display:inline;float:right;' class='badge' title='" + vocabLength + " terms included in this vocabulary'>" + vocabLength + "</span>";
                        }
                    }



                }


//                console.log(myVocabsDB_local.get(vocabId))
//console.log(vocabId)
//console.log(vocabSpan)
//console.log(sourceLanguage)
                vocabsHtml = "<tr data-id='" + vocabId + "' data-family='" + vocabId.substring(0, vocabId.lastIndexOf("_")) + "'><td>" + this.label + vocabSpan + "</td><td>" + broader + "</td><td>" + sourceLanguage + "</td><td>" + title + "</td><td>" + organization + "</td><td>" + actionsMenu + "</td></tr>";
//                console.log(vocabsHtml)
                rowHtml = rowHtml + vocabsHtml;

            });

            if (vocabs.length === 0) {
                vocabsHtml = "---";
                date = "-";
            }

        } else {
            vocabsHtml = "---";
        }

    } else if (type === "records") {
        var plainIntegerId = id;
        if (id.indexOf("_") !== -1) {
            var idParts = id.split("_");
            if (idParts.length > 1) {
                plainIntegerId = idParts[1];
            }
        }
        if (typeof json.doc.data !== "undefined") {

            var lastModifiedDate = json.doc.data.record_information.date_until;
            var authorName = json.doc.data.record_information.name;
            var authorSurname = json.doc.data.record_information.surname;

            var author = authorName + " " + authorSurname;
            author = createMultipleAuthors(author, authorName, authorSurname); //just checking


            var templateCategories = templates[template + "_keywords"];
            var statusCol;
            if (team === true) {
                statusCol = "<td>Under processing</td>";
            } else if (spy === false) {
                var status = json.doc.status;
                if (typeof status === "undefined" || status === "Private") {
                    status = "Private";
                } else {
                    status = "Shared";
                }
                statusCol = "<td>" + status + "</td>";
            }
//        if (template !== "Logbook" && template !== "Accounts book") {//temp code!
            rowHtml = "<tr id='" + id + "'><td title='" + id + "'>" + id + "</td><td>" + plainIntegerId + "</td><td>" + templateTitle + "</td><td>" + recordTitle + "</td><td>" + author + "</td><td>" + templateCategories + "</td><td>" + lastModifiedDate + "</td>" + statusCol + "<td>" + actionsMenu + "</td></tr>";
//        }
        }
    }
    return rowHtml;
}

function uniq(a) {
    if (typeof a === "undefined") {
        return a;
    }
    var prims = {"boolean": {}, "number": {}, "string": {}}, objs = [];

    return a.filter(function (item) {
        var type = typeof item;
        if (type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
}

function cleanVocabAndEnhanceBadge(db, vocabId) {
    db.get(vocabId).then(function (vocab) {
        var newTerms = {};

        $.each(vocab.terms, function (index) {


            var termJSON = this;

            if (typeof termJSON.usage !== "undefined") {

                var usageRecordIds = Object.keys(termJSON.usage);
                usageRecordIds.forEach(function (usageRecordId) {//check if records still exist

                    if (typeof records === "undefined") {
                        myRecordsDB_local.allDocs({
                            include_docs: false,
                            descending: false
                        }).then(function (result) {
                            records = JSPath.apply(".id", result.rows);
                            if (records.indexOf(usageRecordId) === -1) {
                                delete termJSON.usage[usageRecordId];
                            }
                        });
                    } else {

                        if (records.indexOf(usageRecordId) === -1) {
                            delete termJSON.usage[usageRecordId];
                        }
                    }
                });
                if (getJSONsize(termJSON.usage) > 0) {//delete terms with empty usages
                    var json = {};
                    json[index] = termJSON;
                    newTerms = appendJSONObject(newTerms, json)
                }
            }


        });



        if (!jsonEqual(vocab.terms, newTerms)) {//only update if terms JSON is different than current value! (NEEDS TESTING)
            db.put({
                _id: vocabId,
                _rev: vocab._rev,
                label: vocab.label,
                lastModified: new Date().toJSON(),
                terms: newTerms
            }).then(function (response) {
                // handle response
//                console.log("updating vocab:" + vocabId)

                enhanceRowBadge(db, vocabId)
            }).catch(function (err) {
                console.log(err);
                alert("FastCat: Something went wrong while cleaning vocabulary file to delete removed occurences");
            });
        } else {
            enhanceRowBadge(db, vocabId); //to avoid ...
        }


    });
}


/*
 * Check if a term record usage is visible for the user or not
 * @param {type} recordUsages
 * @returns {Boolean}
 */
function isRecordUsageVisible(recordUsages) {
    var visible = false;
    for (var j = 0; j < recordUsages.length; j++) {
//        console.log(recordUsages[j])
//        console.log(visibleRecords.indexOf(recordUsages[j]))
        if (visibleRecords.indexOf(recordUsages[j]) !== -1) {
            return true;
        }
    }
    return visible;

}



/*
 * Added extra filter to remove obsolete usages
 */
function enhanceRowBadge(db, vocabId) {

    db.get(vocabId).then(function (doc) {
//        


        var termUsages = JSPath.apply('..usage', doc);
        var usedTermsCount = 0;
        for (var j = 0; j < termUsages.length; j++) {
            var recordUsages = Object.keys(termUsages[j]);
            if (recordUsages.length > 0) {//only count used terms
                if (team === false) {
                    usedTermsCount = usedTermsCount + 1;

                } else {
                    if (isRecordUsageVisible(recordUsages)) {//only count visible records
                        usedTermsCount = usedTermsCount + 1;
                    }
                }
            }
        }
//        console.log(vocabId + " has " + usedTermsCount + " used terms");

        //Update values using Datatables, so that it works even on invisible rows
        var row = $('#vocabsTable').DataTable().row("#" + vocabId);
        var isGlobal = false;
        if (!row.any()) {//row does not exist, multilingual vocabs, change id
            vocabId = vocabId.substring(0, vocabId.lastIndexOf("_"));
            if (vocabId === "status") {//merge status and status_capacity_role
                vocabId = "status_capacity_role";
            }
            isGlobal = true;
            row = $('#vocabsTable').DataTable().row("#" + vocabId);
        }

        var rowIndex = row.index();
        var cellValue = row.cell(rowIndex, 0).data();


//        var properTense = "is";
//        if (usedTermsCount > 1) {
//            properTense = "are";
//        }
//        var updatedCellValue = cellValue.replace(/title=".*?">([^<]+)/g, 'title="' + usedTermsCount + ' out of a total of ' + getJSONsize(doc.terms) + ' terms ' + properTense + ' used">' + usedTermsCount);
        var updatedCellValue = cellValue.replace(/title=".*?">([^<]*)/g, 'title="approximately ' + usedTermsCount + ' terms">' + usedTermsCount);



        if (team === true) {//Nasty hack, replacing temp ... with actual number of terms
            updatedCellValue = updatedCellValue.replace(/\.\.\./g, doc.terms.length);

            //FUTURE
            if (isGlobal === true) {
//                console.log(updatedCellValue)
//       

                var $cell = $("<td>" + updatedCellValue + "</td>");
                var count = $cell.find("span").text();
//                console.log("vocab " + vocabId + " has " + count + " terms");
                if (typeof globalVocabs[vocabId] === "undefined") {
                    globalVocabs[vocabId] = count;
                } else {
                    var newSum = (+globalVocabs[vocabId]) + (+count);
                    globalVocabs[vocabId] = newSum;
                }
//                console.log(vocabId)
//                console.log("SO FAR (" + vocabId + ")=" + globalVocabs[vocabId])
            }

        }


        if (team === true) {


            if (isGlobal === true) {
                updatedCellValue = updatedCellValue.replace(/title=".*?">([^<]+)/g, 'title="approximately ' + globalVocabs[vocabId] + ' terms">' + globalVocabs[vocabId]);

                if (globalVocabs[vocabId] === "0") {
                    updatedCellValue = updatedCellValue.replace(/display:\s*inline/g, "display:none");
                } else {
                    updatedCellValue = updatedCellValue.replace(/display:\s*none/g, "display:inline");
                }

            } else {
                if (usedTermsCount === 0) {
                    updatedCellValue = updatedCellValue.replace(/display:\s*inline/g, "display:none");
                }
            }
        }

        row.cell(rowIndex, 0).data(updatedCellValue).draw();
    });
}

function createVocabTable(db, vocabLabel, vocabId) {
//    console.log(vocabLabel)
//    console.log(vocabId)

    if (!(vocabId.endsWith("_gr") || vocabId.endsWith("_it") || vocabId.endsWith("_fr") || vocabId.endsWith("_es") || vocabId.endsWith("_ru") || vocabId.endsWith("_in"))) {//global
//        console.log("GLOBAL")
//        console.log(vocabId.trim())
        db.allDocs({
            include_docs: true,
            startkey: vocabId.trim(),
            endkey: vocabId.trim() + '\uffff'
        }).then(function (response) {
//            console.log(response)
//            console.log(response.rows)
            var termsTable = "";
            $.each(response.rows, function (index) {
//                console.log(this.id)

//                if (this.id.length === vocabId.trim().length + 3) {//extra check to avoid Status and Status_Capacity mixup
                termsTable = termsTable + createTermsHtml(db, vocabLabel, this.id, this.doc);
//                }
            });

            $("#vocabs2Table").children("tbody").html(termsTable);
            createTermOrInstanceDataTable("#vocabs2Table");

        });
    } else {

        db.get(vocabId).then(function (vocab) {

            var termsTable = createTermsHtml(db, vocabLabel, vocabId, vocab);
//            console.log(termsTable);
            $("#vocabs2Table").children("tbody").html(termsTable);
            createTermOrInstanceDataTable("#vocabs2Table");

        }).catch(function (err) {
            // If the previous function threw an error,
            // it will show up here as "err".
            console.log(err);
            createTermOrInstanceDataTable("#vocabs2Table");

        });
    }
}

function createTermsHtml(db, vocabLabel, vocabId, vocab) {
    var tbodyContents = "";
    var termsTemplates = [];
    var termsRecords = [];

    var junkOccsFound = false;

    $.each(vocab.terms, function (index) {
//console.log(index)
        var termJSON = this;
        var usageRecordIds = Object.keys(termJSON.usage);


        usageRecordIds.forEach(function (usageRecordId) {
            if (records.indexOf(usageRecordId) === -1) {
                junkOccsFound = true;
                console.log(usageRecordId + " does not exist!");
                delete termJSON.usage[usageRecordId];
            }
        });


        var term = termJSON.value;
        var dataAttrs = "data-id='" + vocabId + "' data-vocab='" + vocabLabel + "' data-term='" + term.replace(/'/g, "&apos;") + "'";

        var status;
        var vocabRecordsStatus = "Under processing";
        var infoBadge = "";

        if (term.trim().length === 0 || term === "&nbsp;" || term === "illegible" || term === "ilegible" || JSON.stringify(termJSON.usage).length < 3 || (team === true && isRecordUsageVisible(Object.keys(termJSON.usage)) === false)) {//no value term or  no usage or only private usages in team
//           console.log(termJSON.usage)
//            console.log(isRecordUsageVisible(Object.keys(termJSON.usage)))
            status = "Not used";//began as usage but evolved into something bigger
        } else {
            status = "Used";

            var occsLength = JSPath.apply(".*.occurences", termJSON.usage).length;


            var style = "";
            if (occsLength > 1) {

//                console.log(occsLength)
                //Following snippet was added to only count visible records position info
                var recordsTable = Object.keys(termJSON.usage);
                var visibleOccsLength = 0;
                for (var i = 0; i < recordsTable.length; i++) {
                    var use = recordsTable[i];
                    if (visibleRecords.indexOf(use) !== -1) {
//                        console.log(termJSON.usage[use].occurences.length)
                        visibleOccsLength = visibleOccsLength + termJSON.usage[use].occurences.length;
                    }
                }
//                console.log(visibleOccsLength)
                if (visibleOccsLength < occsLength) {
                    occsLength = visibleOccsLength;
                }

                if (visibleOccsLength === 0) {
                    style = "style='display:none;'";
                } else {
                    if (occsLength > 1) {
                        style = "style='color:#682A17;'";
                    }
                }
            }
            infoBadge = " <a " + style + " href='#' class='term glyphicon glyphicon-info-sign' data-toggle='modal' data-target='#termModal' " + dataAttrs + " ><span class='hidden'>" + style + "</span></a>";
//            console.log(termJSON)
            var titles = [];
            var templates = [];
//            var titles = JSPath.apply(".*.title", termJSON.usage);
//            var templates = JSPath.apply(".*.template", termJSON.usage);
            var keys = Object.keys(termJSON.usage);

            $.each(keys, function (index) {
                var recordId = keys[index];
                var recordTemplate = termJSON.usage[recordId].template;
                var recordTitle = termJSON.usage[recordId].title;
                templates.push(recordTemplate);

                var enhancedTitle = recordTitle + " #" + recordId.substring(recordId.lastIndexOf("_") + 1);
                titles.push(enhancedTitle)

//                titles.push(recordTitle)

//                console.log(recordId)
//                console.log(recordTemplate)
//                console.log(recordTitle)


                if (team === true) {
                    if (visibleRecords.indexOf(recordId) !== -1) {//show only visible
                        if (termsTemplates.indexOf(recordTemplate) === -1) {
                            termsTemplates.push(recordTemplate);
                        }
                        if (termsRecords.indexOf(enhancedTitle) === -1) {
                            termsRecords.push(enhancedTitle);
                        }
                    }
                } else {
                    if (termsTemplates.indexOf(recordTemplate) === -1) {
                        termsTemplates.push(recordTemplate);
                    }
                    if (termsRecords.indexOf(enhancedTitle) === -1) {
                        termsRecords.push(enhancedTitle);
                    }
                }


            });




//            $.each(uniq(templates), function(index) {
//                if (team === true) {
//                    if (visibleRecords.indexOf(keys[index]) !== -1) {//show only visible
//                        if (termsTemplates.indexOf(this.toString()) === -1) {
//                            termsTemplates.push(this.toString());
//                        }
//                    }
//                } else {
//                    if (termsTemplates.indexOf(this.toString()) === -1) {
//                        termsTemplates.push(this.toString());
//                    }
//                }
//            });
//
//
//
//            $.each(uniq(titles), function(index) {
//                if (team === true) {
//                    if (visibleRecords.indexOf(keys[index]) !== -1) {//show only visible
//                        if (termsRecords.indexOf(this.toString()) === -1) {
//                            termsRecords.push(this.toString());
//                        }
//                    }
//                } else {
//                    if (termsRecords.indexOf(this.toString()) === -1) {
//                        termsRecords.push(this.toString());
//                    }
//                }
//            });


            if (team === true) {
                $.each(keys, function (index) {
                    var status = recordsStatus[this.toString()];
                    if (typeof status !== "undefined" && status !== "Under processing") {
                        vocabRecordsStatus = status;
                    }
                });
            }


        }

        var row = "";
        if (typeof titles !== "undefined" && status === "Used") {//Not sure if titles is the right thing to check
            var extraCols = "";
            if (team === true) {
                //            allowedActions = "<li><a href='#' class='createNewTemplate' data-toggle='modal' data-target='#exampleModal' data-value='" + id + "' data-title='" + title + "'>Create new record</li>";

                var allowedActions = "<li><a href='#' class='editTerm' data-toggle='modal' data-target='#editTermModal' " + dataAttrs + ">Edit term</a></li>";
                var actionsMenu = " <div class='btn-group pull-right dropdown'>" +
                        "<button type='button' class='btn btn-default dropdown-toggle action' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
                        "<span class='glyphicon glyphicon-cog' aria-hidden='true'></span> <span class='caret'></span>" +
                        "</button>" +
                        "<ul class='dropdown-menu'>" +
                        allowedActions +
                        "</ul>" +
                        "</div>";
                extraCols = "<td>" + defineUndefined(termJSON.preferred) + "</td>" +
                        "<td>" + defineUndefined(termJSON.broader) + "</td>" +
//                            "<td>" + defineUndefined(termJSON.thesaurus) + "</td>" +
                        "<td>" + vocabRecordsStatus + "</td>" +
                        "<td>" + actionsMenu + "</td>";
            }
            row = "<tr id='" + term + "'><td>" + infoBadge + "</td><td>" + term + "</td><td>" + uniq(templates) + "</td><td>" + titles + "</td>" + extraCols + "</tr>";
        }
        tbodyContents = tbodyContents + row;
    });


    //Check combo length to detect if it is a global vocab (length>1)
    if ($("#templateTypeCombo").find("option").length > 1) {
        var values = $("#templateTypeCombo>option").not(':first').map(function () {
            return $(this).val();
        }).get();
        var joined = termsTemplates.concat(values);
        joined = uniq(joined);

        $("#templateTypeCombo>option").not(':first').remove();
        joined.sort();
        joined.forEach(function (termTemplate) {
            $("#templateTypeCombo").append("<option>" + termTemplate + "</option>");
        });
    } else {
        termsTemplates.sort();
        termsTemplates.forEach(function (termTemplate) {
            $("#templateTypeCombo").append("<option>" + termTemplate + "</option>");
        });
    }
    if (junkOccsFound === true) {//Found occs in deleted records, so we should delete them
        db.put({
            _id: vocabId,
            _rev: vocab._rev,
            label: vocab.label,
            lastModified: new Date().toJSON(),
            terms: vocab.terms
        }).then(function (response) {
            // handle response
//                console.log(response)
        }).catch(function (err) {
            console.log(err);
            alert("FastCat: Something went wrong while updating vocabulary file to delete removed occurences");
        });

    }

    //Check combo length to detect if it is a global vocab (length>1)

//    console.log(termsRecords)
    if ($("#recordCombo").find("option").length > 1) {
        var values = $("#recordCombo>option").not(':first').map(function () {
            return $(this).val();
        }).get();
        var joined = termsRecords.concat(values);
        joined = uniq(joined);

        $("#recordCombo>option").not(':first').remove();
        joined.sort();
        joined.forEach(function (termRecord) {
            $("#recordCombo").append("<option>" + termRecord + "</option>");
        });
    } else {
        termsRecords.sort();
        termsRecords.forEach(function (termRecord) {
            $("#recordCombo").append("<option>" + termRecord + "</option>");
        });
    }

    return tbodyContents;
//    $("#vocabs2Table").children("tbody").html(tbodyContents);
}

/*
 * Vocabs combos change detected
 */
$("body").on("change", "#templateTypeCombo, #recordCombo, .cleverCombo", function () {
    var mode = "term";
    var $changedSelect = $(this);
    var selectId = $changedSelect.attr("id");
    var templateSelector = "#templateTypeCombo";
    var recordSelector = "#recordCombo";
    var tableSelector = "#vocabs2Table";


    if ($changedSelect.hasClass("cleverCombo")) {
        mode === "instance";
        var type = "";
        if (selectId.indexOf("Template") !== -1) {//Instance template changed
            type = selectId.replace(/TemplateTypeCombo/g, "");
        } else {//instance record changed
            type = selectId.replace(/RecordCombo/g, "");
        }
        templateSelector = "#" + type + "TemplateTypeCombo";
        recordSelector = "#" + type + "RecordCombo";
        tableSelector = "#" + type + "Table";
    }

    if (selectId === "templateTypeCombo") {
        $("#recordCombo").val("All");
    } else if (selectId !== "recordCombo") {//instanceTemplates
        $changedSelect.next("select").val("All");
    }


    var selectedTemplate = $(templateSelector).val();
    var selectedRecord = $(recordSelector).val();


    if (selectedTemplate === "All") {
        selectedTemplate = "";
        $(recordSelector).find("option").show();
    } else {//If a template is selected, show only this template records and All
        $(recordSelector).find("option").each(function () {
            var $option = $(this);
            if ($option.html() === "All" || $option.html().startsWith(selectedTemplate + ",")) {
                $option.show();
            } else {
                $option.hide();
            }
        });

    }
    if (selectedRecord === "All") {
        selectedRecord = "";
    }


    if (tableSelector === "#organizationsTable" || tableSelector === "#personsTable" || tableSelector === "#shipsTable") {//have one extra col due to checkboxes
        combineTemplateAndRecordSearch($(tableSelector).DataTable(), 3, 4, selectedTemplate, selectedRecord)
    } else {
        combineTemplateAndRecordSearch($(tableSelector).DataTable(), 2, 3, selectedTemplate, selectedRecord)
    }
});

function combineTemplateAndRecordSearch(table, templatesCol, recordsCol, template, record) {
//    template = template.replace(/\(/g, "\(");

    var val = $.fn.dataTable.util.escapeRegex(
            template
            );
    var regExSearchTemplate = '(^|,)?\s*' + val + '\s*(,|$)?';
//    var regExSearchTemplate =  val ;

    val = $.fn.dataTable.util.escapeRegex(
            record
            );

    var regExSearchRecord = '(^|,)?\s*' + val + '\s*(,|$)?';
//    var regExSearchRecord = val;
//console.log(templatesCol)
//console.log(regExSearchTemplate)
//console.log(recordsCol)
//console.log(regExSearchRecord)



    if (template === "" && record === "") {
//        console.log("1")
        table.columns(templatesCol).search("").columns(recordsCol).search("").draw();
    } else if (template !== "" && record === "") {
//                console.log("2")

        table.columns(templatesCol).search(regExSearchTemplate, true, true).columns(recordsCol).search("").draw();
    } else if (template === "" && record !== "") {//true,true again, not sure about side effects
//                console.log("3")

        table.columns(templatesCol).search("").columns(recordsCol).search(regExSearchRecord, true, true).draw();
    } else if (template !== "" && record !== "") {//true,true again, not sure about side effects
//                console.log("4")

        table.columns(templatesCol).search(regExSearchTemplate, true, true).columns(recordsCol).search(regExSearchRecord, true, true).draw();
    }

}

/*
 * Open instance modal
 */
$("body").on("click", ".instance", function () {
//    var db = instancesDB;
//    $(this).css("color", "#682A17");

    var id = $(this).attr("data-id");

//    var instance = $(this).attr("data-name");
    var type = $(this).attr("data-type");
//    console.log(id)
//    console.log(id.replace(/'/g, "\""))

    //Going from single word instance to all-values separated by /
    var instanceJSON = JSON.parse(id.replace(/'/g, "\""));
    delete instanceJSON.template;
    var instanceAsString = Object.values(instanceJSON).join("/").replace(/\/+/g, "/").replace(/^\//g, "").replace(/\/$/g, "");//removing / in the beginning, at the end or make multiple single



    $(".modal-title").html("Instance: " + instanceAsString + " (Type: " + type + ")");
//    var selectedTemplate = $("#" + type + "TemplateTypeCombo option:selected").text();
//    var selectedRecord = $("#" + type + "RecordCombo option:selected").text();


//    createTermOrInstanceModalTable(db, type, id, selectedTemplate, selectedRecord);
    createInstanceModalTable(type, id);



});

/*
 * Creates term or instance modal HTML table
 * @param {type} db
 * @param {type} dbFile
 * @param {type} term
 * @param {type} selectedTemplate
 * @param {type} selectedRecord
 * @returns {undefined}
 */

//function createTermOrInstanceModalTable(db, dbFile, term, selectedTemplate, selectedRecord) {
//    var occsRows = "";
//    var start = new Date();
//    console.log(term)
//  
//
//
////db.query(function (doc, emit) {
////  emit(doc.name);
////}, {key: 'foo'}).then(function (result) {
////  // found docs with name === 'foo'
////  console.log(result)
////}).catch(function (err) {
////  // handle any errors
////  console.log(err)
////});
//console.log('instances["'+term.toLowerCase()+'"]')
//    db.find({
//        selector: {
//            "_id": dbFile,
////            "value": term
//           "instances[\"'+term.toLowerCase()+'\"]": {"$eq": [term.toLowerCase()]}
//
//        },
//        fields: ['_id', 'instances'],
//        limit: 1
//    }).then(function(result) {
//        console.log(result)
//    });
//
//    db.get(dbFile).then(function(vocab) {
//        console.log(vocab)
//    });
//}

/*
 * Creates term or instance modal HTML table
 * @param {type} db
 * @param {type} dbFile
 * @param {type} term
 * @param {type} selectedTemplate
 * @param {type} selectedRecord
 * @returns {undefined}
 */

function createInstanceModalTable(file, term) {
    var occsRows = "";

    var termJSON = JSON.parse(term.replace(/'/g, "\""));
    var firstLetter = getInstanceFirstLetterPerType(file, termJSON);

    //WAS
    // vocab = instanceFiles[file];
    //IS
    vocab = instanceFiles[file + "_" + firstLetter];

    term = term.replace(/\\n/g, "\\\\n"); //to avoid bugs with \n
    //Replaced JSPath with simple json traverse because it was too slow (might have side effects?)
    var usage = vocab.instances[term.toLowerCase()].usage;


    var termOrInstance = "instance";
    $.each(usage, function (index) {


        var recordId = index;
        var templateTitle = this.template;
        var recordTitle = this.title;


        var templateHtml = getKeyByValue(templates, templateTitle);

        if (typeof templateHtml !== "undefined") {
            templateHtml = templateHtml.substring(0, templateHtml.lastIndexOf("_")); //Much better!

        } else {//Something is wrong...
            templateHtml = templateTitle;
        }


        var recordLink = "templates/" + templateHtml + ".html?name=" + recordId + "&templateTitle=" + templateTitle;
        if (team === true) {
            recordLink = recordLink + "&mode=teamView";
        }
        var occs = this.occurences;

        $.each(occs, function () {
            var hidden = false;

            var rowNumber = this.row;
            var colNumber = "";

            var fieldTitleCol = "";
            var table = this.table;
            if (typeof this.col !== "undefined") {
                termOrInstance = "term";
                colNumber = (+this.col) + 1;
                colNumber = "(" + colNumber + ")";
                fieldTitleCol = "<td>" + defineUndefined(this['fieldTitle']) + colNumber + "</td>";
            } else {

                var diff = vocab.instances[term.toLowerCase()].diff;
                if (typeof diff !== "undefined") {

                    if (diff.indexOf(JSON.stringify(this).replace(/"/g, "'")) !== -1) {
                        hidden = true;
                    }
                }

                if (typeof this.table !== "undefined") {
                    //Code to fix table numbering issue starting from 0 in instances

                    var tableName = this.table.substring(0, this.table.lastIndexOf("_"));
                    var tableIndex = this.table.substring(this.table.lastIndexOf("_") + 1);

                    tableIndex = (+tableIndex) + 1;
                    if (!isNaN(tableIndex)) {
                        tableName = tableName + "_" + tableIndex;
                        table = tableName;
                    }
                }
            }

            var rowHtml = "";

            //Used to filter position info. Not any more...
            if (visibleRecords.indexOf(recordId) !== -1) {//Show position info only if visible
                rowHtml = "<tr><td>" + templateTitle + "</td><td>" + recordTitle + "</td><td>" + table + "</td>" + fieldTitleCol + "<td>" + rowNumber + "</td><td><a target='_blank' href='" + recordLink + "'>Link</a></td></tr>";
            } else { //Used only once by invisible record  
                if (getJSONsize(usage) === 1) {
                    rowHtml = "<tr><td colspan='5' class='text-center'>Used in a record that you may not view</td></tr>";
                }
            }

            if (hidden === true) {
                rowHtml = rowHtml.replace(/<tr>/g, '<tr class="hidden">');

            }

            occsRows = occsRows + rowHtml;

        });

    });

    var fieldTitleCol = "<th>Field Title</th>";
    if (termOrInstance === "instance") {
        fieldTitleCol = "";
    }


    if (termOrInstance === "instance") {
        var $table = $("<table>" + occsRows + "</table>");

        if ($table.find("tr:not(.hidden)").length > 1) {
            $table.find("tr").each(function (index) {
                var $row = $(this);
                var link = $row.children("td").last().children("a").attr("href");
                if (typeof link !== "undefined") {
                    var match = link.match(/\?name=[^&]+/g);
                    if (match.length > 0 && file !== "locations") {
                        var recordId = match[0].substring(6)
                        $row.append("<td><button class='diffOcc' data-index='" + index + "' data-type='" + file + "' data-instance=\"" + term + "\" data-recordId='" + recordId + "'>Mark as different</button></td>");
                    }
                }
//                    }                  
            })
        }
        occsRows = $table.children("tbody").html();
    }
//    console.log(fieldTitleCol)
//    console.log(occsRows)
    if (typeof occsRows === "undefined") {
        occsRows = "";
    }



    var secondTable = "<h4 class='text-center ribbon'>Position information</h4><div class='table-responsive'>" +
            "<table class='table table-bordered table-striped table-hover termTable'>" +
            "<thead>" +
            "<tr>" +
            "<th>Template Title</th>" +
            "<th>Record Title</th>" +
            "<th>Table Title</th>" +
            fieldTitleCol +
            "<th>Row Number</th>" +
            "<th>Link to record</th>" +
            " </tr>" +
            "</thead>" +
            "<tbody>" +
            occsRows +
            "</tbody>" +
            "</table>" +
            "</div>";




    $(".modal-body>form.termPopup").html(secondTable);
//    var time = new Date() - start;
//    console.log("Took " + time / 1000 + " secs to create modal!");



}

/*
 * Creates term or instance modal HTML table
 * @param {type} db
 * @param {type} dbFile
 * @param {type} term
 * @param {type} selectedTemplate
 * @param {type} selectedRecord
 * @returns {undefined}
 */

function createTermModalTable(db, dbFile, term, selectedTemplate, selectedRecord) {
    var occsRows = "";
//    var start = new Date();
    db.get(dbFile).then(function (vocab) {
//        console.log(vocab)
        var usageBlock;
        term = term.replace(/\\n/g, "\\\\n"); //to avoid bugs with \n
        if (term.indexOf("'") !== -1) {//to fix terms like Alessandria d'Egitto 
            usageBlock = JSPath.apply('..*{.value==="' + term + '"}.usage', vocab);
        } else {
            usageBlock = JSPath.apply("..*{.value==='" + term + "'}.usage", vocab);

        }
//        console.log(term)
//        console.log(usageBlock.length)
        var usage = usageBlock[0];
        if (usageBlock.length > 1) {//Normally should be only one, if more (probably uppercase leftovers) join all usages
            usage = {};
            usageBlock.forEach(function (index) {
                usage = appendJSONObject(usage, index);
            });
        }

        var termOrInstance = "instance";

        $.each(usage, function (index) {


            var recordId = index;
            var templateTitle = this.template;
            var recordTitle = this.title;


            var templateHtml = getKeyByValue(templates, templateTitle);

            if (typeof templateHtml !== "undefined") {
//                templateHtml = templateHtml.split("_")[0];
                templateHtml = templateHtml.substring(0, templateHtml.lastIndexOf("_")); //Much better!

            } else {//Something is wrong...
                templateHtml = templateTitle;
            }


            var recordLink = "templates/" + templateHtml + ".html?name=" + recordId + "&templateTitle=" + templateTitle;
            if (team === true) {
                recordLink = recordLink + "&mode=teamView";
            }
            var occs = this.occurences;

            $.each(occs, function () {
                var hidden = false;
//                console.log(this)

                var rowNumber = this.row;
                var colNumber = "";

                var fieldTitleCol = "";
                var table = this.table;

                table = table.replace(/(List of.*?)\s*(List of.*)/g, "$1"); //When two List of, keep only the first
                if (typeof this.col !== "undefined") {
                    termOrInstance = "term";
                    colNumber = (+this.col) + 1;
                    colNumber = "(" + colNumber + ")";
                    fieldTitleCol = "<td>" + defineUndefined(this['fieldTitle']) + colNumber + "</td>";
                } else {
//                    console.log(term)
//                    console.log(vocab.instances[term.toLowerCase()].diff)
                    var diff = vocab.instances[term.toLowerCase()].diff;
                    if (typeof diff !== "undefined") {

                        if (diff.indexOf(JSON.stringify(this).replace(/"/g, "'")) !== -1) {
                            hidden = true;
                        }
                    }

                    if (typeof this.table !== "undefined") {
                        //Code to fix table numbering issue starting from 0 in instances

                        var tableName = this.table.substring(0, this.table.lastIndexOf("_"));
                        var tableIndex = this.table.substring(this.table.lastIndexOf("_") + 1);
//                        console.log(tableName)
//                        console.log(tableIndex)

                        tableIndex = (+tableIndex) + 1;
                        if (!isNaN(tableIndex)) {
//                            console.log(tableIndex)
                            tableName = tableName + "_" + tableIndex;
                            table = tableName;
                        }
                    }
                }

//                if (team === false) {
//                    fieldTitleCol = "<td>" + defineUndefined(this['fieldTitle']) + colNumber + "</td>";
//                }

                var rowHtml = "";

                //Used to filter position info. Not any more...
//                console.log(recordTitle)
//                console.log(visibleRecords.indexOf(recordId))
                if (visibleRecords.indexOf(recordId) !== -1) {//Show position info only if visible
                    rowHtml = "<tr><td>" + templateTitle + "</td><td>" + recordTitle + "</td><td>" + table + "</td>" + fieldTitleCol + "<td>" + rowNumber + "</td><td><a target='_blank' href='" + recordLink + "'>Link</a></td></tr>";
                }
//                //   Following snippet was used to filter position info, if filters where applied
//                if (selectedTemplate === "All" && selectedRecord === "All") {
//                    rowHtml = "<tr><td>" + templateTitle + "</td><td>" + recordTitle + "</td><td>" + table + "</td>" + fieldTitleCol + "<td>" + rowNumber + "</td><td><a target='_blank' href='" + recordLink + "'>Link</a></td></tr>";
//                } else {
//                    if (selectedTemplate === "All" && selectedRecord !== "All") {
//                        if (selectedRecord === recordTitle) {
//                            rowHtml = "<tr><td>" + templateTitle + "</td><td>" + recordTitle + "</td><td>" + table + "</td>" + fieldTitleCol + "<td>" + rowNumber + "</td><td><a target='_blank' href='" + recordLink + "'>Link</a></td></tr>";
//                        }
//                    }
//                    if (selectedTemplate !== "All" && selectedRecord === "All") {
//                        if (selectedTemplate === templateTitle) {
//                            rowHtml = "<tr><td>" + templateTitle + "</td><td>" + recordTitle + "</td><td>" + table + "</td>" + fieldTitleCol + "<td>" + rowNumber + "</td><td><a target='_blank' href='" + recordLink + "'>Link</a></td></tr>";
//                        }
//                    }
//                    if (selectedTemplate !== "All" && selectedRecord !== "All") {
////                        console.log(selectedRecord+"---"+recordTitle)
//                        if (selectedTemplate === templateTitle && selectedRecord === recordTitle) {
//                            rowHtml = "<tr><td>" + templateTitle + "</td><td>" + recordTitle + "</td><td>" + table + "</td>" + fieldTitleCol + "<td>" + rowNumber + "</td><td><a target='_blank' href='" + recordLink + "'>Link</a></td></tr>";
//                        }
//                    }
//                }
//                console.log(rowHtml)
                if (hidden === true) {
                    rowHtml = rowHtml.replace(/<tr>/g, '<tr class="hidden">');

                }

                occsRows = occsRows + rowHtml;

            });

        });

        var fieldTitleCol = "<th>Field Title</th>";
//        if (team === true) {//No point in showing field title
        if (termOrInstance === "instance") {
            fieldTitleCol = "";
        }


        if (termOrInstance === "instance") {
            var $table = $("<table>" + occsRows + "</table>");
//            console.log($table.find("tr").length)
//            console.log($table.find("tr:not(.hidden)").length)
            if ($table.find("tr:not(.hidden)").length > 1) {
                $table.find("tr").each(function (index) {
                    var $row = $(this);
//                    if (index === 0) {
//                        $row.append("<th/>");
//                    } else {
                    var link = $row.children("td").last().children("a").attr("href");
//                    console.log(link)
                    var match = link.match(/\?name=[^&]+/g);
//                    console.log(match)
                    if (match.length > 0 && dbFile !== "locations") {
                        var recordId = match[0].substring(6)
                        $row.append("<td><button class='diffOcc' data-index='" + index + "' data-type='" + dbFile + "' data-instance=\"" + term + "\" data-recordId='" + recordId + "'>Mark as different</button></td>");
                    }
//                    }                  
                })
            }
            occsRows = $table.children("tbody").html();
        }



        var secondTable = "<h4 class='text-center ribbon'>Position information</h4><div class='table-responsive'>" +
                "<table class='table table-bordered table-striped table-hover termTable'>" +
                "<thead>" +
                "<tr>" +
                "<th>Template Title</th>" +
                "<th>Record Title</th>" +
                "<th>Table Title</th>" +
                fieldTitleCol +
                "<th>Row Number</th>" +
                "<th>Link to record</th>" +
                " </tr>" +
                "</thead>" +
                "<tbody>" +
//                "<tr>" +
                occsRows +
//                "</tr>" +
                "</tbody>" +
                "</table>" +
                "</div>";




        $(".modal-body>form.termPopup").html(secondTable);
//        var time = new Date() - start;
//        console.log("Took " + time / 1000 + " secs to create modal!");

    });

}
function defineUndefined(value) {

    if (typeof value === "undefined") {
        value = "";
    } else if (typeof value === "string") {
        value = value.trim();
    }
    return value;
}

/*
 * Open term modal
 */
$("body").on("click", ".term", function () {

    var db = myVocabsDB_local;
    if (team === true) {
        db = publicVocabsDB_remote;
//        $(this).css("color", "#682A17");
    }

    var vocabId = $(this).attr("data-id");
    var vocab = $(this).attr("data-vocab");
    var term = $(this).attr("data-term");


    var selectedTemplate = $("#templateTypeCombo option:selected").text();
    var selectedRecord = $("#recordCombo option:selected").text();



    $(".modal-title").html("Term name: " + term + " (Vocabulary: " + vocab + ")");
    createTermModalTable(db, vocabId, term, selectedTemplate, selectedRecord);


});
function mergeMultilingualVocabs($vocabRows) {
    var vocabBroaders = "";
    var vocabLangs = "";
    var vocabTemplates = "";
    var vocabOrgs = "";
    var vocabTerms = "";
//    console.log($vocabRows.first().find('td:eq(0)').html())
    var vocabId = $vocabRows.first().attr("data-family");
    var firstCol = $vocabRows.first().find('td:eq(0)');



//    var terms = firstCol.find("span").text();
//    console.log(terms)
    firstCol.find("span").remove();

//                            var vocabLabel, vocabBroaders, vocabTemplates, vocabOrgs = "";

    $.each($vocabRows, function () {
        var $row = $(this);

        var terms = $row.find("span").text();
        vocabTerms = vocabTerms + terms;
        var broader = $row.find('td:eq(1)').html();
        vocabBroaders = mergeCells(vocabBroaders, broader);
        var language = $row.find('td:eq(2)').html();
//        console.log("************")
//        console.log(vocabLangs)

        vocabLangs = mergeCells(vocabLangs, language);
//        console.log(vocabLangs)
//        console.log("************")

        var templates = $row.find('td:eq(3)').html();
        vocabTemplates = mergeCells(vocabTemplates, templates);
        var orgs = $row.find('td:eq(4)').html();
        vocabOrgs = mergeCells(vocabOrgs, orgs);


    });

    var vocabLabel = firstCol.text();
    if (vocabLabel.trim() === "Status") {//Merging Status and Status|Capacity|Role
        vocabLabel = "Profession|Status";
        vocabBroaders = "";
        var uniqLangs = uniq(vocabLangs.split(/<br\/?>/));
        vocabLangs = uniqLangs.join("<br/>");
        var vocabTemplatesTable = vocabTemplates.split(/<br\/?>/);
        var vocabOrgsTable = vocabOrgs.split(/<br\/?>/);
//vocabOrgsTable = uniq(vocabOrgsTable)
        vocabTemplates = "";
        vocabOrgs = "";
        for (var i = 0; i < vocabTemplatesTable.length; i++) {

            if (vocabTemplates.indexOf(vocabTemplatesTable[i] + "<br/>") === -1) {
                vocabTemplates = vocabTemplates + vocabTemplatesTable[i] + "<br/>";
                vocabOrgs = vocabOrgs + vocabOrgsTable[i] + "<br/>";
            }
        }
//console.log(vocabTerms)


    }


    var vocabSpan = " <span style='display:inline;float:right;' class='badge' title='" + vocabTerms + " terms included in this vocabulary'>" + vocabTerms + "</span>";

    var extraArgs = "&vocabLabel=" + vocabLabel + "&vocabBroader=" + vocabBroaders + "&vocabOrgs=" + vocabOrgs;
//    var allowedActions = "<li><a href='?table=vocabulary&language=" + vocabLangs + "&template=" + vocabTemplates + "' class='goToVocab'>Go to vocabulary</li>" +
    var allowedActions = "<li><a href='?table=vocabulary&language=" + vocabLangs + "&vocabId=" + vocabId + extraArgs + "' class='goToVocab'>Go to vocabulary</li>" +
            "<li><a href='#' class='exportMyVocab' data-id='" + vocabId + "'  >Export vocabulary</a></li>";

    var actionsMenu = " <div class='btn-group pull-right dropdown'>" +
            "<button type='button' class='btn btn-default dropdown-toggle action' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
            "<span class='glyphicon glyphicon-cog' aria-hidden='true'></span> <span class='caret'></span>" +
            "</button>" +
            "<ul class='dropdown-menu'>" +
            allowedActions +
            "</ul>" +
            "</div>";

//    if (vocabLangs.indexOf(",") !== -1) {
//        vocabLangs = fixInternational(vocabLangs);
//        vocabOrgs = fixInternational(vocabOrgs);
//    }
    var html = "<tr data-id='" + vocabId + "'><td>" + vocabLabel + vocabSpan + "</td><td>" + vocabBroaders + "</td><td>" + vocabLangs + "</td><td>" + vocabTemplates + "</td><td>" + vocabOrgs + "</td><td>" + actionsMenu + "</td></tr>";
    return html;

}



function mergeCells(valueSoFar, newValue) {
    if (valueSoFar !== "") {
//        if (valueSoFar.indexOf(",") !== -1) {
//            var values = valueSoFar.split(/,\s*/);
//            valueSoFar = values.join("<br/>");
//        }
        valueSoFar = valueSoFar + "<br/>" + newValue;

    } else {
        valueSoFar = newValue;
    }
    return valueSoFar;
}
function dump(db, name) {
    var stream = new window.memorystream();
    var dumpedString = "";
    stream.on("data", function (chunk) {
        dumpedString += chunk.toString();
    });

    db.dump(stream).then(function () {
//        console.log('Yay, I have a dumpedString: ' + dumpedString);
        var file = new File([dumpedString], name + "backup(" + new Date().toJSON() + ").json", {type: "text/json;charset=utf-8"});
        saveAs(file);
    }).catch(function (err) {
        console.log('oh no an error', err);
    });
}
function bulkUpdateInstances(remoteDB, allDocsResult, type, instances) {

    var instancesPerLetter = splitInstancesPerLetter(type, instances);
    var docs = [];
    $.each(allDocsResult.rows, function () {
        if (this.error) {
            var fileJSON = {
                "_id": this.key,
                "lastModified": new Date().toJSON(),
                "instances": instancesPerLetter[this.key]
            };
            this.doc = fileJSON;
        } else {
            this.doc.instances = instancesPerLetter[this.id];
            this.doc.lastModified = new Date().toJSON();
        }
        docs.push(this.doc);
    });
//console.log(docs)
    remoteDB.bulkDocs(docs).then(function (result) {
// handle response
        var table = $("#" + type + "Table").DataTable();
        table.destroy();
        createInstancesTableFromDocs(type);
    }).catch(function (err) {
        console.log(err);
    });
}
