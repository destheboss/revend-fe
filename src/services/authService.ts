import axios from 'axios';
import apiClient from './apiClient';

export const getAuthToken = () => sessionStorage.getItem('token');

export const setToken = (accessToken: string, refreshToken: string): void => {
  sessionStorage.setItem('token', accessToken);
  sessionStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = (): void => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('refreshToken');
};

export const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);  
  } catch (error) {
    console.error("Failed to decode token:", error);
    throw new Error("Failed to decode token");
  }
};

export const getUserIdFromToken = () => {
  const token = sessionStorage.getItem('token');
  if (token) {
    const decoded = decodeToken(token);
    return parseInt(decoded.userId, 10);
  }
  return null;
};

export const refreshAuthToken = async (): Promise<string> => {
  const refreshToken = sessionStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available.');
  }

  try {
    const response = await axios.post('http://localhost:8080/tokens/refresh', { refreshToken });
    const { accessToken } = response.data;
    sessionStorage.setItem('token', accessToken);
    return accessToken;
  } catch (error) {
    clearTokens();
    throw new Error('Session expired. Please log in again.');
  }
};

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