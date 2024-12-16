import React from 'react';
import { WebView } from 'react-native-webview';

export const MapViewComponent = ({ location, markers, polygons, webViewRef }) => {
    const renderMap = () => {
        return `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Leaflet Map</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
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
                </style>
            </head>
            <body>
                <div id="map"></div>
                <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
                <script>
                    var map = L.map('map').setView([${location.latitude}, ${location.longitude}], 13);
    
                    L.tileLayer('https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i{y}!3m9!2sen-US!3sUS!5e18!12m1!1e68!12m3!1e37!2m1!1ssmartmaps!4e0!23i1301875&key=AIzaSyA49ZSrNSSd35nTc1idC6cIk55_TEj0jlA', {
                        maxZoom: 19,
                    }).addTo(map);
    
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
                    
                            var markerHtml = 
                                '<div style="position: relative;">' +
                                    '<div style="background-color: ' + markerColor + '; padding: 5px 8px; border-radius: 5px; display: flex; align-items: center; width: auto; min-width: 70px; justify-content: space-between;">' +
                                        '<span style="color: white; font-weight: bold; margin-right: 3px;">' + marker.price + '</span>' +
                                        '<img src="' + (marker.type === 'Residential' ? 'https://www.svgrepo.com/show/22031/home-icon-silhouette.svg' : 'https://www.svgrepo.com/show/535238/building.svg') + '"' +
                                             'style="width: 18px; height: 18px; filter: invert(1);" />' +
                                    '</div>' +
                                    '<div style="position: absolute; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid ' + markerColor + ';"></div>' +
                                '</div>';
                    
                            var icon = L.divIcon({
                                html: markerHtml,
                                className: 'custom-div-icon',
                                iconSize: [90, 40],
                                iconAnchor: [45, 40]
                            });
                    
                            L.marker([marker.latitude, marker.longitude], { icon: icon })
                                .addTo(map)
                                .on('click', function() {
                                    window.ReactNativeWebView.postMessage(JSON.stringify({
                                        type: 'markerClicked',
                                        id: marker.id
                                    }));
                                });
                        });
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
                            addMarkers(data.markers);
                        }
                        if (data.polygons) {
                            addPolygons(data.polygons);
                        }
                    });
    
                </script>
            </body>
        </html>
    `;
    };

    return (
        <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: renderMap() }}
            style={{ flex: 1 }}
            javaScriptEnabled
        />
    );
};