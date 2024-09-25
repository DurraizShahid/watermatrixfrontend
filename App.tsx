// File: /App.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import TabNavigator from './navigation/TabNavigator';
import OTPScreen from './screens/OTPScreen';
import HomeNavigator from './navigation/MainNavigator';
import { AuthProvider } from './context/AuthContext';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <AuthProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={HomeNavigator}/>
        <Stack.Screen name="Account" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
