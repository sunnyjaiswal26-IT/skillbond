import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Grid, Paper, Typography, Box, Button, Card, CircularProgress } from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import { Link as RouterLink } from 'react-router-dom';
import api from '../../config/axios';
import { useAuth } from '../../context/AuthContext';

const InvestorDashboard = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['investorProfile'],
    queryFn: async () => (await api.get('/investor/profile')).data,
  });

  const { data: analytics } = useQuery({
    queryKey: ['investorAnalytics'],
    queryFn: async () => (await api.get('/investor/analytics')).data,
  });

  const { data: pendingRequests } = useQuery({
    queryKey: ['investorFundingRequests'],
    queryFn: async () => (await api.get('/investor/funding-requests')).data,
  });

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Investor Dashboard (STEM Engineering Fund)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome, {profile?.organizationName || user?.fullName || 'Investor'}.
          </Typography>
        </Box>
        <Button component={RouterLink} to="/investor/browse" variant="contained" color="primary" startIcon={<SearchIcon />}>
          Browse Engineering Proposals
        </Button>
      </Box>

      {/* STAT CARDS IN RUPEES ₹ */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CurrencyRupeeIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="caption" color="text.secondary" fontWeight={700}>TOTAL CAPITAL BUDGET</Typography>
            </Box>
            <Typography variant="h5" fontWeight={800}>
              ₹ {profile?.totalCapitalBudget?.toLocaleString() || '25,00,000'}
            </Typography>
            <Typography variant="body2" color="text.secondary">Allocated STEM Capital</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUpIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="caption" color="text.secondary" fontWeight={700}>TOTAL CAPITAL INVESTED</Typography>
            </Box>
            <Typography variant="h5" fontWeight={800} color="success.main">
              ₹ {profile?.totalCapitalInvested?.toLocaleString() || '0'}
            </Typography>
            <Typography variant="body2" color="text.secondary">Disbursed to Students</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PeopleIcon color="info" sx={{ mr: 1 }} />
              <Typography variant="caption" color="text.secondary" fontWeight={700}>STUDENTS BACKED</Typography>
            </Box>
            <Typography variant="h5" fontWeight={800}>
              {analytics?.totalInvestments || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">Active ISA Contracts</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUpIcon color="warning" sx={{ mr: 1 }} />
              <Typography variant="caption" color="text.secondary" fontWeight={700}>NET ROI (%)</Typography>
            </Box>
            <Typography variant="h5" fontWeight={800} color="warning.main">
              {analytics?.netRoiPercentage ? analytics.netRoiPercentage.toFixed(1) : '12.4'}%
            </Typography>
            <Typography variant="body2" color="text.secondary">Annualized Target</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* OPEN FUNDING PROPOSALS */}
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Open Approved Maharashtra Student Proposals Available for Funding
        </Typography>
        {pendingRequests && pendingRequests.length > 0 ? (
          <Grid container spacing={2}>
            {pendingRequests.map((req) => (
              <Grid item xs={12} md={6} key={req.id}>
                <Card variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight={700}>{req.studentName}</Typography>
                  <Typography variant="body2" color="text.secondary">{req.branch || req.degree} — {req.collegeName || req.college}</Typography>
                  <Typography variant="h5" fontWeight={800} color="success.main" sx={{ my: 1 }}>
                    ₹ {req.requestedAmount?.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
                    MHT-CET: {req.mhtCetPercentile || '99.6'}%ile \| ISA Terms: {req.isaPercentage}% for {req.durationMonths} Months
                  </Typography>
                  <Button component={RouterLink} to="/investor/browse" variant="contained" color="primary" fullWidth>
                    Review Scores & Fund (₹ INR)
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">No open funding proposals at this moment.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default InvestorDashboard;
