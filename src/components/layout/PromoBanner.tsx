import { useScrollOfferText } from "@/hooks/useOffers";
import { useSiteSetting } from "@/hooks/useSiteSettings";
import { X } from "lucide-react";
import { useState } from "react";

const PromoBanner = () => {
  const { data: scrollTexts = [] } = useScrollOfferText();
  const { data: scrollEnabledData } = useSiteSetting<{ enabled: boolean } | undefined>("scroll_offer_enabled");
  const { data: scrollSpeedData } = useSiteSetting<{ seconds: number } | undefined>("scroll_offer_speed");
  const { data: scrollSeparatorData } = useSiteSetting<{ separator: string } | undefined>("scroll_offer_separator");
  const { data: scrollDismissData } = useSiteSetting<{ showDismiss: boolean } | undefined>("scroll_offer_dismiss");

  // No fallback for enabled - must be explicitly set in admin
  const scrollEnabled = scrollEnabledData?.enabled;
  const scrollSpeed = scrollSpeedData?.seconds ?? 25;
  const scrollSeparator = scrollSeparatorData?.separator ?? "•";
  const showDismiss = scrollDismissData?.showDismiss ?? true;

  const [dismissed, setDismissed] = useState(false);

  // Check if scroll bar should be visible (require explicit admin setting)
  if (scrollEnabled !== true || dismissed || scrollTexts.length === 0) return null;

  // Combine texts with configured separator
  const scrollContent = scrollTexts.join(` ${scrollSeparator} `);

  return (
    <div className="bg-secondary text-secondary-foreground py-2 text-xs md:text-sm font-medium tracking-wide relative overflow-hidden">
      {/* Seamless infinite marquee using two identical content blocks */}
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: `marquee ${scrollSpeed}s linear infinite`,
        }}
      >
        {/* First copy */}
        <span className="flex-shrink-0 px-4">
          {scrollContent} {scrollSeparator}
        </span>
        {/* Second copy for seamless loop */}
        <span className="flex-shrink-0 px-4">
          {scrollContent} {scrollSeparator}
        </span>
      </div>

      {showDismiss && (
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity bg-secondary z-10"
          aria-label="Dismiss banner"
        >
          <X className="h-3 w-3" />
        </button>
      )}

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default PromoBanner;
