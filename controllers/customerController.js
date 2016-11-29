/**
 * Created by renukaM on 28/11/16.
 */

// External dependencies
var async = require('async');

// Internal dependencies
var model = require('../model/db');
var customerService = require('../services/customerService');
var Constants = require('../utils/constant');
var utils = require('../utils/utils');

var CONTROLLER_NAME = '[customerController] - ';

/**
 * @method addCustomer
 * @param req
 * @param res
 * @param next
 */
var addCustomer = function(req, res, next) {

    logger.debug("Request Object ", (req.body));
    var body = req.body;
    var email = body.email;
    var buildResponse;
    async.waterfall([
        /**
         * Step 1 : FindInDb if customer already exists with email id
         */
        function findInDB(cb) {
            customerService.findCustomerByEmail(email, function (error, result) {
                if (error) {
                    logger.error(CONTROLLER_NAME + "Error - " + JSON.stringify(error));
                    buildResponse = utils.getResponse(500, Constants.INTERNAL_SERVER_ERROR);
                    return res.status(500).send(buildResponse);
                }
                if (result) {
                    logger.warn(CONTROLLER_NAME + "Customer already exists - " + JSON.stringify(result));
                    buildResponse = utils.getResponse(200, Constants.CUSTOMER_ALREADY_EXISTS);
                    return res.status(200).send(buildResponse);
                }
                cb(null, body);
            });
        },
        /**
         * Step 2 : save new customer details in db
         */
        function saveInDB(body, cb){
            logger.debug("Body" + JSON.stringify(body));

            var customerObject = customerService.buildObject(body);
            customerService.saveCustomer(customerObject, function (error, result) {
                if (error) {
                    logger.error(CONTROLLER_NAME + "Error - " + JSON.stringify(error));
                    buildResponse = utils.getResponse(500, Constants.INTERNAL_SERVER_ERROR);
                    return res.send('500', Constants.INTERNAL_SERVER_ERROR);
                }
                if (!result) {
                    logger.warn(CONTROLLER_NAME + "No result found - " + JSON.stringify(result));
                    buildResponse = utils.getResponse(500, Constants.INTERNAL_SERVER_ERROR);
                    return res.send('404', Constants.NOT_FOUND);
                }
                return res.send('200', Constants.CREATED_SUCCESSFULLY);
            });
        }]
    );
};

/**
 * @method getCustomerDetails
 * @param req
 * @param res
 * @param next
 */
var getCustomerDetails = function(req, res, next){

    logger.debug("Customer_id", req.params.id);
    if(!req.params.id){
        return res.send('400',Constants.MISSING_CUSTOMER_ID);
    }
    var buildResponse;
    var customerId = req.params.id;
    customerService.findCustomerById(customerId, function(error, result) {
        if(error){
            logger.error(CONTROLLER_NAME + "Error - " + JSON.stringify(error));
            buildResponse = utils.getResponse(500, Constants.INTERNAL_SERVER_ERROR);
            return res.send('500',Constants.INTERNAL_SERVER_ERROR);
        }
        if(!result){
            logger.warn(CONTROLLER_NAME + "No result found - " + JSON.stringify(result));
            buildResponse = utils.getResponse(500, Constants.INTERNAL_SERVER_ERROR);
            return res.send('404',Constants.NOT_FOUND);
        }
        logger.debug("Result found " + JSON.stringify(result));
        return res.status(200).send(result);
    });
};

var getCountOfReferrals = function(req, res, next){

};

var getAllReferrals = function (req, res, next){

};

var addReferral = function(req, res, next){
    var buildResponse;
    var body = req.body;
    var email = body.email;
    var referral_id = body.referral_id;
    var isAmbassador = body.isAmbassador;
    var METHOD_NAME = '[addReferral] - ';

    logger.debug(CONTROLLER_NAME + METHOD_NAME + "referral_id" + referral_id);
    customerService.findCustomerById(referral_id, function(error, result){
        if(error){
            buildResponse = utils.getResponse('503', Constants.INTERNAL_SERVER_ERROR);
            return res.status(503).send(buildResponse);
        }
        if(!result){
            buildResponse = utils.getResponse('404', "Referral Id not matched");
            return res.status(404).send(buildResponse);
        }
        var customerObject = customerService.buildObject(body);
        customerService.saveCustomer(customerObject, function(error, result){
            logger.debug(CONTROLLER_NAME + METHOD_NAME + "Object saved successfully" + JSON.stringify(result));
        });

        var currentPaybackPoint = result.payback;
        var paybackPoints = customerService.calculatePaybackPoints(currentPaybackPoint, isAmbassador);
        logger.debug(CONTROLLER_NAME + METHOD_NAME + "paybackPoints - " + paybackPoints);
        logger.debug(CONTROLLER_NAME + METHOD_NAME + "customer_id - " + referral_id);

        customerService.updateCustomersDetails(referral_id, paybackPoints, function(error, result) {

        });
    });

};

module.exports.addCustomer = addCustomer;
module.exports.getCustomerDetails = getCustomerDetails;
module.exports.getCountOfReferrals = getCountOfReferrals;
module.exports.getAllReferrals = getAllReferrals;
module.exports.addReferral = addReferral;

