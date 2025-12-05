import api from '../client/axiosClient';

export type PayslipMode = '3_months' | '6_months' | 'manual';

export interface PayslipRequestPayload {
  mode: PayslipMode;
  start_month?: string;
  end_month?: string;
}

export const getGmailConnectUrl = (userId: string) => {
  return api.get(`/payslips/gmail/connect-url`, {
    params: { user_id: userId },
  });
};

export const requestPayslip = (body: PayslipRequestPayload) => {
  return api.post('/payslips/request', body);
};
