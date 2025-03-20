
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MOCK_LOCATIONS = [
  { id: 'T001', lat: 1.3, lng: 36.8, status: 'on-route', mission: 'M-1234', vendor: 'Global Foods' },
  { id: 'T002', lat: 1.32, lng: 36.82, status: 'delayed', mission: 'M-1235', vendor: 'Med Supplies Inc' },
  { id: 'T003', lat: 1.28, lng: 36.79, status: 'on-route', mission: 'M-1236', vendor: 'Water Systems' },
  { id: 'T004', lat: 1.33, lng: 36.77, status: 'completed', mission: 'M-1237', vendor: 'BuildEx' },
  { id: 'T005', lat: 1.31, lng: 36.84, status: 'on-route', mission: 'M-1238', vendor: 'Global Foods' },
];

interface MapControlsProps {
  onRefresh: () => void;
  isLoading: boolean;
}

const MapControls = ({ onRefresh, isLoading }: MapControlsProps) => (
  <div className="absolute top-4 right-4 z-10 flex gap-2">
    <Button 
      variant="secondary" 
      className="bg-white/90 backdrop-blur-sm shadow-md" 
      onClick={onRefresh}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
    </Button>
    <Button className="bg-white/90 backdrop-blur-sm shadow-md text-black hover:text-white">
      Center Map
    </Button>
  </div>
);

const LiveTrackingMapPlaceholder = () => (
  <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg">
    <div className="text-center">
      <Loader2 className="h-10 w-10 text-muted-foreground/50 animate-spin mx-auto mb-4" />
      <p className="text-muted-foreground">Loading map data...</p>
      <p className="text-xs text-muted-foreground/70 mt-2">
        Note: This is a placeholder. In production, integrate with Mapbox or Google Maps API.
      </p>
    </div>
  </div>
);

const TruckMarkers = () => (
  <div className="absolute inset-0 z-0">
    {MOCK_LOCATIONS.map((truck) => (
      <div 
        key={truck.id}
        className={`absolute h-3 w-3 rounded-full animate-pulse ${
          truck.status === 'on-route' ? 'bg-green-500' : 
          truck.status === 'delayed' ? 'bg-amber-500' : 'bg-blue-500'
        }`}
        style={{ 
          left: `${(truck.lng - 36.75) * 200 + 100}px`, 
          top: `${(truck.lat - 1.25) * 200 + 100}px`
        }}
        title={`${truck.id} - ${truck.mission} (${truck.vendor})`}
      />
    ))}
  </div>
);

const LiveTrackingMap = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    // Initial loading effect
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <Card className="hover-scale">
      <CardHeader>
        <CardTitle>Live Tracking Map</CardTitle>
        <CardDescription>
          Real-time location of all active missions and trucks
        </CardDescription>
      </CardHeader>
      <CardContent className="relative h-72 md:h-80 p-0 overflow-hidden rounded-b-lg">
        <MapControls onRefresh={handleRefresh} isLoading={isLoading} />
        
        {isLoading ? (
          <LiveTrackingMapPlaceholder />
        ) : (
          <div className="relative h-full bg-gray-100/80 rounded-b-lg">
            {/* Placeholder map with grid lines */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="border border-gray-200/50" />
              ))}
            </div>
            
            {/* Mock roads */}
            <div className="absolute inset-0">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300/70 transform -translate-y-1/2" />
              <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-300/70 transform -translate-x-1/2" />
              <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-gray-200/50 transform -translate-y-1/2" />
              <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-gray-200/50 transform -translate-y-1/2" />
              <div className="absolute top-0 bottom-0 left-1/4 w-0.5 bg-gray-200/50 transform -translate-x-1/2" />
              <div className="absolute top-0 bottom-0 left-3/4 w-0.5 bg-gray-200/50 transform -translate-x-1/2" />
            </div>
            
            <TruckMarkers />
            
            <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
              Showing 5 active trucks
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveTrackingMap;
