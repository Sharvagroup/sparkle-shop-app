import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBanners, BannerTheme } from "@/hooks/useBanners";
import { useSiteSetting } from "@/hooks/useSiteSettings";
import { Skeleton } from "@/components/ui/skeleton";

interface HeroSectionTheme {
  section_height?: "small" | "medium" | "large" | "full";
  auto_slide_speed?: number;
}

const Hero = () => {
  const { data: banners = [], isLoading } = useBanners();
  const { data: sectionTheme } = useSiteSetting<HeroSectionTheme>("hero_theme");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoSlideKey, setAutoSlideKey] = useState(0);

  const autoSlideSpeed = (sectionTheme?.auto_slide_speed ?? 5) * 1000;

  const nextSlide = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Manual navigation handlers - reset auto-slide timer
  const handlePrevSlide = useCallback(() => {
    prevSlide();
    setAutoSlideKey((prev) => prev + 1);
  }, [prevSlide]);

  const handleNextSlide = useCallback(() => {
    nextSlide();
    setAutoSlideKey((prev) => prev + 1);
  }, [nextSlide]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
    setAutoSlideKey((prev) => prev + 1);
  };

  // Auto-advance slides - resets when autoSlideKey changes
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(nextSlide, autoSlideSpeed);
    return () => clearInterval(interval);
  }, [banners.length, nextSlide, autoSlideSpeed, autoSlideKey]);

  // Reset slide index if banners change
  useEffect(() => {
    if (currentSlide >= banners.length) {
      setCurrentSlide(0);
    }
  }, [banners.length, currentSlide]);

  // Get section height classes
  const getSectionHeight = () => {
    const height = sectionTheme?.section_height || "medium";
    switch (height) {
      case "small":
        return "h-[400px]";
      case "medium":
        return "h-[500px] md:h-[600px]";
      case "large":
        return "h-[600px] md:h-[700px]";
      case "full":
        return "h-screen";
      default:
        return "h-[500px] md:h-[600px]";
    }
  };

  // Get content position classes based on banner theme
  const getContentPositionClasses = (theme: BannerTheme | null) => {
    const position = theme?.content_position || "center";
    switch (position) {
      case "left":
        return "items-start text-left";
      case "right":
        return "items-end text-right";
      default:
        return "items-center text-center";
    }
  };

  // Get button shape classes
  const getButtonShapeClasses = (theme: BannerTheme | null) => {
    return theme?.button_shape === "box" ? "rounded-md" : "rounded-full";
  };

  // Loading state
  if (isLoading) {
    return (
      <section className={`relative ${getSectionHeight()} w-full bg-muted`}>
        <Skeleton className="w-full h-full" />
      </section>
    );
  }

  // No banners - hide section
  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentSlide];

  return (
    <section className={`relative ${getSectionHeight()} w-full flex items-center justify-center bg-muted overflow-hidden`}>
      {/* Slides */}
      {banners.map((banner, index) => {
        const theme = banner.theme as BannerTheme | null;
        const overlayOpacity = theme?.overlay_opacity ?? 40;
        const edgeFade = theme?.edge_fade || false;

        // Image settings
        const imageFit = theme?.image_fit || "cover";
        const imageZoom = theme?.image_zoom ?? 100;
        const overlayColor = theme?.overlay_color || "#000000";

        // Convert hex to rgba
        const hexToRgba = (hex: string, alpha: number) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

        // Get object-fit style
        const getObjectFitStyle = () => {
          switch (imageFit) {
            case "contain":
              return "object-contain";
            case "fill":
              return "object-fill";
            default:
              return "object-cover";
          }
        };

        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Background Image with fit and zoom */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={banner.image_url}
                alt={banner.title}
                className={`absolute inset-0 w-full h-full ${getObjectFitStyle()}`}
                style={{
                  transform: `scale(${imageZoom / 100})`,
                  transformOrigin: "center center",
                }}
              />
            </div>
            
            {/* Gradient Overlay with custom color */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${hexToRgba(overlayColor, overlayOpacity / 100)} 0%, ${hexToRgba(overlayColor, overlayOpacity / 200)} 50%, transparent 100%)`,
              }}
            />

            {/* Edge Fade Effect with custom color */}
            {edgeFade && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: `inset 0 0 100px 50px ${hexToRgba(overlayColor, 0.5)}`,
                }}
              />
            )}
            
            {/* Content */}
            <div className={`relative z-10 h-full flex justify-center ${getContentPositionClasses(theme)}`}>
              <div className={`flex flex-col ${getContentPositionClasses(theme)} px-8 md:px-16 max-w-4xl mx-auto justify-center h-full animate-fade-in`}>
                <h1 className="text-4xl md:text-6xl font-display text-white mb-4 drop-shadow-md">
                  {banner.title}
                </h1>
                {banner.subtitle && (
                  <p className="text-gray-100 text-lg md:text-xl mb-8 font-light max-w-xl drop-shadow-sm">
                    {banner.subtitle}
                  </p>
                )}
                {banner.link_url && (
                  <Button 
                    size="lg"
                    className={`bg-primary hover:bg-primary-dark text-primary-foreground font-medium py-3 px-8 uppercase tracking-wide transition-colors shadow-lg ${getButtonShapeClasses(theme)}`}
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
        );
      })}
      
      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={handlePrevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 backdrop-blur-sm transition-all z-20"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={handleNextSlide}
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
              onClick={() => handleDotClick(index)}
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