import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PRODUCTS_CURATED,
  NEW_ARRIVALS,
  CATEGORIES_GRID,
  HERO_SLIDES,
  PROMO_MESSAGES,
  BRAND_CONTACT
} from '../data/mockData';

const ShopContext = createContext();

const INITIAL_PRODUCTS = [...PRODUCTS_CURATED, ...NEW_ARRIVALS];

const INITIAL_DISCOUNTS = [
  { code: "HAPPY5", discountPercent: 5, minSpend: 0, description: "5% OFF first order", isActive: true },
  { code: "LAH10", discountPercent: 10, minSpend: 2500, description: "10% OFF prepaid orders", isActive: true },
  { code: "FESTIVE20", discountPercent: 20, minSpend: 10000, description: "20% OFF festive orders above ₹10,000", isActive: true }
];

const INITIAL_ORDERS = [
  {
    id: "ORD-9842",
    date: "2026-08-16T14:32:00Z",
    customer: { name: "Ananya Sharma", email: "ananya.s@gmail.com", phone: "+91 98765 43210", address: "B-402 Palm Heights, Cyber City, Gurgaon 122002" },
    items: [
      { id: "p1", name: "Lavender Mul Chanderi Kurti Set (D.No 061)", size: "M", color: "Lavender Lilac", quantity: 1, price: 3999 }
    ],
    total: 3999,
    status: "Delivered",
    paymentMethod: "Prepaid (UPI)"
  },
  {
    id: "ORD-9843",
    date: "2026-08-17T09:15:00Z",
    customer: { name: "Priyanka Verma", email: "priyanka.v@yahoo.com", phone: "+91 98112 87654", address: "72 Luxury Enclave, Jubilee Hills, Hyderabad 500033" },
    items: [
      { id: "p10", name: "Royal Zardosi Heavy Festive Anarkali Set", size: "L", color: "Royal Emerald", quantity: 1, price: 18500 }
    ],
    total: 18500,
    status: "Processing",
    paymentMethod: "Prepaid (Credit Card)"
  },
  {
    id: "ORD-9844",
    date: "2026-08-17T11:45:00Z",
    customer: { name: "Meera Kapoor", email: "meera.kapoor@gmail.com", phone: "+91 99001 22334", address: "14 Sterling Apartments, Bandra West, Mumbai 400050" },
    items: [
      { id: "p7", name: "Luxe Silk Satin Resort Co-ord Set", size: "S", color: "Champagne Gold", quantity: 1, price: 7499 }
    ],
    total: 7499,
    status: "Pending",
    paymentMethod: "Cash on Delivery"
  }
];

const CURRENT_DATA_VERSION = 'v3_single_color_catalog';

