import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress } from '@mui/material';
import api from '../../config/axios';

const InvestorPortfolio = () => {
  const { data: portfolio, isLoading } = useQuery({
    queryKey: ['investorPortfolio'],
    queryFn: async () => (await api.get('/investor/portfolio')).data,
  });

  return (
    <Box maxWidth="lg">
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Active Investment Portfolio
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Overview of all active ISA student contracts and total capital collection in INR.
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Disbursed Capital (₹)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ISA Share %</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Total Repaid (₹)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center"><CircularProgress size={24} /></TableCell>
              </TableRow>
            ) : portfolio && portfolio.length > 0 ? (
              portfolio.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ fontWeight: 700 }}>{row.studentName}</TableCell>
                  <TableCell>₹ {row.amount?.toLocaleString()}</TableCell>
                  <TableCell>{row.isaPercentage}%</TableCell>
                  <TableCell color="success.main">₹ {row.totalRepaid?.toLocaleString() || 0}</TableCell>
                  <TableCell>
                    <Chip label={row.status} color="success" size="small" sx={{ fontWeight: 700 }} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary" sx={{ py: 3 }}>
                    No investments made yet. Browse open proposals to back a Maharashtra engineering student.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InvestorPortfolio;
