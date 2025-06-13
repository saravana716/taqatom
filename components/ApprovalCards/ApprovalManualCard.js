import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Toast } from 'react-native-toast-message/lib/src/Toast';
import ProfileServices from '../../Services/API/ProfileServices';
import { formatErrorsToToastMessages } from '../../utils/error-format';
import { dateTimeToShow } from '../../utils/formatDateTime';
import { getPunchStateLabel } from '../../utils/getPunchStateLabel';

export default function ApprovalManualCard({ newItem, employeeId, componentId, getManualLogList }) {
  const navigation = useNavigation();
  const [approveConfirmVisible, setApproveConfirmVisible] = useState(false);
  const [rejectedConfirmVisible, setRejectedConfirmVisible] = useState(false);

  const handleFulldetails = () => {
     navigation.navigate('ApprovalManualLogDetails', {
       employeeId,
          newItem,
          getManualLogList
    });
   
  };

  const handleApprove = async () => {
    try {
      await ProfileServices.postManualLogApprove(newItem?.id);
      Toast.show({ type: 'success', text1: 'Approve Success', position: 'bottom' });
      getManualLogList();
      setApproveConfirmVisible(false);
    } catch (error) {
      formatErrorsToToastMessages(error);
      setApproveConfirmVisible(false);
    }
  };

  const handleRejected = async () => {
    try {
      await ProfileServices.postManualLogReject(newItem?.id);
      Toast.show({ type: 'success', text1: 'Reject Success', position: 'bottom' });
      getManualLogList();
      setRejectedConfirmVisible(false);
    } catch (error) {
      formatErrorsToToastMessages(error);
      setRejectedConfirmVisible(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 3:
        return { backgroundColor: '#E4030308', borderColor: '#E40303', color: '#E40303' };
      case 2:
        return { backgroundColor: '#08CA0F08', borderColor: '#08CA0F', color: '#08CA0F' };
      case 1:
        return { backgroundColor: '#D1A40408', borderColor: '#D1A404', color: '#D1A404' };
      case 4:
        return { backgroundColor: '#E4030308', borderColor: '#E40303', color: '#E40303' };
      default:
        return {};
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return 'Pending';
      case 2:
        return 'Approved';
      case 3:
        return 'Rejected';
      case 4:
        return 'Revoked';
      default:
        return '-';
    }
  };

  return (
    <View style={[styles.cardContainer, styles.flexRow, styles.rounded, styles.borderBottomBlue]}>
      <TouchableOpacity onPress={handleFulldetails} activeOpacity={1} style={styles.fullWidth}>
        <View style={styles.innerContainer}>
          <View style={[styles.flexRow, styles.justifyBetween, styles.paddingBottom]}>
            <View>
              <Text style={[styles.statusText, getStatusStyle(newItem?.approval_status)]}>
                {getStatusText(newItem?.approval_status)}
              </Text>
            </View>
            <View style={styles.alignRight}>
              <Text style={styles.label}>Punch Time</Text>
              <Text style={styles.value}>{dateTimeToShow(newItem?.punch_time)}</Text>
            </View>
          </View>
          <View style={[styles.flexRow, styles.justifyBetween]}>
            <View>
              <Text style={styles.label}>Punch State</Text>
              <Text style={styles.value}>{getPunchStateLabel(newItem?.punch_state)}</Text>
            </View>
            <View style={styles.alignRight}>
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
  padding: 8,
  borderRadius: 12,
  borderBottomWidth: 4,
  borderBottomColor: '#697CE3',
  marginBottom: 8,

  // ✅ Box shadow for iOS
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,

  // ✅ Elevation for Android
  elevation: 4,
},

  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
  paddingBottom: {
    paddingBottom: 16,
  },
  rounded: {
    borderRadius: 12,
  },
  fullWidth: {
    width: '100%',
    
  },
  innerContainer: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
  },
  label: {
    fontSize: 12,
    color: '#A0A0A0',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontWeight: 'bold',
  },
  borderBottomBlue: {
    borderBottomColor: '#697CE3',
  },
});
