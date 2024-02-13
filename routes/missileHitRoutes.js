const express = require('express');
const router = express.Router();
const missileHitController = require('../controllers/missileHitController');

// Route to get all missile hits
router.get('/', missileHitController.getAllMissileHits);

// Route to get all missile hits for a specific countryId
router.get('/country/:countryId', missileHitController.getMissileHitsByCountryId);

module.exports = router;