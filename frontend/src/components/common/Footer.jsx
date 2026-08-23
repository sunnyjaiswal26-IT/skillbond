import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className="gradient-text" sx={{ fontWeight: 800, mb: 1 }}>
              SkillBond
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320, mb: 2 }}>
              Revolutionizing student education through transparent, fair, and high-impact Income Share Agreements (ISAs).
            </Typography>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 700, mb: 2 }}>
              Platform
            </Typography>
            <Stack spacing={1}>
              <Link component={RouterLink} to="/features" color="text.secondary" variant="body2" underline="hover">
                Features
              </Link>
              <Link component={RouterLink} to="/pricing" color="text.secondary" variant="body2" underline="hover">
                Pricing
              </Link>
              <Link component={RouterLink} to="/about" color="text.secondary" variant="body2" underline="hover">
                About Us
              </Link>
            </Stack>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 700, mb: 2 }}>
              Students
            </Typography>
            <Stack spacing={1}>
              <Link component={RouterLink} to="/signup?role=student" color="text.secondary" variant="body2" underline="hover">
                Apply for Funding
              </Link>
              <Link component={RouterLink} to="/pricing" color="text.secondary" variant="body2" underline="hover">
                Calculator
              </Link>
              <Link component={RouterLink} to="/login" color="text.secondary" variant="body2" underline="hover">
                Student Portal
              </Link>
            </Stack>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 700, mb: 2 }}>
              Investors
            </Typography>
            <Stack spacing={1}>
              <Link component={RouterLink} to="/signup?role=investor" color="text.secondary" variant="body2" underline="hover">
                Become an Investor
              </Link>
              <Link component={RouterLink} to="/login" color="text.secondary" variant="body2" underline="hover">
                Investor Portal
              </Link>
            </Stack>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 700, mb: 2 }}>
              Legal & Privacy
            </Typography>
            <Stack spacing={1}>
              <Link href="#" color="text.secondary" variant="body2" underline="hover">
                Privacy Policy
              </Link>
              <Link href="#" color="text.secondary" variant="body2" underline="hover">
                Terms of Service
              </Link>
              <Link href="#" color="text.secondary" variant="body2" underline="hover">
                ISA Contract Terms
              </Link>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} SkillBond Inc. All rights reserved.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Designed with Stripe & Vercel minimal aesthetic principles.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
