import { myreducers } from "@/Store/Store";
import { useContext, useEffect, useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import ProfileServices from "../Services/API/ProfileServices";
import { AuthContext } from "./AuthContext";
const Profile = ({ navigation }) => {
   const { logout } = useContext(AuthContext);
  const dispatch = useDispatch();
  console.log(token);
  const selector = useSelector(function (data) {
    return data.userDetails.user_id;
  });
  console.log("selector", selector.user_id);

  const [token, settoken] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [gender, setGender] = useState("");

  const [UserDetails, setUserDetails] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [employeedetails, setemployeedetails] = useState([]);
  const [currentField, setCurrentField] = useState(null); // "start" or "end"

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
    dispatch(myreducers.employeeDetails(employeedetails));
    dispatch(myreducers.profiledetails({gender,profilePic}));
  }

  async function Logout() {
    try {
     await logout()
    } catch (err) {
      console.log("Logout Error:", err);
    }
  }

  async function getUserDetails(params) {
    try {
      console.log("function works");
      console.log("selectore", selector);

      const RecentActivities = await ProfileServices.getUserDetailsData(
        selector
      );
      console.log("oooooooooooooooooooooooooooooooooooooo");
      console.log("recentactivites", RecentActivities);
      setUserDetails([RecentActivities]);
      console.log("rr", UserDetails);

      const employeeId = await ProfileServices.getEmployeeDetailsData(
        RecentActivities?.username
      );
      console.log("employee id", employeeId);
      console.log(
        "ooooooooooouuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuooooooooooooooooooooooooooo"
      );

      let userDetails = await ProfileServices.getEmployeeFullDetails(
        employeeId?.id
      );
      console.log("useDetails", [userDetails]);
      // let data = [userDetails];
      console.log("fghjkl");
      
    setProfilePic(`${userDetails?.profile_url}`);
      setGender(`${userDetails?.gender}`);
      setemployeedetails([userDetails]);
    } catch (err) {}
  }
console.log(gender,profilePic);

  useEffect(() => {
    getUserDetails();
  }, [selector]);
  console.log("emp", employeedetails);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView>
          <View style={styles.modalOverlay}>
            <View style={styles.modalview}>
              <Text style={styles.logout}>Are You Sure to Logout ? </Text>
              <View style={styles.modalbtn}>
                <TouchableOpacity
                  style={styles.modalbtn1}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modaltext}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalbtn2} onPress={Logout}>
                  <Text style={styles.modaltext1}>Yes</Text>
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
            <View style={styles.leftcon1}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={navigatepage}
              >
                <Icon name="angle-left" size={30} color="white" />{" "}
              </TouchableOpacity>
              <Text style={styles.modalText}>My Profile</Text>
            </View>
          </View>

          <View style={styles.punch}>
            <View style={styles.pro}>
              <Image
                source={require("../assets/images/Assets/edit-profile.png")}
                style={styles.leftimg}
              />

              {employeedetails.map(function (data,index) {
  return (
    <View style={styles.punchtitle}>
      <Text style={styles.punchday1}>
        {data.first_name} {data.last_name}
      </Text>
      <Text style={styles.punchday}>{data.position_name}</Text>
    </View>
  );
})}
            </View>
            <View style={styles.between}>
              <Text style={styles.rep}>Reports To </Text>
              <Icon name="angle-right" size={25} color="gray" />

              <Text style={styles.rep1}>Not Assigned</Text>
            </View>
          </View>
        </View>
        <View style={styles.profilepage}>
          <TouchableOpacity
            style={styles.profileinfo}
            onPress={() => opennavigate("ProfileUpdate")}
          >
            <View style={styles.profileleft}>
              {" "}
              <Icon name="user" size={25} color="black" />
              <Text style={styles.my}>My Profile</Text>
            </View>
            <Icon name="angle-right" size={30} color="#697ce3" />
          </TouchableOpacity>
          <Text style={styles.ptotitle}>App Setting</Text>
          <TouchableOpacity
            style={styles.profileinfo}
            onPress={() => opennavigate("Password")}
          >
            <View style={styles.profileleft}>
              {" "}
              <Icon name="lock" size={25} color="black" />
              <Text style={styles.pass}>Change Password</Text>
            </View>
            <Icon name="angle-right" size={30} color="#697ce3" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileinfo1}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.profileleft}>
              {" "}
              <Icon name="sign-out" size={25} color="white" />
              <Text style={styles.log}>Logout</Text>
            </View>
            <Icon name="angle-right" size={30} color="white" />
          </TouchableOpacity>
          <View style={styles.about}>
            <Text style={styles.abouttitle}>About App</Text>
            <View style={styles.aboutme}>
              <View style={styles.version}>
                <View style={styles.profileleft}>
                  <Icon name="exclamation-circle" size={25} color="black" />
                  <Text style={styles.my}>Latest Version</Text>
                </View>
                <Text>0.1.4</Text>
              </View>
              <View style={styles.version}>
                <View style={styles.profileleft}>
                  <Icon name="android" size={25} color="black" />
                  <Text style={styles.my}>android Version</Text>
                </View>
                <Text>15</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
  },
  topcontainer: {
    width: "100%",
    height: "25%",
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
    borderRadius: 35,
    marginRight: 10,
  },
  lefttitle: {
    fontSize: 15,
    marginBottom: 5,
    color: "white",
  },
  leftpara: {
    color: "white",
    fontSize: 12,
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
    backgroundColor: "white",
    position: "absolute",
    bottom: -50,
    padding: 15,
    borderRadius: 20,
    zIndex: 1,
    left: "50%",
    transform: [{ translateX: "-50%" }], // half of the width,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  pro: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
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
    marginTop: 5,
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
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 50,
    paddingTop: 80,
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
    height: "100%",
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
    color: "white",
  },
  rep: {
    color: "gray",
    fontSize: 18,
    fontWeight: 600,
    marginRight: 8,
  },
  rep1: {
    color: "gray",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 600,
  },
  closeButton: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  between: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingTop: 15,
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
  profilepage: {
    width: "100%",
    height: "70%",
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  profileinfo: {
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#697ce3",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  profileinfo1: {
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#697ce3",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 15,
    backgroundColor: "#697ce3",
  },
  my: {
    fontSize: 17,
    fontWeight: 800,
    marginLeft: 8,
  },
  pass: {
    fontSize: 17,
    fontWeight: 600,
    marginLeft: 8,
    color: "gray",
  },
  log: {
    fontSize: 17,
    fontWeight: 800,
    marginLeft: 8,
    color: "white",
  },
  profileleft: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  ptotitle: {
    marginVertical: 15,
    fontSize: 18,
    fontWeight: 700,
  },
  about: {
    marginTop: 20,
  },
  abouttitle: {
    marginBottom: 15,
    fontSize: 18,
    fontWeight: 700,
  },
  aboutme: {
    borderWidth: 1,
    borderColor: "#697ce3",
    padding: 15,
    borderRadius: 15,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  version: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalview: {
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 20,
  },
  logout: {
    fontSize: 16,
    fontWeight: 700,
  },
  modalbtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  modalbtn1: {
    width: "47%",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "red",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modaltext: {
    fontSize: 16,
    fontWeight: 600,
    color: "red",
  },
  modaltext1: {
    fontSize: 16,
    fontWeight: 600,
    color: "white",
  },
  modalbtn2: {
    width: "47%",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#697ce3",
    backgroundColor: "#697ce3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
 
});
