const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
};

module.exports = connectToDatabase;
