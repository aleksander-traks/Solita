import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, HelpCircle } from 'lucide-react';
import GoogleMap from '../components/map/GoogleMap';
import { useUserLocation } from '../contexts/UserLocationContext';
import { useContent } from '../contexts/ContentContext';
import ContentPreview from '../components/content/ContentPreview';

const MapView: React.FC = () => {
  const navigate = useNavigate();
  const { userLocation, getCurrentLocation } = useUserLocation();
  const { contents } = useContent();
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handlePinClick = (id: string) => {
    setSelectedContent(id);
    setShowPreview(true);
  };

  const handleWhatHappenedHere = () => {
    getCurrentLocation();
    navigate('/create-question');
  };

  const closePreview = () => {
    setShowPreview(false);
    setSelectedContent(null);
  };

  const viewContentDetails = (id: string) => {
    navigate(`/content/${id}`);
  };

  const selectedContentItem = selectedContent
    ? contents.find(item => item.id === selectedContent)
    : null;

  return (
    <div className="relative h-screen w-full">
      {/* Map container debug wrapper */}
      <div className="w-full h-full border-4 border-red-500">
        <GoogleMap onPinClick={handlePinClick} />
      </div>

      {/* Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
        <button
          onClick={() => getCurrentLocation()}
          className="bg-white p-3 rounded-full shadow-md text-neutral-700 hover:bg-neutral-100"
        >
          <Compass size={24} />
        </button>

        <button
          onClick={handleWhatHappenedHere}
          className="bg-emerald-600 text-white px-4 py-2 rounded-full shadow-md flex items-center space-x-2 hover:bg-emerald-700 transition-colors"
        >
          <HelpCircle size={20} />
          <span className="font-medium">What happened here?</span>
        </button>
      </div>

      {/* Content preview */}
      {showPreview && selectedContentItem && (
        <div className="absolute bottom-24 left-4 right-4 z-10">
          <ContentPreview
            content={selectedContentItem}
            onClose={closePreview}
            onViewDetails={() => viewContentDetails(selectedContentItem.id)}
          />
        </div>
      )}
    </div>
  );
};

export default MapView;