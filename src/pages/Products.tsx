import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, ChevronLeft, ChevronRight, Package } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PromoBanner from "@/components/layout/PromoBanner";
import ProductCard from "@/components/ui/ProductCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { useCollections } from "@/hooks/useCollections";
import { useProducts } from "@/hooks/useProducts";
import { useMaterials } from "@/hooks/useDynamicFilters";

const ITEMS_PER_PAGE = 12;

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const collectionFromUrl = searchParams.get("collection");
  const searchFromUrl = searchParams.get("search");
  const isNewFromUrl = searchParams.get("new") === "true";
  const isBestsellerFromUrl = searchParams.get("bestseller") === "true";
  const isCelebrityFromUrl = searchParams.get("celebrity") === "true";

  const { data: categories = [] } = useCategories();
  const { data: collections = [] } = useCollections();
  const { data: allProducts = [], isLoading } = useProducts();
  const { data: materials = [] } = useMaterials();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryFromUrl ? [categoryFromUrl] : []
  );
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    collectionFromUrl ? [collectionFromUrl] : []
  );
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [isNewArrival, setIsNewArrival] = useState(isNewFromUrl);
  const [isBestSeller, setIsBestSeller] = useState(isBestsellerFromUrl);
  const [isCelebritySpecial, setIsCelebritySpecial] = useState(isCelebrityFromUrl);
  const [searchQuery, setSearchQuery] = useState(searchFromUrl || "");

  // Update filters from URL params
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl]);
    }
    if (collectionFromUrl) {
      setSelectedCollections([collectionFromUrl]);
    }
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
    if (isNewFromUrl) {
      setIsNewArrival(true);
    }
    if (isBestsellerFromUrl) {
      setIsBestSeller(true);
    }
    if (isCelebrityFromUrl) {
      setIsCelebritySpecial(true);
    }
  }, [categoryFromUrl, collectionFromUrl, searchFromUrl, isNewFromUrl, isBestsellerFromUrl, isCelebrityFromUrl]);

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

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query)) ||
          (p.material && p.material.toLowerCase().includes(query)) ||
          (p.category?.name && p.category.name.toLowerCase().includes(query)) ||
          (p.collection?.name && p.collection.name.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        (p) => p.category && selectedCategories.includes(p.category.slug)
      );
    }

    // Filter by collection
    if (selectedCollections.length > 0) {
      filtered = filtered.filter(
        (p) => p.collection && selectedCollections.includes(p.collection.slug)
      );
    }

    // Filter by material
    if (selectedMaterials.length > 0) {
      filtered = filtered.filter(
        (p) =>
          p.material &&
          selectedMaterials.some((m) =>
            p.material!.toLowerCase().includes(m.toLowerCase())
          )
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Filter by stock
    if (inStockOnly) {
      filtered = filtered.filter((p) => p.stock_quantity > 0);
    }

    // Filter by new arrival
    if (isNewArrival) {
      filtered = filtered.filter((p) => p.is_new_arrival);
    }

    // Filter by best seller
    if (isBestSeller) {
      filtered = filtered.filter((p) => p.is_best_seller);
    }

    // Filter by celebrity special
    if (isCelebritySpecial) {
      filtered = filtered.filter((p) => p.is_celebrity_special);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "best-selling":
        filtered.sort((a, b) => b.review_count - a.review_count);
        break;
      default:
        filtered.sort((a, b) => a.display_order - b.display_order);
    }

    return filtered;
  }, [
    allProducts,
    searchQuery,
    selectedCategories,
    selectedCollections,
    selectedMaterials,
    priceRange,
    inStockOnly,
    isNewArrival,
    isBestSeller,
    isCelebritySpecial,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedCategories,
    selectedCollections,
    selectedMaterials,
    priceRange,
    inStockOnly,
    isNewArrival,
    isBestSeller,
    isCelebritySpecial,
    sortBy,
  ]);

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
            {searchQuery
              ? `Search: "${searchQuery}"`
              : isNewArrival
              ? "New Arrivals"
              : isBestSeller
              ? "Best Sellers"
              : isCelebritySpecial
              ? "Celebrity Specials"
              : "All Products"}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-light text-sm md:text-base">
            {searchQuery 
              ? `Found ${filteredProducts.length} results for your search`
              : "Explore our complete collection of handcrafted heritage jewelry, designed to bring timeless elegance to your everyday life."}
          </p>
        </section>

        {/* Filter Bar */}
        <div className="sticky top-[72px] md:top-[88px] z-30 bg-background/95 backdrop-blur-sm border-t border-b border-border transition-all duration-300">
          <div className="container mx-auto px-4 md:px-8 py-3 md:py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button className="flex items-center space-x-2 text-xs md:text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors group">
                  <SlidersHorizontal
                    size={18}
                    className="group-hover:text-primary transition-colors"
                  />
                  <span>Filter By</span>
                </button>
                <span className="text-sm text-muted-foreground">
                  {filteredProducts.length} products
                </span>
              </div>
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
                <h3 className="font-display font-medium text-lg mb-4 text-foreground">
                  Category
                </h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <Checkbox
                        checked={selectedCategories.includes(category.slug)}
                        onCheckedChange={() =>
                          toggleFilter(
                            category.slug,
                            selectedCategories,
                            setSelectedCategories
                          )
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
                <h3 className="font-display font-medium text-lg mb-4 text-foreground">
                  Collection
                </h3>
                <div className="space-y-3">
                  {collections.map((collection) => (
                    <label
                      key={collection.id}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <Checkbox
                        checked={selectedCollections.includes(collection.slug)}
                        onCheckedChange={() =>
                          toggleFilter(
                            collection.slug,
                            selectedCollections,
                            setSelectedCollections
                          )
                        }
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        {collection.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="border-b border-border pb-6">
                <h3 className="font-display font-medium text-lg mb-4 text-foreground">
                  Price Range
                </h3>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-1">
                    <label className="text-[10px] uppercase text-muted-foreground block mb-1">
                      Min
                    </label>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="w-full bg-muted border border-border rounded text-sm py-2 px-3 focus:border-primary focus:ring-0 focus:outline-none"
                    />
                  </div>
                  <span className="text-border mt-4">-</span>
                  <div className="flex-1">
                    <label className="text-[10px] uppercase text-muted-foreground block mb-1">
                      Max
                    </label>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-full bg-muted border border-border rounded text-sm py-2 px-3 focus:border-primary focus:ring-0 focus:outline-none"
                    />
                  </div>
                </div>
                <Slider
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={(val) => setPriceRange([val[0], val[1]])}
                  max={50000}
                  step={100}
                  className="w-full"
                />
              </div>

              {/* Material Filter */}
              <div className="border-b border-border pb-6">
                <h3 className="font-display font-medium text-lg mb-4 text-foreground">
                  Material
                </h3>
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
                <h3 className="font-display font-medium text-lg mb-4 text-foreground">
                  Availability
                </h3>
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
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-[400px] rounded-lg" />
                  ))}
                </div>
              ) : paginatedProducts.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No products found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or check back later.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => (
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
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const page = i + 1;
                    return (
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
                    );
                  })}
                  {totalPages > 5 && (
                    <span className="text-muted-foreground">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
