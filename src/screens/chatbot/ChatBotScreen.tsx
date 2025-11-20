// import * as RNFS from '@dr.pogodin/react-native-fs';
// import * as ort from 'onnxruntime-react-native';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { semanticSearch, tokenizeQuery } from '../../api/auth-api/authApi';
// import {
//   isLlamaReady,
//   llamaGenerate,
//   loadLlama,
// } from '../chatbot/llama/llamaManager';
// import { styles } from './ChatbotStyles';

// const MODEL_URL_1 =
//   'https://huggingface.co/onnx-community/embeddinggemma-300m-ONNX/resolve/main/onnx/model.onnx';
// const MODEL_URL_2 =
//   'https://huggingface.co/onnx-community/embeddinggemma-300m-ONNX/resolve/main/onnx/model.onnx_data';
// const MODEL_URL_3 =
//   'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q5_K_M.gguf';

// const MODEL_1_PATH = RNFS.DocumentDirectoryPath + '/model.onnx';
// const MODEL_2_PATH = RNFS.DocumentDirectoryPath + '/model.onnx_data';
// const MODEL_3_PATH = RNFS.DocumentDirectoryPath + '/model3.gguf';

// type Message = {
//   id: string;
//   text: string;
//   from: 'user' | 'bot';
// };

// export const ChatScreen = () => {
//   const [showDownloadModal, setShowDownloadModal] = useState(true);
//   const [downloading, setDownloading] = useState(false);
//   const [progress1, setProgress1] = useState(0);
//   const [progress2, setProgress2] = useState(0);
//   const [progress3, setProgress3] = useState(0);
//   const [downloadDone, setDownloadDone] = useState(false);

//   const [session, setSession] = useState<ort.InferenceSession | null>(null);

//   const [messages, setMessages] = useState<Message[]>([
//     { id: '1', text: 'Hello! 👋', from: 'bot' },
//     { id: '2', text: 'Hi there! How are you?', from: 'user' },
//     { id: '3', text: 'I’m your friendly Yuvabe assistant 😊', from: 'bot' },
//   ]);
//   const [input, setInput] = useState('');

//   useEffect(() => {
//     checkExistingModels();
//   }, []);

//   const handleLoadModel = async () => {
//     console.log('Inside handle load model...');
//     try {
//       const sessionPath = `file://${MODEL_1_PATH}`;

//       const internalSession = await ort.InferenceSession.create(sessionPath);
//       setSession(internalSession);

//       console.log('Model loaded successfully!');
//       console.log(
//         'Input Names:',
//         internalSession.inputNames,
//         'Output Names:',
//         internalSession.outputNames,
//       );
//     } catch (err) {
//       console.error('Error loading ONNX model:', err);
//       Alert.alert('Error', 'Failed to load ONNX model');
//     }
//   };

//   const checkExistingModels = async () => {
//     const exists1 = await RNFS.exists(MODEL_1_PATH);
//     const exists2 = await RNFS.exists(MODEL_2_PATH);
//     const exists3 = await RNFS.exists(MODEL_3_PATH);

//     if (exists1 && exists2 && exists3) {
//       setShowDownloadModal(false);
//       setDownloadDone(true);
//       await handleLoadModel();
//       await loadLlama(MODEL_3_PATH);
//     }
//   };

//   const downloadFile = (
//     url: string,
//     path: string,
//     onProgress: (p: number) => void,
//   ) => {
//     return RNFS.downloadFile({
//       fromUrl: url,
//       toFile: path,
//       background: true,
//       progressDivider: 1,
//       progress: data => {
//         const p = (data.bytesWritten / data.contentLength) * 100;
//         onProgress(p);
//       },
//     }).promise;
//   };

//   const startDownload = async () => {
//     setDownloading(true);

//     try {
//       await downloadFile(MODEL_URL_1, MODEL_1_PATH, setProgress1);
//       await downloadFile(MODEL_URL_2, MODEL_2_PATH, setProgress2);
//       await downloadFile(MODEL_URL_3, MODEL_3_PATH, setProgress3);

//       setDownloadDone(true);
//       setShowDownloadModal(false);

//       await handleLoadModel();
//       await loadLlama(MODEL_3_PATH);
//     } catch (error) {
//       console.log('Download error:', error);
//       Alert.alert('Failed to download models. Check your network & try again.');
//     }

