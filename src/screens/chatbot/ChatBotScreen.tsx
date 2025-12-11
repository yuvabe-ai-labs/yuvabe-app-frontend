import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
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
import { BotIcon, UserIcon } from '../../utils/customIcons';
import ChatDownloadIndicator from './models/modelDownloadIndicator';

import { Message, useChatStore } from '../../store/chatStore';
import { useModelDownloadStore } from '../../store/modelDownloadStore';

import { loadLlama, qwenChat } from '../chatbot/llama/llamaManager';
import { MODEL_3_PATH } from '../chatbot/models/modelPaths';
import { loadOnnxModel } from '../chatbot/models/onnxLoader';
import { retrieveContextForQuery } from '../chatbot/rag/ragPipeline';

import { TEXT_STYLES } from '../../utils/theme';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const navigation = useNavigation();
  const MAX_WIDTH = Dimensions.get('window').width * 0.7;

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

  const markdownImageRenderer = (node: any) => {
    const uri = node.attributes.src;

    return (
      <Image
        source={{ uri }}
        style={{
          width: MAX_WIDTH,
          height: undefined,
          aspectRatio: 1,
          resizeMode: 'contain',
          borderRadius: 12,
          marginTop: 8,
        }}
      />
    );
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (isProcessing) return;
    setIsProcessing(true);

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
        ? `Context:\n${contextText}\n\n Respond to this user query properly, concisely and with keywords in markdown and add image when relevant to question. User Question: ${text} `
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
        text: `${e}`,
        streaming: false,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.from === 'user';

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          marginVertical: 0,
          alignItems: 'flex-start',
        }}
      >
        {!isUser && (
          <BotIcon
            width={30}
            height={30}
            color="#592AC7"
            style={{
              marginRight: 8,
              marginTop: 8,
            }}
          />
        )}

        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.botBubble,
            item.streaming && styles.thinkingBubble,
          ]}
        >
          {item.streaming ? (
            <Text style={styles.thinkingText}>{item.text || 'Thinking...'}</Text>
          ) : item.from === 'bot' ? (
            <Markdown
              style={{
                body: {
                  color: '#592AC7',
                  fontSize: 14,
                  fontWeight: '600',
                  fontFamily: 'gilroy-regular',
                },
              }}
              rules={{
                image: markdownImageRenderer,
              }}
            >
              {item.text}
            </Markdown>
          ) : (
            <Text style={styles.text}>{item.text}</Text>
          )}
        </View>

        {isUser && (
          <UserIcon
            width={30}
            height={30}
            color="#592AC7"
            style={{
              marginLeft: 8,
              marginTop: 10,
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ width: 28 }}
        >
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>

        <Text
          style={{
            ...TEXT_STYLES.title,
            flex: 1,
            fontSize: 18,
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          YuvaBot
        </Text>
        <View style={{ width: 28 }} />
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
          <View
            pointerEvents="box-none"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
              zIndex: 20,
              elevation: 20,
            }}
          >
            <DefaultSuggestions
              onSelect={text => {
                if (isDisabled) return;
                setInput(text);
                Keyboard.dismiss();
              }}
            />
          </View>
        )}
        <FlatList
          pointerEvents="auto"
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
              isDisabled
                ? 'Downloading models...'
                : isProcessing
                  ? 'Thinking...'
                  : 'Type a message...'
            }
            placeholderTextColor="#999"
            style={[
              styles.input,
              isDisabled && { backgroundColor: '#e5e5e5', color: '#999' },
            ]}
            editable={!isDisabled && !isProcessing}
            returnKeyType="send"
            onSubmitEditing={!isDisabled ? sendMessage : undefined}
          />

          <TouchableOpacity
            style={[
              styles.sendBtn,
              (isDisabled || isProcessing) && { backgroundColor: '#b5b5b5' },
            ]}
            onPress={!isDisabled && !isProcessing ? sendMessage : undefined}
            disabled={isDisabled || isProcessing}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
