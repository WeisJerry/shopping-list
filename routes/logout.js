/* Logout */
var express = require('express');
var router = express.Router();
var session = require('express-session');
var fs = require('fs');
var utils = require('./utils');
var modulename = "logout.js";

router.get('/', function (req, res) {
    var user = session.username;
    session.username = "";
    session.loggedin = false;
    fs.readFile('./public/login.html', function (err, html) {
        if (err) {
          utils.logError(modulename, "createlogin", err);
          throw err;
        }
        console.log("User " + user + " logged out.");
        res.send(html);
      });
});

module.exports = router;