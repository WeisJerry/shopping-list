var express = require('express');
var path = require('path');
var router = express.Router();

/* Determine whether to show home page */

router.get('/', function(req, res, next) {

  if (req.session != null && req.session.loggedin)
  {
    res.sendFile(path.join(__dirname, '/home.html'));
  }
  else
  {
    res.sendFile(path.join(__dirname, '/login.html'));
  }
});

module.exports = router;
