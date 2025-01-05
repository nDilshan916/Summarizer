const express = require('express');
const { createTopics } = require('../controllers/documentController');
const router = express.Router();

router.post('/upload/:categoryId', createTopics);


module.exports = router;
