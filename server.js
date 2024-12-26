const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch(error => {
    console.error('MongoDB connection error:', error);
});

const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    course: String,
});

const Student = mongoose.model('Student', studentSchema);

app.post('/addStudent', async (req, res) => {
    try {
        const { name, email, mobile, course } = req.body;
        const student = new Student({ name, email, mobile, course });
        await student.save();
        res.status(201).json({ message: 'Student added successfully!' });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ error: 'Failed to add student.' });
    }
});

app.get('/searchStudent', async (req, res) => {
    try {
        const { query } = req.query;
        const students = await Student.find({ name: { $regex: query, $options: 'i' } });
        res.status(200).json(students);
    } catch (error) {
        console.error('Error searching students:', error);
        res.status(500).json({ error: 'Failed to search students.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
