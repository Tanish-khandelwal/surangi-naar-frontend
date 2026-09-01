import React, { useState, useEffect } from 'react';
import { X, Tag, Check, Loader2, Sparkles } from 'lucide-react';
import api from '../services/api';

export default function CouponModal({
  isOpen,
  onClose,
  cartSubtotal,
  onApplyCoupon,
  appliedCouponCode,
}) {
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [applyingCode, setApplyingCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchAvailableCoupons();
      setErrorMessage('');
      setManualCode('');
    }
  }, [isOpen]);

  const fetchAvailableCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get('/coupons/available');
      if (res.data?.coupons) {
        setAvailableCoupons(res.data.coupons);
      } else if (res.data?.discounts) {
        setAvailableCoupons(res.data.discounts);
      }
    } catch (err) {
      console.error('Failed to fetch available coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (codeToApply) => {
    const code = (codeToApply || manualCode).trim().toUpperCase();
    if (!code) return;
    setApplyingCode(code);
    setErrorMessage('');
    try {
      await onApplyCoupon(code);
      onClose();
    } catch (err) {
      setErrorMessage(err?.message || err?.response?.data?.message || 'Invalid coupon code');
    } finally {
      setApplyingCode('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div 
        className="relative w-full max-w-md bg-[#fcfbfa] rounded-3xl border border-[#e8e2d9] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10 animate-in zoom-in-95 duration-200"
        data-lenis-prevent
      >
        {/* Header */}
        <div className="p-5 border-b border-[#e8e2d9] flex items-center justify-between bg-[#f7f3ee]">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#d4a373]" />
            <h3 className="font-serif font-bold text-lg uppercase tracking-wider text-[#39322f]">
              Apply Coupon
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-[#39322f]/60 hover:text-[#39322f] hover:bg-[#e8e2d9]/50 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 overscroll-contain">
          {/* Manual Entry Input */}
          <div className="space-y-2">
            <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#39322f]/70">
              Have a Promo Code?
            </label>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleApply(manualCode);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Enter coupon code"
                value={manualCode}
                onChange={(e) => {
                  setManualCode(e.target.value.toUpperCase());
                  setErrorMessage('');
                }}
                className="flex-1 px-4 py-2.5 bg-white border border-[#e8e2d9] rounded-xl text-xs font-mono uppercase tracking-wider text-[#39322f] placeholder-gray-400 focus:outline-none focus:border-[#d4a373]"
              />
              <button
                type="submit"
                disabled={!manualCode.trim() || !!applyingCode}
                className="bg-[#39322f] hover:bg-[#d4a373] disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-sans uppercase font-bold tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                {applyingCode === manualCode.trim().toUpperCase() ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  'CHECK'
                )}
              </button>
            </form>
            {errorMessage && (
              <p className="text-xs text-rose-600 font-semibold font-sans pt-1">
                {errorMessage}
              </p>
            )}
          </div>

          {/* Available Coupons List Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#e8e2d9] pb-2">
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#39322f]/70">
                Unlock Coupons
              </span>
              {availableCoupons.length > 0 && (
                <span className="text-[11px] font-sans text-[#39322f]/50">
                  {availableCoupons.length} Available
                </span>
              )}
            </div>

            {loading ? (
              <div className="py-8 text-center space-y-2">
                <Loader2 className="w-6 h-6 text-[#d4a373] animate-spin mx-auto" />
                <p className="text-xs text-[#39322f]/60 font-sans">Fetching active offers...</p>
              </div>
            ) : availableCoupons.length === 0 ? (
              <div className="py-8 text-center bg-[#f7f3ee]/50 rounded-2xl border border-[#e8e2d9] p-6 space-y-2">
                <Tag className="w-8 h-8 text-[#39322f]/30 mx-auto" />
                <p className="text-xs font-semibold text-[#39322f] font-sans">
                  No coupons available right now
                </p>
                <p className="text-[11px] text-[#39322f]/60 font-sans">
                  Check back later or apply a manual code received via promotional email.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {availableCoupons.map((coupon) => {
                  const isEligible = cartSubtotal >= (coupon.minSpend || 0);
                  const isApplied = appliedCouponCode?.toUpperCase() === coupon.code.toUpperCase();
                  const remainingToSpend = (coupon.minSpend || 0) - cartSubtotal;

                  return (
                    <div
                      key={coupon.code}
                      className={`p-4 rounded-2xl border transition-all ${
                        isApplied
                          ? 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                          : isEligible
                          ? 'bg-white border-[#e8e2d9] hover:border-[#d4a373] shadow-xs'
                          : 'bg-[#f7f3ee]/60 border-[#e8e2d9]/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5">
                          {/* Code Badge */}
                          <div className="inline-block border-2 border-dashed border-[#d4a373] bg-[#f7f3ee] text-[#39322f] font-mono font-bold px-3 py-1 rounded-lg text-xs uppercase tracking-wider">
                            {coupon.code}
                          </div>

                          {/* Discount Info */}
                          <div className="font-serif font-bold text-sm text-[#39322f]">
                            {coupon.discountPercent}% OFF
                          </div>

                          {/* Requirements & Description */}
                          <p className="text-xs font-sans text-[#39322f]/70 leading-relaxed">
                            {coupon.minSpend > 0
                              ? `${coupon.discountPercent}% off on minimum purchase of ₹${coupon.minSpend.toLocaleString('en-IN')}.`
                              : `${coupon.discountPercent}% discount with no minimum purchase requirement.`}
                          </p>

                          {coupon.description && (
                            <p className="text-[11px] font-sans text-[#39322f]/60 italic">
                              {coupon.description}
                            </p>
                          )}
                        </div>

                        {/* Apply Action or Unlock Message */}
                        <div className="shrink-0 pt-0.5">
                          {isApplied ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-sans uppercase font-bold tracking-wider shadow-xs">
                              <Check className="w-3.5 h-3.5" />
                              Applied
                            </span>
                          ) : isEligible ? (
                            <button
                              type="button"
                              onClick={() => handleApply(coupon.code)}
                              disabled={!!applyingCode}
                              className="bg-[#39322f] hover:bg-[#d4a373] text-white px-4 py-1.5 rounded-xl text-xs font-sans uppercase font-bold tracking-wider transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                            >
                              {applyingCode === coupon.code ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                'APPLY'
                              )}
                            </button>
                          ) : null}
                        </div>
                      </div>

                      {/* Muted unlock message if subtotal does not meet minSpend */}
                      {!isEligible && (
                        <div className="mt-3 pt-2.5 border-t border-[#e8e2d9]/60 text-[11px] font-sans font-semibold text-[#b58349] flex items-center justify-between">
                          <span>Shop for ₹{remainingToSpend.toLocaleString('en-IN')} more to apply.</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Locked
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
