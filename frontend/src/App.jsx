import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getTheme } from './theme/theme';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import FeaturesPage from './pages/public/FeaturesPage';
import PricingPage from './pages/public/PricingPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentFunding from './pages/student/StudentFunding';
import StudentRepayment from './pages/student/StudentRepayment';

// Investor Pages
import InvestorDashboard from './pages/investor/InvestorDashboard';
import BrowseStudents from './pages/investor/BrowseStudents';
import InvestorPortfolio from './pages/investor/InvestorPortfolio';
import RoiAnalytics from './pages/investor/RoiAnalytics';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageRequests from './pages/admin/ManageRequests';
import SystemSettingsPage from './pages/admin/SystemSettingsPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [mode, setMode] = useState('dark');
  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes with MainLayout */}
              <Route element={<MainLayout mode={mode} onToggleTheme={toggleTheme} />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
              </Route>

              {/* Protected Student Routes */}
              <Route element={<ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']} />}>
                <Route element={<DashboardLayout mode={mode} onToggleTheme={toggleTheme} />}>
                  <Route path="/student/dashboard" element={<StudentDashboard />} />
                  <Route path="/student/profile" element={<StudentProfile />} />
                  <Route path="/student/funding" element={<StudentFunding />} />
                  <Route path="/student/repayment" element={<StudentRepayment />} />
                </Route>
              </Route>

              {/* Protected Investor Routes */}
              <Route element={<ProtectedRoute allowedRoles={['ROLE_INVESTOR', 'ROLE_ADMIN']} />}>
                <Route element={<DashboardLayout mode={mode} onToggleTheme={toggleTheme} />}>
                  <Route path="/investor/dashboard" element={<InvestorDashboard />} />
                  <Route path="/investor/browse" element={<BrowseStudents />} />
                  <Route path="/investor/portfolio" element={<InvestorPortfolio />} />
                  <Route path="/investor/analytics" element={<RoiAnalytics />} />
                </Route>
              </Route>

              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                <Route element={<DashboardLayout mode={mode} onToggleTheme={toggleTheme} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<ManageUsers />} />
                  <Route path="/admin/requests" element={<ManageRequests />} />
                  <Route path="/admin/settings" element={<SystemSettingsPage />} />
                  <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
                </Route>
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
