import { useState, useEffect, useRef } from "react";
import { Check, Link, Folder, Package, Tag, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCategories } from "@/hooks/useCategories";
import { useCollections } from "@/hooks/useCollections";
import { useProducts } from "@/hooks/useProducts";

interface LinkSuggestion {
  label: string;
  value: string;
  group: string;
}

interface LinkUrlAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const staticPages: LinkSuggestion[] = [
  { label: "Home", value: "/", group: "Pages" },
  { label: "All Products", value: "/products", group: "Pages" },
  { label: "About Us", value: "/about", group: "Pages" },
  { label: "Contact", value: "/contact", group: "Pages" },
  { label: "Wishlist", value: "/wishlist", group: "Pages" },
  { label: "Cart", value: "/cart", group: "Pages" },
];

const specialFilters: LinkSuggestion[] = [
  { label: "New Arrivals", value: "/products?new=true", group: "Special Filters" },
  { label: "Best Sellers", value: "/products?bestseller=true", group: "Special Filters" },
  { label: "Celebrity Specials", value: "/products?celebrity=true", group: "Special Filters" },
];

export function LinkUrlAutocomplete({
  value,
  onChange,
  placeholder = "Select or type a URL...",
}: LinkUrlAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: categories = [] } = useCategories();
  const { data: collections = [] } = useCollections();
  const { data: products = [] } = useProducts();

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Build suggestions from dynamic data
  const categorySuggestions: LinkSuggestion[] = categories.map((cat) => ({
    label: cat.name,
    value: `/products?category=${cat.slug}`,
    group: "Categories",
  }));

  const collectionSuggestions: LinkSuggestion[] = collections.map((col) => ({
    label: col.name,
    value: `/products?collection=${col.slug}`,
    group: "Collections",
  }));

  const productSuggestions: LinkSuggestion[] = products.slice(0, 20).map((prod) => ({
    label: prod.name,
    value: `/product/${prod.slug}`,
    group: "Products",
  }));

  const allSuggestions = [
    ...staticPages,
    ...categorySuggestions,
    ...collectionSuggestions,
    ...specialFilters,
    ...productSuggestions,
  ];

  // Filter suggestions based on input
  const filteredSuggestions = inputValue
    ? allSuggestions.filter(
        (s) =>
          s.label.toLowerCase().includes(inputValue.toLowerCase()) ||
          s.value.toLowerCase().includes(inputValue.toLowerCase())
      )
    : allSuggestions;

  // Group suggestions
  const groupedSuggestions = filteredSuggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.group]) {
      acc[suggestion.group] = [];
    }
    acc[suggestion.group].push(suggestion);
    return acc;
  }, {} as Record<string, LinkSuggestion[]>);

  const handleSelect = (selectedValue: string) => {
    setInputValue(selectedValue);
    onChange(selectedValue);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    if (!open) setOpen(true);
  };

  const getGroupIcon = (group: string) => {
    switch (group) {
      case "Pages":
        return <Folder className="h-3 w-3" />;
      case "Categories":
        return <Tag className="h-3 w-3" />;
      case "Collections":
        return <Sparkles className="h-3 w-3" />;
      case "Products":
        return <Package className="h-3 w-3" />;
      case "Special Filters":
        return <Sparkles className="h-3 w-3" />;
      default:
        return <Link className="h-3 w-3" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="pl-9"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command shouldFilter={false}>
          <CommandList className="max-h-[300px]">
            {Object.keys(groupedSuggestions).length === 0 ? (
              <CommandEmpty>
                {inputValue && inputValue.startsWith("http") ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    External URL: <span className="text-foreground">{inputValue}</span>
                  </div>
                ) : (
                  "No suggestions found. Type a custom URL."
                )}
              </CommandEmpty>
            ) : (
              Object.entries(groupedSuggestions).map(([group, suggestions]) => (
                <CommandGroup
                  key={group}
                  heading={
                    <span className="flex items-center gap-2">
                      {getGroupIcon(group)}
                      {group}
                    </span>
                  }
                >
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion.value}
                      value={suggestion.value}
                      onSelect={() => handleSelect(suggestion.value)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex flex-col">
                        <span>{suggestion.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {suggestion.value}
                        </span>
                      </div>
                      {value === suggestion.value && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
