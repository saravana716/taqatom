import { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
const ProfileUpdate = () => {
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
                                 <Text style={styles.modalText}>My Profile</Text>
                
            </View>
            <ScrollView Style={styles.updatecontent} style={{width:"100%",backgroundColor:"white",display:"flex",
    flexDirection:"column",
    gap:15,  paddingVertical:10,
    paddingHorizontal:20,borderRadius:15}} showsVerticalScrollIndicator={false}>
<View style={styles.profileupdate}>
              <View style={styles.po1}>
                  <Image source={require("../assets/images/Assets/edit-profile.png")} style={styles.po1}  resizeMode="cover"
                  
                  />
                <TouchableOpacity style={styles.po}>
                    <Icon name="edit" size={25} color="black" />    
                </TouchableOpacity>
              </View>
    </View>           
      <View style={styles.updatename}>
        <Text style={styles.titles}>Name</Text>
        <Text style={styles.titlename}>Test User</Text>
    </View>
     <View style={styles.updatename}>
        <Text style={styles.titles}>Name</Text>
        <Text style={styles.titlename}>Test User</Text>
    </View>
     <View style={styles.updatename}>
        <Text style={styles.titles}>Name</Text>
        <Text style={styles.titlename}>Test User</Text>
    </View>
     <View style={styles.updatename}>
        <Text style={styles.titles}>Name</Text>
        <Text style={styles.titlename}>Test User</Text>
    </View>
     <View style={styles.updatename}>
        <Text style={styles.titles}>Name</Text>
        <Text style={styles.titlename}>Test User</Text>
    </View>
     <View style={styles.updatename}>
        <Text style={styles.titles}>Name</Text>
        <Text style={styles.titlename}>Test User</Text>
    </View>
     <View style={styles.updatename}>
        <Text style={styles.titles}>Name</Text>
        <Text style={styles.titlename}>Test User</Text>
    </View>
     <View style={styles.updatename}>
        <Text style={styles.titles}>Name</Text>
        <Text style={styles.titlename}>Test User</Text>
    </View>
     <View style={styles.updatename}>
        <Text style={styles.titles}>Name</Text>
        <Text style={styles.titlename}>Test User</Text>
    </View>
     <View style={styles.updatename}>
        <Text style={styles.titles}>Name</Text>
        <Text style={styles.titlename}>Test User</Text>
    </View>
  </ScrollView>
        </View>
        </View>
    </View>
    </SafeAreaView>
    </>
  )
}

export default ProfileUpdate


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
 profileupdate:{
    width:"100%",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
 },
 po1:{
    borderRadius:100,
    width:130,
    height:130,
    position:"relative",objectFit:"cover"
 },
 po:{
    width:40,
    height:40,
    position:"absolute",
    backgroundColor:"white",
    borderRadius:100,borderWidth:1,
    borderColor:"black",
     display:"flex",
    alignItems:"center",
    justifyContent:"center",
    bottom:2,
    right:-2
 },
 fl:{
    width:"100%",
    display:"flex",
    flexDirection:"column",
    gap:15,
    paddingVertical:10,
 },
 updatename:{
    width:"100%",
    display:"flex",
    flexDirection:"column",
    backgroundColor:"lightgray",
    padding:15,
    borderRadius:15,
    gap:7,
    marginVertical:10
 },
 titles:{
    fontSize:12,
    color:"gray"
 },
 titlename:{
    fontWeight:800
 }
})

