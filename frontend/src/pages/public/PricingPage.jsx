import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { Link as RouterLink } from 'react-router-dom';

const PricingPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <Typography variant="h2" className="gradient-text" sx={{ fontWeight: 800, mb: 2, textAlign: 'center' }}>
        Transparent Maharashtra Engineering ISA Terms
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: 8 }}>
        No upfront tuition debt, zero compounding interest, and repayment starts only after securing a job above ₹ 4.0 LPA.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {[
          { title: 'Standard Engineering ISA', price: '7.5%', term: '36 Months', desc: 'Designed for Third Year (TE) & Final Year (BE/B.Tech) undergrads in Maharashtra.', features: ['0% Interest During College', '₹ 4,00,000 / year (₹ 4 LPA) Salary Floor', '1.5x Maximum Repayment Cap', 'Direct Investor Mentorship & Career Network'] },
          { title: 'Accelerated Tech ISA', price: '5.0%', term: '24 Months', desc: 'Designed for high-CGPA & MHT-CET 99+%ile top engineering rankers.', features: ['0% Interest During College', '₹ 6,00,000 / year (₹ 6 LPA) Salary Floor', '1.3x Maximum Repayment Cap', 'Priority Placement Network Access'] },
        ].map((plan, idx) => (
          <Grid item xs={12} md={5} key={idx}>
            <Card sx={{ p: 4, height: '100%', border: '1px solid', borderColor: idx === 0 ? 'primary.main' : 'divider' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{plan.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{plan.desc}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                  <Typography variant="h3" sx={{ fontWeight: 800 }}>{plan.price}</Typography>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 1 }}>/ {plan.term}</Typography>
                </Box>
                <List sx={{ mb: 4 }}>
                  {plan.features.map((feat, i) => (
                    <ListItem key={i} disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}><CheckIcon color="primary" fontSize="small" /></ListItemIcon>
                      <ListItemText primary={feat} />
                    </ListItem>
                  ))}
                </List>
                <Button component={RouterLink} to="/signup?role=student" variant="contained" color="primary" fullWidth size="large">
                  Apply for Funding
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PricingPage;
