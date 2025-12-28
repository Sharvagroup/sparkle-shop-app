import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useActiveOffers } from "@/hooks/useOffers";
import { Skeleton } from "@/components/ui/skeleton";

const OffersBanner = () => {
  const { data: offers = [], isLoading } = useActiveOffers();
  const featuredOffer = offers[0];

  if (isLoading) {
    return (
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto">
          <Skeleton className="h-[300px] md:h-[350px] max-w-6xl mx-auto rounded-lg" />
        </div>
      </section>
    );
  }

  if (!featuredOffer) return null;

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="container mx-auto">
        <div className="bg-card shadow-xl rounded-lg overflow-hidden flex flex-col md:flex-row max-w-6xl mx-auto">
          <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center items-start">
            <h2 className="text-3xl md:text-4xl font-display text-primary mb-4">
              {featuredOffer.title}
            </h2>
            {featuredOffer.subtitle && (
              <p className="text-muted-foreground mb-4 text-lg">{featuredOffer.subtitle}</p>
            )}
            {featuredOffer.discount_code && (
              <p className="text-sm text-muted-foreground mb-4">
                Use code: <span className="font-bold text-primary">{featuredOffer.discount_code}</span>
              </p>
            )}
            {featuredOffer.link_url ? (
              <Button asChild className="bg-foreground text-background hover:bg-foreground/90 px-8 py-3 text-sm font-bold uppercase tracking-wider">
                <Link to={featuredOffer.link_url}>{featuredOffer.button_text || "Explore Now"}</Link>
              </Button>
            ) : (
              <Button className="bg-foreground text-background hover:bg-foreground/90 px-8 py-3 text-sm font-bold uppercase tracking-wider">
                {featuredOffer.button_text || "Explore Now"}
              </Button>
            )}
          </div>
          <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-muted">
            <img src={featuredOffer.image_url} alt={featuredOffer.title} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffersBanner;
