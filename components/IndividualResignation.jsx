/* eslint-disable react-native/no-inline-styles */
import { useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector } from 'react-redux';
import ResignationService from '../Services/API/ResignationServices';
import { formatErrorsToToastMessages } from '../utils/error-format';

export default function IndividualResignation({
 navigation}) {
  const handleBack = () => {
    navigation.navigate("RecentResignationComponent")
  };
const newItem=useSelector(function (data) {
    return data.newItem
})
const route = useRoute();
 const getResignationList = route.params?.getResignationList;

console.log("newitem",newItem);

  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleWithdraw = async () => {
    try {
      const options = {
        employee_id: newItem?.employee,
        resign_id: newItem?.id,
      };
      console.log("kk",options);
      
      const response = await ResignationService.updateStatus(options);
console.log("rrrrrrrrrrrrr",options);

      Toast.show({
        type: 'success',
        text1: 'Withdraw Successful',
        position: 'bottom',
        bottomOffset: 80,
      });
     getResignationList()
      setTimeout(() => {
        navigation.navigate("ResignationScreen")
      }, 1000);
    } catch (error) {
      console.log(error);
      formatErrorsToToastMessages(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="angle-left" size={30} color="black" />
                    </TouchableOpacity>
          <Text style={styles.headerText}>View</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollContainer}>
          <View style={styles.card}>
            <View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Approval Status</Text>
                {newItem?.status === 'reject' && (
                  <Text style={styles.rejectStatus}>Rejected</Text>
                )}
                {newItem?.status === 'approve' && (
                  <Text style={styles.approveStatus}>Approved</Text>
                )}
                {newItem?.status === 'pending' && (
                  <Text style={styles.pendingStatus}>Pending</Text>
                )}
                {newItem?.status === 'withdraw' && (
                  <Text style={styles.withdrawStatus}>Cancelled</Text>
                )}
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Resign Date</Text>
                <Text style={styles.value}>{dayjs(newItem?.resign_date).format('DD MMMM, YYYY')}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Last Working Date</Text>
                <Text style={styles.value}>{dayjs(newItem?.lwd_date).format('DD MMMM, YYYY')}</Text>
              </View>
              <View style={styles.infoColumn}>
                <Text style={styles.label}>Reason</Text>
                <Text style={styles.value}>{newItem?.reason ?? '-'}</Text>
              </View>
              <View style={styles.infoColumn}>
                <Text style={styles.label}>LWD Reason</Text>
                <Text style={styles.value}>{newItem?.lwd_reason || '-'}</Text>
              </View>
            </View>
            <View style={styles.withdrawContainer}>
              <TouchableOpacity
                onPress={() => setConfirmVisible(true)}
                style={[styles.withdrawButton, {
                  backgroundColor: !(newItem?.status === 'pending' || newItem?.status === 'Pending') ? '#D3D3D3' : '#697CE3'
                }]}
                disabled={!(newItem?.status === 'pending' || newItem?.status === 'Pending')}>
                <Text style={styles.withdrawText}>Withdraw</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Modal
            animationType={'fade'}
            visible={confirmVisible}
            transparent
            onRequestClose={() => setConfirmVisible(!confirmVisible)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Are You Sure you want to Withdraw Resignation Request?</Text>
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    onPress={() => setConfirmVisible(false)}
                    style={styles.noButton}>
                    <Text style={styles.noText}>NO</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setConfirmVisible(false);
                      handleWithdraw();
                    }}
                    style={styles.yesButton}>
                    <Text style={styles.yesText}>YES</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', backgroundColor: '#f8f9fa' },
  headerContainer: { paddingBottom: 48 },
  headerRow: { flexDirection: 'row', alignItems: 'center', height: '6%' },
  backButton: { paddingLeft: 4 },
  headerText: { fontSize: 20, color: '#000', fontWeight: '700', textAlign: 'center', width: '100%', paddingRight: '15%' },
  scrollContainer: { paddingTop: 20, padding: 20, backgroundColor: '#fff', borderRadius: 16, width: '100%' },
  card: { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 16, justifyContent: 'space-between' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 24, borderBottomWidth: 1, borderColor: '#fff' },
  infoColumn: { paddingBottom: 24, borderBottomWidth: 1, borderColor: '#fff' },
  label: { fontSize: 12, color: 'gray', fontWeight: '700' },
  value: { fontSize: 12, fontWeight: '700' },
  rejectStatus: { fontSize: 12, padding: 4, paddingHorizontal: 8, backgroundColor: '#E4030308', borderRadius: 8, color: '#E40303', borderWidth: 1, borderColor: '#E40303', fontWeight: '700' },
  approveStatus: { fontSize: 12, padding: 4, paddingHorizontal: 8, backgroundColor: '#08CA0F08', borderRadius: 8, color: '#08CA0F', borderWidth: 1, borderColor: '#08CA0F', fontWeight: '700' },
  pendingStatus: { fontSize: 12, padding: 4, paddingHorizontal: 8, backgroundColor: '#D1A40408', borderRadius: 8, color: '#D1A404', borderWidth: 1, borderColor: '#D1A404', fontWeight: '700' },
  withdrawStatus: { fontSize: 12, padding: 4, paddingHorizontal: 8, backgroundColor: '#E4030308', borderRadius: 8, color: '#E40303', borderWidth: 1, borderColor: '#E40303', fontWeight: '700' },
  withdrawContainer: { justifyContent: 'flex-end' },
  withdrawButton: { alignItems: 'center', justifyContent: 'center', height: 48, padding: 8, borderRadius: 12 },
  withdrawText: { fontSize: 18, color: '#fff', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.8)', alignItems: 'center', justifyContent: 'center' },
  modalContent: { backgroundColor: 'white', borderRadius: 7, width: '90%', elevation: 10, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 16, fontWeight: '600', marginTop: 8 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, width: '100%' },
  noButton: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 48, padding: 8, borderRadius: 8, borderWidth: 1, borderColor: 'red', marginRight: 8 },
  noText: { fontSize: 12, color: 'red', fontWeight: '600' },
  yesButton: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 48, padding: 8, borderRadius: 8, backgroundColor: '#697CE3' },
  yesText: { fontSize: 12, color: 'white', fontWeight: '600' },
});