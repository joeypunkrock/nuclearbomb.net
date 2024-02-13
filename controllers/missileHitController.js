const MissileHit = require("../models/missileHitModel");

// Controller function to get all missile hits
exports.getAllMissileHits = async (req, res) => {
  try {
    const missileHits = await MissileHit.find();
    res.status(200).json(missileHits);
  } catch (error) {
    res.status(500).json({ message: "Error getting all missile hits", error: error.message });
  }
};

// Controller function to get all missile hits for a specific countryId
exports.getMissileHitsByCountryId = async (req, res) => {
  const countryId = req.params.countryId;
  try {
    const missileHits = await MissileHit.find({ countryId: countryId });
    res.status(200).json(missileHits);
  } catch (error) {
    res.status(500).json({ message: "Error getting missile hits by countryId", error: error.message });
  }
};
