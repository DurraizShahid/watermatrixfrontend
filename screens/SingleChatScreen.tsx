// File: /screens/SingleChatScreen.tsx

import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, TextInput, Alert, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getMessagesForChat, sendMessage } from '../api/messageApi'; // Import API functions

const SingleChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Get route to access parameters
  const { chatId } = route.params as { chatId: string }; // Extract chatId from route params
  const [messages, setMessages] = useState([]); // State for messages
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [newMessage, setNewMessage] = useState(''); // State for new message input
  const [sending, setSending] = useState(false); // State for sending message

  useEffect(() => {
    fetchMessages(); // Fetch messages when the component mounts
  }, []);

  const fetchMessages = async () => {
    try {
      const fetchedMessages = await getMessagesForChat(chatId);
      setMessages(fetchedMessages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error as string);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return; // Do not send empty messages
    setSending(true);
    try {
      const senderId = 'your-sender-id'; // Replace with actual sender ID
      const sentMessage = await sendMessage(chatId, senderId, newMessage);
      setMessages([...messages, sentMessage]); // Update messages list
      setNewMessage(''); // Clear input field
    } catch (error) {
      Alert.alert('Error', error as string);
    } finally {
      setSending(false);
    }
  };

  const renderMessageItem = ({ item }: { item: any }) => (
    <View style={[styles.messageBubble, item.sender === 'me' ? styles.myMessage : styles.otherMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>{item.time}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00D6BE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { navigation.goBack(); }}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }} // Replace with the actual image URL
          style={styles.avatar}
        />
        <Text style={styles.headerTitle}>User</Text>
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="emoticon-outline" size={24} color="#888" style={styles.icon} />
        <MaterialCommunityIcons name="attachment" size={24} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Write a message"
          placeholderTextColor="#888"
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity onPress={handleSendMessage} disabled={sending}>
          <MaterialCommunityIcons name="send" size={24} color={sending ? '#888' : '#00D6BE'} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#1f1f1f',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
  },
  myMessage: {
    backgroundColor: '#00D6BE',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#1f1f1f',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
    color: '#fff',
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1f1f1f',
  },
  icon: {
    marginHorizontal: 5,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#0d0d0d',
    borderRadius: 20,
    paddingHorizontal: 15,
    color: '#fff',
    marginHorizontal: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d0d0d',
  },
});

export default SingleChatScreen;
