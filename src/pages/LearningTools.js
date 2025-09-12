import React, {
    useState,
    useEffect,
    useRef
} from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Box,
    Slider,
    IconButton,
    Paper,
    Chip,
    LinearProgress
} from '@mui/material';
import {
    PlayArrow,
    Stop,
    VolumeUp,
    GraphicEq,
    Speed,
    MusicNote
} from '@mui/icons-material';

// Metronome Component
const Metronome = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(120);
    const [volume, setVolume] = useState(50);
    const [beat, setBeat] = useState(0);
    const intervalRef = useRef(null);
    const audioContextRef = useRef(null);

    useEffect(() => {
        // Initialize Web Audio API
        if (!audioContextRef.current) {
            audioContextRef.current = new(window.AudioContext || window.webkitAudioContext)();
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const playClick = (isAccent = false) => {
        const audioContext = audioContextRef.current;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Different frequencies for accent and regular beats
        oscillator.frequency.setValueAtTime(isAccent ? 800 : 600, audioContext.currentTime);
        oscillator.type = 'square';

        // Volume control
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume / 100 * 0.1, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    };

    const startMetronome = () => {
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }

        setIsPlaying(true);
        setBeat(0);

        const interval = 60000 / bpm; // Convert BPM to milliseconds
        let currentBeat = 0;

        intervalRef.current = setInterval(() => {
            playClick(currentBeat % 4 === 0); // Accent every 4th beat
            currentBeat++;
            setBeat(currentBeat % 4);
        }, interval);
    };

    const stopMetronome = () => {
        setIsPlaying(false);
        setBeat(0);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const handleBpmChange = (event, newValue) => {
        setBpm(newValue);
        if (isPlaying) {
            stopMetronome();
            setTimeout(() => startMetronome(), 100);
        }
    };

    return ( <
        Card sx = {
            {
                height: '100%'
            }
        } >
        <
        CardContent >
        <
        Box sx = {
            {
                display: 'flex',
                alignItems: 'center',
                mb: 3
            }
        } >
        <
        Speed sx = {
            {
                mr: 1,
                color: '#ff6b6b'
            }
        }
        /> <
        Typography variant = "h6" > Metronome < /Typography> <
        /Box>

        {
            /* BPM Display */ } <
        Box sx = {
            {
                textAlign: 'center',
                mb: 3
            }
        } >
        <
        Typography variant = "h2"
        sx = {
            {
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }
        } > {
            bpm
        } <
        /Typography> <
        Typography variant = "body2"
        color = "text.secondary" >
        BPM <
        /Typography> <
        /Box>

        {
            /* Beat Indicator */ } <
        Box sx = {
            {
                display: 'flex',
                justifyContent: 'center',
                mb: 3
            }
        } > {
            [0, 1, 2, 3].map((i) => ( <
                Box key = {
                    i
                }
                sx = {
                    {
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        mx: 0.5,
                        backgroundColor: beat === i ? '#ff6b6b' : 'rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.1s ease'
                    }
                }
                />
            ))
        } <
        /Box>

        {
            /* BPM Slider */ } <
        Box sx = {
            {
                mb: 3
            }
        } >
        <
        Typography variant = "body2"
        gutterBottom >
        Tempo: {
            bpm
        }
        BPM <
        /Typography> <
        Slider value = {
            bpm
        }
        onChange = {
            handleBpmChange
        }
        min = {
            40
        }
        max = {
            200
        }
        sx = {
            {
                '& .MuiSlider-thumb': {
                    background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                },
                '& .MuiSlider-track': {
                    background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                }
            }
        }
        /> <
        /Box>

        {
            /* Volume Control */ } <
        Box sx = {
            {
                mb: 3
            }
        } >
        <
        Typography variant = "body2"
        gutterBottom >
        Volume: {
            volume
        } %
        <
        /Typography> <
        Slider value = {
            volume
        }
        onChange = {
            (e, newValue) => setVolume(newValue)
        }
        min = {
            0
        }
        max = {
            100
        }
        sx = {
            {
                '& .MuiSlider-thumb': {
                    background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                },
                '& .MuiSlider-track': {
                    background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                }
            }
        }
        /> <
        /Box>

        {
            /* Control Buttons */ } <
        Box sx = {
            {
                display: 'flex',
                justifyContent: 'center',
                gap: 2
            }
        } >
        <
        Button variant = "contained"
        onClick = {
            isPlaying ? stopMetronome : startMetronome
        }
        startIcon = {
            isPlaying ? < Stop / > : < PlayArrow / >
        }
        sx = {
            {
                background: isPlaying ?
                    'linear-gradient(45deg, #f44336 30%, #d32f2f 90%)' :
                    'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                px: 4
            }
        } >
        {
            isPlaying ? 'Stop' : 'Start'
        } <
        /Button> <
        /Box>

        {
            /* Tempo Presets */ } <
        Box sx = {
            {
                mt: 3
            }
        } >
        <
        Typography variant = "body2"
        gutterBottom >
        Quick Tempos:
        <
        /Typography> <
        Box sx = {
            {
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap'
            }
        } > {
            [60, 80, 100, 120, 140, 160].map((tempo) => ( <
                Chip key = {
                    tempo
                }
                label = {
                    `${tempo}`
                }
                onClick = {
                    () => setBpm(tempo)
                }
                variant = {
                    bpm === tempo ? 'filled' : 'outlined'
                }
                size = "small"
                sx = {
                    {
                        ...(bpm === tempo && {
                            background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                            color: 'white'
                        })
                    }
                }
                />
            ))
        } <
        /Box> <
        /Box> <
        /CardContent> <
        /Card>
    );
};

// Tuner Component
const Tuner = () => {
    const [isListening, setIsListening] = useState(false);
    const [frequency, setFrequency] = useState(0);
    const [note, setNote] = useState('');
    const [cents, setCents] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const microphoneRef = useRef(null);
    const animationRef = useRef(null);

    const noteFrequencies = {
        'C': 261.63,
        'C#': 277.18,
        'D': 293.66,
        'D#': 311.13,
        'E': 329.63,
        'F': 349.23,
        'F#': 369.99,
        'G': 392.00,
        'G#': 415.30,
        'A': 440.00,
        'A#': 466.16,
        'B': 493.88
    };

    const getClosestNote = (freq) => {
        let closestNote = '';
        let minDiff = Infinity;

        Object.entries(noteFrequencies).forEach(([noteName, noteFreq]) => {
            const diff = Math.abs(freq - noteFreq);
            if (diff < minDiff) {
                minDiff = diff;
                closestNote = noteName;
            }
        });

        return closestNote;
    };

    const getCents = (freq, targetFreq) => {
        return Math.round(1200 * Math.log2(freq / targetFreq));
    };

    const analyzeAudio = () => {
        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Float32Array(bufferLength);

        analyser.getFloatFrequencyData(dataArray);

        // Find the frequency with the highest amplitude
        let maxIndex = 0;
        let maxValue = -Infinity;

        for (let i = 0; i < bufferLength; i++) {
            if (dataArray[i] > maxValue) {
                maxValue = dataArray[i];
                maxIndex = i;
            }
        }

        // Convert index to frequency
        const sampleRate = audioContextRef.current.sampleRate;
        const detectedFreq = (maxIndex * sampleRate) / (bufferLength * 2);

        if (detectedFreq > 80 && detectedFreq < 2000 && maxValue > -60) {
            setFrequency(detectedFreq);
            const closestNote = getClosestNote(detectedFreq);
            setNote(closestNote);

            const targetFreq = noteFrequencies[closestNote];
            const centsOff = getCents(detectedFreq, targetFreq);
            setCents(centsOff);

            // Calculate accuracy (0-100%)
            const accuracyPercent = Math.max(0, 100 - Math.abs(centsOff));
            setAccuracy(accuracyPercent);
        }

        if (isListening) {
            animationRef.current = requestAnimationFrame(analyzeAudio);
        }
    };

    const startTuner = async () => {
        try {
            audioContextRef.current = new(window.AudioContext || window.webkitAudioContext)();

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
            microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);

            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 4096;
            analyserRef.current.smoothingTimeConstant = 0.8;

            microphoneRef.current.connect(analyserRef.current);

            setIsListening(true);
            analyzeAudio();
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Please allow microphone access to use the tuner.');
        }
    };

    const stopTuner = () => {
        setIsListening(false);
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        if (microphoneRef.current) {
            microphoneRef.current.disconnect();
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        setFrequency(0);
        setNote('');
        setCents(0);
        setAccuracy(0);
    };

    const getTuningColor = () => {
        if (Math.abs(cents) < 5) return '#4caf50'; // Green - in tune
        if (Math.abs(cents) < 15) return '#ff9800'; // Orange - close
        return '#f44336'; // Red - out of tune
    };

    return ( <
        Card sx = {
            {
                height: '100%'
            }
        } >
        <
        CardContent >
        <
        Box sx = {
            {
                display: 'flex',
                alignItems: 'center',
                mb: 3
            }
        } >
        <
        GraphicEq sx = {
            {
                mr: 1,
                color: '#4ecdc4'
            }
        }
        /> <
        Typography variant = "h6" > Guitar Tuner < /Typography> <
        /Box>

        {
            /* Note Display */ } <
        Box sx = {
            {
                textAlign: 'center',
                mb: 3
            }
        } >
        <
        Typography variant = "h1"
        sx = {
            {
                fontWeight: 'bold',
                color: getTuningColor(),
                fontSize: '4rem'
            }
        } >
        {
            note || '—'
        } <
        /Typography> <
        Typography variant = "body2"
        color = "text.secondary" > {
            frequency > 0 ? `${frequency.toFixed(1)} Hz` : 'Play a note'
        } <
        /Typography> <
        /Box>

        {
            /* Tuning Meter */ } {
            note && ( <
                Box sx = {
                    {
                        mb: 3
                    }
                } >
                <
                Box sx = {
                    {
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 1
                    }
                } >
                <
                Typography variant = "body2"
                color = {
                    getTuningColor()
                } > {
                    cents > 0 ? `+${cents}` : cents
                }
                cents <
                /Typography> <
                /Box>

                <
                Box sx = {
                    {
                        position: 'relative',
                        height: 20,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: 2
                    }
                } > {
                    /* Center line */ } <
                Box sx = {
                    {
                        position: 'absolute',
                        left: '50%',
                        top: 0,
                        bottom: 0,
                        width: 2,
                        backgroundColor: 'white',
                        transform: 'translateX(-50%)'
                    }
                }
                />

                {
                    /* Tuning indicator */ } <
                Box sx = {
                    {
                        position: 'absolute',
                        top: 2,
                        bottom: 2,
                        width: 16,
                        backgroundColor: getTuningColor(),
                        borderRadius: 1,
                        left: `calc(50% + ${Math.max(-45, Math.min(45, cents))}% - 8px)`,
                        transition: 'all 0.1s ease'
                    }
                }
                /> <
                /Box>

                <
                Box sx = {
                    {
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 1
                    }
                } >
                <
                Typography variant = "caption" > Flat < /Typography> <
                Typography variant = "caption" > Sharp < /Typography> <
                /Box> <
                /Box>
            )
        }

        {
            /* Accuracy Display */ } {
            note && ( <
                Box sx = {
                    {
                        mb: 3
                    }
                } >
                <
                Typography variant = "body2"
                gutterBottom >
                Accuracy: {
                    accuracy.toFixed(0)
                } %
                <
                /Typography> <
                LinearProgress variant = "determinate"
                value = {
                    accuracy
                }
                sx = {
                    {
                        height: 8,
                        borderRadius: 4,
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: getTuningColor()
                        }
                    }
                }
                /> <
                /Box>
            )
        }

        {
            /* Control Button */ } <
        Box sx = {
            {
                display: 'flex',
                justifyContent: 'center',
                mb: 3
            }
        } >
        <
        Button variant = "contained"
        onClick = {
            isListening ? stopTuner : startTuner
        }
        startIcon = {
            isListening ? < Stop / > : < VolumeUp / >
        }
        sx = {
            {
                background: isListening ?
                    'linear-gradient(45deg, #f44336 30%, #d32f2f 90%)' :
                    'linear-gradient(45deg, #4ecdc4 30%, #ff6b6b 90%)',
                px: 4
            }
        } >
        {
            isListening ? 'Stop Tuner' : 'Start Tuner'
        } <
        /Button> <
        /Box>

        {
            /* Reference Notes */ } <
        Box >
        <
        Typography variant = "body2"
        gutterBottom >
        Standard Guitar Tuning:
        <
        /Typography> <
        Box sx = {
            {
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap'
            }
        } > {
            ['E', 'A', 'D', 'G', 'B', 'E'].map((tuningNote, index) => ( <
                Chip key = {
                    index
                }
                label = {
                    `${6-index}: ${tuningNote}`
                }
                size = "small"
                variant = "outlined"
                sx = {
                    {
                        fontSize: '0.75rem'
                    }
                }
                />
            ))
        } <
        /Box> <
        /Box> <
        /CardContent> <
        /Card>
    );
};

// Main Learning Tools Component
export default function LearningTools() {
    return ( <
        Container maxWidth = "lg" >
        <
        Typography variant = "h4"
        gutterBottom sx = {
            {
                background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
            }
        } >
        Learning Tools <
        /Typography>

        <
        Typography variant = "body1"
        color = "text.secondary"
        paragraph >
        Essential tools
        for musicians - practice with our metronome and tune your instrument with precision. <
        /Typography>

        <
        Grid container spacing = {
            4
        } > {
            /* Metronome */ } <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        Metronome / >
        <
        /Grid>

        {
            /* Tuner */ } <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        Tuner / >
        <
        /Grid>

        {
            /* Additional Learning Modules */ } <
        Grid item xs = {
            12
        } >
        <
        Paper sx = {
            {
                p: 3,
                mt: 2
            }
        } >
        <
        Typography variant = "h6"
        gutterBottom sx = {
            {
                display: 'flex',
                alignItems: 'center'
            }
        } >
        <
        MusicNote sx = {
            {
                mr: 1
            }
        }
        />
        Coming Soon <
        /Typography> <
        Typography variant = "body2"
        color = "text.secondary" >
        More learning tools are coming soon including chord charts, scale practice, and ear training exercises. <
        /Typography> <
        /Paper> <
        /Grid> <
        /Grid> <
        /Container>
    );
}