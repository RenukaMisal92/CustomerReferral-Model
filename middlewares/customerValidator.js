/**
 * Created by renukaM on 28/11/16.
 */
var model = require('../model/db');
var Constants = require('../utils/constant');
var customerService = require('../services/customerService');

var MIDDLEWARE_NAME  = '[customerValidator] - ';

module.exports = function(req, res, next) {

    logger.debug("Customer_id", req.params.id);
    // if(!req.params.id){
    //     return res.send('400',Constants.MISSING_CUSTOMER_ID);
    // }
    var customerId = req.params.id;
    customerService.findCustomerById(customerId, function(error, result) {
        if(error){
            logger.error(MIDDLEWARE_NAME + "Error - " + JSON.stringify(error));
            return res.send('500',Constants.INTERNAL_SERVER_ERROR);
        }
        if(!result){
            logger.warn(MIDDLEWARE_NAME + "No result found - " + JSON.stringify(result));
            return res.send('404',Constants.NOT_FOUND);
        }
        logger.debug("Result found " + JSON.stringify(result));
    });
};