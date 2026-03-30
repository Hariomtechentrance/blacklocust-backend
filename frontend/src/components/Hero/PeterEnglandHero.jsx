import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const PeterEnglandHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Hero slides data - using your product collections
  const slides = [
    {
      id: 1,
      title: "PREMIUM SHIRTS COLLECTION",
      subtitle: "Elevate Your Wardrobe",
      description: "Discover our exclusive range of premium cotton shirts designed for the modern gentleman",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1440&h=600&fit=crop&crop=entropy",
      ctaText: "SHOP NOW",
      ctaLink: "/collection/office-collection"
    },
    {
      id: 2,
      title: "CHECKED PATTERNS",
      subtitle: "Timeless Style",
      description: "Classic checked shirts that never go out of fashion, perfect for every occasion",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1440&h=600&fit=crop&crop=entropy",
      ctaText: "EXPLORE COLLECTION",
      ctaLink: "/collection/checked-collection"
    },
    {
      id: 3,
      title: "PARTY WEAR ESSENTIALS",
      subtitle: "Make an Impression",
      description: "Stand out at any event with our sophisticated party wear collection",
      image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=1440&h=600&fit=crop&crop=entropy",
      ctaText: "DISCOVER MORE",
      ctaLink: "/collection/party-wear-collection"
    },
    {
      id: 4,
      title: "DENIM CLASSICS",
      subtitle: "Casual Excellence",
      description: "Premium denim jeans and jackets for the perfect casual look",
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1440&h=600&fit=crop&crop=entropy",
      ctaText: "SHOP DENIM",
      ctaLink: "/collection/denim"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // 4 second intervals

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full h-[450px] lg:h-[600px] overflow-hidden bg-[#1a1a1a]">
      {/* Slides Container */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 lg:px-8">
                <div className="max-w-2xl">
                  <div className="space-y-4 lg:space-y-6">
                    {/* Subtitle */}
                    <p 
                      className="text-sm lg:text-base uppercase tracking-widest text-white/80"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {slide.subtitle}
                    </p>
                    
                    {/* Main Title */}
                    <h1 
                      className="text-3xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      {slide.title}
                    </h1>
                    
                    {/* Description */}
                    <p 
                      className="text-base lg:text-lg text-white/90 max-w-lg"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {slide.description}
                    </p>
                    
                    {/* CTA Button */}
                    <Link
                      to={slide.ctaLink}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-[#B8972E] text-white font-semibold uppercase tracking-wider text-sm hover:bg-[#8B7500] transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-xl"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {slide.ctaText}
                      <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 rounded-full"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 rounded-full"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-[#B8972E]'
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play Toggle */}
      <button
        type="button"
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute bottom-6 right-6 z-10 flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 rounded-full text-xs"
        aria-label={isAutoPlaying ? 'Pause' : 'Play'}
      >
        {isAutoPlaying ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default PeterEnglandHero;
