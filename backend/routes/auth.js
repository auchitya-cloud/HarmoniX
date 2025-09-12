const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const {
            username,
            email,
            password
        } = req.body;

        const existingUser = await User.findOne({
            $or: [{
                email
            }, {
                username
            }]
        });

        if (existingUser) {
            return res.status(400).json({
                error: 'User already exists'
            });
        }

        const user = new User({
            username,
            email,
            password
        });
        await user.save();

        const token = jwt.sign({
                userId: user._id
            },
            process.env.JWT_SECRET || 'fallback-secret', {
                expiresIn: '7d'
            }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        const user = await User.findOne({
            email
        });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        const token = jwt.sign({
                userId: user._id
            },
            process.env.JWT_SECRET || 'fallback-secret', {
                expiresIn: '7d'
            }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// Verify token
router.get('/verify', async (req, res) => {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader ? authHeader.replace('Bearer ', '') : null;

        if (!token) {
            return res.status(401).json({
                error: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({
                error: 'User not found'
            });
        }

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(401).json({
            error: 'Invalid token'
        });
    }
});

module.exports = router;