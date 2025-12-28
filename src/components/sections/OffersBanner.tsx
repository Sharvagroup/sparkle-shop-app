import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useOfferBanners, OfferTheme } from "@/hooks/useOffers";
import { useSiteSetting } from "@/hooks/useSiteSettings";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface OfferBannerTheme {
  section_height: "small" | "medium" | "large";
  auto_slide_speed: number;
  section_padding: "small" | "medium" | "large";
  overlay_enabled: boolean;
  overlay_color: string;
  overlay_opacity: number;
  content_position: "left" | "center" | "right";
}

const defaultTheme: OfferBannerTheme = {
  section_height: "medium",
  auto_slide_speed: 5,
  section_padding: "medium",
  overlay_enabled: true,
  overlay_color: "#000000",
  overlay_opacity: 50,
  content_position: "left",
};

// Default individual item theme
const defaultItemTheme: OfferTheme = {
  content_position: "left",
  overlay_opacity: 50,
  overlay_color: "#000000",
  edge_fade: false,
  button_shape: "rounded",
  image_fit: "cover",
  image_zoom: 100,
  text_color: "#ffffff",
  card_style: "shadow",
};

const OffersBanner = () => {
  const { data: offers = [], isLoading } = useOfferBanners();
  const { data: savedTheme } = useSiteSetting<OfferBannerTheme>("offer_banner_theme");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const theme: OfferBannerTheme = {
    ...defaultTheme,
    ...savedTheme,
  };

  const nextSlide = useCallback(() => {
    if (offers.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }
  }, [offers.length]);

  const prevSlide = useCallback(() => {
    if (offers.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
    }
  }, [offers.length]);

  // Auto-rotate carousel with theme speed
  useEffect(() => {
    if (!isAutoPlaying || offers.length <= 1) return;

    const interval = setInterval(nextSlide, theme.auto_slide_speed * 1000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, offers.length, nextSlide, theme.auto_slide_speed]);

  // Reset index when offers change
  useEffect(() => {
    setCurrentIndex(0);
  }, [offers.length]);

  // Get height class based on theme
  const getHeightClass = () => {
    switch (theme.section_height) {
      case "small": return "h-[200px] md:h-[250px]";
      case "large": return "h-[350px] md:h-[450px]";
      default: return "h-[280px] md:h-[350px]";
    }
  };

  // Get padding class based on theme
  const getPaddingClass = () => {
    switch (theme.section_padding) {
      case "small": return "py-4 md:py-6";
      case "large": return "py-12 md:py-16";
      default: return "py-8 md:py-12";
    }
  };

  // Get content position classes
  const getContentPositionClass = () => {
    switch (theme.content_position) {
      case "center": return "items-center justify-center text-center";
      case "right": return "items-center justify-end text-right";
      default: return "items-center justify-start text-left";
    }
  };

  // Get overlay gradient direction
  const getOverlayGradient = () => {
    if (!theme.overlay_enabled) return "transparent";
    const opacity = Math.round(theme.overlay_opacity * 2.55).toString(16).padStart(2, '0');
    const color = theme.overlay_color + opacity;
    switch (theme.content_position) {
      case "center": return `linear-gradient(to bottom, ${color}, transparent 30%, transparent 70%, ${color})`;
      case "right": return `linear-gradient(to left, ${color} 0%, transparent 70%)`;
      default: return `linear-gradient(to right, ${color} 0%, transparent 70%)`;
    }
  };

  if (isLoading) {
    return (
      <section className={`${getPaddingClass()} px-4`}>
        <div className="container mx-auto">
          <Skeleton className={`${getHeightClass()} max-w-6xl mx-auto rounded-lg`} />
        </div>
      </section>
    );
  }

  if (offers.length === 0) return null;

  const currentOffer = offers[currentIndex];

  return (
    <section className={`${getPaddingClass()} px-4`}>
      <div className="container mx-auto">
        <div 
          className="relative max-w-6xl mx-auto rounded-lg overflow-hidden shadow-xl"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Carousel Container */}
          <div className={`relative ${getHeightClass()} bg-card`}>
            {offers.map((offer, index) => {
              // Merge individual item theme with global theme
              const itemTheme: OfferTheme = { ...defaultItemTheme, ...offer.theme };
              
              // Get individual content position or fallback to global
              const itemContentPosition = itemTheme.content_position || theme.content_position;
              const itemPositionClass = itemContentPosition === "center" 
                ? "items-center justify-center text-center" 
                : itemContentPosition === "right" 
                ? "items-center justify-end text-right" 
                : "items-center justify-start text-left";
              
              // Get overlay settings from individual theme
              const itemOverlayOpacity = itemTheme.overlay_opacity ?? theme.overlay_opacity;
              const itemOverlayColor = itemTheme.overlay_color || theme.overlay_color;
              const itemEdgeFade = itemTheme.edge_fade ?? false;
              
              // Build overlay gradient
              const overlayOpacity = itemOverlayOpacity / 100;
              const opacityHex = Math.round(overlayOpacity * 255).toString(16).padStart(2, '0');
              const itemOverlayGradient = itemEdgeFade
                ? `linear-gradient(to bottom, transparent, ${itemOverlayColor}${opacityHex} 70%)`
                : itemContentPosition === "center"
                ? `linear-gradient(to bottom, ${itemOverlayColor}${opacityHex}, transparent 30%, transparent 70%, ${itemOverlayColor}${opacityHex})`
                : itemContentPosition === "right"
                ? `linear-gradient(to left, ${itemOverlayColor}${opacityHex} 0%, transparent 70%)`
                : `linear-gradient(to right, ${itemOverlayColor}${opacityHex} 0%, transparent 70%)`;
              
              // Get button shape (rounded or box)
              const buttonShapeClass = itemTheme.button_shape === "box" 
                ? "rounded-none" 
                : "rounded-lg";
              
              // Get text color
              const textColor = itemTheme.text_color || "#ffffff";
              
              return (
                <div
                  key={offer.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  {/* Background Image */}
                  <img
                    src={offer.image_url}
                    alt={offer.title}
                    className="w-full h-full"
                    style={{ 
                      objectFit: itemTheme.image_fit || "cover",
                      transform: `scale(${(itemTheme.image_zoom || 100) / 100})`,
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div 
                    className="absolute inset-0" 
                    style={{ background: itemOverlayGradient }}
                  />
                  
                  {/* Content */}
                  <div className={`absolute inset-0 flex ${itemPositionClass}`}>
                    <div className={`px-8 md:px-16 max-w-xl ${itemContentPosition === "center" ? "mx-auto" : ""}`}>
                      <h2 
                        className="text-2xl md:text-4xl font-display mb-3 drop-shadow-md animate-fade-in"
                        style={{ color: textColor }}
                      >
                        {offer.title}
                      </h2>
                      {offer.subtitle && (
                        <p 
                          className="mb-2 text-base md:text-lg drop-shadow animate-fade-in"
                          style={{ color: `${textColor}e6` }}
                        >
                          {offer.subtitle}
                        </p>
                      )}
                      {offer.discount_code && (
                        <p 
                          className="text-sm mb-4 animate-fade-in"
                          style={{ color: `${textColor}cc` }}
                        >
                          Use code: <span className="font-bold bg-primary/80 px-2 py-0.5 rounded" style={{ color: textColor }}>{offer.discount_code}</span>
                        </p>
                      )}
                      {offer.link_url && (
                        <Button 
                          asChild 
                          className={`bg-white text-foreground hover:bg-white/90 px-6 py-2.5 text-sm font-semibold uppercase tracking-wider animate-fade-in ${buttonShapeClass}`}
                        >
                          <Link to={offer.link_url}>{offer.button_text || "Shop Now"}</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          {offers.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-2 transition-all duration-200"
                aria-label="Previous offer"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-2 transition-all duration-200"
                aria-label="Next offer"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {offers.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {offers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-white w-6"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Go to offer ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OffersBanner;
