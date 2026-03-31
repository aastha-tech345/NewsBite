import api from './api';

export const trackView = (adId) => api.post('/ads/view', { adId });
export const trackClick = (adId) => api.post('/ads/click', { adId });
