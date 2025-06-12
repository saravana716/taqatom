import DateTimePicker from '@react-native-community/datetimepicker';
import find from 'lodash/find';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from "react-native-vector-icons/FontAwesome";

import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import ProfileServices from '../../Services/API/ProfileServices';
import { formatErrorsToToastMessages } from '../../utils/error-format';
import { formatDateTime } from '../../utils/formatDateTime';

export default function LeaveRequestDetails({
navigation,route
}) {
  const { employeeId, newItem, leavePayCodes,leaveList } = route.params;
  const {t}=useTranslation()
  const [isLoading, setIsLoading] = useState(false);
  const [leaveData, setLeaveData] = useState([]);
  const matchedLeaveData = find(leaveData, log => log.id === newItem?.id);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [revokeConfirmVisible, setRevokeConfirmVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(false);
  const [formatStartDate, setFormatStartDate] = useState(
    matchedLeaveData?.start_time || null,
  );
  const [dateStart, setDateStart] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());

  const [endDate, setEndDate] = useState(false);
  const [formatEndDate, setFormatEndDate] = useState(
    matchedLeaveData?.end_time || null,
  );
  const [dateEnd, setDateEnd] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [workCode, setWorkCode] = useState(matchedLeaveData?.work_code || '');
  const [applyReason, setApplyReason] = useState(
    matchedLeaveData?.apply_reason || '',
  );
  const [showStartDateTime, setShowStartDateTime] = useState(false);
  const [showEndDateTime, setShowEndDateTime] = useState(false);

  const [payCode, setPayCode] = useState(
    matchedLeaveData?.paycode_details?.id || '',
  );
  const [endDateError, setendDateError] = useState('');
  const [payCodeError, setPayCodeError] = useState('');
  const [startError, setStartError] = useState('');
  const [endError, setEndError] = useState('');

  const handleBack = () => {
    navigation.navigate("LeaveScreen")
  };

  const getLeaveList = async () => {
    try {
      const RecentActivities = await ProfileServices.getLeaveData(employeeId);
      setLeaveData(RecentActivities?.results);
    } catch (error) {
     formatErrorsToToastMessages(error)
    }
  };

  const showDeleteConfirmDialog = () => {
    setDeleteConfirmVisible(true);
  };

  const showRevokeConfirmDialog = () => {
    setRevokeConfirmVisible(true);
  };

  const onDateChange = useCallback((event, selectedDate) => {
    if (selectedDate) {
      const formattedDate = moment(selectedDate).format('DD MMMM YYYY');

      setDateStart(selectedDate);
      setFormatStartDate(formattedDate);
      setStartDate(false);
      setShowStartDateTime(true);
    } else {
      setStartDate(false);
    }
  }, []);

  const onTimeChange = useCallback(
    (event, selectedTime) => {
      if (selectedTime) {
        const combinedDateTime = new Date(dateStart);
        combinedDateTime.setHours(selectedTime.getHours());
        combinedDateTime.setMinutes(selectedTime.getMinutes());
        const formattedDate = moment(combinedDateTime).format(
          'YYYY-MM-DDTHH:mm:ss',
        );
        setFormatStartDate(formattedDate);
        setShowStartDateTime(false);
      } else {
        setShowStartDateTime(false);
      }
    },
    [dateStart],
  );

  const onEndDateChange = useCallback((event, selectedDate) => {
    if (selectedDate) {
      const formattedDate = moment(selectedDate).format('DD MMMM YYYY');

      setDateEnd(selectedDate);
      setFormatEndDate(formattedDate);
      setEndDate(false);
      setShowEndDateTime(true);
    }
  }, []);

  const onEndTimeChange = useCallback(
    (event, selectedTime) => {
      if (selectedTime) {
        const combinedDateTime = new Date(dateEnd);
        combinedDateTime.setHours(selectedTime.getHours());
        combinedDateTime.setMinutes(selectedTime.getMinutes());
        const formattedDate = moment(combinedDateTime).format(
          'YYYY-MM-DDTHH:mm:ss',
        );
        setFormatEndDate(formattedDate);
        setShowEndDateTime(false);
      } else {
        setShowEndDateTime(false);
      }
    },
    [dateEnd],
  );

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.name}</Text>
      </View>
    );
  };

  const handleNumberChange = text => {
    setWorkCode(text);
  };
  const handleEditLeave = async () => {
    setendDateError('');
    setPayCodeError('');
    setStartError('');
    setEndError('');
    if (!formatStartDate) {
      setStartError('Start Date is required');
      return;
    } else if (!formatEndDate) {
      setEndError('End Date is Required');
      return;
    } else if (new Date(formatEndDate) <= new Date(formatStartDate)) {
      setendDateError('End Date must be after Start Date');
      return;
    } else if (!payCode) {
      setPayCodeError('Paycode is Required');
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
        id: matchedLeaveData?.id,
      });
      setIsLoading(false);
      setModalVisible(false);
      getLeaveList();

      Toast.show({
        type: 'success',
        text1: 'Updated Successfully',
        position: 'bottom',
      });
    } catch (error) {
      setIsLoading(false);
     formatErrorsToToastMessages(error)
      setModalVisible(false);
    }
  };
  const handleDelete = async () => {
    try {
      const response = await ProfileServices.deleteLeaveRequest({
        id: matchedLeaveData?.id,
      });
      setDeleteConfirmVisible(false);
      leaveList();
      handleBack();
      setTimeout(() => {
        Toast.show({
          type: 'success',
          text1: 'Delete Success',
          position: 'bottom',
        });
      }, 1000);
    } catch (error) {
      formatErrorsToToastMessages(error)
    }
  };
  const handleRevoke = async () => {
    try {
      const response = await ProfileServices.postLeaveRevoke(
        matchedLeaveData?.id,
      );
      getLeaveList();
      setRevokeConfirmVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Revoke Success',
        position: 'bottom',
      });
    } catch (error) {
      formatErrorsToToastMessages(error)
      setRevokeConfirmVisible(false);
    }
  };

  useEffect(() => {
    getLeaveList();
  }, []);
  useEffect(() => {
    if (matchedLeaveData) {
      setFormatStartDate(matchedLeaveData.start_time || null);
      setFormatEndDate(matchedLeaveData.end_time || null);
      setApplyReason(matchedLeaveData.apply_reason || '');
    }
  }, [matchedLeaveData]);
  return (
    <>
    <MenuProvider style={styles.maincon}>
         {!matchedLeaveData ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#697CE3" />
        </View>
      ) : (
        <>
          <View style={styles.headerContainer}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={handleBack}>
              <Icon name="angle-left" size={30} color="black" />
                      </TouchableOpacity>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>View</Text>
              </View>
              <View style={styles.menuContainer}>
                {matchedLeaveData?.approval_status === 1 && (
                  <Menu>
                    <MenuTrigger>
                    <Icon icon="fluent:more-vertical-16-filled" size={22} color="#000" />     </MenuTrigger>
                    <MenuOptions
                      customStyles={{
                        optionsContainer: {
                          borderRadius: 8,
                          padding: 5,
                          width: 150,
                        },
                        optionWrapper: {
                          padding: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        },
                        optionText: {
                          fontSize: 16,
                          marginLeft: 10,
                        },
                      }}
                    >
                      {matchedLeaveData.approval_status === 1 && (
                        <MenuOption onSelect={() => setModalVisible(true)}>
                          <View style={styles.menuOptionRow}>
                           <Icon icon="mdi:edit" size={20} color="#000" />
                            <Text style={styles.menuOptionText}>Edit</Text>
                          </View>
                        </MenuOption>
                      )}
                    </MenuOptions>
                  </Menu>
                )}
              </View>
            </View>
          </View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.card}>
              <View style={styles.cardContent}>
                {/* Approval Status */}
                <View style={styles.row}>
                  <Text style={styles.label}>Approval Status</Text>
                  {matchedLeaveData.approval_status === 3 && (
                    <Text style={styles.statusRejected}>Reject</Text>
                  )}
                  {matchedLeaveData.approval_status === 2 && (
                    <Text style={styles.statusApproved}>Approve</Text>
                  )}
                  {matchedLeaveData.approval_status === 1 && (
                    <Text style={styles.statusPending}>Pending</Text>
                  )}
                  {matchedLeaveData.approval_status === 4 && (
                    <Text style={styles.statusRevoked}>Revoke</Text>
                  )}
                </View>

                {/* First Name */}
                <View style={styles.row}>
                  <Text style={styles.label}>First Name</Text>
                  <Text style={styles.value}>{matchedLeaveData.first_name || '-'}</Text>
                </View>

                {/* Last Name */}
                <View style={styles.row}>
                  <Text style={styles.label}>Last Name</Text>
                  <Text style={styles.value}>{matchedLeaveData.last_name || '-'}</Text>
                </View>

                {/* Employee Code */}
                <View style={styles.row}>
                  <Text style={styles.label}>Employee Code</Text>
                  <Text style={styles.value}>{matchedLeaveData.emp_code || '-'}</Text>
                </View>

                {/* Department */}
                <View style={styles.row}>
                  <Text style={styles.label}>Department</Text>
                  <Text style={styles.value}>
                    {matchedLeaveData.department_info?.department_name || '-'}
                  </Text>
                </View>

                {/* Position */}
                <View style={styles.row}>
                  <Text style={styles.label}>Position</Text>
                  <Text style={styles.value}>
                    {matchedLeaveData.position_info?.position_name || '-'}
                  </Text>
                </View>

                {/* Start Time */}
                <View style={styles.row}>
                  <Text style={styles.label}>Start Time</Text>
                  <Text style={styles.value}>{matchedLeaveData.start_time || '-'}</Text>
                </View>

                {/* End Time */}
                <View style={styles.row}>
                  <Text style={styles.label}>End Time</Text>
                  <Text style={styles.value}>{matchedLeaveData.end_time || '-'}</Text>
                </View>

                {/* Paycode */}
                <View style={styles.row}>
                  <Text style={styles.label}>Paycode</Text>
                  <Text style={styles.value}>
                    {matchedLeaveData.paycode_details?.name || '-'}
                  </Text>
                </View>

                {/* Reason */}
                <View style={styles.row}>
                  <Text style={styles.label}>Reason</Text>
                  <Text style={styles.value}>{matchedLeaveData.apply_reason || '-'}</Text>
                </View>
              </View>

              <View style={styles.buttonRow}>
                {(matchedLeaveData.approval_status === 1 ||
                  matchedLeaveData.approval_status === 2) && (
                  <TouchableOpacity
                    onPress={showRevokeConfirmDialog}
                    style={[
                      styles.revokeButton,
                      matchedLeaveData.approval_status === 4 && { backgroundColor: '#B2BEB5' },
                    ]}
                  >
                    <Text style={styles.buttonText}>Revoke</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={showDeleteConfirmDialog}
                  style={[
                    styles.deleteButton,
                    (matchedLeaveData.approval_status === 4 ||
                      matchedLeaveData.approval_status === 3) && { flex: 1 },
                  ]}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </>
      )}

      {/* Edit Modal */}
      <Modal animationType="fade" transparent visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit</Text>
            <View style={styles.modalBody}>
              {/* Start Date Picker */}
              <TouchableOpacity onPress={() => setStartDate(true)} style={styles.dateInput}>
                <Text style={styles.dateText}>
                  {formatStartDate || 'Start Date'}
                </Text>
              <Icon name="calendar-check-o" size={20} color="lightgray" />
                                        </TouchableOpacity>
              {startError && <Text style={styles.errorText}>{startError}</Text>}
              {startDate && (
                <DateTimePicker
                  value={dateStart}
                  mode="date"
                  is24Hour={true}
                  onChange={onDateChange}
                />
              )}
              {startTime && (
                <DateTimePicker
                  value={startTime}
                  mode="time"
                  is24Hour={false}
                  onChange={onTimeChange}
                />
              )}

              {/* End Date Picker */}
              <TouchableOpacity onPress={() => setEndDate(true)} style={styles.dateInput}>
                <Text style={styles.dateText}>{formatEndDate || 'End Date'}</Text>
               <Icon name="calendar-check-o" size={20} color="lightgray" />
                                          </TouchableOpacity>
              {endError && <Text style={styles.errorText}>{endError}</Text>}
              {endDateError && <Text style={styles.errorText}>{endDateError}</Text>}
              {endDate && (
                <DateTimePicker
                  value={dateEnd}
                  mode="date"
                  is24Hour={true}
                  onChange={onEndDateChange}
                />
              )}
              {endTime && (
                <DateTimePicker
                  value={endTime}
                  mode="time"
                  is24Hour={false}
                  onChange={onEndTimeChange}
                />
              )}

              {/* Paycode Dropdown */}
              <Dropdown
                data={leavePayCodes}
                labelField="name"
                valueField="id"
                placeholder={matchedLeaveData?.paycode_details?.name || 'Paycode'}
                value={payCode}
                onChange={item => setPayCode(item.id)}
                renderItem={renderItem}
                style={styles.dropdown}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
              />
              {payCodeError && <Text style={styles.errorText}>{payCodeError}</Text>}

              {/* Apply Reason */}
              <TextInput
                multiline
                numberOfLines={8}
                placeholder="Enter reason"
                onChangeText={setApplyReason}
                value={applyReason}
                style={styles.reasonInput}
              />

              {/* Buttons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={isLoading}
                  onPress={handleEditLeave}
                  style={styles.saveButton}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#697CE3" />
                  ) : (
                    <Text style={styles.modalButtonText}>Edit</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal animationType="fade" transparent visible={deleteConfirmVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationModal}>
            <Text style={styles.confirmationTitle}>Delete Confirmation</Text>
            <Text style={styles.confirmationMessage}>Are you sure you want to delete this?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setDeleteConfirmVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.modalButtonText1}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleDelete}
                style={[styles.saveButton, { backgroundColor: '#cf3636',color:"white"}]}
              >
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Revoke Confirmation Modal */}
      <Modal animationType="fade" transparent visible={revokeConfirmVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationModal}>
            <Text style={styles.confirmationTitle}>Revoke</Text>
            <Text style={styles.confirmationMessage}>Are you sure you want to revoke this?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setRevokeConfirmVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.modalButtonText1}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleRevoke}
                style={styles.saveButton}
              >
                <Text style={styles.modalButtonText}>Revoke</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </MenuProvider>
    </>

  );
}

