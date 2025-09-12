import React, {
    useState,
    useEffect
} from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Box,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Chip,
    Avatar,
    Stack,
    Paper,
    Fab,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    Add,
    PlayArrow,
    Favorite,
    Share,
    Delete,
    MusicNote,
    LibraryMusic,
    QueueMusic,
    CloudUpload,
    MoreVert,
    Download,
    Pause,
    AutoAwesome
} from '@mui/icons-material';
import {
    useAuth
} from '../contexts/AuthContext';
import MusicPlayer from '../components/MusicPlayer';
import SpotifyIntegration from '../components/SpotifyIntegration';
import axios from 'axios';

export default function PlaylistManager() {
    const [tracks, setTracks] = useState([{
            _id: 'demo-1',
            title: 'AI Symphony No. 1',
            description: 'A beautiful orchestral piece generated with AI - classical music with strings and piano',
            duration: 15,
            genre: 'Classical',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            liked: true,
            audioUrl: null
        },
        {
            _id: 'demo-2',
            title: 'Electronic Dreams',
            description: 'Upbeat electronic dance music with synthesizers and heavy bass drops',
            duration: 12,
            genre: 'Electronic',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            liked: false,
            audioUrl: null
        },
        {
            _id: 'demo-3',
            title: 'Chill Vibes',
            description: 'Relaxing ambient music for focus and meditation with soft pads',
            duration: 20,
            genre: 'Ambient',
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            liked: true,
            audioUrl: null
        },
        {
            _id: 'demo-4',
            title: 'Jazz Fusion Experiment',
            description: 'Modern jazz fusion with electric guitar and saxophone solos',
            duration: 18,
            genre: 'Jazz',
            createdAt: new Date(Date.now() - 345600000).toISOString(),
            liked: false,
            audioUrl: null
        },
        {
            _id: 'demo-5',
            title: 'Lo-Fi Study Session',
            description: 'Chill lo-fi hip hop beats perfect for studying and working',
            duration: 25,
            genre: 'Lo-Fi',
            createdAt: new Date(Date.now() - 432000000).toISOString(),
            liked: true,
            audioUrl: null
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [spotifyDialogOpen, setSpotifyDialogOpen] = useState(false);
    const [newTrackTitle, setNewTrackTitle] = useState('');
    const [newTrackDescription, setNewTrackDescription] = useState('');
    const [currentTrack, setCurrentTrack] = useState(null);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedTrack, setSelectedTrack] = useState(null);

    const {
        user,
        isAuthenticated
    } = useAuth();

    const handleLike = async (track) => {
        // Update local state for demo
        setTracks(tracks.map(t =>
            t._id === track._id ?
            {
                ...t,
                liked: !t.liked
            } :
            t
        ));
    };

    const handleDelete = async (trackId) => {
        if (window.confirm('Are you sure you want to delete this track?')) {
            setTracks(tracks.filter(t => t._id !== trackId));
            if (currentTrack && currentTrack._id === trackId) {
                setCurrentTrack(null);
            }
        }
    };

    const handlePlay = (track) => {
        setCurrentTrack(track);
    };

    const handleTrackChange = (newTrack) => {
        setCurrentTrack(newTrack);
    };

    const handleDownload = (track) => {
        alert('Demo mode: Download functionality would save the audio file');
    };

    const handleShare = (track) => {
        if (navigator.share) {
            navigator.share({
                title: track.title,
                text: track.description,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleMenuOpen = (event, track) => {
        setMenuAnchor(event.currentTarget);
        setSelectedTrack(track);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setSelectedTrack(null);
    };

    return ( <
        Box sx = {
            {
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
                pb: currentTrack ? 12 : 4
            }
        } >
        <
        Container maxWidth = "lg"
        sx = {
            {
                py: 4
            }
        } > {
            /* Header */ } <
        Box sx = {
            {
                mb: 6
            }
        } >
        <
        Stack direction = "row"
        alignItems = "center"
        justifyContent = "space-between"
        mb = {
            2
        } >
        <
        Box >
        <
        Typography variant = "h3"
        sx = {
            {
                fontWeight: 800,
                background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }
        } >
        My Library <
        /Typography> <
        Typography variant = "h6"
        color = "text.secondary" > {
            tracks.length
        }
        tracks in your collection <
        /Typography> <
        /Box>

        <
        Stack direction = "row"
        spacing = {
            2
        } >
        <
        Button variant = "outlined"
        startIcon = {
            < CloudUpload / >
        }
        onClick = {
            () => setCreateDialogOpen(true)
        }
        sx = {
            {
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                '&:hover': {
                    borderColor: '#4ecdc4',
                    backgroundColor: 'rgba(78, 205, 196, 0.1)',
                },
            }
        } >
        Upload Track <
        /Button> <
        /Stack> <
        /Stack>

        {
            /* Stats */ } <
        Grid container spacing = {
            3
        }
        sx = {
            {
                mb: 4
            }
        } >
        <
        Grid item xs = {
            12
        }
        sm = {
            4
        } >
        <
        Paper sx = {
            {
                p: 3,
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
            }
        } >
        <
        Typography variant = "h4"
        sx = {
            {
                fontWeight: 800,
                background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }
        } > {
            tracks.length
        } <
        /Typography> <
        Typography variant = "body2"
        color = "text.secondary" >
        Total Tracks <
        /Typography> <
        /Paper> <
        /Grid> <
        Grid item xs = {
            12
        }
        sm = {
            4
        } >
        <
        Paper sx = {
            {
                p: 3,
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
            }
        } >
        <
        Typography variant = "h4"
        sx = {
            {
                fontWeight: 800,
                background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }
        } > {
            Math.round(tracks.reduce((acc, track) => acc + (track.duration || 10), 0) / 60)
        } <
        /Typography> <
        Typography variant = "body2"
        color = "text.secondary" >
        Minutes <
        /Typography> <
        /Paper> <
        /Grid> <
        Grid item xs = {
            12
        }
        sm = {
            4
        } >
        <
        Paper sx = {
            {
                p: 3,
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
            }
        } >
        <
        Typography variant = "h4"
        sx = {
            {
                fontWeight: 800,
                background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }
        } > {
            tracks.filter(t => t.liked).length
        } <
        /Typography> <
        Typography variant = "body2"
        color = "text.secondary" >
        Favorites <
        /Typography> <
        /Paper> <
        /Grid> <
        /Grid> <
        /Box>

        {
            /* Tracks Grid */ } <
        Grid container spacing = {
            3
        } > {
            tracks.map((track) => ( <
                Grid item xs = {
                    12
                }
                sm = {
                    6
                }
                lg = {
                    4
                }
                key = {
                    track._id
                } >
                <
                Card sx = {
                    {
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
                    }
                } >
                <
                CardContent sx = {
                    {
                        p: 3
                    }
                } >
                <
                Stack direction = "row"
                alignItems = "flex-start"
                spacing = {
                    2
                }
                mb = {
                    2
                } >
                <
                Avatar sx = {
                    {
                        background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                        boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)',
                    }
                } >
                <
                MusicNote / >
                <
                /Avatar>

                <
                Box sx = {
                    {
                        flex: 1,
                        minWidth: 0
                    }
                } >
                <
                Typography variant = "h6"
                noWrap sx = {
                    {
                        fontWeight: 600
                    }
                } > {
                    track.title
                } <
                /Typography> <
                Typography variant = "body2"
                color = "text.secondary"
                sx = {
                    {
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }
                } > {
                    track.description
                } <
                /Typography> <
                /Box>

                <
                IconButton size = "small"
                onClick = {
                    (e) => handleMenuOpen(e, track)
                }
                sx = {
                    {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                } >
                <
                MoreVert / >
                <
                /IconButton> <
                /Stack>

                <
                Stack direction = "row"
                spacing = {
                    1
                }
                mb = {
                    2
                } > {
                    track.genre && ( <
                        Chip label = {
                            track.genre
                        }
                        size = "small"
                        sx = {
                            {
                                background: 'rgba(255, 107, 107, 0.2)',
                                color: '#ff6b6b',
                                border: '1px solid rgba(255, 107, 107, 0.3)'
                            }
                        }
                        />
                    )
                } <
                Chip label = {
                    `${track.duration || 10}s`
                }
                size = "small"
                sx = {
                    {
                        background: 'rgba(78, 205, 196, 0.2)',
                        color: '#4ecdc4',
                        border: '1px solid rgba(78, 205, 196, 0.3)'
                    }
                }
                /> <
                /Stack>

                <
                Typography variant = "caption"
                color = "text.secondary"
                display = "block" >
                Created: {
                    new Date(track.createdAt).toLocaleDateString()
                } <
                /Typography> <
                /CardContent>

                <
                CardActions sx = {
                    {
                        p: 3,
                        pt: 0
                    }
                } >
                <
                IconButton onClick = {
                    () => handlePlay(track)
                }
                sx = {
                    {
                        background: currentTrack && currentTrack._id === track._id ?
                            'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)' :
                            'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                            transform: 'scale(1.05)',
                        },
                    }
                } >
                {
                    currentTrack && currentTrack._id === track._id ? < Pause / > : < PlayArrow / >
                } <
                /IconButton>

                <
                IconButton onClick = {
                    () => handleLike(track)
                }
                sx = {
                    {
                        color: track.liked ? '#ff6b6b' : 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                            color: '#ff6b6b'
                        }
                    }
                } >
                <
                Favorite / >
                <
                /IconButton>

                <
                IconButton onClick = {
                    () => handleShare(track)
                }
                sx = {
                    {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                } >
                <
                Share / >
                <
                /IconButton> <
                /CardActions> <
                /Card> <
                /Grid>
            ))
        } <
        /Grid>

        {
            /* Floating Spotify Button */ } <
        Fab sx = {
            {
                position: 'fixed',
                bottom: currentTrack ? 120 : 24,
                right: 24,
                background: 'linear-gradient(45deg, #1db954 30%, #1ed760 90%)',
                boxShadow: '0 8px 32px rgba(29, 185, 84, 0.3)',
                '&:hover': {
                    boxShadow: '0 12px 40px rgba(29, 185, 84, 0.4)',
                }
            }
        }
        onClick = {
            () => setSpotifyDialogOpen(true)
        } >
        <
        Box sx = {
            {
                width: 24,
                height: 24,
                background: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        } >
        <
        Typography sx = {
            {
                color: '#1db954',
                fontWeight: 'bold',
                fontSize: 12
            }
        } > ♪
        <
        /Typography> <
        /Box> <
        /Fab> <
        /Container>

        {
            /* Music Player */ } <
        MusicPlayer currentTrack = {
            currentTrack
        }
        playlist = {
            tracks
        }
        onTrackChange = {
            handleTrackChange
        }
        onLike = {
            handleLike
        }
        onDownload = {
            handleDownload
        }
        onShare = {
            handleShare
        }
        isVisible = {
            !!currentTrack
        }
        />

        {
            /* Context Menu */ } <
        Menu anchorEl = {
            menuAnchor
        }
        open = {
            Boolean(menuAnchor)
        }
        onClose = {
            handleMenuClose
        }
        PaperProps = {
            {
                sx: {
                    background: 'rgba(0, 0, 0, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }
            }
        } >
        <
        MenuItem onClick = {
            () => {
                handlePlay(selectedTrack);
                handleMenuClose();
            }
        } >
        <
        ListItemIcon > < PlayArrow sx = {
            {
                color: 'white'
            }
        }
        /></ListItemIcon >
        <
        ListItemText > Play < /ListItemText> <
        /MenuItem> <
        MenuItem onClick = {
            () => {
                handleDownload(selectedTrack);
                handleMenuClose();
            }
        } >
        <
        ListItemIcon > < Download sx = {
            {
                color: 'white'
            }
        }
        /></ListItemIcon >
        <
        ListItemText > Download < /ListItemText> <
        /MenuItem> <
        MenuItem onClick = {
            () => {
                handleShare(selectedTrack);
                handleMenuClose();
            }
        } >
        <
        ListItemIcon > < Share sx = {
            {
                color: 'white'
            }
        }
        /></ListItemIcon >
        <
        ListItemText > Share < /ListItemText> <
        /MenuItem> <
        MenuItem onClick = {
            () => {
                handleDelete(selectedTrack._id);
                handleMenuClose();
            }
        } >
        <
        ListItemIcon > < Delete sx = {
            {
                color: '#ff6b6b'
            }
        }
        /></ListItemIcon >
        <
        ListItemText sx = {
            {
                color: '#ff6b6b'
            }
        } > Delete < /ListItemText> <
        /MenuItem> <
        /Menu>

        {
            /* Upload Dialog */ } <
        Dialog open = {
            createDialogOpen
        }
        onClose = {
            () => setCreateDialogOpen(false)
        }
        maxWidth = "sm"
        fullWidth >
        <
        DialogTitle > Upload New Track < /DialogTitle> <
        DialogContent >
        <
        TextField fullWidth label = "Track Title"
        value = {
            newTrackTitle
        }
        onChange = {
            (e) => setNewTrackTitle(e.target.value)
        }
        margin = "normal" /
        >
        <
        TextField fullWidth multiline rows = {
            3
        }
        label = "Description"
        value = {
            newTrackDescription
        }
        onChange = {
            (e) => setNewTrackDescription(e.target.value)
        }
        margin = "normal" /
        >
        <
        /DialogContent> <
        DialogActions >
        <
        Button onClick = {
            () => setCreateDialogOpen(false)
        } > Cancel < /Button> <
        Button variant = "contained" > Upload < /Button> <
        /DialogActions> <
        /Dialog>

        {
            /* Spotify Integration */ } {
            spotifyDialogOpen && ( <
                SpotifyIntegration generatedTrack = {
                    currentTrack
                }
                onClose = {
                    () => setSpotifyDialogOpen(false)
                }
                />
            )
        } <
        /Box>
    );
}