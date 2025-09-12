import React from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Stack,
    Avatar,
    Chip
} from '@mui/material';
import {
    MusicNote,
    Tune,
    School,
    QueueMusic,
    AutoAwesome,
    Headphones,
    TrendingUp
} from '@mui/icons-material';
import {
    Link
} from 'react-router-dom';

const features = [{
        icon: < Tune / > ,
        title: 'AI Music Generation',
        description: 'Create unique music tracks using advanced AI models with text prompts',
        link: '/generate',
        gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)',
        shadowColor: 'rgba(255, 107, 107, 0.4)'
    },
    {
        icon: < School / > ,
        title: 'Learning Tools',
        description: 'Master music theory with interactive lessons and exercises',
        link: '/learn',
        gradient: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
        shadowColor: 'rgba(78, 205, 196, 0.4)'
    },
    {
        icon: < QueueMusic / > ,
        title: 'Personal Library',
        description: 'Save, organize, and manage your generated music tracks',
        link: '/playlists',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        shadowColor: 'rgba(102, 126, 234, 0.4)'
    }
];

const stats = [{
        icon: < AutoAwesome / > ,
        value: '10K+',
        label: 'Tracks Generated'
    },
    {
        icon: < Headphones / > ,
        value: '5K+',
        label: 'Active Users'
    },
    {
        icon: < TrendingUp / > ,
        value: '99%',
        label: 'Satisfaction Rate'
    }
];

