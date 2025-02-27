import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      console.log(response.data);
  
      if (response.data.requires2FA) {
        // Redirect to Verify2FA page if 2FA is required
        navigate('/verify-2fa', { state: { email } });
      } else {
        // Login successful, redirect to dashboard
        localStorage.setItem('token', response.data.token); 
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          p: 4,
          boxShadow: 3,
          borderRadius: 3,
          bgcolor: 'background.paper',
          textAlign: 'center',
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary" sx={{ mb: 2 }}>
          <img src="/logo.png" alt="Logo" style={{ height: 50, marginRight: 10 }} />
          Welcome Back!
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={2}>
          Please enter your credentials to sign in.
        </Typography>

        {error && (
          <Box
            sx={{
              bgcolor: 'error.light',
              color: 'error.contrastText',
              p: 1,
              borderRadius: 1,
              mb: 2,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}

        <form onSubmit={handleLogin}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Remember Me"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="body2"
                color="primary"
                align="right"
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password?
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ py: 1.5, fontSize: '1rem' }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" align="center">
                Don't have an account?{' '}
                <Typography
                  component="span"
                  color="primary"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Typography>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default Login;