import moment from 'moment';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSelector } from 'react-redux';
import { convertUtcToLocalTime } from '../utils/formatDateTime';

export default function ApprovedExpenseScreen({ navigation }) {
  const expenseData = useSelector((data) => data.expenseData);

  const handleBack = () => {
    navigation.navigate("Dashboard");
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F1F3F4' }}>
      <View>
        <Image
          source={require('../assets/images/Assets/blue-bg.png')}
          style={{
            width: '100%',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24
          }}
        />
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="angle-left" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Expense and Reimbursement</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={styles.statusContainer}>
            {expenseData?.Status === 'Approved' && (
              <Icon name="check" size={30} color="#66A079" />
            )}
            {expenseData?.Status === 'Pending' && (
              <View style={[styles.iconBox, { borderColor: statusColor(expenseData?.Status) }]}>
                <Icon name="pause" size={20} color={statusColor(expenseData?.Status)} />
              </View>
            )}
            <Text style={[styles.statusText, { color: statusColor(expenseData?.Status) }]}>
              {expenseData?.Status}
            </Text>
            <Text style={styles.subText}>Reimbursement</Text>
            <Text style={styles.sectionTitle}>Expense details</Text>
          </View>

          <View style={{ gap: 20 }}>
            {renderRow('Expense Type', expenseData?.Expense_Category)}
            {renderRow('Status', expenseData?.Status, statusColor(expenseData?.Status))}
            {renderRow('Time', moment(convertUtcToLocalTime(expenseData?.created_at)).format('LT'))}
            {renderRow('Date', expenseData?.Expense_Date)}
            {renderRow('Description', expenseData?.Description, '#000', '60%')}
            <View style={styles.totalRow}>
              <Text style={styles.label}>Total Bill Amount</Text>
              <Text style={styles.value}>{expenseData?.Amount} SAR</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function renderRow(label, value, valueColor = '#000', valueWidth = 'auto') {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: valueColor, width: valueWidth, textAlign: 'right' }]}>{value}</Text>
    </View>
  );
}

function statusColor(status) {
  switch (status) {
    case 'Approved':
    case 'Paid':
      return '#66A079';
    case 'Pending':
      return '#FFA500';
    case 'Rejected':
      return '#EF4444';
    default:
      return '#000';
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 28,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 20,
    paddingLeft: 32,
    fontFamily: 'PublicSans-Bold',
    color: '#fff'
  },
  scrollContainer: {
    position: 'absolute',
    top: 64,
    width: '100%',
    padding: 20
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  iconBox: {
    borderRadius: 25,
    width: 50,
    height: 50,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  statusText: {
    fontSize: 18,
    fontFamily: 'PublicSans-Bold',
    textAlign: 'center'
  },
  subText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PublicSans-Bold',
    color: '#000',
    marginTop: 12
  },
  label: {
    fontSize: 14,
    fontFamily: 'PublicSans-Bold',
    color: '#9CA3AF'
  },
  value: {
    fontSize: 14,
    fontFamily: 'PublicSans-Bold',
    color: '#000'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#DDDDDD'
  }
});
