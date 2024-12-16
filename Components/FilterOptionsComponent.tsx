import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import styles from '../screens/GoogleMapScreenStyles';

export const FilterOptionsComponent = ({
    activeFilters,
    setActiveFilters,
    activeStatuses,
    setActiveStatuses,
    isPaidChecked,
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

    const toggleStatus = (statusName) => {
        setActiveStatuses(prevStatuses => {
            const newStatuses = prevStatuses.includes(statusName)
                ? prevStatuses.filter(s => s !== statusName)
                : [...prevStatuses, statusName];
            setFiltersChanged(true);
            return newStatuses;
        });
    };

    // Define status options
    const statusOptions = ["InProgress", "Dis-Conn", "Conflict", "New", "Notice"];

    return (
        <View>
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

            {/* Status Options */}
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
                                style={[styles.bottomButton, isActive && buttonStyle]}
                                onPress={() => toggleStatus(statusName)}
                            >
                                <Text style={[styles.buttonText, isActive && styles.activeButtonText]}>
                                    {statusName}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Checkboxes for Paid and Unpaid */}
            <View style={styles.checkboxContainer}>
                <CheckBox
                    value={isPaidChecked}
                    onValueChange={() => setIsPaidChecked(!isPaidChecked)}
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
