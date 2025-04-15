import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

interface MessageInputProps {
  onSend: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    onSend(text); 
    setText(''); 
  };

  return (
    <View className="flex-row items-center bg-white px-4 py-3 border-t border-gray-300">
      
      <TouchableOpacity>
        <Ionicons name="image-outline" size={24} color="#6C757D" />
      </TouchableOpacity>
      
      <TouchableOpacity className="ml-3">
        <Ionicons name="attach-outline" size={24} color="#6C757D" />
      </TouchableOpacity>
     
      <View className="flex-row flex-1 items-center bg-[#E9ECEF] rounded-full px-4 py-2 mx-4">
        <TextInput
          placeholder="Type a message"
          placeholderTextColor="#6C757D"
          className="flex-1 text-[#030B19] text-sm"
          value={text}
          onChangeText={setText}
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