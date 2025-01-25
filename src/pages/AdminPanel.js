import React, { useState, useRef, useEffect } from "react";
import { TextField, Button, Grid, Typography, FormControlLabel, Box, Radio, RadioGroup,  Autocomplete} 
  from "@mui/material";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import {db} from "../config";
import { addDoc, collection , query, getDocs,deleteDoc, doc , updateDoc} from "firebase/firestore";


// Dynamically import all avatar images from the assets folder
const importAvatars = () => {
  const avatars = [];
  for (let i = 1; i <= 10; i++) {
    avatars.push(require(`../assets/Avatar${i}.png`));
  }
  return avatars;
};

const AdminPanel = () => {
  const [mode, setMode] = useState("add");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [avatarSelection, setAvatarSelection] = useState("preset");
  const [avatarError, setAvatarError] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [profileNames, setProfileNames] = useState([]);
  const [selectedProfileToDelete, setSelectedProfileToDelete] = useState(null);

  
  const [selectedProfileToEdit, setSelectedProfileToEdit] = useState(null);
  const [selectedProfileId, setSelectedProfileId] = useState(null);

  const mapRef = useRef(); // Reference to the map instance
  const provider = new OpenStreetMapProvider();
  const avatars = importAvatars();

   // Fetch profile names when deletion mode is activated
   useEffect(() => {
    const fetchProfileNames = async () => {
      try {
        const q = query(collection(db, "profiles"));
        const querySnapshot = await getDocs(q);
        const names = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name
        }));
        setProfileNames(names);
      } catch (error) {
        console.error("Error fetching profile names: ", error);
      }
    };

    if (mode === "delete" || mode === "edit") {
      fetchProfileNames();
    }
  }, [mode]);

   // Reset form when mode changes
   useEffect(() => {
    // Reset all form fields
    setName("");
    setDescription("");
    setAddress("");
    setLatitude(null);
    setLongitude(null);
    setSelectedAvatar("");
    setAvatarUrl("");
    setAvatarSelection("preset");
    setAvatarError(false);
  }, [mode]);


  // Handle address input changes
  const handleAddressChange = async (e) => {
    const value = e.target.value;
    setAddress(value);

    if (value) {
      const results = await provider.search({ query: value });
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

   // Handle profile selection for editing
   const handleProfileSelect = (profile) => {
    if (profile) {
      setSelectedProfileId(profile.id);
      setName(profile.name);
      setDescription(profile.description);
      setAddress(profile.address);
      setLatitude(profile.latitude);
      setLongitude(profile.longitude);
      
      // Handle avatar
      if (/^(http|https):\/\/\w+\.\w+/.test(profile.avatar)) {
        setAvatarSelection("url");
        setAvatarUrl(profile.avatar);
      } else {
        setAvatarSelection("preset");
        setSelectedAvatar(profile.avatar);
      }
    }
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!selectedProfileId) {
      alert("Please select a profile to edit");
      return;
    }

    if (!name || !description || !address || !latitude || !longitude) {
      alert("All fields are required!");
      return;
    }

    // Validate avatar selection based on method
    let finalAvatar = "";
    if (avatarSelection === "preset") {
      if (!selectedAvatar) {
        setAvatarError(true);
        return;
      }
      finalAvatar = selectedAvatar;
    } else {
      if (!avatarUrl.trim()) {
        setAvatarError(true);
        return;
      }
      finalAvatar = avatarUrl.trim();
    }

    try {
      const profileRef = doc(db, "profiles", selectedProfileId);
      await updateDoc(profileRef, {
        name,
        description,
        address,
        latitude,
        longitude,
        avatar: finalAvatar,
      });

      alert("Profile updated successfully!");
      
      // Reset form and update profiles list
      setSelectedProfileToEdit(null);
      setSelectedProfileId(null);
      
      // Refresh the list of profiles
      const q = query(collection(db, "profiles"));
      const querySnapshot = await getDocs(q);
      const updatedNames = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProfileNames(updatedNames);

      // Reset form
      setName("");
      setDescription("");
      setAddress("");
      setLatitude(null);
      setLongitude(null);
      setSelectedAvatar("");
      setAvatarUrl("");
      setAvatarSelection("preset");
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Handle profile deletion
  const handleDeleteProfile = async () => {
    if (!selectedProfileToDelete) {
      alert("Please select a profile to delete");
      return;
    }

    try {
      // Delete the selected profile from Firestore
      await deleteDoc(doc(db, "profiles", selectedProfileToDelete.id));
      
      alert(`Profile "${selectedProfileToDelete.name}" deleted successfully!`);
      
      // Refresh the list of profiles
      const updatedProfiles = profileNames.filter(
        profile => profile.id !== selectedProfileToDelete.id
      );
      setProfileNames(updatedProfiles);
      
      // Reset selection
      setSelectedProfileToDelete(null);
    } catch (error) {
      console.error("Error deleting profile: ", error);
      alert("An error occurred while deleting the profile");
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    setAddress(suggestion.label);
    setLatitude(suggestion.y);
    setLongitude(suggestion.x);
    setSuggestions([]);

    // Center and zoom the map to the selected location
    if (mapRef.current) {
      const map = mapRef.current;
      map.flyTo([suggestion.y, suggestion.x], 13, {
        duration: 1.5,
      });
    }
  };

  // Close suggestions dropdown on blur
  const handleBlur = () => {
    setTimeout(() => setSuggestions([]), 200);
  };

  // Handle avatar selection
  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
  };

    // Handle avatar selection method
    const handleAvatarSelectionChange = (e) => {
      setAvatarSelection(e.target.value);
      // Reset selections when switching
      setSelectedAvatar("");
      setAvatarUrl("");
      setAvatarError(false);
    };
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!name || !description || !address || !latitude || !longitude) {
      alert("All fields are required!");
      return;
    }
  
    // Validate avatar selection based on method
    let finalAvatar = "";
    if (avatarSelection === "preset") {
      if (!selectedAvatar) {
        setAvatarError(true);
        return;
      }
      finalAvatar = selectedAvatar;
    } else {
      if (!avatarUrl.trim()) {
        setAvatarError(true);
        return;
      }
      finalAvatar = avatarUrl.trim();
    }
  
    try {
      await addDoc(collection(db, "profiles"), {
        name,
        description,
        address,
        latitude,
        longitude,
        avatar: finalAvatar,
      });
      alert("Profile added successfully!");
      // Reset form fields
      setName("");
      setDescription("");
      setAddress("");
      setLatitude(null);
      setLongitude(null);
      setSelectedAvatar("");
      setAvatarUrl("");
      setAvatarSelection("preset");
      setAvatarError(false);
    } catch (error) {
      console.error("Error adding profile: ", error);
      alert("An error occurred. Please try again.");
    }
  };


  return (

    <div style={{ padding: "20px" }}>
      <Box display="flex" justifyContent="center" mb={2}>
        <Button 
          variant={mode === "add" ? "contained" : "outlined"}
          color="primary" 
          onClick={() => setMode("add")}
          sx={{ mr: 2 }}
        >
          Add Profile
        </Button>
        <Button 
          variant={mode === "edit" ? "contained" : "outlined"}
          color="secondary" 
          onClick={() => setMode("edit")}
          sx={{ mr: 2 }}
        >
          Edit Profile
        </Button>
        <Button 
          variant={mode === "delete" ? "contained" : "outlined"}
          color="error" 
          onClick={() => setMode("delete")}
        >
          Delete Profile
        </Button>
      </Box>


      {mode === "add" ? (
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={address}
              onChange={handleAddressChange}
              onBlur={handleBlur}
              required
            />
            {suggestions.length > 0 && (
              <div style={{ border: "1px solid #ccc", maxHeight: "150px", overflowY: "auto" }}>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    style={{ padding: "10px", cursor: "pointer" }}
                  >
                    {suggestion.label}
                  </div>
                ))}
              </div>
            )}
          </Grid>


          <Grid item xs={12}>
            <Typography variant="body1">Choose Avatar Method</Typography>
            <RadioGroup 
              row 
              value={avatarSelection} 
              onChange={handleAvatarSelectionChange}
            >
              <FormControlLabel 
                value="preset" 
                control={<Radio />} 
                label="Select Preset Avatar" 
              />
              <FormControlLabel 
                value="url" 
                control={<Radio />} 
                label="Use Image URL" 
              />
            </RadioGroup>
          </Grid>

          {avatarSelection === "preset" ? (
            <Grid item xs={12}>
              <Box display="flex" gap="10px" mb={2}>
                {avatars.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    style={{
                      width: "50px",
                      cursor: "pointer",
                      border: selectedAvatar === avatar ? "2px solid blue" : "",
                    }}
                    onClick={() => handleAvatarSelect(avatar)}
                  />
                ))}
              </Box>
              {avatarError && selectedAvatar === "" && (
                <Typography variant="body2" color="error">
                  Please select an avatar.
                </Typography>
              )}
            </Grid>
          ) : (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Avatar Image URL"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                error={avatarError && !avatarUrl.trim()}
                helperText={avatarError && !avatarUrl.trim() ? "Please enter a valid URL" : ""}
              />
            </Grid>
          )}

            
         
         
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                padding: "10px 20px",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor: "#3f51b5",
                  boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              Add Profile
            </Button>
          </Grid>


        </Grid>
      </form>

) : mode === "edit" ? (
  <Box>
  <Autocomplete
    options={profileNames}
    getOptionLabel={(option) => option.name}
    renderInput={(params) => (
      <TextField 
        {...params} 
        label="Select Profile to Edit" 
        fullWidth 
      />
    )}
    value={selectedProfileToEdit}
    onChange={(event, newValue) => {
      setSelectedProfileToEdit(newValue);
      handleProfileSelect(newValue);
    }}
    sx={{ mb: 2 }}
  />

  {selectedProfileId && (
    <form onSubmit={handleUpdateProfile}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={address}
              onChange={handleAddressChange}
              onBlur={handleBlur}
              required
            />
            {suggestions.length > 0 && (
              <div style={{ border: "1px solid #ccc", maxHeight: "150px", overflowY: "auto" }}>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    style={{ padding: "10px", cursor: "pointer" }}
                  >
                    {suggestion.label}
                  </div>
                ))}
              </div>
            )}
          </Grid>

        <Grid item xs={12}>
  <Typography variant="body1">Choose Avatar Method</Typography>
  <RadioGroup 
    row 
    value={avatarSelection} 
    onChange={(e) => {
      setAvatarSelection(e.target.value);
      // Reset avatar selections when switching
      setSelectedAvatar("");
      setAvatarUrl("");
    }}
  >
    <FormControlLabel 
      value="preset" 
      control={<Radio />} 
      label="Select Preset Avatar" 
    />
    <FormControlLabel 
      value="url" 
      control={<Radio />} 
      label="Use Image URL" 
    />
  </RadioGroup>
