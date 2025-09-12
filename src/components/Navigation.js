import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box
} from '@mui/material';
import {
    Link,
    useLocation
} from 'react-router-dom';
import {
    MusicNote,
    Tune,
    School,
    QueueMusic
} from '@mui/icons-material';

const Navigation = () => {
    const location = useLocation();

    const navItems = [{
            path: '/',
            label: 'Home',
            icon: < MusicNote / >
        },
        {
            path: '/generate',
            label: 'Generate',
            icon: < Tune / >
        },
        {
            path: '/learn',
            label: 'Learn',
            icon: < School / >
        },
        {
            path: '/playlists',
            label: 'Library',
            icon: < QueueMusic / >
        },
    ];

    return ( <
        AppBar position = "static"
        sx = {
            {
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                border: 'none',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }
        } >
        <
        Toolbar sx = {
            {
                py: 1
            }
        } >
        <
        Typography variant = "h5"
        component = "div"
        sx = {
            {
                flexGrow: 1,
                fontWeight: 800,
                background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }
        } >
        <
        MusicNote sx = {
            {
                color: '#ff6b6b'
            }
        }
        />
        HarmoniX <
        /Typography> <
        Box sx = {
            {
                display: 'flex',
                gap: 1
            }
        } > {
            navItems.map((item) => ( <
                Button key = {
                    item.path
                }
                component = {
                    Link
                }
                to = {
                    item.path
                }
                startIcon = {
                    item.icon
                }
                sx = {
                    {
                        color: 'white',
                        borderRadius: '12px',
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 500,
                        transition: 'all 0.3s ease',
                        ...(location.pathname === item.path ? {
                            background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                            boxShadow: '0 4px 20px rgba(255, 107, 107, 0.3)',
                            transform: 'translateY(-1px)',
                        } : {
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.1)',
                                transform: 'translateY(-1px)',
                            }
                        })
                    }
                } > {
                    item.label
                } <
                /Button>
            ))
        } <
        /Box> < /
        Toolbar > <
        /AppBar>
    );
};

export default Navigation;