import { useSiteSetting } from "@/hooks/useSiteSettings";
import { DEFAULT_CURRENCY_SYMBOL } from "@/lib/constants";

interface CommerceSettings {
  currencySymbol?: string;
  currencyCode?: string;
}

export const usePriceFormatter = () => {
  const { data: commerceSettings } = useSiteSetting<CommerceSettings>("commerce");
  
  const currencySymbol = commerceSettings?.currencySymbol || DEFAULT_CURRENCY_SYMBOL;
  
  const formatPrice = (price: number, options?: { showDecimals?: boolean }) => {
    const showDecimals = options?.showDecimals ?? false;
    return `${currencySymbol}${price.toLocaleString("en-IN", { 
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0
    })}`;
  };
  
  const formatPricePerUnit = (price: number, unit?: string) => {
    return `${currencySymbol}${price.toFixed(2)} per ${unit || 'unit'}`;
  };
  
  return { formatPrice, formatPricePerUnit, currencySymbol };
};
