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

app.get("/api/bar-chart", async (req, res) => {
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
  
      // Define price ranges
      const priceRanges = [
        { range: "0 - 100", count: 0 },
        { range: "101 - 200", count: 0 },
        { range: "201 - 300", count: 0 },
        { range: "301 - 400", count: 0 },
        { range: "401 - 500", count: 0 },
        { range: "501 - 600", count: 0 },
        { range: "601 - 700", count: 0 },
        { range: "701 - 800", count: 0 },
        { range: "801 - 900", count: 0 },
        { range: "901 - above", count: 0 },
      ];
  
      // Calculate number of items in each price range
      transactions.forEach((transaction) => {
        const price = transaction.price;
  
        if (price >= 0 && price <= 100) priceRanges[0].count++;
        else if (price >= 101 && price <= 200) priceRanges[1].count++;
        else if (price >= 201 && price <= 300) priceRanges[2].count++;
        else if (price >= 301 && price <= 400) priceRanges[3].count++;
        else if (price >= 401 && price <= 500) priceRanges[4].count++;
        else if (price >= 501 && price <= 600) priceRanges[5].count++;
        else if (price >= 601 && price <= 700) priceRanges[6].count++;
        else if (price >= 701 && price <= 800) priceRanges[7].count++;
        else if (price >= 801 && price <= 900) priceRanges[8].count++;
        else if (price > 900) priceRanges[9].count++;
      });
  
      res.status(200).json({ month, priceRanges });
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  });
  

// Start the server
app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
