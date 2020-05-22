/**
 * Increment a specified grocery.
 */

var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');

var utils = require('./utils');
var modulename = "add.js";

router.post('/', function (req, res) {

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

        var querystring = "Update Selections ";
        querystring += "Set QUANTITY = QUANTITY +1 "; 
        querystring += "Where GroceryID=";
        querystring += req.body.groceryid;
        querystring += " And UserName='";
        querystring += session.username;
        querystring += "'";


        con.query(querystring, function (err, result, fields) {
            if (err) {
                utils.logError(modulename,"updatequantity",err); 
                throw err; 
            }
            res.send("Ok");
        });

    con.end();

    });
});

module.exports = router;