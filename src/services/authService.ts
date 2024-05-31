import { apiClient } from './apiClient';

export const authService = {
  login: (userData: any) => {
    return apiClient.post('/tokens', userData);
  },
  refresh: (refreshToken: string) => {
    return apiClient.post('/tokens/refresh', { refreshToken });
  },
  getUserData: () => {
    return apiClient.get('/user-data');
  },
};