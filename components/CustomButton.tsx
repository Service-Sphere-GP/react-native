import React from "react";
import { Text, TouchableOpacity, ViewStyle, TextStyle } from "react-native";

interface CustomButtonProps {
    onPress: () => void;
    title: string;
    textStyles?: string;
    containerStyles?: string;
    style?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle | TextStyle[];
}

const CustomButton = ({
    onPress,
    title,
    textStyles = "",
    containerStyles = "",
    style = {},
    textStyle = {},
}: CustomButtonProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            className={`rounded-xl min-h-[62px] justify-center items-center ${containerStyles}`}
            onPress={onPress}
            style={style}
        >
            <Text className={`font-semibold  ${textStyles}`} style={textStyle}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

export default CustomButton;