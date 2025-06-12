import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import isEmpty from 'lodash/isEmpty';
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import moment from 'moment';

import ProfileServices from "../../Services/API/ProfileServices";
import ApprovalTrainingCard from "../../components/ApprovalCards/ApprovalTrainingCard";
import { formatErrorsToToastMessages } from "../../utils/error-format";
import { useSelector } from "react-redux";

export default function ApprovalTrainingScreen({ navigation }) {
  const selectorid = useSelector((data) => data.empid);

  const [punchTimeDate, setPunchTimeDate] = useState(false);
  const [formatExpectDate, setFormatExpectDate] = useState(null);
  const [workCode, setWorkCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [trainingData, setTrainingData] = useState([]);

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

  const handleNumberChange = text => {
    setWorkCode(text);
  };

  const getTrainingList = async () => {
    setIsLoading(true);
    try {
      const RecentActivities = await ProfileServices.getApprovalTrainingData(selectorid);
      setTrainingData(RecentActivities?.results);
    } catch (error) {
      formatErrorsToToastMessages(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTrainingList();
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="angle-left" size={30} color="#697ce3" />
          </TouchableOpacity>
          <Text style={styles.title}>Training</Text>
        </View>

        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#697CE3" />
          </View>
        ) : isEmpty(trainingData) ? (
          <View style={styles.noDataView}>
            <Text style={styles.noDataText}>No training available</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollView}
          >
            <View style={styles.listWrapper}>
              {trainingData.map(newItem => (
                <View key={newItem?.id} style={styles.cardWrapper}>
                  <ApprovalTrainingCard
                    newItem={newItem}
                    employeeId={selectorid}
                    getTrainingList={getTrainingList}
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
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    paddingBottom: 14,
    padding: 20,
    alignItems: 'center',
  },
  backButton: {
    paddingLeft: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
    paddingRight: '15%',
  },
  loader: {
    height: '88%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataView: {
    height: '90%',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 40,
  },
  scrollView: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  listWrapper: {
    paddingBottom: 40,
  },
  cardWrapper: {
    paddingBottom: 20,
  },
});
