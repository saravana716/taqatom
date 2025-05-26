import { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Image, ScrollView, StyleSheet, Text,TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
const PasswordUpdate = () => {
     const [modalVisible, setModalVisible] = useState(false);
const [showPicker, setShowPicker] = useState(false);
const [selectedDate, setSelectedDate] = useState(new Date());
const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);
const [currentField, setCurrentField] = useState(null); // "start" or "end"


    const handleDateChange = (event, date) => {
      console.log("date selected",date);
      
  if (date) {
    setSelectedDate(date);
    if (currentField === "start") {
      setStartDate(date.toLocaleDateString());
    } else if (currentField === "end") {
      setEndDate(date.toLocaleDateString());
    }
  }
  setShowPicker(false);
};
function navigateprofile(params) {
  navigation.navigate("Profile")
}

  return (
    <>
       <SafeAreaView>
       
     
     
        <View style={styles.container}>
            <View style={styles.topcontainer}>
                <Image source={require("../assets/images/Assets/blue-bg.png")} style={styles.images}/>
                
            </View>
            <View style={styles.updateproinner}>
                <View style={styles.updatepro}>
                <View style={styles.updatetop}>
                    <Icon name="angle-left" size={30} color="white" />    
                                     <Text style={styles.modalText}>Change Password</Text>
                    
                </View>
                <ScrollView Style={styles.updatecontent} style={{width:"100%",backgroundColor:"white",display:"flex",
        flexDirection:"column",
        gap:15,  paddingVertical:10,
        paddingHorizontal:20,borderRadius:15}} showsVerticalScrollIndicator={false}>
            <View style={styles.inputs}>
                <Text style={styles.des}>Old Password</Text>
                <TextInput placeholder='Old Password'placeholderTextColor={"gray"} style={styles.pass}/>
            </View>
             <View style={styles.inputs}>
                <Text style={styles.des}>New Password</Text>
                <TextInput placeholder='New Password'placeholderTextColor={"gray"} style={styles.pass}/>
            </View>
             <View style={styles.inputs}>
                <Text style={styles.des}>Confirm New Password</Text>
                <TextInput placeholder='Confirm New Password'placeholderTextColor={"gray"} style={styles.pass}/>
            </View>
            <TouchableOpacity style={styles.passbtn}><Text style={styles.passtext}>Save</Text></TouchableOpacity>
      </ScrollView>
            </View>
            </View>
        </View>
        </SafeAreaView>
    </>
  )
}

export default PasswordUpdate



const styles=StyleSheet.create({
  container:{
    width:"100%",
    height:"100%",
    backgroundColor:"lightgray",
    display:"flex",
    alignItems:"center",
    justifyContent:"flex-start",
    flexDirection:"column",
  },
  topcontainer:{
    width:"100%",
    height:"30%",
    backgroundColor:"red",
    borderBottomRightRadius:30,
    borderBottomLeftRadius:30,
    position:"relative",
  },
  images:{
    width:"100%",
    height:"100%",
    objectFit:"cover",
       borderBottomRightRadius:30,
    borderBottomLeftRadius:30
  },
 updateproinner:{
    width:"90%",
    height:"95%",
    backgroundColor:"transparent",
    padding:0,
    position:"absolute",
    top:"50%",
    left:"50%",
    transform:"translate(-50%,-50%)",
    display:"flex",
    alignItems:"center",
    justifyContent:"space-between",
    flexDirection:"column"
 },
 updatepro:{
    width:"100%",
    height:"100%",
   display:"flex",
    alignItems:"center",
    justifyContent:"space-between",
    flexDirection:"column",
    gap:20,
 },
 updatetop:{
    width:"100%",
     display:"flex",
    alignItems:"center",
    justifyContent:"space-between",
    flexDirection:"row",
    position:"relative",
 },
 modalText:{
     fontSize:20,
      fontWeight:700,
      width:"100%",
      textAlign:"center",
      color:"white"
 },
 updatecontent:{
    width:"100%",
    height:"100%",
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:15,
     display:"flex",
    alignItems:"center",
    justifyContent:"space-between",
    flexDirection:"column",
    gap:15
  
 },
 inputs:{
    width:"100%",
    display:"flex",
    flexDirection:"column",
    gap:7
    
 },
 des:{
    fontSize:15,
    fontWeight:600,
    marginBottom:7
 },
 pass:{
  width:"100%",
  borderWidth:1,
  borderColor:"#697ce3",
  paddingHorizontal:12,
  paddingVertical:20,
  borderRadius:10,
  marginBottom:10
 },
 passbtn:{
  width:"100%",
  padding:20,
  display:"flex",
  alignItems:"center",
  justifyContent:"center",flexDirection:"column",
  borderRadius:10,backgroundColor:"#697ce3"
 },
 passtext:{
  fontSize:18,
  fontWeight:600,
  color:"white"
 }



 })

