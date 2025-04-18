import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import ChatHeader from './chatHeader';
import MessageInput from './messageInput';
import { Ionicons } from '@expo/vector-icons';

const ChatRoomScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'Ahmed',
      text: 'did u finish the the job yet or not?',
      time: '8:30 pm',
      isMe: false,
    },
    {
      id: '2',
      sender: 'Me',
      text: 'Hello how are you',
      time: '8:30 pm',
      isMe: true,
      status: 'read',
    },
    {
      id: '3',
      sender: 'Ahmed',
      text: 'I am fine, thanks for asking!',
      time: '8:30 pm',
      isMe: false,
    },
  ]);

  const sendMessage = (text: string) => {
    if (text.trim() === '') return;

    const newMessage = {
      id: (messages.length + 1).toString(),
      sender: 'Me',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      status: 'unread',
    };

    setMessages([...messages, newMessage]);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <ChatHeader />

      {/* Messages */}
      <ScrollView className="flex-1 px-4 py-2">
        {messages.map((message) => (
          <View
            key={message.id}
            className={`mb-4 ${message.isMe ? 'items-end' : 'items-start'}`}
          >
            {/* Sender's Info */}
            {!message.isMe && (
              <View className="flex-row items-center mt-2">
                <Image
                  source={require('@/assets/images/Profile.png')}
                  className="w-10 h-10 rounded-full mr-2"
                />
                <Text className="text-sm text-[#6C757D] mb-10">{message.sender}</Text>
              </View>
            )}

           
            <View
              className={`max-w-[80%] ${
                message.isMe ? 'bg-[#147E93] mb-1' : 'bg-[#E0E0E0]'
              } rounded-2xl px-4 py-2 ml-14 mt-[-33]`}
            >
              {message.text && (
                <Text
                  className={`text-base ${
                    message.isMe ? 'text-white ' : 'text-[#030B19]'
                  }`}
                >
                  {message.text}
                </Text>
              )}
            </View>

            
            <View
              className={`flex-row items-center mt-1 ${
                message.isMe ? 'justify-end' : 'justify-start'
              }`}
            >
              <Text
                className={`text-xs ${
                  message.isMe ? 'text-[#6C757D] mb-6 ' : 'text-[#6C757D] ml-14 mb-2'
                }`}
              >
                {message.time}
              </Text>
              {message.isMe && (
                <Ionicons
                  name="checkmark-done"
                  size={16}
                  color={message.status === 'read' ? '#147E93' : '#6C757D'}
                  className="ml-1 mb-5"
                />
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Message Input */}
      <MessageInput onSend={sendMessage} />
    </View>
  );
};

export default ChatRoomScreen;