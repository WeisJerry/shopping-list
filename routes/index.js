var express = require('express');
var path = require('path');
var router = express.Router();

/* Determine whether to show home page */

router.get('/', function(req, res, next) {

  if (req.session != null && req.session.loggedin)
  {
    res.sendFile(__basedir + '/public/home.html');
  }
  else
  {
    res.sendFile(__basedir + '/public/login.html');
  }
});

module.exports = router;
