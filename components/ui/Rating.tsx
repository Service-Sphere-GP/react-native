import { View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

const Rating = ({ value }: { value: number | undefined }) => {
  return (
    <View className="flex-row">
      {Array.from({ length: 5 }).map((_, i) => {
        if (value === undefined) return null;

        let iconName: 'star-outline' | 'star' | 'star-half' = 'star-outline';
        if (value >= i + 1) {
          iconName = 'star';
        } else if (value >= i + 0.5) {
          iconName = 'star-half';
        }

        return (
          <Ionicons
            key={i}
            name={iconName}
            size={20}
            color="#FFD700"
            className="mx-1"
          />
        );
      })}
    </View>
  );
};

export default Rating;
