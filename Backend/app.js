const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db.js");
const cors = require("cors");
// Import Routes
const documentRoutes = require("./routes/documentRoute");

const app = express();

// Middleware
app.use(bodyParser.json());
connectDB();

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:4200", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/", documentRoutes);

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
