import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 16, textAlign: 'center' }}>
      <Typography variant="h1" className="gradient-text" sx={{ fontSize: '8rem', fontWeight: 900 }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        The page you are looking for does not exist or has been moved.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained" color="primary" size="large">
        Return Home
      </Button>
    </Container>
  );
};

export default NotFoundPage;
