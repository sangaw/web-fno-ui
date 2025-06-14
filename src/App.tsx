import { ThemeProvider } from './theme/ThemeContext';
import { CssBaseline } from '@mui/material';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Box } from '@mui/material';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }}>
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </Box>
    </ThemeProvider>
  );
}

export default App;
