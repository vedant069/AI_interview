import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BrainCircuit } from 'lucide-react';

const GeometricShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
    <div className="absolute top-1/3 right-1/4 w-32 h-32 border border-yellow-500/20 rounded-full" />
    <div className="absolute bottom-1/4 left-1/3 w-48 h-48 border border-yellow-500/10 rotate-45" />
    <div className="absolute top-20 left-20 w-24 h-24 bg-yellow-500/10" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} />
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
    <div className="min-h-screen bg-black text-white flex flex-col justify-center relative overflow-hidden">
      <GeometricShapes />
      
      <div className="relative sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="relative">
          <BrainCircuit className="mx-auto h-16 w-16 text-yellow-400" />
          <div className="absolute -top-4 -right-4 w-8 h-8 border border-yellow-400/30 rounded-full" />
          <div className="absolute -bottom-4 -left-4 w-8 h-8 border border-yellow-400/30 rotate-45" />
        </div>
        
        <h2 className="mt-6 text-center font-mono">
          <span className="text-4xl font-bold block">Welcome Back</span>
          <span className="text-gray-400 mt-2 block">Sign in to continue your practice</span>
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="backdrop-blur-sm bg-black/30 py-8 px-4 shadow-2xl border border-gray-800 sm:rounded-lg sm:px-10
          relative overflow-hidden group hover:border-yellow-500/30 transition-colors">
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent" />
          
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex justify-center py-3 px-4 rounded-md text-sm font-medium 
              bg-yellow-400 text-black hover:bg-yellow-300 
              transform transition-all duration-200 hover:scale-[1.02]
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 focus:ring-offset-black"
          >
            Sign in with Google
          </button>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-400">
              By signing in, you agree to our{' '}
              <a href="#" className="text-yellow-400 hover:text-yellow-300">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-yellow-400 hover:text-yellow-300">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;