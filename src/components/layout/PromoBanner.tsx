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

  // Create a symmetrical block: Content + Separator
  // This ensures the end of the block perfectly matches the start of the next block
  // Use a safety check for separator to avoid undefined
  const safeSeparator = scrollSeparator || "•";
  const singleBlock = scrollTexts.join(` ${safeSeparator} `) + ` ${safeSeparator} `;

  // Repeat the block 4 times to ensure we have enough content to fill the screen
  // and to provide a clean loop point
  const duplicatedContent = singleBlock.repeat(4);

  return (
    <div className="bg-secondary text-secondary-foreground py-2 text-xs md:text-sm font-medium tracking-wide relative overflow-hidden">
      <div
        className="flex whitespace-nowrap animate-scroll"
        style={{
          animationDuration: `${scrollSpeed}s`,
        }}
      >
        <span className="px-4">{duplicatedContent}</span>
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
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            /* Move exactly one block width (1/4 of total) to create seamless loop */
            transform: translateX(-25%);
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
