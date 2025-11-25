import api from "../client/axiosClient";


export type AssetDTO = {
  id: string;
  name: string;
  type: string;
  status: string;
};

export const fetchAssets = async (): Promise<AssetDTO[]> => {
  const res = await api.get('/profile');
  return res.data.data.assets;
};
