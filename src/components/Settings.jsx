import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Avatar, 
  Divider, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Paper
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  GitHub,
  LinkedIn,
  Business,
  Info,
  ContactSupport,
  Close,
  AccountCircle,
  AdminPanelSettings,
  Badge,
  CalendarToday
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import packageJson from '../../package.json';

function Settings() {
  const { currentUser, userData } = useAuth();
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  const handleContactDialogOpen = () => {
    setContactDialogOpen(true);
  };

  const handleContactDialogClose = () => {
    setContactDialogOpen(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Settings & Information
      </Typography>

      <Grid container spacing={3}>
        {/* Current User Information */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    bgcolor: 'primary.main',
                    mr: 2
                  }}
                >
                  {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                </Avatar>
    <Box>
                  <Typography variant="h6" gutterBottom>
                    {userData?.displayName || currentUser?.displayName || 'User'}
                  </Typography>
                  <Chip 
                    label={userData?.role || 'User'} 
                    color={userData?.role === 'admin' ? 'primary' : 'secondary'}
                    icon={userData?.role === 'admin' ? <AdminPanelSettings /> : <Badge />}
                    size="small"
                  />
                </Box>
              </Box>

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Email color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email Address"
                    secondary={currentUser?.email || 'N/A'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Person color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Display Name"
                    secondary={userData?.displayName || currentUser?.displayName || 'N/A'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AdminPanelSettings color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Role"
                    secondary={userData?.role || 'N/A'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Account Created"
                    secondary={formatDate(userData?.createdAt)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Last Updated"
                    secondary={formatDate(userData?.lastUpdated)}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* App Information */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Info color="primary" sx={{ mr: 1 }} />
                Application Information
              </Typography>
              
              <List dense>
                <ListItem>
                                     <ListItemText 
                     primary="App Name"
                     secondary="Public Census Management System"
                   />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Version"
                    secondary={packageJson.version}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Environment"
                    secondary={import.meta.env.MODE === 'development' ? 'Development' : 'Production'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Build Date"
                    secondary={new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />
              
              <Button
                variant="contained"
                startIcon={<ContactSupport />}
                onClick={handleContactDialogOpen}
                fullWidth
                sx={{ mt: 2 }}
              >
                Contact Developer
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Contact Developer Dialog */}
      <Dialog 
        open={contactDialogOpen} 
        onClose={handleContactDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Contact Developer</Typography>
            <IconButton onClick={handleContactDialogClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'primary.main',
                mx: 'auto',
                mb: 2
              }}
            >
              <AccountCircle sx={{ fontSize: 60 }} />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              Eddy Ochieng
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Full Stack Developer
            </Typography>
          </Box>

          <List>
            <ListItem>
              <ListItemIcon>
                <Email color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Email"
                secondary="eddyoduor364@gmail.com"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Phone color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Phone"
                secondary="+254 7950 45678"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Business color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Location"
                secondary="Nairobi, Kenya"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <GitHub color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="GitHub"
                secondary="EddyO360"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LinkedIn color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="LinkedIn"
                secondary="Eddy Oduor"
              />
            </ListItem>
          </List>

          <Paper sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
            <Typography variant="body2" color="text.secondary">
              <strong>About the Developer:</strong> Eddy is a passionate full-stack developer with expertise in React, 
              Firebase, and modern web technologies. This Census Management System was developed to streamline 
              data collection and management processes for public administration.
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleContactDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Settings; 