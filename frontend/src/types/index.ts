import { DOMAINS, ROLES } from '../utils/constants';

export type Domain = typeof DOMAINS[number];
export type Role = typeof ROLES[keyof typeof ROLES][number];

export interface Question {
  question: string;
}

export interface InterviewState {
  domain: string;
  role: string;
  experience: string;
  isCustomJob: boolean;
  jobDescription: string;
  questionCount: number;
  resumeText: string;
}

export interface FeedbackData {
  strength: string;
  areasOfImprovement: string;
  weakness: string;
  overallScore: string;
}