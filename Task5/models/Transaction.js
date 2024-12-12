const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String, // Add this field for category
  dateOfSale: Date,
});

module.exports = mongoose.model("Transaction", TransactionSchema);
