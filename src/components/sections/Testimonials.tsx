import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useHomepageReviews } from "@/hooks/useReviews";

const Testimonials = () => {
  const { data: reviews = [], isLoading } = useHomepageReviews();

  // Fallback testimonials if no reviews in database
  const fallbackTestimonials = [
    {
      id: "1",
      rating: 5,
      review_text: '"The bridal set I ordered was absolutely stunning. It looked even better in person than in the pictures!"',
      profile: { full_name: "Priya Sharma" },
    },
    {
      id: "2",
      rating: 5,
      review_text: '"Excellent quality and fast shipping. The packaging was so secure and beautiful. Will order again."',
      profile: { full_name: "Sneha Reddy" },
    },
    {
      id: "3",
      rating: 4,
      review_text: '"Loved the intricate details on the temple jewellery. Truly a piece of art."',
      profile: { full_name: "Anjali Verma" },
    },
  ];

  const displayReviews = reviews.length > 0 ? reviews : fallbackTestimonials;

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
          Our Happy Customers
        </h2>
        
        <div className="relative flex items-center justify-center max-w-6xl mx-auto">
          <button className="hidden md:flex absolute -left-4 text-muted-foreground hover:text-primary rounded-full border border-border p-2 hover:bg-muted transition-colors">
            <ChevronLeft size={24} />
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4 md:px-12">
            {displayReviews.slice(0, 3).map((review) => (
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
          
          <button className="hidden md:flex absolute -right-4 text-muted-foreground hover:text-primary rounded-full border border-border p-2 hover:bg-muted transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
        
        <div className="flex justify-center mt-8 space-x-2">
          <span className="w-8 h-2 bg-primary rounded-full" />
          <span className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
          <span className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
