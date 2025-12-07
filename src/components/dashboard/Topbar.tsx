import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
} from '@mui/material';
import {
  Person as PersonIcon,
} from '@mui/icons-material';



interface TopBarProps {
  title?: string;
  subtitle?: string;
  notifications?: Notification[];
}

const TopBar: React.FC<TopBarProps> = ({ 
  title,
  subtitle = "Here's what's scheduled for today.",
}) => {
  const navigate = useNavigate();


  const displayTitle = title  
  

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          bgcolor: 'white', 
          padding: 0,
          margin: 0,
          borderBottom: '1px solid #e5e7eb',
          color: '#1e293b',
          borderRadius: 0,
          top: 0,
          left: '240px',
          right: 0,
          zIndex: 1300,
          width: 'calc(100% - 240px)',
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          padding: '10px 24px !important',
          margin: 0,
        }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>
              Welcome {displayTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
       
            
            <Avatar
              sx={{ 
                bgcolor: '#00a6bb',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: '#0088a3',
                }
              }}
              onClick={handleProfileClick}
            >
              <PersonIcon />
            </Avatar>
          </Box>
          
        </Toolbar>
      </AppBar>
    </>
  );
};

export default TopBar;