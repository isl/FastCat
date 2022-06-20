/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//var lastTableRowIdWithBorders;
//var lastTableWithBorders;
///////////////////pouchDB//////////////////////////////////////////
var servicesAddress = "http://139.91.183.91:8084";
//Test blazegraph: http://83.212.168.32:10214/blazegraph/
//Official blazegraph: http://83.212.169.164:10080/blazegraph/
var blazegraphURL = "http://83.212.168.32:10214/blazegraph";

var recordId, templateTitle, template, uniqueFilename;
var recordVocabs = [];
var cellsProcessed = 0;
var subTable;
var parentTableInstance;
var mode;
var instancesJSON;
var termsPerVocab;

function putDB(json) {
    var url_string = window.location.href;
    var url = new URL(url_string);
    recordId = url.searchParams.get("name");


    myRecordsDB_local.get(recordId).then(function (doc) {
        return myRecordsDB_local.put({
            _id: recordId,
            _rev: doc._rev,
            template: doc.template,
            status: doc.status,
            data: json
        });
    }).then(function (response) {

        saveRecordRemotely(recordId);

        ///////////////SAVE MODAL///////////         
        $("#successful_save").modal('show');
        setTimeout(function () {
            $("#successful_save").modal('hide');
        }, 800);

    }).catch(function (err) {
        console.log("File does not exist in pouchDB! Saved for the very first time.");
        if (err.name === "not_found") {
            var template = url.searchParams.get("template");
            var record = {
                _id: recordId,
                template: template,
                data: json
            };
            myRecordsDB_local.put(record).then(function (response) {
                saveRecordRemotely(recordId);

                $("#successful_save").modal('show');
                setTimeout(function () {
                    $("#successful_save").modal('hide');
                }, 800);

//                myRecordsDB_local.replicate.to(publicRecordsDB_remote, {retry: true, doc_ids: [recordId]}).on('complete', function() {//added retry in case connection fails
//                    console.log("File (" + recordId + " rev: " + response.rev + ") replicated to server!");
//                }).on('error', onRepError);
//                function onRepError(err) {
//                    console.log("Problem replicating file! " + JSON.stringify(err));
//                }
            });
        } else {
            download_backup_json();
            console.log(("So now we get this error when we try to get() it: " + JSON.stringify(err)));
            alert("FastCat: Record exported but an unexpected error when trying to save record " + recordId + "! Contact support with following error message:" + JSON.stringify(err));

        }
    });
}


function updateInstanceFile(type, typeInstances) {

    
    //WAS
//    instancesDB.get(type).then(function (doc) {//TODO write code to properly update file     
    //        // handle doc

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

        

        var instancesFound = typeInstances.instances;
        //First of all get ids of instances found in record
        var instanceValuesFound = JSPath.apply(".instances..value", typeInstances);
        var usagesFound = JSPath.apply(".instances..usage", typeInstances);
        var newInstanceValues = instanceValuesFound.slice(0);//Clone not copy to avoid propagation!

        //Then traverse stored instances
        var docInstances = Object.keys(instances);
        docInstances.forEach(function (instance, index) {


            var lowerInstance = instance.toLowerCase();

            //Adding template
            if (type !== "locations") {
                if (lowerInstance.indexOf("'template':") === -1) {
                    lowerInstance = lowerInstance.replace(/\}/g, ",'template':'" + templateTitle.toLowerCase() + "'}");//Adding template
                }
            }

            if (instanceValuesFound.indexOf(instance) !== -1) {//If instance exists in record
//                console.log(instance)
//                console.log(lowerInstance)
//                console.log(usagesFound[instanceValuesFound.indexOf(instance)][recordId])
                if (typeof instances[lowerInstance] !== "undefined") {
                    instances[lowerInstance].usage[recordId] = usagesFound[instanceValuesFound.indexOf(instance)][recordId];
                    newInstanceValues.splice(instanceValuesFound.indexOf(instance), 1);
                }

            } else {//If instance does not exist in record
                if (typeof instances[lowerInstance] !== "undefined") {
                    if (typeof instances[lowerInstance].usage !== "undefined") {
                        delete instances[lowerInstance].usage[recordId];
                    }
                }
            }

        });
        
        newInstanceValues.forEach(function (instance, index) {//Adding new terms!          
            var json = {};
            var lowerInstance = instance.toLowerCase();
            json[lowerInstance] = instancesFound[instance];
            instances = appendJSONObject(instances, json);

        });
//        console.log(instances)
        //IS
        bulkUpdateDocs(remoteDB, result, type, instances);
        console.log("Updated " + type + " with " + getJSONsize(instancesFound) + " instances!");
        
        instance_call++;
        
        $("#exporting_modal").find('#exported_text').html('Uploaded <b>'+type+'</b> with <b>'+getJSONsize(instancesFound)+ "</b> instances!" );
        
        if(instance_call===1){ 
           $("#exporting_modal").find('#progress_number').attr('style', "width: 25%");
        }else if(instance_call===2){           
           $("#exporting_modal").find('#progress_number').attr('style', "width: 50%");
        }else if (instance_call===3){ 
           $("#exporting_modal").find('#progress_number').attr('style', "width: 75%");
        }
        
      //  console.log(type)
         if (instance_call===4) {
            $("#exporting_modal").find('#progress_number').attr('style', "width: 100%");
            $("#exporting_modal").modal('hide');
            
            myRecordsDB_local.get(recordId).then(function (doc) {
                //console.log(doc.status);
                if (doc.status === "Public") {
                    $("#successful_save").modal('show');
                    setTimeout(function () {
                        $("#successful_save").modal('hide');
                    }, 800);
                    $(this).off('shown.bs.modal');

                }
            });
           
        }
    


    }).catch(function (err) {
        console.log(err);
        //WAS (OBSOLETE with new design)
//        if (err.name === "not_found") {//first time, create file
//            instancesDB.put(typeInstances).then(function (response) {
//                // handle response
//                console.log("Created " + type + " file for the first time!");
//            }).catch(function (err) {
//                console.log(err);
//            });
//
//
//        }
    });

    
}
function uploadInstance(recordId, localStorageName, type) {
    var allInstances = localStorage.getItem(localStorageName);
    
    
    //if (typeof allInstances !== "undefined") {
    if ((typeof allInstances !== "undefined") && (allInstances !== null)) {
        var allInstancesJSON = JSON.parse(allInstances);
        var recordInstances = allInstancesJSON[recordId];
        var instancesForDB = getInstances(type, recordInstances);
        updateInstanceFile(type, instancesForDB);
       
    }else{
        instance_call++;
		
		if (instance_call===4) {
            $("#exporting_modal").find('#progress_number').attr('style', "width: 100%");
            $("#exporting_modal").modal('hide');
            
            myRecordsDB_local.get(recordId).then(function (doc) {
                console.log(doc.status);
                if (doc.status === "Public") {
                    $("#successful_save").modal('show');
                    setTimeout(function () {
                        $("#successful_save").modal('hide');
                    }, 800);
                    $(this).off('shown.bs.modal');

                }
            });
           
        }
    }
}

var instance_call; 

function uploadInstances(recordId) {
     instance_call = 0;
     
    
    console.log("-----------------UPDATING INSTANCES----------------------");
    uploadInstance(recordId, "SHIPS", "ships");
    uploadInstance(recordId, "PERSONS", "persons");
    uploadInstance(recordId, "ORGS", "organizations");
    uploadInstance(recordId, "LOCS", "locations");
   
    
    

}

function  getInstances(type, json) {
    instancesJSON = {};
    walkInstanceJSON(type, json, "");
    var results = createInstancesJSON(type);

    return results;
}

//function minifyInstances(json) {
//    var mapInstances = {};
//    json.forEach(function(instance, index) {
//        console.log(instance.value);
//        mapInstances[instance.value] = instance.usage[recordId].occurences[0];
//        console.log(instance.usage[recordId].occurences)
////       console.log(JSON.stringify(instance));
//    });
//    console.log(mapInstances)
//}

//function concatAllJSONvalues(json) {
//    var append = "";
//    $.each(json, function(key, value) {
//        append = append + "|" + value;
//    });
//    return append.substring(1);
//}

