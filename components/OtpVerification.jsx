import AuthServices from "@/Services/API/AuthServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Icon from "react-native-vector-icons/FontAwesome";


const OtpVerification = ({navigation}) => {
  const [getmail, setgetmail] = useState("")
  useEffect(() => {
  async function getemail(params) {
    try{
  const email= await AsyncStorage.getItem("email")
console.log("email",email);
setgetmail(email)

    }
    catch(err){

    }
  }
  getemail()
  }, [])
  console.log(getmail);
  
  
    const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
async function checkpassword() {
  try {
    if (!isActive) {
      Toast.show({
        type: 'error',
        text1: 'OTP expired, please resend and try again.',
        position: 'bottom',
      });
      return;
    }

    if (otp.trim() === "") {
      Toast.show({
        type: 'error',
        text1: 'Otp is required',
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

    if (password.trim() !== confirmPassword.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Password does not match',
        position: 'bottom',
      });
      return;
    }

    setIsLoading(true);

    const resdata = await AuthServices.sendOtp({
      email: getmail,
      otp: otp,
      password: password,
    });

    console.log('resdata', resdata);

    Toast.show({
      type: 'success',
      text1: 'Password Changed Successfully',
      position: 'bottom',
    });

    navigation.navigate('Login'); // Navigate after success (optional)

  } catch (error) {
    console.log('OTP Submit Error:', error);
    Toast.show({
      type: 'error',
      text1: 'Enter Valid OTP',
      position: 'bottom',
    });
  } finally {
    setIsLoading(false);
  }
}


  console.log({otp:otp,password:password,confirm:confirmPassword});
const ResendOtp = async () => {
  try {
    setIsLoading(true);
    const response = await AuthServices.sendForgotOtp({
      email: getmail,
    });
    console.log('response', response);

    // Reset the countdown timer
    setSeconds(60);
    setIsActive(true);
    
    Toast.show({
      type: 'success',
      text1: 'OTP Resent Successfully',
      position: 'bottom',
    });
  } catch (error) {
    console.log(error, 'Resend OTP Error');
    Toast.show({
      type: 'error',
      text1: 'Failed to resend OTP',
      position: 'bottom',
    });
  } finally {
    setIsLoading(false);
  }
};



  useEffect(() => {
    let intervalId;
    if (isActive && seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive, seconds]);

  useEffect(() => {
    if (seconds === 0) {
      setIsActive(false);
    }
  }, [seconds]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <>
      <View style={styles.OtpVarify}>
        <View style={styles.OtpTop}>
          <Icon name="angle-left" size={30} color="black" />
          <Text style={styles.titles}>Forgot Password</Text>
          <Icon name="angle-left" size={30} color="transparent" />
        </View>
        <View style={styles.OtpCenter}>
          <Text style={styles.Otptitle}>Verify</Text>
          <Text style={styles.Otpdes}>
            Please Enter the code we send youy to email
          </Text>
          <View style={styles.Otpinputs}>
            <TextInput
              placeholder="Enter OTP"
              style={styles.otpdata}
              placeholderTextColor={"gray"}
              onChangeText={setOtp}
            />
            <TextInput
              style={styles.otpdata}
              placeholder="Enter New Password"
              placeholderTextColor={"gray"}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.otpdata}
              placeholder="Confirm New Password"
              placeholderTextColor={"gray"}
              onChangeText={setConfirmPassword}
            />
          </View>
        <Text style={styles.Otpcode}>Didn't receive a code?</Text>
{isActive ? (
  <Text style={[styles.Otpcode1, { color: 'gray' }]}>
    Resend in {remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}s
  </Text>
) : (
  <TouchableOpacity onPress={ResendOtp} disabled={isLoading || isActive}>
    <Text style={styles.Otpcode1}>
      {isLoading ? "Resending..." : "Resend Code"}
    </Text>
  </TouchableOpacity>
)}

        </View>
       <TouchableOpacity
  style={[
    styles.Otpbtn,
    !isActive && { backgroundColor: 'gray' }
  ]}
  onPress={checkpassword}
  disabled={isLoading || !isActive}
>
  <Text style={styles.Otpbtntext}>Change Password</Text>
</TouchableOpacity>
        <Toast/>
      </View>
    </>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  OtpVarify: {
    with: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
    padding: 20,
  },
  OtpTop: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    position: "relative",
  },
  titles: {
    fontSize: 22,
    fontWeight: 800,
    color: "black",
  },
  OtpCenter: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  Otptitle: {
    fontSize: 30,
    fontWeight: 800,
    color: "black",
    textAlign: "center",
    marginBottom: 8,
  },
  Otpdes: {
    color: "gray",
  },
  Otpinputs: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 12,
    marginTop: 60,
  },
  otpdata: {
    width: "100%",
    height: 55,
    padding: 10,
    borderWidth: 1,
    borderColor: "#697ce3",
    borderRadius: 10,
  },
  Otpcode: {
    marginTop: 40,
    color: "gray",
    fontSize: 15,
    marginBottom: 8,
  },
  Otpcode1: {
    color: "#697ce3",
    fontWeight: 800,
    fontSize: 20,
  },
  Otpbtn: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: "#697ce3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  Otpbtntext:{
        color: "white",
    fontSize: 25,
    fontWeight: 800,
  }
});
