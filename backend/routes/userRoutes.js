import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser  = await User.findOne({ email });
        if (existingUser ) {
            return res.status(400).json({ message: 'User  already exists' });
        }

        // Create a new user
        const newUser  = new User({
            name,
            email,
            password, // Storing password in plain text (not recommended)
        });

        // Save the user to the database
        await newUser .save();

        res.status(201).json({ message: 'User  created successfully' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if the password matches
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            user: {
                name: user.name,
                email: user.email,
            },
            token,
        });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

export default router;
