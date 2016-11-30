/**
 * Created by renukaM on 28/11/16.
 */

var model = require('../model/db');
var SERVICE_NAME = '[ambassadorService] - ';

/**
 * @method fetchAllAmbassadorsChild
 * @description Find the all children of ambassadors till tree formed with referencing the customers.
 * @param customer_id
 * @param callback
 */
var fetchAllAmbassadorsChild = function(customer_id, callback){
    var METHOD_NAME = '[fetchAllAmbassadorsChild] - ';
    logger.debug(SERVICE_NAME +METHOD_NAME + "customer_id - " + customer_id);
    var getDetailsFor = {_id :0, customer_id : 1, email : 1, referral_id: 1,isAmbassador:1, joiningDate: 1, lastUpdated:1};
    model.customer.find({parentAmbassadors: {$in:[Number(customer_id)]}},getDetailsFor, function(error, result){
        logger.debug(SERVICE_NAME + METHOD_NAME + JSON.stringify(result, null, 2));
        return callback(error, result);
    });
};


/**
 * @method fetchAmbassadorChildren
 * @description Find the children of ambassadors with the level of tree formed with referencing the customers.
 * @param customer_id
 * @param level
 * @param callback
 */
var fetchAmbassadorChildren = function(customer_id, level, callback){
    var METHOD_NAME = '[fetchAllAmbassadorsChild] - ';
    logger.debug(SERVICE_NAME +METHOD_NAME + "customer_id - " + customer_id + " and level " + level);
    var getDetailsFor = {_id :0, customer_id : 1, email : 1, referral_id: 1,isAmbassador:1, joiningDate: 1, lastUpdated:1};
    model.customer.find({$and : [{childLevelOfAmbassadors: level},{parentAmbassadors :{$in:[Number(customer_id)]}}]},getDetailsFor, function(error, result){
        logger.debug(SERVICE_NAME + METHOD_NAME + "Result -" + JSON.stringify(result));
        return callback(error, result);
    });
};


module.exports.fetchAllAmbassadorsChild = fetchAllAmbassadorsChild;
module.exports.fetchAmbassadorChildren = fetchAmbassadorChildren;