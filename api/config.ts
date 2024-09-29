import axios from 'axios';

// Base URL for your backend server
const BASE_URL = 'https://mapmatrixbackend-production.up.railway.app'; // Ensure to include https:// 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
