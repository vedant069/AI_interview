// services/speech.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import type { 
  SpeechSynthesisHook, 
  SpeechSynthesisConfig
} from '../types/speech';

const DEFAULT_CONFIG: SpeechSynthesisConfig = {
  preferredVoice: {
    lang: 'en-US',
  },
  defaultRate: 0.9,
  defaultPitch: 1,
  defaultVolume: 1
};

export const useSpeechSynthesis = (
  config: SpeechSynthesisConfig = DEFAULT_CONFIG
): SpeechSynthesisHook => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const lastTextRef = useRef<string>('');
  const synth = useRef<SpeechSynthesis | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    // Store speechSynthesis reference
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synth.current = window.speechSynthesis;
      
      // Chrome fix: Resume if suspended
      if (synth.current.speaking) {
        synth.current.pause();
        synth.current.resume();
      }
    }
  }, []);

  // Force load voices
  useEffect(() => {
    if (!synth.current) return;

    const loadVoices = async () => {
      // Chrome fix: Cancel any existing speech
      synth.current?.cancel();

      // Force voices to load
      let voices = synth.current.getVoices();
      
      if (voices.length === 0) {
        // Chrome fix: Sometimes needs a manual trigger
        await new Promise(resolve => {
          setTimeout(() => {
            voices = synth.current?.getVoices() || [];
            resolve(voices);
          }, 100);
        });
      }

      if (voices.length > 0) {
        console.log('Voices loaded:', voices.length);
        setIsReady(true);
      }
    };

    // Initial load attempt
    loadVoices();

    // Set up voice changed listener
    const handleVoicesChanged = () => {
      loadVoices();
    };

    synth.current.addEventListener('voiceschanged', handleVoicesChanged);

    // Chrome fix: Periodically check for voices
    const interval = setInterval(() => {
      if (!isReady) {
        loadVoices();
      }
    }, 100);

    // Cleanup
    return () => {
      synth.current?.removeEventListener('voiceschanged', handleVoicesChanged);
      clearInterval(interval);
    };
  }, [isReady]);

  const speak = useCallback((text: string) => {
    if (!synth.current) return;

    try {
      // Chrome fix: Cancel any ongoing speech
      synth.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Use default system voice instead of trying to select one
      utterance.rate = config.defaultRate || 0.9;
      utterance.pitch = config.defaultPitch || 1;
      utterance.volume = config.defaultVolume || 1;

      utterance.onstart = () => {
        console.log('Speech started');
        setIsPlaying(true);
      };

      utterance.onend = () => {
        console.log('Speech ended');
        setIsPlaying(false);
      };

      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        setIsPlaying(false);
      };

      // Chrome fix: Resume if suspended
      if (synth.current.speaking && synth.current.paused) {
        synth.current.resume();
      }

      lastTextRef.current = text;
      synth.current.speak(utterance);

    } catch (error) {
      console.error('Speech error:', error);
      setIsPlaying(false);
    }
  }, [config]);

  const stop = useCallback(() => {
    if (!synth.current) return;
    synth.current.cancel();
    setIsPlaying(false);
  }, []);

  const replay = useCallback(() => {
    if (lastTextRef.current) {
      speak(lastTextRef.current);
    }
  }, [speak]);

  // Chrome fix: Keep speech from getting stuck
  useEffect(() => {
    const interval = setInterval(() => {
      if (synth.current?.speaking) {
        synth.current.pause();
        synth.current.resume();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return {
    speak,
    stop,
    replay,
    isPlaying,
    isReady
  };
};