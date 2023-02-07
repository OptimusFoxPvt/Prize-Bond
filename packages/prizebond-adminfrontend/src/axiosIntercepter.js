import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://178.62.244.184:3333/api',
});

api.interceptors.request.use((request) => {
  const token = localStorage.getItem('token');
  request.headers.Authorization = token ? `Bearer ${token}` : '';
  return request;
});
