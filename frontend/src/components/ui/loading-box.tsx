import React, { useEffect, useState } from 'react';
import { cn } from "../../lib/utils";

interface LoadingBoxProps {
  onComplete?: () => void;
}

export const LoadingBox: React.FC<LoadingBoxProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { text: "Reading your resume...", duration: 2000 },
    { text: "Analyzing your experience...", duration: 2000 },
    { text: "Generating relevant questions...", duration: 2000 },
    { text: "Preparing interview environment...", duration: 1500 },
    { text: "Starting interview...", duration: 1000 }
  ];

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const progressSteps = () => {
      if (currentStep < steps.length - 1) {
        timeout = setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, steps[currentStep].duration);
      } else if (onComplete) {
        setTimeout(onComplete, steps[currentStep].duration);
      }
    };

    progressSteps();

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [currentStep, onComplete]);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                "transition-all duration-500 space-y-2",
                index > currentStep ? "opacity-40" : "opacity-100"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium",
                    index === currentStep
                      ? "bg-orange-100 text-orange-700 animate-pulse"
                      : index < currentStep
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-700"
                  )}
                >
                  {index < currentStep ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "font-medium",
                    index === currentStep ? "text-orange-700" : "text-slate-700"
                  )}
                >
                  {step.text}
                </span>
              </div>
              {index === currentStep && (
                <div className="ml-9">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full animate-progress" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingBox;