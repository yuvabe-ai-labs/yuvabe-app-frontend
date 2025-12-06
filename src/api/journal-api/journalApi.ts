import api from "../client/axiosClient";

export interface JournalResponse {
  id: string;
  user_id: string;
  title: string;
  content: string;
  journal_date: string;
  created_at: string;
  updated_at: string;
}

export interface BaseResponse<T> {
  status_code: number;
  data: T;
}

export interface JournalCreate {
  title: string;
  content: string;
  journal_date: string;
}

export interface JournalUpdate {
  title?: string;
  content?: string;
  journal_date?: string;
}

export const createOrUpdateJournal = async (
  payload: JournalCreate
): Promise<JournalResponse> => {
  const res = await api.post<BaseResponse<JournalResponse>>(
    "/journal/",
    payload
  );
  return res.data.data;
};

export const getAllJournals = async (): Promise<JournalResponse[]> => {
  const res = await api.get<BaseResponse<JournalResponse[]>>("/journal/");
  return res.data.data;
};

export const getJournalById = async (
  journalId: string
): Promise<JournalResponse> => {
  const res = await api.get<BaseResponse<JournalResponse>>(
    `/journal/entry/${journalId}`
  );
  return res.data.data;
};

export const updateJournal = async (
  journalId: string,
  payload: JournalUpdate
): Promise<JournalResponse> => {
  const res = await api.put<BaseResponse<JournalResponse>>(
    `/journal/entry/${journalId}`,
    payload
  );
  return res.data.data;
};

export const deleteJournal = async (
  journalId: string
): Promise<string> => {
  const res = await api.delete<BaseResponse<string>>(
    `/journal/entry/${journalId}`
  );
  return res.data.data;
};
