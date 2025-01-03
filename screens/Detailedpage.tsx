import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Dimensions, TouchableOpacity, Linking, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as base64 from 'base64-js';
import styles from './DetailedpageStyles'; // Import the styles from the new stylesheet

const { width: screenWidth } = Dimensions.get('window');

const Detailedpage: React.FC = () => {
    const route = useRoute();
    const { id } = route.params;

    const [propertyData, setPropertyData] = useState<any>({});
    const [nearbyFacilities, setNearbyFacilities] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // State to track current image index

    // Fetch property data
    useEffect(() => {
        const fetchPropertyData = async () => {
            try {
                const response = await axios.get('https://mapmatrixbackend-production.up.railway.app/api/property/properties/');
                const properties = response.data;
                const property = properties.find(item => item.PropertyId === parseInt(id));
                if (property) {
                    setPropertyData(property);
                } else {
                    console.error('Property not found');
                    setError('Property not found');
                }
            } catch (error) {
                console.error('Error fetching property data:', error);
                setError('Error fetching property data.');
            }
        };

        if (id) {
            fetchPropertyData();
        }
    }, [id]);

    const { geometry = {}, title = 'Property Title', address = 'Location', area = 'N/A', kitchen, water, electricity, furnished, price, description = 'No description available.', Photos = [] } = propertyData;
    const latitude = geometry?.y;
    const longitude = geometry?.x;

    // Fetch nearby facilities from Google Maps Places API
    useEffect(() => {
        const fetchNearbyFacilities = async () => {
            if (!latitude || !longitude) return;
            const API_KEY = 'AIzaSyCbuY6KKFkmb4wkMzCsOskkxd7btxHCZ-w';
            const radius = 1500;
            const types = 'grocery_or_supermarket|hospital|restaurant|train_station';

            try {
                const response = await axios.get(
                    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${types}&key=${API_KEY}`
                );

                const facilities = response.data.results;
                const uniqueFacilities: { [key: string]: any } = {};

                facilities.forEach(place => {
                    if (place.types) {
                        place.types.forEach(type => {
                            if (!uniqueFacilities[type]) {
                                uniqueFacilities[type] = {
                                    name: place.name,
                                    distance: place.vicinity,
                                    emoji: getFacilityEmoji(type),
                                };
                            }
                        });
                    }
                });

                setNearbyFacilities(Object.values(uniqueFacilities));
            } catch (error) {
                console.error('Error fetching nearby facilities:', error);
                setError('Error fetching nearby facilities.');
            }
        };

        fetchNearbyFacilities();
    }, [latitude, longitude]);

    const getFacilityEmoji = (type: string) => {
        switch (type) {
            case 'grocery_or_supermarket':
                return '🛒';
            case 'hospital':
                return '🏥';
            case 'restaurant':
                return '🍽️';
            case 'train_station':
                return '🚉';
            default:
                return '';
        }
    };

    const openMap = () => {
        const url = `https://www.google.com/maps/@${latitude},${longitude},15z`;
        Linking.openURL(url);
    };

    const getImageSource = (photos: any) => {
        if (photos && photos.length > 0) {
            const bufferData = photos[0].data;
            const base64Data = base64.fromByteArray(bufferData);
            return { uri: `data:image/jpeg;base64,${base64Data}` };
        }
        return require('../images/home.jpg');
    };

    // Display error if any
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} horizontal={false}>
            {/* Carousel for images */}
            <View style={styles.imageCarouselContainer}>
                <FlatList
                    data={Photos}
                    horizontal
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={styles.imageWrapper}>
                            <Image source={getImageSource([item])} style={styles.topImage} />
                        </View>
                    )}
                    onScroll={({ nativeEvent }) => {
                        const index = Math.floor(nativeEvent.contentOffset.x / screenWidth);
                        setCurrentImageIndex(index); // Update the current image index
                    }}
                />
                <View style={styles.imageCountContainer}>
                    <Text style={styles.imageCountText}>{Photos.length > 0 ? `${currentImageIndex + 1} / ${Photos.length}` : '1 / 1'}</Text>
                </View>
            </View>

            {/* Property details */}
            <View style={styles.propertyDetailsContainer}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.propertyInfo}>
                    <Text style={styles.infoText}>⭐ 4.8 (73 reviews)</Text>
                    <Text style={styles.infoText}>{propertyData.bedrooms} 🛏️ rooms</Text>
                    <Text style={styles.infoText}>📍 {address}</Text>
                    <Text style={styles.infoText}>📏 {area} m²</Text>
                </View>
            </View>

            <View style={styles.ownerInfoContainer}>
                <Image source={require('../images/profile.jpeg')} style={styles.ownerImage} />
                <View>
                    <Text style={styles.ownerName}>Naeem Minhas</Text>
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
                        source={require('../images/map-placeholder.png')}
                        style={styles.mapImage}
                    />
                    <View style={styles.mapOverlay} />
                    <Text style={styles.mapText}>Open in Google Maps</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.sectionContainer}>
                <Text style={styles.heading}>Nearby Facilities</Text>
                {nearbyFacilities.length > 0 ? (
                    nearbyFacilities.map((facility, index) => (
                        <View key={index} style={styles.facilityContainer}>
                            <Text style={styles.facilityText}>
                                {facility.emoji} {facility.name} - {facility.distance}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noFacilitiesText}>No nearby facilities found.</Text>
                )}
            </View>

            <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionHeading}>Description</Text>
                <Text style={styles.descriptionText}>{description}</Text>
            </View>
        </ScrollView>
    );
};

export default Detailedpage;