import React from 'react';
import { useForm } from '../hooks/useForm';
import { userService } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import styles from '../components/RegisterPage.module.css';

const RegisterPage: React.FC = () => {
  const { values, handleChange } = useForm({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (values.password !== values.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

  const userData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password
    };

    try {
      const response = await userService.register(userData);
      console.log('User created', response.data);
      navigate('/login');
    } catch (error) {
      console.error('There was an error creating the user', error);
    }
  };

  return (
    <div className={styles.registerContainer}>
    <h2>Register</h2>
    <form onSubmit={handleSubmit} className={styles.registerForm}>
      <input
        type="text"
        name="firstName"
        value={values.firstName}
        onChange={handleChange}
        placeholder="First Name"
        className={styles.inputField}
      />
      <input
        type="text"
        name="lastName"
        value={values.lastName}
        onChange={handleChange}
        placeholder="Last Name"
        className={styles.inputField}
      />
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
      <input
        type="password"
        name="confirmPassword"
        value={values.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password"
        className={styles.inputField}
      />
      <button type="submit" className={styles.submitButton}>Register</button>
    </form>
  </div>
  );

};

export default RegisterPage;