/**
 * Clear out the groceries and categories for a particular user.
 */

var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');

var utils = require('./utils');
var modulename = "restart.js";

router.post('/', function (req, res) {
    var client = utils.getDBClient();

    /* Begin transaction */
    client.query("begin", function (err) {
        if (err) {
            utils.logError(modulename, "begintransaction", err);
            throw err;
        }
        var querystring = "Delete from Selections Where UserName='";
        querystring += session.username;
        querystring += "'";
        client.query(querystring, function (err, result) {
            if (err) {
                client.query("rollback", function () {
                    console.log("Bad query:" + querystring);
                    utils.logError(modulename, "deletefromselections", err);
                    throw err;
                });
            }

            querystring = "Delete from Groceries Where UserName='";
            querystring += session.username;
            querystring += "'";
            client.query(querystring, function (err, result) {
                if (err) {
                    client.query("rollback", function () {
                        console.log("Bad query:" + querystring);
                        utils.logError(modulename, "deletefromgroceries", err);
                        throw err;
                    });
                }

                querystring = "Delete from Categories Where UserName='";
                querystring += session.username;
                querystring += "'";
                client.query(querystring, function (err, result) {
                    if (err) {
                        client.query("rollback", function () {
                            console.log("Bad query:" + querystring);
                            utils.logError(modulename, "deletefromcategories", err);
                            throw err;
                        });
                    }

                    client.query("commit", function (err) {
                        if (err) {
                            client.query("rollback", function () {
                                utils.logError(modulename, "commit", err);
                                throw err;
                            });
                        }
                        console.log('Restart Complete.');
                        res.send("Ok");

                    });
                });
            });
        });
    });
});


module.exports = router;