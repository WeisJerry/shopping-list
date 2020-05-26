/**
 * Grocery List  Edit Screen
 * (Add/remove groceries from list)
 */

var express = require('express');
var router = express.Router();
var session = require('express-session');

var utils = require('./utils');
var modulename = "edit.js";

router.get('/', function (req, res) {
    var client = utils.getDBClient();

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
                buffer += "</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
                categorystring = row.categoryname;
            }
            buffer += "<tr><td>";
            buffer += row.groceryname;
            buffer += "</td><td>";
            buffer += row.quantity;
            buffer += "</td>";
            buffer += "<td><button class='small-button' type='button' onclick='add(";
            buffer += row.groceryid;
            buffer += ");'>+</button>";
            buffer += "&nbsp;<button class='small-button' type='button' onclick='remove(";
            buffer += row.groceryid;
            buffer += ");'>-</button>";
            buffer += "</td></tr>";
        });
        buffer += "</table>";
        res.send(buffer);
    });

});


module.exports = router;