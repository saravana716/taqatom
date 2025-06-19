// Converted from Tailwind CSS to standard StyleSheet
// Removed all `t()` i18n translation calls and used string fallback

import tokens from '@/locales/tokens';
import chunk from 'lodash/chunk';
import isEmpty from 'lodash/isEmpty';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector } from 'react-redux';
import PaySlipComponent from '../components/PaySlipComponent';
import ProfileServices from '../Services/API/ProfileServices';
const renderDot = color => (
  <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: color, marginRight: 10 }} />
);

export default function PaySlipScreen({ navigation }) {
    const {t,i18n}=useTranslation()
    const isRTL = i18n.language === 'ar';
    
  const employeeFullDetails = useSelector(data => data.employeeFullDetails);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [value, setValue] = useState('');
  const [payrollCheck, setPayrollCheck] = useState(null);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.ceil(totalCount / pagination.pageSize);

  const handleBack = () => navigation.navigate("Dashboard");

  const getPayrollHistory = async () => {
    // setIsLoading(true);
    try {
      const response = await ProfileServices.getPayrollHistory(employeeFullDetails.id);
      setPayrollHistory(response?.results);
      setTotalCount(response?.count);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };


  const getUserPayroll = async () => {
    setIsLoading(true);
    try {
      const response = await ProfileServices.getSalaryStructure('earning', employeeFullDetails?.id);
      setPayrollData(response);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPayrollCheck(employeeFullDetails?.payroll);
    getPayrollHistory();
    getUserPayroll();
  }, []);

  const getColor = index => {
    const colors = ['#F8961E', '#11E17D', '#ED6CC1', '#2D9CDB', '#6CCEED', '#FF6B6B', '#8e6ad6', '#2979e2', '#234570', '#74a44c'];
    return colors[index % colors.length];
  };

  const pieData = payrollData?.map((data, index) => ({
    value: parseFloat(data?.amount_or_percentage),
    color: getColor(index),
    text: data?.component_data?.name_in_payslip || data?.component_data?.name,
  }));

  const totalValue = pieData.reduce((sum, item) => sum + item.value, 0);

  const handlePressChart = (val, txt) => {
    setValue(val?.value);
    setName(val.text);
  };

  const handlePageChange = pageIndex => setPagination(prev => ({ ...prev, pageIndex }));

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
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="angle-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {t(tokens.nav.paySlip)}

        </Text>
      </View>

      <View style={styles.contentWrapper}>
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>
              {t(tokens.nav.employeeSalary)}

          </Text>
          <View style={styles.chartContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#697CE3" />
            ) : payrollData.length ? (
              <PieChart
                donut
                radius={100}
                innerRadius={55}
                focusOnPress
                textSize={16}
                data={pieData}
                onPress={handlePressChart}
                centerLabelComponent={() => (
                  <View style={styles.centerLabel}>
                    <Text style={styles.centerValue}>{value || totalValue}</Text>
                    <Text style={styles.centerText}>
                          {t(tokens.actions.total)}

                    </Text>
                  </View>
                )}
              />
            ) : (
              <PieChart
                donut
                radius={100}
                innerRadius={60}
                data={[{ value: 1, color: '#D9D9D9', text: 'Deductions' }]}
                centerLabelComponent={() => (
                  <View style={styles.centerLabel}>
                    <Text style={styles.centerValue}>
                          {t(tokens.messages.noPayrolls)}

                    </Text>
                  </View>
                )}
              />
            )}
          </View>

          {payrollCheck && (
            <View>
              {chunk(payrollData, 3).map((row, rowIndex) => (
                <View style={styles.row} key={rowIndex}>
                  {row.map((data, index) => (
                    <View style={styles.legendItem} key={index}>
                      <View style={[styles.colorDot, { backgroundColor: getColor(index + rowIndex * 3) }]} />
                      <View>
                        <Text style={styles.legendAmount}>{data?.amount_or_percentage}</Text>
                        <Text style={styles.legendLabel}>{data?.component_data?.name_in_payslip || data?.component_data?.name}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>

        <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t(tokens.actions.payrollHistory)}

        </Text>

        <ScrollView style={styles.scrollArea}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#697CE3" />
          ) : isEmpty(payrollHistory) ? (
            <Text>{t(tokens.messages.noHistory)}</Text>
          ) : (
            payrollHistory?.map(newItem => (
              <View key={newItem.id} style={styles.historyItem}>
                <PaySlipComponent
                  newItem={newItem}
                  employeeFullDetails={employeeFullDetails}
                  payrollData={payrollData}
                />
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.paginationWrapper}>
          <TouchableOpacity
            style={[styles.paginationButton, pagination.pageIndex === 0 && styles.disabled]}
            onPress={handlePrevPage}
            disabled={pagination.pageIndex === 0}>
            <Icon name="angle-left" size={30}  color={pagination.pageIndex === 0 ? '#B0B0B0' : '#fff'} />
          </TouchableOpacity>

          {[...Array(totalPages)].map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.paginationNumber, pagination.pageIndex === index && styles.activePage]}
              onPress={() => handlePageChange(index)}>
              <Text style={pagination.pageIndex === index ? styles.activeText : styles.inactiveText}>{index + 1}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.paginationButton, pagination.pageIndex === totalPages - 1 && styles.disabled]}
            onPress={handleNextPage}
            disabled={pagination.pageIndex === totalPages - 1}>
            <Icon name="angle-right" size={30}   color={
                      pagination.pageIndex === totalPages - 1
                        ? '#B0B0B0'
                        : '#fff'
                    } />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F3F4' },
  headerRow: { flexDirection: 'row', padding: 20, alignItems: 'center' },
  backButton: { position: 'absolute', left: 15, zIndex: 10 },
  title: { fontSize: 20, textAlign: 'center', flex: 1, fontWeight: 'bold', color: 'black' },
  contentWrapper: { padding: 20 },
  chartCard: { backgroundColor: 'white', padding: 15, borderRadius: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: 'black', paddingVertical: 10 },
  chartContainer: { alignItems: 'center', justifyContent: 'center', height: 300 },
  centerLabel: { justifyContent: 'center', alignItems: 'center' },
  centerValue: { fontSize: 14, fontWeight: 'bold', color: 'black' },
  centerText: { fontSize: 8, color: 'black' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  colorDot: { height: 20, width: 20, borderRadius: 10 },
  legendAmount: { fontSize: 12, fontWeight: 'bold', color: 'black' },
  legendLabel: { fontSize: 8, color: 'gray' },
  scrollArea: { maxHeight: 300, marginTop: 10 },
  historyItem: { paddingBottom: 10 },
  paginationWrapper: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  paginationButton: { padding: 10, borderRadius: 10, backgroundColor: '#697CE3', marginHorizontal: 5 },
  disabled: { backgroundColor: 'gray' },
  paginationNumber: { padding: 10, borderRadius: 10, backgroundColor: 'lightgray', marginHorizontal: 3 },
  activePage: { backgroundColor: '#697CE3' },
  activeText: { color: 'white' },
  inactiveText: { color: 'black' },
});