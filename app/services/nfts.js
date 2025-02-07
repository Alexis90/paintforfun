import axiosInstance from '../loaders/axiosInstance';

export const getNFTs = async (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });

  const response = await axiosInstance.get(`/nfts?${params.toString()}`);
  return response.data;
};
