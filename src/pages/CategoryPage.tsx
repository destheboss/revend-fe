import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Grid, CircularProgress, Box, TextField, Button } from '@mui/material';
import { listingService } from '../services/listingService';
import ListingComponent from '../components/ListingComponent';

const CategoryPage: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [maxPrice, setMaxPrice] = useState<number | ''>('');
    const [listingCount, setListingCount] = useState<number | null>(null);

    useEffect(() => {
        if (!category) {
            console.error('Category is undefined');
            setLoading(false);
            return;
        }

        const fetchListings = async () => {
            try {
                const { data } = await listingService.getListingsForCategory(category);
                setListings(data);
                const countResponse = await listingService.countListingsForCategoryAndMaxPrice(category, Number(maxPrice));
                setListingCount(countResponse.data);
            } catch (error) {
                console.error('Failed to fetch listings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [category, maxPrice]);

    const handleFilter = async () => {
        if (!category || maxPrice === '') {
            return;
        }
        setLoading(true);
        try {
            const { data } = await listingService.getListingsForCategoryAndMaxPrice(category, Number(maxPrice));
            setListings(data);
            const countResponse = await listingService.countListingsForCategoryAndMaxPrice(category, Number(maxPrice));
            setListingCount(countResponse.data);
        } catch (error) {
            console.error('Failed to fetch filtered listings:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
                {category?.toUpperCase()} Listings
            </Typography>
            {listingCount !== null && (
                <Typography variant="h6" gutterBottom>
                    Listings found: {listingCount}
                </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <TextField
                    label="Max Price"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    data-testid="max-price-input"
                />
                <Button variant="contained" onClick={handleFilter} data-testid="filter-button">Filter</Button>
            </Box>
            <Grid container spacing={2}>
                {listings.map((listing) => (
                    <Grid item xs={12} key={listing.id}>
                        <ListingComponent listing={listing} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default CategoryPage;