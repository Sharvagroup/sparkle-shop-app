import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSectionTitles } from "@/hooks/useSectionTitles";
import { useSiteSetting } from "@/hooks/useSiteSettings";

interface SectionTheme {
  section_padding: "small" | "medium" | "large";
  items_to_show: number;
  columns: number;
  title_to_items_padding?: number;
}

const defaultTheme: SectionTheme = {
  section_padding: "medium",
  items_to_show: 4,
  columns: 2,
  title_to_items_padding: 48,
};

const NewArrivals = () => {
  const { data: products = [], isLoading } = useProducts({ isNewArrival: true });
  const { titles } = useSectionTitles();
  const { data: savedTheme } = useSiteSetting<SectionTheme>("new_arrivals_theme");

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
      case 2: return "grid-cols-1 md:grid-cols-2";
      case 3: return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4: return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      default: return "grid-cols-1 md:grid-cols-2";
    }
  };

  if (isLoading) {
    return (
      <section className={`${getPaddingClass()} bg-background`}>
        <div className="container mx-auto px-4">
          <h2 
            className="text-2xl md:text-3xl font-display text-center font-medium uppercase tracking-widest text-foreground"
            style={{ marginBottom: `${theme.title_to_items_padding ?? 48}px` }}
          >
            {titles.newArrivals}
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
    <section className={`${getPaddingClass()} bg-background`}>
      <div className="container mx-auto px-4">
        <h2 
          className="text-2xl md:text-3xl font-display text-center font-medium uppercase tracking-widest text-foreground"
          style={{ marginBottom: `${theme.title_to_items_padding ?? 48}px` }}
        >
          {titles.newArrivals}
        </h2>

        <div className={`grid ${getGridClass()} gap-8 max-w-6xl mx-auto`}>
          {displayProducts.map((product) => (
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
            />
          ))}
        </div>

        <div className="text-center mt-12 bg-muted py-6 md:py-8">
          <Button
            asChild
            variant="outline"
            className="border-muted-foreground text-foreground hover:bg-foreground hover:text-background px-8 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Link to="/products?new=true">View All Products →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
