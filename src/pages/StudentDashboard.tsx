import { useState, useEffect } from 'react';
import { CheckCircle, LogOut, User, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Toast } from '../components/Toast';
import { Spinner } from '../components/Spinner';

export const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [isMarking, setIsMarking] = useState(true);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const markAttendance = async () => {
      try {
        const locationStr = localStorage.getItem('location');
        if (!locationStr) {
          throw new Error('Location not found');
        }

        const { lat, lng } = JSON.parse(locationStr);

        const response = await api.markAttendance(user?.email || '', lat, lng);

        if (response.success) {
          setAttendanceMarked(true);
          setToast({
            message: response.message || 'Attendance marked successfully!',
            type: 'success'
          });
        }
      } catch (error) {
        setToast({
          message: error instanceof Error ? error.message : 'Failed to mark attendance',
          type: 'error'
        });
      } finally {
        setIsMarking(false);
      }
    };

    markAttendance();
  }, [user?.email]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-800">{user?.name}</h2>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Student Dashboard
          </h1>
          <p className="text-gray-600">
            Your attendance status
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {isMarking ? (
            <div className="text-center space-y-6 py-8">
              <Spinner size="lg" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Marking Your Attendance
                </h2>
                <p className="text-gray-600">
                  Please wait while we verify your information...
                </p>
              </div>
            </div>
          ) : attendanceMarked ? (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Attendance Marked Successfully!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your attendance has been recorded for today's session.
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Student Name:</span>
                    <span className="font-semibold text-gray-800">{user?.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold text-gray-800">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      Present
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold text-gray-800">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <p className="text-sm text-gray-500">
                  You can close this page now. Your attendance has been submitted.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-4">
                <MapPin className="w-12 h-12 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Unable to Mark Attendance
                </h2>
                <p className="text-gray-600">
                  There was an issue marking your attendance. Please try again or contact your teacher.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
