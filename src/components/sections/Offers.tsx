import { useState } from "react";
import { useActiveOffers, Offer } from "@/hooks/useOffers";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useSectionTitles } from "@/hooks/useSectionTitles";

const Offers = () => {
  const { data: offers = [], isLoading } = useActiveOffers();
  const { titles } = useSectionTitles();
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (selectedOffer?.discount_code) {
      navigator.clipboard.writeText(selectedOffer.discount_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading || offers.length === 0) return null;

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-display font-medium mb-8 text-center uppercase tracking-widest text-foreground">
          {titles.offers}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {offers.map((offer) => (
            <button
              key={offer.id}
              onClick={() => setSelectedOffer(offer)}
              className="group relative overflow-hidden rounded-lg aspect-[4/3] bg-card border border-border transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              <img
                src={offer.image_url}
                alt={offer.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-left">
                <h3 className="text-white font-display font-bold text-lg md:text-xl leading-tight">
                  {offer.title}
                </h3>
                {offer.subtitle && (
                  <p className="text-white/80 text-sm mt-1">{offer.subtitle}</p>
                )}
                {offer.discount_code && (
                  <Badge className="mt-2 w-fit bg-primary text-primary-foreground">
                    Use: {offer.discount_code}
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Offer Popup Dialog */}
      <Dialog open={!!selectedOffer} onOpenChange={() => setSelectedOffer(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          {selectedOffer && (
            <>
              <div className="relative aspect-video">
                <img
                  src={selectedOffer.image_url}
                  alt={selectedOffer.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="p-6 space-y-4">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">
                    {selectedOffer.title}
                  </DialogTitle>
                </DialogHeader>

                {selectedOffer.subtitle && (
                  <p className="text-lg text-muted-foreground">{selectedOffer.subtitle}</p>
                )}

                {selectedOffer.description && (
                  <p className="text-sm text-muted-foreground">{selectedOffer.description}</p>
                )}

                {selectedOffer.discount_code && (
                  <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Discount Code
                      </p>
                      <p className="text-xl font-mono font-bold text-primary">
                        {selectedOffer.discount_code}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyCode}
                      className="gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {selectedOffer.link_url && (
                  <Button asChild className="w-full gap-2">
                    <Link to={selectedOffer.link_url}>
                      {selectedOffer.button_text || "Shop Now"}
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                )}

                {!selectedOffer.link_url && (
                  <Button onClick={() => setSelectedOffer(null)} className="w-full">
                    Continue Shopping
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Offers;