function walkInstanceJSON(type, json, path) {//Must find a way to add all occurences

    for (var key in json) {
        var value = json[key];
        if (typeof value === "object") {
//            console.log(key + ": " + value);
            walkInstanceJSON(type, value, path + "." + key);
        } else {
//            console.log(path);
//            console.log(json)
            var fields = JSON.stringify(json).replace(/"/g, "'").replace(/'\s+'/g, "''").replace(/'&nbsp;'/g, "''");//trying to trim stuff

//            console.log(fields);
            //Adding template
            if (type !== "locations") {
                if (fields.indexOf("'template':") === -1) {
                    fields = fields.replace(/\}/g, ",'template':'" + templateTitle + "'}");//Adding template
                }
            }



            var fieldsJSON = {"value": fields};
            var instanceParts = appendJSONObject(fieldsJSON, json);
            var tableAndRow = path.split("\.row_");
            if (tableAndRow !== null && tableAndRow.length === 2) {
                var table = tableAndRow[0].substring(1);
                var row = tableAndRow[1];
                var occurence = {
                    "tableVariable": table,
                    "table": table,
                    "row": parseInt(row) + 1
                };
                var occurences = [];
                occurences.push(occurence);
                var recordJSON = {
                    "title": uniqueFilename,
                    "template": templateTitle,
                    "occurences": occurences
                };
                var json = {};
                json[recordId] = recordJSON;
                var instanceObj = {
                    usage: {}
                };
                instanceObj["usage"] = json;
                var entireBlock = appendJSONObject(instanceParts, instanceObj);

                if (typeof instancesJSON[fields] === "undefined") {//New instance
                    instancesJSON[fields] = entireBlock;
                } else {
                    var occsSoFar = instancesJSON[fields].usage[recordId].occurences;
                    var currentOcc = entireBlock.usage[recordId].occurences[0];
                    var sameTableFound = false;
                    if (type === "locations") {
                        //Following snippet is used to group row numbers in same table. Now that dismatching is an option, grouping is used only in locations
                        for (var i = 0; i < occsSoFar.length; i++) {
                            if (occsSoFar[i].table === currentOcc.table) {//create multiple positions in same row to conserve space                         
                                instancesJSON[fields].usage[recordId].occurences[i].row = instancesJSON[fields].usage[recordId].occurences[i].row + ", " + currentOcc.row;
                                sameTableFound = true;
                            }
                        }
                    }
                    if (sameTableFound === false) {//If instance has only one occurence in that table, add entire occurence block
                        instancesJSON[fields].usage[recordId].occurences.push(currentOcc);
                    }
                }
            }
            return;
        }
    }
}

function createInstancesJSON(id) {
    var instanceObj = {
        _id: id,
        label: id,
        lastModified: new Date().toJSON(),
        instances: instancesJSON
    };
    return instanceObj;
}


function resolveConflict(champion, championTime, contenders) {
    console.log("Champion is:" + champion + " with time:" + championTime);
    console.log("Contenders are:" + contenders);
    if (typeof contenders !== "undefined") {

        contenders.forEach(function (contender, index) {

            publicRecordsDB_remote.get(recordId, {rev: contender}).then(function (response) {
                var contenderTime = response.data.record_information.date_until;
//                console.log(contenderTime + " vs " + championTime);
//                console.log(contenderTime > championTime)
                if (contenderTime > championTime) {//New champion
                    console.log("Will delete:" + champion + " with time:" + championTime)

                    publicRecordsDB_remote.remove(recordId, champion).then(function (doc) {
// yay, we're done
                        console.log("Good riddens");
                    }).catch(function (err) {
// handle any errors
                    });
                    champion = contender;
                    championTime = contenderTime;
                } else {
                    console.log("Will delete:" + contender + " with time:" + contenderTime)
                    publicRecordsDB_remote.remove(recordId, contender).then(function (doc) {
// yay, we're done
                        console.log("Good riddens");
                    }).catch(function (err) {
// handle any errors
                    });
                }
            })
        });
    }

    return champion;
}


function fetchDB() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    recordId = url.searchParams.get("name");
    templateTitle = url.searchParams.get("templateTitle");
    template = url.searchParams.get("template");
    var data;
    myRecordsDB_local.get(recordId).then(function (doc) {
// handle response
        uniqueFilename = createFilename(doc, templateTitle);
        $("#unique_filename").html(uniqueFilename);
        if (mode === "teamView") {
            adminDB.get("status").then(function (doc) {
                var recordStatus = doc.records[recordId];
                if (typeof recordStatus === "undefined") {
                    recordStatus = "Under processing";
                }
                if (recordStatus.indexOf("Published") === -1) {//Not published, so hide useless undo publish
                    $(".undoPublish").hide();
                }
                $("#unique_filename").next("div").append("<div id='recordStatus'>Status: " + recordStatus + "</div>");
            });


        }
        data = doc.data;
        var status = "";
        if (doc.status) {
            status = doc.status;
        }
        if (status !== "Public") {
            $('#zip_export').hide();
        }
        load(data, status);
        //load(data);

    }).catch(function (err) {

        if (err.toString().indexOf("Maximum call stack size") !== -1) {//Too many calls!
            console.log(err.toString() + " on loading record.");
            alert("FastCat: Something went wrong while loading record. Please refrain from saving record unless you have checked it thoroughly!");
        } else {
            console.log("New file not yet saved in pouchDB! Filling with url params instead!");
            if (err.name === "not_found") {
                autofill(url, template);
            } else {
                console.log(("So now we get this error when we try to get() it: " + err));
                console.log(err);
//                console.log(("So now we get this error when we try to get() it: " + JSON.stringify(err)));
                alert("FastCat: Unexpected error when trying to load record " + recordId + "! Contact support with following error message:" + JSON.stringify(err));
            }
        }

    });
}

