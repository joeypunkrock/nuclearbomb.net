// server.js (Main server file)
require('dotenv').config({
    path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env'
});
const express = require('express');
const connectDB = require('./database');
//import playerRoutes from "./routes/playerRoutes"; // Importing playerRoutes
const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json()); // Middleware to parse JSON bodies

// Define a simple route for testing
app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// Use playerRoutes for any request that starts with '/player'
// app.use("/player", playerRoutes);

// const port = 3000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
