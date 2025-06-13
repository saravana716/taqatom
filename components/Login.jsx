import AuthService from "@/Services/AuthService";
import FontAwesome from '@expo/vector-icons/FontAwesome'; // Or use another icon set
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import AuthServices from "../Services/API/AuthServices";
import { ROLE } from '../utils/auth/jwt/role';
import { jwtDecode } from '../utils/auth/jwt/utils';
import { AuthContext } from "./AuthContext";

const Login = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [domainName, setDomainName] = useState("");
  const [isLoading, setIsLoading] = useState(false); // <-- Loading State

  useEffect(() => {
    async function fetchDomain() {
      try {
        const domainName1 = await AuthService.getDomainName();
        setDomainName(domainName1);
      } catch (err) {
        
      }
    }

    fetchDomain();
  }, []);

  const checkLogin = async () => {
    if (email.trim()=="") {
      Toast.show({
        type: 'error',
        text1: 'Email is required',
        position: 'bottom',
      });
      return;
    }

    if (!password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Password is required',
        position: 'bottom',
      });
      return;
    }

    if (email === "demo@example.com") {
      Toast.show({
        type: 'info',
        text1: 'Demo Login',
        text2: 'You’re logging in with a demo account.',
        position: 'bottom',
      });
    }

    setIsLoading(true); // Start loading

    try {
      const response = await AuthServices.sendSignIn({
        username: email,
        password: password,
      });

      const token = response.access;
      const sessionToken = response.session_token;
      const tokenPayload = jwtDecode(token);

      if (tokenPayload?.role !== ROLE.EMPLOYEE) {
        throw new Error('Invalid role');
      }

      await AuthService.setAuthToken(token);
      await AuthService.setSessionToken(sessionToken);
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("email", email);
      await login(token);

      Toast.show({
        type: 'success',
        text1: 'Login successful',
        text2: 'Welcome back!',
        position: 'bottom',
      });

      setTimeout(() => {
        // Navigate after delay
      }, 2000);

    } catch (err) {
      
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: 'Something went wrong. Please try again.',
        position: 'bottom',
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const movePage = () => {
    navigation.navigate("Organization");
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  return (
    <>
      <View style={styles.maincontainer}>
        <View style={styles.imageContainer}>
          <Image source={require("../assets/images/Assets/login-pic.png")} />
        </View>
        <View style={styles.Content}>
          <Text style={styles.contentText}>Welcome Back!</Text>
          <Text style={styles.contentText1}>{domainName}</Text>

          <View style={styles.contentView}>
            <TextInput
              style={styles.Inputbox}
              onChangeText={setEmail}
              placeholderTextColor={"gray"}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
           <View style={styles.passwordContainer}>
  <TextInput
    style={styles.Inputbox}
    onChangeText={setPassword}
    placeholderTextColor={"gray"}
    placeholder="Password"
    secureTextEntry={!showPassword} // Toggle based on state
  />
  <TouchableOpacity
    style={styles.eyeIcon}
    onPress={() => setShowPassword(!showPassword)}
  >
    <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={20} color="gray" />
  </TouchableOpacity>
</View>

            <View style={styles.forgot}>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgottext}>Forgot Password?</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={movePage}>
                <Text style={styles.forgottext}>Switch Organization</Text>
              </TouchableOpacity>
            </View>

            {/* Submit Button with Loader */}
            <TouchableOpacity
              style={[styles.Btn, isLoading && styles.disabledBtn]}
              onPress={checkLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <Toast />
      </View>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  maincontainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor:"white"
  },
    Btn: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  disabledBtn: {
     paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: "#A9D0F5", // Light blue when disabled
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageContainer: {
    width: "100%",
    height: "20%",
    display: "flex",
  },
  Content: {
    width: "100%",
    height: "80%",
    display: "flex",
    textAlign: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    padding: 25,
  },
  contentText1: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: 800,
    marginBottom: 10,
    color:"black"
  },
   passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 30,
  },
  contentText: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: 800,
    marginBottom: 10,
    marginTop: 100,
  },
  contentView: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  Inputbox: {
    width: "100%",
    padding: 15,
    marginVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#697ce3",
    color: "gray",
  },
  Btn: {
    width: "100%",
    padding: 12,
    marginVertical: 15,
    borderRadius: 10,
    backgroundColor: "#697ce3",
  },
  btnText: {
    fontSize: 25,
    textAlign: "center",
    color: "white",
  },
  forgot: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 10,
  },
  forgottext: {
    color: "#697ce3",
    fontSize: 17,
  },
});
