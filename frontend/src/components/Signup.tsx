import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BrainCircuit, Mail, Lock, User, AlertCircle } from 'lucide-react';

const GeometricShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />
    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
    <div className="absolute top-1/3 right-1/4 w-32 h-32 border border-yellow-400/30 rounded-full" />
    <div className="absolute bottom-1/4 left-1/3 w-48 h-48 border border-teal-400/20 rotate-45" />
  </div>
);

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: string[] = [];
    
    // Name validation
    if (name.length < 2) {
      newErrors.push('Name must be at least 2 characters long');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.push('Please enter a valid email address');
    }
    
    // Password validation
    if (password.length < 8) {
      newErrors.push('Password must be at least 8 characters long');
    }
    if (!/\d/.test(password)) {
      newErrors.push('Password must contain at least one number');
    }
    if (!/[A-Z]/.test(password)) {
      newErrors.push('Password must contain at least one uppercase letter');
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setErrors([]);
      setLoading(true);
      await signUpWithEmail(email, password, name);
      navigate('/interview');
    } catch (error: any) {
      // Handle specific Firebase error codes
      const errorCode = error?.code;
      switch (errorCode) {
        case 'auth/email-already-in-use':
          setErrors(['This email address is already registered']);
          break;
        case 'auth/invalid-email':
          setErrors(['Please enter a valid email address']);
          break;
        case 'auth/weak-password':
          setErrors(['Password is too weak. Please choose a stronger password']);
          break;
        case 'auth/network-request-failed':
          setErrors(['Network error. Please check your internet connection']);
          break;
        default:
          setErrors(['An unexpected error occurred. Please try again']);
      }
      console.error('Error signing up:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setErrors([]);
      setLoading(true);
      await signInWithGoogle();
      navigate('/interview');
    } catch (error: any) {
      const errorCode = error?.code;
      switch (errorCode) {
        case 'auth/popup-closed-by-user':
          setErrors(['Sign up was cancelled. Please try again']);
          break;
        case 'auth/popup-blocked':
          setErrors(['Pop-up was blocked. Please allow pop-ups for this site']);
          break;
        case 'auth/account-exists-with-different-credential':
          setErrors(['An account already exists with this email']);
          break;
        default:
          setErrors(['Failed to sign up with Google. Please try again']);
      }
      console.error('Error signing up:', error);
    } finally {
      setLoading(false);
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
        </div>
        
        <h2 className="mt-6 text-center font-mono">
          <span className="text-4xl font-bold block text-teal-900">Create Account</span>
          <span className="text-teal-700 mt-2 block">Join us to start practicing</span>
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-4 shadow-lg border border-yellow-200 sm:rounded-2xl sm:px-10">
          {errors.length > 0 && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="font-medium">Please fix the following errors:</p>
              </div>
              <ul className="list-disc ml-5 space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-teal-700">
                Full Name
              </label>
              <div className="mt-1 relative">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-yellow-200 rounded-lg 
                    placeholder-gray-400 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400
                    text-teal-900"
                  required
                />
                <User className="absolute right-3 top-2.5 h-5 w-5 text-teal-400" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-teal-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-yellow-200 rounded-lg 
                    placeholder-gray-400 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400
                    text-teal-900"
                  required
                />
                <Mail className="absolute right-3 top-2.5 h-5 w-5 text-teal-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-teal-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-yellow-200 rounded-lg 
                    placeholder-gray-400 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400
                    text-teal-900"
                  required
                />
                <Lock className="absolute right-3 top-2.5 h-5 w-5 text-teal-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg
                text-sm font-medium text-teal-900 bg-yellow-400 hover:bg-yellow-300
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sign up
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-yellow-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-teal-700">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="mt-6 w-full flex justify-center py-2 px-4 border border-yellow-200 
                rounded-lg text-sm font-medium text-teal-900 bg-white hover:bg-yellow-50
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sign up with Google
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-teal-700">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-yellow-600 hover:text-yellow-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;