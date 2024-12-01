import React, { useState } from 'react';
import { InterviewState } from '../types';
import { ResumeUpload } from './ResumeUpload';
import { EXPERIENCE_LEVELS, MAX_QUESTIONS, DOMAINS, ROLES } from '../utils/constants';
import { Upload, Briefcase, FileText, Brain, ChevronRight, Check, Code, Book, Cpu, Loader2 } from 'lucide-react';

interface InterviewSetupProps {
  state: InterviewState;
  onChange: (updates: Partial<InterviewState>) => void;
  onSubmit: () => void;
  domains: string[];
  roles: string[];
}

const GeometricShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />
    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
    <div className="absolute top-1/3 right-1/4 w-32 h-32 border border-yellow-400/30 rounded-full" />
    <div className="absolute bottom-1/4 left-1/3 w-48 h-48 border border-teal-400/20 rotate-45" />
  </div>
);

const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="flex items-center justify-center space-x-2 mb-4">
    {Array.from({ length: totalSteps }).map((_, index) => (
      <div
        key={index}
        className={`h-2 rounded-full transition-all duration-300 ${
          index + 1 === currentStep 
            ? 'w-8 bg-yellow-400' 
            : index + 1 < currentStep 
              ? 'w-2 bg-yellow-400/50' 
              : 'w-2 bg-teal-200/30'
        }`}
      />
    ))}
  </div>
);

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
      className={`relative w-full p-4 rounded-xl border-2 transition-all duration-300
        ${isSelected 
          ? 'border-yellow-400 bg-yellow-400/10' 
          : 'border-teal-200/30 bg-white/50 hover:border-yellow-400/50'
        }
      `}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${isSelected ? 'bg-yellow-400 text-teal-900' : 'bg-teal-50 text-teal-700'}`}>
          {getIcon()}
        </div>
        <span className={`text-sm font-medium ${isSelected ? 'text-teal-900' : 'text-teal-700'}`}>{domain}</span>
        {isSelected && (
          <Check className="w-4 h-4 text-yellow-400 ml-auto" />
        )}
      </div>
    </button>
  );
};

export const InterviewSetup: React.FC<InterviewSetupProps> = ({
  state,
  onChange,
  onSubmit,
  domains,
  roles,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const availableRoles = state.domain ? ROLES[state.domain as keyof typeof ROLES] : [];

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
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
    <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl border border-yellow-200 p-6 shadow-lg">
      <StepIndicator currentStep={currentStep} totalSteps={3} />

      <div className="space-y-6">
        {/* Step 1: Resume Upload */}
        <div className={`transition-all duration-500 ${currentStep === 1 ? 'opacity-100' : 'hidden'}`}>
          <div className="flex items-center mb-4">
            <Upload className="w-6 h-6 text-yellow-400 mr-2" />
            <h3 className="text-xl font-medium text-teal-900">Upload Your Resume</h3>
          </div>
          <div className="p-4 rounded-xl border border-yellow-200 hover:border-yellow-400/50 transition-all">
            <ResumeUpload onResumeUpload={(text) => onChange({ resumeText: text })} />
          </div>
        </div>

        {/* Step 2: Interview Type */}
        <div className={`transition-all duration-500 ${currentStep === 2 ? 'opacity-100' : 'hidden'}`}>
          <div className="flex items-center mb-4">
            <Briefcase className="w-6 h-6 text-yellow-400 mr-2" />
            <h3 className="text-xl font-medium text-teal-900">Select Interview Type</h3>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center p-3 rounded-lg bg-teal-50/50">
              <input
                type="checkbox"
                checked={state.isCustomJob}
                onChange={(e) => onChange({ isCustomJob: e.target.checked })}
                className="rounded border-teal-300 text-yellow-400 focus:ring-yellow-500 bg-white"
              />
              <span className="ml-3 text-sm text-teal-700">I have a specific job description</span>
            </label>

            {state.isCustomJob ? (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-teal-700">Job Description</label>
                <textarea
                  value={state.jobDescription}
                  onChange={(e) => onChange({ jobDescription: e.target.value })}
                  className="w-full h-32 rounded-xl border-teal-200 bg-white/50 text-teal-900 
                    placeholder-teal-400 focus:border-yellow-400 focus:ring-yellow-400 
                    resize-none p-3 text-sm"
                  placeholder="Paste the job description here..."
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-teal-700 mb-3">Select Domain</label>
                  <div className="grid grid-cols-2 gap-3">
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
                  <div>
                    <label className="block text-sm font-medium text-teal-700 mb-3">Select Role</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {availableRoles.map((role) => (
                        <button
                          key={role}
                          onClick={() => onChange({ role })}
                          className={`p-3 rounded-xl border-2 transition-all duration-300 text-sm
                            ${state.role === role 
                              ? 'border-yellow-400 bg-yellow-400/10 text-teal-900' 
                              : 'border-teal-200/30 bg-white/50 hover:border-yellow-400/50 text-teal-700'
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
          <div className="flex items-center mb-4">
            <FileText className="w-6 h-6 text-yellow-400 mr-2" />
            <h3 className="text-xl font-medium text-teal-900">Interview Details</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-teal-700 mb-3">Experience Level</label>
              <div className="space-y-3">
                {EXPERIENCE_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => onChange({ experience: level.value })}
                    className={`w-full p-3 rounded-xl border-2 text-left transition-all duration-300
                      ${state.experience === level.value 
                        ? 'border-yellow-400 bg-yellow-400/10' 
                        : 'border-teal-200/30 bg-white/50 hover:border-yellow-400/50'
                      }`}
                  >
                    <div className="text-sm font-medium text-teal-900">{level.label}</div>
                    <div className="text-xs text-teal-600 mt-1">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-teal-700 mb-3">
                Number of Questions
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="1"
                  max={MAX_QUESTIONS}
                  value={state.questionCount}
                  onChange={(e) => onChange({ questionCount: parseInt(e.target.value) })}
                  className="w-full h-2 bg-teal-100 rounded-lg appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:h-6
                    [&::-webkit-slider-thumb]:w-6
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-yellow-400"
                />
                <div className="flex justify-between text-sm text-teal-600">
                  <span>1</span>
                  <span className="text-yellow-600 font-medium">{state.questionCount}</span>
                  <span>{MAX_QUESTIONS}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-4 py-2 rounded-full text-sm font-medium text-teal-600 
              hover:text-teal-900 disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200"
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="group flex items-center px-6 py-2 rounded-full text-sm font-medium
              bg-yellow-400 text-teal-900 hover:bg-yellow-300 disabled:opacity-50 
              disabled:cursor-not-allowed transition-all duration-200 
              hover:scale-[1.02] min-w-[120px] justify-center
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 
              focus:ring-offset-white shadow-lg hover:shadow-yellow-200"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {currentStep === 3 ? 'Start Interview' : 'Next'}
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};