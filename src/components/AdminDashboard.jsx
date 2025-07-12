import React from 'react';
import { Box, Typography, Grid, Card, CardContent, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { getSummary, dummyCensusRecords } from './mockData';

function AdminDashboard({ onToggleTheme, mode }) {
  const { totalPeople, genderCounts, totalHouseholds } = getSummary(dummyCensusRecords);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard Overview
        </Typography>
        <IconButton onClick={onToggleTheme} color="inherit">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
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
      <Typography variant="body1">
        Welcome to the admin dashboard. Use the sidebar to navigate to different sections.
      </Typography>
    </Box>
  );
}

export default AdminDashboard;
