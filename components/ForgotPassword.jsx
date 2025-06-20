import AuthServices from '@/Services/API/AuthServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const ForgotPassword = ({ navigation }) => {
  const [forgot, setForgot] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const sendOTP = async () => {
    if (!forgot.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Enter Your Email',
        text2: 'Email field cannot be empty.',
        position: 'bottom',
      });
      return;
    }

    if (!isValidEmail(forgot)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address.',
        position: 'bottom',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthServices.sendForgotOtp({
        email: forgot,
      });

      // 

      if (response.message === 'OTP sent to email') {
        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: 'Check your email for the OTP.',
          position: 'bottom',
        });
AsyncStorage.setItem("email",forgot)
        navigation.navigate('OtpVerification');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Could not send OTP. Try again later.',
          position: 'bottom',
        });
      }
    } catch (err) {
      
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong. Please try again.',
        position: 'bottom',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.maincontainer}>
      <View style={styles.imageContainer}>
        <Image source={require('../assets/images/Assets/login-pic.png')} style={styles.ims} />
      </View>
      <View style={styles.Content}>
        <Text style={styles.contentText}>Forgot Password</Text>
        <View style={styles.contentView}>
          <TextInput
            style={styles.Inputbox}
            onChangeText={setForgot}
            value={forgot}
            placeholder="Enter Email"
            placeholderTextColor="gray"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[styles.Btn, isLoading && styles.disabledBtn]}
            onPress={sendOTP}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
    ims:{
    width:"100%",
    height:"100%",
    objectFit:"cover"
  },
  Content: {
    flex: 1,
    padding: 25,
    justifyContent: 'flex-start',
  },
  contentText: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: '800',
    marginBottom: 10,
    marginTop: 70,
  },
  contentView: {
    width: '100%',
  },
  Inputbox: {
    width: '100%',
    padding: 15,
    marginVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#697ce3',
    color: 'gray',
  },
  Btn: {
    width: '100%',
    padding: 12,
    marginVertical: 15,
    borderRadius: 10,
    backgroundColor: '#697ce3',
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#A9D0F5',
  },
  btnText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});