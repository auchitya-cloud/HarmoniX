const express = require('express');
const Track = require('../models/Track');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all public tracks
router.get('/tracks', async (req, res) => {
    try {
        const tracks = await Track.find({
                isPublic: true
            })
            .populate('creator', 'username')
            .sort({
                createdAt: -1
            });
        res.json(tracks);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// Get user's tracks
router.get('/my-tracks', auth, async (req, res) => {
    try {
        const tracks = await Track.find({
                creator: req.userId
            })
            .sort({
                createdAt: -1
            });
        res.json(tracks);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// Create new track
router.post('/tracks', auth, async (req, res) => {
    try {
        const track = new Track({
            ...req.body,
            creator: req.userId
        });
        await track.save();
        await track.populate('creator', 'username');
        res.status(201).json(track);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// Like/unlike track
router.post('/tracks/:id/like', auth, async (req, res) => {
    try {
        const track = await Track.findById(req.params.id);
        const isLiked = track.likes.includes(req.userId);

        if (isLiked) {
            track.likes.pull(req.userId);
        } else {
            track.likes.push(req.userId);
        }

        await track.save();
        res.json({
            liked: !isLiked,
            likesCount: track.likes.length
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;