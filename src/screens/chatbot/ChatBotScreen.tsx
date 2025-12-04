import { ChevronLeft } from 'lucide-react-native';
import { InferenceSession } from 'onnxruntime-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
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
  text: string;
  from: 'user' | 'bot';
  image_url?: string | null;
};

type ChatRole = 'system' | 'user' | 'assistant';

type ChatTurn = {
  role: ChatRole;
  content: string;
};

const ChatScreen = ({ navigation }: any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [session, setSession] = useState<InferenceSession | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const downloadState = useModelDownloadStore(state => state.downloadState);

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
        },
      ]);
    } else if (downloadState === 'error') {
      setMessages([
        {
          id: 'sys-error',
          text: 'Model download failed. Please restart the app to try again.',
          from: 'bot',
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
            },
          ];
        }
        return prev;
      });
    }
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
    };
    setMessages(prev => [...prev, userMsg]);

    const botMsgId = `${Date.now() + 1}`;

    setMessages(prev => [
      ...prev,
      {
        id: botMsgId,
        text: 'Thinking...',
        from: 'bot',
      },
    ]);

    try {
      const { contextText, image_url } = await retrieveContextForQuery(
        session,
        text,
      );
      const lowerQ = text.toLowerCase();

      const isImageRelevant =
        image_url &&
        (lowerQ.includes('values') ||
          lowerQ.includes('core values') ||
          lowerQ.includes('three cs') ||
          lowerQ.includes('3 cs'));

      if (image_url) {
        setMessages(prev => {
          const copy = [...prev];
          const idx = copy.findIndex(m => m.id === botMsgId);
          if (idx !== -1) {
            copy[idx].image_url = image_url;
          }
          return copy;
        });
      }

      const modelUserMessage = contextText
        ? `Context:\n${contextText}\n\nUser Question: ${text}`
        : text;

      const messagesForModel: ChatTurn[] = [
        ...chatHistory,
        { role: 'user', content: modelUserMessage },
      ];

      const finalText = await qwenChat(messagesForModel, token => {
        setMessages(prev => {
          const copy = [...prev];
          const idx = copy.findIndex(m => m.id === botMsgId);
          if (idx !== -1) {
            if (copy[idx].text === 'Thinking...') copy[idx].text = token;
            else copy[idx].text += token;
          }
          return copy;
        });
      });

      setChatHistory(prev => [
        ...prev,
        { role: 'user', content: text },
        { role: 'assistant', content: finalText },
      ]);
      if (isImageRelevant) {
        setMessages(prev => {
          const copy = [...prev];
          const idx = copy.findIndex(m => m.id === botMsgId);
          if (idx !== -1) {
            copy[idx].image_url = image_url;
          }
          return copy;
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setMessages(prev => {
        const copy = [...prev];
        const idx = copy.findIndex(m => m.id === botMsgId);
        if (idx !== -1) copy[idx].text = `Error: ${msg}`;
        return copy;
      });
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.bubble,
        item.from === 'user' ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text style={item.from === 'user' ? styles.text : styles.botText}>
        {item.text}
      </Text>

      {item.image_url && (
        <Image
          source={{ uri: item.image_url }}
          style={{
            width: 240,
            height: 240,
            borderRadius: 12,
            marginTop: 8,
          }}
          resizeMode="contain"
        />
      )}
    </View>
  );

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 20,
          padding: 4,
        }}
      >
        <ChevronLeft size={30} color="#000" strokeWidth={2.5} />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={[styles.container, { paddingTop: 70 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
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
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ padding: 16 }}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
