const express = require('express');
const { createTopics, getAllTopics} = require('../controllers/documentController');
const router = express.Router();

router.post('/upload', createTopics);
router.get('/get_topics', getAllTopics);

module.exports = router;
