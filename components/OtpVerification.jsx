import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const OtpVerification = () => {
  return (
    <>
    <View style={styles.OtpVarify}>
        <View style={styles.OtpTop}>
               <Icon name="angle-left" size={30} color="black" />               
<Text>
    Forgot Password
    </Text>        
               <Icon name="angle-left" size={30} color="transparent" />               

    </View>
    <View style={styles.OtpCenter}>
      <Text style={styles.Otptitle}>
        Verify
      </Text>
      <Text style={styles.Otpdes}>Please Enter the code we send youy to email</Text>
      <View style={styles.Otpinputs}>
        <TextInput placeholder='Enter OTP' placeholderTextColor={"gray"}/>
        <TextInput placeholder='Enter New Password' placeholderTextColor={"gray"}/>
        <TextInput placeholder='Confirm New Password' placeholderTextColor={"gray"}/>
      </View>
        <Text style={styles.Otpcode}>Didn't Recieve a Code ? </Text>
        <Text style={styles.Otpcode1}>Resend Code</Text>
    </View>
    <TouchableOpacity style={styles.Otpbtn}><Text style={styles.Otpbtntext}>Change Password</Text></TouchableOpacity>
    </View>
    </>
  )
}

export default OtpVerification




const styles=StyleSheet.create({

  OtpVarify:{
    with:"100%",
    height:"100%",
    display:"flex",
    alignItems:"center",
    justifyContent:"space-between",
    flexDirection:"column",
    padding:20
  },
  OtpTop:{
    width:"100%",
    display:"flex",
    alignItems:"center",justifyContent:"space-between",
    flexDirection:"row",
    position:"relative"
  }
})