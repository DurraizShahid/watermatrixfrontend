import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoginScreen from './LoginScreen'; // Adjust the path based on your project structure
import AddProperty from './AddProperty';
import { useAuth } from '../context/AuthContext';

const Add = () => {
    const navigation = useNavigation();
    const { isLoggedIn, UserId, login,logout } = useAuth();
   
    const handleLoginSuccess = (UserId: string) => {
      login(UserId); 
    };
    console.log(UserId);

    const items = [
        { name: 'Apartment for booking', screen: 'ApartmentScreen' },
        { name: 'Villa for booking', screen: 'VillaScreen' },
        { name: 'Studio for booking', screen: 'StudioScreen' },
        { name: 'Chalet for booking', screen: 'ChaletScreen' },
        { name: 'Lounge for booking', screen: 'LoungeScreen' },
        { name: 'Tent for booking', screen: 'TentScreen' },
        { name: 'Farm for booking', screen: 'FarmScreen' },
        { name: 'Hall for booking', screen: 'HallScreen' },
        { name: 'Add your Own Property', screen: 'AddProperty' }
    ];

    const navigateToScreen = (screenName: string) => {
        if (screenName === 'AddProperty') {
            (navigation as any).navigate("AddProperty", { UserId });
            console.log(UserId);
        }
    };

   

    const handleLogout = () => {
        logout();
        Alert.alert('Logged out', 'You have been logged out successfully.');
      };

    return (
        <View style={styles.container}>
            {isLoggedIn ? (
                <View>
                    {items.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => navigateToScreen(item.screen)}>
                            <Text style={styles.itemText}>{item.name}</Text>
                            <Icon name="chevron-right" size={24} color="#fff" />
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <LoginScreen navigation={navigation} onLoginSuccess={handleLoginSuccess} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
        padding: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#34495e',
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        width: '100%',
    },
    itemText: {
        fontSize: 18,
        color: '#fff',
    },
    logoutButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: 'red',
        borderRadius: 10,
        alignItems: 'center',
    },
    logoutText: {
        color: 'white',
        fontSize: 18,
    },
});

export default Add;
