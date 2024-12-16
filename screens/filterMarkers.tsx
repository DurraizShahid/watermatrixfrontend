const filterMarkers = (markers, activeFilters, activeStatuses, isPaidChecked, isUnpaidChecked, filter) => {
    return markers.filter(marker => {
        const typeFilterMatch = activeFilters.includes(marker.type) || activeFilters.includes("All");
        const statusFilterMatch = activeStatuses.includes(marker.status) || activeStatuses.includes("All");
        const paymentFilterMatch = (isPaidChecked && marker.IsPaid) || (isUnpaidChecked && !marker.IsPaid);
        const searchFilterMatch = filter ? marker.price.toString().includes(filter) : true;
        return typeFilterMatch && statusFilterMatch && paymentFilterMatch && searchFilterMatch;
    });
};
export default filterMarkers;
