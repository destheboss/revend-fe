
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Box, CircularProgress } from '@mui/material';
import { Listing } from '../components/Listing';
import { userService } from '../services/userService';

interface ListingComponentProps {
  listing: Listing;
}

const ListingComponent: React.FC<ListingComponentProps> = ({ listing }) => {
  const navigate = useNavigate();
  const [ownerName, setOwnerName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerName = async () => {
      try {
        const response = await userService.getUser(listing.userId);
        const user = response.data;
        setOwnerName(`${user.firstName} ${user.lastName}`);
      } catch (error) {
        console.error('Failed to fetch user details', error);
        setOwnerName('Unknown');
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerName();
  }, [listing.userId]);

  const getImageSrc = (imageData: string) => {
    if (imageData.startsWith('/9j/')) {
      return `data:image/jpeg;base64,${imageData}`;
    } else if (imageData.startsWith('iVBORw0KGgoAAAANSUhEUgAA')) {
      return `data:image/png;base64,${imageData}`;
    } else {
      return imageData;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 2,
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
          transform: 'scale(1.02)',
        },
      }}
      onClick={() => navigate(`/listing/${listing.id}`)}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {listing.imageData ? (
          <CardMedia
            component="img"
            sx={{ width: 150, height: 150, objectFit: 'cover', marginRight: 2 }}
            image={getImageSrc(listing.imageData)}
            alt={listing.title}
          />
        ) : (
          <Box sx={{ width: 150, height: 150, backgroundColor: 'grey', marginRight: 2 }} />
        )}
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography variant="h5" component="div">
            {listing.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {listing.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Likes: {listing.numberOfLikes}
          </Typography>
        </CardContent>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Typography variant="h6">${listing.price}</Typography>
        <Typography variant="body2" color="text.secondary">
          Owner: {ownerName}
        </Typography>
      </Box>
    </Card>
  );
};

export default ListingComponent;