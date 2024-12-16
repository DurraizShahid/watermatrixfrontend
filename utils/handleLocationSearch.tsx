import Geocoder from 'react-native-geocoding';
import { GOOGLE_MAPS_API_KEY } from '../config'; // Assuming you store the API key in a config file

export const handleLocationSearch = (searchTerm, setLocation, webViewRef) => {
    Geocoder.init(GOOGLE_MAPS_API_KEY);

    Geocoder.from(searchTerm)
        .then(response => {
            const { lat, lng } = response.results[0].geometry.location;
            setLocation({ latitude: lat, longitude: lng });

            if (webViewRef.current) {
                webViewRef.current.injectJavaScript(`map.setView([${lat}, ${lng}], 13);`);
            }
        })
        .catch(error => {
            console.error('Error fetching geocode data:', error);
        });
};
