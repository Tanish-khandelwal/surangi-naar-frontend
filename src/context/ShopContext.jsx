import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Global Data States (backed strictly by Express API & Database)
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [promoMessages, setPromoMessages] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [discountCodes, setDiscountCodes] = useState([]);
  const [storeSettings, setStoreSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // User Auth State
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Cart & Wishlist States
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // UI Helper States
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isAgeVerified, setIsAgeVerified] = useState(() => {
    return localStorage.getItem('surangi_age_verified') === 'true';
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Initial Data Fetching from API
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Fetch Public Catalog Data in parallel
      const [prodRes, catRes, heroRes, promoRes, settingsRes] = await Promise.allSettled([
        api.get('/products'),
        api.get('/categories'),
        api.get('/hero-slides'),
        api.get('/promo-messages'),
        api.get('/store-settings'),
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value.data?.products) {
        setProducts(prodRes.value.data.products);
      }
      if (catRes.status === 'fulfilled' && catRes.value.data?.categories) {
        setCategories(catRes.value.data.categories);
      }
      if (heroRes.status === 'fulfilled' && heroRes.value.data?.heroSlides) {
        setHeroSlides(heroRes.value.data.heroSlides);
      }
      if (promoRes.status === 'fulfilled' && promoRes.value.data?.promoMessages) {
        const msgs = promoRes.value.data.promoMessages.map(m => typeof m === 'string' ? m : m.message);
        setPromoMessages(msgs);
      }
      if (settingsRes.status === 'fulfilled' && settingsRes.value.data?.settings) {
        setStoreSettings(settingsRes.value.data.settings);
      }
    } catch (err) {
      console.error('Error fetching initial public catalog data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // 2. User Session & Cart/Wishlist Initialization (Fired in parallel on mount)
  useEffect(() => {
    const initUserSession = async () => {
      const token = localStorage.getItem('surangi_access_token');
      if (!token) {
        loadGuestCartAndWishlist();
        return;
      }

      try {
        // Fire session check, cart, and wishlist requests in parallel immediately
        const [userRes, cartRes, wishRes] = await Promise.allSettled([
          api.get('/users/me'),
          api.get('/cart'),
          api.get('/wishlist'),
        ]);

        if (userRes.status === 'fulfilled' && userRes.value.data?.user) {
          setCurrentUser(userRes.value.data.user);

          if (cartRes.status === 'fulfilled' && cartRes.value.data?.cart) {
            const formattedCart = cartRes.value.data.cart.map(item => ({
              id: item.id,
              product: item.product || products.find(p => p.id === item.productId) || { id: item.productId, name: 'Product', price: 0, image: '' },
              color: { name: item.colorName, hex: '#5a2d82' },
              size: item.size,
              quantity: item.quantity,
            }));
            setCart(formattedCart);
          }

          if (wishRes.status === 'fulfilled' && wishRes.value.data?.wishlist) {
            const wishIds = wishRes.value.data.wishlist.map(p => typeof p === 'string' ? p : p.id);
            setWishlist(wishIds);
          }
        } else {
          console.error('Failed to restore user session:', userRes.reason || 'Invalid user token');
          localStorage.removeItem('surangi_access_token');
          localStorage.removeItem('surangi_refresh_token');
          loadGuestCartAndWishlist();
        }
      } catch (err) {
        console.error('Error initializing user session:', err);
        localStorage.removeItem('surangi_access_token');
        localStorage.removeItem('surangi_refresh_token');
        loadGuestCartAndWishlist();
      }
    };

    initUserSession();
  }, []);

  // Guest Cart & Wishlist Local Storage Helper
  const loadGuestCartAndWishlist = () => {
    const savedCart = localStorage.getItem('surangi_guest_cart');
    const savedWishlist = localStorage.getItem('surangi_guest_wishlist');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { setCart([]); }
    }
    if (savedWishlist) {
      try { setWishlist(JSON.parse(savedWishlist)); } catch (e) { setWishlist([]); }
    }
  };

  const fetchUserCartAndWishlist = async () => {
    try {
      const [cartRes, wishRes] = await Promise.all([
        api.get('/cart'),
        api.get('/wishlist'),
      ]);

      if (cartRes.data?.cart) {
        const formattedCart = cartRes.data.cart.map(item => ({
          id: item.id,
          product: item.product || products.find(p => p.id === item.productId) || { id: item.productId, name: 'Product', price: 0, image: '' },
          color: { name: item.colorName, hex: '#5a2d82' },
          size: item.size,
          quantity: item.quantity,
        }));
        setCart(formattedCart);
      }

      if (wishRes.data?.wishlist) {
        const wishIds = wishRes.data.wishlist.map(p => typeof p === 'string' ? p : p.id);
        setWishlist(wishIds);
      }
    } catch (err) {
      console.error('Error fetching user cart/wishlist:', err);
    }
  };

  const fetchUserOrders = async () => {
    if (!currentUser || currentUser.role === 'admin') return;
    try {
      const res = await api.get('/orders');
      if (res.data?.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Error fetching user orders:', err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/admin/customers');
      if (res.data?.customers) {
        setCustomers(res.data.customers);
      }
    } catch (err) {
      console.error('Error fetching admin customers:', err);
    }
  };

  const fetchAdminOrders = async () => {
    try {
      const res = await api.get('/admin/orders');
      if (res.data?.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    }
  };

  // 3. Fetch logged in customer orders (GET /api/orders) on login / user session change
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      fetchUserOrders();
    }
  }, [currentUser]);

  // Merge Guest Cart to Server Cart upon login
  const mergeGuestCart = async () => {
    const guestCartStr = localStorage.getItem('surangi_guest_cart');
    if (!guestCartStr) return;
    try {
      const guestItems = JSON.parse(guestCartStr);
      await Promise.all(
        guestItems.map(item => {
          if (item.product?.id) {
            return api.post('/cart', {
              productId: item.product.id,
              colorName: item.color?.name || 'Standard',
              size: item.size || 'M',
              quantity: item.quantity || 1,
            });
          }
          return Promise.resolve();
        })
      );
      localStorage.removeItem('surangi_guest_cart');
    } catch (e) {
      console.error('Error merging guest cart:', e);
    }
  };

  // --- USER AUTHENTICATION METHODS ---
  const loginWithEmail = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.token) {
        localStorage.setItem('surangi_access_token', res.data.token);
        localStorage.setItem('surangi_refresh_token', res.data.refreshToken);
        setCurrentUser(res.data.user);
        await mergeGuestCart();
        await fetchUserCartAndWishlist();
        closeAuthModal();
        toast.success('Signed in successfully!');
        return res.data.user;
      }
    } catch (err) {
      console.error('Login Error:', err);
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      throw err;
    }
  };

  const registerWithEmail = async (name, email, phone, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, phone, password });
      if (res.data?.token) {
        localStorage.setItem('surangi_access_token', res.data.token);
        localStorage.setItem('surangi_refresh_token', res.data.refreshToken);
        setCurrentUser(res.data.user);
        await mergeGuestCart();
        await fetchUserCartAndWishlist();
        closeAuthModal();
        toast.success('Account created successfully!');
        return res.data.user;
      }
    } catch (err) {
      console.error('Register Error:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Registration failed.';
      toast.error(errMsg);
      throw err;
    }
  };

  const loginWithGoogle = async (credential) => {
    try {
      const res = await api.post('/auth/google', { credential });
      if (res.data?.token) {
        localStorage.setItem('surangi_access_token', res.data.token);
        localStorage.setItem('surangi_refresh_token', res.data.refreshToken);
        setCurrentUser(res.data.user);
        await mergeGuestCart();
        await fetchUserCartAndWishlist();
        closeAuthModal();
        toast.success('Google login successful!');
        return res.data.user;
      }
    } catch (err) {
      console.error('Google Auth Error:', err);
      const msg = err.response?.data?.message || 'Google Login failed.';
      toast.error(msg);
      throw err;
    }
  };

  const logoutUser = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore logout API errors
    } finally {
      localStorage.removeItem('surangi_access_token');
      localStorage.removeItem('surangi_refresh_token');
      setCurrentUser(null);
      setCart([]);
      setWishlist([]);
      setOrders([]);
      closeAccountModal();
      toast.success('Signed out successfully');
    }
  };

  const deleteUserAccount = async () => {
    try {
      await api.delete('/users/me');
      await logoutUser();
      toast.success('Your account has been permanently deleted.');
    } catch (err) {
      console.error('Delete Account Error:', err);
      const errMsg = err.response?.data?.message || 'Failed to delete account.';
      toast.error(errMsg);
      throw err;
    }
  };

  // --- CART METHODS ---
  const addToCart = async (product, color = null, size = null, quantity = 1) => {
    if (!currentUser) {
      toast.error('Please sign in to add items to your cart');
      openAuthModal('login');
      return;
    }

    const chosenColor = color || (product.colors && product.colors[0]) || { name: 'Standard', hex: '#000' };
    const chosenSize = size || (product.sizes && product.sizes[0]) || 'Free Size';

    try {
      await api.post('/cart', {
        productId: product.id,
        colorName: chosenColor.name,
        size: chosenSize,
        quantity,
      });
      await fetchUserCartAndWishlist();
      setIsCartOpen(true);
      toast.success('Added to cart!');
    } catch (err) {
      console.error('Error adding to server cart:', err);
      toast.error('Failed to add item to cart');
    }
  };

  const removeFromCart = async (indexOrId) => {
    if (currentUser) {
      const itemToDelete = cart[indexOrId] || cart.find(c => c.id === indexOrId);
      if (itemToDelete?.id) {
        try {
          await api.delete(`/cart/${itemToDelete.id}`);
          await fetchUserCartAndWishlist();
          return;
        } catch (err) {
          console.error('Error removing cart item:', err);
        }
      }
    }
    setCart(prev => {
      const updated = prev.filter((_, i) => i !== indexOrId && prev[i]?.id !== indexOrId);
      if (!currentUser) localStorage.setItem('surangi_guest_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuantity = async (indexOrId, delta) => {
    const targetItem = cart[indexOrId] || cart.find(c => c.id === indexOrId);
    if (!targetItem) return;
    const newQty = targetItem.quantity + delta;

    if (currentUser && targetItem.id) {
      try {
        if (newQty <= 0) {
          await api.delete(`/cart/${targetItem.id}`);
        } else {
          await api.put(`/cart/${targetItem.id}`, { quantity: newQty });
        }
        await fetchUserCartAndWishlist();
        return;
      } catch (err) {
        console.error('Error updating quantity:', err);
      }
    }

    setCart(prev => {
      const idx = typeof indexOrId === 'number' ? indexOrId : prev.findIndex(item => item.id === indexOrId);
      if (idx === -1) return prev;
      const updated = [...prev];
      if (newQty <= 0) {
        const filtered = prev.filter((_, i) => i !== idx);
        if (!currentUser) localStorage.setItem('surangi_guest_cart', JSON.stringify(filtered));
        return filtered;
      }
      updated[idx].quantity = newQty;
      if (!currentUser) localStorage.setItem('surangi_guest_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = async () => {
    if (currentUser) {
      try {
        await api.delete('/cart');
      } catch (err) {
        console.error('Error clearing cart:', err);
      }
    }
    setCart([]);
    localStorage.removeItem('surangi_guest_cart');
  };

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + ((item.product?.price || 0) * (item.quantity || 1)), 0);

  // --- WISHLIST METHODS ---
  const toggleWishlist = async (productId) => {
    if (!currentUser) {
      toast.error('Please sign in to save items to your wishlist');
      openAuthModal('login');
      return;
    }

    try {
      const res = await api.post('/wishlist', { productId });
      if (res.data?.added) {
        setWishlist(prev => [...prev, productId]);
        toast.success('Added to wishlist!');
      } else {
        setWishlist(prev => prev.filter(id => id !== productId));
        toast.success('Removed from wishlist');
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      toast.error('Failed to update wishlist');
    }
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  // --- ADMIN & CATALOG API METHODS ---
  const addProduct = async (newProdData) => {
    try {
      const res = await api.post('/admin/products', newProdData);
      if (res.data?.product) {
        setProducts(prev => [res.data.product, ...prev]);
        return res.data.product;
      }
    } catch (err) {
      console.error('Error adding product:', err);
      throw err;
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      const res = await api.put(`/admin/products/${id}`, updatedFields);
      if (res.data?.product) {
        setProducts(prev => prev.map(p => p.id === id ? res.data.product : p));
      }
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  const addCategory = async (catData) => {
    try {
      const res = await api.post('/admin/categories', catData);
      if (res.data?.category) {
        setCategories(prev => [...prev, res.data.category]);
      }
    } catch (err) {
      console.error('Error adding category:', err);
      throw err;
    }
  };

  const updateCategory = async (id, updatedFields) => {
    try {
      const res = await api.put(`/admin/categories/${id}`, updatedFields);
      if (res.data?.category) {
        setCategories(prev => prev.map(c => c.id === id ? res.data.category : c));
      }
    } catch (err) {
      console.error('Error updating category:', err);
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/admin/categories/${id}`);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
      throw err;
    }
  };

  const updateHeroSlides = async (newSlides) => {
    try {
      const res = await api.put('/admin/hero-slides', { slides: newSlides });
      if (res.data?.slides) {
        setHeroSlides(res.data.slides);
      }
    } catch (err) {
      console.error('Error updating hero slides:', err);
      throw err;
    }
  };

  const addHeroSlide = async (slideData) => {
    try {
      const res = await api.post('/admin/hero-slides', slideData);
      if (res.data?.slide) {
        setHeroSlides(prev => [...prev, res.data.slide]);
      }
    } catch (err) {
      console.error('Error adding hero slide:', err);
      throw err;
    }
  };

  const deleteHeroSlide = async (id) => {
    try {
      await api.delete(`/admin/hero-slides/${id}`);
      setHeroSlides(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error deleting hero slide:', err);
      throw err;
    }
  };

  const updatePromoMessages = async (messages) => {
    try {
      const res = await api.put('/admin/promo-messages', { messages });
      if (res.data?.messages) {
        const msgs = res.data.messages.map(m => typeof m === 'string' ? m : m.message);
        setPromoMessages(msgs);
      }
    } catch (err) {
      console.error('Error updating promo messages:', err);
      throw err;
    }
  };

  const addPromoMessage = async (msg) => {
    try {
      const res = await api.post('/admin/promo-messages', { message: msg });
      if (res.data?.promo) {
        setPromoMessages(prev => [...prev, res.data.promo.message]);
      }
    } catch (err) {
      console.error('Error adding promo message:', err);
      throw err;
    }
  };

  const deletePromoMessage = async (indexOrId) => {
    try {
      if (typeof indexOrId === 'number' && promoMessages[indexOrId]) {
        // If passed numeric index, map to API if possible
        await api.put('/admin/promo-messages', { messages: promoMessages.filter((_, i) => i !== indexOrId) });
        setPromoMessages(prev => prev.filter((_, i) => i !== indexOrId));
      } else {
        await api.delete(`/admin/promo-messages/${indexOrId}`);
        setPromoMessages(prev => prev.filter(m => m.id !== indexOrId));
      }
    } catch (err) {
      console.error('Error deleting promo message:', err);
      throw err;
    }
  };

  const updateOrderStatus = async (orderId, newStatus, extraData = {}) => {
    try {
      const payload = typeof newStatus === 'object' ? newStatus : { status: newStatus, ...extraData };
      const res = await api.put(`/admin/orders/${orderId}/status`, payload);
      if (res.data?.order) {
        setOrders(prev => prev.map(o => o.id === orderId ? res.data.order : o));
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      throw err;
    }
  };

  const cancelUserOrder = async (orderId, reason) => {
    try {
      const res = await api.put(`/orders/${orderId}/cancel`, { reason });
      if (res.data?.order) {
        setOrders(prev => prev.map(o => o.id === orderId ? res.data.order : o));
        toast.success('Order cancelled successfully');
        return res.data.order;
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      toast.error(err.response?.data?.message || 'Failed to cancel order');
      throw err;
    }
  };

  const cancelAdminOrder = async (orderId, reason) => {
    try {
      const res = await api.put(`/admin/orders/${orderId}/cancel`, { reason });
      if (res.data?.order) {
        setOrders(prev => prev.map(o => o.id === orderId ? res.data.order : o));
        toast.success('Order cancelled by admin');
        return res.data.order;
      }
    } catch (err) {
      console.error('Error cancelling order by admin:', err);
      toast.error(err.response?.data?.message || 'Failed to cancel order');
      throw err;
    }
  };

  const submitProductReview = async (productId, reviewData) => {
    try {
      const res = await api.post(`/products/${productId}/reviews`, reviewData);
      if (res.data?.review) {
        const prodRes = await api.get(`/products/${productId}`);
        if (prodRes.data?.product) {
          setProducts(prev => prev.map(p => p.id === productId ? prodRes.data.product : p));
        }
        toast.success('Review submitted successfully!');
        return res.data.review;
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error(err.response?.data?.message || 'Failed to submit review');
      throw err;
    }
  };

  const fetchProductReviews = async (productId, page = 1) => {
    try {
      const res = await api.get(`/products/${productId}/reviews?page=${page}`);
      return res.data;
    } catch (err) {
      console.error('Error fetching product reviews:', err);
      return { reviews: [], pagination: { total: 0, totalPages: 1 } };
    }
  };

  const addOrder = async (orderData) => {
    try {
      const res = await api.post('/orders', orderData);
      if (res.data?.order) {
        const created = res.data.order;
        const methodStr = (orderData.paymentMethod || '').toLowerCase();
        const isCOD = methodStr.includes('cash on delivery') || methodStr.includes('cod');

        if (isCOD) {
          setOrders(prev => [created, ...prev]);
          clearCart();
          toast.success('Order placed successfully!');
          if (currentUser && currentUser.role !== 'admin') {
            await fetchUserOrders();
          }
        }
        return created;
      }
    } catch (err) {
      console.error('Error adding order:', err);
      toast.error(err.response?.data?.message || 'Failed to initialize order.');
      throw err;
    }
  };

  const addDiscountCode = async (codeData) => {
    try {
      const res = await api.post('/admin/discounts', codeData);
      if (res.data?.discount) {
        setDiscountCodes(prev => [...prev, res.data.discount]);
      }
    } catch (err) {
      console.error('Error adding discount code:', err);
      throw err;
    }
  };

  const toggleDiscountCode = async (codeStr) => {
    try {
      const current = discountCodes.find(d => d.code === codeStr);
      const res = await api.put(`/admin/discounts/${codeStr}`, { isActive: !current?.isActive });
      if (res.data?.discount) {
        setDiscountCodes(prev => prev.map(d => d.code === codeStr ? res.data.discount : d));
      }
    } catch (err) {
      console.error('Error toggling discount code:', err);
      throw err;
    }
  };

  const deleteDiscountCode = async (codeStr) => {
    try {
      await api.delete(`/admin/discounts/${codeStr}`);
      setDiscountCodes(prev => prev.filter(d => d.code !== codeStr));
    } catch (err) {
      console.error('Error deleting discount code:', err);
      throw err;
    }
  };

  const updateStoreSettings = async (newSettings) => {
    try {
      const res = await api.put('/admin/store-settings', newSettings);
      if (res.data?.settings) {
        setStoreSettings(res.data.settings);
      }
    } catch (err) {
      console.error('Error updating store settings:', err);
      throw err;
    }
  };

  const refreshData = async () => {
    await fetchInitialData();
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);
  const openAccountModal = () => setIsAccountModalOpen(true);
  const closeAccountModal = () => setIsAccountModalOpen(false);

  const handleConfirmAge = (is18Plus) => {
    if (is18Plus) {
      localStorage.setItem('surangi_age_verified', 'true');
      setIsAgeVerified(true);
      toast.success('Welcome to Surangi Naar!');
    } else {
      toast.error("You must be 18 or older to browse Surangi Naar.");
    }
  };

  return (
    <ShopContext.Provider value={{
      // Catalog & App Data
      products,
      allProducts: products,
      categories,
      heroSlides,
      promoMessages,
      orders,
      setOrders,
      customers,
      setCustomers,
      fetchCustomers,
      fetchAdminOrders,
      discountCodes,
      setDiscountCodes,
      storeSettings,
      loading,

      // User Authentication
      currentUser,
      setCurrentUser,
      fetchUserOrders,
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
      deleteUserAccount,

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

      // Admin & Catalog API CRUD Methods
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
      cancelUserOrder,
      cancelAdminOrder,
      submitProductReview,
      fetchProductReviews,
      addOrder,
      addDiscountCode,
      toggleDiscountCode,
      deleteDiscountCode,
      updateStoreSettings,
      refreshData
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
