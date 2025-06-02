import ProfileServices from "@/Services/API/ProfileServices";
import AuthService from "@/Services/AuthService";
import { myreducers } from "@/Store/Store";
import AntDesign from "@expo/vector-icons/AntDesign";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch } from "react-redux";
const Dashboard = ({ navigation }) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [UserDetails, setUserDetails] = useState([]);
  const [currentField, setCurrentField] = useState(null); // "start" or "end"
  const [selectvalue, setselectvalue] = useState("Punch state*");
  const data = [
    { label: "Item 1", value: "1" },
    { label: "Item 2", value: "2" },
    { label: "Item 3", value: "3" },
    { label: "Item 4", value: "4" },
    { label: "Item 5", value: "5" },
    { label: "Item 6", value: "6" },
    { label: "Item 7", value: "7" },
    { label: "Item 8", value: "8" },
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
  function navigateprofile(params) {
    navigation.navigate("Profile");
  }
  async function movepage(event) {
    try {
      navigation.navigate(event);
    } catch (err) {}
  }

  const parseAccessToken = async () => {
    try {
      const accessToken = await AuthService.getToken();
      console.log("acesstoken", accessToken);

      const tokenParts = accessToken.split(".");
      console.log("wwwwwwwwwwwwww", tokenParts);

      if (tokenParts.length !== 3) {
        throw new Error("Invalid token format");
      }

      const encodedPayload = tokenParts[1];
      const decodedPayload = atob(encodedPayload);
      const parsedPayload = JSON.parse(decodedPayload);
      console.log("parese", parsedPayload);
      dispatch(myreducers.senddetails(parsedPayload));
      console.log("ppppppppppppppppppppp");
      console.log(parsedPayload?.user_id);

      getUserDetails(parsedPayload?.user_id);

      return parsedPayload;
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    parseAccessToken();
  }, []);
  async function getUserDetails(id) {
    try {
      console.log("oooouuuuuuuuuuuuuoo", id);
      const RecentActivities = await ProfileServices.getUserDetailsData(id);
      console.log("recent activites", RecentActivities);

      setUserDetails([RecentActivities]);
      console.log("uerrrr", UserDetails);

      const employeeId = await ProfileServices.getEmployeeDetailsData(
        RecentActivities?.username
      );
      console.log("employeeid", employeeId);

      const employeeFullDetails = await ProfileServices.getEmployeeFullDetails(
        employeeId?.id
      );
      setProfilePicUrl(`${employeeFullDetails?.profile_url}`);
      setGender(`${employeeFullDetails?.gender}`);
      // setEmployeeFullDetails(employeeFullDetails);

      // setEmployeeId(employeeId?.id);
      getRecentActivity(employeeId?.id);
    } catch (err) {}
  }
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
              <View style={styles.modalContainer1}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Icon name="angle-left" size={30} color="white" />{" "}
                </TouchableOpacity>
                <Text
                  style={styles.modalText}
                  onPress={() => setModalVisible(false)}
                >
                  Recent Activity
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
                    console.log("openkgndfngndjn");

                    setCurrentField("start");
                    setShowPicker(true);
                  }}
                >
                  <TouchableOpacity style={{ flex: 1 }}>
                    <Text style={{ color: startDate ? "black" : "gray" }}>
                      {startDate || "Start Date"}
                    </Text>
                  </TouchableOpacity>
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
                  <TouchableOpacity style={{ flex: 1 }}>
                    <Text style={{ color: endDate ? "black" : "gray" }}>
                      {endDate || "End Date"}
                    </Text>
                  </TouchableOpacity>
                  <Image
                    source={require("../assets/images/Assets/calendar.png")}
                    style={styles.images1}
                  />
                </TouchableOpacity>
              </View>
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
                <Text>lgjkdf</Text>
              </View>
              <TouchableOpacity style={styles.refresh}>
                <Text style={styles.refreshbtn}>Refresh</Text>
                <Icon
                  name="refresh"
                  size={20}
                  color="white"
                  fontWeight="400"
                  marginLeft="6"
                />
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
                  data={data}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? "Select item" : "..."}
                  searchPlaceholder="Search..."
                  value={value}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    setValue(item.value);
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

              <TextInput
                placeholder="Work code (Optional)"
                placeholderTextColor={"gray"}
                style={styles.password}
              />
              <View style={styles.dashbtn}>
                <TouchableOpacity
                  style={styles.dashbtn1}
                  onPress={() => setModalVisible1(false)}
                >
                  <Text style={styles.dashtext1}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dashbtn2}>
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
            style={styles.images}
          />
          <View style={styles.left}>
            <View style={styles.leftcon}>
              <TouchableOpacity onPress={navigateprofile}>
                <Image
                  source={require("../assets/images/Assets/edit-profile.png")}
                  style={styles.leftimg}
                />
              </TouchableOpacity>
              {UserDetails.map(function (data) {
                return (
                  <View style={styles.leftcontent}>
                    <Text style={styles.lefttitle}>Good Evening</Text>
                    <Text style={styles.leftpara}>
                      {data.first_name} {data.last_name}
                    </Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.icons}>
              <TouchableOpacity>
                <Icon name="language" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon name="bell" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.punch}>
            <View style={styles.punchtitle}>
              <Text style={styles.punchday}>Today Overview</Text>
              <Text style={styles.punchday1}>May 22,2025</Text>
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
            <Text style={styles.holiday}>Holiday</Text>
          </View>
          <View style={styles.hol}>
            <View style={styles.dash1}>
              <Image
                source={require("../assets/images/Assets/holiday.png")}
                style={styles.images}
              />
            </View>
            <Text style={styles.holiday}>Holiday</Text>
          </View>
          <View style={styles.hol}>
            <View style={styles.dash1}>
              <Image
                source={require("../assets/images/Assets/holiday.png")}
                style={styles.images}
              />
            </View>
            <Text style={styles.holiday}>Holiday</Text>
          </View>
          <View style={styles.hol}>
            <View style={styles.dash1}>
              <Image
                source={require("../assets/images/Assets/holiday.png")}
                style={styles.images}
              />
            </View>
            <Text style={styles.holiday}>Holiday</Text>
          </View>
          <View style={styles.hol}>
            <View style={styles.dash1}>
              <Image
                source={require("../assets/images/Assets/holiday.png")}
                style={styles.images}
              />
            </View>
            <Text style={styles.holiday}>Holiday</Text>
          </View>
          <View style={styles.hol}>
            <View style={styles.dash1}>
              <Image
                source={require("../assets/images/Assets/holiday.png")}
                style={styles.images}
              />
            </View>
            <Text style={styles.holiday}>Holiday</Text>
          </View>
          <View style={styles.hol}>
            <View style={styles.dash1}>
              <Image
                source={require("../assets/images/Assets/holiday.png")}
                style={styles.images}
              />
            </View>
            <Text style={styles.holiday}>Holiday</Text>
          </View>
          <View style={styles.hol}>
            <View style={styles.dash1}>
              <Image
                source={require("../assets/images/Assets/holiday.png")}
                style={styles.images}
              />
            </View>
            <Text style={styles.holiday}>Holiday</Text>
          </View>
        </View>
        <View style={styles.activity}>
          <View style={styles.activitytop}>
            <Text style={styles.recenttext}>Recent Activity</Text>
            <Text
              style={styles.recenttext1}
              onPress={() => setModalVisible(true)}
            >
              View All
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "lightgray",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
  },
  topcontainer: {
    width: "100%",
    height: "30%",
    backgroundColor: "red",
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
    bottom: -50,
    padding: 15,
    borderRadius: 20,
    zIndex: 1,
    left: "50%",
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
    padding: 20,
    height: "35%",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingTop: 80,
    gap: 40,
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
    height: "35%",
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
    padding: 20,
    backgroundColor: "lightgray",
    padding: 20,
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
});
