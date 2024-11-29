import React, { useState } from 'react';
import { InterviewState } from '../types';
import { ResumeUpload } from './ResumeUpload';
import { EXPERIENCE_LEVELS, MAX_QUESTIONS, DOMAINS, ROLES } from '../utils/constants';
import { Upload, Briefcase, FileText, Brain, ChevronRight, Check, Code, Book, Cpu } from 'lucide-react';

interface InterviewSetupProps {
  state: InterviewState;
  onChange: (updates: Partial<InterviewState>) => void;
  onSubmit: () => void;
}

const DomainCard = ({ domain, isSelected, onClick }: { 
  domain: string; 
  isSelected: boolean; 
  onClick: () => void;
}) => {
  const getIcon = () => {
    switch (domain) {
      case 'Software Development': return <Code />;
      case 'Data Science': return <Brain />;
      case 'Machine Learning': return <Cpu />;
      default: return <Book />;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`relative w-full p-6 rounded-xl border-2 transition-all duration-300
        ${isSelected 
          ? 'border-yellow-400 bg-yellow-400/10' 
          : 'border-gray-800 bg-black/30 hover:border-yellow-400/50'
        }
      `}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${isSelected ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-gray-400'}`}>
          {getIcon()}
        </div>
        <span className="text-lg font-medium">{domain}</span>
      </div>
      {isSelected && (
        <div className="absolute top-4 right-4">
          <Check className="w-6 h-6 text-yellow-400" />
        </div>
      )}
    </button>
  );
};

const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="flex items-center justify-center space-x-2 mb-8">
    {Array.from({ length: totalSteps }).map((_, index) => (
      <div
        key={index}
        className={`h-2 rounded-full transition-all duration-300 ${
          index + 1 === currentStep 
            ? 'w-8 bg-yellow-400' 
            : index + 1 < currentStep 
              ? 'w-2 bg-yellow-400/50' 
              : 'w-2 bg-gray-800'
        }`}
      />
    ))}
  </div>
);

const GeometricShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
    <div className="absolute top-1/3 right-1/4 w-32 h-32 border border-yellow-500/20 rounded-full animate-spin-slow" />
  </div>
);

