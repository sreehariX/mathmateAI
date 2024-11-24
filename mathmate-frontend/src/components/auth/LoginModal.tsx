import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Login } from './Login';
import { useAuthStore } from '../../store/auth';

interface LoginModalProps {
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
        <Login />
      </div>
    </div>
  );
};