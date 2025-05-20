import React from 'react';
import { X, MessageCircle, ChevronRight } from 'lucide-react';
import { Content } from '../../types';
import { formatDistanceToNow } from '../../utils/formatters';

interface ContentPreviewProps {
  content: Content;
  onClose: () => void;
  onViewDetails: () => void;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ 
  content, 
  onClose,
  onViewDetails,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 animate-slide-up">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span className={`w-3 h-3 rounded-full ${content.type === 'question' ? 'bg-neutral-500' : 'bg-emerald-500'} mr-2`}></span>
          <span className="font-medium text-sm text-neutral-500 capitalize">{content.type}</span>
        </div>
        <button 
          onClick={onClose}
          className="text-neutral-400 hover:text-neutral-600"
        >
          <X size={20} />
        </button>
      </div>
      
      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{content.title}</h3>
      
      <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
        {content.body}
      </p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm text-neutral-500">
          <MessageCircle size={16} className="mr-1" />
          <span>{content.answers} {content.answers === 1 ? 'answer' : 'answers'}</span>
          <span className="mx-2">•</span>
          <span>{formatDistanceToNow(content.createdAt)}</span>
        </div>
        
        <button 
          onClick={onViewDetails}
          className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm font-medium flex items-center hover:bg-emerald-100 transition-colors"
        >
          View
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ContentPreview;