import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, Star, StarHalf, ChevronRight, Plus, Minus, ZoomIn, Droplet, Package, Sparkles, Check, Diamond, Truck } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PromoBanner from "@/components/layout/PromoBanner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const productImages = [
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&h=600&fit=crop",
];

const relatedProducts = [
  {
    id: "1",
    name: "Kundan Pearl Choker",
    price: 45000,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop",
  },
  {
    id: "2",
    name: "Emerald Polki Drops",
    price: 88000,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=500&fit=crop",
  },
  {
    id: "3",
    name: "Antique Bangle Set",
    price: 125000,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=500&fit=crop",
  },
  {
    id: "4",
    name: "Temple Matte Bangle",
    price: 92000,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=500&fit=crop",
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [weight, setWeight] = useState("45.500g");
  const [dimension, setDimension] = useState("standard");
  const [size, setSize] = useState("standard");

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PromoBanner />
      <Header />

      <main className="flex-grow pb-24 md:pb-0">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 md:px-8 py-4 md:py-6">
          <nav className="text-xs uppercase tracking-wider text-muted-foreground flex flex-wrap items-center gap-2">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={14} className="text-border" />
            <Link to="/products" className="hover:text-primary transition-colors">Necklaces</Link>
            <ChevronRight size={14} className="text-border" />
            <Link to="/products" className="hover:text-primary transition-colors">Temple Collection</Link>
            <ChevronRight size={14} className="text-border" />
            <span className="text-primary font-bold">Royal Temple Kemp Necklace</span>
          </nav>
        </div>

        {/* Product Section */}
        <section className="container mx-auto px-0 md:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12">
            {/* Image Gallery */}
            <div className="flex flex-col-reverse md:flex-row gap-4 h-fit lg:sticky lg:top-24 relative group">
              {/* Badge */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="bg-background/90 backdrop-blur text-foreground text-[10px] md:text-xs font-bold uppercase tracking-wider px-3 py-1 shadow-sm border border-border">
                  Best Seller
                </span>
              </div>

              {/* Thumbnails */}
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
                        selectedImage === index ? "opacity-100" : "opacity-70 hover:opacity-100"
                      }`}
                      src={image}
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:overflow-visible flex md:block w-full h-[50vh] md:h-[600px] bg-card border-b md:border border-border rounded-sm relative items-center">
                <div className="snap-center shrink-0 w-full h-full md:h-auto flex items-center justify-center p-0 md:p-4">
                  <img
                    alt="Royal Temple Kemp Necklace"
                    className="w-full h-full object-cover md:object-contain transition-transform duration-700 cursor-crosshair"
                    src={productImages[selectedImage]}
                  />
                </div>
                <div className="hidden md:flex absolute top-4 right-4 bg-background/80 backdrop-blur rounded-full p-2 text-muted-foreground pointer-events-none">
                  <ZoomIn size={20} />
                </div>
              </div>

              {/* Mobile Image Dots */}
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
            </div>

            {/* Product Info */}
            <div className="flex flex-col px-4 md:px-0 pt-6 md:pt-0">
              <div className="flex justify-between items-start">
                <h1 className="font-display text-3xl md:text-5xl text-foreground mb-2 leading-tight">
                  Royal Temple Kemp Necklace
                </h1>
                <button className="hidden md:block text-muted-foreground hover:text-sale transition-colors">
                  <Heart size={28} />
                </button>
              </div>

              {/* SKU & Rating */}
              <div className="flex items-center gap-4 mb-6 mt-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">#SKU-TEM-0045</span>
                <span className="h-4 w-px bg-border"></span>
                <div className="flex items-center gap-2">
                  <div className="flex text-primary">
                    {renderStars(4.5)}
                  </div>
                  <a className="text-xs text-muted-foreground underline hover:text-primary" href="#reviews">
                    Read Reviews
                  </a>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 bg-muted p-4 rounded-sm border border-border">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-foreground">₹1,45,000</span>
                  <span className="text-lg text-muted-foreground line-through decoration-1">₹1,60,000</span>
                  <span className="text-sm font-bold text-sale bg-sale/10 px-2 py-0.5 rounded">10% OFF</span>
                </div>
                <span className="block text-xs text-muted-foreground mt-2">
                  Inclusive of all taxes. Free insured shipping.
                </span>
              </div>

              <div className="h-px bg-border w-full mb-8"></div>

              {/* Product Options */}
              <div className="space-y-6 mb-8">
                {/* Material */}
                <div>
                  <span className="text-sm font-bold uppercase tracking-wide text-foreground mb-2 block">Material</span>
                  <p className="text-muted-foreground text-sm">22K Yellow Gold with Antique Finish</p>
                </div>

                {/* Weight & Dimensions */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-bold uppercase tracking-wide text-foreground mb-3 block">Weight</span>
                    <Select value={weight} onValueChange={setWeight}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="45.500g">45.500 g</SelectItem>
                        <SelectItem value="52.100g">52.100 g (+ ₹21,000)</SelectItem>
                        <SelectItem value="60.000g">60.000 g (+ ₹48,000)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <span className="text-sm font-bold uppercase tracking-wide text-foreground mb-3 block">Dimensions</span>
                    <Select value={dimension} onValueChange={setDimension}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard (18 inch)</SelectItem>
                        <SelectItem value="long">Long (22 inch)</SelectItem>
                        <SelectItem value="choker">Choker (14 inch)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Size */}
                <div>
                  <div className="flex justify-between items-center mb-2 max-w-sm">
                    <span className="text-sm font-bold uppercase tracking-wide text-foreground">Size</span>
                    <a className="text-xs underline text-muted-foreground hover:text-primary flex items-center gap-1" href="#">
                      <span>📏</span> Size Guide
                    </a>
                  </div>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger className="max-w-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (18 inch)</SelectItem>
                      <SelectItem value="long">Long (22 inch)</SelectItem>
                      <SelectItem value="choker">Choker (14 inch)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons - Desktop */}
              <div className="hidden md:flex flex-row gap-4 mb-8">
                <Button variant="outline" className="flex-1 py-6 font-bold uppercase tracking-wider">
                  Add to Cart
                </Button>
                <Button className="flex-1 py-6 bg-primary hover:bg-primary-dark text-primary-foreground font-bold uppercase tracking-wider shadow-lg shadow-primary/20">
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
                      <p>
                        Exuding royal grandeur, this handcrafted antique temple necklace features intricate
                        craftsmanship with Kemp stones and pearls. A timeless piece that celebrates heritage
                        and elegance. Perfect for weddings and festive occasions.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="specifications" className="border-b border-border">
                    <AccordionTrigger className="text-sm font-bold uppercase tracking-wider py-5 hover:text-primary">
                      Specifications
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm pb-6">
                      <div className="grid grid-cols-2 gap-y-3">
                        <span className="font-medium text-foreground">Gross Weight</span>
                        <span>45.500 g</span>
                        <span className="font-medium text-foreground">Gold Purity</span>
                        <span>22K Yellow Gold</span>
                        <span className="font-medium text-foreground">Stone Type</span>
                        <span>Kemp Stones, Pearls</span>
                        <span className="font-medium text-foreground">Collection</span>
                        <span>Temple Antique</span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="care" className="border-b border-border">
                    <AccordionTrigger className="text-sm font-bold uppercase tracking-wider py-5 hover:text-primary">
                      Care Instructions
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm pb-6">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <Droplet size={18} className="text-primary flex-shrink-0" />
                          Avoid contact with water and perfumes.
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

                  <AccordionItem value="social" className="border-b border-border">
                    <AccordionTrigger className="text-sm font-bold uppercase tracking-wider py-5 hover:text-primary">
                      Watch on Social
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm pb-6 flex gap-6">
                      <a className="flex items-center gap-2 hover:text-red-600 transition-colors" href="#">
                        📺 YouTube
                      </a>
                      <a className="flex items-center gap-2 hover:text-pink-600 transition-colors" href="#">
                        📷 Instagram
                      </a>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-6 mt-6 bg-muted rounded-sm">
                <div className="flex flex-col items-center text-center gap-2">
                  <Check size={24} className="text-primary" />
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    BIS Hallmarked
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Diamond size={24} className="text-primary" />
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Certified Diamonds
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck size={24} className="text-primary" />
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Insured Shipping
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
            <Button variant="outline" className="flex-1 font-bold uppercase text-xs tracking-wider py-3.5">
              Add to Cart
            </Button>
            <Button className="flex-1 bg-primary text-primary-foreground font-bold uppercase text-xs tracking-wider py-3.5 shadow-md">
              Buy Now
            </Button>
          </div>
        </div>

        {/* Related Products */}
        <section className="py-16 bg-card border-t border-border">
          <div className="container mx-auto px-4 md:px-8">
            <h2 className="text-2xl font-display font-medium text-center mb-12 uppercase tracking-widest text-foreground">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group border border-border hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative bg-muted aspect-[4/5] overflow-hidden">
                    <img
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      src={product.image}
                    />
                    <button className="absolute top-3 right-3 text-muted-foreground hover:text-sale bg-card rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart size={14} />
                    </button>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-display text-sm font-medium mb-1 truncate text-foreground">
                      {product.name}
                    </h3>
                    <p className="text-primary font-bold text-sm">₹{product.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
