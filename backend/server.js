const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/musicai', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/music', require('./routes/music'));
app.use('/api/models', require('./routes/models'));
app.use('/api/spotify', require('./routes/spotify'));

// FastAPI ML service proxy
app.post('/api/generate-music', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:8000/generate', req.body, {
            timeout: 300000 // 5 minutes timeout
        });
        res.json(response.data);
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            res.status(408).json({
                error: 'Music generation timed out'
            });
        } else {
            res.status(500).json({
                error: 'ML service unavailable'
            });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});