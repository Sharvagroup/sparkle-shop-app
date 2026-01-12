# Migration Instructions

## Fix: show_in_main_listing column

The `show_in_main_listing` column needs to be added to the `categories` table. 

### Option 1: Via Supabase Dashboard SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the following SQL:

```sql
-- Add show_in_main_listing column to categories
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS show_in_main_listing BOOLEAN DEFAULT true;

-- Add comment
COMMENT ON COLUMN public.categories.show_in_main_listing IS 'If false, products in this category will not appear in main product listings (but can be used as addons)';
```

### Option 2: Via Supabase CLI

If you have Supabase CLI installed:

```bash
supabase db push
```

This will apply all pending migrations including the one in `supabase/migrations/20260112000000_add_show_in_main_listing_to_categories.sql`
