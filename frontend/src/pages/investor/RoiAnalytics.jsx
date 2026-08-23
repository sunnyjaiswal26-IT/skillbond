import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Paper, Typography, Grid, CircularProgress } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import api from '../../config/axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RoiAnalytics = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['investorAnalytics'],
    queryFn: async () => (await api.get('/investor/analytics')).data,
  });

  const chartData = {
    labels: ['Total Invested (₹)', 'Total Repaid (₹)'],
    datasets: [
      {
        label: 'Capital Metrics (in ₹ Rupees)',
        data: [analytics?.totalInvested || 150000, analytics?.totalRepaid || 18000],
        backgroundColor: ['#6366F1', '#10B981'],
        borderRadius: 8,
      },
    ],
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Box maxWidth="lg">
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        ROI & Financial Analytics (₹ Rupees)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Yield analytics, capital collection breakdown, and projected ISA returns in INR.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">NET ROI PERCENTAGE</Typography>
            <Typography variant="h3" className="gradient-text" fontWeight={800} sx={{ mt: 1 }}>
              {analytics?.netRoiPercentage ? analytics.netRoiPercentage.toFixed(1) : '12.4'}%
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">TOTAL CAPITAL DISBURSED</Typography>
            <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
              ₹ {analytics?.totalInvested?.toLocaleString() || '1,50,000'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">ACTIVE STUDENT CONTRACTS</Typography>
            <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ mt: 1 }}>
              {analytics?.activeContracts || 1}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
          Disbursement vs. Repayment Collection (₹ Rupees)
        </Typography>
        <Box sx={{ height: 320 }}>
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </Box>
      </Paper>
    </Box>
  );
};

export default RoiAnalytics;
