import { useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config'; // Assuming you store URLs in a config file

export const useFetchProperties = (setMarkers, setLocation) => {
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get(API_BASE_URL);
                const properties = response.data;

                const formattedMarkers = properties.map(property => ({
                    id: property.PropertyId,
                    title: property.title,
                    description: property.description,
                    price: parseFloat(property.price),
                    latitude: property.geometry.y,
                    longitude: property.geometry.x,
                    type: property.type,
                    status: property.status,
                    IsPaid: parseFloat(property.price) > 0,
                }));

                setMarkers(formattedMarkers);

                if (formattedMarkers.length > 0) {
                    setLocation({ latitude: formattedMarkers[0].latitude, longitude: formattedMarkers[0].longitude });
                }
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };

        fetchProperties();
    }, []);
};
