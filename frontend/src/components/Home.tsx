import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Code, Layout, Users, Sparkles, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="relative">
      <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
        <BrainCircuit className="h-6 w-6 text-teal-900" />
      </div>
      <div className="absolute -right-1 -bottom-1 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
        <Users className="h-3 w-3 text-white" />
      </div>
    </div>
    <span className="text-xl font-bold text-teal-900">InterviewAI</span>
  </div>
);

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <Logo />
          <div className="space-x-4">
            {currentUser ? (
              <button
                onClick={() => navigate('/interview')}
                className="px-6 py-2 bg-yellow-400 text-teal-900 rounded-full hover:bg-yellow-300 transition-all"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 bg-teal-50 text-teal-900 rounded-full hover:bg-teal-100 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-6 py-2 bg-yellow-400 text-teal-900 rounded-full hover:bg-yellow-300 transition-all"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Hero Section */}
        <div className="mt-24 mb-16 text-center">
          <h1 className="text-5xl font-bold text-teal-900 mb-6">
            Master Your Interview Skills with
            <span className="text-yellow-500"> AI-Powered</span> Practice
          </h1>
          <p className="text-xl text-teal-700 mb-8 max-w-2xl mx-auto">
            Prepare for your dream job with personalized interview practice sessions,
            real-time feedback, and expert guidance.
          </p>
          {!currentUser && (
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-3 bg-yellow-400 text-teal-900 rounded-full hover:bg-yellow-300 
                  transition-all shadow-lg hover:shadow-yellow-200 font-medium"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-teal-50 text-teal-900 rounded-full hover:bg-teal-100 
                  transition-all shadow-lg hover:shadow-teal-200 font-medium"
              >
                Already have an account?
              </button>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-yellow-200">
            <Code className="h-8 w-8 text-yellow-500 mb-4" />
            <h3 className="text-xl font-medium mb-2 text-teal-900">Smart Feedback</h3>
            <p className="text-teal-700">
              Get instant, personalized feedback on your responses using advanced AI analysis.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-yellow-200">
            <Layout className="h-8 w-8 text-yellow-500 mb-4" />
            <h3 className="text-xl font-medium mb-2 text-teal-900">Custom Questions</h3>
            <p className="text-teal-700">
              Practice with questions tailored to your experience level and target role.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-yellow-200">
            <Users className="h-8 w-8 text-yellow-500 mb-4" />
            <h3 className="text-xl font-medium mb-2 text-teal-900">Progress Tracking</h3>
            <p className="text-teal-700">
              Monitor your improvement over time with detailed performance analytics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;