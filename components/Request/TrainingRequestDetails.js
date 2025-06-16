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
import Icon from 'react-native-vector-icons/FontAwesome';

import DateTimePicker from '@react-native-community/datetimepicker';
import find from 'lodash/find';
import get from 'lodash/get';
import moment from 'moment';
import { Dropdown } from 'react-native-element-dropdown';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import ProfileServices from '../../Services/API/ProfileServices';
import { dateTimeToShow, formatDateTime } from '../../utils/formatDateTime';
import { useTranslation } from 'react-i18next'; // Removed as per request
// import tokens from '../../locales/tokens'; // Removed as per request
import { formatErrorsToToastMessages } from '../../utils/error-format';
import tokens from '@/locales/tokens';
export default function TrainingRequestDetails({navigation, route}) {
   const {t,i18n}=useTranslation()
    const isRTL = i18n.language === 'ar';
    console.log("yyyyyyyyyyyyyyyyyyyy",isRTL);
  const {employeeId, newItem, trainingList, payCodes, getPayCodeList} =
    route.params;
  // const {t}=useTranslation() // Removed as per request
  const [trainingData, setTrainingData] = useState([]);
  const matchedData = find(trainingData, log => log?.id === newItem?.id);

  const [isLoading, setIsLoading] = useState(false);
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
  const [formatEndDate, setFormatEndDate] = useState(newItem?.end_time || null);
  const [dateEnd, setDateEnd] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [workCode, setWorkCode] = useState(newItem?.work_code || '');
  const [applyReason, setApplyReason] = useState(newItem?.apply_reason || '');
  const [showStartDateTime, setShowStartDateTime] = useState(false);
  const [showEndDateTime, setShowEndDateTime] = useState(false);

  const [payCode, setPayCode] = useState(newItem?.paycode_details?.id || '');
  const [endDateError, setendDateError] = useState('');
  const [payCodeError, setPayCodeError] = useState('');
  const [startError, setStartError] = useState('');
  const [endError, setEndError] = useState('');

  const handleBack = () => {
    navigation.navigate("Training")
    trainingList();
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
      // setFormatStartDate(formattedDate);
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
  const handleEditTraining = async () => {
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
      const response = await ProfileServices.editTrainingRequest({
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
      getTrainingList();
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
      const response = await ProfileServices.deleteTrainingRequest({
        id: matchedData?.id,
      });
      setDeleteConfirmVisible(false);
      trainingList();
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
      const response = await ProfileServices.postTrainingRevoke(
        matchedData?.id,
      );
      setRevokeConfirmVisible(false);
      getTrainingList();
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

  const getTrainingList = async () => {
    try {
      const RecentActivities = await ProfileServices.getTrainingData(
        employeeId,
      );
      setTrainingData(RecentActivities?.results);
    } catch (error) {
      formatErrorsToToastMessages(error);
    }
  };
  useEffect(() => {
    getTrainingList();
  }, []);
  return (
    <>
      {!matchedData ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#697CE3" />
        </View>
      ) : (
        <MenuProvider>
          <View style={styles.mainContainer}>
            <View style={styles.headerContainer}>
              <View style={styles.backButtonWrapper}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                  <Icon name="angle-left" size={30} color="black" />
                </TouchableOpacity>
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>
{t(tokens.actions.view)}

                </Text>
              </View>

              <View style={styles.menuIconContainer}>
                {matchedData?.approval_status === 1 && (
                  <Menu>
                    <MenuTrigger>
                      <Icon name="ellipsis-v" size={24} color="#000" />
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
                              {t(tokens.actions.edit)}
                            </Text>
                          </View>
                        </MenuOption>
                      )}
                    </MenuOptions>
                  </Menu>
                )}
              </View>
            </View>
            <View style={styles.scrollViewContainer}>
              <ScrollView style={styles.scrollViewContent}>
                <View style={styles.detailsCard}>
                  <View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                      {t(tokens.charts.approvalStatus)}

                      </Text>
                      {matchedData?.approval_status === 3 && (
                        <Text style={[styles.statusText, styles.statusRejected]}>
                          {t(tokens.actions.reject)}
                          
                        </Text>
                      )}
                      {matchedData?.approval_status === 2 && (
                        <Text style={[styles.statusText, styles.statusApproved]}>
                          {t(tokens.actions.approve)}
                          
                        </Text>
                      )}
                      {matchedData?.approval_status === 1 && (
                        <Text style={[styles.statusText, styles.statusPending]}>
                          {t(tokens.actions.pending)}
                          
                        </Text>
                      )}
                      {matchedData?.approval_status === 4 && (
                        <Text style={[styles.statusText, styles.statusRevoked]}>
                          {t(tokens.actions.revoke)}
                          
                        </Text>
                      )}
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                      {t(tokens.common.firstName)}

                      </Text>
                      <Text style={styles.detailValue}>
                        {get(matchedData, 'first_name')}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                      {t(tokens.common.lastName)}

                      </Text>
                      <Text style={styles.detailValue}>
                        {get(matchedData, 'last_name')}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                      {t(tokens.common.employeeCode)}

                      </Text>
                      <Text style={styles.detailValue}>
                        {get(matchedData, 'emp_code')}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                      {t(tokens.nav.department)}

                      </Text>
                      <Text style={styles.detailValue}>
                        {get(matchedData, 'department_info.department_name')}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                      {t(tokens.nav.position)}

                      </Text>
                      <Text style={styles.detailValue}>
                        {get(matchedData, 'position_info.position_name')}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                      {t(tokens.common.startTime)}

                      </Text>
                      <Text style={styles.detailValue}>
                        {dateTimeToShow(matchedData?.start_time)}
                      </Text>
                    </View>
                    <View style={[styles.detailRow, styles.lastDetailRow]}>
                      <Text style={styles.detailLabel}>
                      {t(tokens.common.endTime)}

                      </Text>
                      <Text style={styles.detailValue}>
                        {dateTimeToShow(matchedData?.end_time)}
                      </Text>
                    </View>
                    <View style={[styles.detailRow, styles.lastDetailRow]}>
                      <Text style={styles.detailLabel}>
                      {t(tokens.nav.payCode)}

                      </Text>
                      <Text style={styles.detailValue}>
                        {matchedData?.paycode_details?.name}
                      </Text>
                    </View>
                    <View style={[styles.detailRow, styles.lastDetailRowNoBorder]}>
                      <Text style={styles.detailLabel}>
                      {t(tokens.common.reason)}

                      </Text>
                      <Text style={styles.detailValue}>
                        {matchedData?.apply_reason || '-'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.actionButtonContainer}>
                    {(matchedData?.approval_status === 1 ||
                      matchedData?.approval_status === 2) && (
                      <TouchableOpacity
                        onPress={showRevokeConfirmDialog}
                        style={[
                          styles.actionButton,
                          matchedData?.approval_status === 4
                            ? styles.buttonDisabled
                            : styles.buttonPrimary,
                          styles.revokeButton,
                        ]}>
                        <Text style={styles.buttonText}>
                        {t(tokens.actions.revoke)}

                        </Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={showDeleteConfirmDialog}
                      style={[
                        styles.actionButton,
                        matchedData?.approval_status === 4 ||
                        matchedData?.approval_status === 3
                          ? styles.buttonFullWidth
                          : styles.buttonPrimary,
                        styles.deleteButton,
                      ]}>
                      <Text style={styles.buttonText}>
                      {t(tokens.actions.delete)}

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
      <View>
        <Modal
          animationType={'fade'}
          visible={modalVisible}
          transparent
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {t(tokens.actions.edit)}
              <Text style={styles.modalTitle}></Text>
              <View style={styles.modalForm}>
                <TouchableOpacity
                  onPress={() => setStartDate(true)}
                  style={styles.datePickerButton}>
                  <Text style={styles.datePickerText}>
                      {formatStartDate
                      ? dateTimeToShow(formatStartDate)
                      : t(tokens.common.startDate)}
                  </Text>
                  <Icon name="calendar-check-o" size={20} color="lightgray" />
                </TouchableOpacity>
                {startError ? (
                  <Text style={styles.errorText}>{startError}</Text>
                ) : null}
                {startDate && (
                  <DateTimePicker
                    value={dateStart}
                    mode="date"
                    is24Hour={true}
                    onChange={onDateChange}
                    minimumDate={new Date()} // Changed minDate to minimumDate
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
                  style={styles.datePickerButton}>
                  <Text style={styles.datePickerText}>
                                       {formatEndDate ? dateTimeToShow(formatEndDate) : t(tokens.common.endDate)}

                  </Text>
                  <Icon name="calendar-check-o" size={20} color="lightgray" />
                </TouchableOpacity>
                {endError ? (
                  <Text style={styles.errorText}>{endError}</Text>
                ) : null}
                {endDateError ? (
                  <Text style={styles.errorText}>{endDateError}</Text>
                ) : null}
                {endDate && (
                  <DateTimePicker
                    value={dateEnd}
                    mode="date"
                    is24Hour={true}
                    onChange={onEndDateChange}
                    minimumDate={new Date()} // Changed minDate to minimumDate
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
                <View style={styles.dropdownContainer}>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={payCodes}
                    search
                    maxHeight={300}
                    labelField="name"
                    valueField="id"
                placeholder={
                      matchedData?.paycode_details?.name || t(tokens.nav.payCode)
                    }
                    searchPlaceholder={t(tokens.common.search)}
                    value={payCode}
                    onChange={item => {
                      setPayCode(item?.id);
                    }}
                    renderItem={renderItem}
                  />
                </View>
                {payCodeError ? (
                  <Text style={styles.errorTextMarginLeft}>{payCodeError}</Text>
                ) : null}
                <TextInput
                  style={styles.reasonInput}
                                    placeholder={t(tokens.common.search)}

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
                  }}
                  style={styles.modalCancelButton}>
                  <Text style={styles.modalCancelButtonText}>
                  {t(tokens.actions.cancel)}

                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={isLoading}
                  onPress={handleEditTraining}
                  style={styles.modalEditButton}>
                  {isLoading && (
                    <ActivityIndicator size="large" color="#697CE3" />
                  )}
                  {!isLoading && <Text style={styles.modalEditButtonText}>
                   {t(tokens.actions.edit)}
                    </Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View>
        <Modal
          animationType={'fade'}
          visible={deleteConfirmVisible}
          transparent
          onRequestClose={() => {
            setDeleteConfirmVisible(!deleteConfirmVisible);
          }}>
          <View style={styles.modalOverlay}>
            <View style={styles.confirmModalContent}>
              <Text style={styles.confirmModalTitle}>
              {t(tokens.actions.delete)}

              </Text>
              <Text style={styles.confirmModalText}>
                             {t(tokens.messages.deleteConfirm)}

              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setDeleteConfirmVisible(false);
                  }}
                  style={styles.modalCancelButton}>
                  <Text style={styles.modalCancelButtonText}>
                  {t(tokens.actions.cancel)}

                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={isLoading}
                  onPress={handleDelete}
                  style={styles.modalDeleteButton}>
                  {isLoading && (
                    <ActivityIndicator size="large" color="#697CE3" />
                  )}
                  {!isLoading && <Text style={styles.modalDeleteButtonText}>
                      {t(tokens.actions.delete)}
                    </Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View>
        <Modal
          animationType={'fade'}
          visible={revokeConfirmVisible}
          transparent
          onRequestClose={() => {
            setRevokeConfirmVisible(!revokeConfirmVisible);
          }}>
          <View style={styles.modalOverlay}>
            <View style={styles.confirmModalContent}>
              <Text style={styles.confirmModalTitle}>
              {t(tokens.actions.revoke)}

              </Text>
              <Text style={styles.confirmModalText}>
                            {t(tokens.messages.revokeConfirm)}

              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setRevokeConfirmVisible(false);
                  }}
                  style={styles.modalCancelButton}>
                  <Text style={styles.modalCancelButtonText}>
                  {t(tokens.actions.cancel)}

                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={isLoading}
                  onPress={handleRevoke}
                  style={styles.modalEditButton}>
                  {isLoading && (
                    <ActivityIndicator size="large" color="#697CE3" />
                  )}
                  {!isLoading && (
                    <Text style={styles.modalEditButtonText}>
{t(tokens.actions.revoke)}

                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
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
  headerContainer: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingLeft: 20,
    paddingBottom: 20,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  backButtonWrapper: {
    // No specific styles needed for this wrapper if the TouchableOpacity has all styles
  },
  backButton: {
    paddingLeft: 4,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    width: '100%',
    // fontFamily: 'PublicSansBold', // Assuming this is a custom font, keep if available
    color: 'black',
    textAlign: 'center',
    paddingRight: '15%',
  },
  menuIconContainer: {
    position: 'absolute',
    right: 0,
    paddingRight: 20,
  },
  scrollViewContainer: {
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
    backgroundColor: 'white',
    height: '83%', // This is a percentage, usually not ideal for fixed height in RN flexbox
    padding: 16,
    borderRadius: 16,
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
  },
  lastDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
  },
  lastDetailRowNoBorder: {
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
    color: 'gray',
    // fontFamily: 'PublicSansBold',
  },
  detailValue: {
    fontSize: 12,
    // fontFamily: 'PublicSansBold',
  },
  statusText: {
    fontSize: 12,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    // fontFamily: 'PublicSansBold',
  },
  statusRejected: {
    backgroundColor: 'rgba(228, 3, 3, 0.03)', // #E4030308
    borderColor: '#E40303',
    color: '#E40303',
  },
  statusApproved: {
    backgroundColor: 'rgba(8, 202, 15, 0.03)', // #08CA0F08
    borderColor: '#08CA0F',
    color: '#08CA0F',
  },
  statusPending: {
    backgroundColor: 'rgba(209, 164, 4, 0.03)', // #D1A40408
    borderColor: '#D1A404',
    color: '#D1A404',
  },
  statusRevoked: {
    backgroundColor: 'rgba(228, 3, 3, 0.03)', // #E4030308
    borderColor: '#E40303',
    color: '#E40303',
  },
  actionButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 8, // Equivalent to Tailwind's gap-2
    paddingRight: 8, // Equivalent to Tailwind's pr-2
    height: 44, // Equivalent to Tailwind's h-11
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 36, // Equivalent to Tailwind's h-9
    padding: 8, // Equivalent to Tailwind's p-2
    borderRadius: 8, // Equivalent to Tailwind's rounded-lg
  },
  revokeButton: {
    width: '50%',
  },
  deleteButton: {
    width: '50%',
      backgroundColor: '#697CE3',

  },
  buttonPrimary: {
    backgroundColor: '#697CE3',
  },
  buttonDisabled: {
    backgroundColor: '#B2BEB5', // Equivalent to Tailwind's bg-[#B2BEB5]
  },
  buttonFullWidth: {
    width: '100%',
    
  },
  buttonText: {
    fontSize: 12,
    color: 'white',
    // fontFamily: 'semibold-poppins', // Assuming custom font
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
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
  modalTitle: {
    fontSize: 16,
    marginBottom: 12,
    // fontFamily: 'semibold-poppins',
    marginTop: 8,
  },
  modalForm: {
    paddingBottom: 8,
    paddingRight: 8,
    paddingLeft: 8,
    gap: 16, // Equivalent to Tailwind's space-y-4
    width: '100%',
    justifyContent: 'space-between',
  },
  datePickerButton: {
    height: 56, // Equivalent to Tailwind's h-14
    backgroundColor: 'white',
    borderRadius: 16, // Equivalent to Tailwind's rounded-2xl
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#9CA3AF', // Equivalent to Tailwind's border-gray-400
    paddingHorizontal: 20, // Equivalent to Tailwind's p-5 pt-0 pb-0
  },
  datePickerText: {
    fontSize: 14,
    color: '#374151', // Equivalent to Tailwind's text-gray-800
    // fontFamily: 'PublicSansBold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 10,
  },
  errorTextMarginLeft: {
    color: 'red',
    fontSize: 12,
    marginLeft: 6,
  },
  dropdownContainer: {
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
  reasonInput: {
    width: '100%',
    borderRadius: 24, // Equivalent to Tailwind's rounded-3xl
    borderWidth: 1,
    borderColor: '#697CE3',
    paddingLeft: 12, // Equivalent to Tailwind's pl-3
  },
  modalButtonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'flex-end',
    width: '100%',
    gap: 20,
    padding: 9,
  },
  modalCancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80, // Equivalent to Tailwind's w-20
    height: 48, // Equivalent to Tailwind's h-12
    padding: 8, // Equivalent to Tailwind's p-2
    borderRadius: 8, // Equivalent to Tailwind's rounded-lg
    borderWidth: 1,
    borderColor: '#697CE3',
  },
  modalCancelButtonText: {
    fontSize: 12,
    color: '#697CE3',
    // fontFamily: 'semibold-poppins',
  },
  modalEditButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48, // Equivalent to Tailwind's h-12
    width: 80, // Equivalent to Tailwind's w-20
    padding: 8, // Equivalent to Tailwind's p-2
    borderRadius: 8, // Equivalent to Tailwind's rounded-lg
    backgroundColor: '#697CE3',
  },
  modalEditButtonText: {
    fontSize: 12,
    color: 'white',
    // fontFamily: 'semibold-poppins',
  },
  confirmModalContent: {
    alignItems: 'center',
    backgroundColor: 'white',
    marginVertical: 60,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 7,
    width: '90%',
    elevation: 10,
    paddingHorizontal: 20, // Equivalent to paddingX: 20
    paddingTop: 20,
    paddingBottom: 10,
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmModalText: {
    marginTop: 10,
    fontSize: 16,
  },
  modalDeleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50, // Equivalent to Tailwind's h-10
    width: 80, // Equivalent to Tailwind's w-20
    padding: 8, // Equivalent to Tailwind's p-2
    borderRadius: 8, // Equivalent to Tailwind's rounded-lg
    backgroundColor: '#cf3636', // Equivalent to Tailwind's bg-[#cf3636]
  },
  modalDeleteButtonText: {
    fontSize: 12,
    color: 'white',
    // fontFamily: 'semibold-poppins',
  },
});