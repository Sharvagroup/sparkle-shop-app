// Order status colors - shared across admin pages
export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  processing: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  shipped: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  delivered: "bg-green-500/10 text-green-600 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
  refunded: "bg-gray-500/10 text-gray-600 border-gray-500/20",
} as const;

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  paid: "bg-green-500/10 text-green-600 border-green-500/20",
  failed: "bg-red-500/10 text-red-600 border-red-500/20",
  refunded: "bg-gray-500/10 text-gray-600 border-gray-500/20",
} as const;

// ============================================================================
// TYPE DEFINITIONS - Regional data should be managed via Admin Settings
// These types are kept for TypeScript type safety.
// All actual data should come from site_settings table (regional category)
// ============================================================================

// Type definitions for regional data (actual data comes from database)
export type Country = { value: string; label: string };
export type PaymentMethod = { id: string; label: string; description: string; enabled?: boolean };

// ============================================================================
// LEGACY FALLBACKS - Only used as last resort when database settings are unavailable
// These should only be used in helper functions, not directly in components
// ============================================================================

// Currency fallbacks - use commerce settings from admin panel when available
// These are kept as absolute last resort fallbacks only
export const DEFAULT_CURRENCY = "USD";
export const DEFAULT_CURRENCY_SYMBOL = "$";
