import moment from 'moment';
import React, { useState } from 'react';
import {Text, TouchableOpacity, View, ActivityIndicator, Modal, StyleSheet} from 'react-native';
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
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import { useTranslation } from 'react-i18next';
import tokens from '../../locales/tokens';
import { formatErrorsToToastMessages } from '../../utils/error-format';

export default function ApprovalLeaveCard({
  newItem,
  employeeId,
  getLeaveList,
}) {
    const navigation=useNavigation()
  
const {t}=useTranslation()
  const [approveConfirmVisible, setApproveConfirmVisible] = useState(false);
  const [rejectedConfirmVisible, setRejectedConfirmVisible] = useState(false);

  const handleFulldetails = () => {
    Navigation.push(componentId, {
      component: {
        name: 'ApprovalLeaveDetails',
        passProps: {
          employeeId,
          newItem,
          leaveList: getLeaveList,
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

  const showApproveConfirmDialog = () => {
    setApproveConfirmVisible(true);
  };

  const showRejectedConfirmDialog = () => {
    setRejectedConfirmVisible(true);
  };

  const handleApprove = async () => {
    try {
      const response = await ProfileServices.postLeaveApprove(newItem?.id);
      Toast.show({
        type: 'success',
        text1: 'Approve Success',
        position: 'bottom',
      });
      getLeaveList();
      setApproveConfirmVisible(false);
    } catch (error) {
    formatErrorsToToastMessages(error)
      console.log(error?.errorResponse?.errors[0]?.message,'1122',error?.errorResponse, 'err');
      setApproveConfirmVisible(false);
    }
  };

  const handleRejected = async () => {
    try {
      const response = await ProfileServices.postLeaveReject(newItem?.id);
      Toast.show({
        type: 'success',
        text1: 'Reject Success',
        position: 'bottom',
      });
      getLeaveList();
      setRejectedConfirmVisible(false);
    } catch (error) {
      formatErrorsToToastMessages(error)
      console.log(error?.errorResponse?.errors[0]?.message, 'err');
      setRejectedConfirmVisible(false);
    }
  };
  return (
    <>
      <View className="flex-row p-1 bg-white items-center justify-between rounded-xl border-b-4 border-b-[#697CE3] "
      style={styles.cardContainer}>
        <TouchableOpacity
        onPress={handleFulldetails}
        className="  w-full"
        activeOpacity={1}>
      <View className=" h-38 w-full p-4 rounded-2xl">
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
            <Text className="text-xs text-gray-400 font-PublicSansBold">
            {t(tokens.common.startDate)}
            </Text>
            <Text className="text-xs font-PublicSansBold">
              {dateTimeToShow(newItem?.start_time)}
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between pb-1 items-center">
            <View>
              <Text className="text-xs text-gray-400 font-PublicSansBold ">
              {t(tokens.common.endDate)}
              </Text>
              <Text className="text-xs font-PublicSansBold">
                {dateTimeToShow(newItem?.end_time)}
              </Text>
            </View>
            <View>
              <Text className="text-xs text-gray-400 font-PublicSansBold text-right">
              {t(tokens.nav.payCode)}
              </Text>
              <Text className="text-xs font-PublicSansBold text-right">
              {newItem?.paycode_details?.name}
              </Text>
            </View>
          </View>
        
      </View>
      </TouchableOpacity>
    </View>
  </>
  );
};

const styles = StyleSheet.create({
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

