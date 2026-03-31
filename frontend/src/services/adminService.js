import api from './api';

export const getAgents = () => api.get('/agents');
export const createAgent = (data) => api.post('/agents', data);
export const updateAgent = (id, data) => api.put(`/agents/${id}`, data);
export const deleteAgent = (id) => api.delete(`/agents/${id}`);
export const toggleAgent = (id) => api.patch(`/agents/${id}/toggle`);

export const getAds = () => api.get('/ads');
export const createAd = (data) => api.post('/ads', data);
export const updateAd = (id, data) => api.put(`/ads/${id}`, data);
export const deleteAd = (id) => api.delete(`/ads/${id}`);

export const getCampaignStats = () => api.get('/analytics/campaigns');
