

import React from 'react';
import {Image, Text, View} from 'react-native';

export default function KeyValue({name, Value}) {
  return (
    <View className="gap-1">
        <Text className="text-[12px]  text-gray-400">
            {name}
          </Text>
        <Text className="text-[15px] font-PublicSansBold">
            {Value}
          </Text>
    </View>
  );
}
