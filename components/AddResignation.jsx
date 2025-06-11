import React, { useEffect, useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import get from 'lodash/get';
import moment from 'moment';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useSelector } from 'react-redux';
import ProfileServices from '../Services/API/ProfileServices';
import ResignationService from '../Services/API/ResignationServices';
import { formatErrorsToToastMessages } from '../utils/error-format';

export default function AddResignation({route,navigation}) {
      const { dataCheck, setDataCheck } = route.params;
      const employeeFullDetails = useSelector(data => data.employeeFullDetails.id);
  const [resignationDate, setResignationDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [formatExpectDate, setFormatExpectDate] = useState(null);
  const [emiStartDate, setEmiStartDate] = useState();
  const [settings, setSettings] = useState([]);
  const [alternativeEmail, setAlternativeEmail] = useState('');
  const [reason, setReason] = useState('');
  const [lwdReason, setLwdReason] = useState('');
  const [alternativeNumber, setAlternativeNumber] = useState('');
  const [fromDateShow, setFromDateShow] = useState(false);
  const [endDateShow, setEndDateShow] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleBack = () => navigation.navigate("ResignationScreen");

  const fetchConfig = async () => {
    try {
      const res = await ResignationService.getConfig();
      setSettings(res);
    } catch (error) {
      formatErrorsToToastMessages(error);
    }
  };
console.log("empid",employeeFullDetails);

  useEffect(() => {
    fetchConfig();
  }, []);

  const onChange = (event, selectedDate) => {
    const currentSelectDate = selectedDate || resignationDate;
    setFromDateShow(false);
    setResignationDate(currentSelectDate);
    setFormatExpectDate(moment(currentSelectDate).format('DD MMMM YYYY'));
  };

  const onChangeEnd = (event, selectedDate) => {
    const currentSelectDate = selectedDate || resignationDate;
    setEndDateShow(false);
    setEndDate(currentSelectDate);
    setEmiStartDate(moment(currentSelectDate).format('DD MMMM YYYY'));
  };

  const handleNumberChange = text => {
    if (!isNaN(text)) setAlternativeNumber(text);
  };

  const handleResignation = async () => {
    try {
        const datas={
          employee: employeeFullDetails,
          alternative_email: alternativeEmail,
          alternative_contact: alternativeNumber,
          resign_date: moment(resignationDate).format('YYYY-MM-DD'),
          lwd_date: moment(endDate).format('YYYY-MM-DD'),
          reason: reason,
          lwd_reason: lwdReason,
        }
        console.log("datas",datas);
        
      if (employeeFullDetails && resignationDate && endDate && reason) {
        await ProfileServices.postResignationDetails(datas);
        Toast.show({ type: 'success', text1: 'Resignation Applied', position: 'bottom' });
        setDataCheck(!dataCheck);
        setTimeout(() => navigation.navigate("ResignationScreen"), 1000);
      } else {
        Toast.show({ type: 'error', text1: 'All Fields required', position: 'bottom' });
      }
    } catch (error) {
      formatErrorsToToastMessages(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Icon name="angle-left" size={30} color="black" />
                  </TouchableOpacity>
        <Text style={styles.headerText}>Apply Resignation</Text>
      </View>
      <View style={styles.contentWrapper}>
        <View style={styles.contentBox}>
          <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
            {fromDateShow && (
              <DateTimePicker
                value={resignationDate}
                mode="date"
                minimumDate={new Date()}
                is24Hour={true}
                onChange={onChange}
              />
            )}
            <TouchableOpacity onPress={() => setEndDateShow(true)} style={styles.inputRow}>
              <Text style={styles.label}>Last Working Date</Text>
              <Text style={styles.label}>{endDate ? dayjs(endDate).format('DD MMMM YYYY') : 'Select Date'}</Text>
                            <Icon name="calendar-check-o" size={20} color="lightgray" />
                              </TouchableOpacity>
            {endDateShow && (
              <DateTimePicker
                value={endDate}
                mode="date"
                minimumDate={new Date()}
                is24Hour={true}
                display="default"
                onChange={onChangeEnd}
                maximumDate={() => {
                  const isNoticePeriod = get(settings, '0.settings.isNoticePeriod');
                  if (!isNoticePeriod) return null;
                  const days = get(settings, '0.settings.noticePeriod');
                  return dayjs().add(days, 'day').toDate();
                }}
              />
            )}
            <TextInput style={styles.input} placeholder="Alternative Email" onChangeText={setAlternativeEmail} />
            <TextInput style={styles.input} placeholder="Alternative Number" value={alternativeNumber} onChangeText={handleNumberChange} />
            <TextInput
              style={styles.textarea}
              placeholder="Reason"
              editable
              multiline
              textAlignVertical="top"
              onChangeText={setReason}
              numberOfLines={4}
            />
            <TextInput
              style={styles.textarea}
              placeholder="Last Working Date Reason"
              editable
              multiline
              textAlignVertical="top"
              onChangeText={setLwdReason}
              numberOfLines={4}
            />
            <TouchableOpacity onPress={() => (employeeFullDetails && resignationDate && endDate && reason ? setConfirmVisible(true) : Toast.show({ type: 'error', text1: 'All Fields required', position: 'bottom' }))} style={styles.submitButton}>
              <Text style={styles.submitText}>Apply Resignation</Text>
            </TouchableOpacity>
            <Modal animationType={'fade'} visible={confirmVisible} transparent onRequestClose={() => setConfirmVisible(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Are You Sure you want to Apply for Resignation?</Text>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity onPress={() => setConfirmVisible(false)} style={styles.cancelButton}>
                      <Text style={styles.cancelText}>No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setConfirmVisible(false); handleResignation(); }} style={styles.confirmButton}>
                      <Text style={styles.confirmText}>Yes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </ScrollView>
        </View>
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8FF' },
  headerContainer: { flexDirection: 'row', padding: 20, alignItems: 'center', position: 'relative' },
  backButton: { position: 'absolute', left: 12, zIndex: 10 },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#000', textAlign: 'center', width: '100%' },
  contentWrapper: { flex: 1, justifyContent: 'space-between', padding: 10, paddingBottom: 40 },
  contentBox: { backgroundColor: '#FFF', padding: 15, borderRadius: 24 },
  inputRow: { height: 56, borderRadius: 16, borderColor: '#ccc', borderWidth: 1, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  label: { fontSize: 14, color: '#333' },
  input: { height: 56, borderRadius: 16, borderColor: '#ccc', borderWidth: 1, paddingLeft: 20, marginBottom: 10 },
  textarea: { borderRadius: 16, borderColor: '#ccc', borderWidth: 1, paddingLeft: 20, marginBottom: 10 },
  submitButton: { alignItems: 'center', justifyContent: 'center', height: 48, padding: 10, borderRadius: 16, backgroundColor: '#697CE3', marginTop: 10 },
  submitText: { fontSize: 16, color: '#FFF', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.8)', alignItems: 'center', justifyContent: 'center' },
  modalContent: { backgroundColor: 'white', borderWidth: 1, borderColor: '#fff', borderRadius: 7, width: '90%', padding: 20, elevation: 10, alignItems: 'center' },
  modalTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 10, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 },
  cancelButton: { width: '48%', height: 48, borderWidth: 1, borderColor: 'red', alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  cancelText: { fontSize: 14, color: 'red', fontWeight: 'bold' },
  confirmButton: { width: '48%', height: 48, backgroundColor: '#697CE3', alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  confirmText: { fontSize: 14, color: '#FFF', fontWeight: 'bold' },
});
