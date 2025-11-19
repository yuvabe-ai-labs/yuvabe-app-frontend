import * as RNFS from '@dr.pogodin/react-native-fs';
import * as ort from 'onnxruntime-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { semanticSearch, tokenizeQuery } from '../../api/auth-api/authApi';
import {
  isLlamaReady,
  llamaGenerate,
  loadLlama,
} from '../chatbot/llama/llamaManager';
import { styles } from './ChatbotStyles';

const MODEL_URL_1 =
  'https://huggingface.co/onnx-community/embeddinggemma-300m-ONNX/resolve/main/onnx/model.onnx';
const MODEL_URL_2 =
  'https://huggingface.co/onnx-community/embeddinggemma-300m-ONNX/resolve/main/onnx/model.onnx_data';
const MODEL_URL_3 =
  'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q5_K_M.gguf';

// 2. Updated paths to ensure ONNX Runtime finds the external data correctly
const MODEL_1_PATH = RNFS.DocumentDirectoryPath + '/model.onnx';
const MODEL_2_PATH = RNFS.DocumentDirectoryPath + '/model.onnx_data';
const MODEL_3_PATH = RNFS.DocumentDirectoryPath + '/model3.gguf';

type Message = {
  id: string;
  text: string;
  from: 'user' | 'bot';
};

