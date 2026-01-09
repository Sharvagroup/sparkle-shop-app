import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Clock, Package, FolderTree, Layers, Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  useSearchSettings,
  useRecentSearches,
  useSearchSuggestions,
  highlightMatch,
  defaultSearchSettings,
  type SearchSuggestion,
} from "@/hooks/useSearch";
import { useSiteSetting } from "@/hooks/useSiteSettings";

interface CommerceSettings {
  currencySymbol?: string;
}

interface SearchBarProps {
  className?: string;
}

const SearchBar = ({ className }: SearchBarProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: searchSettings } = useSearchSettings();
  const { data: commerceSettings } = useSiteSetting<CommerceSettings>("commerce");
  const settings = searchSettings || defaultSearchSettings;
  const currencySymbol = commerceSettings?.currencySymbol || "₹";

  const { recentSearches, addSearch, removeSearch, clearSearches } = useRecentSearches(
    settings.recentSearchLimit
  );

  const { data: suggestions = [], isLoading } = useSearchSuggestions(debouncedQuery, settings);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      const trimmed = searchQuery.trim();
      if (!trimmed) return;

      addSearch(trimmed);
      setQuery("");
      setOpen(false);
      navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    },
    [addSearch, navigate]
  );

  const handleSelectProduct = useCallback(
    (slug: string) => {
      setQuery("");
      setOpen(false);
      navigate(`/products/${slug}`);
    },
    [navigate]
  );

  const handleSelectCategory = useCallback(
    (slug: string) => {
      setQuery("");
      setOpen(false);
      navigate(`/products?category=${slug}`);
    },
    [navigate]
  );

  const handleSelectCollection = useCallback(
    (slug: string) => {
      setQuery("");
      setOpen(false);
      navigate(`/products?collection=${slug}`);
    },
    [navigate]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  // Don't show if search is disabled
  if (!settings.enabled) return null;

  // Group suggestions by type
  const productSuggestions = suggestions.filter((s) => s.type === "product");
  const categorySuggestions = suggestions.filter((s) => s.type === "category");
  const collectionSuggestions = suggestions.filter((s) => s.type === "collection");

  const hasResults = suggestions.length > 0;
  const showRecentSearches =
    settings.showRecentSearches && recentSearches.length > 0 && !debouncedQuery;

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <form onSubmit={handleSubmit} className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!open) setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder={settings.placeholder}
              className="w-full bg-muted border border-border rounded-full py-2 px-4 pl-4 pr-16 focus:outline-none focus:border-primary text-sm transition-colors"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
              <button
                type="submit"
                className="text-muted-foreground hover:text-primary transition-colors ml-1"
              >
                <Search size={18} />
              </button>
            </div>
          </form>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-popover border border-border shadow-lg"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command shouldFilter={false}>
            <CommandList className="max-h-[400px]">
              {/* Loading state */}
              {isLoading && debouncedQuery && (
                <div className="flex items-center justify-center py-6 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Searching...
                </div>
              )}

              {/* Recent Searches */}
              {showRecentSearches && (
                <>
                  <CommandGroup
                    heading={
                      <div className="flex items-center justify-between">
                        <span>Recent Searches</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto py-0 px-1 text-xs text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearSearches();
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                    }
                  >
                    {recentSearches.map((search) => (
                      <CommandItem
                        key={search}
                        value={search}
                        onSelect={() => handleSearch(search)}
                        className="flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{search}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSearch(search);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}

              {/* No results */}
              {!isLoading && debouncedQuery && !hasResults && (
                <CommandEmpty className="py-6 text-center text-sm">
                  No results found for "{debouncedQuery}"
                </CommandEmpty>
              )}

              {/* Product Suggestions */}
              {productSuggestions.length > 0 && (
                <>
                  <CommandGroup heading="Products">
                    {productSuggestions.map((product) => (
                      <CommandItem
                        key={product.id}
                        value={product.name}
                        onSelect={() => handleSelectProduct(product.slug)}
                        className="flex items-center gap-3 cursor-pointer py-2"
                      >
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded border border-border"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {settings.highlightMatches
                              ? highlightMatch(product.name, debouncedQuery)
                              : product.name}
                          </p>
                          {product.price && (
                            <p className="text-xs text-muted-foreground">
                              {currencySymbol}
                              {product.price.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {(categorySuggestions.length > 0 || collectionSuggestions.length > 0) && (
                    <CommandSeparator />
                  )}
                </>
              )}

              {/* Category Suggestions */}
              {categorySuggestions.length > 0 && (
                <>
                  <CommandGroup heading="Categories">
                    {categorySuggestions.map((category) => (
                      <CommandItem
                        key={category.id}
                        value={category.name}
                        onSelect={() => handleSelectCategory(category.slug)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <FolderTree className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {settings.highlightMatches
                            ? highlightMatch(category.name, debouncedQuery)
                            : category.name}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {collectionSuggestions.length > 0 && <CommandSeparator />}
                </>
              )}

              {/* Collection Suggestions */}
              {collectionSuggestions.length > 0 && (
                <CommandGroup heading="Collections">
                  {collectionSuggestions.map((collection) => (
                    <CommandItem
                      key={collection.id}
                      value={collection.name}
                      onSelect={() => handleSelectCollection(collection.slug)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {settings.highlightMatches
                          ? highlightMatch(collection.name, debouncedQuery)
                          : collection.name}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* Search all prompt */}
              {debouncedQuery && hasResults && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => handleSearch(debouncedQuery)}
                      className="justify-center cursor-pointer text-primary"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search all products for "{debouncedQuery}"
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchBar;
