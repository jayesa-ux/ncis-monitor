import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Paper, InputAdornment, IconButton, Alert } from '@mui/material';
import { Person as PersonIcon, Lock as LockIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';

const Login: FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateForm = () => {
        let isValid = true;

        if (!username.trim()) {
            setUsernameError('El usuario es obligatorio');
            isValid = false;
        } else {
            setUsernameError('');
        }

        if (!password) {
            setPasswordError('La contraseña es obligatoria');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (username === 'admin' && password === 'admin') {
            setError('');
            sessionStorage.setItem('isAuthenticated', 'true');
            sessionStorage.setItem('user', username);
            navigate('/home');
        } else {
            setError('Usuario o contraseña incorrectos');
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
            <Paper
                elevation={3}
                sx={{
                    width: '100%',
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 2,
                }}
            >
                <Box sx={{ mb: 3, width: '150px', height: '150px' }}>
                    <img src="/logo.svg" alt="Logo" style={{ width: '100%', height: '100%' }} />
                </Box>

                <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                    Iniciar Sesión
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Usuario"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        error={!!usernameError}
                        helperText={usernameError}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Contraseña"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!passwordError}
                        helperText={passwordError}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton aria-label="toggle password visibility" onClick={handleTogglePasswordVisibility} edge="end">
                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            textTransform: 'none',
                            '&:hover': {
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                transform: 'translateY(-2px)',
                                transition: 'all 0.3s',
                            },
                        }}
                    >
                        Acceder
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
