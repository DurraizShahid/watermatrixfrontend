import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polygon } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import darkModeStyle from './darkModeStyle';
import CheckBox from '@react-native-community/checkbox';
import Geocoder from 'react-native-geocoding';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { debounce } from 'lodash';

Geocoder.init('YOUR_GOOGLE_API_KEY'); // Replace with your actual API key

const API_BASE_URL = "https://mapmatrixbackend-production.up.railway.app/api/property/properties";
const API_POLYGON_URL = "https://mapmatrixbackend-production.up.railway.app/api/plots/plots";

const GoogleMapscreen: React.FC = () => {
  const [location, setLocation] = useState({ latitude: 33.6, longitude: 73.1, latitudeDelta: 0.05, longitudeDelta: 0.05 });
  const [filter, setFilter] = useState<string>('');
  const [mapType, setMapType] = useState('standard');
  const [activeFilters, setActiveFilters] = useState<string[]>(['All']);
  const [isPaidChecked, setIsPaidChecked] = useState<boolean>(false);
  const [isUnpaidChecked, setIsUnpaidChecked] = useState<boolean>(false);
  const [markers, setMarkers] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const mapViewRef = useRef<MapView | null>(null);
  const navigation = useNavigation();

  const filterOptions = ['All', 'Commercial', 'Residential'];
  const statusOptions = ['InProgress', 'Dis-Conn', 'Conflict', 'New', 'Notice'];

  // Batch Fetch Properties and Polygons in Parallel
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesRes, polygonsRes] = await Promise.all([
          axios.get(API_BASE_URL),
          axios.get(API_POLYGON_URL),
        ]);
        const properties = propertiesRes.data.map(property => ({
          id: property.PropertyId,
          title: property.title,
          description: property.description,
          price: parseFloat(property.price),
          latitude: property.geometry.y,
          longitude: property.geometry.x,
          type: property.type,
          status: property.status,
          IsPaid: property.IsPaid,
        })).filter(marker => marker.latitude && marker.longitude);

        const polygons = polygonsRes.data.map(plot => ({
            id: plot.id,
            coordinates: plot.WKT[0][0].map(coord => ({
              latitude: coord.y,
              longitude: coord.x
            })),
            address1: plot.propertyno, // You can replace this with the appropriate property if needed
            dimension: plot.dimension,
            landuse_su: plot.landuse_su,
            landuse__1: plot.landuse__1,
            sub_sector: plot.sub_sector,
            sector: plot.sector,
          }));

        setMarkers(properties);
        setPolygons(polygons);

        if (properties.length > 0) {
          const { latitude, longitude } = properties[0];
          setLocation({ latitude, longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Could not fetch data.');
      }
    };

    fetchData();
  }, []);

  // Debounce search input
  const handleLocationSearch = useCallback(
    debounce(async (locationName: string) => {
      try {
        const response = await Geocoder.from(locationName);
        const { lat, lng } = response.results[0].geometry.location;

        setLocation({ latitude: lat, longitude: lng, latitudeDelta: 0.05, longitudeDelta: 0.05 });
        mapViewRef.current?.animateToRegion({ latitude: lat, longitude: lng, latitudeDelta: 0.05, longitudeDelta: 0.05 }, 1000);
      } catch (error) {
        console.error('Error finding location:', error);
        Alert.alert('Error', 'Could not find location.');
      }
    }, 500), // Debounce for 500ms
    []
  );

  // Memoize filtered markers
  const markersToDisplay = useMemo(() => {
    return markers.filter(marker => {
      const typeFilterMatch = activeFilters.includes(marker.type) || activeFilters.includes('All');
      const statusFilterMatch = activeFilters.includes(marker.status) || !activeFilters.some(filter => statusOptions.includes(filter));
      const paymentFilterMatch = (isPaidChecked && marker.IsPaid) || (isUnpaidChecked && !marker.IsPaid) || (!isPaidChecked && !isUnpaidChecked);
      const searchFilterMatch = filter ? marker.price.toString().includes(filter) : true;
      return typeFilterMatch && statusFilterMatch && paymentFilterMatch && searchFilterMatch;
    });
  }, [markers, activeFilters, isPaidChecked, isUnpaidChecked, filter]);

  // Memoize toggleFilter function to avoid recreation on each render
  const toggleFilter = useCallback((filterName: string) => {
    setActiveFilters((prevFilters) => {
      // Type filters: Residential, Commercial, All
      if (filterOptions.includes(filterName)) {
        if (filterName === 'All') {
          // If 'All' is selected, deselect other type filters (Commercial, Residential)
          return ['All'];
        } else {
          // If any type filter is selected (Residential or Commercial), deselect 'All'
          const newFilters = prevFilters.filter(f => f !== 'All');
          if (newFilters.includes(filterName)) {
            // If the filter is already active, remove it (toggle off)
            return newFilters.filter(f => f !== filterName);
          }
          // Otherwise, add the type filter
          return [...newFilters, filterName];
        }
      }
  
      // Status filters: InProgress, Conflict, etc.
      if (statusOptions.includes(filterName)) {
        if (prevFilters.includes(filterName)) {
          // Remove status filter if already selected
          return prevFilters.filter(f => f !== filterName);
        }
        // Keep 'All' when adding a status filter
        return [...prevFilters, filterName];
      }
  
      return prevFilters;
    });
  }, [filterOptions, statusOptions]);
  
  const regionPolygons = useMemo(() => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = location;
    const minLat = latitude - latitudeDelta / 2;
    const maxLat = latitude + latitudeDelta / 2;
    const minLng = longitude - longitudeDelta / 2;
    const maxLng = longitude + longitudeDelta / 2;

    return polygons.filter(polygon =>
      polygon.coordinates.some(coord =>
        coord.latitude >= minLat &&
        coord.latitude <= maxLat &&
        coord.longitude >= minLng &&
        coord.longitude <= maxLng
      )
    );
  }, [location, polygons]);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter location"
            placeholderTextColor="gray"
            onSubmitEditing={(event) => handleLocationSearch(event.nativeEvent.text)}
            onChangeText={text => setFilter(text)}
          />
          <Icon name="search" size={20} color="gray" style={styles.searchIcon} />
        </View>

