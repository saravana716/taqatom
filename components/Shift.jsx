import ProfileServices from "@/Services/API/ProfileServices";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";
import { formatErrorsToToastMessages } from "../utils/error-format";
import { useTranslation } from "react-i18next";
import tokens from "@/locales/tokens";
const Shift = ({ navigation }) => {
    const {t,i18n} = useTranslation();
    const isRTL = i18n.language === 'ar';
  const selector = useSelector((state) => state.empid);
  

  const [hide, setHide] = useState(false);
  const [recentShiftData, setRecentShiftData] = useState([]);
  const [recentActivityData, setRecentActivityData] = useState([]);

  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [fromDateShow, setFromDateShow] = useState(false);
  const [endDateShow, setEndDateShow] = useState(false);

  const currentDate = new Date();

  async function toggleBtn() {
    setHide((prev) => !prev);
  }

  const formatDate = (date) =>
    `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  // Convert time string "HH:mm" to 12-hour am/pm format
  function convertToAMPM(timeString) {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    let hoursInt = parseInt(hours, 10);
    const ampm = hoursInt >= 12 ? "pm" : "am";
    hoursInt = hoursInt % 12 || 12;
    return `${hoursInt}:${minutes.padStart(2, "0")} ${ampm}`;
  }

  useEffect(() => {
    const oneDayMilliseconds = 24 * 60 * 60 * 1000;
    setDate(new Date(currentDate.getTime() - oneDayMilliseconds));
  }, []);

  const getCustomShifts = async () => {
    try {
      const RecentActivities = await ProfileServices.getShiftDetails({
        id: Number(selector),
        start: moment(date).format("YYYY-MM-DD"),
        end: moment(endDate).format("YYYY-MM-DD"),
      });
      setRecentShiftData(RecentActivities);
    } catch (err) {
      formatErrorsToToastMessages(err);
    }
  };

  const getTodayShifts = async () => {
    try {
      const Recent = await ProfileServices.getShiftDetails({
        id: Number(selector),
        start: moment(currentDate).format("YYYY-MM-DD"),
        end: moment(currentDate).format("YYYY-MM-DD"),
      });
      setRecentActivityData(Recent);
      
    } catch (err) {
      
      formatErrorsToToastMessages(err);
    }
  };

  useEffect(() => {
    getTodayShifts();
  }, []);

  useEffect(() => {
    getCustomShifts();
  }, [date, endDate]);

  const onChange = (event, selectedDate) => {
    setFromDateShow(false);
    if (selectedDate) setDate(selectedDate);
  };

  const onChangeEnd = (event, selectedDate) => {
    setEndDateShow(false);
    if (selectedDate) setEndDate(selectedDate);
  };

  const convertToCustomFormat = (dateString) => {
    const dateObj = new Date(dateString);
    const day = dateObj.getUTCDate();
    const month = dateObj.getUTCMonth() + 1;
    const year = dateObj.getUTCFullYear();
    return `${day}:${month}:${year}`;
  };

  function navigatePage() {
    navigation.navigate("Dashboard");
  }

  const formattedDate = currentDate.toLocaleDateString();

  return (
    <View style={styles.shiftContainer}>
      <View style={styles.shiftTop}>
        <View style={styles.left}>
          <View style={styles.leftcon1}>
            <TouchableOpacity onPress={navigatePage} style={styles.closeButton}>
              <Icon name="angle-left" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalText}>{t(tokens.nav.shift)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.toggle}>
        <TouchableOpacity
          style={hide ? styles.touchbtn1 : styles.touchbtn}
          onPress={toggleBtn}
        >
          <Text style={hide ? styles.btn1 : styles.btn}>{t(tokens.nav.todayShift)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={hide ? styles.touchbtn : styles.touchbtn1}
          onPress={toggleBtn}
        >
          <Text style={hide ? styles.btn : styles.btn1}>{t(tokens.nav.customDate)}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.togglePage}>
        {!hide && (
          <View style={styles.page1}>
            <ScrollView style={styles.scrollpage}>
              {recentActivityData.map((data, index) => (
                <View style={styles.scrollbox} key={index}>
                  <View style={styles.top}>
                    <Text style={styles.date}>{formattedDate}</Text>
                  </View>

                  <View style={styles.box}>
                    <View style={styles.box1}>
                      <View style={styles.shiftleft1}>
                        {data.holiday_alias ? (
                          <Text style={styles.Shifttext}>{data.holiday_alias}</Text>
                        ) : (
                          <Text style={styles.Shifttext}>{data.shift?.name}</Text>
                        )}

                        {!data.holiday_alias && (
                          <Text style={styles.Shifttext1}>
                            {convertToAMPM(data.start_time)} - {convertToAMPM(data.end_time)}
                          </Text>
                        )}
                      </View>

                      <View style={styles.shift1}>
                        {!data?.holiday_alias && (
                          <Text style={styles.Shift1text}>
                            {data?.break_times?.[0]
                              ? `${data.break_times[0].duration} Mins`
                              : "-"}
                          </Text>
                        )}
                        <Text style={styles.Shift1text2}> {t(tokens.nav.breakTime)}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {hide && (
          <View style={styles.page2}>
            <View style={styles.datePickerContainer}>
              <TouchableOpacity onPress={() => setFromDateShow(true)} style={styles.dateInputRow}>
                <Text>{convertToCustomFormat(date)}</Text>
                <Icon name="calendar" size={16} color="#693ce3" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setEndDateShow(true)} style={styles.dateInputRow}>
                <Text>{convertToCustomFormat(endDate)}</Text>
                <Icon name="calendar" size={16} color="#693ce3" />
              </TouchableOpacity>
            </View>

            {fromDateShow && (
              <DateTimePicker
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChange}
                // minDate={new Date()} // optionally uncomment to restrict past dates
              />
            )}

            {endDateShow && (
              <DateTimePicker
                value={endDate}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChangeEnd}
                // minDate={date} // optionally uncomment to restrict endDate >= startDate
              />
            )}

            <ScrollView style={styles.scrollpage1}>
              {recentShiftData.map((data, index) => (
                <View style={styles.scrollbox} key={index}>
                  <View style={styles.top1}>
                    <Text style={styles.date}>{data.shift_type}</Text>
                    <Text style={styles.date}>{data.date}</Text>
                  </View>

                  <View style={styles.box}>
                    <View style={styles.box1}>
                      <View style={styles.shiftleft1}>
                        {data.holiday_alias ? (
                          <Text style={styles.Shifttext}>{data.holiday_alias}</Text>
                        ) : (
                          <Text style={styles.Shifttext}>{data.shift?.name}</Text>
                        )}

                        {!data.holiday_alias && (
                          <Text style={styles.Shifttext1}>
                            {convertToAMPM(data.start_time)} - {convertToAMPM(data.end_time)}
                          </Text>
                        )}
                      </View>

                      <View style={styles.shift1}>
                        {!data?.holiday_alias && (
                          <Text style={styles.Shift1text}>
                            {data?.break_times?.[0]
                              ? `${data.break_times[0].duration} Mins`
                              : "-"}
                          </Text>
                        )}
                        <Text style={styles.Shift1text2}> {t(tokens.nav.breakTime)}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

export default Shift;

const styles = StyleSheet.create({
  shiftContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 20,
backgroundColor: "#f6f6f6",
  },
  shiftTop: {
    width: "100%",
    height: "10%",
    position: "relative",
  },
  left: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 0,
  },
  leftcon1: {
    display: "flex",
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
    color: "black",
  },
  toggle: {
    width: "100%",
    height: "5%",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  touchbtn: {
    width: "50%",
    height: "100%",
    backgroundColor: "#693ce3",
    borderRadius: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    color: "white",
    fontWeight: "500",
    fontSize: 18,
  },
  touchbtn1: {
    width: "50%",
    height: "100%",
    borderRadius: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btn1: {
    color: "black",
    fontWeight: "500",
    fontSize: 18,
  },
  togglePage: {
    width: "100%",
    height: "85%",
    display: "flex",
    flexDirection: "column",
    paddingVertical: 20,
  },
  page1: {
    width: "100%",
    height: "100%",
  },
  page2: {
    width: "100%",
    height: "100%",
  },
  scrollpage1: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  scrollpage: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  scrollbox: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  top: {
    width: "100%",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    padding: 8,
    backgroundColor: "#693ce3",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  top1: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#693ce3",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  date: {
    color: "white",
    fontWeight: "600",
  },
  box: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  box1: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,

    // iOS shadow
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Android shadow
    elevation: 5,
  },
  Shifttext: {
    color: "#693ce3",
    fontWeight: "500",
  },
  Shift1text2: {
    borderWidth: 1,
    borderColor: "#693ce3",
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 9,
    marginTop: 5,
    backgroundColor: "rgba(105, 60, 227, 0.2)",
    color: "#693ce3",
  },
  shift1: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    fontWeight: "500",
  },
  Shift1text: {
    fontSize: 16,
    fontWeight: "500",
  },
  datePickerContainer: {
    width: "100%",
    height: "25%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 10,
  },
  dateInputRow: {
    width: "80%",
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#693ce3",
  },
});
