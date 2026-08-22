import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import NotFoundPage from './NotFoundPage';
import { getImageUrl } from '../utils/image';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Plus, 
  Minus, 
  Check, 
  ChevronRight,
  ChevronLeft,
  Phone,
  MessageCircle,
  Sparkles
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { allProducts, storeSettings, addToCart, toggleWishlist, isInWishlist, loading } = useShop();
  const BRAND_CONTACT = storeSettings || {};

  const product = (allProducts || []).find(p => p.id === id);

  const productColors = (product?.colorVariants && product.colorVariants.length > 0)
    ? product.colorVariants
    : (product?.colors && product.colors.length > 0
        ? product.colors.map(c => ({
            name: typeof c === 'object' ? c.name : c,
            hex: typeof c === 'object' ? c.hex : '#5a2d82',
            images: [product.image, product.secondaryImage || product.image].filter(Boolean)
          }))
        : [{ name: 'Royal Purple', hex: '#5a2d82', images: [product?.image, product?.secondaryImage || product?.image].filter(Boolean) }]);

  const [selectedColor, setSelectedColor] = useState(productColors[0]);
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes ? product.sizes[0] : 'Free Size'
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Gallery Images Array for the currently selected color
  const galleryImages = (selectedColor?.images && selectedColor.images.length > 0)
    ? selectedColor.images
    : (selectedColor?.image ? [selectedColor.image, ...(selectedColor.secondaryImage ? [selectedColor.secondaryImage] : [])] : [product?.image].filter(Boolean));

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Touch swipe state for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    if (!product || !product.id) return;
    const cols = (product.colorVariants && product.colorVariants.length > 0)
      ? product.colorVariants
      : (product.colors && product.colors.length > 0
          ? product.colors.map(c => ({
              name: typeof c === 'object' ? c.name : c,
              hex: typeof c === 'object' ? c.hex : '#5a2d82',
              images: [product.image, product.secondaryImage || product.image].filter(Boolean)
            }))
          : [{ name: 'Royal Purple', hex: '#5a2d82', images: [product.image, product.secondaryImage || product.image].filter(Boolean) }]);
    setSelectedColor(cols[0]);
    setSelectedSize(product.sizes ? product.sizes[0] : 'Free Size');
    setQuantity(1);
    setActiveImageIndex(0);
  }, [product?.id, product?.colorVariants, product?.colors, product?.sizes, product?.image]);

  // Reset active image index when color changes
  const handleColorChange = (col) => {
    setSelectedColor(col);
    setActiveImageIndex(0);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 40) {
      handleNextImage();
    } else if (distance < -40) {
      handlePrevImage();
    }
  };

  const isWishlisted = isInWishlist(product?.id);
  const relatedProducts = (allProducts || []).filter(p => p?.id && p.id !== product?.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!product?.id || product.isSoldOut) return;
    addToCart(product, selectedColor, selectedSize, quantity);
  };

  if (loading || !allProducts) {
    return (
      <div className="bg-[#f7f3ee] min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-2 border-[#d4a373] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="font-serif text-xl font-bold text-[#39322f] mb-2">Loading Product Details...</h2>
        <p className="text-xs text-[#39322f]/60 mb-6 font-sans">Fetching artisanal details from Surangi Naar studio.</p>
      </div>
    );
  }

  if (!product) {
    return <NotFoundPage />;
  }

  return (
    <div className="bg-[#f7f3ee] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#39322f]/60 mb-8 font-sans">
          <Link to="/" className="hover:text-[#39322f] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-[#39322f] transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#39322f] font-semibold truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          
          {/* Main Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnail Strip: Left column on desktop (sm:flex-col), bottom row on mobile */}
            {galleryImages.length > 1 && (
              <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto no-scrollbar max-h-[540px] shrink-0 justify-center sm:justify-start">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[3/4] w-14 sm:w-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-[#f8f4ee] shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-[#d4a373] ring-2 ring-[#d4a373]/30 scale-105 shadow-md'
                        : 'border-[#e8e2d9] opacity-70 hover:opacity-100 hover:border-[#d4a373]/60'
                    }`}
                  >
                    <img src={getImageUrl(imgUrl)} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Display Image */}
            <div className="relative aspect-[3/4] w-full luxury-glass rounded-3xl overflow-hidden border border-[#d4a373]/30 shadow-xl group flex-1">
              <div 
                className="w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <img
                  src={getImageUrl(galleryImages[activeImageIndex] || galleryImages[0])}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-all duration-500"
                />
              </div>

              {product.badge && (
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                  <span className="bg-[#39322f] text-white text-[10px] uppercase font-sans tracking-widest px-3.5 py-1.5 rounded-full font-bold shadow-md flex items-center gap-1.5 border border-[#d4a373]/40">
                    <Sparkles className="w-3 h-3 text-[#d4a373]" />
                    {product.badge}
                  </span>
                </div>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 p-3 rounded-full bg-white/80 backdrop-blur-md text-[#39322f] hover:bg-white hover:text-rose-500 transition-all duration-300 shadow-lg z-10 cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              {/* Left / Right Navigation Arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    aria-label="Previous Image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/80 hover:bg-white text-[#39322f] shadow-lg backdrop-blur-xs transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    aria-label="Next Image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/80 hover:bg-white text-[#39322f] shadow-lg backdrop-blur-xs transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Mobile Dot Indicators */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10 sm:hidden">
                  {galleryImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        activeImageIndex === idx ? 'w-5 bg-[#d4a373]' : 'w-1.5 bg-white/70 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Purchasing Info */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-sans tracking-widest text-[#d4a373] font-bold">
                  {product.category || 'Luxury Ensemble'}
                </span>
                {product.rating && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-[#39322f]">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#d4a373]" />
                      ))}
                    </div>
                    <span>({product.rating})</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#39322f] leading-tight">
                {product.name}
              </h1>

              {/* Price Row */}
              <div className="flex items-baseline gap-4 border-b border-[#e8e2d9] pb-4">
                <span className="font-serif text-3xl font-bold text-[#39322f]">
                  ₹{(product.price || 0).toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[#39322f]/40 line-through font-sans">
                    ₹{(product.originalPrice || 0).toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md">
                  Inclusive of all taxes
                </span>
              </div>

              {/* Description summary */}
              <p className="text-sm text-[#39322f]/80 font-sans font-light leading-relaxed">
                {product.description}
              </p>

              {/* Color Swatch Picker */}
              {productColors && productColors.length > 0 && (
                <div className="space-y-2.5">
                  <label className="block text-xs uppercase font-semibold text-[#39322f] tracking-wider">
                    Select Color: <span className="text-[#d4a373]">{selectedColor?.name || productColors[0]?.name}</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {productColors.map((col, idx) => {
                      const hexColor = (typeof col === 'object' ? col.hex : col) || '#5a2d82';
                      const colorName = (typeof col === 'object' ? col.name : col) || 'Royal Purple';
                      const isSelected = (selectedColor?.name === colorName) || (selectedColor?.hex === hexColor);
                      const isLightColor = ['#ffffff', '#fff', '#fffff0', '#fdfbf7', '#f8f4ee'].includes(hexColor.toLowerCase());

                      return (
                        <button
                          key={idx}
                          onClick={() => handleColorChange(col)}
                          title={colorName}
                          className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                            isSelected ? 'ring-2 ring-[#d4a373] border-white scale-110 shadow-sm' : 'border-gray-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: hexColor }}
                        >
                          {isSelected && (
                            <Check className={`w-4 h-4 ${isLightColor ? 'text-gray-900' : 'text-white'} drop-shadow-xs`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2.5">
                  <label className="block text-xs uppercase font-semibold text-[#39322f] tracking-wider">
                    Select Size: <span className="text-[#d4a373]">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-4 py-2 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'bg-[#39322f] text-white shadow-md'
                            : 'bg-[#f7f3ee] text-[#39322f] hover:bg-[#e8e2d9]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-2.5">
                <label className="block text-xs uppercase font-semibold text-[#39322f] tracking-wider">
                  Quantity
                </label>
                <div className="inline-flex items-center border border-[#e8e2d9] rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 hover:bg-gray-100 text-[#39322f] cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-5 text-sm font-semibold font-sans text-[#39322f]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 hover:bg-gray-100 text-[#39322f] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-6 border-t border-[#e8e2d9]">
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.isSoldOut}
                  className={`flex-1 py-4 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                    product.isSoldOut
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#39322f] hover:bg-[#d4a373] text-white'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{product.isSoldOut ? 'Sold Out' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="p-4 rounded-full border border-[#e8e2d9] bg-[#f7f3ee] hover:bg-white text-[#39322f] transition-colors cursor-pointer shadow-sm"
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#c59b27] text-[#c59b27]' : ''}`} />
                </button>
              </div>

              {/* Direct Concierge Contact Box */}
              <div className="bg-[#f7f3ee] p-4 rounded-2xl border border-[#e8e2d9] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#d4a373]" />
                  <span className="font-semibold text-[#39322f]">Need custom fitting or advice?</span>
                </div>
                <div className="flex items-center gap-3">
                  <a 
                    href={`tel:${BRAND_CONTACT.phone}`}
                    className="flex items-center gap-1 text-[#39322f] hover:text-[#d4a373] font-semibold"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#d4a373]" />
                    <span>{BRAND_CONTACT.phone}</span>
                  </a>
                  <a 
                    href={BRAND_CONTACT.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1 rounded-full font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Tabbed Product Details: Description, Fabric & Care, Delivery */}
        <div className="bg-[#fcfbfa] rounded-3xl p-6 sm:p-12 border border-[#e8e2d9] shadow-sm mb-16">
          <div className="flex overflow-x-auto no-scrollbar border-b border-[#e8e2d9] text-xs font-semibold uppercase tracking-wider gap-4 sm:gap-8 whitespace-nowrap">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'description' ? 'text-[#d4a373] border-b-2 border-[#d4a373]' : 'text-[#39322f]/60 hover:text-[#39322f]'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('fabric')}
              className={`pb-4 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'fabric' ? 'text-[#d4a373] border-b-2 border-[#d4a373]' : 'text-[#39322f]/60 hover:text-[#39322f]'
              }`}
            >
              Fabric & Craftsmanship
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-4 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'shipping' ? 'text-[#d4a373] border-b-2 border-[#d4a373]' : 'text-[#39322f]/60 hover:text-[#39322f]'
              }`}
            >
              Shipping & Returns
            </button>
          </div>

          <div className="pt-6 text-sm text-[#39322f]/80 font-sans font-light leading-relaxed">
            {activeTab === 'description' && (
              <p>{product.description}</p>
            )}
            {activeTab === 'fabric' && (
              <div className="space-y-3">
                <p><strong>Fabric Composition:</strong> {product.fabric || '100% Pure Mulberry Silk & Handprinted Organza'}</p>
                {product.craftsmanship && (
                  <p><strong>Craftsmanship & Embroidery:</strong> {product.craftsmanship}</p>
                )}
                <p><strong>Care Instructions:</strong> {product.care || 'Dry clean only. Store in pure cotton wrapping.'}</p>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="space-y-2">
                <p>{product.shipping || 'Complimentary express shipping across India on orders above ₹5,000.'}</p>
                <p>14-Day Hassle-Free Returns & Exchanges available on all non-customized garments.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#39322f] mb-8">
            You May Also Love
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
