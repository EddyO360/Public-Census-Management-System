import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Alert, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import CensusForm from './components/CensusForm.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import Analytics from './components/Analytics.jsx';
import Reports from './components/Reports.jsx';
import CensusOfficers from './components/CensusOfficers.jsx';
import Settings from './components/Settings.jsx';
import './App.css';

const AppContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
});

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Something went wrong. Please refresh the page and try again.
          </Alert>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </Box>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  const [mode, setMode] = useState('light');
  const { currentUser, userRole, loading, logout } = useAuth();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#1976d2' : '#90caf9',
          },
          secondary: {
            main: mode === 'light' ? '#dc004e' : '#f48fb1',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
        typography: {
          fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          h4: {
            fontWeight: 600,
          },
          h6: {
            fontWeight: 500,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 500,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Show loading spinner while authentication is being checked
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContainer>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <div>Loading...</div>
          </Box>
        </AppContainer>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContainer>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login onToggleTheme={toggleTheme} mode={mode} />} />
            <Route path="/register" element={<Register onToggleTheme={toggleTheme} mode={mode} />} />

            {/* Admin Routes */}
            <Route
              path="/dashboard"
              element={
                currentUser && userRole === 'admin' ? (
                  <DashboardLayout onLogout={handleLogout}>
                    <AdminDashboard onToggleTheme={toggleTheme} mode={mode} onLogout={handleLogout} />
                  </DashboardLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/analytics"
              element={
                currentUser && userRole === 'admin' ? (
                  <DashboardLayout onLogout={handleLogout}>
                    <Analytics />
                  </DashboardLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/reports"
              element={
                currentUser && userRole === 'admin' ? (
                  <DashboardLayout onLogout={handleLogout}>
                    <Reports />
                  </DashboardLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/census-officers"
              element={
                currentUser && userRole === 'admin' ? (
                  <DashboardLayout onLogout={handleLogout}>
                    <CensusOfficers />
                  </DashboardLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/settings"
              element={
                currentUser && userRole === 'admin' ? (
                  <DashboardLayout onLogout={handleLogout}>
                    <Settings />
                  </DashboardLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            
            {/* Shared and Officer Routes */}
            <Route
              path="/census-form"
              element={
                currentUser && (userRole === 'admin' || userRole === 'census-officer') ? (
                  userRole === 'admin' ? (
                    <DashboardLayout onLogout={handleLogout}>
                      <CensusForm onToggleTheme={toggleTheme} mode={mode} />
                    </DashboardLayout>
                  ) : (
                    <CensusForm onToggleTheme={toggleTheme} mode={mode} />
                  )
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Default redirect based on role */}
            <Route
              path="*"
              element={
                !currentUser ? (
                  <Navigate to="/login" replace />
                ) : userRole === 'admin' ? (
                  <Navigate to="/dashboard" replace />
                ) : userRole === 'census-officer' ? (
                  <Navigate to="/census-form" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </Router>
      </AppContainer>
    </ThemeProvider>
  );
}

function App() {
  console.log('App component loaded');
  
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;