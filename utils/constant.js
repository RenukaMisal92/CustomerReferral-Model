var constant = function() {
    // Default error messages
    this.INTERNAL_SERVER_ERROR = "Sorry something went wrong please try again in some time.";
    this.CUSTOMER_ALREADY_EXISTS = "Sorry customer is already registered with this email.";
    this.CUSTOMER_ADDED_SUCCESSFULLY = "Customer added successfully.";
    this.REFERRAL_ADDED_SUCCESSFULLY = "Referral added successfully.";
    this.CUSTOMER_UPDATED_SUCCESSFULLY = "Customer updated successfully for ambassador customer";
    this.CUSTOMER_NOT_FOUND = "Sorry, entered customerId not found in records.";
    this.REFERRAL_NOT_FOUND = "Sorry, No referrals found under this referral id.";
    this.MISSING_CUSTOMER_ID = "Customer_id is missing in request";
    this.ALREADY_AMBASSADOR = "Customer already ambassador";
    this.NOT_AMBASSADOR = "Customer is not a ambassador";
    this.JOINING_FEES = "100";
    this.PERCENTAGE_BONUS = "30";
    this.IS_ISAMBASSADOR_BONUS = "10";
};

module.exports = new constant();
