import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from './ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function ProductGrid() {
  const { products } = useShop();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const allGridProducts = products && products.length > 0 ? products : [];
  const filterCategories = ['All', 'Kurtis', 'Co-ord Sets', 'Festive Wear'];

  const filteredProducts = selectedFilter === 'All' 
    ? allGridProducts 
    : allGridProducts.filter(p => p.category.toLowerCase().includes(selectedFilter.toLowerCase()) || selectedFilter.toLowerCase().includes(p.category.toLowerCase()));


  return (
    <section id="new-arrivals-section" className="py-20 sm:py-28 bg-[#fdfbf7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-[#d4a373]/20 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4a373] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Just Dropped</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-[#2d2624] mt-1">
              New Arrivals
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-4 py-2 rounded-full uppercase tracking-widest transition-all cursor-pointer text-[11px] ${
                  selectedFilter === cat
                    ? 'bg-[#2d2624] text-[#e6c594] border border-[#d4a373]/60 shadow-lg font-bold'
                    : 'bg-[#f8f4ee] text-[#2d2624]/80 border border-[#d4a373]/25 hover:border-[#d4a373] hover:text-[#2d2624] font-medium'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Mobile / 4-Column Desktop Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Shop More Link */}
        <div className="mt-16 text-center">
          <Link 
            to="/shop"
            className="inline-flex items-center gap-3 bg-[#39322f] text-[#f7f3ee] hover:bg-[#d4a373] px-10 py-4 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-all duration-300 shadow-lg cursor-pointer transform hover:-translate-y-0.5"
          >
            <span>Shop More Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
