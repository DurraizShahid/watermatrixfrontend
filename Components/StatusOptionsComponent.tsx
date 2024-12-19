import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import styles from '../screens/GoogleMapScreenStyles';

export const StatusOptionsComponent = ({
    activeStatuses,
    setActiveStatuses,
    setFiltersChanged
}) => {
    const toggleStatus = (statusName) => {
        if (statusName === "None") {
            setActiveStatuses(["None"]);
        } else {
            setActiveStatuses(prevStatuses => {
                const newStatuses = prevStatuses.includes(statusName)
                    ? prevStatuses.filter(s => s !== statusName)
                    : [...prevStatuses.filter(s => s !== "None"), statusName];
                setFiltersChanged(true);
                return newStatuses;
            });
        }
    };

    // Define status options and display names
    const statusOptions = [
        { value: "InProgress", display: "In Progress" },
        { value: "Dis-Conn", display: "Disconnect" },
        { value: "Conflict", display: "Conflict" },
        { value: "New", display: "New" },
        { value: "Notice", display: "Notice" },
        { value: "None", display: "None" }
    ];

    return (
        <View style={styles.statusContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bottomScrollContent}>
                {statusOptions.map((status, index) => {
                    const isActive = activeStatuses.includes(status.value);
                    let buttonStyle;
                    switch (status.value) {
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
                        case "None":
                            buttonStyle = styles.noneButton;
                            break;
                        default:
                            buttonStyle = {};
                    }

                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.bottomButton, isActive && buttonStyle]}
                            onPress={() => toggleStatus(status.value)}
                        >
                            <Text style={[styles.buttonText, isActive && styles.activeButtonText]}>
                                {status.display}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};