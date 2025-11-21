import type { InferenceSession } from 'onnxruntime-react-native';
import { semanticSearch } from '../../../api/auth-api/authApi';
import { generateEmbedding } from '../models/embed';

type SearchResult = {
  chunk_id: string;
  kb_id: string;
  text: string;
  score: number;
};

export const retrieveContextForQuery = async (
  session: InferenceSession,
  text: string,
): Promise<string | null> => {
  const embedding = await generateEmbedding(session, text);

  const results = await semanticSearch(embedding);

   if (!results || results.length === 0) {
    return null;
  }

  const combinedContext = results
    .filter((r: SearchResult) => r.text)
    .map((r: SearchResult) => r.text)
    .join("\n\n");

  return combinedContext;
  // const best = results?.[0];

  // if (!best || !best.text) {
  //   return null;
  // }

  // return best.text as string;
};