function autofill(url, template) {
    var separator = ", ";
    var authorName = url.searchParams.get("authorName");
    var authorSurname = url.searchParams.get("authorSurname");
    catalogue_info.setDataAtCell(0, 3, authorName);
    catalogue_info.setDataAtCell(0, 4, authorSurname);
    var templateTitle = url.searchParams.get("templateTitle");
    if (template === "Austrian Loyd") {

        var date = url.searchParams.get("date");
        source_identity_data.setDataAtCell(0, 3, date);
        uniqueFilename = templateTitle + separator + date + separator + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);
    } else if (template === "Census Odessa") {

        var fonds = url.searchParams.get("fonds");
        var series = url.searchParams.get("series");
        var file = url.searchParams.get("file");
        var streetName = url.searchParams.get("street_name");
        var streetNumber = url.searchParams.get("streetNumber");
        var date = url.searchParams.get("date");
        source_identity_data.setDataAtCell(0, 2, fonds);
        source_identity_data.setDataAtCell(0, 3, series);
        source_identity_data.setDataAtCell(0, 4, file);
        source_identity_data.setDataAtCell(0, 7, streetName);
        source_identity_data.setDataAtCell(0, 8, streetNumber);
        source_identity_data.setDataAtCell(0, 9, date);
        var tripleValue = fonds + "." + series + "." + file;
        uniqueFilename = templateTitle + separator + tripleValue + separator + streetName + separator + streetNumber + separator + date + separator + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);
    } else if (template === "Civil Register") {

        var bookNumber = url.searchParams.get("bookNumber");
        var typeOfRegister = url.searchParams.get("typeOfRegister");
        var bookYear = url.searchParams.get("book_year");
        var topographicSignature = url.searchParams.get("book_topographic_signature");


        source_identity_data.setDataAtCell(0, 3, bookNumber);
        source_identity_data.setDataAtCell(0, 4, typeOfRegister);
        source_identity_data.setDataAtCell(0, 5, bookYear);
        source_identity_data.setDataAtCell(0, 7, topographicSignature);

        uniqueFilename = templateTitle + separator + bookNumber + separator + bookYear + separator + topographicSignature + separator + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);
    } else if (template === "Students Register") {

        var registerNumber = url.searchParams.get("registerNumber");
        var bookDateFrom = url.searchParams.get("bookDateFrom");
        var bookDateTo = url.searchParams.get("bookDateTo");
        var bookDate = bookDateFrom + "-" + bookDateTo;
        source_identity_data.setDataAtCell(0, 6, registerNumber);
        source_identity_data.setDataAtCell(0, 8, bookDateFrom);
        source_identity_data.setDataAtCell(0, 9, bookDateTo);
        uniqueFilename = templateTitle + separator + registerNumber + separator + bookDate + separator + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);
    } else if (template === "Crew List") {

        var shipType = url.searchParams.get("ship_type_es");
        var shipName = url.searchParams.get("ship_name_es");
        var constructionLocation = url.searchParams.get("location_es");
        ship_record_hot.setDataAtCell(0, 1, shipName);
        ship_record_hot.setDataAtCell(0, 3, shipType);
        ship_record_hot.setDataAtCell(0, 4, constructionLocation);
        uniqueFilename = templateTitle + separator + shipType + separator + shipName + separator + constructionLocation + separator + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);
    } else if (template === "Crew List_IT") {
        var shipName = url.searchParams.get("ship_name_it");
        var bookDate = url.searchParams.get("bookDate");
        ship_record_hot.setDataAtCell(0, 0, shipName);
        source_identity_data.setDataAtCell(0, 4, bookDate);
        uniqueFilename = templateTitle + separator + shipName + separator + bookDate + separator + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);
    } else if (template === "Crew_List_ES") {
        var shipName = url.searchParams.get("ship_name_es");
        var bookDate = url.searchParams.get("bookDate");
        ship_record_hot.setDataAtCell(0, 0, shipName);
        source_identity_data.setDataAtCell(0, 5, bookDate);
        uniqueFilename = templateTitle + separator + shipName + separator + bookDate + separator + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);

    } else if (template === "Payroll_RU") {
        var fondNumber = url.searchParams.get("fonds_number");
        var seriesNumber = url.searchParams.get("series_number");
        var fileNumber = url.searchParams.get("file_number");
        var dateFrom = url.searchParams.get("dateFrom");
        var dateTo = url.searchParams.get("dateTo");
        source_identity_data.setDataAtCell(0, 2, fondNumber);
        source_identity_data.setDataAtCell(0, 4, seriesNumber);
        source_identity_data.setDataAtCell(0, 5, fileNumber);
        source_identity_data.setDataAtCell(0, 7, dateFrom);
        source_identity_data.setDataAtCell(0, 8, dateTo);
        uniqueFilename = templateTitle + separator + fondNumber + separator + seriesNumber + separator + fileNumber + separator + dateFrom + "-" + dateTo + separator + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);
    } else if (template === "Maritime Workers_IT") {
        var bookDate = url.searchParams.get("bookNumber");
        source_identity_data.setDataAtCell(0, 2, bookDate);
        uniqueFilename = templateTitle + separator + bookDate + separator + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);
    } else if (template === "Notarial Deeds") {

        var archive = url.searchParams.get("source_name");
        var sourceDateFrom = url.searchParams.get("source_year_from");
        var sourceDateTo = url.searchParams.get("source_year_to");

        source_identity_data.setDataAtCell(0, 0, archive);
        source_identity_data.setDataAtCell(0, 3, sourceDateFrom);
        source_identity_data.setDataAtCell(0, 4, sourceDateTo);
        uniqueFilename = templateTitle + separator + archive + separator + sourceDateFrom + "-" + sourceDateTo + separator + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);
    } else if (template === "Census_LaCiotat") {

        var bookDate = url.searchParams.get("bookDateFrom");
        source_identity_data.setDataAtCell(0, 4, bookDate);
        uniqueFilename = templateTitle + separator + bookDate + separator + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);
    } else if (template === "Sailors_Register") {

        var bookNumber = url.searchParams.get("bookNumber");
        source_identity_data.setDataAtCell(0, 4, bookNumber);
        uniqueFilename = templateTitle + separator + bookNumber + separator + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);
    } else if (template === "Maritime_Register") {

        var bookDateFrom = url.searchParams.get("bookDateFrom");
        var bookDateTo = url.searchParams.get("bookDateTo");
        var bookDate = bookDateFrom + "-" + bookDateTo;
        source_identity_data.setDataAtCell(0, 8, bookDateFrom);
        source_identity_data.setDataAtCell(0, 9, bookDateTo);
        uniqueFilename = templateTitle + separator + bookDate + separator + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);
    } else if (template === "Archival_Corpus") {
        uniqueFilename = templateTitle + separator + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);
    } else if (template === "Catalogue_of_Resources") {
        var provider = url.searchParams.get("provider");
        catalogue_info.setDataAtCell(0, 5, provider);
        uniqueFilename = templateTitle + separator + provider + separator + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);
    }else if (template === "aDNA") {
        //var provider = url.searchParams.get("provider");
        //catalogue_info.setDataAtCell(0, 5, provider);
        uniqueFilename = templateTitle + separator  + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);
    } else if (template === "Editor") {
        //var provider = url.searchParams.get("provider");
        //catalogue_info.setDataAtCell(0, 5, provider);
        uniqueFilename = templateTitle + separator  + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);
    } 
    else if (template === "Messageries_Maritimes") {
        var bookTitle = url.searchParams.get("bookTitle");
        source_identity_data.setDataAtCell(0, 3, bookTitle);

        var bookDateFrom = url.searchParams.get("bookDateFrom");
        var bookDateTo = url.searchParams.get("bookDateTo");
        var bookDate = bookDateFrom + "-" + bookDateTo;

        source_identity_data.setDataAtCell(0, 4, bookDateFrom);
        source_identity_data.setDataAtCell(0, 5, bookDateTo);


        var registriesFrom = url.searchParams.get("registriesFrom");
        var registriesTo = url.searchParams.get("registriesTo");
        source_identity_data.setDataAtCell(0, 6, registriesFrom);
        source_identity_data.setDataAtCell(0, 7, registriesTo);

        var registries = registriesFrom + "-" + registriesTo;


        uniqueFilename = templateTitle + separator + bookTitle + separator + bookDate + separator + registries + separator + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);
    } else if (template === "Register_of_Ships") {
        var bookTitle = url.searchParams.get("bookTitle");
        source_identity_data.setDataAtCell(0, 2, bookTitle);

        var bookNumber = url.searchParams.get("bookNumber");
        source_identity_data.setDataAtCell(0, 3, bookNumber);

        uniqueFilename = templateTitle + separator + bookTitle + separator + bookNumber + separator + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);
    } else if (template === "Maritime_Register_ES") {
        var bookNumber = url.searchParams.get("bookNumber");
        var publicationDate = url.searchParams.get("publicationDate");
        source_identity_data.setDataAtCell(0, 6, bookNumber);
        source_identity_data.setDataAtCell(0, 8, publicationDate);

        uniqueFilename = templateTitle + separator + bookNumber + separator + publicationDate + separator + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);

    } else if (template === "Seagoing_Personel") {
        var bookTitle = url.searchParams.get("bookTitle");
        source_identity_data.setDataAtCell(0, 7, bookTitle);

        var bookDateFrom = url.searchParams.get("bookDateFrom");
        var bookDateTo = url.searchParams.get("bookDateTo");
        source_identity_data.setDataAtCell(0, 8, bookDateFrom);
        source_identity_data.setDataAtCell(0, 9, bookDateTo);

        var bookDate = bookDateFrom + "-" + bookDateTo;

        var fondNumber = url.searchParams.get("fonds_number");
        var seriesNumber = url.searchParams.get("series_number");
        var fileNumber = url.searchParams.get("file_number");
        source_identity_data.setDataAtCell(0, 10, fondNumber);
        source_identity_data.setDataAtCell(0, 11, seriesNumber);
        source_identity_data.setDataAtCell(0, 13, fileNumber);



        uniqueFilename = templateTitle + separator + bookTitle + separator + bookDate + separator + fondNumber + separator + seriesNumber + separator + fileNumber + separator + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);
    } else if (template === "Ship_List") {
        var bookTitle = url.searchParams.get("bookTitle");
        source_identity_data.setDataAtCell(0, 7, bookTitle);

        var bookDateFrom = url.searchParams.get("bookDateFrom");
        var bookDateTo = url.searchParams.get("bookDateTo");
        source_identity_data.setDataAtCell(0, 8, bookDateFrom);
        source_identity_data.setDataAtCell(0, 9, bookDateTo);

        var bookDate = bookDateFrom + "-" + bookDateTo;

        var fondNumber = url.searchParams.get("fonds_number");
        var seriesNumber = url.searchParams.get("series_number");
        var fileNumber = url.searchParams.get("file_number");
        source_identity_data.setDataAtCell(0, 10, fondNumber);
        source_identity_data.setDataAtCell(0, 12, seriesNumber);
        source_identity_data.setDataAtCell(0, 13, fileNumber);



        uniqueFilename = templateTitle + separator + bookTitle + separator + bookDate + separator + fondNumber + separator + seriesNumber + separator + fileNumber + separator + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);
    } else if (template === "Inscription_Maritime") {
        var registerTitle = url.searchParams.get("registerTitle");
        source_identity_data.setDataAtCell(0, 3, registerTitle);

        var registerDateFrom = url.searchParams.get("registerDateFrom");
        var registerDateTo = url.searchParams.get("registerDateTo");
        source_identity_data.setDataAtCell(0, 5, registerDateFrom);
        source_identity_data.setDataAtCell(0, 6, registerDateTo);

        var registerDate = registerDateFrom + "-" + registerDateTo;


        uniqueFilename = templateTitle + separator + registerTitle + separator + registerDate + separator + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);
    } else {//has ship
        var shipType = url.searchParams.get("ship_type_gr");
        var shipName = url.searchParams.get("ship_name_gr");
        ship_record_hot.setDataAtCell(0, 0, shipName);
        var dateFrom = url.searchParams.get("dateFrom");
        var dateTo = url.searchParams.get("dateTo");
        if (template === "Payroll") {
            source_identity_data.setDataAtCell(0, 6, dateFrom);
            source_identity_data.setDataAtCell(0, 7, dateTo);
            ship_record_hot.setDataAtCell(0, 1, shipType);
        } else if (template === "Logbook") {
            source_identity_data.setDataAtCell(0, 6, dateFrom);
            source_identity_data.setDataAtCell(0, 7, dateTo);
            ship_record_hot.setDataAtCell(0, 2, shipType);
        } else if (template === "Accounts book") {
            source_identity_data.setDataAtCell(0, 7, dateFrom);
            source_identity_data.setDataAtCell(0, 8, dateTo);
            ship_record_hot.setDataAtCell(0, 1, shipType);
        }


        var date = dateFrom + "_" + dateTo;
        uniqueFilename = templateTitle + separator + shipName + separator + shipType + separator + date + separator + authorName + " " + authorSurname;
        $("#unique_filename").html(uniqueFilename);
    }
}


////////////////// Sub tables//////////////////////////////////////////

