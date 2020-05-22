//authentication

var express = require('express');
var router = express.Router();
var session = require('express-session');
var path = require('path');
var fs = require('fs');

var mysql = require('mysql');
var utils = require('./utils');
var modulename = "auth.js";

router.post('/', function (request, response) {
  console.log('Authenticating.');

  var username = request.body.username.trim();
  var password = request.body.password.trim();
  var pwdFromDB = "";
  var hint = "";
  var success = false;

  var con = mysql.createConnection({ host: "localhost", user: "root", password: "ZinDaffies4u" });
  con.connect(function (err) {
    if (err) {
      utils.logError(modulename, "createconnection", err);
      throw err;
    }
    con.query("USE AUTH", function (err, result) {
      if (err) {
        utils.logError(modulename, "useauth", err);
        throw err;
      }
    });

    var querystring = "Select PASSWORD,HINT from users where USERNAME='";
    querystring += username;
    querystring += "';";

    con.query(querystring, function (err, result, fields) {
      if (err) {
        utils.logError(modulename, "selectpassword", err);
        throw err;
      }

      if (result.length == 1) {
        pwdFromDB = result[0].PASSWORD;
        pwdFromDB = utils.decrypt(pwdFromDB);
        hint = result[0].HINT;
        success = true;
      }
      if (success == true && password == pwdFromDB) {
        console.log("User " + username + " logged in successfully");
        session.loggedin = true;
        session.username = username;
        response.sendFile(path.join(__dirname, '/home.html'));
      } else if (success == true) {
        //need to show hint
        session.loggedin = false;
        fs.readFile('./routes/login_hint.html', function (err, html) {
          if (err) {
            utils.logError(modulename, "createloginwithhint", err);
            throw err;
          }

          html += hint;
          html += "</div></body></html>";
          response.send(html);
        });
      }
      else {
        session.loggedin = false;
        response.sendFile(path.join(__dirname, '/login.html'));
      }
    });

    con.end();

  });


});

module.exports = router;