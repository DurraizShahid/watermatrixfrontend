// File: /navigation/MainNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import SingleChatScreen from '../screens/SingleChatScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import Add from '../screens/Add';
import AddProperty from '../screens/AddProperty';
import LoginScreen from '../screens/LoginScreen';
import AccountScreen from '../screens/AccountScreen';
import Detailedpage from '../screens/Detailedpage';
import Mapp from '../screens/mapadd';
import AdvancedSearch from '../screens/AdvancedSearch';
import SearchResultsScreen from '../screens/SearchResultsScreen';

const Stack = createStackNavigator();

export type RootStackParamList = {
  Splashscreen: undefined;
  Account: undefined;
  GoogleMapscreen: undefined;
  Chat: undefined;
  Services: undefined;
  Add: undefined;
  Listview: undefined;
  Login: undefined;
  Signin: undefined;
  Mapp: { onSelectLocation: (longitude: number, latitude: number) => void };
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Detailedpage" component={Detailedpage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="MainTabs" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="ChatDetail" component={SingleChatScreen} />
      <Stack.Screen name="Favourites" component={FavouritesScreen} />
      <Stack.Screen name="Add"  component={Add} />
      <Stack.Screen name="AddProperty" component={AddProperty} />
      <Stack.Screen name="LoginScreen" component={LoginScreen}/>
      <Stack.Screen name="AccountScreen"  component={AccountScreen} />
      <Stack.Screen name="Detailedpage" component={Detailedpage} />
      <Stack.Screen name="Mapp"   component={Mapp} />
      <Stack.Screen name="AdvancedSearch" component={AdvancedSearch} />
      <Stack.Screen name="SearchResultsScreen" component={SearchResultsScreen} />
      <Stack.Screen name="Detailedpagesearch" component={Detailedpage} />


    

    </Stack.Navigator>
  );
};

export default HomeNavigator;