//     setDownloading(false);
//   };

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMsg: Message = {
//       id: String(Date.now()),
//       text: input,
//       from: 'user',
//     };
//     setMessages(prev => [...prev, userMsg]);

//     try {
//       if (!session) {
//         const botReply: Message = {
//           id: String(Date.now() + 1),
//           text: 'Model not loaded yet. Try again once it’s ready.',
//           from: 'bot',
//         };
//         setMessages(prev => [...prev, botReply]);
//         setInput('');
//         return;
//       }
//       const tokens = await tokenizeQuery(input);

//       const inputIdsTensor = new ort.Tensor(
//         'int64',
//         BigInt64Array.from(tokens.input_ids.map(BigInt)),
//         [1, tokens.input_ids.length],
//       );

//       const attentionMaskTensor = new ort.Tensor(
//         'int64',
//         BigInt64Array.from(tokens.attention_mask.map(BigInt)),
//         [1, tokens.attention_mask.length],
//       );

//       const output = await session.run({
//         input_ids: inputIdsTensor,
//         attention_mask: attentionMaskTensor,
//       });

//       const embedding = Array.from(
//         output[session.outputNames[1]].data as Float32Array,
//       );

//       const embedMsg: Message = {
//         id: String(Date.now() + 1),
//         text: `Embedding generated! (dim: ${embedding.length})`,
//         from: 'bot',
//       };
//       setMessages(prev => [...prev, embedMsg]);

//       const searchResults = await semanticSearch(embedding);
//       const best = searchResults?.[0];

//       if (!best) {
//         setMessages(prev => [
//           ...prev,
//           {
//             id: String(Date.now() + 2),
//             text: 'No relevant information found.',
//             from: 'bot',
//           },
//         ]);
//         return;
//       }

//       const ragPrompt = `
// CONTEXT:
// ${best.text}

// USER QUESTION:
// ${input}

// ASSISTANT ANSWER:
// `;

//       if (!isLlamaReady()) {
//         setMessages(prev => [
//           ...prev,
//           {
//             id: String(Date.now() + 3),
//             text: 'Llama model is not loaded yet.',
//             from: 'bot',
//           },
//         ]);
//       } else {
//         const finalText = await llamaGenerate(ragPrompt);

//         setMessages(prev => [
//           ...prev,
//           {
//             id: String(Date.now() + 4),
//             text: finalText,
//             from: 'bot',
//           },
//         ]);
//       }
//     } catch (err) {
//       console.log('Chat processing error:', err);
//       const botReply: Message = {
//         id: String(Date.now() + 1),
//         text: 'Something went wrong processing your query.',
//         from: 'bot',
//       };
//       setMessages(prev => [...prev, botReply]);
//     }

//     setInput('');
//   };

//   const renderItem = ({ item }: { item: Message }) => (
//     <View
//       style={[
//         styles.bubble,
//         item.from === 'user' ? styles.userBubble : styles.botBubble,
//       ]}
//     >
//       <Text style={[styles.text, item.from === 'bot' && { color: '#000' }]}>
//         {item.text}
//       </Text>
//     </View>
//   );

//   return (
//     <>
//       <Modal visible={showDownloadModal} transparent animationType="fade">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             {!downloading ? (
//               <>
//                 <Text style={styles.downloadText}>
//                   Download Required Models
//                 </Text>
//                 <Text style={styles.downloadDescription}>
//                   To enable offline AI processing, three model files must be
//                   downloaded. Would you like to download them now?
//                 </Text>

//                 <View style={styles.downloadRow}>
//                   <TouchableOpacity
//                     style={styles.downloadBtn}
//                     onPress={() =>
//                       Alert.alert('You need the models to continue.')
//                     }
//                   >
//                     <Text>Cancel</Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     onPress={startDownload}
//                     style={styles.downloadBtn}
//                   >
//                     <Text style={{ fontWeight: '700' }}>Download</Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             ) : (
//               <>
//                 <Text style={styles.downloadProgressText}>
//                   Downloading models... please wait
//                 </Text>

//                 <Text>Model 1: {progress1.toFixed(1)}%</Text>
//                 <View style={styles.progressBar}>
//                   <View
//                     style={[styles.progressFill, { width: `${progress1}%` }]}
//                   />
//                 </View>

//                 <Text style={{ marginTop: 12 }}>
//                   Model 2: {progress2.toFixed(1)}%
//                 </Text>
//                 <View style={styles.progressBar}>
//                   <View
//                     style={[styles.progressFill, { width: `${progress2}%` }]}
//                   />
//                 </View>

//                 <Text style={{ marginTop: 12 }}>
//                   Model 3: {progress3.toFixed(1)}%
//                 </Text>
//                 <View style={styles.progressBar}>
//                   <View
//                     style={[styles.progressFill, { width: `${progress3}%` }]}
//                   />
//                 </View>

//                 <ActivityIndicator style={styles.activityIndicator} />
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>

//       {downloadDone && (
//         <KeyboardAvoidingView
//           style={styles.key}
//           behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         >
//           <FlatList
//             data={messages}
//             keyExtractor={item => item.id}
//             renderItem={renderItem}
//             contentContainerStyle={{ padding: 16 }}
//           />

//           <View style={styles.inputRow}>
//             <TextInput
//               style={styles.input}
//               placeholder="Type a message..."
//               placeholderTextColor="#999"
//               value={input}
//               onChangeText={setInput}
//             />
//             <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
//               <Text style={styles.touch}>Send</Text>
//             </TouchableOpacity>
//           </View>
//         </KeyboardAvoidingView>
//       )}
//     </>
//   );
// };
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
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './ChatbotStyles';

import { loadLlama } from '../chatbot/llama/llamaManager';
import {
  checkModelsExist,
  downloadAllModels,
} from '../chatbot/models/modelDownloader';
import { MODEL_3_PATH } from '../chatbot/models/modelPaths';
import { loadOnnxModel } from '../chatbot/models/onnxLoader';
import { processUserQuery } from '../chatbot/rag/ragPipeline';

type Message = {
  id: string;
  text: string;
  from: 'user' | 'bot';
};

export const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [session, setSession] = useState<InferenceSession | null>(null);

  const [showModal, setShowModal] = useState(true);
  const [p1, setP1] = useState(0);
  const [p2, setP2] = useState(0);
  const [p3, setP3] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const [isTyping, setIsTyping] = useState(false);

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
    if (await checkModelsExist()) {
      const s = await loadOnnxModel();
      setSession(s);

      const llamaLoaded = await loadLlama(MODEL_3_PATH);
      if (!llamaLoaded) {
        console.error('❌ Llama model failed to load');
        return;
      }

      setShowModal(false);
    }
  };

  const startDownload = async () => {
    setDownloading(true);
    await downloadAllModels(setP1, setP2, setP3);

    const s = await loadOnnxModel();
    setSession(s);
    await loadLlama(MODEL_3_PATH);

    setDownloading(false);
    setShowModal(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const text = input;
    setInput('');

    const userMsg: Message = {
      id: `${Date.now()}`,
      text,
      from: 'user',
    };
    setMessages(prev => [...prev, userMsg]);

    const botMsgId = `${Date.now() + 1}`;
    const botMsg: Message = {
      id: botMsgId,
      text: 'Thinking...',
      from: 'bot',
    };
    setMessages(prev => [...prev, botMsg]);

    if (!session) {
      console.warn('Session not ready');
      return;
    }

    await processUserQuery(session, text, token => {
      setMessages(prev => {
        const updated = [...prev];

        const index = updated.findIndex(m => m.id === botMsgId);
        if (index === -1) return prev;

        if (updated[index].text === 'Thinking...') {
          updated[index].text = token;
        } else {
          updated[index].text += token;
        }

        return updated;
      });
    });
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

  const messagesToShow: Message[] = isTyping
    ? [...messages, { id: 'typing', text: 'Typing...', from: 'bot' } as Message]
    : messages;

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        {showModal && (
          <Modal
            visible={true}
            transparent
            animationType="fade"
            onRequestClose={() => {}}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {!downloading ? (
                  <TouchableOpacity
                    onPress={startDownload}
                    style={styles.downloadBtn}
                  >
                    <Text style={styles.downloadText}>Download Models</Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <Text style={styles.downloadProgressText}>
                      Downloading…
                    </Text>
                    <Text>Model1: {p1.toFixed(1)}%</Text>
                    <Text>Model2: {p2.toFixed(1)}%</Text>
                    <Text>Model3: {p3.toFixed(1)}%</Text>
                    <ActivityIndicator style={{ marginTop: 10 }} />
                  </>
                )}
              </View>
            </View>
          </Modal>
        )}

        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 20}
        >
          <FlatList
            ref={flatListRef}
            data={messagesToShow}
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
    </>
  );
};
