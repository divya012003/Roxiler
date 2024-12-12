const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const connectDB = require("./database");
const Transaction = require("./models/Transaction");

const app = express();

// Connect to the database
connectDB();

// Initialize the database with seed data
app.get("/api/initialize-database", async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );

    // Clear existing data
    await Transaction.deleteMany();

    // Insert new data
    await Transaction.insertMany(data);

    res.status(200).json({ message: "Database initialized successfully" });
  } catch (error) {
    console.error("Error initializing database:", error);
    res.status(500).json({ error: "Failed to initialize database" });
  }
});

app.get("/api/pie-chart", async (req, res) => {
    try {
      const { month } = req.query;
  
      // Validate the month input
      if (!month) {
        return res.status(400).json({ error: "Month parameter is required." });
      }
  
      // Convert month name to index
      const monthIndex = new Date(`${month} 1, 2000`).getMonth() + 1;
  
      if (isNaN(monthIndex)) {
        return res.status(400).json({ error: "Invalid month name." });
      }
  
      // Define start and end date for the month
      const startDate = new Date(2000, monthIndex - 1, 1); // Start of month
      const endDate = new Date(2000, monthIndex, 0); // End of month
  
      // Fetch transactions for the selected month
      const transactions = await Transaction.find({
        dateOfSale: {
          $gte: new Date(startDate).setUTCFullYear(2000),
          $lte: new Date(endDate).setUTCFullYear(2023), // Match all years
        },
      });
  
      // Aggregate data by category
      const categoryCounts = transactions.reduce((acc, transaction) => {
        const category = transaction.category || "Uncategorized";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});
  
      // Format the response
      const result = Object.entries(categoryCounts).map(([category, count]) => ({
        category,
        count,
      }));
  
      res.status(200).json({ month, categories: result });
    } catch (error) {
      console.error("Error fetching pie chart data:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  });
  

// Start the server
app.listen(8000, () => {
  console.log("Server is running on PORT 8000");
});
