import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ui/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const CelebritySpecials = () => {
  const { data: products = [], isLoading } = useProducts({ isCelebritySpecial: true });

  // Take first 4 celebrity specials
  const displayProducts = products.slice(0, 4);

  if (isLoading) {
    return (
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-display text-center font-medium mb-12 capitalize tracking-wide text-foreground">
            Celebrity Specials
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
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
    <section className="py-16 bg-surface">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-display text-center font-medium mb-12 capitalize tracking-wide text-foreground">
          Celebrity Specials
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
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
