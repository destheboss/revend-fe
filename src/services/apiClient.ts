import axios from 'axios';

const clearTokens = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('refreshToken');
};

export const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Authorization': `Bearer ${sessionStorage.getItem('token') || ''}`,
  },
});

apiClient.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = sessionStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post('http://localhost:8080/tokens/refresh', { refreshToken });
          const { accessToken } = response.data;
          sessionStorage.setItem('token', accessToken);
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } catch (error) {
          clearTokens();
          alert('Session expired. Please log in again.');
          window.location.href = '/tokens';
        }
      } else {
        clearTokens();
        alert('Session expired. Please log in again.');
        window.location.href = '/tokens';
      }
    }
    return Promise.reject(error);
  }
);