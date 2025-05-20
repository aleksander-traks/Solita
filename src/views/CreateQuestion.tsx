import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserLocation } from '../contexts/UserLocationContext';
import { useContent } from '../contexts/ContentContext';
import { ButtonLoader } from '../components/ui/Loader';
import LocationPicker from '../components/form/LocationPicker';

const CreateQuestion: React.FC = () => {
  const navigate = useNavigate();
  const { userLocation } = useUserLocation();
  const { addQuestion } = useContent();
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [location, setLocation] = useState(userLocation);
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  
  // Update location when user location changes if using current location
  useEffect(() => {
    if (useCurrentLocation && userLocation) {
      setLocation(userLocation);
    }
  }, [userLocation, useCurrentLocation]);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) return;
    
    setSubmitting(true);
    
    try {
      await addQuestion({
        title,
        body,
        location,
        image,
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to create question:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const toggleLocationPicker = () => {
    setShowLocationPicker(!showLocationPicker);
    if (showLocationPicker) {
      setUseCurrentLocation(false);
    }
  };
  
  if (showLocationPicker) {
    return (
      <LocationPicker
        initialLocation={location}
        onSelectLocation={(loc) => {
          setLocation(loc);
          setUseCurrentLocation(false);
          setShowLocationPicker(false);
        }}
        onCancel={() => setShowLocationPicker(false)}
      />
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-neutral-200 p-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="text-neutral-600"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">Ask a Question</h1>
        <div className="w-6"></div>
      </header>
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Add a photo (optional)
          </label>
          <div className="relative">
            {image ? (
              <div className="relative">
                <img 
                  src={image} 
                  alt="Uploaded preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center w-full h-48 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer bg-neutral-50 hover:bg-neutral-100">
                <div className="flex flex-col items-center">
                  <Camera size={32} className="text-neutral-400" />
                  <span className="mt-2 text-sm text-neutral-500">Upload an image</span>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
              </label>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
            Your Question*
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., What's the story behind this statue?"
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="body" className="block text-sm font-medium text-neutral-700 mb-1">
            Additional Details (optional)
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add any additional context to your question..."
            rows={4}
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Location*
          </label>
          <button
            type="button"
            onClick={toggleLocationPicker}
            className="flex items-center space-x-2 w-full p-3 border border-neutral-300 rounded-lg text-left"
          >
            <MapPin size={18} className="text-emerald-600" />
            <span>
              {useCurrentLocation 
                ? 'Using your current location' 
                : 'Custom location selected'}
            </span>
          </button>
          {!useCurrentLocation && (
            <button
              type="button"
              onClick={() => {
                setUseCurrentLocation(true);
                setLocation(userLocation);
              }}
              className="mt-2 text-sm text-emerald-600"
            >
              Use my current location instead
            </button>
          )}
        </div>
        
        <button
          type="submit"
          disabled={submitting || !title || !location}
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 disabled:bg-emerald-300 flex items-center justify-center"
        >
          {submitting ? <ButtonLoader /> : 'Post Question'}
        </button>
      </form>
    </div>
  );
};

export default CreateQuestion;