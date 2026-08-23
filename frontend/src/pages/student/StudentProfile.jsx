import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  MenuItem,
  Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SchoolIcon from '@mui/icons-material/School';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import api from '../../config/axios';

const maharashtraColleges = [
  "COEP Technological University, Pune",
  "Veermata Jijabai Technological Institute (VJTI), Mumbai",
  "Pune Institute of Computer Technology (PICT), Pune",
  "Sardar Patel Institute of Technology (SPIT), Mumbai",
  "Vishwakarma Institute of Technology (VIT), Pune",
  "Walchand College of Engineering (WCE), Sangli",
  "Visvesvaraya National Institute of Technology (VNIT), Nagpur",
  "MIT World Peace University (MIT-WPU), Pune",
  "Cummins College of Engineering for Women, Pune",
  "Government College of Engineering, Karad",
  "Government College of Engineering, Aurangabad",
  "Ramdeobaba University (RBU), Nagpur",
  "D. J. Sanghvi College of Engineering (DJSCE), Mumbai",
  "Other Engineering College in Maharashtra"
];

const maharashtraUniversities = [
  "Savitribai Phule Pune University (SPPU)",
  "Mumbai University (MU)",
  "Dr. Babasaheb Ambedkar Technological University (DBATU)",
  "Autonomous (Govt. of Maharashtra)",
  "Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)",
  "Shivaji University, Kolhapur (SUK)",
  "Deemed / Private University"
];

const engineeringBranches = [
  "Computer Engineering",
  "Information Technology (IT)",
  "Artificial Intelligence & Data Science (AI & DS)",
  "Computer Science & Business Systems (CSBS)",
  "Electronics & Telecommunication (EXTC)",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Instrumentation Engineering",
  "Robotics & Automation"
];

const academicYears = [
  "First Year (FE)",
  "Second Year (SE)",
  "Third Year (TE)",
  "Final Year (BE/B.Tech)"
];

