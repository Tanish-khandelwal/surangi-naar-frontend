import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND_CONTACT } from '../data/mockData';
import {
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  Clock,
  Shield,
  CreditCard,
  Heart
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a1716] text-[#f8f4ee] pt-16 pb-8 border-t border-[#d4a373]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Multi-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#d4a373]/20">

          {/* Column 1: Brand Info & Socials */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#d4a373] to-[#b58349]">
                <img
                  src="/logo.jpg"
                  alt="Surangi Naar Emblem"
                  className="w-12 h-12 rounded-full object-cover border border-white"
                />
              </div>
              <div>
                <h3 className="font-cinzel text-2xl font-bold tracking-wider text-white leading-none">
                  Surangi Naar
                </h3>
                <span className="text-[9px] uppercase tracking-[0.28em] text-[#e6c594] font-semibold block mt-1">
                  Luxury Apparel
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-300 font-sans font-light leading-relaxed max-w-sm">
              Luxury Indian ethnic and contemporary western boutique curated with handcrafted fabrics, artisanal embroidery, and timeless silhouettes.
            </p>

            {/* Social Icons */}
            <div className="pt-2 flex items-center space-x-3">
              <a
                href={BRAND_CONTACT.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#d4a373] text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href={BRAND_CONTACT.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#d4a373] text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Contact Info */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-base text-white tracking-wide border-b border-white/10 pb-2">
              Contact Boutique
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300 font-sans font-light">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d4a373] shrink-0 mt-0.5" />
                <a href={BRAND_CONTACT.googleMaps} target="_blank" rel="noreferrer" className="hover:text-[#d4a373] transition-colors">
                  {BRAND_CONTACT.address}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#d4a373] shrink-0" />
                <a href={`mailto:${BRAND_CONTACT.email}`} className="hover:text-[#d4a373] transition-colors">
                  {BRAND_CONTACT.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#d4a373] shrink-0" />
                <a href={`tel:${BRAND_CONTACT.phone}`} className="hover:text-[#d4a373] transition-colors">
                  {BRAND_CONTACT.displayPhone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#d4a373] shrink-0" />
                <a href={BRAND_CONTACT.whatsapp} target="_blank" rel="noreferrer" className="hover:text-[#d4a373] transition-colors font-medium text-emerald-400">
                  WhatsApp Concierge
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-gray-400">
                <Clock className="w-4 h-4 text-[#d4a373] shrink-0" />
                <span>{BRAND_CONTACT.hours}</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-base text-white tracking-wide border-b border-white/10 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-gray-300 font-sans font-light">
              <li><Link to="/category/kurtis" className="hover:text-[#d4a373] transition-colors">Handcrafted Kurtis</Link></li>
              <li><Link to="/category/co-ords" className="hover:text-[#d4a373] transition-colors">Luxury Co-ord Sets</Link></li>
              <li><Link to="/category/festive-wear" className="hover:text-[#d4a373] transition-colors">Festive Wear</Link></li>
              <li><Link to="/shop" className="hover:text-[#d4a373] transition-colors font-semibold text-[#d4a373]">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Column 4: Policy Column */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-base text-white tracking-wide border-b border-white/10 pb-2">
              Customer Care & Pages
            </h4>
            <ul className="space-y-2 text-xs text-gray-300 font-sans font-light">
              <li><Link to="/about" className="hover:text-[#d4a373] transition-colors font-medium text-[#d4a373]">About Us & Contact</Link></li>
              <li><Link to="/cart" className="hover:text-[#d4a373] transition-colors">View Cart & Checkout</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Method Icons Row */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-sans">

          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} Surangi Naar. All Rights Reserved.</span>
          </div>


        </div>

      </div>
    </footer>
  );
}
