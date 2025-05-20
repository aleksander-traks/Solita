import React, { useState } from 'react';
import { SearchIcon, Filter } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import ContentCard from '../components/content/ContentCard';

const ContentFeed: React.FC = () => {
  const { contents } = useContent();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'questions' | 'stories'>('all');
  
  // Filter and search contents
  const filteredContents = contents.filter(content => {
    // Apply type filter
    if (filter === 'questions' && content.type !== 'question') return false;
    if (filter === 'stories' && content.type !== 'story') return false;
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        content.title.toLowerCase().includes(query) ||
        content.body.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <header className="bg-white border-b border-neutral-200 p-4 sticky top-0 z-10">
        <h1 className="text-xl font-semibold mb-3">Stories & Questions</h1>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={18} className="text-neutral-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stories and questions..."
            className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div className="flex mt-3 space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
              filter === 'all'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('questions')}
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
              filter === 'questions'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Questions
          </button>
          <button
            onClick={() => setFilter('stories')}
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
              filter === 'stories'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Stories
          </button>
        </div>
      </header>
      
      <div className="p-4">
        {filteredContents.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-neutral-500">No stories or questions found</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-emerald-600"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContents.map(content => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentFeed;