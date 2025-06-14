import { useEffect, useState } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Position } from '../utils/csvParser';
import { parseCSV } from '../utils/csvParser';

export const Dashboard = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [totalPnl, setTotalPnl] = useState(0);

  useEffect(() => {
    fetch('/src/data/positions.csv')
      .then((response) => response.text())
      .then((data) => {
        const parsedData = parseCSV(data);
        setPositions(parsedData);
        const total = parsedData.reduce((sum, pos) => sum + pos.pnl, 0);
        setTotalPnl(total);
      })
      .catch((error) => console.error('Error loading CSV:', error));
  }, []);

  const columns = [
    { field: 'instrument', headerName: 'Instrument', width: 250 },
    { field: 'quantity', headerName: 'Qty', width: 100 },
    {
      field: 'averagePrice',
      headerName: 'Avg Price',
      width: 130,
      valueFormatter: (params: any) => `₹${params.value.toLocaleString()}`,
    },
    {
      field: 'lastTradedPrice',
      headerName: 'LTP',
      width: 130,
      valueFormatter: (params: any) => `₹${params.value.toLocaleString()}`,
    },
    {
      field: 'pnl',
      headerName: 'P&L',
      width: 130,
      valueFormatter: (params: any) => `₹${params.value.toLocaleString()}`,
      cellClassName: (params: any) =>
        params.value >= 0 ? 'positive-pnl' : 'negative-pnl',
    },
    {
      field: 'change',
      headerName: 'Chg %',
      width: 130,
      valueFormatter: (params: any) => `${params.value.toFixed(2)}%`,
      cellClassName: (params: any) =>
        params.value >= 0 ? 'positive-change' : 'negative-change',
    },
  ];

  const chartData = positions.map((pos) => ({
    name: pos.instrument.split(' ')[0],
    pnl: pos.pnl,
  }));

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2,
      height: '100%',
      overflow: 'hidden',
      p: 2
    }}>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: 2,
        flexShrink: 0
      }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Total P&L
          </Typography>
          <Typography
            variant="h4"
            color={totalPnl >= 0 ? 'success.main' : 'error.main'}
          >
            ₹{totalPnl.toLocaleString()}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Open Positions
          </Typography>
          <Typography variant="h4" color="primary">
            {positions.length}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Net Quantity
          </Typography>
          <Typography variant="h4" color="primary">
            {positions.reduce((sum, pos) => sum + pos.quantity, 0)}
          </Typography>
        </Paper>
      </Box>

      <Paper sx={{ 
        p: 2, 
        flexShrink: 0,
        height: 300
      }}>
        <Typography variant="h6" gutterBottom>
          P&L Distribution
        </Typography>
        <Box sx={{ height: 'calc(100% - 40px)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="pnl"
                stroke="#2196f3"
                name="P&L"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      <Paper sx={{ 
        p: 2, 
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Typography variant="h6" gutterBottom>
          Open Positions
        </Typography>
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <DataGrid
            rows={positions}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            sx={{
              '& .positive-pnl': {
                color: 'success.main',
              },
              '& .negative-pnl': {
                color: 'error.main',
              },
              '& .positive-change': {
                color: 'success.main',
              },
              '& .negative-change': {
                color: 'error.main',
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}; 