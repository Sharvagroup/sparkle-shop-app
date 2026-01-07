import { useState, useEffect } from "react";
import { Plus, Minus, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  initialQuantity?: number;
  initialOptions?: Record<string, any>;
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
  initialQuantity = 1,
  initialOptions = {},
}: CartConfirmationDialogProps) => {
  // Start on step 2 (addons) if we have pre-selected options AND there are addons
  const hasAddons = productAddons.length > 0;
  const hasInitialSelections = Object.keys(initialOptions).length > 0;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>(initialOptions);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddonState[]>([]);

  // Filter options to only show enabled ones for this product
  const activeOptions = productOptions.filter(
    (opt) => enabledOptionIds.includes(opt.id) || opt.is_mandatory
  );

  const totalSteps = hasAddons ? 2 : 1;
  
  // If options pre-selected and has addons, skip to step 2
  const startStep = hasInitialSelections && hasAddons ? 2 : 1;

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setCurrentStep(startStep);
      setQuantity(initialQuantity);
      setSelectedOptions(initialOptions);
      setSelectedAddons([]);
    }
  }, [open, startStep, initialQuantity, initialOptions]);

  const handleOptionChange = (optionId: string, value: any) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }));
  };

  const toggleAddon = (addonProductId: string) => {
    setSelectedAddons((prev) => {
      const exists = prev.find((a) => a.productId === addonProductId);
      if (exists) {
        return prev.filter((a) => a.productId !== addonProductId);
      }
      return [...prev, { productId: addonProductId, quantity: 1, options: {} }];
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
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

  // Calculate total
  const productTotal = calculateProductPrice();
  const addonsTotal = selectedAddons.reduce((sum, addon) => {
    const addonProduct = productAddons.find(
      (a) => a.addon_product_id === addon.productId
    );
    const price =
      addonProduct?.price_override ?? addonProduct?.addon_product?.price ?? 0;
    return sum + price * addon.quantity;
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
            {currentStep === 1 ? "Product Details" : "Add-ons (Optional)"}
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
                      ₹{(product.price / product.base_unit_value).toFixed(2)} per {pricingOption.unit || 'unit'}
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

          {/* Step 2: Add-ons */}
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

              {/* Add-ons */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Enhance your order with these suggestions:
                </p>
                <div className="space-y-2">
                  {productAddons.map((addon) => {
                    const isSelected = selectedAddons.some(
                      (a) => a.productId === addon.addon_product_id
                    );
                    const selectedAddon = selectedAddons.find(
                      (a) => a.productId === addon.addon_product_id
                    );
                    const price =
                      addon.price_override ?? addon.addon_product?.price ?? 0;

                    return (
                      <div
                        key={addon.id}
                        className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                          isSelected ? "border-primary bg-primary/5" : "bg-muted/30"
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleAddon(addon.addon_product_id)}
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
                  const price =
                    addonProduct?.price_override ??
                    addonProduct?.addon_product?.price ??
                    0;
                  return (
                    <div key={addon.productId} className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        + {addonProduct?.addon_product?.name} × {addon.quantity}
                      </span>
                      <span>{formatPrice(price * addon.quantity)}</span>
                    </div>
                  );
                })}
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
