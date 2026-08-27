import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 5000);
    }
  };

  return (
    <section className="py-20 sm:py-24 bg-[#39322f] text-white relative overflow-hidden">
      {/* Subtle Background Graphic */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4a373]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d4a373]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        
        <span className="text-xs uppercase font-sans tracking-[0.3em] text-[#d4a373] font-semibold">
          VIP Insider Access
        </span>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Enter Into The World of Suranghi Naar
        </h2>

        <p className="font-sans text-sm sm:text-base text-gray-300 font-light max-w-lg mx-auto leading-relaxed">
          Subscribe to receive early invitations to new collection previews, private trunk shows, and an exclusive 10% welcome gift.
        </p>

        {/* Subscription Form */}
        <div className="max-w-md mx-auto pt-4">
          {isSubmitted ? (
            <div className="bg-[#d4a373]/20 border border-[#d4a373] text-[#d4a373] p-4 rounded-full flex items-center justify-center gap-2 animate-in fade-in duration-300">
              <CheckCircle2 className="w-5 h-5 text-[#d4a373]" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Welcome to Suranghi Naar. Check your inbox!
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 text-sm font-sans focus:outline-none focus:border-[#d4a373] transition-colors"
                />
              </div>

              <button
                type="submit"
                className="bg-[#d4a373] hover:bg-white hover:text-[#39322f] text-white px-8 py-3.5 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        <p className="text-[11px] text-gray-400 font-sans font-light">
          We respect your privacy. Unsubscribe anytime with one click.
        </p>

      </div>
    </section>
  );
}
