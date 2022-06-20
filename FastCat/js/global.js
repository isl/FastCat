/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var version = "System version 2.6 (2020-12-14T16:00)";

//variable added to use fastcat with a different set of couchDBs for testing reasons (corresponding DBs with same suffix must exist
var dbSuffix = ""; // _dev for dev setup, or empty for official
var db = {//New setup JSON-like
    "config": {
        "": {
            "http:": "http://[URL]:[PORT]",
            "https:": "https://[DOMAIN_NAME]"
        },
        "_dev": {
            "http:": "http://[URL]:[PORT]",
            "https:": "https://[DOMAIN_NAME]"
        }        
    }
};


//Useful URLs
var fastCatTeamUrl = "http://[FASTCatTeam_url]"; //will become https asap
var geonamesQueryUrl = "geonames_url";
var gettyQueryUrl = "gettyTGN_url";

//local DBs
var templatesDB_local = new PouchDB('templates');
var myRecordsDB_local = new PouchDB('my_records');
var myVocabsDB_local = new PouchDB('my_vocabs');
var persons_local = new PouchDB('persons' + dbSuffix);
var ships_local = new PouchDB('ships' + dbSuffix);
var organizations_local = new PouchDB('organizations' + dbSuffix);
var locations_local = new PouchDB('locations' + dbSuffix);

//remote DBs
var serverIPandPort;
initDB();
var templatesDB_remote = new PouchDB(serverIPandPort + '/templates');
var publicRecordsDB_remote = new PouchDB(serverIPandPort + '/public_records' + dbSuffix + '');
var publicVocabsDB_remote = new PouchDB(serverIPandPort + '/public_vocabs' + dbSuffix + '');
var instancesDB = new PouchDB(serverIPandPort + '/instances' + dbSuffix + '');
var personsDB = new PouchDB(serverIPandPort + '/persons' + dbSuffix + '');
var shipsDB = new PouchDB(serverIPandPort + '/ships' + dbSuffix + '');
var organizationsDB = new PouchDB(serverIPandPort + '/organizations' + dbSuffix + '');
var locationsDB = new PouchDB(serverIPandPort + '/locations' + dbSuffix + '');

var adminDB = new PouchDB(serverIPandPort + '/admin' + dbSuffix + '');

function initDB() {//Choose 
    var url_string = window.location.href;
    var url = new URL(url_string);
    serverIPandPort = db.config[dbSuffix][url.protocol];
    console.log("Connected to: " + serverIPandPort);

}


function createFormInput(id, label, type, placeholder, value) {
    var html;
    var readonly = "";
    if (placeholder === "") {//readonly
        readonly = " readonly='readonly' ";
    }

    var labelHtml = "<label for='" + id + "'>" + label + "</label>";

    if (type === "text" || type === "number" || type === "hidden" || type === "password" || type === "email") {
        if (type === "hidden") {
            labelHtml = "";
        }
        html = "<div class='form-group'>" +
                labelHtml +
                "<input type='" + type + "' name='" + id + "' class='form-control' id='" + id + "' placeholder='" + placeholder + "' value=\"" + value + "\"" + readonly + "></input>" +
                "</div>";
    } else if (type === "date") {
        html = "<div class='form-group'>" +
                labelHtml +
                "<div class='input-group date'>" +
                "<div class='input-group-addon'>" +
                "<i class='fa fa-calendar'></i>" +
                "</div>" +
                "<input type='text' name='" + id + "' class='form-control pull-right datepicker' id='" + id + "' placeholder='" + placeholder + "'>" +
                "</div>" +
                "</div>";
//    } else if (type==="password") {

    } else if (type === "select") {
        html = "<div class='form-group'>" +
                labelHtml +
                "<select id='" + id + "' name='" + id + "' data-id='" + id + "' data-placeholder='" + placeholder + "' class='form-control select2' style='width: 100%;'>" +
                "<option></option>" +
                "</select>" +
                "</div>";


    }
    return html;
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(
            function (key) {
                return object[key] === value;
            }
    );
}
function jsonEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}


