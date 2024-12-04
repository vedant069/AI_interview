export interface InterviewState {
  domain: string;
  role: string;
  experience: string;
  resumeText?: string;
  isCustomJob: boolean;
  jobDescription: string;
  questionCount: number;
}

export interface Question {
  id: number;
  question: string;  // Changed from text to question to match usage
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