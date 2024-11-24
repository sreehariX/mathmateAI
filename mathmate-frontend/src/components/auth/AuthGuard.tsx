import React from 'react';
import { useAuthStore } from '../../store/auth';
import { useStore } from '../../store/index';

interface AuthGuardProps {
  children: React.ReactNode;
  onProtectedClick: () => void;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, onProtectedClick }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    onProtectedClick();
    return null;
  }

  return <>{children}</>;
};