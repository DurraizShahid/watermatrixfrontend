import React, { useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

export const MapViewComponent = ({ location, markers, polygons, webViewRef, mapType }) => {
    const navigation = useNavigation();

    const renderMap = () => {
        const tileLayerUrl = mapType === 'satellite'
            ? 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&key=AIzaSyCbuY6KKFkmb4wkMzCsOskkxd7btxHCZ-w'
            : mapType === 'terrain'
            ? 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}&key=AIzaSyCbuY6KKFkmb4wkMzCsOskkxd7btxHCZ-w'
            : mapType === 'hybrid'
            ? 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&key=AIzaSyCbuY6KKFkmb4wkMzCsOskkxd7btxHCZ-w'
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        return `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Leaflet Map</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css" />
                <style>
                html, body {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    width: 100%;
                }
                #map {
                    width: 100%;
                    height: 100vh;
                    margin: 0;
                    padding: 0;
                }
                .leaflet-marker-icon {
                    width: auto !important;
                }
                .leaflet-control-zoom,
                .leaflet-control-attribution {
                    display: none;
                }
                .custom-div-icon {
                    background: transparent;
                    border: none;
                }
                </style>
            </head>
            <body>
                <div id="map"></div>
                <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
                <script src="https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js"></script>
                <script>
                    var map = L.map('map').setView([${location.latitude}, ${location.longitude}], 13);
    
                    L.tileLayer('${tileLayerUrl}', {
                        maxZoom: 19,
                    }).addTo(map);

                    var markersLayer = L.markerClusterGroup({
                        maxClusterRadius: 40, // Adjust this value to control clustering
                        disableClusteringAtZoom: 16 // Adjust this value to control when clustering stops
                    });
    
                    function addMarkers(markers) {
                        markers.forEach(function(marker) {
                            var markerColor;
                            
                            if (marker.status === null) {
                                markerColor = marker.IsPaid ? '#4CAF50' : '#FF0000'; // Green if paid, Red if unpaid
                            } else {
                                switch (marker.status) {
                                    case "InProgress":
                                        markerColor = '#E97451';
                                        break;
                                    case "Notice":
                                        markerColor = '#E6AF2E'; // Yellow
                                        break;
                                    case "New":
                                        markerColor = '#457B9D'; // Blue
                                        break;
                                    case "Dis-Conn":
                                        markerColor = '#967bb6'; // Lavender
                                        break;
                                    case "Conflict":
                                        markerColor = '#F1AB86'; // Light Pink
                                        break;
                                    default:
                                        markerColor = '#FF5252'; // Default red color
                                }
                            }
                    
                            const iconUrl = marker.type === 'Residential' 
                                ? 'https://www.svgrepo.com/show/22031/home-icon-silhouette.svg' 
                                : 'https://www.svgrepo.com/show/535238/building.svg';

                            var markerHtml = 
                                '<div style="position: relative;">' +
                                    '<div style="background-color: ' + markerColor + '; padding: 5px; border-radius: 5px; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px;">' +
                                        '<img src="' + iconUrl + '"' +
                                             'style="width: 18px; height: 18px; filter: invert(1);" />' +
                                    '</div>' +
                                    '<div style="position: absolute; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid ' + markerColor + ';"></div>' +
                                '</div>';
                    
                            var icon = L.divIcon({
                                html: markerHtml,
                                className: 'custom-div-icon',
                                iconSize: [24, 24],
                                iconAnchor: [12, 24]
                            });
                    
                            var markerInstance = L.marker([marker.latitude, marker.longitude], { icon: icon });
                            markerInstance.on('click', function() {
                                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markerClick', id: marker.id }));
                            });
                            markersLayer.addLayer(markerInstance);
                        });

                        map.addLayer(markersLayer);
                    }
    
                    function addPolygons(polygons) {
                        polygons.forEach(function(polygon) {
                            L.polygon(polygon.coordinates, { color: 'blue' })
                                .addTo(map)
                                .bindPopup(polygon.title);
                        });
                    }
    
                    function moveToLocation(lat, lng) {
                        map.setView([lat, lng], 13);
                    }
    
                    function updateMap(markers, polygons) {
                        markersLayer.clearLayers();
                        map.eachLayer(function (layer) {
                            if (layer instanceof L.Marker || layer instanceof L.Polygon) {
                                map.removeLayer(layer);
                            }
                        });
                        addMarkers(markers);
                        addPolygons(polygons);
                    }
    
                    window.addEventListener('message', function(event) {
                        var data = JSON.parse(event.data);
                        if (data.markers) {
                            updateMap(data.markers, data.polygons || []);
                        }
                    });
    
                </script>
            </body>
        </html>
    `;
    };

    useEffect(() => {
        if (webViewRef.current) {
            webViewRef.current.injectJavaScript(`updateMap(${JSON.stringify(markers)}, ${JSON.stringify(polygons)});`);
        }
    }, [mapType]);

    const handleMessage = (event) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'markerClick') {
            navigation.navigate('Detailedpage', { id: data.id });
        }
    };

    return (
        <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: renderMap() }}
            style={{ flex: 1 }}
            javaScriptEnabled
            onMessage={handleMessage}
        />
    );
};