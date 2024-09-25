import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import dummyData from './dummyData';

const { height } = Dimensions.get('window');

const AdvancedSearchScreen = () => {
    const navigation = useNavigation();
    const [activeMenu, setActiveMenu] = useState('Search');
    const [filter, setFilter] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedType, setSelectedType] = useState('All');
    const [customLocation, setCustomLocation] = useState('');
    const [areaFilter, setAreaFilter] = useState([]);
    const [searchText, setSearchText] = useState('');

    const menuItems = [
        { name: 'Search', icon: 'search' },
        { name: 'Ad/Phone Numbers', icon: 'phone' },
        { name: 'Parcels and Lands', icon: 'map' }
    ];

    const filterItems = ["Comm", "InProgress", "Dis-Conn", "Conflict", "New", "Notice"];
    const typeItems = [...new Set(dummyData.map(item => item.type)), 'All'];
    const uniqueCategories = ['All', ...new Set(dummyData.map(item => item.category))];
    const areaItems = ["10 Marla", "1 Kanal", "1 Kanal+"];

    const filteredResults = useMemo(() => {
        return dummyData.filter(item => {
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
                    if (areaOption === "10 Marla") return area === 25;
                    if (areaOption === "1 Kanal") return area === 505;
                    if (areaOption === "1 Kanal+") return area > 505;
                    return false;
                });
            }

            if (searchText) {
                matchesFilter = matchesFilter && item.title.toLowerCase().includes(searchText.toLowerCase());
            }

            return matchesFilter;
        });
    }, [filter, selectedCategory, selectedType, areaFilter, searchText]);

    const resultCount = filteredResults.length;

    const handleSearch = () => {
        navigation.navigate('SearchResultsScreen', { results: filteredResults });
    };

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
                                placeholder="Enter a custom location"
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

                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>
                        {resultCount} Results - Search
                    </Text>
                </TouchableOpacity>
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
        padding: 20,
        backgroundColor: '#23252F',
    },
    backButton: {
        marginRight: 80,
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    menuContainer: {
        marginVertical: 20,
    },
    menuScroll: {
        flexDirection: 'row',
    },
    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
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
        marginVertical: 15,
        backgroundColor: '#6C768A',
        borderRadius: 5,
    },
    filterButtonActive: {
        backgroundColor: '#38ADA9',
    },
    filterText: {
        color: 'white',
        marginHorizontal: 5,
    },
    placeholderContainer: {
        marginVertical: 15,
        marginHorizontal: 5,
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
        marginVertical: 20,
    },
    searchButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AdvancedSearchScreen;
