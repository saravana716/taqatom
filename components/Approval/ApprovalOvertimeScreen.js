import { useEffect, useState } from 'react';
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
import isEmpty from 'lodash/isEmpty';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PUNCH_STATE_OPTIONS } from '../../components/PunchStateOptions';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import LeaveCard from '../../components/LeaveCard';
import OvertimeCard from '../../components/OverTimeCard';
import ProfileServices from '../../Services/API/ProfileServices';
import ApprovalOvertimeCard from '../../components/ApprovalCards/ApprovalOvertimeCard';
import moment from 'moment';
import { formatErrorsToToastMessages } from '../../utils/error-format';
import { useSelector } from 'react-redux';

export default function ApprovalOvertimeScreen({ navigation }) {
  const selectorid = useSelector((data) => data.empid);

  const [modalVisible, setModalVisible] = useState(false);
  const [punchTimeDate, setPunchTimeDate] = useState(false);
  const [formatExpectDate, setFormatExpectDate] = useState(null);
  const [workCode, setWorkCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [OvertimeData, setOvertimeData] = useState([]);

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

  const renderItem = (item) => (
    <View style={styles.item}>
      <Text style={styles.textItem}>{item.label}</Text>
    </View>
  );

  const handleNumberChange = (text) => {
    setWorkCode(text);
  };

  const handleAddOvertime = async () => {
    setIsLoading(false);
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

  const getOvertimeList = async () => {
    setIsLoading(true);
    try {
      const RecentActivities = await ProfileServices.getApprovalOvertimeData(selectorid);
      setOvertimeData(RecentActivities?.results);
    } catch (error) {
      formatErrorsToToastMessages(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOvertimeList();
  }, []);

  return (
    <View style={styles.main}>
      <View style={styles.innerWrapper}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Icon name="angle-left" size={30} color="#697ce3" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Overtime</Text>
        </View>

        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#697CE3" />
          </View>
        ) : isEmpty(OvertimeData) ? (
          <View style={styles.noData}>
            <Text style={styles.noDataText}>No overtime data available</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}>
            <View style={styles.cardWrapper}>
              {OvertimeData.map((newItem) => (
                <View style={styles.cardItem} key={newItem?.id}>
                  <ApprovalOvertimeCard
                    newItem={newItem}
                    employeeId={selectorid}
                    getOvertimeList={getOvertimeList}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        <Toast />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  innerWrapper: {
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 28,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
    paddingRight: '15%',
  },
  loader: {
    height: '88%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noData: {
    flex: 1,
    paddingTop: 160,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  scroll: {
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    height: '88%',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  cardWrapper: {
    paddingBottom: 40,
  },
  cardItem: {
    paddingBottom: 24,
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
