const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db.js');

// Import Routes
const categoryRoutes = require('./routes/categoryRoute');
const documentRoutes = require('./routes/documentRoute');

const app = express();

// Middleware
app.use(bodyParser.json());
connectDB();

// Routes
app.use('/', categoryRoutes);
app.use('/', documentRoutes);

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
