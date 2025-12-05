import api from '../client/axiosClient';

export const tokenizeQuery = async (text: string) => {
  try {
    const response = await api.post('/chatbot/tokenize', { text });
    return response.data;
  } catch (error: any) {
    console.log('Tokenization error:', error.response?.data || error);

    if (error.response) {
      throw new Error(error.response.data.detail || 'Tokenization failed');
    }
    throw new Error('Network error');
  }
};

export const semanticSearch = async (
  embedding: number[],
  top_k: number = 3
) => {
  try {
    const cleanEmbedding = Array.from(embedding).map(Number);

    const response = await api.post('/chatbot/semantic-search', {
      embedding: cleanEmbedding,
      top_k,
    });

    console.log('RAW semantic response:', response.data);

    if (response.data?.data) {
      return response.data.data;
    }

    if (Array.isArray(response.data)) {
      return response.data;
    }

    throw new Error('Unexpected semantic search response format');
  } catch (error: any) {
    console.error(
      'Semantic search API error:',
      error.response?.data || error
    );
    throw new Error(
      error.response?.data?.detail || 'Semantic search failed'
    );
  }
};
