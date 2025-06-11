import React from 'react';
import {Text, View} from 'react-native';

export default function ClockActivityComponent() {
  return (
    <View className="flex-row p-3 bg-white items-center justify-between rounded-xl">
      <View className=" space-y-2">
        <Text className="text-xs text-[#919EAB] font-semibold-poppins">
          18 Dec 2023
        </Text>
        <Text className="text-md font-semibold-poppins">
          09:15 Am - 06:35 Pm
        </Text>
      </View>
      <View className=" space-y-1">
        <Text className="text-lg text-right text-black font-semibold-poppins">
          09:15 Hrs
        </Text>
        <Text className="text-[9px] text-right text-[#919EAB] font-semibold-poppins">
          15Mins Delay
        </Text>
      </View>
    </View>
  );
}
