import api from '../auth-api/axiosInstance';

export const updateProfile = async (body: any) => {
  try {
    const response = await api.put('/profile/update-profile', body);
    return response.data.data.user;
  } catch (error: any) {
    const msg = error.response?.data?.detail || 'Update failed';
    throw new Error(msg);
  }
};
