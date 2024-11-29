import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SpeechRecognitionProvider } from './components/SpeechRecognitionProvider';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { InterviewDashboard } from './components/InterviewDashboard';
import { useAuth } from './contexts/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SpeechRecognitionProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/interview" 
              element={
                <PrivateRoute>
                  <InterviewDashboard />
                </PrivateRoute>
              } 
            />
          </Routes>
        </SpeechRecognitionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;