import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, Switch, Animated, Dimensions, ScrollView, BackHandler, TouchableWithoutFeedback, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MapViewComponent } from '../Components/MapViewComponent';
import { useFetchProperties } from '../hooks/useFetchProperties';
import { useFetchPolygons } from '../hooks/useFetchPolygons';
import { FilterOptionsComponent } from '../Components/FilterOptionsComponent';
import { StatusOptionsComponent } from '../Components/StatusOptionsComponent';
import { handleLocationSearch } from '../utils/handleLocationSearch';
import AdvancedSearchModal from './AdvancedSearchModal';
import styles from './GoogleMapScreenStyles'; // assuming styles are imported from a separate file
import CheckBox from 'react-native-elements/dist/checkbox/CheckBox'; // Correct import for CheckBox
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

// Area mapping for easier management
const areaMapping = {
    "10 Marla": 25,
    "1 Kanal": 505,
    "1 Kanal+": (area) => area > 505,
};

type Marker = {
    type: string;
    status: string;
    IsPaid: number; // Ensure IsPaid is a number
    price: number;
};

const GoogleMapscreen = () => {
    const [markers, setMarkers] = useState<Marker[]>([]);
    const [polygons, setPolygons] = useState([]);
    const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
    const [activeFilters, setActiveFilters] = useState(["All"]);
    const [activeStatuses, setActiveStatuses] = useState(["InProgress", "Dis-Conn", "Conflict", "New", "Notice"]);
    const [IsPaidChecked, setIsPaidChecked] = useState(false);
    const [isUnpaidChecked, setIsUnpaidChecked] = useState(false);
    const [filter, setFilter] = useState('');
    const [showPolygons, setShowPolygons] = useState(true);
    const [mapType, setMapType] = useState('roadmap'); // Default map type
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [isAdvancedSearchVisible, setIsAdvancedSearchVisible] = useState(false);
    const [selectedArea, setSelectedArea] = useState('');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000000);
    const sidebarAnimation = useRef(new Animated.Value(-Dimensions.get('window').width)).current;
    const webViewRef = useRef<any>(null);
    const navigation = useNavigation();

    // Use hooks to fetch properties and polygons
    useFetchProperties(setMarkers, setLocation);
    useFetchPolygons(setPolygons);

    useEffect(() => {
        if (webViewRef.current) {
            webViewRef.current.injectJavaScript(`updateMap(${JSON.stringify(filteredMarkers())}, ${JSON.stringify(showPolygons ? filteredPolygons() : [])}, '${mapType}');`);
        }
    }, [markers, polygons, activeFilters, activeStatuses, IsPaidChecked, isUnpaidChecked, filter, showPolygons, mapType]);

    useEffect(() => {
        const backAction = () => {
            if (sidebarVisible) {
                toggleSidebar();
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, [sidebarVisible]);

    const filteredMarkers = () => {
        return markers.filter(marker => {
            const typeFilterMatch = activeFilters.includes(marker.type) || activeFilters.includes("All");
            const statusFilterMatch = activeStatuses.includes(marker.status) || activeStatuses.includes("All");
            const paymentFilterMatch = (IsPaidChecked && marker.IsPaid === 1) || (isUnpaidChecked && marker.IsPaid === 0) || (!IsPaidChecked && !isUnpaidChecked);
            const searchFilterMatch = filter ? marker.price.toString().includes(filter) : true;
            const areaFilterMatch = selectedArea ? areaMapping[selectedArea](marker.area) : true;
            const priceFilterMatch = marker.price >= minPrice && marker.price <= maxPrice;
            return typeFilterMatch && statusFilterMatch && paymentFilterMatch && searchFilterMatch && areaFilterMatch && priceFilterMatch;
        });
    };

    const filteredPolygons = () => {
        return polygons;
    };

    const toggleMapType = () => {
        const newMapType = mapType === 'roadmap' ? 'satellite' : mapType === 'satellite' ? 'terrain' : 'roadmap';
        setMapType(newMapType);
    };

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
        Animated.timing(sidebarAnimation, {
            toValue: sidebarVisible ? -Dimensions.get('window').width : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const openAdvancedSearch = () => {
        setIsAdvancedSearchVisible(true);
    };

    const closeAdvancedSearch = () => {
        setIsAdvancedSearchVisible(false);
    };

    const handleAdvancedSearch = (searchParams) => {
        setSelectedArea(searchParams.selectedArea);
        setMinPrice(searchParams.minPrice);
        setMaxPrice(searchParams.maxPrice);
    };

    // Define uniqueSectors based on the polygons data
    const uniqueSectors = [...new Set(polygons.map(polygon => polygon.sector))];

    return (
        <View style={styles.container}>
            <MapViewComponent
                location={location}
                markers={filteredMarkers()}
                polygons={showPolygons ? filteredPolygons() : []}
                webViewRef={webViewRef}
                style={styles.map}
                mapType={mapType}
            />

            <View style={styles.overlayContainer}>
                <TouchableOpacity style={styles.hamburger} onPress={toggleSidebar}>
                    <Icon name="bars" size={30} color="black" />
                </TouchableOpacity>

                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Enter location"
                        placeholderTextColor="gray"
                        onSubmitEditing={(event) => handleLocationSearch(event.nativeEvent.text, setLocation, webViewRef)}
                        onFocus={openAdvancedSearch}
                        onChangeText={text => setFilter(text)}
                    />
                    <Icon name="search" size={20} color="gray" style={styles.searchIcon} />
                </View>

                {/* Filter Options */}
                <FilterOptionsComponent
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                    IsPaidChecked={IsPaidChecked}
                    setIsPaidChecked={setIsPaidChecked}
                    isUnpaidChecked={isUnpaidChecked}
                    setIsUnpaidChecked={setIsUnpaidChecked}
                    filterOptions={['All', 'Residential', 'Commercial']}
                    setFiltersChanged={() => {}}
                />
            </View>

            {/* Status Options */}
            <View style={styles.statusOptionsContainer}>
                <StatusOptionsComponent
                    activeStatuses={activeStatuses}
                    setActiveStatuses={setActiveStatuses}
                    setFiltersChanged={() => {}}
                />
            </View>

            {/* Sidebar */}
            {sidebarVisible && (
                <TouchableWithoutFeedback onPress={toggleSidebar}>
                    <View style={styles.sidebarOverlay}>
                        <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarAnimation }] }]}>
                            <View style={styles.sidebarItem}>
                                <Icon name="map" size={20} color="white" />
                                <Text style={styles.sidebarText}>Show Polygons</Text>
                                <Switch value={showPolygons} onValueChange={setShowPolygons} />
                            </View>
                            <TouchableOpacity
                                style={styles.sidebarItem}
                                onPress={() => navigation.navigate('AddProperty', { longitude: location.longitude, latitude: location.latitude })}
                            >
                                <Icon name="plus" size={20} color="white" />
                                <Text style={styles.sidebarText}>Add Marker</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.sidebarItem}
                                onPress={() => navigation.navigate('FavouritesScreen')}
                            >
                                <Icon name="star" size={20} color="white" />
                                <Text style={styles.sidebarText}>Favourites</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.sidebarItem}
                                onPress={toggleMapType}
                            >
                                <Icon name="globe" size={20} color="white" />
                                <Text style={styles.sidebarText}>Toggle Map Type</Text>
                            </TouchableOpacity>

                            {/* Sector List */}
                            <ScrollView style={styles.sectorList}>
                                {uniqueSectors.map((sector, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.sidebarItem}
                                        onPress={() => toggleSector(sector)}
                                    >
                                        <Text style={styles.sidebarText}>{sector}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </Animated.View>
                    </View>
                </TouchableWithoutFeedback>
            )}

            {/* Advanced Search Modal */}
            <AdvancedSearchModal
                isVisible={isAdvancedSearchVisible}
                onClose={closeAdvancedSearch}
                onSearch={handleAdvancedSearch}
            />
        </View>
    );
};

export default GoogleMapscreen;