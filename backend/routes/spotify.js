const express = require('express');
const axios = require('axios');
const router = express.Router();

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Exchange authorization code for access token
router.post('/token', async (req, res) => {
    try {
        const {
            code,
            redirect_uri
        } = req.body;

        const response = await axios.post('https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri,
                client_id: SPOTIFY_CLIENT_ID,
                client_secret: SPOTIFY_CLIENT_SECRET,
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Spotify token exchange error:', error.response ? .data || error.message);
        res.status(400).json({
            error: 'Failed to exchange code for token',
            details: error.response ? .data || error.message
        });
    }
});

// Refresh access token
router.post('/refresh', async (req, res) => {
    try {
        const {
            refresh_token
        } = req.body;

        const response = await axios.post('https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token,
                client_id: SPOTIFY_CLIENT_ID,
                client_secret: SPOTIFY_CLIENT_SECRET,
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Spotify token refresh error:', error.response ? .data || error.message);
        res.status(400).json({
            error: 'Failed to refresh token',
            details: error.response ? .data || error.message
        });
    }
});

module.exports = router;