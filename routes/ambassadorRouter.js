
// External dependencies
var express = require('express'),
    router = express.Router();

// Internal dependencies
var ambassadorController = require('../controllers/ambassadorController');
var customerValidator = require('../middlewares/customerValidator');

router.get('/:id', customerValidator, ambassadorController.getAmbassadorChild); // Get Child of ambassadors with level specified.
router.get('/:id/all', customerValidator, ambassadorController.getAllChildOfAmbassador);// Get all Children of ambassador
router.post('/', ambassadorController.addAmbassador); // Add a ambassador

module.exports.ambassadorRouter = router;