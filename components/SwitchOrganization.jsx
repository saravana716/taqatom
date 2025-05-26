import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import AuthService from '../Services/AuthService';

const SwitchOrganization = ({navigation}) => {
    const [organizationNAme, setorganizationNAme] = useState("")

    async function getOrganizationName(event) {
        try{
setorganizationNAme(event)
        }
        catch(err){

        }
    }
    console.log(organizationNAme);
    async function submitDemo(params) {
        if (organizationNAme.trim()=="") {
            Toast.show({
        type: 'error',
        text1: 'Organization Name is required',
        position: 'bottom',
        visibilityTime: 2000,
      });
        }
        else{
                await AuthService.setDomainName(organizationNAme);
                   Toast.show({
        type: 'success',
        text1: 'Organization Name saved Successfully ',
        position: 'bottom',
        visibilityTime: 2000,
      });
setTimeout(() => {
                navigation.navigate("Login")
    
}, 1500);        }

    }
  return (
    <View style={styles.maincontainer}>
        <View style={styles.imageContainer}>
             <Image source={require('../assets/images/Assets/login-pic.png')}/>
        </View>
        <View style={styles.Content}>
            <Text style={styles.contentText}>Switch Organization</Text>
            <View style={styles.contentView}>
                <TextInput style={styles.Inputbox} placeholder="Organization Name" onChangeText={getOrganizationName} placeholderTextColor={"gray"}/>
                <TouchableOpacity style={styles.Btn}><Text style={styles.btnText} onPress={submitDemo}>Submit</Text></TouchableOpacity>
            </View>
        </View>
      <Toast />

    </View>
  )
}

export default SwitchOrganization



const styles=StyleSheet.create({
    maincontainer:{
        width:"100%",
        height:"100%",
        display:"flex",
        flexDirection:"column",
        backgroundColor:"white"
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