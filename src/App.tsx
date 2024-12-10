import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MockupGenerator from './pages/MockupGenerator';
import AdminDashboard from './pages/AdminDashboard';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import LegalNotice from './pages/legal/LegalNotice';
import TermsOfService from './pages/legal/TermsOfService';
import TermsOfSale from './pages/legal/TermsOfSale';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import AuthGuard from './components/AuthGuard';
import AdminGuard from './components/AdminGuard';
import { useAuth } from './hooks/useAuth';

function App() {
  useAuth(); // Initialize authentication listener

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/legal/mentions-legales" element={<LegalNotice />} />
            <Route path="/legal/cgu" element={<TermsOfService />} />
            <Route path="/legal/cgv" element={<TermsOfSale />} />
            <Route path="/legal/confidentialite" element={<PrivacyPolicy />} />
            <Route path="/generator" element={
              <AuthGuard>
                <MockupGenerator />
              </AuthGuard>
            } />
            <Route path="/dashboard" element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } />
            <Route path="/admin" element={
              <AuthGuard>
                <AdminGuard>
                  <AdminDashboard />
                </AdminGuard>
              </AuthGuard>
            } />
          </Routes>
        </main>
        <Footer />
        <Toaster position="bottom-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;