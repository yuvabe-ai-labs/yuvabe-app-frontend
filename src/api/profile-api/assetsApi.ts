import api from '../auth-api/axiosInstance';

export type AssetDTO = {
  id: string;
  name: string;
  type: string;
  status: string;
};

export const fetchAssets = async (): Promise<AssetDTO[]> => {
  const res = await api.get('/assets');
  return res.data.data.assets;
};
