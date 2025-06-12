/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { Iconify } from 'react-native-iconify';
import { Navigation } from 'react-native-navigation';
import LeaveComponent from '../../Components/Component/LeaveComponent';
import ProfileServices from '../../Services/API/ProfileServices';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { PieChart } from 'react-native-gifted-charts';
import { formatErrorsToToastMessages } from '../../utils/error-format';

export default function AllLeaveScreen({ componentId, userId }) {
  const [activeHead, setActiveHead] = useState(1);
  const [status, setStatus] = useState('Rejected');
  const [leaveData, setLeaveData] = useState([]);
  const [value, setValue] = useState('');
  const [name, setName] = useState('');

  const handlePress = (field) => {
    setActiveHead(field);
    if (field === 1) {
      setStatus('Rejected');
    } else if (field === 2) {
      setStatus('Approved');
    } else if (field === 3) {
      setStatus('Pending');
    } else if (field === 4) {
      setStatus('Cancelled');
    }
  };

  const handleBack = () => {
    Navigation.pop(componentId);
  };

  const handleApplyLeave = () => {
    Navigation.push(componentId, {
      component: {
        name: 'ApplyLeave',
        options: {
          animations: {
            push: { enabled: false },
            pop: { enabled: false },
          },
          topBar: { visible: false },
        },
      },
    });
  };

  const pieData = leaveData
    .map((leave) => ({
      value: Number(leave.allowed_leaves),
      color:
        leave.paycode_info.name === 'Annual Leave'
          ? 'purple'
          : leave.paycode_info.name === 'Sick Leave'
          ? '#DDA0DD'
          : 'gray',
      text: leave.paycode_info.name,
    }))
    .filter((item) => item.value > 0);

  const handlePressChart = (value, text) => {
    setValue(value?.value);
    setName(value?.text);
    console.log('Pressed:', text, 'with value:', value);
  };

  const getLeaveList = async () => {
    try {
      const RecentActivities = await ProfileServices.getLeaveBalance(userId);
      setLeaveData(RecentActivities);
    } catch (error) {
      formatErrorsToToastMessages(error);
    }
  };

  useEffect(() => {
    getLeaveList();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.centered}>
          <Iconify icon="mingcute:left-line" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>All Leaves</Text>
        <View style={styles.rightSide}></View>
      </View>

      <View style={styles.contentWrapper}>
        <View style={styles.pieCard}>
          <View>
            <Text style={styles.pieTitle}>Leave Balance</Text>
          </View>
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
              centerLabelComponent={() => {
                return (
                  <View style={styles.centerLabel}>
                    {value && (
                      <Text style={styles.centerValueText}>{value}</Text>
                    )}
                    {name && (
                      <Text style={styles.centerLabelText}>{name}</Text>
                    )}
                  </View>
                );
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'PublicSans-Bold',
    textAlign: 'center',
    color: '#000',
  },
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentWrapper: {
    paddingTop: 40,
    gap: 16,
  },
  pieCard: {
    borderWidth: 1,
    borderColor: '#1400FF',
    backgroundColor: '#F8F7FF',
    borderRadius: 16,
    padding: 12,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pieTitle: {
    fontSize: 18,
    fontFamily: 'PublicSans-Bold',
    color: '#000',
  },
  chartContainer: {
    alignItems: 'center',
  },
  centerLabel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerValueText: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
  },
  centerLabelText: {
    fontSize: 8,
    color: 'black',
  },
});
