import { useSiteSetting } from "@/hooks/useSiteSettings";

interface CommerceSettings {
  currencySymbol?: string;
  currencyCode?: string;
  localeCode?: string;
}

export const usePriceFormatter = () => {
  const { data: commerceSettings } = useSiteSetting<CommerceSettings>("commerce");
  
  // Use database settings, fallback to empty string for symbol and "USD" for code
  // Empty string will display as-is, which is better than showing wrong currency
  const currencySymbol = commerceSettings?.currencySymbol || "";
  const currencyCode = commerceSettings?.currencyCode || "USD";
  const localeCode = commerceSettings?.localeCode || "en-US";
  
  const formatPrice = (price: number, options?: { showDecimals?: boolean }) => {
    const showDecimals = options?.showDecimals ?? false;
    return `${currencySymbol}${price.toLocaleString(localeCode, { 
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0
    })}`;
  };
  
  const formatPricePerUnit = (price: number, unit?: string) => {
    return `${currencySymbol}${price.toFixed(2)} per ${unit || 'unit'}`;
  };

  // For use cases that need Intl.NumberFormat style formatting
  const formatCurrency = (price: number, options?: { showDecimals?: boolean }) => {
    return new Intl.NumberFormat(localeCode, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: options?.showDecimals ? 2 : 0,
    }).format(price);
  };
  
  return { formatPrice, formatPricePerUnit, formatCurrency, currencySymbol, currencyCode, localeCode };
};
