export interface InterviewState {
  domain: string;
  role: string;
  experience: string;
  resumeText?: string;
}

export interface Question {
  id: number;
  text: string;
  type: 'technical' | 'behavioral';
  difficulty: 'easy' | 'medium' | 'hard';
  answer?: string;
}

export interface FeedbackData {
  overallScore: string;
  technicalLevel: string;
  strength: string;
  areasOfImprovement: string;
  weakness: string;
  detailedScores: {
    technicalScore: number;
    communicationScore: number;
    completenessScore: number;
    exampleScore: number;
    structureScore: number;
  };
}