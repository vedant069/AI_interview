import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface QAReviewProps {
  questions: { question: string }[];
  answers: { question: string; answer: string }[];
}

export const QuestionAnswerReview: React.FC<QAReviewProps> = ({ questions, answers }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-2xl font-bold text-teal-900 mb-6">Review Your Answers</h3>
      
      {answers.map((answer, index) => (
        <div 
          key={index}
          className="bg-white/80 backdrop-blur rounded-xl border border-yellow-200 overflow-hidden transition-all duration-300"
        >
          <button
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-yellow-50/50 transition-colors"
          >
            <span className="font-medium text-teal-900">
              Question {index + 1}
            </span>
            {expandedIndex === index ? (
              <ChevronUp className="h-5 w-5 text-teal-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-teal-600" />
            )}
          </button>
          
          {expandedIndex === index && (
            <div className="px-6 py-4 border-t border-yellow-200/50">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-teal-700 mb-2">Question:</h4>
                <p className="text-teal-900">{answer.question}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-teal-700 mb-2">Your Answer:</h4>
                <p className="text-teal-900 whitespace-pre-wrap">{answer.answer}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};