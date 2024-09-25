import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { getProperties, addProperty, Property } from '../api/propertyApi'; // Import API functions
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for search icon

const MapScreen: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]); // State for properties
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // State to control the modal visibility
  const [propertyName, setPropertyName] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null); // Change to number to handle null
  const [longitude, setLongitude] = useState<number | null>(null); // Change to number to handle null
  const [price, setPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    fetchProperties(); // Fetch properties when the component mounts
  }, []);

  const fetchProperties = async () => {
    try {
      const fetchedProperties = await getProperties();
      setProperties(fetchedProperties);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error as string);
    }
  };

  const handleAddProperty = async () => {
    if (!propertyName || latitude === null || longitude === null || !price) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    setLoading(true);
    try {
      const newProperty: Property = {
        name: propertyName,
        description,
        latitude,
        longitude,
        price: parseFloat(price),
        area: 'Some Area', // Ensure you have an area field here
      };
      await addProperty(newProperty);
      Alert.alert('Success', 'Property added successfully.');
      setModalVisible(false); // Close the modal after adding property
      fetchProperties(); // Refresh properties on the map
    } catch (error) {
      Alert.alert('Error', error as string);
    } finally {
      setLoading(false);
    }
  };

  const onMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLatitude(latitude);
    setLongitude(longitude);
    setModalVisible(true); // Open the modal with the selected location
  };

  // Filter properties based on the search query
  const filteredProperties = properties.filter((property) => {
    const areaString = property.area.toString().toLowerCase(); // Ensure it's a string and lowercase
    return areaString.includes(searchQuery.toLowerCase()); // Compare with lowercase searchQuery
  });

  // Function to handle search button press
  const handleSearch = () => {
    // This function can perform additional actions if needed
    console.log('Search triggered with query:', searchQuery);
  };

  return (
    <View style={styles.container}>
      {/* Location Search Bar */}
      <GooglePlacesAutocomplete
        placeholder="Search"
        fetchDetails={true}
        onPress={(data, details = null) => {
          const lat = details?.geometry.location.lat;
          const lng = details?.geometry.location.lng;
          if (lat && lng) {
            setLatitude(lat);
            setLongitude(lng);
            mapRef.current?.animateToRegion({
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }, 1000);
            setModalVisible(true); 
          }
        }}
        query={{
          key: 'YOUR_GOOGLE_API_KEY', // Replace with your Google Maps API Key
          language: 'en',
        }}
        styles={{
          container: {
            position: 'absolute',
            top: 10,
            width: '100%',
            zIndex: 1,
          },
          listView: {
            backgroundColor: 'white',
          },
        }}
      />

      {/* Area Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Area"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Google Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={onMapPress} // Get coordinates when pressing the map
      >
        {filteredProperties.map((property) => (
          <Marker
            key={property.id}
            coordinate={{ latitude: property.latitude, longitude: property.longitude }}
          >
            <View style={styles.marker}>
              <Text style={styles.markerText}>{property.price}K</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Floating Add Property Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Property</Text>
      </TouchableOpacity>

      {/* Add Property Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Property</Text>
            <TextInput
              style={styles.input}
              placeholder="Property Name"
              value={propertyName}
              onChangeText={setPropertyName}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Latitude"
              value={latitude ? latitude.toString() : ''}
              onChangeText={(text) => setLatitude(parseFloat(text))}
              keyboardType="numeric"
              editable={false} // Make latitude and longitude non-editable
            />
            <TextInput
              style={styles.input}
              placeholder="Longitude"
              value={longitude ? longitude.toString() : ''}
              onChangeText={(text) => setLongitude(parseFloat(text))}
              keyboardType="numeric"
              editable={false} // Make latitude and longitude non-editable
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleAddProperty} disabled={loading}>
              <Text style={styles.modalButtonText}>{loading ? 'Adding...' : 'Add Property'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 60, // Adjust based on your layout
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    zIndex: 1,
    elevation: 2, // To make it stand out
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#00D6BE',
    borderRadius: 5,
    padding: 10,
  },
  map: {
    flex: 1,
  },
  marker: {
    backgroundColor: '#00D6BE',
    padding: 5,
    borderRadius: 5,
  },
  markerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#00D6BE',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  modalButton: {
    backgroundColor: '#00D6BE',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
});

export default MapScreen;
