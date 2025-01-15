const multer = require('multer');
const axios = require('axios');
const path = require('path');
const { ObjectId } = require('mongodb');
const fs = require('fs');
const FormData = require('form-data');
const exp = require('constants');


// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

exports.createTopics = [
    upload.single('file'),
    async (req, res) => {
        const filePath = path.join(__dirname, '../uploads', req.file.filename);

        try {
            const formData = new FormData();
            formData.append('file', fs.createReadStream(filePath));

            const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
                headers: formData.getHeaders(),
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

exports.getAllTopics = async (req, res) => {
    try {
        // Call the Flask API to fetch topics
        const response = await axios.get('http://127.0.0.1:5000/get_topics');
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching topics:", error.message);
        res.status(500).json({ error: "Failed to fetch topics" });
    }
};