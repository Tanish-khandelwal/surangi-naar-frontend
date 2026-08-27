import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Package
} from 'lucide-react';


export default function Navbar() {
  const navigate = useNavigate();
  const {
    categories,
    cartCount,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    currentUser,
    openAuthModal,
    openAccountModal
  } = useShop();

  const navCategories = categories || [];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Main Navbar */}
      <div
        className={`w-full transition-all duration-300 border-b border-[#d4a373]/25 ${isScrolled
            ? 'bg-[#f8f4ee]/95 backdrop-blur-xl shadow-md py-3'
            : 'bg-[#f8f4ee]/90 backdrop-blur-md py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Left Nav Actions (Desktop) */}
            <div className="hidden lg:flex items-center space-x-8 text-sm font-sans tracking-wide">
              {/* Shop by Category Mega Menu Trigger */}
              <div
                className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <button
                  className="flex items-center gap-1.5 font-medium text-[#2d2624] hover:text-[#d4a373] transition-colors py-2 group cursor-pointer"
                  onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                >
                  <span className="uppercase text-xs tracking-widest font-semibold">Collections</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180 text-[#d4a373]' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isMegaMenuOpen && (
                  <div className="absolute top-full left-0 w-80 luxury-glass shadow-2xl p-6 rounded-b-2xl space-y-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-2 pb-2 border-b border-[#e8e2d9]">
                      <Sparkles className="w-4 h-4 text-[#d4a373]" />
                      <h4 className="font-serif font-bold text-[#2d2624] tracking-wide text-sm">
                        Curated Categories
                      </h4>
                    </div>

                    <ul className="space-y-3">
                      {navCategories.map((cat) => (
                        <li key={cat.slug || cat.id}>
                          <Link 
                            to={`/category/${cat.slug}`}
                            onClick={() => setIsMegaMenuOpen(false)}
                            className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f8f4ee] transition-all"
                          >
                            <div>
                              <div className="text-xs tracking-wider uppercase font-semibold text-[#2d2624] group-hover:text-[#d4a373]">
                                {cat.name}
                              </div>
                              <p className="text-[10px] text-[#2d2624]/60 font-sans">
                                {cat.description || cat.tagline}
                              </p>
                            </div>
                            <span className="text-[9px] bg-[#d4a373]/15 text-[#b58349] px-2 py-0.5 rounded-full font-bold">
                              {cat.tag || 'Explore'}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Link
                to="/shop"
                className="uppercase text-xs tracking-widest font-semibold text-[#2d2624] hover:text-[#d4a373] transition-colors py-2"
              >
                All Products
              </Link>
              <Link
                to="/about"
                className="uppercase text-xs tracking-widest font-semibold text-[#2d2624] hover:text-[#d4a373] transition-colors py-2"
              >
                Our Story
              </Link>

              {currentUser && (
                <Link
                  to="/account"
                  className="uppercase text-xs tracking-widest font-bold text-[#b58349] hover:text-[#39322f] transition-all py-1.5 px-3 rounded-full bg-[#d4a373]/15 border border-[#d4a373]/30 flex items-center gap-1.5 hover:bg-[#d4a373]/30"
                >
                  <Package className="w-3.5 h-3.5 text-[#d4a373]" />
                  <span>Track Orders</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1.5 text-[#2d2624] hover:text-[#d4a373] transition-colors cursor-pointer"
                aria-label="Open Mobile Menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Logo Center */}
            <div className="text-center group cursor-pointer">
              <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
                <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#d4a373] via-[#f3e3ca] to-[#b58349] shadow-md group-hover:scale-105 transition-transform shrink-0">
                  <img
                    src="/logo.jpg"
                    alt="Suranghi Naar Logo"
                    className="w-7 h-7 sm:w-10 sm:h-10 rounded-full object-cover border border-white"
                  />
                </div>
                <div className="text-left">
                  <h1 className="font-cinzel text-base sm:text-xl lg:text-2xl font-bold tracking-wider text-[#2d2624] leading-none group-hover:text-[#d4a373] transition-colors">
                    Suranghi Naar
                  </h1>
                  <span className="text-[7px] sm:text-[9px] uppercase tracking-[0.22em] sm:tracking-[0.28em] text-[#d4a373] font-bold block mt-0.5 whitespace-nowrap">
                    Luxury Apparel
                  </span>
                </div>
              </Link>
            </div>

            {/* Right Icons: Search, Account / Auth, Admin, Wishlist, Cart */}
            <div className="flex items-center space-x-1.5 sm:space-x-3">

              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1.5 text-[#39322f] hover:text-[#d4a373] transition-colors cursor-pointer relative"
                aria-label="Search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
              </button>

              {/* Account Button / User Profile */}
              {currentUser ? (
                <button
                  onClick={openAccountModal}
                  className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-full bg-[#d4a373]/15 hover:bg-[#d4a373]/30 border border-[#d4a373]/40 transition-all cursor-pointer"
                  title="My Account Profile"
                >
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-white"
                    />
                  ) : (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#39322f] text-[#f7f3ee] flex items-center justify-center font-serif text-[10px] sm:text-xs font-bold border border-white uppercase shrink-0">
                      {currentUser.name ? currentUser.name.charAt(0) : <User className="w-3 h-3" />}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-[#2d2624] pr-2 hidden md:inline">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#39322f] text-white hover:bg-[#d4a373] hover:text-[#39322f] transition-all cursor-pointer text-[10px] sm:text-xs font-semibold uppercase tracking-wider shadow-xs"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}



              {/* Wishlist Trigger (Desktop/Tablet) */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="hidden sm:flex p-2 text-[#39322f] hover:text-[#d4a373] transition-colors relative cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.5]" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 bg-[#d4a373] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Drawer Trigger (Always Visible) */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-1 sm:p-2 text-[#39322f] hover:text-[#d4a373] transition-colors relative cursor-pointer shrink-0"
                aria-label="Cart"
              >
                <div className="flex items-center gap-1 sm:gap-1.5 bg-[#39322f] text-[#f7f3ee] px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full hover:bg-[#d4a373] transition-colors shadow-sm">
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8]" />
                  <span className="bg-[#f7f3ee] text-[#39322f] text-[10px] sm:text-[11px] font-bold w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Secondary Quick-Links Bar */}
      <div className="hidden lg:block bg-[#fcfbfa] border-b border-[#e8e2d9]/60 py-2.5">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center space-x-12 text-xs tracking-widest uppercase font-semibold text-[#39322f]">
            {navCategories.map((cat) => (
              <li key={cat.slug || cat.id}>
                <Link to={`/category/${cat.slug}`} className="hover:text-[#d4a373] transition-colors flex items-center gap-1.5">
                  <span>{cat.name}</span>
                  <span className="text-[9px] bg-[#f7f3ee] border border-[#e8e2d9] px-2 py-0.5 rounded-full font-bold text-[#d4a373]">
                    {cat.tag || 'Explore'}
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <Link to="/shop" className="text-[#b58349] font-bold hover:underline">All Collection</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Expandable Search Overlay */}
      {isSearchOpen && (
        <div className="bg-[#fcfbfa] border-b border-[#e8e2d9] p-4 shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="max-w-3xl mx-auto relative flex items-center">
            <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
              <Search className="w-5 h-5 absolute left-4 text-[#39322f]/50" />
              <input
                type="text"
                placeholder="Search products by title, category, fabric..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f7f3ee] border border-[#e8e2d9] rounded-full pl-12 pr-24 py-3 text-xs font-sans text-[#39322f] focus:outline-none focus:border-[#d4a373]"
              />
              <button
                type="submit"
                className="absolute right-2 bg-[#39322f] text-white text-xs font-sans uppercase tracking-widest px-5 py-2 rounded-full font-semibold hover:bg-[#d4a373] transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="ml-3 p-2 text-[#39322f]/60 hover:text-[#39322f] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden animate-in fade-in duration-300">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsMobileMenuOpen(false)} />
          <div 
            className="relative w-4/5 max-w-sm bg-[#fcfbfa] h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto overscroll-contain"
            data-lenis-prevent
          >
            <div>
              <div className="pt-6 pb-4 px-5 border-b border-[#e8e2d9] flex items-center justify-between bg-[#f7f3ee]">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.jpg" alt="Suranghi Naar Logo" className="w-8 h-8 rounded-full border border-white shadow-xs shrink-0" />
                  <span className="font-cinzel text-lg font-bold text-[#39322f] leading-none">Suranghi Naar</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-200/60 text-[#39322f] transition-colors cursor-pointer"
                  aria-label="Close Mobile Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#d4a373] font-bold">
                  Categories
                </div>

                <div className="space-y-2">
                  {navCategories.map((cat) => (
                    <Link
                      key={cat.slug || cat.id}
                      to={`/category/${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#f7f3ee]/60 border border-[#e8e2d9]/60 text-sm font-sans text-[#39322f] font-semibold uppercase tracking-wide hover:border-[#d4a373]"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[9px] bg-[#d4a373]/20 text-[#b58349] px-2 py-0.5 rounded-full font-bold">
                        {cat.tag || 'Explore'}
                      </span>
                    </Link>
                  ))}

                  <Link
                    to="/shop"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#39322f] text-white text-sm font-sans font-semibold uppercase tracking-wide"
                  >
                    <span>View All Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="pt-4 border-t border-[#e8e2d9] space-y-2">
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); setIsWishlistOpen(true); }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-[#f7f3ee] border border-[#e8e2d9] text-xs uppercase tracking-wider text-[#39322f] font-semibold cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-[#d4a373]" />
                      Wishlist
                    </span>
                    <span className="bg-[#d4a373] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {wishlist.length}
                    </span>
                  </button>

                  <Link
                    to="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-3 rounded-xl bg-[#f7f3ee] border border-[#e8e2d9] text-xs uppercase tracking-wider text-[#39322f] font-semibold"
                  >
                    <span>About Us & Contact</span>
                  </Link>

                  {currentUser && (
                    <Link
                      to="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-[#d4a373]/15 border border-[#d4a373]/40 text-xs uppercase tracking-wider text-[#39322f] font-bold"
                    >
                      <span className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#d4a373]" />
                        Track Orders & Account
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#d4a373]" />
                    </Link>
                  )}
                </div>
              </div>
            </div>


            {/* Footer inside mobile menu */}
            <div className="p-5 bg-[#f7f3ee] border-t border-[#e8e2d9] text-center text-xs text-[#39322f]/70 font-sans">
              <p>Crafted with Artisanal Heritage</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
