import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useLanguage } from '@/src/i18n/LanguageContext';

interface OtpInputProps {
  length?: number;
  onComplete?: (code: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<TextInput[]>([]);
  const { isRTL } = useLanguage();
  
  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit) && onComplete) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // For OTP inputs, we don't reverse the order of the digits,
  // but we can still apply RTL styling to the container
  return (
    <View className={`flex-row justify-center items-center gap-2.5`}>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <View key={index} className="items-center">
            <TextInput
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={styles.input}
              maxLength={1}
              keyboardType="number-pad"
              value={otp[index]}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              autoFocus={index === 0}
              accessible={true}
              accessibilityLabel={`OTP digit ${index + 1}`}
            />
            <View
              style={[
                styles.underline,
                { backgroundColor: otp[index] ? '#147E93' : '#676B73' },
              ]}
            />
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: 40,
    height: 55,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    color: '#3634C',
  },
  underline: {
    height: 2,
    width: 35,
    marginTop: 3,
  },
});

export default OtpInput;
