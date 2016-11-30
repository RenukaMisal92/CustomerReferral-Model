/**
 * Created by renukaM on 28/11/16.
 */

// External dependencies
var async = require('async');
var _ = require('lodash');

// Internal dependencies
var model = require('../model/db');
var customerService = require('../services/customerService');
var Constants = require('../utils/constant');
var utils = require('../utils/utils');

var CONTROLLER_NAME = '[customerController] - ';

/**
 * @method processToAddCustomer
 * @description Function to process the req to add a new customer in record.
 * @param req
 * @param res
 * @param callback
 */
var processToAddCustomer = function(req, res, callback){
    var body = req.body;
    var email = body.email;
    var METHOD_NAME ='[processToAddCustomer] - ';
    async.waterfall([
        /**
         * Step 1 : FindInDb if customer already exists with email id
         */
        function findInDB(cb) {
            customerService.findCustomerByEmail(email, function (error, result) {
                if (error) {
                    logger.error(CONTROLLER_NAME + METHOD_NAME + "Error - " + JSON.stringify(error));
                    buildResponse = utils.getResponse(500, Constants.INTERNAL_SERVER_ERROR);
                    return res.status(500).send(buildResponse);
                }
                if (result) {
                    logger.warn(CONTROLLER_NAME + METHOD_NAME+  "Customer already exists - " + JSON.stringify(result));
                    buildResponse = utils.getResponse(200, Constants.CUSTOMER_ALREADY_EXISTS);
                    return res.status(200).send(buildResponse);
                }
                cb(null, body);
            });
        },
        /**
         * step 2 : generate a customer id with counters collection
         * */
        function(body, cb){
            customerService.generateCustomerId(body, function(error, result){
                if(error){
                    return cb (error, null);
                }
                body.customer_id = result.customer_id;
                return callback(null, body);
            });
        }]
    );
};

/**
 * @method addCustomer
 * @description Adding a new customer to records
 * @param req
 * @param res
 * @param next
 */
var addCustomer = function(req, res, next) {

    logger.debug("Request Object ", (req.body));
    var buildResponse;
    processToAddCustomer(req, res, function(err, result){
        logger.debug("Body" + JSON.stringify(result));
        var customerObject = customerService.buildObject(result);
        customerService.saveCustomer(customerObject, function (error, result) {
            if (error) {
                logger.error(CONTROLLER_NAME + "Error - " + JSON.stringify(error));
                buildResponse = utils.getResponse(500, Constants.INTERNAL_SERVER_ERROR);
                return res.status(500).send(buildResponse);
            }
            if (!result) {
                logger.warn(CONTROLLER_NAME + "No result found - " + JSON.stringify(result));
                buildResponse = utils.getResponse(500, Constants.INTERNAL_SERVER_ERROR);
                return res.status(500).send(buildResponse);
            }
            buildResponse = utils.getResponse(201, Constants.CUSTOMER_ADDED_SUCCESSFULLY + " and customer_id is " + result.customer_id);
            return res.status(201).send(buildResponse);
        });
    });
};

/**
 * @method getCustomerDetails
 * @description Finding the customer details by passing customer_id
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
            buildResponse = utils.getResponse(404, Constants.CUSTOMER_NOT_FOUND);
            return res.send('404', buildResponse);
        }
        logger.debug("Result found " + JSON.stringify(result));
        return res.status(200).send(result);
    });
};

/**
 * @method getCountOfReferrals
 * @description Getting the count of referrals under a customer
 * @param req
 * @param res
 * @param next
 */
var getCountOfReferrals = function(req, res, next){

    if(!req.params.id){
        buildResponse = utils.getResponse('400', Constants.MISSING_CUSTOMER_ID);
        return res.status(400).send(buildResponse);
    }
    var buildResponse;
    var customerId = req.params.id;

    customerService.getCountOfReferralWithCustomerId(customerId, function(error, result){
        if (error) {
            buildResponse = utils.getResponse('503', Constants.INTERNAL_SERVER_ERROR);
            return res.status(503).send(buildResponse);
        }
        if (_.isEmpty(result)) {
            buildResponse = utils.getResponse('404', Constants.REFERRAL_NOT_FOUND);
            return res.status(404).send(buildResponse);
        }
        buildResponse = utils.getResponse('200', "Customer_id " + customerId + " has " + result + " referrals count.");
        return res.status(200).send(buildResponse);
    });


};

