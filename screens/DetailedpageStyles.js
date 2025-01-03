import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1c1e',
        paddingHorizontal: 15,
    },
    imageCarouselContainer: {
        position: 'relative',
    },
    imageWrapper: {
        width: screenWidth,
        height: screenWidth * 0.6,
    },
    topImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageCountContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    imageCountText: {
        color: 'white',
        fontSize: 14,
    },
    propertyDetailsContainer: {
        marginTop: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    propertyInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    infoText: {
        color: '#d1d1d1',
        fontSize: 16,
    },
    ownerInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2c2c2e',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    ownerImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    ownerName: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    ownerRole: {
        color: '#d1d1d1',
        fontSize: 14,
    },
    contactButton: {
        backgroundColor: '#1EABA5',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginLeft: 'auto',
    },
    contactButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    sectionContainer: {
        marginBottom: 20,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    facilitiesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    facility: {
        color: '#d1d1d1',
        fontSize: 16,
    },
    mapContainer: {
        marginVertical: 20,
    },
    mapPlaceholder: {
        position: 'relative',
        height: 200,
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    mapOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    mapText: {
        position: 'absolute',
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        width: '100%',
    },
    nearbyFacility: {
        color: 'white',
        marginBottom: 5,
    },
    descriptionContainer: {
        padding: 15,
        backgroundColor: '#2c2c2e',
        borderRadius: 10,
        marginBottom: 20,
    },
    descriptionHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    descriptionText: {
        color: '#d1d1d1',
        lineHeight: 22,
    },
    facilityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    facilityText: {
        color: '#d1d1d1',
        marginLeft: 10,
    },
    noFacilitiesText: {
        color: '#d1d1d1',
        fontStyle: 'italic',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1c1c1e',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        fontWeight: 'bold',
    },
    smoothTransition: {
        transition: 'all 0.3s ease-in-out',
    },
});

export default styles;