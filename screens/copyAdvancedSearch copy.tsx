import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const { height } = Dimensions.get('window');

const AdvancedSearchScreen = () => {
    const [activeMenu, setActiveMenu] = useState('Search');
    const [filter, setFilter] = useState('');
    const [checkboxes, setCheckboxes] = useState({
        unPaid: false,
        paid: false,
        comm: false,
        res: false
    });
    const [selectedType, setSelectedType] = useState('Villa');
    const [customLocation, setCustomLocation] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const navigation = useNavigation();
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDirection, setSelectedDirection] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [adPhoneSearch, setAdPhoneSearch] = useState('');

    const toggleCheckbox = (name) => {
        setCheckboxes(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const menuItems = [
        { name: 'Search', icon: 'search' },
        { name: 'Ad/Phone Numbers', icon: 'phone' },
        { name: 'Parcels and Lands', icon: 'map' }
    ];

    const filterItems = ["All", "Comm", "Res", "InProgress", "Dis-Conn", "Conflict"];
    const bottomButtons = ["Unpaid", "Paid", "In-Progress", "New", "Notice"];
    const tagItems = ["10 Marla", "1 Kanal", "1 Kanal+"];

    const handleSearch = () => {
        console.log('Performing search...');
        // Implement your search logic here
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
                            <Icon name={item.icon} size={20} color={activeMenu === item.name ? 'white' : '#6C768A'} style={styles.menuIcon} />
                            <Text style={[styles.menuText, activeMenu === item.name && styles.menuTextActive]}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                {activeMenu === 'Search' && (
                    <>
                        <View style={styles.locationContainer}>
                            <View style={styles.locationBox}>
                                <TextInput
                                    style={styles.customLocationInput}
                                    placeholder="Enter a custom location"
                                    placeholderTextColor="gray"
                                    value={customLocation}
                                    onChangeText={setCustomLocation}
                                />
                                <TouchableOpacity onPress={() => console.log('Getting current location...')} style={styles.targetButton}>
                                    <Icon name="crosshairs" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.dropdownContainer}>
                            <Picker
                                selectedValue={selectedType}
                                style={styles.picker}
                                onValueChange={setSelectedType}
                            >
                                <Picker.Item label="Villa" value="Villa" />
                                <Picker.Item label="House" value="House" />
                            </Picker>
                        </View>

                        {['Placeholder title 1', 'Placeholder title 2', 'Placeholder 3', 'Specifications'].map((title, index) => (
                            <View key={index} style={styles.placeholderContainer}>
                                <Text style={styles.placeholderTitle}>{title}</Text>
                                {index === 0 && (
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                                        {filterItems.map((filterName, idx) => (
                                            <TouchableOpacity
                                                key={idx}
                                                style={styles.filterButton}
                                                onPress={() => setFilter(filterName)}
                                            >
                                                <Text style={styles.filterText}>{filterName}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                )}
                                {index === 1 && (
                                    <View style={styles.checkboxContainer}>
                                        {['unPaid', 'paid'].map(checkboxName => (
                                            <React.Fragment key={checkboxName}>
                                                <TouchableOpacity
                                                    style={[styles.checkbox, checkboxes[checkboxName] && styles.checkboxChecked]}
                                                    onPress={() => toggleCheckbox(checkboxName)}
                                                >
                                                    {checkboxes[checkboxName] && <Icon name="check" size={14} color="white" />}
                                                </TouchableOpacity>
                                                <Text style={[styles.checkboxText, checkboxes[checkboxName] && styles.checkboxTextChecked]}>
                                                    {checkboxName.charAt(0).toUpperCase() + checkboxName.slice(1)}
                                                </Text>
                                            </React.Fragment>
                                        ))}
                                    </View>
                                )}
                                {index === 1 && (
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bottomScrollContent}>
                                        {bottomButtons.map((buttonName, idx) => (
                                            <TouchableOpacity key={idx} style={styles.bottomButton}>
                                                <Icon name="briefcase" size={20} color="#6C768A" style={styles.icon} />
                                                <Text style={styles.bottomButtonText}>{buttonName}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                )}
                                {index === 2 && (
                                    <View style={styles.checkboxContainer}>
                                        {['comm', 'res'].map(checkboxName => (
                                            <React.Fragment key={checkboxName}>
                                                <TouchableOpacity
                                                    style={[styles.checkbox, checkboxes[checkboxName] && styles.checkboxChecked]}
                                                    onPress={() => toggleCheckbox(checkboxName)}
                                                >
                                                    {checkboxes[checkboxName] && <Icon name="check" size={14} color="white" />}
                                                </TouchableOpacity>
                                                <Text style={[styles.checkboxText, checkboxes[checkboxName] && styles.checkboxTextChecked]}>
                                                    {checkboxName.charAt(0).toUpperCase() + checkboxName.slice(1)}
                                                </Text>
                                            </React.Fragment>
                                        ))}
                                    </View>
                                )}
                                {index === 3 && (
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                                        {tagItems.map((tagName, idx) => (
                                            <TouchableOpacity
                                                key={idx}
                                                style={[styles.filterButton, selectedTag === tagName && styles.filterButtonActive]}
                                                onPress={() => setSelectedTag(tagName)}
                                            >
                                                <Text style={[styles.filterText, selectedTag === tagName && styles.filterTextActive]}>
                                                    {tagName}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                )}
                            </View>
                        ))}
                    </>
                )}

                {activeMenu === 'Ad/Phone Numbers' && (
                    <View style={styles.adPhoneContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by Ad name or Number"
                            placeholderTextColor="#6C768A"
                            value={adPhoneSearch}
                            onChangeText={setAdPhoneSearch}
                        />
                        {/* Add more components for Ad/Phone Numbers section if needed */}
                    </View>
                )}

                {activeMenu === 'Parcels and Lands' && (
                    <View style={styles.parcelsAndLandsContainer}>
                        <Text style={styles.sectionHeading}>City</Text>
                        <Picker
                            selectedValue={selectedCity}
                            style={styles.picker}
                            onValueChange={setSelectedCity}
                        >
                            <Picker.Item label="Choose City" value="" />
                            <Picker.Item label="New York" value="new_york" />
                            <Picker.Item label="Los Angeles" value="los_angeles" />
                        </Picker>

                        <Text style={styles.sectionHeading}>Direction</Text>
                        <Picker
                            selectedValue={selectedDirection}
                            style={styles.picker}
                            onValueChange={setSelectedDirection}
                        >
                            <Picker.Item label="Choose Direction" value="" />
                            <Picker.Item label="North" value="north" />
                            <Picker.Item label="South" value="south" />
                        </Picker>

                        <Text style={styles.sectionHeading}>District</Text>
                        <Picker
                            selectedValue={selectedDistrict}
                            style={styles.picker}
                            onValueChange={setSelectedDistrict}
                        >
                            <Picker.Item label="Choose District" value="" />
                            <Picker.Item label="Downtown" value="downtown" />
                            <Picker.Item label="Suburbs" value="suburbs" />
                        </Picker>
                    </View>
                )}
            </ScrollView>

            {/* New Search Button */}
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
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
    menuIcon: {
        marginRight: 5,
    },
    menuText: {
        color: '#6C768A',
    },
    menuTextActive: {
        color: 'white',
    },
    contentContainer: {
        paddingHorizontal: 15,
        paddingBottom: 80, // Add padding to make room for the search button
    },
    locationContainer: {
        marginBottom: 15,
    },
    locationBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    customLocationInput: {
        flex: 1,
        backgroundColor: '#23252F',
        color: 'white',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    targetButton: {
        padding: 10,
        backgroundColor: '#38ADA9',
        borderRadius: 5,
    },
    dropdownContainer: {
        marginBottom: 15,
    },
    picker: {
        backgroundColor: '#23252F',
        color: 'white',
        borderRadius: 5,
        marginBottom: 15,
    },
    placeholderContainer: {
        marginVertical: 15,
    },
    placeholderTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    filterScroll: {
        flexDirection: 'row',
    },
    filterButton: {
        backgroundColor: '#19191C',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginRight: 10,
    },
    filterText: {
        color: '#6C768A',
    },
    filterButtonActive: {
        backgroundColor: '#38ADA9',
    },
    filterTextActive: {
        color: 'white',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderColor: '#6C768A',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkboxChecked: {
        backgroundColor: '#38ADA9',
        borderColor: '#38ADA9',
    },
    checkboxText: {
        color: '#6C768A',
        fontSize: 16,
        marginRight: 15,
    },
    checkboxTextChecked: {
        color: '#38ADA9',
    },
    bottomScrollContent: {
        flexDirection: 'row',
    },
    bottomButton: {
        backgroundColor: '#19191C',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomButtonText: {
        color: '#6C768A',
        marginLeft: 5,
    },
    icon: {
        color: '#6C768A',
    },
    parcelsAndLandsContainer: {
        paddingVertical: 15,
    },
    sectionHeading: {
        color: 'white',
        fontSize: 18,
        marginBottom: 10,
    },
    adPhoneContainer: {
        marginTop: 15,
    },
    searchInput: {
        backgroundColor: '#23252F',
        color: 'white',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    searchButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#38ADA9',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    searchButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AdvancedSearchScreen;