import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import uuid from 'react-native-uuid';
import AuthService from '../Services/AuthService'; // Optional
import ObjectStorage from '../Services/ObjectStorageService'; // Adjust if needed
import { setLogoutFunction } from '../utils/globalLogoutHandler';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOrgSelected, setIsOrgSelected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAppState = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const sessionId = await AsyncStorage.getItem('session_id');
        const orgSelected = await AsyncStorage.getItem('org_selected');

        if (orgSelected === 'true') {
          setIsOrgSelected(true);
        }

        if (token && sessionId) {
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
        setIsOrgSelected(false);
      } finally {
        setLoading(false);
      }
    };

    checkAppState();
  }, []);

  const login = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);

      const sessionId = uuid.v4();
      await AsyncStorage.setItem('session_id', sessionId);
      await ObjectStorage.setItem('local_session_id', { sessionId });

      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login error:", error);
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
      console.error("Logout error:", error);
    }
  };

  const markOrgSelected = async () => {
    try {
      await AsyncStorage.setItem('org_selected', 'true');
      setIsOrgSelected(true);
    } catch (error) {
      console.error("Error saving org selection:", error);
    }
  };

  const clearOrgSelection = async () => {
    try {
      await AsyncStorage.removeItem('org_selected');
      setIsOrgSelected(false);
    } catch (error) {
      console.error("Error clearing org selection:", error);
    }
  };

  useEffect(() => {
    setLogoutFunction(logout);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isOrgSelected,
        login,
        logout,
        loading,
        markOrgSelected,
        clearOrgSelection,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
