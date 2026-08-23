import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Stack,
} from '@mui/material';
import api from '../../config/axios';

const ManageRequests = () => {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['adminFundingRequests'],
    queryFn: async () => (await api.get('/admin/funding-requests')).data,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ requestId, status }) =>
      (await api.put(`/admin/funding-requests/${requestId}/status?status=${status}`)).data,
    onSuccess: () => queryClient.invalidateQueries(['adminFundingRequests']),
  });

  return (
    <Box maxWidth="lg">
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Manage Student ISA Proposals (Admin Verification)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Verify MHT-CET, JEE percentiles, 10th/12th scores, CGPA, and approve proposals so investors can back them.
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Student & Branch</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Requested Capital (₹)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>College & University</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Entrance & Marks</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Terms</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center"><CircularProgress size={24} /></TableCell>
              </TableRow>
            ) : requests && requests.length > 0 ? (
              requests.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ fontWeight: 700 }}>
                    {row.studentName}
                    <Typography variant="caption" color="text.secondary" display="block">
                      {row.branch || 'Computer Engineering'} ({row.currentYear || 'TE'})
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, color: 'success.main' }}>
                    ₹ {row.requestedAmount?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {row.collegeName || row.college}
                    <Typography variant="caption" color="text.secondary" display="block">
                      Avg Package: ₹ {(row.collegeAveragePackage ? (row.collegeAveragePackage / 100000).toFixed(1) : 10)} LPA
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                      <Chip label={`CET: ${row.mhtCetPercentile || '99.6'}%ile`} color="warning" size="small" />
                      <Chip label={`JEE: ${row.jeeMainPercentile || '98.8'}%ile`} color="info" size="small" />
                      <Chip label={`CGPA: ${row.currentCgpa || '9.1'}`} color="primary" size="small" />
                    </Stack>
                  </TableCell>
                  <TableCell>{row.isaPercentage}% / {row.durationMonths}m</TableCell>
                  <TableCell>
                    <Chip label={row.status} color={row.status === 'APPROVED' ? 'primary' : row.status === 'FUNDED' ? 'success' : 'warning'} size="small" />
                  </TableCell>
                  <TableCell>
                    {row.status === 'PENDING' && (
                      <>
                        <Button size="small" variant="contained" color="success" onClick={() => updateStatusMutation.mutate({ requestId: row.id, status: 'APPROVED' })} sx={{ mr: 1 }}>
                          Approve
                        </Button>
                        <Button size="small" variant="outlined" color="error" onClick={() => updateStatusMutation.mutate({ requestId: row.id, status: 'REJECTED' })}>
                          Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">No funding proposals submitted.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManageRequests;
