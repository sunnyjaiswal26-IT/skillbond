import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress } from '@mui/material';
import api from '../../config/axios';

const StudentRepayment = () => {
  const { data: repayments, isLoading } = useQuery({
    queryKey: ['myRepayments'],
    queryFn: async () => (await api.get('/student/repayments')).data,
  });

  return (
    <Box maxWidth="lg">
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Repayment Schedule & Payment History
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Track your active monthly income share payments once employed.
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Monthly Salary (₹)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Calculated Share Amount (₹)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Paid Amount (₹)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} align="center"><CircularProgress size={24} /></TableCell>
              </TableRow>
            ) : repayments && repayments.length > 0 ? (
              repayments.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>₹ {row.monthlySalary?.toLocaleString()}</TableCell>
                  <TableCell>₹ {row.calculatedAmount?.toLocaleString()}</TableCell>
                  <TableCell>₹ {row.paidAmount?.toLocaleString() || 0}</TableCell>
                  <TableCell>
                    <Chip label={row.status} color={row.status === 'PAID' ? 'success' : 'warning'} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="text.secondary" sx={{ py: 3 }}>
                    No active repayment obligations. Repayments begin post-graduation after securing employment above the ₹ 4 LPA salary floor.
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

export default StudentRepayment;
