import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useRef } from 'react';
import { getTextStyle } from '@/src/utils/fontUtils';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

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
  const [passwordVisible, setPasswordVisible] = useState(false);
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

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <View className="w-full mt-2">
      <Text 
        className={`text-[#363E4C] text-lg ${textStyle.className}`}
        style={textStyle.style}
      >
        {label}
      </Text>
      <View className="relative">
        <TextInput
          className={`p-4 border-2 ${error && !isFocusedRef.current ? 'border-[#FF5757]' : 'border-[#EDEDED]'} rounded-lg focus:outline-[#147E93] placeholder:text-[#363E4C]`}
          placeholder={placeholder}
          secureTextEntry={isPassword && !passwordVisible}
          onChangeText={onChangeText}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            isRightToLeft ? styles.rtlInput : styles.ltrInput,
            textStyle.style,
            { 
              paddingRight: isPassword && !isRightToLeft ? 50 : 16,
              paddingLeft: isPassword && isRightToLeft ? 50 : 16 
            }
          ]}
        />
        {isPassword && (
          <TouchableOpacity 
            onPress={togglePasswordVisibility}
            className={`absolute ${isRightToLeft ? 'left-4' : 'right-4'} top-0 bottom-0 justify-center`}
          >
            <Ionicons 
              name={passwordVisible ? "eye-off" : "eye"} 
              size={22} 
              color="#676B73" 
            />
          </TouchableOpacity>
        )}
      </View>
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
