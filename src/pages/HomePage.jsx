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

      {/* Mid Banner */}
      <PromoBanner
        title="Royal Festive Silk Edit"
        subtitle="Exclusive Festive Couture 2026"
        description="Crafted with pure Mulberry silks, intricate zardozi hand embroidery, and Jaipur heritage craftsmanship."
        ctaText="Explore Festive Edit"
        categoryLink="festive-wear"
        bgImage="https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236573/surangi-naar/products/real_product_15.png"
      />

      {/* Exclusive Collection 3-Column Feature Cards */}
      <FeatureCards />

      {/* Secondary Banner */}
      <PromoBanner
        title="Artisanal Short Kurtis"
        subtitle="Fluid Silk & Linen Edit"
        description="Effortless luxury silhouettes designed for modern elegance and sunshine drapes."
        ctaText="Discover Short Kurtis"
        categoryLink="short-kurtis"
        bgImage="https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236595/surangi-naar/products/real_product_9.jpg"
        secondaryTheme={true}
      />

      {/* New Arrivals 4-Column Responsive Product Grid */}
      <ProductGrid />

      {/* About Our Founder & 6 Value Badges */}
      <FounderSection />
    </div>
  );
}
