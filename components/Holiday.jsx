import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tokens from "@/locales/tokens";
import get from "lodash/get";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";

import ProfileServices from "@/Services/API/ProfileServices";
import { useTranslation } from "react-i18next";


const Holiday = ({ navigation }) => {
    const {t,i18n}=useTranslation()
    const isRTL = i18n.language === 'ar';
    console.log("yyyyyyyyyyyyyyyyyyyy",isRTL);
  const [holidayDetails, setHolidayDetails] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Redux selector to get empid
  const selector = useSelector((state) => state.empid);
  // Fetch holidays for selected year
  const getHolidayDetails = async () => {
    try {
      const RecentActivities = await ProfileServices.getHolidayDetails(selector, selectedYear);
      setHolidayDetails(RecentActivities);
    } catch (err) {
      
    }
  };

  useEffect(() => {
    getHolidayDetails();
  }, [selectedYear]);

  // Format date helpers
  const padZero = (num) => (num < 10 ? `0${num}` : num);

  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${padZero(today.getMonth() + 1)}-${padZero(today.getDate())}`;

  // Convert holiday details into calendar markings
  const dataFormatConvert = (values) => {
    const result = {};
    values.forEach((item) => {
      const startDate = item.start_date;
      const duration = item.duration_day;
      const colorSetting = get(item, "color_setting", "#697ce3"); // fallback color

      for (let i = 0; i < duration; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const formattedDate = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
        result[formattedDate] = { selected: true, selectedColor: colorSetting };
      }
    });
    return result;
  };

  // Navigation back to Dashboard
  const navigateBack = () => navigation.navigate("Dashboard");

  return (
    <View style={styles.container}>
      <View style={styles.topcontainer}>
        <Image
          source={require("../assets/images/Assets/blue-bg.png")}
          style={styles.images}
        />
        <View style={styles.left}>
          <View style={styles.leftcon1}>
            <TouchableOpacity style={styles.closeButton} onPress={navigateBack}>
              <Icon name="angle-left" size={30} color="white" />
            </TouchableOpacity>
            <Text style={styles.modalText}>  {t(tokens.nav.holiday)}</Text>
          </View>
        </View>
        <Calendar
          current={formattedToday}
          style={styles.calendar}
          onDayPress={(day) => day}
          onMonthChange={(day) => {
            setSelectedYear(day?.year.toString());
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
          monthFormat={"MMMM yyyy"}
          hideExtraDays={true}
          firstDay={1}
          markedDates={{
            ...dataFormatConvert(holidayDetails),
            [formattedToday]: {
              ...(dataFormatConvert(holidayDetails)[formattedToday] || {}),
              selected: true,
              selectedColor: "#697ce3",
            },
          }}
        />
      </View>

      <View style={styles.HolidayBottom}>
        <View style={styles.HolidayText}>
          <Text style={[styles.Texttitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t(tokens.nav.holiday)}</Text>
        </View>

        <ScrollView style={styles.HolidayContainer}>
          {holidayDetails && holidayDetails.length > 0 ? (
            holidayDetails.map((data, index) => (
              <View
                style={styles.holidaybox}
                key={`${data.start_date}-${data.alias}-${index}`}
              >
                <View style={styles.leftbar}>
                  <Text style={styles.dot}></Text>
                  <View style={styles.dates}>
                    <Text style={styles.month}>{data.alias}</Text>
                    <Text style={styles.month1}>{data.start_date}</Text>
                  </View>
                </View>
                <Text style={styles.perday}>
                  {data.duration_day} {data.duration_day > 1 ?  t(tokens.common.days) :t(tokens.common.day)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No holidays found.
            </Text>
          )}
        </ScrollView>
      </View>
    </View>
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
    height: "65%",
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    position: "relative",
  },
  images: {
    width: "100%",
    height: "45%",
    resizeMode: "cover",
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  left: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    left: 0,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  leftcon1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  modalText: {
    fontSize: 20,
    fontWeight: "700",
    width: "100%",
    textAlign: "center",
    color: "white",
  },
  calendar: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#697ce3",
    borderRadius: 10,
    alignSelf: "center",
    marginTop: -130,
  },
  HolidayBottom: {
    width: "100%",
    height: "50%",
    paddingHorizontal: 20,
  },
  HolidayText: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  Texttitle: {
    width:"100%",
    fontSize: 18,
    fontWeight: "800",
  },
  HolidayContainer: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    marginTop: 15,
  },
  holidaybox: {
    width: "100%",
    padding: 10,
    borderRadius: 15,
    backgroundColor: "lightgray",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  dot: {
    width: 20,
    height: 20,
    backgroundColor: "blue",
    borderRadius: 10,
    marginRight: 10,
  },
  dates: {
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
    fontWeight: "600",
  },
});
