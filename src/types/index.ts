export interface Location {
  lat: number;
  lng: number;
}

export interface Content {
  id: string;
  type: 'question' | 'story';
  title: string;
  body: string;
  location: Location;
  locationName?: string;
  image?: string | null;
  author: string;
  anonymous: boolean;
  answers: number;
  likes: number;
  createdAt: string;
  questionId?: string; // For stories that are answers to questions
}

export interface CreateQuestionData {
  title: string;
  body?: string;
  location: Location;
  image?: string | null;
}

export interface CreateStoryData {
  title: string;
  body: string;
  location?: Location;
  image?: string | null;
  questionId?: string;
  anonymous?: boolean;
}