// src/api/reservationApi.ts

import api from './config';

export const createReservation = async (userId: string, propertyId: string, startDate: string, endDate: string, status: string) => {
  try {
    const response = await api.post('/reservations', { user_id: userId, property_id: propertyId, start_date: startDate, end_date: endDate, status });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error creating reservation';
  }
};

export const getReservationsByUserId = async (userId: string) => {
  try {
    const response = await api.get(`/reservations/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error fetching reservations';
  }
};
