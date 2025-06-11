import CheckBox from '@react-native-community/checkbox';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Iconify} from 'react-native-iconify';
import tokens from '../locales/tokens';

export default function PayslipComponent({navigation}) {
  const {t} = useTranslation();
  function formatDate(dateString) {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(date);
    return formattedDate;
  };
  const handlePayslipPreview = () => {
    Navigation.push(componentId, {
      component: {
        name: 'PayslipPreview',
        passProps: {
          newItem,
          employeeFullDetails,
          payrollData,
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
        },
      },
    });
  };
  return (
    <View className="flex-row p-3 bg-white items-center justify-between rounded-xl">
      <View className="flex-row items-center space-x-2">
        <Image source={require('../assets/images/Assets/table-report.png')} />
        <View className=" space-y-1">
          <Text className="text-md font-semibold-poppins">
            {formatDate(newItem?.start_date)}
          </Text>
          <Text className="text-[10px] text-[#919EAB] font-semibold-poppins">
            {newItem?.start_date?.split('T')[0]} -{' '}
            {newItem?.end_date?.split('T')[0]}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={handlePayslipPreview}
        className="flex-row space-x-1 items-center">
        <View className="space-y-1">
          <Text className="text-base text-right text-black font-semibold-poppins">
            {newItem?.net_pay} SAR
          </Text>
          <Text className="text-[8px] text-right text-[#919EAB] font-semibold-poppins">

            {t(tokens.messages.paidFor)} {newItem?.total_days??'-'}{' '}
            {t(tokens.common.days)}
          </Text>
        </View>
        <Iconify icon="mingcute:right-line" size={30} color="#697CE3" />
      </TouchableOpacity>
    </View>
  );
}
