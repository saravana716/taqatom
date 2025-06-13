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
import Icon from 'react-native-vector-icons/FontAwesome';

import ProfileServices from '../../Services/API/ProfileServices';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {dateTimeToShow} from '../../utils/formatDateTime';
import get from 'lodash/get';
import find from 'lodash/find';
// Removed: import {useTranslation} from 'react-i18next';
// Removed: import tokens from '../../locales/tokens';
import {formatErrorsToToastMessages} from '../../utils/error-format';

export default function ApprovalLeaveDetails({navigation, route}) {
  const {newItem, employeeId, leaveList} = route.params;
  // Removed: const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [LeaveData, setLeaveData] = useState([]);
  const [approveConfirmVisible, setApproveConfirmVisible] = useState(false);
  const [rejectedConfirmVisible, setRejectedConfirmVisible] = useState(false);
  const matchedData = find(LeaveData, log => log?.id === newItem?.id);
  const [approveReason, setApproveReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleBack = () => {
    navigation.navigate('ApprovalLeaveCard');
  };

  const handleLeaveScreen = () => {
    Navigation.push(componentId, {
      component: {
        name: 'ApprovalLeaveScreen',
        passProps: {
          employeeId,
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
    // Toast.show({
    // type: 'success',
    // text1: 'Coming Soon',
    // position: 'bottom',
    // });
  };

  const handleApprove = async () => {
    if (!approveReason.trim()) {
      setErrorMessage('Reason is required');
      return;
    }
    try {
      const response = await ProfileServices.postLeaveApprove(
        matchedData?.id,
        approveReason,
      );
      getLeaveList();
      setApproveConfirmVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Approve Success',
        position: 'bottom',
      });
      leaveList();
      setApproveReason('');
    } catch (error) {
      formatErrorsToToastMessages(error);
      console.log(
        error?.errorResponse?.errors[0]?.message,
        '1122',
        error?.errorResponse,
        'err',
      );
      setApproveConfirmVisible(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setErrorMessage('Reason is required');
      return;
    }
    try {
      const response = await ProfileServices.postLeaveReject(
        matchedData?.id,
        rejectReason,
      );

      getLeaveList();
      setRejectedConfirmVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Reject Success',
        position: 'bottom',
      });
      leaveList();
      setRejectReason('');
    } catch (error) {
      formatErrorsToToastMessages(error);
      console.log(error?.errorResponse?.errors[0]?.message, 'err');
      setRejectedConfirmVisible(false);
    }
  };

  const showApproveConfirmDialog = () => {
    setApproveConfirmVisible(true);
  };

  const showRejectedConfirmDialog = () => {
    setRejectedConfirmVisible(true);
  };

  const getLeaveList = async () => {
    try {
      console.log('updated');
      const RecentActivities = await ProfileServices.getApprovalLeaveData(
        employeeId,
      );
      console.log('RecentActivities1', RecentActivities);
      setLeaveData(RecentActivities?.results);
    } catch (error) {
      formatErrorsToToastMessages(error);
    }
  };

  useEffect(() => {
    getLeaveList();
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
            <View>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Icon name="angle-left" size={30} color="#697ce3" />
              </TouchableOpacity>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>View</Text>
            </View>
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.scrollViewContent}>
              <ScrollView style={styles.scrollView}>
                <View style={styles.dataDisplayContainer}>
                  <View style={styles.dataRowsContainer}>
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>Approval Status</Text>
                      {matchedData?.approval_status === 3 && (
                        <Text style={styles.rejectedStatus}>Reject</Text>
                      )}
                      {matchedData?.approval_status === 2 && (
                        <Text style={styles.approvedStatus}>Approve</Text>
                      )}
                      {matchedData?.approval_status === 1 && (
                        <Text style={styles.pendingStatus}>Pending</Text>
                      )}
                      {matchedData?.approval_status === 4 && (
                        <Text style={styles.rejectedStatus}>Revoke</Text>
                      )}
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>First Name</Text>
                      <Text style={styles.dataValue}>
                        {get(matchedData, 'first_name')}
                      </Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>Last Name</Text>
                      <Text style={styles.dataValue}>
                        {get(matchedData, 'last_name')}
                      </Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>Employee Code</Text>
                      <Text style={styles.dataValue}>
                        {get(matchedData, 'emp_code')}
                      </Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>Department</Text>
                      <Text style={styles.dataValue}>
                        {get(matchedData, 'department_info.department_name')}
                      </Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>Start Time</Text>
                      <Text style={styles.dataValue}>
                        {dateTimeToShow(matchedData?.start_time)}
                      </Text>
                    </View>
                    <View style={styles.dataRowNoBorder}>
                      <Text style={styles.dataLabel}>End Time</Text>
                      <Text style={styles.dataValue}>
                        {dateTimeToShow(matchedData?.end_time)}
                      </Text>
                    </View>
                    <View style={styles.dataRowNoBorder}>
                      <Text style={styles.dataLabel}>Pay Code</Text>
                      <Text style={styles.dataValue}>
                        {matchedData?.paycode_details?.name}
                      </Text>
                    </View>
                    <View style={styles.dataRowNoBorder}>
                      <Text style={styles.dataLabel}>Reason</Text>
                      <Text style={styles.dataValue}>
                        {matchedData?.apply_reason || '-'}
                      </Text>
                    </View>
                  </View>
                  {matchedData?.approval_status === 1 && (
                    <View style={styles.actionButtonsContainer}>
                      <TouchableOpacity
                        onPress={showRejectedConfirmDialog}
                        style={styles.rejectButton}>
                        <Text style={styles.rejectButtonText}>Reject</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={isLoading}
                        onPress={showApproveConfirmDialog}
                        style={styles.approveButton}>
                        {isLoading && (
                          <ActivityIndicator size="large" color="#697CE3" />
                        )}
                        {!isLoading && (
                          <Text style={styles.approveButtonText}>Approve</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </ScrollView>
              <Toast />
            </View>

            <Modal
              animationType={'fade'}
              visible={approveConfirmVisible}
              transparent
              onRequestClose={() => {
                setApproveConfirmVisible(!approveConfirmVisible);
              }}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Approve</Text>
                  <Text style={styles.modalMessage}>
                    Are you sure you want to approve this leave?
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
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setApproveConfirmVisible(false);
                      }}
                      style={styles.modalCancelButton}>
                      <Text style={styles.modalCancelButtonText}>Cancel</Text>
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
                          Approve
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
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Reject</Text>
                  <Text style={styles.modalMessage}>
                    Are you sure you want to reject this leave?
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
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setRejectedConfirmVisible(false);
                      }}
                      style={styles.modalCancelButton}>
                      <Text style={styles.modalCancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={isLoading}
                      onPress={handleReject}
                      style={styles.modalRejectButton}>
                      {isLoading && (
                        <ActivityIndicator size="large" color="#697CE3" />
                      )}
                      {!isLoading && (
                        <Text style={styles.modalApproveButtonText}>Reject</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>

          <Toast />
        </View>
      )}
      <Toast />
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
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingLeft: 20,
    paddingBottom: 20,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingLeft: 4,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    width: '100%',
    // fontFamily: 'PublicSansBold', // Assuming this is a custom font
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    paddingRight: '15%',
  },
  detailsContainer: {
    padding: 16,
    height: '100%', // This may need adjustment depending on overall layout
    flex: 1,
  },
  scrollViewContent: {
    flex: 1,
    height: '100%', // This may need adjustment depending on overall layout
    backgroundColor: 'white',
    borderRadius: 24,
  },
  scrollView: {
    padding: 16,
    flex: 1,
  },
  dataDisplayContainer: {
    flex: 1,
    backgroundColor: 'white',
    height: '83%', // This height might be tricky to get right with flex
    borderRadius: 16,
    width: '100%',
    justifyContent: 'space-between',
  },
  dataRowsContainer: {
    flex: 1,
    padding: 8,
    borderRadius: 16,
    width: '100%',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingBottom: 24,
    borderColor: 'white', // Tailwind's border-white usually means no visible border unless background is different
    alignItems: 'center',
    width: '100%',
  },
  dataRowNoBorder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 24,
    borderColor: 'white',
    alignItems: 'center',
    width: '100%',
  },
  dataLabel: {
    fontSize: 12,
    color: 'gray',
    // fontFamily: 'PublicSansBold', // Assuming this is a custom font
    fontWeight: 'bold',
  },
  dataValue: {
    fontSize: 12,
    // fontFamily: 'PublicSansBold', // Assuming this is a custom font
    fontWeight: 'bold',
  },
  rejectedStatus: {
    fontSize: 12,
    borderWidth: 1,
    padding: 4,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: '#E4030308', // This is a translucent red
    borderRadius: 8,
    borderColor: '#E40303',
    color: '#E40303',
    // fontFamily: 'PublicSansBold', // Assuming this is a custom font
    fontWeight: 'bold',
  },
  approvedStatus: {
    fontSize: 12,
    borderWidth: 1,
    padding: 4,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: '#08CA0F08', // This is a translucent green
    borderRadius: 8,
    borderColor: '#08CA0F',
    color: '#08CA0F',
    // fontFamily: 'PublicSansBold', // Assuming this is a custom font
    fontWeight: 'bold',
  },
  pendingStatus: {
    fontSize: 12,
    borderWidth: 1,
    padding: 4,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: '#D1A40408', // This is a translucent yellow/orange
    borderRadius: 8,
    borderColor: '#D1A404',
    color: '#D1A404',
    // fontFamily: 'PublicSansBold', // Assuming this is a custom font
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12, // Corresponds to `gap-3` in Tailwind, which is `12px`
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingLeft: 12,
    paddingRight: 12,
  },
  rejectButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    flex: 1,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  rejectButtonText: {
    fontSize: 12,
    color: '#FF0000',
    // fontFamily: 'semibold-poppins', // Assuming this is a custom font
    fontWeight: '600',
  },
  approveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    flex: 1,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#697CE3',
  },
  approveButtonText: {
    fontSize: 12,
    color: 'white',
    // fontFamily: 'semibold-poppins', // Assuming this is a custom font
    fontWeight: '600',
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
    paddingHorizontal: 20,
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
    paddingHorizontal: 8,
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
  buttonContainer: {
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
    width: 80,
    height: 40,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#697CE3',
  },
  modalCancelButtonText: {
    fontSize: 12,
    color: '#697CE3',
    // fontFamily: 'semibold-poppins', // Assuming this is a custom font
    fontWeight: '600',
  },
  modalApproveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 80,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#697CE3',
  },
  modalRejectButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 80,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#cf3636',
  },
  modalApproveButtonText: {
    fontSize: 12,
    color: 'white',
    // fontFamily: 'semibold-poppins', // Assuming this is a custom font
    fontWeight: '600',
  },
});