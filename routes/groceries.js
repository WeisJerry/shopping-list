/**
 * Grocery List Functions
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');

var utils = require('./utils');
var modulename = "groceries.js";

router.get('/', function (req, res) {
    var pagecontent = "Error getting database content";
    console.log('In custom get function.');
    var con = mysql.createConnection({ host: "localhost", user: "root", password: "ZinDaffies4u" });
    con.connect(function (err) {
        if (err) {
            utils.logError(modulename,"createconnection",err);
            throw err;
        }
        console.log("Connected To Database manager.");
        con.query("USE groceries", function (err, result) {
            if (err) {
                utils.logError(modulename,"usegroceries",err);
                throw err;
            }
        });
        
        var buffer = "";
        var querystring = "Select Groceries.GROCERYNAME, Selections.UserName, Selections.QUANTITY, ";
        querystring += "Categories.CategoryID, Categories.CATEGORYNAME "; 
        querystring += "from Groceries "; 
        querystring += "Inner Join Selections ";
        querystring += "on Groceries.GroceryID = Selections.GroceryID ";
        querystring += "Inner Join Categories ";
        querystring += "on Groceries.CategoryID = Categories.CategoryID ";
        querystring += "where QUANTITY > 0 "
        querystring += " And Groceries.UserName='";
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
                utils.logError(modulename,"selectgroceries",err);
                throw err;
            }
            var categorystring = "";
            buffer += "<table>";

            //loop through the categories, and get the groceries for each category
            Object.keys(result).forEach(function (key) 
            {
                var row = result[key];

                if (categorystring == "" || categorystring != row.CATEGORYNAME)
                {
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
                buffer += "</td><td><input type='checkbox'></td>";
                buffer += "</tr>";
            });
            buffer += "</table>";
            res.send(buffer);
        });

    con.end();

    });
});

module.exports = router;