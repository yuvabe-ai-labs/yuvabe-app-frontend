import * as RNFS from '@dr.pogodin/react-native-fs';
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
import { styles } from './ChatbotStyles';

const MODEL_URL_1 =
  'https://huggingface.co/onnx-community/embeddinggemma-300m-ONNX/resolve/main/onnx/model.onnx';
const MODEL_URL_2 =
  'https://huggingface.co/onnx-community/embeddinggemma-300m-ONNX/resolve/main/onnx/model.onnx_data';
const MODEL_URL_3 =
  'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q5_K_M.gguf';

const MODEL_1_PATH = RNFS.DocumentDirectoryPath + '/model1.bin';
const MODEL_2_PATH = RNFS.DocumentDirectoryPath + '/model2.bin';
const MODEL_3_PATH = RNFS.DocumentDirectoryPath + '/model3.bin';

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

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! 👋', from: 'bot' },
    { id: '2', text: 'Hi there! How are you?', from: 'user' },
    { id: '3', text: 'I’m your friendly Yuvabe assistant 😊', from: 'bot' },
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    checkExistingModels();
  }, []);

  const checkExistingModels = async () => {
    const exists1 = await RNFS.exists(MODEL_1_PATH);
    const exists2 = await RNFS.exists(MODEL_2_PATH);
    const exists3 = await RNFS.exists(MODEL_3_PATH);

    if (exists1 && exists2 && exists3) {
      setShowDownloadModal(false);
      setDownloadDone(true);
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
    } catch (error) {
      console.log('Download error:', error);
      Alert.alert('Failed to download models. Check your network & try again.');
    }

    setDownloading(false);
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMsg: Message = {
      id: String(Date.now()),
      text: input,
      from: 'user',
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    setTimeout(() => {
      const botReply: Message = {
        id: String(Date.now() + 1),
        text: "Cool! I'll respond once the AI backend is connected 😄",
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
    <>
      <Modal visible={showDownloadModal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 10,
              width: '90%',
            }}
          >
            {!downloading ? (
              <>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                  Download Required Models
                </Text>
                <Text style={{ marginTop: 10 }}>
                  To enable offline AI processing, two model files must be
                  downloaded. Would you like to download them now?
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 20,
                  }}
                >
                  <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() =>
                      Alert.alert('You need the models to continue.')
                    }
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={startDownload}
                    style={{ padding: 10 }}
                  >
                    <Text style={{ fontWeight: '700' }}>Download</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>
                  Downloading models... please wait
                </Text>

                <Text>Model 1: {progress1.toFixed(1)}%</Text>
                <View
                  style={{
                    height: 6,
                    backgroundColor: '#ddd',
                    width: '100%',
                    borderRadius: 3,
                  }}
                >
                  <View
                    style={{
                      height: 6,
                      width: `${progress1}%`,
                      backgroundColor: 'blue',
                      borderRadius: 3,
                    }}
                  />
                </View>

                <Text style={{ marginTop: 12 }}>
                  Model 2: {progress2.toFixed(1)}%
                </Text>
                <View
                  style={{
                    height: 6,
                    backgroundColor: '#ddd',
                    width: '100%',
                    borderRadius: 3,
                  }}
                >
                  <View
                    style={{
                      height: 6,
                      width: `${progress2}%`,
                      backgroundColor: 'blue',
                      borderRadius: 3,
                    }}
                  />
                </View>
                <Text style={{ marginTop: 12 }}>
                  Model 3: {progress3.toFixed(1)}%
                </Text>
                <View
                  style={{
                    height: 6,
                    backgroundColor: '#ddd',
                    width: '100%',
                    borderRadius: 3,
                  }}
                >
                  <View
                    style={{
                      height: 6,
                      width: `${progress3}%`,
                      backgroundColor: 'blue',
                      borderRadius: 3,
                    }}
                  />
                </View>

                <ActivityIndicator style={{ marginTop: 20 }} />
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
