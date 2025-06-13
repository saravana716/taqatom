import DateTimePicker from '@react-native-community/datetimepicker';
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
import { PieChart } from 'react-native-gifted-charts';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useSelector } from 'react-redux';
import LeaveCard from '../../components/LeaveCard';
import ProfileServices from '../../Services/API/ProfileServices';
import { formatErrorsToToastMessages } from '../../utils/error-format';
import { formatDateTime } from '../../utils/formatDateTime';

export default function LeaveScreen({navigation}) {
   const selectorid=useSelector(function (data) {
    return data.empid
  })
  const {t}=useTranslation()
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

  const [leaveData, setLeaveData] = useState([]);
  const [leavePayCodes, setLeavePayCodes] = useState([]);
  const handleBack = () => {
    navigation.navigate("RequestScreen")
  };
  const [endDateError, setendDateError] = useState('');
  const [payCodeError, setPayCodeError] = useState('');
  const [startError, setStartError] = useState('');
  const [endError, setEndError] = useState('');
  const [value, setValue] = useState('');
  const [name, setName] = useState('');
  const [leaveAllows, setLeaveAllows] = useState([]);

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
        <Text style={styles.textItem}>{item?.name}</Text>
      </View>
    );
  };
  const handleNumberChange = text => {
    setWorkCode(text);
  };

  const handleAddLeave = async () => {
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
      const datas={
        employee: selectorid,
        start_time: formatDateTime(startTime),
        end_time: formatDateTime(endTime),
        pay_code: payCode,
        apply_reason: applyReason,
      }
      const response = await ProfileServices.addLeaveRequest(datas);
      setIsLoading(false);
      setModalVisible(false);
      getLeaveList();
      setStartTime();
      setEndTime();
      setPayCode();
      setApplyReason();
      Toast.show({
        type: 'success',
        text1: 'Added Successfully',
        position: 'bottom',
      });
    } catch (error) {
      setIsLoading(false);
      
      formatErrorsToToastMessages(error)
    }
  };

  const getLeaveList = async () => {
    setIsLoading(true);
    try {
      const RecentActivities = await ProfileServices.getLeaveData(selectorid);
      setLeaveData(RecentActivities?.results);
    } catch (error) {
     formatErrorsToToastMessages(error)
    } finally {
      setIsLoading(false);
    }
  };
  const getPayCodeList = async () => {
    try {
      const paycodeIds = [3];
      const response = await ProfileServices.getPayCodeLists(paycodeIds);
      const {leave_paycodes} = response;
      setLeavePayCodes(leave_paycodes);
    } catch (err) {
      formatErrorsToToastMessages(err)
    }
  };
  useEffect(() => {
    getLeaveList();
  }, []);

  useEffect(() => {
    getPayCodeList();
  }, []);
  // const pieData = [
  //   {value: Number(10), color: '#11E17D', text: 'Sick Leave'},
  //   {value: Number(1), color: 'purple', text: 'Annual Leave'},

  // ];

  const pieData = leaveAllows
    .map(leave => ({
      value: Number(leave.allowed_leaves),
      color:
        leave.paycode_info.name === 'Annual Leave'
          ? '#00e6e6'
          : leave.paycode_info.name === 'Casual Leave'
          ? '#ff33ff'
          : leave.paycode_info.name === 'Sick Leave'
          ? '#e6e600'
          : leave.paycode_info.name === 'Maternity Leave'
          ? '#ff8533'
          : leave.paycode_info.name === 'Compassionate Leave'
          ? '#00e673'
          : leave.paycode_info.name === 'Business Trip'
          ? '#3399ff'
          : leave.paycode_info.name === 'Festival'
          ? '#10c37b'
          : 'gray',
      text: leave.paycode_info.name,
    }))
    .filter(item => item.value > 0);

  const handlePressChart = (value, text) => {
    setValue(value?.value);
    setName(value?.text);
  };

  const getLeaveAllowsList = async () => {
    try {
      const RecentActivities = await ProfileServices.getLeaveBalance(
        selectorid,
      );
      setLeaveAllows(RecentActivities);
    } catch (error) {
      formatErrorsToToastMessages(error)
    }
  };
  useEffect(() => {
    getLeaveAllowsList();
  }, []);
  return (
     <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="angle-left" size={30} color="#697ce3" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Leave</Text>
        </View>

        <View style={styles.centerContent}>
          {pieData && pieData.length > 0 ? (
            <>
              <View style={styles.chartContainer}>
                <PieChart
                  donut
                  radius={80}
                  innerRadius={55}
                  focusOnPress
                  textSize={16}
                  data={pieData}
                  showValuesAsLabels
                  onPress={(value, text) => handlePressChart(value, text)}
                  centerLabelComponent={() => (
                    <View style={styles.chartLabel}>
                      {value && <Text style={styles.chartValue}>{value}</Text>}
                      {name && <Text style={styles.chartName}>{name}</Text>}
                    </View>
                  )}
                />
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.legendContainer}>
                  {pieData.map((item, index) => {
                    if (index % 2 === 0) {
                      return (
                        <View key={index} style={styles.legendRow}>
                          <View style={styles.legendItem}>
                            <View
                              style={[styles.legendColor, { backgroundColor: item.color }]}
                            />
                            <Text style={styles.legendText}>{item?.text}</Text>
                          </View>

                          {pieData[index + 1] && (
                            <View style={styles.legendItem}>
                              <View
                                style={[
                                  styles.legendColor,
                                  { backgroundColor: pieData[index + 1].color },
                                ]}
                              />
                              <Text style={styles.legendText}>
                                {pieData[index + 1].text}
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    }
                    return null;
                  })}
                </View>
              </ScrollView>
            </>
          ) : (
            <View style={styles.noData}>
              <Text>No Leave Balance Found</Text>
            </View>
          )}
        </View>

        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#697CE3" />
          </View>
        ) : !leaveData?.length ? (
          <View style={styles.noLeave}>
            <Text style={styles.noLeaveText}>No Leave Found</Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollArea}>
            <View style={styles.leaveList}>
              {leaveData.map((newItem) => (
                <View style={styles.leaveItem} key={newItem?.id}>
                  <LeaveCard
                    newItem={newItem}
                    employeeId={selectorid}
                    leaveList={getLeaveList}
                    leavePayCodes={leavePayCodes}
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
        style={styles.addButton}>
        <Icon name="calendar" size={24} color="#919EABD9" />
      </TouchableOpacity>

      <Modal
        animationType={'fade'}
        visible={modalVisible}
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Leave</Text>
            <View style={styles.modalForm}>
              <TouchableOpacity onPress={() => setStartDatePicker(true)} style={styles.dateButton}>
                <Text style={styles.dateText}>
                  {startTime || 'Select Start Date'}
                </Text>
                <Icon name="calendar" size={24} color="#919EABD9" />
              </TouchableOpacity>
              {startError ? <Text style={styles.errorText}>{startError}</Text> : null}
              {startDatePicker && (
                <DateTimePicker value={startDate} mode="date" is24Hour onChange={onStartDateChange} />
              )}
              {startTimePicker && (
                <DateTimePicker value={timeStart} mode="time" is24Hour={false} onChange={onStartTimeChange} />
              )}

              <TouchableOpacity onPress={() => setEndDatePicker(true)} style={styles.dateButton}>
                <Text style={styles.dateText}>
                  {endTime || 'Select End Date'}
                </Text>
                <Icon name="calendar" size={24} color="#919EABD9" />
              </TouchableOpacity>
              {endError ? <Text style={styles.errorText}>{endError}</Text> : null}
              {endDateError ? <Text style={styles.errorText}>{endDateError}</Text> : null}
              {endDatePicker && (
                <DateTimePicker value={endDate} mode="date" is24Hour onChange={onEndDateChange} />
              )}
              {endTimePicker && (
                <DateTimePicker value={timeEnd} mode="time" is24Hour={false} onChange={onEndTimeChange} />
              )}

              <View style={styles.dropdownContainer}>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={leavePayCodes}
                  search
                  maxHeight={300}
                  labelField="name"
                  valueField="id"
                  placeholder="Select Pay Code"
                  searchPlaceholder="Search..."
                  value={payCode}
                  onChange={item => setPayCode(item?.id)}
                  renderItem={renderItem}
                />
              </View>
              {payCodeError ? <Text style={styles.errorText}>{payCodeError}</Text> : null}
              <TextInput
                style={styles.textInput}
                placeholder="Reason"
                editable
                multiline
                textAlignVertical="top"
                onChangeText={setApplyReason}
                numberOfLines={8}
              />
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleAddLeave}
                style={styles.submitBtn}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#fff" />
                ) : (
                  <Text style={styles.submitText}>Add</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Toast />
      </Modal>
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
    padding: 3.5,
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
   container: { flex: 1, justifyContent: 'space-between' ,backgroundColor:"white"},
  innerContainer: { paddingBottom: 48 },
  header: {
    flexDirection: 'row',
    paddingBottom: 28,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backButton: { paddingLeft: 4 },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    flex: 1,
    paddingRight: '15%',
  },
  centerContent: { alignItems: 'center' },
  chartContainer: { alignItems: 'center' },
  chartLabel: { justifyContent: 'center', alignItems: 'center' },
  chartValue: { fontSize: 14, color: 'black', fontWeight: 'bold' },
  chartName: { fontSize: 8, color: 'black' },
  legendContainer: { margin: 20 },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    maxWidth: '70%',
    gap: 40,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendColor: { height: 13, width: 13, borderRadius: 5, marginRight: 5 },
  legendText: { fontSize: 12, color: '#000' },
  noData: { justifyContent: 'center', alignItems: 'center' },
  loader: { width: '100%', height: '88%', justifyContent: 'center', alignItems: 'center' },
  noLeave: { height: '100%', paddingTop: 160 },
  noLeaveText: { fontSize: 20, textAlign: 'center', fontWeight: '700' },
  scrollArea: { paddingTop: 20, padding: 20, height: '58%' },
  leaveList: { paddingBottom: 40 },
  leaveItem: { paddingBottom: 24 },
  addButton: {
    position: 'absolute',
    right: 12,
    top: 16,
    height: 56,
    width: 56,
    backgroundColor: 'white',
    borderRadius: 12,
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
  modalContainer: {
    backgroundColor: 'white',
    marginVertical: 60,
    borderRadius: 7,
    width: '90%',
    padding: 20,
    elevation: 10,
  },
  modalTitle: { fontSize: 16, marginBottom: 12, fontWeight: '600', marginTop: 8 },
  modalForm: { padding: 8, width: '100%', gap: 16 },
  dateButton: {
    height: 56,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: { fontSize: 14, color: '#333' },
  dropdownContainer: {},
  dropdown: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 10 },
  placeholderStyle: { color: '#999' },
  selectedTextStyle: { color: '#000' },
  inputSearchStyle: { height: 40 },
  iconStyle: {},
  errorText: { color: 'red', fontSize: 12, marginLeft: 10 },
  textInput: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#697CE3',
    paddingLeft: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    width: 80,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#697CE3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: { fontSize: 12, color: '#697CE3', fontWeight: '600' },
  submitBtn: {
    width: 80,
    height: 48,
    backgroundColor: '#697CE3',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: { fontSize: 12, color: '#fff', fontWeight: '600' },
});
