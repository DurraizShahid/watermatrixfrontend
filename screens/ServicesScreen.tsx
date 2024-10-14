// File: /screens/ServicesScreen.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ServicesScreen: React.FC = () => {
  const services = [
    { id: '1', name: 'Master Billing DB', icon: 'database' },
    { id: '2', name: 'Rewards', icon: 'hand-coin' },
    { id: '3', name: 'Service Requests', icon: 'connection' },
    { id: '4', name: 'Dept. Assets', icon: 'crane' },
    { id: '5', name: 'Support', icon: 'headphones' },
  ];

  const options = [
    { id: '1', name: 'Privacy Policy', icon: 'chevron-right' },
    { id: '2', name: 'Contact us', icon: 'chevron-right' },
    { id: '3', name: 'Language', icon: 'chevron-right' },
  ];

  const renderServiceItem = ({ item }: { item: any }) => (
    <View style={styles.serviceCard}>
      <View style={styles.serviceIconContainer}>
        <MaterialCommunityIcons name={item.icon} size={30} color="#00D6BE" />
      </View>
      <Text style={styles.serviceNumber}>{item.id.padStart(2, '0')}</Text>
      <Text style={styles.serviceName}>{item.name}</Text>
    </View>
  );

  const renderOptionItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.optionItem}>
      <Text style={styles.optionText}>{item.name}</Text>
      <MaterialCommunityIcons name={item.icon} size={24} color="#888" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Services</Text>

      {/* Services Grid */}
      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.servicesGrid}
        columnWrapperStyle={styles.columnWrapper}
      />

      {/* Options List */}
      <Text style={styles.optionsHeader}>At a glance</Text>
      {options.map((option) => (
        <View key={option.id}>
          {renderOptionItem({ item: option })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  servicesGrid: {
    paddingVertical: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  serviceCard: {
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    width: '47%',
    alignItems: 'center',
    paddingVertical: 20,
    marginVertical: 10,
  },
  serviceIconContainer: {
    backgroundColor: '#0f4d47',
    borderRadius: 25,
    padding: 15,
    marginBottom: 10,
  },
  serviceNumber: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  optionsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 30,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ServicesScreen;
