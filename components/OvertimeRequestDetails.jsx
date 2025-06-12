import find from 'lodash/find';
import get from 'lodash/get';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Modal,
    View,
    Dropdown,
    TextInput
} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";

import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuProvider,
    MenuTrigger,
} from 'react-native-popup-menu';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import ProfileServices from '../Services/API/ProfileServices';
import { formatErrorsToToastMessages } from '../utils/error-format';
import { dateTimeToShow, formatDateTime } from '../utils/formatDateTime';

export default function OvertimeRequestDetails({
  navigation,route
}) {
  const { employeeId,
          newItem,
          payCodesList,
          getPayCodeList,
          overtimeList } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [OvertimeData, setOvertimeData] = useState([]);
  const matchedData = find(OvertimeData, log => log?.id === newItem?.id);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [revokeConfirmVisible, setRevokeConfirmVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(false);
  const [formatStartDate, setFormatStartDate] = useState(newItem?.start_time || null);
  const [dateStart, setDateStart] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(false);
  const [formatEndDate, setFormatEndDate] = useState(newItem?.end_time || null);
  const [dateEnd, setDateEnd] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [workCode, setWorkCode] = useState(newItem?.work_code || '');
  const [applyReason, setApplyReason] = useState(newItem?.apply_reason || '');
  const [showStartDateTime, setShowStartDateTime] = useState(false);
  const [showEndDateTime, setShowEndDateTime] = useState(false);
  const [payCode, setPayCode] = useState(newItem?.paycode_details?.id || '');
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');
  const [payCodeError, setPayCodeError] = useState('');

  const handleBack = () => {
  navigation.navigate('OverTimeScreen')
    overtimeList();
  };

  const getOvertimeList = async () => {
    try {
      const RecentActivities = await ProfileServices.getOvertimeData(employeeId);
      setOvertimeData(RecentActivities?.results);
    } catch (error) {
      formatErrorsToToastMessages(error);
    }
  };

  const showDeleteConfirmDialog = () => {
    setDeleteConfirmVisible(true);
  };

  const showRevokeConfirmDialog = () => {
    setRevokeConfirmVisible(true);
  };

  const onDateChange = useCallback((event, selectedDate) => {
    if (event.type === 'set' && selectedDate) {
      const formattedDate = moment(selectedDate).format('DD MMMM YYYY');
      setDateStart(selectedDate);
      setFormatStartDate(formattedDate);
      setStartDate(false);
      setShowStartDateTime(true);
    }
  }, []);

  const onTimeChange = useCallback(
    (event, selectedTime) => {
      if (selectedTime) {
        const combinedDateTime = new Date(dateStart);
        combinedDateTime.setHours(selectedTime.getHours());
        combinedDateTime.setMinutes(selectedTime.getMinutes());
        const formattedDate = moment(combinedDateTime).format('YYYY-MM-DDTHH:mm:ss');
        setFormatStartDate(formattedDate);
        setShowStartDateTime(false);
      } else {
        setShowStartDateTime(false);
      }
    },
    [dateStart]
  );

  const onEndDateChange = useCallback((event, selectedDate) => {
    if (selectedDate) {
      const formattedDate = moment(selectedDate).format('DD MMMM YYYY');
      setDateEnd(selectedDate);
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
        const formattedDate = moment(combinedDateTime).format('YYYY-MM-DDTHH:mm:ss');
        setFormatEndDate(formattedDate);
        setShowEndDateTime(false);
      } else {
        setShowEndDateTime(false);
      }
    },
    [dateEnd]
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

  const handleOvertimeLeave = async () => {
    setEndDateError('');
    setStartDateError('');
    setPayCodeError('');
    if (!payCode) {
      setPayCodeError('Paycode is Required');
      return;
    }
    if (new Date(formatEndDate) <= new Date(formatStartDate)) {
      setEndDateError('End Date must be after Start Date');
      return;
    }

    try {
      const response = await ProfileServices.editOvertimeRequest({
        options: {
          employee: employeeId,
          start_time: formatDateTime(formatStartDate),
          end_time: formatDateTime(formatEndDate),
          pay_code: payCode,
          apply_reason: applyReason,
        },
        id: matchedData?.id,
      });
      setIsLoading(false);
      setModalVisible(false);
      getOvertimeList();
      Toast.show({
        type: 'success',
        text1: 'Updated Successfully',
        position: 'bottom',
      });
    } catch (error) {
      setIsLoading(false);
      formatErrorsToToastMessages(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await ProfileServices.deleteOvertimeRequest({
        id: matchedData?.id,
      });
      setDeleteConfirmVisible(false);
      overtimeList();
      handleBack();
      setTimeout(() => {
        Toast.show({
          type: 'success',
          text1: 'Delete Success',
          position: 'bottom',
        });
      }, 100);
    } catch (error) {
      formatErrorsToToastMessages(error);
    }
  };

  const handleRevoke = async () => {
    try {
      const response = await ProfileServices.postOvertimeRevoke(matchedData?.id);
      setRevokeConfirmVisible(false);
      getOvertimeList();
      Toast.show({
        type: 'success',
        text1: 'Revoke Success',
        position: 'bottom',
      });
    } catch (error) {
      formatErrorsToToastMessages(error);
      setRevokeConfirmVisible(false);
    }
  };

  useEffect(() => {
    getOvertimeList();
  }, []);

  return (
    <>
      {!matchedData ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#697CE3" />
        </View>
      ) : (
        <MenuProvider>
          <View style={styles.containerStyle}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
             <Icon name="angle-left" size={30} color="black" />
              </TouchableOpacity>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>View</Text>
              </View>
              <View style={styles.menuContainer}>
                {matchedData?.approval_status === 1 && (
                  <Menu>
                    <MenuTrigger>
                       <Icon icon="fluent:more-vertical-16-filled" size={22} color="#000" /> 
                    </MenuTrigger>
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
                      {matchedData?.approval_status === 1 && (
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

            <ScrollView style={styles.scrollView}>
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  {/* Approval Status */}
                  <View style={styles.row}>
                    <Text style={styles.labelText}>Approval Status</Text>
                    {matchedData?.approval_status === 3 && (
                      <Text style={styles.statusRejected}>Reject</Text>
                    )}
                    {matchedData?.approval_status === 2 && (
                      <Text style={styles.statusApproved}>Approve</Text>
                    )}
                    {matchedData?.approval_status === 1 && (
                      <Text style={styles.statusPending}>Pending</Text>
                    )}
                    {matchedData?.approval_status === 4 && (
                      <Text style={styles.statusRevoked}>Revoke</Text>
                    )}
                  </View>
                  {/* First Name */}
                  <View style={styles.row}>
                    <Text style={styles.labelText}>First Name</Text>
                    <Text style={styles.valueText}>{get(matchedData, 'first_name')}</Text>
                  </View>
                  {/* Last Name */}
                  <View style={styles.row}>
                    <Text style={styles.labelText}>Last Name</Text>
                    <Text style={styles.valueText}>{get(matchedData, 'last_name')}</Text>
                  </View>
                  {/* Employee Code */}
                  <View style={styles.row}>
                    <Text style={styles.labelText}>Employee Code</Text>
                    <Text style={styles.valueText}>{get(matchedData, 'emp_code')}</Text>
                  </View>
                  {/* Department */}
                  <View style={styles.row}>
                    <Text style={styles.labelText}>Department</Text>
                    <Text style={styles.valueText}>
                      {get(matchedData, 'department_info.department_name')}
                    </Text>
                  </View>
                  {/* Position */}
                  <View style={styles.row}>
                    <Text style={styles.labelText}>Position</Text>
                    <Text style={styles.valueText}>
                      {get(matchedData, 'position_info.position_name')}
                    </Text>
                  </View>
                  {/* Start Time */}
                  <View style={styles.row}>
                    <Text style={styles.labelText}>Start Time</Text>
                    <Text style={styles.valueText}>{dateTimeToShow(matchedData?.start_time)}</Text>
                  </View>
                  {/* End Time */}
                  <View style={styles.row}>
                    <Text style={styles.labelText}>End Time</Text>
                    <Text style={styles.valueText}>{dateTimeToShow(matchedData?.end_time)}</Text>
                  </View>
                  {/* Paycode */}
                  <View style={styles.row}>
                    <Text style={styles.labelText}>Paycode</Text>
                    <Text style={styles.valueText}>{matchedData?.paycode_details?.name}</Text>
                  </View>
                  {/* Reason */}
                  <View style={styles.row}>
                    <Text style={styles.labelText}>Reason</Text>
                    <Text style={styles.valueText}>{matchedData?.apply_reason || '-'}</Text>
                  </View>
                </View>
                <View style={styles.buttonRow}>
                  {(matchedData?.approval_status === 1 || matchedData?.approval_status === 2) && (
                    <TouchableOpacity
                      onPress={showRevokeConfirmDialog}
                      style={[
                        styles.revokeButton,
                        matchedData?.approval_status === 4 && { backgroundColor: '#B2BEB5' },
                      ]}
                    >
                      <Text style={styles.buttonText}>Revoke</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={showDeleteConfirmDialog}
                    style={[
                      styles.deleteButton,
                      (matchedData?.approval_status === 4 ||
                        matchedData?.approval_status === 3) && { flex: 1 },
                    ]}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </MenuProvider>
      )}
<View>
  <Modal
    animationType="fade"
    visible={modalVisible}
    transparent
    onRequestClose={() => setModalVisible(!modalVisible)}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalBox}>
        <Text style={styles.modalTitle}>Edit</Text>

        <View style={styles.formContainer}>
          <TouchableOpacity onPress={() => setStartDate(true)} style={styles.dateButton}>
            <Text style={styles.dateText}>
              {formatStartDate ? dateTimeToShow(formatStartDate) : 'Start Date'}
            </Text>
            <Icon name="calendar-check-o" size={20} color="lightgray" />
                          </TouchableOpacity>

          {startDate && (
            <DateTimePicker
              value={dateStart}
              mode="date"
              is24Hour={true}
              maximumDate={new Date()}
              onChange={onDateChange}
            />
          )}

          {showStartDateTime && (
            <DateTimePicker
              value={startTime}
              mode="time"
              is24Hour={false}
              onChange={onTimeChange}
            />
          )}

          <TouchableOpacity onPress={() => setEndDate(true)} style={styles.dateButton}>
            <Text style={styles.dateText}>
              {formatEndDate ? dateTimeToShow(formatEndDate) : 'End Date'}
            </Text>
              <Icon name="calendar-check-o" size={20} color="lightgray" />
                         </TouchableOpacity>

          {endDateError && <Text style={styles.errorText}>{endDateError}</Text>}

          {endDate && (
            <DateTimePicker
              value={dateEnd}
              mode="date"
              is24Hour={true}
              maximumDate={new Date()}
              onChange={onEndDateChange}
            />
          )}

          {showEndDateTime && (
            <DateTimePicker
              value={endTime}
              mode="time"
              is24Hour={false}
              onChange={onEndTimeChange}
            />
          )}

          <View style={styles.dropdownWrapper}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={payCodesList}
              search
              maxHeight={300}
              labelField="name"
              valueField="id"
              placeholder={matchedData?.paycode_details?.name || 'Pay Code'}
              searchPlaceholder="Search"
              value={payCode}
              onChange={(item) => setPayCode(item?.id)}
              renderItem={renderItem}
            />
          </View>

          {payCodeError && <Text style={styles.errorText}>{payCodeError}</Text>}

          <TextInput
            style={styles.textArea}
            placeholder="Reason"
            editable
            multiline
            textAlignVertical="top"
            onChangeText={setApplyReason}
            numberOfLines={8}
            value={applyReason}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
              setEndDateError('');
            }}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={isLoading}
            onPress={handleOvertimeLeave}
            style={styles.submitButton}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color="#ffffff" />
            ) : (
              <Text style={styles.submitText}>Edit</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
    <Toast />
  </Modal>
</View>

{/* Delete Confirmation Modal */}
<View>
  <Modal
    animationType="fade"
    visible={deleteConfirmVisible}
    transparent
    onRequestClose={() => setDeleteConfirmVisible(!deleteConfirmVisible)}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.confirmBox}>
        <Text style={styles.confirmTitle}>Delete</Text>
        <Text style={styles.confirmMessage}>Are you sure you want to delete this item?</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => setDeleteConfirmVisible(false)}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={isLoading}
            onPress={handleDelete}
            style={styles.deleteButton}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color="#ffffff" />
            ) : (
              <Text style={styles.submitText}>Delete</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
    <Toast />
  </Modal>
</View>

{/* Revoke Confirmation Modal */}
<View>
  <Modal
    animationType="fade"
    visible={revokeConfirmVisible}
    transparent
    onRequestClose={() => setRevokeConfirmVisible(!revokeConfirmVisible)}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.confirmBox}>
        <Text style={styles.confirmTitle}>Revoke</Text>
        <Text style={styles.confirmMessage}>Are you sure you want to revoke this action?</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => setRevokeConfirmVisible(false)}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={isLoading}
            onPress={handleRevoke}
            style={styles.submitButton}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color="#ffffff" />
            ) : (
              <Text style={styles.submitText}>Revoke</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
    <Toast />
  </Modal>
</View>

      <Toast />

      {/* Edit Modal */}
      {/* Delete Confirmation Modal */}
      {/* Revoke Confirmation Modal */}

      {/* Modals here remain unchanged; they are long but preserved in structure */}
    </>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: '#F1F3F4',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingLeft: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
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
    flex: 1,
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
  labelText: {
    fontSize: 12,
    color: '#888',
    fontWeight: 'bold',
  },
  valueText: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    alignItems: 'center',
    backgroundColor: 'white',
    marginVertical: 60,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 7,
    width: '90%',
    elevation: 10,
    padding: 20,
  },
  confirmBox: {
    alignItems: 'center',
    backgroundColor: 'white',
    marginVertical: 60,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 7,
    width: '90%',
    elevation: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  formContainer: {
    paddingBottom: 8,
    paddingHorizontal: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  dateButton: {
    height: 56,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 10,
  },
  dropdownWrapper: {
    marginTop: 10,
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#333',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  textArea: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#697CE3',
    paddingLeft: 12,
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  cancelButton: {
    width: 80,
    height: 48,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#697CE3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 12,
    color: '#697CE3',
    fontWeight: '600',
  },
  submitButton: {
    width: 80,
    height: 48,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#697CE3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 80,
    height: 48,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#cf3636',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmMessage: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },

});