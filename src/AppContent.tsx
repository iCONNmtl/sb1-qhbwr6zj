import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/navigation/Sidebar';
import PageContainer from './components/layout/PageContainer';
import SupportButton from './components/support/SupportButton';
import AnnouncementBanner from './components/AnnouncementBanner';
import CookieConsent from './components/CookieConsent';
import { useScrollToTop } from './hooks/useScrollToTop';
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
import ServiceDetails from './pages/ServiceDetails';
import MyProducts from './pages/MyProducts';
import Orders from './pages/Orders';
import Training from './pages/Training';
import TrainingDetails from './pages/TrainingDetails';
import DesignGenerator from './pages/DesignGenerator';
import AuthGuard from './components/AuthGuard';
import AdminGuard from './components/AdminGuard';
import { useStore } from './store/useStore';

export default function AppContent() {
  useScrollToTop();
  const { user } = useStore();
  const [showBanner, setShowBanner] = React.useState(true);
  
  return (
    <div className="min-h-screen flex flex-col">
      {showBanner && <AnnouncementBanner onClose={() => setShowBanner(false)} />}
      <div className="flex flex-1">
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
            
            {/* Training Routes */}
            <Route path="/training" element={<Training />} />
            <Route path="/training/:id" element={<TrainingDetails />} />
            
            {/* Product Routes */}
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/services/:id" element={<ServiceDetails />} />
            
            {/* Protected Routes */}
            <Route path="/generator" element={
              <AuthGuard>
                <MockupGenerator />
              </AuthGuard>
            } />
            <Route path="/design-generator" element={
              <AuthGuard>
                <DesignGenerator />
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
      </div>
      <CookieConsent />
    </div>
  );
}