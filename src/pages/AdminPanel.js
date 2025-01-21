import React, { useState } from 'react';
import { Button, TextField, Card, CardContent, Typography, IconButton, CircularProgress } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom

const AdminPanel = () => {
  const [profiles, setProfiles] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      description: 'Web Developer from New York.',
      address: '123 Main St, New York, NY',
      contact: 'alice@example.com',
      interests: 'Coding, Traveling',
    },
    {
      id: 2,
      name: 'Bob Smith',
      description: 'Graphic Designer from San Francisco.',
      address: '456 Elm St, San Francisco, CA',
      contact: 'bob@example.com',
      interests: 'Design, Photography',
    },
  ]);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState(false); // Track form errors
  const [loading, setLoading] = useState(false); // Track loading state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrEdit = () => {
    if (!formData.name || !formData.description || !formData.address) {
      setFormError(true); // Show error if required fields are missing
      return;
    }
    setFormError(false); // Clear error if form is valid
    setLoading(true); // Start loading state

    setTimeout(() => {
      if (isEditing) {
        // Edit profile
        setProfiles((prev) =>
          prev.map((profile) =>
            profile.id === formData.id ? { ...formData } : profile
          )
        );
      } else {
        // Add new profile
        setProfiles((prev) => [
          ...prev,
          { ...formData, id: prev.length ? prev[prev.length - 1].id + 1 : 1 },
        ]);
      }
      setFormData({ id: '', name: '', description: '', address: '' });
      setIsEditing(false);
      setLoading(false); // Stop loading state after action is complete
    }, 1000); // Simulating async operation
  };

  const handleEditClick = (profile) => {
    setFormData(profile);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setLoading(true); // Start loading state
    setTimeout(() => {
      setProfiles((prev) => prev.filter((profile) => profile.id !== id));
      setLoading(false); // Stop loading state after deletion
    }, 1000); // Simulating async operation
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      {/* Form */}
      <Card style={{ marginBottom: '20px', padding: '20px' }}>
        <Typography variant="h6">
          {isEditing ? 'Edit Profile' : 'Add New Profile'}
        </Typography>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          fullWidth
          style={{ marginBottom: '10px' }}
          error={!formData.name && formError} // Show error if name is empty
          helperText={!formData.name && formError ? "Name is required" : ""}
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          fullWidth
          style={{ marginBottom: '10px' }}
          error={!formData.description && formError} // Show error if description is empty
          helperText={!formData.description && formError ? "Description is required" : ""}
        />
        <TextField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          fullWidth
          style={{ marginBottom: '10px' }}
          error={!formData.address && formError} // Show error if address is empty
          helperText={!formData.address && formError ? "Address is required" : ""}
        />
        <Button variant="contained" color="primary" onClick={handleAddOrEdit} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : (isEditing ? 'Update' : 'Add')}
        </Button>
      </Card>

      {/* Profile List */}
      <Typography variant="h5" gutterBottom>
        Existing Profiles
      </Typography>
      {profiles.map((profile) => (
        <Card key={profile.id} style={{ marginBottom: '10px', padding: '10px' }}>
          <CardContent>
            <Typography variant="h6">{profile.name}</Typography>
            <Typography variant="body2">{profile.description}</Typography>
            <Typography variant="body2" color="textSecondary">
              {profile.address}
            </Typography>
          </CardContent>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to={`/profile/${profile.id}`}>
              <Button variant="outlined" color="primary">
                View Details
              </Button>
            </Link>
            <IconButton onClick={() => handleEditClick(profile)} disabled={loading}>
              <Edit color="primary" />
            </IconButton>
            <IconButton onClick={() => handleDelete(profile.id)} disabled={loading}>
              <Delete color="secondary" />
            </IconButton>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AdminPanel;
