/**
 * Decrease quantity of a specified grocery.
 */

var express = require('express');
var router = express.Router();
var session = require('express-session');

var utils = require('./utils');
var modulename = "remove.js";

router.post('/', function (req, res) {
    var client = utils.getDBClient();

    var querystring = "Update Selections ";
    querystring += "Set QUANTITY = QUANTITY -1 ";
    querystring += "Where QUANTITY > 0 AND GroceryID=";
    querystring += req.body.groceryid;
    querystring += " And UserName='";
    querystring += session.username;
    querystring += "'";


    client.query(querystring, function (err, result) {
        if (err) {
            utils.logError(modulename, "updateselections", err);
            throw err;
        }
        res.send("Ok");
    });


});

module.exports = router;