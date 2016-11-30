// External dependencies
var express = require('express');
var log4js = require('log4js');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

// global object for loggers
var log4jsConfig = require('./config/logConfig');
log4js.configure(log4jsConfig);
global.logger = log4js.getLogger('console');

try {
  fs.mkdirSync("logs","0777");
} catch (err) {
  logger.info("Creating logs folder " + err);

}
// Internal dependencies
var model = require('./model/db');
var customerRouter = require('./routes/customerRouter').customerRouter;
var ambassadorRouter = require('./routes/ambassadorRouter').ambassadorRouter;



// Connection to mongoDB
model.connectToMongo();

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/customer', customerRouter);
app.use('/ambassador', ambassadorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.send(err);
// });

module.exports = app;
