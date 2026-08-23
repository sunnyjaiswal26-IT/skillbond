import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import api from '../../config/axios';

const AuditLogsPage = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['adminAuditLogs'],
    queryFn: async () => (await api.get('/admin/audit-logs')).data,
  });

  return (
    <Box maxWidth="lg">
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        System Audit & Security Logs
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Immutable log of administrative actions, account approvals, and transactions.
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>User Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Details</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} align="center"><CircularProgress size={24} /></TableCell>
              </TableRow>
            ) : logs && logs.length > 0 ? (
              logs.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ fontWeight: 700 }}>{row.action}</TableCell>
                  <TableCell>{row.userEmail || 'N/A'}</TableCell>
                  <TableCell>{row.details}</TableCell>
                  <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">No audit logs recorded.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AuditLogsPage;
