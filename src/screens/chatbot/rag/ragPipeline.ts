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
): Promise<{ contextText: string }> => {
  const embedding = await generateEmbedding(session, text);

  const results: SearchResult[] = await semanticSearch(embedding);

  if (!results || results.length === 0) {
    return { contextText: '' };
  }
  const merged = results
    .filter(r => r.text)
    .map(r => {
      if (r.image_url) {
        return `${r.text}\n\n![image](${r.image_url})`; // MD embedding
      }
      return r.text;
    })
    .join('\n\n');

  console.log(`The context of the sematic search is : ${merged}`);
  return { contextText: merged };
};
