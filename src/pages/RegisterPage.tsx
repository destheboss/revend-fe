import React, { useState } from 'react';
import { useForm } from '../hooks/useForm';
import { userService } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Alert, Input } from '@mui/material';
import { useImageHandler } from '../hooks/useImageHandler';

const RegisterPage: React.FC = () => {
  const { values, handleChange } = useForm({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { imageBase64, error: imageError, handleImageChange } = useImageHandler();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (values.password !== values.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const userData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      imageBase64
    };

    try {
      const response = await userService.register(userData);
      console.log('User created', response.data);
      navigate('/login');
    } catch (registrationError) {
      setError('There was an error creating the user');
      console.error('There was an error creating the user', registrationError);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      {error && <Alert severity="error" data-testid="error-message">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="firstName"
          label="First Name"
          name="firstName"
          autoComplete="fname"
          autoFocus
          value={values.firstName}
          onChange={handleChange}
          data-testid="first-name"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="lastName"
          label="Last Name"
          name="lastName"
          autoComplete="lname"
          value={values.lastName}
          onChange={handleChange}
          data-testid="last-name"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          data-testid="email"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange}
          data-testid="password"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          value={values.confirmPassword}
          onChange={handleChange}
          data-testid="confirm-password"
        />
        <Input
          type="file"
          inputProps={{ accept: "image/*" }}
          onChange={handleImageChange}
          sx={{ mt: 2, display: 'block' }}
          data-testid="file-input"
        />
        {imageError && (
        <Typography color="error" sx={{ mt: 2 }}>
          {imageError}
        </Typography>
        )}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} data-testid="register-button">
          Register
        </Button>
      </Box>
    </Box>
  );
};

export default RegisterPage;