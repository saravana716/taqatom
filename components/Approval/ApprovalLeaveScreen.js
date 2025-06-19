import DateTimePicker from '@react-native-community/datetimepicker';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { useEffect, useState } from 'react';
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
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import ApprovalLeaveCard from '../../components/ApprovalCards/ApprovalLeaveCard';
import tokens from '../../locales/tokens';
import ProfileServices from '../../Services/API/ProfileServices';
import { formatErrorsToToastMessages } from '../../utils/error-format';
export default function ApprovalLeaveScreen({ navigation }) {
  const selectorid = useSelector((data) => data.empid);

  const [modalVisible, setModalVisible] = useState(false);
  const [punchTimeDate, setPunchTimeDate] = useState(false);
  const [formatExpectDate, setFormatExpectDate] = useState(null);
  const [workCode, setWorkCode] = useState('');
  const [applyReason, setApplyReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [LeaveData, setLeaveData] = useState([]);
   const {t,i18n}=useTranslation()
    const isRTL = i18n.language === 'ar';
    
  const handleBack = () => {
    navigation.navigate('ApprovalScreen');
  };

  const onDateChange = (event, selectedDate) => {
    const currentSelectDate = selectedDate || date;
    const formattedDate = moment(currentSelectDate).format('DD MMMM YYYY');
    setPunchTimeDate(false);
    setShowTimePicker(true);
    setDate(currentSelectDate);
    setFormatExpectDate(formattedDate);
  };

  const onTimeChange = (event, selectedTime) => {
    if (event.type === 'set') {
      const currentTime = selectedTime || time;
      setShowTimePicker(false);
      setTime(currentTime);
      const combinedDateTime = new Date(date);
      combinedDateTime.setHours(currentTime.getHours());
      combinedDateTime.setMinutes(currentTime.getMinutes());
      const formattedDate = moment(combinedDateTime).format('DD MMMM YYYY, hh:mm A');
      setFormatExpectDate(formattedDate);
    } else {
      setShowTimePicker(false);
    }
  };

  const handleNumberChange = (text) => {
    setWorkCode(text);
  };

  const handleAddLeave = async () => {
    setIsLoading(true);
    try {
      const punchTime = moment(formatExpectDate).format('YYYY-MM-DDTHH:mm:ss');
      setIsLoading(false);
      setModalVisible(false);
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

  const getLeaveList = async () => {
    setIsLoading(true);
    try {
      const RecentActivities = await ProfileServices.getApprovalLeaveData(selectorid);
      setLeaveData(RecentActivities?.results);
    } catch (error) {
      formatErrorsToToastMessages(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLeaveList();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <TouchableOpacity onPress={handleBack} style={{ paddingRight: 12 }}>
            <Icon name="angle-left" size={30} color="#697ce3" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, flex: 1, textAlign: 'center', color: 'black', fontWeight: 'bold' }}>
                      {t(tokens.nav.leave)}

          </Text>
        </View>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#697CE3" />
        </View>
      ) : isEmpty(LeaveData) ? (
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, textAlign: 'center', paddingTop: 160 }}>
                         {t(tokens.messages.noLeave)}

          </Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1, backgroundColor: 'white' }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10 }}
          showsVerticalScrollIndicator={false}
        >
          {LeaveData.map((newItem) => (
            <View style={{ paddingBottom: 24 }} key={newItem?.id}>
              <ApprovalLeaveCard
                newItem={newItem}
                employeeId={selectorid}
                getLeaveList={getLeaveList}
              />
            </View>
          ))}
        </ScrollView>
      )}

      {/* Modal */}
      <Modal
        animationType="fade"
        visible={modalVisible}
        transparent
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Leave</Text>
            <View style={styles.formContainer}>
              <TouchableOpacity
                onPress={() => setPunchTimeDate(true)}
                style={styles.datePickerButton}
              >
                <Text style={styles.datePickerText}>
                  {formatExpectDate ? formatExpectDate : 'Start Date'}
                </Text>
                <Icon name="calendar-check-o" size={23} color="#919EABD9" />
              </TouchableOpacity>

              {punchTimeDate && (
                <DateTimePicker
                  value={date || new Date()}
                  mode="date"
                  is24Hour={true}
                  onChange={onDateChange}
                  minDate={new Date()}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  is24Hour={true}
                  onChange={onTimeChange}
                />
              )}

              <TouchableOpacity
                onPress={() => setPunchTimeDate(true)}
                style={styles.datePickerButton}
              >
                <Text style={styles.datePickerText}>
                  {formatExpectDate ? formatExpectDate : 'End Date'}
                </Text>
                <Icon name="calendar-check-o" size={23} color="#919EABD9" />
              </TouchableOpacity>

              <TextInput
                placeholder="Paycode"
                value={workCode}
                onChangeText={handleNumberChange}
                style={styles.inputBox}
              />
              <TextInput
                placeholder="Apply Reason"
                editable
                multiline
                textAlignVertical="top"
                onChangeText={setApplyReason}
                numberOfLines={8}
                style={styles.reasonBox}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleAddLeave}
                style={styles.addButton}
              >
                {isLoading ? (
                  <ActivityIndicator size="large" color="#697CE3" />
                ) : (
                  <Text style={styles.addButtonText}>Add</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  formContainer: {
    gap: 16,
    width: '100%',
  },
  datePickerButton: {
    height: 56,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  datePickerText: {
    fontSize: 14,
    color: '#1f2937',
  },
  inputBox: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#697CE3',
    paddingHorizontal: 16,
  },
  reasonBox: {
    height: 150,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#697CE3',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
    gap: 16,
  },
  cancelButton: {
    width: 80,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#697CE3',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#697CE3',
    fontWeight: 'bold',
  },
  addButton: {
    width: 80,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#697CE3',
  },
  addButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
});
