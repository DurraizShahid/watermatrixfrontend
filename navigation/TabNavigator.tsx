// File: /navigation/TabNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AccountScreen from '../screens/AccountScreen';
import ChatScreen from '../screens/ChatScreen';
import GoogleMapscreen from '../screens/GoogleMapscreen';
import ServicesScreen from '../screens/ServicesScreen';
import CustomTabBar from './CustomTabBar';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Search"  // Set Search as the initial tab
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Account" component={AccountScreen} />
      <Tab.Screen name="Search" component={GoogleMapscreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
