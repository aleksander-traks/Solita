import React, { useState } from 'react';
import { ArrowLeft, Camera, MapPin, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserLocation } from '../contexts/UserLocationContext';
import { useContent } from '../contexts/ContentContext';
import { ButtonLoader } from '../components/ui/Loader';
import LocationPicker from '../components/form/LocationPicker';
import { Content } from '../types';

const CreateStory: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userLocation } = useUserLocation();
  const { addStory } = useContent();
  
  // Get question ID if answering a specific question
  const questionId = location.state?.questionId as string | undefined;
  const questionData = location.state?.questionData as Content | undefined;
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [storyLocation, setStoryLocation] = useState(userLocation);
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  
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
    if (!title || !body || !storyLocation) return;
    
    setSubmitting(true);
    
    try {
      await addStory({
        title,
        body,
        location: storyLocation,
        image,
        questionId,
        anonymous,
      });
      
      // Navigate to the question page if answering a question
      if (questionId) {
        navigate(`/content/${questionId}`);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to create story:', error);
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
        initialLocation={storyLocation}
        onSelectLocation={(loc) => {
          setStoryLocation(loc);
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
        <h1 className="text-lg font-semibold">
          {questionId ? 'Answer Question' : 'Share a Story'}
        </h1>
        <div className="w-6"></div>
      </header>
      
      {questionData && (
        <div className="p-4 bg-neutral-50 border-b border-neutral-200">
          <p className="text-sm text-neutral-500 mb-1">Answering:</p>
          <h2 className="font-medium">{questionData.title}</h2>
        </div>
      )}
      
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
            Title*
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={questionId ? "Title your answer" : "Name your story"}
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="body" className="block text-sm font-medium text-neutral-700 mb-1">
            Your Story*
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={questionId ? "Share your answer..." : "Tell your story..."}
            rows={6}
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>
        
        {!questionId && (
          <div className="mb-4">
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
                  setStoryLocation(userLocation);
                }}
                className="mt-2 text-sm text-emerald-600"
              >
                Use my current location instead
              </button>
            )}
          </div>
        )}
        
        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="anonymous"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-neutral-300 rounded"
          />
          <label htmlFor="anonymous" className="ml-2 block text-sm text-neutral-700">
            Post anonymously
          </label>
        </div>
        
        <button
          type="submit"
          disabled={submitting || !title || !body || (!questionId && !storyLocation)}
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 disabled:bg-emerald-300 flex items-center justify-center"
        >
          {submitting ? <ButtonLoader /> : questionId ? 'Post Answer' : 'Share Story'}
        </button>
      </form>
    </div>
  );
};

export default CreateStory;