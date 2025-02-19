const mongoose = require('mongoose');

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://ai_project:12345@cluster0.g9oh7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