export const InterviewSetup: React.FC<InterviewSetupProps> = ({
  state,
  onChange,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const availableRoles = state.domain ? ROLES[state.domain as keyof typeof ROLES] : [];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return state.resumeText.length > 0;
      case 2:
        return state.isCustomJob 
          ? state.jobDescription.length > 0 
          : (state.domain && state.role);
      case 3:
        return state.experience && state.questionCount > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <GeometricShapes />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold font-mono bg-clip-text text-transparent 
            bg-gradient-to-r from-yellow-200 to-yellow-400">
            Setup Your Interview
          </h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mt-6" />
          <p className="mt-4 text-lg text-gray-400">
            Complete the following steps to personalize your interview experience
          </p>
        </div>

        <StepIndicator currentStep={currentStep} totalSteps={3} />

        <div className="space-y-8">
          {/* Step 1: Resume Upload */}
          <div className={`transition-all duration-500 ${currentStep === 1 ? 'opacity-100' : 'hidden'}`}>
            <div className="flex items-center mb-6">
              <Upload className="w-8 h-8 text-yellow-400 mr-3" />
              <h3 className="text-2xl font-medium">Upload Your Resume</h3>
            </div>
            <div className="backdrop-blur-sm bg-black/30 p-8 rounded-xl border-2 border-gray-800 
              hover:border-yellow-500/30 transition-all">
              <p className="text-gray-400 text-lg mb-6">
                Upload your resume to get more personalized interview questions based on your experience
              </p>
              <ResumeUpload 
                onResumeUpload={(text) => onChange({ resumeText: text })} 
              />
            </div>
          </div>

          {/* Step 2: Interview Type */}
          <div className={`transition-all duration-500 ${currentStep === 2 ? 'opacity-100' : 'hidden'}`}>
            <div className="flex items-center mb-6">
              <Briefcase className="w-8 h-8 text-yellow-400 mr-3" />
              <h3 className="text-2xl font-medium">Select Interview Type</h3>
            </div>
            
            <div className="backdrop-blur-sm bg-black/30 p-8 rounded-xl border-2 border-gray-800 
              hover:border-yellow-500/30 transition-all">
              <label className="flex items-center p-4 mb-8 rounded-lg bg-gray-900/50">
                <input
                  type="checkbox"
                  checked={state.isCustomJob}
                  onChange={(e) => onChange({ isCustomJob: e.target.checked })}
                  className="rounded border-gray-700 text-yellow-400 focus:ring-yellow-500 bg-black"
                />
                <span className="ml-3 text-lg text-gray-300">I have a specific job description</span>
              </label>

              {state.isCustomJob ? (
                <div className="space-y-4">
                  <label className="block text-lg font-medium text-gray-300">Job Description</label>
                  <textarea
                    value={state.jobDescription}
                    onChange={(e) => onChange({ jobDescription: e.target.value })}
                    className="w-full h-48 rounded-xl border-gray-800 bg-black/50 text-white 
                      placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500 
                      resize-none p-4"
                    placeholder="Paste the job description here..."
                  />
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <label className="block text-lg font-medium text-gray-300 mb-4">Select Domain</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {DOMAINS.map((domain) => (
                        <DomainCard
                          key={domain}
                          domain={domain}
                          isSelected={state.domain === domain}
                          onClick={() => onChange({ domain, role: '' })}
                        />
                      ))}
                    </div>
                  </div>

                  {state.domain && (
                    <div className="mt-8">
                      <label className="block text-lg font-medium text-gray-300 mb-4">Select Role</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {availableRoles.map((role) => (
                          <button
                            key={role}
                            onClick={() => onChange({ role })}
                            className={`p-4 rounded-xl border-2 transition-all duration-300
                              ${state.role === role 
                                ? 'border-yellow-400 bg-yellow-400/10' 
                                : 'border-gray-800 bg-black/30 hover:border-yellow-400/50'
                              }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Interview Details */}
          <div className={`transition-all duration-500 ${currentStep === 3 ? 'opacity-100' : 'hidden'}`}>
            <div className="flex items-center mb-6">
              <FileText className="w-8 h-8 text-yellow-400 mr-3" />
              <h3 className="text-2xl font-medium">Interview Details</h3>
            </div>
            <div className="backdrop-blur-sm bg-black/30 p-8 rounded-xl border-2 border-gray-800 
              hover:border-yellow-500/30 transition-all">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div>
                  <label className="block text-lg font-medium text-gray-300 mb-4">Experience Level</label>
                  <div className="space-y-4">
                    {EXPERIENCE_LEVELS.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => onChange({ experience: level.value })}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300
                          ${state.experience === level.value 
                            ? 'border-yellow-400 bg-yellow-400/10' 
                            : 'border-gray-800 bg-black/30 hover:border-yellow-400/50'
                          }`}
                      >
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-gray-400 mt-1">{level.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-300 mb-4">
                    Number of Questions
                  </label>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="1"
                      max={MAX_QUESTIONS}
                      value={state.questionCount}
                      onChange={(e) => onChange({ questionCount: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:h-6
                        [&::-webkit-slider-thumb]:w-6
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-yellow-400"
                    />
                    <div className="flex justify-between text-gray-400">
                      <span>1</span>
                      <span className="text-yellow-400 font-medium">{state.questionCount}</span>
                      <span>{MAX_QUESTIONS}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-3 rounded-lg text-sm font-medium text-gray-400 
                hover:text-white disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200"
            >
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="group flex items-center px-6 py-3 rounded-lg text-sm font-medium
                bg-yellow-400 text-black hover:bg-yellow-300 disabled:opacity-50 
                disabled:cursor-not-allowed transition-all duration-200 
                hover:scale-[1.02]"
            >
              {currentStep === 3 ? 'Start Interview' : 'Next'}
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};