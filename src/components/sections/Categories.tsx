import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";
import { useSectionTitles } from "@/hooks/useSectionTitles";

const Categories = () => {
  const { data: categories = [], isLoading } = useCategories();
  const { titles } = useSectionTitles();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Fallback images for categories without images
  const fallbackImages: Record<string, string> = {
    necklaces: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgnrpEgkI1QzOloLVRoZubnvhpDFVQ4Qud6cJihl-z93q-RdtGcR9E2WPpCeZWyp6ocP_Jzzrwj9Ug9ze57a2HHgowYFj7z2_0aDFYI-6HofUry6hMJxhij37VYXK2M-K-bMyWkulsYMTymA6YbM82g9DyjENIwgwDPK5V9_DzPSU7COuiK4JWsUEfqNdlOhytwBjVnz_ebk1pk1uoGKsVrVFDZbPrSD6HjwL_kbcEaVE_O1Xp-kLWcny2fzviFPPi43o2QS_BT0o",
    earrings: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNXyBuepQbXzJD9ZalC-4K30IvF65JotjSUWjvsmydP5kMiVZZ1ZGMfoza_QBfanJeh9x-3ytscDax3tFDuXgzQAm0XAfjTyIJej-VBf0Rlct9b6P_7KqzmhVJKMZUah1LSOB53fa-ZbrKY9iRYqRY7i4c6yf5JAJRhHxK4MU4Ibtvu5WGP3eZm4UnO2W7JyNPNnyzh_olTzDQeZp3zDv9m6PIReNrV9yHTkfpJ-CSnX959g3gd4V5rv_MLq-CLAm9pRqlEcKhZjo",
    bracelets: "https://lh3.googleusercontent.com/aida-public/AB6AXuDp_0B1KgtYRzcSF5ehgix-iOn8E4luEGY231KSM34pFmix6ccIZTWUdeXQe_vhcsDeHyy9XP6XOxvlG-sdzwouDijhfVH9TVmpMESWKAWTQh1rEHSDBiSSTy9eC2oVc6qKq155y4ZYI-t2NReVYBVgPrMBJkvzp-GIsHG0hBVAPl0cK5CtmYzkB_sqh2DdlMzpSm00uV1X7R9ytyUr_lD8P3RZTEjtmegGHeo7akylVmnqnDsfp2k8jVm7mDUIX6kNKwqDLO2kTT8",
    rings: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQSW865YqCIhCuqGB_9c5AcP645zVYLdC7wL4ukgs1xFQPJEdLFFeNi1tm_N-sNf-DJaeJUOQCFrW9wYZWhkqc1SRAoR8tJTZZm1-QXkrXYyjZ6qtHWUDzzag014baCYNQPbmZY_nKyFx_yh_GWkXeI7JBd0QnpnsdbVbLiuwIDh5NMm3ZwZWXzzNivl0Pxo3hJ61QQvD-UCRy_YE1uG7eE-r8S25RdOcRqE-zWm1nESevsXsjHBabxYPoQ6iNk1Dqj6Wqu9JSIRc",
  };

  const getCategoryImage = (category: { image_url: string | null; slug: string }) => {
    if (category.image_url) return category.image_url;
    return fallbackImages[category.slug] || fallbackImages.necklaces;
  };

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      window.addEventListener("resize", updateScrollButtons);
      return () => {
        container.removeEventListener("scroll", updateScrollButtons);
        window.removeEventListener("resize", updateScrollButtons);
      };
    }
  }, [categories]);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-surface">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-medium mb-12 uppercase tracking-widest text-foreground">
            {titles.categories}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 w-full max-w-5xl mx-auto px-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full" />
                <Skeleton className="h-4 w-20 mt-4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-surface">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-display font-medium mb-12 uppercase tracking-widest text-foreground">
          {titles.categories}
        </h2>

        <div className="relative flex items-center justify-center">
          <button
            onClick={handleScrollLeft}
            className={`hidden md:flex absolute left-0 z-10 text-muted-foreground hover:text-primary transition-opacity ${
              canScrollLeft ? "opacity-100" : "opacity-30 cursor-not-allowed"
            }`}
            disabled={!canScrollLeft}
          >
            <ChevronLeft size={36} />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-8 md:gap-12 overflow-x-auto scrollbar-hide scroll-smooth px-4 max-w-5xl snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="group cursor-pointer flex-shrink-0 snap-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden border-4 border-card shadow-lg group-hover:border-primary transition-all duration-300 bg-card flex items-center justify-center">
                  <img
                    src={getCategoryImage(category)}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="mt-4 font-medium uppercase text-sm tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>

          <button
            onClick={handleScrollRight}
            className={`hidden md:flex absolute right-0 z-10 text-muted-foreground hover:text-primary transition-opacity ${
              canScrollRight ? "opacity-100" : "opacity-30 cursor-not-allowed"
            }`}
            disabled={!canScrollRight}
          >
            <ChevronRight size={36} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;
