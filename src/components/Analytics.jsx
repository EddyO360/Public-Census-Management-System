import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, MenuItem, Select, FormControl, InputLabel, CircularProgress, Alert } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCensusStatistics, getAllEnumerators } from '../services/censusService.jsx';

const chartOptions = [
  { value: 'gender', label: 'Gender Distribution' },
  { value: 'age', label: 'Age Distribution' },
  { value: 'education', label: 'Education Levels' },
  { value: 'employment', label: 'Employment Status' },
  { value: 'county', label: 'Population by County' },
  { value: 'household', label: 'Household Size Distribution' },
  { value: 'disability', label: 'Disability Distribution' },
  { value: 'enumerators', label: 'Enumerator Performance' }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF6699', '#FF4444', '#00B8D9'];

function ChartDisplay({ chartType, stats, enumerators }) {
  if (chartType === 'gender') {
    const data = Object.entries(stats.genderDistribution || {}).map(([name, value]) => ({ name, value }));
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {data.map((entry, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }
  if (chartType === 'age') {
    const data = Object.entries(stats.ageDistribution || {}).map(([name, value]) => ({ name, value }));
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#0088FE" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (chartType === 'education') {
    const data = Object.entries(stats.educationDistribution || {}).map(([name, value]) => ({ name, value }));
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#00C49F" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (chartType === 'employment') {
    const data = Object.entries(stats.employmentDistribution || {}).map(([name, value]) => ({ name, value }));
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {data.map((entry, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }
  if (chartType === 'county') {
    const data = Object.entries(stats.countyDistribution || {}).map(([name, value]) => ({ name, value }));
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#FFBB28" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (chartType === 'household') {
    const data = Object.entries(stats.householdSizeDistribution || {}).map(([name, value]) => ({ name, value }));
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#FF8042" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (chartType === 'disability') {
    const data = Object.entries(stats.disabilityDistribution || {}).map(([name, value]) => ({ name, value }));
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {data.map((entry, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }
  if (chartType === 'enumerators') {
    const data = Object.entries(stats.enumeratorStats || {}).map(([name, value]) => ({ 
      name: enumerators.find(e => e.id === name)?.displayName || name, 
      value 
    }));
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#A28CFF" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  return null;
}

function Analytics() {
  const [chartType, setChartType] = useState('gender');
  const [stats, setStats] = useState(null);
  const [enumerators, setEnumerators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [statsData, enumeratorsData] = await Promise.all([
          getCensusStatistics(),
          getAllEnumerators()
        ]);
        setStats(statsData);
        setEnumerators(enumeratorsData);
      } catch (error) {
        console.error('Error loading analytics data:', error);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Data Visualization
      </Typography>
      
      {/* Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="primary">
            {stats?.totalRecords || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Records
          </Typography>
        </Paper>
        <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="primary">
            {enumerators.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Active Enumerators
          </Typography>
        </Paper>
        <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="primary">
            {Object.keys(stats?.countyDistribution || {}).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Counties Covered
          </Typography>
        </Paper>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <FormControl sx={{ minWidth: 240, mb: 3 }}>
          <InputLabel id="chart-type-label">Select Chart</InputLabel>
          <Select
            labelId="chart-type-label"
            value={chartType}
            label="Select Chart"
            onChange={e => setChartType(e.target.value)}
          >
            {chartOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <ChartDisplay chartType={chartType} stats={stats} enumerators={enumerators} />
      </Paper>
    </Box>
  );
}

export default Analytics; 