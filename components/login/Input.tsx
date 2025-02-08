import { View, Text, TextInput } from 'react-native';

const Input = ({
  label,
  placeholder,
  isPassword,
  value,
  onChangeText,
  error,
  onFocus,
}: {
  label: string;
  placeholder: string;
  isPassword: boolean;
  value: string;
  onChangeText: (text: string) => void;
  error?: boolean;
  onFocus?: () => void;
}) => {
  return (
    <View className="w-full mt-2">
      <Text className="text-[#363E4C] font-Roboto-Medium text-lg">{label}</Text>
      <TextInput
        className={`p-4 border-2 ${error ? 'border-[#FF5757]' : 'border-[#EDEDED]'} rounded-lg font-Roboto-Thin focus:outline-[#147E93] placeholder:text-[#363E4C]`}
        placeholder={placeholder}
        secureTextEntry={isPassword}
        onChangeText={onChangeText}
        value={value}
        onFocus={onFocus}
      />
    </View>
  );
};

export default Input;
