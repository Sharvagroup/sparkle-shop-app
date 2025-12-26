import ProductCard from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: "1",
    name: "Royal Kundan Pearl Choker Set",
    description: "Handcrafted with semi-precious stones and pearls.",
    price: 4500,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWRGFiAbDkk_JhmqP4jRz2O5pc2bucAABsIxI-sXyv1BXv9NZDHCBfFSpqXJFvWe9VPF675oTn3mGjN0H1cOAm09SPS4yXykVjJzfC2X3RsYN4KNWH7cBc8GD_4CBAhLgbtsOpCh5Zm2GxhUBv0Bgm9zLrnVCPOupC0scVws-5oyrHlKiOF_kN_unFq1o5OVBaPrppKPhSC05tnea41bSu4jn5EI5AI8397zjmdrxxwS1Ok8zp9HXIi2BprHdI3kzdGT1-pbTy5_A",
    rating: 4.5,
    reviewCount: 12,
    badge: "new" as const,
  },
  {
    id: "2",
    name: "Antique Gold Finish Bangle Set",
    description: "Intricate craftsmanship with matte finish.",
    price: 2800,
    originalPrice: 3200,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNvw9eOBkflou2qNWqZDSE3bEogDSUGh7Gq2hgffwhs0PScvgIhUiPDuEFXiQ_mPfLSVLsDPu_QhmT0HBhPikj-745jibNp76VGVsL96nnyZWD2KTaXFQA1HOeLJOi7ShDH7oUoavJLCC9tKpbtjCQfdqd4kDV0G4SUnmKazB8rkOmUZD7gcOxpb4i6Me-HlsE9CI0QOsXJjqbbEOW_Jooey-lq1bXa4mcuqzNMxXjeEaKMmAH2h1WHz4KDWGl1mj4DXHyhq2rGbQ",
    rating: 4,
    reviewCount: 34,
  },
];

const NewArrivals = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-display text-center font-medium mb-12 uppercase tracking-widest text-foreground">
          New Arrivals
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        
        <div className="text-center mt-12 bg-muted py-6 md:py-8">
          <Button 
            variant="outline" 
            className="border-muted-foreground text-foreground hover:bg-foreground hover:text-background px-8 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            View All Products →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
