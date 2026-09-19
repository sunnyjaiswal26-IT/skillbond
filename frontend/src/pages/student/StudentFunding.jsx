import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import api from '../../config/axios';

const StudentFunding = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch student profile to check profile completion status
  const { data: profile } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: async () => (await api.get('/student/profile')).data,
  });

  const { data: requests, isLoading } = useQuery({
    queryKey: ['myFundingRequests'],
    queryFn: async () => (await api.get('/student/funding-requests')).data,
  });

  const isProfileComplete = profile && profile.collegeName && profile.branch && profile.currentCgpa;

  const [form, setForm] = useState({
    requestedAmount: 150000, // ₹ 1,50,000 INR
    isaPercentage: 7.5,
    durationMonths: 36,
    reason: 'Tuition fee support & project laboratory equipment.',
  });

  const createMutation = useMutation({
    mutationFn: async (payload) => (await api.post('/student/funding-request', payload)).data,
    onSuccess: () => {
      setSuccess('ISA Funding request submitted successfully! Your academic details have been attached automatically.');
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            ISA Funding Proposals
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Submit and track your Income Share Agreement (ISA) proposals.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            if (!isProfileComplete) {
              setError("Please complete your Engineering Profile in 'My Profile' before creating an ISA request.");
            } else {
              setOpenModal(true);
            }
          }}
        >
          New ISA Request
        </Button>
      </Box>

      {/* PROFILE COMPLETION GUARD ALERT */}
      {!isProfileComplete && (
        <Alert
          severity="warning"
          icon={<WarningAmberIcon fontSize="inherit" />}
          action={
            <Button component={RouterLink} to="/student/profile" color="inherit" size="small" variant="outlined">
              Complete Profile Now
            </Button>
          }
          sx={{ mb: 4, borderRadius: 3 }}
        >
          <strong>Incomplete Engineering Profile:</strong> Please complete your college name, branch, MHT-CET/JEE scores, and CGPA in <strong>My Profile</strong> before submitting an ISA request.
        </Alert>
      )}

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
                        {req.branch || profile?.branch} — {req.collegeName || profile?.collegeName}
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
                <Typography color="text.secondary">No funding requests submitted yet.</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {/* CREATE FUNDING REQUEST DIALOG (CLEAN & NON-REDUNDANT) */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create ISA Funding Request</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            {/* AUTO-ATTACHED PROFILE SUMMARY CARD */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <AccountBoxIcon color="primary" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={700}>
                  Auto-Attached Profile Credentials:
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                College: <strong>{profile?.collegeName}</strong> ({profile?.branch})
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                CGPA: {profile?.currentCgpa} / 10 | MHT-CET: {profile?.mhtCetPercentile || 'N/A'}%ile | JEE: {profile?.jeeMainPercentile || 'N/A'}%ile
              </Typography>
            </Paper>

            <Stack spacing={2.5}>
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
                helperText="Percentage of monthly salary shared post-graduation"
              />
              <TextField
                fullWidth
                label="Duration (Months)"
                type="number"
                value={form.durationMonths}
                onChange={(e) => setForm({ ...form, durationMonths: Number(e.target.value) })}
                required
                helperText="Repayment period (e.g. 36 months)"
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Purpose / Reason for Funding"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                required
                placeholder="Explain what the requested funds will be used for (e.g. tuition fees, hardware capstone project, laptop)..."
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
