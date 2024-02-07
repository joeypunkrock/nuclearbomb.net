// server.js (Main server file)
const dotenv = require('dotenv').config({
    path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env'
});
const connectDB = require('./database');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const Country = require('./models/countrySchema.js'); // Adjust the path to the actual location of countryScheme.js

const app = express();
app.use(cors());

// Connect to the MongoDB cluster
mongoose.connect(process.env.DB_URI);

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

// Define the schema for the 'countries' collection
// const countrySchema = new mongoose.Schema({
//     countryName: String,
//     initialPopulation: mongoose.Schema.Types.Int32,
//     currentPopulation: mongoose.Schema.Types.Int32,
//     missilesHit: mongoose.Schema.Types.Int32,
// });

// Create a model for the 'countries' collection
//const Country = mongoose.model('Country', countrySchema);

// Fetch all countries from the collection using async/await
async function fetchCountries() {
    try {
        const countries = await Country.find({});
        console.log('All countries:', countries);
    } catch (error) {
        console.error('Error fetching countries:', error);
        // Log the error code and message (if available)
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
    } finally {
        // Close the MongoDB connection (optional)
        mongoose.connection.close();
    }
}

// Call the function to fetch countries
fetchCountries();

// Define an async function to fetch a specific country by its _id
async function fetchSpecificCountry(countryId) {
    try {
        const specificCountry = await Country.findById(countryId);
        console.log('Specific country:', specificCountry);
    } catch (error) {
        console.error('Error fetching specific country:', error);
        // Log the error code and message (if available)
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
    } finally {
        // Close the MongoDB connection (optional)
        mongoose.connection.close();
    }
}

// Call the async function to fetch a specific country
fetchSpecificCountry('65c25f2058425a029a47177f');