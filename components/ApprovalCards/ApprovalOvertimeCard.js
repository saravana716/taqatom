import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { dateTimeToShow } from '../../utils/formatDateTime';

import { Toast } from 'react-native-toast-message/lib/src/Toast';
import ProfileServices from '../../Services/API/ProfileServices';
import { formatErrorsToToastMessages } from '../../utils/error-format';

export default function ApprovalOvertimeCard({
  newItem,
  employeeId,
  getOvertimeList,
}) {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [approveConfirmVisible, setApproveConfirmVisible] = useState(false);
  const [rejectedConfirmVisible, setRejectedConfirmVisible] = useState(false);

  const handleFulldetails = () => {
    navigation.push('ApprovalOvertimeDetails', {
      employeeId,
      newItem,
      getOvertimeList,
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
      const response = await ProfileServices.postOvertimeApprove(newItem?.id);
      Toast.show({
        type: 'success',
        text1: 'Approve Success',
        position: 'bottom',
      });
      getOvertimeList();
      setApproveConfirmVisible(false);
    } catch (error) {
      formatErrorsToToastMessages(error);
      setApproveConfirmVisible(false);
    }
  };

  const handleRejected = async () => {
    try {
      const response = await ProfileServices.postOvertimeReject(newItem?.id);
      Toast.show({
        type: 'success',
        text1: 'Reject Success',
        position: 'bottom',
      });
      getOvertimeList();
      setRejectedConfirmVisible(false);
    } catch (error) {
      formatErrorsToToastMessages(error);
      setRejectedConfirmVisible(false);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return 'Pending';
      case 2:
        return 'Approved';
      case 3:
        return 'Rejected';
      case 4:
        return 'Revoked';
      default:
        return '';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 1:
        return styles.pending;
      case 2:
        return styles.approved;
      case 3:
        return styles.rejected;
      case 4:
        return styles.revoked;
      default:
        return {};
    }
  };

  return (
    <>
      <View style={[styles.cardContainer]}>
        <TouchableOpacity onPress={handleFulldetails} style={{ width: '100%' }} activeOpacity={1}>
          <View style={styles.innerCard}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={[styles.statusText, getStatusStyle(newItem?.approval_status)]}>
                  {getStatusLabel(newItem?.approval_status)}
                </Text>
              </View>
              <View>
                <Text style={styles.labelText}>Start Date</Text>
                <Text style={styles.valueText}>{dateTimeToShow(newItem?.start_time)}</Text>
              </View>
            </View>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.labelText}>End Date</Text>
                <Text style={styles.valueText}>{dateTimeToShow(newItem?.end_time)}</Text>
              </View>
              <View>
                <Text style={[styles.labelText, { textAlign: 'right' }]}>Pay Code</Text>
                <Text style={[styles.valueText, { textAlign: 'right' }]}>
                  {newItem?.paycode_details?.name}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Approve Modal */}
      <Modal
        animationType={'fade'}
        visible={approveConfirmVisible}
        transparent
        onRequestClose={() => setApproveConfirmVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Approve</Text>
            <Text style={styles.modalMessage}>Are you sure you want to approve?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => setApproveConfirmVisible(false)}
                style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleApprove}
                style={styles.approveButton}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#fff" />
                ) : (
                  <Text style={styles.approveButtonText}>Approve</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reject Modal */}
      <Modal
        animationType={'fade'}
        visible={rejectedConfirmVisible}
        transparent
        onRequestClose={() => setRejectedConfirmVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Reject</Text>
            <Text style={styles.modalMessage}>Are you sure you want to reject?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => setRejectedConfirmVisible(false)}
                style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleRejected}
                style={[styles.approveButton, { backgroundColor: '#cf3636' }]}> 
                {isLoading ? (
                  <ActivityIndicator size="large" color="#fff" />
                ) : (
                  <Text style={styles.approveButtonText}>Reject</Text>
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
  cardContainer: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 12,
    borderBottomWidth: 4,
    borderBottomColor: '#697CE3',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  innerCard: {
    height: 150,
    width: '100%',
    padding: 16,
    borderRadius: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
  },
  statusText: {
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontWeight: 'bold',
  },
  pending: {
    backgroundColor: '#D1A40408',
    borderColor: '#D1A404',
    color: '#D1A404',
    borderWidth: 1,
  },
  approved: {
    backgroundColor: '#08CA0F08',
    borderColor: '#08CA0F',
    color: '#08CA0F',
    borderWidth: 1,
  },
  rejected: {
    backgroundColor: '#E4030308',
    borderColor: '#E40303',
    color: '#E40303',
    borderWidth: 1,
  },
  revoked: {
    backgroundColor: '#E4030308',
    borderColor: '#E40303',
    color: '#E40303',
    borderWidth: 1,
  },
  labelText: {
    fontSize: 12,
    color: 'gray',
    fontWeight: 'bold',
  },
  valueText: {
    fontSize: 12,
    fontWeight: 'bold',
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
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'flex-end',
    width: '100%',
    gap: 20,
    padding: 9,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 40,
    padding: 8,
    borderRadius: 8,
    borderColor: '#697CE3',
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 12,
    color: '#697CE3',
    fontWeight: '600',
  },
  approveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 80,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#697CE3',
  },
  approveButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
});