export const ChatScreen = () => {
  const [showDownloadModal, setShowDownloadModal] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [progress1, setProgress1] = useState(0);
  const [progress2, setProgress2] = useState(0);
  const [progress3, setProgress3] = useState(0);
  const [downloadDone, setDownloadDone] = useState(false);

  // 3. State to hold the Loaded ONNX Session
  const [session, setSession] = useState<ort.InferenceSession | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! 👋', from: 'bot' },
    { id: '2', text: 'Hi there! How are you?', from: 'user' },
    { id: '3', text: 'I’m your friendly Yuvabe assistant 😊', from: 'bot' },
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    checkExistingModels();
  }, []);

  // 4. Logic to Load the Model (Adapted from HelloWorks)
  const handleLoadModel = async () => {
    console.log('Inside handle load model...');
    try {
      // ONNX Runtime requires the 'file://' prefix for local paths on React Native
      const sessionPath = `file://${MODEL_1_PATH}`;

      const internalSession = await ort.InferenceSession.create(sessionPath);
      setSession(internalSession);

      // 5. The requested Console Output
      console.log('Model loaded successfully!');
      console.log(
        'Input Names:',
        internalSession.inputNames,
        'Output Names:',
        internalSession.outputNames,
      );
    } catch (err) {
      console.error('Error loading ONNX model:', err);
      Alert.alert('Error', 'Failed to load ONNX model');
    }
  };

  const checkExistingModels = async () => {
    const exists1 = await RNFS.exists(MODEL_1_PATH);
    const exists2 = await RNFS.exists(MODEL_2_PATH);
    const exists3 = await RNFS.exists(MODEL_3_PATH);

    if (exists1 && exists2 && exists3) {
      setShowDownloadModal(false);
      setDownloadDone(true);
      await handleLoadModel();
      await loadLlama(MODEL_3_PATH);
    }
  };

  const downloadFile = (
    url: string,
    path: string,
    onProgress: (p: number) => void,
  ) => {
    return RNFS.downloadFile({
      fromUrl: url,
      toFile: path,
      background: true,
      progressDivider: 1,
      progress: data => {
        const p = (data.bytesWritten / data.contentLength) * 100;
        onProgress(p);
      },
    }).promise;
  };

  const startDownload = async () => {
    setDownloading(true);

    try {
      await downloadFile(MODEL_URL_1, MODEL_1_PATH, setProgress1);
      await downloadFile(MODEL_URL_2, MODEL_2_PATH, setProgress2);
      await downloadFile(MODEL_URL_3, MODEL_3_PATH, setProgress3);

      setDownloadDone(true);
      setShowDownloadModal(false);

      await handleLoadModel();
      await loadLlama(MODEL_3_PATH);
    } catch (error) {
      console.log('Download error:', error);
      Alert.alert('Failed to download models. Check your network & try again.');
    }

    setDownloading(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: String(Date.now()),
      text: input,
      from: 'user',
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      if (!session) {
        const botReply: Message = {
          id: String(Date.now() + 1),
          text: 'Model not loaded yet. Try again once it’s ready.',
          from: 'bot',
        };
        setMessages(prev => [...prev, botReply]);
        setInput('');
        return;
      }
      const tokens = await tokenizeQuery(input);

      const inputIdsTensor = new ort.Tensor(
        'int64',
        BigInt64Array.from(tokens.input_ids.map(BigInt)),
        [1, tokens.input_ids.length],
      );

      const attentionMaskTensor = new ort.Tensor(
        'int64',
        BigInt64Array.from(tokens.attention_mask.map(BigInt)),
        [1, tokens.attention_mask.length],
      );

      const output = await session.run({
        input_ids: inputIdsTensor,
        attention_mask: attentionMaskTensor,
      });

      const embedding = Array.from(
        output[session.outputNames[1]].data as Float32Array,
      );

      const embedMsg: Message = {
        id: String(Date.now() + 1),
        text: `Embedding generated! (dim: ${embedding.length})`,
        from: 'bot',
      };
      setMessages(prev => [...prev, embedMsg]);

      // const searchResults = await semanticSearch(embedding);
      // console.log(`the search results are `, searchResults);
      // const best = searchResults?.[0];

      // if (!best) {
      //   const noResultMsg: Message = {
      //     id: String(Date.now() + 2),
      //     text: 'No relevant information found.',
      //     from: 'bot',
      //   };
      //   setMessages(prev => [...prev, noResultMsg]);
      //   setInput('');
      //   return;
      // }
      // const botReply: Message = {
      //   id: String(Date.now() + 2),
      //   text: best.text,
      //   from: 'bot',
      // };
      // setMessages(prev => [...prev, botReply]);
      const searchResults = await semanticSearch(embedding);
      const best = searchResults?.[0];

      if (!best) {
        setMessages(prev => [
          ...prev,
          {
            id: String(Date.now() + 2),
            text: 'No relevant information found.',
            from: 'bot',
          },
        ]);
        return;
      }

      const ragPrompt = `
CONTEXT:
${best.text}

USER QUESTION:
${input}

ASSISTANT ANSWER:
`;

      if (!isLlamaReady()) {
        setMessages(prev => [
          ...prev,
          {
            id: String(Date.now() + 3),
            text: 'Llama model is not loaded yet.',
            from: 'bot',
          },
        ]);
      } else {
        const finalText = await llamaGenerate(ragPrompt);

        setMessages(prev => [
          ...prev,
          {
            id: String(Date.now() + 4),
            text: finalText,
            from: 'bot',
          },
        ]);
      }
    } catch (err) {
      console.log('Chat processing error:', err);
      const botReply: Message = {
        id: String(Date.now() + 1),
        text: 'Something went wrong processing your query.',
        from: 'bot',
      };
      setMessages(prev => [...prev, botReply]);
    }

    setInput('');
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
    <>
      <Modal visible={showDownloadModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {!downloading ? (
              <>
                <Text style={styles.downloadText}>
                  Download Required Models
                </Text>
                <Text style={styles.downloadDescription}>
                  To enable offline AI processing, three model files must be
                  downloaded. Would you like to download them now?
                </Text>

                <View style={styles.downloadRow}>
                  <TouchableOpacity
                    style={styles.downloadBtn}
                    onPress={() =>
                      Alert.alert('You need the models to continue.')
                    }
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={startDownload}
                    style={styles.downloadBtn}
                  >
                    <Text style={{ fontWeight: '700' }}>Download</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.downloadProgressText}>
                  Downloading models... please wait
                </Text>

                <Text>Model 1: {progress1.toFixed(1)}%</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${progress1}%` }]}
                  />
                </View>

                <Text style={{ marginTop: 12 }}>
                  Model 2: {progress2.toFixed(1)}%
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${progress2}%` }]}
                  />
                </View>

                <Text style={{ marginTop: 12 }}>
                  Model 3: {progress3.toFixed(1)}%
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${progress3}%` }]}
                  />
                </View>

                <ActivityIndicator style={styles.activityIndicator} />
              </>
            )}
          </View>
        </View>
      </Modal>

      {downloadDone && (
        <KeyboardAvoidingView
          style={styles.key}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
          />

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
      )}
    </>
  );
};
