import api from '../client/axiosClient';

export interface WaterLog {
  id: string;
  amount_ml: number;
  logged_at: string;
  goal_ml?: number | null;
  recommended_ml?: number | null;
}

export interface WaterLogCreate {
  amount_ml: number;
  goal_ml?: number | null;
  recommended_ml?: number | null;
}

export interface WaterLogUpdate {
  amount_ml: number;
  goal_ml?: number | null;
  recommended_ml?: number | null;
}

export const logWater = async (amount_ml: number): Promise<WaterLog> => {
  const response = await api.post<WaterLog>('/wellbeing/water_logs/', {
    amount_ml,
    goal_ml: null,
    recommended_ml: null,
  });
  return response.data;
};

// Fetch all water logs for the user
export const fetchWaterLogs = async (): Promise<WaterLog[]> => {
  const response = await api.get<WaterLog[]>('/wellbeing/water_logs/');
  return response.data; // Return the water logs data
};

// Update a specific water log by ID
export const updateWaterLog = async (
  id: string,
  newAmount: number,
): Promise<WaterLog> => {
  const response = await api.put<WaterLog>(`/wellbeing/water_logs/${id}`, {
    amount_ml: newAmount,
    goal_ml: null, // Optional goal value
    recommended_ml: null, // Optional recommended value
  });
  return response.data;
};

// Delete a specific water log by ID
export const deleteWaterLog = async (
  id: string,
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `/wellbeing/water_logs/${id}`,
  );
  return response.data;
};

export const fetchWaterLogsForChart = async () => {
  const res = await api.get('/wellbeing/water_logs/');
  return res.data;
};
