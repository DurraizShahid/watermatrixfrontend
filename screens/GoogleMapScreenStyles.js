import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    overlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: 10,
    },
    hamburger: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1000,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2C2C2C',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
        marginTop: 50, // Adjusted to make space for the hamburger icon
    },
    searchInput: {
        flex: 1,
        color: 'white',
    },
    searchIcon: {
        marginLeft: 10,
    },
    filterScroll: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    filterButton: {
        backgroundColor: '#19191C',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginRight: 15,
    },
    filterText: {
        color: '#6C768A',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(44, 44, 44, 0.8)', // Semi-transparent background
        borderRadius: 10, // Added border radius
        paddingVertical: 5, // Reduced height
        paddingHorizontal: 10, // Added padding
        marginVertical: 15,
    },
    checkbox: {
        marginRight: 10,
    },
    checkboxLabel: {
        color: 'white',
        marginLeft: 5,
        alignSelf: 'center', // Align text in the middle of the checkbox
    },
    bottomScrollContainer: {
        marginBottom: 30,
    },
    bottomScrollContent: {
        paddingHorizontal: 10,
    },
    bottomButton: {
        backgroundColor: '#19191C',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginRight: 10,
    },
    buttonText: {
        color: 'grey',
    },
    inProgressButton: {
        backgroundColor: '#E97451',
    },
    disConnButton: {
        backgroundColor: '#967bb6',
    },
    conflictButton: {
        backgroundColor: '#F1AB86',
    },
    newButton: {
        backgroundColor: '#457B9D',
    },
    noticeButton: {
        backgroundColor: '#E6AF2E',
    },
    activeButtonText: {
        color: 'white',
    },
    icon: {
        color: '#6C768A',
    },
    statusContainer: {
        marginBottom: 20,
    },
    statusOptionsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
    },
    sidebar: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 200,
        height: '100%',
        backgroundColor: '#19191C',
        padding: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        zIndex: 1000,
    },
    sidebarOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sidebarItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 30, // Added margin to move items below
    },
    sidebarText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10,
    },
    sectorList: {
        marginTop: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1000,
    },
});

export default styles;