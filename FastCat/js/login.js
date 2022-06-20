/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function () {

    templatesDB_remote.info().then(function (info) {
        console.log(info)

        $(".main-header").attr("style", "background-color:#C64F1A;");
        $(".navbar").attr("style", "background-color:#C64F1A;");
        $("a.logo").attr("style", "background-color:#C64F1A;");
        $(".signIn").focus();

        var db = " Official";
        if (dbSuffix === "2_1") {
            db = " Official(Old)";
        } else if (dbSuffix !== "") {
            db = " Dev(" + dbSuffix + ")";
        }
        $("#version").html(version + " --- Database:" + db);
        $("html").css("visibility", "visible");

    }).catch(function (err) {
        if (err.toString().indexOf("Failed to fetch") !== -1) {
            window.open("connectionProblem.html", '_self');
//            alert("FastCat: Cannot connect to Fast Cat Team. Please check your network connection (e.g. if you connect via wifi, try a wired connection)!");
        } else {
            alert("FastCat: An unknown error has occurred. Please try using another browser or a better network connection!");
        }

    });

});

$(".signIn").click(function (e) {
    var username = $("#inputusername").val();
    var password = $("#inputPassword").val();
    login(username, password);
});



$('form').validator().on('submit', function (e) {
    if (e.isDefaultPrevented()) {
        // handle the invalid form...
        alert("FastCat: Please fill in all fields properly!");

    } else {
        // everything looks good!
        e.preventDefault();

        var username = $("#username").val();
        var password = $("#password").val();
        var fullName = $("#fullName").val();
        var organization = $("#organization").val();
        var email = $("#email").val();

        templatesDB_remote.logOut().then(function (response) {//Sign up crashes if user is logged in, so I have to logout first

            ////Sign Up
            templatesDB_remote.signUp(username, password, {
                metadata: {
                    email: email,
                    organization: organization,
                    fullName: fullName,
                    level: "user"
                }
            }, function (err, response) {
                // etc.
                if (err) {
                    console.log(err)
                    if (err.name === 'conflict') {
                        // username already exists, choose another username
                        alert("FastCat: Username " + username + " already exists! Please choose another username!");
                    } else if (err.name === 'authentication_error') {
                        // name or password incorrect
                        console.log(err.name);
                        alert("FastCat: Please fill in all fields properly!");
                    } else if (err.status === 0 && err.name === 'unknown') {//peculiar...
                        // name or password incorrect
                        console.log(err.name);
                        alert("FastCat: User " + username + " created. Welcome!");
                        login(username, password);
                    } else {
                        // cosmic rays, a meteor, etc.
                        alert("FastCat: Something went wrong!");
                    }
                } else {
                    console.log(response)
                    alert("FastCat: User " + username + " created. Welcome!");
                    login(username, password);
                }
            });
        });


    }
})


function login(username, password) {
    templatesDB_remote.info().then(function (info) {
//        console.log(info);
        templatesDB_remote.logIn(username, password, function (err, response) {

            if (err) {
                console.log(err);
                if (err.name === 'unauthorized' || err.name === 'forbidden') {
// name or password incorrect
                    console.log(err.name);
                    alert("FastCat: Username or password is incorrect!");
                } else if (err.name === 'authentication_error') {
                    alert("FastCat: " + err.message);
                } else {
// cosmic rays, a meteor, etc.
                    alert("FastCat: An unknown error has occurred. Please try using another browser or a better network connection!");
                }
            } else {

                adminDB.get("status").then(function (doc) {

                    var userJson = {
                        "lastlogin": new Date().toJSON(),
                        "teamVersion": version
                    };
                    var json = {};
                    json[username] = userJson;
                    var outOfDate = false;
                    if (typeof doc.users !== "undefined") {
                        if (typeof doc.users[username] !== "undefined") {//get last login version
                            var latestStableVersionNo = doc.latestStableVersion;
                            var lastLoginVersion = doc.users[username].teamVersion;
//                        console.log(latestStableVersionNo)
                            var lastLoginVersionNo = lastLoginVersion.replace(/System version\s+(.*?)\s*[\-(].*/g, "$1");
//                        console.log(lastLoginVersionNo)
                            if (lastLoginVersionNo > latestStableVersionNo) {
                                console.log("FastCat up-to-date!");
                            } else if (lastLoginVersionNo === latestStableVersionNo && lastLoginVersion.indexOf("SNAPSHOT") !== -1) {//User had snapshot version with same number
                                alert("FastCat: Since your last login, there is a new FastCat stable release available for download! Please download and use the latest version (" + latestStableVersionNo + ").");
                                console.log("FastCat out-of-date!");
                                outOfDate = true;
                            } else if (lastLoginVersionNo < latestStableVersionNo) {//User had older version
                                alert("FastCat: Since your last login, there is a new FastCat stable release available for download! Please download and use the latest version (" + latestStableVersionNo + ").");
                                console.log("FastCat out-of-date!");
                                outOfDate = true;
                            }
                        }
                        doc.users[username] = userJson;
                    } else {
                        doc.users = json;
                    }
//                console.log(doc.users)

                    adminDB.put({
                        _id: 'status',
                        _rev: doc._rev,
                        appStatus: doc.appStatus,
                        latestStableVersion: doc.latestStableVersion,
                        records: doc.records,
                        history: doc.history,
                        users: doc.users
                    }).then(function (response) {
                        // handle response
                        if (outOfDate === true) {
                            window.open("team.html?page=downloads", '_self');
                        } else {
                            window.open("team.html", '_self');
                        }

                    }).catch(function (err) {
                        console.log(err);
                        if (outOfDate === true) {
                            window.open("team.html?page=downloads", '_self');
                        } else {
                            window.open("team.html", '_self');
                        }

                    });

                });
            }
        });
    }).catch(function (err) {
        if (err.toString().indexOf("Failed to fetch") !== -1) {
            alert("FastCat: Cannot connect to Fast Cat Team. Please check your network connection (e.g. if you connect via wifi, try a wired connection)!");
        } else {
            alert("FastCat: An unknown error has occurred. Please try using another browser or a better network connection!");
        }

    });


}