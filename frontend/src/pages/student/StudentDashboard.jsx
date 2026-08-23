import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Grid, Paper, Typography, Box, Button, Card, Chip, CircularProgress, Stack } from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { Link as RouterLink } from 'react-router-dom';
import api from '../../config/axios';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: async () => (await api.get('/student/profile')).data,
  });

  const { data: fundingRequests, isLoading: loadingRequests } = useQuery({
    queryKey: ['myFundingRequests'],
    queryFn: async () => (await api.get('/student/funding-requests')).data,
  });

  const { data: investments } = useQuery({
    queryKey: ['myInvestments'],
    queryFn: async () => (await api.get('/student/investments')).data,
  });

  const activeFunding = fundingRequests?.find((r) => r.status === 'FUNDED' || r.status === 'APPROVED' || r.status === 'PENDING');

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Welcome back, {user?.fullName || 'Student'}! 👋
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your Maharashtra engineering ISA funding and repayment schedules.
          </Typography>
        </Box>
        <Button component={RouterLink} to="/student/funding" variant="contained" color="primary" startIcon={<CurrencyRupeeIcon />}>
          Request ISA Funding
        </Button>
      </Box>

      {/* METRIC CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SchoolIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                COLLEGE & BRANCH
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight={700} noWrap>
              {profile?.collegeName || 'COEP Technological University'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {profile?.branch || 'Computer Engineering'}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <WorkspacePremiumIcon color="warning" sx={{ mr: 1 }} />
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                ENTRANCE SCORES
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight={800} color="warning.main">
              CET: {profile?.mhtCetPercentile || '99.65'}%ile
            </Typography>
            <Typography variant="body2" color="text.secondary">
              JEE Main: {profile?.jeeMainPercentile || '98.80'}%ile
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CurrencyRupeeIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                TOTAL DISBURSED
              </Typography>
            </Box>
            <Typography variant="h5" fontWeight={800} color="success.main">
              ₹ {investments?.reduce((acc, i) => acc + (i.amount || 0), 0).toLocaleString() || '1,50,000'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active ISA Contract
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccountBalanceWalletIcon color="info" sx={{ mr: 1 }} />
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                ISA SHARE RATE
              </Typography>
            </Box>
            <Typography variant="h5" fontWeight={800}>
              {activeFunding?.isaPercentage || 7.5}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              For {activeFunding?.durationMonths || 36} Months Post-Grad
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* FUNDING REQUEST STATUS */}
      <Paper sx={{ p: 4, borderRadius: 4, mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Active ISA Proposal Overview
        </Typography>
        {loadingRequests ? (
          <CircularProgress size={24} />
        ) : fundingRequests && fundingRequests.length > 0 ? (
          <Stack spacing={2}>
            {fundingRequests.map((req) => (
              <Card key={req.id} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      ₹ {req.requestedAmount?.toLocaleString()} — {req.branch || req.degree} ({req.collegeName || req.college})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Reason: {req.reason}
                    </Typography>
                  </Box>
                  <Chip
                    label={req.status}
                    color={
                      req.status === 'FUNDED'
                        ? 'success'
                        : req.status === 'APPROVED'
                        ? 'primary'
                        : req.status === 'REJECTED'
                        ? 'error'
                        : 'warning'
                    }
                    sx={{ fontWeight: 700 }}
                  />
                </Box>
              </Card>
            ))}
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              You haven't submitted an ISA funding proposal yet.
            </Typography>
            <Button component={RouterLink} to="/student/funding" variant="outlined" color="primary">
              Create Request
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default StudentDashboard;
