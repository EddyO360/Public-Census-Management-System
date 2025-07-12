import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  IconButton,
  InputAdornment,
  Autocomplete,
  Divider,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import { counties, subCounties, wards } from '../data/kenyaLocations';
import { useAuth } from '../contexts/AuthContext';
import { saveCensusData } from '../services/censusService';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: theme.shadows[4],
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[8],
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

function CensusForm({ onToggleTheme, mode }) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    county: '',
    subCounty: '',
    ward: '',
    education: '',
    employment: '',
    occupation: '',
    householdSize: '',
    householdMembers: [],
    hasDisability: 'no',
    disabilityType: '',
  });

  const [errors, setErrors] = useState({});
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [selectedSubCounty, setSelectedSubCounty] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [householdMember, setHouseholdMember] = useState({
    name: '',
    age: '',
    gender: '',
    relationship: '',
    education: '',
    occupation: '',
    hasDisability: 'no',
    disabilityType: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleCountyChange = (event, newValue) => {
    setSelectedCounty(newValue);
    setSelectedSubCounty(null);
    setSelectedWard(null);
    setFormData((prev) => ({
      ...prev,
      county: newValue || '',
      subCounty: '',
      ward: '',
    }));
  };

  const handleSubCountyChange = (event, newValue) => {
    setSelectedSubCounty(newValue);
    setSelectedWard(null);
    setFormData((prev) => ({
      ...prev,
      subCounty: newValue || '',
      ward: '',
    }));
  };

  const handleWardChange = (event, newValue) => {
    setSelectedWard(newValue);
    setFormData((prev) => ({
      ...prev,
      ward: newValue || '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    // Add validation logic here
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await saveCensusData(formData, currentUser.uid);
      setSuccessMessage('Census data submitted successfully!');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        idNumber: '',
        dateOfBirth: '',
        gender: '',
        maritalStatus: '',
        county: '',
        subCounty: '',
        ward: '',
        education: '',
        employment: '',
        occupation: '',
        householdSize: '',
        householdMembers: [],
        hasDisability: 'no',
        disabilityType: '',
      });
      setSelectedCounty(null);
      setSelectedSubCounty(null);
      setSelectedWard(null);
    } catch (error) {
      console.error('Error submitting census data:', error);
      setSuccessMessage('Error submitting data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addHouseholdMember = () => {
    if (householdMember.name && householdMember.age && householdMember.gender) {
      setFormData(prev => ({
        ...prev,
        householdMembers: [...prev.householdMembers, householdMember]
      }));
      setHouseholdMember({
        name: '',
        age: '',
        gender: '',
        relationship: '',
        education: '',
        occupation: '',
        hasDisability: 'no',
        disabilityType: '',
      });
    }
  };

  const removeHouseholdMember = (index) => {
    setFormData(prev => ({
      ...prev,
      householdMembers: prev.householdMembers.filter((_, i) => i !== index)
    }));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <IconButton onClick={onToggleTheme} color="inherit">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>

      <StyledPaper>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Census Data Collection Form
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom align="center">
          Kenyan Census Management System
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          {/* Personal Information Section */}
          <SectionTitle variant="h6">Personal Information</SectionTitle>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="ID Number"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                error={!!errors.idNumber}
                helperText={errors.idNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.gender}>
                <FormLabel>Gender</FormLabel>
                <RadioGroup
                  row
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                  <FormControlLabel value="other" control={<Radio />} label="Other" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.maritalStatus}>
                <FormLabel>Marital Status</FormLabel>
                <RadioGroup
                  row
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                >
                  <FormControlLabel value="single" control={<Radio />} label="Single" />
                  <FormControlLabel value="married" control={<Radio />} label="Married" />
                  <FormControlLabel value="divorced" control={<Radio />} label="Divorced" />
                  <FormControlLabel value="widowed" control={<Radio />} label="Widowed" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Location Information Section */}
          <SectionTitle variant="h6">Location Information</SectionTitle>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                options={counties}
                value={selectedCounty}
                onChange={handleCountyChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    fullWidth
                    label="County"
                    error={!!errors.county}
                    helperText={errors.county}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      {option}
                    </Box>
                  </li>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                options={selectedCounty ? subCounties[selectedCounty] || [] : []}
                value={selectedSubCounty}
                onChange={handleSubCountyChange}
                disabled={!selectedCounty}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    fullWidth
                    label="Sub-County"
                    error={!!errors.subCounty}
                    helperText={errors.subCounty}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      {option}
                    </Box>
                  </li>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                options={selectedSubCounty ? wards[selectedSubCounty] || [] : []}
                value={selectedWard}
                onChange={handleWardChange}
                disabled={!selectedSubCounty}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    fullWidth
                    label="Ward"
                    error={!!errors.ward}
                    helperText={errors.ward}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      {option}
                    </Box>
                  </li>
                )}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Education and Employment Section */}
          <SectionTitle variant="h6">Education and Employment</SectionTitle>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required error={!!errors.education}>
                <InputLabel>Education Level</InputLabel>
                <Select
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  label="Education Level"
                >
                  <MenuItem value="none">No Formal Education</MenuItem>
                  <MenuItem value="primary">Primary</MenuItem>
                  <MenuItem value="secondary">Secondary</MenuItem>
                  <MenuItem value="diploma">Diploma</MenuItem>
                  <MenuItem value="degree">Bachelor's Degree</MenuItem>
                  <MenuItem value="masters">Master's Degree</MenuItem>
                  <MenuItem value="phd">PhD</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required error={!!errors.employment}>
                <InputLabel>Employment Status</InputLabel>
                <Select
                  name="employment"
                  value={formData.employment}
                  onChange={handleChange}
                  label="Employment Status"
                >
                  <MenuItem value="employed">Employed</MenuItem>
                  <MenuItem value="unemployed">Unemployed</MenuItem>
                  <MenuItem value="self-employed">Self-employed</MenuItem>
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="retired">Retired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                error={!!errors.occupation}
                helperText={errors.occupation}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Household Information Section */}
          <SectionTitle variant="h6">Household Information</SectionTitle>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Total Household Size"
                name="householdSize"
                value={formData.householdSize}
                onChange={handleChange}
                error={!!errors.householdSize}
                helperText={errors.householdSize}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Add Household Members
            </Typography>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={householdMember.name}
                      onChange={(e) => setHouseholdMember(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Age"
                      value={householdMember.age}
                      onChange={(e) => setHouseholdMember(prev => ({ ...prev, age: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <FormLabel>Gender</FormLabel>
                      <RadioGroup
                        row
                        value={householdMember.gender}
                        onChange={(e) => setHouseholdMember(prev => ({ ...prev, gender: e.target.value }))}
                      >
                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Relationship to Head</InputLabel>
                      <Select
                        value={householdMember.relationship}
                        label="Relationship to Head"
                        onChange={(e) => setHouseholdMember(prev => ({ ...prev, relationship: e.target.value }))}
                      >
                        <MenuItem value="head">Head of Household</MenuItem>
                        <MenuItem value="spouse">Spouse</MenuItem>
                        <MenuItem value="child">Child</MenuItem>
                        <MenuItem value="parent">Parent</MenuItem>
                        <MenuItem value="sibling">Sibling</MenuItem>
                        <MenuItem value="other">Other Relative</MenuItem>
                        <MenuItem value="non-relative">Non-Relative</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Education Level</InputLabel>
                      <Select
                        value={householdMember.education}
                        label="Education Level"
                        onChange={(e) => setHouseholdMember(prev => ({ ...prev, education: e.target.value }))}
                      >
                        <MenuItem value="none">No Formal Education</MenuItem>
                        <MenuItem value="primary">Primary</MenuItem>
                        <MenuItem value="secondary">Secondary</MenuItem>
                        <MenuItem value="diploma">Diploma</MenuItem>
                        <MenuItem value="degree">Bachelor's Degree</MenuItem>
                        <MenuItem value="masters">Master's Degree</MenuItem>
                        <MenuItem value="phd">PhD</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Occupation"
                      value={householdMember.occupation}
                      onChange={(e) => setHouseholdMember(prev => ({ ...prev, occupation: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <FormLabel>Disability</FormLabel>
                      <RadioGroup
                        row
                        value={householdMember.hasDisability}
                        onChange={(e) => setHouseholdMember(prev => ({ ...prev, hasDisability: e.target.value }))}
                      >
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  {householdMember.hasDisability === 'yes' && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Type of Disability"
                        value={householdMember.disabilityType}
                        onChange={(e) => setHouseholdMember(prev => ({ ...prev, disabilityType: e.target.value }))}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={addHouseholdMember}
                      disabled={!householdMember.name || !householdMember.age || !householdMember.gender}
                    >
                      Add Member
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Display Added Household Members */}
            {formData.householdMembers.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Added Household Members
                </Typography>
                <Grid container spacing={2}>
                  {formData.householdMembers.map((member, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6">
                              {member.name}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => removeHouseholdMember(index)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Age: {member.age} | Gender: {member.gender}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Relationship: {member.relationship}
                          </Typography>
                          {member.education && (
                            <Typography variant="body2" color="text.secondary">
                              Education: {member.education}
                            </Typography>
                          )}
                          {member.occupation && (
                            <Typography variant="body2" color="text.secondary">
                              Occupation: {member.occupation}
                            </Typography>
                          )}
                          {member.hasDisability === 'yes' && (
                            <Typography variant="body2" color="text.secondary">
                              Disability: {member.disabilityType}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Disability Information Section */}
          <SectionTitle variant="h6">Disability Information</SectionTitle>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.hasDisability}>
                <FormLabel>Do you have any disability?</FormLabel>
                <RadioGroup
                  row
                  name="hasDisability"
                  value={formData.hasDisability}
                  onChange={handleChange}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              {formData.hasDisability === 'yes' && (
                <TextField
                  fullWidth
                  label="Type of Disability"
                  name="disabilityType"
                  value={formData.disabilityType}
                  onChange={handleChange}
                  error={!!errors.disabilityType}
                  helperText={errors.disabilityType}
                />
              )}
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => setFormData({})}
              disabled={loading}
            >
              Clear Form
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ px: 4 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
            </Button>
          </Box>
        </Box>
      </StyledPaper>
      
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccessMessage('')} 
          severity={successMessage.includes('Error') ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {successMessage}
                </Alert>
      </Snackbar>
    </Container>
  );
}

export default CensusForm; 