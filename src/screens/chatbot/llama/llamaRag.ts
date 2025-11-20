import { isLlamaReady, llamaGenerate } from './llamaManager';

export const generateRagResponse = async (context: string, question: string) => {
  const prompt = `
CONTEXT:
${context}

USER QUESTION:
${question}

ASSISTANT ANSWER:
  `;

  if (!isLlamaReady()) return 'Llama not loaded yet.';

  return await llamaGenerate(prompt);
};
