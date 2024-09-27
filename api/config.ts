import axios from 'axios';

// Base URL for your backend server
const BASE_URL = 'railwaybackendfinal-production-2f0c.up.railway.app'; 


const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
