// server.js (Main server file)
const dotenv = require("dotenv").config({
  path: process.env.NODE_ENV === "development" ? ".env.development" : ".env",
});
const connectDB = require("./database");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const Country = require("./models/countrySchema.js"); // Adjust the path to the actual location of countryScheme.js

const PORT = process.env.PORT || 3000;
// Connect to MongoDB
connectDB()
  .then(() => {
    // Start listening after the database connection is established
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed", error);
    process.exit(1);
  });

const app = express();
app.use(cors());

// increment missile hit for country
app.post("/increment-missile-hit", (req, res) => {
  Country.updateOne({ _id: new ObjectId("65c25e8758425a029a46a44b") }, { $inc: { missilesHit: 1 } })
    .then((result) => {
      console.log(result); // Log the result to see what's happening
      res.send({ message: "Missile hit incremented", result: result });
    })
    .catch((error) => {
      console.error("Error details:", error);
      res.status(500).send({ message: "Error incrementing missile hit", error: error.message });
    });
});

// Fetch all countries from the collection
app.get("/countries", async (req, res) => {
  try {
    const countries = await Country.find({});
    res.json(countries); // Send the list of countries as JSON response
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({ error: "Failed to fetch countries" }); // Send an error response if fetching fails
  }
});

// Define an async function to fetch a specific country by its _id
app.get("/countries/:countryId", async (req, res) => {
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
});
