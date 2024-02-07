
// Connect to MongoDB
connectDB().then(() => {
    // Start listening after the database connection is established
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Database connection failed', error);
    process.exit(1);
});

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors());

// Define a simple route for testing
app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

app.post('/increment-missile-hit', (req, res) => {
    Country.updateOne(
        { _id: new ObjectId("65c25e8758425a029a46a44b") },
        { $inc: { missilesHit: 1 } }
    ).then(result => {
        console.log(result); // Log the result to see what's happening
        res.send({ message: 'Missile hit incremented', result: result });
    }).catch(error => {
        console.error("Error details:", error);
        res.status(500).send({ message: 'Error incrementing missile hit', error: error.message });
    });
});

// GET route to fetch all countries
app.get('/countries', (req, res) => {
    Country.find({})
        .then(countries => {
            res.json(countries);
        })
        .catch(error => {
            console.error('Error fetching countries:', error);
            res.status(500).send({ message: 'Error fetching countries', error: error.message });
        });
});

//import playerRoutes from "./routes/playerRoutes"; // Importing playerRoutes

// Use playerRoutes for any request that starts with '/player'
// app.use("/player", playerRoutes);

// const port = 3000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
