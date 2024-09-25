import axios from 'axios';

// Define the base URL for your backend
const API_BASE_URL = 'http://localhost:3000'; // Update this with your actual backend URL

export interface Property {
  id?: number; 
  image:string;
  UserId:number;
  Title: string;
  City:string;
  Type:string
  Description:string;
  description: string;
  ZipCode:number;
  latitude: number;
  longitude: number;
  price: number;

}

interface ApiError {
  message?: string;
  data?: any;
}

export const getProperties = async (): Promise<Property[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/properties`);
    return response.data; // Assuming response.data is an array of properties
  } catch (error) {
    // Handle Axios error
    if (axios.isAxiosError(error)) {
      throw new Error(error.response ? error.response.data.message : 'An error occurred while fetching properties');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const addProperty = async (property: Property): Promise<Property> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/property/addproperty`, property);
    return response.data; // Assuming response.data is the created property
  } catch (error) {
    // Handle Axios error
    if (axios.isAxiosError(error)) {
      throw new Error(error.response ? error.response.data.message : 'An error occurred while adding the property');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};
