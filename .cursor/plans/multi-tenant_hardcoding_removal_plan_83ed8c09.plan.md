---
name: Multi-Tenant Hardcoding Removal Plan
overview: Remove all hardcoded values, duplicate settings, and brand-specific defaults to make the application truly multi-tenant. Fix database migrations, constants, and component fallbacks to use database settings exclusively.
todos: []
---

# Multi-Tenant Hardcoding Removal Plan

## Overview

This plan addresses 47 identified issues preventing true multi-tenant functionality. The goal is to eliminate all hardcoded values, duplicate settings, and brand-specific defaults so the application can be deployed for any customer without code changes.

## Phase 1: Database Migration Fixes (CRITICAL)

### Task 1.1: Create Migration to Remove Brand-Specific Defaults

**File:** `supabase/migrations/[timestamp]_remove_brand_defaults.sql`

**Issue:** Initial migration contains hardcoded "SHARVA" branding values

**Fix:** Create new migration that:

- Updates existing rows with brand-specific values to empty strings
- Sets generic placeholders for required fields
- Ensures no brand-specific data persists

**Code Pattern:**

```sql
UPDATE public.site_settings
SET value = jsonb_set(value, '{siteName}', '""'::jsonb)
WHERE key = 'branding' AND value->>'siteName' = 'SHARVA';
-- Repeat for all brand-specific fields
```

---

## Phase 2: Constants File Refactoring (CRITICAL)

### Task 2.1: Move Regional Data to Database

**File:** `src/lib/constants.ts`

**Issues Found:**

- `COUNTRIES` array (lines 26-34) - duplicated in Settings.tsx
- `INDIAN_STATES` array (lines 37-71) - duplicated in Settings.tsx  
- `PAYMENT_METHODS` (lines 74-78) - duplicated in Settings.tsx
- `DEFAULT_CURRENCY` and `DEFAULT_CURRENCY_SYMBOL` (lines 81-82)

**Current Usage:**

- `DEFAULT_CURRENCY_SYMBOL` used in: Cart.tsx, Checkout.tsx, usePriceFormatter.ts, useDiscountCodes.ts, SearchBar.tsx
- `COUNTRIES`, `PAYMENT_METHODS` not directly imported (Settings.tsx has duplicates)

**Fix Strategy:**

1. Keep constants as TypeScript types only
2. Create helper hooks to load from database with fallbacks
3. Update all imports to use database settings

**Files to Update:**

- `src/lib/constants.ts` - Remove hardcoded arrays, keep types
- `src/hooks/usePriceFormatter.ts` - Use commerce settings, remove constant import
- `src/pages/Cart.tsx` - Use commerce settings
- `src/pages/Checkout.tsx` - Use regional settings, remove FALLBACK constants
- `src/hooks/useDiscountCodes.ts` - Use commerce settings
- `src/components/ui/SearchBar.tsx` - Use commerce settings

### Task 2.2: Make Status Colors Configurable

**File:** `src/lib/constants.ts`

**Issues:**

- `ORDER_STATUS_COLORS` (lines 2-10) - hardcoded
- `PAYMENT_STATUS_COLORS` (lines 12-17) - hardcoded

**Current Usage:**

- `src/pages/admin/Orders.tsx` - imports both
- `src/pages/admin/Dashboard.tsx` - imports ORDER_STATUS_COLORS

**Fix Strategy:**

1. Add `order_status_colors` and `payment_status_colors` to site_settings
2. Create hook `useOrderStatusColors()` and `usePaymentStatusColors()`
3. Update admin pages to use hooks with fallback to constants

**Files to Update:**

- `src/lib/constants.ts` - Keep as fallback only
- `src/hooks/useSiteSettings.ts` - Add interfaces
- `src/pages/admin/Orders.tsx` - Use hook
- `src/pages/admin/Dashboard.tsx` - Use hook

---

## Phase 3: Remove Duplicate Settings (HIGH PRIORITY)

### Task 3.1: Remove Duplicate Constants in Settings.tsx

**File:** `src/pages/admin/Settings.tsx`

**Issues:**

- `DEFAULT_COUNTRIES` (lines 68-76) - duplicates constants.ts
- `DEFAULT_STATES_BY_COUNTRY` (lines 78-90) - duplicates constants.ts
- `DEFAULT_PAYMENT_METHODS` (lines 92-96) - duplicates constants.ts

**Fix:**

