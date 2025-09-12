import React, {
    useState,
    useEffect
} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListItemSecondaryAction,
    Avatar,
    IconButton,
    Typography,
    Paper,
    Stack,
    Box,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Search,
    Add,
    MusicNote,
    LibraryMusic,
    PlaylistAdd
} from '@mui/icons-material';
import spotifyService from '../services/spotifyService';

const SpotifyIntegration = ({
    open,
    onClose,
    generatedTrack
}) => {
    const [userProfile, setUserProfile] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

    useEffect(() => {
        if (open && spotifyService.isAuthenticated()) {
            loadUserData();
        }
    }, [open]);

    const loadUserData = async () => {
        setLoading(true);
        try {
            const [profile, userPlaylists] = await Promise.all([
                spotifyService.getUserProfile(),
                spotifyService.getUserPlaylists()
            ]);

            setUserProfile(profile);
            setPlaylists(userPlaylists.items || []);

            // Get recommendations if we have a generated track
            if (generatedTrack) {
                await getRecommendations();
            }
        } catch (error) {
            setError('Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    const getRecommendations = async () => {
        try {
            // Extract genre and mood from generated track for recommendations
            const genre = generatedTrack.genre || 'pop';
            const mood = generatedTrack.mood || 'happy';

            const recs = await spotifyService.getRecommendations({
                seed_genres: [genre],
                target_valence: mood === 'happy' ? 0.8 : 0.3,
                limit: 10
            });

            setRecommendations(recs.tracks || []);
        } catch (error) {
            console.error('Failed to get recommendations:', error);
        }
    };

    const searchTracks = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        try {
            const results = await spotifyService.searchTracks(searchQuery);
            setSearchResults(results.tracks && results.tracks.items || []);
        } catch (error) {
            setError('Failed to search tracks');
        } finally {
            setLoading(false);
        }
    };

    const addToPlaylist = async (playlistId, trackUri) => {
        try {
            await spotifyService.addToPlaylist(playlistId, [trackUri]);
            setError('');
            // Show success message or update UI
        } catch (error) {
            setError('Failed to add track to playlist');
        }
    };

    const createPlaylist = async () => {
        if (!newPlaylistName.trim()) return;

        try {
            const playlist = await spotifyService.createPlaylist(
                userProfile.id,
                newPlaylistName,
                newPlaylistDescription
            );

            setPlaylists(prev => [playlist, ...prev]);
            setCreatePlaylistOpen(false);
            setNewPlaylistName('');
            setNewPlaylistDescription('');
        } catch (error) {
            setError('Failed to create playlist');
        }
    };

    const handleSpotifyLogin = () => {
        spotifyService.login();
    };

    const handleSpotifyLogout = () => {
        spotifyService.logout();
        setUserProfile(null);
        setPlaylists([]);
        setSearchResults([]);
        setRecommendations([]);
    };

    if (!spotifyService.isAuthenticated()) {
        return ( <
            Dialog open = {
                open
            }
            onClose = {
                onClose
            }
            maxWidth = "sm"
            fullWidth >
            <
            DialogTitle > Connect to Spotify < /DialogTitle> <
            DialogContent >
            <
            Stack spacing = {
                3
            }
            alignItems = "center"
            sx = {
                {
                    py: 4
                }
            } >
            <
            Avatar sx = {
                {
                    width: 80,
                    height: 80,
                    background: 'linear-gradient(45deg, #1db954 30%, #1ed760 90%)'
                }
            } >
            <
            MusicNote sx = {
                {
                    fontSize: 40
                }
            }
            /> <
            /Avatar> <
            Typography variant = "h6"
            align = "center" >
            Connect your Spotify account to sync your music <
            /Typography> <
            Typography variant = "body2"
            color = "text.secondary"
            align = "center" >
            Search tracks, create playlists, and get personalized recommendations <
            /Typography> <
            Button variant = "contained"
            size = "large"
            onClick = {
                handleSpotifyLogin
            }
            sx = {
                {
                    background: 'linear-gradient(45deg, #1db954 30%, #1ed760 90%)',
                    px: 4,
                    py: 1.5
                }
            } >
            Connect Spotify <
            /Button> <
            /Stack> <
            /DialogContent> <
            DialogActions >
            <
            Button onClick = {
                onClose
            } > Close < /Button> <
            /DialogActions> <
            /Dialog>
        );
    }

    return ( <
        Dialog open = {
            open
        }
        onClose = {
            onClose
        }
        maxWidth = "md"
        fullWidth >
        <
        DialogTitle >
        <
        Stack direction = "row"
        alignItems = "center"
        justifyContent = "space-between" >
        <
        Stack direction = "row"
        alignItems = "center"
        spacing = {
            2
        } >
        <
        Avatar src = {
            userProfile && userProfile.images && userProfile.images[0] && userProfile.images[0].url
        }
        sx = {
            {
                background: 'linear-gradient(45deg, #1db954 30%, #1ed760 90%)'
            }
        } >
        {
            userProfile && userProfile.display_name && userProfile.display_name[0] || < MusicNote / >
        } <
        /Avatar> <
        Box >
        <
        Typography variant = "h6" > Spotify Integration < /Typography> <
        Typography variant = "caption"
        color = "text.secondary" >
        Connected as {
            userProfile && userProfile.display_name
        } <
        /Typography> <
        /Box> <
        /Stack> <
        Button onClick = {
            handleSpotifyLogout
        }
        size = "small" >
        Disconnect <
        /Button> <
        /Stack> <
        /DialogTitle>

        <
        DialogContent > {
            error && ( <
                Alert severity = "error"
                sx = {
                    {
                        mb: 2
                    }
                } > {
                    error
                } <
                /Alert>
            )
        }

        {
            loading && ( <
                Box sx = {
                    {
                        display: 'flex',
                        justifyContent: 'center',
                        py: 4
                    }
                } >
                <
                CircularProgress / >
                <
                /Box>
            )
        }

        {
            /* Search Section */ } <
        Paper sx = {
            {
                p: 3,
                mb: 3,
                background: 'rgba(255, 255, 255, 0.05)'
            }
        } >
        <
        Typography variant = "h6"
        gutterBottom >
        Search Spotify <
        /Typography> <
        Stack direction = "row"
        spacing = {
            2
        } >
        <
        TextField fullWidth placeholder = "Search for songs, artists, or albums..."
        value = {
            searchQuery
        }
        onChange = {
            (e) => setSearchQuery(e.target.value)
        }
        onKeyPress = {
            (e) => e.key === 'Enter' && searchTracks()
        }
        /> <
        Button variant = "contained"
        onClick = {
            searchTracks
        }
        startIcon = {
            < Search / >
        } >
        Search <
        /Button> <
        /Stack>

        {
            searchResults.length > 0 && ( <
                List sx = {
                    {
                        mt: 2
                    }
                } > {
                    searchResults.slice(0, 5).map((track) => ( <
                        ListItem key = {
                            track.id
                        } >
                        <
                        ListItemAvatar >
                        <
                        Avatar src = {
                            track.album.images && track.album.images[0] && track.album.images[0].url
                        } >
                        <
                        MusicNote / >
                        <
                        /Avatar> <
                        /ListItemAvatar> <
                        ListItemText primary = {
                            track.name
                        }
                        secondary = {
                            track.artists.map(a => a.name).join(', ')
                        }
                        /> <
                        ListItemSecondaryAction >
                        <
                        IconButton onClick = {
                            () => addToPlaylist('liked', track.uri)
                        } >
                        <
                        Add / >
                        <
                        /IconButton> <
                        /ListItemSecondaryAction> <
                        /ListItem>
                    ))
                } <
                /List>
            )
        } <
        /Paper>

        {
            /* Recommendations */ } {
            recommendations.length > 0 && ( <
                Paper sx = {
                    {
                        p: 3,
                        mb: 3,
                        background: 'rgba(255, 255, 255, 0.05)'
                    }
                } >
                <
                Typography variant = "h6"
                gutterBottom >
                Recommended
                for You <
                /Typography> <
                Typography variant = "body2"
                color = "text.secondary"
                paragraph >
                Based on your generated track: "{generatedTrack && generatedTrack.prompt}" <
                /Typography>

                <
                List > {
                    recommendations.slice(0, 5).map((track) => ( <
                        ListItem key = {
                            track.id
                        } >
                        <
                        ListItemAvatar >
                        <
                        Avatar src = {
                            track.album.images && track.album.images[0] && track.album.images[0].url
                        } >
                        <
                        MusicNote / >
                        <
                        /Avatar> <
                        /ListItemAvatar> <
                        ListItemText primary = {
                            track.name
                        }
                        secondary = {
                            track.artists.map(a => a.name).join(', ')
                        }
                        /> <
                        ListItemSecondaryAction >
                        <
                        IconButton onClick = {
                            () => addToPlaylist('liked', track.uri)
                        } >
                        <
                        Add / >
                        <
                        /IconButton> <
                        /ListItemSecondaryAction> <
                        /ListItem>
                    ))
                } <
                /List> <
                /Paper>
            )
        }

        {
            /* Playlists */ } <
        Paper sx = {
            {
                p: 3,
                background: 'rgba(255, 255, 255, 0.05)'
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
        Typography variant = "h6" > Your Playlists < /Typography> <
        Button startIcon = {
            < PlaylistAdd / >
        }
        onClick = {
            () => setCreatePlaylistOpen(true)
        } >
        Create Playlist <
        /Button> <
        /Stack>

        <
        List > {
            playlists.slice(0, 10).map((playlist) => ( <
                ListItem key = {
                    playlist.id
                } >
                <
                ListItemAvatar >
                <
                Avatar src = {
                    playlist.images && playlist.images[0] && playlist.images[0].url
                } >
                <
                LibraryMusic / >
                <
                /Avatar> <
                /ListItemAvatar> <
                ListItemText primary = {
                    playlist.name
                }
                secondary = {
                    `${playlist.tracks.total} tracks`
                }
                /> <
                /ListItem>
            ))
        } <
        /List> <
        /Paper> <
        /DialogContent>

        <
        DialogActions >
        <
        Button onClick = {
            onClose
        } > Close < /Button> <
        /DialogActions>

        {
            /* Create Playlist Dialog */ } <
        Dialog open = {
            createPlaylistOpen
        }
        onClose = {
            () => setCreatePlaylistOpen(false)
        } >
        <
        DialogTitle > Create New Playlist < /DialogTitle> <
        DialogContent >
        <
        TextField fullWidth label = "Playlist Name"
        value = {
            newPlaylistName
        }
        onChange = {
            (e) => setNewPlaylistName(e.target.value)
        }
        margin = "normal" /
        >
        <
        TextField fullWidth label = "Description (Optional)"
        value = {
            newPlaylistDescription
        }
        onChange = {
            (e) => setNewPlaylistDescription(e.target.value)
        }
        margin = "normal"
        multiline rows = {
            3
        }
        /> <
        /DialogContent> <
        DialogActions >
        <
        Button onClick = {
            () => setCreatePlaylistOpen(false)
        } > Cancel < /Button> <
        Button onClick = {
            createPlaylist
        }
        variant = "contained" >
        Create <
        /Button> <
        /DialogActions> <
        /Dialog> <
        /Dialog>
    );
};

export default SpotifyIntegration;