/**
 * Grocery List  Edit Functions
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');

var utils = require('./utils');
var modulename = "edit.js";

router.get('/', function (req, res) {
    var pagecontent = "Error getting database content";
    console.log('In custom get function.');
    var con = mysql.createConnection({ host: "localhost", user: "root", password: "ZinDaffies4u" });
    con.connect(function (err) {
        if (err) {
            utils.logError(modulename, "createconnection", err);
            throw err;
        }

        console.log("Connected To Database manager.");
        con.query("USE groceries", function (err, result) {
            if (err) {
                utils.logError(modulename, "usegroceries", err);
                throw err;
            }
        });

        var buffer = "";
        var querystring = "Select Groceries.GROCERYNAME, Groceries.GROCERYID, Selections.QUANTITY, ";
        querystring += "Categories.CategoryID, Categories.CATEGORYNAME ";
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
                    buffer += "</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
                    categorystring = row.CATEGORYNAME;
                }
                buffer += "<tr><td>";
                buffer += row.GROCERYNAME;
                buffer += "</td><td>";
                buffer += row.QUANTITY;
                buffer += "</td>";
                buffer += "<td><button type='button' onclick='add(";
                buffer += row.GROCERYID;
                buffer += ");'>+</button>";
                buffer += "&nbsp;<button type='button' onclick='remove(";
                buffer += row.GROCERYID;
                buffer += ");'>-</button>";
                buffer += "</td></tr>";
            });
            buffer += "</table>";
            res.send(buffer);
        });

        con.end();

    });
});


module.exports = router;