/**
 * Create a new grocery.
 */

var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');

var utils = require('./utils');
var modulename = "newgrocery.js";

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

        //check that grocery does not already exist
        var querystring = "SELECT GROCERYNAME FROM Groceries ";
        querystring += "Where UserName='";
        querystring += session.username;
        querystring += "'";
        
        con.query(querystring, function (err, result, fields) {
            if (err) {
                utils.logError(modulename, "doesgrocerynameexist", err);
                throw err;
            }

            //see if there is a matching category
            var groceryExists = false;
            var newGroceryName = req.body.groceryname.toLowerCase();
            Object.keys(result).forEach(function (key) {
                var row = result[key];
                var grocname = row.GROCERYNAME.toLowerCase();
                if (grocname == newGroceryName) {
                    groceryExists = true;
                }
            });

            if (!groceryExists) {

                /* Begin transaction */
                con.beginTransaction(function (err) {
                    if (err) {
                        utils.logError(modulename, "begintransaction", err);
                        throw err;
                    }

                    //insert the new grocery
                    var querystring = "INSERT INTO Groceries (GROCERYNAME, CategoryId,UserName) values (";
                    querystring += "'";
                    querystring += req.body.groceryname;
                    querystring += "','";
                    querystring += req.body.categoryid;
                    querystring += "','";
                    querystring += session.username;
                    querystring += "')";
                    console.log("New Grocery query: " + querystring);
                    con.query(querystring, function (err, result) {
                        if (err) {
                            con.rollback(function () {
                                utils.logError(modulename, "insertgrocery", err);
                                throw err;
                            });
                        }

                        //get the ID for the new grocery
                        querystring = "SELECT GroceryID from Groceries where GROCERYNAME='";
                        querystring += req.body.groceryname;
                        querystring += "'";
                        querystring += " And UserName='";
                        querystring += session.username;
                        querystring += "'";
        

                        con.query(querystring, function (err, result) {
                            if (err) {
                                con.rollback(function () {
                                    utils.logError(modulename, "selectgroceryid", err);
                                    throw err;
                                });
                            }

                            //get the matching groceryID
                            var grocID = -1;
                            Object.keys(result).forEach(function (key) {
                                var row = result[key];
                                grocID = row.GroceryID;
                            });

                            //create the initial selections entry
                            querystring = "INSERT INTO Selections (QUANTITY, GroceryId, CategoryId, UserName) values (";
                            querystring += "0";
                            querystring += ",";
                            querystring += grocID;
                            querystring += ",";
                            querystring += req.body.categoryid;
                            querystring += ",'";
                            querystring += session.username;
                            querystring += "')";

                            con.query(querystring, function (err, result) {
                                if (err) {
                                    con.rollback(function () {
                                        utils.logError(modulename, "insertnewgroceryintoselections", err);
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
                /* End transaction */
            }
        });
    });
});

module.exports = router;