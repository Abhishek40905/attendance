import { useState, useEffect } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import { getLocation } from '../services/location';
import { api } from '../services/api';
import { Spinner } from '../components/Spinner';

interface LocationCheckPageProps {
  onLocationVerified: (lat: number, lng: number) => void;
}

export const LocationCheckPage = ({ onLocationVerified }: LocationCheckPageProps) => {
  const [status, setStatus] = useState<'checking' | 'allowed' | 'denied' | 'error'>('checking');
  const [message, setMessage] = useState('Checking your location...');
  const [isRetrying, setIsRetrying] = useState(false);

  const checkLocation = async () => {
    setStatus('checking');
    setMessage('Requesting location permission...');

    try {
      const coords = await getLocation();
      setMessage('Verifying location with server...');

      const response = await api.checkLocation(coords.lat, coords.lng);

      if (response.allowed) {
        setStatus('allowed');
        setMessage('Location verified successfully!');
        localStorage.setItem('location', JSON.stringify(coords));
        setTimeout(() => {
          onLocationVerified(coords.lat, coords.lng);
        }, 800);
      } else {
        setStatus('denied');
        setMessage(response.message || 'You are not in the allowed area to access this system.');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to get location');
    }
  };

  useEffect(() => {
    const storedLocation = localStorage.getItem('location');
    if (storedLocation) {
      try {
        const coords = JSON.parse(storedLocation);
        onLocationVerified(coords.lat, coords.lng);
        return;
      } catch (e) {
        localStorage.removeItem('location');
      }
    }
    checkLocation();
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    await checkLocation();
    setIsRetrying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Location Verification
            </h1>
            <p className="text-gray-600">
              We need to verify your location to grant access
            </p>
          </div>

          <div className="space-y-6">
            {status === 'checking' && (
              <div className="flex flex-col items-center gap-4 py-8">
                <Spinner size="lg" />
                <p className="text-gray-600 text-center">{message}</p>
              </div>
            )}

            {status === 'allowed' && (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-green-600 font-semibold text-center">{message}</p>
              </div>
            )}

            {(status === 'denied' || status === 'error') && (
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800 mb-1">
                      {status === 'denied' ? 'Access Denied' : 'Location Error'}
                    </h3>
                    <p className="text-red-700 text-sm">{message}</p>
                  </div>
                </div>

                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isRetrying ? (
                    <>
                      <Spinner size="sm" />
                      <span>Retrying...</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-5 h-5" />
                      <span>Try Again</span>
                    </>
                  )}
                </button>

                {status === 'error' && (
                  <div className="text-sm text-gray-600 space-y-2">
                    <p className="font-semibold">Troubleshooting tips:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-500">
                      <li>Allow location access in your browser settings</li>
                      <li>Make sure location services are enabled on your device</li>
                      <li>Try using a different browser if the issue persists</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Your location is used to verify you're in an authorized area
        </p>
      </div>
    </div>
  );
};
