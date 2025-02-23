import { View, Text, TextInput } from 'react-native';
import { useState, useRef } from 'react';

const Input = ({
  label,
  placeholder,
  isPassword,
  value,
  onChangeText,
  error,
  errorMessage,
}: {
  label: string;
  placeholder: string;
  isPassword: boolean;
  value: string;
  onChangeText: (text: string) => void;
  error: boolean;
  errorMessage: string;
}) => {
  const isFocusedRef = useRef(false);
  const [, forceUpdate] = useState(false);

  const handleFocus = () => {
    isFocusedRef.current = true;
    forceUpdate((prev) => !prev);
  };

  const handleBlur = () => {
    isFocusedRef.current = false;
    forceUpdate((prev) => !prev);
  };

  return (
    <View className="w-full mt-2">
      <Text className="text-[#363E4C] font-Roboto-Medium text-lg">{label}</Text>
      <TextInput
        className={`p-4 border-2 ${error && !isFocusedRef.current ? 'border-[#FF5757]' : 'border-[#EDEDED]'} rounded-lg font-Roboto-Thin focus:outline-[#147E93] placeholder:text-[#363E4C]`}
        placeholder={placeholder}
        secureTextEntry={isPassword}
        onChangeText={onChangeText}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {error && !isFocusedRef.current && (
        <Text className="text-[#FF5757] text-left font-Roboto-Medium text-base mt-2">
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

export default Input;
