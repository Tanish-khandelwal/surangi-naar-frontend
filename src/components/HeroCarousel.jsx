import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HERO_SLIDES } from '../data/mockData';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <section className="relative w-full h-[60vh] sm:h-[75vh] lg:h-[85vh] overflow-hidden bg-[#39322f]">
      {/* Slides Stack */}
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#231f1e]/85 via-[#231f1e]/50 to-transparent" />
          <div className="absolute inset-0 bg-black/20" />

          {/* Slide Text Content Container */}
          <div className="absolute inset-0 max-w-7xl mx-auto px-5 sm:px-12 lg:px-16 flex flex-col justify-center text-white">
            <div className="max-w-xl space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
              
              <div className="inline-flex items-center gap-1.5 bg-[#d4a373]/25 backdrop-blur-md border border-[#d4a373]/60 px-3 py-1 rounded-full text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#e6c594] font-semibold shadow-md">
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
                  to={`/category/${slide.categorySlug}`}
                  className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#d4a373] via-[#e6c594] to-[#b58349] text-[#1a1716] hover:bg-white hover:text-[#1a1716] px-8 py-3.5 sm:px-9 sm:py-4 rounded-full text-xs font-sans uppercase tracking-widest font-bold transition-all duration-300 transform hover:-translate-y-1 shadow-2xl border border-white/20 cursor-pointer"
                >
                  <span>{slide.cta}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      ))}

      {/* Prev / Next Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/25 hover:bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/25 hover:bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Slide Navigation Dots & Play/Pause */}
      <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center gap-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? "Pause Carousel" : "Play Carousel"}
          className="text-white/70 hover:text-white transition-colors cursor-pointer p-1"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all cursor-pointer rounded-full ${
                idx === currentSlide
                  ? 'w-8 h-2 bg-[#d4a373]'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
