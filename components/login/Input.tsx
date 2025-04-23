import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useState, useRef } from 'react';
import { getTextStyle } from '@/src/utils/fontUtils';
import { useLanguage } from '@/src/i18n/LanguageContext';

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
  // If isRTL is not provided, use the value from context
  const { isRTL: contextRTL } = useLanguage();
  const isRightToLeft = isRTL !== undefined ? isRTL : contextRTL;
  const textStyle = getTextStyle(isRightToLeft);

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
      <Text 
        className={`text-[#363E4C] text-lg ${textStyle.className}`}
        style={textStyle.style}
      >
        {label}
      </Text>
      <TextInput
        className={`p-4 border-2 ${error && !isFocusedRef.current ? 'border-[#FF5757]' : 'border-[#EDEDED]'} rounded-lg focus:outline-[#147E93] placeholder:text-[#363E4C]`}
        placeholder={placeholder}
        secureTextEntry={isPassword}
        onChangeText={onChangeText}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[
          isRightToLeft ? styles.rtlInput : styles.ltrInput,
          textStyle.style
        ]}
      />
      {error && !isFocusedRef.current && (
        <View className={`flex-row items-center mt-2 ${isRightToLeft ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
          <Text 
            className={`text-[#FF5757] text-base ${textStyle.className}`}
            style={textStyle.style}
          >
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
