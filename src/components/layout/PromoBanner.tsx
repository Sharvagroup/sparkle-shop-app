import { useScrollOfferText } from "@/hooks/useOffers";
import { useSiteSetting } from "@/hooks/useSiteSettings";
import { X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ScrollSpeedSetting {
  speed?: string;
  seconds?: number;
}

interface ScrollSeparatorSetting {
  separator: string;
}

interface ScrollDismissSetting {
  showDismiss: boolean;
}

const PromoBanner = () => {
  const { data: scrollTexts = [] } = useScrollOfferText();
  const { data: scrollEnabledData } = useSiteSetting<boolean | { enabled: boolean }>("scroll_offer_enabled");
  const { data: scrollSpeedData } = useSiteSetting<ScrollSpeedSetting>("scroll_offer_speed");
  const { data: scrollSeparatorData } = useSiteSetting<ScrollSeparatorSetting>("scroll_offer_separator");
  const { data: scrollDismissData } = useSiteSetting<ScrollDismissSetting>("scroll_offer_dismiss");

  const contentRef = useRef<HTMLSpanElement>(null);
  const [dismissed, setDismissed] = useState(false);
  const [animationDuration, setAnimationDuration] = useState("20s");

  // Parse settings with proper fallbacks
  const scrollEnabled = typeof scrollEnabledData === 'boolean' 
    ? scrollEnabledData 
    : (scrollEnabledData?.enabled ?? true);
  const separator = scrollSeparatorData?.separator ?? "•";
  const showDismiss = scrollDismissData?.showDismiss ?? true;

  // Calculate animation duration based on content width and speed setting
  useEffect(() => {
    if (contentRef.current && scrollTexts.length > 0) {
      const width = contentRef.current.offsetWidth;
      
      // Use seconds from settings directly, or calculate from speed preset
      let baseSeconds: number;
      if (scrollSpeedData?.seconds) {
        baseSeconds = scrollSpeedData.seconds;
      } else {
        const speed = scrollSpeedData?.speed ?? "medium";
        baseSeconds = speed === "slow" ? 40 : speed === "fast" ? 15 : 25;
      }
      
      // Proportional duration: longer content = longer duration
      const duration = Math.max((width / 500) * (baseSeconds / 2), 5);
      setAnimationDuration(`${duration}s`);
    }
  }, [scrollTexts, scrollSpeedData]);

  // Check if scroll bar should be visible
  if (!scrollEnabled || dismissed || scrollTexts.length === 0) return null;

  // Combine texts with dynamic separator
  const scrollContent = scrollTexts.join(` ${separator} `);

  return (
    <div className="promo-banner-container bg-secondary text-secondary-foreground py-2 text-xs md:text-sm font-medium tracking-wide relative overflow-hidden">
      <div className="marquee-wrapper" style={{ animationDuration }}>
        <span ref={contentRef} className="marquee-content">{scrollContent}</span>
        <span className="marquee-content" aria-hidden="true">{scrollContent}</span>
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
        .marquee-wrapper {
          display: flex;
          width: max-content;
        }
        .marquee-content {
          padding-right: 100vw;
          white-space: nowrap;
          animation: marquee-slide linear infinite;
          animation-duration: inherit;
        }
        .promo-banner-container:hover .marquee-content {
          animation-play-state: paused;
        }
        @keyframes marquee-slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default PromoBanner;
