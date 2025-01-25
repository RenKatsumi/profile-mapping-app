import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { db } from "../config";
import { collection, getDocs } from "firebase/firestore";

const createCustomIcon = (avatarUrl) =>
  L.divIcon({
    html: `
      <div style="
        width: 50px;
        height: 50px;
        border: 3px solid white;
        border-radius: 50%;
        background-image: url('${avatarUrl || "default-avatar-url.jpg"}'); 
        background-size: cover;
        background-position: center;
        box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
      "></div>
    `,
    className: "custom-icon",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
  });

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const HomeProfileMap = () => {
  const [profiles, setProfiles] = useState([]);
  const [path, setPath] = useState([]); // Stores the sequence of points for the dotted line
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "profiles"));
        const profilesArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProfiles(profilesArray);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    if (profiles.length === 0) return;

    const calculatePath = () => {
  const remainingProfiles = [...profiles];
  const visitedPath = [];
  let currentProfile = remainingProfiles.shift(); // Start with the first profile
  visitedPath.push([currentProfile.latitude, currentProfile.longitude]);

  while (remainingProfiles.length > 0) {
    // Make a local copy of `currentProfile` inside the loop
    const current = { ...currentProfile };

    // Find the nearest profile
    let nearestIndex = 0;
    let shortestDistance = Infinity;

    remainingProfiles.forEach((profile, index) => {
      const distance = calculateDistance(
        current.latitude,
        current.longitude,
        profile.latitude,
        profile.longitude
      );
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestIndex = index;
      }
    });

    // Update the current profile and add to path
    currentProfile = remainingProfiles.splice(nearestIndex, 1)[0];
    visitedPath.push([currentProfile.latitude, currentProfile.longitude]);
  }

  return visitedPath;
};

    const fullPath = calculatePath();
    let currentIndex = 1;

    // Animate the path one segment at a time
    const interval = setInterval(() => {
      if (currentIndex < fullPath.length) {
        setPath(fullPath.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval); // Stop the animation once all segments are drawn
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [profiles]);

  if (loading) {
    return <p>Loading profiles...</p>;
  }

  return (
    <MapContainer
  style={{ height: "500px", width: "100%" }}
  center={[0, 0]} // Default center
  zoom={2} // Default zoom
  minZoom={2} // Restrict zoom-out level
  maxBounds={[
    [-90, -180], // Southwest corner of the map
    [90, 180], // Northeast corner of the map
  ]} // Prevent scrolling out of bounds
  maxBoundsViscosity={1.0} // Ensure the map sticks to bounds
>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution="&copy; OpenStreetMap contributors"
  />
  {profiles.map((profile) => (
    <Marker
      key={profile.id}
      position={[profile.latitude, profile.longitude]}
      icon={createCustomIcon(profile.avatar)}
    >
      <Popup>
        <strong>{profile.name}</strong>
        <p>{profile.description}</p>
      </Popup>
    </Marker>
  ))}
  {/* Dotted Polyline for path */}
  <Polyline
    positions={path}
    pathOptions={{ color: "red", dashArray: "10, 10", weight: 3 }}
  />
</MapContainer>
  );
};

export default HomeProfileMap;
