// External dependancies
var mongoose = require("mongoose");

//db connection
mongoose.connect('mongodb://localhost/CustomerService-RKSV');

var connectToMongo = function() {
    var db = mongoose.connection;
    db.on('error', function onError(err) {
        logger.error('[model]' + 'Connection to Mongo Unsuccessful: ' + err);
    });

    db.once('open', function callback() {
        logger.info('[model]' + 'Connection to Mongo Successful');
    });
};

var Schema = mongoose.Schema;


var customerSchema = new Schema({
    customer_id : { type: String, index: { unique: true}},
    password :  { type: String, required: true }

});

module.exports.db = mongoose.connection;
module.exports.connectToMongo = connectToMongo;