const Country = require("../models/countryModel");
const ObjectId = require("mongoose").Types.ObjectId;

// Fetch all countries from the collection
exports.getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find({});
    res.json(countries); // Send the list of countries as JSON response
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
    res.json(specificCountry); // Send the specific country as JSON response
  } catch (error) {
    console.error("Error fetching specific country:", error);
    res.status(500).json({ error: "Failed to fetch specific country" }); // Send an error response if fetching fails
  }
};

// Increment missile hit for specific country
exports.incrementMissileHit = async (req, res) => {
  Country.updateOne({ _id: new ObjectId("65c25e8758425a029a46a44b") }, { $inc: { missilesHit: 1 } })
    .then((result) => {
      console.log(result); // Log the result to see what's happening
      res.send({ message: "Missile hit incremented", result: result });
    })
    .catch((error) => {
      console.error("Error details:", error);
      res.status(500).send({ message: "Error incrementing missile hit", error: error.message });
    });
};

// Select a random country, increment its missilesHit, and return its information
exports.incrementMissileHitRandom = async (req, res) => {
  try {
    // Fetch all countries from the database
    const countries = await Country.find({});
    // Randomly select a country from the list
    const randomIndex = Math.floor(Math.random() * countries.length);
    const randomCountry = countries[randomIndex];
    // Increment the missilesHit for the selected country
    await Country.updateOne({ _id: randomCountry._id }, { $inc: { missilesHit: 1 } });
    // Fetch the updated information of the selected country
    const updatedCountry = await Country.findById(randomCountry._id);
    res.json({ message: "Random country's missile hit incremented", country: updatedCountry });
  } catch (error) {
    console.error("Error incrementing missile hit for random country:", error);
    res.status(500).json({ error: "Error incrementing missile hit for random country" });
  }
};