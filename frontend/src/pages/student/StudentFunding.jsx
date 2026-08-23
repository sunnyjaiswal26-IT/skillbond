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
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import api from '../../config/axios';

const StudentFunding = () => {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    requestedAmount: 150000, // ₹ 1,50,000 INR
    isaPercentage: 7.5,
    durationMonths: 36,
    collegeName: 'COEP Technological University, Pune',
    branch: 'Computer Engineering',
    degree: 'B.Tech',
    currentYear: 'Third Year (TE)',
    expectedGraduationYear: 2027,
    reason: 'Final Year B.Tech tuition fee support & Cloud Security Capstone Lab hardware.',
  });

  const { data: requests, isLoading } = useQuery({
    queryKey: ['myFundingRequests'],
    queryFn: async () => (await api.get('/student/funding-requests')).data,
  });

  const createMutation = useMutation({
    mutationFn: async (payload) => (await api.post('/student/funding-request', payload)).data,
    onSuccess: () => {
      setSuccess('ISA Funding request submitted successfully for Admin review!');
      setOpenModal(false);
      queryClient.invalidateQueries(['myFundingRequests']);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to submit request.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  return (
    <Box maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            ISA Funding Proposals (₹ Rupees)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Submit and track your Income Share Agreement (ISA) proposals.
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
          New ISA Request
        </Button>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {requests && requests.length > 0 ? (
            requests.map((req) => (
              <Grid item xs={12} key={req.id}>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography variant="h5" fontWeight={800} color="success.main">
                        ₹ {req.requestedAmount?.toLocaleString()}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 0.5 }}>
                        {req.branch || req.degree} — {req.collegeName || req.college}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Reason: {req.reason}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                        Terms: {req.isaPercentage}% Income Share for {req.durationMonths} Months Post-Graduation
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
                      sx={{ fontWeight: 700, fontSize: '0.9rem', py: 1.5, px: 1 }}
                    />
                  </Box>
                </Paper>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                <Typography color="text.secondary">No funding requests found.</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {/* CREATE FUNDING REQUEST DIALOG */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create ISA Funding Request (₹ INR)</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Requested Amount (₹ Rupees)"
                type="number"
                value={form.requestedAmount}
                onChange={(e) => setForm({ ...form, requestedAmount: Number(e.target.value) })}
                required
                helperText="e.g. 150000 for ₹ 1,50,000"
              />
              <TextField
                fullWidth
                label="Proposed ISA Percentage (%)"
                type="number"
                inputProps={{ step: '0.1' }}
                value={form.isaPercentage}
                onChange={(e) => setForm({ ...form, isaPercentage: Number(e.target.value) })}
                required
              />
              <TextField
                fullWidth
                label="Duration (Months)"
                type="number"
                value={form.durationMonths}
                onChange={(e) => setForm({ ...form, durationMonths: Number(e.target.value) })}
                required
              />
              <TextField
                fullWidth
                label="College Name"
                value={form.collegeName}
                onChange={(e) => setForm({ ...form, collegeName: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Engineering Branch"
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
                required
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Purpose / Reason for Funding"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                required
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default StudentFunding;
