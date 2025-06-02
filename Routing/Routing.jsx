import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { AuthContext } from '../components/AuthContext';

import Dashboard from "../components/Dashboard";
import ForgotPassword from "../components/ForgotPassword";
import Holiday from "../components/Holiday";
import Login from "../components/Login";
import Notification from "../components/Notification";
import OtpVerification from "../components/OtpVerification";
import PasswordUpdate from "../components/PasswordUpdate";
import Profile from "../components/Profile";
import ProfileUpdate from "../components/ProfileUpdate";
import SwitchOrganization from "../components/SwitchOrganization";

const Stack = createNativeStackNavigator();

const Routing = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
console.log("auth",isAuthenticated);

  if (loading) return null; // Optional: you can return a splash screen here

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Holiday" component={Holiday} />
          <Stack.Screen name="OtpVerification" component={OtpVerification} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="Password" component={PasswordUpdate} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="ProfileUpdate" component={ProfileUpdate} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Organization" component={SwitchOrganization} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Routing;
