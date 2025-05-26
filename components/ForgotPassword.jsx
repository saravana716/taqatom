import AuthServices from '@/Services/API/AuthServices';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Toast } from "react-native-toast-message/lib/src/Toast";

const ForgotPassword = ({navigation}) => {
     const [forgot, setforgot] = useState("")
     function getdata(event) {
        setforgot(event)
     }
async function getvalue(params) {
  try {
    if (forgot.trim() === "") {
      Toast.show({
        type: 'error',
        text1: 'Enter Your Email',
        text2: 'Email field cannot be empty.',
        position: 'bottom',
      });
    } else {
      const response = await AuthServices.sendForgotOtp({
        email: forgot,
      });

      console.log('response', response);

      if (response.message === 'OTP sent to email') {
        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: 'Check your email for the OTP.',
          position: 'bottom',
        });

        // Navigate to OTP Verification screen and pass email
        navigation.navigate('OtpVerification', { email: forgot });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: 'Could not send OTP. Try again later.',
          position: 'bottom',
        });
      }
    }
  } catch (err) {
    console.log('OTP sending error:', err);
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Something went wrong.',
      position: 'bottom',
    });
  }
}


     console.log(forgot);
     
  return (
    <>
     <View style={styles.maincontainer}>
        <View style={styles.imageContainer}>
             <Image source={require('../assets/images/Assets/login-pic.png')}/>
        </View>
        <View style={styles.Content}>
            <Text style={styles.contentText}>Forgot Password</Text>
            <View style={styles.contentView}>
                <TextInput style={styles.Inputbox} onChangeText={getdata} placeholderTextColor={"gray"} placeholder="Enter Email"/>
                <TouchableOpacity style={styles.Btn}onPress={getvalue}><Text style={styles.btnText}>Send Otp</Text></TouchableOpacity>
            </View>
        </View>
        <Toast/>
    </View>
    </>
  )
}

export default ForgotPassword





const styles=StyleSheet.create({
    maincontainer:{
        width:"100%",
        height:"100%",
        display:"flex",
        flexDirection:"column"
    },
    imageContainer:{
        width:"100%",
        height:"30%",
        display:"flex"
    },
    Content:{
        width:'100%',
        height:"70%",
        display:"flex",
        textAlign:"center",
        justifyContent:"flex-start",
        flexDirection:"column",
        padding:25,
    },
    contentText:{textAlign:"center",
        fontSize:25,
        fontWeight:800,
        marginBottom:10,
        marginTop:70
    },
    contentView:{
        width:"100%",
        display:"flex",
        flexDirection:"column",
    },
    Inputbox:{
         width:"100%",
        padding:15,
        marginVertical:15,
        borderRadius:10,
        borderWidth:1,
        borderColor:"#697ce3",
        color:"gray"
    },
      Btn:{
         width:"100%",
        padding:12,
        marginVertical:15,
        borderRadius:10,
        backgroundColor:"#697ce3"
    },
    btnText:{
        fontSize:25,
        textAlign:"center",
        color:"white",
    }
})