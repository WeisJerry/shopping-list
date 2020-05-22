/**
 * Add a new category.
 */

var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');

var utils = require('./utils');
var modulename = "newcategory.js";

router.post('/', function (req, res) {
    var con = mysql.createConnection({ host: "localhost", user: "root", password: "ZinDaffies4u" });
    con.connect(function (err) {
        if (err) {
            utils.logError(modulename,"createconnection",err);
            throw err;
        }
        con.query("USE groceries", function (err, result) {
            if (err) {
                utils.logError(modulename,"UseGroceries",err);
                throw err;
            }
        });

        //check that category does not already exist
        var querystring = "SELECT CATEGORYNAME FROM Categories ";
        querystring += "Where UserName='";
        querystring += session.username;
        querystring += "';";
        
        con.query(querystring, function (err, result, fields) {
            if (err) {
                utils.logError(modulename,"doescategorynameexist",err);
                throw err;
            }

            //see if there is a matching category
            var categoryExists = false;
            var newCategoryName = req.body.categoryname.toLowerCase();
            Object.keys(result).forEach(function (key) {
                var row = result[key];
                var catname = row.CATEGORYNAME.toLowerCase();
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

                con.query(querystring, function (err, result, fields) {
                    if (err) {
                        utils.logError(modulename,"insertnewcategory",err);
                        throw err;
                    }
                    res.send("Ok");
                });
            }
            con.end();
        });
    });
});

module.exports = router;