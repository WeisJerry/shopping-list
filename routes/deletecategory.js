/**
 * Remove a category of grocery for a user.
 * (Also deletes all groceries under that category)
 */

var express = require('express');
var router = express.Router();
var session = require('express-session');

var utils = require('./utils');
var modulename = "deletecategory.js";

router.post('/', function (req, res) {
    var client = utils.getDBClient();

    /* Begin transaction */
    client.query("begin", function (err) {
        if (err) {
            utils.logError(modulename, "begintransaction", err);
            throw err;
        }

        var querystring = "Delete from Selections ";
        querystring += " Where categoryID=";
        querystring += req.body.categoryid;
        querystring += " And UserName='";
        querystring += session.username;
        querystring += "'";

        client.query(querystring, function (err, result) {
            if (err) {
                client.query("rollback", function () {
                    utils.logError(modulename, "deletefromselections", err);
                    throw err;
                });
            }

            querystring = "Delete from Groceries ";
            querystring += "Where categoryID=";
            querystring += req.body.categoryid;
            querystring += " And UserName='";
            querystring += session.username;
            querystring += "'";

            client.query(querystring, function (err, result) {
                if (err) {
                    client.query("rollback", function () {
                        utils.logError(modulename, "deletefromgroceries", err);
                        throw err;
                    });
                }

                querystring = "Delete from Categories ";
                querystring += "Where categoryID=";
                querystring += req.body.categoryid;
                querystring += " And UserName='";
                querystring += session.username;
                querystring += "'";

                client.query(querystring, function (err, result) {
                    if (err) {
                        client.query("rollback", function () {
                            utils.logError(modulename, "deletefromcategories", err);
                            throw err;
                        });
                    }
                    client.query("commit", function (err) {
                        if (err) {
                            client.query("rollback", function () {
                                utils.logError(modulename, "commit", err);
                                throw err;
                            });
                        }
                        res.send("Ok");
                    });
                });
            });
        });
    });
    /* End transaction */

});

module.exports = router;