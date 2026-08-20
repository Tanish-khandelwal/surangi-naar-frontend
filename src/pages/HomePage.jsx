import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import CategoryGrid from '../components/CategoryGrid';
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
        title="Contemporary Resort Short Kurtis"
        subtitle="100% Mulberry Silk & Organic Linen"
        description="Effortless luxury short kurtis designed for summer retreats and serene evening gatherings."
        ctaText="Discover Short Kurtis"
        categoryLink="short-kurtis"
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
