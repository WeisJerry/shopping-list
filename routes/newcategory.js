/**
 * Add a new category.
 */

var express = require('express');
var router = express.Router();
var session = require('express-session');

var utils = require('./utils');
var modulename = "newcategory.js";

router.post('/', function (req, res) {
    var client = utils.getDBClient();

    //check that category does not already exist
    var querystring = "SELECT CATEGORYNAME FROM Categories ";
    querystring += "Where UserName='";
    querystring += session.username;
    querystring += "';";

    client.query(querystring, function (err, result) {
        if (err) {
            utils.logError(modulename, "doescategorynameexist", err);
            throw err;
        }

        //see if there is a matching category
        var categoryExists = false;
        var newCategoryName = req.body.categoryname.toLowerCase();
        Object.keys(result.rows).forEach(function (key) {
            var row = result.rows[key];
            var catname = row.categoryname.toLowerCase();
            if (catname == newCategoryName) {
                categoryExists = true;
            }
        });

        if (!categoryExists) {
            querystring = "INSERT INTO Categories (CATEGORYNAME,UserName) values (";
            querystring += "'";
            querystring += req.body.categoryname;
            querystring += "','";
            querystring += session.username;
            querystring += "')";

            client.query(querystring, function (err, result) {
                if (err) {
                    utils.logError(modulename, "insertnewcategory", err);
                    throw err;
                }
                res.send("Ok");
            });
        }
    });
});

module.exports = router;