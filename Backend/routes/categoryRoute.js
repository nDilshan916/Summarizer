const express = require('express');
const { createCategory, getCategoryTopics } = require('../controllers/categoryController');
const router = express.Router();

router.post('/categories', createCategory);
router.get('/categories/:categoryId', getCategoryTopics);

module.exports = router;