$(document).ready(function ()
{
//import jspath OBSOLETE
//    var imported = document.createElement('script');
//    imported.src = '../js/jspath.min.js';
//    document.head.appendChild(imported);

//Spy cat addition
    var url_string = window.location.href;
    var url = new URL(url_string);
    mode = url.searchParams.get("mode");
    if (mode !== null && mode !== 'Edit') {
        $("#create").hide();
        myRecordsDB_local = publicRecordsDB_remote; //hmmm not sure about the side effects

        if (mode === "View") {

            $(".indexHeader").children("a").first().attr("href", "../spy.html?table=records");
            //Visual changes
            $(".indexHeader img").attr("src", "../img/logospy-cat.png");
            $(".indexHeader").attr("style", "background-color:#0C3B49;");
            $(".indexHeader button").attr("style", "margin-right:5px; color:#ffffff; background-color:#0C3B49");
        } else if (mode === "teamView") {
            $(".indexHeader").children("a").first().attr("href", "../team.html");
            //Visual changes
            $(".indexHeader img").attr("src", "../img/logoteam-cat.png");
            $(".indexHeader").attr("style", "background-color:#C64F1A");
//            $(".indexHeader button").hide();
            $(".indexHeader button").attr("style", "margin-right:5px; color:#ffffff; background-color:#C64F1A");
            //TEMP
            if (dbSuffix === "_dev") {//TEMP IF TO HIDE FOR NOW

                $("#zip_export").parent().parent().append('<li><a title="Not fully functional yet" class="uploadCatalogue">Publish to Research Space</a></li>')
                        .append('<li><a title="Not fully functional yet" class="undoPublish">Undo publish</a></li>');
            }


        }
    } else {
        if (mode === 'Edit') {//to fix no update vocabs in new tab issue
            mode = null;
        }
    }




    fetchDB();
    $("body").on("click", "a", function () {
//    $("a").click(function() {
        $(".sub_table").remove();
    });
    $(document).bind('keydown', 'ctrl+f1', function () {
        subTable.selectCell(0, 0);
        $("a.subTableHeader").trigger("click");
    });
    getWholeDB(myVocabsDB_local);
});

Handsontable.renderers.registerRenderer('groupRenderer', groupRenderer);

function groupRenderer(instance, td, row, col, prop, value, cellProperties) {
    var cellType = instance.getDataType(row, col);
//instance.setCellMeta(row, col, 'readOnly', true); //For read-only fields
    var $root = $(instance.rootElement);
    var tableId = $root.attr("id");
//    console.log(value)
    if (value === null) {
        value = "";
    }

    if (cellType === "dropdown") {
        Handsontable.renderers.DropdownRenderer.apply(this, arguments);
        td.innerHTML = "<div  class='" + tableId + "Row" + row + "Col" + col + "'>" + value + "<span class='glyphicon glyphicon-triangle-bottom htAutocompleteArrow'></span></div>";
    } else {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        td.innerHTML = "<div  class='" + tableId + "Row" + row + "Col" + col + "'>" + value + "<span style='display:none;' class='glyphicon glyphicon-triangle-bottom htAutocompleteArrow'></span></div>";
    }
    return td;
}

function markHeaders(headers, groups) {
    var markedHeaders = headers[headers.length - 1];
    for (var i = 0; i < groups.length; i++) {
        var groupStartCol = groups[i][0];
        var groupEndCol = groups[i][1];
        for (var j = groupStartCol; j <= groupEndCol; j++) {
            if (j === groupStartCol && j === groupEndCol) {
                markedHeaders[j] = "<div class='group start end'>" + markedHeaders[j] + "</div>";
            } else if (j === groupStartCol) {
                markedHeaders[j] = "<div class='group start'>" + markedHeaders[j] + "</div>";
            } else if (j === groupEndCol) {
                markedHeaders[j] = "<div class='group end'>" + markedHeaders[j] + "</div>";
            } else {
                markedHeaders[j] = "<div class='group'>" + markedHeaders[j] + "</div>";
            }
        }
    }
    headers[headers.length - 1] = markedHeaders;
    return headers;
}

function markGroups(table) {
    var $root = $(table.rootElement);
    var $groups = $root.find(".group");
    $.each($groups, function (key, value) {
        var $groupCell = $(this).parentsUntil("th").parent();
        $groupCell.css("background-color", "#C0D5EF");
        var $nextCell = $groupCell.next("th");
        if ($groupCell.html().indexOf("end") !== -1) {//if last in group
            if ($nextCell.html() !== undefined && $nextCell.html().indexOf("group") !== -1) {//check if next cell is group
                $groupCell.css("border-right", "1px solid #5e7aa9"); //and add separator
            }
        }
    });
}
function groupLeftClicked(table, row, col) {
//    console.log(table + "---" + row + "---" + col)
    table.setCellMeta(row, col, 'read-only', true);
//console.log(table.getDataAtCell(row, col))
//console.log(table.getDataAtCell(row, col).indexOf("\n"))
    if (table.getDataAtCell(row, col) !== null && table.getDataAtCell(row, col).indexOf("\n") !== -1) {
//        console.log("LOCKING")
        table.setCellMeta(row, col, 'editor', false); //For read-only fields  
        table.destroyEditor();
    } else {
//        console.log("UNLOCKING")
        var value = table.getDataAtCell(row, col);
        if (value === null || value === "&nbsp;") {
            table.setDataAtCell(row, col, "");
        }
        if (table.getCellMeta(row, col).editor === false) {
            var cellType = table.getDataType(row, col);
            table.setCellMeta(row, col, 'editor', cellType);
        }

    }
    table.render();
}


function getCellActualType(table, row, col) {
    var cellProperties = table.getCellMeta(row, col);
    var cellType = cellProperties.type;
    var renderer = cellProperties.renderer.toString();
    if (renderer.indexOf("groupRenderer") !== -1) {
        cellType = "group";
    }
    return cellType;
}
function getColHeaderName(table, col) {
//OBSOLETE
////    var newCol = col + 1;
//    if (table.hasRowHeaders()) {
//        newCol = col + 2;
//    }
//    var header = $("#" + table.rootElement.getAttribute("id")).find("thead>tr:last-child>th:nth-child(" + newCol + ")").eq(1).text(); //Don't ask how and why...

    return table.getColHeader(col);
}






function groupClicked(parentTableName, subTableName, row, startCol, endCol) {
//    console.log("." + parentTableName + "Row" + row + "Col" + startCol);
    var start = new Date();
    var $td = $("." + parentTableName + "Row" + row + "Col" + startCol);
    var pos = calculatePos($td);
//    pos.bottom = pos.top + $td.height(); //was used to show subtable under row
    pos.bottom = pos.top;
    pos.right = pos.left;
    var x = pos.right;
    var y = pos.bottom;
    createSubTable(parentTableName, subTableName, x, y, row, startCol, endCol);
    var time = new Date() - start;
    console.log("Took " + time / 1000 + " secs to open subtable!");
}



function calculatePos($td) {
    var pos = $td.offset();
    return pos;
}

function isNull(element, index, array) {
    return element === null;
}
function isEmpty(element, index, array) {
    return element === "";
}
function getSubTableData(subTable, subTableLength) {
    var contents = subTable.getData();
//    console.log(contents)

    var results = [];
    var emptySubTable = true;
    for (var i = 0; i < contents.length; i++) {
        var row = contents[i];
        var separator = "\n";
//        console.log(subTable.isEmptyRow(i))
//        if (row.every(isNull) === false && row.every(isEmpty) === false) {
        if (subTable.isEmptyRow(i) === false) {//Replaced line above with this one, which seems to work better

            emptySubTable = false;
            for (var j = 0; j < row.length; j++) {
                var col = row[j];
                if (typeof col === "undefined" || col === null) {
                    col = "";
                } else if (col.length === 0) {
                    col = "&nbsp;";
                }
//                console.log("col:" + i + " value:" + col + " length:" + col.length)

                if (typeof results[j] !== 'undefined') {
                    results[j] = results[j] + col + separator;
                } else {
                    results[j] = col + separator;
                }
            }
        }
    }
    for (var k = 0; k < results.length; k++) {
        results[k] = results[k].slice(0, -1);
    }
    if (emptySubTable === true) {//Subtable completely empty       
        for (var j = 0; j <= subTableLength; j++) {
            results[j] = null;
        }
    }
//    console.log(results)
    return results;
}
function close_sub(parentRow, parentStartCol, parentEndCol) {
    var start = new Date();
//    console.log(subTable.getData())
    var results = [];
    results = getSubTableData(subTable, parentEndCol - parentStartCol);
//    console.log("*******CLOSE_SUB***********")
//    console.log(results)
//    console.log(new Array(results))
//
//    console.log(parentRow)
//    console.log(parentStartCol)
//    console.log(results.length)
    parentTableInstance.populateFromArray(parentRow, parentStartCol, new Array(results));
//   for (var k = 0; k < results.length; k++) {
//            parentTableInstance.setDataAtCell(parentRow, parentStartCol + k, results[k]);
//        }

    parentTableInstance.selectCell(parentRow, parentStartCol);
    $(".sub_table").remove();
    var time = new Date() - start;
    console.log("Took " + time / 1000 + " secs to close subtable!");
}
//TO DO
//function getTableLastDataCoords(data) {
//    console.log(data)
//    var lastRowIndex = 0;
//    var lastNotNullColIndex = 0;
//    if (data !== null && data.length > 0) {
//        var dataRow = data[0];
//        for (var i = 0; i < dataRow.length; i++) {
//            var colContents = dataRow[i];
//            if (colContents !== null) {
//                lastNotNullColIndex = i;
//                var rows = colContents.split("\n").length;
//                console.log(rows)
//                if (rows > lastRowIndex - 1) {
//                    lastRowIndex = rows - 1;
//                }
//            }
//        }
//    }
//
//    return [lastRowIndex, lastNotNullColIndex];
//}

function getMaxNumberOfRows(data) {
    var maxNumberOfRows = 1;
    Object.keys(data).forEach(function (key) {
        var value = data[key];
        if (value !== null && typeof value !== "undefined") {
            var numberOfRows = value.split("\n").length;
            if (numberOfRows > maxNumberOfRows) {
                maxNumberOfRows = numberOfRows;
            }
        }
    });
    return maxNumberOfRows;
}


