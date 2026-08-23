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
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
          Browse Approved Engineering Students (Maharashtra)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review MHT-CET scores, JEE percentiles, 10th/12th marks, CGPA, college placement stats, and fund student ISA proposals in ₹ (Rupees).
        </Typography>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ p: 2, mb: 4, borderRadius: 3 }}>
        <TextField
          fullWidth
          placeholder="Search student by name, college (COEP, VJTI, PICT...), branch, or city..."
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" fontWeight={800}>{req.studentName}</Typography>
                      <Chip icon={<CheckCircleIcon />} label="Admin Approved" color="success" size="small" sx={{ fontWeight: 700 }} />
                    </Box>

                    <Typography variant="body2" color="primary.main" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      <SchoolIcon fontSize="small" /> {req.collegeName || req.college}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                      {req.branch || 'Computer Engineering'} — {req.currentYear || 'Third Year'} ({req.degree || 'B.Tech'})
                    </Typography>

                    {/* ACADEMIC SCORES & PERCENTILES BADGES */}
                    <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 3, mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ mb: 1 }}>
                        ENTRANCE & ACADEMIC SCORES:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        <Chip label={`MHT-CET: ${req.mhtCetPercentile || '99.65'}%ile`} color="warning" size="small" sx={{ fontWeight: 700 }} />
                        <Chip label={`JEE Main: ${req.jeeMainPercentile || '98.80'}%ile`} color="info" size="small" sx={{ fontWeight: 700 }} />
                        <Chip label={`CGPA: ${req.currentCgpa || '9.12'} / 10`} color="primary" size="small" sx={{ fontWeight: 700 }} />
                        <Chip label={`10th: ${req.tenthPercentage || '94.8'}%`} variant="outlined" size="small" />
                        <Chip label={`12th: ${req.twelfthPercentage || '92.4'}%`} variant="outlined" size="small" />
                      </Stack>
                      
                      {req.collegeAveragePackage && (
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1.5, fontWeight: 600 }}>
                          College Avg Placement Package: ₹ {(req.collegeAveragePackage / 100000).toFixed(1)} Lakhs / yr (LPA)
                        </Typography>
                      )}
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
                    Disburse & Fund (₹ {req.requestedAmount?.toLocaleString()})
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
                Salary Floor: ₹ 4.0 LPA (Zero payment if earning below threshold).
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
