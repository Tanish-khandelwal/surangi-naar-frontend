import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { X, Phone, ShoppingBag, LogOut, ShieldCheck, Sparkles } from 'lucide-react';


export default function AccountModal() {
  const {
    currentUser,
    isAccountModalOpen,
    closeAccountModal,
    logoutUser,
    orders
  } = useShop();

  useEffect(() => {
    if (isAccountModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAccountModalOpen]);

  if (!isAccountModalOpen || !currentUser) return null;

  // Filter orders for current user or default demo history
  const userOrders = (orders || []).filter(o => 
    o.customer?.email?.toLowerCase() === currentUser.email?.toLowerCase() ||
    o.customer?.name?.toLowerCase().includes(currentUser.name?.toLowerCase().split(' ')[0])
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white border border-[#d4a373]/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-[#39322f] max-h-[90vh] overflow-y-auto overscroll-contain"
        data-lenis-prevent
      >
        
        {/* Close Button */}
        <button
          onClick={closeAccountModal}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-[#39322f] rounded-full hover:bg-[#f8f4ee] transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Profile Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-[#e8e2d9]">
          <img
            src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
            alt={currentUser.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#d4a373] shadow-md shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-cinzel text-xl font-bold text-[#2d2624] truncate">{currentUser.name}</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] uppercase tracking-wider font-bold border border-emerald-300">
                Verified
              </span>
            </div>
            <p className="text-xs text-gray-500 font-sans truncate mt-0.5">{currentUser.email}</p>
            <span className="text-[10px] text-[#b58349] font-bold uppercase tracking-wider block mt-1">
              Surangi VIP Member
            </span>
          </div>
        </div>

        {/* User Info Details Grid */}
        <div className="py-6 space-y-5 border-b border-[#e8e2d9]">
          <h4 className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#b58349]">
            Account Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div className="bg-[#f8f4ee] p-3.5 rounded-2xl border border-[#e8e2d9] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Contact Phone</span>
              <p className="font-bold text-[#39322f] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#d4a373]" />
                {currentUser.phone || "+91 98765 43210"}
              </p>
            </div>

            <div className="bg-[#f8f4ee] p-3.5 rounded-2xl border border-[#e8e2d9] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Auth Provider</span>
              <p className="font-bold text-[#39322f] flex items-center gap-1.5 capitalize">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4a373]" />
                {currentUser.provider || "Email Login"}
              </p>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="py-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#b58349] flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-[#d4a373]" />
              My Orders ({userOrders.length})
            </h4>
            <Link
              to="/shop"
              onClick={closeAccountModal}
              className="text-[11px] text-[#b58349] hover:underline font-bold"
            >
              Browse Catalog
            </Link>
          </div>

          {userOrders.length === 0 ? (
            <div className="bg-[#f8f4ee] rounded-2xl p-6 text-center space-y-2 border border-[#e8e2d9]">
              <p className="text-xs text-gray-600 font-medium">No order history yet.</p>
              <p className="text-[10px] text-gray-400">Your placed studio orders will appear here automatically!</p>

            </div>
          ) : (
            <div className="space-y-3">
              {userOrders.map(order => (
                <div key={order.id} className="bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl p-4 text-xs font-sans space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#39322f]">{order.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-600">
                    {order.items.map((item, i) => (
                      <div key={i} className="truncate">
                        • {item.quantity}x {item.name} ({item.size})
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#e8e2d9] text-[11px]">
                    <span className="text-gray-400">{new Date(order.date).toLocaleDateString()}</span>
                    <span className="font-bold text-[#b58349]">₹{order.total?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Logout Action */}
        <div className="pt-4 border-t border-[#e8e2d9] flex items-center justify-between">
          <Link
            to="/admin"
            onClick={closeAccountModal}
            className="text-xs text-[#b58349] font-bold hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" /> Studio Admin Panel
          </Link>

          <button
            type="button"
            onClick={logoutUser}
            className="px-4 py-2 rounded-2xl bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 transition-colors text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
}
