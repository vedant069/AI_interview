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
  