function getValueFromJSONPath(path, valueIfNull) {
    var jsonVar = path;
    if (jsonVar === null) {
        jsonVar = valueIfNull;
    }
    return jsonVar;
}

function createMultipleAuthors(author, authorName, authorSurname) {
    if (authorName !== null && authorSurname !== null) {
        var authorNames = authorName.split("\n");
        var authorSurnames = authorSurname.split("\n");

        if (authorNames.length > 1 || authorSurnames.length > 1) {
            author = "";
            for (var i = 0; i < authorNames.length; i++) {
                author = author + authorNames[i] + " " + authorSurnames[i] + " ";
            }
        }
    }
    return author;
}

function createFilename(doc, templateTitle) {
//    var templatePlusName = doc.template;
    var separator = ", ";


    if (typeof doc.data === "undefined") {//No data yet
        return   templateTitle;
    } else {
        var template = doc.template;
        var authorName = getValueFromJSONPath(doc.data.record_information.name, "-");
        var authorSurname = getValueFromJSONPath(doc.data.record_information.surname, "-");
        var author = authorName + " " + authorSurname;
        author = createMultipleAuthors(author, authorName, authorSurname); //just checking



        if (typeof doc.data.ship_records !== "undefined") {//If has ship
            var dateFrom = "-";
            var dateTo = "-";
            var shipName = getValueFromJSONPath(doc.data.ship_records.ship_name, "-");
            var shipType = getValueFromJSONPath(doc.data.ship_records.ship_type, "-");


            if (template === "Crew List") {
                var constructionLocation = getValueFromJSONPath(doc.data.ship_records.construction_location_country, "-");
                return templateTitle + separator + shipType + separator + shipName + separator + constructionLocation + separator + author;
            } else if (template === "Crew List_IT") {
                var date_of_document = getValueFromJSONPath(doc.data.source_identity.date_of_document, "-");
                return templateTitle + separator + shipName + separator + date_of_document + separator + author;
            } else if (template === "Crew_List_ES") {
                var date_of_document = getValueFromJSONPath(doc.data.source_identity.date_of_document, "-");
                return templateTitle + separator + shipName + separator + date_of_document + separator + author;
            } else {//Payroll or Logbook or Accounts book

                if (template === "Payroll") {
                    dateFrom = getValueFromJSONPath(doc.data.source_identity.book_date_from, "-");
                    dateTo = getValueFromJSONPath(doc.data.source_identity.book_date_to, "-");

                } else if (template === "Logbook") {
                    dateFrom = getValueFromJSONPath(doc.data.source_identity.book_date_from, "-");
                    dateTo = getValueFromJSONPath(doc.data.source_identity.book_date_to, "-");

                } else if (template === "Accounts book") {
                    dateFrom = getValueFromJSONPath(doc.data.source_identity.book_date_from, "-");
                    dateTo = getValueFromJSONPath(doc.data.source_identity.book_date_to, "-");
                }
                var date = dateFrom + "_" + dateTo;

                return templateTitle + separator + shipName + separator + shipType + separator + date + separator + author;
            }
        } else {//No ship!

            if (template === "Census Odessa") {
                var date = getValueFromJSONPath(doc.data.source_identity.date_of_document, "-");
                var fonds = getValueFromJSONPath(doc.data.source_identity.fonds, "-");
                var serie = getValueFromJSONPath(doc.data.source_identity.serie, "-");
                var file = getValueFromJSONPath(doc.data.source_identity.file, "-");

                var tripleValue = fonds + "." + serie + "." + file;

                var streetName = getValueFromJSONPath(doc.data.source_identity.street_name, "-");
                var streetNumber = getValueFromJSONPath(doc.data.source_identity.street_number, "-");

                return templateTitle + separator + tripleValue + separator + streetName + separator + streetNumber + separator + date + separator + author;
            } else if (template === "Civil Register") {
                var bookNumber = getValueFromJSONPath(doc.data.source_identity.book_number, "-");
                var typeOfRegister = getValueFromJSONPath(doc.data.source_identity.book_type_of_register, "-");

                var bookYear = getValueFromJSONPath(doc.data.source_identity.book_year, "-");
                var bookTopographicSignature = getValueFromJSONPath(doc.data.source_identity.book_topographic_signature, "-");


                return templateTitle + separator + bookNumber + separator + typeOfRegister + separator + bookYear + separator + bookTopographicSignature + separator + author;
            } else if (template === "Students Register") {
                var registryNumber = getValueFromJSONPath(doc.data.source_identity.register_number, "-");
                var bookDateFrom = getValueFromJSONPath(doc.data.source_identity.book_date_from, "-");
                var bookDateTo = getValueFromJSONPath(doc.data.source_identity.book_date_to, "-");

                return templateTitle + separator + registryNumber + separator + bookDateFrom + "-" + bookDateTo + separator + author;
            } else if (template === "Maritime Workers_IT") {
                var number_of_document = getValueFromJSONPath(doc.data.source_identity.book_number, "-");
                return templateTitle + separator + number_of_document + separator + author;
            } else if (template === "Payroll_RU") {
                var fondNumber = getValueFromJSONPath(doc.data.source_identity.fonds_number, "-");
                var seriesNumber = getValueFromJSONPath(doc.data.source_identity.series_number, "-");
                var fileNumber = getValueFromJSONPath(doc.data.source_identity.file_number, "-");
                var dateFrom = getValueFromJSONPath(doc.data.source_identity.file_date_from, "-");
                var dateTo = getValueFromJSONPath(doc.data.source_identity.file_date_to, "-");
                return templateTitle + separator + fondNumber + separator + seriesNumber + separator + fileNumber + separator + dateFrom + "-" + dateTo + separator + author;
            } else if (template === "Notarial Deeds") {
                var archive = getValueFromJSONPath(doc.data.source_identity.source_name, "-");
//                var bookDate = getValueFromJSONPath(doc.data.source_identity.creation_year, "-");
                var sourceDateFrom = getValueFromJSONPath(doc.data.source_identity.source_year_from, "-");
                var sourceDateTo = getValueFromJSONPath(doc.data.source_identity.source_year_to, "-");

                return templateTitle + separator + archive + separator + sourceDateFrom + "-" + sourceDateTo + separator + author;
            } else if (template === "Census_LaCiotat") {
                var bookDate = getValueFromJSONPath(doc.data.source_identity.book_date, "-");

                return templateTitle + separator + bookDate + separator + author;
            } else if (template === "Sailors_Register") {
                var bookNumber = getValueFromJSONPath(doc.data.source_identity.book_number, "-");

                return templateTitle + separator + bookNumber + separator + author;
            } else if (template === "Maritime_Register") {
                var bookDateFrom = getValueFromJSONPath(doc.data.source_identity.book_date_from, "-");
                var bookDateTo = getValueFromJSONPath(doc.data.source_identity.book_date_to, "-");

                return templateTitle + separator + bookDateFrom + "-" + bookDateTo + separator + author;
            } else if (template === "Messageries_Maritimes") {
                var bookTitle = getValueFromJSONPath(doc.data.source_identity.book_title, "-");

                var bookDateFrom = getValueFromJSONPath(doc.data.source_identity.book_date_from, "-");
                var bookDateTo = getValueFromJSONPath(doc.data.source_identity.book_date_to, "-");

                var bookDate = bookDateFrom + "-" + bookDateTo;

                var registriesFrom = getValueFromJSONPath(doc.data.source_identity.included_registries_from, "-");
                var registriesTo = getValueFromJSONPath(doc.data.source_identity.included_registries_to, "-");

                var registries = registriesFrom + "-" + registriesTo;


                return templateTitle + separator + bookTitle + separator + bookDate + separator + registries + separator + author;
            } else if (template === "Register_of_Ships") {
                var bookTitle = getValueFromJSONPath(doc.data.source_identity.book_title, "-");
                var bookNumber = getValueFromJSONPath(doc.data.source_identity.book_number, "-");


                return templateTitle + separator + bookTitle + separator + bookNumber + separator + author;
            } else if (template === "Maritime_Register_ES") {
                var bookNumber = getValueFromJSONPath(doc.data.source_identity.book_number, "-");
                var publicationDate = getValueFromJSONPath(doc.data.source_identity.publication_date, "-");


                return templateTitle + separator + bookNumber + separator + publicationDate + separator + author;
            } else if (template === "Seagoing_Personel") {
                var bookTitle = getValueFromJSONPath(doc.data.source_identity.title_of_book, "-");

                var bookDateFrom = getValueFromJSONPath(doc.data.source_identity.source_date_from, "-");
                var bookDateTo = getValueFromJSONPath(doc.data.source_identity.source_date_to_at, "-");

                var bookDate = bookDateFrom + "-" + bookDateTo;

                var fondNumber = getValueFromJSONPath(doc.data.source_identity.fonds_number, "-");
                var seriesNumber = getValueFromJSONPath(doc.data.source_identity.series_number, "-");
                var fileNumber = getValueFromJSONPath(doc.data.source_identity.file_number, "-");

                return templateTitle + separator + bookTitle + separator + bookDate + separator + fondNumber + separator + seriesNumber + separator + fileNumber + separator + author;
            } else if (template === "Ship_List") {
                var bookTitle = getValueFromJSONPath(doc.data.source_identity.book_title, "-");

                var bookDateFrom = getValueFromJSONPath(doc.data.source_identity.book_date_from, "-");
                var bookDateTo = getValueFromJSONPath(doc.data.source_identity.book_date_to, "-");

                var bookDate = bookDateFrom + "-" + bookDateTo;

                var fondNumber = getValueFromJSONPath(doc.data.source_identity.fonds_number, "-");
                var seriesNumber = getValueFromJSONPath(doc.data.source_identity.series_number, "-");
                var fileNumber = getValueFromJSONPath(doc.data.source_identity.file_number, "-");

                return templateTitle + separator + bookTitle + separator + bookDate + separator + fondNumber + separator + seriesNumber + separator + fileNumber + separator + author;
            } else if (template === "Inscription_Maritime") {
                var registerTitle = getValueFromJSONPath(doc.data.source_identity.title_of_register, "-");
                var registerDateFrom = getValueFromJSONPath(doc.data.source_identity.register_from, "-");
                var registerDateTo = getValueFromJSONPath(doc.data.source_identity.register_to, "-");
                var registerDate = registerDateFrom + "-" + registerDateTo;

                return templateTitle + separator + registerTitle + separator + registerDate + separator + author;
            } else if (template === "Archival_Corpus") {
                return templateTitle + separator + author;
            } else if (template === "Catalogue_of_Resources") {
                var provider = getValueFromJSONPath(doc.data.record_information.role_in_project, "-");

                return templateTitle + separator + provider + separator + author;
            } else {//Austrian Loyd              
                if (typeof doc.data.source_identity !== "undefined") {//failsafe for UFO templates (e.g. Editor)
                    var date = getValueFromJSONPath(doc.data.source_identity.book_date, "-");
                    return templateTitle + separator + date + separator + author;
                } else {
                    return templateTitle + separator + author;
                }
            }
        }

    }
}
function appendJSONObject(currentJSON, newJSON) {
    return $.extend(true, currentJSON, newJSON);
}
function createSelect2Data(terms) {
    var results = {
        results: []
    };

    if (terms) {
        for (var i = 0; i < terms.length; i++) {
            var term = terms[i];
            var res = {
                "id": term,
                "text": term
            };
            results.results.push(res);
        }
    }

    return results;
}

