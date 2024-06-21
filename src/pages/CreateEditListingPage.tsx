import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Input, MenuItem } from '@mui/material';
import { listingService } from '../services/listingService';
import { useAuth } from '../services/AuthContext';
import { useImageHandler } from '../hooks/useImageHandler';
import { categoryService } from '../services/categoryService';

const CreateEditListingPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: any }>();
  const navigate = useNavigate();
  const { imageBase64, handleImageChange, error: imageError } = useImageHandler();
  const { user } = useAuth();
  const userId = user?.id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [numberOfLikes, setNumberOfLikes] = useState<number>(0);

  useEffect(() => {
    categoryService.getAllCategories().then(response => {
      setCategories(response.data);
    }).catch(error => {
      console.error('Error loading categories:', error);
    });

    if (listingId) {
      listingService.getListing(listingId).then(response => {
        const listing = response.data;
        setTitle(listing.title);
        setDescription(listing.description);
        setPrice(listing.price.toString());
        setCategory(listing.category);
        setNumberOfLikes(listing.numberOfLikes); // Set the existing number of likes
      }).catch(error => {
        console.error('Error loading listing:', error);
      });
    }
  }, [listingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('User ID from sessionStorage:', userId);

    if (!userId) {
      console.error('User is not authenticated');
      return;
    }

    const listingData = {
      title,
      description,
      price: parseFloat(price),
      userId: userId,
      category,
      imageBase64,
      numberOfLikes
    };

    const listingDataUpdate = {
      id: listingId,
      title,
      description,
      price: parseFloat(price),
      userId: userId,
      category,
      imageBase64,
      numberOfLikes
    };

    try {
      if (listingId) {
        await listingService.updateListing(listingId, listingDataUpdate);
      } else {
        await listingService.createListing(listingData);
      }
      navigate('/ownProfile');
    } catch (error) {
      console.error('Error creating/updating listing:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {listingId ? 'Edit Listing' : 'Create Listing'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="title"
          label="Title"
          name="title"
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="description"
          label="Description"
          id="description"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="price"
          label="Price"
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          select
          label="Category"
          fullWidth
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          helperText="Please select a category"
          sx={{ mt: 2 }}
        >
          {categories.map((categoryItem, index) => (
            <MenuItem key={index} value={categoryItem}>
              {categoryItem.replace('_', ' ').split(' ').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
            </MenuItem>
          ))}
        </TextField>
        <Input
          type="file"
          inputProps={{ accept: "image/*" }}
          onChange={handleImageChange}
          sx={{ mt: 2, display: 'block' }}
        />
        {imageError && (
          <Typography color="error" sx={{ mt: 2 }}>
            {imageError}
          </Typography>
        )}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {listingId ? 'Update Listing' : 'Create Listing'}
        </Button>
      </Box>
    </Container>
  );
};

export default CreateEditListingPage;