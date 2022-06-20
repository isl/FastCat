/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var myRecordsColumnIndex = 4; //8 for organization, 4 for author
var recordsStatus;
var visibleRecords;
var currentInstanceTableId = "";
var currentInstances_selected;
var instanceRecords;
var locationUncertaintyMessage = "The historian who did the transcription is not sure that this location was meant in the source";
var locationUncertaintyTitleAttr = "title='" + locationUncertaintyMessage + "'";
var tabId;

//Variable to store instance file so that I don't have to get it from DB constantly
var instanceFiles = [];
var preferredLocationNames;


$(document).ready(function () {

    var url_string = window.location.href;
    var url = new URL(url_string);


    getUser();
    if (url.protocol !== "http:" && url.host.indexOf("isl.ics.forth.gr") === -1) {
        if (window.confirm('FastCat: Warning, you are not using the official FastCat team! Click OK to go there or Cancel to stay here.')) {
            console.log(fastCatTeamUrl)
            window.location.href = fastCatTeamUrl;
        }
    }
    myRecordsDB_local = publicRecordsDB_remote; //hmmm not sure about the side effects
    myVocabsDB_local = publicVocabsDB_remote;//hmmm not sure about the side effects


    Messenger.options = {extraClasses: 'messenger-fixed messenger-on-top  fastCatMessenger', theme: 'air', 'maxMessages': 5};
    loadingMessage = messenger("Loading", 600);

    var db = " Official";
    if (dbSuffix === "2_1") {
        db = " Official(Old)";
    } else if (dbSuffix !== "") {
        db = " Dev(" + dbSuffix + ")";
    }
    $("#version").html(version + " --- Database:" + db);

    //Visual changes

    $("#importRecordsButton").hide();

    adminDB.get("status").then(function (doc) {
        recordsStatus = doc.records;
        var appStatus = doc.appStatus;
        if (typeof appStatus !== "undefined") {
            if (appStatus !== "normal" && userJSON.level !== "god") {
                window.location.href = url_string + "/../" + appStatus + ".html";
            }
        }

        templatesDB_remote.allDocs({
            include_docs: true,
            descending: false
        }).then(function (result) {


            $.each(result.rows, function () {
                if (this.id.indexOf("_design") === -1) {
                    templates[this.id + "_title"] = this.doc.title;
                    templates[this.id + "_keywords"] = this.doc.keywords;
                    templates[this.id + "_organization"] = this.doc.organization;
                }
            });

            publicRecordsDB_remote.find({
                selector: {
                    _id: {$gte: null}
                },
                fields: ['_id', 'template', 'status', 'data.source_identity', 'data.record_information', 'data.ship_records'],
                limit: 10000
            }).then(function (result) {


                var recordsRows = createRecordsTableFromDocs(result);
                $("#recordsTable").children("tbody").html(recordsRows);
                //Following actions are for admin only

                if (userJSON.level === "user") {
                    $("#exportRecordsButton").hide();
                    $("#deleteRecordsButton").hide();
                    $("#settingsLink").hide();
                } else {
                    $("#exportRecordsButton").show();
                    $("#deleteRecordsButton").show();
                    if (userJSON.level !== "god") {
                        $("#settingsLink").hide();
                    }
                }

                createDataTable("recordsTable");

                loadingMessage.hide();

            });
        });
    });
    //initializations
    var url_string = window.location.href;
    var url = new URL(url_string);
    var table = url.searchParams.get("table");
    var page = url.searchParams.get("page");



    if (table === "vocabularies") {
        $(".content-header>h1").html("VOCABULARIES");
        $(".content>.box").hide();
        $(".vocabsBox").show();
        $(".searchBox>input").attr("id", "vocabsSearchBox");

        publicVocabsDB_remote.allDocs({
            include_docs: false,
            descending: false
        }).then(function (result) {

            vocabFiles = JSPath.apply(".id", result.rows);
            createTableFromDocs(templatesDB_remote, "vocabs");
        });
    } else if (table === "vocabulary") {
        var vocabLabel = url.searchParams.get("vocabLabel");
        $(".content-header>h1").html("<a href='#' onclick='vocabsClick();'>VOCABULARIES</a> > " + vocabLabel);

        //        $(".content-header>h1").html("<a href='team.html?table=vocabularies'>VOCABULARIES</a> > " + vocabLabel);
        $(".content>.box").hide();
        $(".vocabs2Box").show();
        $("#recordsSearchBox").parent().css("visibility", "hidden");


        var vocabBroader = url.searchParams.get("vocabBroader");
        var vocabOrgs = url.searchParams.get("vocabOrgs");
        var language = url.searchParams.get("language");

        if (vocabOrgs !== null) {
            vocabOrgs = vocabOrgs.replace(/<br\/?>/mg, "-");
        }
        if (vocabBroader !== null) {
            vocabBroader = vocabBroader.replace(/<br\/?>/mg, " ");
        }
        if (language !== null) {
            language = language.replace(/<br\/?>/mg, "-");
        }

//Hiding vocabInfo
//        $(".vocabInfo").html("<p class='vocabInfo'>Broader Vocabulary category: " + vocabBroader + ", Related Organizations: " + vocabOrgs + ", Source Language: " + language + "<hr class='vocabInfo'/></p>")

        var vocabId = url.searchParams.get("vocabId");

        publicRecordsDB_remote.find({
            selector: {
                _id: {$gte: null}
            },
            fields: ['_id', 'template', 'status', 'data.source_identity', 'data.record_information', 'data.ship_records'],
            limit: 10000
        }).then(function (result) {

            var recordIds = [];
            var visibleRecordIds = [];
            var userLevel = userJSON.level;

            $.each(result.docs, function () {
                recordIds.push(this._id);
                if ((typeof this.status === "undefined" || this.status === "Private") && userLevel !== "god") {//DO NOT SHOW!!!!

                } else {
                    visibleRecordIds.push(this._id);
                }
            });
            records = recordIds;
            visibleRecords = visibleRecordIds;

            createVocabTable(publicVocabsDB_remote, vocabLabel, vocabId);

        });

    } else if (table === "locations" || table === "organizations" || table === "ships" || table === "persons" || page === "downloads" || page === "settings") {

        publicRecordsDB_remote.find({
            selector: {
                _id: {$gte: null}
            },
            fields: ['_id', 'template', 'status', 'data.source_identity', 'data.record_information', 'data.ship_records'],
            limit: 10000
        }).then(function (result) {

            var recordIds = [];
            var visibleRecordIds = [];
            if (typeof userJSON === "undefined") {
                getUser();
            }
            var userLevel = userJSON.level;

            $.each(result.docs, function () {
                recordIds.push(this._id);
                if ((typeof this.status === "undefined" || this.status === "Private") && userLevel !== "god") {//DO NOT SHOW!!!!

                } else {
                    visibleRecordIds.push(this._id);
                }
            });
            records = recordIds;
            visibleRecords = visibleRecordIds;

            if (table !== null) {
                route(table + "Link");
            } else if (page !== null) {
                route(page + "Link");
            }

        });

    }

    reactToChanges(publicRecordsDB_remote); //we'll see...
    detectStatusChanges();

});

/*
 * Triggers vocab click
 */
function vocabsClick() {
    $("#vocabsLink").trigger("click");
}


/*
 * Detects status changes
 */
function detectStatusChanges() {
    adminDB.changes({live: true, since: 'now', include_docs: true}).on('change', function (change) {
        if (change.deleted) {
            // change.id holds the deleted id
            console.log("DELETING:" + change.id);
//      onDeleted(change.id);
        } else { // updated/inserted
            // change.doc holds the new doc
            var doc = change.doc;
            compareJSONObjsAndHighlightChanges(recordsStatus, doc.records);
            recordsStatus = doc.records;
        }
    }).on('error', console.log.bind(console));
}
/*
 * Removes template from location keys and merges multiple same location appearances (Will become obsolete in the future with version 2.3)
 * @param {type} instances
 * @returns {@this;}
 */
//function removeTemplateFromLocations(instances) {
//    var changed = false;
//    $.each(instances, function (key) {
//        if (key.indexOf("'template':") !== -1) {//contamination detected, must heal Locations!
//            changed = true;
//            var newKey = key.replace(/,'template':'.*?'/g, "");
//            var newValue = this.value.replace(/,'template':'.*?'/g, "");
//            this.value = newValue;
//            if (typeof instances[newKey] !== "undefined") {//already exists, must simply add usages               
//                instances[newKey].usage = appendJSONObject(instances[newKey].usage, instances[key].usage);
//            } else {
//                instances[newKey] = this;
//            }
//            delete instances[key];
//        }
//    });
//
//    if (changed === true) {
//        instancesDB.get("locations").then(function (doc) {
//            instancesDB.put({
//                _id: "locations",
//                _rev: doc._rev,
//                label: "locations",
//                lastModified: new Date().toJSON(),
//                instances: instances
//            }).then(function (response) {
//                // handle response
//
//            }).catch(function (err) {
//                console.log(err);
//            });
//        }).catch(function (err) {
//            console.log(err);
//            console.log(("So now we get this error when we try to get() it: " + JSON.stringify(err)));
//            alert("FastCat: Unexpected error when trying to get locations! Contact support with following error message:" + JSON.stringify(err));
//        });
//    }
//    return instances;
//
//}

function createInstancesJSONForDataTables(instances, type) {
    var allRowsJSON = [];
    var instancesPerLetter = [];

    var count = 0;
    $.each(instances, function (key) {

        var jsonRow = [];
        if (typeof this.sameAs !== "undefined") {//sameAs block
            var sameAsBlockRowsJSON = [];
            if (JSON.stringify(this.sameAs).length > 3) {
                $.each(this.sameAs, function (index) {
                    if (typeof instances[this] !== "undefined") {
                        if (typeof instances[this].replacedBy !== "undefined") {//Must have replacedBy (I think)
                            if (instances[this].replacedBy === key) {//Cross checking reference
                                jsonRow = createInstanceTableRow(instances[this], type);
                            }
                            sameAsBlockRowsJSON.push(jsonRow);
                        }
                    }
                });

                jsonRow = createInstanceTableRow(this, type);
                var singleSameAsRowJSON = [];
                if (sameAsBlockRowsJSON.length > 0 && sameAsBlockRowsJSON.toString().indexOf("a data-garbage=''") === -1) {//Nasty solution...
                    sameAsBlockRowsJSON.push(jsonRow);
                    singleSameAsRowJSON = formatSameAsBlockRowsJSON(sameAsBlockRowsJSON);
                    allRowsJSON.push(singleSameAsRowJSON);
                }
            }
        } else if (typeof this.replacedBy !== "undefined" || JSON.stringify(this.usage).length < 3 || (team === true && isRecordUsageVisible(Object.keys(this.usage)) === false)) {//Hiding unused instances or only private usages (at least for now)
            status = "Not used";

            if (typeof this.replacedBy !== "undefined") {
                var refInstance = [this.replacedBy];
                if (typeof refInstance !== "undefined") {
                    var sameAsTable = refInstance.sameAs;
                    if (typeof sameAsTable !== "undefined" && sameAsTable.indexOf(key) === -1) {
                        var sameAsBlockRowsJSON = createInstanceTableRow(this, type);
                        jsonRow = createInstanceTableRow(refInstance, type);
                        sameAsBlockRowsJSON.push(jsonRow);
                        var singleSameAsRowJSON = formatSameAsBlockRowsJSON(sameAsBlockRowsJSON);
                        allRowsJSON.push(singleSameAsRowJSON);
                    }
                } else {
                    //Hiding MarkDiff if it there by accident
                    jsonRow = createInstanceTableRow(this, type);
                    var lastColContents = jsonRow[jsonRow.length - 1];
                    var $tempDiv = $("<div>" + lastColContents + "</div>");
                    $tempDiv.find(".markDiff").parent().hide();
                    jsonRow[jsonRow.length - 1] = $tempDiv.html();
                    allRowsJSON.push(jsonRow);
                }
            }
        } else {
            if (type === "ships" && (defineUndefined(this.name) === "" || defineUndefined(this.name) === "&nbsp;")) {
            } else if (type === "persons" && ((defineUndefined(this.name) === "" || defineUndefined(this.name) === "&nbsp;") || (defineUndefined(this.surname_a) === "" || defineUndefined(this.surname_a) === "&nbsp;"))) {
            } else if (type === "organizations" && (defineUndefined(this.name) === "" || defineUndefined(this.name) === "&nbsp;")) {
            } else if (type === "locations" && (defineUndefined(this.location_name) === "" || defineUndefined(this.location_name) === "&nbsp;")) {
            } else {
                jsonRow = createInstanceTableRow(this, type);
                allRowsJSON.push(jsonRow);
            }
        }

        count = count + 1;
    });

    return allRowsJSON;
}


/*
 * Creates instance table from records
 */
function createInstancesTableFromDocs(type) {
    showTableLoader(type);
    if (type === "locations") {
        preferredLocationNames = [];
    }

    var start = new Date();
    var instanceLoadingMessage = messenger("Loading " + type, 20);

//WAS
//    instancesDB.get(type).then(function (doc) {
//           createInstancesTableFromDB(start, instanceLoadingMessage, type, doc.instances)


//IS
    var localAndRemoteDBs = getInstanceDBsFromType(type);
    var localDB = localAndRemoteDBs[0];
    var remoteDB = localAndRemoteDBs[1];

    remoteDB.replicate.to(localDB).then(function (result) {
        // handle 'completed' result
//        console.log(result)

        localDB.allDocs({
            include_docs: true
        }).then(function (result) {
            var insts = {};
            $.each(result.rows, function () {
//                console.log(this.doc)
                instanceFiles[type + "_" + this.id] = this.doc;
                insts = appendJSONObject(insts, this.doc.instances);
            });
//            console.log(getJSONsize(insts))
            createInstancesTableFromDB(start, instanceLoadingMessage, type, insts)

        }).catch(function (err) {
//            console.log(err);
            $("#" + type + "Table").children("tbody").html("");
            createTermOrInstanceDataTable("#" + type + "Table");
            instanceLoadingMessage.hide();
            $("tbody").removeClass("loading");
            hideTableLoader(type);
        });



    }).catch(function (err) {
        console.log(err);
        $("#" + type + "Table").children("tbody").html("");
        createTermOrInstanceDataTable("#" + type + "Table");
        instanceLoadingMessage.hide();
        $("tbody").removeClass("loading");
        hideTableLoader(type);
    });
}

