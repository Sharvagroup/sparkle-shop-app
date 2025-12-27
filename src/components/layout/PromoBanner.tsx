import { useSiteSetting } from "@/hooks/useSiteSettings";
import { X } from "lucide-react";
import { useState } from "react";

interface PromoBannerSettings {
  message: string;
  discountCode?: string;
  isVisible: boolean;
}

const PromoBanner = () => {
  const { data: promoBanner } = useSiteSetting<PromoBannerSettings>("promo_banner");
  const [dismissed, setDismissed] = useState(false);

  // Default values if no settings
  const message = promoBanner?.message || "Free Shipping on Orders Over ₹999!";
  const discountCode = promoBanner?.discountCode;
  const isVisible = promoBanner?.isVisible !== false; // Default to visible

  if (!isVisible || dismissed) return null;

  return (
    <div className="bg-secondary text-secondary-foreground py-2 text-center text-xs md:text-sm font-medium tracking-wide relative">
      <span>
        {message}
        {discountCode && (
          <>
            {" "}Use code <span className="font-bold">{discountCode}</span>
          </>
        )}
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
        aria-label="Dismiss banner"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
};

export default PromoBanner;
