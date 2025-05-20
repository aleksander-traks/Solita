import React, { useState } from 'react';
import { Heart, Share } from 'lucide-react';
import { Content } from '../../types';
import { formatDate } from '../../utils/formatters';

interface StoryCardProps {
  story: Content;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  const [liked, setLiked] = useState(false);
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: story.body,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing story:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold">{story.title}</h4>
        {story.anonymous ? (
          <span className="text-xs text-neutral-400">Anonymous</span>
        ) : (
          <span className="text-xs text-neutral-400">{story.author}</span>
        )}
      </div>
      
      {story.image && (
        <div className="mb-3">
          <img 
            src={story.image} 
            alt={story.title} 
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
      )}
      
      <p className="text-neutral-700 text-sm mb-3 whitespace-pre-line">
        {story.body}
      </p>
      
      <div className="text-xs text-neutral-500 mb-3">
        {formatDate(story.createdAt)}
      </div>
      
      <div className="flex justify-between border-t border-neutral-100 pt-3">
        <button 
          onClick={() => setLiked(!liked)}
          className={`flex items-center ${liked ? 'text-red-500' : 'text-neutral-500'}`}
        >
          <Heart size={18} className={liked ? 'fill-red-500' : ''} />
          <span className="ml-1 text-sm">{story.likes + (liked ? 1 : 0)}</span>
        </button>
        
        <button 
          onClick={handleShare}
          className="flex items-center text-neutral-500"
        >
          <Share size={18} />
          <span className="ml-1 text-sm">Share</span>
        </button>
      </div>
    </div>
  );
};

export default StoryCard;