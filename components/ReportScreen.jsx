import DateTimePicker from '@react-native-community/datetimepicker';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import ReportsCard from '../components/ReportsCard';
import ProfileServices from '../Services/API/ProfileServices';
import { formatErrorsToToastMessages } from '../utils/error-format';

export default function ReportScreen({ navigation }) {
      const selectorid= useSelector(function (data) {
        return data.empid
    })
    
    
    
  const [fromDateShow, setFromDateShow] = useState(false);
  const [endDateShow, setEndDateShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [reportsData, setReportsData] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [count, setCount] = useState(0);

  const totalPages = Math.ceil(count / pagination.pageSize);

  const handleBack = () => {
    navigation.navigate('Dashboard');
  };

  const convertToCustomFormat = dateString => {
    const date = new Date(dateString);
    return `${date.getUTCDate()}:${date.getUTCMonth() + 1}:${date.getUTCFullYear()}`;
  };

  const onChange = (event, selectedDate) => {
    const currentSelectDate = selectedDate || date;
    setFromDateShow(false);
    setDate(currentSelectDate);
  };

  const onChangeEnd = (event, selectedDate) => {
    const currentSelectDate = selectedDate || date;
    setEndDateShow(false);
    setEndDate(currentSelectDate);
  };

  const getReports = async () => {
    setIsLoading(true);
    try {
      const reports = await ProfileServices.getAllReports({
        id: Number(selectorid),
        start: moment(date).format('YYYY-MM-DD'),
        end: moment(endDate).format('YYYY-MM-DD'),
        page: pagination.pageIndex,
        size: pagination.pageSize,
      });
      
      
      setReportsData(get(reports, 'results'));
      setCount(get(reports, 'count'));
    } catch (error) {
      formatErrorsToToastMessages(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getReports();
  }, [date, endDate, pagination.pageIndex]);

  const handlePageChange = pageIndex => {
    setPagination(prev => ({ ...prev, pageIndex }));
  };

  const handleNextPage = () => {
    if (pagination.pageIndex < totalPages - 1) {
      setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.pageIndex > 0) {
      setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="angle-left" size={30} color="#697ce3" />
        </TouchableOpacity>
        <Text style={styles.title}>Reports</Text>
      </View>

      <View style={styles.datePickerSection}>
        <TouchableOpacity
          onPress={() => setFromDateShow(true)}
          style={styles.dateInput}>
          <Text style={styles.dateText}>{convertToCustomFormat(date)}</Text>
          <Icon name="calendar" size={24} color="#697CE3" />
        </TouchableOpacity>
        {fromDateShow && (
          <DateTimePicker
            value={date}
            mode="date"
            is24Hour={true}
            onChange={onChange}
            minimumDate={new Date()}
          />
        )}

        <TouchableOpacity
          onPress={() => setEndDateShow(true)}
          style={styles.dateInput}>
          <Text style={styles.dateText}>{convertToCustomFormat(endDate)}</Text>
          <Icon name="calendar" size={24} color="#697CE3" />
        </TouchableOpacity>
        {endDateShow && (
          <DateTimePicker
            value={endDate}
            mode="date"
            is24Hour={true}
            onChange={onChangeEnd}
            minimumDate={new Date()}
          />
        )}
      </View>

      <View style={styles.reportsContainer}>
        <View style={styles.reportsCardWrapper}>
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#697CE3" />
            </View>
          ) : isEmpty(reportsData) ? (
            <View style={styles.loaderContainer}>
              <Text>No reports available</Text>
            </View>
          ) : (
            <>
              <ScrollView showsVerticalScrollIndicator={false}>
                {map(reportsData, (value, key) => (
                  <View key={key} style={{ marginBottom: 10 }}>
                    <ReportsCard reportsData={value} />
                  </View>
                ))}
              </ScrollView>
              <View style={styles.pagination}>
                <TouchableOpacity
                  style={[
                    styles.pageButton,
                    pagination.pageIndex === 0 && styles.disabledButton,
                  ]}
                  onPress={handlePrevPage}
                  disabled={pagination.pageIndex === 0}
                >
                  <Text style={styles.pageButtonText}>Prev</Text>
                </TouchableOpacity>

                {[...Array(totalPages)].map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.pageNumber,
                      pagination.pageIndex === index && styles.activePage,
                    ]}
                    onPress={() => handlePageChange(index)}
                  >
                    <Text
                      style={[
                        styles.pageText,
                        pagination.pageIndex === index && styles.activeText,
                      ]}
                    >
                      {index + 1}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={[
                    styles.pageButton,
                    pagination.pageIndex === totalPages - 1 && styles.disabledButton,
                  ]}
                  onPress={handleNextPage}
                  disabled={pagination.pageIndex === totalPages - 1}
                >
                  <Text style={styles.pageButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F3F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 28,
    paddingLeft: 16,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginLeft: 36,
    fontWeight: 'bold',
    color: 'black',
  },
  datePickerSection: {
    paddingTop: 12,
    paddingHorizontal: 20,
    gap: 10,
  },
  dateInput: {
    height: 56,
    backgroundColor: 'white',
    borderRadius: 16,
    borderColor: '#697CE3',
    borderWidth: 1,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  reportsContainer: {
    padding: 8,
  },
  reportsCardWrapper: {
    width: '100%',
    height: '86%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
  },
  loaderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    alignItems: 'center',
  },
  pageButton: {
    marginHorizontal: 4,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#697CE3',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  pageButtonText: {
    color: 'white',
  },
  pageNumber: {
    marginHorizontal: 4,
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  activePage: {
    backgroundColor: '#697CE3',
  },
  pageText: {
    color: 'black',
  },
  activeText: {
    color: 'white',
  },
});
