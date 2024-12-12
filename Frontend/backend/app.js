// Required dependencies
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

// Initialize app
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/transactionsDB', {
  
});

// Define Schema and Model
const transactionSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  dateOfSale: Date,
  category: String,
  sold: Boolean,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// API to initialize database
app.get('/api/initialize-database', async (req, res) => {
  try {
    const { data } = await axios.get(
      'https://s3.amazonaws.com/roxiler.com/product_transaction.json'
    );

    await Transaction.deleteMany({}); // Clear existing data
    await Transaction.insertMany(data); // Insert new data

    res.json({ message: 'Database initialized successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize database' });
  }
});

// API to list all transactions with search and pagination
app.get('/api/transactions', async (req, res) => {
  const { page = 1, perPage = 10, search = '', month } = req.query;

  const startDate = new Date(`${month} 1, 2000`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const query = {
    dateOfSale: { $gte: startDate, $lt: endDate },
    ...(search && {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { price: { $regex: search, $options: 'i' } },
      ],
    }),
  };

  try {
    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    res.json({ total, transactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// API for statistics
app.get('/api/statistics', async (req, res) => {
  const { month } = req.query;

  const startDate = new Date(`${month} 1, 2000`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  try {
    const totalSale = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);

    const totalSold = await Transaction.countDocuments({
      dateOfSale: { $gte: startDate, $lt: endDate },
      sold: true,
    });

    const totalNotSold = await Transaction.countDocuments({
      dateOfSale: { $gte: startDate, $lt: endDate },
      sold: false,
    });

    res.json({
      totalSaleAmount: totalSale[0]?.total || 0,
      totalSoldItems: totalSold,
      totalNotSoldItems: totalNotSold,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// API for bar chart data
app.get('/api/bar-chart', async (req, res) => {
  const { month } = req.query;

  const startDate = new Date(`${month} 1, 2000`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const priceRanges = [
    [0, 100],
    [101, 200],
    [201, 300],
    [301, 400],
    [401, 500],
    [501, 600],
    [601, 700],
    [701, 800],
    [801, 900],
    [901, Infinity],
  ];

  try {
    const barChartData = await Promise.all(
      priceRanges.map(async ([min, max]) => {
        const count = await Transaction.countDocuments({
          dateOfSale: { $gte: startDate, $lt: endDate },
          price: { $gte: min, $lte: max },
        });

        return { range: `${min}-${max === Infinity ? 'above' : max}`, count };
      })
    );

    res.json(barChartData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bar chart data' });
  }
});

// API for pie chart data
app.get('/api/pie-chart', async (req, res) => {
  const { month } = req.query;

  const startDate = new Date(`${month} 1, 2000`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  try {
    const pieChartData = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.json(pieChartData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pie chart data' });
  }
});

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
