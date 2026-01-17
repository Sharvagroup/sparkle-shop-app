import { useSiteSetting } from "./useSiteSettings";
import { PAYMENT_STATUS_COLORS } from "@/lib/constants";
import type { PaymentStatusColorsSettings } from "./useSiteSettings";

export const usePaymentStatusColors = () => {
  const { data: statusColors } = useSiteSetting<PaymentStatusColorsSettings>("payment_status_colors");
  
  // Merge database settings with constants fallback
  const colors: Record<string, string> = { ...PAYMENT_STATUS_COLORS };
  
  if (statusColors) {
    if (statusColors.pending) colors.pending = statusColors.pending;
    if (statusColors.paid) colors.paid = statusColors.paid;
    if (statusColors.failed) colors.failed = statusColors.failed;
    if (statusColors.refunded) colors.refunded = statusColors.refunded;
  }
  
  return colors;
};
