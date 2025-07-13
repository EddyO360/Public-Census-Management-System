import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, IconButton, CircularProgress, Alert, Button } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import LogoutIcon from '@mui/icons-material/Logout';
import { getCensusStatistics, getAllEnumerators } from '../services/censusService';

function AdminDashboard({ onToggleTheme, mode, onLogout }) {
  const [stats, setStats] = useState(null);
  const [enumerators, setEnumerators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsData, enumeratorsData] = await Promise.all([
        getCensusStatistics(),
        getAllEnumerators()
      ]);
      setStats(statsData);
      setEnumerators(enumeratorsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRetry = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Dashboard Overview
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={onToggleTheme} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            {onLogout && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={onLogout}
                size="small"
              >
                Logout
              </Button>
            )}
          </Box>
        </Box>
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  // Calculate dashboard metrics
  const totalRecords = stats?.totalRecords || 0;
  const totalHouseholds = totalRecords; // Each record represents one household
  const genderCounts = {
    male: stats?.genderDistribution?.male || 0,
    female: stats?.genderDistribution?.female || 0
  };
  const totalPeople = totalRecords + (stats?.householdSizeDistribution ? 
    Object.entries(stats.householdSizeDistribution).reduce((sum, [size, count]) => {
      const householdSize = parseInt(size);
      return sum + (householdSize > 1 ? (householdSize - 1) * count : 0);
    }, 0) : 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard Overview
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={onToggleTheme} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          {onLogout && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={onLogout}
              size="small"
            >
              Logout
            </Button>
          )}
        </Box>
      </Box>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <PeopleIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6">Total People</Typography>
              <Typography variant="h4">{totalPeople}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <HomeIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6">Total Households</Typography>
              <Typography variant="h4">{totalHouseholds}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <MaleIcon color="info" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6">Males</Typography>
              <Typography variant="h4">{genderCounts.male}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <FemaleIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6">Females</Typography>
              <Typography variant="h4">{genderCounts.female}</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {enumerators.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Enumerators
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {Object.keys(stats?.countyDistribution || {}).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Counties Covered
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {Object.keys(stats?.educationDistribution || {}).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Education Levels
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {stats?.disabilityDistribution?.yes || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              People with Disabilities
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {totalRecords === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No census data available yet. Data will appear here once census forms are submitted.
        </Alert>
      ) : (
        <Typography variant="body1">
          Welcome to the admin dashboard. Use the sidebar to navigate to different sections.
        </Typography>
      )}
    </Box>
  );
}

export default AdminDashboard;
