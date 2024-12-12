const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/transactionDB", {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the app on failure
  }
};

module.exports = connectDB;
