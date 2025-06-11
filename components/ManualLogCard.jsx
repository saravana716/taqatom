import moment from 'moment';
import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {dateTimeToShow} from '../utils/formatDateTime';
import { useNavigation } from '@react-navigation/native';

import {getPunchStateLabel} from '../utils/getPunchStateLabel';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from 'react-native-popup-menu';
import ProfileServices from '../Services/API/ProfileServices';
import {Dropdown} from 'react-native-element-dropdown';
import {PUNCH_STATE_OPTIONS} from './PunchStateOptions';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ManualLogCard({
  newItem,
  employeeId,
  manualLogList,
  
}) {
    const navigation = useNavigation();
  const handleFulldetails = () => {
  navigation.navigate('ManualLogRequestDetails', {
      employeeId,
      newItem,
      manualLogList,
    });
 
  };

  const getApprovalLabel = (status) => {
    switch (status) {
      case 1:
        return {text: 'Pending', color: '#D1A404'};
      case 2:
        return {text: 'Approved', color: '#08CA0F'};
      case 3:
        return {text: 'Rejected', color: '#E40303'};
      case 4:
        return {text: 'Revoked', color: '#E40303'};
      default:
        return {text: '', color: '#000'};
    }
  };

  const status = getApprovalLabel(newItem?.approval_status);

  return (
    <View style={[styles.cardContainer, styles.cardBorder]}>
      <TouchableOpacity onPress={handleFulldetails} activeOpacity={1} style={{width: '100%'}}>
        <View style={styles.cardContent}>
          <View style={styles.topRow}>
            <View>
              {status.text !== '' && (
                <Text style={[styles.statusText, {
                  borderColor: status.color,
                  color: status.color,
                  backgroundColor: `${status.color}08`,
                }]}>
                  {status.text}
                </Text>
              )}
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.label}>Punch Time</Text>
              <Text style={styles.value}>{dateTimeToShow(newItem?.punch_time)}</Text>
            </View>
          </View>

          <View style={styles.bottomRow}>
            <View>
              <Text style={styles.label}>Punch State</Text>
              <Text style={styles.value}>{getPunchStateLabel(newItem?.punch_state)}</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.label}>Work Code</Text>
              <Text style={styles.value}>{newItem?.work_code}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.25,
    shadowRadius: 3,
    borderBottomWidth: 4,
    borderBottomColor: '#697CE3',
  },
  cardBorder: {
    borderTopWidth: 0.1,
    borderTopColor: '#000',
    borderLeftWidth: 0.1,
    borderLeftColor: '#000',
    borderRightWidth: 0.1,
    borderRightColor: '#000',
  },
  cardContent: {
    padding: 16,
    borderRadius: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: 'gray',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 12,
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontWeight: 'bold',
  },
});
