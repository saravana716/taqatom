import AuthService from "@/Services/AuthService";
import React, { useEffect, useState } from "react";
import {
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
const Login = ({navigation}) => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [domailnames, setdomailnames] = useState("")
  console.log(email, password);



  useEffect(() => {
        async function check(params) {
            try{
  const domainName1 = await AuthService.getDomainName();
      console.log(domainName1, 'DOOMMJ');
      setdomailnames(domainName1)
            }
            catch(err){

            }
        }
        check()
    console.log("ghjkl;mnbvcxzxcvbnm");
    
    }, [])
const checkLogin = async () => {
  
    
console.log("jkbgjkdbfjkgbdjk")

  if (!email.trim()) {
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

  try {
  

    const response = await AuthServices.sendSignIn({
      username: email,
      password: password,
    });
console.log("respone",response);


    if (response?.access) {
      Toast.show({
        type: 'success',
        text1: 'Login successful',
        text2: 'Welcome back!',
        position: 'bottom',
      });
    } 
    setTimeout(() => {
      navigation.navigate("Dashboard")
    }, 1500);
            const token = response.access;
        const sessionToken = response.session_token;
        const tokenPayload = jwtDecode(token);
        if (tokenPayload?.role !== ROLE.EMPLOYEE) {
          throw {
            errors: [
              {
                message: 'Inavalid Credentials',
              },
            ],
          };
        }
        await AuthService.setAuthToken(token);
        await AuthService.setSessionToken(sessionToken);
  
  } catch (err) {
    console.error(err);
    Toast.show({
      type: 'error',
      text1: 'Login failed',
      text2: 'Something went wrong. Please try again.',
      position: 'bottom',
    });
  }
};function movepage(params) {
  navigation.navigate("Organization")
}



function passwordOTP(params) {
navigation.navigate("ForgotPassword")  
}

  return (
    <>
      <View style={styles.maincontainer}>
        <View style={styles.imageContainer}>
          <Image source={require("../assets/images/Assets/login-pic.png")} />
        </View>
        <View style={styles.Content}>
          <Text style={styles.contentText}>Welcome Back!</Text>
          <Text style={styles.contentText1}>{domailnames}</Text>
          <View style={styles.contentView}>
            <TextInput
              style={styles.Inputbox}
              onChangeText={setemail}
              placeholderTextColor={"gray"}
              placeholder="Email"
            />
            <TextInput
              style={styles.Inputbox}
              onChangeText={setpassword}
              placeholderTextColor={"gray"}
              placeholder="Password"
            />
            <View style={styles.forgot}>
              <TouchableOpacity onPress={passwordOTP}>
              <Text style={styles.forgottext}>Forgot Password ? </Text>

              </TouchableOpacity>
              <TouchableOpacity onPress={movepage}>
              <Text style={styles.forgottext}>Switch Organization</Text>

              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.Btn} onPress={checkLogin}>
              <Text style={styles.btnText} >
                Submit
              </Text>
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
  },
  imageContainer: {
    width: "100%",
    height: "30%",
    display: "flex",
  },
  Content: {
    width: "100%",
    height: "70%",
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
  },
  contentText: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: 800,
    marginBottom: 10,
    marginTop: 50,
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
