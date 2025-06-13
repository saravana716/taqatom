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
import {MenuProvider} from 'react-native-popup-menu';
import {formatErrorsToToastMessages} from '../../utils/error-format';

export default function ApprovalManualLogDetails({navigation,route
 
}) {
  const{ newItem,
  employeeId,
  getManualLogList: getParentManualLogList}=route.params
  const [isLoading, setIsLoading] = useState(false);
  const [manualLogData, setManualLogData] = useState([]);
  const matchedData = find(manualLogData, log => log?.id === newItem?.id);
  const [approveConfirmVisible, setApproveConfirmVisible] = useState(false);
  const [rejectedConfirmVisible, setRejectedConfirmVisible] = useState(false);
  const [approveReason, setApproveReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleBack = () => {
    NavigationActivation.navigate("ApprovalScreen")
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
    setIsLoading(true); // Set loading true when starting the API call
    try {
      await ProfileServices.postManualLogApprove(
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
      formatErrorsToToastMessages(error);
      setApproveConfirmVisible(false);
    } finally {
      setIsLoading(false); // Always set loading false when API call finishes
    }
  };

  const handleRejected = async () => {
    if (!rejectReason.trim()) {
      setErrorMessage('Reason is required');
      return;
    }
    setIsLoading(true); // Set loading true when starting the API call
    try {
      await ProfileServices.postManualLogReject(
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
      formatErrorsToToastMessages(error);
      setRejectedConfirmVisible(false);
    } finally {
      setIsLoading(false); // Always set loading false when API call finishes
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
      formatErrorsToToastMessages(error);
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#697CE3" />
        </View>
      ) : (
        <MenuProvider>
          <View style={styles.mainContainer}>
            <View style={styles.headerContainer}>
              <View>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                  <Icon name="angle-left" size={30} color="#697ce3" />
                </TouchableOpacity>
              </View>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>View</Text>
              </View>
            </View>

            <View style={styles.contentArea}>
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.detailsCard}>
                  <View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Approval Status</Text>
                      {matchedData?.approval_status === 3 && (
                        <Text style={[styles.statusText, styles.rejectedStatus]}>
                          Reject
                        </Text>
                      )}
                      {matchedData?.approval_status === 2 && (
                        <Text style={[styles.statusText, styles.approvedStatus]}>
                          Approve
                        </Text>
                      )}
                      {matchedData?.approval_status === 1 && (
                        <Text style={[styles.statusText, styles.pendingStatus]}>
                          Pending
                        </Text>
                      )}
                      {matchedData?.approval_status === 4 && (
                        <Text style={[styles.statusText, styles.revokedStatus]}>
                          Revoke
                        </Text>
                      )}
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>First Name</Text>
                      <Text style={styles.detailValue}>
                        {get(matchedData, 'first_name')}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Last Name</Text>
                      <Text style={styles.detailValue}>
                        {get(matchedData, 'last_name')}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Employee Code</Text>
                      <Text style={styles.detailValue}>
                        {get(matchedData, 'emp_code')}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Department</Text>
                      <Text style={styles.detailValue}>
                        {get(matchedData, 'department_info.department_name')}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Punch Time</Text>
                      <Text style={styles.detailValue}>
                        {dateTimeToShow(matchedData?.punch_time)}
                      </Text>
                    </View>
                    <View style={styles.detailRowNoBorder}>
                      <Text style={styles.detailLabel}>Punch State</Text>
                      <Text style={styles.detailValue}>
                        {punchStateLabel[matchedData?.punch_state] || '-'}
                      </Text>
                    </View>
                    <View style={styles.detailRowNoBorder}>
                      <Text style={styles.detailLabel}>Work Code</Text>
                      <Text style={styles.detailValue}>
                        {matchedData?.work_code}
                      </Text>
                    </View>
                    <View style={styles.detailRowNoBorder}>
                      <Text style={styles.detailLabel}>Reason</Text>
                      <Text style={styles.detailValueReason}>
                        {matchedData?.apply_reason || '-'}
                      </Text>
                    </View>
                  </View>
                  {matchedData?.approval_status === 1 && (
                    <View style={styles.actionButtonContainer}>
                      <TouchableOpacity
                        onPress={showRejectedConfirmDialog}
                        style={[
                          styles.actionButton,
                          matchedData?.approval_status === 4
                            ? styles.disabledButton
                            : styles.rejectButton,
                        ]}>
                        <Text style={styles.actionButtonText}>Reject</Text>
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
                        <Text style={styles.actionButtonText}>Approve</Text>
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
      <Modal
        animationType={'fade'}
        visible={approveConfirmVisible}
        transparent
        onRequestClose={() => {
          setApproveConfirmVisible(!approveConfirmVisible);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Approve</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to approve?
            </Text>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
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
                style={[styles.modalButton, styles.modalCancelButton]}>
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleApprove}
                style={[styles.modalButton, styles.modalApproveButton]}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalButtonText}>Approve</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType={'fade'}
        visible={rejectedConfirmVisible}
        transparent
        onRequestClose={() => {
          setRejectedConfirmVisible(!rejectedConfirmVisible);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reject</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to reject?
            </Text>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
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
                style={[styles.modalButton, styles.modalCancelButton]}>
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleRejected}
                style={[styles.modalButton, styles.modalRejectButton]}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalButtonText}>Reject</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    width: '100%',
    fontWeight: 'bold', // Equivalent to font-PublicSansBold
    color: 'black',
    textAlign: 'center',
    paddingRight: '15%',
  },
  contentArea: {
    flex: 1,
    height: '100%',
    borderRadius: 24, // Equivalent to rounded-3xl
  },
  scrollViewContent: {
    padding: 16,
    height: '100%',
    flex: 1,
  },
  detailsCard: {
    flex: 1,
    backgroundColor: 'white',
    height: '83%',
    padding: 12,
    borderRadius: 16, // Equivalent to rounded-2xl
    width: '100%',
    justifyContent: 'space-between',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4', // Adjusted from white to a lighter grey for visibility
    paddingBottom: 24,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10, // Added margin for spacing between rows
  },
  detailRowNoBorder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 24,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10, // Added margin for spacing between rows
  },
  detailLabel: {
    fontSize: 12,
    color: 'gray', // Equivalent to text-gray-400
    fontWeight: 'bold', // Equivalent to font-PublicSansBold
  },
  detailValue: {
    fontSize: 12,
    fontWeight: 'bold', // Equivalent to font-PublicSansBold
  },
  detailValueReason: {
    fontSize: 12,
    fontWeight: 'bold', // Equivalent to font-PublicSansBold
    // Removed fixed width, allowing content to dictate width or wrap
  },
  statusText: {
    fontSize: 12,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8, // Equivalent to rounded-lg
    fontWeight: 'bold', // Equivalent to font-PublicSansBold
  },
  rejectedStatus: {
    backgroundColor: 'rgba(228, 3, 3, 0.03)', // Equivalent to bg-[#E4030308]
    borderColor: '#E40303',
    color: '#E40303',
  },
  approvedStatus: {
    backgroundColor: 'rgba(8, 202, 15, 0.03)', // Equivalent to bg-[#08CA0F08]
    borderColor: '#08CA0F',
    color: '#08CA0F',
  },
  pendingStatus: {
    backgroundColor: 'rgba(209, 164, 4, 0.03)', // Equivalent to bg-[#D1A40408]
    borderColor: '#D1A404',
    color: '#D1A404',
  },
  revokedStatus: {
    backgroundColor: 'rgba(228, 3, 3, 0.03)', // Equivalent to bg-[#E4030308]
    borderColor: '#E40303',
    color: '#E40303',
  },
  actionButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 8, // Equivalent to gap-2
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30, // Equivalent to h-7.5
    padding: 8,
    borderRadius: 8, // Equivalent to rounded-lg
  },
  rejectButton: {
    width: '49%', // Equivalent to w-[50%] for flex-row gap-2
    backgroundColor: '#697CE3',
  },
  approveButton: {
    width: '49%', // Equivalent to w-[50%] for flex-row gap-2
    backgroundColor: '#697CE3',
  },
  disabledButton: {
    backgroundColor: '#B2BEB5', // Equivalent to bg-[#B2BEB5]
    width: '49%',
  },
  fullWidthButton: {
    width: '100%', // Equivalent to w-[100%]
    backgroundColor: '#697CE3',
  },
  actionButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600', // Equivalent to font-semibold-poppins
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
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
  textInputContainer: {
    paddingLeft: 8,
    paddingRight: 8,
    width: '100%',
  },
  textInput: {
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
  modalButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40, // Equivalent to h-10
    width: 80, // Equivalent to w-20
    padding: 8,
    borderRadius: 8, // Equivalent to rounded-lg
  },
  modalCancelButton: {
    borderWidth: 1,
    borderColor: '#697CE3',
  },
  modalCancelButtonText: {
    fontSize: 12,
    color: '#697CE3',
    fontWeight: '600', // Equivalent to font-semibold-poppins
  },
  modalApproveButton: {
    backgroundColor: '#697CE3',
  },
  modalRejectButton: {
    backgroundColor: '#cf3636',
  },
  modalButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600', // Equivalent to font-semibold-poppins
  },
});