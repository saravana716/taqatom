import * as Location from "expo-location";
import { useEffect } from "react";
import { Alert, Linking, Platform, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { AuthProvider } from "../../components/AuthContext";
import Routing from "../../Routing/Routing";
import Store from "../../Store/Store";
import "../../locales/i18n";
export default function HomeScreen() {
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Location permission is needed to use this app.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }

      let locationEnabled = await Location.hasServicesEnabledAsync();
      if (!locationEnabled) {
        Alert.alert("Enable Location", "Please enable location services.", [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => openLocationSettings() },
        ]);
      }
    })();

    const openLocationSettings = () => {
      if (Platform.OS === "android") {
        Linking.openSettings(); // app settings on android
        // or Linking.openURL('android.settings.LOCATION_SOURCE_SETTINGS'); to open location settings directly (experimental)
      } else if (Platform.OS === "ios") {
        Linking.openURL("App-Prefs:Privacy&path=LOCATION"); // may or may not work on iOS
      }
    };
  }, []);
  return (
    <SafeAreaProvider>
      {/* <View style={styles.main}> */}
      <SafeAreaView
        style={{ width: "100%", flex: 1, backgroundColor: "black" }}
      >
        <Provider store={Store}>
          <AuthProvider>
            <Routing />
          </AuthProvider>
        </Provider>
      </SafeAreaView>
      {/* </View> */}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  main: {
    width: "100%",
    height: "100%",
    display: "flex",
    color: "white",
    flexDirection: "column",
    backgroundColor: "black",
  },
});
