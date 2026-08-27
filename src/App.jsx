import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ShopProvider } from './context/ShopContext';

// Components
import PromoBar from './components/PromoBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';
import WishlistDrawer from './components/WishlistDrawer';
import AuthModal from './components/AuthModal';
import AccountModal from './components/AccountModal';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';

import HomePage from './pages/HomePage';

// Lazy-Loaded Secondary Page Components (Route-Level Code Splitting)
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const RefundExchangePolicyPage = lazy(() => import('./pages/RefundExchangePolicyPage'));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage'));
const AboutContactPage = lazy(() => import('./pages/AboutContactPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function PageLoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#f7f3ee]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-[#d4a373]/30 border-t-[#d4a373] rounded-full animate-spin" />
        <span className="font-cinzel text-xs text-[#39322f] tracking-widest uppercase font-semibold">Surangi Naar</span>
      </div>
    </div>
  );
}

function MainLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#f7f3ee] text-[#39322f] font-sans antialiased flex flex-col selection:bg-[#d4a373]/30">
      {!isAdmin && <CustomCursor />}
      {!isAdmin && <PromoBar />}
      {!isAdmin && <Navbar />}

      <main className="flex-1">
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<CategoryPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            
            {/* Information Routes */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/contact-us" element={<ContactPage />} />

            {/* Legal Routes */}
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/refund-exchange-policy" element={<RefundExchangePolicyPage />} />
            <Route path="/refund-policy" element={<RefundExchangePolicyPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />

            <Route path="/about-contact" element={<AboutContactPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/admin" element={<AdminPage />} />

            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdmin && <Footer />}
      {!isAdmin && <CartDrawer />}
      {!isAdmin && <QuickViewModal />}
      {!isAdmin && <WishlistDrawer />}
      <AuthModal />
      <AccountModal />
    </div>
  );
}

import { Toaster } from 'react-hot-toast';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <SmoothScroll>
          <ShopProvider>
            <ScrollToTop />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#f7f3ee',
                  color: '#39322f',
                  border: '1px solid #d4a373',
                  borderRadius: '16px',
                  padding: '12px 16px',
                  fontSize: '13px',
                  fontWeight: '600',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                },
                success: {
                  iconTheme: {
                    primary: '#d4a373',
                    secondary: '#f7f3ee',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#e11d48',
                    secondary: '#f7f3ee',
                  },
                },
              }}
            />
            <MainLayout />
          </ShopProvider>
        </SmoothScroll>
      </Router>
    </GoogleOAuthProvider>
  );
}
