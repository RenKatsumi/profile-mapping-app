import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import ProfileCard from '../components/ProfileCard';
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../config";


const ProfileList = () => {
  const [profiles, setProfiles] = useState([]); // State to store profiles
  const [loading, setLoading] = useState(true); // Loading state
 
  // Fetch profiles from Firestore when component mounts
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "profiles")); // Fetch data from "profiles" collection
        const profilesArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })); // Map Firestore data to include id
        setProfiles(profilesArray); // Set profiles to state
      } catch (error) {
        console.error("Error fetching profiles: ", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchProfiles();
  }, []); // Empty dependency array means this effect runs once on component mount

  // If data is still loading
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container spacing={4} columnSpacing={3}>
    {profiles.map((profile) => (
      <Grid item xs={12} sm={6} md={3} lg={2} key={profile.id}>
        <ProfileCard profile={profile} />
      </Grid>
    ))}
  </Grid>
  );
};

export default ProfileList;
