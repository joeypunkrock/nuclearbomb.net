const mongoose = require("mongoose");
const uri = process.env.DB_URI;

const clientOptions = { serverApi: { version: "1", strict: true, deprecationErrors: true } };

const connectDB = async () => {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;