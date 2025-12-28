import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ui/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useSectionTitles } from "@/hooks/useSectionTitles";
import { useSiteSetting } from "@/hooks/useSiteSettings";

interface SectionTheme {
  section_padding: "small" | "medium" | "large";
  items_to_show: number;
  columns: number;
}

const defaultTheme: SectionTheme = {
  section_padding: "medium",
  items_to_show: 4,
  columns: 2,
};

const CelebritySpecials = () => {
  const { data: products = [], isLoading } = useProducts({ isCelebritySpecial: true });
  const { titles } = useSectionTitles();
  const { data: savedTheme } = useSiteSetting<SectionTheme>("celebrity_specials_theme");

  const theme: SectionTheme = { ...defaultTheme, ...savedTheme };
  const displayProducts = products.slice(0, theme.items_to_show);

  const getPaddingClass = () => {
    switch (theme.section_padding) {
      case "small": return "py-10";
      case "large": return "py-20";
      default: return "py-16";
    }
  };

  const getGridClass = () => {
    const cols = Math.min(theme.columns, 4);
    switch (cols) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-1 lg:grid-cols-2";
      case 3: return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4: return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      default: return "grid-cols-1 lg:grid-cols-2";
    }
  };

  if (isLoading) {
    return (
      <section className={`${getPaddingClass()} bg-surface`}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-display text-center font-medium mb-12 capitalize tracking-wide text-foreground">
            {titles.celebritySpecials}
          </h2>
          <div className={`grid ${getGridClass()} gap-8 max-w-6xl mx-auto`}>
            {Array.from({ length: Math.min(theme.items_to_show, 4) }).map((_, i) => (
              <Skeleton key={i} className="h-[400px] rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <section className={`${getPaddingClass()} bg-surface`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-display text-center font-medium mb-12 capitalize tracking-wide text-foreground">
          {titles.celebritySpecials}
        </h2>

        <div className={`grid ${getGridClass()} gap-8 max-w-6xl mx-auto`}>
          {displayProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              id={product.slug}
              name={product.name}
              description={product.description || ""}
              price={product.price}
              originalPrice={product.original_price || undefined}
              image={product.images?.[0] || "/placeholder.svg"}
              rating={product.rating}
              reviewCount={product.review_count}
              badge={product.badge || undefined}
              variant={index < 2 ? "featured" : undefined}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/products?celebrity=true"
            className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-primary hover:text-primary/80 transition-colors group"
          >
            View All Celebrity Specials
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CelebritySpecials;
