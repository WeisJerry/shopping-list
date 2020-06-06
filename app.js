var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var helmet = require('helmet');

var ind = require('./routes/index');
var indexRouter = require('./routes');
var usersRouter = require('./routes/users');
var groceries = require('./routes/groceries');
var edit = require('./routes/edit');
var add = require('./routes/add');
var remove = require('./routes/remove');
var manage = require('./routes/manage');
var deletegrocery = require('./routes/deletegrocery');
var deletecategory = require('./routes/deletecategory');
var newgrocery = require('./routes/newgrocery');
var newcategory = require('./routes/newcategory');
var restart = require('./routes/restart');
var auth = require('./routes/auth');
var username = require('./routes/username');
var newuser = require('./routes/newuser');
var logout = require('./routes/logout');

var app = express();

global.__basedir = __dirname;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/groceries', groceries);
app.use('/edit', edit);
app.use('/add', add);
app.use('/remove', remove);
app.use('/manage', manage);
app.use('/deletegrocery', deletegrocery);
app.use('/deletecategory', deletecategory);
app.use('/newgrocery', newgrocery);
app.use('/newcategory', newcategory);
app.use('/restart', restart);
app.use('/auth', auth);
app.use('/index', ind);
app.use('/username', username);
app.use('/newuser', newuser);
app.use('/logout', logout);

//authentication
console.log("Setting up authentication...");
app.use(session({
  secret: 'oicu812',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log("Error 404");
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log("In my custom err function");
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/home', function(request, response) {
if (session.loggedin)
  {
    response.redirect(__basedir + '/public/home.html');
  }
  else
  {
    response.redirect(__basedir + '/public/login.html');
  }
});

module.exports = app;
