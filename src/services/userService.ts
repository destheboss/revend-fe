import apiClient from './apiClient';

export const userService = {
  register: (userData: any) => apiClient.post('/users', userData),
  getUser: (userId: any) => apiClient.get(`/users/${userId}`),
  getAllUsers: (params: any) => apiClient.get('/users', { params }),
  updateUser: (userId: any, userData: any) => apiClient.put(`/users/${userId}`, userData),
  deleteUser: (userId: any) => apiClient.delete(`/users/${userId}`),
  getTopUserWithMostLikedListing: () => apiClient.get('/users/top-liked'),
};