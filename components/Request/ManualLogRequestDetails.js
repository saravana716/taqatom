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

export default function ManualLogRequestDetails({
 route
}) {
   const { employeeId, newItem, manualLogList } = route.params;
  const {t}=useTranslation()
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
    Navigation.pop(componentId);
  };

  const handleDelete = async () => {
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
     formatErrorsToToastMessages(error)
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
      setIsLoading(false);
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
  const onDateChange = useCallback((event, selectedDate) => {
    if (event.type === 'set' && selectedDate) {
      const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
      setDate(selectedDate);
      // setFormatExpectDate(formattedDate);
      setPickerMode('time');
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
      }
    },
    [date],
  );

  const handleNumberChange = text => {
    setWorkCode(text);
  };

  const handleEditManualLog = async () => {
    // setIsLoading(false);
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
      setIsLoading(false);
      setModalVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Updated Successfully',
        position: 'bottom',
      });
    } catch (error) {
      setIsLoading(false);
     formatErrorsToToastMessages(error)
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
     formatErrorsToToastMessages(error)
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
        <View className="h-full w-full justify-center items-center">
          <ActivityIndicator size="large" color="#697CE3" />
        </View>
      ) : (
        <MenuProvider>
          <View className="bg-[#F1F3F4] h-full flex-1 w-[100%]">
            <View className="flex-row pt-5 pl-5 pb-5 items-center w-[100%] justify-between">
              <View className="absolute left-0 pl-5">
                <TouchableOpacity onPress={handleBack}>
                   <Icon name="angle-left" size={30} color="#697ce3" />
          </TouchableOpacity>
              </View>

              <View className="flex-1 items-center">
                <Text className="text-xl font-PublicSansBold text-black">
                 {t(tokens.actions.view)}
                </Text>
              </View>

              <View className="absolute right-0 pr-5">
                {matchedLogData?.approval_status === 1 && (
                  <Menu>
                    <MenuTrigger>
                     <Icon name="ellipsis-v" size={22} color="#000" />
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
                      {matchedLogData?.approval_status === 1 && (
                        <MenuOption onSelect={() => setModalVisible(true)}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                           <MaterialCommunityIcons name="pencil" size={20} color="#000" />     <Text style={{marginLeft: 10}}>{t(tokens.actions.edit)}</Text>
                          </View>
                        </MenuOption>
                      )}
                      <MenuOption onSelect={showDeleteConfirmDialog}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                            <MaterialCommunityIcons name="delete" size={20} color="#000" />
                          <Text style={{marginLeft: 10}}>{t(tokens.actions.delete)}</Text>
                        </View>
                      </MenuOption>
                      {(matchedLogData?.approval_status === 1 ||
                        matchedLogData?.approval_status === 2) && (
                        <MenuOption onSelect={showRevokeConfirmDialog}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <MaterialCommunityIcons name="close-circle" size={20} color="#000" />
                            
                            <Text style={{marginLeft: 10}}>{t(tokens.actions.revoke)}</Text>
                          </View>
                        </MenuOption>
                      )}
                    </MenuOptions>
                  </Menu>
                )}
              </View>
            </View>

            <View className="flex-1 h-full rounded-3xl">
              <ScrollView className="p-4 h-full flex-1">
                <View className="flex-1 bg-white h-[83vh] p-3 rounded-2xl w-full justify-between">
                  <View>
                    <View className="flex-row justify-between border-b pb-6 border-white items-center w-full">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                      {t(tokens.charts.approvalStatus)}
                      </Text>
                      {matchedLogData?.approval_status === 3 && (
                        <Text className="text-xs border p-1 pl-2 pr-2 bg-[#E4030308] rounded-lg border-[#E40303] text-[#E40303] font-PublicSansBold">
                        {t(tokens.actions.reject)}
                        </Text>
                      )}
                      {matchedLogData?.approval_status === 2 && (
                        <Text className="text-xs border p-1 pl-2 pr-2 bg-[#08CA0F08] rounded-lg border-[#08CA0F] text-[#08CA0F] font-PublicSansBold">
                          {t(tokens.actions.approve)}
                        </Text>
                      )}
                      {matchedLogData?.approval_status === 1 && (
                        <Text className="text-xs border p-1 pl-2 pr-2 bg-[#D1A40408] rounded-lg border-[#D1A404] text-[#D1A404] font-PublicSansBold">
                          {t(tokens.actions.pending)}
                        </Text>
                      )}
                      {matchedLogData?.approval_status === 4 && (
                        <Text className="text-xs border p-1 pl-2 pr-2 bg-[#E4030308] rounded-lg border-[#E40303] text-[#E40303] font-PublicSansBold">
                          {t(tokens.actions.revoke)}
                        </Text>
                      )}
                    </View>
                    <View className="flex-row justify-between border-b pb-6 border-white items-center w-full">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                      {t(tokens.common.firstName)}
                      </Text>
                      <Text className="text-xs font-PublicSansBold">
                        {get(matchedLogData, 'first_name')}
                      </Text>
                    </View>
                    <View className="flex-row justify-between border-b pb-6 border-white items-center w-full">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                      {t(tokens.common.lastName)}
                      </Text>
                      <Text className="text-xs font-PublicSansBold">
                        {get(matchedLogData, 'last_name')}
                      </Text>
                    </View>
                    <View className="flex-row justify-between border-b pb-6 border-white items-center w-full">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                      {t(tokens.common.employeeCode)}
                      </Text>
                      <Text className="text-xs font-PublicSansBold">
                        {get(matchedLogData, 'emp_code')}
                      </Text>
                    </View>
                    <View className="flex-row justify-between border-b pb-6 border-white items-center w-full">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                      {t(tokens.nav.department)}
                      </Text>
                      <Text className="text-xs font-PublicSansBold">
                        {get(matchedLogData, 'department_info.department_name')}
                      </Text>
                    </View>

                    <View className="flex-row justify-between border-b pb-6 border-white items-center w-full">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                      {t(tokens.common.punchTime)}
                      </Text>
                      <Text className="text-xs font-PublicSansBold">
                        {dateTimeToShow(matchedLogData?.punch_time)}
                      </Text>
                    </View>
                    <View className="flex-row justify-between pb-6 border-white items-center w-full ">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                      {t(tokens.common.punchState)}
                      </Text>
                      <Text className="text-xs font-PublicSansBold">
                        {punchStateLabel[matchedLogData?.punch_state] || '-'}
                      </Text>
                    </View>
                    <View className="flex-row justify-between pb-6 border-white items-center w-full ">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                      {t(tokens.common.workCode)}
                      </Text>
                      <Text className="text-xs font-PublicSansBold">
                        {matchedLogData?.work_code}
                      </Text>
                    </View>
                    <View className="flex-row justify-between pb-6 border-white w-full ">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                      {t(tokens.common.reason)}
                      </Text>
                      <Text
                        className="text-xs font-PublicSansBold"
                        // style={{width: 140}}
                      >
                        {matchedLogData?.apply_reason || '-'}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row w-full gap-2 w-[100%]">
                    {(matchedLogData?.approval_status === 1 ||
                      matchedLogData?.approval_status === 2) && (
                      <TouchableOpacity
                        onPress={showRevokeConfirmDialog}
                        className={`items-center justify-center h-7.5 w-[50%] p-2 rounded-lg ${
                          matchedLogData?.approval_status === 4
                            ? 'bg-[#B2BEB5]'
                            : 'bg-[#697CE3]'
                        }`}>
                        <Text className="text-xs text-white font-semibold-poppins">
                        {t(tokens.actions.revoke)}
                        </Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={showDeleteConfirmDialog}
                      className={`items-center justify-center h-7.5 ${
                        matchedLogData?.approval_status === 4 ||
                        matchedLogData?.approval_status === 3
                          ? 'w-[100%]'
                          : 'w-[50%]'
                      } p-2 rounded-lg bg-[#697CE3]`}>
                      <Text className="text-xs text-white font-semibold-poppins">
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
          visible={deleteConfirmVisible}
          transparent
          onRequestClose={() => {
            setDeleteConfirmVisible(!deleteConfirmVisible);
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(52, 52, 52, 0.8)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: 'white',
                marginVertical: 60,
                borderWidth: 1,
                borderColor: '#fff',
                borderRadius: 7,
                width: '90%',
                elevation: 10,
                paddingX: 20,
                paddingTop: 20,
                paddingBottom: 10,
              }}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                {t(tokens.actions.delete)}
              </Text>
              <Text style={{marginTop: 10, fontSize: 16}}>
                {t(tokens.messages.deleteConfirm)}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setDeleteConfirmVisible(false);
                  }}
                  className="items-center justify-center w-20 h-10 p-2 rounded-lg border border-[#697CE3] ">
                  <Text className="text-xs  text-[#697CE3] font-semibold-poppins ">
                    {t(tokens.actions.cancel)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={isLoading}
                  onPress={handleDelete}
                  className="items-center justify-center h-10 w-20 p-2 rounded-lg bg-[#cf3636]">
                  {isLoading && (
                    <ActivityIndicator size="large" color="#697CE3" />
                  )}
                  {!isLoading && (
                    <Text className="text-xs text-white font-semibold-poppins">
                      {t(tokens.actions.delete)}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Toast />
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
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(52, 52, 52, 0.8)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: 'white',
                marginVertical: 60,
                borderWidth: 1,
                borderColor: '#fff',
                borderRadius: 7,
                width: '90%',
                elevation: 10,
                paddingX: 20,
                paddingTop: 20,
                paddingBottom: 10,
              }}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
               {t(tokens.actions.revoke)}
              </Text>
              <Text style={{marginTop: 10, fontSize: 16}}>
                {t(tokens.messages.revokeConfirm)}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setRevokeConfirmVisible(false);
                  }}
                  className="items-center justify-center w-20 h-10 p-2 rounded-lg border border-[#697CE3] ">
                  <Text className="text-xs  text-[#697CE3] font-semibold-poppins ">
                    {t(tokens.actions.cancel)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={isLoading}
                  onPress={handleRevoke}
                  className="items-center justify-center h-10 w-20 p-2 rounded-lg bg-[#697CE3]">
                  {isLoading && (
                    <ActivityIndicator size="large" color="#697CE3" />
                  )}
                  {!isLoading && (
                    <Text className="text-xs text-white font-semibold-poppins">
                      {t(tokens.actions.revoke)}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Toast />
        </Modal>
      </View>
      <View>
        <Modal
          animationType={'fade'}
          visible={modalVisible}
          transparent
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(52, 52, 52, 0.8)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: 'white',
                marginVertical: 60,
                borderWidth: 1,
                borderColor: '#fff',
                borderRadius: 7,
                width: '90%',
                elevation: 10,
                padding: 20,
              }}>
              <Text className="text-base mb-3 font-semibold-poppins mt-2">
                {t(tokens.actions.edit)}
              </Text>
              <View className=" pb-2 pr-2 pl-2 space-y-4 w-full justify-between">
                <TouchableOpacity
                  onPress={() => setPickerMode('date')}
                  className="h-14 bg-white rounded-2xl border items-center flex-row justify-between border-gray-400 p-5 pt-0 pb-0">
                  <Text className="text-[14px] text-gray-800 ont-PublicSansBold">
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
                <View style={styles.container}>
                  <Dropdown
                    style={[styles.dropdown]}
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
                  className="h-14 rounded-2xl border items-center flex-row justify-between border-[#697CE3] p-2 pt-0 pb-0"
                  onChangeText={handleNumberChange}
                />
                <TextInput
                  className=" w-full rounded-3xl border border-[#697CE3] pl-3"
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
                  className="items-center justify-center w-20 h-12 p-2 rounded-lg border border-[#697CE3] ">
                  <Text className="text-xs  text-[#697CE3] font-semibold-poppins ">
                    {t(tokens.actions.cancel)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={isLoading}
                  onPress={handleEditManualLog}
                  className="items-center justify-center h-12 w-20 p-2 rounded-lg bg-[#697CE3]">
                  {isLoading && (
                    <ActivityIndicator size="large" color="#697CE3" />
                  )}
                  {!isLoading && (
                    <Text className="text-xs text-white font-semibold-poppins">
                      {t(tokens.actions.edit)}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Toast />
        </Modal>
      </View>
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
});
