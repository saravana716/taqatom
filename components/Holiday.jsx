import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/FontAwesome';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { Modal } from "react-native";
const Holiday = ({navigation}) => {
     const [modalVisible, setModalVisible] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
     const [selected, setSelected] = useState('');
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
    function navigatepage(params) {
        navigation.navigate("Dashboard")
    }

    function opennavigate(event) {
      navigation.navigate(event)
    }
  return (
    <>
   
    <SafeAreaView>
   
 
 
    <View style={styles.container}>
        <View style={styles.topcontainer}>
            <Image source={require("../assets/images/Assets/blue-bg.png")} style={styles.images}/>
            <View style={styles.left}>
              <View style={styles.leftcon1}>
      <TouchableOpacity
                   style={styles.closeButton}
                   onPress={navigatepage}
                 >
                    <Icon name="angle-left" size={30} color="white" />                 </TouchableOpacity>
                 <Text style={styles.modalText}>Holiday</Text>
                 
              </View>
       
            </View>
      <Calendar
  // Customize the appearance of the calendar
style={{
  width: "90%",
  borderWidth: 1,
  borderColor: '#697ce3',
  borderRadius: 10,
  alignSelf: 'center', // <-- fix
  marginTop: -130,     // or use padding/margin instead of absolute positioning
}}

  // Specify the current date
  current={'2012-03-01'}
  // Callback that gets called when the user selects a day
  onDayPress={day => {
    console.log('selected day', day);
  }}
   theme={{
    arrowColor: '#697ce3',
    selectedDayBackgroundColor: '#697ce3',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#697ce3',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: '#697ce3',
    selectedDotColor: '#ffffff',
    monthTextColor: '#697ce3',
    indicatorColor: '#697ce3',
  }}
  // Mark specific dates as marked
//   markedDates={{
//     '2012-03-01': {selected: true, marked: true, selectedColor: 'b'},
//     '2012-03-02': {marked: true},
//     '2012-03-03': {selected: true, marked: true, selectedColor: 'blue'}
//   }}
/>
        </View>
     
    </View>
    </SafeAreaView>
    </>
  )
}

export default Holiday


const styles=StyleSheet.create({
  container:{
    width:"100%",
    height:"100%",
    backgroundColor:"white",
    display:"flex",
    alignItems:"center",
    justifyContent:"flex-start",
    flexDirection:"column"
  },
  topcontainer:{
    width:"100%",
    height:"30%",
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
  left:{
    width:"100%",
    display:"flex",
    alignItems:"center",
    justifyContent:"space-between",
    flexDirection:"row",
    position:"absolute",
    top:0,
    left:0,
    paddingVertical:40,
    paddingHorizontal:20

  },
  leftcon1:{
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    width:"100%",
    position:"relative",
  },
  leftimg:{
    width:70,
    height:70,
    borderRadius:"100%",
    marginRight:10
  },
      closeButton:{
      position:"absolute",
      left:0,
      top:0,
    },
   modalText:{
      fontSize:20,
      fontWeight:700,
      width:"100%",
      textAlign:"center",
      color:"white"
    },

})