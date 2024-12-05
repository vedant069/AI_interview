import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Code, Layout, Users, Sparkles, ChevronRight, Video, Mic, BarChart2, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import uploadImage from '../images/upload.png';
import domainImage from '../images/domain.png';
import experienceImage from '../images/experience.png';

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

  const stats = [
    { number: "98%", label: "Success Rate" },
    { number: "1min", label: "Setup Time" },
    { number: "1K+", label: "Interviews Conducted" },
    { number: "4.9/5", label: "User Rating" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      content: "The real-time video simulation and instant feedback helped me ace my technical interviews. Best platform hands down!",
      rating: 5
    },
    {
      name: "Michael Roberts",
      role: "Product Manager at Meta",
      content: "Started practicing within minutes. The AI-powered insights were incredibly helpful in improving my responses.",
      rating: 4.5
    },
    {
      name: "Priya Patel",
      role: "Data Scientist at Amazon",
      content: "The deep analysis of each answer helped me understand my strengths and areas for improvement. Game-changer!",
      rating: 4.7
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation */}
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

        {/* Enhanced Hero Section */}
        <div className="mt-24 mb-16 text-center">
          <div className="inline-block bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full font-semibold mb-6">
            #1 AI-Powered Interview Platform
          </div>
          <h1 className="text-5xl font-bold text-teal-900 mb-6">
            Start Your Interview in
            <span className="text-yellow-500"> Just A Minute</span>
          </h1>
          <p className="text-xl text-teal-700 mb-8 max-w-2xl mx-auto">
            Experience the most realistic interview simulation with live video, audio, and AI-powered 
            deep insights. Join 50,000+ successful candidates who landed their dream jobs.
          </p>
          
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-yellow-500 mb-2">{stat.number}</div>
                <div className="text-teal-700 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {!currentUser && (
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-3 bg-yellow-400 text-teal-900 rounded-full hover:bg-yellow-300 
                  transition-all shadow-lg hover:shadow-yellow-200 font-medium flex items-center gap-2"
              >
                Start Interviewing Now
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate('/demo')}
                className="px-8 py-3 bg-teal-50 text-teal-900 rounded-full hover:bg-teal-100 
                  transition-all shadow-lg hover:shadow-teal-200 font-medium"
              >
                Watch Demo
              </button>
            </div>
          )}
        </div>

        {/* Key Features Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-teal-900 text-center mb-16">
            The Most Advanced Interview Platform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-yellow-200 hover:border-yellow-300 transition-all">
              <Video className="h-10 w-10 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-teal-900">Real-time Simulation</h3>
              <p className="text-teal-700">
                Ultra-realistic interview experience with live video and audio feedback, just like a real interview.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-yellow-200 hover:border-yellow-300 transition-all">
              <BarChart2 className="h-10 w-10 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-teal-900">Deep Analysis</h3>
              <p className="text-teal-700">
                Get comprehensive insights on your answers, body language, and speaking patterns.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-yellow-200 hover:border-yellow-300 transition-all">
              <Sparkles className="h-10 w-10 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-teal-900">Instant Feedback</h3>
              <p className="text-teal-700">
                Receive immediate, actionable feedback to improve your interview performance.
              </p>
            </div>
          </div>
        </div>

        {/* Steps Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-teal-900 text-center mb-16">
            Start Practicing in Minutes
          </h2>
          <div className="space-y-32">
            {/* Step 1 */}
            <div className="flex flex-col items-center group">
              <div className="inline-block bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full font-semibold mb-4">Step 1</div>
              <h3 className="text-3xl font-semibold text-teal-900 mb-8">Upload Your Resume</h3>
              <img 
                src={uploadImage} 
                alt="Upload Resume" 
                className="w-[920px] h-[575px] object-contain transition-transform group-hover:scale-105 drop-shadow-2xl mb-8"
              />
              <p className="text-xl text-teal-700 leading-relaxed max-w-3xl text-center">
                Simply upload your resume and our AI will instantly analyze your background to create 
                personalized interview questions tailored to your experience.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center group">
              <div className="inline-block bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full font-semibold mb-4">Step 2</div>
              <h3 className="text-3xl font-semibold text-teal-900 mb-8">Choose Your Domain</h3>
              <img 
                src={domainImage} 
                alt="Select Domain" 
                className="w-[920px] h-[575px] object-contain transition-transform group-hover:scale-105 drop-shadow-2xl mb-8"
              />
              <p className="text-xl text-teal-700 leading-relaxed max-w-3xl text-center">
                Select from over 50+ job roles across different industries. Get domain-specific questions 
                that actually get asked in real interviews.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center group">
              <div className="inline-block bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full font-semibold mb-4">Step 3</div>
              <h3 className="text-3xl font-semibold text-teal-900 mb-8">Start Interviewing</h3>
              <img 
                src={experienceImage} 
                alt="Start Interview" 
                className="w-[920px] h-[575px] object-contain transition-transform group-hover:scale-105 drop-shadow-2xl mb-8"
              />
              <p className="text-xl text-teal-700 leading-relaxed max-w-3xl text-center">
                Begin your interview immediately with our AI interviewer. Get real-time feedback and 
                detailed analysis of each response to improve instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-teal-900 text-center mb-16">
            Trusted by Successful Candidates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-teal-700 mb-6">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-teal-900">{testimonial.name}</div>
                  <div className="text-sm text-teal-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-24">
          <h2 className="text-3xl font-bold text-teal-900 mb-8">
            Ready to Ace Your Next Interview?
          </h2>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 bg-yellow-400 text-teal-900 rounded-full hover:bg-yellow-300 
              transition-all shadow-lg hover:shadow-yellow-200 font-medium flex items-center gap-2 mx-auto"
          >
            Start Practicing Now
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;