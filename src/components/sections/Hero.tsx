import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBanners } from "@/hooks/useBanners";
import { Skeleton } from "@/components/ui/skeleton";

const Hero = () => {
  const { data: banners = [], isLoading } = useBanners();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [banners.length, nextSlide]);

  // Reset slide index if banners change
  useEffect(() => {
    if (currentSlide >= banners.length) {
      setCurrentSlide(0);
    }
  }, [banners.length, currentSlide]);

  // Loading state
  if (isLoading) {
    return (
      <section className="relative h-[500px] md:h-[600px] w-full bg-muted">
        <Skeleton className="w-full h-full" />
      </section>
    );
  }

  // No banners - show fallback
  if (banners.length === 0) {
    return (
      <section className="relative h-[500px] md:h-[600px] w-full flex items-center justify-center bg-muted overflow-hidden">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIKiMJGKBlwXT4Ea1wCLiwQMsLknXl2_hlS-0ReOUh2NuM8ONcHB2irx2kSTxRz6ZMI0yxhdeQqpZFdnHEEgEIyZt8GXAneitQ3ct9hW5yQWJluHWbSTMbKhfdk5H6d56BA3kK5Hs1z51OO8ruNVsb2HlKFasxk8edMUnKoYaKtvV5ns6CmlKC3jpfxuxLbkex-xcFYoeXTPWtLSbF5CaFrT6Kji3VQ72xQ5ZOcXNHdCCEvNl8HdJbOcJ3l2j4ntUyws085O48X08"
          alt="Luxury gold jewelry background"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-display text-white mb-4 drop-shadow-md">
            Timeless Elegance
          </h1>
          <p className="text-gray-100 text-lg md:text-xl mb-8 font-light max-w-xl mx-auto drop-shadow-sm">
            Discover our handcrafted collection of exquisite jewelry designed to make every moment unforgettable.
          </p>
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary-dark text-primary-foreground font-medium py-3 px-8 uppercase tracking-wide transition-colors shadow-lg"
            asChild
          >
            <Link to="/products?new=true">Shop New Arrivals</Link>
          </Button>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentSlide];

  return (
    <section className="relative h-[500px] md:h-[600px] w-full flex items-center justify-center bg-muted overflow-hidden">
      {/* Slides */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Background Image */}
          <img
            src={banner.image_url}
            alt={banner.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center px-4 max-w-3xl mx-auto animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-display text-white mb-4 drop-shadow-md">
                {banner.title}
              </h1>
              {banner.subtitle && (
                <p className="text-gray-100 text-lg md:text-xl mb-8 font-light max-w-xl mx-auto drop-shadow-sm">
                  {banner.subtitle}
                </p>
              )}
              {banner.link_url && (
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary-dark text-primary-foreground font-medium py-3 px-8 uppercase tracking-wide transition-colors shadow-lg"
                  asChild
                >
                  {banner.link_url.startsWith("http") ? (
                    <a href={banner.link_url} target="_blank" rel="noopener noreferrer">
                      {banner.button_text || "Shop Now"}
                    </a>
                  ) : (
                    <Link to={banner.link_url}>
                      {banner.button_text || "Shop Now"}
                    </Link>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 backdrop-blur-sm transition-all z-20"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 backdrop-blur-sm transition-all z-20"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
      
      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "w-8 bg-primary"
                  : "w-2 bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
