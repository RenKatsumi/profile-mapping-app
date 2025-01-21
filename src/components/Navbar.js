// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static" style={{ marginBottom: '20px' }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Profile Mapping App
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/profiles">
          Profiles
        </Button>
        <Button color="inherit" component={Link} to="/admin">
          Admin Panel
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
