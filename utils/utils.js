

var getResponse = function(statusCode, responseMessage){

    return {
        statusCode : statusCode,
        message : responseMessage
    }
};

module.exports.getResponse = getResponse;