/**
 * @method getAllReferrals
 * @description Getting all the referrals under a customer_id
 * @param req
 * @param res
 * @param next
 */
var getAllReferrals = function (req, res, next){

    if(!req.params.id){
        buildResponse = utils.getResponse('400', Constants.MISSING_CUSTOMER_ID);
        return res.status(400).send(buildResponse);
    }
    var buildResponse;
    var customerId = req.params.id;

    customerService.findReferralWithCustomerId(customerId, function(error, result){
        if (error) {
            buildResponse = utils.getResponse('503', Constants.INTERNAL_SERVER_ERROR);
            return res.status(503).send(buildResponse);
        }
        if (_.isEmpty(result)) {
            buildResponse = utils.getResponse('404', Constants.REFERRAL_NOT_FOUND);
            return res.status(404).send(buildResponse);
        }
        buildResponse = utils.getResponse('200', result);
        return res.status(200).send(buildResponse);
    });
};

/**
 * @methodaddReferral
 * @description Adding a referral to the records with existing customer's id as referral_id for new customer
 * @param req
 * @param res
 * @param next
 */
var addReferral = function(req, res, next){
    var buildResponse;
    var body = req.body;
    var email = body.email;
    var referral_id = body.referral_id;
    var isAmbassador = body.isAmbassador;
    var METHOD_NAME = '[addReferral] - ';

    logger.debug(CONTROLLER_NAME + METHOD_NAME + "referral_id" + referral_id);

    async.waterfall([
        /**
         * Step 1 : Check if the email id specified by referrals already existed in records.
         */
        function(cb){
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
                var isValidEmail = true;
                cb(null,isValidEmail);
            });
        },
        /**
         * step 2 :
         */
        function(isValidEmail, cb){
            customerService.findCustomerById(referral_id, function(error, result) {
                if(error){
                    logger.error(CONTROLLER_NAME + "Error - " + JSON.stringify(error));
                    buildResponse = utils.getResponse(500, Constants.INTERNAL_SERVER_ERROR);
                    return res.status(500).send(buildResponse);;
                }
                if (_.isEmpty(result)) {
                    buildResponse = utils.getResponse('404', Constants.REFERRAL_NOT_FOUND);
                    return res.status(404).send(buildResponse);
                }
                logger.debug("Result found " + JSON.stringify(result));
                var customerDetails = {};
                customerDetails.isReferralAmbassador = result.isAmbassador;
                customerDetails.isFirstLevelChild = result.isFirstLevelChild;
                customerDetails.payback = result.payback;
                customerDetails.ambassador_id = result.ambassador_id;
                customerDetails.parentAmbassadors = result.parentAmbassadors;
                cb(null, customerDetails);
            });
        },
        /**
         * Step 2 : Generate a customer id for new referral
         */
        function (customerDetails, cb){
            //body.payback = currentPayback;
            customerService.generateCustomerId(body, function(error, result){
                if(error){
                    buildResponse = utils.getResponse('500', Constants.INTERNAL_SERVER_ERROR);
                    return res.status('500').send(buildResponse);
                }
                customerDetails.customerId  = result.customer_id;
                return cb(null, customerDetails);
            });
        },
        /**
         * Step 3 : Save a new customer in records
         */
        function(customerDetails, cb){

            body.customer_id = customerDetails.customerId;

            logger.debug(CONTROLLER_NAME + METHOD_NAME + "customerDetails.parentAmbassadors - " + JSON.stringify(customerDetails.parentAmbassadors, null, 2));

            var customerObject = customerService.buildObject(body);

            if(customerDetails.isReferralAmbassador && !customerDetails.isFirstLevelChild){
                customerObject.ambassador_id = body.referral_id;
                customerObject.parentAmbassadors = customerDetails.parentAmbassadors;
                customerObject.parentAmbassadors.push(body.referral_id);
                customerObject.childLevelOfAmbassadors = customerObject.parentAmbassadors.length;
            }
            else if(customerDetails.isReferralAmbassador){
                customerObject.parentAmbassadors = customerDetails.parentAmbassadors;
                customerObject.parentAmbassadors.push(body.referral_id);
                customerObject.childLevelOfAmbassadors = customerObject.parentAmbassadors.length;
            }

            customerService.saveCustomer(customerObject, function(error, newReferralObject){
                logger.debug(CONTROLLER_NAME + METHOD_NAME + "Object saved successfully" + JSON.stringify(newReferralObject));
                if(error){
                    buildResponse = utils.getResponse('500', Constants.INTERNAL_SERVER_ERROR);
                    return res.status('500').send(buildResponse);
                }
                var response = {
                    newReferralObject : newReferralObject,
                    customerDetails : customerDetails
                };
                return cb(null, response);
            });
        },
        /**
         * Step 4 : Calculate the payback point and update the customer's record who referred the newly added customer.
         */
        function(response, cb){
            if(response) {
                var currentPaybackPoint = response.customerDetails.payback;
                var customerDetails = response.customerDetails;
                var paybackPointsForReferral = customerService.calculatePaybackPoints(currentPaybackPoint, false);
                customerService.updatePaybackPointsOfReferral(referral_id, paybackPointsForReferral, function (error, result) {
                    if (error) {
                        buildResponse = utils.getResponse('500', Constants.INTERNAL_SERVER_ERROR);
                        return res.status('500').send(buildResponse);
                    }

                    if(customerDetails.childLevelOfAmbassadors === 1){
                        logger.debug(CONTROLLER_NAME + METHOD_NAME + "Updating Ambassador payback points" + JSON.stringify(customerDetails, null,2));
                        customerService.updatePaybackPointsOfAmbassador(customerDetails.ambassador_id, function(error, response){
                        });
                    }
                    buildResponse = utils.getResponse('201', Constants.REFERRAL_ADDED_SUCCESSFULLY);
                    return res.status('201').send(buildResponse);
                });
            }
        }
    ]);
};

