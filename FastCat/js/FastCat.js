/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var lastAction = "";
var homeTable = "templates";


$(document).ready(function () {
    Messenger.options = {extraClasses: 'messenger-fixed messenger-on-top  fastCatMessenger', theme: 'air', 'maxMessages': 2};
    loadingMessage = messenger("Loading", 600);

    adminDB.get("status").then(function (doc) {
        var fastCatVersion = version.replace(/System version\s+(.*?)\s*[\-(].*/g, "$1");
        var latestStableVersion = doc.latestStableVersion;
        if (fastCatVersion > latestStableVersion) {
            console.log("FastCat up-to-date!");
        } else if (fastCatVersion === latestStableVersion && version.indexOf("SNAPSHOT") !== -1) {//User had snapshot version with same number
            alert("FastCat: There is a new FastCat stable release available for download! Please visit FastCatTeam, download and use the latest version (" + latestStableVersion + ").");
            console.log("FastCat out-of-date!");
        } else if (fastCatVersion < latestStableVersion) {//User had older version
            alert("FastCat: There is a new FastCat stable release available for download! Please visit FastCatTeam, download and use the latest version (" + latestStableVersion + ").");
            console.log("FastCat out-of-date!");
        }
    });



    var db = " Official";
    if (dbSuffix === "2_1") {
        db = " Official(Old)";
    } else if (dbSuffix !== "") {
        db = " Dev(" + dbSuffix + ")";
    }
    $("#version").html(version + " --- Database:" + db);
    if (typeof spy !== "undefined") {//Spy
        $("#vocabsLink").hide();
        $("#restoreButton").parent().hide();
        $("#resetButton").parent().hide();
        $("#importRecordsButton").hide();
        $("#recordsLink").children("span").html("All records");

        //Visual changes
        $(".logo img").attr("src", "img/logospy-cat.png");
        $(".main-header").attr("style", "background-color:#0C3B49;");
        $(".navbar").attr("style", "background-color:#0C3B49;");
        $("a.logo").attr("style", "background-color:#0C3B49;");
        team = false;

    } else {
        spy = false;
        team = false;
    }
    syncDBs();

    var url_string = window.location.href;
    var url = new URL(url_string);
    var table = url.searchParams.get("table");

    if (table !== null) {
//        console.log(table);
        $(".sidebar-menu.tree>li.active").removeClass("active");
        homeTable = table;
        $(".searchBox").css("visibility", "visible");

        if (table === "records") {
            var headerContent = "MY RECORDS";
            if (spy === true) {
                headerContent = "ALL RECORDS";
            }
            $(".content-header>h1").html(headerContent);
            $(".templatesBox").hide();
            $("#templatesSearchBox").attr("id", "recordsSearchBox");
            $("#recordsLink").parent().addClass("active");
        } else if (table === "vocabularies") {

            $(".content-header>h1").html("VOCABULARIES");
            $(".content>.box").hide();
            $(".vocabsBox").show();
            $(".searchBox>input").attr("id", "vocabsSearchBox");

            myVocabsDB_local.allDocs({
                include_docs: false,
                descending: false
            }).then(function (result) {

                vocabFiles = JSPath.apply(".id", result.rows);
                createTableFromDocs(templatesDB_local, "vocabs");
            });


        } else if (table === "vocabulary") {
            var vocabLabel = url.searchParams.get("vocabLabel");
            $(".content-header>h1").html("<a href='index.html?table=vocabularies'>VOCABULARIES</a> > " + vocabLabel);
            $(".content>.box").hide();
            $(".vocabs2Box").show();
            $("#templatesSearchBox").parent().css("visibility", "hidden");


            var vocabBroader = url.searchParams.get("vocabBroader");
            var vocabOrgs = url.searchParams.get("vocabOrgs");
            var language = url.searchParams.get("language");

            vocabOrgs = vocabOrgs.replace(/<br\/>/mg, "-");
            //Hiding vocabInfo
//            $(".vocabInfo").html("<p class='vocabInfo'>Broader Vocabulary category: " + vocabBroader + ", Related Organizations: " + vocabOrgs + ", Source Language: " + language + "<hr class='vocabInfo'/></p>")

            var vocabId = url.searchParams.get("vocabId");

            myRecordsDB_local.allDocs({
                include_docs: false,
                descending: false
            }).then(function (result) {
                records = JSPath.apply(".id", result.rows);
                createVocabTable(myVocabsDB_local, vocabLabel, vocabId);
            });

        }

    }


//Check mode (online-offline)
    myRecordsDB_local.createIndex({
        index: {fields: ['template']}
    });
    reactToChanges(myRecordsDB_local);
});


/*
 * -------------------------------- ACTIONS -----------------------------------------
 */


/*
 * Create new record from template
 */
$("body").on("click", ".createNewTemplate", function () {
    var template = $(this).attr("data-value");
    var templateTitle = $(this).attr("data-title");
    var newTab = $(this).hasClass("newTab");
    $("button#save").attr("data-newTab", newTab);

    var datepickerOpts = {
//        format: "dd/mm/yyyy",
        format: "yyyy-mm-dd",
        autoclose: true

    };
    if (template === "Austrian Loyd" || template === "Census Odessa" || template === "Students Register"
            || template === "Notarial Deeds" || template === "Census_LaCiotat" || template === "Maritime_Register"
            || template === "Messageries_Maritimes" || template === "Maritime_Register_ES" || template === "Ship_List" || template === "Inscription_Maritime"
            || template === "Civil Register") {

        datepickerOpts = {
            format: "yyyy",
            viewMode: "years",
            minViewMode: "years",
            autoclose: true
        };
    }
    var form = createModalForm(template, templateTitle);
    $(".modal-body>form").html(form);
    $(".datepicker").datepicker(datepickerOpts);

    $(".select2").each(function () {
        var $select = $(this);
        var vocabName = $select.attr("data-id");

        var terms = getVocab(vocabName);
        //'Register of Birth','Register of Death'
        if (terms === null) {
            if (vocabName === "typeOfRegister") {
                terms = ['Register of Birth', 'Register of Death'];
            }
        }
        var data = createSelect2Data(terms);

        $select.select2({
            tags: true,
            data: data.results
        });
    });



});
/*
 * Open new record
 */
$("#save").click(function () {
    var $form = $("form.recordPopup");
    var params = $form.serialize();

    var template = $("#template").val();
    var newId;
    myRecordsDB_local.find({
        selector: {
            template: template
        }
    }).then(function (result) {
        var count = result.docs.length;
        newId = (+count) + 1;
        var id = new Date().toJSON() + "_" + newId;

        var newTab = $("button#save").attr("data-newTab");
        var target = "_self";
        if (newTab === "true") {
            target = "_blank";
        }
        window.open("./templates/" + template + ".html?name=" + id + "&" + params, target);
    }).catch(function (err) {
        console.log(err);
        console.log(("So now we get this error when we try to find() it: " + JSON.stringify(err)));
        alert("FastCat: Unexpected error when trying to open new record! Contact support with following error message:" + JSON.stringify(err));

    });
});


/*
 * Backup
 */
$("body").on("click", "#backupButton", function () {
    // compaction complete
    dump(myRecordsDB_local, "");
    console.log("Backup created!");
});
/*
 * Restore
 */
$("body").on("click", "#restoreButton", function () {
    lastAction = "restore";
//    if (confirm("This action will restore records file to your FastCat! Are you sure?")) {
    if (confirm("FastCat: Browse your computer and choose a backup file in order to restore its records.\nWARNING: This action will delete all your records, before restoring those contained in the backup file.")) {

        $('#fileDialog').click();
        console.log("Restored!");
    }
});
/*
 * Reset
 */
$("body").on("click", "#resetButton", function () {
    if (confirm("FastCat: This action will delete ALL your records and vocabularies! Are you sure?")) {
        $('#recordsTable').DataTable().clear().draw();
        //Added next 2 lines to avoid race conditions
        myRecordsDB_local = new PouchDB('my_records');
        myVocabsDB_local = new PouchDB('my_vocabs');

        myRecordsDB_local.destroy().then(function () {
            console.log("records DB killed!");
            myRecordsDB_local = new PouchDB('my_records');
            console.log("records DB created!");

            myVocabsDB_local.destroy().then(function () {
                console.log("vocabs DB killed!");
                myVocabsDB_local = new PouchDB('my_vocabs');
                console.log("vocabs DB created!");
                alert("FastCat: All records and vocabularies deleted! Reset completed.");
            }).catch(function (err) {
// error occurred
                console.log(("So now we get this error when we try to destroy() it: " + JSON.stringify(err)));
                alert("FastCat: Unexpected error when trying to reset FastCat (deleting vocabularies)! Contact support with following error message:" + JSON.stringify(err));

            });
        }).catch(function (err) {
// error occurred
            console.log(("So now we get this error when we try to destroy() it: " + JSON.stringify(err)));
            alert("FastCat: Unexpected error when trying to reset FastCat (deleting records)! Contact support with following error message:" + JSON.stringify(err));

        });
    }

});
/*
 * Search Box typing action
 */
$("body").on("keyup", "#templatesSearchBox", function () {
    $("#templatesTable").DataTable().search(this.value).draw();
});




/* BUTTONS ABOVE RECORDS TABLE*/

/*
 * Import record(s)
 */
$("body").on("click", "#importRecordsButton", function () {

//$("#importRecordsButton").click(function() {
    lastAction = "import";

    $('#fileDialog').click();
});



/*
 * -------------------------------- FUNCTIONS -----------------------------------------
 */

function replaceRecord(id, newContent) {
    myRecordsDB_local.get(id).then(function (doc) {
        myRecordsDB_local.remove(doc).then(function () {
            myRecordsDB_local.put(newContent);
        });
    }).catch(function (err) {
        console.log(("So now we get this error when we try to get() it: " + JSON.stringify(err)));
        alert("FastCat: Unexpected error when trying to update record " + id + "! Contact support with following error message:" + JSON.stringify(err));

    });
}

function createModalForm(template, templateTitle) {
    var form = createFormInput("template", "Type of Template", "hidden", "", template);
    form = form + createFormInput("templateTitle", "Template Title", "text", "", templateTitle);
//    console.log(template)

    if (template === "Austrian Loyd") {
        form = form + createFormInput("date", "Date of Document", "date", "Fill in date of document", "");
        form = form + createFormInput("authorName", "Author of Record (Name)", "text", "Fill in author of record (Name)", "");
        form = form + createFormInput("authorSurname", "Author of Record (Surname)", "text", "Fill in author of record (Surname)", "");
    } else if (template === "Census Odessa") {
        form = form + createFormInput("fonds", "Fonds", "number", "Fill in Fonds", "");
        form = form + createFormInput("series", "Series", "number", "Fill in Series", "");
        form = form + createFormInput("file", "File", "number", "Fill in File", "");
        form = form + createFormInput("street_name", "Street Name", /*"text"*/ "select", "Fill in Street Name", "");
        form = form + createFormInput("streetNumber", "Street Number", "number", "Fill in Street Number", "");
        form = form + createFormInput("date", "Date of Document", "date", "Fill in date of document", "");
        form = form + createFormInput("authorName", "Author of Record (Name)", "text", "Fill in author of record (Name)", "");
        form = form + createFormInput("authorSurname", "Author of Record (Surname)", "text", "Fill in author of record (Surname)", "");
    } else if (template === "Civil Register") {
        form = form + createFormInput("bookNumber", "Number of Book", "number", "Fill in number of book", "");
        form = form + createFormInput("typeOfRegister", "Type of Register", "select", "Fill in type of register", "");
        form = form + createFormInput("bookYear", "Year of Book", "date", "Fill in year of book", "");
        form = form + createFormInput("topographicSignature", "Topographic Signature", "text", "Fill in topographic signature", "");


        form = form + createFormInput("authorName", "Author of Record (Name)", "text", "Fill in author of record (Name)", "");
        form = form + createFormInput("authorSurname", "Author of Record (Surname)", "text", "Fill in author of record (Surname)", "");
    } else if (template === "Crew List") {
        form = form + createFormInput("ship_type_es", "Type of Ship", "select", "Fill in type of ship", "");
        form = form + createFormInput("ship_name_es", "Name of Ship", "select", "Fill in name of ship", "");
        form = form + createFormInput("location_es", "Construction Location", "select", "Fill in construction location", "");
        form = form + createFormInput("authorName", "Author of Record (Name)", "text", "Fill in author of record (Name)", "");
        form = form + createFormInput("authorSurname", "Author of Record (Surname)", "text", "Fill in author of record (Surname)", "");
    } else if (template === "Crew List_IT") {
        form = form + createFormInput("ship_name_it", "Name of Ship", "select", "Fill in name of ship", "");
        form = form + createFormInput("bookDate", "Date of Document Release", "date", "Fill in date of book", "");
        form = form + createFormInput("authorName", "Author of Record (Name)", "text", "Fill in author of record (Name)", "");
        form = form + createFormInput("authorSurname", "Author of Record (Surname)", "text", "Fill in author of record (Surname)", "");
    } else if (template === "Crew_List_ES") {
        form = form + createFormInput("ship_name_es", "Name of Ship", "select", "Fill in name of ship", "");
        form = form + createFormInput("bookDate", "Date of Document Release", "date", "Fill in date of book", "");
        form = form + createFormInput("authorName", "Author of Record (Name)", "text", "Fill in author of record (Name)", "");
        form = form + createFormInput("authorSurname", "Author of Record (Surname)", "text", "Fill in author of record (Surname)", "");
    } else if (template === "Maritime Workers_IT") {
        form = form + createFormInput("bookNumber", "Number of Book", "number", "Fill in book number", "");
        form = form + createFormInput("authorName", "Author of Record (Name)", "text", "Fill in author of record (Name)", "");
        form = form + createFormInput("authorSurname", "Author of Record (Surname)", "text", "Fill in author of record (Surname)", "");
    } else if (template === "Students Register") {
        form = form + createFormInput("registerNumber", "Register Number", "number", "Fill in register number", "");
        form = form + createFormInput("bookDateFrom", "Date of Book (From)", "date", "Fill in date of book (From)", "");
        form = form + createFormInput("bookDateTo", "Date of Book (To)", "date", "Fill in date of book (To)", "");
        form = form + createFormInput("authorName", "Author of Record (Name)", "text", "Fill in author of record (Name)", "");
        form = form + createFormInput("authorSurname", "Author of Record (Surname)", "text", "Fill in author of record (Surname)", "");
    } else if (template === "Notarial Deeds") {
        form = form + createFormInput("source_name", "Archive/Library", "select", "Fill in archive/library", "");
//        form = form + createFormInput("bookDateFrom", "Creation Year", "date", "Fill in year of book", "");
        form = form + createFormInput("source_year_from", "Date of Source (From)", "date", "Fill in date of source (From)", "");
        form = form + createFormInput("source_year_to", "Date of Source (To)", "date", "Fill in date of source (To)", "");
        form = form + createFormInput("authorName", "Author of Record (Name)", "text", "Fill in author of record (Name)", "");
        form = form + createFormInput("authorSurname", "Author of Record (Surname)", "text", "Fill in author of record (Surname)", "");
    } else if (template === "Payroll_RU") {
        form = form + createFormInput("fonds_number", "Fonds Number", "number", "Fill in number of Fonds", "");
        form = form + createFormInput("series_number", "Series Number", "number", "Fill in number of Series", "");
        form = form + createFormInput("file_number", "File Number", "number", "Fill in number of File", "");
        form = form + createFormInput("dateFrom", "Date of Document (From)", "date", "Fill in date of document (From)", "");
        form = form + createFormInput("dateTo", "Date of Document (To)", "date", "Fill in date of document (To)", "");
        form = form + createFormInput("authorName", "Author of Record (Name)", "text", "Fill in author of record (Name)", "");
        form = form + createFormInput("authorSurname", "Author of Record (Surname)", "text", "Fill in author of record (Surname)", "");
    } else if (template === "Census_LaCiotat") {
        form = form + createFormInput("bookDateFrom", "Date of Book", "date", "Fill in date of book", "");
        form = form + createFormInput("authorName", "Author of Record (Name)", "text", "Fill in author of record (Name)", "");
        form = form + createFormInput("authorSurname", "Author of Record (Surname)", "text", "Fill in author of record (Surname)", "");
    } else if (template === "Sailors_Register") {
        form = form + createFormInput("bookNumber", "Number of Book", "number", "Fill in book number", "");
        form = form + createFormInput("authorName", "Author of Record (Name)", "text", "Fill in author of record (Name)", "");
        form = form + createFormInput("authorSurname", "Author of Record (Surname)", "text", "Fill in author of record (Surname)", "");
    } else if (template === "Maritime_Register") {
        form = form + createFormInput("bookDateFrom", "Date of Book (From)", "date", "Fill in date of book (From)", "");
        form = form + createFormInput("bookDateTo", "Date of Book (To)", "date", "Fill in date of book (To)", "");
        form = form + createFormInput("authorName", "Author of Record (Name)", "text", "Fill in author of record (Name)", "");
        form = form + createFormInput("authorSurname", "Author of Record (Surname)", "text", "Fill in author of record (Surname)", "");
    } else if (template === "Archival_Corpus") {
        form = form + createFormInput("authorName", "Author of Record (Name)", "text", "Fill in author of record (Name)", "");
        form = form + createFormInput("authorSurname", "Author of Record (Surname)", "text", "Fill in author of record (Surname)", "");
    } else if (template === "Messageries_Maritimes") {
        form = form + createFormInput("bookTitle", "Title of Book", "text", "Fill in title of book", "");
        form = form + createFormInput("bookDateFrom", "Date of Book (From)", "date", "Fill in date of book (From)", "");
        form = form + createFormInput("bookDateTo", "Date of Book (To)", "date", "Fill in date of book (To)", "");
        form = form + createFormInput("registriesFrom", "Registries Number (From)", "number", "Fill in numbers of registries (From)", "");
        form = form + createFormInput("registriesTo", "Registries Number (To)", "number", "Fill in numbers of registries (To)", "");
        form = form + createFormInput("authorName", "Author of Record (Name)", "text", "Fill in author of record (Name)", "");
        form = form + createFormInput("authorSurname", "Author of Record (Surname)", "text", "Fill in author of record (Surname)", "");
    } else if (template === "Register_of_Ships") {
        form = form + createFormInput("bookTitle", "Title of Book", "text", "Fill in title of book", "");
        form = form + createFormInput("bookNumber", "Number of Book", "number", "Fill in book number", "");
        form = form + createFormInput("authorName", "Author of Record (Name)", "text", "Fill in author of record (Name)", "");
        form = form + createFormInput("authorSurname", "Author of Record (Surname)", "text", "Fill in author of record (Surname)", "");
    } else if (template === "Maritime_Register_ES") {
        form = form + createFormInput("bookNumber", "Number of Book", "number", "Fill in book number", "");
        form = form + createFormInput("publicationDate", "Publication Date", "date", "Fill in publication date", "");

        form = form + createFormInput("authorName", "Author of Record (Name)", "text", "Fill in author of record (Name)", "");
        form = form + createFormInput("authorSurname", "Author of Record (Surname)", "text", "Fill in author of record (Surname)", "");
    } else if (template === "Seagoing_Personel") {
        form = form + createFormInput("bookTitle", "Title of Book", "text", "Fill in title of book", "");
        form = form + createFormInput("bookDateFrom", "Date of Book (From)", "date", "Fill in date of book (From)", "");
        form = form + createFormInput("bookDateTo", "Date of Book (To)", "date", "Fill in date of book (To)", "");
        form = form + createFormInput("fonds_number", "Fonds Number", "number", "Fill in number of Fonds", "");
        form = form + createFormInput("series_number", "Series Number", "number", "Fill in number of Series", "");
        form = form + createFormInput("file_number", "File Number", "number", "Fill in number of File", "");

        form = form + createFormInput("authorName", "Author of Record (Name)", "text", "Fill in author of record (Name)", "");
        form = form + createFormInput("authorSurname", "Author of Record (Surname)", "text", "Fill in author of record (Surname)", "");

    } else if (template === "Ship_List") {
        form = form + createFormInput("bookTitle", "Title of Book", "text", "Fill in title of book", "");
        form = form + createFormInput("bookDateFrom", "Date of Book (From)", "date", "Fill in date of book (From)", "");
        form = form + createFormInput("bookDateTo", "Date of Book (To)", "date", "Fill in date of book (To)", "");
        form = form + createFormInput("fonds_number", "Fonds Number", "number", "Fill in number of Fonds", "");
        form = form + createFormInput("series_number", "Series Number", "number", "Fill in number of Series", "");
        form = form + createFormInput("file_number", "File Number", "number", "Fill in number of File", "");
        form = form + createFormInput("authorName", "Author of Record (Name)", "text", "Fill in author of record (Name)", "");
        form = form + createFormInput("authorSurname", "Author of Record (Surname)", "text", "Fill in author of record (Surname)", "");
    } else if (template === "Inscription_Maritime") {
        form = form + createFormInput("registerTitle", "Title of Register", "text", "Fill in title of register", "");
        form = form + createFormInput("registerDateFrom", "Registries Date (From)", "date", "Fill in date of register (From)", "");
        form = form + createFormInput("registerDateTo", "Registries Date (To)", "date", "Fill in date of register (To)", "");
        form = form + createFormInput("authorName", "Author of Record (Name)", "text", "Fill in author of record (Name)", "");
        form = form + createFormInput("authorSurname", "Author of Record (Surname)", "text", "Fill in author of record (Surname)", "");
    } else if (template === "Catalogue_of_Resources") {
        form = form + createFormInput("provider", "Provider", "text", "Fill in provider", "");
        form = form + createFormInput("authorName", "Author of Record (Name)", "text", "Fill in author of record (Name)", "");
        form = form + createFormInput("authorSurname", "Author of Record (Surname)", "text", "Fill in author of record (Surname)", "");
    } else {
        form = form + createFormInput("ship_type_gr", "Type of Ship", "select", "Fill in type of ship", "");
        form = form + createFormInput("ship_name_gr", "Name of Ship", "select", "Fill in name of ship", "");
        form = form + createFormInput("dateFrom", "Date of Document (From)", "date", "Fill in date of document (From)", "");
        form = form + createFormInput("dateTo", "Date of Document (To)", "date", "Fill in date of document (To)", "");
        form = form + createFormInput("authorName", "Author of Record (Name)", "text", "Fill in author of record (Name)", "");
        form = form + createFormInput("authorSurname", "Author of Record (Surname)", "text", "Fill in author of record (Surname)", "");
    }
    return form;
}


function syncDBs() {
    templatesDB_local.replicate.from(templatesDB_remote).on('complete', function (info) {
//        console.log(info)
    }).on('error', onSyncError);

    if (spy === false) {

        //Testing START
        myRecordsDB_local.allDocs({
            include_docs: false,
            descending: false
        }).then(function (result) {
            records = JSPath.apply(".id", result.rows);
        });
        //Testing END


//        myRecordsDB_local.replicate.to(publicRecordsDB_remote, {retry: true}).on('complete', function(info) {//added retry in case connection fails
//        console.log(myRecordsDB_local)
        myVocabsDB_local.allDocs({
            include_docs: false,
            descending: false
        }).then(function (result) {
            vocabFiles = JSPath.apply(".id", result.rows);
            createTable();
        });
//        }).on('error', onSyncError);
    } else {
        myRecordsDB_local = publicRecordsDB_remote; //hmmm not sure about the side effects
        createTable();
    }



    function onSyncError(err) {
        console.log("Problem synching! Using local DB without replication.");
        myVocabsDB_local.allDocs({
            include_docs: false,
            descending: false
        }).then(function (result) {
//            console.log(result.rows);
            vocabFiles = JSPath.apply(".id", result.rows);
            createTable();
        });
    }

}
function createTable() {
    createTableFromDocs(templatesDB_local, "templates").done(function () {
//        createTableFromDocs(myRecordsDB_local, "records"); //Changed...
    });
}




function loadBackup(backupContents) {

    //First delete all records
    myRecordsDB_local.destroy().then(function () {
// database destroyed
        console.log("DB killed!");
        myRecordsDB_local = new PouchDB('my_records');
        console.log("DB created!");
        var data = backupContents;
        myRecordsDB_local.load(data).then(function () {
            // done loading!
            alert("FastCat: Records restored!");
            window.open("index.html?table=records", '_self');
//        createTableFromDocs(myRecordsDB_local, "records");
//        $('#recordsTable').DataTable().draw();
        }).catch(function (err) {
            alert("FastCat: " + err);
            // HTTP error or something like that
        });
    }).catch(function (err) {
// error occurred
        console.log(("So now we get this error when we try to destroy() it: " + JSON.stringify(err)));
        alert("FastCat: Unexpected error when trying to restore FastCat! Contact support with following error message:" + JSON.stringify(err));

    });




//});


}


function readSingleFile(e) {

    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
        var contents = e.target.result;

        if (contents.indexOf('"version":"1.2.8"') === -1) {//import record(s)
            var filesJSON = JSON.parse(contents);

            if (typeof filesJSON._id !== "undefined" && typeof filesJSON.template !== "undefined" && filesJSON._id.startsWith("2")) {
                delete filesJSON._rev;
                var json = [];
                json.push(filesJSON);
                filesJSON = json;
            }

            if (typeof filesJSON.docs !== "undefined" && filesJSON.docs.length === 1 && !filesJSON.docs[0]._id.startsWith("2")) {//check if imported file is actually vocabulary and if so abort!
                // //If _id is not 20... then it is not a record!
                alert("FastCat: You tried to import a file that does not contain any records! Please choose another file.");
            } else if (lastAction === "restore") {
                alert("FastCat: You tried to restore using an export file! Please choose a backup file instead.");
            } else {
                myRecordsDB_local.allDocs({
                    include_docs: false,
                    descending: false
                }).then(function (result) {
                    var docsNumber = result.total_rows;

                    myRecordsDB_local.bulkDocs(filesJSON).then(function (result) {
                        var $result = $(result);

                        if (docsNumber === 0) {
                            window.open("index.html?table=records", '_self');
                        } else {
                            $result.each(function () {
//                                console.log(this)
                                if (this.message === "Document update conflict") {//already exists
                                    var fileId = this.id;
                                    var $titleTD = $("td[title='" + fileId + "']").parent().children("td:nth-child(4)");
                                    if (confirm("FastCat: Record '" + $titleTD.html() + "' already exists! Do you wish to replace it?") === true) {
                                        var record = JSPath.apply(".docs{._id==='" + fileId + "'}", filesJSON);
                                        if (record.length > 0) {
                                            var json = record[0];
                                            replaceRecord(fileId, json);
                                        }
                                    }
                                }
                            })
                        }
                        // handle result
                    }).catch(function (err) {
                        alert("FastCat: " + err);
                    });
                });
            }
        } else if (contents.startsWith('{"version"')) {//restore
            if (lastAction === "import") {
                alert("FastCat: You tried to import a backup file! Please choose an export file instead.");
            } else if (lastAction === "restore") {
                loadBackup(contents);
            }
        }
    };
    reader.readAsText(file);
    $("#fileDialog").val(''); //resetting so that file dialog works when clicking twice on same file

}
document.getElementById('fileDialog')
        .addEventListener('change', readSingleFile, false);




