import React from 'react';
import {Text, View} from 'react-native';
import {Iconify} from 'react-native-iconify';

export default function LoanCard({ status, requestLoan, newItem }) {
  console.log('newItem', newItem);

  return (
    <View className="bg-[#6466F10D] rounded-2xl">
      <View className="bg-[#6466F1] h-18 p-4 rounded-2xl pl-4 pr-4 items-center space-x-3 flex-row rounded-b-none">
        <View className="bg-white p-1 rounded-full">
          <Iconify icon="majesticons:money-line" size={30} color="#6466F1" />
        </View>
        <View className="flex-row justify-between items-center">
          <View className="space-y-1">
            <Text className="text-lg font-PublicSansBold  text-white ">
              SAR {newItem?.loan_amount} {newItem?.loan_category ? `- ${newItem?.loan_category}` : ''}
            </Text>
            
          </View>
        </View>
      </View>
      <View className="p-2">
        <View className="flex-row justify-between border-b border-[#919EAB7A] p-2 items-center">
          <View className="space-y-1">
            <Text className="text-xs  text-black ">
              EMI Amount
            </Text>
            <Text className="text-md font-PublicSansBold  text-black ">
              SAR {newItem?.emi_amount}
            </Text>
          </View>
          <View className="space-y-1 items-end">
              <Text className="text-xs font-PublicSansBold  text-[#64748B] ">
                Outstanding Amount
              </Text>
            <Text className="text-md  text-black ">{newItem?.outstanding_amount}</Text>
          </View>
        </View>
      </View>
      <View className="flex-row justify-between p-3 items-center">
      
        <View className="space-y-2">
          <Text className="text-[10px] font-PublicSansBold  text-[#64748B] ">
            Repayment EMI Term
          </Text>
          <Text className="text-md pr-2 font-PublicSansBold ">{newItem?.emicompletedterms_inmonth} Out of {newItem?.repaymentterms_inmonth}</Text>
        </View>
        <View className="bg-[#E4E4E4] flex-row items-center rounded-xl justify-center p-1">
          <Iconify icon="radix-icons:dot-filled" size={20} color="#3F3748" />
          <Text className="text-[10px] pr-2 text-[#3F3748]">{newItem?.status}</Text>
        </View>
      </View>
    </View>
  );
}
