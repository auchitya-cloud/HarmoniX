import React from 'react';
import {
    Routes,
    Route
} from 'react-router-dom';
import {
    Container,
    Box,
    ThemeProvider,
    createTheme,
    CssBaseline
} from '@mui/material';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import MusicGenerator from './pages/MusicGenerator';
import LearningTools from './pages/LearningTools';
import PlaylistManager from './pages/PlaylistManager';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SpotifyCallback from './pages/SpotifyCallback';
import Player from './components/Player';
import {
    AuthProvider
} from './contexts/AuthContext';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ff6b6b',
            light: '#ff8a80',
            dark: '#d32f2f',
        },
        secondary: {
            main: '#4ecdc4',
            light: '#80cbc4',
            dark: '#00695c',
        },
        background: {
            default: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
            paper: 'rgba(255, 255, 255, 0.05)',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
                    backgroundAttachment: 'fixed',
                    minHeight: '100vh',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '12px 24px',
                },
                contained: {
                    background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                    boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #ff8a80 30%, #80cbc4 90%)',
                        boxShadow: '0 12px 40px rgba(255, 107, 107, 0.4)',
                        transform: 'translateY(-2px)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '20px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    },
                },
            },
        },
    },
});

function App() {
    return ( <
        ThemeProvider theme = {
            theme
        } >
        <
        CssBaseline / >
        <
        AuthProvider >
        <
        Box sx = {
            {
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh'
            }
        } >
        <
        Navigation / >
        <
        Container maxWidth = "lg"
        sx = {
            {
                flex: 1,
                py: 3
            }
        } >
        <
        Routes >
        <
        Route path = "/"
        element = {
            <
            Home / >
        }
        /> <
        Route path = "/generate"
        element = {
            <
            MusicGenerator / >
        }
        /> <
        Route path = "/learn"
        element = {
            <
            LearningTools / >
        }
        /> <
        Route path = "/playlists"
        element = {
            <
            PlaylistManager / >
        }
        /> <
        Route path = "/login"
        element = {
            <
            Login / >
        }
        /> <
        Route path = "/signup"
        element = {
            <
            Signup / >
        }
        /> <
        Route path = "/callback"
        element = {
            <
            SpotifyCallback / >
        }
        /> < /
        Routes > <
        /Container> <
        Player / >
        <
        /Box> < /
        AuthProvider > <
        /ThemeProvider>
    );
}

export default App;