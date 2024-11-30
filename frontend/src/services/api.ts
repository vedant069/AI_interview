import axios from 'axios';
import { InterviewState, Question, FeedbackData } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ApiService = {
  getDomains: async (): Promise<string[]> => {
    const response = await api.get('/domains');
    return response.data;
  },

  getRoles: async (domain: string): Promise<string[]> => {
    const response = await api.get(`/roles/${domain}`);
    return response.data;
  },

  uploadResume: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.resumeText;
  },

  generateQuestions: async (params: InterviewState): Promise<Question[]> => {
    const response = await api.post('/generate-questions', params);
    return response.data;
  },

  submitAnswer: async (answer: string, questionIndex: number): Promise<void> => {
    if (typeof answer !== 'string' || !answer.trim()) {
      throw new Error('Answer cannot be empty');
    }

    try {
      await api.post('/submit-answer', {
        answer: answer.trim(),
        questionIndex: questionIndex,
      }).catch((error) => {
        console.error("Payload sent:", { answer: answer.trim(), questionIndex });
        throw error;
      });
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  },

  getFeedback: async (): Promise<FeedbackData> => {
    const response = await api.post('/get-feedback');
    return response.data;
  },
};