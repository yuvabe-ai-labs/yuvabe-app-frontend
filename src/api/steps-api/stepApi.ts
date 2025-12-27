import api from '../client/axiosClient';

export interface StepsPayload {
  steps_count: number;
}

export const createOrUpdateSteps = (payload: StepsPayload) => {
  return api.post('/wellbeing/steps', payload);
};

export const getStepsHistory = () => {
  return api.get('/wellbeing/getsteps');
};
