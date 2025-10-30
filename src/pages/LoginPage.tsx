import { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { LogIn } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/Spinner';

interface GoogleUser {
  email: string;
  name: string;
  picture?: string;
}

export const LoginPage = () => {
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!credentialResponse.credential) {
        throw new Error('No credential received');
      }

      const decoded = jwtDecode<GoogleUser>(credentialResponse.credential);

      const roleResponse = await api.checkUserRole(decoded.email);

      setUser({
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        role: roleResponse.role
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome
            </h1>
            <p className="text-gray-600">
              Sign in to mark your attendance
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <Spinner size="lg" />
                <p className="text-gray-600">Signing you in...</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="filled_blue"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                />
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="space-y-2 text-sm text-gray-600">
              <p className="font-semibold">Access Requirements:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-500">
                <li>Location must be verified</li>
                <li>Valid Google account required</li>
                <li>Teachers use @school.edu domain</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Your location has been verified. You may now sign in.
        </p>
      </div>
    </div>
  );
};
