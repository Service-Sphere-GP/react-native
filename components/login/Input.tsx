import { View, Text, TextInput } from 'react-native';
import React from 'react';

const Input = ({
  label,
  placeholder,
  isPassword,
}: {
  label: string;
  placeholder: string;
  isPassword: boolean;
}) => {
  return (
    <View className="w-full mt-2">
      <Text className="text-[#363E4C] font-Roboto-Medium text-lg">{label}</Text>
      <TextInput
        className="p-4 border-2 border-[#EDEDED] rounded-lg font-Roboto-Thin focus:outline-[#147E93] placeholder:text-[#363E4C]"
        placeholder={placeholder}
        secureTextEntry={isPassword}
      />
    </View>
  );
};

export default Input;
