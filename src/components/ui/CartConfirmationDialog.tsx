import { useState, useEffect } from "react";
import { Plus, Minus, ShoppingCart, ChevronLeft, ChevronRight, Gift, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/hooks/useProducts";
import { ProductOption } from "@/hooks/useProductOptions";
import { ProductAddon } from "@/hooks/useProductAddons";
import { usePriceFormatter } from "@/hooks/usePriceFormatter";

interface SelectedAddonState {
  productId: string;
  quantity: number;
  options: Record<string, any>;
}

interface CartConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  productOptions: ProductOption[];
  productAddons: ProductAddon[];
  enabledOptionIds: string[];
  onConfirm: (data: {
    quantity: number;
    selectedOptions: Record<string, any>;
    selectedAddons: SelectedAddonState[];
  }) => void;
  isLoading?: boolean;
}

const CartConfirmationDialog = ({
  open,
  onOpenChange,
  product,
  productOptions,
  productAddons,
  enabledOptionIds,
  onConfirm,
  isLoading,
}: CartConfirmationDialogProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>({});
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddonState[]>([]);
  const { formatPrice, currencySymbol } = usePriceFormatter();

  // Filter addons by type
  const addonTypeAddons = productAddons.filter((a) => a.addon_type === "addon");
  const bundleAddons = productAddons.filter((a) => a.addon_type === "bundle");
  
  // Only show step 2 if there are addons or bundles (suggestions are shown on product page)
  const hasAddonsOrBundles = addonTypeAddons.length > 0 || bundleAddons.length > 0;

  // Filter options to only show enabled ones for this product
  // Exclude quantity-related options since we have a dedicated quantity input
  const activeOptions = productOptions.filter(
    (opt) => (enabledOptionIds.includes(opt.id) || opt.is_mandatory) && 
             opt.name.toLowerCase() !== 'quantity'
  );

  const totalSteps = hasAddonsOrBundles ? 2 : 1;

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setCurrentStep(1);
      setQuantity(1);
      setSelectedOptions({});
      // Auto-select bundles by default
      setSelectedAddons(
        bundleAddons.map((b) => ({
          productId: b.addon_product_id,
          quantity: 1,
          options: b.custom_options || {},
        }))
      );
    }
  }, [open, bundleAddons.length]);

  const handleOptionChange = (optionId: string, value: any) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }));
  };

  const toggleAddon = (addonProductId: string, addon: ProductAddon) => {
    setSelectedAddons((prev) => {
      const exists = prev.find((a) => a.productId === addonProductId);
      if (exists) {
        return prev.filter((a) => a.productId !== addonProductId);
      }
      return [...prev, { 
        productId: addonProductId, 
        quantity: 1, 
        options: addon.custom_options || {} 
      }];
    });
  };

  const updateAddonQuantity = (addonProductId: string, qty: number) => {
    if (qty < 1) return;
    setSelectedAddons((prev) =>
      prev.map((a) =>
        a.productId === addonProductId ? { ...a, quantity: qty } : a
      )
    );
  };


  // Calculate product price based on pricing strategy
  const calculateProductPrice = () => {
    let unitPrice = product.price;
    
    if (product.pricing_by_option_id && product.base_unit_value && product.base_unit_value > 0) {
      const selectedValue = selectedOptions[product.pricing_by_option_id];
      if (selectedValue && typeof selectedValue === 'number') {
        // Scale price based on the option value
        unitPrice = (product.price / product.base_unit_value) * selectedValue;
      }
    }
    
    return unitPrice * quantity;
  };

  // Calculate addon price using original product pricing with custom options
  const calculateAddonPrice = (addon: ProductAddon) => {
    const addonProduct = addon.addon_product;
    if (!addonProduct) return 0;
    
    // Check for proportional pricing with custom options (e.g., weight-based)
    if (addonProduct.pricing_by_option_id && addonProduct.base_unit_value && addonProduct.base_unit_value > 0) {
      const customValue = addon.custom_options?.[addonProduct.pricing_by_option_id];
      if (customValue && typeof customValue === 'number') {
        return (addonProduct.price / addonProduct.base_unit_value) * customValue;
      }
    }
    
    return addonProduct.price;
  };

  // Calculate bundle price with discount
  const calculateBundlePrice = (addon: ProductAddon) => {
    const basePrice = addon.addon_product?.price || 0;
    if (addon.bundle_discount_percent) {
      return basePrice * (1 - addon.bundle_discount_percent / 100);
    }
    if (addon.bundle_discount_amount) {
      return Math.max(0, basePrice - addon.bundle_discount_amount);
    }
    return basePrice;
  };

  // Get addon display info
  const getAddonDisplayInfo = (addon: ProductAddon) => {
    const pricingOption = addon.addon_product?.pricing_by_option_id
      ? productOptions.find((opt) => opt.id === addon.addon_product?.pricing_by_option_id)
      : null;
    
    const customValue = pricingOption && addon.custom_options?.[pricingOption.id];
    
    if (customValue) {
      return `${customValue}${pricingOption?.unit || ''}`;
    }
    return null;
  };

  // Calculate total
  const productTotal = calculateProductPrice();
  const addonsTotal = selectedAddons.reduce((sum, selectedAddon) => {
    const addonData = productAddons.find((a) => a.addon_product_id === selectedAddon.productId);
    if (!addonData) return sum;
    
    const price = addonData.addon_type === "bundle" 
      ? calculateBundlePrice(addonData) 
      : calculateAddonPrice(addonData);
    return sum + price * selectedAddon.quantity;
  }, 0);
  
  // Calculate bundle savings
  const bundleSavings = selectedAddons.reduce((sum, selectedAddon) => {
    const addonData = productAddons.find((a) => a.addon_product_id === selectedAddon.productId);
    if (!addonData || addonData.addon_type !== "bundle") return sum;
    
    const originalPrice = addonData.addon_product?.price || 0;
    const discountedPrice = calculateBundlePrice(addonData);
    return sum + (originalPrice - discountedPrice) * selectedAddon.quantity;
  }, 0);
  
  const grandTotal = productTotal + addonsTotal;

  // Get pricing option details for display
  const pricingOption = product.pricing_by_option_id 
    ? productOptions.find(opt => opt.id === product.pricing_by_option_id)
    : null;

  const handleConfirm = () => {
    onConfirm({
      quantity,
      selectedOptions,
      selectedAddons,
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleConfirm();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 1 ? "Product Details" : "Add-ons & Bundles"}
          </DialogTitle>
          {/* Step indicator */}
          {totalSteps > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  currentStep >= 1 ? "bg-primary" : "bg-muted"
                }`}
              />
              <div className="w-8 h-0.5 bg-muted" />
              <div
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  currentStep >= 2 ? "bg-primary" : "bg-muted"
                }`}
              />
            </div>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Product Details */}
          {currentStep === 1 && (
            <>
              {/* Product Info */}
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={product.images?.[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-lg font-bold text-primary">
                    {formatPrice(product.price)}
                    {pricingOption && product.base_unit_value && (
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        for {product.base_unit_value}{pricingOption.unit || ''}
                      </span>
                    )}
                  </p>
                  {pricingOption && product.base_unit_value && product.base_unit_value > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {currencySymbol}{(product.price / product.base_unit_value).toFixed(2)} per {pricingOption.unit || 'unit'}
                    </p>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label>Quantity</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-20 text-center"
                    min={1}
                    max={product.stock_quantity || 999}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setQuantity(Math.min(product.stock_quantity || 999, quantity + 1))
                    }
                    disabled={quantity >= (product.stock_quantity || 999)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Dynamic Options */}
              {activeOptions.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Options</Label>
                  {activeOptions.map((option) => (
                    <div key={option.id} className="space-y-2">
                      <Label className="text-sm">
                        {option.name}
                        {option.is_mandatory && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                        {option.unit && (
                          <span className="text-muted-foreground ml-1">
                            ({option.unit})
                          </span>
                        )}
                      </Label>

                      {option.type === "number" && (
                        <Input
                          type="number"
                          min={option.min_value ?? undefined}
                          max={option.max_value ?? undefined}
                          step={option.step_value ?? 1}
                          value={selectedOptions[option.id] ?? option.min_value ?? ""}
                          onChange={(e) =>
                            handleOptionChange(option.id, Number(e.target.value))
                          }
                          placeholder={`Enter ${option.name.toLowerCase()}`}
                        />
                      )}

                      {option.type === "select" && (
                        <Select
                          value={selectedOptions[option.id] || ""}
                          onValueChange={(value) => handleOptionChange(option.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${option.name.toLowerCase()}`} />
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
                          value={selectedOptions[option.id] || ""}
                          onChange={(e) => handleOptionChange(option.id, e.target.value)}
                          placeholder={`Enter ${option.name.toLowerCase()}`}
                        />
                      )}

                      {option.type === "boolean" && (
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={!!selectedOptions[option.id]}
                            onCheckedChange={(checked) =>
                              handleOptionChange(option.id, checked)
                            }
                          />
                          <span className="text-sm text-muted-foreground">
                            Include {option.name.toLowerCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Summary for Step 1 */}
              <div className="border-t pt-4">
                <div className="flex justify-between font-medium">
                  <span>
                    {product.name} × {quantity}
                    {pricingOption && selectedOptions[product.pricing_by_option_id!] && (
                      <span className="text-muted-foreground font-normal ml-1">
                        ({selectedOptions[product.pricing_by_option_id!]}{pricingOption.unit || ''} each)
                      </span>
                    )}
                  </span>
                  <span className="text-primary">{formatPrice(productTotal)}</span>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Add-ons & Bundles */}
          {currentStep === 2 && (
            <>
              {/* Back button and product reminder */}
              <div className="flex items-center gap-3 pb-2 border-b">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                <div className="flex-1 text-sm text-muted-foreground">
                  {product.name} × {quantity}
                </div>
              </div>

              {/* Bundle Deals Section */}
              {bundleAddons.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-medium text-green-700">
                      Bundle Deals - Save when you buy together!
                    </p>
                  </div>
                  <div className="space-y-2">
                    {bundleAddons.map((addon) => {
                      const isSelected = selectedAddons.some(
                        (a) => a.productId === addon.addon_product_id
                      );
                      const selectedAddon = selectedAddons.find(
                        (a) => a.productId === addon.addon_product_id
                      );
                      const originalPrice = addon.addon_product?.price || 0;
                      const bundlePrice = calculateBundlePrice(addon);
                      const savings = originalPrice - bundlePrice;

                      return (
                        <div
                          key={addon.id}
                          className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                            isSelected ? "border-green-500 bg-green-50 dark:bg-green-950/30" : "bg-muted/30"
                          }`}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleAddon(addon.addon_product_id, addon)}
                          />
                          <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={addon.addon_product?.images?.[0] || "/placeholder.svg"}
                              alt={addon.addon_product?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {addon.addon_product?.name}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs line-through text-muted-foreground">
                                {formatPrice(originalPrice)}
                              </span>
                              <span className="text-sm font-bold text-green-600">
                                {formatPrice(bundlePrice)}
                              </span>
                              {savings > 0 && (
                                <Badge className="bg-green-100 text-green-800 text-[10px]">
                                  Save {formatPrice(savings)}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  updateAddonQuantity(
                                    addon.addon_product_id,
                                    (selectedAddon?.quantity || 1) - 1
                                  )
                                }
                                disabled={(selectedAddon?.quantity || 1) <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-6 text-center text-sm">
                                {selectedAddon?.quantity || 1}
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  updateAddonQuantity(
                                    addon.addon_product_id,
                                    (selectedAddon?.quantity || 1) + 1
                                  )
                                }
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add-ons Section */}
              {addonTypeAddons.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-medium">
                      Optional Add-ons
                    </p>
                  </div>
                  <div className="space-y-2">
                    {addonTypeAddons.map((addon) => {
                      const isSelected = selectedAddons.some(
                        (a) => a.productId === addon.addon_product_id
                      );
                      const selectedAddon = selectedAddons.find(
                        (a) => a.productId === addon.addon_product_id
                      );
                      const price = calculateAddonPrice(addon);
                      const customInfo = getAddonDisplayInfo(addon);

                      return (
                        <div
                          key={addon.id}
                          className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                            isSelected ? "border-primary bg-primary/5" : "bg-muted/30"
                          }`}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleAddon(addon.addon_product_id, addon)}
                          />
                          <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={addon.addon_product?.images?.[0] || "/placeholder.svg"}
                              alt={addon.addon_product?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {addon.addon_product?.name}
                              {customInfo && (
                                <span className="text-muted-foreground font-normal ml-1">
                                  ({customInfo})
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-primary font-medium">
                              +{formatPrice(price)}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  updateAddonQuantity(
                                    addon.addon_product_id,
                                    (selectedAddon?.quantity || 1) - 1
                                  )
                                }
                                disabled={(selectedAddon?.quantity || 1) <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-6 text-center text-sm">
                                {selectedAddon?.quantity || 1}
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  updateAddonQuantity(
                                    addon.addon_product_id,
                                    (selectedAddon?.quantity || 1) + 1
                                  )
                                }
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {product.name} × {quantity}
                  </span>
                  <span>{formatPrice(productTotal)}</span>
                </div>
                {selectedAddons.map((addon) => {
                  const addonProduct = productAddons.find(
                    (a) => a.addon_product_id === addon.productId
                  );
                  if (!addonProduct) return null;
                  
                  const price = addonProduct.addon_type === "bundle"
                    ? calculateBundlePrice(addonProduct)
                    : calculateAddonPrice(addonProduct);
                  const customInfo = getAddonDisplayInfo(addonProduct);
                  
                  return (
                    <div key={addon.productId} className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        + {addonProduct.addon_product?.name}
                        {customInfo && ` (${customInfo})`}
                        {" × "}{addon.quantity}
                      </span>
                      <span>{formatPrice(price * addon.quantity)}</span>
                    </div>
                  );
                })}
                {bundleSavings > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Bundle Savings</span>
                    <span>-{formatPrice(bundleSavings)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={handleNext}
              disabled={isLoading}
            >
              {isLoading ? (
                "Adding..."
              ) : currentStep < totalSteps ? (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartConfirmationDialog;