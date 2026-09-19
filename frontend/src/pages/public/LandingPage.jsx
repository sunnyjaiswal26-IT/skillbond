import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* HERO SECTION */}
      <Box
        sx={{
          py: { xs: 10, md: 16 },
          background: 'radial-gradient(ellipse at 50% -20%, rgba(99, 102, 241, 0.25) 0%, rgba(11, 15, 25, 0) 70%)',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Chip
              icon={<RocketLaunchIcon sx={{ fontSize: 16 }} />}
              label="Empowering Maharashtra Engineering Talent (COEP, VJTI, PICT, SPIT...)"
              color="primary"
              variant="outlined"
              sx={{ mb: 3, py: 2, px: 1, borderRadius: 8, fontWeight: 600 }}
            />
            <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4.5rem' }, fontWeight: 800, mb: 3, lineHeight: 1.1 }}>
              Fund Your Engineering Degree. <br />
              <span className="gradient-text">Pay Only When You Earn.</span>
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 760, mx: 'auto', mb: 5, fontWeight: 400 }}>
              SkillBond connects high-potential Maharashtra engineering students with angel investors through transparent Income Share Agreements (ISAs). Zero upfront tuition debt, no compounding interest rates.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button component={RouterLink} to="/signup?role=student" variant="contained" color="primary" size="large" sx={{ py: 1.8, px: 4, fontSize: '1.1rem' }}>
                Apply as Engineering Student
              </Button>
              <Button component={RouterLink} to="/signup?role=investor" variant="outlined" color="primary" size="large" sx={{ py: 1.8, px: 4, fontSize: '1.1rem' }}>
                Start Investing
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* STATISTICS SECTION (IN RUPEES ₹) */}
      <Container maxWidth="xl" sx={{ mb: 12 }}>
        <Grid container spacing={3}>
          {[
            { metric: '₹ 4.8 Cr+', label: 'Total STEM Capital Funded' },
            { metric: '96.4%', label: 'Engineering Placement Rate' },
            { metric: '1,500+', label: 'Maharashtra Engineers Supported' },
            { metric: '12.8%', label: 'Average Investor Annualized Return' },
          ].map((stat, idx) => (
            <Grid item xs={6} md={3} key={idx}>
              <Card sx={{ textAlign: 'center', py: 4, bgcolor: 'background.paper' }}>
                <Typography variant="h3" className="gradient-text" sx={{ fontWeight: 800 }}>
                  {stat.metric}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontWeight: 600 }}>
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* HOW IT WORKS */}
      <Box sx={{ py: 10, bgcolor: 'background.paper', borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" sx={{ mb: 2, fontWeight: 800 }}>
            How SkillBond Works for Engineering Students
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 8, maxWidth: 600, mx: 'auto' }}>
            A streamlined 3-step lifecycle designed for Maharashtra engineering colleges.
          </Typography>

          <Grid container spacing={4}>
            {[
              { title: '1. Enter Scores & Submit Proposal', desc: 'Detail your 10th/12th %, MHT-CET, JEE percentiles, CGPA, and branch (CS, IT, AI&DS...) to request ISA tuition support.', icon: <SchoolIcon color="primary" sx={{ fontSize: 40 }} /> },
              { title: '2. Get Approved & Funded', desc: 'Admin verifies your academic scores, and angel investors disburse tuition capital.', icon: <TrendingUpIcon color="primary" sx={{ fontSize: 40 }} /> },
              { title: '3. Repay Fairly After Placement', desc: 'Share a fixed % of your monthly salary only after securing a placement job above the ₹ 4.0 LPA salary floor.', icon: <SecurityIcon color="primary" sx={{ fontSize: 40 }} /> },
            ].map((step, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Card sx={{ height: '100%', p: 3 }}>
                  <CardContent>
                    <Box sx={{ mb: 2 }}>{step.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* BENEFITS & COMPARISON */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
              Why Engineers Choose SkillBond Over Traditional Student Loans
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Traditional educational loans compound interest during your 4 years of B.Tech. SkillBond ISAs align your success directly with investor backing.
            </Typography>
            <Stack spacing={2}>
              {[
                'Zero upfront tuition debt during your 4 engineering years',
                'Zero payments if monthly salary is below ₹ 4.0 LPA threshold',
                'Repayment capped at a maximum 1.5x multiplier for borrower safety',
                'Direct mentorship from Maharashtra STEM angel investors & alumni',
              ].map((text, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CheckCircleOutlineIcon color="success" />
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{text}</Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 4, background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(236,72,153,0.1) 100%)', border: '1px solid rgba(99,102,241,0.3)' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Engineering ISA Contract Terms
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Income Share Rate:</Typography>
                  <Typography fontWeight={700}>4.5% - 9.0%</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Repayment Term:</Typography>
                  <Typography fontWeight={700}>24 - 48 Months</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Salary Floor Threshold:</Typography>
                  <Typography fontWeight={700}>₹ 4,00,000 / year (₹ 4 LPA)</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Maximum Repayment Cap:</Typography>
                  <Typography fontWeight={700}>1.5x Funding Amount</Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* FAQS */}
      <Container maxWidth="md" sx={{ pb: 12 }}>
        <Typography variant="h3" textAlign="center" sx={{ mb: 6, fontWeight: 800 }}>
          Frequently Asked Questions
        </Typography>
        {[
          { q: 'What happens if my placement salary is below ₹ 4.0 LPA?', a: 'If your post-graduation salary is below ₹ 4,00,000 per year, your monthly payment pauses automatically with zero penalty or interest.' },
          { q: 'Which Maharashtra engineering colleges are supported?', a: 'All accredited engineering institutions in Maharashtra are supported including COEP Pune, VJTI Mumbai, PICT Pune, SPIT Mumbai, VIT Pune, WCE Sangli, VNIT Nagpur, MIT-WPU, DBATU affiliated, SPPU, and MU colleges.' },
          { q: 'How is student academic score verified?', a: 'Admin verifies MHT-CET scorecards, JEE scorecards, 10th/12th marksheets, and college CGPA transcripts before approving the proposal.' },
        ].map((faq, idx) => (
          <Accordion key={idx} sx={{ mb: 1.5, borderRadius: '12px !important', '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{faq.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">{faq.a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
};

export default LandingPage;
