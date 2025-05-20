import React, { useEffect, useRef, useState } from 'react';
import { useMap } from '../../contexts/MapContext';
import { useUserLocation } from '../../contexts/UserLocationContext';
import { useContent } from '../../contexts/ContentContext';
import MapPin from './MapPin';
import { Loader } from '../ui/Loader';

interface GoogleMapProps {
  onPinClick: (id: string) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ onPinClick }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { map, initMap } = useMap();
  const { userLocation } = useUserLocation();
  const { contents } = useContent();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refReady, setRefReady] = useState(false);

  // Set refReady once the DOM ref is assigned
  useEffect(() => {
    if (mapContainerRef.current && !refReady) {
      console.log("[GoogleMap] Ref is now ready");
      setRefReady(true);
    }
  }, [mapContainerRef]);

  // Initialize map after ref becomes available
  useEffect(() => {
    let mounted = true;

    const initializeMap = async () => {
      const element = mapContainerRef.current;

      if (!element) {
        console.warn("[GoogleMap] mapContainerRef is null — skipping init");
        return;
      }

      if (map) {
        console.log("[GoogleMap] Map already exists");
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        const initialLocation = userLocation || { lat: 40.7128, lng: -74.0060 };
        console.log("[GoogleMap] Initializing map with:", initialLocation);
        await initMap(element, initialLocation);
        if (mounted) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('[GoogleMap] Failed to initialize map:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load map');
          setIsLoading(false);
        }
      }
    };

    if (refReady && !map) {
      initializeMap();
    }

    return () => {
      mounted = false;
    };
  }, [map, initMap, userLocation, refReady]);

  // Update map center and add user marker
  useEffect(() => {
    if (map && userLocation) {
      console.log("[GoogleMap] Updating center to userLocation:", userLocation);
      map.setCenter(userLocation);

      const userMarker = new window.google.maps.Marker({
        position: userLocation,
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        },
      });

      return () => {
        userMarker.setMap(null);
      };
    }
  }, [map, userLocation]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-neutral-100">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-neutral-100">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      className="h-full w-full border-4 border-blue-500"
      style={{ minHeight: '400px' }}
    >
      <div className="absolute z-10 text-sm bg-white text-black p-1">
        [Map container mounted]
      </div>
      {map && contents.map(content => (
        <MapPin 
          key={content.id}
          id={content.id}
          position={content.location}
          type={content.type}
          answered={content.type === 'question' ? content.answers > 0 : undefined}
          onClick={() => onPinClick(content.id)}
        />
      ))}
    </div>
  );
};

export default GoogleMap;