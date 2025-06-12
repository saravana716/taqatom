import { useCallback, useEffect, useState } from 'react';
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
import Icon from "react-native-vector-icons/FontAwesome";
import ProfileServices from '../Services/API/ProfileServices';

import DateTimePicker from '@react-native-community/datetimepicker';
import find from 'lodash/find';
import get from 'lodash/get';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-native-element-dropdown';
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuProvider,
    MenuTrigger,
} from 'react-native-popup-menu';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { formatErrorsToToastMessages } from '../utils/error-format';
import { dateTimeToShow, formatDateTime } from '../utils/formatDateTime';

export default function OvertimeRequestDetails({
  navigation,route
}) {
  const {employeeId,
          newItem,
          payCodesList,
          getPayCodeList,
          overtimeList}=route.params
  const {t} = useTranslation(); // 't' function is used for translation
  const [isLoading, setIsLoading] = useState(false);
  const [OvertimeData, setOvertimeData] = useState([]);
  const matchedData = find(OvertimeData, log => log?.id === newItem?.id);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [revokeConfirmVisible, setRevokeConfirmVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(false);
  const [formatStartDate, setFormatStartDate] = useState(
    newItem?.start_time || null,
  );
  const [dateStart, setDateStart] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());

  const [endDate, setEndDate] = useState(false);
  const [formatEndDate, setFormatEndDate] = useState(
    newItem?.end_time || null,
  );
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
  navigation.navigate("OverTimeScreen")
    overtimeList();
  };

  const getOvertimeList = async () => {
    try {
      const RecentActivities = await ProfileServices.getOvertimeData(
        employeeId,
      );
      setOvertimeData(RecentActivities?.results);
    } catch (error) {
      formatErrorsToToastMessages(error);
    }
  };

  const handleFulldetails = () => {
    Navigation.push(componentId, {
      component: {
        name: 'OvertimeRequestDetails',
        passProps: {
          employeeId,
          matchedData,
        },
        options: {
          animations: {
            push: {
              enabled: false,
            },
            pop: {
              enabled: false,
            },
          },
          topBar: {
            visible: false,
          },
          bottomTabs: {
            visible: false,
            drawBehind: true,
          },
        },
      },
    });
  };

  const showDeleteConfirmDialog = () => {
    setDeleteConfirmVisible(true);
  };

  const showRevokeConfirmDialog = () => {
    setRevokeConfirmVisible(true);
  };

  const onDateChange = useCallback((event, selectedDate) => {
    if (event.type === 'set' && selectedDate) {
      const formattedDate = moment(selectedDate).format('DD MMMM ');

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
      const formattedDate = moment(selectedDate).format('DD MMMM ');

      setDateEnd(selectedDate);
      // setFormatEndDate(formattedDate);
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
      const response = await ProfileServices.postOvertimeRevoke(
        matchedData?.id,
      );
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
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator size="large" color="#697CE3" />
        </View>
      ) : (
        <MenuProvider>
          <View style={styles.mainContainer}>
            <View style={styles.header}>
              <View>
                <TouchableOpacity onPress={handleBack}>
                  <Icon name="angle-left" size={30} color="black" />
                </TouchableOpacity>
              </View>

              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>View</Text>
              </View>

              <View style={styles.headerMenuContainer}>
                {matchedData?.approval_status === 1 && (
                  <Menu>
                    <MenuTrigger>
                   <Icon name="ellipsis-v" size={24} color="#000" />       </MenuTrigger>
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
                      }}>
                      {matchedData?.approval_status === 1 && (
                        <MenuOption onSelect={() => setModalVisible(true)}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Icon name="pencil" size={20} color="#000" />
                            <Text style={{marginLeft: 10}}>
                            Edit
                            </Text>
                          </View>
                        </MenuOption>
                      )}
                    </MenuOptions>
                  </Menu>
                )}
              </View>
            </View>
            <View style={styles.detailsContainer}>
              <ScrollView style={styles.scrollViewContent}>
                <View style={styles.detailsCard}>
                  <View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        Approval Status
                      </Text>
                      {matchedData?.approval_status === 3 && (
                        <Text style={styles.rejectedStatus}>
                          Rejected
                        </Text>
                      )}
                      {matchedData?.approval_status === 2 && (
                        <Text style={styles.approvedStatus}>
                          Approved
                        </Text>
                      )}
                      {matchedData?.approval_status === 1 && (
                        <Text style={styles.pendingStatus}>
                          Pending
                        </Text>
                      )}
                      {matchedData?.approval_status === 4 && (
                        <Text style={styles.revokedStatus}>
                          Revoked
                        </Text>
                      )}
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        First Name
                      </Text>
                      <Text style={styles.detailValue}>
                        {get(matchedData, 'first_name')}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        Last Name
                      </Text>
                      <Text style={styles.detailValue}>
                        {get(matchedData, 'last_name')}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        Employee Code
                      </Text>
                      <Text style={styles.detailValue}>
                        {get(matchedData, 'emp_code')}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        Department
                      </Text>
                      <Text style={styles.detailValue}>
                        {get(matchedData, 'department_info.department_name')}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        Position
                      </Text>
                      <Text style={styles.detailValue}>
                        {get(matchedData, 'position_info.position_name')}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        Start Time
                      </Text>
                      <Text style={styles.detailValue}>
                        {dateTimeToShow(matchedData?.start_time)}
                      </Text>
                    </View>
                    <View style={styles.detailRowNoBorder}>
                      <Text style={styles.detailLabel}>
                        End Time
                      </Text>
                      <Text style={styles.detailValue}>
                        {dateTimeToShow(matchedData?.end_time)}
                      </Text>
                    </View>
                    <View style={styles.detailRowNoBorder}>
                      <Text style={styles.detailLabel}>
                        Pay Code
                      </Text>
                      <Text style={styles.detailValue}>
                        {matchedData?.paycode_details?.name}
                      </Text>
                    </View>
                    <View style={styles.detailRowNoBorder}>
                      <Text style={styles.detailLabel}>
                        Reason
                      </Text>
                      <Text style={styles.detailValue}>
                        {matchedData?.apply_reason || '-'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.actionButtonsContainer}>
                    {(matchedData?.approval_status === 1 ||
                      matchedData?.approval_status === 2) && (
                      <TouchableOpacity
                        onPress={showRevokeConfirmDialog}
                        style={[
                          styles.actionButton,
                          matchedData?.approval_status === 4
                            ? styles.disabledButton
                            : styles.primaryButton,
                        ]}>
                        <Text style={styles.actionButtonText}>
                          Revoke
                        </Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={showDeleteConfirmDialog}
                      style={[
                        styles.actionButton,
                        matchedData?.approval_status === 4 ||
                        matchedData?.approval_status === 3
                          ? styles.fullWidthButton
                          : styles.halfWidthButton,
                        styles.primaryButton,
                      ]}>
                      <Text style={styles.actionButtonText}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </MenuProvider>
      )}
      <Toast />
      <Modal
        animationType={'fade'}
        visible={modalVisible}
        transparent
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContainer}>
            <Text style={styles.editModalTitle}>Edit</Text>
            <View style={styles.editModalContent}>
              <TouchableOpacity
                onPress={() => setStartDate(true)}
                style={styles.dateTimeInput}>
                <Text style={styles.dateTimeInputText}>
                  {formatStartDate
                    ? dateTimeToShow(formatStartDate):
                    "Start Date"}
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

              <TouchableOpacity
                onPress={() => setEndDate(true)}
                style={styles.dateTimeInput}>
                <Text style={styles.dateTimeInputText}>
                  {formatEndDate
                    ? dateTimeToShow(formatEndDate)
                    :"End Date"}
                </Text>
               <Icon name="calendar-check-o" size={20} color="lightgray" />
              </TouchableOpacity>
              {endDateError ? (
                <Text style={styles.errorText}>{endDateError}</Text>
              ) : null}
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
              <View style={styles.container}>
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
                  placeholder={
                    matchedData?.paycode_details?.name ||
                    "Pay Code"
                  }
                  searchPlaceholder={"Search"}
                  value={payCode}
                  onChange={item => {
                    setPayCode(item?.id);
                  }}
                  renderItem={renderItem}
                />
              </View>
              {payCodeError ? (
                <Text style={styles.errorText}>{payCodeError}</Text>
              ) : null}
              <TextInput
                style={styles.reasonInput}
                placeholder={"Reason"}
                editable
                multiline
                textAlignVertical="top"
                onChangeText={setApplyReason}
                numberOfLines={8}
                value={applyReason}
              />
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEndDateError('');
                }}
                style={[styles.modalButton, styles.modalCancelButton]}>
                <Text style={styles.modalCancelButtonText}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleOvertimeLeave}
                style={[styles.modalButton, styles.modalEditButton]}>
                {isLoading && <ActivityIndicator size="small" color="#fff" />}
                {!isLoading && (
                  <Text style={styles.modalEditButtonText}>
                    Edit
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Toast />
      </Modal>
      <Modal
        animationType={'fade'}
        visible={deleteConfirmVisible}
        transparent
        onRequestClose={() => {
          setDeleteConfirmVisible(!deleteConfirmVisible);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContainer}>
            <Text style={styles.confirmModalTitle}>
              Delete
            </Text>
            <Text style={styles.confirmModalMessage}>
              Are you sure you want to delete this item?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setDeleteConfirmVisible(false);
                }}
                style={[styles.modalButton, styles.modalCancelButton]}>
                <Text style={styles.modalCancelButtonText}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleDelete}
                style={[styles.modalButton, styles.modalDeleteButton]}>
                {isLoading && <ActivityIndicator size="small" color="#fff" />}
                {!isLoading && (
                  <Text style={styles.modalEditButtonText}>
                    Delete
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Toast />
      </Modal>
      <Modal
        animationType={'fade'}
        visible={revokeConfirmVisible}
        transparent
        onRequestClose={() => {
          setRevokeConfirmVisible(!revokeConfirmVisible);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContainer}>
            <Text style={styles.confirmModalTitle}>
              Revoke
            </Text>
            <Text style={styles.confirmModalMessage}>
              Are you sure you want to revoke this item?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setRevokeConfirmVisible(false);
                }}
                style={[styles.modalButton, styles.modalCancelButton]}>
                <Text style={styles.modalCancelButtonText}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleRevoke}
                style={[styles.modalButton, styles.modalEditButton]}>
                {isLoading && <ActivityIndicator size="small" color="#fff" />}
                {!isLoading && (
                  <Text style={styles.modalEditButtonText}>
                  Revoke
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Toast />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    backgroundColor: '#F1F3F4',
    height: '100%',
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingLeft: 20,
    paddingBottom: 20,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'PublicSansBold',
    color: '#000',
  },
  headerMenuContainer: {
    position: 'absolute',
    right: 0,
    paddingRight: 20,
  },
  detailsContainer: {
    flex: 1,
    height: '100%',
    borderRadius: 30,
  },
  scrollViewContent: {
    padding: 16,
    height: '100%',
    flex: 1,
  },
  detailsCard: {
    flex: 1,
    backgroundColor: '#fff',
    height: '83%',
    padding: 16,
    borderRadius: 20,
    width: '100%',
    justifyContent: 'space-between',
  },
  detailRow: {
 
        flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
  },
  detailRowNoBorder: {
   flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#A0A0A0', // Assuming gray-400 from tailwind
    fontFamily: 'PublicSansBold',
  },
  detailValue: {
    fontSize: 12,
    fontFamily: 'PublicSansBold',
    color: '#000',
  },
  rejectedStatus: {
    fontSize: 12,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#E4030308',
    borderRadius: 8,
    borderColor: '#E40303',
    color: '#E40303',
    fontFamily: 'PublicSansBold',
  },
  approvedStatus: {
    fontSize: 12,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#08CA0F08',
    borderRadius: 8,
    borderColor: '#08CA0F',
    color: '#08CA0F',
    fontFamily: 'PublicSansBold',
  },
  pendingStatus: {
    fontSize: 12,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#D1A40408',
    borderRadius: 8,
    borderColor: '#D1A404',
    color: '#D1A404',
    fontFamily: 'PublicSansBold',
  },
  revokedStatus: {
    fontSize: 12,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#E4030308',
    borderRadius: 8,
    borderColor: '#E40303',
    color: '#E40303',
    fontFamily: 'PublicSansBold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
    paddingRight: 8,
    height: 44,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    width:"50%"
  },
  primaryButton: {
    backgroundColor: '#697CE3',
  },
  disabledButton: {
    backgroundColor: '#B2BEB5',
  },
  halfWidthButton: {
    width: '50%',
  },
  fullWidthButton: {
    width: '100%',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'semibold-poppins',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editModalContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 60,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 7,
    width: '90%',
    elevation: 10,
    padding: 20,
  },
  editModalTitle: {
    fontSize: 16,
    marginBottom: 12,
    fontFamily: 'semibold-poppins',
    marginTop: 8,
  },
  editModalContent: {
    paddingBottom: 8,
    paddingRight: 8,
    paddingLeft: 8,
    rowGap: 16, // space-y-4
    width: '100%',
    justifyContent: 'space-between',
  },
  dateTimeInput: {
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#A0A0A0', // gray-400
    paddingHorizontal: 20,
  },
  dateTimeInputText: {
    fontSize: 14,
    color: '#333', // gray-800
    fontFamily: 'PublicSansBold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 6,
  },
  reasonInput: {
    width: '100%',
    borderRadius: 24, // rounded-3xl
    borderWidth: 1,
    borderColor: '#697CE3',
    paddingLeft: 12,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'flex-end',
    width: '100%',
    gap: 20,
    padding: 9,
  },
  modalButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    width: 80,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  modalCancelButton: {
    borderWidth: 1,
    borderColor: '#697CE3',
  },
  modalCancelButtonText: {
    fontSize: 12,
    color: '#697CE3',
    fontFamily: 'semibold-poppins',
  },
  modalEditButton: {
    backgroundColor: '#697CE3',
  },
  modalDeleteButton: {
    backgroundColor: '#cf3636',
  },
  modalEditButtonText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'semibold-poppins',
  },
  confirmModalContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 60,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 7,
    width: '90%',
    elevation: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    justifyContent:"center"
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmModalMessage: {
    marginTop: 10,
    fontSize: 16,
  },

  // Existing styles
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
});