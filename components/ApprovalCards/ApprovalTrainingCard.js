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

export default function ApprovalTrainingCard({ newItem, employeeId, getTrainingList }) {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [approveConfirmVisible, setApproveConfirmVisible] = useState(false);
  const [rejectedConfirmVisible, setRejectedConfirmVisible] = useState(false);

  const handleFulldetails = () => {
     navigation.navigate('ApprovalTrainingDetails', {
     employeeId, newItem, getTrainingList
    });
 
  };

  const handleApprove = async () => {
    try {
      const response = await ProfileServices.postTrainingApprove(newItem?.id);
      Toast.show({ type: 'success', text1: 'Approve Success', position: 'bottom' });
      getTrainingList();
      setApproveConfirmVisible(false);
    } catch (error) {
      formatErrorsToToastMessages(error);
      setApproveConfirmVisible(false);
    }
  };

  const handleRejected = async () => {
    try {
      const response = await ProfileServices.postTrainingReject(newItem?.id);
      Toast.show({ type: 'success', text1: 'Reject Success', position: 'bottom' });
      getTrainingList();
      setRejectedConfirmVisible(false);
    } catch (error) {
      formatErrorsToToastMessages(error);
      setRejectedConfirmVisible(false);
    }
  };

  return (
    <>
      <View style={[styles.cardContainer, styles.card]}>
        <TouchableOpacity onPress={handleFulldetails} activeOpacity={1} style={{ width: '100%' }}>
          <View style={styles.cardContent}>
            <View style={styles.rowBetween}>
              <View>
                {newItem?.approval_status === 3 && (
                  <Text style={[styles.badge, styles.rejectBadge]}>Rejected</Text>
                )}
                {newItem?.approval_status === 2 && (
                  <Text style={[styles.badge, styles.approveBadge]}>Approved</Text>
                )}
                {newItem?.approval_status === 1 && (
                  <Text style={[styles.badge, styles.pendingBadge]}>Pending</Text>
                )}
                {newItem?.approval_status === 4 && (
                  <Text style={[styles.badge, styles.revokeBadge]}>Revoked</Text>
                )}
              </View>
              <View>
                <Text style={styles.label}>Start Date</Text>
                <Text style={styles.value}>{dateTimeToShow(newItem?.start_time)}</Text>
              </View>
            </View>

            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.label}>End Date</Text>
                <Text style={styles.value}>{dateTimeToShow(newItem?.end_time)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.label}>Paycode</Text>
                <Text style={styles.value}>{newItem?.paycode_details?.name}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Approve Modal */}
      <Modal
        animationType="fade"
        visible={approveConfirmVisible}
        transparent
        onRequestClose={() => setApproveConfirmVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Approve</Text>
            <Text style={styles.modalMessage}>Are you sure you want to approve this training?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => setApproveConfirmVisible(false)}
                style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleApprove}
                style={styles.approveBtn}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#fff" />
                ) : (
                  <Text style={styles.approveBtnText}>Approve</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reject Modal */}
      <Modal
        animationType="fade"
        visible={rejectedConfirmVisible}
        transparent
        onRequestClose={() => setRejectedConfirmVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Reject</Text>
            <Text style={styles.modalMessage}>Are you sure you want to reject this training?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => setRejectedConfirmVisible(false)}
                style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleRejected}
                style={styles.rejectBtn}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#fff" />
                ) : (
                  <Text style={styles.rejectBtnText}>Reject</Text>
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
    backgroundColor: '#fff',
    borderRadius: 12,
    borderBottomWidth: 4,
    borderBottomColor: '#697CE3',
    marginVertical: 6,
    padding: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  cardContent: {
    padding: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  badge: {
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontWeight: 'bold',
    borderWidth: 1,
    overflow: 'hidden',
  },
  approveBadge: {
    backgroundColor: '#08CA0F08',
    borderColor: '#08CA0F',
    color: '#08CA0F',
  },
  rejectBadge: {
    backgroundColor: '#E4030308',
    borderColor: '#E40303',
    color: '#E40303',
  },
  pendingBadge: {
    backgroundColor: '#D1A40408',
    borderColor: '#D1A404',
    color: '#D1A404',
  },
  revokeBadge: {
    backgroundColor: '#E4030308',
    borderColor: '#E40303',
    color: '#E40303',
  },
  label: {
    fontSize: 12,
    color: '#888',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    borderRadius: 7,
    width: '90%',
    elevation: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalMessage: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'flex-end',
    width: '100%',
    gap: 20,
  },
  cancelBtn: {
    borderColor: '#697CE3',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelBtnText: {
    fontSize: 12,
    color: '#697CE3',
    fontWeight: '600',
  },
  approveBtn: {
    backgroundColor: '#697CE3',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  approveBtnText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  rejectBtn: {
    backgroundColor: '#cf3636',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  rejectBtnText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
});
