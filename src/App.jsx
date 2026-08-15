import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';

// Components
import PromoBar from './components/PromoBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';
import WishlistDrawer from './components/WishlistDrawer';

// Pages
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AboutContactPage from './pages/AboutContactPage';

export default function App() {
  return (
    <Router>
      <ShopProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-[#f7f3ee] text-[#39322f] font-sans antialiased flex flex-col selection:bg-[#d4a373]/30">

          {/* Top Promo Bar */}
          <PromoBar />

          {/* Sticky Header Navigation */}
          <Navbar />

          {/* Dynamic Page Router Outlet */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<CategoryPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/about" element={<AboutContactPage />} />
              <Route path="/contact" element={<AboutContactPage />} />
              <Route path="/about-contact" element={<AboutContactPage />} />
            </Routes>
          </main>

          {/* Multi-Column Footer */}
          <Footer />

          {/* Overlay Drawers & Modals */}
          <CartDrawer />
          <QuickViewModal />
          <WishlistDrawer />

        </div>
      </ShopProvider>
    </Router>
  );
}
