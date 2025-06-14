import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  Collapse,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ShowChart as ShowChartIcon,
  AccountBalance as AccountBalanceIcon,
  Settings as SettingsIcon,
  Brightness4,
  Brightness7,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';

const drawerWidth = 240;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  text: string;
  icon?: React.ReactNode;
  path: string;
  subItems?: Omit<MenuItem, 'subItems'>[];
}

const menuItems: MenuItem[] = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/',
  },
  {
    text: 'Total',
    icon: <ShowChartIcon />,
    path: '/total',
  },
  {
    text: 'NIFTY',
    icon: <ShowChartIcon />,
    path: '/nifty',
    subItems: [
      { text: 'JUN', path: '/nifty/jun' },
      { text: 'JUL', path: '/nifty/jul' },
      { text: 'AUG', path: '/nifty/aug' },
    ],
  },
  {
    text: 'BANKNIFTY',
    icon: <ShowChartIcon />,
    path: '/banknifty',
    subItems: [
      { text: 'JUN', path: '/banknifty/jun' },
      { text: 'JUL', path: '/banknifty/jul' },
      { text: 'AUG', path: '/banknifty/aug' },
    ],
  },
  {
    text: 'Account',
    icon: <AccountBalanceIcon />,
    path: '/account',
  },
  {
    text: 'Settings',
    icon: <SettingsIcon />,
    path: '/settings',
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { mode, toggleTheme } = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsDrawerOpen(!isDrawerOpen);
    }
  };

  const handleExpandClick = (path: string) => {
    setExpandedItems(prev =>
      prev.includes(path)
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          F&O Dashboard
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <div key={item.path}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  if (item.subItems) {
                    handleExpandClick(item.path);
                  } else {
                    handleMenuClick(item.path);
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.subItems && (
                  <ListItemSecondaryAction>
                    {expandedItems.includes(item.path) ? <ExpandLess /> : <ExpandMore />}
                  </ListItemSecondaryAction>
                )}
              </ListItemButton>
            </ListItem>
            {item.subItems && (
              <Collapse in={expandedItems.includes(item.path)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItem key={subItem.path} disablePadding>
                      <ListItemButton 
                        sx={{ pl: 4 }}
                        onClick={() => handleMenuClick(subItem.path)}
                      >
                        <ListItemText primary={subItem.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </div>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${isDrawerOpen ? drawerWidth : 0}px)` },
          ml: { sm: `${isDrawerOpen ? drawerWidth : 0}px` },
          transition: 'width 0.2s, margin-left 0.2s',
        }}
      >
        <Toolbar>
          {!isDrawerOpen && !isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Futures & Options Dashboard
          </Typography>
          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ 
          width: { sm: isDrawerOpen ? drawerWidth : 0 }, 
          flexShrink: { sm: 0 },
          position: 'fixed',
          height: '100vh',
        }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : isDrawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              transform: isDrawerOpen ? 'none' : 'translateX(-100%)',
              transition: 'transform 0.2s',
              position: 'relative',
              height: '100vh',
              borderRight: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: `calc(100% - ${isDrawerOpen ? drawerWidth : 0}px)` },
          ml: { sm: `${isDrawerOpen ? drawerWidth : 0}px` },
          transition: 'width 0.2s, margin-left 0.2s',
          height: '100vh',
          overflow: 'hidden',
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}