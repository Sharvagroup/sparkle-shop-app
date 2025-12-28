import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useOfferBanners } from "@/hooks/useOffers";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

const OffersBanner = () => {
  const { data: offers = [], isLoading } = useOfferBanners();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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

  // Auto-rotate carousel
  useEffect(() => {
    if (!isAutoPlaying || offers.length <= 1) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, offers.length, nextSlide]);

  // Reset index when offers change
  useEffect(() => {
    setCurrentIndex(0);
  }, [offers.length]);

  if (isLoading) {
    return (
      <section className="py-8 md:py-12 px-4">
        <div className="container mx-auto">
          <Skeleton className="h-[250px] md:h-[350px] max-w-6xl mx-auto rounded-lg" />
        </div>
      </section>
    );
  }

  if (offers.length === 0) return null;

  const currentOffer = offers[currentIndex];

  return (
    <section className="py-8 md:py-12 px-4">
      <div className="container mx-auto">
        <div 
          className="relative max-w-6xl mx-auto rounded-lg overflow-hidden shadow-xl"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Carousel Container */}
          <div className="relative aspect-[21/9] md:aspect-[3/1] bg-card">
            {offers.map((offer, index) => (
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
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="px-8 md:px-16 max-w-xl">
                    <h2 className="text-2xl md:text-4xl font-display text-white mb-3 drop-shadow-md animate-fade-in">
                      {offer.title}
                    </h2>
                    {offer.subtitle && (
                      <p className="text-white/90 mb-2 text-base md:text-lg drop-shadow animate-fade-in">
                        {offer.subtitle}
                      </p>
                    )}
                    {offer.discount_code && (
                      <p className="text-sm text-white/80 mb-4 animate-fade-in">
                        Use code: <span className="font-bold text-white bg-primary/80 px-2 py-0.5 rounded">{offer.discount_code}</span>
                      </p>
                    )}
                    {offer.link_url && (
                      <Button 
                        asChild 
                        className="bg-white text-foreground hover:bg-white/90 px-6 py-2.5 text-sm font-semibold uppercase tracking-wider animate-fade-in"
                      >
                        <Link to={offer.link_url}>{offer.button_text || "Shop Now"}</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
