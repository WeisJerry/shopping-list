/**
 * Add a new user
 */

var express = require('express');
var router = express.Router();

var utils = require('./utils');
var modulename = "newuser.js";

router.post('/', function (req, res) {
    var client = utils.getDBClient();

    var username = req.body.newusername.toLowerCase();
    var password = req.body.newpassword;
    var hint = req.body.hint;

    console.log("New User:" + username);
    password = utils.encrypt(password);

    //check that category does not already exist
    var querystring = "SELECT * FROM Users ";
    querystring += "Where USERNAME='";
    querystring += username;
    querystring += "';";

    client.query(querystring, function (err, result) {
        if (err) {
            utils.logError(modulename, "doesuserexist", err);
            throw err;
        }

        //see if there is a matching category
        if (result.rowCount > 0)
            res.sendFile(__basedir + '/newuser.html');
        else {
            querystring = "INSERT INTO Users (USERNAME,PASSWORD,HINT) values (";
            querystring += "'";
            querystring += username;
            querystring += "','";
            querystring += password;
            querystring += "','";
            querystring += hint;
            querystring += "')";

            //Add new user to database
            client.query(querystring, function (err, result) {
                if (err) {
                    utils.logError(modulename, "insertnewuser", err);
                    throw err;
                }
                res.sendFile(__basedir + '/views/login.html');
            });
        }
    });


});

module.exports = router;
