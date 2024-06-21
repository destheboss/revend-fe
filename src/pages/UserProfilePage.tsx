import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, CircularProgress, Alert, Box, IconButton, Button, TextField } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import { userService } from '../services/userService';
import { useAuth } from '../services/AuthContext';
import { listingService } from '../services/listingService';
import { useForm } from '../hooks/useForm';
import { useImageHandler } from '../hooks/useImageHandler';
import ListingComponent from '../components/ListingComponent';
import LikedListingsComponent from '../components/LikedListingsComponent';

const UserProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [likedListings, setLikedListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [password, setPassword] = useState('');
  const { values, handleChange, setValues } = useForm({
    firstName: '',
    lastName: '',
    email: ''
  });
  const { imageBase64, handleImageChange, error: imageError } = useImageHandler();

  useEffect(() => {
    const fetchUserAndListings = async () => {
      if (!user) {
        setError('User not loaded');
        setLoading(false);
        return;
      }

      try {
        const [userResponse, listingsResponse, likedListingsResponse] = await Promise.all([
          userService.getUser(user.id),
          listingService.getUserListings(user.id),
          listingService.getLikedListings(user.id)
        ]);
        setListings(listingsResponse.data);
        setLikedListings(likedListingsResponse.data);

        setValues({
          firstName: userResponse.data.firstName,
          lastName: userResponse.data.lastName,
          email: userResponse.data.email
        });
      } catch (error) {
        setError('Error fetching user or listings');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserAndListings();
    }
  }, [user, setValues]);

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('No user data available for update');
      return;
    }

    try {
      await userService.updateUser(user.id, { ...values, password, imageBase64 });
      alert('User updated successfully');
      setEditMode(false);
    } catch (error) {
      setError('Error updating user');
    }
  };

  if (loading) {
    return <Container><CircularProgress /></Container>;
  }

  if (error) {
    return <Container><Alert severity="error">{error}</Alert></Container>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>User Profile</Typography>
      <Box display="flex" alignItems="center">
        <Typography variant="h6" sx={{ flexGrow: 1 }}>User ID: {user?.id}</Typography>
        <IconButton onClick={() => setEditMode(!editMode)}>
          {editMode ? <SaveIcon /> : <EditIcon />}
        </IconButton>
      </Box>
      <Box>
        <img 
          src={user?.imageData ? `data:image/jpeg;base64,${user.imageData}` : "https://via.placeholder.com/200"} 
          alt="Profile" 
          style={{ width: 200, height: 200, borderRadius: '50%' }}
        />
      </Box>
      {editMode ? (
        <form onSubmit={handleUpdateUser}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginTop: '16px', display: 'block' }}
          />
          {imageError && <Alert severity="error">{imageError}</Alert>}
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={values.email}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <Button variant="contained" type="submit" sx={{ mt: 2 }}>Save</Button>
        </form>
      ) : (
        <>
          <Typography variant="h6">First Name: {user?.firstName}</Typography>
          <Typography variant="h6">Last Name: {user?.lastName}</Typography>
          <Typography variant="h6">Email: {user?.email}</Typography>
        </>
      )}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Your Listings</Typography>
      <Grid container spacing={2}>
        {listings.map((listing) => (
          <Grid item xs={12} sm={6} md={4} key={listing.id}>
            <ListingComponent listing={listing} />
          </Grid>
        ))}
      </Grid>
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Liked Listings</Typography>
      <LikedListingsComponent likedListings={likedListings} />
    </Container>
  );
};

export default UserProfilePage;