import axiosInstance from '../loaders/axiosInstance';

export const getActiveProposals = async () => {
  const response = await axiosInstance.get('/proposals?status=active');
  return response.data;
};

export const getProposals = async (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });

  const response = await axiosInstance.get(`/proposals?${params.toString()}`);
  return response.data;
};

export const voteProposal = async (data) => {
  const response = await axiosInstance.post(
    `/proposals/vote/${data.proposalId}`,
    data
  );
  return response.data;
};
