import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ mode, onToggleTheme }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user || !user.roles) return '/';
    if (user.roles.includes('ROLE_ADMIN')) return '/admin/dashboard';
    if (user.roles.includes('ROLE_INVESTOR')) return '/investor/dashboard';
    return '/student/dashboard';
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: mode === 'dark' ? 'rgba(11, 15, 25, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid',
        borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        boxShadow: 'none',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Typography
            variant="h5"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 800,
              textDecoration: 'none',
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SkillBond
          </Typography>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            <Button component={RouterLink} to="/" color="inherit" sx={{ fontWeight: 500 }}>
              Home
            </Button>
            <Button component={RouterLink} to="/features" color="inherit" sx={{ fontWeight: 500 }}>
              Features
            </Button>
            <Button component={RouterLink} to="/pricing" color="inherit" sx={{ fontWeight: 500 }}>
              Pricing
            </Button>
            <Button component={RouterLink} to="/about" color="inherit" sx={{ fontWeight: 500 }}>
              About
            </Button>
          </Box>

          {/* Action Buttons & Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton onClick={onToggleTheme} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            {isAuthenticated ? (
              <>
                <Button
                  component={RouterLink}
                  to={getDashboardPath()}
                  variant="contained"
                  color="primary"
                  startIcon={<DashboardIcon />}
                  sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  Dashboard
                </Button>
                <Tooltip title="Account Settings">
                  <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                      {user?.fullName?.charAt(0) || 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 180,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <MenuItem onClick={() => { handleMenuClose(); navigate(getDashboardPath()); }}>
                    <DashboardIcon sx={{ mr: 1.5, fontSize: 20 }} /> Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button component={RouterLink} to="/login" color="inherit" sx={{ fontWeight: 600 }}>
                  Log In
                </Button>
                <Button component={RouterLink} to="/signup" variant="contained" color="primary">
                  Get Started
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
