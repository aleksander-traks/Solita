import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, MapPin } from 'lucide-react';
import { Content } from '../../types';
import { formatDistanceToNow } from '../../utils/formatters';

interface ContentCardProps {
  content: Content;
}

const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/content/${content.id}`);
  };
  
  return (
    <div 
      className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span className={`w-3 h-3 rounded-full ${content.type === 'question' ? 'bg-neutral-500' : 'bg-emerald-500'} mr-2`}></span>
          <span className="font-medium text-sm text-neutral-500 capitalize">{content.type}</span>
        </div>
        {content.anonymous ? (
          <span className="text-xs text-neutral-400">Anonymous</span>
        ) : (
          <span className="text-xs text-neutral-400">{content.author}</span>
        )}
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{content.title}</h3>
      
      {content.image && (
        <div className="mb-3">
          <img 
            src={content.image} 
            alt={content.title} 
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
      )}
      
      <p className="text-neutral-600 text-sm mb-3 line-clamp-3">
        {content.body}
      </p>
      
      <div className="flex justify-between items-center text-sm text-neutral-500">
        <div className="flex items-center">
          <MessageCircle size={16} className="mr-1" />
          <span>{content.answers} {content.answers === 1 ? 'answer' : 'answers'}</span>
        </div>
        
        <div className="flex items-center">
          <MapPin size={16} className="mr-1" />
          <span>{content.locationName || 'Location'}</span>
          <span className="mx-1">•</span>
          <span>{formatDistanceToNow(content.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;