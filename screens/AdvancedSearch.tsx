import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';

const { height } = Dimensions.get('window');

// Area mapping for easier management
const areaMapping = {
    "10 Marla": 25,
    "1 Kanal": 505,
    "1 Kanal+": (area) => area > 505,
};

const AdvancedSearchScreen = () => {
    const navigation = useNavigation();
    const [activeMenu, setActiveMenu] = useState('Search');
    const [filter, setFilter] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedType, setSelectedType] = useState('All');
    const [customLocation, setCustomLocation] = useState('');
    const [areaFilter, setAreaFilter] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isPaidFilter, setIsPaidFilter] = useState(false);
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch('https://mapmatrixbackend-production.up.railway.app/api/property/properties');
                const data = await response.json();
                setProperties(data); // Update with the actual structure if needed
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };

        fetchProperties();
    }, []);

    const menuItems = [
        { name: ' Search', icon: 'search' },
        { name: ' Billing Ref. No.', icon: 'book' },
        { name: ' Parcels', icon: 'map' }
    ];

    const filterItems = ["New", "InProgress", "DisConn", "Conflict", "Notice", "Comm"];
    const typeItems = [...new Set(properties.map(item => item.type)), 'All'];
    const uniqueCategories = ['All', ...new Set(properties.map(item => item.category))];
    const areaItems = Object.keys(areaMapping);

    const filteredResults = useMemo(() => {
        return properties.filter(item => {
            let matchesFilter = true;

            if (filter.length > 0) {
                matchesFilter = matchesFilter && filter.includes(item.status);
            }

            if (selectedCategory !== 'All') {
                matchesFilter = matchesFilter && item.category === selectedCategory;
            }

            if (selectedType !== 'All') {
                matchesFilter = matchesFilter && item.type === selectedType;
            }

            if (areaFilter.length > 0) {
                const area = item.area;
                matchesFilter = matchesFilter && areaFilter.some(areaOption => {
                    const areaCondition = areaMapping[areaOption];
                    return typeof areaCondition === 'function' ? areaCondition(area) : area === areaCondition;
                });
            }

            if (searchText) {
                matchesFilter = matchesFilter && item.title.toLowerCase().includes(searchText.toLowerCase());
            }

            if (isPaidFilter) {
                matchesFilter = matchesFilter && item.IsPaid === true;
            }

            return matchesFilter;
        });
    }, [filter, selectedCategory, selectedType, areaFilter, searchText, isPaidFilter, properties]);

    const resultCount = filteredResults.length;

    const handleSearch = useCallback(() => {
        navigation.navigate('SearchResultsScreen', { results: filteredResults });
    }, [filteredResults, navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={20} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>Advanced Search</Text>
            </View>

            <View style={styles.menuContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.menuScroll}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.menuButton, activeMenu === item.name && styles.menuButtonActive]}
                            onPress={() => setActiveMenu(item.name)}
                        >
                            <Icon name={item.icon} size={20} color={activeMenu === item.name ? 'white' : '#6C768A'} />
                            <Text style={[styles.menuText, activeMenu === item.name && styles.menuTextActive]}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                {activeMenu === 'Search' && (
                    <>
                        <View style={styles.locationContainer}>
                            <TextInput
                                style={styles.customLocationInput}
                                placeholder="Enter a plot number"
                                placeholderTextColor="gray"
                                value={customLocation}
                                onChangeText={setCustomLocation}
                            />
                        </View>

                        <View style={styles.placeholderContainer}>
                            <Text style={styles.placeholderTitle}>Status</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                                {filterItems.map((filterName, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        style={[styles.filterButton, filter.includes(filterName) && styles.filterButtonActive]}
                                        onPress={() => {
                                            setFilter(prev =>
                                                prev.includes(filterName)
                                                    ? prev.filter(item => item !== filterName)
                                                    : [...prev, filterName]
                                            );
                                        }}
                                    >
                                        <Text style={styles.filterText}>{filterName}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.placeholderContainer}>
                            <Text style={styles.placeholderTitle}>Category</Text>
                            <Picker
                                selectedValue={selectedCategory}
                                style={styles.picker}
                                onValueChange={setSelectedCategory}
                            >
                                {uniqueCategories.map((category, index) => (
                                    <Picker.Item key={index} label={category} value={category} />
                                ))}
                            </Picker>
                        </View>

                        <View style={styles.placeholderContainer}>
                            <Text style={styles.placeholderTitle}>Property Type</Text>
                            <Picker
                                selectedValue={selectedType}
                                style={styles.picker}
                                onValueChange={setSelectedType}
                            >
                                {typeItems.map((type, index) => (
                                    <Picker.Item key={index} label={type} value={type} />
                                ))}
                            </Picker>
                        </View>

                        <View style={styles.placeholderContainer}>
                            <Text style={styles.placeholderTitle}>Area</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                                {areaItems.map((areaOption, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        style={[styles.filterButton, areaFilter.includes(areaOption) && styles.filterButtonActive]}
                                        onPress={() => {
                                            setAreaFilter(prev =>
                                                prev.includes(areaOption)
                                                    ? prev.filter(item => item !== areaOption)
                                                    : [...prev, areaOption]
                                            );
                                        }}
                                    >
                                        <Text style={styles.filterText}>{areaOption}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.placeholderContainer}>
                            <View style={styles.checkboxContainer}>
                                <CheckBox
                                    value={isPaidFilter}
                                    onValueChange={setIsPaidFilter}
                                    accessibilityLabel="Show only Paid Properties"
                                />
                                <Text style={styles.checkboxLabel}>Show only Paid Properties</Text>
                            </View>
                        </View>

                        <View style={styles.searchContainer}>
                            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                                <Icon name="search" size={20} color="white" />
                                <Text style={styles.searchButtonText}>Search</Text>
                                <Text style={styles.resultCount}>( {resultCount} )</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {activeMenu === 'Ad/Phone Numbers' && (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderTitle}>Search Phone Numbers</Text>
                        <TextInput
                            style={styles.customLocationInput}
                            placeholder="Enter phone number"
                            placeholderTextColor="gray"
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>
                )}

                {activeMenu === 'Parcels and Lands' && (
                    <>
                        <View style={styles.placeholderContainer}>
                            <Text style={styles.placeholderTitle}>City</Text>
                            <Picker
                                selectedValue={selectedCategory}
                                style={styles.picker}
                                onValueChange={setSelectedCategory}
                            >
                                {uniqueCategories.map((category, index) => (
                                    <Picker.Item key={index} label={category} value={category} />
                                ))}
                            </Picker>
                        </View>
                        <View style={styles.placeholderContainer}>
                            <Text style={styles.placeholderTitle}>Direction</Text>
                            <Picker
                                selectedValue={selectedType}
                                style={styles.picker}
                                onValueChange={setSelectedType}
                            >
                                {typeItems.map((type, index) => (
                                    <Picker.Item key={index} label={type} value={type} />
                                ))}
                            </Picker>
                        </View>
                        <View style={styles.placeholderContainer}>
                            <Text style={styles.placeholderTitle}>District</Text>
                            <Picker
                                selectedValue={selectedType}
                                style={styles.picker}
                                onValueChange={setSelectedType}
                            >
                                {typeItems.map((type, index) => (
                                    <Picker.Item key={index} label={type} value={type} />
                                ))}
                            </Picker>
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#19191C',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#23252F',
    },
    backButton: {
        marginRight: 15,
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    menuContainer: {
        marginVertical: 10,
    },
    menuScroll: {
        flexDirection: 'row',
    },
    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginHorizontal: 5,
        backgroundColor: '#23252F',
        borderRadius: 5,
    },
    menuButtonActive: {
        backgroundColor: '#38ADA9',
    },
    filterButton: {
        padding: 10,
        marginHorizontal: 5,
        backgroundColor: '#6C768A',
        borderRadius: 5,
    },
    filterButtonActive: {
        backgroundColor: '#38ADA9',
    },
    filterText: {
        color: 'white',
    },
    placeholderContainer: {
        marginVertical: 10,
    },
    placeholderTitle: {
        color: 'white',
        fontSize: 16,
        marginBottom: 5,
    },
    customLocationInput: {
        backgroundColor: '#23252F',
        color: 'white',
        padding: 10,
        borderRadius: 5,
    },
    searchButton: {
        backgroundColor: '#38ADA9',
        padding: 20,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        top: 190,
    },
    searchButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    resultCount: {
        color: 'white',
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxLabel: {
        color: 'white',
        marginLeft: 10,
    },
});

export default AdvancedSearchScreen;