function setSubTableData(parentTable, row, startCol, endCol) {
    parentTableInstance = parentTable;
    var data = parentTable.getSourceData(row, startCol, row, endCol);
    var row = data[0];
    var rowsCount = getMaxNumberOfRows(row);
    var rows = {};
    Object.keys(row).forEach(function (key) {
        var value = row[key];
        if (typeof value === "undefined" || value === null) {
            delete row[key];
        } else {
            value = value.replace(/&nbsp;/g, "");
            if (value.length === 0) {
                delete row[key];
            } else {
                var values = value.split("\n");
                rows[key] = values;
            }
        }

    });
    var rowsJSON = [];
    for (var i = 0; i < rowsCount; i++) {
        var rowJSON = {};
        Object.keys(rows).forEach(function (key) {
            var value = rows[key];
            rowJSON[key] = value[i];
        });
        rowsJSON[i] = rowJSON;
    }
    return rowsJSON;
//    }
}


//function setSubTableData2(parentTable, row, startCol, endCol) {
//    parentTableInstance = parentTable;
//
//
//    var data = parentTable.getSourceData(row, startCol, row, endCol);
////    console.log("SETSUB")
//    console.log(data)
//    var row = data[0];
//    console.log(row)
//    var firstKey = Object.keys(row)[0];
//    var firstValue = row[firstKey];
//    console.log(firstValue)
//    if (typeof firstValue === "undefined" || firstValue === null) {
//        console.log(data)
//        return data;
//    }
//    var multipleValues = firstValue.split("\n");
//    console.log(multipleValues)
//    var rowsCount = multipleValues.length;
//    console.log(rowsCount)
//    if (rowsCount === 1) {
//        return row;
//    } else {
//        var rows = {};
//
//        Object.keys(row).forEach(function(key) {
//            var value = row[key];
//            console.log(key + "---" + value);
//            if (typeof value === "undefined" || value === null) {
//                delete row[key];
//            } else {
////                value = value.replace(/(&nbsp;↵?)+/g, "").trim();
//                value = value.replace(/&nbsp;/g, "");
//                if (value.length === 0) {
//                    delete row[key];
//                } else {
//                    var values = value.split("\n");
//                    rows[key] = values;
//                }
//            }
//
//        });
//        var rowsJSON = [];
//        for (var i = 0; i < rowsCount; i++) {
//            var rowJSON = {};
//            Object.keys(rows).forEach(function(key) {
//                var value = rows[key];
//                rowJSON[key] = value[i];
//            });
//            rowsJSON[i] = rowJSON;
//        }
//        console.log(rowsJSON)
//        return rowsJSON;
//    }
//}
function createClickFunction(parentTableName, subTableName, row, startCol, endCol) {
//    return "close_sub(\"" + parentTableName + "\",\"" + subTableName + "\"," + row + "," + startCol + "," + endCol + ")";
    return "close_sub(" + row + "," + startCol + "," + endCol + ")";
}

function createSubTableHtml(clickFunction, cnt, clickFunction, tableId, x, y) {
    var positionX = x - 5;
    var positionY;
    positionY = y - 10;
    if (positionX < 0) {//fail safe to avoid table outside viewport
        positionX = 0;
    }

    var width = $(window).width() - positionX - 28;
    var html = "<div  class='panel panel-default sub_table not_visible' style='border:transparent;position:absolute;top:" + positionY + "px;left:" + positionX + "px;z-index:10;max-width:" + width + "px;overflow:auto;'>" +
            "<div class='panel-heading' role='tab' id='heading" + cnt + "'>" +
            "<h4 class='panel-title'>" +
            "    <a class='collapsed subTableHeader' role='button' onclick='" + clickFunction + "'  href='#collapse" + cnt + "'>" +
            "<span title='Close subtable' class='pull-right glyphicon glyphicon-remove'></span>" + "&nbsp; " +
            "     </a>" +
            "</h4>" +
            "</div>" +
            "<div id='collapse" + cnt + "' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='heading" + cnt + "'>" +
            "    <div class='panel-body' style='padding:0'>" +
            "        <div>" +
            "            <div id='" + tableId + "' class='hot handsontable htRowHeaders htColumnHeaders' style='height: 100%; overflow: hidden; width: 100%; border:2px solid #5e7aa9;'></div>" +
            "        </div> " +
            "    </div>" +
            "</div>" +
            "</div>";
    return html;
}


 
function createSubTableInstance(tableId, data, cols, nestedHeaders) {
    var container = document.getElementById(tableId);
//    var subTableDataCoords = getTableLastDataCoords(data);
//    console.log(subTableDataCoords)

    var subTable = new Handsontable(container, {
        licenseKey: '',
        data: data,
        minRows: 8,
        columns: cols,
        dateFormat: 'YYYY-MM-DD',
        contextMenu: true,
        autoWrapRow: true,
        className: "htCenter htMiddle",
        nestedHeaders: nestedHeaders,
        cells: function (row, col, prop) {
            if (this.vocab) {
                handle_vocabulary(this.instance.getDataAtCell(row, col), this.vocab, this);
            }
        }
//        afterChange: function(changes) {
//            if (subTableDataCoords[0] === 0 && subTableDataCoords[1] === 0) {//empty sub
//                $("a.subTableHeader").css("display", "block");
//            } else {
//                if (changes !== null) {
//                    if (changes[0][0] === subTableDataCoords[0] && subTable.propToCol(changes[0][1]) === subTableDataCoords[1]) {
//                        $("a.subTableHeader").css("display", "block");
//                    }
//                }
//            }
//        }
    });
    subTable.selectCell(0, 0);
    return subTable;
}
function isAddTableMenuVisible(table, groups) {
//    console.log(table)
    var rowFrom = table.getSelectedRange().from.row;
    var rowTo = table.getSelectedRange().to.row;
    if (rowFrom !== rowTo) {
        return true;
    }
    var col = table.getSelectedRange().to.col;
    var colsWithSub = new Array();
    groups.forEach(function (group) {
        for (var index = group[0]; index <= group[1]; index++) {
            colsWithSub.push(index);
        }
    });
    var shouldColGenerateSub = !colsWithSub.includes(col);
//    console.log(colsWithSub)
    if (colsWithSub) {
        return (shouldColGenerateSub);
    }

}

function createSubTableRightMenu(subTable, subTableName, cols) {
    if (subTableName.length > 1) {
        subTable.updateSettings({
            contextMenu: {
                callback: function (key, options) {
                    if (key === 'edit_vocabulary') {
                        var col = options.start.col;
                        create_voc_modal(cols[col].vocab);
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
                        disabled: function () {
                            return subTable.getSelected()[0] === 0;
                        }
                    },
                    "row_below": {},
                    "add10rows": {
                        name: "Add 10 rows",
                        callback: function () {
                            this.alter('insert_row', this.getSelected()[0] + 1, 10);
                        }
                    },
                    "hsep2": "---------",
                    "remove_row": {},
                    "hsep1": "---------",
                    "edit_vocabulary": {
                        name: "Edit vocabulary",
                        hidden: function () {
                            var col = subTable.getSelectedRange().to.col;
                            var label = cols[col].vocab;
                            if (label) {
                                update_Vocs();
                                return subTable.getSelectedRange().to.col !== col;
                            } else {
                                return subTable.getSelectedRange().to.col !== -1;
                            }
                        }}
                }
            }
        });
    }
    return subTable;
}




//Vocab PART
//New attempt START
function update_Vocs_from_json(allTerms_json) {
    console.log("-----------------UPDATING VOCABULARIES (NEW ENGINE)----------------------");
    termsPerVocab = [];

    var url_string = window.location.href;
    var url = new URL(url_string);
    var template = url.pathname.replace(/.*?\/templates\/(.*?)\.html/g, "$1").replace(/%20/g, " ");

//    console.log(template)
    var templateVocabs = localStorage.getItem("Vocabs(" + template + ")");
    if ((typeof templateVocabs !== "undefined") && (templateVocabs)) {
        templateVocabs = templateVocabs.split(",");
    } else {
        templateVocabs = [];
    }
//    console.log("**********")
//    console.log(templateVocabs)
//console.log(allTerms_json);

    Object.keys(allTerms_json).forEach(function (table) {
        var tableTerms = allTerms_json[table];
        Object.keys(tableTerms).forEach(function (row) {
            var rowTerms = tableTerms[row];
            Object.keys(rowTerms).forEach(function (term) {
                var termJSON = rowTerms[term];
                if (templateVocabs.indexOf(termJSON.label) !== -1) {//If vocabs belongs to template vocabs
                    if (recordVocabs.indexOf(termJSON.label) === -1) {
                        recordVocabs.push(termJSON.label);
                    }
                    if (termJSON.term.trim().length > 0) {
                        createJSONForTerm(table, termJSON);
                    }
                }
            });

        });
    });

    var allTermsCount = 0;
    for (var i = 0; i < Object.keys(termsPerVocab).length; i++) {
        var vocabId = Object.keys(termsPerVocab)[i];
        var vocabJSON = termsPerVocab[vocabId];
        var vocabTermsCount = getJSONsize(vocabJSON);
        allTermsCount = allTermsCount + vocabTermsCount;
//        console.log(vocabId);
//        console.log(vocabTermsCount)
        console.log("Found " + vocabTermsCount + " terms for vocab " + vocabId);
        console.log(vocabJSON)
//        updateVocab(myVocabsDB_local, vocabId, vocabJSON);
        updateVocab(publicVocabsDB_remote, vocabId, vocabJSON);
//        if (vocabTermsCount>50) {
//            console.log(vocabJSON)
//        }
    }
    console.log("Found " + allTermsCount + " terms with new engine!");



}

