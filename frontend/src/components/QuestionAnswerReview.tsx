import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, Loader2 } from 'lucide-react';
import { ApiService } from '../services/api';

interface QAReviewProps {
  questions: { question: string }[];
  answers: { question: string; answer: string }[];
}

// Helper function to format text with markdown-style formatting
const formatText = (text: string) => {
  return text
    .split('\n')
    .map((line, index) => {
      // Bold text (**text**)
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Italic text (*text*)
      line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      // Bullet points
      if (line.trim().startsWith('* ')) {
        return `<li>${line.substring(2)}</li>`;
      }
      
      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        return `<li>${line.replace(/^\d+\.\s/, '')}</li>`;
      }

      return line;
    })
    .join('\n');
};

export const QuestionAnswerReview: React.FC<QAReviewProps> = ({ questions, answers }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [idealAnswers, setIdealAnswers] = useState<{ [key: number]: string }>({});
  const [loadingIdealAnswer, setLoadingIdealAnswer] = useState<number | null>(null);

  const getIdealAnswer = async (question: string, answer: string, index: number) => {
    try {
      setLoadingIdealAnswer(index);
      const response = await ApiService.getIdealAnswer(question, answer);
      setIdealAnswers(prev => ({
        ...prev,
        [index]: response
      }));
    } catch (error) {
      console.error('Error fetching ideal answer:', error);
    } finally {
      setLoadingIdealAnswer(null);
    }
  };

  return (
    <div className="space-y-4">
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
                <div 
                  className="text-teal-900"
                  dangerouslySetInnerHTML={{ __html: formatText(answer.question) }}
                />
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-teal-700 mb-2">Your Answer:</h4>
                <div 
                  className="text-teal-900 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: formatText(answer.answer) }}
                />
              </div>

              {!idealAnswers[index] ? (
                <button
                  onClick={() => getIdealAnswer(answer.question, answer.answer, index)}
                  disabled={loadingIdealAnswer === index}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-yellow-700 
                    bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingIdealAnswer === index ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Getting ideal answer...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="h-4 w-4" />
                      Get Ideal Answer
                    </>
                  )}
                </button>
              ) : (
                <div className="mt-4 bg-yellow-50/50 rounded-lg p-4 border border-yellow-200">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Analysis & Ideal Answer
                  </h4>
                  <div className="space-y-3">
                    {idealAnswers[index].split('\n\n').map((section, idx) => (
                      <div
                        key={idx}
                        className="text-sm text-yellow-900 whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: formatText(section) }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionAnswerReview;