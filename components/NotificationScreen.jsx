import React, { useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuProvider,
    MenuTrigger,
} from "react-native-popup-menu";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Icon from "react-native-vector-icons/FontAwesome";
import NotificationComponent from "../components/NotificationComponent";
import { useTranslation } from "react-i18next";
import tokens from "@/locales/tokens";
import ProfileServices from "../Services/API/ProfileServices";
import { formatErrorsToToastMessages } from "../utils/error-format";

export default function NotificationScreen({ navigation, route }) {
  const {
    selectorid,
    setProfilePicUrl,
    employeeFullDetails,
    userDetails,
    profilePicUrl,
    setUpdateKey,
    updateKey,
    setGender,
    gender,
    subordinateName,
    setSubordinateName,
    token,
  } = route.params;
   const {t,i18n}=useTranslation()
     const isRTL = i18n.language === 'ar';
     console.log("yyyyyyyyyyyyyyyyyyyy",isRTL);
  console.log('NotificationScreen Props:', {
    selectorid,
    setProfilePicUrl,
    employeeFullDetails,
    userDetails,
    profilePicUrl,
    setUpdateKey,
    updateKey,
    setGender,
    gender,
    subordinateName,
    setSubordinateName,
    token,
  });
  
  const [activeHead, setActiveHead] = useState(1);
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  const handlePress = (field) => {
    setActiveHead(field);
    if (field === 1) {
      setStatus("All");
    } else if (field === 2) {
      setStatus("Leaves");
    } else if (field === 3) {
      setStatus("Request");
    } else if (field === 4) {
      setStatus("Others");
    }
  };

  const handleBack = () => {
    navigation.navigate("Dashboard");
  };

  const { notifications, isError, isNotifyLoading, mutate } =
    ProfileServices.getNotifications();

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    try {
      const options = {
        notification_ids: map(notifications, (el) => el.id),
      };
      await ProfileServices.markNotifyAsRead(options);
      mutate();
      Toast.show({
        type: "success",
        text1: "All notifications marked as read",
        position: "bottom",
      });
    } catch (err) {
      formatErrorsToToastMessages(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MenuProvider>
      <View style={styles.container}>
        <View>
          <Image
            source={require("../assets/images/Assets/blue-bg.png")}
            style={styles.headerImage}
          />
          <View style={styles.headerWrapper}>
            <View style={styles.backButtonWrapper}>
              <TouchableOpacity onPress={handleBack}>
                <Icon name="angle-left" size={30} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.headerTitleWrapper}>
              <Text style={styles.headerTitle}>
                {t(tokens.nav.notification)}

              </Text>
            </View>
            <View style={styles.menuWrapper}>
              {!isEmpty(notifications) && (
                <Menu>
                  <MenuTrigger>
                    <Icon name="ellipsis-v" size={22} color="white" />
                  </MenuTrigger>
                  <MenuOptions customStyles={styles.menuOptions}>
                    <MenuOption onSelect={handleMarkAllAsRead}>
                      <View style={styles.menuOptionRow}>
                        <Icon name="check-double" size={20} color="white" />
                        <Text style={styles.menuOptionText}>
                          {t(tokens.messages.markAllRead)}
                          
                        </Text>
                      </View>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              )}
            </View>
          </View>
        </View>

        <View style={styles.contentWrapper}>
          <View style={styles.contentBox}>
            {isNotifyLoading ? (
              <View style={styles.loadingWrapper}>
                <ActivityIndicator size="large" color="#697CE3" />
              </View>
            ) : isEmpty(notifications) ? (
              <View style={styles.noDataWrapper}>
                <Text>{t(tokens.messages.noNotifications)}</Text>
              </View>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollArea}
              >
                {map(notifications, (notify) => (
                  <View key={notify?.id} style={styles.notificationItem}>
                    <NotificationComponent
                      key={notify?.id}
                      notify={notify}
                      mutate={mutate}
                      employeeId={selectorid}
                      setProfilePicUrl={setProfilePicUrl}
                      employeeFullDetails={employeeFullDetails}
                      userDetails={userDetails}
                      profilePicUrl={profilePicUrl}
                      setUpdateKey={setUpdateKey}
                      updateKey={updateKey}
                      setGender={setGender}
                      gender={gender}
                      subordinateName={subordinateName}
                      setSubordinateName={setSubordinateName}
                      token={token}
                    />
                  </View>
                ))}
              </ScrollView>
            )}
            <Toast />
          </View>
        </View>
      </View>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F3F4",
  },
  headerImage: {
    width: "100%",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerWrapper: {
    position: "absolute",
    top: 28,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButtonWrapper: {
    position: "absolute",
    left: 0,
  },
  headerTitleWrapper: {
    flex: 1,
    alignItems: "center",
    paddingRight: 32,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  menuWrapper: {
    position: "absolute",
    right: 0,
    paddingRight: 24,
  },
  menuOptions: {
    optionsContainer: {
      borderRadius: 8,
      padding: 5,
      width: 150,
    },
    optionWrapper: {
      padding: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    optionText: {
      fontSize: 16,
      marginLeft: 10,
    },
  },
  menuOptionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuOptionText: {
    marginLeft: 10,
    color: "black",
  },
  contentWrapper: {
    position: "absolute",
    top: 64,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
  },
  contentBox: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "white",
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollArea: {
    paddingTop: 12,
  },
  notificationItem: {
    paddingBottom: 8,
  },
});
