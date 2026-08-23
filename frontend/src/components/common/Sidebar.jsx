import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import PeopleIcon from '@mui/icons-material/People';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SecurityIcon from '@mui/icons-material/Security';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 260;

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getMenuItems = () => {
    if (!user || !user.roles) return [];
    
    if (user.roles.includes('ROLE_ADMIN')) {
      return [
        { text: 'Overview', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { text: 'User Management', icon: <PeopleIcon />, path: '/admin/users' },
        { text: 'Funding Requests', icon: <AssignmentIcon />, path: '/admin/requests' },
        { text: 'System Settings', icon: <SettingsIcon />, path: '/admin/settings' },
        { text: 'Audit Logs', icon: <SecurityIcon />, path: '/admin/audit-logs' },
      ];
    }

    if (user.roles.includes('ROLE_INVESTOR')) {
      return [
        { text: 'Overview', icon: <DashboardIcon />, path: '/investor/dashboard' },
        { text: 'Browse Students', icon: <SearchIcon />, path: '/investor/browse' },
        { text: 'Portfolio', icon: <MonetizationOnIcon />, path: '/investor/portfolio' },
        { text: 'ROI Analytics', icon: <AnalyticsIcon />, path: '/investor/analytics' },
      ];
    }

    // Default to Student
    return [
      { text: 'Overview', icon: <DashboardIcon />, path: '/student/dashboard' },
      { text: 'My Profile', icon: <AccountCircleIcon />, path: '/student/profile' },
      { text: 'Funding Requests', icon: <MonetizationOnIcon />, path: '/student/funding' },
      { text: 'Repayment Schedule', icon: <PaymentIcon />, path: '/student/repayment' },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" className="gradient-text" sx={{ fontWeight: 800 }}>
          SkillBond
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 700 }}>
          {user?.roles?.includes('ROLE_ADMIN') ? 'Admin Control' : user?.roles?.includes('ROLE_INVESTOR') ? 'Investor Hub' : 'Student Portal'}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <List sx={{ px: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={{
                  borderRadius: 2.5,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'primary.contrastText' : 'text.secondary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'inherit' : 'primary.main', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 700 : 500 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
