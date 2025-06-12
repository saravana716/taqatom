import DateTimePicker from '@react-native-community/datetimepicker';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';

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
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useSelector } from 'react-redux';
import TrainingCard from '../../components/TrainingCard';
import ProfileServices from '../../Services/API/ProfileServices';
import { formatErrorsToToastMessages } from '../../utils/error-format';
import { dateTimeToShow, formatDateTime } from '../../utils/formatDateTime';

export default function TrainingScreen({navigation}) {
   const selectorid= useSelector(function (data) {
        return data.empid
    })
  const { t } = useTranslation();
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
  const [trainingData, setTrainingData] = useState([]);
  const [payCodesList, setPayCodesList] = useState([]);
  const [timeStart, setTimeStart] = useState(new Date());
  const [timeEnd, setTimeEnd] = useState(new Date());
  const [endDateError, setendDateError] = useState('');
  const [payCodeError, setPayCodeError] = useState('');
  const [startError, setStartError] = useState('');
  const [endError, setEndError] = useState('');

  const handleBack = () => {
    navigation.navigate("RequestScreen")
  };

  const onStartDateChange = useCallback((event, selectedDate) => {
    if (selectedDate) {
      // const formattedDate = moment(selectedDate).format('DD MMMM'); // This line was commented out in original
      setStartDate(selectedDate);
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
      // const formattedDate = moment(selectedDate).format('DD MMMM'); // This line was commented out in original
      setEndDate(selectedDate);
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

  const handleAddTraining = async () => {
    setendDateError('');
    setPayCodeError('');
    setStartError('');
    setEndError('');
    if (!startTime) {
      setStartError('Start Date is required');
      return;
    } else if (!endTime) {
      setEndError('End Date is Required');
      return;
    } else if (new Date(endTime) <= new Date(startTime)) {
      setendDateError('End Date must be after Start Date');
      return;
    } else if (!payCode) {
      setPayCodeError('Paycode is Required');
      return;
    }
    try {
      const response = await ProfileServices.addTrainingRequest({
        employee: selectorid,
        start_time: formatDateTime(startTime),
        end_time: formatDateTime(endTime),
        pay_code: payCode,
        apply_reason: applyReason,
      });
      setIsLoading(false);
      setModalVisible(false);
      getTrainingList();
      setStartTime(null); // Reset to null for clarity
      setEndTime(null); // Reset to null for clarity
      setPayCode(''); // Reset to empty string for clarity
      setApplyReason(''); // Reset to empty string for clarity
      Toast.show({
        type: 'success',
        text1: 'Added Successfully',
        position: 'bottom',
      });
    } catch (error) {
      setIsLoading(false);
      formatErrorsToToastMessages(error);
    }
  };

  const getTrainingList = async () => {
    setIsLoading(true);
    try {
      const RecentActivities = await ProfileServices.getTrainingData(selectorid);
      setTrainingData(RecentActivities?.results);
    } catch (error) {
      formatErrorsToToastMessages(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPayCodeList = async () => {
    try {
      const paycodeIds = [5];
      const response = await ProfileServices.getPayCodeLists(paycodeIds);
      const { training_paycodes } = response;
      setPayCodesList(training_paycodes);
    } catch (error) {
      formatErrorsToToastMessages(error);
    }
  };

  useEffect(() => {
    getTrainingList();
    getPayCodeList();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentWrapper}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Icon name="angle-left" size={30} color="#697ce3" />
          </TouchableOpacity>
          <Text style={styles.headerText}>
            Training
          </Text>
        </View>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#697CE3" />
          </View>
        ) : isEmpty(trainingData) ? (
          <View style={styles.noTrainingView}>
            <Text style={styles.noTrainingText}>
              No Training Available
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={styles.scrollViewContent}>
            <View style={styles.trainingCardsWrapper}>
              {trainingData?.slice()?.map(newItem => (
                <View style={styles.trainingCardItem} key={newItem?.id}>
                  <TrainingCard
                    newItem={newItem}
                    employeeId={selectorid}
                    payCodes={payCodesList}
                    trainingList={getTrainingList}
                    getPayCodeList={getPayCodeList}
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
        style={styles.addButton}>
      <Icon name="plus" size={24} color="#697ce3" />
      </TouchableOpacity>

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
              <Text style={styles.modalTitle}>
                Add
              </Text>
              <View style={styles.formSection}>
                <TouchableOpacity
                  onPress={() => setStartDatePicker(true)}
                  style={styles.dateTimeInput}>
                  <Text style={styles.dateTimeInputText}>
                    {startTime ? dateTimeToShow(startTime) : 'Start Date'}
                  </Text>
                 <Icon name="calendar" size={24} color="#919EABD9" />
                </TouchableOpacity>
                {startError ? (
                  <Text style={styles.errorTextSmall}>
                    {startError}
                  </Text>
                ) : null}
                {startDatePicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    is24Hour={true}
                    onChange={onStartDateChange}
                    minDate={new Date()}
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
                <TouchableOpacity
                  onPress={() => setEndDatePicker(true)}
                  style={styles.dateTimeInput}>
                  <Text style={styles.dateTimeInputText}>
                    {endTime ? dateTimeToShow(endTime) : 'End Date'}
                  </Text>
                <Icon name="calendar" size={24} color="#919EABD9" />
                </TouchableOpacity>
                {endError ? (
                  <Text style={styles.errorTextSmall}>
                    {endError}
                  </Text>
                ) : null}
                {endDateError ? (
                  <Text style={styles.errorTextSmall}>
                    {endDateError}
                  </Text>
                ) : null}
                {endDatePicker && (
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    is24Hour={true}
                    onChange={onEndDateChange}
                    minDate={new Date()}
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
                <View style={styles.dropdownOuterContainer}>
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
                    placeholder={'Pay Code'}
                    searchPlaceholder={'Search...'}
                    value={payCode}
                    onChange={item => {
                      setPayCode(item?.id);
                    }}
                    renderItem={renderItem}
                  />
                </View>
                {payCodeError ? (
                  <Text style={styles.errorTextDropdown}>
                    {payCodeError}
                  </Text>
                ) : null}
                <TextInput
                  style={styles.reasonInput}
                  placeholder={'Reason'}
                  editable
                  multiline
                  textAlignVertical="top"
                  onChangeText={setApplyReason}
                  numberOfLines={8}
                />
              </View>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    setStartTime(null);
                    setEndTime(null);
                    setPayCode('');
                    setApplyReason('');
                  }}
                  style={styles.cancelModalButton}>
                  <Text style={styles.cancelModalButtonText}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={isLoading}
                  onPress={handleAddTraining}
                  style={styles.addModalButton}>
                  {isLoading ? (
                    <ActivityIndicator size="large" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.addModalButtonText}>
                      Add
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
  mainContainer: {
    flex: 1, // Added to make the main view take full height
    justifyContent: 'space-between',
    backgroundColor:"white",
    // Removed space-y-5 as it's a Tailwind specific margin/padding class
  },
  contentWrapper: {
    paddingBottom: 12, // Corresponds to pb-12
  },
  headerContainer: {
    flexDirection: 'row', // Corresponds to flex-row
    paddingBottom: 7, // Corresponds to pb-7
    padding: 20, // Corresponds to p-5
    alignItems: 'center', // Corresponds to items-center
    backgroundColor: 'white', // Corresponds to bg-white
  },
  backButton: {
    paddingLeft: 4, // Corresponds to pl-1 (assuming 1 unit = 4px)
  },
  headerText: {
    fontSize: 20, // Corresponds to text-xl
    width: '100%', // Corresponds to w-full
    // fontFamily: 'PublicSansBold', // Assuming this is a custom font, keep if defined elsewhere
    color: 'black', // Corresponds to text-black
    textAlign: 'center', // Corresponds to text-center
    paddingRight: '15%', // Corresponds to pr-[15%]
  },
  loadingContainer: {
    width: '100%', // Corresponds to w-full
    height: '88%', // Corresponds to h-[88vh]
    alignItems: 'center', // Corresponds to items-center
    justifyContent: 'center', // Corresponds to justify-center
  },
  noTrainingView: {
    height: '100%', // Corresponds to h-full
  },
  noTrainingText: {
    fontSize: 20, // Corresponds to text-xl
    // fontFamily: 'PublicSansBold', // Assuming this is a custom font
    textAlign: 'center', // Corresponds to text-center
    paddingTop: 160, // Corresponds to pt-40 (assuming 1 unit = 4px)
    height: '100%', // Corresponds to h-full
  },
  scrollViewContent: {
    paddingTop: 20, // Corresponds to pt-5
    padding: 20, // Corresponds to p-5
    borderRadius: 8, // Corresponds to rounded-2xl (assuming 2xl is 8px or similar)
    width: '100%', // Corresponds to w-full
    height: '88%', // Corresponds to h-[88vh]
    // Removed space-y-2 as it's a Tailwind specific margin/padding class
  },
  trainingCardsWrapper: {
    paddingBottom: 40, // Corresponds to pb-10
    paddingTop: 16, // Corresponds to pt-4
  },
  trainingCardItem: {
    paddingBottom: 24, // Corresponds to pb-6
  },
  addButton: {
    elevation: 10,
    position: 'absolute', // Corresponds to absolute
    right: 12, // Corresponds to right-3 (assuming 1 unit = 4px)
    alignItems: 'center', // Corresponds to items-center
    justifyContent: 'center', // Corresponds to justify-center
    top: 16, // Corresponds to top-4 (assuming 1 unit = 4px)
    height: 56, // Corresponds to h-14 (assuming 1 unit = 4px)
    width: 56, // Corresponds to w-14 (assuming 1 unit = 4px)
    borderRadius: 12, // Corresponds to rounded-xl (assuming xl is 12px or similar)
    backgroundColor: 'white', // Corresponds to bg-white
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
    fontSize: 16, // Corresponds to text-base
    marginBottom: 12, // Corresponds to mb-3
    // fontFamily: 'semibold-poppins', // Assuming this is a custom font
    marginTop: 8, // Corresponds to mt-2
    fontWeight: '600', // Added for semibold
  },
  formSection: {
    paddingBottom: 8, // Corresponds to pb-2
    paddingRight: 8, // Corresponds to pr-2
    paddingLeft: 8, // Corresponds to pl-2
    // Removed space-y-4 as it's a Tailwind specific margin/padding class
    width: '100%', // Corresponds to w-full
    justifyContent: 'space-between', // Corresponds to justify-between
  },
  dateTimeInput: {
    height: 56, // Corresponds to h-14
    backgroundColor: 'white', // Corresponds to bg-white
    borderRadius: 8, // Corresponds to rounded-2xl (assuming 2xl is 8px or similar)
    borderWidth: 1, // Corresponds to border
    alignItems: 'center', // Corresponds to items-center
    flexDirection: 'row', // Corresponds to flex-row
    justifyContent: 'space-between', // Corresponds to justify-between
    borderColor: '#9CA3AF', // Corresponds to border-gray-400
    paddingHorizontal: 14, // Corresponds to p-3.5
    paddingVertical: 0, // Corresponds to pt-0 pb-0
    marginBottom: 16, // Added for space-y-4 equivalent
  },
  dateTimeInputText: {
    fontSize: 14, // Corresponds to text-[14px]
    color: '#374151', // Corresponds to text-gray-800
    // fontFamily: 'PublicSansBold', // Assuming this is a custom font
  },
  errorTextSmall: {
    color: 'red',
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 10, // Added for spacing below error messages
  },
  dropdownOuterContainer: {
    padding: 0,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#697CE3',
    marginBottom: 16, // Added for space-y-4 equivalent
  },
  dropdown: {
    height: 60,
    color: '#000',
    fontSize: 12,
    paddingHorizontal: 8,
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
  errorTextDropdown: {
    color: 'red',
    fontSize: 12,
    marginLeft: 6,
    marginBottom: 10, // Added for spacing below error messages
  },
  reasonInput: {
    width: '100%', // Corresponds to w-full
    borderRadius: 12, // Corresponds to rounded-3xl (assuming 3xl is 12px or similar)
    borderWidth: 1, // Corresponds to border
    borderColor: '#697CE3', // Corresponds to border-[#697CE3]
    paddingLeft: 20, // Corresponds to pl-5 (assuming 1 unit = 4px)
    // No specific height mentioned for multi-line, so numberOfLines handles it.
  },
  modalButtonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'flex-end',
    width: '100%',
    gap: 20,
    padding: 9,
  },
  cancelModalButton: {
    alignItems: 'center', // Corresponds to items-center
    justifyContent: 'center', // Corresponds to justify-center
    width: 80, // Corresponds to w-20
    height: 48, // Corresponds to h-12
    padding: 8, // Corresponds to p-2
    borderRadius: 8, // Corresponds to rounded-lg
    borderWidth: 1, // Corresponds to border
    borderColor: '#697CE3', // Corresponds to border-[#697CE3]
  },
  cancelModalButtonText: {
    fontSize: 12, // Corresponds to text-xs
    color: '#697CE3', // Corresponds to text-[#697CE3]
    // fontFamily: 'semibold-poppins', // Assuming this is a custom font
    fontWeight: '600', // Added for semibold
  },
  addModalButton: {
    alignItems: 'center', // Corresponds to items-center
    justifyContent: 'center', // Corresponds to justify-center
    height: 48, // Corresponds to h-12
    width: 80, // Corresponds to w-20
    padding: 8, // Corresponds to p-2
    borderRadius: 8, // Corresponds to rounded-lg
    backgroundColor: '#697CE3', // Corresponds to bg-[#697CE3]
  },
  addModalButtonText: {
    fontSize: 12, // Corresponds to text-xs
    color: 'white', // Corresponds to text-white
    // fontFamily: 'semibold-poppins', // Assuming this is a custom font
    fontWeight: '600', // Added for semibold
  },
});