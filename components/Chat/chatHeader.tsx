import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { getTextStyle } from '@/src/utils/fontUtils';

interface ChatHeaderProps {
  receiverName?: string;
  receiverImage?: string;
  onOpenFeedbackModal?: () => void; // Added prop for feedback modal
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  receiverName = 'Chat',
  receiverImage,
  onOpenFeedbackModal,
}) => {
  const router = useRouter();
  const { t } = useTranslation(['chat']);
  const { isRTL } = useLanguage();
  const textStyle = getTextStyle(isRTL);

  return (
    <View
      className={`items-center justify-between px-4 py-2 bg-white shadow-sm mt-8 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <View
        className={`flex-row items-center ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <TouchableOpacity onPress={() => router.push('/bookings')}>
          <Image
            source={require('@/assets/images/leftArrow.png')}
            className="w-6 h-6"
            style={isRTL ? { transform: [{ scaleX: -1 }] } : {}}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Image
          source={
            receiverImage
              ? { uri: receiverImage }
              : require('@/assets/images/Profile.png')
          }
          className={`rounded-full ${isRTL ? 'mr-4' : 'ml-4'}`}
          style={{ width: 40, height: 40 }}
        />
        <Text
          className={`${isRTL ? 'mr-2' : 'ml-2'} text-lg font-Roboto-Medium text-[#030B19]`}
        >
          {receiverName}
        </Text>
      </View>

      {/* Icons */}
      <View className="flex-row items-center space-x-4">
        <TouchableOpacity onPress={onOpenFeedbackModal}>
          <Ionicons name="checkmark-circle" size={24} color="#147E93" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatHeader;
