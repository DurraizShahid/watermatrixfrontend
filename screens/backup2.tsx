import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import CheckBox from '@react-native-community/checkbox';
import Geocoder from 'react-native-geocoding';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';

Geocoder.init('AIzaSyCbuY6KKFkmb4wkMzCsOskkxd7btxHCZ-w');

const API_BASE_URL = "https://mapmatrixbackend-production.up.railway.app/api/property/properties";
const PLOTS_API_URL = "https://mapmatrixbackend-production.up.railway.app/api/plots/plots";
const ZOOM_LEVEL_THRESHOLD = 12;
const VIEWPORT_PADDING = 0.5;
const RENDER_DELAY = 300;
const BATCH_SIZE = 50;

type RootStackParamList = {
    Detailedpage: { id: number };
    AdvancedSearch: undefined;
    FavouritesScreen: undefined;
};

const GoogleMapscreen: React.FC = () => {
    const [location, setLocation] = useState({ latitude: 33.6, longitude: 73.1 });
    const [filter, setFilter] = useState<string>('');
    const [activeFilters, setActiveFilters] = useState<string[]>(["All"]);
    const [activeStatuses, setActiveStatuses] = useState<string[]>(["InProgress", "Dis-Conn", "Conflict", "New", "Notice"]);
    const [isPaidChecked, setIsPaidChecked] = useState<boolean>(false);
    const [isUnpaidChecked, setIsUnpaidChecked] = useState<boolean>(false);
    const [markers, setMarkers] = useState([]);
    const [polygons, setPolygons] = useState([]);
    const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
    const [currentZoom, setCurrentZoom] = useState(15);
    const [visibleRegion, setVisibleRegion] = useState(null);
    const [filtersChanged, setFiltersChanged] = useState(false);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const mapRef = useRef(null);
    const [isMapMoving, setIsMapMoving] = useState(false);
    const renderTimeout = useRef(null);

    const filterOptions = ["All", "Commercial", "Residential"];
    const statusOptions = ["None", "InProgress", "Dis-Conn", "Conflict", "New", "Notice"];

    const isCoordinateVisible = (coord, region) => {
        if (!region) return false;

        const { latitude, longitude } = coord;
        const { latitude: centerLat, longitude: centerLng, latitudeDelta, longitudeDelta } = region;

        // Add padding to the visible region for smoother rendering
        const latMin = centerLat - (latitudeDelta * (1 + VIEWPORT_PADDING));
        const latMax = centerLat + (latitudeDelta * (1 + VIEWPORT_PADDING));
        const lngMin = centerLng - (longitudeDelta * (1 + VIEWPORT_PADDING));
        const lngMax = centerLng + (longitudeDelta * (1 + VIEWPORT_PADDING));

        return latitude >= latMin && 
               latitude <= latMax && 
               longitude >= lngMin && 
               longitude <= lngMax;
    };

    const isPolygonVisible = (coordinates, region) => {
        if (!region) return false;
        
        // Check if any point of the polygon is within the visible region
        return coordinates.some(coord => isCoordinateVisible(coord, region));
    };


    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get(API_BASE_URL);
                const properties = response.data;

                const formattedMarkers = properties
                    .filter(property => property.geometry !== null)
                    .map(property => ({
                        id: property.PropertyId,
                        title: property.title,
                        description: property.description,
                        price: parseFloat(property.price),
                        latitude: property.geometry?.y || 0,
                        longitude: property.geometry?.x || 0,
                        type: property.type,
                        status: property.status,
                        IsPaid: property.IsPaid,
                        city: property.city,
                        address: property.address,
                    }));

                setMarkers(formattedMarkers);
            } catch (error) {
                console.error('Error fetching properties:', error);
                Alert.alert('Error', 'Could not fetch properties.');
            }
        };

        const fetchPolygons = async () => {
            try {
                const response = await axios.get(PLOTS_API_URL);
                const plots = response.data;

                const formattedPolygons = plots
                .filter(plot => plot.SHAPE && plot.SHAPE.length > 0)
                .map(plot => ({
                    id: plot.id,
                    coordinates: plot.SHAPE[0][0].map(coord => ({
                        latitude: coord.y,
                        longitude: coord.x
                    })),
                    title: plot.landuse_su || 'Polygon',
                }));
            
                setPolygons(formattedPolygons);
            } catch (error) {
                console.error('Error fetching polygons:', error);
                Alert.alert('Error', 'Could not fetch polygons.');
            }
        };

        fetchProperties();
        fetchPolygons();
    }, []);

    const calculateZoomLevel = (region) => {
        const angle = region.longitudeDelta;
        return Math.round(Math.log(360 / angle) / Math.LN2);
    };

    const filteredMarkers = () => {
        return markers.filter(marker => {
            const typeFilterMatch = activeFilters.includes(marker.type) || activeFilters.includes("All");
            const statusFilterMatch = activeStatuses.includes(marker.status) || 
                                   (activeStatuses.includes("None") && marker.status === null);
            const paymentFilterMatch = (isPaidChecked && marker.IsPaid) || 
                                    (isUnpaidChecked && !marker.IsPaid) || 
                                    (!isPaidChecked && !isUnpaidChecked);
            const searchFilterMatch = filter
                ? (marker.title?.toLowerCase() || '').includes(filter.toLowerCase()) ||
                  (marker.address?.toLowerCase() || '').includes(filter.toLowerCase())
                : true;
            return typeFilterMatch && statusFilterMatch && paymentFilterMatch && searchFilterMatch;
        });
    };

    const visibleMarkers = useMemo(() => {
        if (currentZoom < ZOOM_LEVEL_THRESHOLD || isMapMoving) return [];

        return filteredMarkers()
            .filter(marker => 
                isCoordinateVisible(
                    { latitude: marker.latitude, longitude: marker.longitude },
                    visibleRegion
                )
            )
            .slice(0, BATCH_SIZE);
    }, [markers, activeFilters, activeStatuses, isPaidChecked, isUnpaidChecked, 
        filter, visibleRegion, currentZoom, isMapMoving]);

    const visiblePolygons = useMemo(() => {
        if (currentZoom < ZOOM_LEVEL_THRESHOLD || isMapMoving) return [];

        return polygons.filter(polygon => 
            isPolygonVisible(polygon.coordinates, visibleRegion)
        );
    }, [polygons, visibleRegion, currentZoom, isMapMoving]);

    const getMarkerColor = (status: string | null, isPaid: boolean) => {
        if (status === null) {
            return isPaid ? '#4CAF50' : '#FF0000';
        }
        
        const colors = {
            "InProgress": '#E97451',
            "Notice": '#E6AF2E',
            "New": '#457B9D',
            "Dis-Conn": '#967bb6',
            "Conflict": '#F1AB86',
            "default": '#FF5252'
        };
        
        return colors[status] || colors.default;
    };

    const handleLocationSearch = (data, details) => {
        const { lat, lng } = details.geometry.location;
        setLocation({ latitude: lat, longitude: lng });
        
        mapRef.current?.animateToRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
    };

    const onRegionChange = (region) => {
        const zoom = calculateZoomLevel(region);
        setCurrentZoom(zoom);
        setVisibleRegion(region);
    };

    const handleMapMovement = (region) => {
        // Clear any existing timeout
        if (renderTimeout.current) {
            clearTimeout(renderTimeout.current);
        }

        // Set map as moving and clear current markers/polygons
        setIsMapMoving(true);

        // Calculate new zoom level
        const zoom = calculateZoomLevel(region);
        setCurrentZoom(zoom);
        setVisibleRegion(region);

        // Set a timeout to re-render markers/polygons after movement stops
        renderTimeout.current = setTimeout(() => {
            setIsMapMoving(false);
        }, RENDER_DELAY);
    };

    useEffect(() => {
        return () => {
            if (renderTimeout.current) {
                clearTimeout(renderTimeout.current);
            }
        };
    }, []);



    const CustomMarker = ({ marker }) => (
        <View style={[styles.marker, { backgroundColor: getMarkerColor(marker.status, marker.IsPaid) }]}>
            <Text style={styles.markerText}>{marker.price}</Text>
            <Icon 
                name={marker.type === 'Residential' ? 'home' : 'building'} 
                size={18} 
                color="white" 
            />
        </View>
    );

    const resetFilters = () => {
        setActiveFilters(["All"]);
        setActiveStatuses(["InProgress", "Dis-Conn", "Conflict", "New", "Notice"]);
        setIsPaidChecked(false);
        setIsUnpaidChecked(false);
        setFilter('');
        setFiltersChanged(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <GooglePlacesAutocomplete
                    placeholder="Find Location via Google"
                    fetchDetails={true}
                    onPress={handleLocationSearch}
                    query={{
                        key: 'AIzaSyCbuY6KKFkmb4wkMzCsOskkxd7btxHCZ-w',
                        language: 'en',
                    }}
                    styles={{
                        listView: {
                            backgroundColor: '#23252F',
                        },
                        textInputContainer: {
                            backgroundColor: '#19191C',
                            borderTopWidth: 0,
                            borderBottomWidth: 0,
                            borderRadius: 5,
                        },
                        textInput: {
                            height: 50,
                            color: '#FFFFFF',
                            paddingHorizontal: 10,
                            backgroundColor: '#19191C',
                        },
                        row: {
                            backgroundColor: '#19191C',
                            padding: 20,
                        },
                        text: {
                            color: '#FFFFFF',
                        },
                        poweredContainer: {
                            backgroundColor: '#19191C',
                        },
                        powered: {
                            color: 'white',
                        },
                    }}
                />

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                    {filterOptions.map((filterName, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.filterButton,
                                activeFilters.includes(filterName) && { backgroundColor: '#1EABA5' }
                            ]}
                            onPress={() => {
                                setActiveFilters([filterName]);
                                setFiltersChanged(true);
                            }}
                        >
                            <Text style={[
                                styles.filterText,
                                activeFilters.includes(filterName) && { color: 'white' }
                            ]}>
                                {filterName}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.checkboxContainer}>
                    <View style={styles.checkbox}>
                        <CheckBox
                            value={isPaidChecked}
                            onValueChange={(newValue) => {
                                setIsPaidChecked(newValue);
                                setFiltersChanged(true);
                            }}
                            tintColors={{ true: '#1EABA5', false: 'gray' }}
                        />
                        <Text style={styles.checkboxLabel}>Show Paid</Text>
                    </View>
                    <View style={styles.checkbox}>
                        <CheckBox
                            value={isUnpaidChecked}
                            onValueChange={(newValue) => {
                                setIsUnpaidChecked(newValue);
                                setFiltersChanged(true);
                            }}
                            tintColors={{ true: '#1EABA5', false: 'gray' }}
                        />
                        <Text style={styles.checkboxLabel}>Show Unpaid</Text>
                    </View>
                </View>
            </View>

            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                mapType={mapType}
                onRegionChange={handleMapMovement}
                maxZoomLevel={20}
                minZoomLevel={3}
            >
                {visibleMarkers.map((marker) => (
                    <Marker
                        key={marker.id}
                        coordinate={{
                            latitude: marker.latitude,
                            longitude: marker.longitude
                        }}onPress={() => navigation.navigate('Detailedpage', { id: marker.id })}
                        >
                        <CustomMarker marker={marker} />
                    </Marker>
                ))}

                {visiblePolygons.map((polygon) => (
                    <Polygon
                        key={polygon.id}
                        coordinates={polygon.coordinates}
                        strokeColor="blue"
                        fillColor="rgba(0, 0, 255, 0.1)"
                        strokeWidth={2}
                    />
                ))}
            </MapView>

            <View style={styles.zoomIndicator}>
                <Text style={styles.zoomText}>
                    {currentZoom < ZOOM_LEVEL_THRESHOLD ? 
                        'Zoom in to see markers and polygons' : 
                        isMapMoving ?
                            'Moving map...' :
                            `Showing ${visibleMarkers.length} markers`}
                </Text>
            </View>

            <TouchableOpacity 
                style={styles.currentLocationButton} 
                onPress={() => {
                    mapRef.current?.animateToRegion({
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    });
                }}
            >
                <Icon name="crosshairs" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.toggleMapTypeButton} 
                onPress={() => setMapType(prevType => prevType === 'standard' ? 'satellite' : 'standard')}
            >
                <Icon name="globe" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.listButton} 
                onPress={() => navigation.navigate('AdvancedSearch')}
            >
                <Icon name="list" size={20} color="white" />
                <Text style={styles.listButtonText}>List</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.favouritesButton} 
                onPress={() => navigation.navigate('FavouritesScreen')}
            >
                <Icon name="heart-o" size={20} color="white" />
            </TouchableOpacity>

            {filtersChanged && (
                <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                    <Text style={styles.resetButtonText}>Reset Filters</Text>
                </TouchableOpacity>
            )}

            <View style={styles.bottomScrollContainer}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.bottomScrollContent}
                >
                    {statusOptions.map((statusName, index) => {
                        const isActive = activeStatuses.includes(statusName);
                        let buttonStyle = {};
                        
                        switch (statusName) {
                            case "InProgress": buttonStyle = styles.inProgressButton; break;
                            case "Dis-Conn": buttonStyle = styles.disConnButton; break;
                            case "Conflict": buttonStyle = styles.conflictButton; break;
                            case "New": buttonStyle = styles.newButton; break;
                            case "Notice": buttonStyle = styles.noticeButton; break;
                            case "None": buttonStyle = styles.NoneButton; break;
                        }
                        
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.bottomButton,
                                    isActive && buttonStyle
                                ]}
                                onPress={() => {
                                    if (statusName === "None") {
                                        setActiveStatuses(["None"]);
                                    } else {
                                        setActiveStatuses(prev => {
                                            const newStatuses = prev.includes("None") 
                                                ? [statusName]
                                                : prev.includes(statusName)
                                                    ? prev.filter(s => s !== statusName)
                                                    : [...prev, statusName];
                                            return newStatuses;
                                        });
                                    }
                                    setFiltersChanged(true);
                                }}
                            >
                                <Text style={[
                                    styles.buttonText,
                                    isActive && styles.activeButtonText
                                ]}>
                                    {statusName}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
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
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 5,
        borderTopWidth: 5,
        width: '100%',
        zIndex: 1000,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2C2C2C',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'teal',
        shadowColor: 'teal',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 15,
        elevation: 10,
    },
    searchIcon: {
        marginLeft: 10,
        color: 'transparent',
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
        borderWidth: 2,
        borderColor: 'teal',
        shadowColor: 'teal',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 15,
        elevation: 10,
    },
    filterText: {
        color: '#6C768A',
    },
    checkboxContainer: {
        flexDirection: 'row',
        borderRadius: 5,
        backgroundColor: '#19191C',
        marginRight: 1,
        padding: 5,
    },
    zoomIndicator: {
        position: 'absolute',
        top: 200,
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 8,
        borderRadius: 4,
    },
    zoomText: {
        color: 'white',
        fontSize: 12,
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
        borderRadius: 15,
        borderColor: 'teal',
        elevation: 10,
    },
    checkboxLabel: {
        color: '#6C768A',
        marginLeft: 5,
    },
    map: {
        flex: 1,
    },
    resetButton: {
        position: 'absolute',
        top: 220,
        left: '50%',
        transform: [{ translateX: -50 }],
        backgroundColor: 'orange',
        borderRadius: 20,
        padding: 10,
        zIndex: 1000,
      },
      resetButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
      },
    marker: {
        flexDirection: 'row', 
        paddingVertical: 5,
        paddingHorizontal:5,
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
    bottomButton: {
        backgroundColor: '#19191C',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginRight: 10,
    },
    buttonText: {
        color: 'grey',
      },
      inProgressButton: {
        backgroundColor: '#E97451',
      },
      disConnButton: {
        backgroundColor: '#967bb6',
      },
      conflictButton: {
        backgroundColor: '#F1AB86',
      },
      newButton: {
        backgroundColor: '#457B9D',
      },
      noticeButton: {
        backgroundColor: '#E6AF2E',
      },
      activeButtonText: {
        color: 'white',
      },
      NoneButton: {
        color: 'red',
      },
    icon: {
        color: '#6C768A',
    },
});

export default GoogleMapscreen;