export const ShopProvider = ({ children }) => {
  // Dynamic Products State with localStorage persistence
  const [products, setProducts] = useState(() => {
    const version = localStorage.getItem('surangi_data_version');
    if (version !== CURRENT_DATA_VERSION) {
      localStorage.setItem('surangi_data_version', CURRENT_DATA_VERSION);
      localStorage.setItem('surangi_products', JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const saved = localStorage.getItem('surangi_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('surangi_products', JSON.stringify(products));
  }, [products]);

  // Dynamic Categories State
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('surangi_categories');
    return saved ? JSON.parse(saved) : CATEGORIES_GRID;
  });

  useEffect(() => {
    localStorage.setItem('surangi_categories', JSON.stringify(categories));
  }, [categories]);

  // Dynamic Hero Slides State
  const [heroSlides, setHeroSlides] = useState(() => {
    const saved = localStorage.getItem('surangi_hero_slides');
    return saved ? JSON.parse(saved) : HERO_SLIDES;
  });

  useEffect(() => {
    localStorage.setItem('surangi_hero_slides', JSON.stringify(heroSlides));
  }, [heroSlides]);

  // Dynamic Promo Bar Messages State
  const [promoMessages, setPromoMessages] = useState(() => {
    const saved = localStorage.getItem('surangi_promo_messages');
    return saved ? JSON.parse(saved) : PROMO_MESSAGES;
  });

  useEffect(() => {
    localStorage.setItem('surangi_promo_messages', JSON.stringify(promoMessages));
  }, [promoMessages]);

  // Dynamic Orders State
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('surangi_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('surangi_orders', JSON.stringify(orders));
  }, [orders]);

  // Dynamic Discount Codes State
  const [discountCodes, setDiscountCodes] = useState(() => {
    const saved = localStorage.getItem('surangi_discounts');
    return saved ? JSON.parse(saved) : INITIAL_DISCOUNTS;
  });

  useEffect(() => {
    localStorage.setItem('surangi_discounts', JSON.stringify(discountCodes));
  }, [discountCodes]);

  // Dynamic Store Settings State
  const [storeSettings, setStoreSettings] = useState(() => {
    return BRAND_CONTACT;
  });


  useEffect(() => {
    localStorage.setItem('surangi_store_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  // Cart State
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('surangi_cart');
    return saved ? JSON.parse(saved) : [
      {
        product: INITIAL_PRODUCTS[0],
        color: INITIAL_PRODUCTS[0].colors[0],
        size: "Free Size",
        quantity: 1
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('surangi_cart', JSON.stringify(cart));
  }, [cart]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('surangi_wishlist');
    return saved ? JSON.parse(saved) : ["p1", "na2"];
  });

  useEffect(() => {
    localStorage.setItem('surangi_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

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
      alert("You must be 18 or older to browse Surangi Naar.");

    }
  };

  // --- ADMIN & CATALOG CRUD METHODS ---

  // Product CRUD
  const addProduct = (newProdData) => {
    const newId = `p_${Date.now()}`;
    const product = {
      id: newId,
      rating: 5.0,
      isSoldOut: false,
      colors: [{ name: "Rust Orange", hex: "#d9531e" }, { name: "Royal Gold", hex: "#d4a373" }],
      sizes: ["S", "M", "L", "XL"],
      badge: "New Arrival",
      secondaryImage: newProdData.image || "/images/products/real_product_1.jpg",
      fabric: "Pure Handloom Fabric",
      care: "Dry Clean Only.",
      shipping: "Dispatched within 2-3 business days.",
      ...newProdData
    };
    setProducts(prev => [product, ...prev]);
    return product;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Category CRUD
  const addCategory = (catData) => {
    const newCat = {
      id: catData.slug || `cat_${Date.now()}`,
      slug: catData.slug || `cat-${Date.now()}`,
      name: catData.name,
      count: "0 Styles",
      image: catData.image || "/images/products/real_product_1.jpg",
      tagline: catData.tagline || "Artisanal Jaipur Collection"
    };
    setCategories(prev => [...prev, newCat]);
  };

  const updateCategory = (id, updatedFields) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Hero Slides CRUD
  const updateHeroSlides = (newSlides) => {
    setHeroSlides(newSlides);
  };

  const addHeroSlide = (slideData) => {
    const newSlide = {
      id: Date.now(),
      subtitle: slideData.subtitle || "New Collection",
      title: slideData.title || "Surangi Collection",
      description: slideData.description || "Handcrafted elegance",
      cta: slideData.cta || "Explore Collection",
      categorySlug: slideData.categorySlug || "kurtis",
      image: slideData.image || "/images/products/real_product_1.jpg"
    };
    setHeroSlides(prev => [...prev, newSlide]);
  };

  const deleteHeroSlide = (id) => {
    setHeroSlides(prev => prev.filter(s => s.id !== id));
  };

  // Announcement Bar Messages CRUD
  const updatePromoMessages = (messages) => {
    setPromoMessages(messages);
  };

  const addPromoMessage = (msg) => {
    setPromoMessages(prev => [...prev, msg]);
  };

  const deletePromoMessage = (index) => {
    setPromoMessages(prev => prev.filter((_, i) => i !== index));
  };

  // Orders CRUD
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  const addOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0]
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  // Discount Codes CRUD
  const addDiscountCode = (codeData) => {
    setDiscountCodes(prev => [...prev, { ...codeData, isActive: true }]);
  };

  const toggleDiscountCode = (codeStr) => {
    setDiscountCodes(prev =>
      prev.map(d => (d.code === codeStr ? { ...d, isActive: !d.isActive } : d))
    );
  };

  const deleteDiscountCode = (codeStr) => {
    setDiscountCodes(prev => prev.filter(d => d.code !== codeStr));
  };

  // Store Contact Settings CRUD
  const updateStoreSettings = (newSettings) => {
    setStoreSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Reset to initial mock data state
  const resetToDefaultData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(CATEGORIES_GRID);
    setHeroSlides(HERO_SLIDES);
    setPromoMessages(PROMO_MESSAGES);
    setOrders(INITIAL_ORDERS);
    setDiscountCodes(INITIAL_DISCOUNTS);
    setStoreSettings(BRAND_CONTACT);
    localStorage.setItem('surangi_data_version', CURRENT_DATA_VERSION);
    localStorage.removeItem('surangi_products');
    localStorage.removeItem('surangi_categories');
    localStorage.removeItem('surangi_hero_slides');
    localStorage.removeItem('surangi_promo_messages');
    localStorage.removeItem('surangi_orders');
    localStorage.removeItem('surangi_discounts');
    localStorage.removeItem('surangi_store_settings');
  };

  // User Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('surangi_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('surangi_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('surangi_user');
    }
  }, [currentUser]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openAccountModal = () => {
    setIsAccountModalOpen(true);
  };

  const closeAccountModal = () => {
    setIsAccountModalOpen(false);
  };

  const loginWithEmail = (email) => {
    const nameParts = email.split('@')[0].split(/[._]/);
    const formattedName = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

    const user = {
      id: `usr_${Date.now()}`,
      name: formattedName || "Atelier Member",
      email: email,
      phone: "+91 98765 43210",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      provider: "email"
    };
    setCurrentUser(user);
    closeAuthModal();
    return user;
  };

  const registerWithEmail = (name, email, phone) => {
    const user = {
      id: `usr_${Date.now()}`,
      name: name,
      email: email,
      phone: phone || "+91 98765 43210",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      provider: "email"
    };
    setCurrentUser(user);
    closeAuthModal();
    return user;
  };

  const loginWithGoogle = () => {
    const googleUser = {
      id: "usr_google_102",
      name: "Priyanka Sharma",
      email: "priyanka.sharma@gmail.com",
      phone: "+91 98112 87654",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      provider: "google"
    };
    setCurrentUser(googleUser);
    closeAuthModal();
    return googleUser;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    closeAccountModal();
  };

  return (
    <ShopContext.Provider value={{
      // Catalog Data
      products,
      allProducts: products,
      categories,
      heroSlides,
      promoMessages,
      orders,
      discountCodes,
      storeSettings,

      // User Authentication
      currentUser,
      isAuthModalOpen,
      authModalTab,
      setAuthModalTab,
      isAccountModalOpen,
      openAuthModal,
      closeAuthModal,
      openAccountModal,
      closeAccountModal,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      logoutUser,

      // Cart & Wishlist
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
      setSearchQuery,

      // Admin CRUD Methods
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      updateHeroSlides,
      addHeroSlide,
      deleteHeroSlide,
      updatePromoMessages,
      addPromoMessage,
      deletePromoMessage,
      updateOrderStatus,
      addOrder,
      addDiscountCode,
      toggleDiscountCode,
      deleteDiscountCode,
      updateStoreSettings,
      resetToDefaultData
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

