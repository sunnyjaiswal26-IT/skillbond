import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent } from '@mui/material';

const AboutPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <Typography variant="h2" className="gradient-text" sx={{ fontWeight: 800, mb: 3, textAlign: 'center' }}>
        About SkillBond
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto', mb: 8 }}>
        SkillBond was founded on a simple principle: higher education funding should align incentives between students and financial backers.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Our Mission
              </Typography>
              <Typography variant="body1" color="text.secondary">
                To eliminate predatory student loan debt by building a transparent marketplace for Income Share Agreements.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Our Vision
              </Typography>
              <Typography variant="body1" color="text.secondary">
                A world where talent, motivation, and potential determine educational opportunities—regardless of family wealth or background.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AboutPage;
