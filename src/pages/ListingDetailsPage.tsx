import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress, Alert, Card, CardMedia } from '@mui/material';
import { listingService } from '../services/listingService';
import conversationService from '../services/conversationService';
import { useAuth } from '../services/AuthContext';
import { likeService } from '../services/likeService';

const ListingDetailsPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const userId = user?.id;
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await listingService.getListing(listingId!);
        setListing(response.data);

        if (userId) {
          const likedListingsResponse = await listingService.getLikedListings(userId);
          const likedListings = likedListingsResponse.data;
          setIsLiked(likedListings.some((likedListing: any) => likedListing.id === response.data.id));
        }

        setLoading(false);
      } catch (error) {
        setError('Failed to fetch listing details');
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId, userId]);

  const handleStartConversation = async () => {
    try {
      const ownerUserId = listing.userId;

      const conversationData = {
        user1Id: userId,
        user2Id: ownerUserId,
        title: "New Conversation"
      };

      const response = await conversationService.createConversation(conversationData);
      const createdConversationId = response.data.conversationId;

      if (!isNaN(createdConversationId)) {
        navigate(`/conversations/${createdConversationId}/messages`);
      } else {
        console.error("Invalid conversationId received");
        setError('Failed to start conversation');
      }

    } catch (error) {
      setError('Failed to start conversation');
    }
  };

  const handleLike = async () => {
    if (!userId) return;
    try {
      await likeService.likeListing({ userId, listingId: listing.id });
      setIsLiked(true);
      setListing((prevListing: any) => ({
        ...prevListing,
        numberOfLikes: prevListing.numberOfLikes + 1,
      }));
    } catch (error) {
      console.error('Failed to like listing', error);
    }
  };

  const handleUnlike = async () => {
    if (!userId) return;
    try {
      await likeService.unlikeListing({ userId, listingId: listing.id });
      setIsLiked(false);
      setListing((prevListing: any) => ({
        ...prevListing,
        numberOfLikes: prevListing.numberOfLikes - 1,
      }));
    } catch (error) {
      console.error('Failed to unlike listing', error);
    }
  };

  const handleDelete = async () => {
    if (!userId) return;
    try {
      await listingService.deleteListing(listing.id);
      navigate('/ownProfile');
    } catch (error) {
      console.error('Failed to delete listing', error);
    }
  };

  const handleEdit = () => {
    navigate(`/listing/edit/${listing.id}`);
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
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
        <Typography variant="h3">{listing.title}</Typography>
        <Card>
          {listing.imageData ? (
            <CardMedia
              component="img"
              alt="Listing Image"
              image={`data:image/jpeg;base64,${listing.imageData}`}
              sx={{ height: 240 }}
            />
          ) : (
            <Typography variant="body1">No image available</Typography>
          )}
        </Card>
        <Typography variant="body1" sx={{ mt: 2 }}>{listing.description}</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>${listing.price}</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>Likes: {listing.numberOfLikes}</Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={() => navigate(`/profile/${listing.userId}`)}>View User Profile</Button>
          {userId !== listing.userId && (
            <Button variant="contained" onClick={handleStartConversation}>Message User</Button>
          )}
          {userId === listing.userId ? (
            <>
              <Button variant="contained" color="secondary" onClick={handleDelete}>Delete</Button>
              <Button variant="contained" color="primary" onClick={handleEdit}>Edit</Button>
            </>
          ) : (
            isLiked ? (
              <Button variant="contained" color="secondary" onClick={handleUnlike}>Unlike</Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleLike}>Like</Button>
            )
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ListingDetailsPage;