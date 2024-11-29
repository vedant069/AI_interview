import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BrainCircuit } from 'lucide-react';

const GeometricShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />
    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
    <div className="absolute top-1/3 right-1/4 w-32 h-32 border border-yellow-400/30 rounded-full" />
    <div className="absolute bottom-1/4 left-1/3 w-48 h-48 border border-teal-400/20 rotate-45" />
    <div className="absolute top-20 left-20 w-24 h-24 bg-yellow-400/20" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} />
  </div>
);

export const Login: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/interview');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-teal-50 flex flex-col justify-center relative overflow-hidden">
      <GeometricShapes />
      
      <div className="relative sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="relative">
          <div className="mx-auto w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
            <BrainCircuit className="h-8 w-8 text-teal-900" />
          </div>
          <div className="absolute -top-4 -right-4 w-8 h-8 border-2 border-teal-500/30 rounded-full" />
          <div className="absolute -bottom-4 -left-4 w-8 h-8 border-2 border-yellow-400/30 rotate-45" />
        </div>
        
        <h2 className="mt-6 text-center font-mono">
          <span className="text-4xl font-bold block text-teal-900">Welcome Back</span>
          <span className="text-teal-700 mt-2 block">Sign in to continue your practice</span>
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="backdrop-blur-sm bg-white/80 py-8 px-4 shadow-lg border border-yellow-200 sm:rounded-2xl sm:px-10
          relative overflow-hidden group hover:border-yellow-400/50 transition-all hover:shadow-xl">
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />
          
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex justify-center py-4 px-4 rounded-full text-sm font-medium 
              bg-yellow-400 text-teal-900 hover:bg-yellow-300 
              transform transition-all duration-200 hover:scale-[1.02]
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 focus:ring-offset-white
              shadow-lg hover:shadow-yellow-200"
          >
            Sign in with Google
          </button>

          <div className="mt-6 text-center text-sm">
            <p className="text-teal-700">
              By signing in, you agree to our{' '}
              <a href="#" className="text-yellow-600 hover:text-yellow-700 font-medium">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-yellow-600 hover:text-yellow-700 font-medium">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;