</Grid>

{avatarSelection === "preset" ? (
  <Grid item xs={12}>
    <Box display="flex" gap="10px" mb={2}>
      {avatars.map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          alt={`Avatar ${index + 1}`}
          style={{
            width: "50px",
            cursor: "pointer",
            border: selectedAvatar === avatar ? "2px solid blue" : "",
          }}
          onClick={() => setSelectedAvatar(avatar)}
        />
      ))}
    </Box>
    {avatarError && !selectedAvatar && (
      <Typography variant="body2" color="error">
        Please select an avatar.
      </Typography>
    )}
  </Grid>
) : (
  <Grid item xs={12}>
    <TextField
      fullWidth
      label="Avatar Image URL"
      value={avatarUrl}
      onChange={(e) => setAvatarUrl(e.target.value)}
      error={avatarError && !avatarUrl.trim()}
      helperText={avatarError && !avatarUrl.trim() ? "Please enter a valid URL" : ""}
    />
  </Grid>
)}

        <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Update Profile
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Box>

        ) : (

          <Box>
          <Autocomplete
            options={profileNames}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Select Profile to Delete" 
                fullWidth 
              />
            )}
            value={selectedProfileToDelete}
            onChange={(event, newValue) => setSelectedProfileToDelete(newValue)}
          />
          <Box mt={2} display="flex" justifyContent="center">
            <Button 
              variant="contained" 
              color="error" 
              onClick={handleDeleteProfile}
              disabled={!selectedProfileToDelete}
            >
              Confirm Delete Profile
            </Button>
          </Box>
        </Box>
      )     
      }
      </div>
      );
      }
      
      export default AdminPanel;


 
