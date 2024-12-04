import React, { useState, useEffect } from 'react';
import { InterviewSetup } from './InterviewSetup';
import { Interview } from './Interview';
import { Feedback } from './Feedback';
import { Question, InterviewState, FeedbackData } from '../types';
import { BrainCircuit, LogOut, User, History, PlusCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api';
import { InterviewHistory } from './InterviewHistory';

const GeometricShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />
    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
    <div className="absolute top-1/3 right-1/4 w-32 h-32 border border-yellow-400/30 rounded-full" />
    <div className="absolute bottom-1/4 left-1/3 w-48 h-48 border border-teal-400/20 rotate-45" />
  </div>
);

const Header: React.FC<{ userName: string; onLogout: () => void }> = ({ userName, onLogout }) => (
  <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-teal-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <BrainCircuit className="h-6 w-6 text-teal-900" />
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 border-2 border-teal-500/30 rounded-full" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-2 border-yellow-400/30 rotate-45" />
            </div>
            <h1 className="ml-3 text-2xl font-bold font-mono text-teal-900">
              Interview AI
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 px-4 py-2 bg-teal-50 rounded-full">
            <User className="h-5 w-5 text-teal-700" />
            <span className="text-teal-700 font-medium">
              {userName.split('@')[0]}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-6 py-2 text-sm font-medium bg-yellow-400 text-teal-900 rounded-full 
              hover:bg-yellow-300 transition-all duration-200 transform hover:scale-[1.02]
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 focus:ring-offset-white
              shadow-lg hover:shadow-yellow-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </header>
);

const Navigation: React.FC<{ view: string; onViewChange: (view: string) => void }> = ({ view, onViewChange }) => (
  <div className="flex justify-center space-x-4 mb-8">
    <button
      onClick={() => onViewChange('new')}
      className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-200 ${
        view === 'new'
          ? 'bg-yellow-400 text-teal-900 shadow-lg hover:bg-yellow-300'
          : 'bg-white text-teal-600 hover:bg-yellow-50'
      }`}
    >
      <PlusCircle className="h-5 w-5" />
      <span className="font-medium">New Interview</span>
    </button>
    <button
      onClick={() => onViewChange('history')}
      className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-200 ${
        view === 'history'
          ? 'bg-yellow-400 text-teal-900 shadow-lg hover:bg-yellow-300'
          : 'bg-white text-teal-600 hover:bg-yellow-50'
      }`}
    >
      <History className="h-5 w-5" />
      <span className="font-medium">View History</span>
    </button>
  </div>
);
export const InterviewDashboard: React.FC = () => {
  const [view, setView] = useState<string>('new');
  const [step, setStep] = useState<'setup' | 'interview' | 'feedback'>('setup');
  const [domains, setDomains] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [feedbackHistory, setFeedbackHistory] = useState<any[]>([]);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [interviewState, setInterviewState] = useState<InterviewState>({
    domain: '',
    role: '',
    experience: '',
    isCustomJob: false,
    jobDescription: '',
    questionCount: 5,
    resumeText: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser?.uid) {
        try {
          const [domainsData, historyData] = await Promise.all([
            ApiService.getDomains(),
            ApiService.getFeedbackHistory(currentUser.uid)
          ]);
          setDomains(domainsData);
          setFeedbackHistory(historyData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, [currentUser]);

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

  const handleInterviewComplete = async (
    feedbackData: FeedbackData,
    questions: Question[],
    submittedAnswers: { question: string; answer: string }[]
  ) => {
    setFeedback(feedbackData);
    setAnswers(submittedAnswers);

    if (currentUser?.uid) {
      try {
        await ApiService.saveFeedback(
          currentUser.uid,
          interviewState.domain,
          interviewState.role,
          feedbackData,
          questions,
          submittedAnswers
        );
        
        const history = await ApiService.getFeedbackHistory(currentUser.uid);
        setFeedbackHistory(history);
      } catch (error) {
        console.error('Error saving feedback:', error);
      }
    }

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
      resumeText: ''
    });
    setQuestions([]);
    setFeedback(null);
    setAnswers([]);
    setStep('setup');
    setView('new');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const renderContent = () => {
    if (view === 'history') {
      return <InterviewHistory feedbackHistory={feedbackHistory} />;
    }

    if (step === 'setup') {
      return (
        <InterviewSetup
          state={interviewState}
          onChange={updates => setInterviewState({ ...interviewState, ...updates })}
          onSubmit={handleInterviewSetup}
          domains={domains}
          roles={roles}
        />
      );
    }

    if (step === 'interview' && questions.length > 0) {
      return (
        <Interview
          questions={questions}
          onComplete={handleInterviewComplete}
        />
      );
    }

    if (step === 'feedback' && feedback) {
      return (
        <Feedback
          feedback={feedback}
          questions={questions}
          answers={answers}
          onRestart={handleRestart}
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-teal-50 relative overflow-hidden">
      <GeometricShapes />
      <Header 
        userName={currentUser?.email || ''} 
        onLogout={handleLogout}
      />
      
      <div className="relative z-10 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <main className="py-8">
            <Navigation view={view} onViewChange={setView} />
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};