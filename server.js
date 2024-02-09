// server.js (Main server file)
const dotenv = require("dotenv").config({
  path: process.env.NODE_ENV === "development" ? ".env.development" : ".env",
});
const connectDB = require("./database");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const countryRoutes = require('./routes/countryRoutes');

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

// Use countryRoutes for all routes related to countries
app.use('/countries', countryRoutes);