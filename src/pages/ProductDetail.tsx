import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  Star,
  StarHalf,
  ChevronRight,
  ZoomIn,
  Droplet,
  Package,
  Sparkles,
  Check,
  Truck,
  Loader2,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PromoBanner from "@/components/layout/PromoBanner";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import ProductCard from "@/components/ui/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id: slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: product, isLoading, error } = useProduct(slug || "");
  const { data: allProducts = [] } = useProducts();
  const addToCart = useAddToCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      toast({ title: "Please sign in to add items to cart", variant: "destructive" });
      navigate("/auth");
      return;
    }
    if (!product) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart.mutateAsync({ productId: product.id, quantity: 1 });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast({ title: "Please sign in to continue", variant: "destructive" });
      navigate("/auth");
      return;
    }
    if (!product) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart.mutateAsync({ productId: product.id, quantity: 1 });
      navigate("/checkout");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Get related products from same category
  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.id !== product?.id &&
        (p.category_id === product?.category_id ||
          p.collection_id === product?.collection_id)
    )
    .slice(0, 4);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={14} className="fill-primary text-primary" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" size={14} className="fill-primary text-primary" />);
    }
    return stars;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PromoBanner />
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PromoBanner />
        <Header />
        <main className="flex-grow container mx-auto px-4 py-24 text-center">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-display mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const productImages = product.images?.length
    ? product.images
    : ["/placeholder.svg"];

  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(
          ((product.original_price - product.price) / product.original_price) * 100
        )
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PromoBanner />
      <Header />

      <main className="flex-grow pb-24 md:pb-0">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 md:px-8 py-4 md:py-6">
          <nav className="text-xs uppercase tracking-wider text-muted-foreground flex flex-wrap items-center gap-2">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="text-border" />
            <Link to="/products" className="hover:text-primary transition-colors">
              Products
            </Link>
            {product.category && (
              <>
                <ChevronRight size={14} className="text-border" />
                <Link
                  to={`/products?category=${product.category.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight size={14} className="text-border" />
            <span className="text-primary font-bold">{product.name}</span>
          </nav>
        </div>

        {/* Product Section */}
        <section className="container mx-auto px-0 md:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12">
            {/* Image Gallery */}
            <div className="flex flex-col-reverse md:flex-row gap-4 h-fit lg:sticky lg:top-24 relative group">
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.is_best_seller && (
                  <span className="bg-background/90 backdrop-blur text-foreground text-[10px] md:text-xs font-bold uppercase tracking-wider px-3 py-1 shadow-sm border border-border">
                    Best Seller
                  </span>
                )}
                {product.is_new_arrival && (
                  <span className="bg-primary text-primary-foreground text-[10px] md:text-xs font-bold uppercase tracking-wider px-3 py-1 shadow-sm">
                    New Arrival
                  </span>
                )}
                {product.badge && (
                  <span className="bg-sale text-white text-[10px] md:text-xs font-bold uppercase tracking-wider px-3 py-1 shadow-sm">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="hidden md:flex flex-col gap-4 px-4 md:px-0">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 p-1 bg-card rounded-sm transition-all ${
                        selectedImage === index
                          ? "border-2 border-primary"
                          : "border border-border hover:border-muted-foreground"
                      }`}
                    >
                      <img
                        alt={`Thumbnail ${index + 1}`}
                        className={`w-full h-full object-cover transition-opacity ${
                          selectedImage === index
                            ? "opacity-100"
                            : "opacity-70 hover:opacity-100"
                        }`}
                        src={image}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="flex-1 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:overflow-visible flex md:block w-full h-[50vh] md:h-[600px] bg-card border-b md:border border-border rounded-sm relative items-center">
                <div className="snap-center shrink-0 w-full h-full md:h-auto flex items-center justify-center p-0 md:p-4">
                  <img
                    alt={product.name}
                    className="w-full h-full object-cover md:object-contain transition-transform duration-700 cursor-crosshair"
                    src={productImages[selectedImage]}
                  />
                </div>
                <div className="hidden md:flex absolute top-4 right-4 bg-background/80 backdrop-blur rounded-full p-2 text-muted-foreground pointer-events-none">
                  <ZoomIn size={20} />
                </div>
              </div>

              {/* Mobile Image Dots */}
              {productImages.length > 1 && (
                <div className="flex md:hidden justify-center gap-2 py-3">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        selectedImage === index ? "bg-primary" : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col px-4 md:px-0 pt-6 md:pt-0">
              <div className="flex justify-between items-start">
                <h1 className="font-display text-3xl md:text-5xl text-foreground mb-2 leading-tight">
                  {product.name}
                </h1>
                <button className="hidden md:block text-muted-foreground hover:text-sale transition-colors">
                  <Heart size={28} />
                </button>
              </div>

              {/* SKU & Rating */}
              <div className="flex items-center gap-4 mb-6 mt-2">
                {product.sku && (
                  <>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      #{product.sku}
                    </span>
                    <span className="h-4 w-px bg-border"></span>
                  </>
                )}
                <div className="flex items-center gap-2">
                  <div className="flex text-primary">{renderStars(product.rating)}</div>
                  <span className="text-xs text-muted-foreground">
                    ({product.review_count} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 bg-muted p-4 rounded-sm border border-border">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-foreground">
                    {formatPrice(product.price)}
                  </span>
                  {product.original_price && (
                    <span className="text-lg text-muted-foreground line-through decoration-1">
                      {formatPrice(product.original_price)}
                    </span>
                  )}
                  {discount && (
                    <span className="text-sm font-bold text-sale bg-sale/10 px-2 py-0.5 rounded">
                      {discount}% OFF
                    </span>
                  )}
                </div>
                <span className="block text-xs text-muted-foreground mt-2">
                  Inclusive of all taxes. Free insured shipping.
                </span>
              </div>

              <div className="h-px bg-border w-full mb-8"></div>

              {/* Product Options */}
              <div className="space-y-6 mb-8">
                {/* Material */}
                {product.material && (
                  <div>
                    <span className="text-sm font-bold uppercase tracking-wide text-foreground mb-2 block">
                      Material
                    </span>
                    <p className="text-muted-foreground text-sm">{product.material}</p>
                  </div>
                )}

                {/* Stock Status */}
                <div>
                  <span className="text-sm font-bold uppercase tracking-wide text-foreground mb-2 block">
                    Availability
                  </span>
                  <p
                    className={`text-sm ${
                      product.stock_quantity > 0 ? "text-green-600" : "text-destructive"
                    }`}
                  >
                    {product.stock_quantity > 0
                      ? `In Stock (${product.stock_quantity} available)`
                      : "Out of Stock"}
                  </p>
                </div>
              </div>

              {/* Action Buttons - Desktop */}
              <div className="hidden md:flex flex-row gap-4 mb-8">
                <Button
                  variant="outline"
                  className="flex-1 py-6 font-bold uppercase tracking-wider"
                  disabled={product.stock_quantity === 0 || isAddingToCart}
                  onClick={handleAddToCart}
                >
                  {isAddingToCart ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                  Add to Cart
                </Button>
                <Button
                  className="flex-1 py-6 bg-primary hover:bg-primary-dark text-primary-foreground font-bold uppercase tracking-wider shadow-lg shadow-primary/20"
                  disabled={product.stock_quantity === 0 || isAddingToCart}
                  onClick={handleBuyNow}
                >
                  {isAddingToCart ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                  Buy Now
                </Button>
              </div>

              {/* Accordions */}
              <div className="border-t border-border">
                <Accordion type="single" collapsible defaultValue="description">
                  <AccordionItem value="description" className="border-b border-border">
                    <AccordionTrigger className="text-sm font-bold uppercase tracking-wider py-5 hover:text-primary">
                      Description
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-6">
                      <p>{product.description}</p>
                      {product.long_description && (
                        <p className="mt-4">{product.long_description}</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="specifications" className="border-b border-border">
                    <AccordionTrigger className="text-sm font-bold uppercase tracking-wider py-5 hover:text-primary">
                      Specifications
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm pb-6">
                      <div className="grid grid-cols-2 gap-y-3">
                        {product.material && (
                          <>
                            <span className="font-medium text-foreground">Material</span>
                            <span>{product.material}</span>
                          </>
                        )}
                        {product.category && (
                          <>
                            <span className="font-medium text-foreground">Category</span>
                            <span>{product.category.name}</span>
                          </>
                        )}
                        {product.collection && (
                          <>
                            <span className="font-medium text-foreground">Collection</span>
                            <span>{product.collection.name}</span>
                          </>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {product.care_instructions && (
                    <AccordionItem value="care" className="border-b border-border">
                      <AccordionTrigger className="text-sm font-bold uppercase tracking-wider py-5 hover:text-primary">
                        Care Instructions
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-sm pb-6">
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <Droplet size={18} className="text-primary flex-shrink-0" />
                            {product.care_instructions}
                          </li>
                          <li className="flex items-start gap-3">
                            <Package size={18} className="text-primary flex-shrink-0" />
                            Store in the provided jewelry box.
                          </li>
                          <li className="flex items-start gap-3">
                            <Sparkles size={18} className="text-primary flex-shrink-0" />
                            Clean with a soft, dry cloth only.
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-6 mt-6 bg-muted rounded-sm">
                <div className="flex flex-col items-center text-center gap-2">
                  <Check size={24} className="text-primary" />
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Quality Assured
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Package size={24} className="text-primary" />
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Secure Packaging
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck size={24} className="text-primary" />
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Fast Shipping
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="flex gap-3">
            <button className="w-12 flex items-center justify-center border border-border rounded-sm text-muted-foreground hover:text-sale transition-colors">
              <Heart size={20} />
            </button>
            <Button
              variant="outline"
              className="flex-1 font-bold uppercase text-xs tracking-wider py-3.5"
              disabled={product.stock_quantity === 0 || isAddingToCart}
              onClick={handleAddToCart}
            >
              {isAddingToCart ? <Loader2 className="animate-spin" size={16} /> : "Add to Cart"}
            </Button>
            <Button
              className="flex-1 bg-primary text-primary-foreground font-bold uppercase text-xs tracking-wider py-3.5"
              disabled={product.stock_quantity === 0 || isAddingToCart}
              onClick={handleBuyNow}
            >
              {isAddingToCart ? <Loader2 className="animate-spin" size={16} /> : "Buy Now"}
            </Button>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="container mx-auto px-4 md:px-8 py-16 border-t border-border">
            <h2 className="text-2xl md:text-3xl font-display text-center font-medium mb-12 uppercase tracking-widest text-foreground">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.slug}
                  name={p.name}
                  description={p.description || ""}
                  price={p.price}
                  originalPrice={p.original_price || undefined}
                  image={p.images?.[0] || "/placeholder.svg"}
                  rating={p.rating}
                  reviewCount={p.review_count}
                  badge={p.badge || undefined}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
