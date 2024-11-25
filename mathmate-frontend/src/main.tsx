import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.tsx'
import './index.css'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.error('Missing GOOGLE_CLIENT_ID environment variable');
}

console.log('App initialization starting...');

try {
  const root = createRoot(document.getElementById('root')!);

  root.render(
    <StrictMode>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ''}>
        <App />
      </GoogleOAuthProvider>
    </StrictMode>
  );
  
  console.log('App rendered successfully');
} catch (error) {
  console.error('Failed to render app:', error);
}