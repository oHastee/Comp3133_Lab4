require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./User');
const userData = require('./UsersData.json');

const app = express();

app.use(express.json());

const uri = process.env.MONGODB_URI;
mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected successfully');
        seedDefaultData();
    })
    .catch(err => console.error('MongoDB connection error:', err));

async function seedDefaultData() {
    try {
        const count = await User.countDocuments();
        if (count === 0) {
            await User.insertMany(userData);
            console.log('Default user data seeded successfully');
        } else {
            console.log('User data already exists, no seeding required');
        }
    } catch (error) {
        console.error('Error during seeding default data:', error);
    }
}

app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: 'User created successfully', user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
