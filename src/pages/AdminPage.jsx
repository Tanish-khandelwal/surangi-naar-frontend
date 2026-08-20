import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import api from '../services/api';
import { getImageUrl } from '../utils/image';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Grid,
  Image as ImageIcon,
  Tag,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  Search,
  XCircle,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Save
} from 'lucide-react';

export default function AdminPage() {
  const {
    products,
    categories,
    heroSlides,
    promoMessages,
    orders,
    discountCodes,
    storeSettings,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addHeroSlide,
    deleteHeroSlide,
    addPromoMessage,
    deletePromoMessage,
    updateOrderStatus,
    addDiscountCode,
    toggleDiscountCode,
    deleteDiscountCode,
    updateStoreSettings,
    resetToDefaultData
  } = useShop();

  // Authentication & Verification State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);

  // Verify Admin Token on Mount (Session-based)
  React.useEffect(() => {
    // Purge legacy persistent localStorage admin token if present
    localStorage.removeItem('surangi_admin_token');

    const verifyAdminSession = async () => {
      const token = sessionStorage.getItem('surangi_admin_token');
      if (!token) {
        setIsAuthenticated(false);
        setIsVerifyingAuth(false);
        return;
      }

      try {
        const res = await api.get('/admin/verify');
        if (res.data?.success) {
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem('surangi_admin_token');
          sessionStorage.removeItem('surangi_admin_auth');
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Admin token verification failed:', err);
        sessionStorage.removeItem('surangi_admin_token');
        sessionStorage.removeItem('surangi_admin_auth');
        setIsAuthenticated(false);
      } finally {
        setIsVerifyingAuth(false);
      }
    };

    verifyAdminSession();
  }, []);
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active Tab State
  const [activeTab, setActiveTab] = useState('dashboard');

  // Product Filter & Modal States
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Kurtis',
    categorySlug: 'kurtis',
    price: '',
    originalPrice: '',
    image: '/images/products/real_product_1.jpg',
    badge: 'New Arrival',
    description: '',
    fabric: '',
    care: 'Dry Clean Only.',
    isSoldOut: false,
    colorName: 'Royal Purple',
    colorHex: '#5a2d82'
  });

  // Category Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catForm, setCatForm] = useState({
    name: '',
    slug: '',
    tagline: '',
    image: '/images/products/real_product_1.jpg'
  });

  // Hero Slide Modal State
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [slideForm, setSlideForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    cta: 'Explore Collection',
    categorySlug: 'kurtis',
    image: '/images/products/real_product_1.jpg'
  });

  // Promo Message Input State
  const [newPromoText, setNewPromoText] = useState('');

  // Discount Form State
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountForm, setDiscountForm] = useState({
    code: '',
    discountPercent: 10,
    minSpend: 0,
    description: ''
  });

  // Notifications / Toast
  const [toastMessage, setToastMessage] = useState('');
  const [uploadingField, setUploadingField] = useState(null);

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingField(field);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || '';
      const adminToken = sessionStorage.getItem('surangi_admin_token') || '';
      const res = await fetch(`${apiBase}/api/admin/upload`, {
        method: 'POST',
        headers: {
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        },
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (field === 'product') {
          setProductForm(prev => ({ ...prev, image: data.url }));
        } else if (field === 'cat') {
          setCatForm(prev => ({ ...prev, image: data.url }));
        } else if (field === 'slide') {
          setSlideForm(prev => ({ ...prev, image: data.url }));
        }
        showToast('Image uploaded successfully!');
      } else {
        showToast(data.message || 'Image upload failed');
      }
    } catch (err) {
      console.error('File upload error:', err);
      showToast('Failed to upload image');
    } finally {
      setUploadingField(null);
    }
  };

  // Lock body scroll when any admin modal is open
  React.useEffect(() => {
    const isAnyModalOpen = isProductModalOpen || isCatModalOpen || isSlideModalOpen || isDiscountModalOpen;
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isProductModalOpen, isCatModalOpen, isSlideModalOpen, isDiscountModalOpen]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Auth Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/login', {
        email: adminEmailInput,
        password: adminPasswordInput,
        pin: pinInput,
      });

      if (res.data?.token) {
        sessionStorage.setItem('surangi_admin_token', res.data.token);
        localStorage.removeItem('surangi_admin_token');
        setIsAuthenticated(true);
        setPinError(false);
        setAdminEmailInput('');
        setAdminPasswordInput('');
        setPinInput('');
        showToast('Welcome back, Admin!');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setPinError(true);
      showToast(err.response?.data?.message || 'Invalid Admin Credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('surangi_admin_token');
    sessionStorage.removeItem('surangi_admin_auth');
    localStorage.removeItem('surangi_admin_token');
    setAdminEmailInput('');
    setAdminPasswordInput('');
    setPinInput('');
  };

  // Product Handlers
  const handleOpenNewProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Kurtis',
      categorySlug: 'kurtis',
      price: '',
      originalPrice: '',
      image: '/images/products/real_product_1.jpg',
      badge: 'New Arrival',
      description: '',
      fabric: '',
      care: 'Dry Clean Only.',
      isSoldOut: false,
      colorName: 'Royal Purple',
      colorHex: '#5a2d82'
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProductModal = (product) => {
    setEditingProduct(product);
    const firstCol = (product.colors && product.colors.length > 0) ? product.colors[0] : null;
    const colName = (typeof firstCol === 'object' ? firstCol?.name : firstCol) || 'Royal Purple';
    const colHex = (typeof firstCol === 'object' ? firstCol?.hex : '') || '#5a2d82';

    setProductForm({
      name: product.name,
      category: product.category,
      categorySlug: product.categorySlug || 'kurtis',
      price: product.price,
      originalPrice: product.originalPrice || '',
      image: product.image,
      badge: product.badge || 'Featured',
      description: product.description || '',
      fabric: product.fabric || '',
      care: product.care || 'Dry Clean Only.',
      isSoldOut: product.isSoldOut || false,
      colorName: colName,
      colorHex: colHex
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      alert('Please provide product name and price.');
      return;
    }

    const priceNum = Number(productForm.price);
    const origPriceNum = productForm.originalPrice ? Number(productForm.originalPrice) : Math.round(priceNum * 1.25);
    const colorsArray = [
      {
        name: productForm.colorName.trim() || 'Royal Purple',
        hex: productForm.colorHex || '#5a2d82'
      }
    ];

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...productForm,
        colors: colorsArray,
        price: priceNum,
        originalPrice: origPriceNum
      });
      showToast(`Updated product "${productForm.name}"`);
    } else {
      addProduct({
        ...productForm,
        colors: colorsArray,
        price: priceNum,
        originalPrice: origPriceNum
      });
      showToast(`Added new product "${productForm.name}"`);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      showToast(`Product deleted`);
    }
  };

  // Category Handlers
  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!catForm.name) return;
    const slug = catForm.slug || catForm.name.toLowerCase().replace(/\s+/g, '-');
    if (editingCat) {
      updateCategory(editingCat.id, { ...catForm, slug });
      showToast(`Category updated`);
    } else {
      addCategory({ ...catForm, slug });
      showToast(`New category added`);
    }
    setIsCatModalOpen(false);
  };

  // Hero Slide Handlers
  const handleSaveHeroSlide = (e) => {
    e.preventDefault();
    if (!slideForm.title) return;
    addHeroSlide(slideForm);
    showToast(`Added new hero carousel slide`);
    setIsSlideModalOpen(false);
  };

  // Promo Bar Handlers
  const handleAddPromo = (e) => {
    e.preventDefault();
    if (newPromoText.trim()) {
      addPromoMessage(newPromoText.trim());
      setNewPromoText('');
      showToast('Added announcement banner text');
    }
  };

  // Discount Handlers
  const handleSaveDiscount = (e) => {
    e.preventDefault();
    if (!discountForm.code) return;
    addDiscountCode({
      code: discountForm.code.toUpperCase(),
      discountPercent: Number(discountForm.discountPercent),
      minSpend: Number(discountForm.minSpend),
      description: discountForm.description || `${discountForm.discountPercent}% OFF coupon`
    });
    setIsDiscountModalOpen(false);
    showToast(`Created discount code ${discountForm.code.toUpperCase()}`);
  };

  // Filtered Products List
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCategoryFilter === 'all' || p.categorySlug === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Calculate Metrics
  const totalSalesRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const activeProductsCount = products.filter(p => !p.isSoldOut).length;
  const soldOutCount = products.filter(p => p.isSoldOut).length;

  // Render Loading Screen while verifying admin session
  if (isVerifyingAuth) {
    return (
      <div className="min-h-screen bg-[#f8f4ee] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#d4a373] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#39322f] font-semibold">
            Verifying Admin Session...
          </p>
        </div>
      </div>
    );
  }

  // Render PIN Auth Screen if not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8f4ee] text-[#39322f] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#d4a373]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white border border-[#d4a373]/30 rounded-3xl p-8 shadow-xl relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f7f3ee] text-[#b58349] mb-4 border border-[#d4a373]/40 shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-cinzel font-bold tracking-wide text-[#2d2624]">Surangi Naar Studio</h1>
            <p className="text-xs text-[#b58349] tracking-widest uppercase font-semibold mt-1">Light Admin Control Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#b58349] mb-1 font-bold">
                Admin Email
              </label>
              <input
                type="email"
                value={adminEmailInput}
                onChange={(e) => setAdminEmailInput(e.target.value)}
                placeholder="Enter admin email"
                className="w-full bg-[#f8f4ee] border border-[#d4a373]/40 rounded-2xl px-4 py-2.5 text-sm text-[#39322f] focus:outline-none focus:border-[#d4a373] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#b58349] mb-1 font-bold">
                Admin Password
              </label>
              <input
                type="password"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#f8f4ee] border border-[#d4a373]/40 rounded-2xl px-4 py-2.5 text-sm text-[#39322f] focus:outline-none focus:border-[#d4a373] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#b58349] mb-1 font-bold">
                Or Quick Access PIN
              </label>
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className={`w-full bg-[#f8f4ee] border ${pinError ? 'border-rose-500' : 'border-[#d4a373]/40'} rounded-2xl px-4 py-2.5 text-center text-lg text-[#39322f] tracking-widest focus:outline-none focus:border-[#d4a373] transition-colors`}
              />
              {pinError && (
                <p className="text-rose-600 text-xs mt-2 text-center font-medium">
                  Invalid email, password, or PIN.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-semibold py-3.5 px-6 rounded-2xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-widest mt-2"
            >
              <Unlock className="w-4 h-4" />
              Authenticate Admin Access
            </button>
          </form>


        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f4ee] text-[#39322f] font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#39322f] text-[#f7f3ee] border border-[#d4a373]/40 px-5 py-3.5 rounded-2xl shadow-2xl font-medium flex items-center gap-2.5 animate-bounce text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#d4a373] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <header className="bg-white border-b border-[#d4a373]/25 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#f7f3ee] border border-[#d4a373]/40 flex items-center justify-center text-[#b58349] shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-cinzel text-lg font-bold text-[#2d2624] tracking-wide">SURANGI NAAR</span>
              <span className="ml-2 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-md bg-[#d4a373]/15 text-[#b58349] font-bold border border-[#d4a373]/30">
                Studio Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#f8f4ee] text-xs font-semibold text-[#2d2624] border border-[#e8e2d9] hover:border-[#d4a373] hover:text-[#b58349] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Storefront
            </Link>

            <button
              onClick={() => {
                if (window.confirm('Reset all catalog, orders, and banners back to original defaults?')) {
                  resetToDefaultData();
                  showToast('Restored original store data');
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-semibold transition-colors cursor-pointer"
              title="Reset state to default mock data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset Defaults</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#39322f] text-xs text-[#f7f3ee] hover:bg-[#d4a373] hover:text-[#39322f] transition-all cursor-pointer shadow-xs font-semibold"
            >
              <Lock className="w-3.5 h-3.5" />
              Exit Admin
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#e8e2d9] no-scrollbar">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'categories', label: `Categories (${categories.length})`, icon: Grid },
            { id: 'banners', label: 'Hero & Banners', icon: ImageIcon },
            { id: 'discounts', label: 'Discounts', icon: Tag },
            { id: 'settings', label: 'Store Contact & Info', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#39322f] text-[#f7f3ee] shadow-md'
                    : 'bg-white text-[#39322f]/70 hover:text-[#2d2624] hover:bg-[#f8f4ee] border border-[#e8e2d9]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#d4a373]' : 'text-[#b58349]'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-[#e8e2d9] rounded-2xl p-5 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider text-[#b58349] font-bold">Total Revenue</span>
                  <div className="w-10 h-10 rounded-xl bg-[#f7f3ee] flex items-center justify-center text-[#b58349] border border-[#d4a373]/30">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-cinzel font-bold text-[#2d2624]">
                  ₹{totalSalesRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% monthly growth</span>
                </div>
              </div>

              <div className="bg-white border border-[#e8e2d9] rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider text-[#b58349] font-bold">Total Orders</span>
                  <div className="w-10 h-10 rounded-xl bg-[#f7f3ee] flex items-center justify-center text-[#b58349] border border-[#d4a373]/30">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-cinzel font-bold text-[#2d2624]">
                  {totalOrdersCount}
                </div>
                <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{orders.filter(o => o.status === 'Processing' || o.status === 'Pending').length} pending dispatch</span>
                </div>
              </div>

              <div className="bg-white border border-[#e8e2d9] rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider text-[#b58349] font-bold">Active Products</span>
                  <div className="w-10 h-10 rounded-xl bg-[#f7f3ee] flex items-center justify-center text-[#b58349] border border-[#d4a373]/30">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-cinzel font-bold text-[#2d2624]">
                  {activeProductsCount}
                </div>
                <div className="text-xs text-[#39322f]/60 font-medium mt-2">
                  Across {categories.length} core categories
                </div>
              </div>

              <div className="bg-white border border-[#e8e2d9] rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider text-[#b58349] font-bold">Out of Stock</span>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-200">
                    <XCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-cinzel font-bold text-amber-700">
                  {soldOutCount}
                </div>
                <div className="text-xs text-amber-700 font-semibold mt-2">
                  {soldOutCount > 0 ? 'Requires stock update' : 'All catalog items available'}
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Orders Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Orders List */}
              <div className="lg:col-span-2 bg-white border border-[#e8e2d9] rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-cinzel font-bold text-[#2d2624]">Recent Customer Orders</h2>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#b58349] hover:underline flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8f4ee] text-[#b58349] uppercase tracking-wider font-bold border-b border-[#e8e2d9]">
                      <tr>
                        <th className="py-3 px-3">Order ID</th>
                        <th className="py-3 px-3">Customer</th>
                        <th className="py-3 px-3">Total</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e8e2d9]">
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id} className="hover:bg-[#f8f4ee]/60 transition-colors">
                          <td className="py-3.5 px-3 font-mono font-bold text-[#39322f]">{order.id}</td>
                          <td className="py-3.5 px-3 font-semibold text-[#2d2624]">{order.customer.name}</td>
                          <td className="py-3.5 px-3 font-bold text-[#b58349]">₹{order.total.toLocaleString()}</td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                              order.status === 'Processing' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                              order.status === 'Shipped' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                              'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => { setActiveTab('orders'); }}
                              className="text-xs text-[#b58349] hover:underline cursor-pointer font-bold"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Management Panel */}
              <div className="bg-white border border-[#e8e2d9] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-cinzel font-bold text-[#2d2624] mb-4">Quick Studio Actions</h2>
                  <div className="space-y-3">
                    <button
                      onClick={handleOpenNewProductModal}
                      className="w-full bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4 text-[#d4a373]" /> Add New Product
                    </button>

                    <button
                      onClick={() => setActiveTab('banners')}
                      className="w-full bg-[#f8f4ee] text-[#39322f] border border-[#e8e2d9] hover:border-[#d4a373] py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-[#b58349]" /> Edit Banners & Promos
                    </button>

                    <button
                      onClick={() => setActiveTab('discounts')}
                      className="w-full bg-[#f8f4ee] text-[#39322f] border border-[#e8e2d9] hover:border-[#d4a373] py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold cursor-pointer"
                    >
                      <Tag className="w-4 h-4 text-[#b58349]" /> Create Discount Coupon
                    </button>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#e8e2d9] text-xs text-[#39322f]/70 space-y-1.5 font-sans">
                  <p>Store Name: <span className="text-[#2d2624] font-semibold">Surangi Naar Fashion Studio</span></p>
                  <p>Location: <span className="text-[#2d2624] font-semibold">Jaipur, Rajasthan, India</span></p>
                  <p>Status: <span className="text-emerald-700 font-bold">● Active Storefront</span></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGER */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Header Control Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-[#e8e2d9] rounded-2xl p-4 shadow-xs">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search product name..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-3 py-2.5 text-xs text-[#39322f] font-semibold focus:outline-none focus:border-[#d4a373]"
                >
                  <option value="all">All Categories</option>
                  <option value="kurtis">Kurtis</option>
                  <option value="co-ords">Co-ord Sets</option>
                  <option value="festive-wear">Festive Wear</option>
                </select>
              </div>

              <button
                onClick={handleOpenNewProductModal}
                className="bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-semibold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#d4a373]" /> Add Product
              </button>
            </div>

            {/* Product Data Table */}
            <div className="bg-white border border-[#e8e2d9] rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8f4ee] text-[#b58349] uppercase tracking-wider font-bold border-b border-[#e8e2d9]">
                    <tr>
                      <th className="py-3.5 px-4">Item</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Badge</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e2d9]">
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="hover:bg-[#f8f4ee]/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              className="w-12 h-14 object-cover rounded-lg border border-[#e8e2d9]"
                            />
                            <div>
                              <span className="font-bold text-[#2d2624] block line-clamp-1">{product.name}</span>
                              <span className="text-[10px] text-gray-500 block">ID: {product.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#39322f] font-semibold">{product.category}</td>
                        <td className="py-3.5 px-4 font-bold text-[#b58349]">
                          ₹{product.price.toLocaleString()}
                          {product.originalPrice && (
                            <span className="line-through text-gray-400 text-[10px] ml-1.5 font-normal">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-md bg-[#d4a373]/15 text-[#b58349] text-[10px] font-bold border border-[#d4a373]/30">
                            {product.badge || 'Standard'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => {
                              updateProduct(product.id, { isSoldOut: !product.isSoldOut });
                              showToast(`Updated stock status for ${product.name}`);
                            }}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                              product.isSoldOut
                                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}
                          >
                            {product.isSoldOut ? 'Sold Out' : 'In Stock'}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditProductModal(product)}
                              className="p-2 rounded-lg bg-[#f8f4ee] hover:bg-[#d4a373] text-[#39322f] transition-colors cursor-pointer border border-[#e8e2d9]"
                              title="Edit product details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              className="p-2 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white transition-colors cursor-pointer border border-rose-200"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGER */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#e8e2d9] rounded-2xl p-6 shadow-xs">
              <h2 className="text-lg font-cinzel font-bold text-[#2d2624] mb-4">Customer Orders & Fulfillment</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8f4ee] text-[#b58349] uppercase tracking-wider font-bold border-b border-[#e8e2d9]">
                    <tr>
                      <th className="py-3.5 px-4">Order ID & Date</th>
                      <th className="py-3.5 px-4">Customer Info</th>
                      <th className="py-3.5 px-4">Items</th>
                      <th className="py-3.5 px-4">Total & Payment</th>
                      <th className="py-3.5 px-4">Order Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e2d9]">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-[#f8f4ee]/60 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-mono font-bold text-[#b58349] block">{order.id}</span>
                          <span className="text-[10px] text-gray-500">{new Date(order.date).toLocaleDateString()}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-[#2d2624]">{order.customer.name}</div>
                          <div className="text-[10px] text-gray-600">{order.customer.phone}</div>
                          <div className="text-[10px] text-gray-500 truncate max-w-xs">{order.customer.address}</div>
                        </td>
                        <td className="py-4 px-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-[#39322f] text-[11px] mb-1">
                              <span className="font-bold">{item.quantity}x {item.name}</span>
                              <span className="text-gray-500 text-[10px] block">Size: {item.size} | Color: {item.color}</span>
                            </div>
                          ))}
                        </td>
                        <td className="py-4 px-4 font-bold">
                          <span className="text-[#b58349] block text-sm">₹{order.total.toLocaleString()}</span>
                          <span className="text-[10px] text-gray-500 font-normal block">{order.paymentMethod}</span>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={order.status}
                            onChange={(e) => {
                              updateOrderStatus(order.id, e.target.value);
                              showToast(`Order ${order.id} status updated to ${e.target.value}`);
                            }}
                            className="bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-3 py-1.5 text-xs text-[#2d2624] font-bold focus:outline-none focus:border-[#d4a373]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORY MANAGER */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white border border-[#e8e2d9] rounded-2xl p-4 shadow-xs">
              <div>
                <h2 className="text-base font-cinzel font-bold text-[#2d2624]">Category Catalog Architecture</h2>
                <p className="text-xs text-gray-500 font-sans">Manage homepage category cards and shop collection filters</p>
              </div>
              <button
                onClick={() => {
                  setEditingCat(null);
                  setCatForm({ name: '', slug: '', tagline: '', image: '/images/products/real_product_1.jpg' });
                  setIsCatModalOpen(true);
                }}
                className="bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-semibold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#d4a373]" /> Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white border border-[#e8e2d9] rounded-2xl overflow-hidden shadow-xs group">
                  <div className="relative h-48">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-xs font-bold text-[#e6c594] uppercase tracking-wider">{cat.slug}</span>
                      <h3 className="text-xl font-cinzel font-bold text-white">{cat.name}</h3>
                      <p className="text-xs text-gray-200 italic line-clamp-1">{cat.tagline}</p>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between border-t border-[#e8e2d9] bg-[#f8f4ee]/40">
                    <span className="text-xs text-gray-500 font-semibold">{cat.count || 'Active Collection'}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingCat(cat);
                          setCatForm({ name: cat.name, slug: cat.slug, tagline: cat.tagline || '', image: cat.image });
                          setIsCatModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-white border border-[#e8e2d9] hover:bg-[#d4a373] hover:text-white transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete category "${cat.name}"?`)) {
                            deleteCategory(cat.id);
                            showToast('Category deleted');
                          }
                        }}
                        className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: BANNERS & HERO CAROUSEL */}
        {activeTab === 'banners' && (
          <div className="space-y-8">
            {/* Top Promo Bar Messages Manager */}
            <div className="bg-white border border-[#e8e2d9] rounded-2xl p-6 shadow-xs">
              <h2 className="text-lg font-cinzel font-bold text-[#2d2624] mb-1">Top Announcement Promo Bar</h2>
              <p className="text-xs text-gray-500 font-sans mb-6">Messages configured here rotate live on the top header promo bar</p>

              <form onSubmit={handleAddPromo} className="flex gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Enter new promo code or discount announcement..."
                  value={newPromoText}
                  onChange={(e) => setNewPromoText(e.target.value)}
                  className="flex-1 bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-xs text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
                <button
                  type="submit"
                  className="bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-semibold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-sm"
                >
                  Add Banner Text
                </button>
              </form>

              <div className="space-y-3">
                {promoMessages.map((msg, index) => (
                  <div key={index} className="flex items-center justify-between bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl p-3.5 text-xs font-semibold">
                    <span className="text-[#39322f]">{msg}</span>
                    <button
                      onClick={() => {
                        deletePromoMessage(index);
                        showToast('Removed announcement message');
                      }}
                      className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Carousel Manager */}
            <div className="bg-white border border-[#e8e2d9] rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-cinzel font-bold text-[#2d2624]">Hero Homepage Slides</h2>
                  <p className="text-xs text-gray-500 font-sans">Slides featured prominently on the main homepage banner</p>
                </div>
                <button
                  onClick={() => {
                    setSlideForm({
                      title: '',
                      subtitle: '',
                      description: '',
                      cta: 'Explore Collection',
                      categorySlug: 'kurtis',
                      image: '/images/products/real_product_1.jpg'
                    });
                    setIsSlideModalOpen(true);
                  }}
                  className="bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-semibold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4 text-[#d4a373]" /> Add Hero Slide
                </button>
              </div>

              <div className="space-y-4">
                {heroSlides.map((slide) => (
                  <div key={slide.id} className="flex flex-col sm:flex-row items-center gap-4 bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl p-4">
                    <img src={slide.image} alt={slide.title} className="w-24 h-24 object-cover rounded-lg border border-[#e8e2d9] shrink-0" />
                    <div className="flex-1">
                      <span className="text-[10px] text-[#b58349] font-bold uppercase tracking-wider">{slide.subtitle}</span>
                      <h4 className="text-base font-serif font-bold text-[#2d2624]">{slide.title}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">{slide.description}</p>
                    </div>
                    <button
                      onClick={() => {
                        deleteHeroSlide(slide.id);
                        showToast('Slide removed');
                      }}
                      className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer border border-rose-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DISCOUNTS */}
        {activeTab === 'discounts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white border border-[#e8e2d9] rounded-2xl p-4 shadow-xs">
              <div>
                <h2 className="text-base font-cinzel font-bold text-[#2d2624]">Promo Codes & Coupon Manager</h2>
                <p className="text-xs text-gray-500 font-sans">Manage checkout discount codes and special offers</p>
              </div>
              <button
                onClick={() => setIsDiscountModalOpen(true)}
                className="bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-semibold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#d4a373]" /> Create Coupon
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {discountCodes.map((dc) => (
                <div key={dc.code} className="bg-white border border-[#e8e2d9] rounded-2xl p-5 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-lg font-bold text-[#b58349] px-3 py-1 bg-[#f7f3ee] border border-[#d4a373]/30 rounded-lg">
                        {dc.code}
                      </span>
                      <button
                        onClick={() => {
                          toggleDiscountCode(dc.code);
                          showToast(`Toggled coupon ${dc.code}`);
                        }}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                          dc.isActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {dc.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </div>
                    <p className="text-xs text-[#2d2624] font-semibold mb-1">{dc.description}</p>
                    <p className="text-[11px] text-gray-500">
                      Discount: <span className="text-[#39322f] font-bold">{dc.discountPercent}% OFF</span> | Min spend: ₹{dc.minSpend}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#e8e2d9] flex justify-end">
                    <button
                      onClick={() => {
                        deleteDiscountCode(dc.code);
                        showToast(`Deleted coupon ${dc.code}`);
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: STORE SETTINGS & CONTACT */}
        {activeTab === 'settings' && (
          <div className="bg-white border border-[#e8e2d9] rounded-2xl p-6 max-w-2xl mx-auto space-y-6 shadow-xs">
            <div>
              <h2 className="text-lg font-cinzel font-bold text-[#2d2624]">Studio Contact & Operating Settings</h2>
              <p className="text-xs text-gray-500 font-sans">Updating these details updates the Footer and Contact Page automatically</p>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Store Phone</label>
                <input
                  type="text"
                  value={storeSettings.phone}
                  onChange={(e) => updateStoreSettings({ phone: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div>
                <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Store Email</label>
                <input
                  type="email"
                  value={storeSettings.email}
                  onChange={(e) => updateStoreSettings({ email: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div>
                <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Physical Studio Address</label>
                <textarea
                  rows={2}
                  value={storeSettings.address}
                  onChange={(e) => updateStoreSettings({ address: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div>
                <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Studio Operating Hours</label>
                <input
                  type="text"
                  value={storeSettings.hours}
                  onChange={(e) => updateStoreSettings({ hours: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#e8e2d9] flex justify-end">
              <button
                onClick={() => showToast('Store settings updated successfully!')}
                className="bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-semibold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4 text-[#d4a373]" /> Save Settings
              </button>
            </div>
          </div>
        )}

      </div>

      {/* PRODUCT ADD/EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#d4a373]/30 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-[#39322f] overscroll-contain" data-lenis-prevent>
            <div className="flex items-center justify-between border-b border-[#e8e2d9] pb-4">
              <h3 className="text-lg font-cinzel font-bold text-[#2d2624]">
                {editingProduct ? 'Edit Product Details' : 'Add New Catalog Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Product Title</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Category</label>
                  <select
                    value={productForm.categorySlug}
                    onChange={(e) => {
                      const slug = e.target.value;
                      const catObj = categories.find(c => c.slug === slug);
                      setProductForm({
                        ...productForm,
                        categorySlug: slug,
                        category: catObj ? catObj.name : 'Kurtis'
                      });
                    }}
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  >
                    <option value="kurtis">Kurtis</option>
                    <option value="co-ords">Co-ord Sets</option>
                    <option value="festive-wear">Festive Wear</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Badge Tag</label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    placeholder="Bestseller, New Drop, Trending"
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Sale Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Original Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>
              </div>

              {/* Garment Color Specification */}
              <div className="p-4 bg-[#f8f4ee] rounded-2xl border border-[#d4a373]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block uppercase tracking-wider text-[#b58349] font-bold">Product Color Specification</label>
                  <span className="text-[10px] text-gray-500 font-sans">Sets the "Select Color" swatch for this item</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-semibold text-[10px]">Color Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Purple, Rust Orange"
                      value={productForm.colorName}
                      onChange={(e) => setProductForm({ ...productForm, colorName: e.target.value })}
                      className="w-full bg-white border border-[#e8e2d9] rounded-xl px-3.5 py-2 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-semibold text-[10px]">Color Hex Code</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={productForm.colorHex || '#5a2d82'}
                        onChange={(e) => setProductForm({ ...productForm, colorHex: e.target.value })}
                        className="w-9 h-9 rounded-xl cursor-pointer border border-[#e8e2d9] p-0.5 bg-white shrink-0"
                      />
                      <input
                        type="text"
                        placeholder="#5a2d82"
                        value={productForm.colorHex}
                        onChange={(e) => setProductForm({ ...productForm, colorHex: e.target.value })}
                        className="w-full bg-white border border-[#e8e2d9] rounded-xl px-3 py-2 text-[#39322f] focus:outline-none focus:border-[#d4a373] uppercase font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 1-Click Popular Color Presets */}
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#b58349] tracking-wider block mb-1.5">
                    Quick Color Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: "Royal Purple", hex: "#5a2d82" },
                      { name: "Rust Orange", hex: "#d9531e" },
                      { name: "Lavender Lilac", hex: "#b497d6" },
                      { name: "Sage Green", hex: "#95a383" },
                      { name: "Mustard Gold", hex: "#d4a017" },
                      { name: "Slate Grey", hex: "#87888a" },
                      { name: "Deep Ruby", hex: "#8b0000" },
                      { name: "Blush Pink", hex: "#e8b4b8" },
                      { name: "Champagne Gold", hex: "#e0c9a6" },
                      { name: "Midnight Navy", hex: "#1d2d44" },
                      { name: "Charcoal Black", hex: "#231f1e" }
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setProductForm({ ...productForm, colorName: preset.name, colorHex: preset.hex })}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] border transition-all cursor-pointer font-sans ${
                          productForm.colorName === preset.name ? 'bg-[#39322f] text-white border-[#39322f] font-bold shadow-xs' : 'bg-white text-gray-700 border-gray-200 hover:border-[#d4a373]'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: preset.hex }} />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'product')}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2 text-[#39322f] focus:outline-none focus:border-[#d4a373] file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#39322f] file:text-white file:font-semibold hover:file:bg-[#d4a373] hover:file:text-[#39322f] cursor-pointer"
                />
                {uploadingField === 'product' && (
                  <p className="text-xs text-[#d4a373] mt-1 animate-pulse font-medium">Uploading to Cloudinary...</p>
                )}
                {productForm.image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={productForm.image} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-[#e8e2d9]" />
                    <span className="text-xs text-gray-500 truncate max-w-xs">{productForm.image}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Product Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="soldOutCheck"
                  checked={productForm.isSoldOut}
                  onChange={(e) => setProductForm({ ...productForm, isSoldOut: e.target.checked })}
                  className="rounded bg-[#f8f4ee] border-gray-300 accent-[#d4a373]"
                />
                <label htmlFor="soldOutCheck" className="text-[#39322f] font-bold cursor-pointer">Mark Product as Sold Out</label>
              </div>

              <div className="pt-4 border-t border-[#e8e2d9] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-bold transition-all cursor-pointer shadow-sm"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY EDIT MODAL */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#d4a373]/30 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-[#39322f] overscroll-contain" data-lenis-prevent>
            <div className="flex items-center justify-between border-b border-[#e8e2d9] pb-4">
              <h3 className="text-lg font-cinzel font-bold text-[#2d2624]">
                {editingCat ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setIsCatModalOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Category Name</label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Tagline</label>
                <input
                  type="text"
                  value={catForm.tagline}
                  onChange={(e) => setCatForm({ ...catForm, tagline: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'cat')}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2 text-[#39322f] focus:outline-none focus:border-[#d4a373] file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#39322f] file:text-white file:font-semibold hover:file:bg-[#d4a373] hover:file:text-[#39322f] cursor-pointer"
                />
                {uploadingField === 'cat' && (
                  <p className="text-xs text-[#d4a373] mt-1 animate-pulse font-medium">Uploading to Cloudinary...</p>
                )}
                {catForm.image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={catForm.image} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-[#e8e2d9]" />
                    <span className="text-xs text-gray-500 truncate max-w-xs">{catForm.image}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#e8e2d9] flex justify-end gap-3">
                <button type="button" onClick={() => setIsCatModalOpen(false)} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 cursor-pointer font-semibold">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-[#39322f] text-[#f7f3ee] hover:bg-[#d4a373] hover:text-[#39322f] font-bold cursor-pointer">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HERO SLIDE MODAL */}
      {isSlideModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#d4a373]/30 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-[#39322f] overscroll-contain" data-lenis-prevent>
            <div className="flex items-center justify-between border-b border-[#e8e2d9] pb-4">
              <h3 className="text-lg font-cinzel font-bold text-[#2d2624]">Add Hero Banner Slide</h3>
              <button onClick={() => setIsSlideModalOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveHeroSlide} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Main Title</label>
                <input
                  type="text"
                  required
                  value={slideForm.title}
                  onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Subtitle Header</label>
                <input
                  type="text"
                  value={slideForm.subtitle}
                  onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Hero Slide Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'slide')}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2 text-[#39322f] focus:outline-none focus:border-[#d4a373] file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#39322f] file:text-white file:font-semibold hover:file:bg-[#d4a373] hover:file:text-[#39322f] cursor-pointer"
                />
                {uploadingField === 'slide' && (
                  <p className="text-xs text-[#d4a373] mt-1 animate-pulse font-medium">Uploading to Cloudinary...</p>
                )}
                {slideForm.image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={slideForm.image} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-[#e8e2d9]" />
                    <span className="text-xs text-gray-500 truncate max-w-xs">{slideForm.image}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#e8e2d9] flex justify-end gap-3">
                <button type="button" onClick={() => setIsSlideModalOpen(false)} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 cursor-pointer font-semibold">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-[#39322f] text-[#f7f3ee] hover:bg-[#d4a373] hover:text-[#39322f] font-bold cursor-pointer">Add Slide</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISCOUNT MODAL */}
      {isDiscountModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#d4a373]/30 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-[#39322f] overscroll-contain" data-lenis-prevent>
            <div className="flex items-center justify-between border-b border-[#e8e2d9] pb-4">
              <h3 className="text-lg font-cinzel font-bold text-[#2d2624]">Create Discount Coupon</h3>
              <button onClick={() => setIsDiscountModalOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveDiscount} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE15"
                  value={discountForm.code}
                  onChange={(e) => setDiscountForm({ ...discountForm, code: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] uppercase tracking-wider font-mono font-bold focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Discount %</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={discountForm.discountPercent}
                    onChange={(e) => setDiscountForm({ ...discountForm, discountPercent: e.target.value })}
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Min Spend (₹)</label>
                  <input
                    type="number"
                    value={discountForm.minSpend}
                    onChange={(e) => setDiscountForm({ ...discountForm, minSpend: e.target.value })}
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Description</label>
                <input
                  type="text"
                  placeholder="15% OFF for festival season"
                  value={discountForm.description}
                  onChange={(e) => setDiscountForm({ ...discountForm, description: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div className="pt-4 border-t border-[#e8e2d9] flex justify-end gap-3">
                <button type="button" onClick={() => setIsDiscountModalOpen(false)} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 cursor-pointer font-semibold">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-[#39322f] text-[#f7f3ee] hover:bg-[#d4a373] hover:text-[#39322f] font-bold cursor-pointer">Create Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
