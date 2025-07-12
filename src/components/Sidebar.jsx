import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, Box, Button
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssessmentIcon from '@mui/icons-material/Assessment';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Analytics', icon: <BarChartIcon />, path: '/analytics' },
  { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
  { text: 'Census Officers', icon: <PeopleIcon />, path: '/census-officers' },
  { text: 'Census Form', icon: <AssignmentIcon />, path: '/census-form' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

function Sidebar({ open, onLogout, drawerWidth }) {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItemButton key={item.text} component={RouterLink} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Divider />
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          fullWidth
          onClick={onLogout}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}

export default Sidebar; 