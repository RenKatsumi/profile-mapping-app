// src/components/ProfileCard.js
import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProfileCard = ({ profile }) => {
  const navigate = useNavigate();

  const handleSummaryClick = () => {
    // Navigate to ProfileDetails page with profile data
    navigate(`/profile/${profile.id}`, { state: { profile } });
  };

  return (
    <Card style={{ maxWidth: 300, margin: '10px' }}>
      <CardMedia
        component="img"
        height="150"
        image={profile.image}
        alt={profile.name}
      />
      <CardContent>
        <Typography variant="h6">{profile.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          {profile.description}
        </Typography>
        <Button size="small" color="primary" onClick={handleSummaryClick}>
          Summary
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
