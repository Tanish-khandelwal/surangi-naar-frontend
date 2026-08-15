import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { CATEGORIES_LIST } from '../data/mockData';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Truck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const {
    cartCount,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
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
                      {CATEGORIES_LIST.map((cat) => (
                        <li key={cat.slug}>
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
                                {cat.description}
                              </p>
                            </div>
                            <span className="text-[9px] bg-[#d4a373]/15 text-[#b58349] px-2 py-0.5 rounded-full font-bold">
                              {cat.tag}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 border-t border-[#e8e2d9]">
                      <Link 
                        to="/shop" 
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="text-xs font-semibold tracking-wider uppercase text-[#2d2624] hover:text-[#d4a373] flex items-center justify-between"
                      >
                        <span>View All Products</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Links for 3 Categories */}
              {CATEGORIES_LIST.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className="text-xs uppercase tracking-widest font-medium text-[#2d2624]/80 hover:text-[#d4a373] transition-colors"
                >
                  {cat.name}
                </Link>
              ))}

              {/* About & Contact Link */}
              <Link
                to="/about"
                className="text-xs uppercase tracking-widest font-medium text-[#2d2624]/80 hover:text-[#d4a373] transition-colors"
              >
                <span>About & Contact</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-[#2d2624] hover:text-[#d4a373] transition-colors cursor-pointer"
                aria-label="Open Mobile Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Logo Center */}
            <div className="text-center group cursor-pointer">
              <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
                <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#d4a373] via-[#f3e3ca] to-[#b58349] shadow-md group-hover:scale-105 transition-transform">
                  <img
                    src="/logo.jpg"
                    alt="Surangi Naar Logo"
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border border-white"
                  />
                </div>
                <div className="text-left">
                  <h1 className="font-cinzel text-lg sm:text-2xl font-bold tracking-wider text-[#2d2624] leading-none group-hover:text-[#d4a373] transition-colors">
                    Surangi Naar
                  </h1>
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.28em] text-[#d4a373] font-bold block mt-0.5">
                    Luxury Apparel
                  </span>
                </div>
              </Link>
            </div>

            {/* Right Icons: Search, Account, Wishlist, Cart */}
            <div className="flex items-center space-x-3 sm:space-x-5">

              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-[#39322f] hover:text-[#d4a373] transition-colors cursor-pointer relative"
                aria-label="Search"
              >
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>

              {/* Account Icon */}
              <Link
                to="/contact"
                className="p-2 text-[#39322f] hover:text-[#d4a373] transition-colors hidden sm:block cursor-pointer"
                aria-label="Account"
              >
                <User className="w-5 h-5 stroke-[1.5]" />
              </Link>

              {/* Wishlist Trigger */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="p-2 text-[#39322f] hover:text-[#d4a373] transition-colors relative cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.5]" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 bg-[#d4a373] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-[#39322f] hover:text-[#d4a373] transition-colors relative cursor-pointer group"
                aria-label="Cart"
              >
                <div className="flex items-center gap-2 bg-[#39322f] text-[#f7f3ee] px-3.5 py-1.5 rounded-full hover:bg-[#d4a373] transition-colors shadow-sm">
                  <ShoppingBag className="w-4 h-4 stroke-[1.8]" />
                  <span className="text-xs font-semibold uppercase tracking-wider hidden xs:inline">
                    Cart
                  </span>
                  <span className="bg-[#f7f3ee] text-[#39322f] text-[11px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center ml-0.5">
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
            {CATEGORIES_LIST.map((cat) => (
              <li key={cat.slug}>
                <Link to={`/category/${cat.slug}`} className="hover:text-[#d4a373] transition-colors flex items-center gap-1.5">
                  <span>{cat.name}</span>
                  <span className="text-[9px] bg-[#f7f3ee] border border-[#e8e2d9] px-2 py-0.5 rounded-full font-bold text-[#d4a373]">
                    {cat.tag}
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
            <form onSubmit={handleSearchSubmit} className="w-full flex items-center gap-3">
              <Search className="w-5 h-5 text-[#39322f]/50" />
              <input
                type="text"
                placeholder="Search Kurtis, Co-ord Sets, Festive Wear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent border-none outline-none text-sm font-sans text-[#39322f] placeholder-[#39322f]/40 py-2"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-[#39322f]/60 hover:text-[#39322f] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-[#fcfbfa] h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
            <div>
              {/* Header */}
              <div className="p-5 border-b border-[#e8e2d9] flex items-center justify-between bg-[#f7f3ee]">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/logo.jpg"
                    alt="Surangi Naar Logo"
                    className="w-9 h-9 rounded-full object-cover border border-[#d4a373]/40 shadow-xs"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#39322f] leading-tight">Surangi Naar</h3>
                    <span className="text-[8px] uppercase tracking-widest text-[#d4a373] font-semibold block">Jaipur</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-[#39322f] hover:text-[#d4a373]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Category Links List */}
              <div className="p-5 space-y-4">
                <div className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#d4a373] font-bold">
                  Categories
                </div>

                <div className="space-y-2">
                  {CATEGORIES_LIST.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/category/${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#f7f3ee]/60 border border-[#e8e2d9]/60 text-sm font-sans text-[#39322f] font-semibold uppercase tracking-wide hover:border-[#d4a373]"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[9px] bg-[#d4a373]/20 text-[#b58349] px-2 py-0.5 rounded-full font-bold">
                        {cat.tag}
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

                <div className="pt-4 border-t border-[#e8e2d9] space-y-3">
                  <Link
                    to="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#39322f] font-semibold block"
                  >
                    <span>About Us & Contact</span>
                  </Link>
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
