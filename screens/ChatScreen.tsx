import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Import images from the local folder
import avatar1 from '../images/avatar1.jpeg';
import groupImage from '../images/sadboi.png'; // Import the new image
import { useAuth } from '../context/AuthContext'; // Adjust the path as necessary
import userdummyData from '../screens/userdummyData'; // Import user data
import { chats } from '../screens/dummychats'; // Import chat data
import { messages } from '../screens/dummymessages'; // Import message data

const ChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isLoggedIn } = useAuth(); // Get login state from context
  const [chatList, setChatList] = useState([]); // State to hold chat list
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Simulate a delay to show loading spinner, then load chat data
    setTimeout(() => {
      fetchChats(); // Fetch chats from imported data
    }, 1000);
  }, []);

  // Fetch chats from dummy data
  const fetchChats = () => {
    const chatData = chats.map(chat => {
      // Find the last message associated with this chat
      const lastMessage = messages.filter(msg => msg.chatId === chat.id).pop(); // Get the latest message

      // Find user based on userId
      const user = userdummyData.find(user => user.id === chat.userId); // Assuming each chat has a userId that corresponds to userdummyData's ids

      return {
        ...chat,
        userName: user ? user.fullName : 'Unknown User', // Safely access fullName
        userAvatar: user ? user.avatar : avatar1, // Use avatar if available
        lastMessage: lastMessage ? lastMessage.content : 'No messages yet', // Get last message content
        lastMessageTime: lastMessage ? lastMessage.timestamp : '', // Get last message timestamp
        unreadCount: lastMessage && !lastMessage.isRead ? 1 : 0, // Example unread count logic
      };
    });
    setChatList(chatData);
    setLoading(false);
  };

  const handleChatPress = (chatId: string) => {
    navigation.navigate('ChatDetail', { chatId });
  };

  const renderChatItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleChatPress(item.id)}>
      <View style={styles.messageContainer}>
        <Image source={item.userAvatar || avatar1} style={styles.avatar} />
        <View style={styles.messageInfo}>
          <Text style={styles.messageName}>{item.userName}</Text>
          <Text style={styles.messageText} numberOfLines={1}>{item.lastMessage}</Text>
        </View>
        <View style={styles.messageMeta}>
          <Text style={styles.messageTime}>{item.lastMessageTime}</Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00D6BE" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <View style={styles.centeredContainer}>
        <Image source={groupImage} style={styles.groupImage} />
        <Text style={styles.noChatText}>You are not logged in.</Text>
        <Text style={styles.loginPrompt}>Please login to your account.</Text>
      </View>
    );
  }

  // If logged in but no chats available
  if (chatList.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Image source={groupImage} style={styles.groupImage} />
        <Text style={styles.noChatText}>No chats available.</Text>
        <Text style={styles.loginPrompt}>Start a conversation!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="cog-outline" size={24} color="#00D6BE" />
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <FlatList
        data={chatList}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f1f1f', // Dark background for chat screen
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#2a2a2a',
    borderBottomWidth: 1,
    borderBottomColor: '#444', // Subtle border at the bottom
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15, // Increased padding for better touch area
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
    backgroundColor: '#1f1f1f', // Ensure uniform background
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  messageInfo: {
    flex: 1,
    justifyContent: 'center', // Center message info vertically
  },
  messageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  messageText: {
    fontSize: 14,
    color: '#bbb', // Softer color for last message text
  },
  messageMeta: {
    alignItems: 'flex-end',
    justifyContent: 'center', // Center message meta vertically
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
  },
  unreadBadge: {
    backgroundColor: '#00D6BE',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1f1f1f', // Match loader background
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1f1f1f', // Match centered container background
  },
  noChatText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  loginPrompt: {
    fontSize: 16,
    color: '#bbb', // Softer color for prompt text
  },
  groupImage: {
    width: 120,
    height: 110, // Adjust height as necessary
    marginBottom: 20, // Space between image and text
  },
});

export default ChatScreen;
