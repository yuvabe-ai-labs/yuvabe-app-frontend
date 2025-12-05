import * as ort from 'onnxruntime-react-native';
import { tokenizeQuery } from '../../../api/chatbot-api/chatbotApi';

export const generateEmbedding = async (
  session: ort.InferenceSession,
  text: string,
) => {
  const tokens = await tokenizeQuery(text);

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

  const lastHidden = output[session.outputNames[0]].data as Float32Array;

  const seqLen = tokens.input_ids.length;
  const hiddenSize = lastHidden.length / seqLen;

  const embedding = new Array(hiddenSize).fill(0);
  let validTokens = 0;

  for (let i = 0; i < seqLen; i++) {
    if (tokens.attention_mask[i] === 0) continue;
    validTokens++;

    const offset = i * hiddenSize;
    for (let j = 0; j < hiddenSize; j++) {
      embedding[j] += lastHidden[offset + j];
    }
  }

  for (let j = 0; j < hiddenSize; j++) {
    embedding[j] /= validTokens;
  }

  let norm = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
  if (norm > 0) {
    for (let j = 0; j < hiddenSize; j++) {
      embedding[j] /= norm;
    }
  }

  return embedding;
};
