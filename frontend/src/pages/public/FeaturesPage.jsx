import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const FeaturesPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <Typography variant="h2" className="gradient-text" sx={{ fontWeight: 800, mb: 2, textAlign: 'center' }}>
        Platform Features
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: 8 }}>
        Everything you need to fund education or build an income-share portfolio.
      </Typography>

      <Grid container spacing={4}>
        {[
          { title: 'Automated ISA Structuring', desc: 'Custom terms based on degree major, expected graduation, and market trends.', icon: <SpeedIcon color="primary" sx={{ fontSize: 40 }} /> },
          { title: 'Bank-Grade Security', desc: 'JWT Token authentication, BCrypt encryption, and role-based access controls.', icon: <SecurityIcon color="primary" sx={{ fontSize: 40 }} /> },
          { title: 'ROI & Portfolio Analytics', desc: 'Real-time performance metrics, repayment tracking, and yield forecasts.', icon: <AnalyticsIcon color="primary" sx={{ fontSize: 40 }} /> },
          { title: 'Transparent Repayments', desc: 'Automated calculation engine ensuring repayments stay below strict monthly caps.', icon: <AccountBalanceWalletIcon color="primary" sx={{ fontSize: 40 }} /> },
        ].map((feature, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Card sx={{ p: 3, height: '100%' }}>
              <CardContent>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{feature.title}</Typography>
                <Typography variant="body2" color="text.secondary">{feature.desc}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FeaturesPage;
