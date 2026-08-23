import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Link,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'investor' ? 'INVESTOR' : 'STUDENT';

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: defaultRole,
    },
  });

  const currentRole = watch('role', defaultRole);

  const onSubmit = async (data) => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await signup(data);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" textAlign="center" sx={{ fontWeight: 800, mb: 1 }}>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          Join SkillBond to apply for funding or back top talent.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
            <FormLabel component="legend" sx={{ fontWeight: 600, mb: 0.5 }}>I want to join as a:</FormLabel>
            <RadioGroup
              row
              value={currentRole}
              onChange={(e) => setValue('role', e.target.value)}
            >
              <FormControlLabel value="STUDENT" control={<Radio />} label="Student" />
              <FormControlLabel value="INVESTOR" control={<Radio />} label="Investor" />
            </RadioGroup>
          </FormControl>

          <TextField
            fullWidth
            label="Full Name"
            margin="dense"
            {...register('fullName', { required: 'Full name is required' })}
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
          />
          <TextField
            fullWidth
            label="Email Address"
            margin="dense"
            {...register('email', { required: 'Email is required' })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            fullWidth
            label="Phone Number"
            margin="dense"
            {...register('phoneNumber')}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            margin="dense"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 3, py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
          </Button>

          <Typography variant="body2" textAlign="center" color="text.secondary">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" color="primary" underline="hover" sx={{ fontWeight: 700 }}>
              Sign In
            </Link>
          </Typography>

          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              🔒 Admin accounts are system-provisioned only.{' '}
              <Link component={RouterLink} to="/login?admin=true" color="primary" underline="hover">
                Admin Portal Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignupPage;
