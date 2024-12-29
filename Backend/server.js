const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mean-ai-project')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Sample route
app.get('/', (req, res) => {
    res.send('Server is running');
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Proxy is working!' });
  });
  

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
