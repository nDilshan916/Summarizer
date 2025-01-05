const multer = require('multer');
const axios = require('axios');
const path = require('path');
const { ObjectId } = require('mongodb');
const fs = require('fs');
const FormData = require('form-data');
const Category = require('../models/Category');

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

exports.createTopics = [
    upload.single('file'), // Middleware for handling file upload
    async (req, res) => { // Main handler function
        const categoryId = req.params.categoryId;

        // Verify category exists
        const category = await Category.findOne({ _id: new ObjectId(categoryId) });
        if (!category) {
            return res.status(404).send({ error: 'Category not found.' });
        }

        const filePath = path.join(__dirname, '../uploads', req.file.filename);
        try {
            // Initialize FormData and append file
            const formData = new FormData();
            formData.append('file', fs.createReadStream(filePath));

            // Send file to Flask API
            const response = await axios.post(`http://127.0.0.1:5000/upload/${categoryId}`, formData, {
                headers: {
                    ...formData.getHeaders(),
                },
            });

            res.json({ message: "File uploaded and processed", data: response.data });

            // Clean up uploaded file
            fs.unlinkSync(filePath);

        } catch (error) {
            console.error("Error uploading to Flask:", error);
            res.status(500).send("Failed to process the file");
        }
    },
];
