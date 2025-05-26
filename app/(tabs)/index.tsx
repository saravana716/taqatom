import { StyleSheet } from 'react-native';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Routing from "../../Routing/Routing";
export default function HomeScreen() {
  return (
   <SafeAreaProvider>
     {/* <View style={styles.main}> */}
     <SafeAreaView style={{width:"100%",flex:1}}>
     <Routing/>
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
  backgroundColor:"white"
}
});
