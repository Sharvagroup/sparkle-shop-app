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
}

interface CategoryDisplayTheme {
  display_shape: "circle" | "square" | "rounded";
  image_size: number;
  font_size: "small" | "medium" | "large";
  text_transform: "none" | "uppercase" | "capitalize";
  hover_border_color: string;
  hover_border_width: number;
  show_hover_scale: boolean;
}

const defaultSectionTheme: CategoriesTheme = {
  section_padding: "medium",
  items_to_show: 8,
};

const defaultDisplayTheme: CategoryDisplayTheme = {
  display_shape: "circle",
  image_size: 160,
  font_size: "small",
  text_transform: "uppercase",
  hover_border_color: "hsl(var(--primary))",
  hover_border_width: 4,
  show_hover_scale: true,
};

// Default individual item theme
const defaultItemTheme: CategoryTheme = {
  display_shape: undefined,
  image_size: undefined,
  font_size: undefined,
  font_weight: "medium",
  hover_effect: "lift",
  hover_border_color: undefined,
  overlay_opacity: 0,
  overlay_color: "#000000",
  text_position: "below",
};

const Categories = () => {
  const { data: categories = [], isLoading } = useCategories();
  const { titles } = useSectionTitles();
  const { data: sectionTheme } = useSiteSetting<CategoriesTheme>("categories_theme");
  const { data: displayTheme } = useSiteSetting<CategoryDisplayTheme>("category_display_theme");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const theme: CategoriesTheme = { ...defaultSectionTheme, ...sectionTheme };
  const display: CategoryDisplayTheme = { ...defaultDisplayTheme, ...displayTheme };

  // Limit displayed categories
  const displayCategories = categories.slice(0, theme.items_to_show);

  // Fallback images for categories without images
  const fallbackImages: Record<string, string> = {
    necklaces: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgnrpEgkI1QzOloLVRoZubnvhpDFVQ4Qud6cJihl-z93q-RdtGcR9E2WPpCeZWyp6ocP_Jzzrwj9Ug9ze57a2HHgowYFj7z2_0aDFYI-6HofUry6hMJxhij37VYXK2M-K-bMyWkulsYMTymA6YbM82g9DyjENIwgwDPK5V9_DzPSU7COuiK4JWsUEfqNdlOhytwBjVnz_ebk1pk1uoGKsVrVFDZbPrSD6HjwL_kbcEaVE_O1Xp-kLWcny2fzviFPPi43o2QS_BT0o",
    earrings: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNXyBuepQbXzJD9ZalC-4K30IvF65JotjSUWjvsmydP5kMiVZZ1ZGMfoza_QBfanJeh9x-3ytscDax3tFDuXgzQAm0XAfjTyIJej-VBf0Rlct9b6P_7KqzmhVJKMZUah1LSOB53fa-ZbrKY9iRYqRY7i4c6yf5JAJRhHxK4MU4Ibtvu5WGP3eZm4UnO2W7JyNPNnyzh_olTzDQeZp3zDv9m6PIReNrV9yHTkfpJ-CSnX959g3gd4V5rv_MLq-CLAm9pRqlEcKhZjo",
    bracelets: "https://lh3.googleusercontent.com/aida-public/AB6AXuDp_0B1KgtYRzcSF5ehgix-iOn8E4luEGY231KSM34pFmix6ccIZTWUdeXQe_vhcsDeHyy9XP6XOxvlG-sdzwouDijhfVH9TVmpMESWKAWTQh1rEHSDBiSSTy9eC2oVc6qKq155y4ZYI-t2NReVYBVgPrMBJkvzp-GIsHG0hBVAPl0cK5CtmYzkB_sqh2DdlMzpSm00uV1X7R9ytyUr_lD8P3RZTEjtmegGHeo7akylVmnqnDsfp2k8jVm7mDUIX6kNKwqDLO2kTT8",
    rings: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQSW865YqCIhCuqGB_9c5AcP645zVYLdC7wL4ukgs1xFQPJEdLFFeNi1tm_N-sNf-DJaeJUOQCFrW9wYZWhkqc1SRAoR8tJTZZm1-QXkrXYyjZ6qtHWUDzzag014baCYNQPbmZY_nKyFx_yh_GWkXeI7JBd0QnpnsdbVbLiuwIDh5NMm3ZwZWXzzNivl0Pxo3hJ61QQvD-UCRy_YE1uG7eE-r8S25RdOcRqE-zWm1nESevsXsjHBabxYPoQ6iNk1Dqj6Wqu9JSIRc",
  };

  const getCategoryImage = (category: { image_url: string | null; slug: string }) => {
    if (category.image_url) return category.image_url;
    return fallbackImages[category.slug] || fallbackImages.necklaces;
  };

  const getPaddingClass = () => {
    switch (theme.section_padding) {
      case "small": return "py-8";
      case "large": return "py-16";
      default: return "py-12";
    }
  };

  const getShapeClass = () => {
    switch (display.display_shape) {
      case "square": return "rounded-none";
      case "rounded": return "rounded-xl";
      default: return "rounded-full";
    }
  };

  const getFontSizeClass = () => {
    switch (display.font_size) {
      case "medium": return "text-sm";
      case "large": return "text-base";
      default: return "text-xs";
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
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <section className={`${getPaddingClass()} bg-surface`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-medium mb-12 uppercase tracking-widest text-foreground">
            {titles.categories}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 w-full max-w-5xl mx-auto px-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className={`w-32 h-32 md:w-40 md:h-40 ${getShapeClass()}`} />
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
        <h2 className="text-2xl md:text-3xl font-display font-medium mb-12 uppercase tracking-widest text-foreground">
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
            className="flex gap-8 md:gap-12 overflow-x-auto scrollbar-hide scroll-smooth px-4 max-w-5xl snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {displayCategories.map((category, index) => {
              // Merge individual item theme with display theme
              const itemTheme: CategoryTheme = { ...defaultItemTheme, ...category.theme };
              
              // Get individual shape or fallback to global display
              const itemShape = itemTheme.display_shape || display.display_shape;
              const itemShapeClass = itemShape === "square" ? "rounded-none" : itemShape === "rounded" ? "rounded-xl" : "rounded-full";
              
              // Get individual size or fallback
              const itemSize = itemTheme.image_size === "small" ? 120 : itemTheme.image_size === "large" ? 200 : (itemTheme.image_size === "medium" ? 160 : display.image_size);
              
              // Get individual hover effect
              const hasScale = itemTheme.hover_effect === "lift" || display.show_hover_scale;
              const hasGlow = itemTheme.hover_effect === "glow";
              const hasBorder = itemTheme.hover_effect === "border";
              
              // Get hover border color
              const hoverBorderColor = itemTheme.hover_border_color || display.hover_border_color;
              
              // Get font size
              const itemFontSize = itemTheme.font_size || display.font_size;
              const fontSizeClass = itemFontSize === "large" ? "text-base" : itemFontSize === "base" ? "text-sm" : "text-xs";
              
              // Get font weight
              const fontWeightClass = itemTheme.font_weight === "bold" ? "font-bold" : itemTheme.font_weight === "normal" ? "font-normal" : "font-medium";
              
              return (
                <Link
                  key={category.id}
                  to={`/products?category=${category.slug}`}
                  className="group cursor-pointer flex-shrink-0 snap-center"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div 
                    className={`mx-auto overflow-hidden border-4 border-card shadow-lg transition-all duration-300 bg-card flex items-center justify-center relative ${itemShapeClass} ${hasScale ? 'group-hover:scale-105' : ''} ${hasGlow ? 'group-hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]' : ''}`}
                    style={{ 
                      width: `${itemSize}px`, 
                      height: `${itemSize}px`,
                    }}
                    onMouseEnter={(e) => {
                      if (hasBorder || display.hover_border_width > 0) {
                        e.currentTarget.style.borderColor = hoverBorderColor.startsWith("hsl") ? "hsl(var(--primary))" : hoverBorderColor;
                        e.currentTarget.style.borderWidth = `${display.hover_border_width}px`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'hsl(var(--card))';
                      e.currentTarget.style.borderWidth = '4px';
                    }}
                  >
                    <img
                      src={getCategoryImage(category)}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
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
                          style={{ textTransform: display.text_transform }}
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
                      style={{ textTransform: display.text_transform }}
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
