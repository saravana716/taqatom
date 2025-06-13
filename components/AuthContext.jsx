import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import uuid from 'react-native-uuid';
import AuthService from '../Services/AuthService'; // Optional, only if you have validateSession
import ObjectStorage from '../Services/ObjectStorageService'; // Adjust if path is different
import { setLogoutFunction } from '../utils/globalLogoutHandler';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const sessionId = await AsyncStorage.getItem('session_id');

        if (token && sessionId) {
          // Optional: Validate session with your backend
          if (AuthService?.validateSession) {
            const isValid = await AuthService.validateSession(token, sessionId);
            if (!isValid) {
              await logout();
              return;
            }
          }

          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);

      // Generate a new session ID
      const sessionId = uuid.v4();
      await AsyncStorage.setItem('session_id', sessionId);
      await ObjectStorage.setItem('local_session_id', { sessionId });

      setTimeout(() => {
        setIsAuthenticated(true);
      }, 2000);
    } catch (error) {
      
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('session_id');
      await ObjectStorage.setItem('local_session_id', {});
      setIsAuthenticated(false);
    } catch (error) {
      
    }
  };

  useEffect(() => {
    setLogoutFunction(logout);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
