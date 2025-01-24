import axios from 'axios';
import { getCsrfToken, fetchCsrfToken } from '../utils/csrfUtils';


const API_URL = 'http://127.0.0.1:8000/api';

// create axios instance 

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(async (config) => {
  let csrfToken = getCsrfToken();

  if (!csrfToken) {
    csrfToken = await fetchCsrfToken();
  }

  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
},
  (error) => {
    return Promise.reject(error);
  }

);

export default apiClient;
