import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PromoBanner from "@/components/layout/PromoBanner";
import ProductCard from "@/components/ui/ProductCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";

const collections = ["Temple Collection", "Antique Collection", "Bridal Collection", "Everyday Wear"];
const materials = ["Gold", "Silver", "Brass", "Diamond"];

const mockProducts = [
  {
    id: "1",
    name: "Royal Kundan Choker",
    description: "Traditional kundan choker with pearl drops",
    price: 4500,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
    rating: 4.5,
    reviewCount: 12,
    badge: "new" as const,
  },
  {
    id: "2",
    name: "Antique Gold Bangle Set",
    description: "Set of 4 antique finish gold bangles",
    price: 2800,
    originalPrice: 3500,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop",
    rating: 4.0,
    reviewCount: 34,
  },
  {
    id: "3",
    name: "Emerald Drop Polki Earrings",
    description: "Statement polki earrings with emerald drops",
    price: 1850,
    originalPrice: 2500,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop",
    rating: 4.5,
    reviewCount: 45,
    badge: "sale" as const,
  },
  {
    id: "4",
    name: "Bridal Temple Set",
    description: "Complete bridal jewelry set with temple motifs",
    price: 12999,
    image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop",
    rating: 5.0,
    reviewCount: 30,
    badge: "trending" as const,
  },
  {
    id: "5",
    name: "Temple Gold Necklace",
    description: "Traditional temple design gold necklace",
    price: 6200,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
    rating: 4.0,
    reviewCount: 8,
  },
  {
    id: "6",
    name: "Antique Jhumka Earrings",
    description: "Classic jhumka earrings with antique finish",
    price: 2100,
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&h=400&fit=crop",
    rating: 4.5,
    reviewCount: 22,
  },
  {
    id: "7",
    name: "Ruby Studded Bracelet",
    description: "Elegant bracelet with ruby stone accents",
    price: 3800,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop",
    rating: 3.5,
    reviewCount: 5,
  },
  {
    id: "8",
    name: "Gold Solitaire Ring",
    description: "Classic solitaire ring in 22k gold",
    price: 8500,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
    rating: 5.0,
    reviewCount: 42,
  },
];

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  
  const { data: categories = [] } = useCategories();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryFromUrl ? [categoryFromUrl] : []
  );
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0]);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);

  const toggleFilter = (
    value: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((item) => item !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PromoBanner />
      <Header />

      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 md:px-8 pt-6 pb-2">
          <nav className="text-xs md:text-sm text-muted-foreground flex items-center space-x-2">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-border">/</span>
            <span className="text-foreground font-medium">Shop All</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-4 md:px-8 py-8 md:py-12 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-foreground mb-4">
            All Products
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-light text-sm md:text-base">
            Explore our complete collection of handcrafted heritage jewelry, designed to bring
            timeless elegance to your everyday life.
          </p>
        </section>

        {/* Filter Bar */}
        <div className="sticky top-[72px] md:top-[88px] z-30 bg-background/95 backdrop-blur-sm border-t border-b border-border transition-all duration-300">
          <div className="container mx-auto px-4 md:px-8 py-3 md:py-4">
            <div className="flex justify-between items-center">
              <button className="flex items-center space-x-2 text-xs md:text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors group">
                <SlidersHorizontal size={18} className="group-hover:text-primary transition-colors" />
                <span>Filter By</span>
              </button>
              <div className="flex items-center space-x-3">
                <label className="hidden md:block text-xs uppercase tracking-wide text-muted-foreground">
                  Sort By:
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px] border-none bg-transparent text-xs md:text-sm font-medium uppercase tracking-wide focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="best-selling">Best Selling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0 space-y-10">
              {/* Category Filter */}
              <div className="border-b border-border pb-6">
                <h3 className="font-display font-medium text-lg mb-4 text-foreground">Category</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <Checkbox
                        checked={selectedCategories.includes(category.slug)}
                        onCheckedChange={() =>
                          toggleFilter(category.slug, selectedCategories, setSelectedCategories)
                        }
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Collection Filter */}
              <div className="border-b border-border pb-6">
                <h3 className="font-display font-medium text-lg mb-4 text-foreground">Collection</h3>
                <div className="space-y-3">
                  {collections.map((collection) => (
                    <label
                      key={collection}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <Checkbox
                        checked={selectedCollections.includes(collection)}
                        onCheckedChange={() =>
                          toggleFilter(collection, selectedCollections, setSelectedCollections)
                        }
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        {collection}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="border-b border-border pb-6">
                <h3 className="font-display font-medium text-lg mb-4 text-foreground">Price Range</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-1">
                    <label className="text-[10px] uppercase text-muted-foreground block mb-1">
                      Min
                    </label>
                    <input
                      type="text"
                      placeholder="₹0"
                      className="w-full bg-muted border border-border rounded text-sm py-2 px-3 focus:border-primary focus:ring-0 focus:outline-none"
                    />
                  </div>
                  <span className="text-border mt-4">-</span>
                  <div className="flex-1">
                    <label className="text-[10px] uppercase text-muted-foreground block mb-1">
                      Max
                    </label>
                    <input
                      type="text"
                      placeholder="₹50000"
                      className="w-full bg-muted border border-border rounded text-sm py-2 px-3 focus:border-primary focus:ring-0 focus:outline-none"
                    />
                  </div>
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Material Filter */}
              <div className="border-b border-border pb-6">
                <h3 className="font-display font-medium text-lg mb-4 text-foreground">Material</h3>
                <div className="space-y-3">
                  {materials.map((material) => (
                    <label
                      key={material}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <Checkbox
                        checked={selectedMaterials.includes(material)}
                        onCheckedChange={() =>
                          toggleFilter(material, selectedMaterials, setSelectedMaterials)
                        }
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        {material}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <h3 className="font-display font-medium text-lg mb-4 text-foreground">Availability</h3>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <Checkbox
                    checked={inStockOnly}
                    onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
                    className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                    In Stock Only
                  </span>
                </label>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <span className="text-muted-foreground">...</span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