function getJSONsize(json) {
    return Object.keys(json).length;
}
function jsonCopy(src) {
    return JSON.parse(JSON.stringify(src));
}
function setRecordStatus(recordId, recordStatus) {
    adminDB.get("status").then(function (doc) {
        var records = doc.records;
        var rec = {};
        var now = new Date().toJSON();
        now = now.substring(0, now.length - 5);
        if (recordStatus === "Published") {
            recordStatus = recordStatus + " (" + now + ")";
        }

        rec[recordId] = recordStatus;
        records = appendJSONObject(records, rec);

        var history = doc.history;
        var historyEntry = {
            "status": recordStatus,
            "timestamp": now
        };
        if (typeof doc.history[recordId] === "undefined") {
//            setRecordStatus(recordId, "Under processing"); 
            doc.history[recordId] = [];
            var firstEntry = {
                "status": "Under processing",
                "timestamp": now
            };
            doc.history[recordId].push(firstEntry);

        }
        doc.history[recordId].push(historyEntry);

        adminDB.put({
            _id: 'status',
            _rev: doc._rev,
            appStatus: doc.appStatus,
            latestStableVersion: doc.latestStableVersion,
            records: records,
            history: history,
            users: doc.users


        });

    }).catch(function (err) {
        console.log(err);
    });
}

