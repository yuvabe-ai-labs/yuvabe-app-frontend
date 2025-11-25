import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import api from '../auth-api/axiosInstance';

export async function registerDevice() {
  const device_token = await messaging().getToken();

  await api.post('/notifications/register-device', {
    device_token,
    platform: Platform.OS,
    device_model: DeviceInfo.getModel(),
  });
}

export const requestLeave = (body: any) => {
  return api.post('/profile/request', body);
};

export const fetchLeaveBalance = () => {
  return api.get('/profile/balance');
};

export const updateProfile = async (body: any) => {
  try {
    const response = await api.put('/profile/update-profile', body);
    return response.data.data.user;
  } catch (error: any) {
    const msg = error.response?.data?.detail || 'Update failed';
    throw new Error(msg);
  }
};

export async function fetchProfileDetails() {
  const response = await api.get(`/profile/details`);

  return response.data;
}

export const fetchNotifications = () => {
  return api.get('/profile/notifications');
};

export const fetchPendingLeaves = () => {
  return api.get('/profile/mentor/pending');
};

export const getLeaveDetails = (leaveId: string) => {
  return api.get(`/profile/leave/${leaveId}`);
};

export const mentorDecision = (leaveId: string, body: any) => {
  return api.post(`/profile/${leaveId}/mentor-decision`, body);
};

export const getUserLeaveBalance = (userId: string) => {
  return api.get(`/profile/balance/${userId}`);
};
