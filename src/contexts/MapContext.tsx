import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Location } from '../types';

interface MapContextProps {
  map: google.maps.Map | null;
  initMap: (
    element: HTMLElement, 
    center: Location,
    options?: Partial<google.maps.MapOptions>
  ) => Promise<google.maps.Map>;
}

const MapContext = createContext<MapContextProps | null>(null);

interface MapProviderProps {
  children: ReactNode;
}

export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  const loadGoogleMapsScript = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if Google Maps API is already loaded and initialized
      if (window.google?.maps?.Map) {
        resolve();
        return;
      }

      // Remove any existing Google Maps scripts to prevent duplicates
      const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com/maps/api"]');
      existingScripts.forEach(script => script.remove());
      
      // Create a script element to load the Google Maps API
      const script = document.createElement('script');
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        reject(new Error('Google Maps API key is not configured'));
        return;
      }
      
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.addEventListener('load', () => resolve());
      script.addEventListener('error', (e) => reject(e));
      
      document.head.appendChild(script);
    });
  }, []);
  
  const initMap = useCallback(
    async (
      element: HTMLElement, 
      center: Location,
      options?: Partial<google.maps.MapOptions>
    ): Promise<google.maps.Map> => {
      try {
        // Load Google Maps script if not loaded
        await loadGoogleMapsScript();
        
        // Create a new map instance
        const mapInstance = new window.google.maps.Map(element, {
          center,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          ...options
        });
        
        setMap(mapInstance);
        return mapInstance;
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
        throw error;
      }
    },
    [loadGoogleMapsScript]
  );

  // Cleanup map instance when provider unmounts
  useEffect(() => {
    return () => {
      if (map) {
        // Remove all event listeners
        google.maps.event.clearInstanceListeners(map);
        // Clear the map
        setMap(null);
      }
    };
  }, [map]);
  
  return (
    <MapContext.Provider value={{ map, initMap }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = (): MapContextProps => {
  const context = useContext(MapContext);
  
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  
  return context;
};