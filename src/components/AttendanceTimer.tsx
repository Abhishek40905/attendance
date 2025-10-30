import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface AttendanceTimerProps {
  initialSeconds: number;
  onComplete: () => void;
}

export const AttendanceTimer = ({ initialSeconds, onComplete }: AttendanceTimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        const newValue = prev - 1;
        if (newValue <= 0) {
          clearInterval(timer);
          return 0;
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onComplete]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const progress = ((initialSeconds - secondsLeft) / initialSeconds) * 100;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="#3b82f6"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Clock className="w-8 h-8 text-blue-600 mb-2" />
          <div className="text-4xl font-bold text-gray-800">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="text-sm text-gray-500 mt-1">remaining</div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700">Attendance is Active</p>
        <p className="text-sm text-gray-500">Students can now mark their attendance</p>
      </div>
    </div>
  );
};
