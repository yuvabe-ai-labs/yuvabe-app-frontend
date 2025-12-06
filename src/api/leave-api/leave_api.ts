import api from '../client/axiosClient';

export const getLeaveContacts = async () => {
  try {
    const response = await api.get(`/profile/contacts`);
    return response.data.data; // { to: string, cc: string[] }
  } catch (error: any) {
    const msg = error.response?.data?.detail || 'Unable to fetch contacts';
    throw new Error(msg);
  }
};

export const sendLeaveEmail = async (payload: {
  from_email: string;
  to: string;
  cc: string[];
  subject: string;
  body: string;
}) => {
  try {
    const response = await api.post('/profile/send', payload);
    return response.data;
  } catch (error: any) {
    const msg = error.response?.data?.detail || 'Failed to send email';
    throw new Error(msg);
  }
};

export const markNotificationRead = (id: string) =>
  api.post(`/notifications/${id}/mark-read`);

export const markAllNotificationsRead = () =>
  api.post(`/notifications/mark-all-read`);
