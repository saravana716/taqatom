import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import tokens from '@/locales/tokens';
import { useTranslation } from 'react-i18next';
import Icon from "react-native-vector-icons/FontAwesome";
export default function RequestScreen({navigation,

}) {
    const {t,i18n}=useTranslation()
    const isRTL = i18n.language === 'ar';
    
    
  const handleBack = () => {
    navigation.navigate("Dashboard")
  };

  const handleManualLogScreen = () => {
  navigation.navigate('ManualLogScreen')
  };

  const handleLeaveScreen = () => {
  navigation.navigate('LeaveScreen')
    
  };

  const handleOvertimeScreen = () => {
  navigation.navigate('OverTimeScreen')
   
  };

  const handleTrainingScreen = () => {
  navigation.navigate('Training')

  
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="angle-left" size={30} color="#697ce3" />
                    </TouchableOpacity>
          <Text style={styles.headerText}>
            {t(tokens.nav.request)}

          </Text>
        </View>
        <View style={styles.cardWrapper}>
          <View style={styles.card}>
            <TouchableOpacity onPress={handleManualLogScreen} style={[styles.item, {backgroundColor: '#F7F2FE'}]}>
              <Text style={styles.itemText}>
              {t(tokens.nav.manualLog)}

              </Text>
               <Icon name="angle-right" size={30} color="#697ce3" />
           </TouchableOpacity>

            <TouchableOpacity onPress={handleLeaveScreen} style={[styles.item, {backgroundColor: '#EFF4FF'}]}>
              <Text style={styles.itemText}>
              {t(tokens.nav.leave)}

              </Text>
             <Icon name="angle-right" size={30} color="#697ce3" />
               </TouchableOpacity>

            <TouchableOpacity onPress={handleOvertimeScreen} style={[styles.item, {backgroundColor: '#F0FAF9'}]}>
              <Text style={styles.itemText}>
              {t(tokens.nav.overtime)}

              </Text>
                <Icon name="angle-right" size={30} color="#697ce3" />
                </TouchableOpacity>

            <TouchableOpacity onPress={handleTrainingScreen} style={[styles.item, {backgroundColor: '#64A5F10D'}]}>
              <Text style={styles.itemText}>
              {t(tokens.nav.training)}

              </Text>
                <Icon name="angle-right" size={30} color="#697ce3" />
                </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor:"white"
  },
  innerContainer: {
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop:20
  },
  backButton: {
    paddingLeft: 4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    flex: 1,
    paddingRight: '15%',
  },
  cardWrapper: {
    padding: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 24,
    gap: 12,
  },
  item: {
    height: 80,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});
