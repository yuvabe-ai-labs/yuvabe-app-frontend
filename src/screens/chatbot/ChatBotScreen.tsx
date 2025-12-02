// ChatScreen.tsx
import { InferenceSession } from 'onnxruntime-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useModelDownloadStore } from '../../store/modelDownloadStore';
import { SYSTEM_PROMPT } from '../../utils/constants';
import { loadLlama, qwenChat } from '../chatbot/llama/llamaManager';
import { MODEL_3_PATH } from '../chatbot/models/modelPaths';
import { loadOnnxModel } from '../chatbot/models/onnxLoader';
import { retrieveContextForQuery } from '../chatbot/rag/ragPipeline';
import { styles } from './ChatbotStyles';
import DefaultSuggestions from './models/DefaultSuggestions';
import ChatDownloadIndicator from './models/modelDownloadIndicator';

type Message = {
  id: string;
  text: string; // either streaming plain text or final markdown
  from: 'user' | 'bot';
  streaming?: boolean; // true while generation is in progress
};

type ChatRole = 'system' | 'user' | 'assistant';

type ChatTurn = {
  role: ChatRole;
  content: string;
};

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [session, setSession] = useState<InferenceSession | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const downloadState = useModelDownloadStore(state => state.downloadState);

  const streamedTextRef = useRef<string>(''); // persistent buffer for current stream
  const currentBotMsgIdRef = useRef<string | null>(null); // id of currently streaming bot message

  const [chatHistory, setChatHistory] = useState<ChatTurn[]>([
    {
      role: 'system',
      content: SYSTEM_PROMPT,
    },
  ]);

  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);
    return () => clearTimeout(timeout);
  }, [messages]);

  useEffect(() => {
    if (downloadState === 'downloading') {
      setMessages([
        {
          id: 'sys-downloading',
          text: 'Models are downloading. Chat will be ready soon.',
          from: 'bot',
          streaming: false,
        },
      ]);
    } else if (downloadState === 'error') {
      setMessages([
        {
          id: 'sys-error',
          text: 'Model download failed. Please restart the app to try again.',
          from: 'bot',
          streaming: false,
        },
      ]);
    } else if (downloadState === 'completed') {
      setMessages(prev => {
        if (prev.length === 0) return prev;
        return prev;
      });
    }
  }, [downloadState]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const s = await loadOnnxModel();
        setSession(s);
        await loadLlama(MODEL_3_PATH);
        setModelsLoaded(true);
      } catch (err) {
        console.log('Error loading models in ChatScreen:', err);
        setMessages(prev => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            text: 'Models are downloaded but failed to load. Please restart the app.',
            from: 'bot',
            streaming: false,
          },
        ]);
      }
    };

    if (downloadState === 'completed' && !modelsLoaded) {
      loadModels();
    }
    if (downloadState === 'completed' && modelsLoaded) {
      setMessages(prev => {
        if (prev.length === 0 || prev[0].id === 'sys-downloading') {
          return [
            {
              id: 'welcome-msg',
              from: 'bot',
              text: 'Hey! I’m your Yuvabe Assistant. What would you like to know?',
              streaming: false,
            },
          ];
        }
        return prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadState, modelsLoaded]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (downloadState !== 'completed') {
      setMessages(prev => [
        ...prev,
        {
          id: `${Date.now()}`,
          text: 'Models are not ready yet. Please wait until download finishes.',
          from: 'bot',
          streaming: false,
        },
      ]);
      return;
    }

    if (!session) {
      setMessages(prev => [
        ...prev,
        {
          id: `${Date.now()}`,
          text: 'Models are loading. Please wait a moment and try again.',
          from: 'bot',
          streaming: false,
        },
      ]);
      return;
    }

    const text = input;
    setInput('');

    const userMsg: Message = {
      id: `${Date.now()}`,
      text,
      from: 'user',
      streaming: false,
    };
    setMessages(prev => [...prev, userMsg]);

    const botMsgId = `${Date.now() + 1}`;
    currentBotMsgIdRef.current = botMsgId;
    streamedTextRef.current = '';

    // push a streaming placeholder
    setMessages(prev => [
      ...prev,
      {
        id: botMsgId,
        text: 'Thinking...',
        from: 'bot',
        streaming: true,
      },
    ]);

    try {
      const { contextText } = await retrieveContextForQuery(session, text);

      const modelUserMessage = contextText
        ? `Context:\n${contextText}\n\nUser Question: ${text} 
Your goal: To generate accurate, short answers, and include image urls in markdown format whenever it is relevant to user's query. Do not create or assume internal company data unless provided.If you don't know an answer, say “I don’t have any information on that” instead of guessing.`
        : text;

      const messagesForModel: ChatTurn[] = [
        ...chatHistory,
        { role: 'user', content: modelUserMessage },
      ];

      // streaming callback: accumulate tokens in streamedTextRef and update the placeholder text
      const finalText = await qwenChat(messagesForModel, token => {
        // append token to buffer
        streamedTextRef.current += token;

        // update placeholder message with plain text (no markdown rendering yet)
        setMessages(prev => {
          const copy = [...prev];
          const idx = copy.findIndex(m => m.id === botMsgId);
          if (idx !== -1) {
            copy[idx] = {
              ...copy[idx],
              text: streamedTextRef.current,
              streaming: true,
            };
          }
          return copy;
        });
      });

      // model finished: replace placeholder with final markdown-rendered text
      setMessages(prev => {
        const copy = [...prev];
        const idx = copy.findIndex(m => m.id === botMsgId);
        if (idx !== -1) {
          copy[idx] = {
            ...copy[idx],
            text: finalText,
            streaming: false,
          };
        }
        return copy;
      });

      // add to chat history for future turns
      setChatHistory(prev => [
        ...prev,
        { role: 'user', content: text },
        { role: 'assistant', content: finalText },
      ]);

      // cleanup
      streamedTextRef.current = '';
      currentBotMsgIdRef.current = null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setMessages(prev => {
        const copy = [...prev];
        const idx = copy.findIndex(m => m.id === botMsgId);
        if (idx !== -1) {
          copy[idx] = {
            ...copy[idx],
            text: `Error: ${msg}`,
            streaming: false,
          };
        }
        return copy;
      });
      streamedTextRef.current = '';
      currentBotMsgIdRef.current = null;
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.bubble,
        item.from === 'user' ? styles.userBubble : styles.botBubble,
      ]}
    >
      {item.from === 'user' ? (
        <Text style={styles.text}>{item.text}</Text>
      ) : item.streaming ? (
        // While streaming: show plain text (no markdown render)
        <Text style={styles.botText}>{item.text}</Text>
      ) : (
        // Final message: render markdown (images, links etc.)
        <Markdown
          style={{
            body: styles.botText,
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
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
    >
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <ChatDownloadIndicator />
        {downloadState === 'completed' &&
          modelsLoaded &&
          messages.length < 3 && (
            <DefaultSuggestions
              onSelect={text => {
                setInput(text);
                sendMessage();
              }}
            />
          )}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 12 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        <View style={styles.inputRow}>
          <TextInput
            value={input}
            editable={downloadState === 'completed' && !!session}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            style={styles.input}
          />
          <TouchableOpacity
            disabled={downloadState !== 'completed' || !session}
            style={styles.sendBtn}
            onPress={sendMessage}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
