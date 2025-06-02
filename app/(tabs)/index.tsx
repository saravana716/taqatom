  import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from "react-redux";
import Routing from "../../Routing/Routing";
import Store from "../../Store/Store";
import { AuthProvider } from '../../components/AuthContext';
  export default function HomeScreen() {
    return (
    <SafeAreaProvider>
      {/* <View style={styles.main}> */}
      <SafeAreaView style={{width:"100%",flex:1,backgroundColor:"black"}}>
  <Provider store={Store}>
<AuthProvider>
  <Routing/>
  </AuthProvider>  </Provider>
      </SafeAreaView>
      {/* </View> */}
    </SafeAreaProvider>
    );
  }

  const styles = StyleSheet.create({
  main:{
    width:"100%",
    height:"100%",
    display:"flex",
    color:"white",
    flexDirection:"column",
    backgroundColor:"black"
  }
  });
