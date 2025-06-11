import { PermissionsAndroid } from "react-native";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";

export async function checkLocationPermission() {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted) {
        
        return true;
      } else {
        
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    // For iOS, you might want to check using a different method or just assume permission is granted
    return true; // Assuming permission is granted for iOS, or you can implement a similar check using a library
  }
}
export const checkEnableLocation = async () => {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000,
        })
          .then(() => {
            
            return true;
          })
          .catch((error) => {
            console.error("Error enabling location services:", error);
            return false;
          });

        return true;
      } else {
        // await checkLocationPermission()
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    return true;
  }
};
