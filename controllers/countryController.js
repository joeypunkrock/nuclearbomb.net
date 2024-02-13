const Country = require("../models/countryModel");
const MissileHit = require("../models/missileHitModel");
const ObjectId = require("mongoose").Types.ObjectId;

// Fetch all countries from the collection
exports.getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find({});
    res.status(200).json(countries); // Send the list of countries as JSON response
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({ error: "Failed to fetch countries" }); // Send an error response if fetching fails
  }
};

// Define an async function to fetch a specific country by its _id
exports.getCountryById = async (req, res) => {
  const { countryId } = req.params;
  try {
    const specificCountry = await Country.findById(countryId);
    if (!specificCountry) {
      return res.status(404).json({ error: "Country not found" }); // Return a 404 error if country is not found
    }
    res.status(200).json(specificCountry); // Send the specific country as JSON response
  } catch (error) {
    console.error("Error fetching specific country:", error);
    res.status(500).json({ error: "Failed to fetch specific country" }); // Send an error response if fetching fails
  }
};

exports.launchMissile = async (req, res) => {
  try {
    // Destructuring request body
    const { countryId, lat, lng, missileType, damageRadius, damageLevel } = req.body;

    // Fetch country data based on provided countryId or get a random country
    const selectedCountryData = await getCountryData(countryId);

    // Apply proportional population reduction based on the missile's damage level
    const populationReduction = await applyPopulationReduction(selectedCountryData._id, damageLevel);

    // Create and save the missile hit entry with population reduction data
    const savedMissileHit = await createAndSaveMissileHit(selectedCountryData._id, lat, lng, missileType, damageRadius, damageLevel, populationReduction);

    // Increment the missile hit count for the country
    await incrementMissilesHit(selectedCountryData._id);

    // Fetch the updated country data
    const updatedCountryData = await Country.findById(selectedCountryData._id);

    // Send the response back with success message and relevant data
    res.status(200).json({
      message: "Missile launched successfully",
      missileHit: savedMissileHit,
      country: updatedCountryData,
    });
  } catch (error) {
    // Error handling
    console.error("Error launching missile:", error);
    res.status(500).json({ message: "Failed to launch missile", error: error.message });
  }
};

// Function to apply proportional reduction to the country's population
async function applyPopulationReduction(countryId, damageLevel) {
  const reductionFactors = { minor: 0.1, moderate: 0.2, severe: 0.3 };
  const country = await Country.findById(countryId);

  if (!country) {
    throw new Error("Country not found");
  }

  // Helper function to apply population reduction
  function calculateNewPopulation(currentPopulation, reductionFactor) {
    let newPopulation = currentPopulation * (1 - reductionFactor);

    // Check for negligible population
    if (newPopulation < 1) {
      newPopulation = 0;
    }

    // Round to nearest whole number and ensure it's not negative
    return Math.max(0, Math.round(newPopulation));
  }

  // Calculate the new population and reduction
  const newPopulation = calculateNewPopulation(country.currentPopulation, reductionFactors[damageLevel]);
  const reduction = country.currentPopulation - newPopulation;
  country.currentPopulation = newPopulation;

  await country.save();

  return reduction; // Return the amount of population reduced
}

// Function to get country data based on the provided countryId or fetch a random country if no id is provided
async function getCountryData(countryId) {
  if (!countryId) {
    return await getRandomCountry();
  } else {
    const countryData = await Country.findById(countryId);
    if (!countryData) {
      throw new Error("Country not found");
    }
    return countryData;
  }
}

// Function to fetch a random country from the database
async function getRandomCountry() {
  const randomCountry = await Country.aggregate([{ $sample: { size: 1 } }]);
  if (!randomCountry || randomCountry.length === 0) {
    throw new Error("No random country found");
  }
  return randomCountry[0];
}

// Function to create and save a missile hit entry in the database
async function createAndSaveMissileHit(countryId, lat, lng, missileType, damageRadius, damageLevel, populationReduction) {
  const newMissileHit = new MissileHit({
    country: countryId,
    coordinates: {
      type: "Point",
      coordinates: [lng, lat],
    },
    missileType: missileType,
    damageRadius: damageRadius,
    damageLevel: damageLevel,
    populationReduction: populationReduction, // Storing the population reduction
  });

  return await newMissileHit.save();
}

// Function to increment the missilesHit count for a country and return the updated country data
async function incrementMissilesHit(countryId) {
  await Country.updateOne({ _id: countryId }, { $inc: { missilesHit: 1 } });
  return await Country.findById(countryId);
}