const StudentProfile = () => {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const { data: profile, isLoading } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: async () => (await api.get('/student/profile')).data,
  });

  const [formData, setFormData] = useState({
    collegeName: '',
    universityName: '',
    degree: 'B.Tech',
    branch: '',
    currentYear: '',
    expectedGraduationYear: 2027,
    tenthPercentage: 90.0,
    twelfthPercentage: 90.0,
    mhtCetPercentile: 98.0,
    jeeMainPercentile: 95.0,
    jeeAdvancedPercentile: 0.0,
    currentCgpa: 8.5,
    collegeAveragePackage: 800000,
    placementStatus: 'STUDYING',
    currentSalary: 0,
    expectedSalary: 1200000,
    bio: '',
    skills: 'Java, React, Spring Boot, Python',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        collegeName: profile.collegeName || profile.college || 'COEP Technological University, Pune',
        universityName: profile.universityName || 'Savitribai Phule Pune University (SPPU)',
        degree: profile.degree || 'B.Tech',
        branch: profile.branch || 'Computer Engineering',
        currentYear: profile.currentYear || 'Third Year (TE)',
        expectedGraduationYear: profile.expectedGraduationYear || 2027,
        tenthPercentage: profile.tenthPercentage !== undefined ? profile.tenthPercentage : 92.5,
        twelfthPercentage: profile.twelfthPercentage !== undefined ? profile.twelfthPercentage : 90.0,
        mhtCetPercentile: profile.mhtCetPercentile !== undefined ? profile.mhtCetPercentile : 98.5,
        jeeMainPercentile: profile.jeeMainPercentile !== undefined ? profile.jeeMainPercentile : 96.0,
        jeeAdvancedPercentile: profile.jeeAdvancedPercentile !== undefined ? profile.jeeAdvancedPercentile : 0,
        currentCgpa: profile.currentCgpa !== undefined ? profile.currentCgpa : 8.8,
        collegeAveragePackage: profile.collegeAveragePackage !== undefined ? profile.collegeAveragePackage : 950000,
        placementStatus: profile.placementStatus || 'STUDYING',
        currentSalary: profile.currentSalary || 0,
        expectedSalary: profile.expectedSalary || 1200000,
        bio: profile.bio || '',
        skills: profile.skills ? profile.skills.join(', ') : 'Java, Spring Boot, React, MongoDB',
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async (updated) => {
      const payload = {
        ...updated,
        skills: typeof updated.skills === 'string' ? updated.skills.split(',').map((s) => s.trim()) : updated.skills,
      };
      return (await api.put('/student/profile', payload)).data;
    },
    onSuccess: () => {
      setSuccess('Engineering profile & academic scores updated successfully!');
      queryClient.invalidateQueries(['studentProfile']);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to update profile.');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    updateMutation.mutate(formData);
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Box maxWidth="lg">
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Engineering Academic Profile (Maharashtra)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Enter your 10th %, 12th %, MHT-CET, JEE percentiles, CGPA, and engineering college details for investor verification.
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, borderRadius: 4 }}>
        
        {/* SECTION 1: COLLEGE & ENGINEERING DETAILS */}
        <Typography variant="h6" fontWeight={800} color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <SchoolIcon /> Engineering Institution & Branch
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="College Name (Maharashtra)"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              required
            >
              {maharashtraColleges.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="University / Autonomous Authority"
              name="universityName"
              value={formData.universityName}
              onChange={handleChange}
              required
            >
              {maharashtraUniversities.map((u) => (
                <MenuItem key={u} value={u}>{u}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="Engineering Branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
            >
              {engineeringBranches.map((b) => (
                <MenuItem key={b} value={b}>{b}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="Current Academic Year"
              name="currentYear"
              value={formData.currentYear}
              onChange={handleChange}
              required
            >
              {academicYears.map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              label="Expected Graduation Year"
              name="expectedGraduationYear"
              value={formData.expectedGraduationYear}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 4 }} />

        {/* SECTION 2: ACADEMIC MARKS & ENTRANCE EXAM PERCENTILES */}
        <Typography variant="h6" fontWeight={800} color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <WorkspacePremiumIcon /> Entrance Exam Percentiles & Academic Scores
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              inputProps={{ step: '0.01', min: 0, max: 100 }}
              label="MHT-CET Percentile (%)"
              name="mhtCetPercentile"
              value={formData.mhtCetPercentile}
              onChange={handleChange}
              required
              helperText="State Entrance Percentile"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              inputProps={{ step: '0.01', min: 0, max: 100 }}
              label="JEE Main Percentile (%)"
              name="jeeMainPercentile"
              value={formData.jeeMainPercentile}
              onChange={handleChange}
              required
              helperText="National Entrance Percentile"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              inputProps={{ step: '0.01', min: 0, max: 100 }}
              label="JEE Advanced Percentile (Optional)"
              name="jeeAdvancedPercentile"
              value={formData.jeeAdvancedPercentile}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              inputProps={{ step: '0.01', min: 0, max: 100 }}
              label="10th Standard Score (%)"
              name="tenthPercentage"
              value={formData.tenthPercentage}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              inputProps={{ step: '0.01', min: 0, max: 100 }}
              label="12th Standard / Diploma Score (%)"
              name="twelfthPercentage"
              value={formData.twelfthPercentage}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              inputProps={{ step: '0.01', min: 0, max: 10 }}
              label="Current CGPA (out of 10.0)"
              name="currentCgpa"
              value={formData.currentCgpa}
              onChange={handleChange}
              required
              helperText="Cumulative grade point till date"
            />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 4 }} />

        {/* SECTION 3: PLACEMENT STATS & FINANCIAL METRICS (IN RUPEES ₹) */}
        <Typography variant="h6" fontWeight={800} color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CurrencyRupeeIcon /> Placement Stats & Expected Salary (in ₹ Rupees)
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="College Average Placement Package (₹ per annum)"
              name="collegeAveragePackage"
              value={formData.collegeAveragePackage}
              onChange={handleChange}
              required
              helperText="e.g. 1000000 for ₹ 10 LPA"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Expected Salary Post-Graduation (₹ per annum)"
              name="expectedSalary"
              value={formData.expectedSalary}
              onChange={handleChange}
              required
              helperText="e.g. 1400000 for ₹ 14 LPA"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Technical Skills (comma separated)"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              helperText="e.g. Java, Spring Boot, React, Python, Data Structures & Algorithms, MongoDB"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Bio & Career Ambitions"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" color="primary" size="large" startIcon={<SaveIcon />} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save Engineering Profile'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentProfile;
