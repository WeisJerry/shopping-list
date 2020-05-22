/**
 * Grocery List Manage Functions
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');

var utils = require('./utils');
var modulename = "manage.js";

router.get('/', function (req, res) {
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
        con.beginTransaction(function (err) {
            if (err) {
                utils.logError(modulename, "begintransaction", err);
                throw err;
            }

            var categories = [];

            var buffer = "";
            var querystring = "Select Groceries.GROCERYNAME, Groceries.GROCERYID, Selections.QUANTITY, ";
            querystring += " Categories.CATEGORYID, Categories.CATEGORYNAME ";
            querystring += "from Groceries ";
            querystring += "Inner Join Selections ";
            querystring += "on Groceries.GroceryID = Selections.GroceryID ";
            querystring += "Inner Join Categories ";
            querystring += "on Groceries.CategoryID = Categories.CategoryID ";
            querystring += " Where Groceries.UserName='";
            querystring += session.username;
            querystring += "'";
            querystring += " And Categories.UserName='";
            querystring += session.username;
            querystring += "'";
            querystring += " And Selections.UserName='";
            querystring += session.username;
            querystring += "'";

            querystring += " order by Groceries.CategoryID";

            con.query(querystring, function (err, result, fields) {
                if (err) {
                    utils.logError(modulename, "selectgroceries", err);
                    throw err;
                }
                var categorystring = "";
                buffer += "<table>";

                //loop through the categories, and get the groceries for each category
                Object.keys(result).forEach(function (key) {
                    var row = result[key];

                    if (categorystring == "" || categorystring != row.CATEGORYNAME) {
                        buffer += "<tr><td>";
                        buffer += "<strong>";
                        buffer += row.CATEGORYNAME;
                        buffer += "</strong>";
                        buffer += "</td>";
                        buffer += "<td>";
                        buffer += "<button type='button' onclick='deleteCategory(";
                        buffer += row.CATEGORYID;
                        buffer += ");'>Remove</button>";
                        buffer += "&nbsp;<button type='button' onclick='newGrocery(";
                        buffer += row.CATEGORYID;
                        buffer += ");'>New Grocery</button>";
                        buffer += "</td></tr>";
                        categorystring = row.CATEGORYNAME;
                        categories.push(categorystring);
                    }
                    buffer += "<tr><td>";
                    buffer += row.GROCERYNAME;
                    buffer += "</td><td>";
                    buffer += "<button type='button' onclick='deleteGrocery(";
                    buffer += row.GROCERYID;
                    buffer += ");'>Remove</button>";
                    buffer += "</td></tr>";
                });

                //now show categories with no groceries
                querystring = "Select CATEGORYNAME, CategoryID from Categories where UserName='";
                querystring += session.username;
                querystring += "'";
                con.query(querystring, function (err2, result2, fields2) {
                    if (err2) {
                        utils.logError(modulename, "selectcategories", err);
                        throw err2;
                    }

                    Object.keys(result2).forEach(function (key) {
                        var catrow = result2[key];
                        var found = false;
                        categories.forEach(function (value, index, array) {
                            if (value == catrow.CATEGORYNAME) {
                                found = true;
                            }

                        });

                        //add categories that have no groceries associated with them
                        if (found == false) {
                            buffer += "<tr><td>";
                            buffer += "<strong>";
                            buffer += catrow.CATEGORYNAME;
                            buffer += "</strong>";
                            buffer += "</td>";
                            buffer += "<td>";
                            buffer += "<button type='button' onclick='deleteCategory(";
                            buffer += catrow.CategoryID;
                            buffer += ");'>Remove</button>";
                            buffer += "&nbsp;<button type='button' onclick='newGrocery(";
                            buffer += catrow.CategoryID;
                            buffer += ");'>New Grocery</button>";
                            buffer += "</td></tr>";
                        }


                    });
                    con.commit(function (err) {
                        if (err) {
                            con.rollback(function () {
                                utils.logError(modulename, "commit", err);
                                throw err;
                            });
                        }

                        //button for new query
                        buffer += "<tr><td>";
                        buffer += "<button type='button' onclick='newCategory();'>";
                        buffer += "New Category</button></td>";
                        buffer += "<td>&nbsp;</td></tr>";
                        //button for clear all
                        buffer += "<tr><td>";
                        buffer += "<button type='button' onclick='restart();'>";
                        buffer += "Restart List</button></td>";
                        buffer += "<td>&nbsp;</td></tr></table>";
                        res.send(buffer);
                        con.end();
                    });
                });
            });

        });

    });
});


module.exports = router;