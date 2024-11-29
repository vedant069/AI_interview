import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
}

export const Timer: React.FC<TimerProps> = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const getColorClass = () => {
    if (timeLeft <= 30) return 'text-red-600';
    if (timeLeft <= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className={`flex items-center ${getColorClass()}`}>
      <Clock className="w-4 h-4 mr-2" />
      <span className="font-mono">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};