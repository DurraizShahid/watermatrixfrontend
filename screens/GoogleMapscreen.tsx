import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, Text, Alert, CheckBox } from 'react-native';
import axios from 'axios';
import Geocoder from 'react-native-geocoding';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MapViewComponent } from '../Components/MapViewComponent';
import { useFetchProperties } from '../hooks/useFetchProperties';
import { useFetchPolygons } from '../hooks/useFetchPolygons';
import { FilterOptionsComponent } from '../Components/FilterOptionsComponent';
import { handleLocationSearch } from '../utils/handleLocationSearch';
import styles from './GoogleMapScreenStyles'; // assuming styles are imported from a separate file

const GoogleMapscreen = () => {
    const [markers, setMarkers] = useState([]);
    const [polygons, setPolygons] = useState([]);
    const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
    const [activeFilters, setActiveFilters] = useState(["All"]);
    const [activeStatuses, setActiveStatuses] = useState(["InProgress", "Dis-Conn", "Conflict", "New", "Notice"]);
    const [isPaidChecked, setIsPaidChecked] = useState(false);
    const [isUnpaidChecked, setIsUnpaidChecked] = useState(false);
    const [filter, setFilter] = useState('');
    const [filtersChanged, setFiltersChanged] = useState(false);
    const webViewRef = useRef(null);

    // Use hooks to fetch properties and polygons
    useFetchProperties(setMarkers, setLocation);
    useFetchPolygons(setPolygons);

    useEffect(() => {
        if (webViewRef.current) {
            webViewRef.current.injectJavaScript(`updateMap(${JSON.stringify(filteredMarkers())}, ${JSON.stringify(polygons)});`);
        }
    }, [markers, polygons, activeFilters, activeStatuses, isPaidChecked, isUnpaidChecked, filter]);

    const filteredMarkers = () => {
        return markers.filter(marker => {
            const typeFilterMatch = activeFilters.includes(marker.type) || activeFilters.includes("All");
            const statusFilterMatch = activeStatuses.includes(marker.status) || activeStatuses.includes("All");
            const paymentFilterMatch = (isPaidChecked && marker.IsPaid) || (isUnpaidChecked && !marker.IsPaid) || (!isPaidChecked && !isUnpaidChecked);
            const searchFilterMatch = filter ? marker.price.toString().includes(filter) : true;
            return typeFilterMatch && statusFilterMatch && paymentFilterMatch && searchFilterMatch;
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Enter location"
                    placeholderTextColor="gray"
                    onSubmitEditing={(event) => handleLocationSearch(event.nativeEvent.text, setLocation, webViewRef)}
                    onChangeText={text => setFilter(text)}
                />
                <Icon name="search" size={20} color="gray" style={styles.searchIcon} />
            </View>

            {/* Filter Options */}
            <FilterOptionsComponent
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                activeStatuses={activeStatuses}
                setActiveStatuses={setActiveStatuses}
                isPaidChecked={isPaidChecked}
                setIsPaidChecked={setIsPaidChecked}
                isUnpaidChecked={isUnpaidChecked}
                setIsUnpaidChecked={setIsUnpaidChecked}
                setFiltersChanged={setFiltersChanged}
                filterOptions={['All', 'Residential', 'Commercial']}
            />

            {/* Map */}
            <MapViewComponent
                location={location}
                markers={filteredMarkers()}
                polygons={polygons}
                webViewRef={webViewRef}
            />
        </View>
    );
};

export default GoogleMapscreen;
