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
    <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />
    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
    <div className="absolute top-1/3 right-1/4 w-32 h-32 border border-yellow-400/30 rounded-full" />
    <div className="absolute bottom-1/4 left-1/3 w-48 h-48 border border-teal-400/20 rotate-45" />
    <div className="absolute top-20 left-20 w-24 h-24 bg-yellow-400/20" 
      style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} />
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
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-teal-50 relative overflow-hidden">
      <GeometricShapes />
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <BrainCircuit className="h-6 w-6 text-teal-900" />
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 border-2 border-teal-500/30 rounded-full" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-2 border-yellow-400/30 rotate-45" />
              </div>
              <h1 className="ml-3 text-2xl font-bold font-mono text-teal-900">
                Interview Preparation Assistant
              </h1>
            </div>
            <div className="flex items-center">
              <span className="text-teal-700 mr-4">
                {currentUser?.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-6 py-2 text-sm font-medium bg-yellow-400 text-teal-900 rounded-full 
                  hover:bg-yellow-300 transition-all duration-200 transform hover:scale-[1.02]
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 focus:ring-offset-white
                  shadow-lg hover:shadow-yellow-200"
              >
                Logout
              </button>
            </div>
          </div>

          <main className="mt-8">
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
          </main>
        </div>
      </div>
    </div>
  );
};