import React from 'react';
import { Crown, Scissors, Sparkles, Truck } from 'lucide-react';

export default function LuxuryBadges() {
  const badges = [
    {
      icon: Crown,
      title: "Jaipur Artisanal Heritage",
      description: "Handcrafted by master artisans with authentic Zardosi, Gota Patti, & Dabka work.",
      highlight: "Artisan Certified"
    },
    {
      icon: Scissors,
      title: "Bespoke Made-to-Measure",
      description: "Custom tailored fits available for every ensemble upon request.",
      highlight: "Custom Fitting"
    },
    {
      icon: Sparkles,
      title: "100% Pure Organic Silk",
      description: "Ethically woven natural fabrics with rich natural dye heritage.",
      highlight: "Pure Handloom"
    },
    {
      icon: Truck,
      title: "Insured Worldwide Express",
      description: "Fast express dispatch with tracking across 40+ countries.",
      highlight: "Express Delivery"
    }
  ];

  return (
    <section className="py-20 bg-[#f8f4ee] border-y border-[#d4a373]/20 relative overflow-hidden">
      {/* Decorative Gold Glow Background Elements */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#d4a373]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] uppercase font-sans tracking-[0.3em] text-[#d4a373] font-bold block mb-2">
            The Surangi Promise
          </span>
          <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#2d2624]">
            Artisanal Excellence & Uncompromised Quality
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#d4a373] to-transparent mx-auto mt-4 rounded-full" />
        </div>

        {/* 4 Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="group relative luxury-glass p-8 rounded-3xl border border-[#d4a373]/30 shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-[#d4a373]/70 gold-glow-hover flex flex-col justify-between"
              >
                <div>
                  {/* Icon & Badge Pill */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#d4a373]/20 via-[#f3e3ca]/40 to-[#d4a373]/10 border border-[#d4a373]/40 flex items-center justify-center text-[#d4a373] transition-all duration-500 group-hover:bg-[#2d2624] group-hover:text-[#e6c594] group-hover:scale-110 shadow-md">
                      <Icon className="w-7 h-7 stroke-[1.5]" />
                    </div>
                    <span className="text-[9px] uppercase font-sans tracking-widest px-3 py-1 rounded-full bg-[#f8f4ee] text-[#b58349] font-bold border border-[#d4a373]/30 shadow-xs">
                      {badge.highlight}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-cinzel text-base font-bold text-[#2d2624] mb-2 group-hover:text-[#d4a373] transition-colors">
                    {badge.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs font-sans text-[#2d2624]/75 leading-relaxed font-light">
                    {badge.description}
                  </p>
                </div>

                {/* Bottom Accent Line */}
                <div className="w-10 h-0.5 bg-gradient-to-r from-[#d4a373] to-transparent group-hover:w-full transition-all duration-500 rounded-full mt-6" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
