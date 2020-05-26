/* Get the session username to display */
var express = require('express');
var router = express.Router();
var session = require('express-session');

router.get('/', function (req, res) {

    var un = "Weis";
    if (session.loggedin == true) {
        un = session.username;
    }
    res.send(un);
});

module.exports = router;