<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
  {filterOptions.map((filterName, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.filterButton, activeFilters.includes(filterName) && { backgroundColor: '#38ADA9' }]}
      onPress={() => toggleFilter(filterName)}
    >
      <Text style={[styles.filterText, activeFilters.includes(filterName) && { color: 'white' }]}>{filterName}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>

        <View style={styles.checkboxContainer}>
          <View style={styles.checkbox}>
            <CheckBox value={isPaidChecked} onValueChange={setIsPaidChecked} />
            <Text style={styles.checkboxLabel}>Paid</Text>
          </View>
          <View style={styles.checkbox}>
            <CheckBox value={isUnpaidChecked} onValueChange={setIsUnpaidChecked} />
            <Text style={styles.checkboxLabel}>Unpaid</Text>
          </View>
        </View>
      </View>

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={location}
        mapType={mapType}
        customMapStyle={darkModeStyle}
        ref={mapViewRef}
      >
{markersToDisplay.length > 0 ? (
  markersToDisplay.map(marker => (
    <Marker
      key={marker.id}
      coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
      onPress={() => navigation.navigate('Detailedpage', { id: marker.id })}
    >
      <View style={[styles.marker, { backgroundColor: marker.status === 'InProgress' ? 'orange' : (marker.IsPaid ? '#018E42' : '#FF3562') }]}>
        {/* Conditional icon rendering based on property type */}
        {marker.type === 'Residential' ? (
          <Icon name="home" size={15} color="white" />
        ) : marker.type === 'Commercial' ? (
          <Icon name="building" size={15} color="white" />
        ) : (
          <Icon name="tint" size={15} color="white" /> // Default icon if type is neither
        )}
        <Text style={styles.markerText}>{marker.price}</Text>
      </View>
    </Marker>
  ))
) : (
  <Marker coordinate={location} title="No properties found" />
)}

        {regionPolygons.length > 0 && regionPolygons.map(polygon => (
          <Polygon
            key={polygon.id}
            coordinates={polygon.coordinates}
            strokeColor="#E4CEFF"
            fillColor="rgba(255,0,0,0.2)"
            strokeWidth={0.5}
          />
        ))}
      </MapView>

      <TouchableOpacity style={styles.currentLocationButton} onPress={() => mapViewRef.current?.animateToRegion(location, 1000)}>
        <Icon name="crosshairs" size={20} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.toggleMapTypeButton} onPress={() => setMapType(prevType => prevType === 'standard' ? 'satellite' : 'standard')}>
        <Icon name="globe" size={20} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.listButton} onPress={() => (navigation as any).navigate('AdvancedSearch')}>
                <Icon name="list" size={20} color="white" />
                <Text style={styles.listButtonText}>List</Text>
            </TouchableOpacity>

      <TouchableOpacity style={styles.favouritesButton} onPress={() => navigation.navigate('FavouritesScreen')}>
        <Icon name="heart-o" size={20} color="white" />
      </TouchableOpacity>        
      <View style={styles.bottomScrollContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bottomScrollContent}>
                    {statusOptions.map((buttonName, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.beottomButton, activeFilters.includes(buttonName) && { backgroundColor: '#38ADA9' }]}
                            onPress={() => toggleFilter(buttonName)}
                        >
                            <Icon name={buttonName === "InProgress" ? "wrench" : buttonName === "Disconnects" ? "times-circle" : buttonName === "Conflict" ? "bolt" : buttonName === "New" ? "star" : "file-text-o"} size={20} color={styles.bottomButtonText.color} style={styles.icon} />
                            <Text style={[styles.bottomButtonText, activeFilters.includes(buttonName) && { color: 'white' }]}>{buttonName}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    filterContainer: {
        padding: 15,
        backgroundColor: '#1F1F1F',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2C2C2C',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        color: 'white',
    },
    searchIcon: {
        marginLeft: 10,
    },
    filterScroll: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    filterButton: {
        backgroundColor: '#19191C',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginRight: 15,
    },
    filterText: {
        color: '#6C768A',
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginVertical: 5,
        borderRadius: 15,
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
        borderRadius: 15,
        borderColor: '#6C768A',
    },
    checkboxLabel: {
        color: '#6C768A',
        marginLeft: 5,
    },
    map: {
        flex: 1,
    },
    marker: {
        flexDirection: 'row', // Align icon and text horizontally
        paddingVertical: 5,
        paddingHorizontal:5, // Increased horizontal padding for wider marker
        borderRadius: 5,
        alignItems: 'center',
    },
    markerText: {
        color: 'white',
        marginLeft: 1,
    },
    currentLocationButton: {
        position: 'absolute',
        bottom: 90,
        right: 10,
        backgroundColor: '#23252F',
        borderRadius: 50,
        padding: 20,
    },
    listButton: {
        position: 'absolute',
        bottom: 90,
        left: 10,
        backgroundColor: '#23252F',
        borderRadius: 50,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    listButtonText: {
        left: 10,
    },    
    toggleMapTypeButton: {
        position: 'absolute',
        bottom: 160,
        left: 10,
        backgroundColor: '#23252F',
        borderRadius: 40,
        padding: 20,
    },
    favouritesButton: {
        position: 'absolute',
        bottom: 160,
        right: 10,
        backgroundColor: '#23252F',
        borderRadius: 50,
        padding: 20,
    },
    bottomScrollContainer: {
        position: 'absolute',
        bottom: 30,
        width: '100%',
    },
    bottomScrollContent: {
        paddingHorizontal: 10,
    },
    beottomButton: {
        backgroundColor: '#19191C',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginRight: 10,
    },
    bottomButtonText: {
        color: '#6C768A',
        marginLeft: 10,
    },
    icon: {
        color: '#6C768A',
    },
});

export default GoogleMapscreen;