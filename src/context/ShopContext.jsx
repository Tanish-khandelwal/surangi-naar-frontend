import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS_CURATED, NEW_ARRIVALS } from '../data/mockData';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Combine products for global lookups
  const allProducts = [...PRODUCTS_CURATED, ...NEW_ARRIVALS];

  // Cart State
  const [cart, setCart] = useState([
    // Initial demo item in cart
    {
      product: PRODUCTS_CURATED[0],
      color: PRODUCTS_CURATED[0].colors[0],
      size: "Free Size",
      quantity: 1
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist State
  const [wishlist, setWishlist] = useState(["p1", "na2"]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Age Verification Modal State
  const [isAgeVerified, setIsAgeVerified] = useState(() => {
    return localStorage.getItem('surangi_age_verified') === 'true';
  });

  // Search overlay state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart functions
  const addToCart = (product, color = null, size = null, quantity = 1) => {
    const chosenColor = color || (product.colors && product.colors[0]) || { name: 'Standard', hex: '#000' };
    const chosenSize = size || (product.sizes && product.sizes[0]) || 'Free Size';

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.product.id === product.id && item.color?.name === chosenColor?.name && item.size === chosenSize
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, color: chosenColor, size: chosenSize, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, delta) => {
    setCart(prev => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Wishlist functions
  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  // Age Gate confirmation
  const handleConfirmAge = (is18Plus) => {
    if (is18Plus) {
      localStorage.setItem('surangi_age_verified', 'true');
      setIsAgeVerified(true);
    } else {
      alert("You must be 18 or older to browse surangi naar fashion boutique.");
    }
  };

  return (
    <ShopContext.Provider value={{
      allProducts,
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartSubtotal,
      isCartOpen,
      setIsCartOpen,
      wishlist,
      toggleWishlist,
      isInWishlist,
      isWishlistOpen,
      setIsWishlistOpen,
      quickViewProduct,
      setQuickViewProduct,
      isAgeVerified,
      handleConfirmAge,
      isSearchOpen,
      setIsSearchOpen,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
