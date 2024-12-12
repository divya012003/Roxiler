const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const Transaction = require("./models/Transaction");

dotenv.config();
const app = express();

app.use(bodyParser.json());

mongoose
  .connect(process.env.DATABASE_CONNECTION)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Statistics API
app.get("/api/statistics", async (req, res) => {
  try {
    const { month } = req.query;

    // Validate input
    if (!month) {
      return res.status(400).json({ error: "Month parameter is required." });
    }

    // Convert month name to a number (e.g., January -> 1)
    const monthIndex = new Date(`${month} 1, 2000`).getMonth() + 1;

    if (isNaN(monthIndex)) {
      return res.status(400).json({ error: "Invalid month name." });
    }

    // Start and end of the selected month (irrespective of year)
    const startDate = new Date(2000, monthIndex - 1, 1);
    const endDate = new Date(2000, monthIndex, 0);

    // Fetch statistics
    const transactions = await Transaction.find({
      dateOfSale: {
        $gte: new Date(startDate).setUTCFullYear(2000),
        $lte: new Date(endDate).setUTCFullYear(2023), // Include all years
      },
    });

    const totalSaleAmount = transactions.reduce((sum, tx) => (tx.isSold ? sum + tx.price : sum), 0);
    const totalSoldItems = transactions.filter((tx) => tx.isSold).length;
    const totalNotSoldItems = transactions.filter((tx) => !tx.isSold).length;

    res.status(200).json({
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
