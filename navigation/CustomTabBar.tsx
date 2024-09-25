// File: /navigation/CustomTabBar.tsx

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// Import your SVG icons
import AccountIcon from '../assets/AccountIcon';
import SearchIcon from '../assets/SearchIcon';
import ChatIcon from '../assets/ChatIcon';
import ServicesIcon from '../assets/ServicesIcon';
import PlusIcon from '../assets/PlusIcon'; // Import the PlusIcon component

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;

        // Determine which icon to display
        const renderIcon = () => {
          switch (route.name) {
            case 'Account':
              return <AccountIcon width={25} height={24} fill={isFocused ? '#00D6BE' : '#676D75'} />;
            case 'Search':
              return <SearchIcon width={25} height={24} fill={isFocused ? '#00D6BE' : '#676D75'} />;
            case 'Chat':
              return <ChatIcon width={26} height={25} fill={isFocused ? '#00D6BE' : '#676D75'} />;
            case 'Services':
              return <ServicesIcon width={26} height={24} fill={isFocused ? '#00D6BE' : '#676D75'} />;
            default:
              return null;
          }
        };

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
          >
            {renderIcon()}
            <Text style={{ color: isFocused ? '#00D6BE' : '#676D75', fontSize: 12 }}>
              {`${label}`}
            </Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => {
          // Define the action for FAB button here
          (navigation as any).navigate('AddProperty');
        }}
      >
        <PlusIcon width={24} height={24} fill="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#1f1f1f',
    borderTopWidth: 0.5,
    borderTopColor: '#2a2a2a',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    left: '50%',
    backgroundColor: '#00D6BE',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    transform: [{ translateX: -30 }],
    zIndex: 10,
    borderColor: '#1f1f1f',
    borderWidth: 3,
  },
});

export default CustomTabBar;