- Remove these constants
- Use `RegionalSettings` from database
- Use constants.ts values only as last-resort fallback in helper functions

### Task 3.2: Remove Hardcoded Business Hours Defaults

**File:** `src/pages/admin/Settings.tsx` (lines 162-167)

**Issue:** `defaultBusinessHours` has hardcoded schedule

**Fix:** Initialize as empty array, load from database

### Task 3.3: Remove Hardcoded Page Content Defaults

**File:** `src/pages/admin/Settings.tsx` (lines 186-202)

**Issue:** All page content strings have hardcoded English defaults

**Fix:** Initialize as empty strings, load from `page_content` settings

**Note:** Lines 296-312 already load from database but useState initializations have hardcoded defaults

---

## Phase 4: Component Fallback Fixes (HIGH PRIORITY)

### Task 4.1: Fix Header Navigation Fallback

**File:** `src/components/layout/Header.tsx` (lines 184-187)

**Issue:** Returns hardcoded `["Home", "Shop"]` when no navigation settings

**Fix:** Return empty array `[]` or make configurable via settings

### Task 4.2: Fix Footer Section Titles

**File:** `src/components/layout/Footer.tsx` (lines 51-52)

**Issue:** Hardcoded section titles and order

**Fix:**

- Add `footer_section_titles` and `footer_section_order` to site_settings
- Load from database with empty object/array fallback

### Task 4.3: Remove Checkout Fallback Constants

**File:** `src/pages/Checkout.tsx` (lines 41-53)

**Issue:** `FALLBACK_STATES` and `FALLBACK_PAYMENT_METHODS` hardcoded

**Fix:** Use `regionalSettings` from database (already loaded on line 62), remove fallback constants

---

## Phase 5: Remove Legacy Admin Pages (MEDIUM PRIORITY)

### Task 5.1: Verify and Remove Duplicate Admin Pages

**Files to Check:**

- `src/pages/admin/FAQ.tsx` - Check if used in routing
- `src/pages/admin/SizeGuide.tsx` - Check if used in routing

**Issue:** Both have functionality consolidated in `AboutPage.tsx`

**Fix:**

- Check `src/App.tsx` for routes
- If not used, delete files
- If used, redirect to AboutPage or consolidate

---

## Phase 6: Section Theme Defaults (LOW PRIORITY)

### Task 6.1: Make Section Default Titles Configurable

**File:** `src/components/admin/SectionThemeDialog.tsx` (lines 417-495)

**Issue:** `sectionConfigs` has hardcoded `defaultTitle` values

**Fix:** Load from `useSectionTitles` hook or make configurable

---

## Implementation Order

1. **Phase 1** - Database migration (blocks multi-tenant deployment)
2. **Phase 2** - Constants refactoring (affects multiple files)
3. **Phase 3** - Remove duplicates (cleanup)
4. **Phase 4** - Component fallbacks (user-facing)
5. **Phase 5** - Legacy cleanup (optional)
6. **Phase 6** - Nice-to-have improvements

## Testing Strategy

After each phase:

1. Test with empty database (fresh install)
2. Verify no hardcoded values appear
3. Test admin panel can configure all values
4. Verify frontend displays configured values
5. Test fallbacks work when settings are empty

## Files Summary

**Files to Create:**

- `supabase/migrations/[timestamp]_remove_brand_defaults.sql`
- `src/hooks/useOrderStatusColors.ts` (optional helper)
- `src/hooks/usePaymentStatusColors.ts` (optional helper)

**Files to Modify:**

- `src/lib/constants.ts` - Remove hardcoded arrays
- `src/pages/admin/Settings.tsx` - Remove duplicates, fix defaults
- `src/components/layout/Header.tsx` - Fix navigation fallback
- `src/components/layout/Footer.tsx` - Make section titles configurable
- `src/pages/Checkout.tsx` - Remove fallback constants
- `src/hooks/usePriceFormatter.ts` - Use commerce settings
- `src/pages/Cart.tsx` - Use commerce settings
- `src/hooks/useDiscountCodes.ts` - Use commerce settings
- `src/components/ui/SearchBar.tsx` - Use commerce settings
- `src/pages/admin/Orders.tsx` - Use status color hooks
- `src/pages/admin/Dashboard.tsx` - Use status color hooks
- `src/hooks/useSiteSettings.ts` - Add status color interfaces

**Files to Delete (if unused):**

- `src/pages/admin/FAQ.tsx`
- `src/pages/admin/SizeGuide.tsx`