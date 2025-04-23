import { Text, TouchableOpacity, ViewStyle, TextStyle, View } from 'react-native';
import { useLanguage } from '@/src/i18n/LanguageContext';

interface CustomButtonProps {
  onPress: () => void;
  title: string;
  textStyles?: string;
  containerStyles?: string;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const CustomButton = ({
  onPress,
  title,
  textStyles = '',
  containerStyles = '',
  style = {},
  textStyle = {},
  disabled,
  iconLeft,
  iconRight,
}: CustomButtonProps) => {
  const { isRTL } = useLanguage();
  
  // Swap icons if RTL
  const leftIcon = isRTL ? iconRight : iconLeft;
  const rightIcon = isRTL ? iconLeft : iconRight;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`rounded-xl w-full min-h-[62px] justify-center items-center ${containerStyles} ${disabled ? 'opacity-50' : ''} `}
      onPress={onPress}
      style={style}
      disabled={disabled}
    >
      <View className={`flex-row items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        {leftIcon && <View className={`${isRTL ? 'ml-2' : 'mr-2'}`}>{leftIcon}</View>}
        <Text className={`font-semibold ${textStyles}`} style={textStyle}>
          {title}
        </Text>
        {rightIcon && <View className={`${isRTL ? 'mr-2' : 'ml-2'}`}>{rightIcon}</View>}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