var load = (function () {
    // Function which returns a function: https://davidwalsh.name/javascript-functions
    function _load(tag) {
        return function (url) {
            // This promise will be used by Promise.all to determine success or failure
            return new Promise(function (resolve, reject) {
                var element = document.createElement(tag);
                var parent = 'body';
                var attr = 'src';

                // Important success and error for the promise
                element.onload = function () {
//                    console.log("load")
                    resolve(url);
                };
                element.onerror = function () {
//                    console.log("err")
                    reject(url);
                };

                // Need to set different attributes depending on tag type
                switch (tag) {
                    case 'script':
                        element.async = true;
//                        element.onerror(function() {
//                            throw('An error occurred');
//                        });
                        break;
                    case 'link':
                        element.type = 'text/css';
                        element.rel = 'stylesheet';
                        attr = 'href';
                        parent = 'head';
                }

                // Inject into document to kick off loading
                element[attr] = url;
                document[parent].appendChild(element);
            });
        };
    }

    return {
        css: _load('link'),
        js: _load('script'),
        img: _load('img')
    }
})();
function getVocab(vocabName) {
    var terms = new Array();
    terms = JSON.parse(localStorage.getItem(vocabName));
    return terms;
}



$("body").on("click", ".action", function () {
    var $btn = $(this);
    var title = $(".content-header>h1").html().trim();

    if (title === "MY RECORDS") {
        var recordStatus = $btn.parentsUntil("td").parent().prev("td").text();
        var $actionsList = $btn.next("ul");
        if (recordStatus === "Shared") {
            $actionsList.children("li").last().find("a").html("Undo share record to Fast Cat team");
        } else {
            $actionsList.children("li").last().find("a").html("Share record to Fast Cat team");
        }
    }

});