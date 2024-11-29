import React, { useState, useEffect } from 'react';
import { InterviewSetup } from './InterviewSetup';
import { Interview } from './Interview';
import { Feedback } from './Feedback';
import { Question, InterviewState, FeedbackData } from '../types';
import { BrainCircuit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api';

const GeometricShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
    <div className="absolute top-1/3 right-1/4 w-32 h-32 border border-yellow-500/20 rounded-full" />
  </div>
);

export const InterviewDashboard: React.FC = () => {
  const [step, setStep] = useState<'setup' | 'interview' | 'feedback'>('setup');
  const [domains, setDomains] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [interviewState, setInterviewState] = useState<InterviewState>({
    domain: '',
    role: '',
    experience: '',
    isCustomJob: false,
    jobDescription: '',
    questionCount: 5,
    resumeText: '',
  });

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await ApiService.getDomains();
        setDomains(response);
      } catch (error) {
        console.error('Error fetching domains:', error);
      }
    };
    fetchDomains();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      if (interviewState.domain) {
        try {
          const response = await ApiService.getRoles(interviewState.domain);
          setRoles(response);
        } catch (error) {
          console.error('Error fetching roles:', error);
        }
      } else {
        setRoles([]);
      }
    };
    fetchRoles();
  }, [interviewState.domain]);

  const handleInterviewSetup = async () => {
    try {
      const response = await ApiService.generateQuestions(interviewState);
      setQuestions(response);
      setStep('interview');
    } catch (error) {
      console.error('Error generating questions:', error);
    }
  };

  const handleInterviewComplete = (feedbackData: FeedbackData) => {
    setFeedback(feedbackData);
    setStep('feedback');
  };

  const handleRestart = () => {
    setInterviewState({
      domain: '',
      role: '',
      experience: '',
      isCustomJob: false,
      jobDescription: '',
      questionCount: 5,
      resumeText: '',
    });
    setQuestions([]);
    setFeedback(null);
    setStep('setup');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <GeometricShapes />
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center mb-8 backdrop-blur-sm bg-black/30 p-6 rounded-lg border border-gray-800">
          <div className="flex items-center">
            <BrainCircuit className="h-8 w-8 text-yellow-400" />
            <h1 className="ml-3 text-2xl font-bold font-mono">
              Interview Preparation Assistant
            </h1>
          </div>
          <div className="flex items-center">
            <span className="text-gray-400 mr-4">
              {currentUser?.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium bg-yellow-400 text-black rounded-md 
                hover:bg-yellow-300 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="backdrop-blur-sm bg-black/30 rounded-lg border border-gray-800 
          hover:border-yellow-500/30 transition-all p-6 md:p-8">
          {step === 'setup' && (
            <InterviewSetup
              state={interviewState}
              onChange={updates => setInterviewState({ ...interviewState, ...updates })}
              onSubmit={handleInterviewSetup}
              domains={domains}
              roles={roles}
            />
          )}

          {step === 'interview' && questions.length > 0 && (
            <Interview
              questions={questions}
              onComplete={handleInterviewComplete}
            />
          )}

          {step === 'feedback' && feedback && (
            <Feedback
              feedback={feedback}
              onRestart={handleRestart}
            />
          )}
        </div>
      </div>
    </div>
  );
};