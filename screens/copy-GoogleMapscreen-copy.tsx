import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, PermissionsAndroid } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region, Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import darkModeStyle from './darkModeStyle';
import dummyData from './dummyData';
import CheckBox from '@react-native-community/checkbox';

const showNoFavouritesMessage = () => {
    Alert.alert("No favourites added", "You haven't added any favourites yet.");
};

const GoogleMapscreen: React.FC = () => {
    const [location, setLocation] = useState<Region | null>(null);
    const [filter, setFilter] = useState<string>('');
    const [mapType, setMapType] = useState('standard');
    const [activeFilters, setActiveFilters] = useState<string[]>(["All"]);
    const [isPaidChecked, setIsPaidChecked] = useState<boolean>(false);
    const [isUnpaidChecked, setIsUnpaidChecked] = useState<boolean>(false);
    const [markers, setMarkers] = useState([]);
    const mapViewRef = useRef<MapView | null>(null);
    const navigation = useNavigation();

    const filterOptions = ["All", "Commercial", "Residential"];
    const statusOptions = ["InProgress", "Dis-Conn", "Conflict", "New", "Notice"];


    const toggleFilter = (filterName: string) => {
        if (filterOptions.includes(filterName)) {
            setActiveFilters(prevFilters => {
                if (filterName === "All") {
                    return prevFilters.includes("All") ? [] : ["All"];
                }
                return [filterName];
            });
        } else if (statusOptions.includes(filterName)) {
            setActiveFilters((prevFilters) => {
                if (prevFilters.includes(filterName)) {
                    return prevFilters.filter(f => f !== filterName);
                } else {
                    return [...prevFilters, filterName];
                }
            });
        }
    };

    useEffect(() => {
        const requestLocationPermission = async () => {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Location Permission",
                        message: "This app needs access to your location.",
                        buttonPositive: "OK",
                        buttonNegative: "Cancel",
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    fetchUserLocation();
                } else {
                    Alert.alert("Permission Denied", "Location permission denied. App cannot fetch location.");
                }
            } catch (error) {
                console.error("Error requesting location permission:", error);
            }
        };

        const fetchUserLocation = () => {
            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    const initialRegion: Region = {
                        latitude,
                        longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    };
                    setLocation(initialRegion);

                    // Generate random marker positions only once
                    const generatedMarkers = dummyData.map(item => ({
                        ...item,
                        latitude: latitude + (Math.random() - 0.5) * 0.01,
                        longitude: longitude + (Math.random() - 0.5) * 0.01,
                    }));
                    setMarkers(generatedMarkers);
                },
                error => {
                    console.error('Error getting location:', error);
                    Alert.alert('Error', 'Could not get your location.');
                },
                { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 }
            );
        };

        requestLocationPermission();
    }, []);

    const filteredMarkers = () => {
        if (!location) return [];
        
        const isAnyBottomFilterActive = activeFilters.some(filter => statusOptions.includes(filter));
        
        return markers.filter(marker => {
            const typeFilterMatch = activeFilters.includes(marker.type) || activeFilters.includes("All");
            const statusFilterMatch = isAnyBottomFilterActive ? activeFilters.some(filter => filter === marker.status) : true;
            const paymentFilterMatch = (isPaidChecked && marker.IsPaid) || (isUnpaidChecked && !marker.IsPaid) || (!isPaidChecked && !isUnpaidChecked);
            return typeFilterMatch && statusFilterMatch && paymentFilterMatch;
        });
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

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by Area"
                        placeholderTextColor="gray"
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

            {location && (
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    ref={mapViewRef}
                    mapType={mapType}
                    initialRegion={location}
                    customMapStyle={darkModeStyle}
                >
                    {markersToDisplay.map((marker, index) => (
                        <Marker
                            key={index}
                            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                            onPress={() => navigation.navigate('Detailedpage', { id: marker.id })}
                        >
                            <View style={[styles.marker, { backgroundColor: marker.status === "InProgress" ? 'orange' : (marker.IsPaid ? '#018E42' : '#FF3562') }]} >
                                <Icon name="tint" size={30} color="white" />
                                <Text style={styles.markerText}>{marker.area}</Text>
                            </View>
                        </Marker>
                    ))}
                </MapView>
            )}

            <TouchableOpacity style={styles.currentLocationButton} onPress={centerMapOnLocation}>
                <Icon name="crosshairs" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.listButton} onPress={() => navigation.navigate('AdvancedSearch')}>
                <Icon name="list" size={20} color="white" />
                <Text style={styles.listButtonText}>List</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toggleMapTypeButton} onPress={toggleMapType}>
                <Icon name="globe" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.favouritesButton} onPress={showNoFavouritesMessage}>
                <Icon name="heart-o" size={20} color="white" />
            </TouchableOpacity>

            <View style={styles.bottomScrollContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bottomScrollContent}>
                    {statusOptions.map((buttonName, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.bottomButton, activeFilters.includes(buttonName) && { backgroundColor: '#38ADA9' }]}
                            onPress={() => toggleFilter(buttonName)}
                        >
                            <Icon name={buttonName === "InProgress" ? "wrench" : buttonName === "Dis-Conn" ? "times-circle" : buttonName === "Conflict" ? "bolt" : buttonName === "New" ? "star" : "file-text-o"} size={20} color={styles.bottomButtonText.color} style={styles.icon} />
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
        padding: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    markerText: {
        color: 'white',
        marginTop: 5,
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
