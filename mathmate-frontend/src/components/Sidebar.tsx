import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../store';
import { 
  MessageSquare, 
  LineChart, 
  Sun, 
  Moon,
  X,
  LogIn,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../store/auth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onProtectedClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onProtectedClick }) => {
  const { theme, toggleTheme } = useStore();
  const { isAuthenticated, logout } = useAuthStore();

  const navItems = [
    { to: '/', icon: MessageSquare, label: 'Math Assistant' },
    { to: '/graph', icon: LineChart, label: 'Graphing Calculator' },
  ];

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
        border-r border-gray-200 dark:border-gray-700
      `}
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold" style={{ color: theme.colors.primary }}>
          MathMate AI
        </h1>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
                onProtectedClick();
              }
            }}
            className={({ isActive }) => `
              flex items-center px-4 py-2 rounded-lg
              ${isActive 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
            `}
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-full px-4 py-2 rounded-lg
                   hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {theme.isDark ? (
            <Sun className="w-5 h-5 mr-3" />
          ) : (
            <Moon className="w-5 h-5 mr-3" />
          )}
          {theme.isDark ? 'Light Mode' : 'Dark Mode'}
        </button>

        {isAuthenticated ? (
          <button
            onClick={logout}
            className="flex items-center justify-center w-full px-4 py-2 rounded-lg
                     text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        ) : (
          <button
            onClick={onProtectedClick}
            className="flex items-center justify-center w-full px-4 py-2 rounded-lg
                     text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <LogIn className="w-5 h-5 mr-3" />
            Sign In
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;