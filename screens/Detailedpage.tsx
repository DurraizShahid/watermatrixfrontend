import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios'; // Ensure axios is installed

const { width: screenWidth } = Dimensions.get('window'); // Get screen width

const Detailedpage: React.FC = () => {
    const route = useRoute();
    const { id } = route.params; // Get the property ID from the route

    const [propertyData, setPropertyData] = useState({});
    const [nearbyFacilities, setNearbyFacilities] = useState([]);

    // Fetch all property data and find the one with the matching ID
    useEffect(() => {
        const fetchPropertyData = async () => {
            try {
                const response = await axios.get('https://mapmatrixbackend-production.up.railway.app/api/property/properties/');
                const properties = response.data;

                // Find the property that matches the id from the route
                const property = properties.find(item => item.PropertyId === parseInt(id));

                if (property) {
                    setPropertyData(property);
                } else {
                    console.error('Property not found');
                }
            } catch (error) {
                console.error('Error fetching property data:', error);
            }
        };

        if (id) {
            fetchPropertyData();
        }
    }, [id]);

    const { geometry, title, address, area, kitchen, water, electricity, furnished, price, description } = propertyData;
    const latitude = geometry?.y;
    const longitude = geometry?.x;

    // Fetch nearby facilities from Google Maps Places API
    useEffect(() => {
        const fetchNearbyFacilities = async () => {
            const API_KEY = 'AIzaSyCbuY6KKFkmb4wkMzCsOskkxd7btxHCZ-w'; // Replace with your API key
            const radius = 1500; // Search within 1500 meters
            const types = 'grocery_or_supermarket|hospital|restaurant|train_station'; // Types of facilities

            try {
                const response = await axios.get(
                    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${types}&key=${API_KEY}`
                );

                const facilities = response.data.results;

                // Filter to get the nearest facility of each type
                const uniqueFacilities = {};
                facilities.forEach(place => {
                    if (place.types) {
                        place.types.forEach(type => {
                            if (!uniqueFacilities[type]) {
                                if (type === 'grocery_or_supermarket') {
                                    uniqueFacilities['Minimarket'] = {
                                        name: place.name,
                                        distance: place.vicinity,
                                        emoji: '🛒'
                                    };
                                } else if (type === 'hospital') {
                                    uniqueFacilities['Hospital'] = {
                                        name: place.name,
                                        distance: place.vicinity,
                                        emoji: '🏥'
                                    };
                                } else if (type === 'restaurant') {
                                    uniqueFacilities['Public Canteen'] = {
                                        name: place.name,
                                        distance: place.vicinity,
                                        emoji: '🍽️'
                                    };
                                } else if (type === 'train_station') {
                                    uniqueFacilities['Train Station'] = {
                                        name: place.name,
                                        distance: place.vicinity,
                                        emoji: '🚉'
                                    };
                                }
                            }
                        });
                    }
                });

                setNearbyFacilities(Object.values(uniqueFacilities));
            } catch (error) {
                console.error('Error fetching nearby facilities:', error);
            }
        };

        if (latitude && longitude) {
            fetchNearbyFacilities();
        }
    }, [latitude, longitude]);

    // Function to open Google Maps with the location
    const openMap = () => {
        const url = `https://www.google.com/maps/@${latitude},${longitude},15z`; // 15z is the zoom level
        Linking.openURL(url);
    };

    return (
        <ScrollView style={styles.container} horizontal={false}>
            {/* Image at the top, full width of the screen */}
            <View style={styles.imageCarouselContainer}>
                <Image source={require('../images/home.jpg')} style={styles.topImage} />
                <View style={styles.imageCountContainer}>
                    <Text style={styles.imageCountText}>1 / 11</Text>
                </View>
            </View>

            <View style={styles.propertyDetailsContainer}>
                <Text style={styles.title}>{title || 'Property Title'}</Text>

                <View style={styles.propertyInfo}>
                    <Text style={styles.infoText}>⭐ 4.8 (73 reviews)</Text>
                    <Text style={styles.infoText}>{propertyData.bedrooms}  🛏️ rooms</Text>
                    <Text style={styles.infoText}>📍 {address || 'Location'}</Text>
                    <Text style={styles.infoText}>📏 {area} m²</Text>
                </View>
            </View>

            <View style={styles.ownerInfoContainer}>
                <Image source={require('../images/profile.jpeg')} style={styles.ownerImage} />
                <View>
                    <Text style={styles.ownerName}>Louise Vuitton</Text>
                    <Text style={styles.ownerRole}>Property owner</Text>
                </View>
                <TouchableOpacity style={styles.contactButton}>
                    <Text style={styles.contactButtonText}>Contact</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.sectionContainer}>
                <Text style={styles.heading}>Home facilities</Text>
                <View style={styles.facilitiesRow}>
                    <Text style={styles.facility}>🍳 Kitchen: {kitchen ? 'Yes' : 'No'}</Text>
                    <Text style={[styles.facility, styles.leftAligned]}>💧 Water: {water ? 'Yes' : 'No'}</Text>
                </View>
                <View style={styles.facilitiesRow}>
                    <Text style={styles.facility}>⚡ Electricity: {electricity ? 'Yes' : 'No'}</Text>
                    <Text style={[styles.facility, styles.leftAligned]}>🪑 Furnished: {furnished ? 'Yes' : 'No'}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.mapContainer} onPress={openMap}>
                <View style={styles.mapPlaceholder}>
                    <Image
                        source={require('../images/map-placeholder.png')} // Ensure the correct path to your image
                        style={styles.mapImage}
                    />
                    <View style={styles.mapOverlay} />
                    <Text style={styles.mapText}>Tap to open map location</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.sectionContainer}>
                <Text style={styles.heading}>Nearest public facilities</Text>
                {nearbyFacilities.length > 0 ? (
                    nearbyFacilities.map((facility, index) => (
                        <Text key={index} style={styles.nearbyFacility}>
                            {facility.emoji} {facility.name} - {facility.distance}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.nearbyFacility}>No facilities found nearby.</Text>
                )}
            </View>

            <View style={styles.sectionContainer}>
                <Text style={styles.heading}>About location's neighborhood</Text>
                <Text style={styles.description}>
                    {description || 'No description available.'}
                </Text>
            </View>

            <View style={styles.costContainer}>
                <Text style={styles.costText}>Price</Text>
                <Text style={styles.costAmount}>${price}/month</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1c1e',
        paddingHorizontal: 0, // Remove left and right padding
    },
    imageCarouselContainer: {
        position: 'relative',
    },
    leftAligned: {
        marginRight: 10, // Adjust this value as needed
    },
    topImage: {
        width: screenWidth,
        height: screenWidth * 0.6,
        resizeMode: 'cover',
    },
    imageCountContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    imageCountText: {
        color: 'white',
        fontSize: 14,
    },
    propertyDetailsContainer: {
        marginTop: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    propertyInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 20,
    },
    infoText: {
        color: '#d1d1d1',
    },
    ownerInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2c2c2e',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    ownerImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    ownerName: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    ownerRole: {
        color: '#d1d1d1',
    },
    contactButton: {
        backgroundColor: '#38ADA9',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginLeft: 'auto',
    },
    contactButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    sectionContainer: {
        marginBottom: 20,
        paddingHorizontal: 15,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    facilitiesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    facility: {
        color: '#d1d1d1',
    },
    mapContainer: {
        marginVertical: 20,
        marginHorizontal:10,
    },
    mapPlaceholder: {
        position: 'relative',
        height: 200,
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center', // Center children vertically
        alignItems: 'center', //
    },
    mapImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    mapOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    mapText: {
        position: 'absolute',
        color: 'white',
        fontSize: 16,
        textAlign: 'center', // Center text
        width: '100%', // Take full width for centering
    },
    nearbyFacility: {
        color: 'white',
        marginBottom: 5,
    },
    description: {
        color: '#d1d1d1',
        lineHeight: 22,
    },
    costContainer: {
        padding: 15,
        backgroundColor: '#38ADA9',
        borderRadius: 10,
        marginBottom: 20,
    },
    costText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    costAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default Detailedpage;
