import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';
import { getImageUrl } from '../utils/image';

export default function HeroCarousel() {
  const { heroSlides } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const slides = heroSlides && heroSlides.length > 0 ? heroSlides : [];

  useEffect(() => {
    if (!isPlaying || slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  if (slides.length === 0) return null;

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative w-full h-[60vh] sm:h-[75vh] lg:h-[85vh] min-h-[440px] sm:min-h-[560px] lg:min-h-[640px] overflow-hidden bg-[#39322f]">
      {/* Slides Stack */}
      {slides.map((slide, index) => (
        <div
          key={slide.id || index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10 pointer-events-auto visible' : 'opacity-0 z-0 pointer-events-none invisible'
          }`}
        >
          {/* Background Image with srcSet & LCP prioritization */}
          <img
            src={getImageUrl(slide.image, { width: 800 })}
            srcSet={`${getImageUrl(slide.image, { width: 800 })} 800w, ${getImageUrl(slide.image, { width: 1400 })} 1400w`}
            sizes="100vw"
            alt={slide.title}
            width="1600"
            height="900"
            decoding="async"
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'low'}
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000 ease-out"
            style={{ aspectRatio: '16/9' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#231f1e]/85 via-[#231f1e]/50 to-transparent" />
          <div className="absolute inset-0 bg-black/20" />

          {/* Slide Text Content Container */}
          <div className="absolute inset-0 max-w-7xl mx-auto px-11 sm:px-16 lg:px-20 flex flex-col justify-center text-white">
            <div className="max-w-xl space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
              
              <div className="inline-flex items-center gap-1.5 bg-[#d4a373]/25 backdrop-blur-md border border-[#d4a373]/60 px-3 py-1 rounded-full text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#e6c594] font-semibold shadow-md min-h-[28px]">
                <Sparkles className="w-3.5 h-3.5 text-[#e6c594]" />
                <span>{slide.subtitle}</span>
              </div>

              <h2 className="font-cinzel text-3xl sm:text-6xl lg:text-7xl font-extrabold tracking-wider bg-gradient-to-r from-white via-[#f3e3ca] to-[#e6c594] bg-clip-text text-transparent drop-shadow-md leading-tight sm:leading-none">
                {slide.title}
              </h2>

              <p className="font-cormorant text-base sm:text-2xl text-gray-100 leading-relaxed font-light italic line-clamp-2 sm:line-clamp-none max-w-lg">
                “{slide.description}”
              </p>

              <div className="pt-3 sm:pt-5">
                <Link
                  to={`/category/${slide.categorySlug || 'kurtis'}`}
                  className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#d4a373] via-[#e6c594] to-[#b58349] text-[#1a1716] hover:bg-white hover:text-[#1a1716] px-8 py-3.5 sm:px-9 sm:py-4 rounded-full text-xs font-sans uppercase tracking-widest font-bold transition-all duration-300 transform hover:-translate-y-1 shadow-2xl border border-white/20 cursor-pointer min-h-[44px]"
                >
                  <span>{slide.cta || 'Explore Collection'}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      ))}

      {/* Prev / Next Arrows with 44px min touch target */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-1.5 sm:left-6 top-1/2 -translate-y-1/2 z-20 min-w-[44px] min-h-[44px] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/75 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-1.5 sm:right-6 top-1/2 -translate-y-1/2 z-20 min-w-[44px] min-h-[44px] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/75 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Slide Navigation Dots & Play/Pause */}
      <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center gap-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? "Pause Carousel" : "Play Carousel"}
          className="text-white/70 hover:text-white transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center p-2"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all cursor-pointer rounded-full min-h-[32px] min-w-[24px] flex items-center justify-center ${
                idx === currentSlide ? 'p-1' : 'p-1'
              }`}
            >
              <span className={`block rounded-full transition-all ${
                idx === currentSlide ? 'w-8 h-2 bg-[#d4a373]' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

