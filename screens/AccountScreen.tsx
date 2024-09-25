// File: /screens/AccountScreen.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LoginScreen from './LoginScreen';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import userData from '../screens/userdummyData'; // Ensure the correct path to your userdummyData.js file

const AccountScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isLoggedIn, userData: loggedInUserData = {}, login, logout } = useAuth(); 

  const handleLoginSuccess = (id: string) => {
    login(id);
  };

  const handleLogout = () => {
    logout();
    Alert.alert('Logged out', 'You have been logged out successfully.', [
      { text: 'OK', onPress: () => navigation.navigate('LoginScreen') },
    ]);
  };

  const userFullName = loggedInUserData.id ? 
  userData.find(user => user.id === loggedInUserData.id)?.fullName || 'User' : 
  'Guest'; // Default to 'Guest' if no id

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <Text style={styles.header}>Account and Settings</Text>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileInfo}>
              <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
                <Text style={styles.profileName}>{userFullName}</Text>
                <Text style={styles.viewProfile}>View Profile</Text>
              </TouchableOpacity>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#00D6BE" />
          </View>

          {/* Legal Section */}
          <Text style={styles.sectionHeader}>Legal</Text>
          <View style={styles.legalSection}>
            <MaterialCommunityIcons name="file-document-outline" size={24} color="#fff" />
            <View style={styles.legalInfo}>
              <Text style={styles.legalTitle}>Copyright 2024</Text>
              <Text style={styles.legalSubtitle}>Subheading</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#00D6BE" />
          </View>
          <TouchableOpacity style={styles.privacyButton} onPress={() => Linking.openURL('https://your-privacy-policy-url.com')}>
            <Text style={styles.privacyButtonText}>VIEW PRIVACY POLICY</Text>
          </TouchableOpacity>

          {/* Activity Section */}
          <Text style={styles.sectionHeader}>Activity</Text>
          <View style={styles.activitySection}>
            <TouchableOpacity style={styles.activityItem}>
              <MaterialCommunityIcons name="account-outline" size={24} color="#fff" />
              <Text style={styles.activityText}>My Ads</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.activityItem}>
              <MaterialCommunityIcons name="lock-outline" size={24} color="#fff" />
              <Text style={styles.activityText}>Requests</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.activityItem}>
              <MaterialCommunityIcons name="calendar-check-outline" size={24} color="#fff" />
              <Text style={styles.activityText}>My Bookings</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.activityItem}>
              <MaterialCommunityIcons name="home-outline" size={24} color="#fff" />
              <Text style={styles.activityText}>My Neighbourhoods</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Offices Section */}
          <Text style={styles.sectionHeader}>Offices</Text>
          <View style={styles.activitySection}>
            <TouchableOpacity style={styles.activityItem} onPress={() => navigation.navigate('PaymentsScreen')}>
              <Text style={styles.activityText}>Payments</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.activityItem} onPress={() => navigation.navigate('ManageCardsScreen')}>
              <Text style={styles.activityText}>Manage Cards</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Account Settings */}
          <View style={styles.activitySection}>
            <TouchableOpacity style={styles.activityItem} onPress={() => navigation.navigate('UpdateProfileScreen')}>
              <Text style={styles.activityText}>Update Profile</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.activityItem} onPress={() => navigation.navigate('ChangePasswordScreen')}>
              <Text style={styles.activityText}>Change Password</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.activityItem} onPress={() => navigation.navigate('ChangeMobileNumberScreen')}>
              <Text style={styles.activityText}>Change Mobile Number</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.activityItem} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#888" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <LoginScreen navigation={navigation} onLoginSuccess={handleLoginSuccess} />
      )}

      {/* Footer */}
      <Text style={styles.footer}>Test Version 0.01</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 40, // Increased spacing
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  viewProfile: {
    fontSize: 14,
    color: '#888',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 10,
  },
  legalSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  legalInfo: {
    flex: 1,
    marginLeft: 15,
  },
  legalTitle: {
    fontSize: 16,
    color: '#fff',
  },
  legalSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  privacyButton: {
    backgroundColor: '#00D6BE',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  privacyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  activitySection: {
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activityText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  logoutText: {
    flex: 1,
    fontSize: 16,
    color: '#FF6347', // Red color for logout
    marginLeft: 10,
  },
  footer: {
    textAlign: 'center',
    color: '#888',
    paddingVertical: 10,
  },
});

export default AccountScreen;
