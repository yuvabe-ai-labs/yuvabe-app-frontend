import type { InferenceSession } from 'onnxruntime-react-native';
import { semanticSearch } from '../../../api/auth-api/authApi';
import { generateEmbedding } from '../models/embed';

type SearchResult = {
  chunk_id: string;
  kb_id: string;
  text: string;
  image_url?: string | null;
  score: number;
};

// export const retrieveContextForQuery = async (
//   session: InferenceSession,
//   text: string,
// ): Promise<string | null> => {
//   const embedding = await generateEmbedding(session, text);

//   const results = await semanticSearch(embedding);

//    if (!results || results.length === 0) {
//     return null;
//   }

//   const combinedContext = results
//     .filter((r: SearchResult) => r.text)
//     .map((r: SearchResult) => r.text)
//     .join("\n\n");

//   return combinedContext;
// const best = results?.[0];

// if (!best || !best.text) {
//   return null;
// }

// return best.text as string;
// };
export const retrieveContextForQuery = async (
  session: InferenceSession,
  text: string,
): Promise<{ contextText: string; image_url: string | null }> => {
  const embedding = await generateEmbedding(session, text);

  const results: SearchResult[] = await semanticSearch(embedding);

  if (!results || results.length === 0) {
    return { contextText: '', image_url: null };
  }

  // 1️⃣ Combine all text chunks
  const contextText = results
    .filter(r => r.text)
    .map(r => r.text)
    .join('\n\n');

  // 2️⃣ Find the FIRST chunk that has an image_url
  const imageChunk = results.find(r => r.image_url);

  return {
    contextText,
    image_url: imageChunk ? imageChunk.image_url! : null,
  };
};
