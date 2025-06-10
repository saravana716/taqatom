import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import moment from 'moment';
import React, { useState } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { useSelector } from 'react-redux';
import ProfileServices from '../Services/API/ProfileServices';
import { formatErrorsToToastMessages } from '../utils/error-format';

export default function ExpenseScreen({navigation}) {
  const handleBack = () => {
    navigation.navigate("Dashboard")
  };
const selectorid=useSelector(function (data) {
    return data.empid
})
console.log(selectorid);

  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [fromDateShow, setFromDateShow] = useState(false);
  const [amount, setAmount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [formatExpectDate, setFormatExpectDate] = useState(null);
  const [layoutDescriptionName, setLayoutDescriptionName] = useState('');

  const data = [
    { label: 'Business Travel', layoutDescriptionName: 'Business Travel' },
    { label: 'Personal Travel', layoutDescriptionName: 'Personal Travel' },
    { label: 'Meals', layoutDescriptionName: 'Meals' },
    { label: 'Accommodation', layoutDescriptionName: 'Accommodation' },
    { label: 'Professional Development', layoutDescriptionName: 'Professional Development' },
    { label: 'Transportation', layoutDescriptionName: 'Transportation' },
    { label: 'Product Buy', layoutDescriptionName: 'Product Buy' },
    { label: 'Others', layoutDescriptionName: 'Others' },
  ];

  const renderItem = item => (
    <View style={styles.item}>
      <Text style={styles.textItem}>{item.label}</Text>
    </View>
  );

const handleFilePick = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*', // You can filter by file type here, e.g. 'application/pdf'
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.type === 'success') {
      console.log('Document picked:', result);
      // result.uri, result.name, result.size, result.mimeType
      // You can now upload or handle the file
    } else {
      console.log('Document picking cancelled');
    }
  } catch (error) {
    console.error('Document pick error:', error);
  }
};


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setFromDateShow(false);
    setFormatExpectDate(moment(currentDate).format('DD MMMM YYYY'));
    setDate(currentDate);
  };

  const convertToDate = date => {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  };

  const handleSubmit = async () => {
    if (selectorid && date && layoutDescriptionName && amount && description) {
      try {
        await ProfileServices.submitExpenseData({
          employee_id:selectorid,
          Expense_Date: convertToDate(date),
          Expense_Category: layoutDescriptionName,
          Amount: amount,
          Description: description,
        });
        setConfirmVisible(true);
      } catch (err) {
        formatErrorsToToastMessages(err);
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'All Fields required',
        position: 'bottom',
      });
    }
  };

  const handleNumberChange = text => {
    if (!isNaN(text)) {
      setAmount(text);
    }
  };

  const navigateDashboard = () => {
   navigation.navigate("Dashboard")
  };

  return (
    <View style={styles.containerFull}>
      <View>
        <Image source={require('../assets/images/Assets/blue-bg.png')} style={styles.headerImage} />
        <View style={styles.headerOverlay}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="angle-left" size={30} color="white" />

          </TouchableOpacity>
          <Text style={styles.headerTitle}>Expense</Text>
        </View>
      </View>

      <ScrollView style={styles.formContainer}>
        <View style={styles.card}>
          <View style={styles.formSection}>
            <TouchableOpacity
              onPress={() => setFromDateShow(true)}
              style={styles.datePicker}>
              <Text style={styles.dateText}>
                {formatExpectDate || 'Select Expense Date'}
              </Text>
<Icon name="calendar-alt" size={23} color="#697CE3" />
            </TouchableOpacity>
            {fromDateShow && (
              <DateTimePicker
                value={date}
                mode="date"
                is24Hour={true}
                onChange={onChange}
              />
            )}

            <View style={styles.dropdownWrapper}>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                labelField="label"
                valueField="layoutDescriptionName"
                placeholder="Select Expense Category"
                searchPlaceholder="Search..."
                value={layoutDescriptionName}
                onChange={item => setLayoutDescriptionName(item.layoutDescriptionName)}
                renderItem={renderItem}
              />
            </View>

            <TextInput
              placeholder="Amount"
              value={amount}
              onChangeText={handleNumberChange}
              style={styles.input}
              keyboardType="numeric"
            />

            <TextInput
              placeholder="Description"
              style={styles.textArea}
              multiline
              numberOfLines={8}
              onChangeText={setDescription}
              textAlignVertical="top"
            />

            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitText}>Submit Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        visible={confirmVisible}
        transparent
        onRequestClose={() => setConfirmVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setConfirmVisible(false)}
              style={styles.closeButton}>
              <Image
                source={require('../assets/images/Assets/Close-icon.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>

            <View style={styles.modalImageWrapper}>
              <Image
                source={require('../assets/images/Assets/completed.png')}
                style={styles.successIcon}
              />
            </View>
            <Text style={styles.modalTitle}>Your Expense Applied Successfully</Text>
            <Text style={styles.modalSubtitle}>Request sent for approval</Text>
            <TouchableOpacity
              onPress={() => {
                navigateDashboard();
                setConfirmVisible(false);
              }}
              style={styles.doneButton}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  containerFull: {
    flex: 1,
    backgroundColor: '#F1F3F4',
  },
  headerImage: {
    width: '100%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerOverlay: {
    position: 'absolute',
    top: 28,
    left: 16,
    right: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  formContainer: {
    position: 'absolute',
    top: 100,
    width: '100%',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  formSection: {
    gap: 20,
  },
  datePicker: {
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#697CE3',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownWrapper: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#697CE3',
  },
  dropdown: {
    height: 50,
    paddingHorizontal: 8,
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
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#697CE3',
    paddingHorizontal: 20,
    fontSize: 14,
  },
  textArea: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#697CE3',
    paddingHorizontal: 20,
    paddingTop: 10,
    fontSize: 14,
  },
  submitButton: {
    height: 48,
    backgroundColor: '#697CE3',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeIcon: {
    width: 28,
    height: 28,
  },
  modalImageWrapper: {
    marginTop: 12,
    marginBottom: 16,
  },
  successIcon: {
    width: 80,
    height: 80,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#AAB3BB',
    textAlign: 'center',
    marginBottom: 24,
  },
  doneButton: {
    backgroundColor: '#6466F1',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 36,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
