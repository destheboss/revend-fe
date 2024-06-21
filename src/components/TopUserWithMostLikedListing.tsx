import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { Card, CardContent, Typography, Box, CircularProgress, Alert } from '@mui/material';

const TopUserWithMostLikedListing: React.FC = () => {
  const [topUser, setTopUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopUser = async () => {
      try {
        const response = await userService.getTopUserWithMostLikedListing();
        setTopUser(response.data);
      } catch (error) {
        setError('Failed to fetch top user with most liked listing');
      } finally {
        setLoading(false);
      }
    };

    fetchTopUser();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }} data-testid="loading">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }} data-testid="error">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!topUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <Typography variant="body1">No data available</Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ my: 4 }} data-testid="top-user">
      <CardContent>
        <Typography variant="h5">Top User with Most Liked Listing</Typography>
        <Typography variant="h6">{`${topUser.firstName} ${topUser.lastName}`}</Typography>
        <Typography variant="body1">Listing Title: {topUser.title}</Typography>
        <Typography variant="body1">Likes: {topUser.numberOfLikes}</Typography>
      </CardContent>
    </Card>
  );
};

export default TopUserWithMostLikedListing;