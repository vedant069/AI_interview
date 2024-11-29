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
        <Logo />
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mt-32 mb-24">
          <div className="space-y-6 max-w-3xl">
            <div className="relative inline-block">
              <h1 className="text-6xl font-bold tracking-tight text-teal-900">
                Master Your Interviews with
                <span className="bg-gradient-to-r from-yellow-400 to-teal-500 bg-clip-text text-transparent"> AI-Powered</span> Practice
              </h1>
              <div className="absolute -right-8 top-0 w-16 h-16 border-4 border-yellow-400/30 rounded-full" />
            </div>
            
            <p className="text-xl text-teal-700">
              Elevate your interview skills with personalized AI coaching. Perfect for tech, business, and academic interviews.
            </p>

            <div className="flex gap-4 justify-center">
              {currentUser ? (
                <button
                  onClick={() => navigate('/interview')}
                  className="group px-8 py-4 bg-yellow-400 text-teal-900 font-medium rounded-full hover:bg-yellow-300 transition-all shadow-lg hover:shadow-yellow-200"
                >
                  Start Practice
                  <ChevronRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="group px-8 py-4 bg-yellow-400 text-teal-900 font-medium rounded-full hover:bg-yellow-300 transition-all shadow-lg hover:shadow-yellow-200"
                >
                  Get Started
                  <ChevronRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-yellow-200">
            <Code className="h-8 w-8 mb-4 text-yellow-500" />
            <h3 className="text-xl font-medium mb-2 text-teal-900">Technical Interviews</h3>
            <p className="text-teal-700">
              Practice coding challenges, system design, and technical concepts with real-time feedback.
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-yellow-200">
            <Layout className="h-8 w-8 mb-4 text-yellow-500" />
            <h3 className="text-xl font-medium mb-2 text-teal-900">Behavioral Questions</h3>
            <p className="text-teal-700">
              Improve your responses to common behavioral questions using the STAR method.
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-yellow-200">
            <Users className="h-8 w-8 mb-4 text-yellow-500" />
            <h3 className="text-xl font-medium mb-2 text-teal-900">Mock Interviews</h3>
            <p className="text-teal-700">
              Simulate real interview environments with AI-powered conversations.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-bold mb-8 text-teal-900">
              Why Choose Our Platform
              <div className="w-12 h-1 bg-yellow-400 mt-4" />
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <Sparkles className="h-6 w-6 flex-shrink-0 text-yellow-500" />
                <div>
                  <h3 className="font-medium mb-2 text-teal-900">AI-Powered Feedback</h3>
                  <p className="text-teal-700">Receive instant, detailed feedback on your responses to improve continuously.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Layout className="h-6 w-6 flex-shrink-0 text-yellow-500" />
                <div>
                  <h3 className="font-medium mb-2 text-teal-900">Customized Practice</h3>
                  <p className="text-teal-700">Get questions tailored to your experience level and target role.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <BrainCircuit className="h-6 w-6 flex-shrink-0 text-yellow-500" />
                <div>
                  <h3 className="font-medium mb-2 text-teal-900">Comprehensive Coverage</h3>
                  <p className="text-teal-700">Practice technical, behavioral, and role-specific questions in one place.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl p-8 shadow-lg border border-yellow-200">
            <h3 className="text-2xl font-bold mb-6 text-teal-900">Key Features</h3>
            <ul className="space-y-4 text-teal-700">
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-yellow-500" />
                Real-time speech analysis and feedback
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-yellow-500" />
                Industry-specific question banks
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-yellow-500" />
                Performance analytics and improvement tracking
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-yellow-500" />
                Resume-based interview preparation
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-yellow-500" />
                Mock interview recordings and analysis
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;