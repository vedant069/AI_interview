import React from 'react';
import { FeedbackData } from '../types';
import { Trophy, TrendingUp, AlertTriangle } from 'lucide-react';
import { QuestionAnswerReview } from './QuestionAnswerReview';

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
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Interview Feedback</h2>
        <p className="mt-2 text-lg text-gray-600">
          Overall Score: {feedback.overallScore}%
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-green-50 p-6 rounded-lg">
          <Trophy className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="text-lg font-medium text-green-900">Strengths</h3>
          <p className="mt-2 text-sm text-green-700">{feedback.strength}</p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <TrendingUp className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-medium text-blue-900">Areas to Improve</h3>
          <p className="mt-2 text-sm text-blue-700">{feedback.areasOfImprovement}</p>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg">
          <AlertTriangle className="h-8 w-8 text-yellow-600 mb-4" />
          <h3 className="text-lg font-medium text-yellow-900">Watch Out For</h3>
          <p className="mt-2 text-sm text-yellow-700">{feedback.weakness}</p>
        </div>
      </div>

      <QuestionAnswerReview questions={questions} answers={answers} />

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