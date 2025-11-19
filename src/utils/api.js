import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('deardiary-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (data) => apiClient.post('/auth/login', data),
  register: (data) => apiClient.post('/auth/register', data)
};

export const entryApi = {
  list: () => apiClient.get('/entries'),
  create: (data) => apiClient.post('/entries', data),
  getById: (id) => apiClient.get(`/entries/${id}`),
  update: (id, data) => apiClient.put(`/entries/${id}`, data),
  remove: (id) => apiClient.delete(`/entries/${id}`),
  byDate: (date) => apiClient.get(`/entries/date/${encodeURIComponent(date)}`)
};

