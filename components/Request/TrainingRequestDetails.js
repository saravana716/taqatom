import {useCallback, useEffect, useState} from 'react';
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
import {Iconify} from 'react-native-iconify';
import {Navigation} from 'react-native-navigation';
import ProfileServices from '../../../Services/API/ProfileServices';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {dateTimeToShow, formatDateTime} from '../../../utils/formatDateTime';
import get from 'lodash/get';
import find from 'lodash/find';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';
import moment from 'moment';
import {Dropdown} from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import tokens from '../../../locales/tokens';
import { formatErrorsToToastMessages } from '../../../utils/error-format';

export default function TrainingRequestDetails({
  newItem,
  employeeId,
  componentId,
  payCodes,
  getPayCodeList,
  trainingList,
}) {
  const {t}=useTranslation()
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
    Navigation.pop(componentId);
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
      console.log('kkk');
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
      console.log(error?.errorResponse?.errors[0]?.message, 'ldldldl?.');

     formatErrorsToToastMessages(error)
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
      console.log(error?.errorResponse, 'err');
     formatErrorsToToastMessages(error)
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
      console.log(error?.errorResponse, 'err');
      formatErrorsToToastMessages(error)
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
     formatErrorsToToastMessages(error)
    }
  };
  useEffect(() => {
    getTrainingList();
  }, []);
  return (
    <>
      {!matchedData ? (
        <View className="h-full w-full justify-center items-center">
          <ActivityIndicator size="large" color="#697CE3" />
        </View>
      ) : (
        <MenuProvider>
          <View className="bg-[#F1F3F4] h-full flex-1 w-[100%]">
            <View className="flex-row pt-5 pl-5 pb-5 items-center w-[100%] justify-between">
              <View className=" ">
                <TouchableOpacity onPress={handleBack} className=" pl-1">
                  <Iconify icon="mingcute:left-line" size={30} color="#000" />
                </TouchableOpacity>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-xl w-full font-PublicSansBold text-black text-center pr-[15%]">
{t(tokens.actions.view)}
                </Text>
              </View>

              <View className="absolute right-0 pr-5">
                {matchedData?.approval_status === 1 && (
                  <Menu>
                    <MenuTrigger>
                      <Iconify
                        icon="fluent:more-vertical-16-filled"
                        size={22}
                        color="#000"
                      />
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
                            <Iconify icon="mdi:edit" size={20} color="#000" />
                            <Text style={{marginLeft: 10}}>{t(tokens.actions.edit)}</Text>
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
                <View className="flex-1 bg-white h-[83vh] p-4 rounded-2xl w-full justify-between">
                  <View>
                    <View className="flex-row justify-between border-b pb-6 border-white items-center w-full">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                      {t(tokens.charts.approvalStatus)}
                      </Text>
                      {matchedData?.approval_status === 3 && (
                        <Text className="text-xs border p-1 pl-2 pr-2 bg-[#E4030308] rounded-lg border-[#E40303] text-[#E40303] font-PublicSansBold">
                          {t(tokens.actions.reject)}
                        </Text>
                      )}
                      {matchedData?.approval_status === 2 && (
                        <Text className="text-xs border p-1 pl-2 pr-2 bg-[#08CA0F08] rounded-lg border-[#08CA0F] text-[#08CA0F] font-PublicSansBold">
                          {t(tokens.actions.approve)}
                        </Text>
                      )}
                      {matchedData?.approval_status === 1 && (
                        <Text className="text-xs border p-1 pl-2 pr-2 bg-[#D1A40408] rounded-lg border-[#D1A404] text-[#D1A404] font-PublicSansBold">
                          {t(tokens.actions.pending)}
                        </Text>
                      )}
                      {matchedData?.approval_status === 4 && (
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
                        {get(matchedData, 'first_name')}
                      </Text>
                    </View>
                    <View className="flex-row justify-between border-b pb-6 border-white items-center w-full">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                      {t(tokens.common.lastName)}
                      </Text>
                      <Text className="text-xs font-PublicSansBold">
                        {get(matchedData, 'last_name')}
                      </Text>
                    </View>
                    <View className="flex-row justify-between border-b pb-6 border-white items-center w-full">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                      {t(tokens.common.employeeCode)}
                      </Text>
                      <Text className="text-xs font-PublicSansBold">
                        {get(matchedData, 'emp_code')}
                      </Text>
                    </View>
                    <View className="flex-row justify-between border-b pb-6 border-white items-center w-full">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                      {t(tokens.nav.department)}
                      </Text>
                      <Text className="text-xs font-PublicSansBold">
                        {get(matchedData, 'department_info.department_name')}
                      </Text>
                    </View>
                    <View className="flex-row justify-between border-b pb-6 border-white items-center w-full">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                      {t(tokens.nav.position)}
                      </Text>
                      <Text className="text-xs font-PublicSansBold">
                        {get(matchedData, 'position_info.position_name')}
                      </Text>
                    </View>
                    <View className="flex-row justify-between border-b pb-6 border-white items-center w-full">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                      {t(tokens.common.startTime)}
                      </Text>
                      <Text className="text-xs font-PublicSansBold">
                        {dateTimeToShow(matchedData?.start_time)}
                      </Text>
                    </View>
                    <View className="flex-row justify-between pb-6 border-white items-center w-full ">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                      {t(tokens.common.endTime)}
                      </Text>
                      <Text className="text-xs font-PublicSansBold">
                        {dateTimeToShow(matchedData?.end_time)}
                      </Text>
                    </View>
                    <View className="flex-row justify-between pb-6 border-white items-center w-full ">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                      {t(tokens.nav.payCode)}
                      </Text>
                      <Text className="text-xs font-PublicSansBold">
                        {matchedData?.paycode_details?.name}
                      </Text>
                    </View>
                    <View className="flex-row justify-between pb-6 border-white w-full ">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                      {t(tokens.common.reason)}
                      </Text>
                      <Text className="text-xs font-PublicSansBold">
                        {matchedData?.apply_reason || '-'}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row w-full gap-2 w-[100%] pr-2 h-11 ">
                    {(matchedData?.approval_status === 1 ||
                      matchedData?.approval_status === 2) && (
                      <TouchableOpacity
                        onPress={showRevokeConfirmDialog}
                        className={`items-center justify-center h-9 w-[50%] p-2 rounded-lg ${
                          matchedData?.approval_status === 4
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
                      className={`items-center justify-center h-9 ${
                        matchedData?.approval_status === 4 ||
                        matchedData?.approval_status === 3
                          ? 'w-[100%]'
                          : 'w-[50%]'
                      } p-2 rounded-lg bg-[#697CE3] `}>
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
                  onPress={() => setStartDate(true)}
                  className="h-14 bg-white rounded-2xl border items-center flex-row justify-between border-gray-400 p-5 pt-0 pb-0">
                  <Text className="text-[14px] text-gray-800 ont-PublicSansBold">
                    {formatStartDate
                      ? dateTimeToShow(formatStartDate)
                      : t(tokens.common.startDate)}
                  </Text>
                  <Iconify
                    icon="fluent-mdl2:date-time"
                    size={23}
                    color="#919EABD9"
                  />
                </TouchableOpacity>
                {startError ? (
                  <Text style={{color: 'red', fontSize: 12, marginLeft: 10}}>
                    {startError}
                  </Text>
                ) : null}
                {startDate && (
                  <DateTimePicker
                    value={dateStart}
                    mode="date"
                    is24Hour={true}
                    // display="default"
                    // androidTheme={{
                    //   accentColor: 'black',
                    //   textColor: 'black',
                    // }}

                    onChange={onDateChange}
                    minDate={new Date()} // Disable dates before the current date
                    // maxDate={new Date()}
                    // textColor={'#000' || undefined}
                    // accentColor={'#000' || undefined}
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
                  className="h-14 bg-white rounded-2xl border items-center flex-row justify-between border-gray-400 p-5 pt-0 pb-0 ">
                  <Text className="text-[14px] text-gray-800 ont-PublicSansBold">
                    {formatEndDate ? dateTimeToShow(formatEndDate) : t(tokens.common.endDate)}
                  </Text>
                  <Iconify
                    icon="fluent-mdl2:date-time"
                    size={23}
                    color="#919EABD9"
                  />
                </TouchableOpacity>
                {endError ? (
                  <Text style={{color: 'red', fontSize: 12, marginLeft: 10}}>
                    {endError}
                  </Text>
                ) : null}
                {endDateError ? (
                  <Text style={{color: 'red', fontSize: 12, marginLeft: 10}}>
                    {endDateError}
                  </Text>
                ) : null}
                {endDate && (
                  <DateTimePicker
                    value={dateEnd}
                    mode="date"
                    is24Hour={true}
                    // display="default"
                    // androidTheme={{
                    //   accentColor: 'black',
                    //   textColor: 'black',
                    // }}

                    onChange={onEndDateChange}
                    minDate={new Date()} // Disable dates before the current date
                    // maxDate={new Date()}
                    // textColor={'#000' || undefined}
                    // accentColor={'#000' || undefined}
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
                      console.log('item111', item);
                      setPayCode(item?.id);
                    }}
                    renderItem={renderItem}
                  />
                </View>
                {payCodeError ? (
                  <Text style={{color: 'red', fontSize: 12, marginLeft: 6}}>
                    {payCodeError}
                  </Text>
                ) : null}
                <TextInput
                  className=" w-full rounded-3xl border border-[#697CE3] pl-3"
                  placeholder={t(tokens.common.search)}
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
                  onPress={handleEditTraining}
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
                      {t(tokens.actions.cancel)}
                    </Text>
                  )}
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
