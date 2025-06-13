import { useNavigation } from '@react-navigation/native';
import get from 'lodash/get';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProfileServices from '../Services/API/ProfileServices';
import { formatErrorsToToastMessages } from '../utils/error-format';
import { convertUtcToLocalTime, dateTimeToShow } from '../utils/formatDateTime';

export default function NotificationComponent({
  status,
  notify,
  mutate,
  componentId,
  employeeId,
  setProfilePicUrl,
  employeeFullDetails,
  userDetails,
  profilePicUrl,
  setUpdateKey,
  updateKey,
  setGender,
  gender,
  subordinateName,
  setSubordinateName,
  token,
}) {
  const [isRemoving, setIsRemoving] = useState(false);
  const navigation = useNavigation();

  const handleRemoveOne = async (notificationId) => {
    setIsRemoving(true);
    try {
      const options = {
        notification_ids: [notificationId],
      };
      await ProfileServices.markNotifyAsRead(options);
      mutate();
      Toast.show({
        type: 'success',
        text1: 'Marked as read',
        position: 'bottom',
      });
    } catch (error) {
      formatErrorsToToastMessages(error);
    } finally {
      setIsRemoving(false);
    }
  };

  const navigateBasedOnLink = (link) => {
    const paths = link?.split('/')?.filter(Boolean);
    if (paths?.includes('employeeApproval')) {
      if (paths?.includes('manualLog')) handleScreenPush('ApprovalManualLogScreen');
      else if (paths?.includes('leave')) handleScreenPush('ApprovalLeaveScreen');
      else if (paths?.includes('overtime')) handleScreenPush('ApprovalOvertimeScreen');
      else if (paths?.includes('training') || paths?.includes('resign')) handleScreenPush('ApprovalTrainingScreen');
    } else if (paths?.includes('request')) {
      if (paths?.includes('manualLog')) handleScreenPush('ManualLogScreen');
      else if (paths?.includes('leave')) handleScreenPush('LeaveScreen');
      else if (paths?.includes('overtime')) handleScreenPush('OvertimeScreen');
      else if (paths?.includes('training')) handleScreenPush('TrainingScreen');
    } else if (paths?.includes('orgStructure') && paths?.includes('employeeView')) {
      handleScreenPush('SettingsScreen');
    } else if (paths?.includes('employeeShift') && paths?.includes('details')) {
      handleScreenPush('ShiftScreen');
    } else if (paths?.includes('payroll') && paths?.includes('payslips')) {
      handleScreenPush('PaySlipScreen');
    } else {
      
    }
  };

  const handleScreenPush = (screenName) => {
    Navigation.push(componentId, {
      component: {
        name: screenName,
        passProps: {
          employeeId,
          userId: employeeId,
          setProfilePicUrl,
          employeeFullDetails,
          userDetails,
          profilePicUrl,
          setUpdateKey,
          updateKey,
          setGender,
          gender,
          subordinateName,
          setSubordinateName,
          token,
        },
        options: {
          animations: { push: { enabled: false }, pop: { enabled: false } },
          topBar: { visible: false },
          bottomTabs: { visible: false, drawBehind: true },
        },
      },
    });
  };

  return isRemoving ? (
    <ActivityIndicator size="small" color="#000" />
  ) : (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.textBlock}>
            <Text style={styles.sender}>{get(notify, 'system_sender')}</Text>
            <Text style={styles.message}>{get(notify, 'content')}</Text>
            <View style={styles.footerRow}>
              <View style={styles.timeBlock}>
                <Text style={styles.time}>
                  {dateTimeToShow(convertUtcToLocalTime(get(notify, 'notification_time')))}
                </Text>
              </View>
              {get(notify, 'link') && (
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => navigateBasedOnLink(get(notify, 'link'))}>
                  <Text style={styles.linkText}>
                    {get(notify, 'link') === '/attendance/employeeApproval/resign'
                      ? 'Check Web'
                      : 'Go to Screen'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleRemoveOne(get(notify, 'id'))}
          style={styles.removeButton}>
          <Icon name="close" size={16} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  card: {
    backgroundColor: '#F1F3F4',
    flexDirection: 'row',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textBlock: {
    flex: 1,
  },
  sender: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 12,
    color: '#919EAB',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  timeBlock: {
    width: 50,
  },
  time: {
    fontSize: 12,
  },
  linkButton: {
    width: 200,
  },
  linkText: {
    fontSize: 12,
    color: 'blue',
  },
  removeButton: {
    paddingBottom: 10,
  },
});
