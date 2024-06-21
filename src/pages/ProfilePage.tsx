import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, CircularProgress, Alert, Box, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { listingService } from '../services/listingService';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndListings = async () => {
      try {
        if (userId) {
          const [userResponse, listingsResponse] = await Promise.all([
            userService.getUser(Number(userId)),
            listingService.getUserListings(Number(userId))
          ]);
          setUser(userResponse.data);
          setListings(listingsResponse.data);
        }
      } catch (error) {
        setError('Error fetching user or listings');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndListings();
  }, [userId]);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
<Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>User Profile</Typography>
        {user && (
          <>
            <Typography variant="h6">User ID: {user.id}</Typography>
            <Typography variant="h6">First Name: {user.firstName}</Typography>
            <Typography variant="h6">Last Name: {user.lastName}</Typography>
            <Typography variant="h6">Email: {user.email}</Typography>
          </>
        )}
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Listings by {user?.firstName}</Typography>
        <Grid container spacing={4}>
          {listings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} key={listing.id}>
              <Card>
                <CardMedia
                  component="img"
                  alt="Listing Image"
                  height="140"
                  image="https://via.placeholder.com/140"
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    {listing.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {listing.description}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    ${listing.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Likes: {listing.numberOfLikes}
                  </Typography>
                  <Button 
                    variant="contained" 
                    sx={{ mt: 2 }} 
                    onClick={() => navigate(`/listing/${listing.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ProfilePage;