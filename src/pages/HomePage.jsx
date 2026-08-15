import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import CategoryGrid from '../components/CategoryGrid';
import LuxuryBadges from '../components/LuxuryBadges';
import ProductCarousel from '../components/ProductCarousel';
import PromoBanner from '../components/PromoBanner';
import FeatureCards from '../components/FeatureCards';
import ProductGrid from '../components/ProductGrid';
import FounderSection from '../components/FounderSection';

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Artisanal Heritage Brand Badges */}
      <LuxuryBadges />

      {/* Explore by Category Thumbnails */}
      <CategoryGrid />

      {/* Curated by Prints Product Carousel */}
      <ProductCarousel />

      {/* Mid-Page Promo Banner #1 */}
      <PromoBanner 
        title="The Festive Silk & Anarkali Edit"
        subtitle="Artisanal Hand-Highlighting"
        description="Pure silk & Chanderi ensembles embellished with delicate metallic sequins and traditional dabka work."
        ctaText="Explore Festive Wear"
        categoryLink="festive-wear"
        bgImage="/images/products/real_product_15.jpg"
      />

      {/* Exclusive Collection 3-Column Feature Cards */}
      <FeatureCards />

      {/* Promo Banner #2 */}
      <PromoBanner 
        title="Contemporary Resort Co-Ords"
        subtitle="100% Mulberry Silk & Organic Linen"
        description="Effortless luxury co-ord sets designed for summer retreats and serene evening gatherings."
        ctaText="Discover Co-ords"
        categoryLink="co-ords"
        bgImage="/images/products/real_product_9.jpg"
        secondaryTheme={true}
      />

      {/* New Arrivals 4-Column Responsive Product Grid */}
      <ProductGrid />

      {/* About Our Founder & 6 Value Badges */}
      <FounderSection />
    </div>
  );
}
