import DateTimePicker from '@react-native-community/datetimepicker';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
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
import { Dropdown } from 'react-native-element-dropdown';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import ManualLogCard from '../../components/ManualLogCard';
import { PUNCH_STATE_OPTIONS } from '../../components/PunchStateOption';
import ProfileServices from '../../Services/API/ProfileServices';
import { formatErrorsToToastMessages } from '../../utils/error-format';
import { dateTimeToShow, formatDateTime } from '../../utils/formatDateTime';
import { useSelector } from 'react-redux';

export default function ManualLogScreen({navigation}) {
  const selectorid=useSelector(function (data) {
    return data.empid
  })
   const selectordetils=useSelector(function (data) {
    return data.userDetails
  })
   const selectorempdetails=useSelector(function (data) {
    return data.employeeFullDetails
  })
  console.log("emopid",selectorid);
  console.log("emopidedails",selectorempdetails);
  console.log("emouserDetails",selectordetils);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [formatExpectDate, setFormatExpectDate] = useState(null);
  const [workCode, setWorkCode] = useState('');
  const [applyReason, setApplyReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [punchStateList, setPunchStateList] = useState('');
  const [manualLogData, setManualLogData] = useState([]);
  const [punchTimeError, setPunchTimeError] = useState('');
  const [pickerMode, setPickerMode] = useState(null);

  const handleBack = () => {
    navigation.navigate('RequestScreen');
  };

  const onDateChange = useCallback((event, selectedDate) => {
    if (event.type === 'set' && selectedDate) {
      const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
      setDate(selectedDate);
      setPickerMode('time');
    }
  }, []);

  const onTimeChange = useCallback(
    (event, selectedTime) => {
      if (event.type === 'set' && selectedTime) {
        const combinedDateTime = new Date(date);
        combinedDateTime.setHours(selectedTime.getHours());
        combinedDateTime.setMinutes(selectedTime.getMinutes());
        const formattedDateTime = moment(combinedDateTime).format('YYYY-MM-DDTHH:mm:ss');
        setFormatExpectDate(formattedDateTime);
        setPickerMode(null);
      }
    },
    [date]
  );

  const renderItem = item => (
    <View style={styles.item}>
      <Text style={styles.textItem}>{item.label}</Text>
    </View>
  );

  const handleNumberChange = text => setWorkCode(text);

  const handleAddManualLog = async () => {
    setPunchTimeError('');
    if (!formatExpectDate) {
      setPunchTimeError('Please select a Punch time');
      return;
    }
    setIsLoading(true);
    try {
      await ProfileServices.addManualLogRequest({
        employee: selectorid,
        punch_time: formatDateTime(formatExpectDate),
        punch_state: punchStateList,
        work_code: workCode,
        apply_reason: applyReason,
      });
      setIsLoading(false);
      setModalVisible(false);
      getManualLogList();
      Toast.show({type: 'success', text1: 'Added Successfully', position: 'bottom'});
      setFormatExpectDate();
      setPunchStateList();
      setWorkCode();
      setApplyReason();
    } catch (error) {
      setIsLoading(false);
      formatErrorsToToastMessages(error);
    }
  };

  const getManualLogList = async () => {
    setIsLoading(true);
    try {
      const response = await ProfileServices.getManualLogData(selectorid);
      setManualLogData(response?.results);
    } catch (error) {
      formatErrorsToToastMessages(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getManualLogList();
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'space-between',backgroundColor:"white"}}>
      <View style={{paddingBottom: 48}}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleBack}>
            <Icon name="angle-left" size={30} color="#697ce3" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manual Log</Text>
        </View>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#697CE3" />
          </View>
        ) : isEmpty(manualLogData) ? (
          <View style={{flex: 1}}>
            <Text style={styles.noDataText}>No manual log available</Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollContainer}>
            <View style={{paddingBottom: 40}}>
              {manualLogData.map(newItem => (
                <View style={{paddingBottom: 24}} key={newItem?.id}>
                  <ManualLogCard
                    newItem={newItem}
                    employeeId={selectorid}
                    manualLogList={getManualLogList}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        )}
        <Toast />
      </View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.floatingButton}>
        <Icon name="plus" size={24} color="#697ce3" />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        visible={modalVisible}
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add Manual Log</Text>
            <View style={styles.formContainer}>
              <TouchableOpacity onPress={() => setPickerMode('date')} style={styles.inputBox}>
                <Text style={styles.inputText}>{
                  formatExpectDate ? dateTimeToShow(formatExpectDate) : 'Select Punch Time'}
                </Text>
                <Icon name="calendar" size={24} color="#697ce3" />
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
              {punchTimeError && (
                <Text style={styles.errorText}>{punchTimeError}</Text>
              )}
              <View style={styles.dropdownWrapper}>
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
                  placeholder="Select State"
                  searchPlaceholder="Search..."
                  value={punchStateList}
                  onChange={item => setPunchStateList(item?.id)}
                  renderItem={renderItem}
                />
              </View>
              <TextInput
                placeholder="Work Code"
                value={workCode}
                onChangeText={handleNumberChange}
                style={styles.inputBox}
              />
              <TextInput
                placeholder="Reason"
                editable
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                onChangeText={setApplyReason}
                style={styles.textArea}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setFormatExpectDate();
                  setPunchStateList();
                  setWorkCode();
                  setApplyReason();
                }}
                style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleAddManualLog}
                style={styles.submitButton}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitText}>Add</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    flex: 1,
    marginRight: '15%',
  },
  loadingContainer: {
    height: '88%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 18,
    textAlign: 'center',
    paddingTop: 160,
  },
  scrollContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    height: '88%',
  },
  floatingButton: {
    position: 'absolute',
    right: 12,
    top: 16,
    height: 56,
    width: 56,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
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
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  formContainer: {
    paddingBottom: 8,
    paddingRight: 8,
    paddingLeft: 8,
    width: '100%',
    justifyContent: 'space-between',
    gap: 16,
  },
  inputBox: {
    height: 56,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownWrapper: {
    padding: 0,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#697CE3',
  },
  dropdown: {
    height: 50,
    paddingHorizontal: 8,
    fontSize: 12,
    color: '#000',
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
  textArea: {
    borderWidth: 1,
    borderColor: '#697CE3',
    borderRadius: 24,
    paddingLeft: 20,
    minHeight: 100,
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'flex-end',
    width: '100%',
    gap: 20,
    padding: 9,
  },
  cancelButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 48,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#697CE3',
  },
  cancelText: {
    fontSize: 12,
    color: '#697CE3',
    fontWeight: '600',
  },
  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 48,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#697CE3',
  },
  submitText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
});