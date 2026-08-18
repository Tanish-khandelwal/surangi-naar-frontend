import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Sparkles, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';


export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle
  } = useShop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    loginWithEmail(email, password);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!email || !name) return;
    registerWithEmail(name, email, phone, password);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#d4a373]/30 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-[#39322f] overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-[#39322f] rounded-full hover:bg-[#f8f4ee] transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Logo & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#f8f4ee] text-[#b58349] border border-[#d4a373]/30 mb-3 shadow-xs">
            <Sparkles className="w-6 h-6 text-[#d4a373]" />
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-[#2d2624]">Surangi Naar Atelier</h2>
          <p className="text-xs text-gray-500 font-sans mt-1">Sign in to access your luxury account & order history</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#f8f4ee] p-1 rounded-2xl border border-[#e8e2d9] mb-6">
          <button
            type="button"
            onClick={() => setAuthModalTab('login')}
            className={`flex-1 py-2 text-xs font-sans uppercase tracking-wider font-bold rounded-xl transition-all cursor-pointer ${
              authModalTab === 'login'
                ? 'bg-[#39322f] text-[#f7f3ee] shadow-xs'
                : 'text-gray-600 hover:text-[#39322f]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthModalTab('register')}
            className={`flex-1 py-2 text-xs font-sans uppercase tracking-wider font-bold rounded-xl transition-all cursor-pointer ${
              authModalTab === 'register'
                ? 'bg-[#39322f] text-[#f7f3ee] shadow-xs'
                : 'text-gray-600 hover:text-[#39322f]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* 1-Click Google Login Button */}
        <div className="mb-5">
          <button
            type="button"
            onClick={() => loginWithGoogle()}
            className="w-full bg-white border border-[#e8e2d9] hover:border-[#d4a373] text-[#39322f] font-semibold py-3 px-4 rounded-2xl text-xs font-sans transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xs hover:bg-[#f8f4ee]"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.14C3.26 21.3 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.59H1.29C.47 8.23 0 10.06 0 12s.47 3.77 1.29 5.41l3.99-3.14z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.59l3.99 3.14c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-[#e8e2d9] w-full" />
          <span className="bg-white px-3 text-[10px] uppercase font-sans tracking-widest text-gray-400 font-semibold absolute">or email</span>
        </div>

        {/* SIGN IN FORM */}
        {authModalTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="ananya.sharma@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl pl-10 pr-4 py-3 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl pl-10 pr-4 py-3 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 accent-[#d4a373]"
                />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-[#b58349] font-bold hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-bold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 mt-2"
            >
              <span>Sign In to Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* CREATE ACCOUNT FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs font-sans">
            <div>
              <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="Ananya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl pl-10 pr-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="ananya.sharma@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl pl-10 pr-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl pl-10 pr-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl pl-10 pr-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-bold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 mt-3"
            >
              <span>Create Account</span>

              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Demo Fast Login Helper */}
        <div className="mt-5 pt-4 border-t border-[#e8e2d9] text-center">
          <button
            type="button"
            onClick={() => loginWithEmail('ananya.sharma@gmail.com')}
            className="text-[11px] text-[#b58349] hover:underline font-bold"
          >
            ⚡ Quick Demo Sign In as Ananya Sharma
          </button>
        </div>

      </div>
    </div>
  );
}
