import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import darkModeStyle from './darkModeStyle';
import CheckBox from '@react-native-community/checkbox';
import Geocoder from 'react-native-geocoding';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

Geocoder.init('AIzaSyCbuY6KKFkmb4wkMzCsOskkxd7btxHCZ-w');

const API_BASE_URL = "https://mapmatrixbackend-production.up.railway.app/api/property/properties";

const GoogleMapscreen: React.FC = () => {
    const [location, setLocation] = useState({ latitude: 33.6, longitude: 73.1, latitudeDelta: 0.05, longitudeDelta: 0.05 });
    const [filter, setFilter] = useState<string>('');
    const [mapType, setMapType] = useState('standard');
    const [activeFilters, setActiveFilters] = useState<string[]>(["All"]);
    const [isPaidChecked, setIsPaidChecked] = useState<boolean>(false);
    const [isUnpaidChecked, setIsUnpaidChecked] = useState<boolean>(false);
    const [markers, setMarkers] = useState([]);
    const navigation = useNavigation();
    const mapViewRef = useRef<MapView | null>(null);

    const filterOptions = ["All", "Commercial", "Residential"];
    const statusOptions = ["InProgress", "Dis-Conn", "Conflict", "New", "Notice"];

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get(API_BASE_URL);
                console.log('API Response:', response.data); 
                const properties = response.data;

                const formattedMarkers = properties.map(property => {
                    const longitude = property.geometry.x; 
                    const latitude = property.geometry.y; 

                    if (typeof latitude !== 'number' || !isFinite(latitude) || typeof longitude !== 'number' || !isFinite(longitude)) {
                        console.warn(`Invalid coordinates for property ID ${property.PropertyId}:`, { latitude, longitude });
                        return null; 
                    }

                    return {
                        id: property.PropertyId,
                        title: property.title,
                        description: property.description,
                        price: parseFloat(property.price),
                        latitude,
                        longitude,
                        type: property.type,
                        status: property.status,
                        IsPaid: parseFloat(property.price) > 0,
                    };
                }).filter(marker => marker !== null); 

                console.log('Fetched markers:', formattedMarkers);
                setMarkers(formattedMarkers);

                if (formattedMarkers.length > 0) {
                    const { latitude, longitude } = formattedMarkers[0];
                    setLocation({ latitude, longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 });
                }
            } catch (error) {
                console.error('Error fetching properties:', error);
                Alert.alert('Error', 'Could not fetch properties.');
            }
        };

        fetchProperties();
    }, []);
    
    const filteredMarkers = () => {
        return markers.filter(marker => {
            const typeFilterMatch = activeFilters.includes(marker.type) || activeFilters.includes("All");
            const statusFilterMatch = activeFilters.includes(marker.status) || !activeFilters.some(filter => statusOptions.includes(filter));
            const paymentFilterMatch = (isPaidChecked && marker.IsPaid) || (isUnpaidChecked && !marker.IsPaid) || (!isPaidChecked && !isUnpaidChecked);
            const searchFilterMatch = filter ? marker.price.toString().includes(filter) : true;
            return typeFilterMatch && statusFilterMatch && paymentFilterMatch && searchFilterMatch;
        });
    };

    const handleLocationSearch = async (locationName: string) => {
        try {
            const response = await Geocoder.from(locationName);
            const { lat, lng } = response.results[0].geometry.location;
    
            setLocation({
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
    
            if (mapViewRef.current) {
                mapViewRef.current.animateToRegion({
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }, 1000);
            }
        } catch (error) {
            console.error('Error finding location:', error);
            Alert.alert('Error', 'Could not find location.');
        }
    };

    const markersToDisplay = filteredMarkers();

    const centerMapOnLocation = () => {
        if (location && mapViewRef.current) {
            mapViewRef.current.animateToRegion(location, 1000);
        }
    };

    const toggleMapType = () => {
        setMapType(prevType => {
            if (prevType === 'standard') return 'satellite';
            if (prevType === 'satellite') return 'terrain';
            if (prevType === 'terrain') return 'hybrid';
            return 'standard';
        });
    };

    const toggleFilter = (filterName: string) => {
        setActiveFilters(prevFilters => {
            if (prevFilters.includes(filterName)) {
                return prevFilters.filter(f => f !== filterName);
            } else {
                return [...prevFilters, filterName];
            }
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Enter location"
                        placeholderTextColor="gray"
                        fetchDetails={true}
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
                mapType={mapType} // Passing the mapType state
                customMapStyle={darkModeStyle}
            >
                {markersToDisplay.length > 0 ? (
                    markersToDisplay.map(marker => (
                        <Marker
                            key={marker.id}
                            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                            onPress={() => (navigation as any).navigate('Detailedpage', { id: marker.id })}
                        >
                            <View style={[styles.marker, { backgroundColor: marker.status === "InProgress" ? 'orange' : (marker.IsPaid ? '#018E42' : '#FF3562') }]}>
                                <Icon name="tint" size={15} color="white" />
                                <Text style={styles.markerText}>{marker.price}</Text>
                            </View>
                        </Marker>
                    ))
                ) : (
                    <Marker coordinate={location} title="No properties found" />
                )}
            </MapView>

            <TouchableOpacity style={styles.currentLocationButton} onPress={centerMapOnLocation}>
                <Icon name="crosshairs" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.toggleMapTypeButton} onPress={toggleMapType}>
                <Icon name="globe" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.favouritesButton} onPress={() => (navigation as any).navigate('Favourites')}>
                <Icon name="heart-o" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.listButton} onPress={() => (navigation as any).navigate('AdvancedSearch')}>
                <Icon name="list" size={20} color="white" />
                <Text style={styles.listButtonText}>List</Text>
            </TouchableOpacity>

            <View style={styles.bottomScrollContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bottomScrollContent}>
                    {statusOptions.map((buttonName, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.bottomButton, activeFilters.includes(buttonName) && { backgroundColor: '#38ADA9' }]}
                            onPress={() => toggleFilter(buttonName)}
                        >
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
        marginLeft: 1, // Added space between icon and text
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
    bottomButton: {
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