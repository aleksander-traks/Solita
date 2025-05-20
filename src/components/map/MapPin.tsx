import React, { useEffect, useState } from 'react';
import { useMap } from '../../contexts/MapContext';
import { Location } from '../../types';

interface MapPinProps {
  id: string;
  position: Location;
  type: 'question' | 'story';
  answered?: boolean;
  onClick: () => void;
}

const MapPin: React.FC<MapPinProps> = ({ id, position, type, answered, onClick }) => {
  const { map } = useMap();
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  
  // Determine pin appearance based on type and answered status
  const getPinIcon = () => {
    if (type === 'question') {
      return {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: answered ? "#10B981" : "#6B7280", // Green if answered, gray if not
        fillOpacity: 0.9,
        strokeColor: "#FFFFFF",
        strokeWeight: 2,
      };
    } else {
      return {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#10B981", // Green for stories
        fillOpacity: 0.9,
        strokeColor: "#FFFFFF",
        strokeWeight: 2,
      };
    }
  };
  
  useEffect(() => {
    if (map) {
      // Create the marker
      const newMarker = new google.maps.Marker({
        position,
        map,
        icon: getPinIcon(),
        animation: google.maps.Animation.DROP,
      });
      
      // Add click listener
      const clickListener = newMarker.addListener('click', onClick);
      
      setMarker(newMarker);
      
      // Clean up marker when component unmounts
      return () => {
        if (newMarker) {
          // Remove the click listener first
          google.maps.event.removeListener(clickListener);
          // Then remove the marker from the map
          newMarker.setMap(null);
        }
      };
    }
  }, [map, position, type, answered, onClick]);
  
  // Update marker if type or answered status changes
  useEffect(() => {
    if (marker) {
      marker.setIcon(getPinIcon());
    }
  }, [type, answered, marker]);
  
  // This component doesn't render anything itself, it just manages the Google Maps marker
  return null;
};

export default MapPin;