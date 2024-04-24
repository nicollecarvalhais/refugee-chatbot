// Replace 'YOUR_API_KEY' with your actual Google Maps API key
const apiKey = 'AIzaSyABj1A8SHErvHWbAo3Y7rcIUspyPwyQAJ0Y';

// Initialize the Google Maps JavaScript API
function initMap() {
    // Specify the center coordinates and zoom level for the map
    const center = { lat: 40.7128, lng: -74.0060 }; // Example: New York City coordinates
    const zoom = 12;

    // Create a new map instance and set its center and zoom level
    const map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: zoom
    });

    // Create a PlacesService instance to use Places API
    const placesService = new google.maps.places.PlacesService(map);

    // Example: Search for nearby places (e.g., restaurants)
    const request = {
        location: center,
        radius: '500', // Search radius in meters
        type: ['restaurant'] // Type of place to search for
    };

    // Perform a nearby search for restaurants
    placesService.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (let i = 0; i < results.length; i++) {
                // Add markers for each nearby place
                createMarker(results[i]);
            }
        }
    });
}

// Create a marker for a place
function createMarker(place) {
    new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name
    });
}