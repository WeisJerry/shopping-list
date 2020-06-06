/**
 * Basic authentication
 */

var express = require('express');
var router = express.Router();
var session = require('express-session');
var fs = require('fs');

var utils = require('./utils');
var modulename = "auth.js";


router.post('/', function (request, response) {
  console.log('Authenticating.');

  var username = request.body.username.trim();
  var password = request.body.password.trim();
  var pwdFromDB = "";
  var hint = "";
  var success = false;

  var client = utils.getDBClient();

  var querystring = "Select PASSWORD,HINT from users where USERNAME='";
  querystring += username.toLowerCase();
  querystring += "';";

  client.query(querystring, function (err, result) {
    if (err) {
      utils.logError(modulename, "selectpassword", err);
      throw err;
    }
    if (result.rows.length == 1) {
      pwdFromDB = result.rows[0].password;
      pwdFromDB = utils.decrypt(pwdFromDB);
      hint = result.rows[0].hint;
      success = true;
    }

    //If username and password are valid
    if (success == true && password == pwdFromDB) {
      console.log("User " + username + " logged in successfully");
      session.loggedin = true;
      session.username = username;
      response.sendFile(__basedir + '/public/home.html');
    } 
    //If username is valid, but not password, show hint.
    else if (success == true) {
      //need to show hint
      session.loggedin = false;
      fs.readFile('./views/login_hint.html', function (err, html) {
        if (err) {
          utils.logError(modulename, "createloginwithhint", err);
          throw err;
        }
        html += hint;
        html += "</div></body></html>";
        response.send(html);
      });
    }
    //Login credentials were completely wrong
    else {
      session.loggedin = false;
      response.sendFile(__basedir + '/public/login.html');
    }
  });

});

module.exports = router;