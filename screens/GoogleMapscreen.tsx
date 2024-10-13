import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import darkModeStyle from './darkModeStyle';
import CheckBox from '@react-native-community/checkbox';
import Geocoder from 'react-native-geocoding';

Geocoder.init('AIzaSyCbuY6KKFkmb4wkMzCsOskkxd7btxHCZ-w');

const API_BASE_URL = "https://mapmatrixbackend-production.up.railway.app/api/property/properties";
const PLOTS_API_URL = "https://mapmatrixbackend-production.up.railway.app/api/plots/plots";

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
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const webViewRef = useRef<WebView | null>(null);
    const [filtersChanged, setFiltersChanged] = useState(false);

    const filterOptions = ["All", "Commercial", "Residential"];
    const statusOptions = ["InProgress", "Dis-Conn", "Conflict", "New", "Notice"];

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get(API_BASE_URL);
                const properties = response.data;

                const formattedMarkers = properties.map(property => {
                    const longitude = property.geometry.x; 
                    const latitude = property.geometry.y; 

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
                });

                setMarkers(formattedMarkers);

                if (formattedMarkers.length > 0) {
                    setLocation({ latitude: formattedMarkers[0].latitude, longitude: formattedMarkers[0].longitude });
                }
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
                    .filter(plot => plot.WKT && plot.WKT.length > 0)
                    .map(plot => {
                        const coordinates = plot.WKT[0][0].map(coord => [coord.y, coord.x]);
                        return {
                            id: plot.id,
                            coordinates,
                            title: plot.landuse_su || 'Polygon',
                        };
                    });

                setPolygons(formattedPolygons);
            } catch (error) {
                console.error('Error fetching polygons:', error);
                Alert.alert('Error', 'Could not fetch polygons.');
            }
        };

        fetchProperties();
        fetchPolygons();
    }, []);

    useEffect(() => {
        if (webViewRef.current) {
            webViewRef.current.injectJavaScript(`updateMap(${JSON.stringify(filteredMarkers())}, ${JSON.stringify(polygons)});`);
        }
    }, [activeFilters, activeStatuses, isPaidChecked, isUnpaidChecked, filter]);

    const filteredMarkers = () => {
        return markers.filter(marker => {
            const typeFilterMatch = activeFilters.includes(marker.type) || activeFilters.includes("All");
            const statusFilterMatch = activeStatuses.includes(marker.status) || activeStatuses.includes("All");
            const paymentFilterMatch = (isPaidChecked && marker.IsPaid) || (isUnpaidChecked && !marker.IsPaid) || (!isPaidChecked && !isUnpaidChecked);
            const searchFilterMatch = filter ? marker.price.toString().includes(filter) : true;
            return typeFilterMatch && statusFilterMatch && paymentFilterMatch && searchFilterMatch;
        });
    };

    const resetFilters = () => {
        setActiveFilters(["All"]);
        setActiveStatuses(["InProgress", "Dis-Conn", "Conflict", "New", "Notice"]);
        setIsPaidChecked(false);
        setIsUnpaidChecked(false);
        setFilter('');
        setFiltersChanged(false);
    };

    const handleLocationSearch = async (locationName: string) => {
        try {
            const response = await Geocoder.from(locationName);
            const { lat, lng } = response.results[0].geometry.location;

            setLocation({ latitude: lat, longitude: lng });

            if (webViewRef.current) {
                webViewRef.current.injectJavaScript(
                    `moveToLocation(${lat}, ${lng});`
                );
            }
        } catch (error) {
            console.error('Error finding location:', error);
            Alert.alert('Error', 'Could not find location.');
        }
    };

    const toggleFilter = (filterName: string) => {
        setActiveFilters([filterName]);
        setFiltersChanged(true);
    };
      
    const toggleStatus = (statusName: string) => {
        setActiveStatuses(prevStatuses => {
            const newStatuses = prevStatuses.includes(statusName)
                ? prevStatuses.filter(s => s !== statusName)
                : [...prevStatuses, statusName];
            setFiltersChanged(true);
            return newStatuses;
        });
    };

    const renderMap = () => {
        return `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Leaflet Map</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
                <style>
                    html, body {
                        margin: 0;
                        padding: 0;
                        height: 100%;
                        width: 100%;
                    }
                    #map {
                        width: 100%;
                        height: 100vh;
                        margin: 0;
                        padding: 0;
                    }
                </style>
            </head>
            <body>
                <div id="map"></div>
                <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
                <script>
                    var map = L.map('map').setView([${location.latitude}, ${location.longitude}], 13);
    
                    // Use Google Maps tile layer
                    var googleMapType = '${mapType}';
                    var googleMapsLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 20,
                        attribution: 'Map data &copy; <a href="https://www.google.com/maps">Google</a>'
                    }).addTo(map);
    
                    function addMarkers(markers) {
                        markers.forEach(function(marker) {
                            var markerColor;
    
                            if (marker.status === null) {
                                markerColor = marker.IsPaid ? '#4CAF50' : '#FF0000'; // Green if paid, Red if unpaid
                            } else {
                                switch (marker.status) {
                                    case "InProgress":
                                        markerColor = '#E97451';
                                        break;
                                    case "Notice":
                                        markerColor = '#E6AF2E'; // Yellow
                                        break;
                                    case "New":
                                        markerColor = '#457B9D'; // Blue
                                        break;
                                    case "Dis-Conn":
                                        markerColor = '#967bb6'; // Lavender
                                        break;
                                    case "Conflict":
                                        markerColor = '#F1AB86'; // Light Pink
                                        break;
                                    default:
                                        markerColor = '#FF5252'; // Default red color
                                }
                            }
    
                            var markerHtml = 
                                '<div style="position: relative;">' +
                                    '<div style="background-color: ' + markerColor + '; padding: 5px 8px; border-radius: 5px; display: flex; align-items: center; width: auto; min-width: 70px; justify-content: space-between;">' +
                                        '<span style="color: white; font-weight: bold; margin-right: 3px;">' + marker.price + '</span>' +
                                        '<img src="' + (marker.type === 'Residential' ? 'https://www.svgrepo.com/show/22031/home-icon-silhouette.svg' : 'https://www.svgrepo.com/show/535238/building.svg') + '"' +
                                            'style="width: 18px; height: 18px; filter: invert(1);" />' +
                                    '</div>' +
                                    '<div style="position: absolute; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid ' + markerColor + ';"></div>' +
                                '</div>';
                    
                            var icon = L.divIcon({
                                html: markerHtml,
                                className: 'custom-div-icon',
                                iconSize: [90, 40],
                                iconAnchor: [45, 40]
                            });
    
                            L.marker([marker.latitude, marker.longitude], { icon: icon })
                                .addTo(map)
                                .on('click', function() {
                                    window.ReactNativeWebView.postMessage(JSON.stringify({
                                        type: 'markerClicked',
                                        id: marker.id
                                    }));
                                });
                        });
                    }
    
                    function addPolygons(polygons) {
                        polygons.forEach(function(polygon) {
                            L.polygon(polygon.coordinates, { color: 'blue' })
                                .addTo(map)
                        });
                    }
    
                    function moveToLocation(lat, lng) {
                        map.setView([lat, lng], 13);
                    }
    
                    function updateMap(markers, polygons) {
                        map.eachLayer(function (layer) {
                            if (layer instanceof L.Marker || layer instanceof L.Polygon) {
                                map.removeLayer(layer);
                            }
                        });
                        addMarkers(markers);
                        addPolygons(polygons);
                    }
    
                    window.addEventListener('message', function(event) {
                        var data = JSON.parse(event.data);
                        if (data.markers) {
                            addMarkers(data.markers);
                        }
                        if (data.polygons) {
                            addPolygons(data.polygons);
                        }
                    });
    
                    addMarkers(${JSON.stringify(filteredMarkers())});
                    addPolygons(${JSON.stringify(polygons)});
                </script>
            </body>
        </html>
        `;
    };
    

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
                        <CheckBox
                            value={isPaidChecked}
                            onValueChange={() => setIsPaidChecked(!isPaidChecked)}
                            tintColors={{ true: '#38ADA9', false: 'gray' }}
                        />
                        <Text style={styles.checkboxLabel}>Show Paid</Text>
                    </View>
                    <View style={styles.checkbox}>
                        <CheckBox
                            value={isUnpaidChecked}
                            onValueChange={() => setIsUnpaidChecked(!isUnpaidChecked)}
                            tintColors={{ true: '#38ADA9', false: 'gray' }}
                        />
                        <Text style={styles.checkboxLabel}>Show Unpaid</Text>
                    </View>
                </View>
            </View>

            <WebView
                ref={webViewRef}
                originWhitelist={['*']}
                source={{ html: renderMap() }}
                javaScriptEnabled
                injectedJavaScript={`window.ReactNativeWebView.postMessage(JSON.stringify({ markers: ${JSON.stringify(filteredMarkers())}, polygons: ${JSON.stringify(polygons)} }));`}
                onMessage={(event) => {
                    const data = JSON.parse(event.nativeEvent.data);
                    if (data.type === 'markerClicked') {
                        navigation.navigate('Detailedpage', { id: data.id });
                    }
                }}
            />

            <TouchableOpacity style={styles.currentLocationButton} onPress={() => webViewRef.current?.injectJavaScript(`moveToLocation(${location.latitude}, ${location.longitude});`)}>
                <Icon name="crosshairs" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.toggleMapTypeButton} onPress={() => setMapType(prevType => { const nextType = prevType === 'roadmap' ? 'satellite' : prevType === 'satellite' ? 'terrain' : prevType === 'terrain' ? 'hybrid' : 'roadmap'; webViewRef.current?.injectJavaScript(`updateMap(${JSON.stringify(filteredMarkers())}, ${JSON.stringify(polygons)});`); return nextType; })}>
                <Icon name="globe" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.listButton} onPress={() => navigation.navigate('AdvancedSearch')}>
                <Icon name="list" size={20} color="white" />
                <Text style={styles.listButtonText}>List</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.favouritesButton} onPress={() => navigation.navigate('Favourites')}>
                <Icon name="heart-o" size={20} color="white" />
            </TouchableOpacity>

            {filtersChanged && (
                <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                    <Text style={styles.resetButtonText}>Reset Filters</Text>
                </TouchableOpacity>
            )}

            <View style={styles.bottomScrollContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bottomScrollContent}>
                    {statusOptions.map((statusName, index) => {
                        const isActive = activeStatuses.includes(statusName);
                        let buttonStyle;
                        switch (statusName) {
                            case "InProgress":
                                buttonStyle = styles.inProgressButton;
                                break;
                            case "Dis-Conn":
                                buttonStyle = styles.disConnButton;
                                break;
                            case "Conflict":
                                buttonStyle = styles.conflictButton;
                                break;
                            case "New":
                                buttonStyle = styles.newButton;
                                break;
                            case "Notice":
                                buttonStyle = styles.noticeButton;
                                break;
                            default:
                                buttonStyle = {};
                        }
                        
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.bottomButton,
                                    isActive && buttonStyle
                                ]}
                                onPress={() => toggleStatus(statusName)}
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
        marginVertical:15,
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
    resetButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: 'orange',
        borderRadius: 5,
        padding: 10,
        zIndex: 1000,
      },
      resetButtonText: {
        color: 'white',
        fontWeight: 'bold',
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
    icon: {
        color: '#6C768A',
    },
});

export default GoogleMapscreen;
