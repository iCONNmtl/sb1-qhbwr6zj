import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/navigation/Sidebar';
import PageContainer from './components/layout/PageContainer';
import SupportButton from './components/support/SupportButton';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import MockupGenerator from './pages/MockupGenerator';
import MockupLibrary from './pages/MockupLibrary';
import CustomMockup from './pages/CustomMockup';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import ThankYou from './pages/ThankYou';
import LegalNotice from './pages/legal/LegalNotice';
import TermsOfService from './pages/legal/TermsOfService';
import TermsOfSale from './pages/legal/TermsOfSale';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import ScheduledPosts from './pages/ScheduledPosts';
import Products from './pages/Products';
import Product from './pages/Product';
import ProductDetails from './pages/ProductDetails';
import ProductEdit from './pages/ProductEdit';
import MyProducts from './pages/MyProducts';
import Orders from './pages/Orders';
import AuthGuard from './components/AuthGuard';
import AdminGuard from './components/AdminGuard';
import { useStore } from './store/useStore';
import { useAuthState } from './hooks/useAuthState';

export default function App() {
  useAuthState();
  const { user } = useStore();
  
  return (
    <BrowserRouter>
      <div className="min-h-screen flex">
        {user && <Sidebar />}
        <PageContainer>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/mockups" element={<MockupLibrary />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/legal/mentions-legales" element={<LegalNotice />} />
            <Route path="/legal/cgu" element={<TermsOfService />} />
            <Route path="/legal/cgv" element={<TermsOfSale />} />
            <Route path="/legal/confidentialite" element={<PrivacyPolicy />} />
            
            {/* Protected Routes */}
            <Route path="/generator" element={
              <AuthGuard>
                <MockupGenerator />
              </AuthGuard>
            } />
            <Route path="/custom-mockup" element={
              <AuthGuard>
                <CustomMockup />
              </AuthGuard>
            } />
            <Route path="/dashboard" element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } />
            <Route path="/scheduled" element={
              <AuthGuard>
                <ScheduledPosts />
              </AuthGuard>
            } />
            <Route path="/settings" element={
              <AuthGuard>
                <Settings />
              </AuthGuard>
            } />
            
            {/* Product Routes */}
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/product" element={
              <AuthGuard>
                <Product />
              </AuthGuard>
            } />
            <Route path="/my-products" element={
              <AuthGuard>
                <MyProducts />
              </AuthGuard>
            } />
            <Route path="/product/edit/:id" element={
              <AuthGuard>
                <ProductEdit />
              </AuthGuard>
            } />
            <Route path="/orders" element={
              <AuthGuard>
                <Orders />
              </AuthGuard>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AuthGuard>
                <AdminGuard>
                  <AdminDashboard />
                </AdminGuard>
              </AuthGuard>
            } />
          </Routes>
        </PageContainer>
        {user && <SupportButton />}
        <Toaster position="bottom-right" />
      </div>
    </BrowserRouter>
  );
}