function createInstancesTableFromDB(start, instanceLoadingMessage, type, instances) {
    instanceTemplates = [];
    instanceRecords = [];
    var downloadJSONTime = new Date() - start;
    console.log("Took " + downloadJSONTime / 1000 + " secs to download " + type + " JSON!");

//        var fixedInstances = cleanInstances(doc.instances);
    var allRowsJSON = createInstancesJSONForDataTables(instances, type);
//    console.log(allRowsJSON)

    $("#" + type + "TemplateTypeCombo").find("option[value!='All']").remove(); //initialize combo before appending to avoid duplicates
    instanceTemplates.sort();
    instanceTemplates.forEach(function (termTemplate) {
        $("#" + type + "TemplateTypeCombo").append("<option>" + termTemplate + "</option>");
    });
    $("#" + type + "RecordCombo").find("option[value!='All']").remove(); //initialize combo before appending to avoid duplicates
    instanceRecords.sort();
    instanceRecords.forEach(function (termRecord) {
        $("#" + type + "RecordCombo").append("<option>" + termRecord + "</option>");
    });

    var url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id");
    var createTableTime = new Date() - start - downloadJSONTime;
    console.log("Took " + createTableTime / 1000 + " secs to create  " + type + " HTML!");




    createTermOrInstanceDataTable("#" + type + "Table", allRowsJSON);

    if (id !== null) {//This block is used to create table and open modal for one instance!
        var json = JSON.parse(id.replace(/'/g, "\""));
        if (type === "organizations") {
            $(".col2").val(json.name);
            var table = $('#organizationsTable').DataTable();

            table.columns().search('').columns(2).search(json.name).draw();//remove any other filters, before applying name one
            $("a.addRemPref[data-id=\"" + id + "\"]").trigger("click");
        } else if (type === "locations") {
            $(".col1").val(json.location_name);
            var table = $('#locationsTable').DataTable();
            table.columns().search('').columns(1).search(json.location_name).draw();//remove any other filters, before applying name one
            $("a.editLocation[data-id=\"" + id + "\"]").trigger("click");
        }
        table.state.save();
    }


    var renderTime = new Date() - start - createTableTime - downloadJSONTime;
    console.log("Took " + renderTime / 1000 + " secs to render " + type + " table!");
    console.log("Total time: " + ((+downloadJSONTime) + (+createTableTime) + (+renderTime)) / 1000 + " secs for " + allRowsJSON.length + " " + type + ".");
    instanceLoadingMessage.hide();
    hideTableLoader(type);
}


/*
 * Creates instance table from records
 */
//function createInstancesTableFromDocs(type) {
//    var start = new Date();
//
//    var allRows = "";
//    var instanceLoadingMessage = messenger("Loading " + type, 20);
//
//
//    instancesDB.get(type).then(function (doc) {
//
//
//// handle doc
//        instanceFiles[type] = doc;
//
//        if (type === 'locations') {
//            var noTemplateInstances = removeTemplateFromLocations(doc.instances);
//        }
//
//
//
//        instanceTemplates = [];
//        instanceRecords = [];
////        var fixedInstances = cleanInstances(doc.instances);
//
//        $.each(doc.instances, function (key) {
//
//            var htmlRow = "";
//            if (typeof this.sameAs !== "undefined") {//sameAs block
//
//                var sameAsBlockRows = "";
//                if (JSON.stringify(this.sameAs).length > 3) {
//
//
//                    $.each(this.sameAs, function (index) {
//
//                        if (typeof doc.instances[this] !== "undefined") {
//                            if (typeof doc.instances[this].replacedBy !== "undefined") {//Must have replacedBy (I think)
//
//                                if (doc.instances[this].replacedBy === key) {//Cross checking reference
//                                    htmlRow = createInstanceTableRow(doc.instances[this], type);
//                                }
//
//                            }
//                        } else {
//                            htmlRow = "";
//                        }
//                        sameAsBlockRows = sameAsBlockRows + htmlRow;
//                    });
//                    htmlRow = createInstanceTableRow(this, type);
//                    var singleSameAsRow = "";
//
//                    if (sameAsBlockRows.length > 0) {
//                        sameAsBlockRows = sameAsBlockRows + htmlRow;
//                        singleSameAsRow = formatSameAsBlockRows(sameAsBlockRows);
//                    }
//
//                    allRows = allRows + singleSameAsRow;
//                }
//
//            } else if (typeof this.replacedBy !== "undefined" || JSON.stringify(this.usage).length < 3 || (team === true && isRecordUsageVisible(Object.keys(this.usage)) === false)) {//Hiding unused instances or only private usages (at least for now)
//
//                status = "Not used";
//                if (typeof this.replacedBy !== "undefined") {
//
//                    var refInstance = doc.instances[this.replacedBy];
//                    if (typeof refInstance !== "undefined") {
//                        var sameAsTable = refInstance.sameAs;
//                        if (typeof sameAsTable !== "undefined" && sameAsTable.indexOf(key) === -1) {
//                            var sameAsBlockRows = createInstanceTableRow(this, type);
////                          allRows = allRows + htmlRow;
//                            htmlRow = createInstanceTableRow(refInstance, type);
//                            sameAsBlockRows = sameAsBlockRows + htmlRow;
//                            var singleSameAsRow = formatSameAsBlockRows(sameAsBlockRows);
//                            allRows = allRows + singleSameAsRow;
//                        }
//                    } else {
//                        //Hiding MarkDiff if it there by accident
//                        htmlRow = createInstanceTableRow(this, type);
//                        var $row = $(htmlRow);
//                        $row.children("td").last().find(".markDiff").parent().hide();
//                        var row = "<tr id=\"" + $row.attr("id") + "\" data-value=\"" + $row.attr("data-value") + "\">" + $row.html() + "</tr>";
//                        allRows = allRows + row;
//                    }
//                }
//            } else {
//
//                if (type === "ships" && (defineUndefined(this.name) === "" || defineUndefined(this.name) === "&nbsp;")) {
//                    htmlRow = "";
//                } else if (type === "persons" && ((defineUndefined(this.name) === "" || defineUndefined(this.name) === "&nbsp;") || (defineUndefined(this.surname_a) === "" || defineUndefined(this.surname_a) === "&nbsp;"))) {
//                    htmlRow = "";
//                } else if (type === "organizations" && (defineUndefined(this.name) === "" || defineUndefined(this.name) === "&nbsp;")) {
//                    htmlRow = "";
//                } else if (type === "locations" && (defineUndefined(this.location_name) === "" || defineUndefined(this.location_name) === "&nbsp;")) {
//
//                    htmlRow = "";
//                } else {
//                    htmlRow = createInstanceTableRow(this, type);
//                }
//                allRows = allRows + htmlRow;
//            }
//
//
//        });
//
//        $("#" + type + "TemplateTypeCombo").find("option[value!='All']").remove(); //initialize combo before appending to avoid duplicates
//        instanceTemplates.sort();
//        instanceTemplates.forEach(function (termTemplate) {
//            $("#" + type + "TemplateTypeCombo").append("<option>" + termTemplate + "</option>");
//        });
//        $("#" + type + "RecordCombo").find("option[value!='All']").remove(); //initialize combo before appending to avoid duplicates
//        instanceRecords.sort();
//        instanceRecords.forEach(function (termRecord) {
//            $("#" + type + "RecordCombo").append("<option>" + termRecord + "</option>");
//        });
//        //Hiding entire rows if instance is used by a deleted record (EXPERIMENTAL PHASE)
//        var $allRows = $("<tbody>" + allRows + "</tbody>");
//        $allRows.find("a[data-garbage]").parent().parent().remove();
//        allRows = $allRows.html();
//
//
//        $("#" + type + "Table").children("tbody").html(allRows);
//        var url_string = window.location.href;
//        var url = new URL(url_string);
//        var id = url.searchParams.get("id");
//        var time = new Date() - start;
//        console.log("Took " + time / 1000 + " secs to create HTML!");
//
//        createTermOrInstanceDataTable("#" + type + "Table");
//
//        if (id !== null) {//This block is used to create table and open modal for one instance!
//            var json = JSON.parse(id.replace(/'/g, "\""));
//            if (type === "organizations") {
//                $(".col2").val(json.name);
//                var table = $('#organizationsTable').DataTable();
//                table.columns(2).search(json.name).draw();
//
//                $("a.addRemPref[data-id=\"" + id + "\"]").trigger("click");
//            } else if (type === "locations") {
//                $(".col1").val(json.location_name);
//                var table = $('#locationsTable').DataTable();
//                table.columns(1).search(json.location_name).draw();
//                $("a.editLocation[data-id=\"" + id + "\"]").trigger("click");
//            }
//            table.state.save();
//        }
//
//
//        var time2 = new Date() - start - time;
//        console.log("Took " + time2 / 1000 + " secs to render table!");
//        instanceLoadingMessage.hide();
//
//    }).catch(function (err) {
//        console.log(err);
//        $("#" + type + "Table").children("tbody").html("");
//        createTermOrInstanceDataTable("#" + type + "Table");
//        instanceLoadingMessage.hide();
//    });
//}


/*
 * Creates instance table row 
 */
function createInstanceTableRow(instance, type) {

    var instanceRecordsStatus = "Under processing";
    if (typeof instance.usage !== "undefined") {
        var titles = [];
        var templates = [];

        var keys = Object.keys(instance.usage);

        $.each(keys, function (index) {
            var recordId = keys[index];
            var recordTemplate = instance.usage[recordId].template;
            var recordTitle = instance.usage[recordId].title;
            templates.push(recordTemplate);

            var enhancedTitle = recordTitle + " #" + recordId.substring(recordId.lastIndexOf("_") + 1);
//            var enhancedTitle = recordTitle;

            titles.push(enhancedTitle);
//            titles.push(recordTitle);

            if (visibleRecords.indexOf(recordId) !== -1) {//show only visible
                if (instanceTemplates.indexOf(recordTemplate) === -1) {
                    instanceTemplates.push(recordTemplate);
                }
                if (instanceRecords.indexOf(enhancedTitle) === -1) {
                    instanceRecords.push(enhancedTitle);
                }
// if (instanceRecords.indexOf(recordId) === -1) {
//                    instanceRecords.push(recordId);
//                }
            }
        });
        $.each(keys, function (index) {
            var status = recordsStatus[this.toString()];
            if (typeof status !== "undefined" && status !== "Under processing") {
                instanceRecordsStatus = status;
            }
        });
    }

    var jsonRow = createInstanceTableRowJSON(instance, type, templates, titles, instanceRecordsStatus);
    return jsonRow;
}

/*
 * Creates instance table row JSON
 */
function createInstanceTableRowJSON(instance, type, templates, titles, instanceRecordsStatus) {
    var jsonRow = "";
    var instanceName = instance.name;
    if (type === "locations") {
        instanceName = instance.location_name;
    }


    var actionsMenu = "";
    var allowedActions = "";
    var infoBadge = "";
    if (typeof instance.usage !== "undefined") {

        var occsLength = JSPath.apply(".*.occurences", instance.usage).length;
        var style = "";


        //Following snippet was added to only count visible records position info
        var recordsTable = Object.keys(instance.usage);
        var visibleOccsLength = 0;
        for (var i = 0; i < recordsTable.length; i++) {
            var use = recordsTable[i];
            if (visibleRecords.indexOf(use) !== -1) {
                visibleOccsLength = visibleOccsLength + instance.usage[use].occurences.length;
            }
        }
        if (visibleOccsLength < occsLength) {
            occsLength = visibleOccsLength;
        }
        if (visibleOccsLength === 0) {
            style = "data-garbage='' style='display:none;'";
//            console.log("JUNK")
//            console.log(instance)

        } else {
            var diffLength = JSPath.apply(".diff", instance).length;
            if (occsLength - diffLength > 1) {
                style = "style='color:#682A17;'";
            }
        }

        var dataAttrs = "data-id=\"" + instance.value + "\" data-type='" + type + "' data-name='" + defineUndefined(instanceName).replace(/'/g, "&apos;") + "'";
        if (type === "locations") {
            var dataAttrs2 = "data-id=\"" + instance.value.toLowerCase() + "\" data-type='" + type + "' data-name='" + defineUndefined(instanceName).replace(/'/g, "&apos;") + "'";
            allowedActions = "<li><a href='#' class='editLocation' data-toggle='modal' data-target='#editLocationModal' " + dataAttrs2 + ">Edit location</a></li>";
            var actionsMenu = " <div class='btn-group pull-right dropdown'>" +
                    "<button type='button' class='btn btn-default dropdown-toggle action' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
                    "<span class='glyphicon glyphicon-cog' aria-hidden='true'></span> <span class='caret'></span>" +
                    "</button>" +
                    "<ul class='dropdown-menu'>" +
                    allowedActions +
                    "</ul>" +
                    "</div>";
        }
        if (type === "ships" || type === "organizations" || type === "persons") {

            var dataAttrs2 = "data-value=\"" + instance.value + "\" data-id=\"" + instance.value.toLowerCase() + "\" data-type='" + type + "' data-name='" + defineUndefined(instanceName).replace(/'/g, "&apos;") + "'";
            if (typeof instance.replacedBy !== "undefined") {
                allowedActions = "<li><a href='#' class='markDiff' " + dataAttrs2 + ">Mark as different</a></li>" +
                        "<li><a href='#' class='addRemPref' " + dataAttrs2 + ">Add/Remove preferred term</a></li>";
            } else {
                allowedActions = "<li><a href='#' class='addRemPref' " + dataAttrs2 + ">Add/Remove preferred term</a></li>";
            }
            var actionsMenu = " <div class='btn-group pull-right dropdown'>" +
                    "<button type='button' class='btn btn-default dropdown-toggle action' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
                    "<span class='glyphicon glyphicon-cog' aria-hidden='true'></span> <span class='caret'></span>" +
                    "</button>" +
                    "<ul class='dropdown-menu'>" +
                    allowedActions +
                    "</ul>" +
                    "</div>";
        }
        infoBadge = " <a " + style + " href='#' class='instance glyphicon glyphicon-info-sign' data-toggle='modal' data-target='#termModal' " + dataAttrs + "><span class='hidden'>" + style + "</span></a>";
    }

    if ((typeof instance.value !== "undefined" && instance.value.match(/:'[^\s]+.*?'.*/) || typeof instance.sameAs !== "undefined")) {//test to remove empty, typeof extra condition was added to allow sameAs with empty preferred!

        if (type === "persons") {

            var status = defineUndefined(instance.status_capacity_role); //proper
            if (status === "") {//just in case
                status = defineUndefined(instance.status);
            }
            jsonRow = [instance.value,
                infoBadge,
                defineUndefined(instance.name),
                defineUndefined(uniq(templates)).toString(),
                defineUndefined(titles).toString(),
                defineUndefined(instance.surname_a),
                defineUndefined(instance.surname_b),
                defineUndefined(instance.maiden_name),
                defineUndefined(instance.fathers_name),
                defineUndefined(instance.place_of_birth),
                defineUndefined(instance.date_of_birth),
                defineUndefined(instance.date_of_death),
                defineUndefined(instance.registration_number),
                status,
                instanceRecordsStatus,
                actionsMenu
            ];


        } else if (type === "ships") {


            var number = defineUndefined(instance.registration_folio); //proper
            if (number === "") {//just in case
                number = defineUndefined(instance.registration_number);
            }

//            htmlRow = "<tr id=\"" + instance.value.toLowerCase() + "\" data-value=\"" + instance.value + "\">" +
//                    "<td>" + instance.value + "</td>" +
//                    "<td>" + infoBadge + "</td>" +
//                    "<td>" + defineUndefined(instance.name) + "</td>" +
//                    "<td>" + uniq(templates) + "</td>" +
//                    "<td>" + titles + "</td>" +
//                    "<td>" + defineUndefined(instance.previous_name) + "</td>" +
//                    "<td>" + defineUndefined(instance.type) + "</td>" +
//                    "<td>" + defineUndefined(instance.signal) + "</td>" +
//                    "<td>" + defineUndefined(instance.construction_location) + "</td>" +
//                    "<td>" + defineUndefined(instance.construction_date) + "</td>" +
//                    "<td>" + defineUndefined(instance.telegraphic_code) + "</td>" +
//                    "<td>" + defineUndefined(instance.flag) + "</td>" +
//                    "<td>" + defineUndefined(instance.owner_company) + "</td>" +
//                    "<td>" + defineUndefined(instance.registration_list) + "</td>" +
//                    "<td>" + defineUndefined(number) + "</td>" +
//                    "<td>" + defineUndefined(instance.registration_location) + "</td>" +
//                    "<td>" + instanceRecordsStatus + "</td>" +
//                    "<td>" + actionsMenu + "</td>" +
//                    "</tr>";
            jsonRow = [instance.value,
                infoBadge,
                defineUndefined(instance.name),
                defineUndefined(uniq(templates)).toString(),
                defineUndefined(titles).toString(),
                defineUndefined(instance.previous_name),
                defineUndefined(instance.type),
                defineUndefined(instance.signal),
                defineUndefined(instance.construction_location),
                defineUndefined(instance.construction_date),
                defineUndefined(instance.telegraphic_code),
                defineUndefined(instance.flag),
                defineUndefined(instance.owner_company),
                defineUndefined(instance.registration_list),
                defineUndefined(number),
                defineUndefined(instance.registration_location),
                instanceRecordsStatus,
                actionsMenu
            ];


        } else if (type === "organizations") {
//            htmlRow = "<tr id=\"" + instance.value.toLowerCase() + "\" data-value=\"" + instance.value + "\">" +
//                    "<td>" + instance.value + "</td>" +
//                    "<td>" + infoBadge + "</td>" +
//                    "<td>" + defineUndefined(instance.name) + "</td>" +
//                    "<td>" + uniq(templates) + "</td>" +
//                    "<td>" + titles + "</td>" +
//                    "<td>" + instanceRecordsStatus + "</td>" +
//                    "<td>" + actionsMenu + "</td>" +
//                    "</tr>";


            jsonRow = [instance.value,
                infoBadge,
                defineUndefined(instance.name),
                defineUndefined(uniq(templates)).toString(),
                defineUndefined(titles).toString(),
                instanceRecordsStatus,
                actionsMenu
            ];

        } else if (type === "locations") {

            var uncertain = false;
            if (typeof instance.uncertain !== "undefined") {
                uncertain = true;
            }

            var coords = defineUndefined(instance.coords);
            coords = getLatLongLinkFromCoords(coords, uncertain, instance.uncertain);
            var id = defineUndefined(instance.tgnId);
            var idLink = "#";

            var styleAttr = "";
            var titleAttr = "";
            if (uncertain) {
                styleAttr = "style='color:#CC0A0A'";
                titleAttr = locationUncertaintyTitleAttr;

                if (instance.uncertain !== "") {
                    titleAttr = "title='" + instance.uncertain + "'";
                }
            }

            if (id !== "") {
                idLink = gettyQueryUrl+"/page/tgn/" + id;
                id = "tgn:" + id;

            } else if (defineUndefined(instance.geoId) !== "") {
                idLink = "https://www.geonames.org/" + defineUndefined(instance.geoId);
                id = "geo:" + defineUndefined(instance.geoId);

            }

//            htmlRow = "<tr id=\"" + instance.value.toLowerCase() + "\" data-value=\"" + instance.value + "\">" +
//                    "<td>" + infoBadge + "</td>" +
//                    "<td>" + defineUndefined(instance.location_name) + "</td>" +
//                    "<td>" + uniq(templates) + "</td>" +
//                    "<td>" + titles + "</td>" +
//                    "<td>" + defineUndefined(instance.preferredName) + "</td>" +
//                    "<td>" + defineUndefined(instance.other_name) + "</td>" +
//                    "<td>" + defineUndefined(instance.type) + "</td>" +
//                    "<td>" + defineUndefined(instance.broader_name_1) +
//                    "<br/>" + defineUndefined(instance.broader_name_2) + "</td>" +
//                    "<td><a " + styleAttr + " " + titleAttr + " target='_blank' href='" + idLink + "'>" + id + "</a></td>" +
//                    "<td>" + coords + "</td>" +
//                    "<td>" + defineUndefined(instance.uncertain) + "</td>" +
//                    "<td>" + instanceRecordsStatus + "</td>" +
//                    "<td>" + actionsMenu + "</td>" +
//                    "</tr>";

//preferredLocationNames

            if (typeof instance.preferredName !== "undefined" && instance.preferredName !== "") {
//                console.log(instance.preferredName)
                preferredLocationNames.push(instance.preferredName)
            }

            jsonRow = [infoBadge,
                defineUndefined(instance.location_name),
                defineUndefined(uniq(templates)).toString(),
                defineUndefined(titles).toString(),
                defineUndefined(instance.preferredName),
                defineUndefined(instance.other_name),
                defineUndefined(instance.type),
                defineUndefined(instance.broader_name_1) + "<br/>" + defineUndefined(instance.broader_name_2),
                "<a " + styleAttr + " " + titleAttr + " target='_blank' href='" + idLink + "'>" + id + "</a>",
                coords,
                defineUndefined(instance.uncertain),
                instanceRecordsStatus,
                actionsMenu,
            ];

        }
    }
    return jsonRow;
}




function fixCoordsWithQuot(coords) {
    if (coords.indexOf("\"") !== -1) {//fix [c]avak issue (coords with ")
        coords = coords.replace(/"/g, "&quot;");
    }
    return coords;
}

/*
 * Gets Lat and Long from simple text input
 */
function getLatLongLinkFromCoords(coords, uncertain, uncertainComment) {
    coords = fixCoordsWithQuot(coords);
    var styleAttr = "";
    var titleAttr = "";
    if (uncertain) {
        styleAttr = "style='color:#CC0A0A'";
        var titleAttr = locationUncertaintyTitleAttr;
        if (uncertainComment !== "") {
            titleAttr = "title='" + uncertainComment + "'";
        }
    }
    var lat = "";
    var long = "";
    var link = "";
    if (coords !== "") {
        var coordsParts = coords.split(/,? /);

        if (coordsParts.length === 2) {
            lat = coordsParts[0];
            long = coordsParts[1];

            link = "<a " + styleAttr + " " + titleAttr + " target='_blank' href=\"https://maps.google.com/?q=" + lat + "," + long + "&ll=" + lat + "," + long + "&z=7\">" + coords + "</a>";

        }
    }
    return link;
}


/*
 * Creates records table from records
 */
function createRecordsTableFromDocs(result) {

    var allRows = "";
    var userLevel = userJSON.level;
    var recordIds = [];
    var visibleRecordIds = [];


    $.each(result.docs, function () {

        var htmlRow = "";
        recordIds.push(this._id); //Not sure about this line!!!

        if ((typeof this.status === "undefined" || this.status === "Private") && userJSON.level !== "god") {//DO NOT SHOW!!!!

        } else {
            htmlRow = createRecordTableRow(this, userLevel);
            visibleRecordIds.push(this._id);
        }
        allRows = allRows + htmlRow;
    });
    records = recordIds;
    visibleRecords = visibleRecordIds;
    return allRows;
}


/*
 * Creates records table row
 */
function createRecordTableRow(json, userLevel) {
    var id = json._id;
    var allowedActions;
    var template = json.template;
    var templateTitle = templates[template + "_title"];
    var recordOrg = templates[template + "_organization"];

    var recordTitle = createFilename(json, templateTitle);
    if (typeof templateTitle !== "undefined") {//precaution
        recordTitle = recordTitle.substring(templateTitle.length + 1);
        recordTitle = recordTitle.substring(0, recordTitle.lastIndexOf(",")); //Removing author from record title, since there is a column for it
    }


    var viewModeParam = "&mode=teamView";
    var userActionsHtml = "";
    var status = recordsStatus[id];


    if (userLevel !== "user") {
        userActionsHtml = "<li><a href='#' class='exportMyCatalogue' data-value='" + id + "'  >Export record</a></li>" +
                "<li><a href='#' class='deleteMyCatalogue' data-value='" + id + "'  >Delete record</a></li>";
        if (typeof status === "undefined" || (typeof status !== "undefined" && !status.startsWith("Published ("))) {
            userActionsHtml = userActionsHtml + "<li><a href='#' class='changeStatus' data-value='" + id + "' data-toggle='modal' data-target='#statusModal'>Change record status</a></li>";
        }
    }

    allowedActions = "<li><a href='templates/" + template + ".html?name=" + id + "&templateTitle=" + templateTitle + viewModeParam + "' class='editMyCatalogue' data-value='" + id + "' data-template='" + template + "' data-templateTitle='" + templateTitle + "' data-mode='teamView'>View record</a></li>" +
            "<li><a href='templates/" + template + ".html?name=" + id + "&templateTitle=" + templateTitle + viewModeParam + "' class='editMyCatalogue newTab' data-value='" + id + "' data-template='" + template + "' data-templateTitle='" + templateTitle + "' data-mode='teamView'>View record in new tab</a></li>" +
            userActionsHtml;
    var actionsMenu = " <div class='btn-group pull-right dropleft'>" +
            "<button type='button' class='btn btn-default dropdown-toggle action' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
            "<span class='glyphicon glyphicon-cog' aria-hidden='true'></span> <span class='caret'></span>" +
            "</button>" +
            "<ul class='dropdown-menu'>" +
            allowedActions +
            "</ul>" +
            "</div>";
    var rowHtml = "";
    var plainIntegerId = id;
    if (id.indexOf("_") !== -1) {
        var idParts = id.split("_");
        if (idParts.length > 1) {
            plainIntegerId = idParts[1];
        }
    }
    if (typeof json.data !== "undefined") {
        var lastModifiedDate = json.data.record_information.date_until;
        var authorName = json.data.record_information.name;
        var authorSurname = json.data.record_information.surname;
        var author = authorName + " " + authorSurname;
        author = createMultipleAuthors(author, authorName, authorSurname); //just checking
    }


    var templateCategories = templates[template + "_keywords"];

    if (typeof status === "undefined") {
        status = "Under processing";
    }
    var statusCol = "<td>" + status + "</td>";
    rowHtml = "<tr id='" + id + "'><td title='" + id + "'>" + id + "</td><td>" + plainIntegerId + "</td><td>" + templateTitle + "</td><td>" + recordTitle + "</td><td>" + author + "</td><td>" + templateCategories + "</td><td>" + recordOrg + "</td><td>" + lastModifiedDate + "</td>" + statusCol + "<td>" + actionsMenu + "</td></tr>";
    return rowHtml;
}




/*
 * Changes record status
 */
$("body").on("click", ".changeStatus", function () {
    var recordId = $(this).attr("data-value");
    var hiddenInput = createFormInput("recordId", "recordId", "hidden", "", recordId);
    $(".modal-body>form.statusPopup").after(hiddenInput);
    adminDB.get("status").then(function (doc) {
        var recordStatus = doc.records[recordId];
        if (typeof recordStatus === "undefined") {
            $("#status").val("Under processing");
        } else {
            $("#status").val(recordStatus);
        }
    });
});

/*
 * Action button click event (shows or hides actions based on user level)
 */
$("body").on("click", ".action", function () {
    var $btn = $(this);
    var title = $(".content-header>h1").html().trim();
    if (title.indexOf("RECORDS") !== -1) {//only for records
        var recordId = $btn.parentsUntil("tr").parent().attr("id");
        var $actionsList = $btn.next("ul");
        if (userJSON.level === "god" || userJSON.level === "admin" || (userJSON.level === "user" && title === "MY RECORDS")) {
            var userActionsHtml = "<li><a href='#' class='exportMyCatalogue' data-value='" + recordId + "'  >Export record</a></li>" +
                    "<li><a href='#' class='deleteMyCatalogue' data-value='" + recordId + "'  >Delete record</a></li>" +
                    "<li><a href='#' class='changeStatus' data-value='" + recordId + "' data-toggle='modal' data-target='#statusModal'>Change record status</a></li>";
            if ($actionsList.children("li").length < 3) {
                $actionsList.append(userActionsHtml);
            }
            //TEMP CODE TO TEST UPLOAD
//            if (userJSON.level === "god") {
//                var $firstLink = $btn.next("ul").find("a").first();
//                var template = $firstLink.attr("data-template");
//                var templateTitle = $firstLink.attr("data-templatetitle");
//
//                $actionsList.append("<li><a href='#' class='uploadCatalogue' data-value='" + recordId + "' data-template='" + template + "' data-templatetitle='" + templateTitle + "' >Upload record</a></li>");
//            }
        } else {
            if ($actionsList.children("li").length > 2) {//li:lt(3)
                $actionsList.children("li:gt(1)").hide();
            }
        }
    }
// 


});
/*
 * Sets record status
 */
$("body").on("click", "#setStatus", function () {
    var recordId = $("#recordId").val();
    var recordStatus = $("#status").val();
    setRecordStatus(recordId, recordStatus);

});


/*
 * Edits location instance
 */
$("body").on("click", ".editLocation", function () {
    $(".modal-title").html("Location: ");
    $(".modal-body>form.editLocationPopup").html("");
    var locationId = $(this).attr("data-id");
    var locationLabel = $(this).attr("data-name");
//    console.log(locationId);
//    console.log(locationLabel);
    var firstLetter = locationLabel.charAt(0).toLowerCase();
    if (firstLetter === "_") {// underscore is reserved, replace with -
        firstLetter = "-";
    }


    locationsDB.get(firstLetter).then(function (doc) {

//    instancesDB.get("locations").then(function (doc) {

//WAS
//        var preferredLocationNames = JSPath.apply(".instances..preferredName", doc);
//IS
        preferredLocationNames = uniq(preferredLocationNames);

//        console.log(preferredLocationNames)
//        uniq(preferredLocationNames);
//        console.log(preferredLocationNames)
//        var preferredTGNLocationNames = JSPath.apply(".instances..preferredTGN", doc);
        var preferredLocationName = defineUndefined(doc.instances[locationId].preferredName);
//        console.log(preferredLocationName)
//        var preferredTGNLocationName = defineUndefined(doc.instances[locationId].preferredTGN);
        var uncertain = doc.instances[locationId].uncertain;
        var form = createFormInput("locationLabel", "locationLabel", "hidden", "", locationLabel);
        form = form + createFormInput("locationId", "locationId", "hidden", "", locationId);
        form = form + createFormInput("preferredLocationName", "Corrected/Vernacular Location name", "select", "Fill in Corrected/Vernacular Location name", preferredLocationName);
//form = form+"<small style='color:#C64F1A'> *this will replace the source location name.</small>";
        form = form + "<button title='Click to get relevant information from Getty Location database' type='button' class='btn btn-primary' id='askGetty'>Ask Getty</button>";
        form = form + "<button title='Click to get relevant information from Geonames' type='button' class='btn btn-primary' id='askGeo'>Ask Geo</button>";

        form = form + "<div class='gettyResults'/>";
        form = form + "<div class='geoResults'/>";

        form = form + createFormInput("tgnId", "TGN iD (<a title='Click to go to Getty Location database' target='_blank' href='//www.getty.edu/research/tools/vocabularies/tgn/'>Getty Location database</a>)", "text", "Fill in TGN ID (e.g. 1061730)", defineUndefined(doc.instances[locationId].tgnId));
        form = form + createFormInput("geoId", "Geonames iD (<a title='Click to go to Geonames database' target='_blank' href='https://www.geonames.org/'>Geonames</a>)", "text", "Fill in Geonames ID (e.g. 390903)", defineUndefined(doc.instances[locationId].geoId));
//        console.log(doc.instances[locationId].coords)
//            coords = fixCoordsWithQuot(defineUndefined(doc.instances[locationId].coords));

        form = form + createFormInput("coords", "Coordinates", "text", "Fill in Coordinates (e.g. 41.494183 2.294718)", fixCoordsWithQuot(defineUndefined(doc.instances[locationId].coords)));
        form = form + createFormInput("other_name", "Secondary optional location name (e.g. historical name)", "text", "Fill in second name for the location (optional)", defineUndefined(doc.instances[locationId].other_name));

//form = form+"<div class='checkbox'><label><input type='checkbox' value=''>Ι am not 100% sure about this locations identity</label></div>";
//form = form+"<textarea class='form-control' rows='3'></textarea>";
        var checked = "";
        var comment = "";
        if (typeof uncertain !== "undefined") {
            checked = "checked";
            comment = uncertain;
        }

        form = form + '<div class="locationCertaintyBlock form-group" title="Check this if you are not sure about this location identity and (optionally) add a comment">' +
                '<label for="locationCertainty">Location certainty</label><div class="input-group"><span title="Check this if you are not sure about this location identity" class="input-group-addon">' +
                '<input class="locationCertainty" name="locationCertaintyCheckbox" type="checkbox" aria-label="..." value="" ' + checked + '></span>' +
                '<textarea name="locationCertaintyComment" title="Add any (optional) comments here" class="form-control" rows="3" placeholder="Ι am not 100% sure about this location identity" value="">' + comment + '</textarea></div><!-- /input-group --></div><!-- /.col-lg-6 -->';


        form = form + "<div class='gettyMap'/>";

        $(".modal-title").html("Location: " + locationLabel);

        //To add Korina's small red text
        form = form.replace(/(<\/div><button title='Click to get relevant information from Getty)/g, "<small style='color:#C64F1A'> *this will replace the source location name.</small>$1");

        //Following code snippet adds missing coords if there is a geonames or a tgn id
        if (defineUndefined(doc.instances[locationId].coords) === "" && (defineUndefined(doc.instances[locationId].tgnId) !== "" || defineUndefined(doc.instances[locationId].geoId) !== "")) {
            if (defineUndefined(doc.instances[locationId].geoId) !== "") {
                getCoordsFromGeoIdFillFormAndOptionallySave($("<form>" + form + "</form>"), doc.instances[locationId].geoId, false, preferredLocationNames, preferredLocationName);
            } else if (defineUndefined(doc.instances[locationId].tgnId) !== "") {
                getCoordsFromTgnIdFillFormAndOptionallySave($("<form>" + form + "</form>"), doc.instances[locationId].tgnId, false, preferredLocationNames, preferredLocationName);
            }
        } else {
            $(".modal-body>form.editLocationPopup").html(form);
            createSelect2InsideLocationModal(preferredLocationNames, preferredLocationName);

        }


    }).catch(function (err) {
        console.log(err);
        console.log(("So now we get this error when we try to get() it: " + JSON.stringify(err)));
        alert("FastCat: Unexpected error when trying to get locations! Contact support with following error message:" + JSON.stringify(err));
    });
});

function createSelect2InsideLocationModal(preferredLocationNames, preferredLocationName) {
    $(".select2").each(function () {
        var $select = $(this);
        var selectedValue = "";
        var selectTerms = "";
        if ($select.attr("id") === "preferredLocationName") {
            selectedValue = preferredLocationName;
            selectTerms = preferredLocationNames;
//        } else if ($select.attr("id") === "preferredTGN") {
//            selectedValue = preferredTGNLocationName;
//            selectTerms = preferredTGNLocationNames;
        }
        var data = createSelect2Data(selectTerms);
        $select.select2({
            allowClear: true,
            tags: true,
            data: data.results,
            sorter: function (data) {
                return data.sort(function (a, b) {
                    if (a.text > b.text) {
                        return 1;
                    }
                    if (a.text < b.text) {
                        return -1;
                    }
                    return 0;
                });
            }
        });
        $select.val(selectedValue).trigger('change');
    });
}


/*
 * Action performed when user chooses a Getty radio option (fills inputs and shows google map)
 */
$("body").on("click", ".gettyRadios", function () {
    var $this = $(this);


    var preferred = $this.parent().children(".prefLabel").html();
//        $("#preferredLocationName").val(preferred).trigger("change");
    var option = new Option(preferred, preferred);
    option.selected = true;

    $("#preferredLocationName").append(option);
    $("#preferredLocationName").trigger("change");

    var lat = $this.parent().children(".tgnLat").html();
    var long = $this.parent().children(".tgnLong").html();
    var tgnId = $this.parent().children("a").html();
    if (tgnId.indexOf("vocab.getty.edu") !== -1) {
        tgnId = tgnId.replace(/http:\/\/vocab.getty.edu\/tgn\//g, "");
        $("#tgnId").val(tgnId);
    } else {
        tgnId = tgnId.replace(/https:\/\/www.geonames.org\//g, "");
        $("#geoId").val(tgnId);
    }


    $("#coords").val(lat + " " + long);
    $(".gettyMap").html('<iframe src="https://maps.google.com/maps?q=' + lat + ', ' + long + '&z=7&output=embed"  width="100%" height="270" frameborder="0" style="border:0"></iframe>');


});

function getCoordsFromGeoIdFillFormAndOptionallySave($form, geoId, save, preferredLocationNames, preferredLocationName) {
//    http://api.geonames.org/getJSON?formatted=true&geonameId=261745&username=iltzortz&style=full
    var url = geonamesQueryUrl+"/getJSON?formatted=true&geonameId=" + geoId + "&username=iltzortz&style=full";
    $.get(url, function (data) {

        if (typeof data.lat !== "undefined") {
            $form.find("#geoId").attr("value", geoId);
            $form.find("#coords").attr("value", data.lat + " " + data.lng);
            $(".modal-body>form.editLocationPopup").html($form.html());
            createSelect2InsideLocationModal(preferredLocationNames, preferredLocationName);

            if (save === true) {
                saveLocation($form);
            }
        }
    });

}
function getCoordsFromTgnIdFillFormAndOptionallySave($form, tgnId, save, preferredLocationNames, preferredLocationName) {
    var query = "select ?tgnLat ?tgnLong {" +
            "tgn:" + tgnId.trim() + " skos:inScheme tgn: ;" +
            "foaf:focus/wgs:lat ?tgnLat;" +
            "foaf:focus/wgs:long ?tgnLong;" +
            "}";
    var url = gettyQueryUrl+"/sparql.json?query=" + encodeURIComponent(query) + "&_implicit=false&implicit=true&_equivalent=false&_form=%2Fsparql";

    $.get(url, function (data) {
        var results = data.results.bindings;

        if (results.length > 0) {
            var lat = results[0].tgnLat.value;
            var lng = results[0].tgnLong.value;
            $form.find("#tgnId").attr("value", tgnId);
            $form.find("#coords").attr("value", lat + " " + lng);
        }
        $(".modal-body>form.editLocationPopup").html($form.html());
        createSelect2InsideLocationModal(preferredLocationNames, preferredLocationName);

        if (save === true) {
            saveLocation($form);
        }

    });
}


/*
 * Performs Geonames query and gets Geonames radio options
 */
$("body").on("click", "#askGeo", function () {
    var $form = $("form.editLocationPopup");
    var params = $form.serializeArray();
    var values = {};
    $.each(params, function (i, field) {
        values[field.name] = field.value;
    });
    var location = values.preferredLocationName;
    if (typeof location === "undefined" || location === null || location === "") {
        location = values.locationLabel;
    }

    var url = geonamesQueryUrl+"/search?q=" + encodeURIComponent(location.toLowerCase()) + "&username=iltzortz&maxRows=10&style=SHORT&type=json&featureClass=A&featureClass=P&featureClass=L&featureClass=T"
//    $("#tgnId").val("");
//    $("#coords").val("");

    $(".geoResults").html("");
    $(".gettyResults").html("");

    $.get(url, function (data) {

        var results = data.geonames;

        for (index in results) {
            var resultsBlock = "";
            var res = results[index];

//            var parents = res.tgnParents.value;
//            var parentsParts = parents.split(", ");
//            parentsParts.reverse();
//            for (var i = 0; i < parentsParts.length; i++) {
//                var parent = parentsParts[i];
//                if (i === 1) {
//                    var continentHeading = "<h4 id='" + parent + "'>" + parent + "</h4>";
//                    if ($(".gettyResults").children("[id='" + parent + "']").length === 0) {
//                        $(".gettyResults").append(continentHeading);
//                    }
//                }
//
//            }



            var label = "<span class='prefLabel'>" + res.name + "</span>" + " [" + res.toponymName + "] (<span class='tgnParents'>" + res.countryCode + "</span>) \n\
Lat:<span class='tgnLat'>" + res.lat + "</span> Long:<span class='tgnLong'>" + res.lng + "</span> <a target='_blank' href='https://www.geonames.org/" + res.geonameId + "'>https://www.geonames.org/" + res.geonameId + "</a>";

            var radioHtml = "<div class='radio'>" +
                    "<label>" +
                    "<input type='radio' class='gettyRadios' name='gettyRadios' id='gettyRadios" + index + "' value='" + index + "'>" +
                    label +
                    "</label>" +
                    "</div>";
            resultsBlock = resultsBlock + radioHtml;
//            $("h4[id='" + parentsParts[1] + "']").after($(resultsBlock))
            $(".geoResults").append(resultsBlock);

        }
        if (results.length === 0) {
            resultsBlock = "No results found from Geonames!<br/>(Correct the source location name if needed and add coordinates below)";
            $(".gettyResults").html(resultsBlock);

        }
    })
            .done(function () {
//                console.log("second success");
            })
            .fail(function () {
                console.log("Getty service error");
            })
            .always(function () {
//                console.log("finished");
            });
}
);


/*
 * Performs Getty query and gets Getty radio options
 */
$("body").on("click", "#askGetty", function () {
    var $form = $("form.editLocationPopup");
    var params = $form.serializeArray();
    var values = {};
    $.each(params, function (i, field) {
        values[field.name] = field.value;
    });
    var locInfo = [values];

    var query = sparqlQuery(locInfo);
    var url = gettyQueryUrl+"/sparql.json?query=" + encodeURIComponent(query) + "&_implicit=false&implicit=true&_equivalent=false&_form=%2Fsparql";

//    $("#geoId").val("");
//    $("#coords").val("");

    $(".geoResults").html("");
    $(".gettyResults").html("");
    $.get(url, function (data) {
        var results = data.results.bindings;

        for (index in results) {
            var resultsBlock = "";
            var res = results[index];
            var parents = res.tgnParents.value;
            var parentsParts = parents.split(", ");
            parentsParts.reverse();
//            for (var i = parentsParts.length - 1; i >= 0; i--) {
            for (var i = 0; i < parentsParts.length; i++) {
                var parent = parentsParts[i];
                if (i === 1) {
                    var continentHeading = "<h4 id='" + parent + "'>" + parent + "</h4>";
                    if ($(".gettyResults").children("[id='" + parent + "']").length === 0) {
                        $(".gettyResults").append(continentHeading);
                    }
                }

            }

            var label = "<span class='prefLabel'>" + res.tgnPrefLabel.value + "</span>" + " [" + res.tgnType.value + "] (<span class='tgnParents'>" + res.tgnParents.value + "</span>) \n\
Lat:<span class='tgnLat'>" + res.tgnLat.value + "</span> Long:<span class='tgnLong'>" + res.tgnLong.value + "</span> <a target='_blank' href='" + res.tgnId.value.replace(/\.edu\/tgn\//g, ".edu/page/tgn/") + "'>" + res.tgnId.value + "</a>";

            var radioHtml = "<div class='radio'>" +
                    "<label>" +
                    "<input type='radio' class='gettyRadios' name='gettyRadios' id='gettyRadios" + index + "' value='" + index + "'>" +
                    label +
                    "</label>" +
                    "</div>";
            resultsBlock = resultsBlock + radioHtml;
            $("h4[id='" + parentsParts[1] + "']").after($(resultsBlock))


        }
        if (results.length === 0) {
            resultsBlock = "No results found from Getty!<br/>(Correct the source location name if needed and add coordinates below)";
            $(".gettyResults").html(resultsBlock);

        }
    })
            .done(function () {
//                console.log("second success");
            })
            .fail(function () {
                console.log("Getty service error");
            })
            .always(function () {
//                console.log("finished");
            });

});


/*
 * Builds sparql query for Getty
 */
function sparqlQuery(locInfo) {

    var queryTable = "";
    for (variable in locInfo) {
        var json = locInfo[variable];
        var locJSON = JSON.parse(json.locationId.replace(/'/g, "\""));

        var location = locJSON.location_name;
        if (typeof json.preferredLocationName !== "undefined" && json.preferredLocationName !== "") {//has preferred
            location = json.preferredLocationName.toLowerCase();
        }
        var broader = locJSON.broader_name_1;
        broader = broader.charAt(0).toUpperCase() + broader.slice(1);


        if (broader === "") {
            broader = "world";
        }
        location = location.replace(/'/g, "\\'").replace(/`/g, "\\'");
        queryTable = queryTable + "(' \"" + location + "\" ' '" + location + "' '" + broader + "')\n";
    }


    var query = "select distinct ?inputTerm ?broaderTerm ?tgnId ?tgnType ?tgnPrefLabel ?tgnParents ?tgnLat ?tgnLong {\n" +
            "  VALUES (?ftsText ?inputTerm ?broaderTerm)\n" +
            "    { \n" +
            queryTable +
            "    }\n" +
            "    VALUES(?tgnBroaderMatchingType){\n" +
            "        #'inhabited places'@en\n" +
            "       (aat:300008347) \n" +
            "       #'provinces'@en\n" +
            "       (aat:300000774)\n" +
            "       #islands\n" +
            "       (aat:300008791)\n" +
            "    }\n" +
            "  ?tgnId skos:inScheme tgn: ;\n" +
            "    #gvp:placeType|(gvp:placeType/gvp:broaderGenericExtended) ?tgnBroaderMatchingType;\n" +
            "    luc:term ?ftsText;\n" +
            "    \n" +
            "    gvp:placeTypePreferred/gvp:prefLabelGVP [xl:literalForm ?tgnType];\n" +
            "    (gvp:broaderPartitiveExtended/skosxl:prefLabel)|(gvp:broaderPartitiveExtended/skosxl:altLabel)  [xl:literalForm ?broaderTermVal];\n" +
            "    gvp:prefLabelGVP [xl:literalForm  ?tgnPrefLabel];\n" +
            "    gvp:parentString ?tgnParents;\n" +
            "    foaf:focus/wgs:lat ?tgnLat;\n" +
            "    foaf:focus/wgs:long ?tgnLong;\n" +
            "    skosxl:prefLabel|skosxl:altLabel [xl:literalForm  ?term].    \n" +
            "  \n" +
            "  FILTER (lcase(str(?term)) = ?inputTerm).\n" +
            "  FILTER (lcase(str(?broaderTermVal)) = ?broaderTerm).  \n" +
            "}\n" +
            "order by ?inputTerm ?broaderTerm ?tgnParents\n";


//    console.log(query)

    return query;

}

/*
 * Saves location instance
 */
$("#saveLocation").click(function () {
    var $form = $("form.editLocationPopup");
    if ($form.find("#coords").val() === "" && ($form.find("#tgnId").val() !== "" || $form.find("#geoId").val() !== "")) {
        var preferredName = $("#preferredLocationName").val();
        if ($form.find("#geoId").val() !== "") {
            getCoordsFromGeoIdFillFormAndOptionallySave($form, $form.find("#geoId").val(), true, preferredName, preferredName);
        } else if ($form.find("#tgnId").val() !== "") {
            getCoordsFromTgnIdFillFormAndOptionallySave($form, $form.find("#tgnId").val(), true, preferredName, preferredName);
        }
    } else {

        saveLocation($form);
    }
});

function saveLocation($form) {
    $("#saveLocation").button("loading");
    var start = new Date();
    var updatingLocationMessage = messenger("Updating location!", 20);


    var params = $form.serializeArray();
    var values = {};
    $.each(params, function (i, field) {
        values[field.name] = field.value;
    });
//    console.log("MODAL VALUES");
//    console.log(JSON.stringify(values))


    var uncertain = false;
    if (typeof values.locationCertaintyCheckbox !== "undefined") {
        uncertain = true;
        var locationCertaintyComment = values.locationCertaintyComment;
    }
    var locationId = values.locationId;
    var preferredLocationName = values.preferredLocationName;
    var tgnId = values.tgnId;
    var geoId = values.geoId;
    var coords = values.coords;
    var other_name = values.other_name;

    /* Spinner experiment START*/
    var spinner = '<i class="fa fa-spinner fa-pulse  fa-fw"></i><span class="sr-only">Loading...</span>';
    var table = $('#locationsTable').DataTable();
    var row = table.row("[id*=\"" + locationId + "\"]");
//    console.log(locationId)
    var rowIndex = row.index();

    row.cell(rowIndex, 4).data(spinner).draw('page');
    row.cell(rowIndex, 5).data(spinner).draw('page');

    row.cell(rowIndex, 8).data(spinner).draw('page');
    row.cell(rowIndex, 9).data(spinner).draw('page');
    row.cell(rowIndex, 10).data(spinner).draw('page');
    /* Spinner experiment END*/



    var firstLetter = values.locationLabel.charAt(0).toLowerCase();
    if (firstLetter === "_") {// underscore is reserved, replace with -
        firstLetter = "-";
    }


    locationsDB.get(firstLetter).then(function (doc) {
//        console.log(doc)
//    instancesDB.get("locations").then(function (doc) {
        var instanceInfo = {
            "preferredName": preferredLocationName,
            "tgnId": tgnId,
            "geoId": geoId,
            "coords": coords,
            "other_name": other_name

        };


        var usedInstances = doc.instances;
        usedInstances[locationId] = appendJSONObject(usedInstances[locationId], instanceInfo);
        if (uncertain) {
            usedInstances[locationId].uncertain = locationCertaintyComment;
        } else {
            delete usedInstances[locationId].uncertain;
        }
//        instancesDB.put({
        locationsDB.put({
            _id: doc._id,
            _rev: doc._rev,
//            label: "locations",
            lastModified: new Date().toJSON(),
            instances: usedInstances
        }).then(function (response) {

            // handle response
            //Update values using Datatables
            var table = $('#locationsTable').DataTable();
            var row = table.row("[id*=\"" + locationId + "\"]");
            var rowIndex = row.index();

            row.cell(rowIndex, 4).data(preferredLocationName).draw('page');
            row.cell(rowIndex, 5).data(other_name).draw('page');

            var styleAttr = "";
            var titleAttr = "";

            if (uncertain) {
                styleAttr = "style='color:#CC0A0A'";
                titleAttr = locationUncertaintyTitleAttr;
                if (locationCertaintyComment !== "") {
                    titleAttr = "title='" + locationCertaintyComment + "'";
                    row.cell(rowIndex, 10).data(locationCertaintyComment).draw('page');
                } else {
                    row.cell(rowIndex, 10).data(locationUncertaintyMessage).draw('page');
                }
            } else {
                row.cell(rowIndex, 10).data("").draw('page');
            }
            if (tgnId !== "") {
                row.cell(rowIndex, 8).data("<a " + styleAttr + " " + titleAttr + " target='_blank' href='"+gettyQueryUrl+"/page/tgn/" + tgnId + "'>tgn:" + tgnId + "</a>").draw('page');
            } else {
                if (geoId === "") {
                    row.cell(rowIndex, 8).data("").draw('page');
                }
            }


            if (geoId !== "") {
                row.cell(rowIndex, 8).data("<a " + styleAttr + " " + titleAttr + " target='_blank' href='https://www.geonames.org/" + geoId + "'>geo:" + geoId + "</a>").draw('page');
            } else {
                if (tgnId === "") {
                    row.cell(rowIndex, 8).data("").draw('page');
                }
            }
            row.cell(rowIndex, 9).data(getLatLongLinkFromCoords(coords, uncertain, locationCertaintyComment)).draw('page');

            preferredLocationNames.push(preferredLocationName);

            updatingLocationMessage.hide();
            var time = new Date() - start;

            console.log("Took " + time / 1000 + " secs to update location!");
            $("#saveLocation").button("reset");
            $("#editLocationModal").modal("hide");



        }).catch(function (err) {
            console.log(err);
            console.log(("So now we get this error when we try to put() location: " + JSON.stringify(err)));
        });
    }).catch(function (err) {
        console.log(err);
        console.log(("So now we get this error when we try to get() location: " + JSON.stringify(err)));
        alert("FastCat: Unexpected error when trying to get locations! Contact support with following error message:" + JSON.stringify(err));
    });
}


/*
 * Edits vocabulary term (shows modal)
 */
$("body").on("click", ".editTerm", function () {
    var term = $(this).attr("data-term");
    var vocabId = $(this).attr("data-id");
    var vocabLabel = $(this).attr("data-vocab");
    publicVocabsDB_remote.get(vocabId).then(function (doc) {

        var preferredTerms = JSPath.apply(".terms..preferred", doc);
        var broaderTerms = JSPath.apply(".terms..broader", doc);

        var termJSON = doc.terms[term];
        if (typeof termJSON === "undefined") {//probably case mixup
            termJSON = doc.terms[term.toLowerCase()];
            if (typeof termJSON === "undefined") {//term does not exist!
                alert("FastCat: Term not found! Please contact support");
            }
        }

        var preferredTerm = defineUndefined(termJSON.preferred);
        var broaderTerm = defineUndefined(termJSON.broader);
        var form = createFormInput("term", "term", "hidden", "", term);
        form = form + createFormInput("vocabId", "vocabId", "hidden", "", vocabId);
        form = form + createFormInput("preferredTerm", "Preferred Term", "select", "Fill in Preferred Term", preferredTerm);
        form = form + createFormInput("broaderTerm", "Broader Term", "select", "Fill in Broader Term", broaderTerm);
        $(".modal-body>form.editTermPopup").html(form);
        $(".modal-title").html("Term name: " + term + " (Vocabulary: " + vocabLabel + ")");
        $(".select2").each(function () {
            var $select = $(this);
            var selectedValue = "";
            var selectTerms = "";
            if ($select.attr("id") === "preferredTerm") {
                selectedValue = preferredTerm;
                selectTerms = preferredTerms;
            } else if ($select.attr("id") === "broaderTerm") {
                selectedValue = broaderTerm;
                selectTerms = broaderTerms;
            }
            if (selectTerms.length > 0) {
                selectTerms = uniq(selectTerms);
            }
            var data = createSelect2Data(selectTerms);
            $select.select2({
                allowClear: true,
                tags: true,
                data: data.results,
                sorter: function (data) {
                    return data.sort(function (a, b) {
                        if (a.text > b.text) {
                            return 1;
                        }
                        if (a.text < b.text) {
                            return -1;
                        }
                        return 0;
                    });
                }
            });
            $select.val(selectedValue).trigger('change');
        });
    }).catch(function (err) {
        console.log(err);
        console.log(("So now we get this error when we try to get() it: " + JSON.stringify(err)));
        alert("FastCat: Unexpected error when trying to get vocabulary file " + vocabId + "! Contact support with following error message:" + JSON.stringify(err));
    });
});

/*
 * Saves vocabulary term 
 */
$("#saveTerm").click(function () {
    var $form = $("form.editTermPopup");
    var params = $form.serializeArray();
    var values = {};
    $.each(params, function (i, field) {
        values[field.name] = field.value;
    });
    var vocabId = values.vocabId;
    var term = values.term;
    var preferredTerm = values.preferredTerm;
    var thesaurusConn = values.thesaurusConn;
    var broaderTerm = values.broaderTerm;
    publicVocabsDB_remote.get(vocabId).then(function (doc) {
        var termInfo = {
            "preferred": preferredTerm,
            "broader": broaderTerm,
            "thesaurus": thesaurusConn

        };
        doc.terms[term.toLowerCase()] = appendJSONObject(doc.terms[term.toLowerCase()], termInfo);
        publicVocabsDB_remote.put({
            _id: vocabId,
            _rev: doc._rev,
            label: doc.label,
            lastModified: new Date().toJSON(),
            terms: doc.terms
        }).then(function (response) {
            // handle response
            //Update values using Datatables
            var table = $('#vocabs2Table').DataTable();
            var row = table.row("[id='" + term + "']");
            var rowIndex = row.index();
            row.cell(rowIndex, 4).data(preferredTerm).draw('page');
            row.cell(rowIndex, 5).data(broaderTerm).draw('page');
        }).catch(function (err) {
            console.log(err);
        });
    }).catch(function (err) {
        console.log(err);
        console.log(("So now we get this error when we try to get() it: " + JSON.stringify(err)));
        alert("FastCat: Unexpected error when trying to get vocabulary file " + vocabId + "! Contact support with following error message:" + JSON.stringify(err));
    });
});


/****************************************************pouchDB authentication methods*********************************************/
/*
 * Gets user
 */
function getUser() {
    templatesDB_remote.getSession().then(function (response) {
        console.log(response)
        //console.log(JSON.stringify(response))
        if (!response.userCtx.name) {
            // nobody's logged in
            console.log("nobody's logged in");
            window.open("login.html", "_self");
        } else {
            var username = response.userCtx.name;
            console.log(username + " is logged in!");
            $("span#user").html(username);
            templatesDB_remote.getUser(username).then(function (response) {
                userJSON = response;
                var visualLevel = response.level;
                if (visualLevel === "god") {
                    visualLevel = "sysadmin";
                }
                $(".user-header").html("<p>" + response.fullName + " (" + visualLevel + ")<br/><small>" + response.organization + "</small></p>");
                $("html").css("visibility", "visible");
            }).catch(function (error) {
                // handle error
                console.log(error);
                window.open("login.html", "_self");
            });
        }
    }).catch(function (error) {
        // handle error
        console.log(error);
        window.open("login.html", "_self");
    });
}
/*
 * User logs out method
 */
function logout() {
    templatesDB_remote.logOut().then(function (response) {
        console.log(response);
        window.open("login.html", "_self");
    }).catch(function (error) {
        // handle error
        console.log(error);
    });
}
/*
 * User logs out event
 */
$("#logout").click(function () {
    if (confirm("FastCat: Are you sure?")) {
        logout();
    }
});

/*
 * Creates user method
 */
$('form.userInfoPopup').validator().on('submit', function (e) {
    if (e.isDefaultPrevented()) {
        // handle the invalid form...
        alert("FastCat: Please fill in all fields properly!");
    } else {
        // everything looks good!
        e.preventDefault();
        var username = $("#username1").val();
        var fullName = $("#fullName").val();
        var organization = $("#organization").val();
        var email = $("#email").val();
        templatesDB_remote.putUser(username, {
            metadata: {
                email: email,
                organization: organization,
                fullName: fullName
            }
        }, function (err, response) {
            // etc.
            if (err) {
                console.log(err);
                alert("FastCat: Something went wrong!");
            } else {
                console.log(response);
                alert("FastCat: User info changed!");

                var visualLevel = userJSON.level;
                if (visualLevel === "god") {
                    visualLevel = "sysadmin";
                }

                $(".user-header").html("<p>" + fullName + " (" + visualLevell + ")<br/><small>" + organization + "</small></p>");
                $("#userModal").modal('hide');
            }
        });
    }
});

/*
 * Changes password method
 */
$('form.passwordPopup').validator().on('submit', function (e) {
    if (e.isDefaultPrevented()) {
        // handle the invalid form...
        alert("FastCat: Please fill in all fields properly!");
    } else {
        // everything looks good!
        e.preventDefault();
        var username = $("#username2").val();
        var password = $("#password").val();
        templatesDB_remote.changePassword(username, password, function (err, response) {
            if (err) {
                console.log(err);
                alert("FastCat: Something went wrong!");
                if (err.name === 'not_found') {
                    // typo, or you don't have the privileges to see this user
                } else {
                    // some other error
                }
            } else {
                console.log(response);
                alert("FastCat: User password changed!");
                $("#passwordModal").modal('hide');
            }
        });
    }
});
/*
 * Changes password event
 */
$("#pass").click(function () {
    $("#username2").val(userJSON.name);
});

/*
 * Gets user info event
 */
$("#profile").click(function () {
    $("#username1").val(userJSON.name);
    $("#fullName").val(userJSON.fullName);
    $("#organization").val(userJSON.organization);
    $("#email").val(userJSON.email);
});

/*
 * Compares JSON objects and shows changes
 */
function compareJSONObjsAndHighlightChanges(myObj1, myObj2) {
    // find keys
    var keyObj1 = Object.keys(myObj1);
    var keyObj2 = Object.keys(myObj2);
    // find values
    var valueObj1 = Object.values(myObj1);
    var valueObj2 = Object.values(myObj2);
    // find max length to iterate	
    if (keyObj1.length > keyObj2.length) {
        var biggestKey = keyObj1.length;
    } else {
        var biggestKey = keyObj2.length;
    }

    // now compare their keys and values 
    for (var i = 0; i < biggestKey; i++) {
        if (keyObj1[i] == keyObj2[i] && valueObj1[i] == valueObj2[i]) {
        } else {
            // it prints keys have different values
            highlightNewStatus(myObj2, keyObj2[i]);
        }
    }
}
/*
 * Highlights new status
 */
function highlightNewStatus(records, recordId) {
    var table = $('#recordsTable').DataTable();
    var row = table.row("[id='" + recordId + "']");
    var rowIndex = row.index();
    row.cell(rowIndex, 8).data("<b>" + records[recordId] + "</b>").draw();
}
/*
 * Compacts multilingual vocabularies (from many rows to one!) and also integrates international vocabs smoothly
 */
function compactGlobalVocabs($mergedRows) {
    var global = [];
    var globalizedRows = "";
    globalVocabs = {};
    $.each($mergedRows.find("tr"), function () {
        var $row = $(this);
        var vocabId = $row.attr("id");

        var vocabFamily = $row.attr("data-family");
        var languages = $mergedRows.find("tr[data-family='" + vocabFamily + "']").length;
//        console.log(vocabId + "---LANGS:" + languages)
        if (languages > 1) {
            if (global.indexOf(vocabFamily) === -1) {//First appearance

                if (vocabFamily === "status_capacity_role") {
                    vocabFamily = "status_capacity_role";
                    global.push("status_capacity_role");
                    global.push("status");
                    var $siblings = $mergedRows.find("tr[data-family=status], tr[data-family=status_capacity_role]");
                } else if (vocabFamily !== "status") {//
                    var $siblings = $mergedRows.find("tr[data-family=" + vocabFamily + "]");
                }

                if (typeof $siblings !== "undefined") {
                    var globalRow = mergeMultilingualVocabs($siblings);
                    var $globalRow = $(globalRow);

                    var langs = $globalRow.children("td:nth-child(3)").html();
                    var orgs = $globalRow.children("td:nth-child(5)").html();
//                    console.log("GLOBAL=" + vocabFamily)
//                    console.log(langs)
//                    console.log(fixInternational(langs))
                    $globalRow.children("td:nth-child(3)").html(fixInternational(langs));
                    $globalRow.children("td:nth-child(5)").html(fixInternational(orgs));


                    globalizedRows = globalizedRows + "<tr id='" + vocabFamily + "' data-family='" + vocabFamily + "'>" + $globalRow.html() + "</tr>";
                    global.push(vocabFamily);


                }


            }

//            console.log(globalizedRows)
        } else {
//            console.log("SOLO=" + vocabFamily)
//            console.log($row.html())
            var langs = $row.children("td:nth-child(3)").html();
            var orgs = $row.children("td:nth-child(5)").html();

//            console.log(langs)
//            console.log(fixInternational(langs))
            $row.children("td:nth-child(3)").html(fixInternational(langs));
            $row.children("td:nth-child(5)").html(fixInternational(orgs));


            globalizedRows = globalizedRows + "<tr id='" + vocabId + "' data-family='" + vocabFamily + "'>" + $row.html() + "</tr>";
        }
    });
    return globalizedRows;
}
/*
 * Fixes international languages and orgs 
 */
function fixInternational(vocabVars) {
    var replacedVars = vocabVars.replace(/,\s*/g, "<br/>");
    var uniqVars = uniq(replacedVars.split(/<br\/?>/));
    uniqVars = uniqVars.join("<br/>");

    return uniqVars;
}


/*
 * Backups crucial dbs
 */
$("body").on("click", "#backupButton", function () {
    dump(publicRecordsDB_remote, "TeamRecords_");
    dump(publicVocabsDB_remote, "TeamVocabs_");
    //WAS
//    dump(instancesDB, "TeamInstances_");
    //IS
    dump(locationsDB, "TeamLocations_");
    dump(personsDB, "TeamPersons_");
    dump(shipsDB, "TeamShips_");
    dump(organizationsDB, "TeamOrganizations_");

    console.log("Backup created!");
});
/*
 * Splits instance files into different DBs
 */
$("body").on("click", "#splitButton", function () {

    instancesDB.allDocs({
        include_docs: true
    }).then(function (result) {

        $.each(result.rows, function () {
            var insts = {};
            if (!this.error) {
                insts = appendJSONObject(insts, this.doc.instances);
            }
            var remoteDB = getInstanceDBsFromType(this.doc.label)[1];
            var type = this.doc.label;
            remoteDB.allDocs({
                include_docs: true
            }).then(function (result) {

                bulkUpdateDocs(remoteDB, result, type, insts);
                console.log(type + " instances DB ready!")
            }).catch(function (err) {
                console.log(err);
            });


        });

    }).catch(function (err) {
        console.log(err);
    });



    console.log("Splitting started!");
});


/*
 * Resets table
 */
$("body").on("click", ".resetTable", function () {
    var type = $(this).attr("data-type");
    showTableLoader(type);

    var tableId = type + "Table";

    var table = $('#' + tableId).DataTable();
    table.state.clear().destroy();
    createInstancesTableFromDocs(type);
});



/*
 * Mark as same action
 */
$("body").on("click", ".sameMark", function () {
    var type = $(this).attr("data-type");
    var tableId = type + "Table";
    currentInstanceTableId = tableId;
    var rows_selected = $('#' + tableId).DataTable().column(0).checkboxes.selected();

    if (rows_selected.length < 2) {
        alert("FastCat: Please choose at least 2 instances!");
    } else {
        $("#markAsSameModalLabel").html("Mark as same");
        $("#markAsSameModal").modal('show');
        buildSameAsForm(tableId, rows_selected, "markAsSame");
    }

});

/*
 * Admin method to merge instance file (development usage only!).
 * 
 */
$(".mergeDiffInstance").click(function () {

    var $this = $(this);
    var type = $this.attr("data-type");
    showTableLoader(type);

//WAS
//    instancesDB.get(type).then(function (doc) {
//console.log(doc)

//IS  


    var remoteDB = getInstanceDBsFromType(type)[1];
    remoteDB.allDocs({
        include_docs: true
    }).then(function (result) {
        var insts = {};
        $.each(result.rows, function () {
            if (!this.error) {
                insts = appendJSONObject(insts, this.doc.instances);
            }
        });
        var instances = insts;





        $.each(instances, function (index, value) {

            var instance = this;
            if (index.indexOf("'table':") !== -1) {
                delete instances[index];
            }
            if (typeof instance.diff !== "undefined") {
                delete instance.diff;
            }
        });


        console.log(instances)

//WAS
//        var improvedInstances = cleanInstances(doc.instances);
//        var improvedInstances = doc.instances;
//
//        return instancesDB.put({
//            _id: doc._id,
//            _rev: doc._rev,
//            label: doc.label,
//            lastModified: new Date().toJSON(),
//            instances: improvedInstances
//        }).then(function (response) {
//            // handle response
//            var table = $("#" + type + "Table").DataTable();
//            table.destroy();
//            createInstancesTableFromDocs(type);
//            alert("FastCat: Merge complete!");
//        }).catch(function (err) {
//            console.log(err);
//        });

        //IS       
        //
        bulkUpdateInstances(remoteDB, result, type, instances);




    }).catch(function (err) {
        console.log(err);
    });
});
/*
 * Admin method to repair vocab file.
 * Repair : 1) Delete not used terms
 *          2) Make all keys lowercase
 *        
 */
$(".repairVocabs").click(function () {

    publicVocabsDB_remote.allDocs({
        include_docs: true,
        descending: false
    }).then(function (result) {
        var bulk = [];
        $.each(result.rows, function () {
            var label = this.doc.label;
            var terms = this.doc.terms;

            $.each(terms, function (key) {

                if (getJSONsize(this.usage) === 0) {//Delete not used term
                    delete terms[key];
                } else {//copy from uppercase to lowercase key
                    var lowerKey = key.toLowerCase();
                    delete terms[key]; //delete upper
                    if (typeof terms[lowerKey] === "undefined") {//If term is new copy json
                        terms[lowerKey] = this;
                    }
                }
            });

            bulk.push(this.doc);

        });

        //Updating the documents in bulk  
        publicVocabsDB_remote.bulkDocs(bulk, function (err, response) {
            if (err) {
                return console.log(err);
            } else {
                console.log("Documents Updated Successfully");
            }
        });
    });
});
/*
 * Admin method to repair instance file.
 * Repair : 1) Make all keys lowercase
 *          2) Delete all not used instances
 *          3) Delete leftover "replacedBy" properties
 *          4) Delete empty "sameAs" properties, or sameAs with one instance that does not exist
 *          5) Adds template info in key and value (not in Locations!)
 */
$(".repairInstance").click(function () {
    var $this = $(this);
    var type = $this.attr("data-type");
    showTableLoader(type);

//WAS
//    instancesDB.get(type).then(function (doc) {
    // handle doc


    //IS  
    var remoteDB = getInstanceDBsFromType(type)[1];
    remoteDB.allDocs({
        include_docs: true
    }).then(function (result) {
        var insts = {};
        $.each(result.rows, function () {
            if (!this.error) {
                insts = appendJSONObject(insts, this.doc.instances);
            }
        });
        var instances = insts;



        $.each(instances, function (index, value) {
            var instance = this;
            if (typeof instance.sameAs === "undefined") {//same as blocks should not have template!!!

                if (type !== "locations") {//Locations need not have template
                    if (index.indexOf("'template'") === -1) {
                        var uniqueTemplates = uniq(JSPath.apply(".*.template", instance.usage));
                        if (typeof uniqueTemplates !== "undefined") {
                            if (uniqueTemplates.length > 1) {
                                //For each template create a clone instance and modify usage block accordingly
                                uniqueTemplates.forEach(function (template) {
                                    var updatedIndex = index.replace(/\}/g, ",'template':'" + template.toLowerCase() + "'}"); //Adding template
                                    instances[updatedIndex] = instance;
                                    var clonedInstance = jsonCopy(instances[updatedIndex]);
                                    Object.keys(clonedInstance.usage).forEach(function (record) {
                                        if (clonedInstance.usage[record].template !== template) {
                                            delete clonedInstance.usage[record];
                                        }
                                    });
                                    instances[updatedIndex] = clonedInstance;
                                });
                            } else if (uniqueTemplates.length === 1) {//simply add template in instance key
                                var updatedIndex = index.replace(/\}/g, ",'template':'" + uniqueTemplates[0].toLowerCase() + "'}"); //Adding template
                                instances[updatedIndex] = instance;
                            }
                            delete instances[index]; //delete legacy value
                        }

                    }
                    var instanceValue = instance.value;
                    if (typeof instanceValue !== "undefined" && instanceValue.indexOf("'template':") === -1) {
                        var uniqueTemplates = uniq(JSPath.apply(".*.template", instance.usage));
                        if (typeof uniqueTemplates !== "undefined") {
                            if (uniqueTemplates.length > 0) {
                                var updatedValue = instanceValue.replace(/\}/g, ",'template':'" + uniqueTemplates[0] + "'}"); //Adding template
                                instance.value = updatedValue;
                            }
                        }
                    }
                }
            }

        });
        var improvedInstances = cleanInstances(instances);
//        return instancesDB.put({
//            _id: doc._id,
//            _rev: doc._rev,
//            label: doc.label,
//            lastModified: new Date().toJSON(),
//            instances: improvedInstances
//        }).then(function (response) {
//            // handle response
//            var table = $("#" + type + "Table").DataTable();
//            table.destroy();
//            createInstancesTableFromDocs(type);
//            alert("FastCat: Repair complete!");
//        }).catch(function (err) {
//            console.log(err);
//        });

        //IS       
        //
        bulkUpdateInstances(remoteDB, result, type, improvedInstances);

    }).catch(function (err) {
        console.log(err);
    });
});


/*
 * Mark different occurence action
 */
$("body").on("click", ".diffOcc", function () {
    var $btn = $(this);
    var instanceType = $btn.attr("data-type");
    showTableLoader(instanceType);

    var instanceId = $btn.attr("data-instance");
    var recordId = $btn.attr("data-recordId");
    var occIndex = $btn.attr("data-index");

    console.log(instanceId)

    //WAS
    //instancesDB.get(instanceType).then(function (doc) {

    //IS

    var keys = getInstanceDBSpecificFiles(instanceType, new Array(instanceId));
    var remoteDB = getInstanceDBsFromType(instanceType)[1];
    remoteDB.allDocs({
        include_docs: true,
        keys: keys
    }).then(function (result) {
        var insts = {};
        $.each(result.rows, function () {
            if (!this.error) {
                insts = appendJSONObject(insts, this.doc.instances);
            }
        });
        var instances = insts;
//        console.log(instances)


        var instance = instances[instanceId.toLowerCase()];
        var recordUsages = instance.usage[recordId];
        var occs = recordUsages.occurences;
        var chosen = occs[occIndex];
        var chosenId = JSON.stringify(chosen).replace(/"/g, "'");

        var diffJSON = instance.diff;
        if (typeof diffJSON === "undefined") {
            var diffTable = new Array();
            diffTable.push(chosenId);
            instance.diff = diffTable;
        } else {
            instance.diff.push(chosenId);
        }

        var cloneInstance = jsonCopy(instance);
        delete cloneInstance.diff;

        for (var i in cloneInstance.usage) {
            if (i === recordId) {
                for (j in cloneInstance.usage[recordId].occurences) {
                    if (j !== occIndex) {
                        delete cloneInstance.usage[recordId].occurences[j];
                    }
                }
            } else {
                delete cloneInstance.usage[i];
            }
        }


        var value = cloneInstance.value;
        var cloneValue = value.replace(/\}/g, ',' + chosenId.substring(1)); //Adding table info
        cloneInstance.value = cloneValue;


        var key = instanceId.toLowerCase().replace(/\}/g, ',' + chosenId.substring(1).toLowerCase()); //Adding table info
        var cloneJSON = {};
        cloneJSON[key] = cloneInstance;
        instances = appendJSONObject(instances, cloneJSON);

        var improvedInstances = instances;
//        var improvedInstances = cleanInstances(doc.instances);
//        
        console.log(improvedInstances)
        //IS
        bulkUpdateInstances(remoteDB, result, instanceType, improvedInstances);


//        return instancesDB.put({
//            _id: doc._id,
//            _rev: doc._rev,
//            label: doc.label,
//            lastModified: new Date().toJSON(),
//            instances: improvedInstances
//        }).then(function (response) {
//            // handle response
//            var table = $("#" + instanceType + "Table").DataTable();
//            table.destroy();
//            createInstancesTableFromDocs(instanceType);
//        }).catch(function (err) {
//            console.log(err);
//        });
    });
    $btn.parentsUntil("tr").parent().remove(); //visual

});
/*
 * Adds/Removes preferred term
 */
$("body").on("click", ".addRemPref", function () {
    var rows_selected = new Array();
    var tableId = $(this).parentsUntil("table").parent().attr("id");
    currentInstanceTableId = tableId;
    var $row = $(this).parentsUntil("tr").parent();
    var rowId = $row.attr("data-value");
    rows_selected.push(rowId);

    var $markDiffButtons = $row.find(".markDiff");
    if ($markDiffButtons.length > 0) {//If part of sameAs

        $markDiffButtons.each(function (index) {
            var subId = $(this).attr("data-value");
            rows_selected.push(subId);
        });
    } else {
        var rowId = $(this).attr("data-value");
        rows_selected.push(rowId);
    }


    $("#markAsSameModal").modal('show');
    buildSameAsForm(tableId, uniq(rows_selected), "preferred");
});
/*
 * Mark different action
 */
$("body").on("click", ".markDiff", function () {


    var instanceId = $(this).attr("data-id");
    var instanceType = $(this).attr("data-type");
    showTableLoader(instanceType);
//    console.log(instanceId)
    //WAS
//    instancesDB.get(instanceType).then(function (doc) {
//        var instances = doc.instances;
//        console.log(instances)

//IS
    var instancesInvolved = [];
    var $row = $(this).parentsUntil("tr").parent();
    instancesInvolved.push($row.attr("data-value"));

    $row.find(".markDiff").each(function () {
        instancesInvolved.push($(this).attr("data-value"));
    });

    var keys = getInstanceDBSpecificFiles(instanceType, uniq(instancesInvolved));
    var remoteDB = getInstanceDBsFromType(instanceType)[1];
    remoteDB.allDocs({
        include_docs: true,
        keys: keys
    }).then(function (result) {
        var insts = {};
        $.each(result.rows, function () {
            if (!this.error) {
                insts = appendJSONObject(insts, this.doc.instances);
            }
        });
        var instances = insts;


        var replacedByInstanceId = instances[instanceId].replacedBy;
        if (typeof instances[replacedByInstanceId] !== "undefined") {//if there is no sameAs reference, no need to delete it
            var sameAsInstances = instances[replacedByInstanceId].sameAs;
            sameAsInstances.splice(sameAsInstances.indexOf(instanceId), 1);
            if (sameAsInstances.length > 1) {
                instances[replacedByInstanceId].sameAs = sameAsInstances;
            } else {

                if (sameAsInstances.length === 1) {//If last in group, remove sameAs and replacedBy

                    delete instances[replacedByInstanceId];
                    if (typeof instances[sameAsInstances[0]] !== "undefined") {
                        delete instances[sameAsInstances[0]].replacedBy;
                    }
                }

            }
        }

        delete instances[instanceId].replacedBy;
        console.log(instances)

//WAS
//        var improvedInstances = doc.instances;
//        var improvedInstances = cleanInstances(doc.instances);

//        return instancesDB.put({
//            _id: doc._id,
//            _rev: doc._rev,
//            label: doc.label,
//            lastModified: new Date().toJSON(),
//            instances: improvedInstances
//        }).then(function (response) {
//            // handle response
//            var table = $("#" + instanceType + "Table").DataTable();
//            table.destroy();
//            createInstancesTableFromDocs(instanceType);
//        }).catch(function (err) {
//            console.log(err);
//        });

//IS
        bulkUpdateInstances(remoteDB, result, instanceType, instances);



    });
});


/*
 * Same as method
 */
function sameAsHandler(action, type, sameAsBlockKey, sameAsBlockJSON) {
    showTableLoader(type);

    var instancesInvolved = uniq(currentInstances_selected);

//WAS
//    instancesDB.get(type).then(function (doc) {
//        console.log(doc)
//        var dbInstances = doc.instances;


//IS
    let allInstances = Array.from(instancesInvolved);
    allInstances.push(sameAsBlockKey);

    var keys = getInstanceDBSpecificFiles(type, allInstances);
    var remoteDB = getInstanceDBsFromType(type)[1];
    remoteDB.allDocs({
        include_docs: true,
        keys: keys
    }).then(function (result) {
        var insts = {};
        $.each(result.rows, function () {
            if (!this.error) {
                insts = appendJSONObject(insts, this.doc.instances);
            }
        });




        var dbInstances = insts;
        if (action === "preferred") {

            instancesInvolved.forEach(function (entry) {
                //For some reason & turns to &amp;, so I have to turn back to &
                entry = entry.replace(/&amp;/g, "&");
                if (entry.indexOf("template':") === -1) {//group instance
                    if (sameAsBlockKey === entry) {//Block chosen as preferred

                        if (sameAsBlockJSON[sameAsBlockKey].value !== dbInstances[entry].value) {//If value is different, must modify it
                            sameAsBlockJSON[sameAsBlockKey].sameAs = dbInstances[entry].sameAs;
                            dbInstances[entry] = sameAsBlockJSON[sameAsBlockKey];
                        }
                        //Do nothing
                    } else {//Block not chosen. Must modify its sameAs table to remove other entry

                        if (typeof dbInstances[entry].sameAs !== "undefined") {

                            var blockEntrySameAs = jsonCopy(dbInstances[entry].sameAs);
                            dbInstances[entry].sameAs.forEach(function (sameAsEntry) {
                                if (instancesInvolved.indexOf(sameAsEntry) !== -1) {
                                    blockEntrySameAs.splice(blockEntrySameAs.indexOf(sameAsEntry), 1);
                                }
                                if (blockEntrySameAs.length === 0) {//If block term is no longer used delete it and copy its sameAs to the newOne!
                                    delete dbInstances[entry];
                                    var sameAsTable = sameAsBlockJSON[sameAsBlockKey].sameAs;
                                    sameAsTable.splice(sameAsTable.indexOf(entry), 1);
                                }

                            });
                        }
                    }
                } else {//normal instance

                    //compare entry with sameAsCreated entry
                    if (instancesInvolved.length === 1 && areInstancesJSONEqual(entry, sameAsBlockKey) === true) {//Delete replacedBy only if editing single term preferred and same
                        delete dbInstances[entry].replacedBy;
                    } else {//Edit replacedBy and either add new block or edit existing one

                        if (typeof dbInstances[entry].replacedBy !== "undefined") {
                            dbInstances[entry].replacedBy = sameAsBlockKey;
                        } else {
                            var replacedJSON = {};
                            replacedJSON["replacedBy"] = sameAsBlockKey;
                            dbInstances[entry] = appendJSONObject(dbInstances[entry], replacedJSON);
                        }
                        if (typeof dbInstances[sameAsBlockKey] !== "undefined") {//block already exists, edit its sameAs or add new sameAs(BAD CODE)
                        } else {//new block
                            dbInstances = appendJSONObject(dbInstances, sameAsBlockJSON);
                        }

                    }
                }

            });
        } else {//Mark as same
            var realInstanceIds = new Array();
            var diffDetected = false;
            instancesInvolved.forEach(function (entry) {
                //For some reason & turns to &amp;, so I have to turn back to &
                entry = entry.replace(/&amp;/g, "&");
                var sameAsComponent = dbInstances[entry];
                var replacedJSON = {};
                if (typeof sameAsComponent.sameAs !== "undefined" && typeof sameAsComponent.usage === "undefined") {//Get same as instances and then delete old group
                    realInstanceIds = realInstanceIds.concat(sameAsComponent.sameAs);
                    sameAsComponent.sameAs.forEach(function (subEntry) {
                        replacedJSON["replacedBy"] = sameAsBlockKey;
                        dbInstances[subEntry] = appendJSONObject(dbInstances[subEntry], replacedJSON);
                    });
                    delete dbInstances[entry]; //dangerous

                } else {
                    if (entry.indexOf("table':") !== -1) {
                        var entryWithoutPositionInfo = entry.replace(/,'tablevariable':'.*?\}/g, "}").replace(/&/g, "&amp;");

                        if (getJSONsize(instancesInvolved) === 2 && instancesInvolved.indexOf(entryWithoutPositionInfo) !== -1) {
                            diffDetected = true;
                            delete dbInstances[entry];
                        }

                    }
                    if (diffDetected === false) {
                        realInstanceIds.push(entry);
                    }

                }
                if (diffDetected === false) {
                    //Add replacedBy property
                    replacedJSON["replacedBy"] = sameAsBlockKey;
                    sameAsComponent = appendJSONObject(sameAsComponent, replacedJSON);
                    sameAsBlockJSON[sameAsBlockKey].sameAs = uniq(realInstanceIds);
                    dbInstances = appendJSONObject(dbInstances, sameAsBlockJSON);
                } else {

                    var originalInstance = dbInstances[realInstanceIds[0]];
                    delete originalInstance.diff;
                    delete originalInstance.replacedBy;
                    delete dbInstances[sameAsBlockKey];
                }
            });
//
        }

//         WAS
//         var improvedInstances = dbInstances;
//         //        var improvedInstances = cleanInstances(dbInstances);
//         return instancesDB.put({
//         _id: doc._id,
//         _rev: doc._rev,
//         label: doc.label,
//         lastModified: new Date().toJSON(),
//         instances: improvedInstances
//         }).then(function (response) {
//         // handle response
//         var table = $("#" + type + "Table").DataTable();
//         table.destroy();
//         
//         createInstancesTableFromDocs(type);
//         }).catch(function (err) {
//         console.log(err);
//         });



        //IS       
        //
        bulkUpdateInstances(remoteDB, result, type, dbInstances);

//        var instancesPerLetter = splitInstancesPerLetter(type, dbInstances);
//
//        var docs = [];
//        $.each(result.rows, function () {
//            if (this.error) {
//                var fileJSON = {
//                    "_id": this.key,
//                    "lastModified": new Date().toJSON(),
//                    "instances": instancesPerLetter[this.key]
//                };
//                this.doc = fileJSON;
//            } else {
//                this.doc.instances = instancesPerLetter[this.id];
//                this.doc.lastModified = new Date().toJSON();
//            }
//            docs.push(this.doc);
//        });
//
//        remoteDB.bulkDocs(docs).then(function (result) {
//            // handle response
//            var table = $("#" + type + "Table").DataTable();
//            table.destroy();
//            createInstancesTableFromDocs(type);
//        }).catch(function (err) {
//            console.log(err);
//        });

    }).catch(function (err) {
        console.log(err);
    });
}
/*
 * Checks if 2 instance json keys are equal or not
 * @param {type} instance1
 * @param {type} instance2
 * @returns {unresolved}
 */
function areInstancesJSONEqual(instance1, instance2) {
    var json1 = JSON.parse(instance1.replace(/'/g, '"'));
    var json2 = JSON.parse(instance2.replace(/'/g, '"'));
    delete json1.template;
    delete json2.template;
    $.each(json1, function (key, value) {

        if (value === "") {
            delete json1[key];
        }
    });
    $.each(json2, function (key, value) {
        // console.log(value);
        if (value === "") {
            delete json2[key];
        }
    });


    return jsonEqual(json1, json2);

}

/*
 * Save mark as same action
 */
$("#saveMarkAsSame").click(function () {
    var action = "markAsSame";
    if ($("#saveMarkAsSame").hasClass("preferred")) {
        action = "preferred";
    }
    var $form = $("form.editMarkAsSamePopup");
    var params = $form.serializeArray();
    var values = {};
    $.each(params, function (i, field) {
        if (field.value === "666") {
            var inputText = $("#" + field.name + "666").next("input");
            values[field.name] = inputText.val();
        } else {
            values[field.name] = field.value;
        }

    });

    var modalValuesString = JSON.stringify(values);
    modalValuesString = modalValuesString.replace(/Radios":/g, '":');
    var keyWithoutPercent = modalValuesString.replace(/"/g, "'");

    var percentJSON = '"percent":"' + $("#percent").val() + '"';
    modalValuesString = modalValuesString.replace(/\}/g, ',' + percentJSON + '}'); //Adding percent

    var sameAsValues = JSON.parse(modalValuesString);
    modalValuesString = modalValuesString.replace(/"/g, "'");
    currentInstances_selected = tableLowerCase(currentInstances_selected);
    var sameAsJSON = {"sameAs": tableLowerCase(currentInstances_selected)};
    var valueJSON = {"value": keyWithoutPercent};
    sameAsValues = appendJSONObject(valueJSON, sameAsValues);
    sameAsValues = appendJSONObject(sameAsValues, sameAsJSON);

    var fullSameAsJSONKey = keyWithoutPercent.toLowerCase();
    var fullSameAsJSON = {};
    fullSameAsJSON[fullSameAsJSONKey] = sameAsValues;
    var type = currentInstanceTableId.replace(/Table/g, "");

    sameAsHandler(action, type, fullSameAsJSONKey, fullSameAsJSON);

});

/*
 * Formats sameAs rows in instance tables
 */
function formatSameAsBlockRowsJSON(sameAsBlockRowsJSON) {
    var sameAsBlockJSON = [];


    var sameAsInstances = sameAsBlockRowsJSON.length;
    var rowColsLength = sameAsBlockRowsJSON[0].length;
    var columns = {};
    sameAsBlockRowsJSON.forEach(function (row, rowIndex) {
//         console.log(index)
//         console.log(row)

        row.forEach(function (cellValue, index) {
            if (typeof cellValue === "undefined" || cellValue === "undefined" || cellValue.length === 0) {
                cellValue = "&nbsp;";
            }
            if (rowIndex === sameAsInstances - 1) {//last row
                if (index === 0) {//first col only put same as block id
                    columns[index] = cellValue;
                } else {

                    if (cellValue !== "" && cellValue !== "&nbsp;" && (columns[index].indexOf(cellValue + "<") !== -1 || columns[index].indexOf(">" + cellValue) !== -1 || columns[index] === cellValue)) {//Value already exists, so make it bold and do not put it again
                        columns[index] = columns[index].replace(cellValue, "<b>" + cellValue + "</b>");
                    } else {
                        if (cellValue !== "" && cellValue !== "&nbsp;") {
                            //Test if last row value is the only one and if yes, do not use BOLD
                            var valuesSoFarTrimmed = columns[index].replace(/(&nbsp;<hr style='width:100%'\/>)*&nbsp;/g, "");
                            if (valuesSoFarTrimmed.length === 0) {
                                columns[index] = columns[index] + "<hr style='width:100%'/>" + cellValue;
                            } else {
                                columns[index] = columns[index] + "<hr style='width:100%'/><b>" + cellValue + "</b>";
                            }

                        }
                    }

                    if (index === rowColsLength - 2) {//Status col
                        if (columns[index].indexOf("Reviewed and ready for publishing") !== -1) {
                            columns[index] = "Reviewed and ready for publishing";
                        } else if (columns[index].indexOf("Ready for Review") !== -1) {
                            columns[index] = "Ready for Review";
                        } else {
                            columns[index] = "Under processing";
                        }
                    }
                }
            } else {

                if (typeof columns[index] === "undefined") {
                    columns[index] = cellValue;
                } else {
                    columns[index] = columns[index] + "<hr style='width:100%'/>" + cellValue;
                }
            }

        });


    });
//console.log($table.find("tr").last().attr("data-value"))
    var colKeys = Object.keys(columns);
//    var singleRowHtml = "<tr id=\"" + columns[0] + "\" data-id=\"" + columns[0] + "\" data-value=\"" + $table.find("tr").last().attr("data-value") + "\">";

    for (var i = 0; i < colKeys.length; i++) {
        var cellValue = columns[colKeys[i]];
        if (cellValue.startsWith("<b>") && cellValue.endsWith("</b>")) {
            cellValue = cellValue.replace(/<\/?b>/g, "");
        }
//        var cellStyle = "";
//        if (i === 0 || i === rowColsLength - 2) {
//            cellStyle = " style='vertical-align: middle;'";
//        }
//        singleRowHtml = singleRowHtml + "<td" + cellStyle + ">" + cellValue + "</td>";
        sameAsBlockJSON.push(cellValue);

    }
//    singleRowHtml = singleRowHtml + "</tr>";
    //Must talk if we want this or not
//    var $returnRow = $(singleRowHtml);
    if (sameAsInstances === 2) {
        var lastColContents = sameAsBlockJSON[rowColsLength - 1];
        var $tempDiv = $("<div>" + lastColContents + "</div>");
        $tempDiv.find(".markDiff").parent().hide();
        sameAsBlockJSON[rowColsLength - 1] = $tempDiv.html();
//        $returnRow.children("td").last().find(".markDiff").parent().hide();
//        
//        DONT KNOW ABOUT NEXT LINE
//        singleRowHtml = "<tr id=\"" + $returnRow.attr("id") + "\" data-value=\"" + $table.find("tr").last().attr("data-value") + "\">" + $returnRow.html() + "</tr>";
    }


//    return sameAsBlockRowsJSON[0];
    return sameAsBlockJSON;
}



/*
 * Formats sameAs rows in instance tables
 */
function formatSameAsBlockRows(sameAsBlockRows) {
    var $table = $("<table>" + sameAsBlockRows + "</table>");
    var sameAsInstances = $table.find("tr").length - 1;
    var columns = {};
    var rowColsLength = $table.find("tr").first().children("td").length;
    $table.find("tr").each(function (index) {
        var rowIndex = index;
        var $row = $(this);


        $row.children("td").each(function (index) {
            var cellValue = $(this).html();
            if (typeof cellValue === "undefined" || cellValue === "undefined" || cellValue.length === 0) {
                cellValue = "&nbsp;";
            }

            if (rowIndex === sameAsInstances) {//last row
                if (index === 0) {//first col only put same as block id
                    columns[index] = $(this).html();
                } else {

                    if (cellValue !== "" && cellValue !== "&nbsp;" && (columns[index].indexOf(cellValue + "<") !== -1 || columns[index].indexOf(">" + cellValue) !== -1 || columns[index] === cellValue)) {//Value already exists, so make it bold and do not put it again
                        columns[index] = columns[index].replace(cellValue, "<b>" + cellValue + "</b>");
                    } else {
                        if (cellValue !== "" && cellValue !== "&nbsp;") {
                            //Test if last row value is the only one and if yes, do not use BOLD
                            var valuesSoFarTrimmed = columns[index].replace(/(&nbsp;<hr style='width:100%'\/>)*&nbsp;/g, "");
                            if (valuesSoFarTrimmed.length === 0) {
                                columns[index] = columns[index] + "<hr style='width:100%'/>" + cellValue;
                            } else {
                                columns[index] = columns[index] + "<hr style='width:100%'/><b>" + cellValue + "</b>";
                            }

                        }
                    }

                    if (index === rowColsLength - 2) {//Status col
                        if (columns[index].indexOf("Reviewed and ready for publishing") !== -1) {
                            columns[index] = "Reviewed and ready for publishing";
                        } else if (columns[index].indexOf("Ready for Review") !== -1) {
                            columns[index] = "Ready for Review";
                        } else {
                            columns[index] = "Under processing";
                        }
                    }
                }
            } else {

                if (typeof columns[index] === "undefined") {
                    columns[index] = cellValue;
                } else {
                    columns[index] = columns[index] + "<hr style='width:100%'/>" + cellValue;
                }
            }

        });
    });
    var colKeys = Object.keys(columns);
    var singleRowHtml = "<tr id=\"" + columns[0] + "\" data-id=\"" + columns[0] + "\" data-value=\"" + $table.find("tr").last().attr("data-value") + "\">";

    for (var i = 0; i < colKeys.length; i++) {
        var cellValue = columns[colKeys[i]];
        if (cellValue.startsWith("<b>") && cellValue.endsWith("</b>")) {
            cellValue = cellValue.replace(/<\/?b>/g, "");
        }
        var cellStyle = "";
        if (i === 0 || i === rowColsLength - 2) {
            cellStyle = " style='vertical-align: middle;'";
        }
        singleRowHtml = singleRowHtml + "<td" + cellStyle + ">" + cellValue + "</td>";
    }
    singleRowHtml = singleRowHtml + "</tr>";
    //Must talk if we want this or not
    var $returnRow = $(singleRowHtml);
    if (sameAsInstances === 1) {
        $returnRow.children("td").last().find(".markDiff").parent().hide();
        singleRowHtml = "<tr id=\"" + $returnRow.attr("id") + "\" data-value=\"" + $table.find("tr").last().attr("data-value") + "\">" + $returnRow.html() + "</tr>";
    }

    return singleRowHtml;
}

/*------------------------------------------------------------Same as modal form functions-----------------------------------------*/

/*
 * Builds sameAs modal form
 */
function buildSameAsForm(tableId, rows_selected, action) {
    $("#percent").val("");
    var html = "";
    currentInstances_selected = new Array();
    html = createSameAsHeadingBlocks(tableId);
    $(".editMarkAsSamePopup").html(html);
    $.each(rows_selected, function (rowIndex, rowId) {
        var row = rows_selected[rowIndex];
        if (typeof row !== "undefined") {
            var $row = $("tr[id=\"" + row + "\"]");
            currentInstances_selected.push(row);

            row = row.replace(/'/g, "\"");
            var rowJSON = JSON.parse(row);
            $.each(Object.keys(rowJSON), function (keyIndex) {
                if (this + "" === "percent") {
                    $("#percent").val(rowJSON["percent"]);
                } else {
                    appendRadioButtonsInSameAs(this + "", rowJSON, rowIndex);
                }
            });
            if (action !== "preferred") {
                //Get replaced instances values too (just in case)
                var $markDiffButtons = $row.find(".markDiff");
                if ($markDiffButtons.length > 0) {//If part of sameAs

                    $markDiffButtons.each(function (index) {
                        var subId = $(this).attr("data-value");
                        currentInstances_selected.push(subId);
                        subId = subId.replace(/'/g, "\"");
                        var subRowJSON = JSON.parse(subId);
                        $.each(Object.keys(subRowJSON), function (keyIndex) {
                            appendRadioButtonsInSameAs(this + "", subRowJSON, rowIndex);
                        });
                    });
                }
            }


        }
    });
    $.each($(".editMarkAsSamePopup").find("div.col-sm-6"), function (index) {

        var $headerDiv = $(this);
        if ($headerDiv.children(".radio").length > 0) {
            var key = $headerDiv.attr('class').split(' ')[1];

            if (key === "registration_folio") {//Bad hack due to Spanish templates
                key = "registration_number";
            }
            if ($headerDiv.find("small").length === 0) {//Hiding free text for instance/vocabulary fields
                var radioHtml = "<div class='radio'>" +
                        "<label>" +
                        "<input type='radio' name='" + key + "Radios' id='" + key + "Radios666' value='666'>" +
                        "<input type='text' name='' class='newValue'/>" +
                        "</label>" +
                        "</div>";
                $headerDiv.append(radioHtml);
            }
        } else {
            $headerDiv.remove(); //Not sure if I should remove or simply hide. Worried about side effects.
        }
        $headerDiv.find("input").first().prop("checked", true);
    });
    if (action === "preferred") {
        $(".modal-title").html("Add/Remove preferred term");
        $("#saveMarkAsSame").removeClass("markAsSame").addClass("preferred");
        if (currentInstances_selected.length === 1) {
            $("#percent").parentsUntil(".form-group").parent().hide(); //Hide percentage
        }

    } else {
        $("#saveMarkAsSame").removeClass("preferred").addClass("markAsSame");
        $("#percent").parentsUntil(".form-group").parent().show(); //Show percentage
    }
    if (tableId === "shipsTable" || tableId === "personsTable") {
        getPreferredTermsAndInstances(tableId);
    }
    return html;
}

/*
 * Gets values from same As form
 */
function getValuesFromForm(selector) {
    var $entities = $(selector + " input");
    var table = [];
    $entities.each(function () {
        if ($(this).val() !== "" && $(this).val() !== "666") {
            table.push($(this).val());
        }
    });
    return table;

}

/*
 * Gets all preferred terms and instances for specific type (ship or person)
 */
function getPreferredTermsAndInstances(tableId) {
    if (tableId === "shipsTable") {//ships

        var locationsTable = getValuesFromForm(".construction_location");
        var typesTable = getValuesFromForm(".type");
        var flagsTable = getValuesFromForm(".flag");
        var ownersTable = getValuesFromForm(".owner_company");


        getPreferredInstances("locations", "location_name", locationsTable, ".construction_location");
        getPreferredInstances("organizations", "name", ownersTable, ".owner_company");
        getPreferredTerms("ship_type", typesTable, ".type", "Ship type");
        getPreferredTerms("flag", flagsTable, ".flag", "Flag");
    } else {//persons
        var locationsTable = getValuesFromForm(".place_of_birth");
        getPreferredInstances("locations", "location_name", locationsTable, ".place_of_birth");
        var statusesTable = getValuesFromForm(".status");
        getPreferredTerms("status", statusesTable, ".status", "Profession|Status");
    }
}
/*
 * Gets preferred terms for specific vocabulary 
 */
function getPreferredTerms(vocab, table, formFieldSelector, vocabLabel) {

    var $form = $("form.editMarkAsSamePopup");

    if (table.length > 0) {
        publicVocabsDB_remote.allDocs({
            include_docs: true,
            startkey: vocab,
            endkey: vocab + "\ufff0"
        }, function (err, response) {
            if (err) {
                console.log(err);
            } else {
                $.each(response.rows, function () {
                    if (typeof this.doc !== "undefined") {
                        $.each(this.doc.terms, function (key) {
                            if (table.indexOf(this.value) !== -1) {

                                var preferred = this.preferred;
                                var $block = $form.find(formFieldSelector).find("input[value='" + this.value + "']");
                                $block.attr("value", preferred);
                                var link;
                                if (typeof preferred !== "undefined" && preferred !== "") {
                                    link = `<a data-url="team.html?table=vocabulary&vocabId=` + vocab + `&vocabLabel=` + vocabLabel + `&term=` + encodeURIComponent(this.value) + `" href="#" class="tabOpener">` + preferred + ` (<span style='text-decoration: line-through;'>` + this.value + `</span>)</a>`;
                                    $block.next("span").html(link);

//                                    $block.next("span").html("<a target='_blank' href='team.html?table=vocabulary&vocabId=" + vocab + "&vocabLabel=" + vocabLabel + "&term=" + encodeURIComponent(this.value) + "'>" + preferred + " (<span style='text-decoration: line-through;'>" + this.value + "</span>)</a>");
                                } else {

                                    link = `<a data-url="team.html?table=vocabulary&vocabId=` + vocab + `&vocabLabel=` + vocabLabel + `&term=` + encodeURIComponent(this.value) + `" href="#" class="tabOpener">` + this.value + `</a>`;
                                    $block.next("span").html(link);

//                                    $block.next("span").html("<a target='_blank' href='team.html?table=vocabulary&vocabId=" + vocab + "&vocabLabel=" + vocabLabel + "&term=" + encodeURIComponent(this.value) + "'>" + this.value + "</a>");
                                }
                            }
                        });
                    }
                });
            }
        });
    }

}

/*
 * Gets preferred instances for specific instance 
 * 22/1/2020 Added code to create links for Locations in hierarchy such as malgrat (cervera)/lerida
 */
function getPreferredInstances(type, field, table, formFieldSelector) {
    var $form = $("form.editMarkAsSamePopup");
//    console.log(table)
//    console.log(type)
//    console.log(field)
    if (table.length > 0) {

        if (type === "locations") {
            var keys = [];
            var fullLocations = table;
            var shortLocations = [];
            table.forEach(function (item, index) {
                var firstLetter = item.charAt(0).toLowerCase();
                if (firstLetter === "_") {// underscore is reserved, replace with -
                    firstLetter = "-";
                }
                keys.push(firstLetter);
                if (item.indexOf("/") !== -1) {
                    var locAndPossiblyType = item.substring(0, item.indexOf("/"));
                    var actualLoc = locAndPossiblyType;
                    if (locAndPossiblyType.indexOf("(") !== -1) {
                        actualLoc = locAndPossiblyType.substring(0, item.indexOf("(")).trim();
                    }
                    shortLocations.push(actualLoc);
                } else {
                    shortLocations.push(item);
                }
            });
            keys = uniq(keys);
//            console.log(keys)
//            console.log(shortLocations)
            table = shortLocations;

        }
        //WAS
        //        instancesDB.get(type).then(function (doc) {

        //IS
        var remoteDB = getInstanceDBsFromType(type)[1];
        remoteDB.allDocs({
            include_docs: true,
            keys: keys
        }).then(function (result) {
            var insts = {};
            $.each(result.rows, function () {
                if (!this.error) {
                    insts = appendJSONObject(insts, this.doc.instances);
                }
            });
            var instances = insts;


            $.each(instances, function (key) {
//                console.log(this)
                if (table.indexOf(this[field].trim()) !== -1) {
//                    console.log("++++++++++++++++++++++++++++")
                    if (type === "locations") {
                        var indexFound = table.indexOf(this[field].trim());
//                        console.log(this)
//                        console.log(table)
//                        console.log(fullLocations)
//                        console.log(fullLocations[indexFound])


                        var matchFound = true;
//                        console.log(table.indexOf(this[field]))

                        var locationName = this.location_name;
                        if (fullLocations[indexFound].indexOf("/") !== -1) {
//                            console.log("SPECIAL CASE")
//                            console.log(JSON.stringify(this))
                            var fullLocation = fullLocations[indexFound];
                            var locationParts = fullLocation.split("/");
                            var locMap = {};
                            for (var i = 0; i < locationParts.length; i++) {//0 is source, 1 is broader1, 2 is broader2


                                var locParts = locationParts[i].split(/\s*\(/);

                                if (i === 0) {
                                    if (locParts.length > 1) {
                                        locMap["location_name"] = locParts[0]
                                        locMap["type"] = locParts[1].replace(/\)/g, "");
                                        if (locMap["type"] !== this.type) {
                                            matchFound = false;
                                        }

                                    } else {
                                        locMap["location_name"] = locationParts[i];
                                    }
                                } else if (i === 1) {
                                    if (locParts.length > 1) {
                                        locMap["broader_name_1"] = locParts[0]

                                        locMap["broader_type_1"] = locParts[1].replace(/\)/g, "");
                                        if (locMap["broader_type_1"] !== this.broader_type_1) {
                                            matchFound = false;
                                        }
                                    } else {
                                        locMap["broader_name_1"] = locationParts[i];
                                    }
                                    if (locMap["broader_name_1"] !== this.broader_name_1) {
                                        matchFound = false;
                                    }
                                } else if (i === 2) {
                                    if (locParts.length > 1) {
                                        locMap["broader_name_2"] = locParts[0]
                                        locMap["broader_type_2"] = locParts[1].replace(/\)/g, "");
                                        if (locMap["broader_type_2"] !== this.broader_type_2) {
                                            matchFound = false;
                                        }

                                    } else {
                                        locMap["broader_name_2"] = locationParts[i];
                                    }
                                    if (locMap["broader_name_2"] !== this.broader_name_2) {
                                        matchFound = false;
                                    }
                                }
                            }
//                            console.log("RES=" + matchFound)
//                            console.log(locMap)
//                            console.log(fullLocation)

                            if (matchFound) {
                                var $block = $form.find(formFieldSelector).find("input[value='" + fullLocation + "']");
                                locationName = fullLocation;
                            }
                        } else {
                            var $block = $form.find(formFieldSelector).find("input[value='" + locationName + "']");
                        }
                        if (matchFound) {
                            var preferred = this.preferredName;

                            $block.attr("value", preferred);
                            var link;
                            if (typeof preferred !== "undefined" && preferred !== "") {
                                link = `<a data-type=` + type + ` data-key=` + encodeURIComponent(key) + ` href="#" class="tabOpener">` + preferred + ` (<span style='text-decoration: line-through;'>` + locationName + `</span>)</a>`;
                                $block.next("span").html(link);
//                            $block.next("span").html("<a target='_blank' href=\"team.html?table=locations&id=" + encodeURIComponent(key) + "\">" + preferred + " (<span style='text-decoration: line-through;'>" + this.location_name + "</span>)</a>");
                            } else {
                                link = `<a data-type=` + type + ` data-key=` + encodeURIComponent(key) + ` href="#" class="tabOpener">` + locationName + `</a>`;
                                $block.next("span").html(link);

//                            $block.next("span").html("<a target='_blank' href=\"team.html?table=locations&id=" + encodeURIComponent(key) + "\">" + this.location_name + "</a>");
                            }
//                            console.log(link)
                        }
                    } else {
                        if (typeof this.replacedBy !== "undefined" && this.replacedBy !== "") {

                            var replacedBy = instances[this.replacedBy];
                            var preferred = replacedBy.name;

                            var $block = $form.find(formFieldSelector).find("input[value='" + this.name + "']");
                            $block.attr("value", preferred);
                            var link;
                            if (typeof preferred !== "undefined" && preferred !== "") {
                                link = `<a data-type=` + type + ` data-key=` + encodeURIComponent(key) + ` href="#" class="tabOpener">` + preferred + ` (<span style='text-decoration: line-through;'>` + this.name + `</span>)</a>`;
                                $block.next("span").html(link);
//                                $block.next("span").html("<a target='_blank' href=\"team.html?table=organizations&id=" + encodeURIComponent(key) + "\">" + preferred + " (<span style='text-decoration: line-through;'>" + this.name + "</span>)</a>");
                            } else {
                                link = `<a data-type=` + type + ` data-key=` + encodeURIComponent(key) + ` href="#" class="tabOpener">` + this.name + `</a>`;
                                $block.next("span").html(link);
//                                $block.next("span").html("<a target='_blank' href=\"team.html?table=organizations&id=" + encodeURIComponent(key) + "\">" + this.name + "</a>");
                            }

                        }


                    }

                }

            });

        });
    }

}

/*
 * Close (if open) and open new tab from links inside sameAs Modal
 */
$("body").on("click", ".tabOpener", function () {
    if (typeof tabId !== "undefined") {
        tabId.close();
    }


    var $this = $(this);
    var type = $this.attr("data-type");
    var url;
    if (typeof type !== "undefined") {//Instance
        var encodedKey = $this.attr("data-key");
        url = "team.html?table=" + type + "&id=" + encodedKey;
    } else {//Vocab
        url = $this.attr("data-url");
    }
    tabId = window.open(url, '_blank');
});

/*
 * Gets focus on new value when clicked 
 */

$("body").on("focus", ".newValue", function () {
    $(this).prev().prop("checked", true);
}
);
/*
 * Appends radio buttons in sameAs blocks
 * @param {type} key
 * @param {type} rowJSON
 * @param {type} index
 * @returns {undefined}
 */
function appendRadioButtonsInSameAs(key, rowJSON, index) {

    if (rowJSON[key] !== "") {
        var key2 = key;
        if (key === "registration_folio") {//Bad hack due to Spanish templates
            key2 = "registration_number";
        }

        var radioHtml = "<div class='radio'>" +
                "<label>" +
                "<input type='radio' name='" + key2 + "Radios' id='" + key2 + "Radios" + index + "' value='" + rowJSON[key] + "' checked><span>" +
                rowJSON[key] +
                "</span></label>" +
                "</div>";
        var selector = "." + key;
        if (key !== "row" && key !== "table" && key !== "template" && key !== "tableVariable") {
            if ($(selector).find("input[value='" + rowJSON[key].replace(/&amp;/g, "&") + "']").length === 0) {//append only if it's unique (no need for duplicates)
                $(selector).append(radioHtml);
            }
        }
    }
}
/*
 * Creates sameAs headings  
 */
function createSameAsHeadingBlocks(tableId) {
    var html = "";
    if (tableId === "organizationsTable") {
        html = "<div class='col-sm-6 name'><h4>Legal Entity name</h4></div>";
    } else if (tableId === "locationsTable") {
        html = "<div class='col-sm-6 name'><h4>Source Location name</h4></div>" +
                "<div class='col-sm-6 preferredName'><h4>Corrected/Vernacular Location name</h4></div>" +
                "<div class='col-sm-6 type'><h4>Location Type</h4></div>" +
                "<div class='col-sm-6 broader_name_1'><h4>Broader Location name</h4></div>" +
                "<div class='col-sm-6 broader_type_1'><h4>Broader Location type</h4></div>" +
                "<div class='col-sm-6 tgnId'><h4>TGN iD</h4></div>" +
                "<div class='col-sm-6 geoId'><h4>Geonames iD</h4></div>";
    } else if (tableId === "personsTable") {
        html = "<div class='col-sm-6 name'><h4>Name</h4></div>" +
                "<div class='col-sm-6 surname_a'><h4>Surname A</h4></div>" +
                "<div class='col-sm-6 surname_b'><h4>Surname B</h4></div>" +
                "<div class='col-sm-6 maiden_name'><h4>Maiden name</h4></div>" +
                "<div class='col-sm-6 fathers_name'><h4>Fathers name</h4></div>" +
                "<div class='col-sm-6 place_of_birth'><h4>Place of Birth <small>* This field is a Location instance</small></h4></div>" +
                "<div class='col-sm-6 date_of_birth'><h4>Date of Birth</h4></div>" +
                "<div class='col-sm-6 date_of_death'><h4>Date of Death</h4></div>" +
                "<div class='col-sm-6 registration_number'><h4>Registration number</h4></div>" +
                //status or status_capacity_role are considered the same due to users using them in the wrong way
                "<div class='col-sm-6 status status_capacity_role'><h4>Status| Capacity |Role <small>* This field is a term that belongs to a vocabulary</small></h4></div>";
    } else if (tableId === "shipsTable") {
        html = "<div class='col-sm-6 name'><h4>Name</h4></div>" +
                "<div class='col-sm-6 previous_name'><h4>Previous name</h4></div>" +
                "<div class='col-sm-6 type'><h4>Type <small>* This field is a term that belongs to a vocabulary</small></h4></div>" +
                "<div class='col-sm-6 signal'><h4>Call signal</h4></div>" +
                "<div class='col-sm-6 construction_location'><h4>Construction location <small>* This field is a Location instance</small></h4></div>" +
                "<div class='col-sm-6 construction_date'><h4>Construction date</h4></div>" +
                "<div class='col-sm-6 telegraphic_code'><h4>Telegraphic code</h4></div>" +
                "<div class='col-sm-6 flag'><h4>Flag <small>* This field is a term that belongs to a vocabulary</small></h4></div>" +
                "<div class='col-sm-6 owner_company'><h4>Owner Company <small>* This field is a Legal Entity instance</small></h4></div>" +
                "<div class='col-sm-6 registration_list'><h4>Registration list</h4></div>" +
                "<div class='col-sm-6 registration_folio registration_number'><h4>Registration number</h4></div>" +
                "<div class='col-sm-6 registration_location'><h4>Registration location</h4></div>";
    }
    return html;
}


/*-------------------------------------------------------Generic methods----------------------------------------------- */
/*
 * Cleans instance files from not used instances and also makes keys lowercase
 */
function cleanInstances(instances) {

    var keys = Object.keys(instances);
    console.log("Found " + keys.length + " instances")

    keys.forEach(function (key, index) {
        var instance = instances[key];
        if (typeof instance.usage !== "undefined") {//Has usage property
            if (getJSONsize(instance.usage) === 0) {//empty usage
                delete instances[key];
            } else {//If usage, make key lowercase
                var lowerKey = key.toLowerCase();
                delete instances[key];
                instances[lowerKey] = instance;
            }
        } else {//no usage property
            if (typeof instance.sameAs !== "undefined") {//Has sameAs property 

                var sameAsSize = getJSONsize(instance.sameAs);
                if (sameAsSize === 0) {//empty sameAs
                    delete instances[key];
                } else {
                    if (sameAsSize === 1) {
                        if (typeof instances[instance.sameAs] === "undefined") {
                            delete instances[key];
                        } else if (typeof instances[instance.sameAs].replacedBy === "undefined") {
                            delete instances[key];
                        }
                    }//What about sameAs groups with more than 1 that no longer exist?
                }
            } else {
                delete instances[key]; //If no sameAs and no usage, delete instance
            }

        }
        //Delete broken replacedBy
        var replacedBy = instance.replacedBy;
        if (typeof replacedBy !== "undefined") {
            var rep = instances[replacedBy];
            if (typeof rep === "undefined") {//if replacement does not exist, delete replacedBy
                delete instance.replacedBy; //Dangerous?
            }
        }



    });
    console.log("Found " + getJSONsize(instances) + " useful instances");
    return instances;
}

/*
 * Converts table to lowercase
 */
function tableLowerCase(table) {
    for (var i = 0; i < table.length; i++) {
        table[i] = table[i].toLowerCase();
    }
    return table;
}
function showTableLoader(type) {
    var $tbody = $("#" + type + "Table").children("tbody");
    $("#" + type + "Table").css("opacity", "0.2");
    $tbody.html("<div class='loader'></div>");
}
function hideTableLoader(type) {
    $("#" + type + "Table").css("opacity", "1");
}


/*
 * Get only the instance JSON files you need and not the whole DB
 */
function getInstanceDBSpecificFiles(type, instances) {
    var letters = [];
    console.log(instances)

    instances.forEach(function (key, index) {
        var letter = getInstanceFirstLetterPerType(type, JSON.parse(key.replace(/'/g, "\"")));
        letters.push(letter);
    });
    return uniq(letters);
}





