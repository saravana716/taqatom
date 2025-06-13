import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

export default function ApprovalScreen({ navigation, employeeId }) {
  const selectorid = useSelector(data => data.empid);
  

  const handleBack = () => {
    navigation.navigate('Dashboard');
  };

function navigateTo(event) {
  navigation.navigate(event)
}

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="angle-left" size={30} color="#697ce3" />
          </TouchableOpacity>
          <Text style={styles.title}>Approvals</Text>
        </View>

        <View style={styles.contentOuter}>
          <View style={styles.cardContainer}>
            <TouchableOpacity onPress={() => navigateTo('ApprovalManualLogScreen')} style={[styles.card, { backgroundColor: '#F7F2FE' }]}>
              <Text style={styles.cardText}>Manual Log</Text>
              <Icon name="angle-right" size={30} color="#697ce3" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigateTo('ApprovalLeaveScreen')} style={[styles.card, { backgroundColor: '#EFF4FF' }]}>
              <Text style={styles.cardText}>Leave</Text>
              <Icon name="angle-right" size={30} color="#697ce3" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigateTo('ApprovalOvertimeScreen')} style={[styles.card, { backgroundColor: '#F0FAF9' }]}>
              <Text style={styles.cardText}>Overtime</Text>
              <Icon name="angle-right" size={30} color="#697ce3" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigateTo('ApprovalTrainingScreen')} style={[styles.card, { backgroundColor: '#64A5F10D' }]}>
              <Text style={styles.cardText}>Training</Text>
              <Icon name="angle-right" size={30} color="#697ce3" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor:"white",
    paddingVertical:20
  },
  wrapper: {
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backButton: {
    paddingLeft: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    flex: 1,
    paddingRight: '15%',
  },
  contentOuter: {
    padding: 8,
    height: '100%',
    display:"flex",
    flexDirection:"column",
  },
  cardContainer: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 24,
    justifyContent: 'flex-start',
    gap:10

  },
  card: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'space-between',
  },
  cardText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});
