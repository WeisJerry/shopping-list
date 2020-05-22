/**
 * remove a specified grocery.
 */

var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');

var utils = require('./utils');
var modulename = "deletegrocery.js";

router.post('/', function (req, res) {
    console.log('In custom post function.');
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

            var querystring = "Delete from Selections ";
            querystring += "Where GroceryID=";
            querystring += req.body.groceryid;
            querystring += " And UserName='";
            querystring += session.username;
            querystring += "'";

            con.query(querystring, function (err, result) {
                if (err) {
                    con.rollback(function () {
                        utils.logError(modulename, "deletefromselections", err);
                        throw err;
                    });
                }

                querystring = "Delete from Groceries ";
                querystring += "Where GroceryID=";
                querystring += req.body.groceryid;
                querystring += " And UserName='";
                querystring += session.username;
                querystring += "'";


                con.query(querystring, function (err, result) {
                    if (err) {
                        con.rollback(function () {
                            utils.logError(modulename, "deletefromgroceries", err);
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
                        res.send("Ok");
                        con.end();
                    });
                });
            });
        });
        /* End transaction */
    });
});

module.exports = router;