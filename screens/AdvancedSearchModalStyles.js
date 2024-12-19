import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    advancedSearchContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#2C2C2C',
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

export default styles;