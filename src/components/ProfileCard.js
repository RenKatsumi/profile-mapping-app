import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProfileCard = ({ profile }) => {
  const navigate = useNavigate(); 

  const handleViewProfile = () => {
    navigate(`/profile/${profile.id}`); // Redirect to the profile page
  };

  return (
    <Card
      sx={{
        maxWidth: 250,
        margin: '0 auto',
        boxShadow: 3,
        borderRadius: 2,
        padding: 1,
      }}
    >
      {/* Display avatar */}
      {profile.avatar && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 2,
          }}
        >
          <CardMedia
            component="img"
            image={profile.avatar}
            alt={`${profile.name}'s avatar`}
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        </Box>
      )}
      <CardContent>
        <Typography variant="h6" align="center">
          {profile.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {profile.description}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {profile.address}
        </Typography>
      </CardContent>
      <Box textAlign="center" sx={{ paddingBottom: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleViewProfile} // Trigger navigation on button click
        >
          View Summary
        </Button>
      </Box>
    </Card>
  );
};

export default ProfileCard;
