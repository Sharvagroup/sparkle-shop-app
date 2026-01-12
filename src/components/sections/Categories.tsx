import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCategories, Category, CategoryTheme } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";
import { useSectionTitles } from "@/hooks/useSectionTitles";
import { useSiteSetting } from "@/hooks/useSiteSettings";

interface CategoriesTheme {
  section_padding: "small" | "medium" | "large";
  items_to_show: number;
  scroll_snap?: boolean;
  scroll_smooth?: boolean;
  visible_items_at_once?: number;
  title_to_items_padding?: number;
}

const defaultSectionTheme: CategoriesTheme = {
  section_padding: "medium",
  items_to_show: 8,
  scroll_snap: true,
  scroll_smooth: true,
  visible_items_at_once: 4,
  title_to_items_padding: 48,
};

// Default individual item theme - matches CategoryItemThemeDialog defaults
const defaultItemTheme: CategoryTheme = {
  display_shape: "rounded",
  image_size: "medium",
  font_size: "base",
  font_weight: "medium",
  hover_effect: "lift",
  hover_border_color: "#d4af37",
  overlay_opacity: 0,
  overlay_color: "#000000",
  text_position: "below",
};

const Categories = () => {
  const { data: categories = [], isLoading } = useCategories();
  const { titles } = useSectionTitles();
  const { data: sectionTheme } = useSiteSetting<CategoriesTheme>("categories_theme");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);

  const theme: CategoriesTheme = { ...defaultSectionTheme, ...sectionTheme };

  // Limit displayed categories
  const displayCategories = categories.slice(0, theme.items_to_show);

  // Track window width for responsive calculations
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update scroll buttons when window resizes or categories change
  useEffect(() => {
    updateScrollButtons();
  }, [windowWidth, displayCategories]);

  const getPaddingClass = () => {
    switch (theme.section_padding) {
      case "small": return "py-10";
      case "large": return "py-20";
      default: return "py-16";
    }
  };

  // Get responsive item size based on screen width and theme setting
  const getResponsiveItemSize = (baseSize: number): number => {
    if (windowWidth < 640) {
      // Mobile: scale down by 0.7
      return Math.round(baseSize * 0.7);
    } else if (windowWidth < 768) {
      // Small tablet: scale down by 0.85
      return Math.round(baseSize * 0.85);
    } else if (windowWidth < 1024) {
      // Tablet: use base size
      return baseSize;
    } else {
      // Desktop: slightly larger if space allows
      return Math.round(baseSize * 1.05);
    }
  };


  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      return () => {
        container.removeEventListener("scroll", updateScrollButtons);
      };
    }
  }, []);

  // Calculate responsive scroll amount based on visible items and item size
  const getScrollAmount = () => {
    const baseItemSize = 160; // Default medium size
    const responsiveSize = getResponsiveItemSize(baseItemSize);
    const gap = windowWidth < 768 ? 16 : windowWidth < 1024 ? 32 : 48; // Responsive gap
    const visibleCount = Math.max(2, Math.min(theme.visible_items_at_once ?? 4, Math.floor((windowWidth - 128) / (responsiveSize + gap))));
    return (responsiveSize + gap) * Math.max(1, Math.floor(visibleCount * 0.75));
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = getScrollAmount();
      scrollContainerRef.current.scrollBy({ 
        left: -scrollAmount, 
        behavior: theme.scroll_smooth !== false ? "smooth" : "auto" 
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = getScrollAmount();
      scrollContainerRef.current.scrollBy({ 
        left: scrollAmount, 
        behavior: theme.scroll_smooth !== false ? "smooth" : "auto" 
      });
    }
  };

  if (isLoading) {
    return (
      <section className={`${getPaddingClass()} bg-surface`}>
        <div className="container mx-auto px-4 text-center">
          <h2 
            className="text-xl sm:text-2xl md:text-3xl font-display font-medium uppercase tracking-widest text-foreground"
            style={{ marginBottom: `${Math.max(24, (theme.title_to_items_padding ?? 48) * (windowWidth < 640 ? 0.6 : windowWidth < 1024 ? 0.8 : 1))}px` }}
          >
            {titles.categories}
          </h2>
          <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-12 overflow-x-auto scrollbar-hide px-2 sm:px-4 max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center flex-shrink-0">
                <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full" />
                <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 mt-3 sm:mt-4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className={`${getPaddingClass()} bg-surface`}>
      <div className="container mx-auto px-4 text-center">
        <h2 
          className="text-xl sm:text-2xl md:text-3xl font-display font-medium uppercase tracking-widest text-foreground"
          style={{ marginBottom: `${Math.max(24, (theme.title_to_items_padding ?? 48) * (windowWidth < 640 ? 0.6 : windowWidth < 1024 ? 0.8 : 1))}px` }}
        >
          {titles.categories}
        </h2>

        <div className="relative flex items-center justify-center w-full">
          {/* Left Arrow Button - Show on larger screens */}
          <button
            onClick={handleScrollLeft}
            disabled={!canScrollLeft}
            className={`hidden sm:flex absolute left-0 md:left-2 lg:left-4 z-10 items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-300 ${
              canScrollLeft
                ? "bg-background/90 backdrop-blur-sm border border-border shadow-lg hover:bg-background hover:shadow-xl hover:scale-110 text-foreground cursor-pointer"
                : "bg-muted/50 border border-border/50 shadow-sm text-muted-foreground/40 cursor-not-allowed opacity-50"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft 
              size={20}
              className="sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform duration-300"
            />
          </button>

          <div
            ref={scrollContainerRef}
            className={`flex gap-4 sm:gap-6 md:gap-8 lg:gap-12 overflow-x-auto scrollbar-hide px-2 sm:px-4 md:px-6 w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto ${
              theme.scroll_smooth !== false ? "scroll-smooth" : ""
            } ${theme.scroll_snap !== false ? "snap-x snap-mandatory" : ""}`}
            style={{ 
              scrollbarWidth: "none", 
              msOverflowStyle: "none",
              scrollBehavior: theme.scroll_smooth !== false ? "smooth" : "auto",
              scrollSnapType: theme.scroll_snap !== false ? "x mandatory" : "none"
            }}
          >
            {displayCategories.map((category, index) => {
              // Use individual item theme only - merge with defaults
              const itemTheme: CategoryTheme = { ...defaultItemTheme, ...(category.theme || {}) };
              
              // Get shape from item theme
              const itemShape = itemTheme.display_shape!;
              const itemShapeClass = itemShape === "square" ? "rounded-none" : itemShape === "rounded" ? "rounded-xl" : "rounded-full";
              
              // Get base size from item theme (map to pixel values)
              const baseSize = itemTheme.image_size === "small" ? 120 : itemTheme.image_size === "large" ? 200 : 160;
              // Apply responsive scaling
              const itemSize = getResponsiveItemSize(baseSize);
              
              // Get hover effect from item theme
              const hasScale = itemTheme.hover_effect === "lift";
              const hasGlow = itemTheme.hover_effect === "glow";
              const hasBorder = itemTheme.hover_effect === "border";
              
              // Get hover border color from item theme
              const hoverBorderColor = itemTheme.hover_border_color!;
              
              // Get font size from item theme with responsive scaling using Tailwind classes
              const itemFontSize = itemTheme.font_size!;
              const fontSizeClass = itemFontSize === "large" 
                ? "text-xs sm:text-sm md:text-base" 
                : itemFontSize === "base" 
                ? "text-xs sm:text-xs md:text-sm" 
                : "text-[10px] sm:text-[10px] md:text-xs";
              
              // Get font weight
              const fontWeightClass = itemTheme.font_weight === "bold" ? "font-bold" : itemTheme.font_weight === "normal" ? "font-normal" : "font-medium";
              
              return (
                <Link
                  key={category.id}
                  to={`/products?category=${category.slug}`}
                  className={`group cursor-pointer flex-shrink-0 ${theme.scroll_snap !== false ? "snap-center" : ""}`}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    scrollSnapAlign: theme.scroll_snap !== false ? "start" : "none"
                  }}
                >
                  <div 
                    className={`mx-auto overflow-hidden border-2 md:border-[3px] lg:border-4 border-card shadow-lg transition-all duration-300 bg-card flex items-center justify-center relative ${itemShapeClass} ${hasScale ? 'group-hover:scale-105' : ''} ${hasGlow ? 'group-hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]' : ''}`}
                    style={{ 
                      width: `${itemSize}px`, 
                      height: `${itemSize}px`,
                    }}
                    onMouseEnter={(e) => {
                      if (hasBorder && hoverBorderColor) {
                        e.currentTarget.style.borderColor = hoverBorderColor.startsWith("hsl") ? "hsl(var(--primary))" : hoverBorderColor;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'hsl(var(--card))';
                    }}
                  >
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-full object-cover"
                        loading={index < 4 ? "eager" : "lazy"}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                        <span className="text-lg sm:text-xl md:text-2xl text-muted-foreground uppercase font-bold">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    {/* Overlay for text_position: overlay */}
                    {itemTheme.text_position === "overlay" && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center px-2"
                        style={{ 
                          backgroundColor: `${itemTheme.overlay_color}${Math.round((itemTheme.overlay_opacity || 0) * 2.55).toString(16).padStart(2, '0')}`
                        }}
                      >
                        <h3 
                          className={`${fontWeightClass} tracking-wider text-white transition-colors ${fontSizeClass} text-center`}
                        >
                          {category.name}
                        </h3>
                      </div>
                    )}
                  </div>
                  {/* Text below image (default) */}
                  {itemTheme.text_position !== "overlay" && (
                    <h3 
                      className={`mt-2 sm:mt-3 md:mt-4 ${fontWeightClass} tracking-wider text-muted-foreground group-hover:text-primary transition-colors ${fontSizeClass} px-1 break-words`}
                      style={{ maxWidth: `${itemSize}px` }}
                    >
                      {category.name}
                    </h3>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Arrow Button - Show on larger screens */}
          <button
            onClick={handleScrollRight}
            disabled={!canScrollRight}
            className={`hidden sm:flex absolute right-0 md:right-2 lg:right-4 z-10 items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-300 ${
              canScrollRight
                ? "bg-background/90 backdrop-blur-sm border border-border shadow-lg hover:bg-background hover:shadow-xl hover:scale-110 text-foreground cursor-pointer"
                : "bg-muted/50 border border-border/50 shadow-sm text-muted-foreground/40 cursor-not-allowed opacity-50"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight 
              size={20}
              className="sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform duration-300"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;
