const express = require('express');
const axios = require('axios');

const router = express.Router();

// Get available ML models
router.get('/available', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:8000/models');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'ML service unavailable'
        });
    }
});

// Health check for ML service
router.get('/health', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:8000/health');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'ML service unavailable'
        });
    }
});

module.exports = router;