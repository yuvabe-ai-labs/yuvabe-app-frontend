import { InferenceSession } from 'onnxruntime-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './ChatbotStyles';

import { SYSTEM_PROMPT } from '../../utils/constants';
import { loadLlama, qwenChat } from '../chatbot/llama/llamaManager';
import {
  checkModelsExist,
  downloadAllModels,
} from '../chatbot/models/modelDownloader';
import { MODEL_3_PATH } from '../chatbot/models/modelPaths';
import { loadOnnxModel } from '../chatbot/models/onnxLoader';
import { retrieveContextForQuery } from '../chatbot/rag/ragPipeline';
type Message = {
  id: string;
  text: string;
  from: 'user' | 'bot';
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

  const [chatHistory, setChatHistory] = useState<ChatTurn[]>([
    {
      role: 'system',
      content: SYSTEM_PROMPT,
    },
  ]);

  const [checking, setChecking] = useState(true);
  const [showDownloadPrompt, setShowDownloadPrompt] = useState(false);
  const [showDownloadingModal, setShowDownloadingModal] = useState(false);

  const [p1, setP1] = useState(0);
  const [p2, setP2] = useState(0);
  const [p3, setP3] = useState(0);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }, [messages]);

  const init = async () => {
    setChecking(true);

    const exists = await checkModelsExist();

    if (exists) {
      const s = await loadOnnxModel();
      setSession(s);
      await loadLlama(MODEL_3_PATH);
    } else {
      setShowDownloadPrompt(true);
    }

    setChecking(false);
  };

  const handleModalDismiss = () => {
    setShowDownloadPrompt(false);

    setMessages(prev => [
      ...prev,
      {
        id: `${Date.now()}`,
        text: 'You must download the models before using the chatbot.',
        from: 'bot',
      },
    ]);
  };

  const startDownload = async () => {
    setShowDownloadPrompt(false);
    setShowDownloadingModal(true);

    await downloadAllModels(setP1, setP2, setP3);

    const s = await loadOnnxModel();
    setSession(s);
    await loadLlama(MODEL_3_PATH);

    setShowDownloadingModal(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!session) {
      setMessages(prev => [
        ...prev,
        { id: `${Date.now()}`, text: 'Model not ready yet.', from: 'bot' },
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
      { id: botMsgId, text: 'Thinking...', from: 'bot' },
    ]);

    try {
      const contextText = await retrieveContextForQuery(session, text);

      const modelUserMessage = contextText
        ? `You are answering a question for Yuvabe User. Below is some context information retrieved from our knowledge base. --START OF CONTEXT--${contextText}--END OF CONTEXT--\n Here is the User Question: ${text} \n Instructions:
- Do NOT write phrases like “Here is the response”, “Based on the context”, or anything similar.
- Do NOT mention context, sources, documents, or where the information came from.
- Use simple, short sentences.
- If the context does not have the answer, reply exactly: “I don't have this information.”
`
        : `UserQuery: ${text}`;
      console.log(`Model User Message: ${modelUserMessage}`);

      const messagesForModel: ChatTurn[] = [
        ...chatHistory,
        { role: 'user', content: modelUserMessage },
      ];
      // console.log('===== MODEL INPUT START =====');

      // messagesForModel.forEach((msg, index) => {
      //   console.log(
      //     `#${index} | ROLE: ${msg.role.toUpperCase()}\nCONTENT:\n${
      //       msg.content
      //     }\n-------------------`,
      //   );
      // });

      // console.log('===== MODEL INPUT END =====');

      // const finalText = await llamaChat(messagesForModel, token => {
      //   setMessages(prev => {
      //     const copy = [...prev];
      //     const idx = copy.findIndex(m => m.id === botMsgId);
      //     if (idx !== -1) {
      //       if (copy[idx].text === 'Thinking...') copy[idx].text = token;
      //       else copy[idx].text += token;
      //     }
      //     return copy;
      //   });
      // });

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
    </View>
  );

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
      {/* MODALS */}
      {!checking && showDownloadPrompt && (
        <Modal
          visible
          transparent
          animationType="fade"
          onRequestClose={handleModalDismiss}
        >
          <TouchableWithoutFeedback onPress={handleModalDismiss}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Download Models</Text>
                  <Text style={styles.modalInfo}>
                    To enable on-device offline inference, the required model
                    files must be downloaded.
                  </Text>

                  <TouchableOpacity
                    onPress={startDownload}
                    style={styles.downloadBtn}
                  >
                    <Text style={styles.downloadText}>Download</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      {showDownloadingModal && (
        <Modal visible transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContentSmall}>
              <Text style={styles.downloadProgressText}>Downloading...</Text>
              <Text>Model1: {p1.toFixed(1)}%</Text>
              <Text>Model2: {p2.toFixed(1)}%</Text>
              <Text>Model3: {p3.toFixed(1)}%</Text>
              <ActivityIndicator style={{ marginTop: 10 }} />
            </View>
          </View>
        </Modal>
      )}

      {/* CHAT AREA */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
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
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
