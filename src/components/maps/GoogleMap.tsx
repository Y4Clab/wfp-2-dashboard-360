import { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, Libraries } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Navigation, MapPin, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';

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
  bounds: google.maps.LatLngBounds | null;
}

interface Waypoint {
  id: string;
  location: string;
  ref: { current: HTMLInputElement | null };
  autocompleteRef: { current: google.maps.places.Autocomplete | null };
  position?: Location;
}

interface RouteData {
  origin: string;
  destination: string;
  waypoints: string[];
  distance: string;
  duration: string;
  polyline: string;
  path: Location[];
}

const libraries: Libraries = ['places'];

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
    bounds: null
  });

  // Refs for autocomplete inputs
  const originRef = useRef<HTMLInputElement>(null);
  const originAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  const destinationRef = useRef<HTMLInputElement>(null);
  const destinationAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  const searchRef = useRef<HTMLInputElement>(null);
  const searchAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // State for waypoints (intermediate destinations)
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);

  // Map instance ref
  const mapRef = useRef<google.maps.Map | null>(null);

  // Send route data to backend
  const sendRouteToBackend = async (routeData: RouteData) => {
    try {
      const apiUrl = import.meta.env.VITE_APP_API_URL || '';
      if (!apiUrl) {
        console.error("Backend API URL not configured");
        return;
      }
      
      await axios.post(`${apiUrl}/routes`, routeData);
      console.log("Route data sent successfully to backend");
    } catch (error) {
      console.error("Error sending route data to backend:", error);
    }
  };

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
    
    // Set up waypoints autocomplete
    waypoints.forEach(waypoint => {
      if (waypoint.ref.current && !waypoint.autocompleteRef.current) {
        waypoint.autocompleteRef.current = new google.maps.places.Autocomplete(waypoint.ref.current);
        waypoint.autocompleteRef.current.addListener('place_changed', () => {
          const place = waypoint.autocompleteRef.current?.getPlace();
          if (place?.geometry?.location) {
            const location = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            
            // Update the waypoint position
            setWaypoints(prev => 
              prev.map(wp => 
                wp.id === waypoint.id 
                  ? { ...wp, position: location } 
                  : wp
              )
            );
            
            setMapState(prev => ({
              ...prev,
              center: location,
              zoom: 14,
            }));
          }
        });
      }
    });
  }, [isLoaded, waypoints]);

  // Add a new waypoint
  const addWaypoint = useCallback(() => {
    const newWaypoint: Waypoint = {
      id: `waypoint-${Date.now()}`,
      location: '',
      ref: { current: null },
      autocompleteRef: { current: null },
    };
    
    setWaypoints(prev => [...prev, newWaypoint]);
  }, []);

  // Remove a waypoint
  const removeWaypoint = useCallback((id: string) => {
    setWaypoints(prev => prev.filter(wp => wp.id !== id));
  }, []);

  // Calculate route between multiple points
  const calculateRoute = useCallback(async () => {
    if (!originRef.current?.value || !destinationRef.current?.value) {
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    
    try {
      // Prepare waypoints for directions API
      const googleWaypoints = waypoints
        .filter(wp => wp.ref.current?.value)
        .map(wp => ({
          location: wp.ref.current?.value || '',
          stopover: true
        }));
      
      const result = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        waypoints: googleWaypoints,
        optimizeWaypoints: false, // Set to true to optimize the order of waypoints
        travelMode: google.maps.TravelMode.DRIVING,
      });
      
      // Create a new bounds object
      const bounds = new google.maps.LatLngBounds();
      
      // Get route leg coordinates to create bounds
      const route = result.routes[0];
      
      // Extract path from the route
      const path: Location[] = [];
      let totalDistance = 0;
      let totalDuration = 0;
      
      // Process all legs (segments between waypoints)
      route.legs.forEach(leg => {
        // Extend bounds with start and end locations
        bounds.extend(leg.start_location);
        bounds.extend(leg.end_location);
        
        // Add distance and duration
        totalDistance += leg.distance?.value || 0;
        totalDuration += leg.duration?.value || 0;
        
        // Extract path points
        if (leg.steps) {
          leg.steps.forEach(step => {
            if (step.path) {
              step.path.forEach(point => {
                path.push({
                  lat: point.lat(),
                  lng: point.lng()
                });
                bounds.extend(point);
              });
            }
          });
        }
      });
      
      // Format distance and duration
      const formatDistance = totalDistance < 1000 
        ? `${totalDistance} m` 
        : `${(totalDistance / 1000).toFixed(1)} km`;
      
      const formatDuration = totalDuration < 60
        ? `${totalDuration} sec`
        : totalDuration < 3600
          ? `${Math.floor(totalDuration / 60)} min`
          : `${Math.floor(totalDuration / 3600)} hr ${Math.floor((totalDuration % 3600) / 60)} min`;
      
      // Prepare route data for backend
      const routeData: RouteData = {
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        waypoints: waypoints
          .filter(wp => wp.ref.current?.value)
          .map(wp => wp.ref.current?.value || ''),
        distance: formatDistance,
        duration: formatDuration,
        polyline: route.overview_polyline || '',
        path: path
      };
      
      // Send route data to backend
      await sendRouteToBackend(routeData);
      
      // Update map state with directions and bounds
      setMapState(prev => ({
        ...prev,
        directions: result,
        bounds: bounds
      }));
      
      // Fit the map to the bounds
      if (mapRef.current) {
        mapRef.current.fitBounds(bounds);
      }
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  }, [waypoints, sendRouteToBackend]);

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

  // Initialize map on load
  useEffect(() => {
    if (isLoaded) {
      initAutocomplete();
    }
  }, [isLoaded, initAutocomplete]);

  // Apply bounds when they change
  useEffect(() => {
    if (mapRef.current && mapState.bounds) {
      mapRef.current.fitBounds(mapState.bounds);
    }
  }, [mapState.bounds]);

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
          <div className="grid grid-cols-1 gap-4">
            {/* Search and My Location */}
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
                  placeholder="Final destination..."
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
            
            {/* Waypoints */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Waypoints</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addWaypoint}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Stop
                </Button>
              </div>
              
              <div className="space-y-2">
                {waypoints.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No waypoints added. Click "Add Stop" to add intermediate destinations.</p>
                ) : (
                  waypoints.map((waypoint, index) => (
                    <div key={waypoint.id} className="flex space-x-2">
                      <Input
                        ref={waypoint.ref}
                        placeholder={`Stop ${index + 1}...`}
                        className="flex-1"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeWaypoint(waypoint.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
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

          {/* Origin and destination markers */}
          {mapState.markers.map((marker, index) => (
            <Marker
              key={`${marker.lat}-${marker.lng}-${index}`}
              position={marker}
              label={(index + 1).toString()}
            />
          ))}

          {/* Waypoint markers */}
          {waypoints
            .filter(waypoint => waypoint.position)
            .map((waypoint, index) => (
              <Marker
                key={waypoint.id}
                position={waypoint.position!}
                label={{
                  text: `W${index + 1}`,
                  color: "white",
                  fontWeight: "bold"
                }}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                }}
                title={`Waypoint ${index + 1}`}
              />
            ))}

          {/* Directions renderer */}
          {mapState.directions && (
            <DirectionsRenderer
              directions={mapState.directions}
              options={{
                suppressMarkers: true,
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