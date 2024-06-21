import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, CircularProgress, Alert, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import { Category } from '../components/Category';
import TopUserWithMostLikedListing from '../components/TopUserWithMostLikedListing';

const MainPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    categoryService.getAllCategories()
      .then(response => {
        const formattedCategories = response.data.map((category: string) => ({
          name: category.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '),
          image: `/static/${category.toLowerCase()}.jpg`,
          path: `/listings/category/${category.toLowerCase()}`
        }));
        setCategories(formattedCategories);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading categories:', err);
        setError('Failed to load categories');
        setLoading(false);
      });
  }, []);

  return (
    <Container>
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h3">Welcome to Our Listings Platform</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Browse categories and discover amazing deals!
        </Typography>
      </Box>

      <div>
      <TopUserWithMostLikedListing />
      {/* Other content of the main page */}
    </div>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={4}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.name}>
              <Card onClick={() => navigate(category.path)} sx={{ cursor: 'pointer' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={category.image}
                  alt={category.name}
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    {category.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MainPage;