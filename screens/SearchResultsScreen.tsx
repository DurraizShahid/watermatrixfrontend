import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SearchResultsScreen = ({ route }) => {
    const navigation = useNavigation();
    const { results } = route.params;

    const handleItemPress = (item) => {
        // Pass only the id to the DetailedPage
        navigation.navigate('Detailedpage', { id: item.id });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <Text style={styles.header}>
                {results.length} {results.length === 1 ? 'Result' : 'Results'} Found
            </Text>

            {/* Display results */}
            {results.length === 0 ? (
                <Text style={styles.emptyText}>No results found.</Text>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id.toString()} // Ensure id is a string
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleItemPress(item)} style={styles.resultItem}>
                            <Image source={require('../images/home.jpg')} style={styles.image} />
                            <View style={styles.details}>
                                <Text style={styles.address}>{item.address}</Text>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.rooms}>1 Bedroom | 1 Living Room | 1 Bath</Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#19191C',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
    },
    emptyText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
    },
    resultItem: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#23252F',
        borderRadius: 5,
        elevation: 2,
        overflow: 'hidden',
    },
    image: {
        width: 120, // Adjust width as needed
        height: '100%',
    },
    details: {
        flex: 1,
        justifyContent: 'center',
        padding: 15,
    },
    address: {
        color: 'gray',
        fontSize: 14,
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    rooms: {
        color: 'gray',
        marginBottom: 5,
    },
    description: {
        color: 'gray',
        fontSize: 14,
    },
});

export default SearchResultsScreen;
