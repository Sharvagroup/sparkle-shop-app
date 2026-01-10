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

  const theme: CategoriesTheme = { ...defaultSectionTheme, ...sectionTheme };

  // Limit displayed categories
  const displayCategories = categories.slice(0, theme.items_to_show);

  const getPaddingClass = () => {
    switch (theme.section_padding) {
      case "small": return "py-8";
      case "large": return "py-16";
      default: return "py-12";
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
    updateScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      window.addEventListener("resize", updateScrollButtons);
      return () => {
        container.removeEventListener("scroll", updateScrollButtons);
        window.removeEventListener("resize", updateScrollButtons);
      };
    }
  }, [displayCategories]);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ 
        left: -200, 
        behavior: theme.scroll_smooth !== false ? "smooth" : "auto" 
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ 
        left: 200, 
        behavior: theme.scroll_smooth !== false ? "smooth" : "auto" 
      });
    }
  };

  if (isLoading) {
    return (
      <section className={`${getPaddingClass()} bg-surface`}>
        <div className="container mx-auto px-4 text-center">
          <h2 
            className="text-2xl md:text-3xl font-display font-medium uppercase tracking-widest text-foreground"
            style={{ marginBottom: `${theme.title_to_items_padding ?? 48}px` }}
          >
            {titles.categories}
          </h2>
          <div className="flex gap-8 md:gap-12 overflow-x-auto scrollbar-hide px-4 max-w-5xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center flex-shrink-0">
                <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full" />
                <Skeleton className="h-4 w-20 mt-4" />
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
          className="text-2xl md:text-3xl font-display font-medium uppercase tracking-widest text-foreground"
          style={{ marginBottom: `${theme.title_to_items_padding ?? 48}px` }}
        >
          {titles.categories}
        </h2>

        <div className="relative flex items-center justify-center">
          {/* Left Arrow Button */}
          <button
            onClick={handleScrollLeft}
            disabled={!canScrollLeft}
            className={`hidden md:flex absolute left-0 z-10 items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
              canScrollLeft
                ? "bg-background/90 backdrop-blur-sm border border-border shadow-lg hover:bg-background hover:shadow-xl hover:scale-110 text-foreground cursor-pointer"
                : "bg-muted/50 border border-border/50 shadow-sm text-muted-foreground/40 cursor-not-allowed"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft 
              size={24} 
              className={`transition-transform duration-300 ${canScrollLeft ? 'hover:translate-x-[-2px]' : ''}`}
            />
          </button>

          <div
            ref={scrollContainerRef}
            className={`flex gap-8 md:gap-12 overflow-x-auto scrollbar-hide px-4 max-w-5xl ${
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
              
              // Get size from item theme (map to pixel values)
              const itemSize = itemTheme.image_size === "small" ? 120 : itemTheme.image_size === "large" ? 200 : 160;
              
              // Get hover effect from item theme
              const hasScale = itemTheme.hover_effect === "lift";
              const hasGlow = itemTheme.hover_effect === "glow";
              const hasBorder = itemTheme.hover_effect === "border";
              
              // Get hover border color from item theme
              const hoverBorderColor = itemTheme.hover_border_color!;
              
              // Get font size from item theme
              const itemFontSize = itemTheme.font_size!;
              const fontSizeClass = itemFontSize === "large" ? "text-base" : itemFontSize === "base" ? "text-sm" : "text-xs";
              
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
                    className={`mx-auto overflow-hidden border-4 border-card shadow-lg transition-all duration-300 bg-card flex items-center justify-center relative ${itemShapeClass} ${hasScale ? 'group-hover:scale-105' : ''} ${hasGlow ? 'group-hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]' : ''}`}
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
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground uppercase">{category.name.charAt(0)}</span>
                      </div>
                    )}
                    {/* Overlay for text_position: overlay */}
                    {itemTheme.text_position === "overlay" && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ 
                          backgroundColor: `${itemTheme.overlay_color}${Math.round((itemTheme.overlay_opacity || 0) * 2.55).toString(16).padStart(2, '0')}`
                        }}
                      >
                        <h3 
                          className={`${fontWeightClass} tracking-wider text-white transition-colors ${fontSizeClass}`}
                        >
                          {category.name}
                        </h3>
                      </div>
                    )}
                  </div>
                  {/* Text below image (default) */}
                  {itemTheme.text_position !== "overlay" && (
                    <h3 
                      className={`mt-4 ${fontWeightClass} tracking-wider text-muted-foreground group-hover:text-primary transition-colors ${fontSizeClass}`}
                    >
                      {category.name}
                    </h3>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleScrollRight}
            disabled={!canScrollRight}
            className={`hidden md:flex absolute right-0 z-10 items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
              canScrollRight
                ? "bg-background/90 backdrop-blur-sm border border-border shadow-lg hover:bg-background hover:shadow-xl hover:scale-110 text-foreground cursor-pointer"
                : "bg-muted/50 border border-border/50 shadow-sm text-muted-foreground/40 cursor-not-allowed"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight 
              size={24} 
              className={`transition-transform duration-300 ${canScrollRight ? 'hover:translate-x-[2px]' : ''}`}
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;
