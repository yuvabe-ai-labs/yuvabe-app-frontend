import api from '../client/axiosClient';

export interface LunchOptOutPayload {
  start_date: string;
  end_date: string;
}

export const requestLunchOptOut = (payload: LunchOptOutPayload) => {
  return api.post('/lunch/notify', payload);
};

export const getGmailConnectUrl = (userId: string) => {
  return api.get('/payslips/gmail/connect-url', {
    params: { user_id: userId },
  });
};
