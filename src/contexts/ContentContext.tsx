import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Content, Location, CreateQuestionData, CreateStoryData } from '../types';
import { mockContents } from '../data/mockContents';

interface ContentContextProps {
  contents: Content[];
  addQuestion: (data: CreateQuestionData) => Promise<Content>;
  addStory: (data: CreateStoryData) => Promise<Content>;
  getAnswersForContent: (contentId: string) => Content[];
}

const ContentContext = createContext<ContentContextProps | null>(null);

interface ContentProviderProps {
  children: ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const [contents, setContents] = useState<Content[]>(mockContents);
  
  const addQuestion = useCallback(async (data: CreateQuestionData): Promise<Content> => {
    const newQuestion: Content = {
      id: uuidv4(),
      type: 'question',
      title: data.title,
      body: data.body || '',
      location: data.location,
      locationName: 'Custom Location', // In a real app, we would reverse geocode this
      image: data.image,
      author: 'User',
      anonymous: false,
      answers: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
    };
    
    setContents(prev => [newQuestion, ...prev]);
    return newQuestion;
  }, []);
  
  const addStory = useCallback(async (data: CreateStoryData): Promise<Content> => {
    const newStory: Content = {
      id: uuidv4(),
      type: 'story',
      title: data.title,
      body: data.body,
      location: data.location || { lat: 0, lng: 0 },
      locationName: 'Custom Location', // In a real app, we would reverse geocode this
      image: data.image,
      author: 'User',
      anonymous: data.anonymous || false,
      answers: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
      questionId: data.questionId,
    };
    
    setContents(prev => {
      // If this is an answer to a question, increment the question's answer count
      if (data.questionId) {
        return prev.map(content => {
          if (content.id === data.questionId) {
            return {
              ...content,
              answers: content.answers + 1,
            };
          }
          return content;
        });
      }
      return prev;
    });
    
    setContents(prev => [newStory, ...prev]);
    return newStory;
  }, []);
  
  const getAnswersForContent = useCallback((contentId: string): Content[] => {
    return contents.filter(content => 
      content.type === 'story' && content.questionId === contentId
    );
  }, [contents]);
  
  return (
    <ContentContext.Provider value={{ 
      contents, 
      addQuestion, 
      addStory,
      getAnswersForContent,
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = (): ContentContextProps => {
  const context = useContext(ContentContext);
  
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  
  return context;
};