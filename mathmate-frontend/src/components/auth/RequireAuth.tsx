import React from 'react';
import { LogIn } from 'lucide-react';

interface RequireAuthProps {
  onLoginClick: () => void;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ onLoginClick }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="max-w-md text-center">
        <LogIn className="w-16 h-16 mx-auto mb-4 text-blue-500" />
        <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Please sign in to access this feature
        </p>
        <button
          onClick={onLoginClick}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};