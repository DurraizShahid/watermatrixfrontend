import React from 'react';
import { Marker, Polygon } from 'react-native-leaflet-view';

const MapContent = ({
    visibleMarkers,
    visiblePolygons,
    mapType,
    location,
    handleMapMovement,
    navigation,
    CustomMarker
}) => {
    return (
        <>
            {/* Current location marker */}
            <Marker
                position={[location.latitude, location.longitude]}
                icon={{
                    iconUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="10" fill="blue"/></svg>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 24],
                }}
            />

            {/* Property markers */}
            {visibleMarkers.map((marker) => (
                <Marker
                    key={marker.id}
                    position={[marker.latitude, marker.longitude]}
                    {...CustomMarker({ marker })}
                    eventHandlers={{
                        click: () => {
                            navigation.navigate('Detailedpage', { id: marker.id });
                        }
                    }}
                >
                </Marker>
            ))}

            {/* Plot polygons */}
            {visiblePolygons.map((polygon) => (
                <Polygon
                    key={polygon.id}
                    positions={polygon.coordinates.map(coord => [coord.latitude, coord.longitude])}
                    pathOptions={{
                        color: '#1EABA5',
                        fillColor: '#1EABA5',
                        fillOpacity: 0.2,
                        weight: 2
                    }}
                    eventHandlers={{
                        click: () => {
                            // Handle polygon click if needed
                            console.log('Polygon clicked:', polygon.title);
                        }
                    }}
                />
            ))}
        </>
    );
};

export default MapContent;