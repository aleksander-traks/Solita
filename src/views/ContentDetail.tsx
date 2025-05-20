import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, MapPin, Heart, Share } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { Content } from '../types';
import { formatDate } from '../utils/formatters';
import StoryCard from '../components/content/StoryCard';

const ContentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { contents, getAnswersForContent } = useContent();
  const [content, setContent] = useState<Content | null>(null);
  const [answers, setAnswers] = useState<Content[]>([]);
  const [liked, setLiked] = useState(false);
  
  useEffect(() => {
    if (id) {
      const foundContent = contents.find(c => c.id === id);
      if (foundContent) {
        setContent(foundContent);
        setAnswers(getAnswersForContent(id));
      }
    }
  }, [id, contents, getAnswersForContent]);
  
  const handleAnswerClick = () => {
    if (content) {
      navigate('/create-story', { 
        state: { 
          questionId: content.id,
          questionData: content
        } 
      });
    }
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: content?.title,
          text: content?.body,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing content:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  
  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Content not found</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <header className="bg-white border-b border-neutral-200 p-4 sticky top-0 z-10 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="text-neutral-600 mr-2"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">
          {content.type === 'question' ? 'Question' : 'Story'}
        </h1>
      </header>
      
      <div className="p-4 bg-white mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full ${content.type === 'question' ? 'bg-neutral-500' : 'bg-emerald-500'} mr-2`}></span>
            <span className="font-medium text-sm text-neutral-500 capitalize">{content.type}</span>
          </div>
          {content.anonymous ? (
            <span className="text-sm text-neutral-400">Anonymous</span>
          ) : (
            <span className="text-sm text-neutral-400">{content.author}</span>
          )}
        </div>
        
        <h2 className="text-xl font-semibold mb-3">{content.title}</h2>
        
        {content.image && (
          <div className="mb-4">
            <img 
              src={content.image} 
              alt={content.title} 
              className="w-full h-56 object-cover rounded-lg"
            />
          </div>
        )}
        
        <p className="text-neutral-700 mb-4 whitespace-pre-line">
          {content.body}
        </p>
        
        <div className="flex items-center text-sm text-neutral-500 mb-4">
          <MapPin size={16} className="mr-1" />
          <span>{content.locationName || 'Location'}</span>
          <span className="mx-1">•</span>
          <span>{formatDate(content.createdAt)}</span>
        </div>
        
        <div className="flex justify-between border-t border-neutral-100 pt-3">
          <button 
            onClick={() => setLiked(!liked)}
            className={`flex items-center ${liked ? 'text-red-500' : 'text-neutral-500'}`}
          >
            <Heart size={20} className={liked ? 'fill-red-500' : ''} />
            <span className="ml-1">{content.likes + (liked ? 1 : 0)}</span>
          </button>
          
          <button 
            onClick={handleShare}
            className="flex items-center text-neutral-500"
          >
            <Share size={20} />
            <span className="ml-1">Share</span>
          </button>
          
          {content.type === 'question' && (
            <button 
              onClick={handleAnswerClick}
              className="flex items-center text-emerald-600"
            >
              <MessageCircle size={20} />
              <span className="ml-1">Answer</span>
            </button>
          )}
        </div>
      </div>
      
      {content.type === 'question' && (
        <div className="px-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">
              Answers ({answers.length})
            </h3>
            {answers.length > 0 && (
              <button 
                onClick={handleAnswerClick}
                className="text-sm text-emerald-600 font-medium"
              >
                Add your answer
              </button>
            )}
          </div>
          
          {answers.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center">
              <MessageCircle size={32} className="mx-auto mb-2 text-neutral-300" />
              <p className="text-neutral-500 mb-4">No answers yet</p>
              <button
                onClick={handleAnswerClick}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700"
              >
                Be the first to answer
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {answers.map(answer => (
                <StoryCard key={answer.id} story={answer} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentDetail;