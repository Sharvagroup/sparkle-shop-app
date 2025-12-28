import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSectionTitles } from "@/hooks/useSectionTitles";

const BestSellers = () => {
  const { data: products = [], isLoading } = useProducts({ isBestSeller: true });
  const { titles } = useSectionTitles();

  // Take first 4 best sellers
  const displayProducts = products.slice(0, 4);

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-display text-center font-medium mb-4 uppercase tracking-widest text-foreground">
            {titles.bestSellers}
          </h2>
          <div className="w-24 h-0.5 bg-primary mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[1, 2].map((i) => (
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
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-display text-center font-medium mb-4 uppercase tracking-widest text-foreground">
          {titles.bestSellers}
        </h2>
        <div className="w-24 h-0.5 bg-primary mx-auto mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
              variant={index === 0 ? "featured" : undefined}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            className="bg-foreground text-background hover:bg-foreground/90 px-8 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Link to="/products?bestseller=true">View All Best Sellers →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
