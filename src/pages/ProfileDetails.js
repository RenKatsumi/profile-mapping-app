import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { CircularProgress, Card, CardContent, Typography, Divider } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import { db } from "../config";
import { doc, getDoc } from 'firebase/firestore';
import L from 'leaflet';

const ProfileDetails = () => {
  const { id } = useParams(); // Get the profile ID from the URL
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const createCustomIcon = (avatarUrl) =>
    L.divIcon({
      html: `
        <div style="
          width: 50px;
          height: 50px;
          border: 3px solid white;
          border-radius: 50%;
          background-image: url('${avatarUrl}');
          background-size: cover;
          background-position: center;
          box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
        "></div>
      `,
      className: 'custom-icon',
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [0, -50],
    });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'profiles', id); // Get the document reference for the profile by ID
        const docSnap = await getDoc(docRef); // Fetch the document snapshot

        if (docSnap.exists()) {
          setProfile(docSnap.data()); // Set profile data if it exists
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false); // Ensure loading is set to false after data fetching
      }
    };

    fetchProfile();
  }, [id]);

  // If the profile is loading
  if (loading) {
    return <CircularProgress />;
  }

  // If the profile is not found
  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Profile Header */}
      <Typography variant="h4">{profile.name}</Typography>
      <Typography variant="h6" color="textSecondary">{profile.description}</Typography>
      <Typography variant="body1">Address: {profile.address} </Typography>
      <Divider style={{ margin: '20px 0' }} />

      {/*  Information */}
      <Card style={{ marginBottom: '20px' }}>
        <CardContent>
          <Typography variant="h6">About Me</Typography>
          <Typography variant="body1"> 
            The user can write something about themselves here, but i didnt put too much effort for it so here is some Dummy text
          </Typography>    
        </CardContent>
      </Card>

      {/* Map */}
      {profile.latitude && profile.longitude && (
        <MapContainer
          center={{ lat: profile.latitude, lng: profile.longitude }}
          zoom={13}
          style={{ height: '400px', width: '100%', marginTop: '20px' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Marker 
          position={{ lat: profile.latitude, lng: profile.longitude }}
          icon={createCustomIcon(profile.avatar)} // Use the custom icon
         >
            <Popup>{profile.address}</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default ProfileDetails;
