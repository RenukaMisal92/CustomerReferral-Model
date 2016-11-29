var constant = function() {

    // Database name
    this.DATABASE_NAME = "StaplesEasySystem";

    // Session expiry
    this.SESSION_MAX_AGE_IN_MS = 604800000;

    // Cron Job
    this.CHANGE_TICKET_STATUS_INTERVAl = 60000;

    // Default error messages
    this.INTERNAL_SERVER_ERROR = "Internal server error";
    this.CUSTOMER_ALREADY_EXISTS = "Sorry not able to process your request at the moment.";
    this.UNAUTHORIZED_ERROR = "Session is expired, please login again.";
    this.JOINING_FEES = "100";
    this.PERCENTAGE_BONUS = "30";
    this.IS_ISAMBASSADOR_BONUS = "40";
}

module.exports = new constant();
