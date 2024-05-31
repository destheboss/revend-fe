import React, { useState } from 'react';
import { useForm } from '../hooks/useForm';
import { authService } from '../services/authService';
import styles from '../components/LoginPage.module.css';

const LoginPage: React.FC = () => {
  const { values, handleChange } = useForm({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      username: values.email,
      password: values.password,
    };

    try {
      const response = await authService.login(userData);
      const { accessToken, refreshToken } = response.data;
      sessionStorage.setItem('token', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      console.log('User logged in', response.data);
    } catch (error) {
      setError('Invalid credentials');
      console.error('There was an error logging in the user', error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          placeholder="Email"
          className={styles.inputField}
        />
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          placeholder="Password"
          className={styles.inputField}
        />
        <button type="submit" className={styles.submitButton}>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;