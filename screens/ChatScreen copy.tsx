import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Import images from the local folder
import avatar1 from '../images/avatar1.jpeg';
import avatar2 from '../images/avatar2.jpeg';
import avatar3 from '../images/avatar3.jpeg';

const ChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]); // State to hold messages
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Simulate a delay to show loading spinner, then load dummy data
    setTimeout(() => {
      fetchMessages(); // Fetch messages (now using dummy data)
    }, 1000);
  }, []);

  // Replace fetchMessages with static dummy data and local images
  const fetchMessages = () => {
    const dummyMessages = [
      {
        id: '1',
        avatar: avatar1, // Use local image
        name: 'Ali Kazami',
        message: 'So when can i come see the property?',
        time: '10:30 AM',
        unread: 2,
      },
      {
        id: '2',
        avatar: avatar2, // Use local image
        name: 'Muhammad Arshad',
        message: 'Any rental problems that we might have to address?',
        time: 'Yesterday',
        unread: 0,
      },
      {
        id: '3',
        avatar: avatar3, // Use local image
        name: 'AliNadeem22',
        message: 'Thank you for your stay 😊',
        time: '2 days ago',
        unread: 1,
      },
    ];
    setMessages(dummyMessages);
    setLoading(false);
  };

  const renderMessageItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => navigation.navigate('SingleChatScreen', { chatId: item.id })}>
      <View style={styles.messageContainer}>
        <Image source={item.avatar} style={styles.avatar} />
        <View style={styles.messageInfo}>
          <Text style={styles.messageName}>{item.name}</Text>
          <Text style={styles.messageText} numberOfLines={1}>{item.message}</Text>
        </View>
        <View style={styles.messageMeta}>
          <Text style={styles.messageTime}>{item.time}</Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="cog-outline" size={24} color="#00D6BE" />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#1f1f1f',
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  messageInfo: {
    flex: 1,
  },
  messageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  messageText: {
    fontSize: 14,
    color: '#888',
  },
  messageMeta: {
    alignItems: 'flex-end',
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
    backgroundColor: '#0d0d0d',
  },
});

export default ChatScreen;
