import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { CATEGORIES_GRID } from '../data/mockData';
import { Filter, SlidersHorizontal, ChevronRight, X, Sparkles } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams();
  const { allProducts } = useShop();

  const [sortBy, setSortBy] = useState('recommended');
  const [maxPrice, setMaxPrice] = useState(40000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Find active category info
  const currentCategory = CATEGORIES_GRID.find(
    c => c.slug === slug || c.id === slug
  );
  
  const categoryTitle = currentCategory ? currentCategory.name : (slug ? slug.replace('-', ' ') : 'All Collections');

  // Filter products by category (if slug exists), price, and stock status
  let products = allProducts;

  if (slug && slug !== 'all') {
    products = products.filter(
      p => p.categorySlug === slug || p.category.toLowerCase().replace(/\s+/g, '-') === slug
    );
  }

  // Filter by price & stock
  products = products.filter(p => p.price <= maxPrice);
  if (inStockOnly) {
    products = products.filter(p => !p.isSoldOut);
  }

  // Sort products
  if (sortBy === 'price-low') {
    products.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    products.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return (
    <div className="bg-[#f7f3ee] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-sans text-[#39322f]/60 mb-6 uppercase tracking-wider">
          <Link to="/" className="hover:text-[#d4a373] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-[#d4a373] transition-colors">Collections</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#39322f] font-semibold">{categoryTitle}</span>
        </nav>

        {/* Header Title Banner */}
        <div className="bg-[#fcfbfa] border border-[#e8e2d9] rounded-2xl p-8 sm:p-12 mb-10 text-center relative overflow-hidden shadow-xs">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase font-sans tracking-[0.25em] text-[#d4a373] font-semibold">
              Boutique Edit
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#39322f] capitalize">
              {categoryTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#39322f]/70 font-sans font-light max-w-lg mx-auto">
              Handcrafted in Jaipur with pure Mulberry silks, organza drapes, and intricate artisanal embroidery.
            </p>
          </div>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fcfbfa] border border-[#e8e2d9] p-4 rounded-xl mb-8 shadow-2xs">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 bg-[#39322f] text-white px-4 py-2 rounded-lg text-xs font-sans uppercase font-semibold cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <span className="text-xs font-sans text-[#39322f]/70 font-medium">
              Showing <strong className="text-[#39322f]">{products.length}</strong> luxury styles
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-sans font-medium text-[#39322f]/70 uppercase tracking-wider hidden sm:inline">
              Sort By:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#e8e2d9] text-xs font-sans text-[#39322f] font-semibold px-4 py-2 rounded-lg focus:outline-none focus:border-[#d4a373] cursor-pointer"
            >
              <option value="recommended">Featured & Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

        </div>

        {/* Main Grid + Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 bg-[#fcfbfa] p-6 rounded-2xl border border-[#e8e2d9] h-fit">
            <div className="flex items-center justify-between border-b border-[#e8e2d9] pb-4">
              <h3 className="font-serif font-bold text-lg text-[#39322f]">Filter Catalog</h3>
              <Filter className="w-4 h-4 text-[#d4a373]" />
            </div>

            {/* Categories Filter list */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#39322f]">Categories</h4>
              <ul className="space-y-2 text-xs font-sans">
                <li>
                  <Link
                    to="/shop"
                    className={`block py-1 hover:text-[#d4a373] transition-colors ${!slug ? 'font-bold text-[#d4a373]' : 'text-[#39322f]/80'}`}
                  >
                    All Collections ({allProducts.length})
                  </Link>
                </li>
                {CATEGORIES_GRID.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/category/${cat.slug}`}
                      className={`flex items-center justify-between py-1 hover:text-[#d4a373] transition-colors ${slug === cat.slug ? 'font-bold text-[#d4a373]' : 'text-[#39322f]/80'}`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-[#39322f]/50 font-sans">{cat.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3 pt-4 border-t border-[#e8e2d9]">
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="font-semibold uppercase tracking-wider text-[#39322f]">Max Price</span>
                <span className="font-bold text-[#d4a373]">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="3000"
                max="40000"
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#d4a373] cursor-pointer"
              />
            </div>

            {/* In Stock Toggle */}
            <div className="pt-4 border-t border-[#e8e2d9]">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-[#39322f] font-medium">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-gray-300 accent-[#d4a373]"
                />
                <span>In Stock Items Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="bg-[#fcfbfa] rounded-2xl border border-[#e8e2d9] p-12 text-center space-y-4">
                <Sparkles className="w-10 h-10 text-[#d4a373] mx-auto" />
                <h3 className="font-serif text-2xl font-bold text-[#39322f]">No styles match your filters</h3>
                <p className="text-xs text-[#39322f]/60 font-sans">Try adjusting the price slider or selecting another category.</p>
                <button
                  onClick={() => { setMaxPrice(40000); setInStockOnly(false); }}
                  className="bg-[#39322f] text-white text-xs uppercase font-sans tracking-widest px-6 py-2.5 rounded-full font-semibold cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="relative w-4/5 max-w-xs bg-[#fcfbfa] h-full shadow-2xl p-6 z-10 space-y-6 overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-serif font-bold text-lg text-[#39322f]">Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)}><X className="w-6 h-6" /></button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#39322f]">Category</h4>
              <div className="flex flex-col gap-2 text-xs">
                {CATEGORIES_GRID.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="py-1 text-[#39322f]/80 hover:text-[#d4a373]"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <span className="text-xs font-semibold uppercase">Max Price: ₹{maxPrice.toLocaleString('en-IN')}</span>
              <input
                type="range"
                min="3000"
                max="40000"
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#d4a373]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
