import api from './api';

export const getFeed = (page = 1, limit = 10, category = '') =>
  api.get('/feed', { params: { page, limit, ...(category && { category }) } });

export const getSaved = (page = 1) => api.get('/bookmarks', { params: { page } });

export const toggleBookmark = (articleId) => api.post(`/bookmarks/${articleId}`);

export const updatePreferences = (preferences) => api.put('/users/preferences', { preferences });
