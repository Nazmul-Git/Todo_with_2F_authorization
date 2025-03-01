import React, { useState, useEffect } from 'react';
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
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const API_URL = import.meta.env.VITE_API_URL ;
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      console.log(API_URL)
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      console.log(response.data);

      if (response.data.requires2FA) {
        navigate('/verify', { state: { email } });
      } else {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleLogin = async (response) => {
  //   if (response.error) {
  //     setError('Google login failed. Please try again.');
  //     return;
  //   }

  //   setLoading(true);
  //   setError('');

  //   try {
  //     const { credential } = response; // Google ID token
  //     const res = await axios.post(`${API_URL}/auth/google-login`, { tokenId: credential });

  //     if (res.data.requires2FA) {
  //       navigate('/verify-2fa', { state: { email: res.data.email } });
  //     } else {
  //       localStorage.setItem('token', res.data.token);
  //       navigate('/dashboard');
  //     }
  //   } catch (error) {
  //     setError(error.response?.data?.error || 'Google login failed. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
            fontFamily: '"Arial", sans-serif',
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

          {/* Google Login Button */}
          {/* <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError('Google login failed. Please try again.')}
              />
            </Grid>
          </Grid> */}
        </Box>
      </Container>
    </GoogleOAuthProvider>
  );
};

export default Login;