import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Code, Layout, Users, Sparkles, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AILogo = () => (
  <div className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
      <BrainCircuit className="w-6 h-6 text-white" />
    </div>
    InterviewAI
  </div>
);

const GeometricShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
    <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
    <div className="absolute top-1/2 left-1/3 w-32 h-32 border border-indigo-500/20 rounded-full" />
    <div className="absolute top-1/4 right-1/4 w-48 h-48 border border-purple-500/10 rotate-45" />
    <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-500/10" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} />
  </div>
);

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      <GeometricShapes />
      
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AILogo />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 flex items-center min-h-[80vh]">
          <div className="space-y-8 max-w-3xl mx-auto text-center">
            <h1 className="text-6xl font-bold tracking-tight relative">
              Master Your
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Interview Skills
              </span>
              <br />
              With AI
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional guidance for tech, business, and academic interviews powered by artificial intelligence.
            </p>

            <div className="flex gap-4 justify-center">
              {currentUser ? (
                <button
                  onClick={() => navigate('/interview')}
                  className="group flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-full hover:opacity-90 transition-all"
                >
                  Start Practice
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="group flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-full hover:opacity-90 transition-all"
                >
                  Get Started
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="rounded-xl p-6 hover:shadow-lg transition-all bg-white border border-gray-100 hover:border-indigo-100">
              <Code className="h-8 w-8 mb-4 text-indigo-600" />
              <h3 className="text-xl font-medium mb-2">Technical Interviews</h3>
              <p className="text-gray-400">
                Practice coding challenges, system design, and technical concepts with real-time feedback.
              </p>
            </div>
            
            <div className="border border-gray-800 rounded-lg p-6 hover:border-yellow-500/30 transition-colors bg-black/50 backdrop-blur-sm">
              <Layout className="h-8 w-8 mb-4 text-yellow-400" />
              <h3 className="text-xl font-medium mb-2">Behavioral Questions</h3>
              <p className="text-gray-400">
                Improve your responses to common behavioral questions using the STAR method.
              </p>
            </div>
            
            <div className="border border-gray-800 rounded-lg p-6 hover:border-yellow-500/30 transition-colors bg-black/50 backdrop-blur-sm">
              <Users className="h-8 w-8 mb-4 text-yellow-400" />
              <h3 className="text-xl font-medium mb-2">Mock Interviews</h3>
              <p className="text-gray-400">
                Simulate real interview environments with AI-powered conversations.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold mb-8">
                Why Choose Our Platform
                <div className="w-12 h-1 bg-yellow-400 mt-4" />
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Sparkles className="h-6 w-6 flex-shrink-0 text-yellow-400" />
                  <div>
                    <h3 className="font-medium mb-2">AI-Powered Feedback</h3>
                    <p className="text-gray-400">Receive instant, detailed feedback on your responses to improve continuously.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Layout className="h-6 w-6 flex-shrink-0 text-yellow-400" />
                  <div>
                    <h3 className="font-medium mb-2">Customized Practice</h3>
                    <p className="text-gray-400">Get questions tailored to your experience level and target role.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <BrainCircuit className="h-6 w-6 flex-shrink-0 text-yellow-400" />
                  <div>
                    <h3 className="font-medium mb-2">Comprehensive Coverage</h3>
                    <p className="text-gray-400">Practice technical, behavioral, and role-specific questions in one place.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-black to-yellow-950/30 rounded-lg p-8 border border-yellow-500/20">
              <h3 className="text-2xl font-bold mb-6">Key Features</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-yellow-400" />
                  Real-time speech analysis and feedback
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-yellow-400" />
                  Industry-specific question banks
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-yellow-400" />
                  Performance analytics and improvement tracking
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-yellow-400" />
                  Resume-based interview preparation
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-yellow-400" />
                  Mock interview recordings and analysis
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;  