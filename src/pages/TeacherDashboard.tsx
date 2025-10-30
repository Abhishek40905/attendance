import { useState, useEffect } from 'react';
import { Clock, LogOut, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AttendanceTimer } from '../components/AttendanceTimer';
import { Toast } from '../components/Toast';

interface TimerState {
  isActive: boolean;
  startTime: number;
  duration: number;
}

export const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [timerState, setTimerState] = useState<TimerState | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('attendanceTimer');
    if (stored) {
      try {
        const state: TimerState = JSON.parse(stored);
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        if (elapsed < state.duration) {
          setTimerState(state);
        } else {
          localStorage.removeItem('attendanceTimer');
        }
      } catch (e) {
        localStorage.removeItem('attendanceTimer');
      }
    }
  }, []);

  const startAttendance = () => {
    const duration = 300;
    const state: TimerState = {
      isActive: true,
      startTime: Date.now(),
      duration
    };
    setTimerState(state);
    localStorage.setItem('attendanceTimer', JSON.stringify(state));
    setToast({ message: 'Attendance session started!', type: 'success' });
  };

  const handleTimerComplete = async () => {
    setToast({ message: 'Sending attendance data...', type: 'info' });

    try {
      const response = await api.sendAttendance(user?.email || '');
      if (response.success) {
        setToast({
          message: response.message || `Attendance sent successfully to ${user?.email}`,
          type: 'success'
        });
      }
    } catch (error) {
      setToast({
        message: 'Failed to send attendance',
        type: 'error'
      });
    }

    setTimerState(null);
    localStorage.removeItem('attendanceTimer');
  };

  const getSecondsRemaining = () => {
    if (!timerState) return 0;
    const elapsed = Math.floor((Date.now() - timerState.startTime) / 1000);
    return Math.max(0, timerState.duration - elapsed);
  };

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
            Teacher Dashboard
          </h1>
          <p className="text-gray-600">
            Manage attendance sessions for your students
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!timerState?.isActive ? (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                <Clock className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Start Attendance Session
                </h2>
                <p className="text-gray-600 mb-6">
                  Click the button below to start a 5-minute attendance window.
                  <br />
                  Students will be able to mark their attendance during this time.
                </p>
              </div>
              <button
                onClick={startAttendance}
                className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
              >
                <Clock className="w-5 h-5" />
                <span>Start Attendance</span>
              </button>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-4">
                    <div className="text-3xl font-bold text-blue-600 mb-1">5</div>
                    <div className="text-sm text-gray-600">Minutes Duration</div>
                  </div>
                  <div className="p-4">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      <Clock className="w-8 h-8 mx-auto" />
                    </div>
                    <div className="text-sm text-gray-600">Real-time Timer</div>
                  </div>
                  <div className="p-4">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      <CheckCircle className="w-8 h-8 mx-auto" />
                    </div>
                    <div className="text-sm text-gray-600">Auto Submit</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <AttendanceTimer
                initialSeconds={getSecondsRemaining()}
                onComplete={handleTimerComplete}
              />
              <div className="mt-8 w-full max-w-md">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 text-center">
                    Attendance will be automatically submitted when the timer reaches zero.
                    The data will be sent to <strong>{user?.email}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
