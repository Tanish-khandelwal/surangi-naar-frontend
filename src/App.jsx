import React from 'react';
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

// Pages
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import RefundExchangePolicyPage from './pages/RefundExchangePolicyPage';
import DisclaimerPage from './pages/DisclaimerPage';
import AboutContactPage from './pages/AboutContactPage';
import AdminPage from './pages/AdminPage';

function MainLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#f7f3ee] text-[#39322f] font-sans antialiased flex flex-col selection:bg-[#d4a373]/30">
      {!isAdmin && <CustomCursor />}
      {!isAdmin && <PromoBar />}
      {!isAdmin && <Navbar />}

      <main className="flex-1">
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
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
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

export default function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <SmoothScroll>
          <ShopProvider>
            <ScrollToTop />
            <MainLayout />
          </ShopProvider>
        </SmoothScroll>
      </Router>
    </GoogleOAuthProvider>
  );
}
