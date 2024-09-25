import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const FavouritesScreen: React.FC = () => {
  const [isFavouriteTab, setIsFavouriteTab] = useState(true);

  // Dummy data for properties
  const favouriteProperties: any[] = []; // Your favourite properties data

  const renderPropertyItem = ({ item }: { item: any }) => (
    <View style={styles.propertyContainer}>
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyType}>{item.type}</Text>
        <Text style={styles.propertyPrice}>{item.price}</Text>
        <Text style={styles.propertyDetails}>{item.details}</Text>
        <Text style={styles.propertyAddress}>{item.address}</Text>
      </View>
      <Image source={{ uri: item.image }} style={styles.propertyImage} />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image source={require('../images/sadboi.png')} style={styles.emptyImage} />
      <Text style={styles.emptyTitle}>You have no favourites</Text>
      <Text style={styles.emptySubtitle}>
        Start adding and view them here. You can add them using the heart icon.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favourites</Text>
      </View>

      {/* Conditional Rendering */}
      {favouriteProperties.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={favouriteProperties}
          renderItem={renderPropertyItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#1f1f1f',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContent: {
    padding: 20,
  },
  propertyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyType: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  propertyPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00D6BE',
  },
  propertyDetails: {
    fontSize: 14,
    color: '#888',
    marginVertical: 5,
  },
  propertyAddress: {
    fontSize: 12,
    color: '#888',
  },
  propertyImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyImage: {
    width: 110,  // Adjust size as needed
    height: 100, // Adjust size as needed
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default FavouritesScreen;
