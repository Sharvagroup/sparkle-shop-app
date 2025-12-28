import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useHomepageReviews } from "@/hooks/useReviews";
import { useSectionTitles } from "@/hooks/useSectionTitles";

const Testimonials = () => {
  const { data: reviews = [], isLoading } = useHomepageReviews();
  const { titles } = useSectionTitles();
  const [currentPage, setCurrentPage] = useState(0);

  // Hide section if no reviews
  if (!isLoading && reviews.length === 0) {
    return null;
  }
  const reviewsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  
  const currentReviews = reviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "fill-primary text-primary" : "text-muted-foreground"}
        />
      ));
  };

  if (isLoading) return null;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-display font-medium mb-12 uppercase tracking-widest text-foreground">
          {titles.testimonials}
        </h2>

        <div className="relative flex items-center justify-center max-w-6xl mx-auto">
          <button
            onClick={handlePrevPage}
            className="hidden md:flex absolute -left-4 text-muted-foreground hover:text-primary rounded-full border border-border p-2 hover:bg-muted transition-colors z-10"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4 md:px-12">
            {currentReviews.map((review) => (
              <div
                key={review.id}
                className="bg-surface p-8 rounded border border-border"
              >
                <div className="flex justify-center text-primary text-xs mb-4">
                  {renderStars(review.rating)}
                </div>
                <p className="text-sm italic text-muted-foreground mb-6 leading-relaxed">
                  "{review.review_text}"
                </p>
                <p className="text-xs font-bold uppercase tracking-wide text-foreground">
                  - {review.profile?.full_name || "Anonymous"}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            className="hidden md:flex absolute -right-4 text-muted-foreground hover:text-primary rounded-full border border-border p-2 hover:bg-muted transition-colors z-10"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Pagination Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentPage
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