////////////////////////////////////////////////////////////////////////////////

$('#ship_voyages').click(function () {

    //console.log('piou')

    var map, select;



    publicRecordsDB_remote.find({
        selector: {
            template: 'Logbook'
        },
        fields: ['_id', 'template', 'data'],
        limit: 10000
    }).then(function (result) {
        console.log(result);
        localStorage.setItem("kml_file", JSON.stringify(result));

        window.open('./templates/ship_map.html?', "_self");
    }
    );


});
function getInstanceDBsFromType(type) {
    var localDB;
    var remoteDB;
    switch (type) {
        case 'organizations':
            remoteDB = organizationsDB;
            localDB = organizations_local;
            break;
        case 'ships':
            remoteDB = shipsDB;
            localDB = ships_local;
            break;
        case 'persons':
            remoteDB = personsDB;
            localDB = persons_local;
            break;
        case 'locations':
            remoteDB = locationsDB;
            localDB = locations_local;
            break;
    }
    return new Array(localDB, remoteDB);
}


/*
 * Splits merged instances to separate (per letter) to work with the new engine
 */
function splitInstancesPerLetter(type, instances) {
    var instsPerLetter = [];

    Object.keys(instances).forEach(function (key, index) {
        var keyJSON = key.replace(/({|:|,)'/g, '$1"').replace(/'(?=,|:|})/g, '"').replace(/\\'/g, "");
        ;
//WAS 
//        var letter = getInstanceFirstLetterPerType(type, JSON.parse(key.replace(/'/g, "\"")));

//IS (to fix {'name':'nicolo'' --- {"surname_a':"prod'hom' --- "location_name':"land's end',"
        var letter = getInstanceFirstLetterPerType(type, JSON.parse(keyJSON));

        var json = {};
        json[key] = instances[key];
        instsPerLetter[letter] = appendJSONObject(instsPerLetter[letter], json);
    });
    return instsPerLetter;
}
function getInstanceFirstLetterPerType(type, instance) {
    var firstLetter;
    if (type === "organizations" || type === "ships") {
        if (typeof instance.name !== "undefined") {
            firstLetter = instance.name.charAt(0).toLowerCase();
        }
    } else if (type === "locations") {
        firstLetter = instance.location_name.charAt(0).toLowerCase();
    } else if (type === "persons") {
        if (typeof instance.surname_a !== "undefined") {
            firstLetter = instance.surname_a.charAt(0).toLowerCase();
        }
    }
    if (firstLetter === "_") {// underscore is reserved, replace with -
        firstLetter = "-";
    }

    return firstLetter;
}
function bulkUpdateDocs(remoteDB, allDocsResult, type, instances) {
    var instancesPerLetter = splitInstancesPerLetter(type, instances);
//        console.log(instancesPerLetter)

    var recordInstancesLetters = Object.keys(instancesPerLetter);
//    console.log(recordInstancesLetters.length)
//    console.log(allDocsResult.total_rows)
    var docs = [];

    if (allDocsResult.total_rows === 0) {//Create docs

        Object.keys(instancesPerLetter).forEach(function (key, index) {
            if (key !== "") {
                var fileJSON = {
                    "_id": key,
                    "lastModified": new Date().toJSON(),
                    "instances": instancesPerLetter[key]
                };

                docs.push(fileJSON);
            }
        });

    } else {//Update docs
//        console.log("UPDATE")
        $.each(allDocsResult.rows, function () {
//            console.log(this.id)
            recordInstancesLetters.splice(recordInstancesLetters.indexOf(this.id), 1);
            if (this.error) {//create new file
                var fileJSON = {
                    "_id": this.key,
                    "lastModified": new Date().toJSON(),
                    "instances": instancesPerLetter[this.key]
                };
                this.doc = fileJSON;
            } else {//update file
                this.doc.instances = instancesPerLetter[this.id];
                this.doc.lastModified = new Date().toJSON();
            }

//        console.log(this.doc)
            if (typeof this.doc.instances === "undefined") {
                delete this.doc.instances;
            }
            docs.push(this.doc);
        });
//        console.log(recordInstancesLetters)
        recordInstancesLetters.forEach(function (key) {
//            console.log(key)
            if (key !== "") {
                var fileJSON = {
                    "_id": key,
                    "lastModified": new Date().toJSON(),
                    "instances": instancesPerLetter[key]
                };
                docs.push(fileJSON);
            }
        });

    }
//    console.log(docs)
    remoteDB.bulkDocs(docs).then(function (result) {

    }).catch(function (err) {
        console.log(err);
    });
}

/*
 * Requires TESTING!!!
 * @param {type} recordId
 * @returns {undefined}
 *  */

function saveRecordRemotely(recordId) {
    myRecordsDB_local.get(recordId).then(function (localDoc) {
        publicRecordsDB_remote.get(recordId).then(function (remoteDoc) {
            publicRecordsDB_remote.put({
                _id: remoteDoc._id,
                _rev: remoteDoc._rev,
                template: remoteDoc.template,
                status: localDoc.status,
                data: localDoc.data
            }).then(function (response) {
                uploadInstances(recordId);
            }).catch(function (err) {
                if (err.name === 'conflict') {
                    // conflict!
                    console.log("conflict");
                    publicRecordsDB_remote.get(recordId, {conflicts: true}).then(function (response) {
                        resolveConflict(response._rev, response.data.record_information.date_until, response._conflicts);

                        publicRecordsDB_remote.get(recordId).then(function (remoteDoc) {
                            publicRecordsDB_remote.put({
                                _id: remoteDoc._id,
                                _rev: remoteDoc._rev,
                                template: remoteDoc.template,
                                status: localDoc.status,
                                data: localDoc.data
                            }).then(function (response) {
                                console.log("FIN?");
                                uploadInstances(recordId);
                            });
                        });


                    });
                } else {
                    // some other error
                    console.log(err);
                    console.log("some other error");
                }
            });
        }).catch(function (err) {

            if (err.name === "not_found") {//Fresh record in Team
                var record = {
                    _id: localDoc._id,
                    template: localDoc.template,
                    status: localDoc.status,
                    data: localDoc.data
                };
                publicRecordsDB_remote.put(record).then(function (response) {
                    console.log("FIN?");
                    uploadInstances(recordId);
                });
            }
        });
        ;
    });
}
