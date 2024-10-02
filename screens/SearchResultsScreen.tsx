import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SearchResultsScreen = ({ route }) => {
    const navigation = useNavigation();
    const { results } = route.params;

    // Log results to debug
    console.log(results);

    // Optionally filter out results without a PropertyId
    const validResults = results.filter(item => item.PropertyId != null);

    const handleItemPress = (item) => {
        // Pass only the PropertyId to the DetailedPage
        navigation.navigate('Detailedpage', { id: item.PropertyId });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                {validResults.length} {validResults.length === 1 ? 'Result' : 'Results'} Found
            </Text>

            {validResults.length === 0 ? (
                <Text style={styles.emptyText}>No results found.</Text>
            ) : (
                <FlatList
                    data={validResults}
                    keyExtractor={(item) => item.PropertyId ? item.PropertyId.toString() : Math.random().toString()}
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
