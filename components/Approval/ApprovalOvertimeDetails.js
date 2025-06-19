import { useEffect, useState } from 'react';
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
import Icon from 'react-native-vector-icons/FontAwesome';

import find from 'lodash/find';
import get from 'lodash/get';
import { useTranslation } from 'react-i18next';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import tokens from '../../locales/tokens';
import ProfileServices from '../../Services/API/ProfileServices';
import { dateTimeToShow } from '../../utils/formatDateTime';
// Removed: import { useTranslation } from 'react-i18next';
// Removed: import tokens from '../../locales/tokens';
import { formatErrorsToToastMessages } from '../../utils/error-format';

export default function ApprovalOvertimeDetails({navigation, route}) {
  const {newItem, employeeId, getOvertimeList: getParentOvertimeList} =
    route.params;
  // Removed: const {t}=useTranslation()
  const [isLoading, setIsLoading] = useState(false);
    const {t,i18n}=useTranslation()
    const isRTL = i18n.language === 'ar';
    
  const [approveConfirmVisible, setApproveConfirmVisible] = useState(false);
  const [rejectedConfirmVisible, setRejectedConfirmVisible] = useState(false);
  const [OvertimeData, setOvertimeData] = useState([]);

  const matchedData = find(OvertimeData, log => log?.id === newItem?.id);
  const [approveReason, setApproveReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleBack = () => {
    navigation.navigate('ApplrovalOvertimeScreen');
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
      const response = await ProfileServices.postOvertimeApprove(
        matchedData?.id,
        approveReason,
      );
      getOvertimeList();
      getParentOvertimeList();
      setApproveConfirmVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Approve Success',
        position: 'bottom',
      });
      setApproveReason('');
    } catch (error) {
      
      setApproveConfirmVisible(false);
      formatErrorsToToastMessages(error);
    }
  };

  const handleRejected = async () => {
    if (!rejectReason.trim()) {
      setErrorMessage('Reason is required');
      return;
    }
    try {
      const response = await ProfileServices.postOvertimeReject(
        matchedData?.id,
        rejectReason,
      );
      getOvertimeList();
      getParentOvertimeList();
      setRejectedConfirmVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Reject Success',
        position: 'bottom',
      });
      setRejectReason('');
    } catch (error) {
      
      setRejectedConfirmVisible(false);
      formatErrorsToToastMessages(error);
    }
  };

  const getOvertimeList = async () => {
    try {
      const RecentActivities = await ProfileServices.getApprovalOvertimeData(
        employeeId,
      );
      
      setOvertimeData(RecentActivities?.results);
    } catch (error) {
      formatErrorsToToastMessages(error);
    }
  };
  useEffect(() => {
    getOvertimeList();
  }, []);

  return (
    <>
      {!matchedData ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#697CE3" />
        </View>
      ) : (
        <View style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Icon name="angle-left" size={30} color="#697ce3" />
            </TouchableOpacity>
            <Text style={styles.headerText}>
              {t(tokens.actions.view)}

            </Text>
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.scrollViewWrapper}>
              <ScrollView style={styles.scrollView}>
                <View style={styles.dataDisplayContainer}>
                  <View style={styles.dataRowsContainer}>
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>
                      {t(tokens.charts.approvalStatus)}

                      </Text>
                      {matchedData?.approval_status === 3 && (
                        <Text style={styles.rejectedStatus}>
                          {t(tokens.actions.reject)}

                        </Text>
                      )}
                      {matchedData?.approval_status === 2 && (
                        <Text style={styles.approvedStatus}>
                            {t(tokens.actions.approve)}

                        </Text>
                      )}
                      {matchedData?.approval_status === 1 && (
                        <Text style={styles.pendingStatus}>
                          {t(tokens.actions.pending)}

                        </Text>
                      )}
                      {matchedData?.approval_status === 4 && (
                        <Text style={styles.rejectedStatus}>
                          {t(tokens.actions.revoke)}

                        </Text>
                      )}
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>
                      {t(tokens.common.firstName)}

                      </Text>
                      <Text style={styles.dataValue}>
                        {get(matchedData, 'first_name')}
                      </Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>
                      {t(tokens.common.lastName)}

                      </Text>
                      <Text style={styles.dataValue}>
                        {get(matchedData, 'last_name') || '-'}
                      </Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>
                      {t(tokens.common.employeeCode)}

                      </Text>
                      <Text style={styles.dataValue}>
                        {get(matchedData, 'emp_code')}
                      </Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>
                        {t(tokens.nav.department)}

                      </Text>
                      <Text style={styles.dataValue}>
                        {get(matchedData, 'department_info.department_name')}
                      </Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>
                      {t(tokens.common.startTime)}

                      </Text>
                      <Text style={styles.dataValue}>
                        {dateTimeToShow(matchedData?.start_time)}
                      </Text>
                    </View>
                    <View style={styles.dataRowNoBorder}>
                      <Text style={styles.dataLabel}>
                      {t(tokens.common.endTime)}

                      </Text>
                      <Text style={styles.dataValue}>
                        {dateTimeToShow(matchedData?.end_time)}
                      </Text>
                    </View>
                    <View style={styles.dataRowNoBorder}>
                      <Text style={styles.dataLabel}>
                      {t(tokens.nav.payCode)}

                      </Text>
                      <Text style={styles.dataValue}>
                        {matchedData?.paycode_details?.name}
                      </Text>
                    </View>
                    <View style={styles.dataRowNoBorder}>
                      <Text style={styles.dataLabel}>
                      {t(tokens.common.reason)}

                      </Text>
                      <Text style={styles.dataValue}>
                        {matchedData?.apply_reason || '-'}
                      </Text>
                    </View>
                  </View>
                  {matchedData?.approval_status === 1 && (
                    <View style={styles.actionButtonsContainer}>
                      <TouchableOpacity
                        onPress={showRejectedConfirmDialog}
                        style={[
                          styles.actionButton,
                          matchedData?.approval_status === 4
                            ? styles.disabledButton
                            : styles.rejectButton,
                        ]}>
                        <Text style={styles.rejectButtonText}>
                        {t(tokens.actions.reject)}

                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={showApproveConfirmDialog}
                        style={[
                          styles.actionButton,
                          matchedData?.approval_status === 4 ||
                          matchedData?.approval_status === 3
                            ? styles.fullWidthButton
                            : styles.approveButton,
                        ]}>
                        <Text style={styles.approveButtonText}>
                        {t(tokens.actions.approve)}

                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>
            <Toast />
          </View>
          <View>
            <Modal
              animationType={'fade'}
              visible={approveConfirmVisible}
              transparent
              onRequestClose={() => {
                setApproveConfirmVisible(!approveConfirmVisible);
              }}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>
                  {t(tokens.actions.approve)}

                  </Text>
                  <Text style={styles.modalMessage}>
                  {t(tokens.messages.approveConfirm)}
                    
                  </Text>
                  <View style={styles.modalInputWrapper}>
                    <TextInput
                      style={styles.modalTextInput}
                      placeholder="Enter reason"
                      value={approveReason}
                      onChangeText={text => {
                        setApproveReason(text);
                        setErrorMessage('');
                      }}
                    />
                    {errorMessage ? (
                      <Text style={styles.errorMessage}>{errorMessage}</Text>
                    ) : null}
                  </View>
                  <View style={styles.modalButtonContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setApproveConfirmVisible(false);
                      }}
                      style={styles.modalCancelButton}>
                      <Text style={styles.modalCancelButtonText}>
                         {t(tokens.actions.cancel)}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={isLoading}
                      onPress={handleApprove}
                      style={styles.modalApproveButton}>
                      {isLoading && (
                        <ActivityIndicator size="large" color="#697CE3" />
                      )}
                      {!isLoading && (
                        <Text style={styles.modalApproveButtonText}>
                          {t(tokens.actions.approve)}
                          
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <Toast />
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
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>
                  {t(tokens.actions.reject)}

                  </Text>
                  <Text style={styles.modalMessage}>
                                      {t(tokens.messages.rejectConfirm)}

                  </Text>
                  <View style={styles.modalInputWrapper}>
                    <TextInput
                      style={styles.modalTextInput}
                      placeholder="Enter reason"
                      value={rejectReason}
                      onChangeText={text => {
                        setRejectReason(text);
                        setErrorMessage('');
                      }}
                    />
                    {errorMessage ? (
                      <Text style={styles.errorMessage}>{errorMessage}</Text>
                    ) : null}
                  </View>
                  <View style={styles.modalButtonContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setRejectedConfirmVisible(false);
                      }}
                      style={styles.modalCancelButton}>
                      <Text style={styles.modalCancelButtonText}>
                      {t(tokens.actions.cancel)}

                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={isLoading}
                      onPress={handleRejected}
                      style={styles.modalRejectButton}>
                      {isLoading && (
                        <ActivityIndicator size="large" color="#697CE3" />
                      )}
                      {!isLoading && (
                        <Text style={styles.modalApproveButtonText}>
                          {t(tokens.actions.reject)}

                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <Toast />
            </Modal>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    backgroundColor: '#F1F3F4',
    height: '100%',
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    paddingBottom: 28, // pb-7 * 4
    paddingLeft: 20, // p-5 * 4
    paddingRight: 20, // p-5 * 4
    paddingTop: 20, // Added for consistent padding
    alignItems: 'center',
    width: '100%',
  },
  backButton: {
    paddingLeft: 4, // pl-1 * 4
  },
  headerText: {
    fontSize: 20, // text-xl
    width: '100%',
    // fontFamily: 'PublicSansBold', // If this is a custom font, keep it
    fontWeight: 'bold', // Assuming font-PublicSansBold implies bold
    color: 'black',
    textAlign: 'center',
    paddingRight: '15%', // pr-[15%]
  },
  detailsContainer: {
    padding: 16, // p-4 * 4
    height: '90%', // h-[90vh] - approximate conversion
    flex: 1,
  },
  scrollViewWrapper: {
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 24, // rounded-3xl
  },
  scrollView: {
    padding: 16, // p-4 * 4
    flex: 1,
  },
  dataDisplayContainer: {
    flex: 1,
    backgroundColor: 'white',
    height: '83%', // h-[83vh] - approximate conversion
    borderRadius: 16, // rounded-2xl
    width: '100%',
    justifyContent: 'space-between',
  },
  dataRowsContainer: {
    flex: 1,
    padding: 12, // p-3 * 4
    borderRadius: 16, // rounded-2xl
    width: '100%',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingBottom: 24, // pb-6 * 4
    borderColor: 'white', // border-white
    alignItems: 'center',
    width: '100%',
  },
  dataRowNoBorder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 24, // pb-6 * 4
    // No border-b
    alignItems: 'center',
    width: '100%',
  },
  dataLabel: {
    fontSize: 12, // text-xs
    color: 'gray', // text-gray-400 - using 'gray' as a general representation, specific hex if needed
    // fontFamily: 'PublicSansBold', // If this is a custom font, keep it
    fontWeight: 'bold', // Assuming font-PublicSansBold implies bold
  },
  dataValue: {
    fontSize: 12, // text-xs
    // fontFamily: 'PublicSansBold', // If this is a custom font, keep it
    fontWeight: 'bold', // Assuming font-PublicSansBold implies bold
  },
  rejectedStatus: {
    fontSize: 12, // text-xs
    borderWidth: 1,
    padding: 4, // p-1 * 4
    paddingLeft: 8, // pl-2 * 4
    paddingRight: 8, // pr-2 * 4
    backgroundColor: '#E4030308', // bg-[#E4030308]
    borderRadius: 8, // rounded-lg
    borderColor: '#E40303', // border-[#E40303]
    color: '#E40303', // text-[#E40303]
    // fontFamily: 'PublicSansBold', // If this is a custom font, keep it
    fontWeight: 'bold', // Assuming font-PublicSansBold implies bold
  },
  approvedStatus: {
    fontSize: 12, // text-xs
    borderWidth: 1,
    padding: 4, // p-1 * 4
    paddingLeft: 8, // pl-2 * 4
    paddingRight: 8, // pr-2 * 4
    backgroundColor: '#08CA0F08', // bg-[#08CA0F08]
    borderRadius: 8, // rounded-lg
    borderColor: '#08CA0F', // border-[#08CA0F]
    color: '#08CA0F', // text-[#08CA0F]
    // fontFamily: 'PublicSansBold', // If this is a custom font, keep it
    fontWeight: 'bold', // Assuming font-PublicSansBold implies bold
  },
  pendingStatus: {
    fontSize: 12, // text-xs
    borderWidth: 1,
    padding: 4, // p-1 * 4
    paddingLeft: 8, // pl-2 * 4
    paddingRight: 8, // pr-2 * 4
    backgroundColor: '#D1A40408', // bg-[#D1A40408]
    borderRadius: 8, // rounded-lg
    borderColor: '#D1A404', // border-[#D1A404]
    color: '#D1A404', // text-[#D1A404]
    // fontFamily: 'PublicSansBold', // If this is a custom font, keep it
    fontWeight: 'bold', // Assuming font-PublicSansBold implies bold
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 8, // gap-2 * 4
    paddingRight: 8, // pr-2 * 4
    height: 44, // h-11 * 4
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 36, // h-9 * 4
    padding: 8, // p-2 * 4
    borderRadius: 8, // rounded-lg
  },
  rejectButton: {
    width: '50%', // w-[50%]
    backgroundColor: '#697CE3', // bg-[#697CE3]
  },
  approveButton: {
    width: '50%', // w-[50%]
    backgroundColor: '#697CE3', // bg-[#697CE3]
  },
  disabledButton: {
    backgroundColor: '#B2BEB5', // bg-[#B2BEB5]
    width: '50%',
  },
  fullWidthButton: {
    width: '100%', // w-[100%]
    backgroundColor: '#697CE3', // bg-[#697CE3]
  },
  rejectButtonText: {
    fontSize: 12, // text-xs
    color: 'white', // text-white
    // fontFamily: 'semibold-poppins', // If this is a custom font, keep it
    fontWeight: '600', // Assuming font-semibold-poppins implies 600
  },
  approveButtonText: {
    fontSize: 12, // text-xs
    color: 'white', // text-white
    // fontFamily: 'semibold-poppins', // If this is a custom font, keep it
    fontWeight: '600', // Assuming font-semibold-poppins implies 600
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    marginVertical: 60,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 7,
    width: '90%',
    elevation: 10,
    paddingHorizontal: 20, // paddingX: 20
    paddingTop: 20,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalMessage: {
    marginTop: 10,
    fontSize: 16,
  },
  modalInputWrapper: {
    paddingHorizontal: 8, // pl-2 pr-2 = p-2
    width: '100%',
  },
  modalTextInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  errorMessage: {
    color: 'red',
    marginTop: 5,
    paddingLeft: 2,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'flex-end',
    width: '100%',
    gap: 20,
    padding: 9,
  },
  modalCancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80, // w-20 * 4
    height: 40, // h-10 * 4
    padding: 8, // p-2 * 4
    borderRadius: 8, // rounded-lg
    borderWidth: 1,
    borderColor: '#697CE3', // border-[#697CE3]
  },
  modalCancelButtonText: {
    fontSize: 12, // text-xs
    color: '#697CE3', // text-[#697CE3]
    // fontFamily: 'semibold-poppins', // If this is a custom font, keep it
    fontWeight: '600', // Assuming font-semibold-poppins implies 600
  },
  modalApproveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40, // h-10 * 4
    width: 80, // w-20 * 4
    padding: 8, // p-2 * 4
    borderRadius: 8, // rounded-lg
    backgroundColor: '#697CE3', // bg-[#697CE3]
  },
  modalRejectButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40, // h-10 * 4
    width: 80, // w-20 * 4
    padding: 8, // p-2 * 4
    borderRadius: 8, // rounded-lg
    backgroundColor: '#cf3636', // bg-[#cf3636]
  },
  modalApproveButtonText: {
    fontSize: 12, // text-xs
    color: 'white', // text-white
    // fontFamily: 'semibold-poppins', // If this is a custom font, keep it
    fontWeight: '600', // Assuming font-semibold-poppins implies 600
  },
});