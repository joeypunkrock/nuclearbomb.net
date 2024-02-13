const express = require("express");
const router = express.Router();
const countryController = require('../controllers/countryController');

router.get('/', countryController.getAllCountries);
router.get('/:countryId', countryController.getCountryById);
router.post('/launch-missile', countryController.launchMissile);
            
// Other routes for creating, updating, and deleting countries would go here...

module.exports = router;