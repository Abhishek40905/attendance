import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocationCheckPage } from './pages/LocationCheckPage';
import { LoginPage } from './pages/LoginPage';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import LoginButton from './components/loginButton';

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [locationVerified, setLocationVerified] = useState(false);

  const handleLocationVerified = () => {
    setLocationVerified(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!locationVerified && !user) {
    return <LocationCheckPage onLocationVerified={handleLocationVerified} />;
  }

  if (!user) {
    return <LoginButton />;
  }

  if (user.role === 'teacher') {
    return <TeacherDashboard />;
  }

  return <StudentDashboard />;
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
