import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";

const WeatherWithMap = () => {
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [weather, setWeather] = useState("");
  const [locationName, setLocationName] = useState("");
  const [places, setPlaces] = useState([]);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCdQuqbFYgrA9j15_Zc4SnNSK3pAtdp8v0", // Replace with your real key
    libraries: ["places"],
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setLat(latitude);
      setLon(longitude);

      // Reverse Geocode for location name
      try {
        const reverseGeo = await axios.get(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const name =
          reverseGeo.data.locality ||
          reverseGeo.data.city ||
          reverseGeo.data.principalSubdivision;
        setLocationName(name);

        // Weather Data
        const weatherRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=ffb8e7b87af49d2455a4f1199e2f3da5`
        );
        const data = weatherRes.data;
        setWeather(
          `Currently in ${name}, it’s ${data.weather[0].description} with ${data.main.temp}°C. Feels like ${data.main.feels_like}°C.`
        );
      } catch (err) {
        console.error("Failed to get weather or location", err);
      }
    });
  }, []);

  const fetchNearbyPlaces = (map, location) => {
  const service = new window.google.maps.places.PlacesService(map);

  const request = {
    location,
    radius: 1500,
    type: "point_of_interest",
  };

  

  service.nearbySearch(request, (results, status) => {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      setPlaces(results.slice(0, 5)); // Top 5 places
    } else {
      console.error("Nearby places error:", status); // Check if this logs anything
    }
  });
};


  return isLoaded && lat && lon ? (
    <div className="p-4 space-y-4">
     

      {/* Map */}
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "50px", borderRadius: "12px" }}
        center={{ lat, lng: lon }}
        zoom={15}
        onLoad={(map) => {
          mapRef.current = map;
          const currentLocation = new window.google.maps.LatLng(lat, lon);
          fetchNearbyPlaces(map, currentLocation);
        }}
      >
        <Marker position={{ lat, lng: lon }} />
        {places.map((place, idx) => (
          <Marker
            key={idx}
            position={{
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }}
          />
        ))}
      </GoogleMap>
    </div>
  ) : (
    <div className="text-white">Loading map and weather data...</div>
  );
};

export default WeatherWithMap;
