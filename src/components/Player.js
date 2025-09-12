import React, {
    useState
} from 'react';
import {
    Box,
    Paper,
    IconButton,
    Typography,
    Slider,
    Stack
} from '@mui/material';
import {
    PlayArrow,
    Pause,
    SkipPrevious,
    SkipNext,
    VolumeUp
} from '@mui/icons-material';

export default function Player() {
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const [progress, setProgress] = useState(0);
    const [currentTrack, setCurrentTrack] = useState(null);

    const togglePlayback = () => {
        setPlaying(!playing);
    };

    // Only show player if there's a current track
    if (!currentTrack) {
        return null;
    }

    return ( <
        Paper elevation = {
            8
        }
        sx = {
            {
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                p: 2,
                backgroundColor: 'background.paper',
                borderTop: 1,
                borderColor: 'divider'
            }
        } >
        <
        Stack direction = "row"
        alignItems = "center"
        spacing = {
            2
        } > {
            /* Track Info */ } <
        Box sx = {
            {
                minWidth: 200
            }
        } >
        <
        Typography variant = "subtitle2"
        noWrap > {
            currentTrack ? currentTrack.title : 'No track selected'
        } <
        /Typography> <
        Typography variant = "caption"
        color = "text.secondary"
        noWrap > {
            currentTrack ? currentTrack.artist : 'Unknown artist'
        } <
        /Typography> <
        /Box>

        {
            /* Controls */ } <
        Stack direction = "row"
        alignItems = "center"
        spacing = {
            1
        } >
        <
        IconButton >
        <
        SkipPrevious / >
        <
        /IconButton> <
        IconButton onClick = {
            togglePlayback
        }
        color = "primary"
        size = "large" > {
            playing ? < Pause / > : < PlayArrow / >
        } <
        /IconButton> <
        IconButton >
        <
        SkipNext / >
        <
        /IconButton> <
        /Stack>

        {
            /* Progress */ } <
        Box sx = {
            {
                flex: 1,
                mx: 2
            }
        } >
        <
        Slider value = {
            progress
        }
        onChange = {
            (e, value) => setProgress(value)
        }
        size = "small"
        sx = {
            {
                color: 'primary.main'
            }
        }
        /> <
        /Box>

        {
            /* Volume */ } <
        Stack direction = "row"
        alignItems = "center"
        spacing = {
            1
        }
        sx = {
            {
                minWidth: 120
            }
        } >
        <
        VolumeUp fontSize = "small" / >
        <
        Slider value = {
            volume
        }
        onChange = {
            (e, value) => setVolume(value)
        }
        size = "small"
        sx = {
            {
                width: 80
            }
        }
        /> <
        /Stack> <
        /Stack> <
        /Paper>
    );
}