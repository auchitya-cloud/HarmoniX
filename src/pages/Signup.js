import React, {
    useState
} from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Link as MuiLink,
    Stack
} from '@mui/material';
import {
    Link,
    useNavigate
} from 'react-router-dom';
import {
    useAuth
} from '../contexts/AuthContext';
import {
    MusicNote
} from '@mui/icons-material';

export default function Signup() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const {
        register
    } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const result = await register(formData.email, formData.password, formData.displayName);

            if (result.success) {
                navigate('/');
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return ( <
        Container maxWidth = "sm" >
        <
        Box sx = {
            {
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4
            }
        } >
        <
        Paper elevation = {
            24
        }
        sx = {
            {
                p: 4,
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px'
            }
        } >
        <
        Stack spacing = {
            3
        }
        alignItems = "center" >
        <
        Box sx = {
            {
                display: 'flex',
                alignItems: 'center',
                gap: 2
            }
        } >
        <
        MusicNote sx = {
            {
                fontSize: 40,
                color: '#ff6b6b'
            }
        }
        /> <
        Typography variant = "h4"
        sx = {
            {
                fontWeight: 800,
                background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }
        } >
        HarmoniX <
        /Typography> <
        /Box>

        <
        Typography variant = "h5"
        color = "white"
        align = "center" >
        Join HarmoniX <
        /Typography>

        <
        Typography variant = "body2"
        color = "text.secondary"
        align = "center" >
        Create your account and start generating amazing music <
        /Typography> <
        /Stack>

        {
            error && ( <
                Alert severity = "error"
                sx = {
                    {
                        mt: 3,
                        mb: 2
                    }
                } > {
                    error
                } <
                /Alert>
            )
        }

        <
        Box component = "form"
        onSubmit = {
            handleSubmit
        }
        sx = {
            {
                mt: 3
            }
        } >
        <
        TextField fullWidth label = "Display Name"
        name = "displayName"
        value = {
            formData.displayName
        }
        onChange = {
            handleChange
        }
        margin = "normal"
        required sx = {
            {
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#ff6b6b',
                    },
                },
                '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiOutlinedInput-input': {
                    color: 'white',
                },
            }
        }
        />

        <
        TextField fullWidth label = "Email"
        name = "email"
        type = "email"
        value = {
            formData.email
        }
        onChange = {
            handleChange
        }
        margin = "normal"
        required sx = {
            {
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#ff6b6b',
                    },
                },
                '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiOutlinedInput-input': {
                    color: 'white',
                },
            }
        }
        />

        <
        TextField fullWidth label = "Password"
        name = "password"
        type = "password"
        value = {
            formData.password
        }
        onChange = {
            handleChange
        }
        margin = "normal"
        required helperText = "Password must be at least 6 characters"
        sx = {
            {
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#ff6b6b',
                    },
                },
                '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiOutlinedInput-input': {
                    color: 'white',
                },
                '& .MuiFormHelperText-root': {
                    color: 'rgba(255, 255, 255, 0.5)',
                },
            }
        }
        />

        <
        TextField fullWidth label = "Confirm Password"
        name = "confirmPassword"
        type = "password"
        value = {
            formData.confirmPassword
        }
        onChange = {
            handleChange
        }
        margin = "normal"
        required sx = {
            {
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#ff6b6b',
                    },
                },
                '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiOutlinedInput-input': {
                    color: 'white',
                },
            }
        }
        />

        <
        Button type = "submit"
        fullWidth variant = "contained"
        disabled = {
            loading
        }
        sx = {
            {
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: '12px',
                background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
                boxShadow: '0 4px 20px rgba(255, 107, 107, 0.3)',
                '&:hover': {
                    boxShadow: '0 6px 25px rgba(255, 107, 107, 0.4)',
                    transform: 'translateY(-1px)',
                },
                '&:disabled': {
                    background: 'rgba(255, 255, 255, 0.1)',
                }
            }
        } >
        {
            loading ? ( <
                CircularProgress size = {
                    24
                }
                color = "inherit" / >
            ) : (
                'Create Account'
            )
        } <
        /Button>

        <
        Box sx = {
            {
                textAlign: 'center',
                mt: 2
            }
        } >
        <
        Typography variant = "body2"
        color = "text.secondary" >
        Already have an account ? {
            ' '
        } <
        MuiLink component = {
            Link
        }
        to = "/login"
        sx = {
            {
                color: '#ff6b6b',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                    textDecoration: 'underline',
                }
            }
        } >
        Sign in here <
        /MuiLink> <
        /Typography> <
        /Box> <
        /Box> <
        /Paper> <
        /Box> <
        /Container>
    );
}