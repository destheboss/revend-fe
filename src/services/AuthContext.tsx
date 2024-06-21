import React, { createContext, useContext, useState, ReactNode } from 'react';
import { clearTokens, decodeToken, setToken } from './authService';
import { User, AuthContextType } from '../components/AuthTypes';
import { userService } from './userService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const setLogin = async (accessToken: string, refreshToken: string): Promise<void> => {
    setToken(accessToken, refreshToken);
    const userDetails = decodeToken(accessToken);

    console.log('Decoded token details:', userDetails);

    try {
      const response = await userService.getUser(userDetails.userId);
      console.log('User Data Fetched:', response.data);

    if (response.data) {
      const userWithRoles: User = {
        id: response.data.id,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        imageData: response.data.imageData,
        roles: userDetails.roles || [],
      };
      setUser(userWithRoles);
      console.log('User with roles:', userWithRoles);
    } else {
      throw new Error("No user data available");
    }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      logout();
    }
  };

  const logout = (): void => {
    clearTokens();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, logout, setLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};