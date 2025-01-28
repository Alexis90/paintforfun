import axiosInstance from '../loaders/axiosInstance';

const submitArtwork = async (data) => {
  const response = await axiosInstance.post('/artworks', data);
  return response.data;
};

export default submitArtwork;
