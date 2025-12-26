import ProductCard from "@/components/ui/ProductCard";

const products = [
  {
    id: "5",
    name: "Emerald Drop Polki Earrings",
    description: "Traditional design with modern aesthetics.",
    price: 1850,
    originalPrice: 2500,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdPjx9nKMasMa9b_IxJxCvwk1H_qkulByr26bs329EI0yuV3yqUxeezPEe3vHR-u7XcLscmD6LhQFR-Rj-f5gyGiW1uPqHHKZiiPsjN9_oABaiWAHLv_aUxpV-iQa3nahwiU--NVmL7PKP1ucIWT1IQ7cZEGk16apyAqiDwsDCFzBBbXoEW8ijRQGFM-iuhEJt1UBvz5uubYs4NN3YKFoyGMJry9SLHEBLTh7gu7AsD6hqiN4VuPpu3eNIsfgn2LsHcUklfzDxUzw",
    rating: 4.5,
    reviewCount: 45,
    badge: "sale" as const,
    variant: "featured" as const,
  },
  {
    id: "6",
    name: "Complete Bridal Temple Jewellery Set",
    description: "Includes long necklace, choker, earrings, and maang tikka.",
    price: 12999,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA70FaWv26HzU2Tkpu6XLvJaIUg4dojTTfo39rMjDkPPM5kwG8NsCs9uMxJJoh4jLc2P0uKmfrRopF25331PK4FFVZcfDc3xp9AMPKq3Xl8uZwS_eaSJb7ZLmvert6mxPtrOGldDl23TAm0fuY6GusSVIXSrU7gGOcTLLsuyqMlamAKwo_8XvKfJAB4X8x7Z6jJ70Fc6En1CWB0U9-2VUe3o8F7tIwaqV-LNtDkDWzU6GuutXxGjIYWJyLlASGhYFU_l_KmJf60GBI",
    rating: 5,
    reviewCount: 83,
    badge: "trending" as const,
    variant: "featured" as const,
  },
];

const CelebritySpecials = () => {
  return (
    <section className="py-16 bg-surface">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-display text-center font-medium mb-12 capitalize tracking-wide text-foreground">
          Celebrity Specials
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CelebritySpecials;
