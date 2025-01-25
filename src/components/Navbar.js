import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Home as HomeIcon, Person as PersonIcon, AdminPanelSettings as AdminIcon } from '@mui/icons-material';

const Navbar = () => {
  return (
    <AppBar 
      position="static" 
      sx={{
        backgroundColor: '#1976d2', // Primary color
        marginBottom: 3,
        boxShadow: 4, // Enhance the shadow
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Name */}
        <Typography 
          variant="h6" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 700, 
            letterSpacing: 1 
          }}
        >
          <Link 
            to="/" 
            style={{ 
              textDecoration: 'none', 
              color: 'white' 
            }}
          >
            Profile Mapping App
          </Link>
        </Typography>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/" 
            startIcon={<HomeIcon />}
            sx={{
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
            }}
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/profiles" 
            startIcon={<PersonIcon />}
            sx={{
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
            }}
          >
            Profiles
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/admin" 
            startIcon={<AdminIcon />}
            sx={{
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
            }}
          >
            Admin Panel
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
