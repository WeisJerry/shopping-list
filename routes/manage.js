/**
 * Grocery List Manage Screen
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');

var utils = require('./utils');
var modulename = "manage.js";

//TODO: Currently, user is case-sensitive. User 'smith' and 'Smith'
// are regarded as valid users, but get different shopping databases.


router.get('/', function (req, res) {

    var buffer = "";
    if (session.loggedin == false || session.username == "") {
        buffer = "You are not logged in."
        res.send(buffer);
    }
    else {

        var client = utils.getDBClient();
        client.query("begin", function (err) {
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

            client.query(querystring, function (err, result) {
                if (err) {
                    utils.logError(modulename, "selectgroceries", err);
                    throw err;
                }
                var categorystring = "";
                buffer += "<table>";

                //loop through the categories, and get the groceries for each category
                Object.keys(result.rows).forEach(function (key) {
                    var row = result.rows[key];

                    if (categorystring == "" || categorystring != row.categoryname) {
                        buffer += "<tr><td>";
                        buffer += "<strong>";
                        buffer += row.categoryname;
                        buffer += "</strong>";
                        buffer += "</td>";
                        buffer += "<td>";
                        buffer += "<button type='button' class='button' onclick='deleteCategory(";
                        buffer += row.categoryid;
                        buffer += ");'>Remove</button>";
                        buffer += "&nbsp;<button type='button' class='button' onclick='newGrocery(";
                        buffer += row.categoryid;
                        buffer += ");'>New Grocery</button>";
                        buffer += "</td></tr>";
                        categorystring = row.categoryname;
                        categories.push(categorystring);
                    }
                    buffer += "<tr><td>";
                    buffer += row.groceryname;
                    buffer += "</td><td>";
                    buffer += "<button type='button' class='button' onclick='deleteGrocery(";
                    buffer += row.groceryid;
                    buffer += ");'>Remove</button>";
                    buffer += "</td></tr>";
                });

                //now show categories with no groceries
                querystring = "Select CATEGORYNAME, CategoryID from Categories where UserName='";
                querystring += session.username;
                querystring += "'";
                client.query(querystring, function (err2, result2, fields2) {
                    if (err2) {
                        utils.logError(modulename, "selectcategories", err);
                        throw err2;
                    }

                    Object.keys(result2.rows).forEach(function (key) {
                        var catrow = result2.rows[key];
                        var found = false;
                        categories.forEach(function (value, index, array) {
                            if (value == catrow.categoryname) {
                                found = true;
                            }
                        });

                        //add categories that have no groceries associated with them
                        if (found == false) {
                            buffer += "<tr><td>";
                            buffer += "<strong>";
                            buffer += catrow.categoryname;
                            buffer += "</strong>";
                            buffer += "</td>";
                            buffer += "<td>";
                            buffer += "<button class='button' type='button' onclick='deleteCategory(";
                            buffer += catrow.categoryid;
                            buffer += ");'>Remove</button>";
                            buffer += "&nbsp;<button class='button' type='button' onclick='newGrocery(";
                            buffer += catrow.categoryid;
                            buffer += ");'>New Grocery</button>";
                            buffer += "</td></tr>";
                        }
                    });
                    client.query("commit", function (err) {
                        if (err) {
                            client.query("rollback", function () {
                                utils.logError(modulename, "commit", err);
                                throw err;
                            });
                        }

                        buffer += "</table>";

                        //button for new query
                        buffer += "<br>&nbsp;";
                        buffer += "<button class='button' type='button' onclick='newCategory();'>";
                        buffer += "New Category</button>";
                        //button for clear all
                        buffer += "<br><br>&nbsp;";
                        buffer += "<button class='button' type='button' onclick='restart();'>";
                        buffer += "Restart List</button>";
                        res.send(buffer);
                    });
                });
            });

        });
    }
});

module.exports = router;