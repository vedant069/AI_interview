// types/speech.ts

// SpeechSynthesis related types
export interface SpeechSynthesisHook {
    speak: (text: string) => void;
    stop: () => void;
    replay: () => void;
    isPlaying: boolean;
    isReady: boolean;
  }
  
  // Question interface for the conversation section
  export interface Question {
    id?: string | number;
    question: string;
  }
  
  // Voice configuration types
  export interface VoiceConfig {
    voice: SpeechSynthesisVoice | null;
    lang: string;
    rate: number;
    pitch: number;
    volume: number;
  }
  
  // Speech event handlers
  export interface SpeechEventHandlers {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (event: SpeechSynthesisErrorEvent) => void;
    onPause?: () => void;
    onResume?: () => void;
  }
  
  // Error types for speech synthesis
  export interface SpeechError {
    code: string;
    message: string;
  }
  
  // Extend Window interface to ensure TypeScript recognizes speechSynthesis
  declare global {
    interface Window {
      speechSynthesis: SpeechSynthesis;
    }
  }
  
  // Optional configuration for speech synthesis
  export interface SpeechSynthesisConfig {
    preferredVoice?: {
      lang?: string;
      name?: string;
      gender?: 'male' | 'female';
    };
    defaultRate?: number;
    defaultPitch?: number;
    defaultVolume?: number;
  }
  
  // State interface for the speech synthesis hook
  export interface SpeechSynthesisState {
    isPlaying: boolean;
    isReady: boolean;
    currentUtterance: SpeechSynthesisUtterance | null;
    voices: SpeechSynthesisVoice[];
    error: SpeechError | null;
  }