/**
 * @method updateCustomerForAmbassador
 * @description Converting a existing customer as Ambassador
 * @param req
 * @param res
 * @param next
 */
var updateCustomerForAmbassador = function(req, res, next){

    var METHOD_NAME = '[updateCustomerForAmbassador] - ';
    var customer_id = req.params.id;
    var buildResponse;
    logger.debug(CONTROLLER_NAME + METHOD_NAME + "currentAmbassadorStatus" + req.body.currentAmbassadorStatus);
    logger.debug(CONTROLLER_NAME + METHOD_NAME + "customer_id" + customer_id);

    if(req.body.currentAmbassadorStatus){
        buildResponse = utils.getResponse('400', Constants.ALREADY_AMBASSADOR);
        return res.status('400').send(buildResponse);
    }
    customerService.updateAmbassadorDetails(customer_id, function(error, result) {
        if(error){
            logger.error(CONTROLLER_NAME + METHOD_NAME + "Error : " + JSON.stringify(error));
            buildResponse = utils.getResponse('500', Constants.INTERNAL_SERVER_ERROR);
            return res.status('500').send(buildResponse);
        }
        logger.debug(CONTROLLER_NAME + METHOD_NAME + "Updated results" + JSON.stringify(result));
        buildResponse = utils.getResponse('201', Constants.CUSTOMER_UPDATED_SUCCESSFULLY);
        return res.status('201').send(buildResponse);
    });
};





module.exports.addCustomer = addCustomer;
module.exports.getCustomerDetails = getCustomerDetails;
module.exports.getCountOfReferrals = getCountOfReferrals;
module.exports.getAllReferrals = getAllReferrals;
module.exports.addReferral = addReferral;
module.exports.updateCustomerForAmbassador = updateCustomerForAmbassador;
module.exports.processToAddCustomer = processToAddCustomer;