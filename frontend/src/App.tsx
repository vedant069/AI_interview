import React from 'react';
import { 
  createBrowserRouter, 
  RouterProvider, 
  Navigate,
  createRoutesFromElements,
  Route
} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import SpeechRecognitionProvider from './components/SpeechRecognitionProvider';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { InterviewDashboard } from './components/InterviewDashboard';
import { useAuth } from './contexts/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

// Create routes with future flags enabled
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
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
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

function App() {
  return (
    <AuthProvider>
      <SpeechRecognitionProvider>
        <RouterProvider router={router} />
      </SpeechRecognitionProvider>
    </AuthProvider>
  );
}

export default App;