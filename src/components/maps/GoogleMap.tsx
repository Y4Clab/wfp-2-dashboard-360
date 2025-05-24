import { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Navigation, MapPin } from 'lucide-react';

// Define types for component props and state
interface MapProps {
  apiKey: string;
  width?: string;
  height?: string;
  className?: string;
}

interface Location {
  lat: number;
  lng: number;
}

interface MapState {
  center: Location;
  userLocation: Location | null;
  markers: Location[];
  directions: google.maps.DirectionsResult | null;
  zoom: number;
}

const libraries: ("places" | "geometry" | "drawing" | "localContext" | "visualization")[] = ['places'];

const GoogleMapComponent = ({ apiKey, width = '100%', height = '500px', className = '' }: MapProps) => {
  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
  });

  // Map state
  const [mapState, setMapState] = useState<MapState>({
    center: { lat: 0, lng: 0 },
    userLocation: null,
    markers: [],
    directions: null,
    zoom: 3,
  });

  // Refs for autocomplete inputs
  const originRef = useRef<HTMLInputElement>(null);
  const originAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  const destinationRef = useRef<HTMLInputElement>(null);
  const destinationAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  const searchRef = useRef<HTMLInputElement>(null);
  const searchAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Map instance ref
  const mapRef = useRef<google.maps.Map | null>(null);

  // Get user's current location
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapState((prev) => ({
            ...prev,
            userLocation: userPos,
            center: userPos,
            zoom: 14,
          }));
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Initialize autocomplete
  const initAutocomplete = useCallback(() => {
    if (!isLoaded || !originRef.current || !destinationRef.current || !searchRef.current) return;

    // Set up origin autocomplete
    originAutocompleteRef.current = new google.maps.places.Autocomplete(originRef.current);
    originAutocompleteRef.current.addListener('place_changed', () => {
      const place = originAutocompleteRef.current?.getPlace();
      if (place?.geometry?.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMapState(prev => ({
          ...prev,
          markers: [...prev.markers.filter((_, i) => i !== 0), location],
          center: location,
          zoom: 14,
        }));
      }
    });

    // Set up destination autocomplete
    destinationAutocompleteRef.current = new google.maps.places.Autocomplete(destinationRef.current);
    destinationAutocompleteRef.current.addListener('place_changed', () => {
      const place = destinationAutocompleteRef.current?.getPlace();
      if (place?.geometry?.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMapState(prev => ({
          ...prev,
          markers: [...prev.markers.filter((_, i) => i !== 1), location],
          center: location,
          zoom: 14,
        }));
      }
    });

    // Set up search autocomplete
    searchAutocompleteRef.current = new google.maps.places.Autocomplete(searchRef.current);
    searchAutocompleteRef.current.addListener('place_changed', () => {
      const place = searchAutocompleteRef.current?.getPlace();
      if (place?.geometry?.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMapState(prev => ({
          ...prev,
          markers: [location],
          center: location,
          zoom: 14,
        }));
      }
    });
  }, [isLoaded]);

  // Calculate route between two points
  const calculateRoute = useCallback(async () => {
    if (!originRef.current?.value || !destinationRef.current?.value) {
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    
    try {
      const result = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: google.maps.TravelMode.DRIVING,
      });
      
      setMapState(prev => ({
        ...prev,
        directions: result,
      }));
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  }, []);

  // Handle map load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Get address from coordinates (reverse geocoding)
  const getAddressFromCoords = useCallback(async (lat: number, lng: number) => {
    if (!isLoaded) return;
    
    const geocoder = new google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({
        location: { lat, lng }
      });
      
      if (response.results[0]) {
        return response.results[0].formatted_address;
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
    return "Unknown location";
  }, [isLoaded]);

  // Handle map click for dropping pins
  const handleMapClick = useCallback(async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    
    const newMarker = { lat, lng };
    
    setMapState(prev => ({
      ...prev,
      markers: [...prev.markers, newMarker],
      center: newMarker,
    }));
    
    // Optional: Get address from coordinates when clicking
    const address = await getAddressFromCoords(lat, lng);
    console.log("Clicked location address:", address);
  }, [getAddressFromCoords]);

  // Initialize map on load
  useEffect(() => {
    if (isLoaded) {
      initAutocomplete();
    }
  }, [isLoaded, initAutocomplete]);

  // Render loading state
  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search Form */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchRef}
                  placeholder="Search for a place..."
                  className="pl-8"
                />
              </div>
              <Button 
                variant="default" 
                onClick={getUserLocation}
                className="w-full"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Use My Location
              </Button>
            </div>

            <div className="space-y-2">
              <Input
                ref={originRef}
                placeholder="Starting point..."
              />
              <Input
                ref={destinationRef}
                placeholder="Destination..."
              />
            </div>

            <div className="flex items-end">
              <Button 
                variant="default" 
                onClick={calculateRoute}
                className="w-full"
              >
                <Navigation className="mr-2 h-4 w-4" />
                Calculate Route
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Container */}
      <div style={{ height, width }} className={className}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={mapState.center}
          zoom={mapState.zoom}
          onClick={handleMapClick}
          onLoad={onMapLoad}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {/* User location marker */}
          {mapState.userLocation && (
            <Marker
              position={mapState.userLocation}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              }}
              title="Your Location"
            />
          )}

          {/* Other markers */}
          {mapState.markers.map((marker, index) => (
            <Marker
              key={`${marker.lat}-${marker.lng}-${index}`}
              position={marker}
              label={(index + 1).toString()}
            />
          ))}

          {/* Directions renderer */}
          {mapState.directions && (
            <DirectionsRenderer
              directions={mapState.directions}
              options={{
                suppressMarkers: false,
                polylineOptions: {
                  strokeColor: '#2563eb',
                  strokeWeight: 5,
                }
              }}
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default GoogleMapComponent; 