/**
 * Created by renukaM on 28/11/16.
 */
var model = require('../model/db');
var Constants = require('../utils/constant');
var customerService = require('../services/customerService');
var utils = require('../utils/utils');

var MIDDLEWARE_NAME  = '[customerValidator] - ';

module.exports = function(req, res, next) {

    logger.debug("Customer_id", req.params.id);
    var customerId;
    if(!req.params.id){
        // in case of adding referral id is passed in body
            return res.send('400', Constants.MISSING_CUSTOMER_ID);
    }
    customerId = req.params.id;
    var buildResponse;
    customerService.findCustomerById(customerId, function(error, result) {
        if (error) {
            logger.error(MIDDLEWARE_NAME + "Error - " + JSON.stringify(error));
            buildResponse = utils.getResponse('503', Constants.INTERNAL_SERVER_ERROR);
            return res.status(503).send(buildResponse);
        }
        if (!result) {
            logger.warn(MIDDLEWARE_NAME + "No result found - " + JSON.stringify(result));
            buildResponse = utils.getResponse('404', Constants.CUSTOMER_NOT_FOUND);
            return res.status(404).send(buildResponse);
        }
        logger.debug(MIDDLEWARE_NAME + "Result found " + JSON.stringify(result));
        req.body.currentAmbassadorStatus = result.isAmbassador;
        next();
    });
};