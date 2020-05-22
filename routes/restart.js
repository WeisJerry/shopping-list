/**
 * Restart list. (Requires use of recreate_db stored procedure)
 */

var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');

var utils = require('./utils');
var modulename = "restart.js";

router.post('/', function (req, res) {
    var con = mysql.createConnection({ host: "localhost", user: "root", password: "ZinDaffies4u" });
    con.connect(function (err) {
        if (err) {
            utils.logError(modulename, "createconnection", err);
            throw err;
        }

        con.query("USE groceries", function (err, result) {
            if (err) {
                utils.logError(modulename, "usegroceries", err);
                throw err;
            }
        });

        /* Begin transaction */
        con.beginTransaction(function (err) {
            if (err) {
                utils.logError(modulename, "begintransaction", err);
                throw err;
            }
            var querystring = "Delete from Selections Where UserName='";
            querystring += session.username;
            querystring += "'";
            con.query(querystring, function (err, result, fields) {
                if (err) {
                    con.rollback(function () {
                        console.log("Bad query:" + querystring);
                        utils.logError(modulename, "deletefromselections", err);
                        throw err;
                    });
                }

                querystring = "Delete from Groceries Where UserName='";
                querystring += session.username;
                querystring += "'";
                con.query(querystring, function (err, result, fields) {
                    if (err) {
                        con.rollback(function () {
                            console.log("Bad query:" + querystring);
                            utils.logError(modulename, "deletefromgroceries", err);
                            throw err;
                        });
                    }

                    querystring = "Delete from Categories Where UserName='";
                    querystring += session.username;
                    querystring += "'";
                    con.query(querystring, function (err, result, fields) {
                        if (err) {
                            con.rollback(function () {
                                console.log("Bad query:" + querystring);
                                utils.logError(modulename, "deletefromcategories", err);
                                throw err;
                            });
                        }

                        con.commit(function (err) {
                            if (err) {
                                con.rollback(function () {
                                    utils.logError(modulename, "commit", err);
                                    throw err;
                                });
                            }
                            console.log('Transaction Complete.');
                            res.send("Ok");
                            con.end();
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;