export default function Home() {
    return ( <
        Box sx = {
            {
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
                position: 'relative',
                overflow: 'hidden'
            }
        } > {
            /* Animated background elements */
        } <
        Box sx = {
            {
                position: 'absolute',
                top: '10%',
                right: '10%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(255,107,107,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 6s ease-in-out infinite',
                '@keyframes float': {
                    '0%, 100%': {
                        transform: 'translateY(0px)'
                    },
                    '50%': {
                        transform: 'translateY(-20px)'
                    }
                }
            }
        }
        />

        <
        Box sx = {
            {
                position: 'absolute',
                bottom: '20%',
                left: '5%',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(78,205,196,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 8s ease-in-out infinite reverse',
            }
        }
        />

        <
        Container maxWidth = "lg"
        sx = {
            {
                position: 'relative',
                zIndex: 1
            }
        } > {
            /* Hero Section */
        } <
        Box sx = {
            {
                textAlign: 'center',
                py: 8
            }
        } >
        <
        Box sx = {
            {
                background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                borderRadius: '50%',
                width: 120,
                height: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 32px',
                boxShadow: '0 20px 60px rgba(255, 107, 107, 0.3)',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                    '0%, 100%': {
                        transform: 'scale(1)'
                    },
                    '50%': {
                        transform: 'scale(1.05)'
                    }
                }
            }
        } >
        <
        MusicNote sx = {
            {
                fontSize: 60,
                color: 'white'
            }
        }
        /> < /
        Box >

        <
        Typography variant = "h2"
        component = "h1"
        gutterBottom sx = {
            {
                background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                mb: 2
            }
        } >
        Welcome to HarmoniX <
        /Typography>

        <
        Typography variant = "h5"
        color = "text.secondary"
        paragraph sx = {
            {
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: 1.6,
                opacity: 0.9
            }
        } >
        Create, learn, and explore music with the power of artificial intelligence.Transform your ideas into beautiful melodies in seconds. <
        /Typography>

        <
        Stack direction = {
            {
                xs: 'column',
                sm: 'row'
            }
        }
        spacing = {
            3
        }
        justifyContent = "center"
        sx = {
            {
                mt: 4
            }
        } >
        <
        Button variant = "contained"
        size = "large"
        component = {
            Link
        }
        to = "/generate"
        startIcon = {
            <
            Tune / >
        }
        sx = {
            {
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #ff6b6b 30%, #ffa726 90%)',
                boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)',
                '&:hover': {
                    background: 'linear-gradient(45deg, #ff8a80 30%, #ffb74d 90%)',
                    boxShadow: '0 12px 40px rgba(255, 107, 107, 0.4)',
                    transform: 'translateY(-2px)',
                },
            }
        } >
        Start Creating <
        /Button>

        <
        Button variant = "outlined"
        size = "large"
        component = {
            Link
        }
        to = "/learn"
        startIcon = {
            <
            School / >
        }
        sx = {
            {
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                '&:hover': {
                    borderColor: '#4ecdc4',
                    backgroundColor: 'rgba(78, 205, 196, 0.1)',
                    transform: 'translateY(-2px)',
                },
            }
        } >
        Learn Music <
        /Button> < /
        Stack > <
        /Box>

        {
            /* Stats Section */
        } <
        Box sx = {
            {
                py: 6
            }
        } >
        <
        Grid container spacing = {
            4
        }
        justifyContent = "center" > {
            stats.map((stat, index) => ( <
                Grid item xs = {
                    12
                }
                sm = {
                    4
                }
                key = {
                    index
                } >
                <
                Box sx = {
                    {
                        textAlign: 'center',
                        p: 3,
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '20px',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            background: 'rgba(255, 255, 255, 0.08)',
                        }
                    }
                } >
                <
                Avatar sx = {
                    {
                        bgcolor: 'transparent',
                        background: features[index] && features[index].gradient || 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                        width: 60,
                        height: 60,
                        margin: '0 auto 16px',
                        boxShadow: `0 8px 32px ${features[index] && features[index].shadowColor || 'rgba(255, 107, 107, 0.3)'}`
                    }
                } > {
                    stat.icon
                } <
                /Avatar> <
                Typography variant = "h3"
                sx = {
                    {
                        fontWeight: 800,
                        background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }
                } > {
                    stat.value
                } <
                /Typography> <
                Typography variant = "body1"
                color = "text.secondary" > {
                    stat.label
                } <
                /Typography> < /
                Box > <
                /Grid>
            ))
        } <
        /Grid> < /
        Box >

        {
            /* Features Section */
        } <
        Box sx = {
            {
                py: 6
            }
        } >
        <
        Typography variant = "h3"
        align = "center"
        gutterBottom sx = {
            {
                fontWeight: 700,
                mb: 6,
                background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }
        } >
        Powerful Features <
        /Typography>

        <
        Grid container spacing = {
            4
        } > {
            features.map((feature, index) => ( <
                Grid item xs = {
                    12
                }
                md = {
                    4
                }
                key = {
                    index
                } >
                <
                Card sx = {
                    {
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '24px',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                            transform: 'translateY(-12px) scale(1.02)',
                            boxShadow: `0 25px 80px ${feature.shadowColor}`,
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                        },
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: feature.gradient,
                        }
                    }
                } >
                <
                CardContent sx = {
                    {
                        flexGrow: 1,
                        textAlign: 'center',
                        p: 4
                    }
                } >
                <
                Avatar sx = {
                    {
                        background: feature.gradient,
                        width: 80,
                        height: 80,
                        margin: '0 auto 24px',
                        boxShadow: `0 12px 40px ${feature.shadowColor}`,
                    }
                } > {
                    React.cloneElement(feature.icon, {
                        sx: {
                            fontSize: 40
                        }
                    })
                } <
                /Avatar>

                <
                Typography variant = "h5"
                component = "h2"
                gutterBottom sx = {
                    {
                        fontWeight: 600
                    }
                } > {
                    feature.title
                } <
                /Typography>

                <
                Typography variant = "body1"
                color = "text.secondary"
                paragraph sx = {
                    {
                        lineHeight: 1.6
                    }
                } > {
                    feature.description
                } <
                /Typography>

                <
                Button variant = "contained"
                component = {
                    Link
                }
                to = {
                    feature.link
                }
                sx = {
                    {
                        mt: 3,
                        background: feature.gradient,
                        boxShadow: `0 8px 32px ${feature.shadowColor}`,
                        '&:hover': {
                            boxShadow: `0 12px 40px ${feature.shadowColor}`,
                            transform: 'translateY(-2px)',
                        }
                    }
                } >
                Get Started <
                /Button> < /
                CardContent > <
                /Card> < /
                Grid >
            ))
        } <
        /Grid> < /
        Box >

        {
            /* CTA Section */
        } <
        Box sx = {
            {
                textAlign: 'center',
                py: 8,
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '32px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                my: 6
            }
        } >
        <
        Typography variant = "h3"
        gutterBottom sx = {
            {
                fontWeight: 700
            }
        } >
        Ready to create amazing music ?
        <
        /Typography>

        <
        Typography variant = "h6"
        color = "text.secondary"
        paragraph sx = {
            {
                maxWidth: '500px',
                margin: '0 auto'
            }
        } >
        Join thousands of creators using AI to bring their musical ideas to life <
        /Typography>

        <
        Stack direction = "row"
        spacing = {
            2
        }
        justifyContent = "center"
        sx = {
            {
                mt: 4
            }
        } >
        <
        Chip label = "✨ AI Powered"
        sx = {
            {
                background: 'rgba(255, 107, 107, 0.2)',
                color: '#ff6b6b',
                border: '1px solid rgba(255, 107, 107, 0.3)'
            }
        }
        /> <
        Chip label = "🎵 High Quality"
        sx = {
            {
                background: 'rgba(78, 205, 196, 0.2)',
                color: '#4ecdc4',
                border: '1px solid rgba(78, 205, 196, 0.3)'
            }
        }
        /> <
        Chip label = "⚡ Fast Generation"
        sx = {
            {
                background: 'rgba(102, 126, 234, 0.2)',
                color: '#667eea',
                border: '1px solid rgba(102, 126, 234, 0.3)'
            }
        }
        /> < /
        Stack >

        <
        Button variant = "contained"
        size = "large"
        component = {
            Link
        }
        to = "/login"
        sx = {
            {
                mt: 4,
                py: 2,
                px: 6,
                fontSize: '1.2rem',
                background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                boxShadow: '0 12px 40px rgba(255, 107, 107, 0.3)',
                '&:hover': {
                    boxShadow: '0 16px 50px rgba(255, 107, 107, 0.4)',
                    transform: 'translateY(-3px)',
                }
            }
        } >
        Get Started Today <
        /Button> < /
        Box > <
        /Container> < /
        Box >
    );
}