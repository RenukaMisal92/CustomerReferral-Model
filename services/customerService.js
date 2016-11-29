/**
 * Created by renukaM on 28/11/16.
 */

var model = require('../model/db');
var Customer = require('../model/db').customer;
var Constants = require('../utils/constant');
var SERVICE_NAME = '[customerService] - ';
var count = 1;



function generateCustomerId(req, callback) {
    var METHOD_NAME = "[generateOrderId]-";
    model.counter.findOneAndUpdate({customerId: 'customerId'}, {$inc: {customer_sequence_id: 1}}, {new: true}, function(error, result) {
        if (!_.isEmpty(error)) {
            logger.error(METHOD_NAME + "Error:" + JSON.stringify(error));
            return callback(error, null);
        }
        req.customer_id = result.customer_sequence_id;
        return callback(null, req);
    });
}
/**
 * @method buildObject
 * @param req
 * @param callback
 * @return {{}}
 */
var buildObject = function(req, callback){

    var METHOD_NAME = '[buildObject]';
    logger.debug(SERVICE_NAME +METHOD_NAME + "Request Object " + JSON.stringify(req, null, 2));

    generateCustomerId();
    var customerObject = {};
    customerObject.customer_id = "";
    customerObject.email = req.email;
    customerObject.referral_id  = req.id;
    customerObject.payback  = 0;
    customerObject.isAmbassador = req.isAmbassador;
    customerObject.joiningDate = Date.now();
    customerObject.lastUpdated = Date.now();
    return customerObject;
};

/**
 * @method saveCustomer
 * @param customerObject
 * @param callback
 */
var saveCustomer = function(customerObject, callback ){
    var METHOD_NAME ='[saveCustomer] - ';
    logger.debug(SERVICE_NAME + METHOD_NAME + "Object To be Saved - " + JSON.stringify(customerObject));
    var customerObj = new Customer(customerObject);
    customerObj.save(function(error, result){
        callback(error, result);
    });
};

/**
 * @method findCustomerById
 * @param customerId
 * @param callback
 */
var findCustomerById = function(customerId, callback){
    logger.debug("[findCustomerById] - customerId " + customerId);
    model.customer.findOne({customer_id : customerId}, function(error, result) {
        logger.debug("Error - " + JSON.stringify(error));
        logger.debug("Result - " + JSON.stringify(result));
        if(error){
            return callback(error, null);
        }
        return callback(null, result);
    });
};

/**
 * @method findCustomerByEmail
 * @param customer_email
 * @param callback
 */
var findCustomerByEmail = function(customer_email, callback){
    model.customer.findOne({email : customer_email}, function(error, result) {
        return callback(error, result);
    });
};

/**
 * @method updateCustomersDetails
 * @param customer_id
 * @param paybackPoint
 * @param callback
 */
var updateCustomersDetails = function(customer_id, paybackPoint, callback){
    var METHOD_NAME ='[updateCustomersDetails] - ';
    logger.debug(SERVICE_NAME + METHOD_NAME + "customerId " + customer_id);
    model.customer.update({customer_id : customer_id}, {$set: {payback : paybackPoint}}, function(error, result) {
        return callback(error, result);
    });
};

/**
 * @method calculatePaybackPoints
 * @param currentPaybackPoints
 * @param isAmbassador
 * @return {*}
 */
var calculatePaybackPoints = function(currentPaybackPoints, isAmbassador){

    var percentageApplied = Constants.PERCENTAGE_BONUS;
    if(isAmbassador){
        percentageApplied = Constants.IS_ISAMBASSADOR_BONUS
    }
    var percentage = Constants.JOINING_FEES * percentageApplied/ 100;
    return currentPaybackPoints + percentage;
};

module.exports.saveCustomer = saveCustomer;
module.exports.buildObject = buildObject;
module.exports.findCustomerById = findCustomerById;
module.exports.findCustomerByEmail = findCustomerByEmail;
module.exports.updateCustomersDetails = updateCustomersDetails;
module.exports.calculatePaybackPoints = calculatePaybackPoints;