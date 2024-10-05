import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Component for handling map clicks to select a location
function LocationMarker({ setLocation, setAddress }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLocation({ latitude: lat, longitude: lng });

      // Reverse geocode to get the address
      axios.post('/api/location/reverse-geocode', { latitude: lat, longitude: lng })
        .then(response => {
          setAddress(response.data.address);
        })
        .catch(err => {
          console.error('Error reverse geocoding:', err);
        });
    },
  });
  return null;
}

// Main component for handling map and address-based inputs
const Map = () => {
  const [currentAddress, setCurrentAddress] = useState('');
  const [targetAddress, setTargetAddress] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [targetLocation, setTargetLocation] = useState(null);
  const [result, setResult] = useState(null);
  const [nearbyLocations, setNearbyLocations] = useState(null);

  // Fetch the device's current location
  useEffect(() => {
    if (!currentLocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
      });
    }
  }, [currentLocation]);

  // Calculate distance by address
  const handleAddressSubmit = async () => {
    try {
      const response = await axios.post('/api/location/calculate-by-address', {
        currentAddress,
        targetAddress,
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error calculating distance by address:', error);
    }
  };

  // Calculate distance by coordinates (from map selection)
  const handleMapSubmit = async () => {
    try {
      const response = await axios.post('/api/location/calculate-by-coordinates', {
        userLocation: currentLocation,
        targetLocation,
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error calculating distance by coordinates:', error);
    }
  };

  // Search nearby locations using current coordinates
  const handleNearMeSearch = async () => {
    try {
      const response = await axios.post('/api/location/nearby', {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
      setNearbyLocations(response.data.nearbyLocations);
    } catch (error) {
      console.error('Error fetching nearby locations:', error);
    }
  };

  return (
    <div>
      <h2>Calculate Distance or Search Nearby Locations</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Address Input Section */}
        <div>
          <h3>Enter Address</h3>
          <input
            type="text"
            placeholder="Enter current address"
            value={currentAddress}
            onChange={(e) => setCurrentAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter target address"
            value={targetAddress}
            onChange={(e) => setTargetAddress(e.target.value)}
          />
          <button onClick={handleAddressSubmit}>Calculate by Address</button>
        </div>

        {/* Map Section */}
        <div style={{ width: '60%' }}>
          <MapContainer center={[28.5355, 77.3910]} zoom={12} style={{ height: '400px' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Display markers for selected current and target locations */}
            {currentLocation && <Marker position={[currentLocation.latitude, currentLocation.longitude]} />}
            {targetLocation && <Marker position={[targetLocation.latitude, targetLocation.longitude]} />}
            {/* Handlers for selecting locations by clicking on the map */}
            <LocationMarker setLocation={setCurrentLocation} setAddress={setCurrentAddress} />
            <LocationMarker setLocation={setTargetLocation} setAddress={setTargetAddress} />
          </MapContainer>

          <button onClick={handleMapSubmit}>Calculate by Map</button>
          <button onClick={handleNearMeSearch}>Find Nearby Locations</button>
        </div>
      </div>

      {/* Display distance and pricing results */}
      {result && (
        <div>
          <h3>Result</h3>
          <p>Current Address: {result.current}</p>
          <p>Target Address: {result.target}</p>
          <p>Distance: {result.distanceKm.toFixed(2)} km</p>
          <p>Price: ₹{result.priceRs}</p>
        </div>
      )}

      {/* Display nearby locations */}
      {nearbyLocations && (
        <div>
          <h3>Nearby Locations (within 5 km)</h3>
          <ul>
            {nearbyLocations.map((location) => (
              <li key={location._id}>{location.name} - {location.distance.toFixed(2)} km</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Map;
