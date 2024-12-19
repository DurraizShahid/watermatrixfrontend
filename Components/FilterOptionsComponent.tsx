import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import styles from '../screens/GoogleMapScreenStyles';

export const FilterOptionsComponent = ({
    activeFilters,
    setActiveFilters,
    IsPaidChecked,
    setIsPaidChecked,
    isUnpaidChecked,
    setIsUnpaidChecked,
    setFiltersChanged,
    filterOptions
}) => {
    const toggleFilter = (filterName) => {
        setActiveFilters([filterName]);
        setFiltersChanged(true);
    };

    return (
        <View>
            {/* Filter Options */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                {filterOptions.map((filterName, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.filterButton, activeFilters.includes(filterName) && { backgroundColor: '#1EABA5' }]}
                        onPress={() => toggleFilter(filterName)}
                    >
                        <Text style={[styles.filterText, activeFilters.includes(filterName) && { color: 'white' }]}>{filterName}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Checkboxes for Paid and Unpaid */}
            <View style={styles.checkboxContainer}>
                <CheckBox
                    value={IsPaidChecked}
                    onValueChange={() => setIsPaidChecked(!IsPaidChecked)}
                    tintColors={{ true: '#1EABA5', false: 'gray' }}
                />
                <Text style={styles.checkboxLabel}>Show Paid</Text>

                <CheckBox
                    value={isUnpaidChecked}
                    onValueChange={() => setIsUnpaidChecked(!isUnpaidChecked)}
                    tintColors={{ true: '#1EABA5', false: 'gray' }}
                />
                <Text style={styles.checkboxLabel}>Show Unpaid</Text>
            </View>
        </View>
    );
};