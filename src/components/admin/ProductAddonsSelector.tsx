import { useState } from "react";
import { X, Plus, GripVertical, Package, Lightbulb, Gift, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Product } from "@/hooks/useProducts";
import { ProductOption } from "@/hooks/useProductOptions";

export interface SelectedAddon {
  addon_product_id: string;
  addon_type: "addon" | "suggestion" | "bundle";
  price_override: number | null;
  custom_options: Record<string, any>;
  bundle_discount_percent: number | null;
  bundle_discount_amount: number | null;
  display_order: number;
}

interface ProductAddonsSelectorProps {
  products: Product[];
  productOptions: ProductOption[];
  currentProductId?: string;
  selectedAddons: SelectedAddon[];
  onChange: (addons: SelectedAddon[]) => void;
}

const ADDON_TYPE_CONFIG = {
  addon: {
    label: "Add-on",
    icon: Package,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    description: "Offered with custom options & independent pricing in cart dialog",
  },
  suggestion: {
    label: "Suggestion",
    icon: Lightbulb,
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    description: "Displayed in 'Customers Also Viewed' section",
  },
  bundle: {
    label: "Bundle",
    icon: Gift,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    description: "Combo deal with discount shown in cart dialog",
  },
};

const ProductAddonsSelector = ({
  products,
  productOptions,
  currentProductId,
  selectedAddons,
  onChange,
}: ProductAddonsSelectorProps) => {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [expandedAddons, setExpandedAddons] = useState<Set<string>>(new Set());

  // Filter out current product and already selected products
  const availableProducts = products.filter(
    (p) =>
      p.id !== currentProductId &&
      !selectedAddons.some((a) => a.addon_product_id === p.id)
  );

  const handleAddAddon = () => {
    if (!selectedProductId) return;

    const newAddon: SelectedAddon = {
      addon_product_id: selectedProductId,
      addon_type: "suggestion",
      price_override: null,
      custom_options: {},
      bundle_discount_percent: null,
      bundle_discount_amount: null,
      display_order: selectedAddons.length,
    };

    onChange([...selectedAddons, newAddon]);
    setSelectedProductId("");
    // Auto-expand new addon
    setExpandedAddons(prev => new Set(prev).add(selectedProductId));
  };

  const handleRemoveAddon = (productId: string) => {
    onChange(selectedAddons.filter((a) => a.addon_product_id !== productId));
    setExpandedAddons(prev => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
  };

  const handleUpdateAddon = (productId: string, updates: Partial<SelectedAddon>) => {
    onChange(
      selectedAddons.map((a) =>
        a.addon_product_id === productId ? { ...a, ...updates } : a
      )
    );
  };

  const toggleExpanded = (productId: string) => {
    setExpandedAddons(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const getProductById = (id: string) => products.find((p) => p.id === id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get enabled options for a product
  const getProductOptions = (product: Product) => {
    if (!product.enabled_options || product.enabled_options.length === 0) return [];
    return productOptions.filter(opt => product.enabled_options?.includes(opt.id));
  };

  // Calculate addon price preview
  const calculateAddonPrice = (addon: SelectedAddon, product: Product) => {
    if (addon.price_override !== null) {
      return addon.price_override;
    }
    
    // If custom options with proportional pricing
    if (product.pricing_by_option_id && product.base_unit_value && product.base_unit_value > 0) {
      const customValue = addon.custom_options[product.pricing_by_option_id];
      if (customValue && typeof customValue === 'number') {
        return (product.price / product.base_unit_value) * customValue;
      }
    }
    
    return product.price;
  };

  // Calculate bundle price with discount
  const calculateBundlePrice = (addon: SelectedAddon, product: Product) => {
    const basePrice = product.price;
    if (addon.bundle_discount_percent) {
      return basePrice * (1 - addon.bundle_discount_percent / 100);
    }
    if (addon.bundle_discount_amount) {
      return Math.max(0, basePrice - addon.bundle_discount_amount);
    }
    return basePrice;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Product Relationships</CardTitle>
        <p className="text-sm text-muted-foreground">
          Add complementary products as add-ons, suggestions, or bundles.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Product */}
        <div className="flex gap-2">
          <Select value={selectedProductId} onValueChange={setSelectedProductId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a product to add" />
            </SelectTrigger>
            <SelectContent>
              {availableProducts.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} - {formatPrice(product.price)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddAddon}
            disabled={!selectedProductId}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Type Legend */}
        <div className="flex flex-wrap gap-2 text-xs">
          {Object.entries(ADDON_TYPE_CONFIG).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <div key={key} className="flex items-center gap-1 text-muted-foreground">
                <Icon className="w-3 h-3" />
                <span className="font-medium">{config.label}:</span>
                <span>{config.description}</span>
              </div>
            );
          })}
        </div>

        {/* Selected Products List */}
        {selectedAddons.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Configured Products</Label>
            {selectedAddons.map((addon) => {
              const product = getProductById(addon.addon_product_id);
              if (!product) return null;

              const config = ADDON_TYPE_CONFIG[addon.addon_type];
              const Icon = config.icon;
              const isExpanded = expandedAddons.has(addon.addon_product_id);
              const enabledOptions = getProductOptions(product);
              const pricingOption = product.pricing_by_option_id 
                ? productOptions.find(opt => opt.id === product.pricing_by_option_id)
                : null;

              return (
                <div
                  key={addon.addon_product_id}
                  className="border rounded-lg bg-muted/30 overflow-hidden"
                >
                  {/* Header Row */}
                  <div className="flex items-center gap-3 p-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab flex-shrink-0" />
                    
                    {/* Product Image */}
                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={product.images?.[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Original: {formatPrice(product.price)}</span>
                        {product.sku && <span>• SKU: {product.sku}</span>}
                      </div>
                    </div>

                    {/* Type Badge */}
                    <Badge className={`${config.color} border-0 gap-1`}>
                      <Icon className="w-3 h-3" />
                      {config.label}
                    </Badge>

                    {/* Type Selector */}
                    <Select
                      value={addon.addon_type}
                      onValueChange={(value: "addon" | "suggestion" | "bundle") =>
                        handleUpdateAddon(addon.addon_product_id, { 
                          addon_type: value,
                          // Reset type-specific fields when changing type
                          price_override: value === "addon" ? addon.price_override : null,
                          custom_options: value === "addon" ? addon.custom_options : {},
                          bundle_discount_percent: value === "bundle" ? addon.bundle_discount_percent : null,
                          bundle_discount_amount: value === "bundle" ? addon.bundle_discount_amount : null,
                        })
                      }
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="addon">Add-on</SelectItem>
                        <SelectItem value="suggestion">Suggestion</SelectItem>
                        <SelectItem value="bundle">Bundle</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Expand/Collapse */}
                    {(addon.addon_type === "addon" || addon.addon_type === "bundle") && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleExpanded(addon.addon_product_id)}
                        className="flex-shrink-0"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    )}

                    {/* Remove Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAddon(addon.addon_product_id)}
                      className="flex-shrink-0"
                    >
                      <X className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>

                  {/* Expanded Config Section */}
                  <Collapsible open={isExpanded && (addon.addon_type === "addon" || addon.addon_type === "bundle")}>
                    <CollapsibleContent>
                      <div className="border-t bg-background p-4 space-y-4">
                        {/* Addon Type Config */}
                        {addon.addon_type === "addon" && (
                          <>
                            <p className="text-xs text-muted-foreground">
                              Configure custom options for this add-on. The customer will see these pre-configured values.
                            </p>
                            
                            {/* Custom Options */}
                            {enabledOptions.length > 0 ? (
                              <div className="grid grid-cols-2 gap-3">
                                {enabledOptions.map((option) => (
                                  <div key={option.id} className="space-y-1">
                                    <Label className="text-xs">
                                      {option.name}
                                      {option.unit && <span className="text-muted-foreground ml-1">({option.unit})</span>}
                                    </Label>
                                    
                                    {option.type === "number" && (
                                      <div className="flex gap-2 items-center">
                                        <Input
                                          type="number"
                                          min={option.min_value ?? undefined}
                                          max={option.max_value ?? undefined}
                                          step={option.step_value ?? 1}
                                          value={addon.custom_options[option.id] ?? ""}
                                          onChange={(e) =>
                                            handleUpdateAddon(addon.addon_product_id, {
                                              custom_options: {
                                                ...addon.custom_options,
                                                [option.id]: e.target.value ? Number(e.target.value) : undefined,
                                              },
                                            })
                                          }
                                          placeholder={`e.g., ${option.min_value || 50}`}
                                          className="h-8"
                                        />
                                        {pricingOption?.id === option.id && product.base_unit_value && (
                                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            (Original: {product.base_unit_value}{option.unit})
                                          </span>
                                        )}
                                      </div>
                                    )}
                                    
                                    {option.type === "select" && (
                                      <Select
                                        value={addon.custom_options[option.id] || ""}
                                        onValueChange={(value) =>
                                          handleUpdateAddon(addon.addon_product_id, {
                                            custom_options: {
                                              ...addon.custom_options,
                                              [option.id]: value,
                                            },
                                          })
                                        }
                                      >
                                        <SelectTrigger className="h-8">
                                          <SelectValue placeholder={`Select ${option.name}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {option.select_options?.map((opt) => (
                                            <SelectItem key={opt} value={opt}>
                                              {opt}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    )}

                                    {option.type === "text" && (
                                      <Input
                                        value={addon.custom_options[option.id] || ""}
                                        onChange={(e) =>
                                          handleUpdateAddon(addon.addon_product_id, {
                                            custom_options: {
                                              ...addon.custom_options,
                                              [option.id]: e.target.value,
                                            },
                                          })
                                        }
                                        placeholder={`Enter ${option.name}`}
                                        className="h-8"
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground italic">
                                This product has no configurable options.
                              </p>
                            )}

                            {/* Price Override */}
                            <div className="space-y-1 pt-2 border-t">
                              <Label className="text-xs">Custom Price (₹)</Label>
                              <div className="flex items-center gap-3">
                                <Input
                                  type="number"
                                  value={addon.price_override ?? ""}
                                  onChange={(e) =>
                                    handleUpdateAddon(addon.addon_product_id, {
                                      price_override: e.target.value ? Number(e.target.value) : null,
                                    })
                                  }
                                  placeholder="Leave empty for proportional pricing"
                                  className="h-8 w-40"
                                />
                                <span className="text-xs text-muted-foreground">
                                  Preview: <span className="font-medium text-foreground">{formatPrice(calculateAddonPrice(addon, product))}</span>
                                </span>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Bundle Type Config */}
                        {addon.addon_type === "bundle" && (
                          <>
                            <p className="text-xs text-muted-foreground">
                              Set a discount for this bundle deal. Customers see the savings when adding to cart.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <Label className="text-xs">Discount Percentage (%)</Label>
                                <Input
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={addon.bundle_discount_percent ?? ""}
                                  onChange={(e) =>
                                    handleUpdateAddon(addon.addon_product_id, {
                                      bundle_discount_percent: e.target.value ? Number(e.target.value) : null,
                                      bundle_discount_amount: null, // Clear the other field
                                    })
                                  }
                                  placeholder="e.g., 10"
                                  className="h-8"
                                  disabled={addon.bundle_discount_amount !== null}
                                />
                              </div>
                              
                              <div className="space-y-1">
                                <Label className="text-xs">OR Fixed Discount (₹)</Label>
                                <Input
                                  type="number"
                                  min={0}
                                  value={addon.bundle_discount_amount ?? ""}
                                  onChange={(e) =>
                                    handleUpdateAddon(addon.addon_product_id, {
                                      bundle_discount_amount: e.target.value ? Number(e.target.value) : null,
                                      bundle_discount_percent: null, // Clear the other field
                                    })
                                  }
                                  placeholder="e.g., 50"
                                  className="h-8"
                                  disabled={addon.bundle_discount_percent !== null}
                                />
                              </div>
                            </div>

                            {/* Bundle Price Preview */}
                            <div className="flex items-center gap-3 pt-2 border-t">
                              <span className="text-xs text-muted-foreground">Bundle Price:</span>
                              <span className="text-sm line-through text-muted-foreground">
                                {formatPrice(product.price)}
                              </span>
                              <span className="text-sm font-bold text-green-600">
                                {formatPrice(calculateBundlePrice(addon, product))}
                              </span>
                              {(addon.bundle_discount_percent || addon.bundle_discount_amount) && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  Save {addon.bundle_discount_percent 
                                    ? `${addon.bundle_discount_percent}%` 
                                    : formatPrice(addon.bundle_discount_amount!)}
                                </Badge>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              );
            })}
          </div>
        )}

        {selectedAddons.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg border-dashed">
            No products linked. Add products as add-ons, suggestions, or bundles.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductAddonsSelector;