import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useMap } from '../../contexts/MapContext';
import { Location } from '../../types';
import { Loader } from '../ui/Loader';

interface LocationPickerProps {
  initialLocation: Location | null;
  onSelectLocation: (location: Location) => void;
  onCancel: () => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  initialLocation,
  onSelectLocation,
  onCancel,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { map, initMap } = useMap();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(initialLocation);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  useEffect(() => {
    if (mapContainerRef.current && !map) {
      // Initialize map at the initial location or a default
      const location = initialLocation || { lat: 40.7128, lng: -74.0060 };
      initMap(mapContainerRef.current, location, {
        zoom: 16,
        draggable: true,
      }).then(() => {
        setMapLoaded(true);
      });
    } else if (map) {
      setMapLoaded(true);
    }
  }, [mapContainerRef, map, initMap, initialLocation]);
  
  useEffect(() => {
    if (map && mapLoaded) {
      // Add a marker that shows where the center of the map is
      const centerMarker = new google.maps.Marker({
        position: map.getCenter(),
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#10B981",
          fillOpacity: 0.9,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        },
        draggable: false,
      });
      
      // Update the marker position when the map is dragged
      map.addListener('center_changed', () => {
        const center = map.getCenter();
        if (center) {
          centerMarker.setPosition(center);
          setSelectedLocation({
            lat: center.lat(),
            lng: center.lng(),
          });
        }
      });
      
      return () => {
        google.maps.event.clearInstanceListeners(map);
        centerMarker.setMap(null);
      };
    }
  }, [map, mapLoaded]);
  
  const handleConfirm = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation);
    }
  };
  
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b border-neutral-200 p-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={onCancel}
          className="text-neutral-600"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">Select Location</h1>
        <div className="w-6"></div>
      </header>
      
      <div className="flex-1 relative">
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <Loader />
          </div>
        )}
        
        <div ref={mapContainerRef} className="h-full w-full"></div>
        
        {/* Center indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-600 flex items-center justify-center">
            <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-white border-t border-neutral-200">
        <p className="text-center text-neutral-600 mb-4">
          Pan and zoom the map to position the marker at your desired location
        </p>
        <button
          onClick={handleConfirm}
          disabled={!selectedLocation}
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 disabled:bg-emerald-300 flex items-center justify-center"
        >
          <Check size={20} className="mr-2" />
          Confirm Location
        </button>
      </div>
    </div>
  );
};

export default LocationPicker;