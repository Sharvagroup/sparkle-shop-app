import { useSiteSetting } from "./useSiteSettings";
import { ORDER_STATUS_COLORS } from "@/lib/constants";
import type { OrderStatusColorsSettings } from "./useSiteSettings";

export const useOrderStatusColors = () => {
  const { data: statusColors } = useSiteSetting<OrderStatusColorsSettings>("order_status_colors");
  
  // Merge database settings with constants fallback
  const colors: Record<string, string> = { ...ORDER_STATUS_COLORS };
  
  if (statusColors) {
    if (statusColors.pending) colors.pending = statusColors.pending;
    if (statusColors.confirmed) colors.confirmed = statusColors.confirmed;
    if (statusColors.processing) colors.processing = statusColors.processing;
    if (statusColors.shipped) colors.shipped = statusColors.shipped;
    if (statusColors.delivered) colors.delivered = statusColors.delivered;
    if (statusColors.cancelled) colors.cancelled = statusColors.cancelled;
    if (statusColors.refunded) colors.refunded = statusColors.refunded;
  }
  
  return colors;
};
