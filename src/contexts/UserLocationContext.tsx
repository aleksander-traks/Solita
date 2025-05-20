import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Location } from '../types';

interface UserLocationContextProps {
  userLocation: Location | null;
  locationError: string | null;
  getCurrentLocation: () => Promise<Location | null>;
  isLoading: boolean;
}

const UserLocationContext = createContext<UserLocationContextProps | null>(null);

interface UserLocationProviderProps {
  children: ReactNode;
}

export const UserLocationProvider: React.FC<UserLocationProviderProps> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const getCurrentLocation = useCallback(async (): Promise<Location | null> => {
    setIsLoading(true);
    setLocationError(null);
    
    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }
      
      // Get current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });
      
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      
      setUserLocation(newLocation);
      setIsLoading(false);
      return newLocation;
    } catch (error) {
      let errorMessage = 'Failed to get your location';
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access was denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get your location timed out.';
            break;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setLocationError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, []);
  
  // Get user location on initial load
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);
  
  return (
    <UserLocationContext.Provider value={{ 
      userLocation, 
      locationError, 
      getCurrentLocation,
      isLoading
    }}>
      {children}
    </UserLocationContext.Provider>
  );
};

export const useUserLocation = (): UserLocationContextProps => {
  const context = useContext(UserLocationContext);
  
  if (!context) {
    throw new Error('useUserLocation must be used within a UserLocationProvider');
  }
  
  return context;
};