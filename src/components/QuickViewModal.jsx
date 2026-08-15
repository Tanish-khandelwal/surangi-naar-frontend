import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Plus, 
  Minus,
  Check
} from 'lucide-react';

export default function QuickViewModal() {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist 
  } = useShop();

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const [selectedColor, setSelectedColor] = useState(
    product.colors ? product.colors[0] : null
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes ? product.sizes[0] : 'Free Size'
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image);

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (product.isSoldOut) return;
    addToCart(product, selectedColor, selectedSize, quantity);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-[#fcfbfa] rounded-2xl shadow-2xl overflow-hidden border border-[#e8e2d9] grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#39322f] shadow-md transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Column 1: Image Gallery Preview */}
        <div className="p-6 bg-[#f7f3ee] flex flex-col justify-between">
          <div className="aspect-[3/4] w-full rounded-xl overflow-hidden shadow-md bg-white">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Thumbnails row */}
          {product.secondaryImage && (
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => setSelectedImage(product.image)}
                className={`w-16 h-20 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedImage === product.image ? 'border-[#d4a373] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={product.image} alt="Thumbnail 1" className="w-full h-full object-cover" />
              </button>
              <button
                onClick={() => setSelectedImage(product.secondaryImage)}
                className={`w-16 h-20 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedImage === product.secondaryImage ? 'border-[#d4a373] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={product.secondaryImage} alt="Thumbnail 2" className="w-full h-full object-cover" />
              </button>
            </div>
          )}
        </div>

        {/* Column 2: Product Details & Purchase Form */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Category & Badge */}
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-widest font-semibold text-[#d4a373]">
                {product.category}
              </span>
              {product.isSoldOut ? (
                <span className="bg-[#231f1e] text-white text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded font-bold">
                  Sold Out
                </span>
              ) : product.badge ? (
                <span className="bg-[#d4a373]/20 text-[#b58349] text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded font-bold">
                  {product.badge}
                </span>
              ) : null}
            </div>

            {/* Title & Rating */}
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#39322f]">
                {product.name}
              </h2>
              {product.rating && (
                <div className="flex items-center gap-1.5 mt-1 text-xs text-[#39322f]/80">
                  <div className="flex text-[#d4a373]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#d4a373]" />
                    ))}
                  </div>
                  <span className="font-semibold">({product.rating})</span>
                </div>
              )}
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-2xl font-bold text-[#39322f]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#39322f]/40 line-through font-sans">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-[#39322f]/80 font-sans font-light leading-relaxed">
              {product.description}
            </p>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs uppercase font-semibold text-[#39322f] tracking-wider">
                  Color: <span className="text-[#d4a373]">{selectedColor?.name}</span>
                </label>
                <div className="flex items-center gap-3">
                  {product.colors.map((col, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(col)}
                      className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                        selectedColor?.name === col.name ? 'ring-2 ring-[#d4a373] border-white scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: col.hex }}
                    >
                      {selectedColor?.name === col.name && (
                        <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs uppercase font-semibold text-[#39322f] tracking-wider">
                  Size: <span className="text-[#d4a373]">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-1.5 rounded-md text-xs font-sans font-semibold transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-[#39322f] text-white shadow-sm'
                          : 'bg-[#f7f3ee] text-[#39322f] hover:bg-[#e8e2d9]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="block text-xs uppercase font-semibold text-[#39322f] tracking-wider">
                Quantity
              </label>
              <div className="inline-flex items-center border border-[#e8e2d9] rounded-md bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 text-[#39322f] cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-semibold font-sans text-[#39322f]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100 text-[#39322f] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Action Buttons & Value Highlights */}
          <div className="space-y-4 pt-4 border-t border-[#e8e2d9]">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.isSoldOut}
                className={`flex-1 py-3.5 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
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
                className="p-3.5 rounded-full border border-[#e8e2d9] bg-[#f7f3ee] hover:bg-white text-[#39322f] transition-colors cursor-pointer"
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#c59b27] text-[#c59b27]' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[10px] text-[#39322f]/70 font-sans text-center pt-2">
              <div className="flex flex-col items-center">
                <Truck className="w-4 h-4 text-[#d4a373] mb-1" />
                <span>Free Express Shipping</span>
              </div>
              <div className="flex flex-col items-center">
                <RefreshCw className="w-4 h-4 text-[#d4a373] mb-1" />
                <span>14-Day Easy Return</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-[#d4a373] mb-1" />
                <span>100% Genuine Silk</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
