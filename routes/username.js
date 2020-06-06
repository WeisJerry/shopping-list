/* Get the session username to display */
var express = require('express');
var router = express.Router();
var session = require('express-session');

router.get('/', function (req, res) {

    var user = "";
    if (session.loggedin == true) {
        user = session.username;
        user = user.charAt(0).toUpperCase() + user.slice(1);
    }
    res.send(user);
});

module.exports = router;