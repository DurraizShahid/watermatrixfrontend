import { useEffect } from 'react';
import axios from 'axios';
import { PLOTS_API_URL } from '../config'; // Assuming you store URLs in a config file

export const useFetchPolygons = (setPolygons) => {
    useEffect(() => {
        const fetchPolygons = async () => {
            try {
                const response = await axios.get(PLOTS_API_URL);
                const plots = response.data;

                const formattedPolygons = plots
                    .filter(plot => plot.WKT && plot.WKT.length > 0)
                    .map(plot => ({
                        id: plot.id,
                        coordinates: plot.WKT[0][0].map(coord => [coord.y, coord.x]),
                        title: plot.landuse_su || 'Polygon',
                    }));

                setPolygons(formattedPolygons);
            } catch (error) {
                console.error('Error fetching polygons:', error);
            }
        };

        fetchPolygons();
    }, []);
};
