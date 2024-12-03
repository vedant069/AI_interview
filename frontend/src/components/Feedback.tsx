import React from 'react';
import { FeedbackData } from '../types';
import { Trophy, TrendingUp, AlertTriangle } from 'lucide-react';
import { QuestionAnswerReview } from './QuestionAnswerReview';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

interface FeedbackProps {
  feedback: FeedbackData;
  questions: { question: string }[];
  answers: { question: string; answer: string }[];
  onRestart: () => void;
}

export const Feedback: React.FC<FeedbackProps> = ({ 
  feedback, 
  questions,
  answers,
  onRestart 
}) => {
  const circumference = 2 * Math.PI * 40; // Circle radius of 40
  const offset = circumference - (feedback.overallScore / 100) * circumference;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getFeedbackBadge = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Interview Feedback</h2>
        
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="40"
                className="stroke-gray-200"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="40"
                className={`${getScoreColor(feedback.overallScore)} transition-all duration-1000 ease-out`}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className={`text-3xl font-bold ${getScoreColor(feedback.overallScore)}`}>
                {feedback.overallScore}%
              </span>
            </div>
          </div>
          <Badge 
            variant={feedback.overallScore >= 80 ? "default" : feedback.overallScore >= 60 ? "secondary" : "destructive"}
            className="mt-4"
          >
            {getFeedbackBadge(feedback.overallScore)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <Trophy className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-lg font-medium text-green-900">Strengths</h3>
              <p className="mt-2 text-sm text-green-700 text-center">{feedback.strength}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-medium text-blue-900">Areas to Improve</h3>
              <p className="mt-2 text-sm text-blue-700 text-center">{feedback.areasOfImprovement}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600 mb-4" />
              <h3 className="text-lg font-medium text-yellow-900">Watch Out For</h3>
              <p className="mt-2 text-sm text-yellow-700 text-center">{feedback.weakness}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-yellow-200">
        <CardContent className="pt-6">
          <QuestionAnswerReview questions={questions} answers={answers} />
        </CardContent>
      </Card>

      <button
        onClick={onRestart}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
          transition-colors duration-200"
      >
        Start New Interview
      </button>
    </div>
  );
};

export default Feedback;