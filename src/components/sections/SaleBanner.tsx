import { Button } from "@/components/ui/button";

const SaleBanner = () => {
  return (
    <section className="py-12 md:py-20 px-4">
      <div className="container mx-auto">
        <div className="bg-card shadow-xl rounded-lg overflow-hidden flex flex-col md:flex-row max-w-6xl mx-auto">
          {/* Text Content */}
          <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center items-start">
            <h2 className="text-3xl md:text-4xl font-display text-primary mb-4">
              GOLD RUSH SALE
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Up to <span className="font-bold text-foreground">40% OFF</span> on selected bridal sets.
            </p>
            <Button 
              className="bg-foreground text-background hover:bg-foreground/90 px-8 py-3 text-sm font-bold uppercase tracking-wider"
            >
              Explore Now
            </Button>
          </div>
          
          {/* Image */}
          <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-amber-800">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPhKC8D4de4YfwMlmczR8MeQnADJIFBoBaJm4RmaAHWc35m0EJdcVnbeGOdf_CzIL1dw86nWpnobZ9maKV2c3LMt9UN_LAPjfTBd60DauIwkQIiEAIH3KOXsQ9rFdLN19coXoyToAPBwUO_kBOYVAREvHI6Js05RZ9luS-N2jpuHC74Dc3MJxo3cPYjK5qAqeVwjLvd9tjgOyavxgTvvRKTOFZSNbBgbOambUUCPrlmZ4SeWPnb8qzXn_lCwkIEXaMYx_rLXEaeP0"
              alt="Gold necklace on display"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SaleBanner;
