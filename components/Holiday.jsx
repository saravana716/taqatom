import ProfileServices from "@/Services/API/ProfileServices";
import get from 'lodash/get';
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";
const Holiday = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selected, setSelected] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [holidayDetails, setHolidayDetails] = useState([]);

    const [selectedYear, setSelectedYear] = useState(`${new Date().getFullYear()}`);
  const [currentField, setCurrentField] = useState(null); // "start" or "end"
const selector=useSelector(function (data) {
  return data.empid
})
console.log("myuserid",selector);
  const handleDateChange = (event, date) => {
    console.log("date selected", date);


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
    navigation.navigate("Dashboard");
  }

  function opennavigate(event) {
    navigation.navigate(event);
  }




  //Get All Holidays//
  const getHolidayDetails = async () => {
  try {
    const RecentActivities = await ProfileServices.getHolidayDetails(selector, selectedYear);
    setHolidayDetails(RecentActivities);
  } catch (err) {
    console.warn("Request failed:", err);
  }
};

console.log('dataFormatConver(holidayDetails)', dataFormatConver(holidayDetails));
  useEffect(() => {
    getHolidayDetails();
  }, [selectedYear]);
const today = new Date();
const formattedToday = `${today.getFullYear()}-${padZero(today.getMonth() + 1)}-${padZero(today.getDate())}`;

function padZero(num) {
  return num < 10 ? `0${num}` : num;
}
 function dataFormatConver(values) {
    console.log('values', values);
    

      const result = {};
      values.forEach((item) => {
        const startDate = item.start_date;
        const duration = item.duration_day;
        const colorSetting = get(item,'color_setting') 
        for (let i = 0; i < duration; i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          const formattedDate = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
          result[formattedDate] = { selected: true, selectedColor: colorSetting };
        }
      });
      return result;
  }

  //Get All Holidays//
  return (
    <>
      <View style={styles.container}>
        <View style={styles.topcontainer}>
          <Image
            source={require("../assets/images/Assets/blue-bg.png")}
            style={styles.images}
          />
          <View style={styles.left}>
            <View style={styles.leftcon1}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={navigatepage}
              >
                <Icon name="angle-left" size={30} color="white" />
              </TouchableOpacity>
              <Text style={styles.modalText}>Holiday</Text>
            </View>
          </View>
          <Calendar
           current={formattedToday}
            // Customize the appearance of the calendar
            style={{
              width: "90%",
              borderWidth: 1,
              borderColor: "#697ce3",
              borderRadius: 10,
              alignSelf: "center", // <-- fix
              marginTop: -130, // or use padding/margin instead of absolute positioning
            }}
            // Specify the current date
            // Callback that gets called when the user selects a day
            onDayPress={(day) => {
              console.log("selected day", day);
            }}
                        onMonthChange={day => {
              console.log('selected day', day);
              setSelectedYear(day?.year)
            }}
          
            theme={{
              arrowColor: "#697ce3",
              selectedDayBackgroundColor: "#697ce3",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#697ce3",
              dayTextColor: "#2d4150",
              textDisabledColor: "#d9e1e8",
              dotColor: "#697ce3",
              selectedDotColor: "#ffffff",
              monthTextColor: "#697ce3",
              indicatorColor: "#697ce3",
            }}
               monthFormat={'MMMM yyyy'}
            hideExtraDays={true}
            hideDayNames={false}
            disableMonthChange={false}
            firstDay={1}
            showWeekNumbers={false}
            markedDates={{
    ...dataFormatConver(holidayDetails),
    [formattedToday]: {
      ...(dataFormatConver(holidayDetails)[formattedToday] || {}),
      selected: true,
      selectedColor: '#697ce3',
    },
  }}
      
          
          />
        </View>
        <View style={styles.HolidayBottom}>
          <View style={styles.HolidayText}>
            <Text style={styles.Texttitle}>Holiday</Text>
          </View>
          <ScrollView style={styles.HolidayContainer}>
          {holidayDetails.map(function (data,index) {
            return(  <View style={styles.holidaybox} key={index}>
              <View style={styles.leftbar}>
                <Text style={styles.dot}></Text>
                <View style={styles.dates}>
                  <Text style={styles.month}>{data.alias}</Text>
                  <Text style={styles.month1}>{data.start_date}</Text>
                </View>
              </View>
              <Text style={styles.perday}>{data.duration_day}{data.duration_day>1? "Days":"Day"}</Text>
            </View>)
          })}
           
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default Holiday;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
  },
  topcontainer: {
    width: "100%",
    height: "30%",
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    position: "relative",
  },
  images: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  left: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    position: "absolute",
    top: 0,
    left: 0,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  leftcon1: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  leftimg: {
    width: 70,
    height: 70,
    borderRadius: "100%",
    marginRight: 10,
  },
  closeButton: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  modalText: {
    fontSize: 20,
    fontWeight: "700", // ✅ Corrected
    width: "100%",
    textAlign: "center",
    color: "white",
  },
HolidayText: {
  width: "100%",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "flex-start", // typo here
},

  Texttitle: {
    fontSize: 18,
    fontWeight: 800,
  },
  HolidayBottom: {
    width: "100%",
    height: "45%",
    padding: 20,
  },
  HolidayContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    marginTop:15
  },
  holidaybox: {
    width: "100%",
    padding: 10,
    borderRadius: 15,
    backgroundColor: "lightgray",
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  leftbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  dot: {
    width: 20,
    height: 20,
    backgroundColor: "blue",
    borderRadius: 10,
    marginRight: 10,
  },
  dates: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  month: {
    fontSize: 16,
    fontWeight: "700",
  },
  month1: {
    color: "gray",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 3,
  },
  perday: {
    fontSize: 20,
    fontWeight: 600,
  },
});
