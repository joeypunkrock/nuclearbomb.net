const express = require("express");
const router = express.Router();
const countryController = require('../controllers/countryController');

router.get('/', countryController.getAllCountries);
router.get('/:countryId', countryController.getCountryById);
router.post('/increment-missile-hit', countryController.incrementMissileHit);
router.post('/increment-missile-hit-random', countryController.incrementMissileHitRandom);
            
// Other routes for creating, updating, and deleting countries would go here...

module.exports = router;