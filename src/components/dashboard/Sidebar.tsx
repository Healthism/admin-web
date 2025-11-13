import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Home as HomeIcon,
  Upload as UploadIcon,
  MedicalServices as OrderIcon,
  Logout as LogoutIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import Logo from '../../assets/logo/color-Logo.webp';

const drawerWidth = 240;

interface SidebarItem {
  text: string;
  icon: React.ReactNode;
  route: string;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRole = localStorage.getItem('selectedRole'); // lab | pharmacy

  // Role-based items
  const labSidebarItems: SidebarItem[] = [
    { text: 'Dashboard', icon: <HomeIcon />, route: '/dashboard' },
    { text: 'Upload', icon: <UploadIcon />, route: '/upload' },
    { text: 'View Report', icon: <DescriptionIcon />, route: '/view-upload' },
  ];

  const pharmacySidebarItems: SidebarItem[] = [
    { text: 'Dashboard', icon: <HomeIcon />, route: '/pharmacy' },
    { text: 'Orders', icon: <OrderIcon />, route: '/order' },
  ];

  // Final items to render
  const mainSidebarItems =
    selectedRole === 'lab' ? labSidebarItems : pharmacySidebarItems;

  const bottomSidebarItems: SidebarItem[] = [
    { text: 'Log out', icon: <LogoutIcon />, route: '/logout' },
  ];

  const handleNavigation = (route: string, text: string) => {
    if (text === 'Log out') {
      window.localStorage.clear();
      navigate('/');
      window.location.reload();
      return;
    }
    navigate(route);
  };

const isSelected = (route: string) => {
  const currentPath = location.pathname;

  if (route === '/dashboard') {
    return currentPath === '/dashboard';
  } else if (route === '/upload') {
    return (
      currentPath === '/upload' ||
      currentPath === '/upload/upload-report' ||
      (currentPath.startsWith('/upload/') && !currentPath.includes('/view-report'))
    );
  } else if (route === '/view-upload') {
    return (
      currentPath === '/view-upload' || 
      currentPath.startsWith('/view-upload/') || 
      currentPath === '/upload/view-report'
    );
  } else if (route === '/pharmacy') {
    return currentPath === '/pharmacy';
  } else if (route === '/order') {
    return (
      currentPath === '/order' ||
      currentPath.startsWith('/order/') ||
      currentPath === '/order/order-details'
    );
  }

  return currentPath === route;
};

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#ffffffff',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Logo Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={Logo} alt="logo" />
      </Box>

      {/* Main Navigation */}
      <List sx={{ px: 2, flex: 1 }}>
        {mainSidebarItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.route, item.text)}
              sx={{
                borderRadius: 2,
                bgcolor: isSelected(item.route) ? '#00a6bb' : 'transparent',
                color: isSelected(item.route) ? 'white' : '#000000ff',
                '&:hover': {
                  bgcolor: isSelected(item.route)
                    ? '#008a9a'
                    : 'rgba(148, 163, 184, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '14px',
                  fontWeight: isSelected(item.route) ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Bottom Navigation */}
      <List sx={{ px: 2, mt: 'auto' }}>
        {bottomSidebarItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.route, item.text)}
              sx={{
                borderRadius: 2,
                bgcolor: 'transparent',
                color: '#000000ff',
                '&:hover': {
                  bgcolor: 'rgba(148, 163, 184, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '14px',
                  fontWeight: 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;