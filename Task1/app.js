const express = require("express");
const axios = require("axios");
const connectDB = require("./database");
const Transaction = require("./models/Transaction");

const app = express();
const PORT = 8000;

// Connect to the database
connectDB();

// Initialize the database with seed data
app.get("/api/initialize-database", async (req, res) => {
  try {
    // Fetch data from third-party API
    const response = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
    const transactions = response.data;

    // Insert data into the database
    await Transaction.deleteMany(); // Clear existing data
    await Transaction.insertMany(transactions);

    res.status(200).json({ message: "Database initialized successfully!" });
  } catch (error) {
    console.error("Error initializing database:", error);
    res.status(500).json({ error: "Failed to initialize database" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
