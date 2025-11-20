import * as ort from 'onnxruntime-react-native';
import { InferenceSession } from 'onnxruntime-react-native';
import { tokenizeQuery } from '../../../api/auth-api/authApi';

export const generateEmbedding = async (
  session: InferenceSession,
  text: string,
) => {
  const tokens = await tokenizeQuery(text);

  const inputIdsTensor = new ort.Tensor(
    'int64',
    BigInt64Array.from(tokens.input_ids.map(BigInt)),
    [1, tokens.input_ids.length],
  );

  const maskTensor = new ort.Tensor(
    'int64',
    BigInt64Array.from(tokens.attention_mask.map(BigInt)),
    [1, tokens.attention_mask.length],
  );

  const output = await session.run({
    input_ids: inputIdsTensor,
    attention_mask: maskTensor,
  });

  return Array.from(output[session.outputNames[1]].data as Float32Array);
};
