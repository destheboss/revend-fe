import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, Typography, Box, Button } from '@mui/material';
import { Listing } from '../components/Listing';

interface UserCreatedListingComponentProps {
    listing: Listing;
    onDelete?: () => void;
    onUpdate?: () => void;
}

const UserCreatedListingComponent: React.FC<UserCreatedListingComponentProps> = ({ listing, onDelete, onUpdate }) => {
    const navigate = useNavigate();

    const getImageSrc = (imageData: string) => {
        if (imageData.startsWith('/9j/')) {
            return `data:image/jpeg;base64,${imageData}`;
        } else if (imageData.startsWith('iVBORw0KGgoAAAANSUhEUgAA')) {
            return `data:image/png;base64,${imageData}`;
        } else {
            return imageData;
        }
    };

    return (
        <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
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
                <Box>
                    <Typography variant="h5">{listing.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{listing.description}</Typography>
                    <Typography variant="body2" color="text.secondary">Likes: {listing.numberOfLikes}</Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Typography variant="h6">${listing.price}</Typography>
                <Box>
                    <Button variant="contained" sx={{ mt: 2, mr: 2 }} onClick={() => navigate(`/listing/${listing.id}`)}>
                        View Details
                    </Button>
                    <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} onClick={onUpdate}>
                        Update
                    </Button>
                    <Button variant="contained" color="error" sx={{ mt: 2 }} onClick={onDelete}>
                        Delete
                    </Button>
                </Box>
            </Box>
        </Card>
    );
};

export default UserCreatedListingComponent;