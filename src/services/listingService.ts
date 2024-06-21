import apiClient from './apiClient';
import { Listing } from '../components/Listing';
  
  export const listingService = {
    createListing: (listingData: Listing) => {
      return apiClient.post('/listings', listingData);
    },
    getListing: (listingId: any) => {
      return apiClient.get<Listing>(`/listings/${listingId}`);
    },
    updateListing: (listingId: any, listingData: Listing) => {
      return apiClient.put(`/listings/${listingId}`, listingData);
    },
    deleteListing: (listingId: string) => {
      return apiClient.delete(`/listings/${listingId}`);
    },
    getAllListings: () => {
      return apiClient.get<Listing[]>('/listings');
    },
    getUserListings: (userId: any) => {
      return apiClient.get<Listing[]>(`/listings/user/${userId}`);
    },
    getListingsForCategory: (category: any) => {
      return apiClient.get<Listing[]>(`/listings/category/${category}`);
    },
    getListingsForCategoryAndMaxPrice: (category: string, maxPrice: number) => {
      return apiClient.get<Listing[]>(`/listings/category/${category}/maxprice/${maxPrice}`);
    },
    countListingsForCategoryAndMaxPrice: (category: string, maxPrice: number) => {
      return apiClient.get<number>(`/listings/category/${category}/maxprice/${maxPrice}/count`);
    },
    getLikedListings: async (userId: number) => {
      return apiClient.get(`/listings/user/${userId}/liked`);
    }
};