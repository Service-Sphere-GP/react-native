import { View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

const Rating = ({ value }: { value: number | undefined }) => {
  return (
    <View className="flex-row">
      {Array.from({ length: 5 }).map(
        (_, i) =>
          value !== undefined && (
            <Ionicons
              key={i}
              name={i < Math.round(value) ? 'star' : 'star-outline'}
              size={20}
              color="#FFD700"
              className="mx-1"
            />
          ),
      )}
    </View>
  );
};

export default Rating;
