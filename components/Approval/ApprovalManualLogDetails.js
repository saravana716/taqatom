import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Iconify} from 'react-native-iconify';
import {Navigation} from 'react-native-navigation';
import ProfileServices from '../../../Services/API/ProfileServices';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {dateTimeToShow} from '../../../utils/formatDateTime';
import get from 'lodash/get';
import {getPunchStateLabel} from '../../../utils/getPunchStateLabel';
import find from 'lodash/find';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';
import {useTranslation} from 'react-i18next';
import tokens from '../../../locales/tokens';
import { formatErrorsToToastMessages } from '../../../utils/error-format';

export default function ApprovalManualLogDetails({
  newItem,
  employeeId,
  componentId,
  getManualLogList: getParentManualLogList,
}) {
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [manualLogData, setManualLogData] = useState([]);
  const matchedData = find(manualLogData, log => log?.id === newItem?.id);
  const [approveConfirmVisible, setApproveConfirmVisible] = useState(false);
  const [rejectedConfirmVisible, setRejectedConfirmVisible] = useState(false);
  const [approveReason, setApproveReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleBack = () => {
    Navigation.pop(componentId);
  };

  const showApproveConfirmDialog = () => {
    setApproveConfirmVisible(true);
  };

  const showRejectedConfirmDialog = () => {
    setRejectedConfirmVisible(true);
  };

  const handleApprove = async () => {
    if (!approveReason.trim()) {
      setErrorMessage('Reason is required');
      return;
    }
    try {
      const response = await ProfileServices.postManualLogApprove(
        matchedData?.id,
        approveReason,
      );
      getManualLogList();
      getParentManualLogList();
      setApproveConfirmVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Approve Success',
        position: 'bottom',
      });
      setApproveReason('');
    } catch (error) {
      console.log(error, 'err123');
     formatErrorsToToastMessages(error)
      setApproveConfirmVisible(false);
    }
  };

  const handleRejected = async () => {
    if (!rejectReason.trim()) {
      setErrorMessage('Reason is required');
      return;
    }
    try {
      const response = await ProfileServices.postManualLogReject(
        matchedData?.id,
        rejectReason,
      );
      getManualLogList();
      getParentManualLogList();
      setRejectedConfirmVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Reject Success',
        position: 'bottom',
      });
      setRejectReason('');
    } catch (error) {
      console.log(error?.errorResponse, 'err');
      formatErrorsToToastMessages(error)
      setRejectedConfirmVisible(false);
    }
  };

  const getManualLogList = async () => {
    try {
      const RecentActivities = await ProfileServices.getApprovalManualLogData(
        employeeId,
      );
      console.log('RecentActivities1', RecentActivities?.results);
      setManualLogData(RecentActivities?.results);
    } catch (error) {
      formatErrorsToToastMessages(error)
    }
  };
  useEffect(() => {
    getManualLogList();
  }, []);

  const punchStateLabel = {
    0: 'Check In',
    1: 'Check Out',
    2: 'Break Out',
    3: 'Break In',
    4: 'Overtime In',
    5: 'Overtime Out',
  };
  return (
    <>
      {!matchedData ? (
        <View className="h-full w-full justify-center items-center">
          <ActivityIndicator size="large" color="#697CE3" />
        </View>
      ) : (
        <MenuProvider>
          <View className="bg-[#F1F3F4] h-full flex-1 w-[100%]">
            <View className="flex-row pt-5 pl-5 pb-5 items-center w-[100%] justify-between">
              <View className=" ">
                <TouchableOpacity onPress={handleBack} className=" pl-1">
                  <Iconify icon="mingcute:left-line" size={30} color="#000" />
                </TouchableOpacity>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-xl w-full font-PublicSansBold text-black text-center pr-[15%]">
                  {t(tokens.actions.view)}
                </Text>
              </View>
            </View>

            <View className="flex-1 h-full rounded-3xl">
              <ScrollView className="p-4 h-full flex-1">
                <View className="flex-1 bg-white h-[83vh] p-3 rounded-2xl w-full justify-between">
                  <View>
                    <View className="flex-row justify-between border-b pb-6 border-white items-center w-full">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                        {t(tokens.charts.approvalStatus)}
                      </Text>
                      {matchedData?.approval_status === 3 && (
                        <Text className="text-xs border p-1 pl-2 pr-2 bg-[#E4030308] rounded-lg border-[#E40303] text-[#E40303] font-PublicSansBold">
                          {t(tokens.actions.reject)}
                        </Text>
                      )}
                      {matchedData?.approval_status === 2 && (
                        <Text className="text-xs border p-1 pl-2 pr-2 bg-[#08CA0F08] rounded-lg border-[#08CA0F] text-[#08CA0F] font-PublicSansBold">
                          {t(tokens.actions.approve)}
                        </Text>
                      )}
                      {matchedData?.approval_status === 1 && (
                        <Text className="text-xs border p-1 pl-2 pr-2 bg-[#D1A40408] rounded-lg border-[#D1A404] text-[#D1A404] font-PublicSansBold">
                          {t(tokens.actions.pending)}
                        </Text>
                      )}
                      {matchedData?.approval_status === 4 && (
                        <Text className="text-xs border p-1 pl-2 pr-2 bg-[#E4030308] rounded-lg border-[#E40303] text-[#E40303] font-PublicSansBold">
                          {t(tokens.actions.revoke)}
                        </Text>
                      )}
                    </View>
                    <View className="flex-row justify-between border-b pb-6 border-white items-center w-full">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                        {t(tokens.common.firstName)}
                      </Text>
                      <Text className="text-xs font-PublicSansBold">
                        {get(matchedData, 'first_name')}
                      </Text>
                    </View>
                    <View className="flex-row justify-between border-b pb-6 border-white items-center w-full">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                        {t(tokens.common.lastName)}
                      </Text>
                      <Text className="text-xs font-PublicSansBold">
                        {get(matchedData, 'last_name')}
                      </Text>
                    </View>
                    <View className="flex-row justify-between border-b pb-6 border-white items-center w-full">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                        {t(tokens.common.employeeCode)}
                      </Text>
                      <Text className="text-xs font-PublicSansBold">
                        {get(matchedData, 'emp_code')}
                      </Text>
                    </View>
                    <View className="flex-row justify-between border-b pb-6 border-white items-center w-full">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                        {t(tokens.nav.department)}
                      </Text>
                      <Text className="text-xs font-PublicSansBold">
                        {get(matchedData, 'department_info.department_name')}
                      </Text>
                    </View>

                    <View className="flex-row justify-between border-b pb-6 border-white items-center w-full">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                        {t(tokens.common.punchTime)}
                      </Text>
                      <Text className="text-xs font-PublicSansBold">
                        {dateTimeToShow(matchedData?.punch_time)}
                      </Text>
                    </View>
                    <View className="flex-row justify-between pb-6 border-white items-center w-full ">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                        {t(tokens.common.punchState)}
                      </Text>
                      <Text className="text-xs font-PublicSansBold">
                        {punchStateLabel[matchedData?.punch_state] || '-'}
                      </Text>
                    </View>
                    <View className="flex-row justify-between pb-6 border-white items-center w-full ">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                        {t(tokens.common.workCode)}
                      </Text>
                      <Text className="text-xs font-PublicSansBold">
                        {matchedData?.work_code}
                      </Text>
                    </View>
                    <View className="flex-row justify-between pb-6 border-white w-full ">
                      <Text className="text-xs text-gray-400 font-PublicSansBold">
                        {t(tokens.common.reason)}
                      </Text>
                      <Text
                        className="text-xs font-PublicSansBold"
                        // style={{width: 140}}
                      >
                        {matchedData?.apply_reason || '-'}
                      </Text>
                    </View>
                  </View>
                  {matchedData?.approval_status === 1 && (
                    <View className="flex-row w-full gap-2 w-[100%]">
                      <TouchableOpacity
                        onPress={showRejectedConfirmDialog}
                        className={`items-center justify-center h-7.5 w-[50%] p-2 rounded-lg ${
                          matchedData?.approval_status === 4
                            ? 'bg-[#B2BEB5]'
                            : 'bg-[#697CE3]'
                        }`}>
                        <Text className="text-xs text-white font-semibold-poppins">
                          {t(tokens.actions.reject)}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={showApproveConfirmDialog}
                        className={`items-center justify-center h-7.5 ${
                          matchedData?.approval_status === 4 ||
                          matchedData?.approval_status === 3
                            ? 'w-[100%]'
                            : 'w-[50%]'
                        } p-2 rounded-lg bg-[#697CE3]`}>
                        <Text className="text-xs text-white font-semibold-poppins">
                          {t(tokens.actions.approve)}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </MenuProvider>
      )}
      <Toast />
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
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                {t(tokens.actions.approve)}
              </Text>
              <Text style={{marginTop: 10, fontSize: 16}}>
                {t(tokens.messages.approveConfirm)}
              </Text>
              <View className="pl-2 pr-2 w-full">
                <TextInput
                  style={{
                    height: 50,
                    borderColor: '#ccc',
                    borderWidth: 1,
                    borderRadius: 5,
                    marginTop: 10,
                    paddingHorizontal: 10,
                    width: '100%',
                  }}
                  placeholder="Enter reason"
                  value={approveReason}
                  onChangeText={text => {
                    setApproveReason(text);
                    setErrorMessage('');
                  }}
                />
                {errorMessage ? (
                  <Text style={{color: 'red', marginTop: 5, paddingLeft: 2}}>
                    {errorMessage}
                  </Text>
                ) : null}
              </View>
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
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                {t(tokens.actions.reject)}
              </Text>
              <Text style={{marginTop: 10, fontSize: 16}}>
                {t(tokens.messages.rejectConfirm)}
              </Text>
              <View className="pl-2 pr-2 w-full">
                <TextInput
                  style={{
                    height: 50,
                    borderColor: '#ccc',
                    borderWidth: 1,
                    borderRadius: 5,
                    marginTop: 10,
                    paddingHorizontal: 10,
                    width: '100%',
                  }}
                  placeholder="Enter reason"
                  value={rejectReason}
                  onChangeText={text => {
                    setRejectReason(text);
                    setErrorMessage('');
                  }}
                />
                {errorMessage ? (
                  <Text style={{color: 'red', marginTop: 5, paddingLeft: 2}}>
                    {errorMessage}
                  </Text>
                ) : null}
              </View>
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
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'flex-end',
    width: '100%',
    gap: 20,
    padding: 9,
  },
});