function createJSONForTerm(table, termJSON) {


    var value = termJSON.term.trim();
//    var term = value.toLowerCase();

    var vocabId = termJSON.label;
    var row = termJSON.row;

    //Add +1
    if (typeof termJSON.row !== "undefined") {
        row = parseInt(row) + 1;
    }
    var col = termJSON.col_no;
    if (typeof termJSON.col !== "undefined") {
        col = parseInt(col) + 1;
    }
    if (typeof table !== "undefined") {
        if (table.match(/_\d+$/m)) {
            // Successful match
            var tableName = table.substring(0, table.lastIndexOf("_"));
            var tableIndex = table.substring(table.lastIndexOf("_") + 1);
            tableIndex = parseInt(tableIndex) + 1;
            table = tableName + "_" + tableIndex;
        }
    }


    var termOcc = {
//        "value": value,
        "title": uniqueFilename,
        "template": templateTitle,
        "occurences": [
            {"tableVariable": table,
                "table": table,
                "row": row,
                "col": col,
                "fieldTitle": termJSON.col}
        ]
    };
    var json = {};
    json[recordId] = termOcc;
    var fullTermJSON = {};
    fullTermJSON[value] = json;


    if (typeof termsPerVocab[vocabId] === "undefined") {
        termsPerVocab[vocabId] = fullTermJSON;
    } else {
        var vocabTermsJSON = termsPerVocab[vocabId];
        var storedTermJSON = vocabTermsJSON[value];
        if (typeof storedTermJSON !== "undefined") {
            storedTermJSON[recordId].occurences.push(termOcc.occurences[0]);
        } else {
            vocabTermsJSON = appendJSONObject(vocabTermsJSON, fullTermJSON);
        }
    }



}


//New attempt END

function updateVocabs(tables) {
    var start = new Date();
    var occs = getOccurences(tables);
//    console.log(occs);
//    console.log(recordVocabs)
    var allTermsCount = 0;


    for (var i = 0; i < recordVocabs.length; i++) {
        var vocab = recordVocabs[i];
        var vocabOccs = getOccsForVocab(occs, vocab);
//        console.log("NUMBER OF TERMS=" + vocabOccs.length)
        var vocabTermsOccs = {};
        for (var j = 0; j < vocabOccs.length; j++) {
            var vocabOcc = vocabOccs[j];
            var termValue = vocabOcc.value;
            delete vocabOcc.vocab;
            delete vocabOcc.value;
            if (typeof (vocabTermsOccs[termValue]) === "undefined") {//new term, adding
                var occJSON = {
                    "title": uniqueFilename,
                    "template": templateTitle,
                    "occurences": []
                };
                occJSON.occurences.push(vocabOcc);
                var json = {};
                json[recordId] = occJSON;
                vocabTermsOccs[termValue] = json;
            } else {//term exists, updating
                var occsSoFar = vocabTermsOccs[termValue];
                occsSoFar[recordId].occurences.push(vocabOcc);
                vocabTermsOccs[termValue] = occsSoFar;
            }
        }
//        console.log(vocab)
        allTermsCount = allTermsCount + getJSONsize(vocabTermsOccs);

        if (getJSONsize(vocabTermsOccs) > 0) {//only update vocab if it is used
//            console.log(vocab) 
//            console.log(vocabTermsOccs)
            updateVocab(myVocabsDB_local, vocab, vocabTermsOccs);
        }
    }
    var time = new Date() - start;
    console.log("Found " + allTermsCount + " terms with original engine!");

    console.log("Took " + time / 1000 + " secs to update vocabs!");
}


function updateVocab(db, id, vocabTermsOcss) {
//    console.log(vocabTermsOcss)
    db.get(id).then(function (doc) {
//        console.log(doc)


        var value;
        var usedTermsLower = [];
        Object.keys(vocabTermsOcss).forEach(function (key) {

            value = vocabTermsOcss[key];
            var newUsage = value;
//            console.log(newUsage)

            var lowerKey = key.toLowerCase();
            usedTermsLower.push(lowerKey);


            if (typeof doc.terms[lowerKey] !== "undefined") {//Term exists in vocab already  
//                console.log("OLD:" + key);
                doc.terms[lowerKey].usage[recordId] = newUsage[recordId];
            } else {//New term
//                console.log("NEW:" + key)
                var termJSON = createTermJSON(key);
                termJSON[lowerKey].usage = newUsage;
//                console.log(termJSON)
                doc.terms = appendJSONObject(doc.terms, termJSON);

            }
        });

        //Comparing localstorage and pouchDB vocab file to add/remove unused terms
        if (db._adapter === "idb") {//only for local DBs
//            console.log("LOCAL")
            var usedTerms = Object.keys(vocabTermsOcss);
//            console.log(usedTerms)
            var vocabTerms = JSPath.apply(".terms.*.value", doc);
            var localStorageTerms = JSON.parse(localStorage.getItem(id));
            if (localStorageTerms !== null) {
                vocabTerms.forEach(function (term) {
                    if (typeof doc.terms[term] !== "undefined") {
                        if (localStorageTerms.indexOf(term) === -1) {//Exists in vocab but not in local, therefore delete term

                            delete doc.terms[term];
                        } else {
                            if (usedTerms.indexOf(term) === -1) {//Term exists but is not used any more in record, therefore delete specific usage
                                delete doc.terms[term].usage[recordId];
                            }
                        }
                    }
                });
                localStorageTerms.forEach(function (term) {
                    if (vocabTerms.indexOf(term) === -1) {//Terms exists in local but not in vocab, therefore add term
                        var termJSON = createTermJSON(term);
                        doc.terms = appendJSONObject(doc.terms, termJSON);
                    }
                });
            }
        } else {//couchDB deleting usages that no longer exist
//            console.log("REMOTE")
            $.each(doc.terms, function (key) {
                if (doc.terms[key].usage[recordId]) {
//                        console.log(key)
                    if (usedTermsLower.indexOf(key) === -1) {
                        console.log("Term " + key + " is no longer used!");
                        delete doc.terms[key].usage[recordId];
                    }
                }

            });
        }
        //was just doc, trying something more explicit
        db.put({
            _id: doc._id,
            label: doc._id,
            _rev: doc._rev,
            lastModified: new Date().toJSON(),
            terms: doc.terms
        }).then(function (response) {

        }).catch(function (err) {
            console.log(err);
        });
    }).catch(function (err) {
        console.log(err);
        if (err.message === "missing" || err.message === "deleted") {//If there is no file, we create it and get terms from local_storage
            console.log("Vocab file " + id + " missing!");
            var terms = JSON.parse(localStorage.getItem(id));
            var termJSON = {};
            if (terms !== null) {
                for (var i = 0; i < terms.length; i++) {
                    var term = terms[i];
                    termJSON = appendJSONObject(termJSON, createTermJSON(term));
                }
            }
            var vocabObj = {
                _id: id,
                label: id,
                lastModified: new Date().toJSON(),
                terms: termJSON
            };
//            console.log("Vocab is" + JSON.stringify(vocabObj))
            db.put(vocabObj).then(function (response) {
                console.log("Vocab file " + id + " created!");
                updateVocab(db, id, vocabTermsOcss);
            });
        } else {
            //MUST INVESTIGATE THIS MESSAGE FOR TIMEOUT ERROR
            console.log(("So now we get this error when we try to get() it: " + JSON.stringify(err)));
//            alert("FastCat: Unexpected error when trying to get vocabulary file " + id + "! Contact support with following error message:" + JSON.stringify(err));
        }
    });
}


function getOccsForVocab(occs, vocab) {

    var vocabOccs = JSPath.apply("..occurences{.vocab==='" + vocab + "'}", occs);
    return vocabOccs;
}
function getOccurences(tables) {
    var occs = [];
    for (var i = 0; i < tables.length; i++) {
        occs = getOccurence(occs, tables[i]);
    }
//    console.log("CELLS=" + cellsProcessed)
//    console.log(occs)
    cellsProcessed = 0;
    var occurences = {
        "title": uniqueFilename,
        "template": templateTitle,
        "occurences": occs
    };

    var json = {};
    json[recordId] = occurences;
    return json;
}
function getOccurence(occs, table) {

    var tableVariable = table.rootElement.getAttribute("id");
    var tableId = $("#" + tableVariable).parentsUntil("div.collapse").parent().attr("id");
    if (typeof tableId === "undefined") {//Fail safe
        tableId = ($("#" + tableVariable).parent().attr("id"));
    }
    var $tableLink = $("a[href='#" + tableId + "']");
//    if (typeof $tableLink === "undefined") {
    var tableName = $tableLink.text().trim();
//    }

    var counter = 0;
//    console.log("TABLE " + tableName);
    var dropdowns = [];
    for (var c = 0; c < table.countCols(); c++) {
        if (table.getDataType(0, c) === "dropdown") {
//            console.log("COL at " + c + " is dropdown");
            dropdowns.push(c);
        }
    }
//    console.log(tableName)
    var tableOccs = [];
    for (var i = 0; i < table.countRows(); i++) {
        if (!table.isEmptyRow(i)) {//no need to traverse empty rows
//            for (var j = 0; j < table.countCols(); j++) {
            for (var k = 0; k < dropdowns.length; k++) {
                var j = dropdowns[k];
                var value = table.getDataAtCell(i, j);
                if (value !== null && value !== '' && value !== '&nbsp;') {
                    counter = counter + 1;
                    var vocab = table.getCellMeta(i, j).vocab;
                    if (typeof vocab === "undefined") {//Fail safe
                        vocab = table.getCellMeta(i, j).data;
                    }
//                    if (vocab === "location_gr" && value !== null && value !== '' && value !== '&nbsp;') {

                    if (recordVocabs.indexOf(vocab) === -1) {
                        recordVocabs.push(vocab);
                    }


                    tableOccs = addOccurence(tableOccs, table, vocab, value, tableVariable, tableName, i, j);
                }

//                    if (typeof table.getCell(i, j) !== "undefined") {//so that it will not break
//                        if (table.getCell(i, j) !== null) {
//                            table.getCell(i, j).style.background = 'yellow';
//                        }
//                    }


            }
        }
    }
//            console.log(tableOccs)

    if (table.countRows() > 1) {
        tableOccs = minifyTableOccs(tableOccs);
    }
//    console.log("------------")
//     console.log(tableOccs)
//    console.log("TABLE " + tableName + " TOTAL CELLS=" + counter)
    cellsProcessed = cellsProcessed + counter;
    return occs.concat(tableOccs);
}

