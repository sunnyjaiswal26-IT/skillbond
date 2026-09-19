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
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
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

  const recalculateAiMutation = useMutation({
    mutationFn: async (requestId) =>
      (await api.post(`/admin/funding-requests/${requestId}/recalculate-ai-score`)).data,
    onSuccess: () => queryClient.invalidateQueries(['adminFundingRequests']),
  });

  return (
    <Box maxWidth="lg">
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Manage Student ISA Proposals & AI Risk Evaluation
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Review AI Risk Scores, candidate recommendations, entrance percentiles, and approve proposals for investors.
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Student & Branch</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Requested Capital (₹)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>AI Risk Rating</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>AI Recommendation</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Entrance & Marks</TableCell>
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

                  {/* AI RISK SCORE BADGE */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PsychologyIcon color="primary" fontSize="small" />
                      <Typography fontWeight={800} color={row.aiRiskScore >= 75 ? 'success.main' : 'warning.main'}>
                        {row.aiRiskScore !== undefined && row.aiRiskScore !== null ? row.aiRiskScore : 'Pending'} / 100
                      </Typography>
                    </Box>
                    {row.aiProjectedRoi && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Projected ROI: {row.aiProjectedRoi}% / yr
                      </Typography>
                    )}
                  </TableCell>

                  {/* AI RECOMMENDATION */}
                  <TableCell>
                    {row.aiApprovalRecommendation ? (
                      <Chip
                        label={row.aiApprovalRecommendation}
                        color={row.aiRiskScore >= 75 ? 'success' : 'warning'}
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    ) : (
                      <Chip label="UNSCORED" size="small" />
                    )}
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                      {row.mhtCetPercentile && <Chip label={`CET: ${row.mhtCetPercentile}%ile`} color="warning" size="small" />}
                      {row.jeeMainPercentile && <Chip label={`JEE: ${row.jeeMainPercentile}%ile`} color="info" size="small" />}
                      {row.currentCgpa && <Chip label={`CGPA: ${row.currentCgpa}`} color="primary" size="small" />}
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Chip label={row.status} color={row.status === 'APPROVED' ? 'primary' : row.status === 'FUNDED' ? 'success' : 'warning'} size="small" />
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {row.status === 'PENDING' && (
                        <>
                          <Button size="small" variant="contained" color="success" onClick={() => updateStatusMutation.mutate({ requestId: row.id, status: 'APPROVED' })}>
                            Approve
                          </Button>
                          <Button size="small" variant="outlined" color="error" onClick={() => updateStatusMutation.mutate({ requestId: row.id, status: 'REJECTED' })}>
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        startIcon={<AutoFixHighIcon />}
                        disabled={recalculateAiMutation.isPending}
                        onClick={() => recalculateAiMutation.mutate(row.id)}
                      >
                        Re-Score AI
                      </Button>
                    </Stack>
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
