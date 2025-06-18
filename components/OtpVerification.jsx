import AuthServices from "@/Services/API/AuthServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";

const OtpVerification = ({ navigation }) => {
  const [getmail, setGetmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fetch email from AsyncStorage
  useEffect(() => {
    const getEmail = async () => {
      try {
        const email = await AsyncStorage.getItem("email");
        if (email) setGetmail(email);
      } catch (err) {
        
      }
    };
    getEmail();
  }, []);

  // Submit OTP and update password
  const checkPassword = async () => {
    if (otp.trim() === "") {
      Toast.show({
        type: 'error',
        text1: 'OTP is required',
        position: 'bottom',
      });
      return;
    }

    if (password.trim() === "") {
      Toast.show({
        type: 'error',
        text1: 'Password is required',
        position: 'bottom',
      });
      return;
    }

    if (confirmPassword.trim() === "") {
      Toast.show({
        type: 'error',
        text1: 'Confirm Password is required',
        position: 'bottom',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Passwords do not match',
        position: 'bottom',
      });
      return;
    }

    setIsLoading(true);

    try {
      const resData = await AuthServices.sendOtp({
        email: getmail,
        otp,
        password,
      });

      // 

      Toast.show({
        type: 'success',
        text1: 'Password Changed Successfully',
        position: 'bottom',
      });

      setTimeout(() => {
        navigation.navigate('Login');
      }, 1500);
    } catch (error) {
      
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP or Network Error',
        position: 'bottom',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    setIsLoading(true);

    try {
      const response = await AuthServices.sendForgotOtp({
        email: getmail,
      });

      // 

      Toast.show({
        type: 'success',
        text1: 'OTP Resent Successfully',
        position: 'bottom',
      });
    } catch (error) {
      
      Toast.show({
        type: 'error',
        text1: 'Failed to resend OTP',
        position: 'bottom',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="angle-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Forgot Password</Text>
        <Icon name="angle-left" size={30} color="transparent" />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.verifyTitle}>Verify</Text>
        <Text style={styles.description}>
          Please enter the code we sent you to email
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter OTP"
            style={styles.input}
            placeholderTextColor="gray"
            keyboardType="number-pad"
            onChangeText={setOtp}
            value={otp}
          />
          <TextInput
            placeholder="New Password"
            style={styles.input}
            placeholderTextColor="gray"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
          <TextInput
            placeholder="Confirm New Password"
            style={styles.input}
            placeholderTextColor="gray"
            secureTextEntry
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />
        </View>

        {/* Resend Section */}
        <TouchableOpacity
          style={styles.resendBtn}
          onPress={resendOtp}
          disabled={isLoading}
        >
          <Text style={styles.dont}>Didn't Receive a Code ?</Text>
          <Text style={styles.resendText}>
            {isLoading ? 'Resending...' : 'Resend Code'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitBtn,
          isLoading && styles.disabledBtn,
        ]}
        onPress={checkPassword}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Change Password</Text>
        )}
      </TouchableOpacity>

      <Toast />
    </View>
  );
};

export default OtpVerification;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between',
  },
  dont:{
color:"gray",
fontSize:17,
textAlign:"center",
fontWeight:600
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: 'black',
  },
  content: {
    alignItems: 'center',
  },
  verifyTitle: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    color: 'gray',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    gap: 15,
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 55,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#697ce3',
    borderRadius: 10,
    color: 'black',
  },
  resendBtn: {
    paddingVertical: 8,
  },
  resendText: {
    color: '#697ce3',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign:"center",
    marginTop:10
  },
  submitBtn: {
    backgroundColor: '#697ce3',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  disabledBtn: {
    backgroundColor: 'gray',
  },
  submitText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});