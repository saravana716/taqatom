import moment from 'moment';
import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {dateTimeToShow, formatDateTime} from '../utils/formatDateTime';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from 'react-native-popup-menu';
import {Iconify} from 'react-native-iconify';
import {Dropdown} from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import ProfileServices from '../Services/API/ProfileServices';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {formatErrorsToToastMessages} from '../utils/error-format';

export default function LeaveCard({
  newItem,
  componentId,
  employeeId,
  leaveList,
  leavePayCodes,
}) {
    const navigation=useNavigation()
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [revokeConfirmVisible, setRevokeConfirmVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(false);
  const [formatStartDate, setFormatStartDate] = useState(newItem?.start_time || null);
  const [dateStart, setDateStart] = useState(new Date());

  const [endDate, setEndDate] = useState(false);
  const [formatEndDate, setFormatEndDate] = useState(newItem?.end_time || null);
  const [dateEnd, setDateEnd] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [workCode, setWorkCode] = useState(newItem?.work_code || '');
  const [applyReason, setApplyReason] = useState(newItem?.apply_reason || '');
  const [showStartDateTime, setShowStartDateTime] = useState(false);
  const [showEndDateTime, setShowEndDateTime] = useState(false);

  const [punchStateList, setPunchStateList] = useState(newItem?.punch_state || '');
  const [payCode, setPayCode] = useState(newItem?.paycode_details?.id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [endDateError, setendDateError] = useState('');
  const [payCodeError, setPayCodeError] = useState('');
  const [startError, setStartError] = useState('');
  const [endError, setEndError] = useState('');

  const handleFulldetails = () => {
    navigation.navigate("LeaveRequestDetails",{ employeeId,
          newItem,
          leavePayCodes,
          leaveList,})
  
  };

  const showDeleteConfirmDialog = () => setDeleteConfirmVisible(true);
  const showRevokeConfirmDialog = () => setRevokeConfirmVisible(true);

  const onDateChange = useCallback((event, selectedDate) => {
    if (selectedDate) {
      const formattedDate = moment(selectedDate).format('DD MMMM YYYY');
      setDateStart(selectedDate);
      setFormatStartDate(formattedDate);
      setStartDate(false);
      setShowStartDateTime(true);
    } else setStartDate(false);
  }, []);

  const onTimeChange = useCallback((event, selectedTime) => {
    if (selectedTime) {
      const combinedDateTime = new Date(dateStart);
      combinedDateTime.setHours(selectedTime.getHours());
      combinedDateTime.setMinutes(selectedTime.getMinutes());
      const formattedDate = moment(combinedDateTime).format('YYYY-MM-DDTHH:mm:ss');
      setFormatStartDate(formattedDate);
      setShowStartDateTime(false);
    } else setShowStartDateTime(false);
  }, [dateStart]);

  const onEndDateChange = useCallback((event, selectedDate) => {
    if (selectedDate) {
      const formattedDate = moment(selectedDate).format('DD MMMM YYYY');
      setDateEnd(selectedDate);
      setFormatEndDate(formattedDate);
      setEndDate(false);
      setShowEndDateTime(true);
    }
  }, []);

  const onEndTimeChange = useCallback((event, selectedTime) => {
    if (selectedTime) {
      const combinedDateTime = new Date(dateEnd);
      combinedDateTime.setHours(selectedTime.getHours());
      combinedDateTime.setMinutes(selectedTime.getMinutes());
      const formattedDate = moment(combinedDateTime).format('YYYY-MM-DDTHH:mm:ss');
      setFormatEndDate(formattedDate);
      setShowEndDateTime(false);
    } else setShowEndDateTime(false);
  }, [dateEnd]);

  const renderItem = item => (
    <View style={styles.item}>
      <Text style={styles.textItem}>{item.name}</Text>
    </View>
  );

  const handleNumberChange = text => setWorkCode(text);

  const handleEditLeave = async () => {
    setendDateError('');
    setPayCodeError('');
    setStartError('');
    setEndError('');
    if (!formatStartDate) {
      setStartError('Start Date is required');
      return;
    } else if (!formatEndDate) {
      setEndError('End Date is required');
      return;
    } else if (new Date(formatEndDate) <= new Date(formatStartDate)) {
      setendDateError('End Date must be after Start Date');
      return;
    } else if (!payCode) {
      setPayCodeError('Paycode is required');
      return;
    }
    try {
      const response = await ProfileServices.editLeaveRequest({
        options: {
          employee: employeeId,
          start_time: formatDateTime(formatStartDate),
          end_time: formatDateTime(formatEndDate),
          pay_code: payCode,
          apply_reason: applyReason,
        },
        id: newItem?.id,
      });
      setIsLoading(false);
      setModalVisible(false);
      getLeaveList();
      Toast.show({type: 'success', text1: 'Updated Successfully', position: 'bottom'});
    } catch (error) {
      setIsLoading(false);
      formatErrorsToToastMessages(error);
      setModalVisible(false);
    }
  };

  const handleDelete = async () => {
    try {
      await ProfileServices.deleteLeaveRequest({id: newItem?.id});
      Toast.show({type: 'success', text1: 'Delete Success', position: 'bottom'});
      getLeaveList();
      setDeleteConfirmVisible(false);
    } catch (error) {
      formatErrorsToToastMessages(error);
    }
  };

  const handleRevoke = async () => {
    try {
      await ProfileServices.postLeaveRevoke(newItem?.id);
      Toast.show({type: 'success', text1: 'Revoke Success', position: 'bottom'});
      getLeaveList();
      setRevokeConfirmVisible(false);
    } catch (error) {
      formatErrorsToToastMessages(error);
      setRevokeConfirmVisible(false);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={handleFulldetails} style={styles.touchableFull} activeOpacity={1}>
        <View style={styles.card}>
          <View style={styles.topRow}>
            <View>
              {newItem?.approval_status === 3 && (
                <Text style={[styles.statusText, styles.rejectStatus]}>Rejected</Text>
              )}
              {newItem?.approval_status === 2 && (
                <Text style={[styles.statusText, styles.approveStatus]}>Approved</Text>
              )}
              {newItem?.approval_status === 1 && (
                <Text style={[styles.statusText, styles.pendingStatus]}>Pending</Text>
              )}
              {newItem?.approval_status === 4 && (
                <Text style={[styles.statusText, styles.revokeStatus]}>Revoked</Text>
              )}
            </View>
            <View>
              <Text style={styles.labelGray}>Start Date</Text>
              <Text style={styles.labelBold}>{dateTimeToShow(newItem?.start_time)}</Text>
            </View>
          </View>
          <View style={styles.bottomRow}>
            <View>
              <Text style={styles.labelGray}>End Date</Text>
              <Text style={styles.labelBold}>{dateTimeToShow(newItem?.end_time)}</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.labelGray}>Pay Code</Text>
              <Text style={styles.labelBold}>{newItem?.paycode_details?.name}</Text>
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
    padding: 4,
    borderRadius: 12,
    borderBottomWidth: 4,
    borderBottomColor: '#697CE3',
    marginBottom: 10,
     elevation: 4,
  // Shadow for iOS
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  },
  touchableFull: {
    width: '100%',
  },
  card: {
    padding: 16,
    borderRadius: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 6,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  rejectStatus: {
    backgroundColor: '#E4030308',
    borderColor: '#E40303',
    color: '#E40303',
  },
  approveStatus: {
    backgroundColor: '#08CA0F08',
    borderColor: '#08CA0F',
    color: '#08CA0F',
  },
  pendingStatus: {
    backgroundColor: '#D1A40408',
    borderColor: '#D1A404',
    color: '#D1A404',
  },
  revokeStatus: {
    backgroundColor: '#E4030308',
    borderColor: '#E40303',
    color: '#E40303',
  },
  labelGray: {
    fontSize: 12,
    color: '#888',
    fontWeight: 'bold',
  },
  labelBold: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    color: '#000',
    fontSize: 12,
  },
});
