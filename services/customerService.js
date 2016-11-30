/**
 * Created by renukaM on 28/11/16.
 */

var model = require('../model/db');
var Customer = require('../model/db').customer;
var Constants = require('../utils/constant');
var SERVICE_NAME = '[customerService] - ';

/**
 * @method findReferralWithCustomerId
 * @description Finding all the referrals under the customer id
 * @param customerId
 * @param callback
 */
function findReferralWithCustomerId(customerId, callback){
    var getDetailsFor = {_id :0, customer_id : 1, email : 1, referral_id: 1,isAmbassador:1, joiningDate: 1, lastUpdated:1};
    model.customer.find({referral_id : customerId}, getDetailsFor, function(error, result) {
        if(error){
            return callback(error, null);
        }
        return callback(null, result);
    });
}

/**
 * @method getCountOfReferralWithCustomerId
 * @description Gets the count of the referrals under the customer id
 * @param customerId
 * @param callback
 */
function getCountOfReferralWithCustomerId(customerId, callback){

    model.customer.count({referral_id : customerId}, function(error, result) {
        logger.debug("Error - " + JSON.stringify(error));
        logger.debug("Result - " + JSON.stringify(result));
        if(error){
            return callback(error, null);
        }
        return callback(null, result);
    });
}

/**
 * @method generateCustomerId
 * @description Generate a unique customer_id for keeping a track of the newly added customer
 * @param req
 * @param callback
 */
function generateCustomerId(req, callback) {
    var METHOD_NAME = "[generateCustomerId]-";
    model.counter.findOneAndUpdate({customerId: 'customerId'}, {$inc: {customer_sequence_id: 1}}, {new: true}, function(error, result) {
        if (error) {
            logger.error(METHOD_NAME + "Error " + JSON.stringify(error));
            return callback(error, null);
        }
        req.customer_id = result.customer_sequence_id;
        logger.debug(SERVICE_NAME + METHOD_NAME + "customerid" + req.customer_id);
        return callback(null, req);
    });
}
/**
 * @method buildObject
 * @description Build a customer object from the details cumming from request
 * @param req
 * @param callback
 * @return {{}}
 */
var buildObject = function(req, callback){

    var METHOD_NAME = '[buildObject]';
    logger.debug(SERVICE_NAME +METHOD_NAME + "Request Object " + JSON.stringify(req, null, 2));

    var customerObject = {};
    customerObject.customer_id = req.customer_id;
    customerObject.email = req.email;
    customerObject.referral_id  = req.referral_id;
    customerObject.joiningDate = Date.now();
    customerObject.lastUpdated = Date.now();
    logger.debug(SERVICE_NAME + METHOD_NAME + " Customer Object - "+ JSON.stringify(customerObject));
    return customerObject;
};

/**
 * @method saveCustomer
 * @description Saving a new customer in db
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
 * @description Finding the customers with the unique customerId
 * @param customerId
 * @param callback
 */
var findCustomerById = function(customerId, callback){
    logger.debug("[findCustomerById] - customerId " + customerId);
    model.customer.findOne({customer_id : customerId}, function(error, result) {
        if(error){
            return callback(error, null);
        }
        return callback(null, result);
    });
};

/**
 * @method findCustomerByEmail
 * @description Finding the customers with the email id registered
 * @param customer_email
 * @param callback
 */
var findCustomerByEmail = function(customer_email, callback){
    model.customer.findOne({email : customer_email}, function(error, result) {
        return callback(error, result);
    });
};

/**
 * @method updatePaybackPointsOfReferral
 * @description Updating the payback points of the referrals
 * @param customer_id
 * @param paybackPoint
 * @param callback
 */
var updatePaybackPointsOfReferral = function(customer_id, paybackPoint, callback){
    var METHOD_NAME ='[updatePaybackPointsOfReferral] - ';
    logger.debug(SERVICE_NAME + METHOD_NAME + "customerId - " + customer_id + ", Payback Points -" + paybackPoint);
    var setObj ={
        payback : paybackPoint,
        lastUpdated : Date.now()
    };
    model.customer.update({customer_id : customer_id}, {$set:setObj}, function(error, result) {
        return callback(error, result);
    });
};

/**
 * @method updatePaybackPointsOfAmbassador
 * @description Updating the payback points of the ambassador
 * @param ambassador_id
 * @param callback
 */
var updatePaybackPointsOfAmbassador = function(ambassador_id, callback){

    var METHOD_NAME ='[updatePaybackPointsOfAmbassador] - ';
    logger.debug(SERVICE_NAME+ METHOD_NAME + "ambassador_id - " +  ambassador_id);
    model.customer.findOne({customer_id : ambassador_id}, function(error, result){
        logger.debug(SERVICE_NAME+ METHOD_NAME + "result" +  JSON.stringify(result));

        if(error){
            logger.error(SERVICE_NAME + METHOD_NAME + "Error - " + JSON.stringify(error));
            return callback(error, null);
        }
        if(!result){
            logger.error(SERVICE_NAME + METHOD_NAME + "Error Ambassador not found - " +JSON.stringify(result));
            return callback(result, null);
        }
        var currentPaybackPoints = result.payback;
        logger.debug(SERVICE_NAME + METHOD_NAME + "Ambassador Current payback point" + currentPaybackPoints);
        var paybackPoints = calculatePaybackPoints(currentPaybackPoints, true);
        logger.debug(SERVICE_NAME + METHOD_NAME + "Ambassador payback point" + paybackPoints);
        updatePaybackPointsOfReferral(ambassador_id, paybackPoints, callback);
    });
};

/**]
 * @method updateAmbassadorDetails
 * @description Updating the details of ambassador with payback points
 * @param customer_id
 * @param callback
 */
var updateAmbassadorDetails = function(customer_id, callback){

    var METHOD_NAME = '[updateAmbassador] - ';
    var setObj = {
        isAmbassador : true,
        lastUpdated : Date.now()
    };
    logger.debug(SERVICE_NAME + METHOD_NAME + "Set Object" + JSON.stringify(setObj));
    model.customer.update({customer_id : customer_id}, {$set:setObj}, {new : true},function(error, result) {
        return callback(error, result);
    });
};

/**
 * @method calculatePaybackPoints
 * @description Calculating the payback points on the basis of type of customer
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
module.exports.updatePaybackPointsOfReferral = updatePaybackPointsOfReferral;
module.exports.calculatePaybackPoints = calculatePaybackPoints;
module.exports.generateCustomerId = generateCustomerId;
module.exports.findReferralWithCustomerId = findReferralWithCustomerId;
module.exports.getCountOfReferralWithCustomerId = getCountOfReferralWithCustomerId;
module.exports.updateAmbassadorDetails = updateAmbassadorDetails;
module.exports.updatePaybackPointsOfAmbassador = updatePaybackPointsOfAmbassador;