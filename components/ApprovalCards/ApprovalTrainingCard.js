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

export default function ApprovalTrainingCard({
  newItem,
  employeeId,
  getTrainingList,
}) {
  const navigation=useNavigation()
const {t}=useTranslation()
  const [isLoading, setIsLoading] = useState(false);
  const [approveConfirmVisible, setApproveConfirmVisible] = useState(false);
  const [rejectedConfirmVisible, setRejectedConfirmVisible] = useState(false);

  

  const handleFulldetails = () => {
    Navigation.push(componentId, {
        component: {
          name: 'ApprovalTrainingDetails',
          passProps: {
            employeeId,
            newItem,
            getTrainingList
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
      const response = await ProfileServices.postTrainingApprove(newItem?.id);
      Toast.show({
        type: 'success',
        text1: 'Approve Success',
        position: 'bottom',
      });
      console.log('responseee', response);
      getTrainingList();
      setApproveConfirmVisible(false);
    } catch (error) {
      console.log(error?.errorResponse, 'err');
    formatErrorsToToastMessages(error)
      setApproveConfirmVisible(false);
    }
  };

  const handleRejected = async () => {
    try {
      const response = await ProfileServices.postTrainingReject(newItem?.id);
      Toast.show({
        type: 'success',
        text1: 'Reject Success',
        position: 'bottom',
      });
      console.log('responseee', response);
      getTrainingList();
      setRejectedConfirmVisible(false);
    } catch (error) {
      console.log(error?.errorResponse, 'err');
   formatErrorsToToastMessages(error)
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
    <View>
    <Modal
          animationType={'fade'}
          visible={approveConfirmVisible}
          transparent
          onRequestClose={() => {
            setApproveConfirmVisible(!approveConfirmVisible);
          }}>
             <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(52, 52, 52, 0.8)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <View
              style={{
                alignItems: 'center',
                backgroundColor: 'white',
                marginVertical: 60,
                borderWidth: 1,
                borderColor: '#fff',
                borderRadius: 7,
                width: '90%',
                elevation: 10,
                paddingX: 20,
                paddingTop: 20,
                paddingBottom: 10,
              }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{t(tokens.actions.approve)}</Text>
                <Text style={{ marginTop: 10 , fontSize: 16,}}>{t(tokens.messages.approveConfirm)}</Text>
                <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setApproveConfirmVisible(false);
                  }}
                  className="items-center justify-center w-20 h-10 p-2 rounded-lg border border-[#697CE3] ">
                  <Text className="text-xs  text-[#697CE3] font-semibold-poppins ">
                    {t(tokens.actions.cancel)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={isLoading}
                  onPress={handleApprove}
                  className="items-center justify-center h-10 w-20 p-2 rounded-lg bg-[#697CE3]">
                  {isLoading && (
                    <ActivityIndicator size="large" color="#697CE3" />
                  )}
                  {!isLoading && (
                    <Text className="text-xs text-white font-semibold-poppins">
                      {t(tokens.actions.approve)}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              </View>
            </View>
          </Modal>
          </View>
          <View>
        <Modal
          animationType={'fade'}
          visible={rejectedConfirmVisible}
          transparent
          onRequestClose={() => {
            setRejectedConfirmVisible(!rejectedConfirmVisible);
          }}>
             <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(52, 52, 52, 0.8)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <View
              style={{
                alignItems: 'center',
                backgroundColor: 'white',
                marginVertical: 60,
                borderWidth: 1,
                borderColor: '#fff',
                borderRadius: 7,
                width: '90%',
                elevation: 10,
                paddingX: 20,
                paddingTop: 20,
                paddingBottom: 10,
              }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{t(tokens.actions.reject)}</Text>
                <Text style={{ marginTop: 10 , fontSize: 16,}}>{t(tokens.messages.rejectConfirm)}</Text>
                <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setRejectedConfirmVisible(false);
                  }}
                  className="items-center justify-center w-20 h-10 p-2 rounded-lg border border-[#697CE3] ">
                  <Text className="text-xs  text-[#697CE3] font-semibold-poppins ">
                    {t(tokens.actions.cancel)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={isLoading}
                  onPress={handleRejected}
                  className="items-center justify-center h-10 w-20 p-2 rounded-lg bg-[#cf3636]">
                  {isLoading && (
                    <ActivityIndicator size="large" color="#697CE3" />
                  )}
                  {!isLoading && (
                    <Text className="text-xs text-white font-semibold-poppins">
                      {t(tokens.actions.reject)}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              </View>
            </View>
          </Modal>
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

