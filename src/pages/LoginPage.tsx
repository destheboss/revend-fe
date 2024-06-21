import React, { useState } from 'react';
import { useForm } from '../hooks/useForm';
import { authService } from '../services/authService';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const LoginPage: React.FC = () => {
  const { values, handleChange } = useForm({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      username: values.email,
      password: values.password,
    };

    try {
      const response = await authService.login(userData);
      const { accessToken, refreshToken } = response.data;
      setLogin(accessToken, refreshToken);
      console.log('User logged in:', response.data);
      navigate('/ownProfile');
    } catch (error) {
      setError('Invalid credentials');
      console.error('There was an error logging in the user:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={values.email}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Sign In
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;