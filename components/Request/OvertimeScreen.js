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
import {useTranslation} from 'react-i18next';
import tokens from '../../../locales/tokens';
import {Navigation} from 'react-native-navigation';
import isEmpty from 'lodash/isEmpty';
import {Dropdown} from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import {PUNCH_STATE_OPTIONS} from '../../../Components/Component/PunchStateOptions';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import LeaveCard from '../../../Components/Component/LeaveCard';
import OvertimeCard from '../../../Components/Component/OvertimeCard';
import ProfileServices from '../../../Services/API/ProfileServices';
import moment from 'moment';
import {dateTimeToShow, formatDateTime} from '../../../utils/formatDateTime';
import {useTranslation} from 'react-i18next';
import tokens from '../../../locales/tokens';
import { formatErrorsToToastMessages } from '../../../utils/error-format';

export default function OvertimeScreen({componentId, userId}) {
   const {t,i18n}=useTranslation()
  const isRTL = i18n.language === 'ar';
  console.log("yyyyyyyyyyyyyyyyyyyy",isRTL);
  const [modalVisible, setModalVisible] = useState(false);
  const [startDatePicker, setStartDatePicker] = useState(false);
  const [startTimePicker, setStartTimePicker] = useState(false);
  const [endDatePicker, setEndDatePicker] = useState(false);
  const [endTimePicker, setEndTimePicker] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [payCode, setPayCode] = useState('');
  const [applyReason, setApplyReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [timeStart, setTimeStart] = useState(new Date());
  const [timeEnd, setTimeEnd] = useState(new Date());
  const [OvertimeData, setOvertimeData] = useState([]);
  const [payCodesList, setPayCodesList] = useState([]);
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setendDateError] = useState('');
  const [payCodeError, setPayCodeError] = useState('');

  const handleBack = () => {
    Navigation.pop(componentId);
  };
  const onStartDateChange = useCallback((event, selectedDate) => {
    if (selectedDate) {
      const formattedDate = moment(selectedDate).format('DD MMMM YYYY');
      setStartDate(selectedDate);
      // setStartTime(formattedDate);
      setStartDatePicker(false);
      setStartTimePicker(true);
    } else {
      setStartDatePicker(false);
    }
  }, []);

  const onStartTimeChange = useCallback(
    (event, selectedTime) => {
      if (event.type === 'set' && selectedTime) {
        const combinedDateTime = new Date(startDate);
        combinedDateTime.setHours(selectedTime.getHours());
        combinedDateTime.setMinutes(selectedTime.getMinutes());
        const formattedDate = moment(combinedDateTime).format(
          'YYYY-MM-DDTHH:mm:ss',
        );
        setStartTime(formattedDate);
        setStartTimePicker(false);
      } else {
        setStartTimePicker(false);
      }
    },
    [startDate],
  );

  const onEndDateChange = useCallback((event, selectedDate) => {
    if (selectedDate) {
      const formattedDate = moment(selectedDate).format('DD MMMM YYYY');
      setEndDate(selectedDate);
      // setEndTime(formattedDate);
      setEndDatePicker(false);
      setEndTimePicker(true);
    } else {
      setEndDatePicker(false);
    }
  }, []);

  const onEndTimeChange = useCallback(
    (event, selectedTime) => {
      if (selectedTime) {
        const combinedDateTime = new Date(endDate);
        combinedDateTime.setHours(selectedTime.getHours());
        combinedDateTime.setMinutes(selectedTime.getMinutes());
        const formattedDate = moment(combinedDateTime).format(
          'YYYY-MM-DDTHH:mm:ss',
        );
        setEndTime(formattedDate);
        setEndTimePicker(false);
      } else {
        setEndTimePicker(false);
      }
    },
    [endDate],
  );

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.name}</Text>
      </View>
    );
  };

  const handleAddOvertime = async () => {
    setendDateError('');
    setStartDateError('');
    setPayCodeError('');
    if (!payCode) {
      setPayCodeError('Paycode is Required');
      return;
    }
    if (new Date(endTime) <= new Date(startTime)) {
      setendDateError('End Date must be after Start Date');
      return;
    }
    try {
      const response = await ProfileServices.addOvertimeRequest({
        employee: userId,
        start_time: formatDateTime(startTime),
        end_time: formatDateTime(endTime),
        pay_code: payCode,
        apply_reason: applyReason,
      });
      setIsLoading(false);
      setModalVisible(false);
      getOvertimeList();
      setStartTime();
      setEndTime();
      setPayCode();
      setApplyReason();
      Toast.show({
        type: 'success',
        text1: 'Added Successfully',
        position: 'bottom',
      });
      console.log('response', response);
    } catch (error) {
      setIsLoading(false);
      console.log(error?.errorResponse, error, 'ldldldl?.');

     formatErrorsToToastMessages(error)
    }
  };
  const getOvertimeList = async () => {
    setIsLoading(true);
    try {
      const RecentActivities = await ProfileServices.getOvertimeData(userId);
      setOvertimeData(RecentActivities?.results);
    } catch (error) {
      console.log('ldldldl?.', error?.errorResponse, error);

     formatErrorsToToastMessages(error)
    } finally {
      setIsLoading(false);
    }
  };
  const getPayCodeList = async () => {
    try {
      const paycodeIds = [2];
      const response = await ProfileServices.getPayCodeLists(paycodeIds);
      const {overtime_paycodes} = response;
      setPayCodesList(overtime_paycodes);
    } catch (error) {
     formatErrorsToToastMessages(error)
    }
  };

  useEffect(() => {
    getOvertimweList();
    getPayCodeList();
  }, []);

  return (
    <View className="space-y-5 justify-between">
      <View className="pb-12 ">
        <View className="flex-row pb-7 p-5 items-center bg-white">
          <TouchableOpacity onPress={handleBack} className=" pl-1">
            <Iconify icon="mingcute:left-line" size={30} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl w-full font-PublicSansBold text-black text-center pr-[15%]">
            {t(tokens.nav.overtime)}
          </Text>
        </View>
        {isLoading ? (
          <View className="w-full h-[88vh] items-center justify-center">
            <ActivityIndicator size="large" color="#697CE3" />
          </View>
        ) : isEmpty(OvertimeData) ? (
          <View className="h-full">
            <Text className="text-xl font-PublicSansBold text-center pt-40 h-full">
              {t(tokens.messages.noOvertime)}
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            className="pt-5 p-5 rounded-2xl w-full h-[88vh] space-y-2">
            <View className="pb-10 pt-4">
              {OvertimeData?.slice()?.map(newItem => (
                <View className="pb-6" key={newItem?.id}>
                  <OvertimeCard
                    newItem={newItem}
                    employeeId={userId}
                    componentId={componentId}
                    payCodesList={payCodesList}
                    getPayCodeList={getPayCodeList}
                    overtimeList={getOvertimeList}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        )}
        <Toast />
      </View>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
        style={{elevation: 10}}
        className=" absolute right-3 items-center justify-center top-4 h-14 w-14 rounded-xl bg-white">
        <Iconify icon="basil:add-outline" size={50} color="#697CE3" />
      </TouchableOpacity>

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
                {t(tokens.actions.add)}
              </Text>
              <View className=" pb-2 pr-2 pl-2 space-y-4 w-full justify-between">
                <TouchableOpacity
                  onPress={() => setStartDatePicker(true)}
                  className="h-14 bg-white rounded-2xl border items-center flex-row justify-between border-gray-400 p-3.5 pt-0 pb-0">
                  <Text className="text-[14px] text-gray-800 ont-PublicSansBold">
                    {startTime ? dateTimeToShow(startTime) : t(tokens.common.startDate)}
                  </Text>
                  <Iconify
                    icon="fluent-mdl2:date-time"
                    size={23}
                    color="#919EABD9"
                  />
                </TouchableOpacity>
                {startDatePicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    is24Hour={true}
                    onChange={onStartDateChange}
                    maximumDate={new Date()} // Disable dates before the current date
                    // maxDate={new Date()}
                    // textColor={'#000' || undefined}
                    // accentColor={'#000' || undefined}
                  />
                )}
                {startTimePicker && (
                  <DateTimePicker
                    value={timeStart}
                    mode="time"
                    is24Hour={false}
                    onChange={onStartTimeChange}
                  />
                )}
                {/* <View style={styles.container}> */}
                <TouchableOpacity
                  onPress={() => setEndDatePicker(true)}
                  className="h-14 bg-white rounded-2xl border items-center flex-row justify-between border-gray-400 p-3.5 pt-0 pb-0">
                  <Text className="text-[14px] text-gray-800 ont-PublicSansBold">
                    {endTime ? dateTimeToShow(endTime) : t(tokens.common.endDate)}
                  </Text>
                  <Iconify
                    icon="fluent-mdl2:date-time"
                    size={23}
                    color="#919EABD9"
                  />
                </TouchableOpacity>
                {endDateError ? (
                  <Text style={{color: 'red', fontSize: 12, marginLeft: 10}}>
                    {endDateError}
                  </Text>
                ) : null}
                {endDatePicker && (
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    is24Hour={true}
                    onChange={onEndDateChange}
                    maximumDate={new Date()}
                  />
                )}
                {endTimePicker && (
                  <DateTimePicker
                    value={timeEnd}
                    mode="time"
                    is24Hour={false}
                    onChange={onEndTimeChange}
                  />
                )}
                {/* </View> */}
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
                    placeholder={t(tokens.nav.payCode)}
                    searchPlaceholder={t(tokens.common.search)}
                    value={payCode}
                    onChange={item => {
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
                  className=" w-full rounded-3xl border border-[#697CE3] pl-5"
                  placeholder={t(tokens.common.reason)}
                  editable
                  multiline
                  textAlignVertical="top"
                  onChangeText={setApplyReason}
                  numberOfLines={8}
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
                  onPress={handleAddOvertime}
                  className="items-center justify-center h-12 w-20 p-2 rounded-lg bg-[#697CE3]">
                  {isLoading && (
                    <ActivityIndicator size="large" color="#697CE3" />
                  )}
                  {!isLoading && (
                    <Text className="text-xs text-white font-semibold-poppins">
                      {t(tokens.actions.add)}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Toast />
        </Modal>
      </View>
    </View>
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
    height: 60,
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
