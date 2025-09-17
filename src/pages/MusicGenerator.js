import React, {
    useState,
    useEffect
} from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    IconButton,
    LinearProgress,
    Avatar,
    Chip
} from '@mui/material';
import {
    PlayArrow,
    Pause,
    Download,
    Save,
    AutoAwesome,
    MusicNote
} from '@mui/icons-material';
import {
    useAuth
} from '../contexts/AuthContext';
import axios from 'axios';

export default function MusicGenerator() {
    const [prompt, setPrompt] = useState('');
    const [duration, setDuration] = useState(10);
    const [temperature, setTemperature] = useState(1.0);
    const [loraModel, setLoraModel] = useState('');
    const [availableModels, setAvailableModels] = useState([]);
    const [generating, setGenerating] = useState(false);
    const [generatedAudio, setGeneratedAudio] = useState(null);
    const [audioUrl, setAudioUrl] = useState('');
    const [playing, setPlaying] = useState(false);
    const [error, setError] = useState('');
    const [audio, setAudio] = useState(null);
    const [progress, setProgress] = useState(0);

    const {
        user,
        isAuthenticated
    } = useAuth();
    // Try multiple API endpoints in order of preference
    const API_ENDPOINTS = [
        process.env.REACT_APP_ML_API_URL, // Custom environment variable
        'https://harmonix-ml-api.railway.app', // Railway deployment
        'https://harmonix-ml-api.onrender.com', // Render deployment
        'http://localhost:8000' // Local development
    ].filter(Boolean);

    const [ML_API_URL, setML_API_URL] = useState(API_ENDPOINTS[0] || 'http://localhost:8000');
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

    useEffect(() => {
        loadAvailableModels();
    }, []);

    const loadAvailableModels = async () => {
        try {
            const response = await axios.get(`${ML_API_URL}/models`);
            setAvailableModels(response.data.available_models);
        } catch (error) {
            console.error('Failed to load models:', error);
        }
    };

    const generateMusic = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt');
            return;
        }

        setGenerating(true);
        setError('');
        setProgress(0);

        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) return prev;
                return prev + Math.random() * 10;
            });
        }, 5000);

        try {
            const response = await axios.post(`${ML_API_URL}/generate`, {
                prompt,
                duration,
                temperature,
                lora_model: loraModel || null
            }, {
                timeout: 300000 // 5 minutes timeout for music generation
            });

            const {
                audio_data,
                sample_rate
            } = response.data;

            // Convert base64 to blob
            const audioBlob = new Blob([
                Uint8Array.from(atob(audio_data), c => c.charCodeAt(0))
            ], {
                type: 'audio/wav'
            });

            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
            setGeneratedAudio(response.data);

            // Create audio element
            const audioElement = new Audio(url);
            setAudio(audioElement);
            setProgress(100);

        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                setError('Generation timed out. Please try with a shorter duration or simpler prompt.');
            } else {
                setError(error.response && error.response.data && error.response.data.detail || 'Failed to generate music');
            }
        } finally {
            clearInterval(progressInterval);
            setGenerating(false);
            setProgress(0);
        }
    };

    const togglePlayback = () => {
        if (!audio) return;

        if (playing) {
            audio.pause();
            setPlaying(false);
        } else {
            audio.play();
            setPlaying(true);

            audio.onended = () => setPlaying(false);
        }
    };

    const downloadAudio = () => {
        if (!audioUrl) return;

        const a = document.createElement('a');
        a.href = audioUrl;
        a.download = `generated-music-${Date.now()}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const saveTrack = async () => {
        if (!isAuthenticated || !generatedAudio) {
            setError('Please login to save tracks');
            return;
        }

        try {
            await axios.post(`${API_URL}/music/tracks`, {
                title: prompt.substring(0, 50) + '...',
                description: prompt,
                audioUrl: audioUrl,
                duration: duration,
                generationParams: {
                    prompt,
                    duration,
                    temperature,
                    loraWeights: loraModel
                }
            });

            alert('Track saved successfully!');
        } catch (error) {
            setError('Failed to save track');
        }
    };

    return ( <
            Box sx = {
                {
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
                    py: 4
                }
            } >
            <
            Container maxWidth = "md" >
            <
            Box sx = {
                {
                    textAlign: 'center',
                    mb: 6
                }
            } >
            <
            Avatar sx = {
                {
                    width: 80,
                    height: 80,
                    margin: '0 auto 24px',
                    background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                    boxShadow: '0 12px 40px rgba(255, 107, 107, 0.3)',
                }
            } >
            <
            AutoAwesome sx = {
                {
                    fontSize: 40
                }
            }
            /> < /
            Avatar >

            <
            Typography variant = "h3"
            gutterBottom sx = {
                {
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }
            } >
            AI Music Generator <
            /Typography> <
            Typography variant = "h6"
            color = "text.secondary" >
            Transform your ideas into beautiful music with AI <
            /Typography> < /
            Box >

            <
            Paper elevation = {
                0
            }
            sx = {
                {
                    p: 4,
                    mb: 4,
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '24px',
                }
            } >
            <
            TextField fullWidth multiline rows = {
                4
            }
            label = "Describe the music you want to generate"
            placeholder = "e.g., upbeat electronic dance music with synthesizers and drums, or peaceful acoustic guitar melody"
            value = {
                prompt
            }
            onChange = {
                (e) => setPrompt(e.target.value)
            }
            margin = "normal"
            sx = {
                {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#ff6b6b',
                        },
                    },
                }
            }
            />

            <
            Box sx = {
                {
                    mt: 4,
                    mb: 3
                }
            } >
            <
            Typography gutterBottom sx = {
                {
                    fontWeight: 600
                }
            } >
            Duration: {
                duration
            }
            seconds <
            /Typography> <
            Slider value = {
                duration
            }
            onChange = {
                (e, value) => setDuration(value)
            }
            min = {
                5
            }
            max = {
                30
            }
            step = {
                1
            }
            marks valueLabelDisplay = "auto"
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
            Typography variant = "caption"
            color = "text.secondary" >
            Note: Longer durations will take more time to generate(2 - 3 minutes per 10 seconds) <
            /Typography> < /
            Box >

            <
            Box sx = {
                {
                    mt: 4,
                    mb: 3
                }
            } >
            <
            Typography gutterBottom sx = {
                {
                    fontWeight: 600
                }
            } >
            Creativity: {
                temperature
            } <
            /Typography> <
            Slider value = {
                temperature
            }
            onChange = {
                (e, value) => setTemperature(value)
            }
            min = {
                0.1
            }
            max = {
                2.0
            }
            step = {
                0.1
            }
            marks valueLabelDisplay = "auto"
            sx = {
                {
                    color: '#4ecdc4',
                    '& .MuiSlider-thumb': {
                        background: 'linear-gradient(45deg, #4ecdc4 30%, #44a08d 90%)',
                        boxShadow: '0 4px 20px rgba(78, 205, 196, 0.3)',
                    },
                    '& .MuiSlider-track': {
                        background: 'linear-gradient(45deg, #4ecdc4 30%, #44a08d 90%)',
                    },
                }
            }
            /> <
            Typography variant = "caption"
            color = "text.secondary" >
            Higher values = more creative / random, Lower values = more predictable <
            /Typography> < /
            Box >

            <
            FormControl fullWidth sx = {
                {
                    mt: 3,
                    mb: 4
                }
            } >
            <
            InputLabel sx = {
                {
                    color: 'rgba(255, 255, 255, 0.7)'
                }
            } >
            LoRA Model(Optional) <
            /InputLabel> <
            Select value = {
                loraModel
            }
            onChange = {
                (e) => setLoraModel(e.target.value)
            }
            label = "LoRA Model (Optional)"
            sx = {
                {
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4ecdc4',
                    },
                }
            } >
            <
            MenuItem value = "" > None(Base Model) < /MenuItem> {
            availableModels.map((model) => ( <
                MenuItem key = {
                    model
                }
                value = {
                    model
                } > {
                    model
                } <
                /MenuItem>
            ))
        } <
        /Select> < /
    FormControl >

        {
            error && ( <
                Alert severity = "error"
                sx = {
                    {
                        mb: 3,
                        borderRadius: '16px',
                        background: 'rgba(244, 67, 54, 0.1)',
                        border: '1px solid rgba(244, 67, 54, 0.3)',
                    }
                } > {
                    error
                } <
                /Alert>
            )
        }

    {
        generating && ( <
            Box sx = {
                {
                    mb: 3
                }
            } >
            <
            Box sx = {
                {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }
            } >
            <
            CircularProgress size = {
                24
            }
            sx = {
                {
                    color: '#ff6b6b'
                }
            }
            /> <
            Box sx = {
                {
                    flex: 1
                }
            } >
            <
            Typography variant = "body1"
            sx = {
                {
                    fontWeight: 600
                }
            } >
            Generating your music...({
                Math.round(progress)
            } % ) <
            /Typography> <
            Typography variant = "caption"
            color = "text.secondary" >
            This typically takes 2 - 3 minutes.Please be patient
            while AI creates your masterpiece. <
            /Typography> < /
            Box > <
            /Box> <
            LinearProgress variant = "determinate"
            value = {
                progress
            }
            sx = {
                {
                    height: 8,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                        borderRadius: 4,
                    },
                }
            }
            /> < /
            Box >
        )
    }

    <
    Button variant = "contained"
    size = "large"
    onClick = {
        generateMusic
    }
    disabled = {
        generating
    }
    fullWidth sx = {
            {
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: '16px',
                background: generating ?
                    'rgba(255, 255, 255, 0.1)' : 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                boxShadow: generating ?
                    'none' : '0 8px 32px rgba(255, 107, 107, 0.3)',
                '&:hover': {
                    background: generating ?
                        'rgba(255, 255, 255, 0.1)' : 'linear-gradient(45deg, #ff8a80 30%, #80cbc4 90%)',
                    boxShadow: generating ?
                        'none' : '0 12px 40px rgba(255, 107, 107, 0.4)',
                    transform: generating ? 'none' : 'translateY(-2px)',
                },
            }
        } > {
            generating ? ( <
                >
                <
                CircularProgress size = {
                    20
                }
                sx = {
                    {
                        mr: 1,
                        color: 'white'
                    }
                }
                />
                Generating Music...({
                    Math.round(progress)
                } % ) <
                />
            ) : ( <
                >
                <
                AutoAwesome sx = {
                    {
                        mr: 1
                    }
                }
                />
                Generate Music <
                />
            )
        } <
        /Button> < /
    Paper >

        {
            generatedAudio && ( <
                Card sx = {
                    {
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '24px',
                        overflow: 'hidden',
                    }
                } >
                <
                CardContent sx = {
                    {
                        p: 4
                    }
                } >
                <
                Box sx = {
                    {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 3
                    }
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
                /Avatar> <
                Box sx = {
                    {
                        flex: 1
                    }
                } >
                <
                Typography variant = "h6"
                sx = {
                    {
                        fontWeight: 600
                    }
                } >
                Generated Music <
                /Typography> <
                Typography variant = "body2"
                color = "text.secondary" >
                "{generatedAudio.prompt}" <
                /Typography> < /
                Box > <
                /Box>

                {
                    generatedAudio.note && ( <
                        Chip label = {
                            generatedAudio.note
                        }
                        sx = {
                            {
                                mb: 3,
                                background: 'rgba(78, 205, 196, 0.2)',
                                color: '#4ecdc4',
                                border: '1px solid rgba(78, 205, 196, 0.3)'
                            }
                        }
                        />
                    )
                }

                <
                Box sx = {
                    {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }
                } >
                <
                IconButton onClick = {
                    togglePlayback
                }
                sx = {
                    {
                        background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                        color: 'white',
                        width: 56,
                        height: 56,
                        boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)',
                        '&:hover': {
                            boxShadow: '0 12px 40px rgba(255, 107, 107, 0.4)',
                            transform: 'translateY(-2px)',
                        },
                    }
                } > {
                    playing ? < Pause / > : < PlayArrow / >
                } <
                /IconButton>

                <
                IconButton onClick = {
                    downloadAudio
                }
                sx = {
                    {
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        '&:hover': {
                            background: 'rgba(255, 255, 255, 0.2)',
                            transform: 'translateY(-2px)',
                        },
                    }
                } >
                <
                Download / >
                <
                /IconButton>

                {
                    isAuthenticated && ( <
                        IconButton onClick = {
                            saveTrack
                        }
                        sx = {
                            {
                                background: 'rgba(76, 175, 80, 0.2)',
                                color: '#4caf50',
                                '&:hover': {
                                    background: 'rgba(76, 175, 80, 0.3)',
                                    transform: 'translateY(-2px)',
                                },
                            }
                        } >
                        <
                        Save / >
                        <
                        /IconButton>
                    )
                } <
                /Box> < /
                CardContent > <
                /Card>
            )
        } <
        /Container> < /
    Box >
);
}