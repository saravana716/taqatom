import tokens from '@/locales/tokens';
import { myreducers } from '@/Store/Store';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
export default function RecentResignationComponent({newItem,getResignationList}) {
    const {t,i18n}=useTranslation()
  const isRTL = i18n.language === 'ar';
  
  
    const dispatch=useDispatch()
  const date = new Date(newItem?.updated_at);
const navigation=useNavigation()
  function truncateString(str, maxLength = 20) {
    if (!str) return '---';
    if (str.length <= maxLength) {
      return str;
    }
    return str.substring(0, maxLength - 3) + '...';
  }

  const handlePress = () => {
    navigation.navigate("IndividualResignation");
    dispatch(myreducers.sendNewItem(newItem))
      navigation.navigate("IndividualResignation", { getResignationList });

  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'reject':
        return styles.statusReject;
      case 'approve':
        return styles.statusApprove;
      case 'pending':
        return styles.statusPending;
      case 'withdraw':
        return styles.statusWithdraw;
      default:
        return {};
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'reject':
        return 'Rejected';
      case 'approve':
        return 'Approved';
      case 'pending':
        return 'Pending';
      case 'withdraw':
        return 'Cancelled';
      default:
        return '';
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.wrapper}>
        <View style={styles.card}>
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>
                {t(tokens.actions.resignDate)}

              </Text>
              <Text style={styles.value}>{newItem?.resign_date}</Text>
            </View>
            <View>
              <Text style={styles.label}>{t(tokens.actions.lastWorkingDate)}</Text>
              <Text style={styles.value}>{newItem?.lwd_date}</Text>
            </View>
            {newItem?.status === 'reject' && (
  <Text style={[styles.statusText, styles.rejectStatus]}>
    {t(tokens.actions.reject)}
  </Text>
)}
{newItem?.status === 'approve' && (
  <Text style={[styles.statusText, styles.approveStatus]}>
    {t(tokens.actions.approve)}
  </Text>
)}
{newItem?.status === 'pending' && (
  <Text style={[styles.statusText, styles.pendingStatus]}>
    {t(tokens.actions.pending)}
  </Text>
)}
{newItem?.status === 'withdraw' && (
  <Text style={[styles.statusText, styles.rejectStatus]}>
    {t(tokens.actions.cancelled)}
  </Text>
)}
          </View>

          {/* <View style={styles.rowBottom}>
            <View>
              <Text style={styles.label}>Reason</Text>
              <Text style={styles.value}>{truncateString(newItem?.reason, 13)}</Text>
            </View>
            <View>
              <Text style={styles.label}>LWD Reason</Text>
              <Text style={styles.value}>{truncateString(newItem?.lwd_reason, 13)}</Text>
            </View>
          </View> */}
         
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    marginBottom: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: '#697CE3',
    borderRadius: 16,
    padding: 16,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'white',
    paddingBottom: 12,
    alignItems: 'center',
  },
  rowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  label: {
    fontSize: 12,
    color: 'gray',
    fontWeight: '600',
  },
  value: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    fontWeight: '600',
    overflow: 'hidden',
  },
  statusReject: {
    backgroundColor: '#E4030308',
    borderColor: '#E40303',
    color: '#E40303',
  },
  statusApprove: {
    backgroundColor: '#08CA0F08',
    borderColor: '#08CA0F',
    color: '#08CA0F',
  },
  statusPending: {
    backgroundColor: '#D1A40408',
    borderColor: '#D1A404',
    color: '#D1A404',
  },
  statusWithdraw: {
    backgroundColor: '#E4030308',
    borderColor: '#E40303',
    color: '#E40303',
  },
   statusText: {
    fontSize: 12,
    paddingVertical: 4,    // p-1
    paddingHorizontal: 8,  // pl-2 pr-2
    borderRadius: 8,       // rounded-lg
    borderWidth: 1,
    fontFamily: 'PublicSans-Bold',
  },
  rejectStatus: {
    backgroundColor: '#E4030308',
    borderColor: '#E40303',
    color: '#E40303',
  },
  approveStatus: {
    backgroundColor: '#08CA0F08',
    borderColor: '#08CA0F',
    color: '#08CA0F',
  },
  pendingStatus: {
    backgroundColor: '#D1A40408',
    borderColor: '#D1A404',
    color: '#D1A404',
  },
});
