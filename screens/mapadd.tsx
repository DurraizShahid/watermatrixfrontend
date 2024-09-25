import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Alert, PermissionsAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/MainNavigator';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

type Coordinate = {
    latitude: number;
    longitude: number;
};

type Region = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

const Mapp = () => {
    const [location, setLocation] = useState<Region | null>(null);
    const [markerPosition, setMarkerPosition] = useState<Coordinate | null>(null);
    const [locationFetched, setLocationFetched] = useState(false);
    const navigation = useNavigation<any>();
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
                const initialRegion: Region = {
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

    const handleDragEnd = (e: { nativeEvent: { coordinate: Coordinate }; }) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setMarkerPosition({ latitude, longitude });
    };

    const handleConfirmLocation = () => {
        if (markerPosition && route.params?.onSelectLocation) {
            const { latitude, longitude } = markerPosition;
            route.params.onSelectLocation(longitude, latitude);
            (navigation as any).goBack();
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
                            const region: Region = {
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
                        key: 'YOUR_GOOGLE_API_KEY',
                        language: 'en',
                    }}
                    styles={{
                        container: {
                            flex: 0,
                            width: '100%',
                        },
                        listView: {
                            backgroundColor: 'white',
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
                >
                    {markerPosition && (
                        <Marker
                            coordinate={markerPosition}
                            draggable
                            onDragEnd={handleDragEnd}
                        />
                    )}
                </MapView>
            )}
            <View style={styles.buttonsContainer}>
                {locationFetched && (
                    <Button title="Get Current Location" onPress={handleGetLocation} />
                )}
                <Button title="Confirm Location" onPress={handleConfirmLocation} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    autocompleteContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        zIndex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    buttonsContainer: {
        position: 'absolute',
        top: 80,
        left: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 1,
    },
});

export default Mapp;
