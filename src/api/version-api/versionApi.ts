import api from '../client/axiosClient';

export const getAppVersion = async () => {
  try {
    const response = await api.get('/app/config'); 

    return response.data.data;
  } catch (error: any) {
    console.log('Version API error:', error.response?.data || error);

    if (error.response) {
      const detail =
        error.response.data?.detail ||
        error.response.data?.message ||
        'Failed to fetch version';
      throw new Error(detail);
    }

    throw new Error('Network error');
  }
};
