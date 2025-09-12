import React, {
    useState,
    useRef,
    useEffect
} from 'react';
import {
    Box,
    Paper,
    IconButton,
    Typography,
    Slider,
    Stack,
    Avatar,
    LinearProgress,
    Tooltip,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    PlayArrow,
    Pause,
    SkipPrevious,
    SkipNext,
    VolumeUp,
    VolumeDown,
    VolumeMute,
    Repeat,
    Shuffle,
    QueueMusic,
    Favorite,
    FavoriteBorder,
    MoreVert,
    Download,
    Share
} from '@mui/icons-material';

const MusicPlayer = ({
    currentTrack,
    playlist = [],
    onTrackChange,
    onLike,
    onDownload,
    onShare,
    isVisible = true
}) => {
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(70);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [repeat, setRepeat] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [muted, setMuted] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);

    const audioRef = useRef(null);

    useEffect(() => {
        if (currentTrack && currentTrack.audioUrl) {
            if (audioRef.current) {
                audioRef.current.src = currentTrack.audioUrl;
                audioRef.current.load();
            }
        }
    }, [currentTrack]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => {
            setCurrentTime(audio.currentTime);
            setProgress((audio.currentTime / audio.duration) * 100);
        };

        const updateDuration = () => {
            setDuration(audio.duration);
        };

        const handleEnded = () => {
            if (repeat) {
                audio.currentTime = 0;
                audio.play();
            } else {
                handleNext();
            }
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [repeat]);

    const togglePlayback = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (playing) {
            audio.pause();
        } else {
            audio.play();
        }
        setPlaying(!playing);
    };

    const handleVolumeChange = (_, value) => {
        setVolume(value);
        if (audioRef.current) {
            audioRef.current.volume = value / 100;
        }
    };

    const handleProgressChange = (_, value) => {
        const audio = audioRef.current;
        if (!audio) return;

        const newTime = (value / 100) * duration;
        audio.currentTime = newTime;
        setCurrentTime(newTime);
        setProgress(value);
    };

    const handleNext = () => {
        if (playlist.length === 0) return;

        const currentIndex = playlist.findIndex(track => track._id === currentTrack._id);
        let nextIndex;

        if (shuffle) {
            nextIndex = Math.floor(Math.random() * playlist.length);
        } else {
            nextIndex = (currentIndex + 1) % playlist.length;
        }

        onTrackChange(playlist[nextIndex]);
    };

    const handlePrevious = () => {
        if (playlist.length === 0) return;

        const currentIndex = playlist.findIndex(track => track._id === currentTrack._id);
        let prevIndex;

        if (shuffle) {
            prevIndex = Math.floor(Math.random() * playlist.length);
        } else {
            prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
        }

        onTrackChange(playlist[prevIndex]);
    };

    const toggleMute = () => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.muted = !muted;
        setMuted(!muted);
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const getVolumeIcon = () => {
        if (muted || volume === 0) return <VolumeMute / > ;
        if (volume < 50) return <VolumeDown / > ;
        return <VolumeUp / > ;
    };

    if (!isVisible || !currentTrack) {
        return null;
    }

    return ( <
        >
        <
        audio ref = {
            audioRef
        }
        /> <
        Paper elevation = {
            0
        }
        sx = {
            {
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(20px)',
                border: 'none',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 0,
                zIndex: 1300,
            }
        } >
        {
            /* Progress Bar */ } <
        LinearProgress variant = "determinate"
        value = {
            progress
        }
        sx = {
            {
                height: 4,
                background: 'rgba(255, 255, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                },
            }
        }
        />

        <
        Box sx = {
            {
                p: 2
            }
        } >
        <
        Stack direction = "row"
        alignItems = "center"
        spacing = {
            2
        } > {
            /* Track Info */ } <
        Stack direction = "row"
        alignItems = "center"
        spacing = {
            2
        }
        sx = {
            {
                minWidth: 300,
                flex: 1
            }
        } >
        <
        Avatar sx = {
            {
                width: 56,
                height: 56,
                background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)',
            }
        } >
        <
        QueueMusic / >
        <
        /Avatar> <
        Box sx = {
            {
                minWidth: 0,
                flex: 1
            }
        } >
        <
        Typography variant = "subtitle1"
        noWrap sx = {
            {
                fontWeight: 600
            }
        } > {
            currentTrack.title || 'Generated Track'
        } <
        /Typography> <
        Typography variant = "caption"
        color = "text.secondary"
        noWrap > {
            currentTrack.description || 'AI Generated Music'
        } <
        /Typography> <
        Typography variant = "caption"
        color = "text.secondary"
        display = "block" > {
            formatTime(currentTime)
        }
        / {formatTime(duration)} <
        /Typography> <
        /Box> <
        /Stack>

        {
            /* Controls */ } <
        Stack direction = "row"
        alignItems = "center"
        spacing = {
            1
        } >
        <
        Tooltip title = {
            shuffle ? 'Shuffle On' : 'Shuffle Off'
        } >
        <
        IconButton onClick = {
            () => setShuffle(!shuffle)
        }
        sx = {
            {
                color: shuffle ? '#ff6b6b' : 'rgba(255, 255, 255, 0.7)'
            }
        } >
        <
        Shuffle / >
        <
        /IconButton> <
        /Tooltip>

        <
        IconButton onClick = {
            handlePrevious
        }
        sx = {
            {
                color: 'white'
            }
        } >
        <
        SkipPrevious / >
        <
        /IconButton>

        <
        IconButton onClick = {
            togglePlayback
        }
        sx = {
            {
                background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                color: 'white',
                width: 48,
                height: 48,
                boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)',
                '&:hover': {
                    boxShadow: '0 12px 40px rgba(255, 107, 107, 0.4)',
                    transform: 'scale(1.05)',
                },
            }
        } >
        {
            playing ? < Pause / > : < PlayArrow / >
        } <
        /IconButton>

        <
        IconButton onClick = {
            handleNext
        }
        sx = {
            {
                color: 'white'
            }
        } >
        <
        SkipNext / >
        <
        /IconButton>

        <
        Tooltip title = {
            repeat ? 'Repeat On' : 'Repeat Off'
        } >
        <
        IconButton onClick = {
            () => setRepeat(!repeat)
        }
        sx = {
            {
                color: repeat ? '#ff6b6b' : 'rgba(255, 255, 255, 0.7)'
            }
        } >
        <
        Repeat / >
        <
        /IconButton> <
        /Tooltip> <
        /Stack>

        {
            /* Progress Slider */ } <
        Box sx = {
            {
                minWidth: 200,
                flex: 1,
                mx: 2
            }
        } >
        <
        Slider value = {
            progress
        }
        onChange = {
            handleProgressChange
        }
        size = "small"
        sx = {
            {
                color: '#ff6b6b',
                '& .MuiSlider-thumb': {
                    background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                    boxShadow: '0 4px 20px rgba(255, 107, 107, 0.3)',
                },
                '& .MuiSlider-track': {
                    background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                },
            }
        }
        /> <
        /Box>

        {
            /* Volume & Actions */ } <
        Stack direction = "row"
        alignItems = "center"
        spacing = {
            1
        }
        sx = {
            {
                minWidth: 200
            }
        } >
        <
        IconButton onClick = {
            () => onLike && onLike(currentTrack)
        }
        sx = {
            {
                color: currentTrack.liked ? '#ff6b6b' : 'rgba(255, 255, 255, 0.7)'
            }
        } >
        {
            currentTrack.liked ? < Favorite / > : < FavoriteBorder / >
        } <
        /IconButton>

        <
        IconButton onClick = {
            toggleMute
        }
        sx = {
            {
                color: 'white'
            }
        } > {
            getVolumeIcon()
        } <
        /IconButton>

        <
        Slider value = {
            muted ? 0 : volume
        }
        onChange = {
            handleVolumeChange
        }
        size = "small"
        sx = {
            {
                width: 80,
                color: '#4ecdc4',
                '& .MuiSlider-thumb': {
                    background: '#4ecdc4',
                },
            }
        }
        />

        <
        IconButton onClick = {
            (e) => setMenuAnchor(e.currentTarget)
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
        /Stack> <
        /Stack> <
        /Box>

        {
            /* More Options Menu */ } <
        Menu anchorEl = {
            menuAnchor
        }
        open = {
            Boolean(menuAnchor)
        }
        onClose = {
            () => setMenuAnchor(null)
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
                onDownload && onDownload(currentTrack);
                setMenuAnchor(null);
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
                onShare && onShare(currentTrack);
                setMenuAnchor(null);
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
        /Menu> <
        /Paper> <
        />
    );
};

export default MusicPlayer;