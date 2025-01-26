import axios from 'axios';
import { getCookie } from '../utils/csrfUtils';


const API_URL = 'http://127.0.0.1:8000/api';

// create axios instance 

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie('csrftoken'),
  },
});




export default apiClient;
