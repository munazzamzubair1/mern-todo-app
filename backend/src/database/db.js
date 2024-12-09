const mongoose = require("mongoose");
require("dotenv").config();

// Function to connect to the database
const connectWithDb = async () => {
  try {
    // Connect to MongoDB using the DB_URI from environment variables
    const conn = await mongoose.connect(process.env.DB_URI);

    console.log("Database connected successfully");
    return conn; // Return the connection object if needed elsewhere
  } catch (error) {
    // Log the error message to provide more insight
    console.error("Failed to connect to the database", error.message);

    // Gracefully exit if the connection fails
    process.exit(1); // Exit with a non-zero status code to indicate failure
  }
};

module.exports = connectWithDb;
