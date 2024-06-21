import React from 'react';
import { Grid } from '@mui/material';
import { Listing } from './Listing';
import ListingComponent from './ListingComponent';

interface LikedListingsComponentProps {
  likedListings: Listing[];
}

const LikedListingsComponent: React.FC<LikedListingsComponentProps> = ({ likedListings }) => {
  return (
    <Grid container spacing={2}>
      {likedListings.map((listing) => (
        <Grid item xs={12} sm={6} md={4} key={listing.id}>
          <ListingComponent listing={listing} />
        </Grid>
      ))}
    </Grid>
  );
};

export default LikedListingsComponent;