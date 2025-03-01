import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Verify2FA = () => {
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};

    const handleVerify = async () => {
        const API_URL = import.meta.env.VITE_API_URL;
        setLoading(true);
        setError('');

        try {
            // console.log(email, token)
            // console.log(API_URL)
            const response = await axios.post(`${API_URL}/api/auth/verify`, { email, token });
            console.log(response.data);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data?.error || '2FA verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Box sx={{ p: 4, boxShadow: 3, borderRadius: 3, bgcolor: 'background.paper', textAlign: 'center', width: '100%' }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                    Verify 2FA
                </Typography>
                <Typography variant="body2" color="textSecondary" mb={2}>
                    Enter the 6-digit code from your Google Authenticator app.
                </Typography>

                {error && (
                    <Typography variant="body2" color="error" mb={2}>
                        {error}
                    </Typography>
                )}

                <TextField
                    fullWidth
                    label="6-Digit Code"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    variant="outlined"
                    sx={{ mb: 2 }}
                />

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleVerify}
                    disabled={loading}
                    sx={{ py: 1.5, fontSize: '1rem' }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
                </Button>
            </Box>
        </Container>
    );
};

export default Verify2FA;