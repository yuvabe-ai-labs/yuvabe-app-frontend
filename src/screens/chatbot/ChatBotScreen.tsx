import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { styles } from './ChatbotStyles';

type Message = {
  id: string;
  text: string;
  from: 'user' | 'bot';
};

export const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! 👋', from: 'bot' },
    { id: '2', text: 'Hi there! How are you?', from: 'user' },
    { id: '3', text: "I'm your friendly Yuvabe assistant 😊", from: 'bot' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMsg: Message = {
      id: String(Date.now()),
      text: input,
      from: 'user',
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Fake bot reply after 1s
    setTimeout(() => {
      const botReply: Message = {
        id: String(Date.now() + 1),
        text: "Cool! I'll respond from backend soon 😄",
        from: 'bot',
      };
      setMessages(prev => [...prev, botReply]);
    }, 1000);
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.bubble,
        item.from === 'user' ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text style={[styles.text, item.from === 'bot' && { color: '#000' }]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.key}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Input Bar */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.touch}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

