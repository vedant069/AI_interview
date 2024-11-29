import React from 'react';
import SpeechRecognition from 'react-speech-recognition';

interface SpeechRecognitionProviderProps {
  children: React.ReactNode;
}

export const SpeechRecognitionProvider: React.FC<SpeechRecognitionProviderProps> = ({ children }) => {
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="text-center p-4 bg-yellow-50 text-yellow-800 rounded-md">
        Your browser doesn't support speech recognition. Please use a modern browser like Chrome.
      </div>
    );
  }

  return <>{children}</>;
};