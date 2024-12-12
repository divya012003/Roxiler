const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  title: {
     type: String, 
     required: true },
  description: { 
    type: String, 
    required: true },
  price: {
     type: Number,
      required: true },
  dateOfSale: { 
    type: Date, 
    required: true },
  isSold: { 
    type: Boolean, 
    required: true, 
    default: true }, // true = sold, false = not sold
});

module.exports = mongoose.model("Transaction", transactionSchema);
