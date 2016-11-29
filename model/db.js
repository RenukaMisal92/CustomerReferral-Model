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


var countersSchema = new Schema({
    customerId: {type: String, default: "customerId"},
    customer_sequence_id: {type: Number, default: 0}
});

var counter = mongoose.model('counter', countersSchema, 'counter');

var generateCounter = function() {
    var countersDocument = new Counter();
    countersDocument.save(function (error, result) {
        if (error) {
            logger.error('[countersDocument] ' + error);
        } else {
            logger.info('[countersDocument] Counter collection created.');
        }
    });
};


// initialization of Counter
counter.generateCounter();

var customerSchema = new Schema({
    customer_id : { type: String, index: { unique: true}},
    email:  { type: String, required: true },
    referral_id :{type: String},
    payback : {type: Number},
    isAmbassador :{type: Boolean},
    joiningDate : {type : Date, default: Date.now, required: true},
    lastUpdated : {type: Date, default: Date.now, required: true}
});

module.exports.customer = mongoose.model('customer', customerSchema, 'customer');
module.exports.counter = counter;
module.exports.db = mongoose.connection;
module.exports.connectToMongo = connectToMongo;