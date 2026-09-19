import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Divider,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import api from '../../config/axios';

const BrowseStudents = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const { data: requests, isLoading } = useQuery({
    queryKey: ['investorFundingRequests'],
    queryFn: async () => (await api.get('/investor/funding-requests')).data,
  });

  const fundMutation = useMutation({
    mutationFn: async (requestId) => (await api.post(`/investor/fund/${requestId}`)).data,
    onSuccess: () => {
      setSuccess('ISA Investment successfully disbursed! Contract is now ACTIVE.');
      setSelectedRequest(null);
      queryClient.invalidateQueries(['investorFundingRequests']);
      queryClient.invalidateQueries(['investorProfile']);
      queryClient.invalidateQueries(['investorPortfolio']);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Investment failed.');
    },
  });

  const filteredRequests = requests?.filter(
    (r) =>
      r.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.collegeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.branch?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.degree?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Browse Open Student ISA Proposals
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Evaluate AI Risk Scores, projected investor ROIs, MHT-CET percentiles, CGPA, and disburse capital.
        </Typography>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ p: 2, mb: 4, borderRadius: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by student name, college (COEP, VJTI, PICT...), branch, or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {filteredRequests && filteredRequests.length > 0 ? (
            filteredRequests.map((req) => (
              <Grid item xs={12} md={6} key={req.id}>
                <Card sx={{ p: 3, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    {/* TOP BAR: NAME & ADMIN APPROVAL */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" fontWeight={800}>{req.studentName}</Typography>
                      <Chip icon={<CheckCircleIcon />} label="Admin Approved" color="success" size="small" sx={{ fontWeight: 700 }} />
                    </Box>

                    <Typography variant="body2" color="primary.main" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <SchoolIcon fontSize="small" /> {req.collegeName || req.college}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                      {req.branch || 'Computer Engineering'} — {req.currentYear || 'Third Year'} ({req.degree || 'B.Tech'})
                    </Typography>

                    {/* AI RISK SCORING & CANDIDATE EVALUATION BANNER */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 3,
                        background: req.aiRiskScore >= 75
                          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.12) 100%)'
                          : 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(239, 68, 68, 0.12) 100%)',
                        border: '1px solid',
                        borderColor: req.aiRiskScore >= 75 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PsychologyIcon color="primary" fontSize="small" />
                          <Typography variant="subtitle2" fontWeight={800}>
                            AI Risk Score: {req.aiRiskScore !== undefined && req.aiRiskScore !== null ? req.aiRiskScore : 'Calculating...'} / 100
                          </Typography>
                        </Box>
                        {req.aiProjectedRoi && (
                          <Chip
                            icon={<TrendingUpIcon />}
                            label={`Projected ROI: ${req.aiProjectedRoi}% / yr`}
                            color="success"
                            size="small"
                            sx={{ fontWeight: 700 }}
                          />
                        )}
                      </Box>
                      {req.aiAnalysisSummary && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          {req.aiAnalysisSummary}
                        </Typography>
                      )}
                    </Paper>

                    {/* ACADEMIC SCORES & PERCENTILES BADGES */}
                    <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 3, mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ mb: 1 }}>
                        ACADEMIC SCORES & MARKS:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {req.mhtCetPercentile && <Chip label={`MHT-CET: ${req.mhtCetPercentile}%ile`} color="warning" size="small" sx={{ fontWeight: 700 }} />}
                        {req.jeeMainPercentile && <Chip label={`JEE Main: ${req.jeeMainPercentile}%ile`} color="info" size="small" sx={{ fontWeight: 700 }} />}
                        {req.currentCgpa && <Chip label={`CGPA: ${req.currentCgpa} / 10`} color="primary" size="small" sx={{ fontWeight: 700 }} />}
                        {req.tenthPercentage && <Chip label={`10th: ${req.tenthPercentage}%`} variant="outlined" size="small" />}
                        {req.twelfthPercentage && <Chip label={`12th: ${req.twelfthPercentage}%`} variant="outlined" size="small" />}
                      </Stack>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      "{req.reason}"
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="text.secondary">Funding Required:</Typography>
                      <Typography fontWeight={800} color="success.main" variant="h6">₹ {req.requestedAmount?.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="text.secondary">ISA Post-Grad Share Rate:</Typography>
                      <Typography fontWeight={700}>{req.isaPercentage}%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography color="text.secondary">Repayment Term:</Typography>
                      <Typography fontWeight={700}>{req.durationMonths} Months</Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CurrencyRupeeIcon />}
                    onClick={() => setSelectedRequest(req)}
                    fullWidth
                    size="large"
                  >
                    Disburse Capital (₹ {req.requestedAmount?.toLocaleString()})
                  </Button>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                <Typography color="text.secondary">No approved engineering student proposals found.</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {/* CONFIRM INVESTMENT MODAL */}
      {selectedRequest && (
        <Dialog open={true} onClose={() => setSelectedRequest(null)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 800 }}>Confirm ISA Disbursement (₹ INR)</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              You are about to disburse <strong>₹ {selectedRequest.requestedAmount?.toLocaleString()}</strong> to back <strong>{selectedRequest.studentName}</strong> ({selectedRequest.collegeName || selectedRequest.college}).
            </Typography>
            <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2 }}>
              <Typography variant="caption" display="block">Contract Terms:</Typography>
              <Typography variant="body2"><strong>{selectedRequest.isaPercentage}%</strong> of monthly salary for <strong>{selectedRequest.durationMonths} Months</strong>.</Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                AI Risk Score: <strong>{selectedRequest.aiRiskScore || 88}/100</strong> (Projected ROI: {selectedRequest.aiProjectedRoi || 13.5}% / yr).
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setSelectedRequest(null)}>Cancel</Button>
            <Button
              variant="contained"
              color="success"
              disabled={fundMutation.isPending}
              onClick={() => fundMutation.mutate(selectedRequest.id)}
            >
              {fundMutation.isPending ? 'Processing...' : 'Disburse Capital (₹ INR)'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default BrowseStudents;
