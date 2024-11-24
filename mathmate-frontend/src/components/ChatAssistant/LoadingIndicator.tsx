import React, { useEffect, useState } from 'react';

interface LoadingIndicatorProps {
  startTime: number;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ startTime }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 100);

    return () => clearInterval(timer);
  }, [startTime]);

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" 
             style={{ animationDelay: '0s' }} />
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" 
             style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" 
             style={{ animationDelay: '0.4s' }} />
      </div>
      <span className="text-sm text-gray-500">
        Mathmate is thinking... ({(elapsedTime / 1000).toFixed(1)}s)
      </span>
    </div>
  );
};

export default LoadingIndicator;