import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import { useAuthStore } from './store/auth';
import { Login } from './components/auth/Login';
import Sidebar from './components/Sidebar';
import ChatAssistant from './components/ChatAssistant';
import GraphingCalculator from './components/GraphingCalculator';
import { Menu } from 'lucide-react';
import { DonateButton } from './components/common/DonateButton';
import { LoginModal } from './components/auth/LoginModal';
import { AuthGuard } from './components/auth/AuthGuard';


function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const theme = useStore((state) => state.theme);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const initializeFreeRequests = useStore((state) => state.initializeFreeRequests);

  useEffect(() => {
    initializeFreeRequests();
  }, []);

  return (
    <Router>
      <div className={`min-h-screen flex ${theme.isDark ? 'dark' : ''}`}
           style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          onProtectedClick={() => !isAuthenticated && setShowLoginModal(true)} 
        />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <DonateButton />
          </header>

          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={
                <ChatAssistant onProtectedClick={() => setShowLoginModal(true)} />
              } />
              <Route path="/graph" element={
                <AuthGuard onProtectedClick={() => setShowLoginModal(true)}>
                  <GraphingCalculator />
                </AuthGuard>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
      
    </Router>
  );
}

export default App;