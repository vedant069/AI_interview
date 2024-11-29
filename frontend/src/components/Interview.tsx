import React, { useState, useCallback, useEffect } from 'react';
import { Question } from '../types';
import { ApiService } from '../services/api';
import { ConversationSection } from './ConversationSection';
import { VideoSection } from './VideoSection';

interface InterviewProps {
  questions: Question[];
  onComplete: (feedback: any) => void;
}

export const Interview: React.FC<InterviewProps> = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));
  const [isListening, setIsListening] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTimeUp = useCallback(() => {
    setTimeExpired(true);
    if (isListening) {
      setIsListening(false);
    }
    handleSubmitAnswer();
  }, [isListening]);

  const handleSpeechResult = (text: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = text;
    setAnswers(newAnswers);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleSubmitAnswer = async () => {
    const currentAnswer = answers[currentQuestion];
    
    if (typeof currentAnswer !== 'string' || !currentAnswer.trim()) {
      setError("Answer cannot be empty.");
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);
      
      await ApiService.submitAnswer(currentAnswer.trim(), currentQuestion);

      if (currentQuestion === questions.length - 1) {
        const feedback = await ApiService.getFeedback();
        onComplete(feedback);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setTimeExpired(false);
      }
    } catch (error: any) {
      console.error('Error submitting answer:', error);
      setError(error.response?.data?.error || "Failed to submit your answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      setIsListening(false);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="flex-1 flex">
        <div className="grid grid-cols-2 w-full">
          {/* Left side - Conversation Section */}
          <div className="h-screen p-6 border-r border-gray-800">
            <div className="h-full">
              <ConversationSection
                currentQuestion={currentQuestion}
                questions={questions}
                answer={answers[currentQuestion] || ''}
                isListening={isListening}
                timeExpired={timeExpired}
                onAnswerChange={handleTextChange}
                onSubmit={handleSubmitAnswer}
                onTimeUp={handleTimeUp}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>

          {/* Right side - Video Section */}
          <div className="h-screen p-6">
            <div className="h-full">
              <VideoSection
                isListening={isListening}
                setIsListening={setIsListening}
              />
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default Interview;