// External dependencies
var express = require('express');
var router = express.Router();

// Internal dependencies
var customerController = require('../controllers/customerController');
var customerValidator = require('../middlewares/customerValidator');

router.post('/', customerController.addCustomer); // Add a new customer in records
router.get('/:id', customerController.getCustomerDetails); // Get the customer details from db
router.put('/:id/ambassador', customerValidator, customerController.updateCustomerForAmbassador); // Updating customer Details in records.
router.get('/:id/referral/count', customerValidator, customerController.getCountOfReferrals); // Get the count of the referrals under any customer_id.
router.get('/:id/referral', customerValidator, customerController.getAllReferrals); // Get the details of the referrals under any customer_id.

router.post('/referral', customerController.addReferral); // Add a referrals under any customer_id
router.post('/ambassador', customerValidator, customerController.addReferral); // Adding a referrals as ambassador

router.get('/:id/ambassador', customerValidator, customerController.getAmbassadorChild);

// Exports router.
module.exports.customerRouter = router;
