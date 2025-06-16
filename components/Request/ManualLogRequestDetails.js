import { useCallback, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DateTimePicker from '@react-native-community/datetimepicker';
import find from 'lodash/find';
import get from 'lodash/get';
import moment from 'moment';
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
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { PUNCH_STATE_OPTIONS } from '../../components/PunchStateOptions';
import tokens from '../../locales/tokens';
import ProfileServices from '../../Services/API/ProfileServices';
import { formatErrorsToToastMessages } from '../../utils/error-format';
import { dateTimeToShow, formatDateTime } from '../../utils/formatDateTime';

export default function ManualLogRequestDetails({ route, navigation }) { // Added navigation to props
  const { employeeId, newItem, manualLogList } = route.params;
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [manualLogData, setManualLogData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [revokeConfirmVisible, setRevokeConfirmVisible] = useState(false);
  const matchedLogData = find(manualLogData, log => log?.id === newItem?.id);
  const [formatExpectDate, setFormatExpectDate] = useState(
    matchedLogData?.punch_time || null,
  );
  const [workCode, setWorkCode] = useState(matchedLogData?.work_code || '');
  const [applyReason, setApplyReason] = useState(
    matchedLogData?.apply_reason || '',
  );
  const [date, setDate] = useState(new Date());
  const [pickerMode, setPickerMode] = useState(null);
  const [punchStateList, setPunchStateList] = useState(
    matchedLogData?.punch_state || '',
  );
  const [time, setTime] = useState(new Date());

  const handleBack = () => {
    navigation.navigate("ManualLogScreen")
  };

  const showDeleteConfirmDialog = () => {
    setDeleteConfirmVisible(true);
  };

  const showRevokeConfirmDialog = () => {
    setRevokeConfirmVisible(true);
  };

  const handleManualListScreen = () => {
    // Assuming Navigation is passed via props or imported from a navigation library
    // Replace with your actual navigation method if different (e.g., navigation.pop())
    navigation.goBack(); // or navigation.pop() if using a stack navigator
  };

  const handleDelete = async () => {
    setIsLoading(true); // Set loading to true when starting the request
    try {
      const response = await ProfileServices.deleteManualRequest({
        id: matchedLogData?.id,
      });
      setDeleteConfirmVisible(false);
      manualLogList();
      handleManualListScreen();
      setTimeout(() => {
        Toast.show({
          type: 'success',
          text1: 'Delete Success',
          position: 'bottom',
        });
      }, 1000);
    } catch (error) {
      formatErrorsToToastMessages(error);
    } finally {
      setIsLoading(false); // Ensure loading is set to false after the request
    }
  };

  const handleRevoke = async () => {
    setIsLoading(true);
    try {
      const response = await ProfileServices.postManualLogRevoke(
        matchedLogData?.id,
      );

      getManualLogList();
      setRevokeConfirmVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Revoke Success',
        position: 'bottom',
      });
    } catch (error) {
      formatErrorsToToastMessages(error);
      setRevokeConfirmVisible(false);
    } finally {
      setIsLoading(false);
    }
  };

  const onDateChange = useCallback((event, selectedDate) => {
    if (event.type === 'set' && selectedDate) {
      const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
      setDate(selectedDate);
      // setFormatExpectDate(formattedDate);
      setPickerMode('time');
    } else {
      setPickerMode(null); // Dismiss picker if cancelled
    }
  }, []);

  const onTimeChange = useCallback(
    (event, selectedTime) => {
      if (event.type === 'set' && selectedTime) {
        const combinedDateTime = new Date(date);
        combinedDateTime.setHours(selectedTime.getHours());
        combinedDateTime.setMinutes(selectedTime.getMinutes());

        const formattedDateTime = moment(combinedDateTime).format(
          'YYYY-MM-DDTHH:mm:ss',
        );
        setFormatExpectDate(formattedDateTime);
        setPickerMode(null);
      } else {
        setPickerMode(null); // Dismiss picker if cancelled
      }
    },
    [date],
  );

  const handleNumberChange = text => {
    setWorkCode(text);
  };

  const handleEditManualLog = async () => {
    setIsLoading(true); // Set loading to true when starting the request
    try {
      const response = await ProfileServices.editManualLogRequest({
        options: {
          employee: employeeId,
          punch_time: formatDateTime(formatExpectDate),
          punch_state: punchStateList,
          work_code: workCode,
          apply_reason: applyReason,
        },
        id: matchedLogData?.id,
      });
      getManualLogList();
      setModalVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Updated Successfully',
        position: 'bottom',
      });
    } catch (error) {
      formatErrorsToToastMessages(error);
    } finally {
      setIsLoading(false); // Ensure loading is set to false after the request
    }
  };

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  const placeholderMapping = {
    0: 'Check In',
    1: 'Check Out',
    2: 'Break Out',
    3: 'Break In',
    4: 'Overtime In',
    5: 'Overtime Out',
  };

  const placeholderText = placeholderMapping[punchStateList] || 'Punch State';

  const formatDate = dateString => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    const date = new Date(dateString);
    return date
      .toLocaleString('sv-SE', options)
      .replace(' ', 'T')
      .replace(/-/g, '-')
      .replace(/\./g, ':')
      .replace('T', ' ');
  };
  const punchStateLabel = {
    0: 'Check In',
    1: 'Check Out',
    2: 'Break Out',
    3: 'Break In',
    4: 'Overtime In',
    5: 'Overtime Out',
  };

  const getManualLogList = async () => {
    try {
      const RecentActivities = await ProfileServices.getManualLogData(
        employeeId,
      );

      setManualLogData(RecentActivities?.results);
    } catch (error) {
      formatErrorsToToastMessages(error);
    }
  };
  useEffect(() => {
    getManualLogList();
  }, []);

  useEffect(() => {
    if (matchedLogData) {
      setPunchStateList(matchedLogData.punch_state || '');
      setFormatExpectDate(matchedLogData.punch_time || null);
      setWorkCode(matchedLogData.work_code || '');
      setApplyReason(matchedLogData.apply_reason || '');
    }
  }, [matchedLogData]);

  return (
    <>
      {!matchedLogData ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#697CE3" />
        </View>
      ) : (
        <MenuProvider>
          <View style={styles.mainContainer}>
            <View style={styles.headerContainer}>
              <View style={styles.backButtonContainer}>
                <TouchableOpacity onPress={handleBack}>
                  <Icon name="angle-left" size={30} color="#697ce3" />
                </TouchableOpacity>
              </View>

              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitleText}>
                  {t(tokens.actions.view)}
                </Text>
              </View>

              <View style={styles.menuIconContainer}>
                {matchedLogData?.approval_status === 1 && (
                  <Menu>
                    <MenuTrigger>
                      <Icon name="ellipsis-v" size={22} color="#000" />
                    </MenuTrigger>
                    <MenuOptions
                      customStyles={{
                        optionsContainer: styles.menuOptionsContainer,
                        optionWrapper: styles.menuOptionWrapper,
                        optionText: styles.menuOptionText,
                      }}>
                      {matchedLogData?.approval_status === 1 && (
                        <MenuOption onSelect={() => setModalVisible(true)}>
                          <View
                            style={styles.menuOptionContent}>
                            <MaterialCommunityIcons name="pencil" size={20} color="#000" />
                            <Text style={styles.menuOptionText}>{t(tokens.actions.edit)}</Text>
                          </View>
                        </MenuOption>
                      )}
                      <MenuOption onSelect={showDeleteConfirmDialog}>
                        <View
                          style={styles.menuOptionContent}>
                          <MaterialCommunityIcons name="delete" size={20} color="#000" />
                          <Text style={styles.menuOptionText}>{t(tokens.actions.delete)}</Text>
                        </View>
                      </MenuOption>
                      {(matchedLogData?.approval_status === 1 ||
                        matchedLogData?.approval_status === 2) && (
                          <MenuOption onSelect={showRevokeConfirmDialog}>
                            <View
                              style={styles.menuOptionContent}>
                              <MaterialCommunityIcons name="close-circle" size={20} color="#000" />

                              <Text style={styles.menuOptionText}>{t(tokens.actions.revoke)}</Text>
                            </View>
                          </MenuOption>
                        )}
                    </MenuOptions>
                  </Menu>
                )}
              </View>
            </View>

            <View style={styles.contentContainer}>
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.detailCard}>
                  <View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        {t(tokens.charts.approvalStatus)}
                      </Text>
                      {matchedLogData?.approval_status === 3 && (
                        <Text style={styles.statusRejected}>
                          {t(tokens.actions.reject)}
                        </Text>
                      )}
                      {matchedLogData?.approval_status === 2 && (
                        <Text style={styles.statusApproved}>
                          {t(tokens.actions.approve)}
                        </Text>
                      )}
                      {matchedLogData?.approval_status === 1 && (
                        <Text style={styles.statusPending}>
                          {t(tokens.actions.pending)}
                        </Text>
                      )}
                      {matchedLogData?.approval_status === 4 && (
                        <Text style={styles.statusRevoked}>
                          {t(tokens.actions.revoke)}
                        </Text>
                      )}
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        {t(tokens.common.firstName)}
                      </Text>
                      <Text style={styles.detailValue}>
                        {get(matchedLogData, 'first_name')}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        {t(tokens.common.lastName)}
                      </Text>
                      <Text style={styles.detailValue}>
                        {get(matchedLogData, 'last_name')}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        {t(tokens.common.employeeCode)}
                      </Text>
                      <Text style={styles.detailValue}>
                        {get(matchedLogData, 'emp_code')}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        {t(tokens.nav.department)}
                      </Text>
                      <Text style={styles.detailValue}>
                        {get(matchedLogData, 'department_info.department_name')}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        {t(tokens.common.punchTime)}
                      </Text>
                      <Text style={styles.detailValue}>
                        {dateTimeToShow(matchedLogData?.punch_time)}
                      </Text>
                    </View>
                    <View style={[styles.detailRow, styles.noBorderBottom]}>
                      <Text style={styles.detailLabel}>
                        {t(tokens.common.punchState)}
                      </Text>
                      <Text style={styles.detailValue}>
                        {punchStateLabel[matchedLogData?.punch_state] || '-'}
                      </Text>
                    </View>
                    <View style={[styles.detailRow, styles.noBorderBottom]}>
                      <Text style={styles.detailLabel}>
                        {t(tokens.common.workCode)}
                      </Text>
                      <Text style={styles.detailValue}>
                        {matchedLogData?.work_code}
                      </Text>
                    </View>
                    <View style={[styles.detailRow, styles.noBorderBottom]}>
                      <Text style={styles.detailLabel}>
                        {t(tokens.common.reason)}
                      </Text>
                      <Text
                        style={[styles.detailValue, { maxWidth: 140 }]} // Adjusted style to directly apply width
                      >
                        {matchedLogData?.apply_reason || '-'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.actionButtonsContainer}>
                    {(matchedLogData?.approval_status === 1 ||
                      matchedLogData?.approval_status === 2) && (
                        <TouchableOpacity
                          onPress={showRevokeConfirmDialog}
                          style={[
                            styles.actionButton,
                            matchedLogData?.approval_status === 4
                              ? styles.actionButtonDisabled
                              : styles.actionButtonPrimary,
                            styles.actionButtonHalfWidth
                          ]}>
                          <Text style={styles.actionButtonText}>
                            {t(tokens.actions.revoke)}
                          </Text>
                        </TouchableOpacity>
                      )}
                    <TouchableOpacity
                      onPress={showDeleteConfirmDialog}
                      style={[
                        styles.actionButton,
                        (matchedLogData?.approval_status === 4 ||
                          matchedLogData?.approval_status === 3)
                          ? styles.actionButtonFullWidth
                          : styles.actionButtonHalfWidth,
                        styles.actionButtonPrimary, // Assuming delete button is always active
                      ]}>
                      <Text style={styles.actionButtonText}>
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
      <Modal
        animationType={'fade'}
        visible={deleteConfirmVisible}
        transparent
        onRequestClose={() => {
          setDeleteConfirmVisible(!deleteConfirmVisible);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t(tokens.actions.delete)}
            </Text>
            <Text style={styles.modalMessage}>
              {t(tokens.messages.deleteConfirm)}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setDeleteConfirmVisible(false);
                }}
                style={[styles.modalButton, styles.modalButtonOutline]}>
                <Text style={styles.modalButtonOutlineText}>
                  {t(tokens.actions.cancel)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleDelete}
                style={[styles.modalButton, styles.modalButtonDestructive]}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>
                    {t(tokens.actions.delete)}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType={'fade'}
        visible={revokeConfirmVisible}
        transparent
        onRequestClose={() => {
          setRevokeConfirmVisible(!revokeConfirmVisible);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t(tokens.actions.revoke)}
            </Text>
            <Text style={styles.modalMessage}>
              {t(tokens.messages.revokeConfirm)}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setRevokeConfirmVisible(false);
                }}
                style={[styles.modalButton, styles.modalButtonOutline]}>
                <Text style={styles.modalButtonOutlineText}>
                  {t(tokens.actions.cancel)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleRevoke}
                style={[styles.modalButton, styles.modalButtonPrimary]}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>
                    {t(tokens.actions.revoke)}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType={'fade'}
        visible={modalVisible}
        transparent
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.editModalTitle}>
              {t(tokens.actions.edit)}
            </Text>
            <View style={styles.editFormContainer}>
              <TouchableOpacity
                onPress={() => setPickerMode('date')}
                style={styles.dateTimePickerButton}>
                <Text style={styles.dateTimePickerText}>
                  {formatExpectDate
                    ? dateTimeToShow(formatExpectDate)
                    : t(tokens.common.punchTime)}
                </Text>
                <MaterialCommunityIcons name="calendar-clock" size={23} color="#919EABD9" />
              </TouchableOpacity>
              {pickerMode === 'date' && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  is24Hour={true}
                  onChange={onDateChange}
                  maximumDate={new Date()}
                />
              )}
              {pickerMode === 'time' && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  is24Hour={false}
                  onChange={onTimeChange}
                />
              )}
              <View style={styles.dropdownContainer}>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={PUNCH_STATE_OPTIONS}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="id"
                  placeholder={placeholderText}
                  searchPlaceholder={t(tokens.common.search)}
                  value={punchStateList}
                  onChange={item => {
                    setPunchStateList(item?.id);
                  }}
                  renderItem={renderItem}
                />
              </View>
              <TextInput
                placeholder={t(tokens.common.workCode)}
                value={workCode}
                style={styles.textInput}
                onChangeText={handleNumberChange}
              />
              <TextInput
                style={styles.textAreaInput}
                placeholder={t(tokens.common.reason)}
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
                }}
                style={[styles.modalButton, styles.modalButtonOutline]}>
                <Text style={styles.modalButtonOutlineText}>
                  {t(tokens.actions.cancel)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleEditManualLog}
                style={[styles.modalButton, styles.modalButtonPrimary]}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>
                    {t(tokens.actions.edit)}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 14, // Adjusted from 12 for better readability
    color: '#888', // Adjusted color for better visibility
  },
  selectedTextStyle: {
    fontSize: 14, // Adjusted from 12 for better readability
    color: '#000',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14, // Adjusted from 12
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'flex-end',
    width: '100%',
    gap: 20, // Replaced columnGap with gap for modern RN versions
    padding: 9,
  },

  // Converted Tailwind CSS classes
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
  backButtonContainer: {
    position: 'absolute',
    left: 0,
    paddingLeft: 20,
    zIndex: 1, // Ensure the button is clickable
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 20,
    // fontFamily: 'PublicSansBold', // If you have custom fonts, ensure they are linked
    color: '#000',
  },
  menuIconContainer: {
    position: 'absolute',
    right: 0,
    paddingRight: 20,
    zIndex: 1, // Ensure the menu icon is clickable
  },
  menuOptionsContainer: {
    borderRadius: 8,
    padding: 5,
    width: 150,
  },
  menuOptionWrapper: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuOptionText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#000', // Default color
  },
  menuOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    height: '100%',
    borderRadius: 24, // Assuming 3xl refers to a larger border radius
  },
  scrollViewContent: {
    padding: 16,
    flexGrow: 1, // To allow content to expand within ScrollView
  },
  detailCard: {
    flex: 1,
    backgroundColor: '#fff',
    height: '83%', // This might need adjustment based on content. Consider minHeight instead.
    padding: 12,
    borderRadius: 16, // Assuming 2xl
    width: '100%',
    justifyContent: 'space-between',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingBottom: 24,
    borderColor: 'rgba(255, 255, 255, 0)', // Border is effectively invisible as it's white on white background.
    // If you want a subtle separator, use a light grey color.
    alignItems: 'center',
    width: '100%',
    marginBottom: 10, // Add some margin between rows
  },
  noBorderBottom: {
    borderBottomWidth: 0, // Used for the last few rows
  },
  detailLabel: {
    fontSize: 12,
    color: '#A0A0A0', // Gray-400 equivalent
    // fontFamily: 'PublicSansBold',
  },
  detailValue: {
    fontSize: 12,
    // fontFamily: 'PublicSansBold',
    color: '#000', // Default text color
  },
  statusRejected: {
    fontSize: 12,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(228, 3, 3, 0.03)', // E4030308
    borderRadius: 8,
    borderColor: '#E40303',
    color: '#E40303',
    // fontFamily: 'PublicSansBold',
  },
  statusApproved: {
    fontSize: 12,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(8, 202, 15, 0.03)', // 08CA0F08
    borderRadius: 8,
    borderColor: '#08CA0F',
    color: '#08CA0F',
    // fontFamily: 'PublicSansBold',
  },
  statusPending: {
    fontSize: 12,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(209, 164, 4, 0.03)', // D1A40408
    borderRadius: 8,
    borderColor: '#D1A404',
    color: '#D1A404',
    // fontFamily: 'PublicSansBold',
  },
  statusRevoked: {
    fontSize: 12,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(228, 3, 3, 0.03)', // E4030308
    borderRadius: 8,
    borderColor: '#E40303',
    color: '#E40303',
    // fontFamily: 'PublicSansBold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 8, // gap-2
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30, // h-7.5 (assuming 1 unit = 4px, so 7.5 * 4 = 30)
    paddingVertical: 8, // p-2
    borderRadius: 8, // rounded-lg
  },
  actionButtonHalfWidth: {
    width: '49%', // w-[50%] - adjusted slightly for gap
  },
  actionButtonFullWidth: {
    width: '100%', // w-[100%]
  },
  actionButtonPrimary: {
    backgroundColor: '#697CE3',
  },
  actionButtonDisabled: {
    backgroundColor: '#B2BEB5', // bg-[#B2BEB5]
  },
  actionButtonText: {
    fontSize: 12, // text-xs
    color: '#fff',
    // fontFamily: 'semibold-poppins',
  },

  // Modal styles
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  modalMessage: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  modalButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40, // h-10
    width: 80, // w-20
    paddingVertical: 8, // p-2
    borderRadius: 8, // rounded-lg
  },
  modalButtonOutline: {
    borderWidth: 1,
    borderColor: '#697CE3',
  },
  modalButtonOutlineText: {
    fontSize: 12, // text-xs
    color: '#697CE3',
    // fontFamily: 'semibold-poppins',
  },
  modalButtonDestructive: {
    backgroundColor: '#cf3636', // bg-[#cf3636]
  },
  modalButtonText: {
    fontSize: 12, // text-xs
    color: '#fff',
    // fontFamily: 'semibold-poppins',
  },
  editModalTitle: {
    fontSize: 16, // text-base
    marginBottom: 12, // mb-3
    // fontFamily: 'semibold-poppins',
    marginTop: 8, // mt-2
    color: '#000',
  },
  editFormContainer: {
    paddingBottom: 8, // pb-2
    paddingRight: 8, // pr-2
    paddingLeft: 8, // pl-2
    rowGap: 16, // space-y-4 (renamed for clarity and modern RN syntax)
    width: '100%',
    justifyContent: 'space-between',
  },
  dateTimePickerButton: {
    height: 56, // h-14
    backgroundColor: '#fff',
    borderRadius: 16, // rounded-2xl
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#9CA3AF', // gray-400
    paddingHorizontal: 20, // p-5
    paddingVertical: 0, // pt-0 pb-0
  },
  dateTimePickerText: {
    fontSize: 14, // text-[14px]
    color: '#374151', // gray-800
    // fontFamily: 'PublicSansBold',
  },
  dropdownContainer: {
    // This is essentially the `container` style already defined
    borderRadius: 16, // Assuming this matches rounded-2xl
    borderWidth: 1,
    borderColor: '#697CE3',
  },
  textInput: {
    height: 56, // h-14
    borderRadius: 16, // rounded-2xl
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#697CE3',
    paddingHorizontal: 8, // p-2
    paddingVertical: 0, // pt-0 pb-0
    color: '#000', // Ensure text color is visible
  },
  textAreaInput: {
    width: '100%',
    borderRadius: 24, // rounded-3xl
    borderWidth: 1,
    borderColor: '#697CE3',
    paddingLeft: 12, // pl-3
    minHeight: 120, // To ensure it's visible for 8 lines. Adjust as needed.
    color: '#000', // Ensure text color is visible
  },
});