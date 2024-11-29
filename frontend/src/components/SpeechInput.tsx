import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface SpeechInputProps {
  onSpeechResult: (text: string) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
}

export const SpeechInput: React.FC<SpeechInputProps> = ({
  onSpeechResult,
  isListening,
  setIsListening,
}) => {
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      onSpeechResult(transcript);
    }
  }, [transcript, onSpeechResult]);

  useEffect(() => {
    if (isListening) {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [isListening, resetTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return null;
};