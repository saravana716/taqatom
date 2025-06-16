import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { dateTimeToShow, formatDateTime } from '../utils/formatDateTime';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from 'react-native-popup-menu';
import { Iconify } from 'react-native-iconify';
import ProfileServices from '../Services/API/ProfileServices';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import tokens from '@/locales/tokens';
import { useTranslation } from 'react-i18next';
export default function OverTimeCard({
  newItem,
  componentId,
  employeeId,
  payCodesList,
  getPayCodeList,
  overtimeList
}) {
  const navigation = useNavigation();
  const {t,i18n}=useTranslation()
  const isRTL = i18n.language === 'ar';
  console.log("yyyyyyyyyyyyyyyyyyyy",isRTL);
  const handleFulldetails = () => {
    navigation.navigate("OvertimeRequestDetails",{ employeeId,
          newItem,
          payCodesList,
          getPayCodeList,
          overtimeList})
   
  };

  useEffect(() => {
    getPayCodeList();
  }, []);

  return (
    <View style={[styles.cardContainer, styles.borderBottomHighlight]}>
      <TouchableOpacity
        onPress={handleFulldetails}
        activeOpacity={1}
        style={{ width: '100%' }}>
        <View style={styles.cardInner}>
          <View style={styles.rowBetween}>
            <View>
              {newItem?.approval_status === 3 && (
                <Text style={[styles.statusText, styles.reject]}>
              {t(tokens.actions.reject)}
                  
                </Text>
              )}
              {newItem?.approval_status === 2 && (
                <Text style={[styles.statusText, styles.approve]}>
                    {t(tokens.actions.approve)}
                </Text>
              )}
              {newItem?.approval_status === 1 && (
                <Text style={[styles.statusText, styles.pending]}>
                                 {t(tokens.actions.pending)}

                </Text>
              )}
              {newItem?.approval_status === 4 && (
                <Text style={[styles.statusText, styles.revoke]}>
                               {t(tokens.actions.revoke)}

                </Text>
              )}
            </View>
            <View>
              <Text style={styles.labelSmall}>
            {t(tokens.common.startDate)}

              </Text>
              <Text style={styles.valueSmall}>
                {dateTimeToShow(newItem?.start_time)}
              </Text>
            </View>
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.labelSmall}>
              {t(tokens.common.endDate)}

              </Text>
              <Text style={styles.valueSmall}>
                {dateTimeToShow(newItem?.end_time)}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.labelSmall}>
              {t(tokens.nav.payCode)}

              </Text>
              <Text style={styles.valueSmall}>
                {newItem?.paycode_details?.name}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 10,
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
  borderBottomHighlight: {
    borderBottomWidth: 4,
    borderBottomColor: '#697CE3',
  },
  cardInner: {
    height: 150,
    width: '100%',
    padding: 16,
    borderRadius: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
  },
  statusText: {
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontWeight: 'bold',
    borderWidth: 1,
    textAlign: 'center',
  },
  approve: {
    backgroundColor: '#08CA0F08',
    borderColor: '#08CA0F',
    color: '#08CA0F',
  },
  reject: {
    backgroundColor: '#E4030308',
    borderColor: '#E40303',
    color: '#E40303',
  },
  pending: {
    backgroundColor: '#D1A40408',
    borderColor: '#D1A404',
    color: '#D1A404',
  },
  revoke: {
    backgroundColor: '#E4030308',
    borderColor: '#E40303',
    color: '#E40303',
  },
  labelSmall: {
    fontSize: 12,
    color: 'gray',
    fontWeight: 'bold',
  },
  valueSmall: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
