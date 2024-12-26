const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'your-default-mongo-uri';

// Middleware
app.use(cors({
    origin: ['https://elc-students-management.netlify.app'], // Replace with your frontend domain
    methods: ['GET', 'POST'],
    credentials: true,
}));
app.use(bodyParser.json());

// MongoDB Atlas Connection
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch(error => {
    console.error('MongoDB connection error:', error);
});

// Define Student Schema and Model
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    course: { type: String, required: true },
});

const Student = mongoose.model('Student', studentSchema);

// Add Student Endpoint
app.post('/addStudent', async (req, res) => {
    try {
        const { name, email, mobile, course } = req.body;

        // Validate Input
        if (!name || !email || !mobile || !course) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Save Student
        const student = new Student({ name, email, mobile, course });
        await student.save();
        res.status(201).json({ message: 'Student added successfully!' });
    } catch (error) {
        console.error('Error adding student:', error);

        // Handle Duplicate Email Error
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already exists.' });
        }

        res.status(500).json({ error: 'Failed to add student.' });
    }
});

// Search Student Endpoint
app.get('/searchStudent', async (req, res) => {
    try {
        const { query } = req.query;

        // Search by Name with Case-Insensitive Matching
        const students = await Student.find({ name: { $regex: query, $options: 'i' } });
        res.status(200).json(students);
    } catch (error) {
        console.error('Error searching students:', error);
        res.status(500).json({ error: 'Failed to search students.' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
