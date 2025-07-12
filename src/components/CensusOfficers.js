import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getAllEnumerators, saveEnumerator, updateEnumerator, deleteEnumerator } from '../services/censusService';

function CensusOfficers() {
  const [enumerators, setEnumerators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEnumerator, setEditingEnumerator] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    county: '',
    subCounty: '',
    ward: '',
    status: 'active'
  });

  useEffect(() => {
    loadEnumerators();
  }, []);

  const loadEnumerators = async () => {
    try {
      setLoading(true);
      const data = await getAllEnumerators();
      setEnumerators(data);
    } catch (error) {
      console.error('Error loading enumerators:', error);
      setError('Failed to load enumerators');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const enumeratorData = {
        ...formData,
        displayName: `${formData.firstName} ${formData.lastName}`,
        fullName: `${formData.firstName} ${formData.lastName}`
      };

      if (editingEnumerator) {
        await updateEnumerator(editingEnumerator.id, enumeratorData);
      } else {
        await saveEnumerator(enumeratorData);
      }

      setOpenDialog(false);
      setEditingEnumerator(null);
      resetForm();
      loadEnumerators();
    } catch (error) {
      console.error('Error saving enumerator:', error);
      setError('Failed to save enumerator');
    }
  };

  const handleEdit = (enumerator) => {
    setEditingEnumerator(enumerator);
    setFormData({
      firstName: enumerator.firstName || enumerator.displayName?.split(' ')[0] || '',
      lastName: enumerator.lastName || enumerator.displayName?.split(' ')[1] || '',
      email: enumerator.email || '',
      phone: enumerator.phone || '',
      county: enumerator.county || '',
      subCounty: enumerator.subCounty || '',
      ward: enumerator.ward || '',
      status: enumerator.status || 'active'
    });
    setOpenDialog(true);
  };

  const handleDelete = async (enumeratorId) => {
    if (window.confirm('Are you sure you want to delete this enumerator?')) {
      try {
        await deleteEnumerator(enumeratorId);
        loadEnumerators();
      } catch (error) {
        console.error('Error deleting enumerator:', error);
        setError('Failed to delete enumerator');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      county: '',
      subCounty: '',
      ward: '',
      status: 'active'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Census Officers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingEnumerator(null);
            resetForm();
            setOpenDialog(true);
          }}
        >
          Add Enumerator
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>County</TableCell>
                <TableCell>Sub-County</TableCell>
                <TableCell>Ward</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enumerators.map((enumerator) => (
                <TableRow key={enumerator.id}>
                  <TableCell>{enumerator.displayName || enumerator.fullName}</TableCell>
                  <TableCell>{enumerator.email}</TableCell>
                  <TableCell>{enumerator.phone}</TableCell>
                  <TableCell>{enumerator.county}</TableCell>
                  <TableCell>{enumerator.subCounty}</TableCell>
                  <TableCell>{enumerator.ward}</TableCell>
                  <TableCell>
                    <Chip
                      label={enumerator.status}
                      color={enumerator.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(enumerator)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(enumerator.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingEnumerator ? 'Edit Enumerator' : 'Add New Enumerator'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
            <TextField
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              fullWidth
            />
            <TextField
              label="County"
              value={formData.county}
              onChange={(e) => setFormData({ ...formData, county: e.target.value })}
              fullWidth
            />
            <TextField
              label="Sub-County"
              value={formData.subCounty}
              onChange={(e) => setFormData({ ...formData, subCounty: e.target.value })}
              fullWidth
            />
            <TextField
              label="Ward"
              value={formData.ward}
              onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingEnumerator ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CensusOfficers; 