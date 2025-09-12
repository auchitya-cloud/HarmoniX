import React, {
    useEffect
} from 'react';
import {
    Box,
    CircularProgress,
    Typography
} from '@mui/material';
import {
    useNavigate
} from 'react-router-dom';
import spotifyService from '../services/spotifyService';

const SpotifyCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const error = urlParams.get('error');

            if (error) {
                console.error('Spotify authorization error:', error);
                navigate('/playlists');
                return;
            }

            if (code) {
                try {
                    await spotifyService.getAccessToken(code);
                    navigate('/playlists');
                } catch (error) {
                    console.error('Failed to get Spotify access token:', error);
                    navigate('/playlists');
                }
            } else {
                navigate('/playlists');
            }
        };

        handleCallback();
    }, [navigate]);

    return ( <
        Box sx = {
            {
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
            }
        } >
        <
        CircularProgress size = {
            60
        }
        sx = {
            {
                color: '#1db954',
                mb: 3
            }
        }
        /> <
        Typography variant = "h6"
        color = "white" >
        Connecting to Spotify...
        <
        /Typography> <
        /Box>
    );
};

export default SpotifyCallback;