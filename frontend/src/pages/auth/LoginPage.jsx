import React, { useState, useEffect } from 'react';
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
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAdminTab = searchParams.get('admin') === 'true';

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: isAdminTab ? 'admin@skillbond.com' : 'student@skillbond.com',
      password: isAdminTab ? 'admin123Password!' : 'student123Password!',
    },
  });

  useEffect(() => {
    if (isAdminTab) {
      setValue('email', 'admin@skillbond.com');
      setValue('password', 'admin123Password!');
    }
  }, [isAdminTab, setValue]);

  const setPresetCredentials = (role) => {
    if (role === 'admin') {
      setValue('email', 'admin@skillbond.com');
      setValue('password', 'admin123Password!');
    } else if (role === 'investor') {
      setValue('email', 'investor@skillbond.com');
      setValue('password', 'investor123Password!');
    } else {
      setValue('email', 'student@skillbond.com');
      setValue('password', 'student123Password!');
    }
  };

  const onSubmit = async (data) => {
    try {
      setError('');
      setLoading(true);
      const user = await login(data.email, data.password);
      
      if (user.roles.includes('ROLE_ADMIN')) {
        navigate('/admin/dashboard');
      } else if (user.roles.includes('ROLE_INVESTOR')) {
        navigate('/investor/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
        {isAdminTab ? (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Chip
              icon={<AdminPanelSettingsIcon />}
              label="Admin Portal Authentication"
              color="error"
              sx={{ fontWeight: 700, mb: 1, py: 1.5, px: 1 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              System Administrator Log In
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Admin access is strictly restricted to system-provisioned accounts.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Log in to manage your ISA funding, portfolio, or platform.
            </Typography>
          </Box>
        )}

        {/* QUICK PRESET BUTTONS FOR CONVENIENCE */}
        <Box sx={{ mb: 3, pt: 1 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ mb: 1, textAlign: 'center' }}>
            QUICK LOGIN DEMO ACCENTS:
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center">
            <Chip
              icon={<SchoolIcon sx={{ fontSize: 16 }} />}
              label="Student"
              onClick={() => setPresetCredentials('student')}
              clickable
              size="small"
              variant="outlined"
              color="primary"
            />
            <Chip
              icon={<MonetizationOnIcon sx={{ fontSize: 16 }} />}
              label="Investor"
              onClick={() => setPresetCredentials('investor')}
              clickable
              size="small"
              variant="outlined"
              color="success"
            />
            <Chip
              icon={<AdminPanelSettingsIcon sx={{ fontSize: 16 }} />}
              label="Admin"
              onClick={() => setPresetCredentials('admin')}
              clickable
              size="small"
              variant="outlined"
              color="error"
            />
          </Stack>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            label="Email Address"
            margin="normal"
            {...register('email', { required: 'Email is required' })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            margin="normal"
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1 }}>
            <Link component={RouterLink} to="/forgot-password" variant="caption" color="primary" underline="hover">
              Forgot Password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color={isAdminTab ? "error" : "primary"}
            size="large"
            disabled={loading}
            sx={{ mt: 2, mb: 3, py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : isAdminTab ? 'Sign In to Admin Portal' : 'Sign In'}
          </Button>

          <Typography variant="body2" textAlign="center" color="text.secondary">
            Don't have an account?{' '}
            <Link component={RouterLink} to="/signup" color="primary" underline="hover" sx={{ fontWeight: 700 }}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
