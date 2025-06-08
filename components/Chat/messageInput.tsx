import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { getTextStyle } from '@/src/utils/fontUtils';

interface MessageInputProps {
  onSend: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [text, setText] = useState('');
  const { t } = useTranslation(['chat']);
  const { isRTL } = useLanguage();
  const textStyle = getTextStyle(isRTL);

  const handleSend = () => {
    onSend(text);
    setText('');
  };

  return (
    <View className="flex-row items-center bg-white px-4 py-3 border-t border-gray-300">
      <View
        className={`flex-1 items-center bg-[#E9ECEF] rounded-full px-4 py-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
      >
        <TextInput
          placeholder={t('chat:typeMessage')}
          placeholderTextColor="#6C757D"
          className="flex-1 text-[#030B19] text-sm outline-none"
          value={text}
          onChangeText={setText}
          onKeyPress={(e) => {
            if (e.nativeEvent.key === 'Enter') {
              handleSend();
            }
          }}
          style={{
            textAlign: isRTL ? 'right' : 'left',
            writingDirection: isRTL ? 'rtl' : 'ltr',
            ...textStyle.style,
          }}
        />
        <TouchableOpacity>
          <Ionicons name="happy-outline" size={20} color="#6C757D" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="ml-3" onPress={handleSend}>
        <MaterialIcons name="send" size={24} color="#147E93" />
      </TouchableOpacity>
    </View>
  );
};

export default MessageInput;
