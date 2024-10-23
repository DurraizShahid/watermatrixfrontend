// utils.js

import { Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Function to convert geographic coordinates to pixel values
export const convertCoordinatesToPixels = (coordinates, region, mapWidth, mapHeight) => {
    const latLngToPoint = (lat, lng) => {
        const latFraction = (lat - region.latitude) / region.latitudeDelta;
        const lngFraction = (lng - region.longitude) / region.longitudeDelta;
        
        return {
            x: lngFraction * mapWidth,
            y: latFraction * mapHeight,
        };
    };

    // Convert all coordinates to points
    const points = coordinates.map(latLngToPoint);
    
    // Calculate bounding box for the polygon
    const minX = Math.min(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxX = Math.max(...points.map(p => p.x));
    const maxY = Math.max(...points.map(p => p.y));

    // Calculate width and height for the polygon bounding box
    const width = maxX - minX;
    const height = maxY - minY;

    return {
        x: minX,
        y: minY,
        width: width,
        height: height,
        points, // Return the array of points if needed for further processing
    };
};

// Function to determine if a polygon is visible within the current region
export const isPolygonVisible = (coordinates, visibleRegion) => {
    const { northEast, southWest } = visibleRegion;
    return coordinates.some(coord => 
        coord.latitude >= southWest.latitude &&
        coord.latitude <= northEast.latitude &&
        coord.longitude >= southWest.longitude &&
        coord.longitude <= northEast.longitude
    );
};

// Function to get the current map region from the map ref
export const getMapRegion = (mapRef) => {
    if (mapRef.current) {
        return mapRef.current.getMap().getRegion();
    }
    return null;
};
