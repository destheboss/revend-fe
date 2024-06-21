import apiClient from './apiClient';

export const likeService = {
  likeListing: async (likeData: { userId: number; listingId: number }) => {
    return apiClient.post('/likes', likeData);
  },

  unlikeListing: (likeData: { listingId: number, userId: number }) => {
    return apiClient.delete('/likes', { data: likeData });
  }
};