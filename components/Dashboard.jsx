/* eslint-disable no-dupe-keys */
import ProfileServices from "@/Services/API/ProfileServices";
import AntDesign from "@expo/vector-icons/AntDesign";
import DateTimePicker from "@react-native-community/datetimepicker";
import { decode as atob } from "base-64";
import * as Location from "expo-location";
import get from "lodash/get";
import map from "lodash/map";
import moment from "moment";
import { useTranslation } from "react-i18next";
import tokens from "../locales/tokens";
import { LANG_CODES } from "../locales/translations/languages";
import { FEATURE_CODES } from "../utils/feature-constants";
// import { LANG_CODES } from '../locales/translations/languages';
import { myreducers } from "@/Store/Store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Dropdown } from "react-native-element-dropdown";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "./AuthContext";
const Dashboard = () => {
   const [profileUrl1, setProfileUrl1] = useState(null);

  const { i18n, t } = useTranslation();

  const navigation = useNavigation();
  const selectorid = useSelector(function (data) {
    return data.empid;
  });
  
  const employeeFullDetails = useSelector(function (data) {
    return data.employeeFullDetails;
  });
  
  const userDetails = useSelector(function (data) {
    return data.userDetails;
  });
  
 
const userpic = useSelector((data) => data.employeedetails);

useEffect(() => {
  if (userpic && userpic.length > 0) {
    setProfileUrl1(userpic[0]?.profile_url);
  }
}, [userpic]);

  const dispatch = useDispatch();
  const [workCode, setWorkCode] = useState();
  const [tokenDetail, setTokenDetail] = useState(null);
  const currentTime = new Date();

  const currentHour = currentTime.getHours();

  const [punchStateError, setPunchStateError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recent, setrecent] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [gender, setGender] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [formatdate, setformatdate] = useState("");
  const [formattime, setformattime] = useState("");
  const [subordinateName, setSubordinateName] = useState();

  const [getalldata, setgetalldata] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currenLatLocation, setCurrenLatLocation] = useState(12.9716);
  const [currenLongLocation, setCurrenLongLocation] = useState(77.5946);
  const [ProfilePicUrl, setProfilePicUrl] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(moment().format("D/M/YYYY"));
  const [UserDetails, setUserDetails] = useState([]);
  const [currentField, setCurrentField] = useState(null); // "start" or "end"
  const [empid, setempid] = useState("");
  const [recentactivity, setrecentactivity] = useState([]);
  const [updateKey, setUpdateKey] = useState(0);
  const {
    notifications,
    isError,
    isNotifyLoading,
    notificationsCount,
    mutate,
  } = ProfileServices.getNotifications();
  const unread = useMemo(() => {
    return notificationsCount;
  }, [notificationsCount]);
  

  const options = [
    {
      id: 0,
      label: "Check In",
    },
    {
      id: 1,
      label: "Check Out",
    },
    {
      id: 2,
      label: "Break Out",
    },
    {
      id: 3,
      label: "Break In",
    },
    {
      id: 4,
      label: "Overtime In",
    },
    {
      id: 5,
      label: "Overtime Out",
    },
  ];
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "blue" }]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };

  //

  const handleDateChange = (event, date) => {
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toLocaleDateString(); // e.g., 4/6/2025

      if (currentField === "start") {
        setStartDate(formattedDate);
        setEndDate(moment().format("D/M/YYYY")); // auto set to today
      } else if (currentField === "end") {
        setEndDate(formattedDate);
      }
    }
    setShowPicker(false);
  };

  async function navigateprofile(params) {
    try {
      let userid = await AsyncStorage.getItem("token");
      //

      navigation.navigate("Profile", dataToSend);
    } catch (err) {}
  }
  async function movepage(event) {
    try {
      navigation.navigate(event);
    } catch (err) {}
  }

  //

  //

  const { logout } = useContext(AuthContext);
  useEffect(() => {
    parseAccessToken();
  }, []);

  const parseAccessToken = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("token");
      //

      if (!accessToken || typeof accessToken !== "string") {
        throw new Error("Access token is missing or invalid");
      }

      const tokenParts = accessToken.split(".");
      if (tokenParts.length !== 3) {
        throw new Error("Invalid token format");
      }

      const encodedPayload = tokenParts[1];
      const decodedPayload = JSON.parse(atob(encodedPayload)); // ✅ Use base-64

      //
      let ids = decodedPayload.user_id;
      //

      setTokenDetail(decodedPayload);
      getUserDetails(decodedPayload.user_id);
      dispatch(myreducers.senddetails(decodedPayload));
      //

      return decodedPayload;
    } catch (error) {
      // 
      throw error;
    }
  };

  const getUserDetails = async (user_id) => {
    //

    try {
      //

      const userDetails = await ProfileServices.getUserDetailsData(user_id);

      setUserDetails([userDetails]);
      //

      const employee = await ProfileServices.getEmployeeDetailsData(
        userDetails?.username
      );
      //
      

      const empID = employee?.id;

      if (empID) {
        setempid(empID); // Set for future use
        await getRecentActivity(empID); // ✅ immediate use
        const fullDetails = await ProfileServices.getEmployeeFullDetails(empID);
        //

        setProfilePicUrl(fullDetails?.profile_url);
        setGender(fullDetails?.gender);
        dispatch(myreducers.sendempid(empID));
        dispatch(myreducers.sendempDetails(fullDetails));
      }
    } catch (err) {
      // 
    }
  };

  const getLocation = async () => {
    if (!(await isLocationEnabled())) return;
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location access is required.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      if (location && location.coords) {
        setCurrenLatLocation(location.coords.latitude);
        setCurrenLongLocation(location.coords.longitude);
      } else {
        Alert.alert("Error", "Could not retrieve coordinates.");
      }
    } catch (err) {
      
      Alert.alert("Error", "Failed to fetch location. Please enable GPS.");
    }
  };
  useEffect(() => {
    if (modalVisible1) {
      getLocation();
    }
  }, [modalVisible1]);
  // useEffect(() => {
  // async function chekc(params) {
  //   try{
  //     await logout()
  //   }
  //   catch(err){

  //   }
  // }
  // chekc()
  // }, [])

  const getRecentActivity = async (id) => {
    try {
      //

      const recents = await ProfileServices.getRecentActivityData(id);
      //
      //

      const graph = await ProfileServices.getExpenseGraph(id);
      setrecent(recents);
      //
      //
    } catch (err) {
      
    }
  };

  function toFixedIfNecessary(value, dp) {
    return +parseFloat(value).toFixed(dp);
  }

  const updateStatus = async (latitude, longitude) => {
    try {
      const currentTime = moment(new Date());

      const data = {
        latitude: toFixedIfNecessary(latitude, 6),
        longitude: toFixedIfNecessary(longitude, 6),
        punch_time: currentTime.format("YYYY-MM-DDTHH:mm:ss"),
        employee_id: empid,
        clock_type: value,
        work_code: workCode,
      };

      // ✅ Correct null/undefined check (0 is allowed)
      if (
        data.employee_id == null ||
        data.clock_type == null ||
        data.work_code == null
      ) {
        
        return;
      }

      console.log(
        "✅ Punching data:",
        data.employee_id,
        data.clock_type,
        data.work_code
      );

      const res = await ProfileServices.updateClockStatus(data);

      

      setModalVisible1(false); // Close modal after success

      Toast.show({
        type: "success",
        text1: getClockType(value),
        position: "bottom",
      });

      await getRecentActivity(empid);

      setWorkCode(null);
      setValue(null);

      return data;
    } catch (err) {
      
      setIsLoading(false);
    }
  };

  const getClockType = (value) => {
    //
    const num = Number(value);
    switch (num) {
      case 0:
        return "Check In";
      case 1:
        return "Check Out";
      case 2:
        return "Break Out";
      case 3:
        return "Break In";
      case 4:
        return "Overtime In";
      case 5:
        return "Overtime Out";
      default:
        return "-";
    }
  };

  const refreshLocation = async () => {
    setIsRefreshing(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrenLatLocation(location.coords.latitude);
      setCurrenLongLocation(location.coords.longitude);
    } catch (error) {
      
    } finally {
      setIsRefreshing(false);
    }
  };
  const handlePunchConfirm = async (latitude, longitude) => {
    if (value === null || value === undefined) {
      setPunchStateError("Punch type is required");
      return;
    }

    if (!workCode) {
      setPunchStateError("Work code is required");
      return;
    }

    await updateStatus(latitude, longitude);
    await getRecentActivity(empid);
    setModalVisible(false);
  };

  useEffect(() => {
    if (recent.length > 0) {
      const formatted = recent.map((data, index) => {
        const dateObj = new Date(data.updated_at);
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const day = dateObj.getDate();
        const monthIndex = dateObj.getMonth();
        const year = dateObj.getFullYear();
        const formattedDate = `${day} ${months[monthIndex]} ${year}`;

        const minutes = dateObj.getMinutes();
        //

        const seconds = dateObj.getSeconds();
        //

        const ampm = dateObj.getHours() >= 12 ? "PM" : "AM";
        let hours = dateObj.getHours() % 12;
        hours = hours ? hours : 12;
        const formattedTime = `${hours}:${
          minutes < 10 ? `0${minutes}` : minutes
        }:${seconds < 10 ? `0${seconds}` : seconds} ${ampm}`;
        //

        return {
          formattedDate,
          formattedTime,
          isoTime: moment.utc(dateObj).local().format(),
        };
      });

      // Just set the latest (first) one
      setformatdate(formatted[0].formattedDate);
      setformattime(formatted[0].formattedTime);
      //
      //
    }
  }, [recent]); // ✅ only runs when `recent` updates

  function convertUTCToLocal(dateStr) {
    const utcDate = new Date(dateStr);
    return new Date(
      utcDate.getTime() + utcDate.getTimezoneOffset() * 60000 * -1
    );
  }

  //
  //
  async function getdata() {
    try {
      if (!empid) return;

      let startFormatted = moment().format("YYYY-MM-DD");
      let endFormatted = moment().format("YYYY-MM-DD");

      if (startDate) {
        startFormatted = moment(startDate, "D/M/YYYY").format("YYYY-MM-DD");
      }

      if (endDate) {
        endFormatted = moment(endDate, "D/M/YYYY").format("YYYY-MM-DD");
      }

      const result = await ProfileServices.getRecentActivityAllData({
        id: empid,
        start: startFormatted,
        end: endFormatted,
      });

      setgetalldata(result);
    } catch (err) {
      
    }
  }
  useEffect(() => {
    getdata();
  }, [empid, startDate, endDate]);
  const getSubordinateName = async (id) => {
    console.log(
      "uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu"
    );

    try {
      const employeeName = await ProfileServices.getEmployeeNameDetails();
      
      

      setSubordinateName(employeeName);
    } catch (err) {
      
    }
  };

  useEffect(() => {
    getSubordinateName();
  }, []);

  const today = moment().format("YYYY-MM-DD");
  // useEffect(() => {
  //  async function Logout() {
  //     try {
  //      await logout()
  //     } catch (err) {
  //
  //     }
  //   }
  //   Logout()

  // }, [])
  async function openmodel(params) {
    try {
      setModalVisible(true);
      getdata();
    } catch (err) {}
  }
  // const handleLanguageChange = useCallback(async () => {
  //

  //     const language =
  //       i18n.language === LANG_CODES.ARABIC
  //         ? LANG_CODES.ENGLISH
  //         : LANG_CODES.ARABIC;

  //

  //     await i18n.changeLanguage(language);
  //     setCurrentLang(language); // Trigger re-render
  //   }, []);
  const dataToSend = {
    selectorid,
    setProfilePicUrl: (val) => setProfilePicUrl(val),
    employeeFullDetails,
    userDetails,
    ProfilePicUrl,
    setUpdateKey,
    updateKey,
    setGender: (val) => setGender(val),
    gender,
    subordinateName,
    setSubordinateName,
    token: tokenDetail,
  };
  

  async function handleNotificationScreen() {
    try {
      

      navigation.navigate("NotificationScreen", dataToSend);
      
    } catch (err) {
      
    }
  }
  
  const FEATURES_ARRAY = map(get(userDetails, "features", []), (el) => {
    return get(el, "name");
  });
  const IS_PAYROLL_ENABLED = FEATURES_ARRAY.includes(FEATURE_CODES.PAYROLL);

  const handleLanguageChange = useCallback(async () => {
    console.log(
      "pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp"
    );
    console.log("dddkgl;", LANG_CODES);
    

    const language =
      i18n.language === LANG_CODES.ARABIC
        ? LANG_CODES.ENGLISH
        : LANG_CODES.ARABIC;
    await i18n.changeLanguage(language);
    console.log(
      "gkngkndkfkgnknhghkkdfnkknknknkgndfkhnklfnhkfnhkfnkhnlkdfnhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh"
    );

    
  }, [i18n, t]);
  let greeting;
  

  if (currentHour < 12) {
    greeting = t(tokens.common.goodMorning);
  } else if (currentHour < 18) {
    greeting = t(tokens.common.goodafternoon);
  } else {
    greeting = t(tokens.common.goodevening);
  }

  const isLocationEnabled = async () => {
    const enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      Alert.alert("Location Disabled", "Please turn on location services.");
    }
    return enabled;
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView>
          <View style={styles.modalOverlay1}>
            <View style={styles.modalContainer}>
              <View style={styles.modelcon}>
                <View style={styles.modalContainer1}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Icon name="angle-left" size={30} color="black" />
                  </TouchableOpacity>
                  <Text
                    style={styles.modalText}
                    onPress={() => setModalVisible(false)}
                  >
                    {t(tokens.common.recentActivity)}
                  </Text>
                </View>
                <View style={styles.search}>
                  {showPicker && (
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                    />
                  )}

                  <TouchableOpacity
                    style={styles.models}
                    onPress={() => {
                      //

                      setCurrentField("start");
                      setShowPicker(true);
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: startDate ? "black" : "gray" }}>
                        {startDate || "Start Date"}
                      </Text>
                    </View>
                    <Image
                      source={require("../assets/images/Assets/calendar.png")}
                      style={styles.images1}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.models}
                    onPress={() => {
                      setCurrentField("end");
                      setShowPicker(true);
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: endDate ? "black" : "gray" }}>
                        {endDate || "End Date"}
                      </Text>
                    </View>
                    <Image
                      source={require("../assets/images/Assets/calendar.png")}
                      style={styles.images1}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView style={styles.dashscroll}>
                {getalldata.map((data, index) => {
                  const localDate = convertUTCToLocal(data.updated_at);

                  const dateString = localDate.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

             const hours = localDate.getHours();
    const minutes = localDate.getMinutes();

    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const ampm = hours >= 12 ? "pm" : "am";

    const timeString = `${formattedHours < 10 ? '0' : ''}${formattedHours}:${formattedMinutes} ${ampm}`;


                  return (
                    <View key={index} style={styles.scroll}>
                      <View style={styles.check}>
                        <Text style={styles.check}>
                          {getClockType(data.clock_type)}
                        </Text>
                        <Text style={styles.check1}>{dateString}</Text>
                      </View>
                      <Text style={styles.check2}>{timeString}</Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={() => setModalVisible1(false)}
      >
        <SafeAreaView>
          <View style={styles.modalOverlay}>
            <View style={styles.modalview}>
              <View style={styles.map}>
                {Platform.OS === "android" ? (
                  <View style={{ height: 160 }}>
                    <MapView
                      style={{ height: 160, width: "100%", borderRadius: 10 }}
                      region={{
                        latitude: currenLatLocation || 12.9716,
                        longitude: currenLongLocation || 77.5946,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                    >
                      {currenLatLocation && currenLongLocation && (
                        <Marker
                          coordinate={{
                            latitude: currenLatLocation,
                            longitude: currenLongLocation,
                          }}
                          title="Your Location"
                        >
                          <Image
                            source={require("../assets/images/Assets/live-location.png")}
                            style={{ width: 30, height: 30 }}
                          />
                        </Marker>
                      )}
                    </MapView>
                  </View>
                ) : (
                  <MapView
                    style={{ height: 160, width: "100%", borderRadius: 10 }}
                    region={{
                      latitude: currenLatLocation || 12.9716,
                      longitude: currenLongLocation || 77.5946,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    {currenLatLocation && currenLongLocation && (
                      <Marker
                        coordinate={{
                          latitude: currenLatLocation,
                          longitude: currenLongLocation,
                        }}
                        title="Your Location"
                      >
                        <Image
                          source={require("../assets/images/Assets/live-location.png")}
                          style={{ width: 30, height: 30 }}
                        />
                      </Marker>
                    )}
                  </MapView>
                )}
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: isRefreshing ? "#A9A9A9" : "#1E90FF",
                  padding: 10,
                  borderRadius: 5,
                  alignSelf: "flex-start",
                  marginBottom: 10,
                }}
                onPress={refreshLocation}
                disabled={isRefreshing}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {isRefreshing ? "Refreshing..." : "Refresh Location"}
                </Text>
              </TouchableOpacity>
              <View style={styles.containercheck}>
                {/* {renderLabel()} */}
                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus && { borderWidth: 1, borderColor: "#697ce3" },
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={options}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="id" // ✅ Fixed this line
                  placeholder={!isFocus ? "Punch State*" : "..."}
                  searchPlaceholder="Search..."
                  value={value}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(data) => {
                    setValue(data.id); // ✅ Set the actual ID value
                    setIsFocus(false);
                  }}
                  renderLeftIcon={() => (
                    <AntDesign
                      style={styles.icon}
                      color={isFocus ? "blue" : "black"}
                      name="Safety"
                      size={20}
                    />
                  )}
                />
              </View>
              {!value || punchStateError ? (
                <Text
                  style={{
                    color: "red",
                    fontSize: 12,
                    marginLeft: 4,
                  }}
                >
                  {punchStateError}
                </Text>
              ) : null}
              <TextInput
                placeholder="Work code (Optional)"
                placeholderTextColor={"gray"}
                style={styles.password}
                value={workCode}
                onChangeText={setWorkCode}
              />
              <View style={styles.dashbtn}>
                <TouchableOpacity
                  style={styles.dashbtn1}
                  onPress={() => setModalVisible1(false)}
                >
                  <Text style={styles.dashtext1}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dashbtn2}
                  onPress={() =>
                    handlePunchConfirm(currenLatLocation, currenLongLocation)
                  }
                >
                  <Text style={styles.dashtext2}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      <View style={styles.container}>
        <View style={styles.topcontainer}>
          <Image
            source={require("../assets/images/Assets/blue-bg.png")}
            style={styles.images12}
          />
          <View style={styles.left}>
            <View style={styles.leftcon}>
              <TouchableOpacity onPress={navigateprofile}>
                  <Image
                  source={
                    profileUrl1
                      ? { uri: profileUrl1 }
                      : require("../assets/images/Assets/edit-profile.png")
                  }
                  style={styles.leftimg}
                />
              </TouchableOpacity>
              {UserDetails.map(function (data, index) {
                return (
                  <View style={styles.leftcontent} key={index}>
                    <Text style={styles.lefttitle}>{greeting}</Text>
                    <Text style={styles.leftpara}>
                      {data.first_name} {data.last_name}
                    </Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.icons}>
              <TouchableOpacity onPress={handleLanguageChange}>
                {i18n.language === LANG_CODES.ARABIC ? (
                 <Icon name="language" size={25} color="#fff" />
                ) : (
                  <Icon name="globe" size={25} color="#fff" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNotificationScreen}
                style={styles.notificationbar}
              >
                <Icon name="bell" size={22} color="white" />
                {unread > 0 && (
                  <View style={styles.notification}>
                    <Text style={styles.notificationText}>{unread}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.punch}>
            <View style={styles.punchtitle}>
              <Text style={styles.punchday}>
                {t(tokens.common.todayOverview)}
              </Text>
              <Text style={styles.punchday1}>
                {moment().format("MMMM D, YYYY")}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => setModalVisible1(true)}
            >
              <Text style={styles.btntext}>Manual Punch</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.dash}>
          <View style={styles.hol}>
            <TouchableOpacity
              style={styles.dash1}
              onPress={() => movepage("Holiday")}
            >
              <Image
                source={require("../assets/images/Assets/holiday.png")}
                style={styles.images1}
              />
            </TouchableOpacity>
            <Text style={styles.holiday}> {t(tokens.nav.holiday)}</Text>
          </View>
          <View style={styles.hol}>
            <TouchableOpacity
              style={styles.dash1}
              onPress={() => movepage("Shift")}
            >
              <Image
                source={require("../assets/images/Assets/overtimes.png")}
                style={styles.images}
              />
            </TouchableOpacity>
            <Text style={styles.holiday}>{t(tokens.nav.shift)}</Text>
          </View>
          <View style={styles.hol}>
            <TouchableOpacity
              style={styles.dash1}
              onPress={() => movepage("Loan")}
            >
              <Image
                source={require("../assets/images/Assets/dollar.png")}
                style={styles.images}
              />
            </TouchableOpacity>
            <Text style={styles.holiday}>{t(tokens.nav.loan)}</Text>
          </View>
          <View style={styles.hol}>
            <TouchableOpacity
              style={styles.dash1}
              onPress={() => movepage("ReimbursementScreen")}
            >
              <Image
                source={require("../assets/images/Assets/payslip.png")}
                style={styles.images}
              />
            </TouchableOpacity>
            <Text style={styles.holiday}>{t(tokens.nav.expense)}</Text>
          </View>
        </View>
        <View style={styles.dash12}>
          <View style={styles.hol}>
            <TouchableOpacity
              style={styles.dash1}
              onPress={() => movepage("PaySlipScreen")}
            >
              <Image
                source={require("../assets/images/Assets/resignation-icon.png")}
                style={styles.images}
              />
            </TouchableOpacity>
            <Text style={styles.holiday}>{t(tokens.nav.paySlip)}</Text>
          </View>
          <View style={styles.hol}>
            <TouchableOpacity
              style={styles.dash1}
              onPress={() => movepage("ResignationScreen")}
            >
              <Image
                source={require("../assets/images/Assets/request-icon.png")}
                style={styles.images}
              />
            </TouchableOpacity>
            <Text style={styles.holiday}>{t(tokens.nav.resignation)}</Text>
          </View>
          <View style={styles.hol}>
            <TouchableOpacity
              style={styles.dash1}
              onPress={() => movepage("RequestScreen")}
            >
              <Image
                source={require("../assets/images/Assets/approval-icon.png")}
                style={styles.images}
              />
            </TouchableOpacity>
            <Text style={styles.holiday}>{t(tokens.nav.request)}</Text>
          </View>
          <View style={styles.hol}>
            <TouchableOpacity
              style={styles.dash1}
              onPress={() => movepage("ApprovalScreen")}
            >
              <Image
                source={require("../assets/images/Assets/reports.png")}
                style={styles.images}
              />
            </TouchableOpacity>
            <Text style={styles.holiday}>{t(tokens.nav.approvals)}</Text>
          </View>
        </View>
        <View style={styles.dash121}>
          <View style={styles.hol}>
            <TouchableOpacity
              style={styles.dash1}
              onPress={() => movepage("ReportScreen")}
            >
              <Image
                source={require("../assets/images/Assets/reports.png")}
                style={styles.images}
              />
            </TouchableOpacity>
            <Text style={styles.holiday}>{t(tokens.nav.reports)}</Text>
          </View>
        </View>
        <View style={styles.activity}>
          <View style={styles.activitytop}>
            <Text style={styles.recenttext}>
              {t(tokens.common.recentActivity)}
            </Text>
            <TouchableOpacity onPress={openmodel}>
              <Text style={styles.recenttext1}>
                {t(tokens.actions.viewAll)}
              </Text>
            </TouchableOpacity>
          </View>
         <ScrollView style={styles.myscroll}>
  {recent.map((data, index) => {
    const localDate = convertUTCToLocal(data.updated_at);

    const dateString = localDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const hours = localDate.getHours();
    const minutes = localDate.getMinutes();

    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const ampm = hours >= 12 ? "pm" : "am";

    const timeString = `${formattedHours < 10 ? '0' : ''}${formattedHours}:${formattedMinutes} ${ampm}`;

    return (
      <View key={index} style={styles.scroll}>
        <View style={styles.check}>
          <Text style={styles.check}>{getClockType(data.clock_type)}</Text>
          <Text style={styles.check1}>{dateString}</Text>
        </View>
        <Text style={styles.check2}>{timeString}</Text>
      </View>
    );
  })}
</ScrollView>

        </View>
        <Toast />
      </View>
    </>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f6f6f6",

    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
  },
  topcontainer: {
    width: "100%",
    height: "40%",
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    position: "relative",
  },
  images: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  images12: {
    width: "100%",
    height: "60%",
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
    top: 10,
    left: 0,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  leftcon: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  leftimg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 10,
  },
  lefttitle: {
    fontSize: 13,
    marginBottom: 5,
    color: "white",
  },
  leftpara: {
    color: "white",
    fontSize: 18,
    fontWeight: 700,
  },
  icons: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
  },
  icon: {
    width: 25,
    height: 25,
  },
  punch: {
    width: "90%", // must use fixed width for transform centering
    height: 160,
    backgroundColor: "white",
    position: "absolute",
    bottom: 40,
    padding: 15,
    borderRadius: 20,
    zIndex: 1,
    left: "50%",
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    transform: [{ translateX: "-50%" }], // half of the width
  },
  punchtitle: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  punchday: {
    fontSize: 14,
    color: "gray",
    fontWeight: 600,
    marginBottom: 5,
  },
  punchday1: {
    fontSize: 16,
    fontWeight: 800,
  },
  btn: {
    width: "100%",
    padding: 12,
    marginVertical: 15,
    borderRadius: 10,
    backgroundColor: "#697ce3",
  },
  btntext: {
    fontSize: 20,
    fontWeight: 600,
    textAlign: "center",
    color: "white",
  },
  dash: {
    width: "100%",
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingBottom: 20,
    gap: 40,
  },
  dash12: {
    width: "100%",
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 40,
  },
  dash121: {
    width: "100%",
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 40,
    marginVertical: 20,
  },
  hol: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  dash1: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "white",
    padding: 8,
    marginBottom: 10,
  },
  images1: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  holiday: {
    fontWeight: 600,
    fontSize: 11,
  },
  activity: {
    width: "90%",
    height: "40%",
    backgroundColor: "white",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    padding: 15,
  },
  activitytop: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  recenttext: {
    fontSize: 13,
    fontWeight: 600,
  },
  recenttext1: {
    fontSize: 13,
    color: "#697ce3",
    fontWeight: 600,
  },
  modalOverlay1: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
  },
  modalContainer: {
    width: "100%",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    // paddingTop:70
  },
  modalContainer1: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  modalText: {
    fontSize: 20,
    fontWeight: 700,
    width: "100%",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  closeimg: {
    width: 30,
    height: 30,
    zIndex: 10,
  },
  search: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 30,
  },
  models: {
    width: "100%",
    height: 60,
    borderColor: "#697ce3",
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  images1: {
    objectFit: "contain",
    width: 30,
    height: 30,
  },
  modalview: {
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "column",
    gap: 20,
  },
  modalOverlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: 20,
  },
  map: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    backgroundColor: "gray",
    marginBottom: 5,
  },
  refresh: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#697ce3",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  refreshbtn: {
    color: "white",
    fontWeight: 600,
  },
  password: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#697ce3",
    paddingHorizontal: 12,
    paddingVertical: 20,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "transparent",
    fontWeight: 600,
  },
  dashbtn: {
    width: "100%",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  dashbtn1: {
    padding: 15,
    borderColor: "#697ce3",
    borderWidth: 1,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dashtext1: {
    color: "#697ce3",
    fontSize: 14,
    fontWeight: 600,
  },
  dashbtn2: {
    width: "25%",
    padding: 15,
    borderColor: "#697ce3",
    borderWidth: 1,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    backgroundColor: "#697ce3",
  },
  dashtext2: {
    color: "#697ce3",
    fontSize: 14,
    fontWeight: 600,
    color: "white",
  },
  containercheck: {
    width: "100%",
    backgroundColor: "white",
    padding: 0,
  },
  dropdown: {
    height: 50,
    borderColor: "#697ce3",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  myscroll: {
    marginVertical: 15,
  },
  scroll: {
    width: "100%",
    padding: 10,
    backgroundColor: "#f6f6f6",
    borderRadius: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 15,
  },
  check: {
    fontSize: 13,
    fontWeight: "bold",
    color: "black",
    marginBottom: 4,
  },
  check1: {
    fontSize: 12,
    color: "gray",
    fontWeight: 600,
  },
  check2: {
    fontWeight: 800,
    color: "black",
    fontSize: 18,
  },
  dashscroll: {
    width: "100%",
    height: "70%",
    backgroundColor: "white",
    marginTop: 0,
    padding: 20,
  },
  modelcon: {
    width: "100%",
    height: "30%",
    backgroundColor: "#f6f6f6",
    padding: 20,
  },
  notificationbar: {
    position: "relative",
  },
  notification: {
    position: "absolute",
    width: 25,
    height: 25,
    borderRadius: 15,
    backgroundColor: "red",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: -13,
    left: 7,
  },
  notificationText: {
    fontSize: 12,
    color: "white",
  },
});
