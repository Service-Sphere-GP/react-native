import { View, Text, TextInput } from 'react-native';
import React from 'react';

const SmallInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  onFocus,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: boolean;
  onFocus?: () => void;
}) => {
  return (
    <View className="mt-2 sm:mt-0">
      <Text className="text-[#363E4C] font-Roboto-Medium text-lg">{label}</Text>
      <TextInput
        className={`p-4 border-2 ${error ? 'border-[#FF5757]' : 'border-[#EDEDED]'} rounded-lg font-Roboto-Thin focus:outline-[#147E93] w-full sm:w-[200px] placeholder:text-[#363E4C]`}
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        onFocus={onFocus}
      />
    </View>
  );
};

export default SmallInput;
