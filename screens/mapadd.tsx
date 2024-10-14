import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Alert, PermissionsAndroid, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import darkModeStyle from '../screens/darkModeStyle'; // Ensure this is imported correctly

const Mapp = () => {
    const [location, setLocation] = useState(null);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [locationFetched, setLocationFetched] = useState(false);
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RootStackParamList, 'Mapp'>>();

    useEffect(() => {
        const requestLocationPermission = async () => {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Location Permission",
                        message: "This app needs access to your location.",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    fetchLocation();
                } else {
                    Alert.alert("Permission Denied", "Location permission denied. App cannot fetch location.");
                }
            } catch (error) {
                console.error("Error requesting location permission:", error);
                Alert.alert("Permission Error", "An error occurred while requesting location permission.");
            }
        };

        requestLocationPermission();
    }, []);

    const fetchLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const initialRegion = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                };
                setLocation(initialRegion);
                setMarkerPosition({ latitude, longitude });
                setLocationFetched(true);
            },
            (error) => {
                console.error("Error fetching location:", error);
                Alert.alert("Error", "Could not fetch location. Please try again.");
            },
            { enableHighAccuracy: false, timeout: 50000, maximumAge: 1000 }
        );
    };

    const handleConfirmLocation = () => {
        if (markerPosition && route.params?.onSelectLocation) {
            const { latitude, longitude } = markerPosition;
            route.params.onSelectLocation(longitude, latitude);
            navigation.goBack();
        }
    };

    const handleGetLocation = () => {
        fetchLocation();
    };

    return (
        <View style={styles.container}>
            <View style={styles.autocompleteContainer}>
                <GooglePlacesAutocomplete
                    placeholder='Search'
                    fetchDetails={true}
                    onPress={(data, details = null) => {
                        const latitude = details?.geometry.location.lat;
                        const longitude = details?.geometry.location.lng;
                        if (latitude && longitude) {
                            const region = {
                                latitude,
                                longitude,
                                latitudeDelta: 0.005,
                                longitudeDelta: 0.005,
                            };
                            setLocation(region);
                            setMarkerPosition({ latitude, longitude });
                        }
                    }}
                    query={{
                        key: 'AIzaSyCbuY6KKFkmb4wkMzCsOskkxd7btxHCZ-w', // Replace with your actual Google API Key
                        language: 'en',
                    }}
                    styles={{
                        container: {
                            flex: 0,
                            width: '100%',
                        },
                        listView: {
                            backgroundColor: '#23252F', // Dark background for the list view
                        },
                        textInputContainer: {
                            backgroundColor: '#2C2F33', // Darker background for the input field
                            borderTopWidth: 0,
                            borderBottomWidth: 0,
                            borderRadius: 5,
                        },
                        textInput: {
                            height: 40,
                            color: '#FFFFFF', // Text color for input
                            paddingHorizontal: 10,
                            backgroundColor: '#2C2F33', // Match input field background with container
                        },
                        row: {
                            backgroundColor: '#23252F', // Background for each result item
                            padding: 15,
                        },
                        text: {
                            color: '#FFFFFF', // Text color for each result item
                        },
                        poweredContainer: {
                            backgroundColor: '#23252F', // Background color for powered by Google text
                        },
                        powered: {
                            color: '#FFFFFF', // Text color for powered by Google
                        },
                    }}
                />
            </View>
            {location && (
                <MapView
                    style={styles.map}
                    region={location}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    //customMapStyle={darkModeStyle} // Use dark mode styles correctly
                >
                    {markerPosition && (
                        <Marker
                            coordinate={markerPosition}
                            draggable={true} // Enable dragging
                            onDragEnd={(e) => {
                                const newCoordinate = e.nativeEvent.coordinate;
                                setMarkerPosition(newCoordinate); // Update marker position on drag end
                            }}
                        />
                    )}
                </MapView>
            )}
            <View style={styles.buttonsContainer}>
                {locationFetched && (
                    <Button title="Get Current Location" onPress={handleGetLocation} />
                )}
            </View>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
                <Text style={styles.confirmButtonText}>Confirm Location</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    autocompleteContainer: {
        position: 'absolute',
        top: 20,
        left: 10,
        right: 10,
        zIndex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    buttonsContainer: {
        position: 'absolute',
        bottom: 90,
        left: 10,
        right: 10,
        zIndex: 1,
    },
    confirmButton: {
        backgroundColor: '#23252F',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        borderRadius: 5,
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Mapp;