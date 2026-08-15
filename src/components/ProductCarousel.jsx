import React, { useRef } from 'react';
import { PRODUCTS_CURATED } from '../data/mockData';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function ProductCarousel() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-[#fcfbfa] border-b border-[#e8e2d9]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4a373] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Signature Edits</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#39322f] mt-1">
              Curated by Prints
            </h2>
          </div>

          {/* Navigation Scroll Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="p-3 rounded-full border border-[#e8e2d9] bg-[#f7f3ee] hover:bg-[#39322f] hover:text-white text-[#39322f] transition-all cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="p-3 rounded-full border border-[#e8e2d9] bg-[#f7f3ee] hover:bg-[#39322f] hover:text-white text-[#39322f] transition-all cursor-pointer shadow-xs"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Track Container */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-1 px-1 -mx-1"
        >
          {PRODUCTS_CURATED.map((product) => (
            <div 
              key={product.id} 
              className="w-[260px] sm:w-[300px] lg:w-[320px] shrink-0"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
