import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PromoBar() {
  const { promoMessages } = useShop();
  const [currentIndex, setCurrentIndex] = useState(0);

  const messages = promoMessages && promoMessages.length > 0 ? promoMessages : ["Welcome to Suranghi Naar"];


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [messages.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % messages.length);
  };

  return (
    <div className="bg-[#1a1716] text-[#f8f4ee] text-xs font-sans tracking-widest uppercase py-2.5 px-4 relative z-20 border-b border-[#d4a373]/30 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button 
          onClick={handlePrev}
          aria-label="Previous Promo"
          className="text-white/60 hover:text-[#d4a373] transition-colors p-1 hidden sm:block cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1 text-center flex items-center justify-center gap-2 transition-all duration-500 ease-in-out">
          <Sparkles className="w-3.5 h-3.5 text-[#d4a373] animate-pulse shrink-0 hidden xs:inline" />
          <span className="font-semibold text-[10px] sm:text-xs text-[#e6c594] tracking-[0.15em]">
            {messages[currentIndex % messages.length]}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#d4a373] animate-pulse shrink-0 hidden xs:inline" />
        </div>

        <button 
          onClick={handleNext}
          aria-label="Next Promo"
          className="text-white/60 hover:text-[#d4a373] transition-colors p-1 hidden sm:block cursor-pointer"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

