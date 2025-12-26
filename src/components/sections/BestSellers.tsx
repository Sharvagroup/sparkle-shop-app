import ProductCard from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: "3",
    name: "Complete Bridal Temple Jewellery Set",
    description: "Includes long necklace, choker, earrings, and maang tikka.",
    price: 12999,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA70FaWv26HzU2Tkpu6XLvJaIUg4dojTTfo39rMjDkPPM5kwG8NsCs9uMxJJoh4jLc2P0uKmfrRopF25331PK4FFVZcfDc3xp9AMPKq3Xl8uZwS_eaSJb7ZLmvert6mxPtrOGldDl23TAm0fuY6GusSVIXSrU7gGOcTLLsuyqMlamAKwo_8XvKfJAB4X8x7Z6jJ70Fc6En1CWB0U9-2VUe3o8F7tIwaqV-LNtDkDWzU6GuutXxGjIYWJyLlASGhYFU_l_KmJf60GBI",
    rating: 5,
    reviewCount: 50,
    badge: "trending" as const,
    variant: "featured" as const,
  },
  {
    id: "4",
    name: "Antique Gold Finish Bangle Set",
    description: "Intricate craftsmanship with matte finish.",
    price: 2800,
    originalPrice: 3200,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgNLm3IugwCheptuArS1htDTHjjWWZuzB6erQGd4RNwGN_j-kUKNW9PgqbhZtqLZjeR-QvoG3PdDkVfoHnP-8L95ugf1_6xKQN7dYqjMjn7GRLjNHfpp3g3PXsUlEPmg0dD87lhBP7g7MVx5tGXOM9xVDKDTiau7RMVRWqWcz4A6JNYBE5AwcOf6srRt3q4xJrd6IDLjB2hkqHGzrlbspBLuhYIexeewItEjQrKe3rQ3XuVEWRjehx9hFo9hLFegLK_yxDhkNTNeA",
    rating: 4,
    reviewCount: 16,
  },
];

const BestSellers = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-display text-center font-medium mb-4 uppercase tracking-widest text-foreground">
          Best Sellers
        </h2>
        <div className="w-24 h-0.5 bg-primary mx-auto mb-12" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button className="bg-foreground text-background hover:bg-foreground/90 px-8 py-3 text-xs font-bold uppercase tracking-wider transition-colors">
            View All Best Sellers →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
