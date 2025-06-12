import moment from 'moment';
import React, {useState} from 'react';
import {ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {dateTimeToShow} from '../../utils/formatDateTime';
import {getPunchStateLabel} from '../../utils/getPunchStateLabel';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from 'react-native-popup-menu';
import {Iconify} from 'react-native-iconify';
import ProfileServices from '../../Services/API/ProfileServices';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useTranslation } from 'react-i18next';
import tokens from '../../locales/tokens';
import { formatErrorsToToastMessages } from '../../utils/error-format';

export default function ApprovalManualCard({newItem, employeeId, componentId, getManualLogList}) {
  const navigation=useNavigation()
const {t}=useTranslation()
  const [approveConfirmVisible, setApproveConfirmVisible] = useState(false);
  const [rejectedConfirmVisible, setRejectedConfirmVisible] = useState(false);
  const handleFulldetails = () => {
    Navigation.push(componentId, {
      component: {
        name: 'ApprovalManualLogDetails',
        passProps: {
          employeeId,
          newItem,
          getManualLogList
        },
        options: {
          animations: {
            push: {
              enabled: false,
            },
            pop: {
              enabled: false,
            },
          },
          topBar: {
            visible: false,
          },
          bottomTabs: {
            visible: false,
            drawBehind: true,
          },
        },
      },
    });
  };

  

  const handleApprove = async () => {
    try {
      const response = await ProfileServices.postManualLogApprove(newItem?.id);
      Toast.show({
        type: 'success',
        text1: 'Approve Success',
        position: 'bottom',
      });
      console.log('responseee', response);
      getManualLogList();
      setApproveConfirmVisible(false);
    } catch (error) {
      console.log(error?.errorResponse, 'err');
    formatErrorsToToastMessages(error)
      setApproveConfirmVisible(false);
    }
  };

  const handleRejected = async () => {
    try {
      const response = await ProfileServices.postManualLogReject(newItem?.id);
      Toast.show({
        type: 'success',
        text1: 'Reject Success',
        position: 'bottom',
      });
      console.log('responseee', response);
      getManualLogList();
      setRejectedConfirmVisible(false);
    } catch (error) {
      console.log(error?.errorResponse, 'err');
     formatErrorsToToastMessages(error)
      setRejectedConfirmVisible(false);
    }
  };
  return (
    <>
      <View
        className="flex-row p-1 bg-white items-center justify-between rounded-xl border-b-4 border-b-[#697CE3] "
        style={styles.cardContainer}>
        <TouchableOpacity
          onPress={handleFulldetails}
          className=" w-full"
          activeOpacity={1}>
          <View className="h-38 w-full p-4 rounded-2xl">
            <View className="flex-row justify-between pb-4 items-center">
              <View>
                {newItem?.approval_status === 3 && (
                  <Text className="text-xs border p-1 pl-2 pr-2 bg-[#E4030308] rounded-lg border-[#E40303] text-[#E40303] font-PublicSansBold">
                    {t(tokens.actions.reject)}
                  </Text>
                )}
                {newItem?.approval_status === 2 && (
                  <Text className="text-xs border p-1 pl-2 pr-2 bg-[#08CA0F08] rounded-lg border-[#08CA0F] text-[#08CA0F] font-PublicSansBold">
                    {t(tokens.actions.approve)}
                  </Text>
                )}
                {newItem?.approval_status === 1 && (
                  <Text className="text-xs border p-1 pl-2 pr-2 bg-[#D1A40408] rounded-lg border-[#D1A404] text-[#D1A404] font-PublicSansBold">
                    {t(tokens.actions.pending)}
                  </Text>
                )}
                {newItem?.approval_status === 4 && (
                  <Text className="text-xs border p-1 pl-2 pr-2 bg-[#E4030308] rounded-lg border-[#E40303] text-[#E40303] font-PublicSansBold">
                    {t(tokens.actions.revoke)}
                  </Text>
                )}
              </View>
              <View>
                <Text className="text-xs text-gray-400 font-PublicSansBold text-right">
                {t(tokens.common.punchTime)}
                </Text>
                <Text className="text-xs font-PublicSansBold text-right">
                  {dateTimeToShow(newItem?.punch_time)}
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between pb-1 items-center">
              <View>
                <Text className="text-xs text-gray-400 font-PublicSansBold">
                {t(tokens.common.punchState)}
                </Text>
                <Text className="text-xs font-PublicSansBold">
                  {getPunchStateLabel(newItem?.punch_state)}
                </Text>
              </View>
              <View>
                <Text className="text-xs text-gray-400 font-PublicSansBold text-right">
                {t(tokens.common.workCode)}
                </Text>
                <Text className="text-xs font-PublicSansBold text-right">
                  {newItem?.work_code}
                </Text>
              </View>
              {/* <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={handleFulldetails}
                className="items-center justify-center h-7.5 w-30 p-2 rounded-lg bg-[#697CE3]">
                <View>
                  <Text className="text-xs text-white font-semibold-poppins">
                    View more
                  </Text>
                </View>
              </TouchableOpacity>
            </View> */}
            </View>
          </View>
        </TouchableOpacity>
      </View>
      
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
    borderTopWidth: 0.1,
    borderTopColor: '#000',
    borderLeftWidth: 0.1,
    borderLeftColor: '#000',
    borderRightWidth: 0.1,
    borderRightColor: '#000',
  },
});
