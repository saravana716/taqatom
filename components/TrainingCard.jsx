import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { dateTimeToShow, formatDateTime } from '../utils/formatDateTime';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import ProfileServices from '../Services/API/ProfileServices';
import { formatErrorsToToastMessages } from '../utils/error-format';
import { useTranslation } from 'react-i18next';
import tokens from '../locales/tokens';
export default function TrainingCard({
  newItem,
  componentId,
  employeeId,
  payCodes,
  trainingList,
  getPayCodeList,
}) {
        const navigation=useNavigation()
    
    const {t,i18n}=useTranslation()
  const isRTL = i18n.language === 'ar';
  console.log("yyyyyyyyyyyyyyyyyyyy",isRTL);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [revokeConfirmVisible, setRevokeConfirmVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(false);
  const [formatStartDate, setFormatStartDate] = useState(
    newItem?.start_time || null,
  );
  const [dateStart, setDateStart] = useState(new Date());

  const [endDate, setEndDate] = useState(false);
  const [formatEndDate, setFormatEndDate] = useState(newItem?.end_time || null);
  const [dateEnd, setDateEnd] = useState(new Date());

  const [workCode, setWorkCode] = useState(newItem?.work_code || '');
  const [applyReason, setApplyReason] = useState(newItem?.apply_reason || '');
  const [showStartDateTime, setShowStartDateTime] = useState(false);
  const [showEndDateTime, setShowEndDateTime] = useState(false);

  const [payCode, setPayCode] = useState(newItem?.paycode_details?.id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [endDateError, setendDateError] = useState('');
  const [payCodeError, setPayCodeError] = useState('');
  const [startError, setStartError] = useState('');
  const [endError, setEndError] = useState('');

  const handleFulldetails = () => {
    navigation.navigate("TrainingRequestDetails",{employeeId,
          newItem,
          trainingList,
          payCodes,
          getPayCodeList})
 
  };

  const showDeleteConfirmDialog = () => {
    setDeleteConfirmVisible(true);
  };

  const showRevokeConfirmDialog = () => {
    setRevokeConfirmVisible(true);
  };

  const onDateChange = useCallback((event, selectedDate) => {
    if (selectedDate) {
      // const formattedDate = moment(selectedDate).format('DD MMMM'); // Commented out in original
      setDateStart(selectedDate);
      setStartDate(false);
      setShowStartDateTime(true);
    } else {
      setStartDate(false);
    }
  }, []);

  const onTimeChange = useCallback(
    (event, selectedTime) => {
      if (selectedTime) {
        const combinedDateTime = new Date(dateStart);
        combinedDateTime.setHours(selectedTime.getHours());
        combinedDateTime.setMinutes(selectedTime.getMinutes());
        const formattedDate = moment(combinedDateTime).format(
          'YYYY-MM-DDTHH:mm:ss',
        );
        setFormatStartDate(formattedDate);
        setShowStartDateTime(false);
      } else {
        setShowStartDateTime(false);
      }
    },
    [dateStart],
  );

  const onEndDateChange = useCallback((event, selectedDate) => {
    if (selectedDate) {
      // const formattedDate = moment(selectedDate).format('DD MMMM'); // Commented out in original
      setDateEnd(selectedDate);
      setEndDate(false);
      setShowEndDateTime(true);
    }
  }, []);

  const onEndTimeChange = useCallback(
    (event, selectedTime) => {
      if (selectedTime) {
        const combinedDateTime = new Date(dateEnd);
        combinedDateTime.setHours(selectedTime.getHours());
        combinedDateTime.setMinutes(selectedTime.getMinutes());
        const formattedDate = moment(combinedDateTime).format(
          'YYYY-MM-DDTHH:mm:ss',
        );
        setFormatEndDate(formattedDate);
        setShowEndDateTime(false);
      } else {
        setShowEndDateTime(false);
      }
    },
    [dateEnd],
  );

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.name}</Text>
      </View>
    );
  };

  const handleNumberChange = text => {
    setWorkCode(text);
  };

  const handleEditTraining = async () => {
    setendDateError('');
    setPayCodeError('');
    setStartError('');
    setEndError('');
    if (!formatStartDate) {
      setStartError('Start Date is required');
      return;
    } else if (!formatEndDate) {
      setEndError('End Date is Required');
      return;
    } else if (new Date(formatEndDate) <= new Date(formatStartDate)) {
      setendDateError('End Date must be after Start Date');
      return;
    } else if (!payCode) {
      setPayCodeError('Paycode is Required');
      return;
    }
    try {
      const response = await ProfileServices.editTrainingRequest({
        options: {
          employee: employeeId,
          start_time: formatDateTime(formatStartDate),
          end_time: formatDateTime(formatEndDate),
          pay_code: payCode,
          apply_reason: applyReason,
        },
        id: newItem?.id,
      });
      setIsLoading(false);
      setModalVisible(false);
      trainingList();

      Toast.show({
        type: 'success',
        text1: 'Updated Successfully',
        position: 'bottom',
      });
    } catch (error) {
      setIsLoading(false);
      formatErrorsToToastMessages(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await ProfileServices.deleteTrainingRequest({
        id: newItem?.id,
      });
      Toast.show({
        type: 'success',
        text1: 'Delete Success',
        position: 'bottom',
      });
      trainingList();
      setDeleteConfirmVisible(false);
    } catch (error) {
      formatErrorsToToastMessages(error);
    }
  };

  const handleRevoke = async () => {
    try {
      const response = await ProfileServices.postTrainingRevoke(newItem?.id);
      Toast.show({
        type: 'success',
        text1: 'Revoke Success',
        position: 'bottom',
      });
      getTrainingList();
      setRevokeConfirmVisible(false);
    } catch (error) {
      formatErrorsToToastMessages(error);
      setRevokeConfirmVisible(false);
    }
  };

  return (
    <>
      <View style={[styles.cardContainer, styles.cardBase]}>
        <TouchableOpacity onPress={handleFulldetails} style={styles.fullWidth} activeOpacity={1}>
          <View style={styles.cardContent}>
            <View style={styles.rowBetween}>
              <View>
                {newItem?.approval_status === 3 && (
                  <Text style={[styles.statusText, styles.statusRejected]}>
             {t(tokens.actions.reject)}
                    
                  </Text>
                )}
                {newItem?.approval_status === 2 && (
                  <Text style={[styles.statusText, styles.statusApproved]}>
              {t(tokens.actions.approve)}
                    
                  </Text>
                )}
                {newItem?.approval_status === 1 && (
                  <Text style={[styles.statusText, styles.statusPending]}>
              {t(tokens.actions.pending)}
                    
                  </Text>
                )}
                {newItem?.approval_status === 4 && (
                  <Text style={[styles.statusText, styles.statusRevoked]}>
              {t(tokens.actions.revoke)}
                    
                  </Text>
                )}
              </View>
              <View>
                <Text style={styles.labelDate}>
            {t(tokens.common.startDate)}

                </Text>
                <Text style={styles.valueDate}>
                  {dateTimeToShow(newItem?.start_time)}
                </Text>
              </View>
            </View>
            <View style={[styles.rowBetween, styles.paddingBottomSmall]}>
              <View>
                <Text style={styles.labelDate}>
              {t(tokens.common.endDate)}

                </Text>
                <Text style={styles.valueDate}>
                  {dateTimeToShow(newItem?.end_time)}
                </Text>
              </View>
              <View>
                <Text style={[styles.labelDate, styles.textAlignRight]}>
              {t(tokens.nav.payCode)}
                  
                </Text>
                <Text style={[styles.valueDate, styles.textAlignRight]}>
                  {newItem?.paycode_details?.name}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

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
    flexDirection: 'row',
    padding: 4, // p-1 equivalent (1 unit = 4px)
    backgroundColor: 'white', // bg-white
    alignItems: 'center', // items-center
    justifyContent: 'space-between', // justify-between
    borderRadius: 8, // rounded-xl (assuming 1 unit = 4px, 2xl is 8px)
    borderBottomWidth: 4, // border-b-4
    borderBottomColor: '#697CE3', // border-b-[#697CE3]
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
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
  fullWidth: {
    width: '100%', // w-full
  },
  cardContent: {
    height: 152, // h-38 (assuming 1 unit = 4px, 38*4 = 152)
    width: '100%', // w-full
    padding: 16, // p-4
    borderRadius: 8, // rounded-2xl (assuming 1 unit = 4px, 2xl is 8px)
  },
  rowBetween: {
    flexDirection: 'row', // flex-row
    justifyContent: 'space-between', // justify-between
    paddingBottom: 16, // pb-4
    alignItems: 'center', // items-center
  },
  paddingBottomSmall: {
    paddingBottom: 4, // pb-1
  },
  statusText: {
    fontSize: 12, // text-xs
    borderWidth: 1, // border
    paddingVertical: 4, // p-1 (vertical)
    paddingHorizontal: 8, // pl-2 pr-2
    borderRadius: 8, // rounded-lg
    // fontFamily: 'PublicSansBold', // Assuming this is a custom font, keep if defined elsewhere
    fontWeight: 'bold', // Assuming PublicSansBold implies bold
  },
  statusRejected: {
    backgroundColor: 'rgba(228, 3, 3, 0.03)', // bg-[#E4030308]
    borderColor: '#E40303', // border-[#E40303]
    color: '#E40303', // text-[#E40303]
  },
  statusApproved: {
    backgroundColor: 'rgba(8, 202, 15, 0.03)', // bg-[#08CA0F08]
    borderColor: '#08CA0F', // border-[#08CA0F]
    color: '#08CA0F', // text-[#08CA0F]
  },
  statusPending: {
    backgroundColor: 'rgba(209, 164, 4, 0.03)', // bg-[#D1A40408]
    borderColor: '#D1A404', // border-[#D1A404]
    color: '#D1A404', // text-[#D1A404]
  },
  statusRevoked: {
    backgroundColor: 'rgba(228, 3, 3, 0.03)', // bg-[#E4030308] (same as rejected in original)
    borderColor: '#E40303', // border-[#E40303] (same as rejected in original)
    color: '#E40303', // text-[#E40303] (same as rejected in original)
  },
  labelDate: {
    fontSize: 12, // text-xs
    color: '#A0A0A0', // text-gray-400 (using a more specific gray color)
    // fontFamily: 'PublicSansBold', // Assuming this is a custom font
    fontWeight: 'bold',
  },
  valueDate: {
    fontSize: 12, // text-xs
    // fontFamily: 'PublicSansBold', // Assuming this is a custom font
    fontWeight: 'bold',
  },
  textAlignRight: {
    textAlign: 'right', // text-right
  },
});