
// External dependencies
var async = require('async');
var _ = require('lodash');

// Internal dependencies
var customerService = require('../services/customerService');
var Constants = require('../utils/constant');
var utils = require('../utils/utils');

var ambassadorService = require('../services/ambassadorService');
var customerController = require('./customerController');
var CONTROLLER_NAME = '[ambassadorController] - ';

/**
 * @method getAmbassadorChild
 * @description Get ambassadors children with respect to level of the tree formed with referencing
 * @param req
 * @param res
 * @param next
 */
var getAmbassadorChild = function(req, res, next){
    var level = req.query.level;
    var customer_id = req.params.id;
    var buildResponse;
    var METHOD_NAME = '[getAmbassadorChild]';

    var currentAmbassadorStatus = req.body.currentAmbassadorStatus;
    if(!currentAmbassadorStatus){
        logger.debug(CONTROLLER_NAME + METHOD_NAME + "currentAmbassadorStatus" + JSON.stringify(currentAmbassadorStatus));
        buildResponse = utils.getResponse('200', Constants.NOT_AMBASSADOR);
        return res.status('200').send(buildResponse);
    }
    ambassadorService.fetchAmbassadorChildren(customer_id, level, function(error, result) {
        if(error){
            logger.error(CONTROLLER_NAME + METHOD_NAME + "Error : " + JSON.stringify(error));
            buildResponse = utils.getResponse('500', Constants.INTERNAL_SERVER_ERROR);
            return res.status('500').send(buildResponse);
        }
        if (_.isEmpty(result)) {
            buildResponse = utils.getResponse('404', Constants.REFERRAL_NOT_FOUND_WITH_EXPECTED_LEVEL);
            return res.status(404).send(buildResponse);
        }
        logger.debug(CONTROLLER_NAME + METHOD_NAME + "Results" + JSON.stringify(result));
        buildResponse = utils.getResponse('200', result);
        return res.status('200').send(buildResponse);
    });
};

/**
 * @method addAmbassador
 * @description Adding a Ambassador
 * @param req
 * @param res
 * @param next
 */
var addAmbassador = function(req, res, next){

    var METHOD_NAME = '[addAmbassador] - ';
    var buildResponse;
    logger.debug("Request Object ", (req.body));

    customerController.processToAddCustomer(req, res, function(err, result) {

        var customerObject = customerService.buildObject(result);
        // Enabling the isAmbassador as true to add a new ambassador
        customerObject.isAmbassador = true;

        customerService.saveCustomer(customerObject, function (error, result) {
            if (error) {
                logger.error(CONTROLLER_NAME + METHOD_NAME + "Error - " + JSON.stringify(error));
                buildResponse = utils.getResponse(500, Constants.INTERNAL_SERVER_ERROR);
                return res.status(500).send(buildResponse);
            }
            if (!result) {
                logger.warn(CONTROLLER_NAME + METHOD_NAME + "No result found - " + JSON.stringify(result));
                buildResponse = utils.getResponse(500, Constants.INTERNAL_SERVER_ERROR);
                return res.status(500).send(buildResponse);
            }
            buildResponse = utils.getResponse(200, Constants.AMBASSADOR_ADDED_SUCCESSFULLY + " and customer_id is " + result.customer_id);
            return res.status(200).send(buildResponse);
        });
    });
};

/**
 * @method getAllChildOfAmbassador
 * @description Get all ambassadors children by the tree formed with referencing
 * @param req
 * @param res
 * @param next
 */
var getAllChildOfAmbassador = function(req, res, next){
    var METHOD_NAME = '[getAllChildOfAmbassador]';
    var customer_id = req.params.id;
    var buildResponse;
    ambassadorService.fetchAllAmbassadorsChild(customer_id, function(error, result) {
        if(error){
            logger.error(CONTROLLER_NAME + METHOD_NAME + "Error : " + JSON.stringify(error));
            buildResponse = utils.getResponse('500', Constants.INTERNAL_SERVER_ERROR);
            return res.status('500').send(buildResponse);
        }
        logger.debug(CONTROLLER_NAME + METHOD_NAME + "Results" + JSON.stringify(result));
        buildResponse = utils.getResponse('200', result);
        return res.status('200').send(buildResponse);
    });
};


module.exports.addAmbassador = addAmbassador;
module.exports.getAmbassadorChild = getAmbassadorChild;
module.exports.getAllChildOfAmbassador = getAllChildOfAmbassador;