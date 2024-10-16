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
    const [IsPaidFilter, setIsPaidFilter] = useState(false);
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
        { name: 'Search', icon: 'search' },
        { name: 'Billing Ref. No.', icon: 'book' },
        { name: 'Parcels', icon: 'map' }
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

            if (IsPaidFilter) {
                matchesFilter = matchesFilter && item.IsPaid === true;
            }

            return matchesFilter;
        });
    }, [filter, selectedCategory, selectedType, areaFilter, searchText, IsPaidFilter, properties]);

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
                                    value={IsPaidFilter}
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

                {activeMenu === 'Billing Ref. No.' && (
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

                {activeMenu === 'Parcels' && (
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
      paddingHorizontal: 20, // Add padding to prevent elements from touching the sides
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 15,
      backgroundColor: '#23252F',
      borderBottomWidth: 1,
      borderBottomColor: '#333', // Optional: adds a subtle border for clarity
    },
    backButton: {
      marginRight: 15,
    },
    title: {
      color: 'white',
      fontSize: 22, // Slightly larger for better readability
      fontWeight: 'bold',
    },
    menuContainer: {
      marginVertical: 15, // Increase space above and below the menu
    },
    menuScroll: {
      flexDirection: 'row',
      paddingVertical: 10, // Add vertical padding for a more spacious look
    },
    menuButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12, // More padding for better button size
      paddingHorizontal: 15,
      marginHorizontal: 10, // Increased spacing between buttons
      backgroundColor: '#23252F',
      borderRadius: 8, // Smoother corners
    },
    menuButtonActive: {
      backgroundColor: '#1EABA5',
    },
    filterButton: {
      paddingVertical: 12,
      paddingHorizontal: 15,
      marginHorizontal: 10,
      backgroundColor: '#6C768A',
      borderRadius: 8,
    },
    filterButtonActive: {
      backgroundColor: '#1EABA5',
    },
    filterText: {
      color: 'white',
      fontSize: 14, // Slightly smaller, consistent with button size
    },
    placeholderContainer: {
      marginVertical: 15, // Increase space between sections
    },
    placeholderTitle: {
      color: 'white',
      fontSize: 18, // Larger title for better readability
      marginBottom: 8, // Slightly more space below the title
    },
    customLocationInput: {
      backgroundColor: '#23252F',
      color: 'white',
      paddingVertical: 12, // More padding for a larger input field
      paddingHorizontal: 15,
      borderRadius: 8,
    },
    searchButton: {
      backgroundColor: '#1EABA5',
      paddingVertical: 15, // Slightly smaller padding for consistency
      borderRadius: 8,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 30, // Increased margin to avoid crowding
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
      marginVertical: 10, // Ensure spacing around checkboxes
    },
    checkboxLabel: {
      color: 'white',
      marginLeft: 10,
    },
    picker: {
      backgroundColor: '#6C768A',
      color: 'white',
      height: 50,
      borderRadius: 8, // Smoother corners
      paddingHorizontal: 15,
      marginVertical: 10, // Ensure the picker has space around it
    },
  });

export default AdvancedSearchScreen;
