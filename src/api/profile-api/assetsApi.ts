import api from '../client/axiosClient';

export type AssetDTO = {
  id: string;
  asset_id: string;
  type: string;
  status: string;
};

export const fetchAssets = async (): Promise<AssetDTO[]> => {
  const res = await api.get('/profile/assets');
  return res.data.data.assets;
};