const styles = StyleSheet.create({
  maincon:{
    backgroundColor:"white"
  },
  dashedBorder: {
    height: 80,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#000',
    borderRadius: 20,
    padding: 10,
  },
  container: {
    padding: 0,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#697CE3',
  },
  dropdown: {
    height: 50,
    color: '#000',
    fontSize: 12,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
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
  label: {
    position: 'absolute',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 12,
  },
  placeholderStyle: {
    fontSize: 12,
    color: '#000',
  },
  selectedTextStyle: {
    fontSize: 12,
    color: '#000',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'flex-end',
    width: '100%',
    gap: 20,
    padding: 9,
  },
   headerContainer: {
    backgroundColor: '#F1F3F4',
    paddingVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuContainer: {
    position: 'absolute',
    right: 20,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
  borderRadius: 20,
  padding: 16,
  // Shadow for Android
  elevation: 4,
  // Shadow for iOS
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  },
  cardContent: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#888',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusApproved: {
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#08CA0F',
    backgroundColor: '#08CA0F08',
    color: '#08CA0F',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusRejected: {
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#E40303',
    backgroundColor: '#E4030308',
    color: '#E40303',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusPending: {
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#D1A404',
    backgroundColor: '#D1A40408',
    color: '#D1A404',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusRevoked: {
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#E40303',
    backgroundColor: '#E4030308',
    color: '#E40303',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  revokeButton: {
    backgroundColor: '#697CE3',
    padding: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#697CE3',
    padding: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalBody: {
    gap: 12,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 14,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#697CE3',
    borderRadius: 14,
    height: 50,
    paddingHorizontal: 8,
  },
  dropdownPlaceholder: {
    fontSize: 12,
  },
  dropdownSelectedText: {
    fontSize: 12,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#697CE3',
    borderRadius: 20,
    paddingLeft: 12,
    minHeight: 100,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 15,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#697CE3',
    borderRadius: 8,
    padding: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#697CE3',
    borderRadius: 8,
    padding: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 12,
  },
  modalButtonText1: {
    color: 'black',
    fontSize: 12,
  },
  confirmationModal: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confirmationMessage: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  menuOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuOptionText: {
    marginLeft: 10,
  },
});
