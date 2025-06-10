import moment from 'moment';
import React from 'react';
import { FontAwesome } from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";

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

export default function ApprovedExpenseScreen({navigation}) {
    const expenseData=useSelector(function (data) {
        return data.expenseData
    })
    
    const Icon = Ionicons;
console.log("myexpesne data",expenseData);

  const handleBack = () => {
    navigation.navigate("Dashboard")
  };

  const handleDashboard = () => {
    Navigation.setRoot({
      root: {
        stack: {
          children: [
            {
              component: {
                name: 'Dashboard',
                options: {
                  animations: {
                    push: { enabled: false },
                    pop: { enabled: false },
                  },
                  topBar: { visible: false },
                },
              },
            },
          ],
        },
        bottomTabs: {
          id: 'BOTTOM_TABS_LAYOUT',
          children: [
            {
              stack: {
                id: 'HOME_TAB',
                children: [
                  {
                    component: {
                      id: 'HOME_SCREEN',
                      name: 'Dashboard',
                    },
                  },
                ],
                options: {
                  topBar: { visible: false },
                  bottomTab: {
                    icon: require('../assets/images/Assets/home-black.png'),
                    selectedIcon: require('../assets/images/Assets/home-blue.png'),
                  },
                },
              },
            },
            {
              stack: {
                id: 'BENEFITS_TAB',
                children: [
                  {
                    component: {
                      id: 'BENEFITS_SCREEN',
                      name: 'BenefitsScreen',
                    },
                  },
                ],
                options: {
                  topBar: { visible: false },
                  bottomTab: {
                    icon: require('../assets/images/Assets/home-black.png'),
                    selectedIcon: require('../assets/images/Assets/crown-blue.png'),
                  },
                },
              },
            },
            {
              stack: {
                id: 'PROFILE_TAB',
                children: [
                  {
                    component: {
                      id: 'PROFILE_SCREEN',
                      name: 'EditProfile',
                    },
                  },
                ],
                options: {
                  topBar: { visible: false },
                  bottomTab: {
                    icon: require('../assets/images/Assets/profile-black.png'),
                    selectedIcon: require('../assets/images/Assets/profile-blue.png'),
                  },
                },
              },
            },
            {
              stack: {
                id: 'SETTING_TAB',
                children: [
                  {
                    component: {
                      id: 'SETTING_SCREEN',
                      name: 'SettingsScreen',
                    },
                  },
                ],
                options: {
                  topBar: { visible: false },
                  bottomTab: {
                    icon: require('../assets/images/Assets/hamburger-black.png'),
                    selectedIcon: require('../assets/images/Assets/hamburger-blue.png'),
                  },
                },
              },
            },
          ],
        },
      },
    });
  };
console.log("expensedata",expenseData);

  return (
    <View style={{ flex: 1, backgroundColor: '#F1F3F4' }}>
      <View>
        <Image
          source={require('../assets/images/Assets/blue-bg.png')}
          style={{ width: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
        />
        <View style={{ position: 'absolute', top: 28, left: 16, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={handleBack} style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Icon name="angle-left" size={30} color="white" />
                         </TouchableOpacity>
          <Text style={{ fontSize: 20, paddingLeft: 32, fontFamily: 'PublicSans-Bold', color: '#fff' }}>
            Expense and Reimbursement
          </Text>
        </View>
      </View>

      <ScrollView style={{ position: 'absolute', top: 64, width: '100%', padding: 20 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20 }}>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
        {expenseData?.Status === 'Approved' && (
 <Ionicons name="checkmark-circle" size={30} color="green" />
)}

{expenseData?.Status === 'Pending' && (
  <FontAwesome name="pause" size={30} color="orange" />
)}
            <Text style={{ fontSize: 18, fontFamily: 'PublicSans-Bold', color: statusColor(expenseData?.Status), textAlign: 'center' }}>
              {expenseData?.Status}
            </Text>
            <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>Reimbursement</Text>
            <Text style={{ fontSize: 18, fontFamily: 'PublicSans-Bold', color: '#000', marginTop: 12 }}>Expense details</Text>
          </View>

          <View style={{ gap: 20 }}>
            {renderRow('Expense Type', expenseData?.Expense_Category)}
            {renderRow('Status', expenseData?.Status, statusColor(expenseData?.Status))}
            {renderRow('Time', moment(convertUtcToLocalTime(expenseData?.created_at)).format('LT'))}
            {renderRow('Date', expenseData?.Expense_Date)}
            {renderRow('Description', expenseData?.Description, '#000', '60%')}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16, borderTopWidth: 2, borderTopColor: '#DDDDDD' }}>
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
  label: {
    fontSize: 14,
    fontFamily: 'PublicSans-Bold',
    color: '#9CA3AF',
  },
  value: {
    fontSize: 14,
    fontFamily: 'PublicSans-Bold',
    color: '#000',
  },
});