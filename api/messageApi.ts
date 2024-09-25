// src/api/messageApi.ts

import api from './config';

export const sendMessage = async (content: string, senderId: string, recipientId: string) => {
  try {
    const response = await api.post('/messages/send', { content, sender_id: senderId, recipient_id: recipientId });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error sending message';
  }
};

export const getUserMessages = async (userId: string) => {
  try {
    const response = await api.get(`/messages/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error fetching messages';
  }
};

// Fetch messages for a specific chat
export const getMessagesForChat = async (chatId: string) => {
  try {
    const response = await api.get(`/messages/chat/${chatId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error fetching chat messages';
  }
};




