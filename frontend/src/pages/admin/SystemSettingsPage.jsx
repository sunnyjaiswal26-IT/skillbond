import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import api from '../../config/axios';

const SystemSettingsPage = () => {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const { data: settings, isLoading } = useQuery({
    queryKey: ['adminSettings'],
    queryFn: async () => (await api.get('/admin/settings')).data,
  });

  const [form, setForm] = useState({
    minIsaPercentage: 4.0,
    maxIsaPercentage: 15.0,
    minSalaryFloorThreshold: 50000,
    maxRepaymentCapMultiplier: 1.6,
    platformFeePercentage: 1.5,
    automaticStudentApprovalEnabled: false,
    maintenanceMode: false,
  });

  useEffect(() => {
    if (settings) {
      setForm({
        minIsaPercentage: settings.minIsaPercentage || 4.0,
        maxIsaPercentage: settings.maxIsaPercentage || 15.0,
        minSalaryFloorThreshold: settings.minSalaryFloorThreshold || 50000,
        maxRepaymentCapMultiplier: settings.maxRepaymentCapMultiplier || 1.6,
        platformFeePercentage: settings.platformFeePercentage || 1.5,
        automaticStudentApprovalEnabled: !!settings.automaticStudentApprovalEnabled,
        maintenanceMode: !!settings.maintenanceMode,
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (updated) => (await api.put('/admin/settings', updated)).data,
    onSuccess: () => {
      setSuccess('Platform settings updated successfully!');
      queryClient.invalidateQueries(['adminSettings']);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to update system settings.');
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : Number(value),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    updateMutation.mutate(form);
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Box maxWidth="lg">
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Global Platform Settings & Controls
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Configure default ISA percentage thresholds, repayment caps, salary floors, and platform toggles.
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          ISA Contract Parameters
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Minimum ISA Percentage (%)"
              name="minIsaPercentage"
              type="number"
              inputProps={{ step: '0.1' }}
              value={form.minIsaPercentage}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Maximum ISA Percentage (%)"
              name="maxIsaPercentage"
              type="number"
              inputProps={{ step: '0.1' }}
              value={form.maxIsaPercentage}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Salary Floor Threshold ($/yr)"
              name="minSalaryFloorThreshold"
              type="number"
              value={form.minSalaryFloorThreshold}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Max Repayment Cap Multiplier (x)"
              name="maxRepaymentCapMultiplier"
              type="number"
              inputProps={{ step: '0.1' }}
              value={form.maxRepaymentCapMultiplier}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Platform Fee Percentage (%)"
              name="platformFeePercentage"
              type="number"
              inputProps={{ step: '0.1' }}
              value={form.platformFeePercentage}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          System Automation & Maintenance Toggles
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.automaticStudentApprovalEnabled}
                  onChange={(e) => setForm({ ...form, automaticStudentApprovalEnabled: e.target.checked })}
                  name="automaticStudentApprovalEnabled"
                  color="primary"
                />
              }
              label="Enable Automatic Student Account Approval"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.maintenanceMode}
                  onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
                  name="maintenanceMode"
                  color="error"
                />
              }
              label="Enable System Maintenance Mode"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SystemSettingsPage;
