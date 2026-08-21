import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { getImageUrl } from '../utils/image';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Plus, 
  Minus, 
  Check, 
  ChevronRight,
  Phone,
  MessageCircle,
  Sparkles
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { allProducts, storeSettings, addToCart, toggleWishlist, isInWishlist } = useShop();
  const BRAND_CONTACT = storeSettings || {};

  const product = (allProducts || []).find(p => p.id === id) || (allProducts && allProducts[0]) || {};

  const productColors = product.colors && product.colors.length > 0
    ? product.colors
    : [{ name: 'Royal Purple', hex: '#5a2d82' }];

  const [selectedColor, setSelectedColor] = useState(productColors[0]);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes ? product.sizes[0] : 'Free Size'
  );
  const [quantity, setQuantity] = useState(1);
  const activeImage = product.image;
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const cols = product.colors && product.colors.length > 0
      ? product.colors
      : [{ name: 'Royal Purple', hex: '#5a2d82' }];
    setSelectedColor(cols[0]);
    setSelectedSize(product.sizes ? product.sizes[0] : 'Free Size');
    setQuantity(1);
  }, [product.id, product.colors, product.sizes]);

  const isWishlisted = isInWishlist(product.id);
  const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (product.isSoldOut) return;
    addToCart(product, selectedColor, selectedSize, quantity);
  };

  return (
    <div className="bg-[#f7f3ee] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-sans text-[#39322f]/60 mb-8 uppercase tracking-wider">
          <Link to="/" className="hover:text-[#d4a373] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/category/${product.categorySlug || 'kurtis'}`} className="hover:text-[#d4a373] transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#39322f] font-semibold line-clamp-1">{product.name}</span>
        </nav>

        {/* Product Hero Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 bg-[#fcfbfa] rounded-3xl p-6 sm:p-10 border border-[#e8e2d9] shadow-sm mb-16">
          
          {/* Left Column: Multi-Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#f7f3ee] border border-[#e8e2d9] relative shadow-inner">
              <img
                src={getImageUrl(activeImage)}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-all duration-500"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {product.isSoldOut ? (
                  <span className="bg-[#231f1e] text-white text-[10px] uppercase font-sans tracking-widest px-3 py-1 rounded-sm font-bold shadow-md">
                    Sold Out
                  </span>
                ) : product.badge ? (
                  <span className="bg-[#d4a373] text-white text-[10px] uppercase font-sans tracking-widest px-3 py-1 rounded-sm font-bold shadow-md">
                    {product.badge}
                  </span>
                ) : null}
              </div>
            </div>

          </div>

          {/* Right Column: Product Form & Info */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              
              {/* Category Tag & Rating */}
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-[0.2em] font-semibold text-[#d4a373]">
                  {product.category}
                </span>
                {product.rating && (
                  <div className="flex items-center gap-1.5 font-sans font-semibold text-[#39322f]">
                    <div className="flex text-[#d4a373]">
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
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[#39322f]/40 line-through font-sans">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
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
                          onClick={() => setSelectedColor(col)}
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
              <div className="space-y-2">
                <p><strong>Fabric:</strong> {product.fabric || '100% Pure Mulberry Silk & Handprinted Organza'}</p>
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
