import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { parseCSV, type Position } from '../utils/csvParser';
import { useLocation } from 'react-router-dom';

export default function Dashboard() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [filteredPositions, setFilteredPositions] = useState<Position[]>([]);
  const theme = useTheme();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/src/data/positions.csv');
        const csvText = await response.text();
        const parsedData = parseCSV(csvText);
        setPositions(parsedData);
      } catch (error) {
        console.error('Error loading positions:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const path = location.pathname;
    let filtered = positions;

    if (path === '/total') {
      // Show all positions
      filtered = positions;
    } else if (path.startsWith('/nifty')) {
      filtered = positions.filter(p => 
        p.instrument.includes('NIFTY') && !p.instrument.includes('BANKNIFTY')
      );
      if (path.includes('jun')) {
        filtered = filtered.filter(p => p.instrument.includes('JUN'));
      } else if (path.includes('jul')) {
        filtered = filtered.filter(p => p.instrument.includes('JUL'));
      } else if (path.includes('aug')) {
        filtered = filtered.filter(p => p.instrument.includes('AUG'));
      }
    } else if (path.startsWith('/banknifty')) {
      filtered = positions.filter(p => p.instrument.includes('BANKNIFTY'));
      if (path.includes('jun')) {
        filtered = filtered.filter(p => p.instrument.includes('JUN'));
      } else if (path.includes('jul')) {
        filtered = filtered.filter(p => p.instrument.includes('JUL'));
      } else if (path.includes('aug')) {
        filtered = filtered.filter(p => p.instrument.includes('AUG'));
      }
    }

    setFilteredPositions(filtered);
  }, [location.pathname, positions]);

  const totalPnL = filteredPositions.reduce((sum, position) => sum + position.pnl, 0);
  const totalQuantity = filteredPositions.reduce((sum, position) => sum + position.quantity, 0);

  const pnlData = filteredPositions.map(position => ({
    name: position.instrument,
    pnl: position.pnl,
  }));

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 3, 
      p: 3,
      minHeight: 0,
    }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1rem',
        flexShrink: 0,
      }}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total P&L
            </Typography>
            <Typography variant="h4" component="div" color={totalPnL >= 0 ? 'success.main' : 'error.main'}>
              ₹{totalPnL.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Number of Positions
            </Typography>
            <Typography variant="h4" component="div">
              {filteredPositions.length}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Quantity
            </Typography>
            <Typography variant="h4" component="div">
              {totalQuantity}
            </Typography>
          </CardContent>
        </Card>
      </div>

      <Paper sx={{ p: 2, flexShrink: 0 }}>
        <Typography variant="h6" gutterBottom>
          P&L Chart
        </Typography>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={pnlData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="pnl"
                stroke={theme.palette.primary.main}
                name="P&L"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Paper>

      <Paper sx={{ p: 2, flex: 1, minHeight: 0, overflow: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          Positions
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Instrument</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Avg</TableCell>
                <TableCell align="right">LTP</TableCell>
                <TableCell align="right">P&L</TableCell>
                <TableCell align="right">Chg</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPositions.map((position) => (
                <TableRow key={position.id.toString()}>
                  <TableCell>{position.product}</TableCell>
                  <TableCell>{position.instrument}</TableCell>
                  <TableCell align="right">{position.quantity}</TableCell>
                  <TableCell align="right">{position.averagePrice.toFixed(2)}</TableCell>
                  <TableCell align="right">{position.lastTradedPrice.toFixed(2)}</TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: position.pnl >= 0 ? 'success.main' : 'error.main' }}
                  >
                    ₹{position.pnl.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: position.change >= 0 ? 'success.main' : 'error.main' }}
                  >
                    {position.change.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
} 