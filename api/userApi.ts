import axios from 'axios';

// Make sure this URL matches the backend
const API_URL = 'https://mapmatrixbackend-production.up.railway.app/api/auth/users'; // Include /api/auth

export const loginUser = async (phoneNo: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, {
    phone_number: phoneNo,
    password,
  });
  return response.data;
};

export const registerUser = async (
  name: string,
  email: string,
  phoneNo: string,
  password: string,
  country: string,
  city: string
) => {
  const response = await axios.post(`${API_URL}/register`, {
    name,
    email,
    phone_number: phoneNo,
    password,
    country,
    city,
  });
  return response.data;
};
