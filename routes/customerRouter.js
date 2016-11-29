// External dependencies
var express = require('express');
var router = express.Router();

// Internal dependencies
var customerController = require('../controllers/customerController');
var customerValidator = require('../middlewares/customerValidator');

router.post('/', customerController.addCustomer);
router.get('/:id', customerController.getCustomerDetails);

router.get('/referral/count', customerValidator, customerController.getCountOfReferrals);
router.get('/referrals', customerValidator, customerController.getAllReferrals);
router.post('/referral', customerController.addReferral);


// Exports router.
module.exports.customerRouter = router;
