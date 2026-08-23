import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Grid, Paper, Typography, Box, Button, CircularProgress } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Link as RouterLink } from 'react-router-dom';
import api from '../../config/axios';

const AdminDashboard = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: async () => (await api.get('/admin/analytics')).data,
  });

  if (isLoading) return <CircularProgress />;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Admin Console & Platform Stats
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monitor user accounts, ISA proposal approvals, system transactions, and security logs.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PeopleIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="caption" color="text.secondary" fontWeight={700}>TOTAL REGISTERED USERS</Typography>
            </Box>
            <Typography variant="h4" fontWeight={800}>{analytics?.totalUsers || 3}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SchoolIcon color="info" sx={{ mr: 1 }} />
              <Typography variant="caption" color="text.secondary" fontWeight={700}>TOTAL STUDENTS</Typography>
            </Box>
            <Typography variant="h4" fontWeight={800}>{analytics?.totalStudents || 1}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MonetizationOnIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="caption" color="text.secondary" fontWeight={700}>TOTAL INVESTORS</Typography>
            </Box>
            <Typography variant="h4" fontWeight={800}>{analytics?.totalInvestors || 1}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AssignmentIcon color="warning" sx={{ mr: 1 }} />
              <Typography variant="caption" color="text.secondary" fontWeight={700}>PENDING PROPOSALS</Typography>
            </Box>
            <Typography variant="h4" fontWeight={800} color="warning.main">{analytics?.pendingRequests || 0}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button component={RouterLink} to="/admin/users" variant="contained" color="primary" size="large">
          Manage Users
        </Button>
        <Button component={RouterLink} to="/admin/requests" variant="outlined" color="primary" size="large">
          Review Proposals
        </Button>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
