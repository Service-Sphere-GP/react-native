import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useState, useRef } from 'react';

const Input = ({
  label,
  placeholder,
  isPassword,
  value,
  onChangeText,
  error,
  errorMessage,
  isRTL,
}: {
  label: string;
  placeholder: string;
  isPassword: boolean;
  value: string;
  onChangeText: (text: string) => void;
  error: boolean;
  errorMessage: string;
  isRTL?: boolean;
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
      <Text className={`text-[#363E4C] font-Roboto-Medium text-lg ${isRTL ? 'text-right' : 'text-left'}`}>
        {label}
      </Text>
      <TextInput
        className={`p-4 border-2 ${error && !isFocusedRef.current ? 'border-[#FF5757]' : 'border-[#EDEDED]'} rounded-lg font-Roboto-Thin focus:outline-[#147E93] placeholder:text-[#363E4C]`}
        placeholder={placeholder}
        secureTextEntry={isPassword}
        onChangeText={onChangeText}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[
          isRTL ? styles.rtlInput : styles.ltrInput
        ]}
      />
      {error && !isFocusedRef.current && (
        <View className={`flex-row items-center mt-2 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
          <Text className={`text-[#FF5757] font-Roboto-Medium text-base ${isRTL ? 'text-right' : 'text-left'}`}>
            {errorMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ltrInput: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  rtlInput: {
    textAlign: 'right',
    writingDirection: 'rtl',
  }
});

export default Input;
