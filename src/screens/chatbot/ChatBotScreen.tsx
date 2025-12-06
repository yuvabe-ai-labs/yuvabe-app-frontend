import { useNavigation } from '@react-navigation/native';
import { Bot, ChevronLeft, User } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useModelSessionStore } from '../../store/useModelSessionStore';
import ChatDownloadIndicator from './models/modelDownloadIndicator';

import { Message, useChatStore } from '../../store/chatStore';
import { useModelDownloadStore } from '../../store/modelDownloadStore';

import { loadLlama, qwenChat } from '../chatbot/llama/llamaManager';
import { MODEL_3_PATH } from '../chatbot/models/modelPaths';
import { loadOnnxModel } from '../chatbot/models/onnxLoader';
import { retrieveContextForQuery } from '../chatbot/rag/ragPipeline';

import { styles } from './ChatbotStyles';
import DefaultSuggestions from './models/DefaultSuggestions';

const ChatScreen = () => {
  const {
    messages,
    chatHistory,
    addMessage,
    updateMessage,
    addTurn,
    suggestionsUsed,
    setSuggestionsUsed,
  } = useChatStore();

  const [input, setInput] = useState('');
  const session = useModelSessionStore(s => s.session);
  const modelsLoaded = useModelSessionStore(s => s.modelsLoaded);
  const setSession = useModelSessionStore(s => s.setSession);
  const setModelsLoaded = useModelSessionStore(s => s.setModelsLoaded);

  const downloadState = useModelDownloadStore(state => state.downloadState);

  const streamedTextRef = useRef('');
  const currentBotMsgIdRef = useRef<string | null>(null);
  const isDisabled = downloadState !== 'completed' || !session || !modelsLoaded;
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const flatListRef = useRef<FlatList>(null);
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 40);
  }, [messages]);

  useEffect(() => {
    StatusBar.setBackgroundColor('#ffffff', true);
    StatusBar.setBarStyle('dark-content', true);
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      if (session && modelsLoaded) return;

      try {
        const s = await loadOnnxModel();
        setSession(s);

        await loadLlama(MODEL_3_PATH);
        setModelsLoaded(true);
      } catch (err) {
        console.log('Model load error:', err);
      }
    };

    if (downloadState === 'completed') {
      loadModels();
    }
  }, [downloadState]);

  useEffect(() => {
    if (messages.length === 0) {
      setSuggestionsUsed(false);
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    Keyboard.dismiss();

    setSuggestionsUsed(true);

    if (!session) return;

    const text = input.trim();
    setInput('');

    const userMsg = {
      id: `${Date.now()}`,
      text,
      from: 'user' as const,
    };

    addMessage(userMsg);

    const botMsgId = `${Date.now() + 1}`;
    currentBotMsgIdRef.current = botMsgId;
    streamedTextRef.current = '';

    addMessage({
      id: botMsgId,
      text: 'Thinking...',
      from: 'bot' as const,
      streaming: true,
    });

    try {
      const { contextText } = await retrieveContextForQuery(session, text);

      const modelUserMessage = contextText
        ? `Context:\n${contextText}\n\nUser Question: ${text} Respond concisely on what user asked for and use image whenever relevant to the user question and less elaboration`
        : text;

      const finalText = await qwenChat(
        [...chatHistory, { role: 'user', content: modelUserMessage }],
        token => {
          streamedTextRef.current += token;
          updateMessage(botMsgId, {
            text: streamedTextRef.current,
            streaming: true,
          });
        },
      );

      updateMessage(botMsgId, {
        text: finalText,
        streaming: false,
        renderKey: Date.now(),
      });

      addTurn({ role: 'user', content: text });
      addTurn({ role: 'assistant', content: finalText });
    } catch (e) {
      updateMessage(botMsgId, {
        text: `Error: ${e}`,
        streaming: false,
      });
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.from === 'user';

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          marginVertical: 6,
          alignItems: 'flex-start',
        }}
      >
        {!isUser && (
          <Bot
            size={30}
            color="#555"
            style={{
              marginRight: 8,
              marginTop: 4,
            }}
          />
        )}

        <View
          style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}
        >
          {item.from === 'bot' && !item.streaming ? (
            <Markdown
              style={{
                body: {
                  color: 'black',
                  fontSize: 14,
                  fontFamily: 'gilroy-regular',
                },
                image: {
                  width: 240,
                  height: 240,
                  borderRadius: 12,
                  marginTop: 8,
                },
              }}
            >
              {item.text}
            </Markdown>
          ) : (
            <Text style={isUser ? styles.text : styles.botText}>
              {item.text}
            </Text>
          )}
        </View>

        {isUser && (
          <User
            size={30}
            color="#555"
            style={{
              marginLeft: 8,
              marginTop: 4,
            }}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: '#fff',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={28} color="#000" />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              marginLeft: 10,
            }}
          >
            Yuvabot
          </Text>
        </View>
        <Image
          source={require('../../assets/logo/yuvabe-logo.png')}
          style={{
            width: 40,
            height: 40,
            resizeMode: 'contain',
          }}
        />
      </View>
      <ChatDownloadIndicator />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={
          keyboardVisible ? (StatusBar.currentHeight ?? 10) : 0
        }
      >
        {!suggestionsUsed && messages.length === 0 && (
          <View style={{ flex: 1 }}>
            <DefaultSuggestions
              onSelect={text => {
                setInput(text);
                Keyboard.dismiss();
              }}
            />
          </View>
        )}

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 12 }}
          style={{ flex: 1 }}
        />

        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={
              isDisabled ? 'Downloading models...' : 'Type a message...'
            }
            placeholderTextColor="#999"
            style={[
              styles.input,
              isDisabled && { backgroundColor: '#e5e5e5', color: '#999' },
            ]}
            editable={!isDisabled}
            returnKeyType="send"
            onSubmitEditing={!isDisabled ? sendMessage : undefined}
          />

          <TouchableOpacity
            style={[
              styles.sendBtn,
              isDisabled && { backgroundColor: '#b5b5b5' },
            ]}
            onPress={!isDisabled ? sendMessage : undefined}
            disabled={isDisabled}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
