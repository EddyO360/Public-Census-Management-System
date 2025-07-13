import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse, IconButton, Grid, Card, CardContent, Divider, CircularProgress, Alert, Button
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getAllCensusData } from '../services/censusService';

function Row({ record }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{record.firstName} {record.lastName}</TableCell>
        <TableCell>{record.county}</TableCell>
        <TableCell>{record.subCounty}</TableCell>
        <TableCell>{record.ward}</TableCell>
        <TableCell>{record.householdSize}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom>Personal Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}><b>ID Number:</b> {record.idNumber}</Grid>
                <Grid item xs={12} sm={6}><b>Date of Birth:</b> {record.dateOfBirth}</Grid>
                <Grid item xs={12} sm={6}><b>Gender:</b> {record.gender}</Grid>
                <Grid item xs={12} sm={6}><b>Marital Status:</b> {record.maritalStatus}</Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Education & Employment</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}><b>Education:</b> {record.education}</Grid>
                <Grid item xs={12} sm={6}><b>Employment:</b> {record.employment}</Grid>
                <Grid item xs={12} sm={6}><b>Occupation:</b> {record.occupation || 'N/A'}</Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Household Members</Typography>
              <Grid container spacing={2}>
                {record.householdMembers && record.householdMembers.length > 0 ? (
                  record.householdMembers.map((member, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx}>
                      <Card>
                        <CardContent>
                          <Typography variant="subtitle1">{member.name}</Typography>
                          <Typography variant="body2">Age: {member.age}</Typography>
                          <Typography variant="body2">Gender: {member.gender}</Typography>
                          <Typography variant="body2">Relationship: {member.relationship}</Typography>
                          {member.education && <Typography variant="body2">Education: {member.education}</Typography>}
                          {member.occupation && <Typography variant="body2">Occupation: {member.occupation}</Typography>}
                          <Typography variant="body2">Disability: {member.hasDisability === 'yes' ? member.disabilityType : 'None'}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      No household members recorded
                    </Typography>
                  </Grid>
                )}
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Submission Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}><b>Submitted:</b> {record.submittedAt ? new Date(record.submittedAt.toDate()).toLocaleString() : 'N/A'}</Grid>
                <Grid item xs={12} sm={6}><b>Status:</b> {record.status || 'Submitted'}</Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function Reports() {
  const [censusData, setCensusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReportsData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllCensusData();
      setCensusData(data);
    } catch (error) {
      console.error('Error loading reports data:', error);
      setError(error.message || 'Failed to load reports data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportsData();
  }, []);

  const handleRetry = () => {
    loadReportsData();
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
        <Typography variant="h4" gutterBottom>
          Census Data Reports
        </Typography>
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Census Data Reports
      </Typography>
      
      {censusData.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No census data available yet. Reports will appear here once census forms are submitted.
        </Alert>
      ) : (
        <>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Showing {censusData.length} census records
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Name</TableCell>
                  <TableCell>County</TableCell>
                  <TableCell>Sub-County</TableCell>
                  <TableCell>Ward</TableCell>
                  <TableCell>Household Size</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {censusData.map((record, idx) => (
                  <Row key={record.id || idx} record={record} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}

export default Reports; 