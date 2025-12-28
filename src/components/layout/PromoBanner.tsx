import { useScrollOfferText } from "@/hooks/useOffers";
import { useSiteSetting } from "@/hooks/useSiteSettings";
import { X } from "lucide-react";
import { useState } from "react";

const PromoBanner = () => {
  const { data: scrollTexts = [] } = useScrollOfferText();
  const { data: scrollEnabledData } = useSiteSetting<boolean | { enabled: boolean }>("scroll_offer_enabled");
  const { data: scrollSpeedData } = useSiteSetting<string | { speed: string }>("scroll_offer_speed");
  // Handle both boolean and object formats for robustness
  const scrollEnabled = typeof scrollEnabledData === 'boolean' 
    ? scrollEnabledData 
    : (scrollEnabledData?.enabled ?? true);
  const scrollSpeed = typeof scrollSpeedData === 'string'
    ? scrollSpeedData
    : (scrollSpeedData?.speed ?? "medium");
  const [dismissed, setDismissed] = useState(false);

  // Get animation duration based on speed
  const getAnimationDuration = () => {
    switch (scrollSpeed) {
      case "slow": return "40s";
      case "fast": return "15s";
      default: return "25s"; // medium
    }
  };

  // Check if scroll bar should be visible
  if (!scrollEnabled || dismissed || scrollTexts.length === 0) return null;

  // Combine texts with separator
  const scrollContent = scrollTexts.join(" • ");
  // Duplicate for seamless loop
  const duplicatedContent = `${scrollContent} • ${scrollContent} • ${scrollContent}`;

  return (
    <div className="bg-secondary text-secondary-foreground py-2 text-xs md:text-sm font-medium tracking-wide relative overflow-hidden">
      <div 
        className="flex whitespace-nowrap animate-scroll"
        style={{
          animationDuration: getAnimationDuration(),
        }}
      >
        <span className="px-4">{duplicatedContent}</span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity bg-secondary z-10"
        aria-label="Dismiss banner"
      >
        <X className="h-3 w-3" />
      </button>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        .animate-scroll {
          animation: scroll linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PromoBanner;
