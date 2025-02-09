import React from 'react';
import { Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';

interface CustomButtonProps {
  onPress: () => void;
  title: string;
  textStyles?: string;
  containerStyles?: string;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  disabled?: boolean;
}

const CustomButton = ({
  onPress,
  title,
  textStyles = '',
  containerStyles = '',
  style = {},
  textStyle = {},
  disabled,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`rounded-xl min-h-[62px] justify-center items-center ${containerStyles}`}
      onPress={onPress}
      style={style}
      disabled={disabled}
    >
      <Text className={`font-semibold ${textStyles}`} style={textStyle}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
