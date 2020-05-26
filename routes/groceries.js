/**
 * Display groceries
 */
var express = require('express');
var router = express.Router();
var session = require('express-session');

var utils = require('./utils');
var modulename = "groceries.js";

router.get('/', function (req, res) {
    var client = utils.getDBClient();

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

    client.query(querystring, function (err, result) {
        if (err) {
            utils.logError(modulename, "selectgroceries", err);
            throw err;
        }
        var categorystring = "";
        var buffer = "There are no items in your shopping list.";


        if (result.rows.length > 0) {
            buffer = "<table>";
            //loop through the categories, and get the groceries for each category
            Object.keys(result.rows).forEach(function (key) {
                var row = result.rows[key];

                if (categorystring == "" || categorystring != row.categoryname) {
                    buffer += "<tr><td>";
                    buffer += "<strong>";
                    buffer += row.categoryname;
                    buffer += "</strong>";
                    buffer += "</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
                    categorystring = row.categoryname;
                }
                buffer += "<tr><td>";
                buffer += row.groceryname;
                buffer += "</td><td>";
                buffer += row.quantity;
                //empty checkbox as a convenience for checking off items
                //TODO: Have program 'remember' what is checked,
                // and button to clear outchecks.
                buffer += "</td><td><input type='checkbox'></td>";
                buffer += "</tr>";
            });
            buffer += "</table>";
        }
        res.send(buffer);
    });

});

module.exports = router;