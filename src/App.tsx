import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppContent from './AppContent';
import { useAuthState } from './hooks/useAuthState';

export default function App() {
  useAuthState();
  
  return (
    <BrowserRouter>
      <AppContent />
      <Toaster position="bottom-right" />
    </BrowserRouter>
  );
}