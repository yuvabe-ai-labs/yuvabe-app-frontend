import { InferenceSession } from 'onnxruntime-react-native';
import { semanticSearch } from '../../../api/auth-api/authApi';
import { isLlamaReady, llamaGenerate } from '../llama/llamaManager';
import { generateEmbedding } from '../models/embed';

export const processUserQuery = async (
  session: InferenceSession,
  text: string,
  onToken: (t: string) => void,
) => {
  const embedding = await generateEmbedding(session, text);

  const results = await semanticSearch(embedding);
  const best = results?.[0];
  if (!best) {
    onToken('No relevant information found.');
    return;
  }

  const prompt = `
SYSTEM:
You must strictly answer ONLY using the information in the provided CONTEXT.
If the answer is not in the context, say: "The information you requested is not available"

CONTEXT:
${best.text}

QUESTION:
${text}

ANSWER:
`;
  if (!isLlamaReady()) {
    onToken('Llama not loaded yet.');
    return;
  }

  return await llamaGenerate(prompt, onToken);
};
