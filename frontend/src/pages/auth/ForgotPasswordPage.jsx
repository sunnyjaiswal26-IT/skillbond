import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Alert, CircularProgress, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import api from '../../config/axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setMessage('');
      setLoading(true);
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message || 'Password reset token generated! Check system logs.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 10 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h5" textAlign="center" sx={{ fontWeight: 800, mb: 1 }}>
          Reset Password
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          Enter your email to receive a password reset token.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2, mb: 2, py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
          </Button>
          <Typography variant="body2" textAlign="center">
            <Link component={RouterLink} to="/login" color="primary" underline="hover">
              Back to Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;
