const mongoose = require("mongoose");

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://navindudilshan19:3zwm6yMU6nQ3FqXz@cluster0.sbxfd.mongodb.net/AI_Project?retryWrites=true&w=majority",

      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