function minifyTableOccs(tableOccs) {
    var tableCols = {};
    var tableColNames = {};
    var tableVariable = "";
    var table = "";
    var fieldTitle = "";
    tableOccs.forEach(function (occ, index) {
//        console.log(occ)
        if (index === 0) {
            tableVariable = occ.tableVariable;
            table = occ.table;
            fieldTitle = occ.fieldTitle;
        }

        var uniqueId = "col" + occ.col + "###" + occ.vocab + "###" + occ.value;
        if (typeof (tableColNames["col" + occ.col]) === "undefined") {
            tableColNames["col" + occ.col] = occ.fieldTitle;
        }

        if (typeof (tableCols[uniqueId]) === "undefined") {
            tableCols[uniqueId] = occ.row;
        } else {
            tableCols[uniqueId] = tableCols[uniqueId] + ", " + occ.row;
        }
    });


    var minifiedTableOccs = [];
//console.log(tableCols)

    Object.keys(tableCols).forEach(function (key) {
        var keyParts = key.split("###");
        var colPlusIndex = keyParts[0];
        var vocab = keyParts[1];
        var value = keyParts[2];
        var minifiedTableOcc = {
            "vocab": vocab,
            "value": value,
            "tableVariable": tableVariable,
            "table": table,
            "row": tableCols[key],
            "col": colPlusIndex.substr(3),
            "fieldTitle": tableColNames[colPlusIndex]
        };
        minifiedTableOccs.push(minifiedTableOcc);
    });
    return minifiedTableOccs;
}


function addOccurence(occs, table, vocab, value, tableVariable, tableName, i, j) {

    if (value !== null && value !== '' && value !== '&nbsp;') {
        var colName = getColHeaderName(table, j);
        if (value.indexOf("\n") !== -1) {
            var values = value.split("\n");
            for (var k = 0; k < values.length; k++) {
                occs = addOccurence(occs, table, vocab, values[k], tableVariable, tableName, i, j);
            }
            return occs;
        }


//        console.log(tableName + "---" + i + "---" + j)
//        console.log(vocab + "---" + value + "---" + colName + "---" + tableVariable + "---" + tableName + "/" + i + "/" + j);



        var occurence = {
            "vocab": vocab,
            "value": value,
            "tableVariable": tableVariable,
            "table": tableName,
            "row": i + 1,
            "col": j,
            "fieldTitle": colName
        };
//        console.log(occs.length)
//
//        if (occs.length > 0) {
//            console.log(occs[occs.length-1])
//        }
        occs.push(occurence);
    }
    return occs;
}


function getWholeDB(db) {
    db.allDocs({
        include_docs: true,
        descending: false
    }).then(function (result) {
//        console.log(result)
    });
}
function createTermJSON(term) {
    var json = {};
    var termObj = {
        value: term,
//        differentSpellings: "",
//        synonyms: "",
//        translations: "",
        usage: {}
    };
    json[term.toLowerCase()] = termObj;
    return json;
}


/*
 * Comment section
 */
var commentingTable;
function uncomment(table) {
    if (confirm("FastCat: Are you sure?")) {

        var range = table.getSelectedRange();
        var row = range.from.row;
        var col = range.from.col;
        var commentCol = table.getColHeader().length - 1;
        var commentsSoFar = table.getDataAtCell((+row), (+commentCol));
        var specificColCommentIndex = commentsSoFar.indexOf("Col" + col);
        var oldValue = commentsSoFar.substring(specificColCommentIndex, commentsSoFar.indexOf(")", specificColCommentIndex) + 1);
        commentsSoFar = commentsSoFar.replace(oldValue, "");
        table.setDataAtCell((+row), (+commentCol), commentsSoFar);
        // Access to the Comments plugin instance:
        var commentsPlugin = table.getPlugin('comments');
        commentsPlugin.removeCommentAtCell(row, col);
    }

}

function comment(table) {
    var range = table.getSelectedRange();
    var row = range.from.row;
    var col = range.from.col;
    var commentCol = table.getColHeader().length - 1;
    var commentColValue = table.getDataAtCell(row, commentCol);
    if (commentColValue !== null) {

        var valueForSpeficicCol = getActualComment(commentColValue, col);
        var values = valueForSpeficicCol.split("\nRelated Source: ");
        if (values !== null && values.length > 1) {
            $('#comment_area').val(values[0]);
            $('#related_area').val(values[1]);
        } else {
            $('#comment_area').val("");
            $('#related_area').val("");
        }
    } else {
        $('#comment_area').val("");
        $('#related_area').val("");
    }

    $("#comment_Modal").modal('show');
    $('#comment_here').attr('data-row', row);
    $('#comment_here').attr('data-col', col);
    $('#comment_here').attr('data-commentCol', commentCol);
    commentingTable = table;
}

$('#cancel_comment').click(function () {
    $("#comment_Modal").modal('hide');
});
$('#save_comment').click(function () {

    var row = $('#comment_here').attr('data-row');
    var col = $('#comment_here').attr('data-col');
    var commentCol = $('#comment_here').attr('data-commentCol');
    var comment = $('#comment_area').val();
    var related = $('#related_area').val();
    var savedComment = "Col" + col + "(" + comment + "\nRelated Source: " + related + ")";
    var commentsSoFar = commentingTable.getDataAtCell((+row), (+commentCol));
    if (commentsSoFar !== null) {
        var specificColCommentIndex = commentsSoFar.indexOf("Col" + col);
        if (specificColCommentIndex !== -1) {//If comment for this column already exists, replace it
            var oldValue = commentsSoFar.substring(specificColCommentIndex, commentsSoFar.indexOf(")", specificColCommentIndex) + 1);
            commentsSoFar = commentsSoFar.replace(oldValue, savedComment);
            commentingTable.setDataAtCell((+row), (+commentCol), commentsSoFar);
        } else {
            commentingTable.setDataAtCell((+row), (+commentCol), commentsSoFar + savedComment);
        }
    } else {
        commentingTable.setDataAtCell((+row), (+commentCol), savedComment);
    }

// Access to the Comments plugin instance:
    var commentsPlugin = commentingTable.getPlugin('comments');
    // Manage comments programmatically:
    commentsPlugin.setCommentAtCell(row, col, comment + "\nRelated Source: " + related);
    commentsPlugin.showAtCell(row, col);
    $("#comment_Modal").modal('hide');
});
function addCommentForContentFoundOutsideTheSource(table) {
    var lastColIndex = table.getColHeader().length - 1;
    var commentForCols = table.getCellMeta(0, lastColIndex).hidden;
    if (typeof commentForCols !== "undefined") {
        for (var rowIndex = 0; rowIndex < table.countRows(); rowIndex++) {
            var value = table.getDataAtCell(rowIndex, lastColIndex);
            if (value !== null) {
                if (lastColIndex !== null) {
                    var commentsPlugin = table.getPlugin('comments');
                    var comments = value.split(/\)/);
                    comments.forEach(function (comment) {
                        if (comment.length > 0) {
                            comment = comment + ")";
                            var commentForCol = comment.substring(3, comment.indexOf("("));
                            var actualValue = getActualComment(value, commentForCol);
                            commentsPlugin.setCommentAtCell(rowIndex, commentForCol, actualValue);
                        }
                    });
                }
            }
        }
    }
}
/*function addCommentForContentFoundOutsideTheSource(table) {
 var lastColIndex = table.getColHeader().length - 1;
 var commentForCols = table.getCellMeta(0, lastColIndex).hidden;
 
 if (typeof commentForCols !== "undefined") {
 var cols = commentForCols.split(",");
 cols.forEach(function(commentForCol) {
 
 for (var rowIndex = 0; rowIndex < table.countRows(); rowIndex++) {
 var value = table.getDataAtCell(rowIndex, lastColIndex);
 
 if (value !== null && value.indexOf("Col" + commentForCol + "(") !== -1) {
 if (lastColIndex !== null) {
 var commentsPlugin = table.getPlugin('comments');
 
 var actualValue = getActualComment(value, commentForCol);
 commentsPlugin.setCommentAtCell(rowIndex, commentForCol, actualValue);
 }
 }
 }
 });
 }
 }
 */



