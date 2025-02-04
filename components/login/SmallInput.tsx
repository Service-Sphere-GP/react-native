import { View, Text, TextInput } from 'react-native';
import React from 'react';

const SmallInput = ({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) => {
  return (
    <View className="mt-2 sm:mt-0">
      <Text className="text-[#363E4C] font-Roboto-Medium text-lg">{label}</Text>
      <TextInput
        className="p-4 border-2 border-[#EDEDED] rounded-lg font-Roboto-Thin focus:outline-[#147E93] min-w-[180px] placeholder:text-[#363E4C]"
        placeholder={placeholder}
      />
    </View>
  );
};

export default SmallInput;
