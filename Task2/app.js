const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const Transaction = require("./models/Transaction");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE_CONNECTION)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API to list transactions (to be added next)

// API to list transactions with search and pagination
app.get("/api/transactions", async (req, res) => {
    try {
      // Read query parameters
      const { page = 1, perPage = 10, search = "" } = req.query;
  
      // Convert page and perPage to numbers
      const pageNumber = parseInt(page, 10);
      const perPageNumber = parseInt(perPage, 10);
  
      // Create a search filter
      const searchFilter = search
        ? {
            $or: [
              { title: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
              { price: isNaN(search) ? -1 : parseFloat(search) },
            ],
          }
        : {};
  
      // Fetch transactions with pagination
      const transactions = await Transaction.find(searchFilter)
        .skip((pageNumber - 1) * perPageNumber) // Pagination: skip records
        .limit(perPageNumber); // Pagination: limit records
  
      // Count total records (for pagination info)
      const totalRecords = await Transaction.countDocuments(searchFilter);
  
      res.status(200).json({
        page: pageNumber,
        perPage: perPageNumber,
        totalRecords,
        totalPages: Math.ceil(totalRecords / perPageNumber),
        transactions,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  