/*
 * Scan comment cell and get actual value
 */
function getActualComment(value, commentForCol) {
    var specificColIndex = value.indexOf("Col" + commentForCol + "(");
    if (specificColIndex === -1) {//Fresh comment
        return "";
    }
    var colIntroLength = ("Col" + commentForCol + "(").length;
    var startIndex = specificColIndex + colIntroLength;
    var actualValue = value.substring(startIndex, value.indexOf(")", startIndex));
    return actualValue;
}
/*
 * Tooltips
 */
function headerTooltip(label, tooltip) {
    return '<span title="' + tooltip + '">' + label + '</span>';
}
/*
 * Undo Publish record 
 */
$("body").on("click", ".undoPublish", function () {
    if (confirm("FastCat: Are you sure you want to undo publish?")) {
        var recordIdAsGraph = recordId.replace(/:/g, ".");

        var updateString = "DROP GRAPH <http://" + recordIdAsGraph + ".ttl>;" +
                "DROP GRAPH <http://" + recordIdAsGraph + "_Ships.ttl>;" +
                "DROP GRAPH <http://" + recordIdAsGraph + "_Persons.ttl>;" +
                "DROP GRAPH <http://" + recordIdAsGraph + "_Organizations.ttl>;" +
                "DROP GRAPH <http://" + recordIdAsGraph + "_Locations.ttl>";

        var url = servicesAddress + "/WebServicesForBlazegraph/import/update";
        var req = $.myPOST(url, {"update": updateString, "namespace": "kb", "service-url": blazegraphURL}, "", 1200000); //increased timeout to 20mins

        req.done(function (data) {
            adminDB.get("status").then(function (doc) {
                var records = doc.records;
                if (typeof records[recordId] !== "undefined") {
                    if (records[recordId].startsWith("Published")) {//Only if published
                        if (typeof doc.history[recordId] !== "undefined") {
                            var previousStatus = "Published";//Undo multiple published statuses if they exist
                            while (doc.history[recordId].length > 1 && previousStatus.startsWith("Published")) {
                                // code block to be executed
                                doc.history[recordId].pop();
                                var previousStatusJSON = doc.history[recordId][doc.history[recordId].length - 1];
                                previousStatus = previousStatusJSON.status;
                            }

                            records[recordId] = previousStatus;

                            adminDB.put({
                                _id: 'status',
                                _rev: doc._rev,
                                appStatus: doc.appStatus,
                                latestStableVersion: doc.latestStableVersion,
                                records: records,
                                history: doc.history,
                                users: doc.users
                            });
                            $("#recordStatus").html("Status: " + previousStatus + "");
                            $(".undoPublish").hide();


                        }
                    } else {
                        console.log("Not published anyway!");
                    }
                }


                if (data === "Successfully updated") {
                    alert("FastCat: Record unpublished successfully!");
                }

            }).catch(function (err) {
                console.log(err);
            });

        });

    }

});


/*
 * Publish record
 */
$("body").on("click", ".uploadCatalogue", function () {

    /* Promise experiments by SAM*/
//    getRecordInstancesXML().then(values => {
//        console.log(values)
//        console.log(values.Persons);
//    });



    if (confirm("FastCat: Publishing to Research Space could be a lengthy procedure. Please leave tab open until you see record status changed! Are you sure you want to proceed?")) {
        var start = new Date();
        var recordXML = create_xml_file();
        var timeToCreateXML = new Date() - start;
        console.log("Took " + timeToCreateXML / 1000 + " secs to create record XML!");
        transformAndImportToTripleStore(timeToCreateXML, recordXML, "record");
    }

});
/*
 * Transform file from XML to TTL using 3M mappings and then import TTL to triple store
 */
function transformAndImportToTripleStore(timeToCreateXML, xml, type) {
    var start = new Date();
    var url_string = window.location.href;
    var url = new URL(url_string);

    var template = "";
    var fileId = recordId;
    var sourceXML = xml;
    if (type === "record") {//record XML
        template = url.pathname.replace(/.*?\/templates\/(.*?)\.html/g, "$1").replace(/%20/g, " ");
    } else {//instance XML
//        if (type === "Ships") {            
        sourceXML = xml[type];
//        }  
        template = "Instances/" + type;
        fileId = fileId + "_" + type;
    }

    var url = servicesAddress + "/op/services/transform";

    var req = $.myPOST(url, {recordId: fileId, mapping: "/" + template, source: sourceXML, outputFormat: "TURTLE", uuidSize: 0}, "json", 6000000); //increased timeout to 60mins

    req.done(function (transformServiceResult) {
        console.log(transformServiceResult);
        if (transformServiceResult.result !== "") {

            var timeToTransform = new Date() - start;
            console.log("Took " + timeToTransform / 1000 + " secs to transform " + type + " to TTL!");
            var fileIdAsGraph = fileId.replace(/:/g, ".");

            var updateString = "DROP GRAPH <http://" + fileIdAsGraph + ".ttl>;" +
                    "DROP GRAPH <http://" + fileIdAsGraph + "_Ships.ttl>;" +
                    "DROP GRAPH <http://" + fileIdAsGraph + "_Persons.ttl>;" +
                    "DROP GRAPH <http://" + fileIdAsGraph + "_Organizations.ttl>;" +
                    "DROP GRAPH <http://" + fileIdAsGraph + "_Locations.ttl>";


            var url = servicesAddress + "/WebServicesForBlazegraph/import/update";
            req = $.myPOST(url, {"update": updateString, "namespace": "kb", "service-url": blazegraphURL}, "", 1200000); //increased timeout to 20mins

            req.done(function (data) {

                url = servicesAddress + "/WebServicesForBlazegraph/import/import";
                var req = $.myPOST(url, {"namespace": "kb", "graph": "http://" + fileIdAsGraph + ".ttl", "content-type": "application/x-turtle", "service-url": blazegraphURL, "data-url": transformServiceResult.fileURL}, "", 1200000); //increased timeout to 20mins

                req.done(function (data) {
                    var now = new Date().toJSON();
                    var timeToImport = (new Date() - start) - timeToTransform;
                    console.log("Took " + timeToImport / 1000 + " secs to import " + type + " to Blazegraph!");
                    var totalTime = new Date() - start + timeToCreateXML;
                    console.log("Took " + totalTime / 1000 + " for whole " + type + " process!");

                    switch (type) {
                        case "record":
                            setRecordStatus(fileId, "Published");
                            $("#recordStatus").html("Status: Published(" + now.substring(0, now.length - 5) + ")");
                            $(".undoPublish").show();
                            export_instances_XML();
                            break;
                        case "Ships":
                            type = "Locations";
                            transformAndImportToTripleStore(0, xml, "Locations");
                            break;
                        case "Locations":
                            type = "Organizations";
                            transformAndImportToTripleStore(0, xml, "Organizations");
                            break;
                        case "Organizations":
                            type = "Persons";
                            transformAndImportToTripleStore(0, xml, "Persons");
                            break;
                        case "Persons":
                            alert("FastCat: Record published successfully!");
                            break;
                    }


//                    if (type === "record") {
//                        setRecordStatus(fileId, "Published");
//                        $("#recordStatus").html("Status: Published(" + now.substring(0, now.length - 5) + ")");
//                        $(".undoPublish").show();
//                        export_instances_XML();
//                    }
//                    if (type === "Persons") {
//                        alert("FastCat: Record published successfully!");
//                    }
//
//
//                    if (type === "Ships") {
//                        type = "Locations";
//                        transformAndImportToTripleStore(0, xml, "Locations");
//                    } else if (type === "Locations") {
//                        type = "Organizations";
////            xml = xml['Organizations'];
//                        transformAndImportToTripleStore(0, xml, "Organizations");
//                    } else if (type === "Organizations") {
//                        type = "Persons";
////            xml = xml['Persons'];
//                        transformAndImportToTripleStore(0, xml, "Persons");
//                    }



                });
            });
        } else {
            if (transformServiceResult.errors !== "") {
                alert("FastCat: Request to publish to Research Space failed! Reason: (" + transformServiceResult.errors + ").");
            }
        }


    }
    );
}


(function ($) {
    $.myPOST = function (url, data, dataType, timeout) {

        if (typeof timeout === 'undefined') {
            timeout = 20000; //Default timeout is 20secs if none is specified
        }

        var settings = {
            type: "POST", //predefine request type to POST
            'url': url,
            'data': data,
            'dataType': dataType,
            'timeout': timeout,
            'crossDomain': true,
//               'headers': {  'Access-Control-Allow-Origin': '*' },

            success: function () {
                console.log('success:' + url);
            },
            error: function (jqXHR, textStatus) {
//                console.log(jqXHR)
//                console.log(textStatus)
                console.log(jqXHR.status);
                console.log(jqXHR.responseText);
//                console.log(url)
                console.log('fail:' + url);
                if (url.indexOf("Blazegraph") !== -1) {
                    alert("FastCat: Request to publish to Research Space failed! Reason: " + jqXHR.responseText + ". Try later or contact support! ");
                }
            },
            complete: function () {
            }

        };
        return $.ajax(settings);
    };
})(jQuery);