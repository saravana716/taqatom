import React from 'react';
import { Text, View } from 'react-native';
import { Iconify } from 'react-native-iconify';

export default function RequestLoanCard({ requestLoan, newItem }) {
  

  return (
    <View className="bg-[#6466F10D] rounded-2xl">
      <View className="bg-[#6466F1] h-18 p-4 rounded-2xl pl-4 pr-4 items-center space-x-3 flex-row rounded-b-none">
        <View className="bg-white p-1 rounded-full">
          <Iconify icon="majesticons:money-line" size={30} color="#6466F1" />
        </View>
        <View className="flex-row justify-between items-center">
          <View className="space-y-1">
            <Text className="text-base font-PublicSansBold  text-white ">
              SAR {newItem?.loan_amount}
            </Text>
            <Text className="text-xs  text-white ">
               {newItem?.loan_category ? `${newItem?.loan_category}` : ''}
            </Text>
            
          </View>
        </View>
      </View>
      <View className="p-2">
        <View className="flex-row justify-between p-2 items-center">
          <View className="space-y-1">
            <Text className="text-xs  text-black ">
              Interest Rate
            </Text>
            <Text className="text-md font-PublicSansBold  text-black ">
              {newItem?.interest_rate}
            </Text>
          </View>
          <View className="bg-[#E4E4E4] flex-row items-center rounded-xl justify-center p-1">
          <Iconify icon="radix-icons:dot-filled" size={20} color="#3F3748" />
          <Text className="text-[10px] pr-2 text-[#3F3748]">{newItem?.status}</Text>
        </View>
        </View>
      </View>
     
    </View>
  );
}
